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

})();

// add log out function
	const btnLogOut = $('#btnLogOut');

    btnLogOut.click(function() {
        firebase.auth().signOut();
    })

// real time authentication listener
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
        model.init(firebaseUser);
        // TODO: show log out button when user is logged in
    } else {
        console.log('not logged in');
        // TODO: hide log out btn when no user is logged in
        window.location.href = 'index.html';
    }
});


var Event = function() {
	this.name = '';
	this.location = '';
	this.type = '';
	this.host = '';
	this.startDate = '';
	this.startTime = '09:00';
	this.endDate = '';
	this.endTime = '18:00';
	this.key = '';
	this.guests = [];
};


var ViewModel = function() {
	var self = this;
	
	
	self.fbEventsRef = {};
	self.currentEventIndex = -1;

	self.newEvent = new Event();

	self.eventList = ko.observableArray();
	self.currentGuestList = ko.observableArray();

	self.test = ko.observable(self.eventList);

	self.addEventBtn = $('#addEventBtn');
	self.updateEventBtn = $('#updateEventBtn');
	self.saveDraftBtn = $('#saveDraftBtn');
	self.deleteEventBtn = $('#deleteEventBtn');
	self.eventModalLabel = $('#eventModalLabel');
	self.eventModal = $('#eventModal');
	self.currentEvent = ko.observable();	


	self.init = function(user) {
		self.fbEventsRef = firebase.database().ref('users/' + user.uid + '/events/');
		self.syncRefWithView();
		$('#welcomeUser').html('Hello, ' + user.displayName + '!');
	}

	self.syncRefWithView = function(){
		try {
			self.fbEventsRef.on('child_added', function(event) {
				if (event.val()) {
					self.eventList().forEach(function(existedEvent) {
						if (event.val().key === existedEvent.key) return;
					});
					self.eventList.push(event.val());
				}

			});

			self.fbEventsRef.on('child_changed', function(event) {
				var updatedEvent = event.val();
				var index = self.currentEventIndex;
				
				self.eventList.splice(index , 1);
				self.eventList.splice(index , 0, updatedEvent);			
			});

			self.fbEventsRef.on('child_removed', function(event) {
				var index = self.currentEventIndex;
				self.eventList.splice(index , 1);
				alert('removed!');
			});		
		}
		catch(e) {
			console.log(e);
		}
	};

	// add guest to list
	self.addGuestToList = function(data, event) {

		if(event.keyCode === 13) {
			event.preventDefault();
			self.currentGuestList.push(event.target.value);
			event.target.value = "";
		}
		return true;
	};

	// remove guest from currentGuestList	
	self.removeGuest = function(clickedGuest) {
		self.currentGuestList.remove(clickedGuest);
	};

	self.addEvent = function() {

		if (self.incompleteFields()) return;

		var event = self.currentEvent();
		event.guests = [];

		self.currentGuestList().forEach(function(guest) {
			event.guests.push(guest);
		});

		var newEventKey = self.fbEventsRef.push().key;

		event.key = newEventKey;

		var updates = {};
		updates[newEventKey] = event;

		self.fbEventsRef.update(updates);

		self.newEvent = new Event();

		self.eventModal.modal('toggle');
	};

	self.updateEvent = function() {

		if (self.incompleteFields()) return;
		
		var event = self.currentEvent();
		event.guests = [];

		self.currentGuestList().forEach(function(guest) {
			event.guests.push(guest);
		});

		var updates = {};
		updates[event.key] = event;
		self.fbEventsRef.update(updates)
		.catch(function(e) {
			alert('Something went wrong, please try again later');
		});
	};

	self.saveDraft = function() {
		
		self.newEvent = self.currentEvent();
		
		self.newEvent.guests = [];

		self.currentGuestList().forEach(function(guest) {
			self.newEvent.guests.push(guest);
		});
	};

	self.deleteEvent = function() {
		var deleteEvent = self.fbEventsRef.child(self.currentEvent().key).remove();
		deleteEvent
		.catch(function(error) {
			console.log(error.message);
			alert('Something went wrong. Please try again');
		})
	};

	self.setEvent = function(clickedEvent) {

		self.currentEventIndex = self.eventList.indexOf(clickedEvent);

		self.addEventBtn.hide();
		self.saveDraftBtn.hide();

		self.deleteEventBtn.show();
		self.updateEventBtn.show();

		self.eventModalLabel.html('Edit Event');
		self.currentEvent(clickedEvent);
		self.currentGuestList.removeAll();

		clickedEvent.guests.forEach(function(guest) {

			self.currentGuestList.push(guest);
		});
	};

	self.newEventForm = function() {
		// clear value
		self.addEventBtn.show();
		self.saveDraftBtn.show();
		
		self.deleteEventBtn.hide();
		self.updateEventBtn.hide();

		self.addEventBtn.html('Add');
		self.eventModalLabel.html('Add a New Event');	
		self.currentEvent(self.newEvent);
		self.currentGuestList.removeAll();

		self.newEvent.guests.forEach(function(guest) {

			self.currentGuestList.push(guest);
		});
	};

	self.incompleteFields = function() {

		if (self.checkFields($('#eventName'))) return self.displayMessage('event name.');
		if (self.checkFields($('#eventLocation'))) return self.displayMessage('event location.');
		if (self.checkFields($('#eventType'))) return self.displayMessage('event type.');
		if (self.checkFields($('#eventHost'))) return self.displayMessage('event host.');
		if (self.checkFields($('#startDateTime'))) return self.displayMessage('event start date.');
		if (self.checkFields($('#startTime'))) return self.displayMessage('event start time.');
		if (self.checkFields($('#endDateTime'))) return self.displayMessage('event end date.');
		if (self.checkFields($('#endTime'))) return self.displayMessage('event end time.');

		if (self.currentGuestList().length === 0) {
			$('#guestInput').focus();
			self.displayMessage('at least one guest.');
			return true;
		}

		return false;
	};

	self.checkFields = function($inputElement) {

		if(!$inputElement.val()) {

			$inputElement.focus();

			return true;
		}
		
		return false;
	};

	self.displayMessage = function(message) {
		$('#incompleteFieldMsg').html('Missing field: Please enter ' + message);
		return true;
	};
};

// initialize ViewModel and apply bindings
var model = new ViewModel();
ko.applyBindings(model);