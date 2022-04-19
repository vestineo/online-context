const {Userfiles, renameFile, deleteFile} = '../models/projectfiles.js'

async function createProj(ctx) {
  const body = ctx.request.body;
  if( !body.name){
    ctx.status = 204;
    ctx.body = 'missing project name'
  }
  if( !body.author){
    const proj = new Project(body.name)
    ctx.body = 'Project without author'
  }
    const proj = new Project(body.name,body.author)
}

async function renameProj(ctx) {
  const body = ctx.request.body;
  if( !body.name || !body.author){
    ctx.status = 204;
    ctx.body = 'missing details'
  }
    renameProject(body.name,body.author,body.newName)
}

async function deleteProj(ctx) {
  const body = ctx.request.body;
  if( !body.name || !body.author){
    ctx.status = 204;
    ctx.body = 'missing details'
  }
    deleteProject(body.name,body.author)
}
module.exports = {
	createProj: createProj,
	renameProj: renameProj,
	deleteProj: deleteProj,
}
