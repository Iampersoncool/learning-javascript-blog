'use strict';

const stuff = (app) => {
  const path = require('path');
  const ejs = require('ejs');

  const fastifyHelmet = require('@fastify/helmet').default;
  const fastifyCors = require('@fastify/cors').default;
  const fastifyStatic = require('@fastify/static').default;
  const fastifyCompress = require('@fastify/compress').default;
  const fastifyView = require('@fastify/view').default;

  const moment = require('moment');

  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'i.ibb.co'],
        styleSrc: ["'self'", 'cdn.jsdelivr.net'],
      },
    },
  });
  app.register(fastifyCors);

  app.register(fastifyCompress);
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
  });

  app.register(fastifyView, {
    engine: {
      ejs,
    },
  });

  app.addHook('preHandler', (request, reply, done) => {
    reply.locals = {
      truncateString(str, num) {
        if (str.length > num) return str.slice(0, num) + '...';

        return str;
      },

      formatDate(date, str) {
        return moment.utc(date).format(str);
      },
    };

    done();
  });
};

module.exports = stuff;
