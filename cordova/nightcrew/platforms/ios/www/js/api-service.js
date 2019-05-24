/*

    API Service

*/

// Service declarations
function APIService(){

    // Globals
    var global_header = {
        nightcrew_token: nightcrew_token
    };

    // verify_nightcrew_token(nightcrew_token, done)
    // verifies that the local NC token is valid
    // API will respond with boolean { valid: true/false }, boolean is passed into the done callback
    this.verify_nightcrew_token = function(nightcrew_token, done){
        $.ajax({
            type: "POST",
            crossDomain: true,
            contentType: "application/json",
            url: "http://localhost:3000/session/verify",
            data: JSON.stringify(nightcrew_token)
        }).done(function (response) {
            console.log("APIService.verify_nightcrew_token() - valid: " + response.valid);
            done(response.valid);
        }).fail(function (error) {
            console.log("ERROR on APIService.verify_nightcrew_token()");
            console.log(error);
        });
    };
    
    // check_user_existence(fb_id, done)
    // checks to see if user exists in the DB
    // pass in fb_id, and function that will be called upon completion
    this.check_user_existence = function(fb_id, done){
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: "http://localhost:3000/user/exists?uid=" + fb_id
        }).done(function (response) {
            // Boolean is passed into the upon_complete function
            console.log("check_user_existence: " + response.user_exists);
            done(response.user_exists);
        }).fail(function (error) {
            console.log("ERROR on APIService.check_user_existence()");
            console.log(error);
        });
    };

    // get_places(done)
    // returns all places through JSON
    // callback function is done()
    this.get_places = function(done){
        $.ajax({
            type: "GET",
            crossDomain: true,
            url: "http://localhost:3000/places"
        }).done(function (response) {
            console.log("APIService.get_places() - API request came back");
            done(response);
        }).fail(function (error) {
            console.log("ERROR on APIService.get_places()");
            console.log(error);
        });
    };
    
    // create_user(user, done)
    // creates a user in the DB
    // first param is a user object, second is the callback function
    this.create_user = function(user, done){
        $.ajax({
            type: "POST",
            crossDomain: true,
            contentType: "application/json",
            url: "http://localhost:3000/user",
            data: JSON.stringify(user)
        }).done(function (response) {
            console.log("APIService.create_user() - Request came back.");
            done(response);
        }).fail(function (error) {
            console.log("ERROR on APIService.create_user()");
            console.log(error);
        });
    };

    // new_session(user, done)
    // creates a session in the DB, should return session and user info
    // first param is an authInfo object, second is the callback function
    this.new_session = function(authInfo, done){
        $.ajax({
            type: "POST",
            crossDomain: true,
            contentType: "application/json",
            url: "http://localhost:3000/sessions",
            data: JSON.stringify(authInfo)
        }).done(function (response) {
            console.log("APIService.new_session() - Request came back.");
            //console.log(response);
            done(response);
        }).fail(function (error) {
            console.log("ERROR on APIService.new_session()");
            console.log(error);
        });
    };

    // checkin(user_id, place_id, done)
    // creates a checkin in the db
    // responds with boolean value that is passed into callback
    this.checkin = function(user_id, place_id, done){
        $.ajax({
            type: "POST",
            crossDomain: true,
            headers: global_header,
            contentType: "application/json",
            url: "http://localhost:3000/place/" + place_id + "/checkin",
            data: JSON.stringify({
                user_id: user_id
            })
        }).done(function (response) {
            console.log("APIService.checkin() - checkedin: " + response.checkedin);
            done(response.checkedin);
        }).fail(function (error) {
            console.log("ERROR on APIService.checkin()");
            console.log(error);
        });
    };

    // checkout(user_id, place_id, done)
    // deletes a checkin in the db
    // responds with boolean value that is passed into callback
    this.checkout = function(user_id, place_id, done){
        $.ajax({
            type: "DELETE",
            crossDomain: true,
            headers: global_header,
            contentType: "application/json",
            url: "http://localhost:3000/place/" + place_id + "/checkin",
            data: JSON.stringify({
                user_id: user_id
            })
        }).done(function (response) {
            console.log("APIService.checkout() - checkedout: " + response.checkedout);
            done(response.checkedout);
        }).fail(function (error) {
            console.log("ERROR on APIService.checkout()");
            console.log(error);
        });
    };

    // get_checkins(user_id , done)
    // pass in user id, returns place_id's as an array
    // array is passed into callback
    this.get_checkins = function(user_id, done){
        $.ajax({
            type: "GET",
            crossDomain: true,
            headers: global_header,
            contentType: "application/json",
            url: "http://localhost:3000/user/" + user_id + "/checkins"
        }).done(function (response) {
            console.log("APIService.get_checkins() - places: " + response.places);
            done(response.places);
        }).fail(function (error) {
            console.log("ERROR on APIService.get_checkins()");
            console.log(error);
        });
    };

    // get_friends_checkins(user_id , done)
    // pass in user id, returns a places object containing places that in turn contain an array of checked in users
    // places object is passed into callback, format: { places: {"1": [{user_obj}, {user_obj}]} }
    this.get_friends_checkins = function(user_id, done){
        $.ajax({
            type: "GET",
            crossDomain: true,
            headers: global_header,
            contentType: "application/json",
            url: "http://localhost:3000/user/" + user_id + "/friends/checkins"
        }).done(function (response) {
            console.log("APIService.get_friends_checkins()");
            done(response.places);
        }).fail(function (error) {
            console.log("ERROR on APIService.get_friends_checkins()");
            console.log(error);
        });
    };

}

// Load service into app
app.service("APIService", APIService);
