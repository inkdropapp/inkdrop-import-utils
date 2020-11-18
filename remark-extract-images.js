const visit = require('unist-util-visit')

module.exports = extractImages

function remarkExtractImages() {
  this.Compiler = compile

  function compile(node) {
    const images = []

    function onImage(node) {
      images.push(node)
    }

    visit(node, 'image', onImage)
    return images
  }
}

function extractImages(md) {
  const remark = require('unified')()
    .use(require('remark-parse'))
    .use(remarkExtractImages)
  const { result } = remark.processSync(md)
  return result
}
