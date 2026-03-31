if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utility/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const User = require("./models/user.js");

const port = 8080;


const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");


const URL_DATA = process.env.MONGO_URL;

// -------------------- BASIC SETUP --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// -------------------- MAIN FUNCTION --------------------
async function main() {
    await mongoose.connect(URL_DATA);
    console.log("Connected to DB");

    // Mongo session store AFTER DB connection
    const store = MongoStore.create({
        mongoUrl: URL_DATA,
        crypto: {
            secret: "abc234",
        },
        touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
        console.log("SESSION STORE ERROR ❌", err);
    });

    const sessionOptions = {
        store: store,
        secret: "abc234",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };

    app.use(session(sessionOptions));
    app.use(flash());

    // -------------------- PASSPORT --------------------
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // -------------------- GLOBAL VARIABLES --------------------
    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });

app.get("/", (req, res) => {
    res.redirect("/listings");
});


    // -------------------- ROUTES --------------------
    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    // -------------------- ERROR HANDLING --------------------
    
    app.all("*", (req, res, next) => {
        next(new ExpressError(404, "Page Not Found"));
    });

    app.use((err, req, res, next) => {
        let { status = 500, message = "Something Went Wrong" } = err;
        res.status(status).render("error.ejs", { message });
    });

    // START SERVER AFTER EVERYTHING
    app.listen(port, () => {
        console.log(`Server running on port ${port} 🚀`);
    });
}

// -------------------- START APP --------------------
main().catch((err) => console.log(err));