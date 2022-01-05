/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const Fastify = require('fastify');
const FastifyStatic = require('fastify-static');
const path = require('path');

const app = Fastify();

app.register(FastifyStatic, {
  prefix: '/dist/',
  root: path.join(__dirname, 'dist'),
});

app.get('/', async (req, reply) => reply.sendFile('index.html'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
