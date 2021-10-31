/**====================================================== 
 * app.js
 * Purpose: Main entry point for the application.
 * Author: Dane Rainbird (me@danerainbird.me)
 ====================================================== */

 /** DEPENDENCIES **/
let express = require('express');
let random = require('random');
let seedRandom = require('seedrandom')

/** EXPRESS CONFIGURATION **/
let app = express();
let port = process.env.PORT || 8080;

/** RENDER ENGINE **/
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/** STATIC ROUTING CONFIGURATION **/
app.use(express.static(__dirname + '/res'));

/** RUN THE SERVER s**/
app.listen(port, () => console.log("Listening on port " + port))

/** ROUTING **/
app.get('/:seed?', (req, res) => {
    let seed = req.query.seed;

    // If a seed has been provided, then use it
    if (seed != undefined && seed != "") {
        console.log("Seeding with " + seed);
        random.use(seedRandom(seed));
    }

    // Generate two random hex values
    let colour1 = random.int(0, 16777215).toString(16);
    let colour2 = random.int(0, 16777215).toString(16);

    // Render the index page with colours
    res.render("index.ejs", {'colours' : ["#" + colour1,  "#" + colour2]});
})