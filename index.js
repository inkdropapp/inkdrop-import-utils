const fs = require('fs')
const path = require('path')
const extractImages = require('./remark-extract-images')

/**
 * Extract title and body from the given path and data of the Markdown file
 *
 * @param {string} fn - The filename
 * @param {string} md - The Markdown content
 * @returns {title: string, body: string} Returns an object that has the title and body data
 */
function getTitleAndBodyFromMarkdown(fn, md) {
  const yaml = require('js-yaml')
  const lines = md.split('\n')
  let title = ''
  let yamlBlockStart = -1
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i]
    if (line === '---') {
      if (i === 0) {
        yamlBlockStart = i
      } else if (yamlBlockStart >= 0) {
        try {
          const frontmatter = yaml.safeLoad(
            lines.slice(yamlBlockStart + 1, i).join('\n')
          )
          title = frontmatter.title || frontmatter.subject || ''
        } catch (e) {
          // do nothing for invalid frontmatters
        }
        yamlBlockStart = -1
      }
      continue
    }
    if (yamlBlockStart < 0 && line.match(/^#+/)) {
      title = Cutter.truncateToBinarySize(line.replace(/^#+\s*/, ''), 128)
      lines.splice(i, 1)
      break
    }
  }
  if (!title) title = path.basename(fn, path.extname(fn))
  return { title: title, body: lines.join('\n') }
}

/**
 * Get meta information from file
 *
 * @param {string} fn - The filename
 * @returns {tags: [], createdAt: number, updatedAt: number} Returns an object with `tags`, `createdAt` and `updatedAt`
 */
function getMetaFromMarkdown(fn) {
  const stats = fs.statSync(fn)
  const meta = {
    tags: [],
    createdAt: stats.mtimeMs,
    updatedAt: stats.birthtimeMs
  }
  return meta
}

/**
 * Import images from given Markdown data with the specified base path
 *
 * @param {string} md - The Markdown content
 * @param {string} basePath - The base path to the Markdown file
 * @returns {string} The modified Markdown with attachment images
 */
async function importImages(md, basePath) {
  const { nativeImage } = require('electron')
  const { models } = require('inkdrop')
  const { File: IDFile } = models
  const images = extractImages(md)
  for (const image of images) {
    const imagePath = path.resolve(basePath, image.url)
    if (fs.existsSync(imagePath)) {
      try {
        const imageData = nativeImage.createFromPath(imagePath)
        const file = await IDFile.createFromNativeImage(imageData)
        const imageRegex = new RegExp(
          escapeRegExp(`![${image.alt}](${image.url})`),
          'g'
        )
        md = md.replace(imageRegex, `![${image.alt}](inkdrop://${file._id})`)
      } catch (e) {
        inkdrop.notifications.addError('Failed to import an image', {
          detail: `${imagePath}: ${e.message}`,
          dismissable: true
        })
      }
    }
  }
  return md
}

module.exports = {
  getTitleAndBodyFromMarkdown,
  getMetaFromMarkdown,
  importImages,
  extractImages
}
