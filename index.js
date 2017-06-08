'use strict';
var Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefined;

var SKILL_NAME = "Space Facts";
var GET_FACT_MESSAGE = "Here's your fact: ";
var HELP_MESSAGE = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
var data = [
    "A year on Mercury is just 88 days long.",
    "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
    "Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.",
    "On Mars, the Sun appears about half the size as it does on Earth.",
    "Earth is the only planet not named after a god.",
    "Jupiter has the shortest day of all the planets.",
    "The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.",
    "The Sun contains 99.86% of the mass in the Solar System.",
    "The Sun is an almost perfect sphere.",
    "A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.",
    "Saturn radiates two and a half times more energy into space than it receives from the sun.",
    "The temperature inside the Sun can reach 15 million degrees Celsius.",
    "The Moon is moving approximately 3.8 cm away from our planet every year."
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },

    'FamilyCalendar': function(){
      var activityName = this.event.request.intent.slots.activity.value;
      var personName = this.event.request.intent.slots.person.value;

      if (personName && activityName){
        this.emit(':tell', "Person is " + personName + ", activity is " + activityName);
        listUpcomingEvents(personName, activityName);
      }

      else if (personName) {
        //this.emit(':tell', "Person is " + personName);

        this.emit(':tell', listUpcomingEvents(personName, ""));
      }
      else {
        this.emit(':tell', "Shit");
      }

    },
    'GetNewFactIntent': function () {
        var factArr = data;
        var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];
        var speechOutput = GET_FACT_MESSAGE + randomFact;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};

// Client ID and API key from the Developer Console
var CLIENT_ID = '654320273720-mfaji5bqc90len044dbr4n5s6tbqe5b6.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

function listUpcomingEvents(name, activity) {
  var cur = new Date().setHours(23, 59, 59);
  var endTime = new Date(cur);
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'timeMax': endTime.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'q': name,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    var jsonString = [];
    if(activity == 'chore'){
      var length = events.length;
      for(var i = 0; i < length; i++){
        var event = events[i];
        var time = event.start.dateTime;
        if (!time) {
          time = event.start.date;
        }
        if (event.colorId == 9) { 
          jsonString.push({"title" : event.summary, "description" : event.description, "date" : time, "type" : "chore"});

        }
      }
    } else if(activity == 'event'){
      var length = events.length;
      for(var i = 0; i < length; i++){
        var event = events[i];
        var time = event.start.dateTime;
        if (!time) {
          time = event.start.date;
        }
        if (event.colorId == 10) { 
          jsonString.push({"title" : event.summary, "description" : event.description, "date" : time, "type" : "event"});
        }
      }
    } else {
      var length = events.length;
      for(var i = 0; i < length; i++){
        var event = events[i];
        var time = event.start.dateTime;
        if (!time) {
          time = event.start.date;
        }
        if (event.colorId == 9) { 
          jsonString.push({"title" : event.summary, "description" : event.description, "date" : time, "type" : "chore"});
        } else {
          jsonString.push({"title" : event.summary, "description" : event.description, "date" : time, "type" : "event"});
        }
      }
    }
   return JSON.stringify(jsonString);
  });
}