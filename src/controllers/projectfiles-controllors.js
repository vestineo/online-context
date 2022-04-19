import {Userfiles, renameFile, deleteFile} from '../models/projectfiles.js'

export async function createProj(ctx) {
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
export async function renameProj(ctx) {
  const body = ctx.request.body;
  if( !body.name || !body.author){
    ctx.status = 204;
    ctx.body = 'missing details'
  }
    renameProject(body.name,body.author,body.newName)
}
export async function deletProj(ctx) {
  const body = ctx.request.body;
  if( !body.name || !body.author){
    ctx.status = 204;
    ctx.body = 'missing details'
  }
    deleteProject(body.name,body.author)
}
