var Event = function() {
	this.name = ko.observable();
	this.location = ko.observable();
	this.type = ko.observable();
	this.host = ko.observable();
	this.startDate = ko.observable();
	this.startTime = ko.observable();
	this.endDate = ko.observable();
	this.endTime = ko.observable();
	this.guests = ko.observableArray([]);
};

var ViewModel = function() {
	var self = this;

	self.selectedGuest = null;
	self.eventList = ko.observableArray([]);
	self.currentGuestList = ko.observableArray([{name: 'Steve Jobs'}, {name: 'Elon Musk'}]);

	// add guest to list
	self.addGuestToList = function(data, event) {
		if(event.keyCode === 13) {
			self.currentGuestList.push({name: event.target.value});
			event.target.value = "";
		}
		return true;
	};

	// remove guest from currentGuestList	
	self.removeGuest = function() {
		var order = self.currentGuestList().indexOf(this);
    	var selectedGuest = self.currentGuestList()[order];
    	self.currentGuestList.remove(selectedGuest);
	}
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

$('#saveEventBtn').click(function() {
	var event = new Event();
	event.name = $('#eventName').val();
	event.location = $('#eventLocation').val();
	event.type = $('#eventType').val();
	event.host = $('#eventHost').val();
	event.startDate = $('#startDateTime').val();
	event.startTime = $('#startTime').val();
	event.endDate = $('#endDateTime').val();
	event.endTime = $('#endTime').val();
});

// index.html page
var signUp = $('#sign-up-button');

signUp.click(function() {
	window.location.href = 'event.html';
});
