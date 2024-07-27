const express = require("express");
const app = express();

const userRoute = require("./route/user");
const profileRoute = require("./route/Profile");
const paymentRoute = require("./route/Payment");
const productRoute = require("./route/Product");
const orderRoute = require("./route/Order");
// const {initSocket} = require("./socket1")
const database = require("./config/database");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const { verifyCallback } = require("./middleware/logingoogle");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("./model/User"); // Import Passport




dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieparser());



app.use(cors());

app.use(
  session({
    secret: "sdgbvs15234",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.clientid, // Your Google OAuth client ID
      clientSecret: process.env.clientsecrete, // Your Google OAuth client secret
      callbackURL: "https://huehub-vyrf-git-main-soham-lates-projects.vercel.app/api/v1/auth/google/callback", // Callback URL configured in Google Developer Console
      scope: ["profile", "email"], // Scope of user information requested from Google
    },
    verifyCallback
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(async function (email, done) {
  try {
    const user = await User.findOne({ email });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/order",orderRoute);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ..",
  });
});

// const {server, io} = initSocket(app);
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

module.exports = app;


