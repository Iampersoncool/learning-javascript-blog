'use strict';

const path = require('path');
const Fastify = require('fastify').default;

const stuff = require('./stuff');
const getAllPosts = require('./posts');
const cache = require('./cache');

const postsDir = path.join(__dirname, 'posts');
const app = Fastify({
  ignoreTrailingSlash: true,
});
const port = process.env.PORT || 3000;

stuff(app);

let posts;
getAllPosts(postsDir).then((p) => {
  posts = p;
});

app.get('/', (request, reply) => {
  return reply.view('./views/index.ejs', {
    posts,
    url: `https://${request.headers.host}`,
  });
});

app.get('/search', (request, reply) => {
  const { query } = request.query;

  if (!query) return reply.status(400).send('Missing query paramater');

  const match = posts.filter(
    ({ frontMatter }) =>
      frontMatter.title.toLowerCase().includes(query.toLowerCase()) ||
      frontMatter.description.toLowerCase().includes(query.toLowerCase())
  );

  return reply.view('./views/index.ejs', {
    posts: match,
    search: true,
    url: `https://${request.headers.host}`,
  });
});

app.get('/posts/:slug', (request, reply) => {
  const { slug } = request.params;

  const url = `https://${request.headers.host}${request.url}`;

  if (cache.has(slug)) {
    const post = cache.get(slug);
    console.log('Using cache on route ' + request.url);
    return reply.view('./views/viewPost.ejs', { post, url });
  }

  const post = posts.find((post) => post.slug === slug);
  if (!post) return reply.status(404).send('Post not found.');

  console.log('Not using cache on route' + request.url);
  cache.set(post.slug, post);
  return reply.view('./views/viewPost.ejs', { post, url });
});

app
  .listen({ port })
  .then((adress) => console.log('app listening on ' + adress))
  .catch(console.error);
