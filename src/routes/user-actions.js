import Router from '@koa/router'
import { login, register } from '../controllers/useraction-controllors.js'

export const router = new Router({
	prefix: '/users'
});

router.post('/login', async (ctx, next) => {
	await login(ctx,next);
});
router.post('/register', async (ctx,next) => {
	 await register(ctx,next);
})
