const Router = require('@koa/router')
const { createProj, deleteProj, renameProj } = require('../controllers/projects-controllors.js')

const router = new Router({
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

module.exports = {
	router : router
}
