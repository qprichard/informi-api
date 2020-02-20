/**
 * Application manage file
**/

const fastify = require('fastify');
const db = require('./db');
const { config } = require('./utils/helpers');

const { API_PORT } = config;

const router = fastify({
  logger: true,
});

router.register(require('fastify-cors'), {
  origin: '*',
});

const routes = [
  ...require('./user/urls'),
]

routes.forEach( route => router.route(route) );

const app = async () => {
  try {
    await db.connect();
    router.log.info('MySQL database connected...');

    await router.listen(API_PORT);
  } catch (err) {
    db.end();
    router.log.error(err)
    process.exit(1)
  }
}

app();
