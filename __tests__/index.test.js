const path = require('path')
const fs = require('fs')
const utils = require('../index')

test('extract images', async () => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-yamlfrontmatter.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const images = utils.extractImages(md)
  expect(images instanceof Array).toBe(true)
  expect(images.length).toBe(2)
  expect(images[0].type).toBe('image')
  expect(images[0].alt).toBe('alt')
  expect(images[0].url).toBe('./images/foo.png')
  expect(images[1].type).toBe('image')
  expect(images[1].alt).toBe('alt2')
  expect(images[1].url).toBe('./images/bar.jpg')
})

test('extract title and body with frontmatter from file', () => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-yamlfrontmatter.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  expect(typeof meta).toBe('object')
  expect(meta.title).toBe('This is a Markdown note')
  expect(typeof meta.body).toBe('string')
})

test('extract title and body without frontmatter from file', () => {
  const fn = path.resolve(__dirname, 'fixtures', 'test.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  expect(typeof meta).toBe('object')
  expect(meta.title).toBe('Write your first JavaScript program!')
  expect(typeof meta.body).toBe('string')
})

test('extract title and body with hashtags', () => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-2.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  expect(typeof meta).toBe('object')
  expect(meta.title).toBe('test-2')
  expect(typeof meta.body).toBe('string')
})

test('extract title longer than 128', () => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-3.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  expect(typeof meta).toBe('object')
  expect(meta.title).toBe(
    'Long long long long long long long long long long long long long long long long long long long long long long long long long ...'
  )
  expect(typeof meta.body).toBe('string')
})
