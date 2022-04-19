const passport = require("koa-passport");
const { addUser } = require("../models/user.js");

async function login(ctx) {
  return passport.authenticate("local", function (err, user, info, status) {
    if (user === false) {
      console.log(info);
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      ctx.login(user);
    }
  })(ctx);
}

async function register(ctx, next) {
  try {
    if (ctx.request.body.username && ctx.request.body.password) {
      const user = {
        name: ctx.request.body.username,
        password: ctx.request.body.password,
      };
      ctx.body = await addUser(user);
    }
    if (!ctx.request.body.username || !ctx.request.body.password) {
      ctx.body = "Missing crediantial";
      ctx.status = 401;
    }
  } catch {
    ctx.status = 401;
    console.log("failed");
  }
}

module.exports = {
  login: login,
  register: register,
};
