(function() {
    
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBctIBxc2iUkzIfQM7D8ZMbJi_9fHhnMUU",
        authDomain: "meetupeventplannerks.firebaseapp.com",
        databaseURL: "https://meetupeventplannerks.firebaseio.com",
        storageBucket: "meetupeventplannerks.appspot.com",
        messagingSenderId: "254221471142"
      };
      firebase.initializeApp(config);
    
    const formGroupName = $('#formGroupName');
    const textName = $('#textName');
    const formGroupEmail = $('#formGroupEmail');
    const textEmail = $('#textEmail');
    const formGroupPassword = $('#formGroupPassword');
    const textPassword = $('#textPassword');
    const textConfirmPassword = $('#textConfirmPassword');
    const formGroupConfirmPassword = $('#formGroupConfirmPassword');
    const btnLogIn = $('#btnLogIn');
    const btnSignUp = $('#btnSignUp');
    const linkLogInOrSignUp = $('#linkLogInOrSignUp');
    const spanMemberYet = $('#spanMemberYet');
    const formAuth = $('#formAuth');
    const displayFormIssues = $('#displayFormIssues');

    var firstInputIssues, secondInputIssues;
    var username, email, password;
    var newUser = false;
    const auth = firebase.auth();


    // change log in to sign up and vice versa
    linkLogInOrSignUp.click(function() {

        
        if ($(this).text() === 'Log In') {
            // User wants to log in
            // show button: btnLogIn  
            // hide formGroup: Name, ConfirmPassword, button: btnSignUp
            $(this).text('Sign Up');
            spanMemberYet.text('New to Meet-up Event Planner?  ');

            btnLogIn.removeClass('hide');
            formGroupName.addClass('hide');
            formGroupConfirmPassword.addClass('hide');
            btnSignUp.addClass('hide');

            
        } else {
            // User wants to sign up
            // show formGroup: Name, ConfirmPassword, button: btnSignUp
            // hide button: btnLogIn
            $(this).text('Log In');
            spanMemberYet.text('Already a Member?  ');

            formGroupName.removeClass('hide');
            formGroupConfirmPassword.removeClass('hide');
            btnSignUp.removeClass('hide');

            btnLogIn.addClass('hide');
        }
    });
    
    // Add login event
    btnLogIn.click(function() {
        email = textEmail.val();
        password = textPassword.val();
        const auth = firebase.auth(); 
        const promise = auth.signInWithEmailAndPassword(email, password); // returns a promise
        
        promise.then(function() {
            window.location.href = 'event.html';
        })
        .catch(function(e) {
            displayFormIssues.html(e.message);
        });        
    });
    
    // add log out function
    btnLogOut.click(function() {
        firebase.auth().signOut();
    })
    
    // Add signup event
    btnSignUp.click(function(){
        username = textName.val();
        email = textEmail.val();
        password = textPassword.val();
        const password2 = textConfirmPassword.val(); 

        // STARTS HERE
        /*
        Make an issue tracker for each input because some validation messages should
        end up on the first one, some on the second.
        */
        var firstInputIssuesTracker = new IssueTracker();
        var secondInputIssuesTracker = new IssueTracker();

        /*
        This steps through all of the requirements and adds messages when a requirement fails.
        Just checks the first password because the second should be the same when it runs.
        */
        function checkRequirements() {

            if (password.length < 6) {
                firstInputIssuesTracker.add("fewer than 6 characters");
            } else if (password.length > 100) {
                firstInputIssuesTracker.add("greater than 100 characters");
            }

            if (!password.match(/[\!\@\#\$\%\^\&\*]/g)) {
                firstInputIssuesTracker.add("missing a symbol (!, @, #, $, %, ^, &, *)");
            }

            if (!password.match(/\d/g)) {
                firstInputIssuesTracker.add("missing a number");
            }

            if (!password.match(/[a-z]/g)) {
                firstInputIssuesTracker.add("missing a lowercase letter");
            }

            if (!password.match(/[A-Z]/g)) {
                firstInputIssuesTracker.add("missing an uppercase letter");
            }

            var illegalCharacterGroup = password.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g)
            
            if (illegalCharacterGroup) {
                illegalCharacterGroup.forEach(function (illegalChar) {
                    firstInputIssuesTracker.add("includes illegal character: " + illegalChar);
                });
            }
        };

        /*
        Here's the first validation check. Gotta make sure they match.
        */
        if (password === password2 && password.length > 0) {
        /*
        They match, so make sure the rest of the requirements have been met.
         */
            checkRequirements();
        } else {
            secondInputIssuesTracker.add("Passwords must match!");
        }

        /*
        Get the validation message strings after all the requirements have been checked.
        */
        firstInputIssues = firstInputIssuesTracker.retrieve();
        secondInputIssues = secondInputIssuesTracker.retrieve();

        /*
        Let input.setCustomValidity() do its magic :)
        */
        
        textPassword[0].setCustomValidity(firstInputIssues);
        textConfirmPassword[0].setCustomValidity(secondInputIssues);

        if (firstInputIssues.length + secondInputIssues.length === 0) {

            newUser = true;
            
            const promise = auth.createUserWithEmailAndPassword(email, password); // returns a promise

            promise.catch(function(e) {
                displayFormIssues.html(e.message);
            });
        }        
    });

    // this prevents form from submitting but allows use of setCustomValidity
    formAuth.submit(function() {
        return false;        
    })
        
    // check for current user
    firebase.auth().onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            if (newUser) {
                firebaseUser.updateProfile({displayName: username});
                firebase.database().ref('users/' + firebaseUser.uid).set({
                    username: username,
                    email: email
                }).then(function() {
                    window.location.href = 'event.html';        
                });
            } else {
                    window.location.href = 'event.html';
            }
        } else {
            console.log('not logged in');
        }            
    });
    

    // a class that tracks any password issues
    function IssueTracker() {
      this.issues = [];
    }

    IssueTracker.prototype =   {
      add: function (issue) {
        this.issues.push(issue);
      },
      retrieve: function () {
        var message = "";
        switch (this.issues.length) {
          case 0:
            // do nothing because message is already ""
            break;
          case 1:
            message = "Please correct the following issue:\n" + this.issues[0];
            break;
          default:
            message = "Please correct the following issues:\n" + this.issues.join("\n");
            break;
        }
        return message;
      }
    };        
}());


