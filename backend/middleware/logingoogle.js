const passport = require("passport");

const User = require("../model/User");

exports.verifyCallback = async (accessToken, refreshToken, profile, done) => {
    console.log("callback function auth");
    try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        
          if (existingUser) {
            console.log("existing user ")
              return done(null, existingUser);
          }
           else {
              const newUser = new User({
                  googleId: profile.id,
                  email: profile.emails[0].value,
                  firstname: profile.name.givenName,
                  lastname: profile.name.familyName,
                  image: profile.photos[0].value,
                  isnew:true,
                  
              });
              console.log("why it does not printing profile ",profile);
              await newUser.save();
              return done(null, newUser);
          }
    }catch (error) {
        console.error("Error in Google OAuth verification:", error);
        return done(error);
    }
};






