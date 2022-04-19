import passport from "koa-passport";
import { Strategy as LocalStrategy } from "passport-local";
// import {getUserByName} from './models/user.js'
import { dbo } from "./db/conn.js";

passport.serializeUser(function (user, done) {
  done(null, user._id.toString());
});

passport.deserializeUser(async function (id, done) {
  try {
    let db = getDb();
    const user = db.users.findOne({ '_id': dbo.objId(id) });
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
