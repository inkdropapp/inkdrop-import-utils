import test from 'ava'
import path from 'path'
import fs from 'fs'
import * as utils from './index'

test('extract images', async (t) => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-yamlfrontmatter.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const images = utils.extractImages(md)
  t.is(images instanceof Array, true)
  t.is(images.length, 2)
  t.is(images[0].type, 'image')
  t.is(images[0].alt, 'alt')
  t.is(images[0].url, './images/foo.png')
  t.is(images[1].type, 'image')
  t.is(images[1].alt, 'alt2')
  t.is(images[1].url, './images/bar.jpg')
})

test('extract title and body with frontmatter from file', (t) => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-yamlfrontmatter.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  t.is(typeof meta, 'object')
  t.is(meta.title, 'This is a Markdown note')
  t.is(typeof meta.body, 'string')
})

test('extract title and body without frontmatter from file', (t) => {
  const fn = path.resolve(__dirname, 'fixtures', 'test.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  t.is(typeof meta, 'object')
  t.is(meta.title, 'Write your first JavaScript program!')
  t.is(typeof meta.body, 'string')
})

test('extract title and body with hashtags', (t) => {
  const fn = path.resolve(__dirname, 'fixtures', 'test-2.md')
  const md = fs.readFileSync(fn, 'utf-8')
  const meta = utils.getTitleAndBodyFromMarkdown(fn, md)
  t.is(typeof meta, 'object')
  t.is(meta.title, 'test-2')
  t.is(typeof meta.body, 'string')
})
