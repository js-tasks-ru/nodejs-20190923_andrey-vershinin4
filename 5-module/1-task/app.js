const Koa = require('koa');
const app = new Koa();
const chat = require('./chat');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const message = await chat.subscribe(ctx);
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (!message) {
    ctx.throw(400);
  }

  chat.publish(message);
  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
