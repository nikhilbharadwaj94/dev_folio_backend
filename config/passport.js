//I believe the complete authentication aspect is taken care here. Going forward wherever i need authentication and all to be done i will
//just have to call passport.js i guess
const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {}; //I dont understand why we are initializing opts as const because since we will be updating in the next two steps it will basically throw warning msgs at us
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done)=>{ //here jwt_payload is the new var name we have created and it will basically contain the content of payload
        User.findById(jwt_payload.id)
        .then(user => {
            if(user){
                return done(null, user);
            }
            return done(null, false);
        })
        .catch(err => console.log(err));
    }));
};
