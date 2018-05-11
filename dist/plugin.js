const isLastIdx = (idx, arr) => arr.length - 1 === idx;
const fix = f => (...args) => f(fix(f), ...args);

////////////////////////////////////////////////////////////////////////////////////////////////////

const plugin = function({ types: t }) {
    return {
        visitor: {
            DoExpression(path) {
                const _node = path.node;
                const lift = _node.monad;
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

                const nestWrapperBind = (bindIdentifier, expr, prev) => body => {
                    return prev(
                        t.callExpression(
                            lift,
                            [
                                expr,
                                t.ArrowFunctionExpression(bindIdentifier ? [bindIdentifier] : [], body, false)
                            ]
                        )
                    );
                };

                const nestWrapperAsgn = (identifier, expr, prev) => body => {
                    return prev(
                        t.callExpression(
                            t.ArrowFunctionExpression([],
                                t.blockStatement([
                                    t.variableDeclaration("const", [t.variableDeclarator(identifier, expr)]),
                                    t.returnStatement(body)
                                ]), false),
                        [])
                    );
                };

                const transform = process(node => node.type === "DoExpression" ? null : node);

                ////////////////////////////////////////////////////////////////////////////////////////////////////

                const newNode = statements
                    .filter(({ type }) => type !== "EmptyStatement")
                    .reduce((prev, statement, idx, statements) => {
                        if (isLastIdx(idx, statements))
                            if (statement.type === "ExpressionStatement")
                                return prev(transform(statement.expression));

                        if (statement.type === "ExpressionStatement")
                            return nestWrapperBind(null, transform(statement.expression), prev);

                        if (statement.type === "MBindStatement")
                            return nestWrapperBind(statement.left, transform(statement.right), prev);

                        if (statement.type === "MAssignmentStatement")
                            return nestWrapperAsgn(statement.left, transform(statement.right), prev);

                        const { argument } = statement;
                        return nestWrapperBind(null, transform(argument), prev);
                    }, a => a);


                path.replaceWith(newNode);

            }
        }
    };
};

module.exports = plugin;
////////////////////////////////////////////////////////////////////////////////////////////////////
