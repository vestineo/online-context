const path = require('path')
const Koa = require("koa")
const Router = require("@koa/router")
const koaBody = require("koa-body")
const logger = require("koa-logger")
const passport = require("koa-passport")
const session = require("koa-session")
const { router : userActionRouter } = require("./routes/user-actions.js")
const { router : projectRouter} = require('./routes/projects-routes.js')
const { dbo } = require("./db/conn.js");
require("./auth.js");

// Global variable
global.appRoot = path.resolve(path.dirname(""));
global.dbo = dbo;
const app = new Koa();
const router = new Router();

app.keys = ["secret"];
app.use(session(app));

router.get("/", (ctx, next) => {
  ctx.body = "<h1>Hello Koa server</h1>";
});

router.get("/check", function(ctx, next) {
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
