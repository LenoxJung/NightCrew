/*

 index.js

 */

// Login Controller
//          -- Remember to inject any dependencies and/or services
app.controller('LoginController', ['$scope', 'APIService', 'HelperService', function($scope, APIService, HelperService){

    // Check for local nightcrew_token
    if (nightcrew_token){
        // redirect to home if logged in, verify authenticity of token later in home.html to avoid delay
        window.location.href = "home.html";
    }

    // Login w/ Facebook Button
    $scope.loginButtonClicked = function(){
        console.log("Login button clicked");
        facebookConnectPlugin.login(['public_profile', 'user_friends', 'email', 'user_birthday'],
            function(success){
                // Login was successful, grab auth info
                var authInfo = {
                    token: success.authResponse.accessToken,
                    expiry: success.authResponse.expiresIn,
                    fb_id: success.authResponse.userID
                };
                // Store auth info in local storage
                window.localStorage.setItem("token", authInfo.token);
                window.localStorage.setItem("expiry", authInfo.expiry);
                window.localStorage.setItem("fb_id", authInfo.fb_id);
                // Check DB to see if user is registered
                APIService.check_user_existence(authInfo.fb_id, function(user_exists){
                    if (user_exists){
                        // User exists in DB, so grab user info and redirect to home
                        APIService.new_session(authInfo, function(response){
                            HelperService.parse_and_save(response, function(){
                                window.location.href = "home.html";
                            });
                        })
                    } else {
                        // User doesn't exist, so go through sign-up flow
                        window.location.href = "signup.html";
                    }
                });
            },
            function(failure){
                // Login failed
                console.log(failure);
            });
    };
    
    /*
    $('#facebookLoginButton').click(function() {
        console.log("Login button clicked");
        facebookConnectPlugin.login(['public_profile', 'user_friends', 'email', 'user_birthday'],
            function(success){
                // Login was successful, grab auth info
                var authInfo = {
                    token: success.authResponse.accessToken,
                    expiry: success.authResponse.expiresIn,
                    fb_id: success.authResponse.userID
                };
                // Store auth info in local storage
                window.localStorage.setItem("token", authInfo.token);
                window.localStorage.setItem("expiry", authInfo.expiry);
                window.localStorage.setItem("fb_id", authInfo.fb_id);
                // Check DB to see if user is registered
                APIService.check_user_existence(authInfo.fb_id, function(user_exists){
                    if (user_exists){
                        // User exists in DB, so grab user info and redirect to home
                        APIService.new_session(authInfo, function(response){
                            HelperService.parse_and_save(response, function(){
                                window.location.href = "home.html";
                            });
                        })
                    } else {
                        // User doesn't exist, so go through sign-up flow
                        window.location.href = "signup.html";
                    }
                });
            },
            function(failure){
                // Login failed
                console.log(failure);
            });
    });*/

}]);
