const Router = require('@koa/router')
const { login, register } = require('../controllers/useraction-controllors.js')

const router = new Router({
	prefix: '/users'
});

router.post('/login', async (ctx, next) => {
	await login(ctx,next);
});
router.post('/register', async (ctx,next) => {
	 await register(ctx,next);
})

module.exports = {
	router : router
}
