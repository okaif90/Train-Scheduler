// Add FireBase link here and initialize Firebase

  var config = {
    apiKey: "AIzaSyBen7CgsECa2NhkbN3nBZ5yrgPgqL7khKE",
    authDomain: "train-scheduler-e365e.firebaseapp.com",
    databaseURL: "https://train-scheduler-e365e.firebaseio.com",
    projectId: "train-scheduler-e365e",
    storageBucket: "train-scheduler-e365e.appspot.com",
    messagingSenderId: "776546493509"
  };
  firebase.initializeApp(config); 

// Prevent page from reloading upon completing the form.
function registerTrainInput(event) {
	event.preventDefault();

	// Trims/Stores the user inputs into a variable.
	var trainName = $("#trainName").val().trim();
	var trainDestination = $("#destination").val().trim();
	var firstTrainTime = $("#firstTrainTime").val().trim();
	var trainFrequency = $("#frequency").val().trim();

	// Provides the launch time of the current first train trip.
	var firstTrainTrip = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log(firstTrainTrip);
	console.log("____________________________");

	// Provides the users current time.
	var currentTime = moment();
	console.log("This is the current time: " + moment(currentTime).format("hh.mm"));
	console.log("____________________________");

	// Provides the difference in minutes of the user current moment to the first train trip.
	var differenceInTime = moment().diff(moment(firstTrainTrip), "minutes");
	console.log("This is the difference in time by minutes: " + differenceInTime);
	console.log("____________________________");

	// Provides the time remaining by taking the modulus of the difference in time towards the trains frequency. 
	var timeRemaining = differenceInTime % trainFrequency;
	console.log("This is the train current travel time: " + timeRemaining);
	console.log("____________________________");

	// Provides the minutes remaining until the train arrives.
	var timeUntilTrainArrives = trainFrequency - timeRemaining;
	console.log("Minutes till train arrive: " + timeUntilTrainArrives);
	console.log("____________________________");

	// Provides the next arrival time in hh.mm pm/am format.
	var nextTimeArrival = moment().add(timeUntilTrainArrives, "minutes");
	console.log("Arrival Time: " + moment(nextTimeArrival).format("hh.mm A"));
	console.log("____________________________");

	// This is a variable object that contains the user input data and time conversions.
	var newTrainContent = {
		name: trainName,
		destination: trainDestination,
		trainStartTimer: moment(nextTimeArrival).format("hh:mm A"),
		frequency: trainFrequency,
		arrivalTime: timeUntilTrainArrives
	};
	
	// setTimeout(timeRemainingUpdate, 1000 * 60);

	// function timeRemainingUpdate(){
	// 	console.log("Updating");

	// 	timeUntilTrainArrives = trainFrequency - timeRemaining;
	// 	console.log("Minutes till train arrive: " + timeUntilTrainArrives);
	// 	console.log("____________________________");
	// 	setTimeout(timeRemainingUpdate, 1000 * 60);
	// }

	// Pushes the userInputs into the firebase database.
	firebase.database().ref().push(newTrainContent);
}

// Once the HTML page fully loads, on click call the function registerTrainInput above.
$(document).ready(function(){
	$("#addTrainButton").on("click", registerTrainInput)
});

// Calling the child element located in the firebase database, we append a table of the user inputs.
firebase.database().ref().on('child_added', function(snapshot) {
		$('tbody').append('<tr class="removeRow">' + 
			'<td>' + snapshot.val().name + '</td>' +
			'<td>' + snapshot.val().destination + '</td>' +
			'<td>' + snapshot.val().frequency + '</td>' +
			'<td>' + snapshot.val().trainStartTimer + '</td>' +
			'<td>' + snapshot.val().arrivalTime + '</td>' +
			'</tr>')
});


$("#removeButton").on("click", function(){
	$(".removeRow").detach();
	// this.detach();
});


