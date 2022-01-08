const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./configs/mongoDB");
const Shop = require('./configs/shopModel');
const fs = require('fs');
const { response } = require('express');
// const geocoder = require('./utilities/geocoder');

//Environment Variables
dotenv.config({ path: "./configs/config.env" });

//Setting Up Express
const port = process.env.PORT || 4000;
const app = express();

//Setting View Engine - EMBEDDED JAVA SCRIPT : RUN NPM INSTALL EJS
app.set('view engine', 'ejs');

//To Process The Content Sent By Form In Body POST REQUEST:
// app.use(express.urlencoded({ extended: true }));

//Setup Static Files
app.use(express.static(path.join(__dirname, "public")));

//Enabling Parser For Request
app.use(express.json());
//Enabling CORS
app.use(cors());

//Connect To Database
connectDB();

app.listen(port, () => {
    console.log(`Listening On Port ${port} | MODE: ${process.env.NODE_ENV}`);
})

app.get("/login", (request, response) => {
    response.sendFile(__dirname + "/login.html");
});

app.get("/landing", (request, response) => {
    response.sendFile(__dirname + "/landing.html");
});

app.get("/landing/about", (request, response) => {
    response.sendFile(__dirname + "/about.html");
});

app.get("/map", (request, response) => {
    response.sendFile(__dirname + "/map.html");
})

app.get("/payment", (request, response) => {
    response.sendFile(__dirname + "/payment.html");
});

app.get("/payment/receipt", (request, response) => {
    response.sendFile(__dirname + "/receipt.html");
});

app.get("/stores", (request, response) => {
    Shop.find()
        .then( (result) => {
            response.send(JSON.stringify(result));  //JSON STRINGIFY
        })
        .catch( (error) => {console.log("Error GET Request: " + error);} )
});

app.get("/stores/add", (request, response) => {
    response.sendFile(__dirname + "/add.html");
});

app.get("/stores/book", (request, response) => {
    response.sendFile(__dirname + "/book.html");
});

app.get("/stores/:id", (request, response) => {
 
    Shop.findById(request.params.id)
        .then( (result) => {
            let status=result.storeId;  //If 0: Free & 1: Booked
            console.log(status);
            if(status == "0")
            {
                Shop.findByIdAndUpdate(request.params.id, { "storeId": 1 })
                .then( (result) => {
                    console.log("UPDATE", result);
                    response.redirect("/stores/book");
                })
                .catch( (error) => console.log(error));
            }

            else{
                response.redirect("/map");
            }

                } )
        .catch( (error) => console.log(error));
    
});

app.post("/stores", (request, response) => {
    let newShop = new Shop(request.body);
    newShop.save()
        .then( (result) => {
            console.log("Entry Added");
            response.status(200).json({ entry: result, success: true });
        })
        .catch( (error) => {
            console.log("POST :" + error);
            response.status(400).json({error: error, success: false });
        });
});