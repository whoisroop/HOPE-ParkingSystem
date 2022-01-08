const { string } = require('assert-plus');
const mongoose = require('mongoose');
const geocoder = require('../utilities/geocoder');

//TO ACCESS ENVIRONMENT VARIABLES
const dotenv = require('dotenv');
dotenv.config({ path: "./configs/config.env" });

const ShopSchema = mongoose.Schema({
    storeId: {
        type: String,
        required: [true, "PLEASE ENTER STORE NAME"],
        // unique: true,
        trim: true,
        maxLength: [36]
    },
    address: {
      type: String, 
      required: [true, "PLEASE ENTER ADDRESS"]
    },
    //GEOJSON OBJECT
    location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
          index: "2dsphere"
        },

        formattedAddress: String
      },
})

//Make The Changes With The Help Of API Before Saving
// ShopSchema.pre('save', (next) => {
//   console.log("ADDRESS PROCESSING: " + this.storeId)
//   geocoder.geocode(this.address)
//     .then( (location) => {
//       console.log("API WORKING! GEOCODING COMPLETE.");
//       console.log(location);
//       next();
//     })
//     .catch( (error) => console.log("API ERROR: " + error));
// });

ShopSchema.pre("save", async function() {
  try {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    }

    //Do Not Save Entered Address
    this.address = undefined;
    
  } catch (error) {
    console.log("GEOCODER ERROR: " + error);
  }
})

module.exports = mongoose.model("Store", ShopSchema);