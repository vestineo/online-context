import Router from '@koa/router'
import { createProj, deleteProj, renameProj } from '../controllers/projects-controllors.js'

export const router = new Router({
	prefix: '/projects'
});

router.post('/create', async (ctx, next) => {
	await createProj(ctx,next);
});
router.post('/delete', async (ctx,next) => {
	 await deleteProj(ctx,next);
})
router.post('/rename', async (ctx,next) => {
	 await renameProj(ctx,next);
})
