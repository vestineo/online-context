import passport from 'koa-passport'
import {addUser} from '../models/user.js'


export async function login(ctx) {
  return passport.authenticate('local', function(err, user, info, status) {
    if (user === false) {
      console.log(info);
      ctx.body = { success: false }
      ctx.throw(401)
    } else {
      ctx.body = { success: true }
      return ctx.login(user)
    }
  })(ctx)
}

export async function register(ctx,next){
	try { 
		const user = { name : ctx.request.body.username, password: ctx.request.body.password }
		ctx.body = await addUser(user);
	} catch {
		ctx.status = 401;
		console.log('failed')
	}
}
