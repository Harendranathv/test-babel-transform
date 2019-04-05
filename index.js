const { parse } = require('@babel/parser')
const generate = require('@babel/generator')
const traverse = require('@babel/traverse')
const { objectExpression } = require('@babel/types')
const { inspect } = require('util')

// console.log(traverse)

const currentConfig = `
module.exports = {
  plugins: [
    "gatsby-plugin-sharp",
    // Add comment here
  ],
  blah: [

  ]
}
` // Assume that plugins pass in a variable declaration

// TODO: Comments
// TODO: Functions
const pluginOptions = `{
  resolve: 'gatsby-plugin-feed',
  options: {
    feeds: [
      {
        serialise: hello => {
          return hello + 1
        },
      },
    ],
  },
}`

const pluginConfigWithVar = `const pluginConfig = ${pluginOptions}`

const currentConfigAST = parse(currentConfig, { strictMode: true })

traverse.default(currentConfigAST, {
  ArrayExpression(path) {
    if (path.parentPath.node.key.name === 'plugins') {
      const pluginAst = parse(pluginConfigWithVar)
      path.node.elements.push(
        objectExpression(
          pluginAst.program.body[0].declarations[0].init.properties
        )
      )
    }
  },
})

console.log(generate.default(currentConfigAST).code)
