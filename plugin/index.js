const isLastIdx = (idx, arr) => arr.length - 1 === idx;
const fix = f => (...args) => f(fix(f), ...args);

////////////////////////////////////////////////////////////////////////////////////////////////////

const plugin = function({ types: t }) {
    return {
        visitor: {
            DoExpression(path) {
                const _node = path.node;
                const monadObject = _node.monad;
                const statements = _node.body.body;

                ////////////////////////////////////////////////////////////////////////////////////////////////////
                // TODO: GetRid of custom walker. Use traverse isntead
                const process = f => fix((process, node) => {
                    if (!(node instanceof _node.constructor))
                        return node;

                    const processedNode = f(node);
                    if (processedNode === null)
                        return node;

                    return Object.keys(processedNode).reduce((prev, key) => {
                        const value = processedNode[key];
                        if (Array.isArray(value))
                            return Object.assign({}, prev, { [key]: value.map(item => process(item)) });

                        return Object.assign({}, prev, { [key]: process(value) });
                    }, {});
                });

                ////////////////////////////////////////////////////////////////////////////////////////////////////
                const createReturn = argument =>
                    t.callExpression(
                        t.MemberExpression(monadObject, t.Identifier("mreturn"), false),
                        [ argument ]
                    );

                const nestWrapper = (bindIdentifier, expr, prev) => body => {
                    return prev(
                        t.callExpression(
                            t.MemberExpression(monadObject, t.Identifier("mbind"), false),
                            [
                                expr,
                                t.ArrowFunctionExpression(bindIdentifier ? [bindIdentifier] : [], body, false)
                            ]
                        )
                    );
                };

                const transform = process(node => {
                    if (node.type === "DoExpression")
                        return null;

                    if (node.type === "ReturnExpression") {
                        const { argument } = node;
                        return createReturn(argument);
                    }
                    return node;
                });
                ////////////////////////////////////////////////////////////////////////////////////////////////////

                const newNode = statements
                    .filter(({ type }) => type !== "EmptyStatement")
                    .reduce((prev, statement, idx, statements) => {
                        if (isLastIdx(idx, statements))
                            if (statement.type === "ExpressionStatement")
                                return prev(transform(statement.expression));

                        if (statement.type === "ExpressionStatement")
                            return nestWrapper(null, transform(statement.expression), prev);


                        if (statement.type === "MBindStatement")
                            return nestWrapper(statement.left, transform(statement.right), prev);

                        const { argument } = statement;
                        return nestWrapper(null, transform(argument), prev);
                    }, a => a);


                path.replaceWith(newNode);

            }
        }
    };
};

module.exports = plugin;
////////////////////////////////////////////////////////////////////////////////////////////////////
