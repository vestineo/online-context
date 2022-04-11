import Koa from 'koa';
import serve from 'koa-static';
import koaBody from 'koa-body';
import fs from 'fs';
import {spawn} from 'child_process';

const app = new Koa();
let compiled = true;
app.use(koaBody());
app.use(serve("./",{defer: true}));	
app.use(async (ctx,next) => {
	if(ctx.method==="POST"){
		let compile;
		fs.writeFile("hello.tex",ctx.request.body.editor,(err) => {
			if(err) {
				console.log(err)
			} else {
				compiled = false;
				compile = spawn("context.exe", ["hello.tex"]);
		                compile.stdout.on('data',(data) => {console.log(`stdout:${data}`)})
				compile.on('close', (code) => {compiled = true;})
			}
		});
		ctx.status = 204;
	} else { 
		await next();
	}
})

app.listen(3000);
