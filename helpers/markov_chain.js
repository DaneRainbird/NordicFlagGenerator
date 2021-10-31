/**====================================================== 
 * markop_chain.js
 * Purpose: A JS Implementation of a Markov Chain, used for generating a random name.
 * Author: /u/ScratchOs on Reddit
 * Source: 
 *      https://codepen.io/scratchos/pen/gvpjqG 
 *      https://www.reddit.com/r/proceduralgeneration/comments/7ulmts/small_markov_chain_to_generate_country_names_in/
 ====================================================== */

module.exports = {
    Chain: function (probList, endBias = 0.3, minLength = 4, maxLength = 10, probability) {
        // seperator character, same as in function above
        // choice = character to lookup in map
        let choice = "|";
      
        // array containing output string
        let stringArr = [];
      
        // current letter
        let letter;

        // should it try to end asap because at maxLength
        let endNow = false;
        while (true) {
            let prob = probability;
            //get cumulative probability list from map
            let chance = probList[choice];

            // reset letter sequenceadded
            letter = null;
      
            // loop through cumulative probabilites
            for (let i = 0; i < chance.length; i++) {
                // end loop if string should be ended and the current sequence contains |
                if (endNow && chance[i][0][1] == "|") {
                    letter = chance[i][0];
                    break;
                }
                // if random is greater than cumulative probability
                // or in bias towards ending string and sequence contains |
                // set the possibly added sequence to the current sequence
                if (
                    prob > chance[i][1] ||
                    //ending character
                    (chance[i][0][1] == "|" &&
                    // longer than min length
                    stringArr.length > minLength &&
                    prob >
                    // decrease chance for sequence to be picked
                    (chance[i][1] * chance.count -
                        // by string length
                        (stringArr.length - minLength) *
                        // by end bias
                        endBias *
                        // initial probability
                        chance[i][1] *
                        chance.count) /
                        // re-divide by count
                        chance.count)
                ) {
                    letter = chance[i][0];
                }
            }
            // if no letter found, pick first one
            if (!letter) letter = chance[0][0];
            // if ending character and output long enough, end
            if (letter[1] === "|" && stringArr.join("").length >= minLength) break;
            // if ending character and output not long enough, force to continue
            if (letter[1] === "|" && stringArr.join("").length < minLength) {
                letter = letter[0].repeat(2);
            }
            // if string at max length request loop to end in next iteration
            if (stringArr.join("").length >= maxLength) endNow = true;
            // add sequence to output
            stringArr.push(letter);
            choice = letter[1];

        }
        // return joined output.
        return stringArr.join("");
    },

    formInput: function (...strings) {
        // character not in string == "|", used as seperator
        // list of characters in each string, in order with each string's characters
        // seperated with |, array is begun and ended with |
        let letterList = ["|"];
        strings.forEach(string => {
            string
            .toLowerCase()
            .split("")
            .forEach(l => letterList.push(l));
            letterList.push("|");
        });
    
        // the set of unique letters in the chacater list
        let uniqueLetters = [...new Set(letterList)];
    
        // create map of every unique letter => empty array
        let letterMap = {};
        uniqueLetters.forEach(letter => (letterMap[letter] = []));
    
        // for each letter in character list, if the next character is not |
        // join the i+1th and i+2th characters and append them to the array
        // in the map with key i'th character.
        letterList.forEach((letter, i) => {
            if (letterList[i + 1] == "|") return;
                if (i < letterList.length - 2) {
                letterMap[letter].push(letterList[i + 1] + letterList[i + 2]);
            }
        });
    
        // reduce each array in the map so each set of 2 characters
        // is only included once along with the number of times it is inculded.
        let letterCounts = {};
        Object.keys(letterMap).forEach(key => {
            let val = letterMap[key];
            //         v unique sequences
                let map = [...new Set(val)].map(x => {
                //         v get length of list only containing that unique sequence
                    return [x, val.filter(y => y === x).length];
                });
            letterCounts[key] = map;
        });
    
        // Divide each count in each array in the map by the total count in each array
        // to get the probability of each 2 character string apearing after the map
        // key.  Then convert probabilities into cumulative probabilites, with first
        // 2 character sequence having probability 0 and last having less than 0.
        // Also add count as property on array.
        let letterProbs = {};
        Object.keys(letterCounts).forEach(key => {
            let val = letterCounts[key];
    
            // get total count
            let count = val.reduce((a, b) => a + b[1], 0);
    
            // divide counts by total
            let map = val.map(el => [el[0], el[1] / count]);
    
            // convert to cumulative probability
            let counter = 0;
            map = map.map(el => {
                counter += el[1];
                return [el[0], counter - el[1]];
            });

            // add total count property
            map.count = count;
            letterProbs[key] = map;
        });
        return letterProbs;
    }
}