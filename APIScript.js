
// Client ID and API key from the Developer Console
var CLIENT_ID = '16170618412-g8domio2khrgo2bt1gvegn6r5j5dr0n3.apps.googleusercontent.com';

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
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents('Keith');
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
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
   // appendPre(JSON.stringify(jsonString));
  });
}