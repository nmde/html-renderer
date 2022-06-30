/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fastifyStatic = require('@fastify/static');
const fastify = require('fastify');
const path = require('path');

const app = fastify();

app.register(fastifyStatic, {
  prefix: '/dist/',
  root: path.join(__dirname, 'dist'),
});

app.get('/', async (req, reply) => reply.sendFile('index.html'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
