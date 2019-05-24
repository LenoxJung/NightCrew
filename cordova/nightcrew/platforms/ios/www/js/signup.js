/*
 *
 *   home.js
 *
 * */

// Controller
app.controller('SignupController', ['APIService', 'HelperService', function (APIService, HelperService){

    // Steps, step 1 is phone number, step 2 is age
    var step = 1;

    // Input
    var input_field = $('#input');

    // UI Elements
    var title = $('#title');
    var message = $('#message');
    var button = $('#button');

    // On button click
    button.click(function(){
        if (step === 1){
            // Check to see if phone number is valid
            if (input_field.val().length === 10){
                message.html("&nbsp;");
                window.localStorage.setItem("phone", input_field.val());
                title.html("When's your birthday?");
                button.html("Submit");
                input_field.attr("type", "date");
                step++;
            } else {
                message.html("Please enter your phone number.");
                input_field.focus();
            }
        } else if (step === 2){
            // Check to see if user filled out birthday
            if (input_field.val().length > 0){
                window.localStorage.setItem("dob", input_field.val());
                var user = {
                    fb_id: window.localStorage.getItem("fb_id"),
                    token: window.localStorage.getItem("token"),
                    expiry: window.localStorage.getItem("expiry"),
                    phone: window.localStorage.getItem("phone"),
                    dob: window.localStorage.getItem("dob")
                };
                APIService.create_user(user, function (response) {
                    // The response comes back with the session and user objects
                    HelperService.parse_and_save(response, function(){
                        window.location.href = "home.html";
                    });
                });
            } else{
                message.html("Please enter your birth date.");
            }
        }
    });

}]);
