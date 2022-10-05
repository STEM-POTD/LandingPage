const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')
const passport = require("passport")
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require("../passport-config.js")

let db = new sqlite3.Database('sqlite.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to best database ever');
});


initializePassport(
    passport,
    async username => {
        let user = {}
        await new Promise((resolve) => {
            db.get(`SELECT rowid, * FROM users WHERE username == ?`, username, (err, row) => {
                if (err) {
                    console.error(err.message)
                }
                user = row
                resolve();
            })
        })

        return user
    },
    async id => {
        let id_ = {}
        await new Promise((resolve) => {
            db.get(`SELECT rowid, * FROM users WHERE rowid == ?`, id, (err, row) => {
                if (err) {
                    console.error(err.message)
                }
                id_ = row
                resolve();
            })
        })
        return id_
    })


async function getQuestions() {
    let data = [];
    const stmt = "SELECT * FROM questions";
    await new Promise((resolve) => {
        db.all(stmt, [], (err, rows) => {
            if (err) {
                console.log(err);
            }
            data = rows;
            resolve();
        });
    });
    console.log(data);
    return data;
}

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    return res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect("/")
    }

    return next()


}

router.get("/logout", (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        } return res.redirect("/login")
    })
})

/* GET home page. */
router.get('/', (req, res) => {
    if (req.isAuthenticated()){
        res.render("index_val.ejs");
    }
    else{
        res.render("index_noval.ejs");
    }
    
});

router.get('/login', checkNotAuthenticated,(req, res) => {
    res.render("login.ejs");
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

router.get('/questions', checkAuthenticated, (req, res) => {
    let data;
    data = getQuestions();
    res.render("questions.ejs", {res: data});
});

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        db.run("INSERT INTO users VALUES(?,?)", [req.body.username, hash], (err) => {
            if (err) {
                return console.error(err.message)
            }
            console.log("Row added")
        })
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
})

module.exports = router;
