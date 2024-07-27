const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  address: [
    {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  ],
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
  },
  contactNo: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
