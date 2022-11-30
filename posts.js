'use strict';

const { promises: fs } = require('fs');
const { marked } = require('marked');
const matter = require('gray-matter');

const path = require('path');

const loadingLazy = {
  name: 'image',
  level: 'inline',
  renderer(token) {
    const html = this.parser.renderer.image(
      token.href,
      token.title,
      token.text
    );
    return html.replace(/^<img /, '<img loading="lazy" ');
  },
};

marked.setOptions({
  renderer: marked.Renderer(),

  highlight(code, lang) {
    const hljs = require('highlight.js').default;
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';

    return hljs.highlight(code, { language }).value;
  },

  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
});

marked.use({
  extensions: [loadingLazy],
});

const getAllPostsName = async (postsDir) => {
  const fileNames = await fs.readdir(postsDir);

  return fileNames;
};

const getAllPosts = async (postsDir) => {
  const fileNames = await getAllPostsName(postsDir);

  const map = fileNames.map(async (fileName) => {
    const markdownWithFrontmatter = await fs.readFile(
      path.join(postsDir, fileName)
    );
    const { data: frontMatter, content } = matter(markdownWithFrontmatter);
    const html = marked(content);

    return {
      frontMatter,
      html,
      slug: fileName.split('.')[0],
    };
  });

  return Promise.all(map);
};

module.exports = getAllPosts;
