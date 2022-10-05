const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUser, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUser(username)

        if (user == null) {
            return done(null, false, {message: "User not found"})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: "Incorrect password"})
            }
        } catch (e) {
            console.error(e)
            console.error(e.message)
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: "username"}, authenticateUser))
    passport.serializeUser((user, done) => {
        return done(null, user.rowid)
    })
    passport.deserializeUser( (id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize
