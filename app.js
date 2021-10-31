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

/** APP CONFIGURATION **/
let app = express();
let port = process.env.PORT || 8080;

/** RENDER ENGINE **/
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/** STATIC ROUTING CONFIGURATION **/
app.use(express.static(__dirname + '/res'));

/** RUN THE SERVER s**/
app.listen(port, () => console.log("Listening on port " + port))

// Obtain the country list for use in the Markov chain 
const countryTrainingText = fs.readFileSync(__dirname + '/res/countries.txt', 'utf8');
const countryNames = countryTrainingText.split('\r\n');

/** ROUTING **/
app.get('/:seed?', (req, res) => {
    // Get the seed from the request
    let seed = req.query.seed;


    // If a seed has been provided, then use it
    if (seed != undefined && seed != "") {
        random.use(seedRandom(seed));
    }

    // Generate two random hex values
    let colour1 = random.int(0, 16777215).toString(16);
    let colour2 = random.int(0, 16777215).toString(16);

    // Generate a country name using the Markov Generator
    let countryName = markov.Chain(markov.formInput(...countryNames), 0.3, 4, 10, random.float())
    if (true) {
        countryName = countryName.toLowerCase().split(' ').map(w => {
            return w.replace(w[0], w[0].toUpperCase());
        }).join(' ');
    }
    
    // Render the index page with colours and country name 
    res.render("index.ejs", {'colours' : ["#" + colour1,  "#" + colour2], 'countryName' : countryName});
})