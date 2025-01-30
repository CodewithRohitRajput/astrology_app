const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const userModel = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', async (req, res) => {
    res.render('homepage');
});

// Sign-up

app.get('/signup', async (req,res)=>{
    res.render('signup')

})

app.post('/signup',async (req,res)=>{
    let {name , gender , email , password} = req.body;

    bcrypt.genSalt(10,(err,hash)=>{
        bcrypt.hash(password , hash , async(err , hash)=>{

            let user = userModel.create({
                name,
                gender,
                email,
                password:hash
            })
            let token = jwt.sign({email : email} , "secret");
            res.cookie("token" , token);
            res.send(user)
        })
    })
    
  
})

app.get("/appointment", (req, res) => {
    res.render("appointment");
});

app.post('/submit-appointment', async (req, res) => {
    console.log("Received Data:", req.body);

    try {
        let { fullName, email, phoneNumber, gender, placeOfBirth, dateOfBirth, timeOfBirth, country, preferredLanguage, preferredDate, timeSlot, additionalNotes } = req.body;

        if (!fullName || !email || !phoneNumber || !gender || !placeOfBirth || !dateOfBirth || !timeOfBirth || !country || !preferredLanguage || !preferredDate || !timeSlot) {
            return res.status(400).send("Error: Missing required fields.");
        }

        let user = await userModel.create({
            fullName,
            email,
            phoneNumber,
            gender,
            placeOfBirth,
            dateOfBirth,
            timeOfBirth,
            country,
            preferredLanguage,
            preferredDate,
            timeSlot,
            additionalNotes
        });

        res.render("details", { user });

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send("Error saving data.");
    }
});

app.get("/admin", async (req, res) => {
    const appointments = await  userModel.find({});
    res.render('admin',{appointments});
})

app.get('/horoscope', (req, res) => {
    res.render('horoscope'); // This will render the horoscope page (horoscope.ejs)
  });

//api calling
const fetch = require('node-fetch'); // Install using `npm install node-fetch`

app.get('/api/horoscope', async (req, res) => {
    try {
        const { sign } = req.query; // Get the zodiac sign from the request
        if (!sign) {
            return res.status(400).json({ error: "Missing zodiac sign" });
        }

        const url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data); // Send horoscope data to frontend
    } catch (error) {
        console.error("Error fetching horoscope:", error);
        res.status(500).json({ error: "Failed to fetch horoscope" });
    }
});






// New route to show user details after submission
app.get('/details/:id', async (req, res) => {
    try {
        let user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("details", { user });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send("Error retrieving user details.");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


const punycode = require('punycode/');
