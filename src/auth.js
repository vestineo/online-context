const passport = require("koa-passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { dbo } = require("./db/conn.js");

passport.serializeUser(function (user, done) {
  done(null, user._id.toString());
});

passport.deserializeUser(async function (id, done) {
  try {
    let db = await dbo.getDb();
    const user = await db.collection("users").findOne({ _id: dbo.objId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const strategy = new LocalStrategy(function verify(username, password, done) {
  let db = dbo.getDb();
  db.collection("users").findOne({ name: username }, function (err, result) {
    if (err) return done(err);
    if (!result) {
      return done(null, false, { message: "Something is wrong" });
    }
    return done(null, result);
  });
});

passport.use(strategy);
