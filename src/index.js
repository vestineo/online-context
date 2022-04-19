import path from 'path';
import Koa from "koa";
import Router from "@koa/router";
import koaBody from "koa-body";
import logger from "koa-logger";
import passport from "koa-passport";
import session from "koa-session";
import { router as userActionRouter } from "./routes/user-actions.js";
import { router as projectRouter} from './routes/projects-routes.js'
import "./auth.js";
import { dbo } from "./db/conn.js";

// Global variable
global.appRoot = path.resolve(path.dirname(""));

const app = new Koa();
const router = new Router();

app.keys = ["secret"];
app.use(session({}, app));

router.get("/", (ctx, next) => {
  ctx.body = "<h1>Hello Koa server</h1>";
});

router.get("/check", function(ctx, next) {
				console.log(ctx.isAuthenticated())
  if (ctx.isAuthenticated()) {
    ctx.body = "your are secret" 
  } else {
    ctx.redirect('/')
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(logger());
app.use(koaBody());
app.use(router.routes());
app.use(userActionRouter.routes());
app.use(projectRouter.routes());
app.listen(3000, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log("Server is running on port: 3000");
});
