var config = {
  apiKey: "AIzaSyBZaEaocvZ3VC9mXu5IxXeoZoZdg2nBn5I",
  authDomain: "train-scheduler-4bb0f.firebaseapp.com",
  databaseURL: "https://train-scheduler-4bb0f.firebaseio.com",
  projectId: "train-scheduler-4bb0f",
  storageBucket: "train-scheduler-4bb0f.appspot.com",
  messagingSenderId: "706282596409"
};
firebase.initializeApp(config);

var dataRef = firebase.database();
var newTrain = {};

// adding a new train and pushing to Firebase
$("#add").on("click", function(event) {

  event.preventDefault();

  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  var newTrain ={
      name,
      destination,
      firstTrain,
      frequency
  }
  // Code for the push
  dataRef.ref().push({newTrain});
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});


//Call out of Firebase
dataRef.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().newTrain.name);
  console.log(childSnapshot.val().newTrain.destination);
  console.log(childSnapshot.val().newTrain.firstTrain);
  console.log(childSnapshot.val().newTrain.frequency);

  // Calculations for minutesTillTrain and nextTrain
  var firstTrainConverted = moment(childSnapshot.val().newTrain.firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var remainder = diffTime % childSnapshot.val().newTrain.frequency;
  console.log(remainder);

  var minutesTillTrain = childSnapshot.val().newTrain.frequency - remainder;
  console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

  var nextTrain = moment().add(minutesTillTrain, "minutes").format("HH:mm");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

//posting info
  var newRow = $("<tr>").append(
    $("<td>").text(childSnapshot.val().newTrain.name),
    $("<td>").text(childSnapshot.val().newTrain.destination),
    $("<td>").text(childSnapshot.val().newTrain.frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(minutesTillTrain),
  );
  
 $("#train-schedule").append(newRow);

}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});



