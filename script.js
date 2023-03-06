// Choice is an array of JSON objects (Google JSON!). The "defeats" attribute is a nested array of JSON objects that defines which conditions beat 
// each action, as well as "how" it beats it

var choices = [
  {
    action: "r",            // action indicator we can use in conditionals
    description: "Rock",    // what we'll display as part of the message
    defeats: [              // sub-array (important concept!) - contains which actions THIS action (r) defeats, and how
      {
        action: "s",    // first action "r" defeats
        how: "crushes"  // how "r" defeats "s"
      },
      {
        action: "l",    // second action ...
        how: "crushes"  // how ...
      }
    ]
  },
  {
    action: "p",            // next supported action  
    description: "Paper",
    defeats: [              // array of actions "p" defeats
      {
        action: "r",
        how: "covers"
      },
      {
        action: "k",
        how: "disproves"
      }
    ]
  },
  {
    action: "s",
    description: "Scissors",
    defeats: [
      {
        action: "p",
        how: "cuts"
      },
      {
        action: "l",
        how: "decapitates"
      }
    ]
  },
  {
    action: "l",
    description: "Lizard",
    defeats: [
      {
        action: "k",
        how: "poisons"
      },
      {
        action: "p",
        how: "eats"
      }
    ]
  },
  {
    action: "k",
    description: "Spock",
    defeats: [
      {
        action: "s",
        how: "smashes"
      },
      {
        action: "r",
        how: "vaporizes"
      }
    ]
  }
];

// just for simplicity, using a JSON object here for our scorecard. Wins, losses, ties, and total rounds played
var scorecard = {
  wins: 0,        // attribute syntax:  { key: value }
  losses: 0,
  ties: 0,
  rounds: 0
};

// This function is called (triggered) from the onclick events of the action buttons defined in our HTML
function play(action) {
  // initialize userChoice variable - we're going to set this to the object in our choices array based on the "action" passed to this function
  var userChoice = null;

  // use the special Array function "forEach" to loop through every element in the array, and call a function (called a "callback" - Google this!) that 
  // passes in the current element being looped over
  choices.forEach(function (element) {
    // the callback function passes in the current element of the array for each loop - check the ".action" property of that element to locate the 
    // element we need from our choices array
    if (element.action == action) userChoice = element;
  });

  // NOTE: There is an easier way to get the userChoice from the array of choices. A loop was used above since that's what we're covering in class,
  // however another ES6 special function can save us a little time. Also, note the ES6 function syntax being used instead of a function(), we've used () => {} function arrow syntax.

  // ES5 function callback using .find()
  // userChoice = choices.find(function(element) 
  // { 
  //   return element.cation == action 
  // });

  // ES6 function callback using .find() (much simpler!)
  // userChoice = choices.find( element => element.cation == action);

  // Randomly chooses a choice from the options array. This is the Computer's guess.
  var computerChoice = choices[Math.floor(Math.random() * choices.length)];     // note the bracket syntax! We're calculating a number that resolves to [number] as an index

  // call a custom function (defined below) to check if one choice beats another - this efficiently re-uses code with the parameters we're passing in
  var userDefeatedObject = checkDefeated(userChoice, computerChoice);
  var computerDefeatedObject = checkDefeated(computerChoice, userChoice);

  // initialize our message variable - we'll set this to an outcome based on the conditional logic below, and then pass to the updateScorecard 
  // function which will display it
  var message;

  // begin conditional logic for checking win/loss/tie state
  if (userChoice.action == computerChoice.action) {
    scorecard.ties++;         // we tied; increment the number of ties (google ++ syntax!)
    message = "You Tied!";
  }
  else if (userDefeatedObject) {
    // if the userDefeatedObject is set / truthy, we know the user won - increment wins
    scorecard.wins++;

    // note the use of "userDefeatedObject.how" - since our checkDefeated function returns a "defeats" element, we know the "how" property exists 
    // (see definition of choices above ^^)
    message = "You Won! " + userChoice.description + " " + userDefeatedObject.how + " " + computerChoice.description;
  }
  else {
    // only other condition that can exist is the computerDefeated object being set, meaning the computer won
    scorecard.losses++;

    // note the use of "userDefeatedObject.how" - since our checkDefeated function returns a "defeats" element, we know the "how" property exists (see definition of choices above)
    message = "You Lost! " + computerChoice.description + " " + computerDefeatedObject.how + " " + userChoice.description;
  }

  // pass the message we set above to the updateScorecard function
  updateScorecard(message);

}

function updateScorecard(message) {
  // update each of the HTML elements with the current scorecard stats
  document.getElementById("wins").textContent = scorecard.wins;
  document.getElementById("losses").textContent = scorecard.losses;
  document.getElementById("ties").textContent = scorecard.ties;

  if (message) {
    // if a message has been passed, alert it. Remember that the first time this gets called (when the page loads, see below), no message is passed
    alert(message);

    // get a reference to the "history" container in our HTML so we can append our result
    var historyObj = document.getElementById("history");

    // set the innerHTML of the history object. Note the TERNARY conditional usage here. GOOGLE THIS!!
    // pseudocode: if there have been no rounds played, completely overwrite the contents of "history" with our message. If rounds have been played, append a linebreak and then our message to get a running tally of round results
    historyObj.innerHTML = (scorecard.rounds ? historyObj.innerHTML + "<br />" : "") + message;

    // increment our total rounds played (really just for internal use)
    scorecard.rounds++;
  }
}

// custom function to re-use code that checks if one choice "defeats" another
function checkDefeated(choice, compareChoice) {
  // placeholder variable that we'll either set in the loop below, or leave as null (which becomes "falsey")
  var found = null;

  // loop through each of the "defeats" array and see if "choice" object can defeat "compareChoice" object\
  // NOTE: This could also be achieved using the .search() array function
  choice.defeats.forEach(function (element) {
    if (element.action == compareChoice.action) found = element;
  });

  // Another instance we could use .find instead of a loop:
  // return choice.defeats.find(element => element.action == compareChoice.action);

  // pass back what we found (or null if it "choice" does not defeat "compareChoice"
  return found;
}

// this gets called as the page loads so that the scorecard displays will be set to 0. We pass in no message, so nothing else happens except the scorecard HTML elements updating with zeros.
updateScorecard();
