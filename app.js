/**====================================================== 
 * app.js
 * Purpose: Main entry point for the application.
 * Author: Dane Rainbird (me@danerainbird.me)
 ====================================================== */

 /** DEPENDENCIES **/
let express = require('express');
let random = require('random');
let seedRandom = require('seedrandom');
let fs = require('fs');
let markov = require('./helpers/markov_chain');
require('dotenv').config();

/** APP CONFIGURATION **/
let app = express();
let port = process.env.PORT || 8080;

/** RENDER ENGINE **/
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/** STATIC ROUTING CONFIGURATION **/
app.use(express.static('res'));

/** RUN THE SERVER **/
app.listen(port, () => console.log("Listening on port " + port))

/** GET NAME / COUNTRY DATA FROM FILE */
const countryTrainingText = fs.readFileSync('./res/countries.txt', 'utf8');
const countryNames = countryTrainingText.split('\r\n');

/**====================================================== 
 *                    BEGIN ROUTING
 ====================================================== */

// GET - Homepage
app.get('/', (req, res) => {
    // Get the seed from the request
    let seed = req.query.seed;

    // Set up checks for the heart easter egg
    let heartEasterEggNames = ['kim', 'kimberley', 'glitch', 'kaitlyn'];
    let heartEasterEggEnabled = false;

    // If a seed has been provided, then use it
    if (seed != undefined && seed != "") {
        random.use(seedRandom(seed));
        
        // Check if the seed matches the heart easter egg names 
        if (heartEasterEggNames.includes(seed.toLowerCase())) {
            heartEasterEggEnabled = true;
        }
    }

    // Generate two random hex values to use as colours
    let colour1 = random.int(0, 16777215).toString(16);
    let colour2 = random.int(0, 16777215).toString(16);

    // Generate a country name using the Markov Generator
    let countryName = markov.Chain(markov.formInput(...countryNames), 0.3, 4, 10, random.float())
    
    // Set the first character of countryName to be upper case
    countryName = countryName = countryName.charAt(0).toUpperCase() + countryName.slice(1);

    // Render the index page with colours and country name 
    res.render("index.ejs", {
        'pageTitle': 'Home',
        'colours' : [
            "#" + colour1,  
            "#" + colour2
        ], 
        'countryName' : countryName, 
        'heartEasterEggEnabled' : heartEasterEggEnabled,
        'seed' : seed
    });
})

// GET - About Page
app.get('/about', (req, res) => {
    res.render('about.ejs', {
        'pageTitle': 'About'
    })
})

/**====================================================== 
 *                    END ROUTING
 ====================================================== */