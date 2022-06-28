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

/** COUNTRY DATA */

// For whatever reason, Render and Heroku don't like it when the data is read in from another file 
// so I'm just copying the data directly into a variable here.
let countryNames = 
`Denmark
Finland
Iceland
Norway
Sweden
Faroe Islands
Greenland
Åland Islands
Svalbard
Bouvet Island
Asgard
Alfheim
Amsvartnir
Barri
Bifröst
Breidablik
Byrgir
Eljudnir
Fensalir
Fólkvangr
Gimli
Gjallarbru
Gioll
Gladsheim
Glitnir
Himinbjorg
Hlesey
Hlidskjalf
Hnitborg
Hvergelmir
Idavoll
Jotunheim
Laerad
Lyngvi
Nastrond
Noatun
Midgard
Muspelheim
Sessrumnir
Svartalfheim
Thrymheim
Urdarbrunn
Valaskialf
Valhalla
Vanaheim
Vingolf
Valgrind
Vimur
Niflheim
Helheim`;

countryNames = countryNames.toString().split('\n');

/** RUN THE SERVER */
app.listen(port, () => console.log("Listening on port " + port));

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
    let countryName = markov.Chain(markov.formInput(...countryNames), 0.3, 4, 10, Math.random())
    
    // Log the country name, colour, and associated seed
    console.log("Generated name '" + countryName + "' with seed '" + seed + "'");

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