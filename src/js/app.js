(function () {
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBctIBxc2iUkzIfQM7D8ZMbJi_9fHhnMUU",
        authDomain: "meetupeventplannerks.firebaseapp.com",
        databaseURL: "https://meetupeventplannerks.firebaseio.com",
        storageBucket: "meetupeventplannerks.appspot.com",
        messagingSenderId: "254221471142"
      };
      firebase.initializeApp(config);

    // real time authentication listener
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            console.log(firebaseUser);
            // TODO: show log out button when user is logged in
        } else {
            console.log('not logged in');
            // TODO: hide log out btn when no user is logged in
            window.location.href = 'index.html';
        }
    });
})();


// add log out function
	const btnLogOut = $('#btnLogOut');

    btnLogOut.click(function() {
        firebase.auth().signOut();
    })


var Event = function(event) {
	this.name = ko.observable(event.name);
	this.location = ko.observable(event.location);
	this.type = ko.observable(event.type);
	this.host = ko.observable(event.host);
	this.startDate = ko.observable(event.startDate);
	this.startTime = ko.observable(event.startTime);
	this.endDate = ko.observable(event.endDate);
	this.endTime = ko.observable(event.endTime);
	this.guests = ko.observableArray(event.guests);
};

var initialEvents = [
	{
		name: "Kar Sheng's Birthday",
		location: "Kuala Lumpur",
		type: "Birthday Party",
		host: "Lee Kar Sheng",
		startDate: "2016-07-15",
		startTime: "09:00",
		endDate: "2016-07-15",
		endTime: "21:00",
		guests: ["Derek Sivers", "Tim Ferriss", "Ryan Holiday"]
	},
	{
		name: "My Party",
		location: "Johor",
		type: "Party",
		host: "Chin Zi Yen",
		startDate: "2016-04-12",
		startTime: "09:00",
		endDate: "2016-04-12",
		endTime: "21:00",
		guests: ["Lee Kar Sheng", "Chin Zi Yen"]
	}
];

var EmptyEvent = function() {
	var obj = {
		name: "",
		location: "",
		type: "",
		host: "",
		startDate: "",
		startTime: "09:00",
		endDate: "",
		endTime: "18:00",
		guests: []	
	};
	return obj;
};

var ViewModel = function() {
	var self = this;

	self.newEvent = new Event(EmptyEvent()); 
	self.eventList = ko.observableArray();

	self.saveEventBtn = $('#saveEventBtn');
	self.eventModalLabel = $('#eventModalLabel');
	self.eventModal = $('#eventModal');

	// initialEvents.forEach(function(event) {
	// 	self.eventList.push(new Event(event));
	// });

	self.currentEvent = ko.observable();

	// add guest to list
	self.addGuestToList = function(data, event) {
		initAutocomplete();
		if(event.keyCode === 13) {
			self.currentEvent().guests.push(event.target.value);
			event.target.value = "";
		}
		return true;
	};

	// remove guest from currentGuestList	
	self.removeGuest = function(clickedGuest) {
		self.currentEvent().guests.remove(clickedGuest);
	};

	self.saveEvent = function() {
		// if it is a new event
		if (self.saveEventBtn.html() === 'Add') {
			self.eventList.push(self.currentEvent());
			self.newEvent = new Event(EmptyEvent());
			self.eventModal.modal('toggle');
		}
	};

	self.setEvent = function(clickedEvent) {
		// change the button text to 'Save'
		self.saveEventBtn.hide();
		self.eventModalLabel.html('Edit Event');
		self.currentEvent(clickedEvent);
	};

	self.addNewEvent = function() {
		// clear value
		self.saveEventBtn.show();
		self.saveEventBtn.html('Add');
		self.eventModalLabel.html('Add a New Event');

		self.currentEvent(self.newEvent);
	};

	self.incompleteFields = function() {
		return (!$('#eventName').val() || !$('#eventLocation').val() || !$('#eventType').val()
			|| !$('#eventHost').val() || !$('#startDateTime').val() || !$('#startTime').val()
			|| !$('#endDateTime').val() || !$('#endTime').val()
		);
	};

	self.stuff = function() {
		console.log(self.incompleteFields());
	};
};

// initialize ViewModel and apply bindings
var model = new ViewModel();
ko.applyBindings(model);

var placeSearch, autocomplete;

function initAutocomplete() {
	// Create the autocomplete object, restricting the search to geographical
	// location types.

	autocomplete = new google.maps.places.Autocomplete(
    	/** @type {!HTMLInputElement} */(document.getElementById('eventLocation')),
    	{types: ['geocode']});
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(function(position) {
    		var geolocation = {
      			lat: position.coords.latitude,
      			lng: position.coords.longitude
    		};
    		var circle = new google.maps.Circle({
      			center: geolocation,
     			radius: position.coords.accuracy
    		});
    		autocomplete.setBounds(circle.getBounds());
  		});
	}
}

$('#eventModal').on('shown.bs.modal', function (e) {
  initAutocomplete();
});
