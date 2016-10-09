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

var newEvent = 	{
	name: "",
	location: "",
	type: "",
	host: "",
	startDate: "",
	startTime: "",
	endDate: "",
	endTime: "",
	guests: []
};

var ViewModel = function() {
	var self = this;

	var order = null;
	var selectedEvent = null;

	self.eventList = ko.observableArray();

	self.saveEventBtn = $('#saveEventBtn');
	self.eventName = $('#eventName');
	self.eventLocation = $('#eventLocation');
	self.eventType = $('#eventType');
	self.eventHost = $('#eventHost');
	self.startDateTime = $('#startDateTime');
	self.startTime = $('#startTime');
	self.endDateTime = $('#endDateTime');
	self.endTime = $('#endTime');

	initialEvents.forEach(function(event) {
		self.eventList.push(new Event(event));
	});

	self.currentEvent = ko.observable(self.eventList()[0]);

	self.currentGuestList = ko.observableArray();

	// add guest to list
	self.addGuestToList = function(data, event) {
		if(event.keyCode === 13) {
			self.currentGuestList.push(event.target.value);
			event.target.value = "";
		}
		return true;
	};

	// remove guest from currentGuestList	
	self.removeGuest = function() {
		var order = self.currentGuestList().indexOf(this);
		console.log(order);
    	// var selectedGuest = self.currentGuestList()[order];
		// self.currentGuestList.remove();
	};

	self.saveEvent = function() {
		// if it is a new event
		if (self.saveEventBtn.html() === 'Add') {

		} else {
			// save event

		}
	};

	self.setEvent = function(clickedEvent) {
		// change the button text to 'Save'
		self.saveEventBtn.html('Save');
		self.currentEvent(clickedEvent);
	};

	self.addNewEvent = function() {
		// clear value
		self.saveEventBtn.html('Add');
		self.currentEvent(new Event(newEvent));
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

// index.html page
var signUp = $('#sign-up-button');

signUp.click(function() {
	window.location.href = 'event.html';
});
