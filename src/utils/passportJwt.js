const passport    = require('passport');
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("MedicineDividerUser");

const SELECT_FOR_JWT = "id name email"

module.exports.jwtStrategy = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = process.env.JWT_SECRET_OR_KEY;
       passport.use("jwt",new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id, SELECT_FOR_JWT)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        }))
};

module.exports.signJwt = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_OR_KEY, { expiresIn: 31556926})
}

module.exports.decodeJwtToPayload = (jwtEncoded) => {
    let token = jwtEncoded.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET_OR_KEY)
}