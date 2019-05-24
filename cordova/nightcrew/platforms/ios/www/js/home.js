/*
 *
 *   home.js
 *
 * */

// Navigation Controller
app.controller('NavigationController', ['HelperService', '$scope', 'APIService', function (HelperService, $scope, APIService) {

    // Default tab is 'invite' so no param passed in will render invite
    var tab = HelperService.get_param("tab");

    var deactivateInviteTab = function(){
        $('#invite-pane').removeClass("mui--is-active");
        $('#invite-tab').removeClass("mui--is-active");
    };

    $scope.activateVenuesTab = function(){
        deactivateInviteTab();
        $('#venues-pane').addClass("mui--is-active");
        $('#venues-tab').addClass('mui--is-active');
    };
    
    if (tab === "venues"){
        $scope.activateVenuesTab();
    } else if (tab === "guestlist"){
        deactivateInviteTab();
        $('#guestlist-pane').addClass("mui--is-active");
        $('#guestlist-tab').addClass('mui--is-active');
    } else if (tab === "profile"){
        deactivateInviteTab();
        $('#profile-pane').addClass("mui--is-active");
        $('#profile-tab').addClass('mui--is-active');
    }

    // Verify authenticity of NC token
    APIService.verify_nightcrew_token(nightcrew_token, function (isTokenValid) {
       if (!isTokenValid){
           window.localStorage.clear();
           window.location.href = "index.html";
       }
    });

}]);

// Places Controller
app.controller('PlacesController', ['$scope', 'APIService', function ($scope, APIService){

    // Load Places, try from cache
    $scope.places = [];
    var places_cache = window.localStorage.getItem("get_places_cache");
    if (places_cache) {
        $scope.places = JSON.parse(places_cache);
    }
    // Load from API
    APIService.get_places(function(response){
        $scope.places = response.places;
        window.localStorage.setItem("get_places_cache", JSON.stringify(response.places));
        $scope.$apply();
        // Disable check-in if user already checked in
        APIService.get_checkins(window.localStorage.getItem("user_id"), function (place_ids_arr) {
            for (var i in place_ids_arr){
                var btn = $('#' + place_ids_arr[i]);
                btn.attr("disabled", "");
                btn.html("Checked In");
            }
            APIService.get_friends_checkins(window.localStorage.getItem("user_id"), function (places) {
                // Store data in cache
                window.localStorage.setItem("get_friends_checkins_cache", JSON.stringify(places));
                for (var place_id in places){
                    if (places.hasOwnProperty(place_id)){
                        var checkinNum = places[place_id].length;
                        if (checkinNum === 1){
                            $('span .' + place_id).html(checkinNum + " friend checked in");
                        } else {
                            $('span .' + place_id).html(checkinNum + " friends checked in");
                        }
                    }
                }
            });
        });
    });

    // Nav function for slide effect
    $scope.navigateToPlaceByID = function(id){
        window.plugins.nativepagetransitions.slide({
            "direction": "left",
            "href": "place.html?id=" + id
        });
    };

    // Search box
    var search_field = $('#search-bar');
    var icon = search_field.attr("placeholder");
    search_field.on('focusin', function () {
        search_field.attr("placeholder", " ");
    });
    search_field.on('focusout', function () {
        search_field.attr("placeholder", icon);
    });

    // Checkin Button
    $scope.checkInButton = function(place_id, place_name){
        navigator.notification.confirm("You will remain checked in until 5 AM.", function(buttonIndex){
            if (buttonIndex == 1){
                var user_id = window.localStorage.getItem("user_id");
                APIService.checkin(user_id, place_id, function (checked_in) {
                    if (checked_in){
                        navigator.notification.alert("You have been checked in.", function(){
                            $('#' + place_id).attr("disabled", "");
                        }, "Success");
                    }
                });
            }
        }, "Check-in to " + place_name + "?", ["Yes", "No"]);
    };

    // Friends checked in button
    $scope.viewCheckedinFriends = function(place_id){
        var places = JSON.parse(window.localStorage.getItem("get_friends_checkins_cache"));
        var list = "";
        for (var user in places[place_id]){
            if (places[place_id].hasOwnProperty(user)){
                var userObj = places[place_id][user];
                list += "<div class='mui--divider-bottom'>" + "<img src='" + userObj['picture'] + "' style='border-radius: 50%' /> " + userObj['firstname'] + " " + userObj['lastname'] + "</div>";
            }
        }
        window.localStorage.setItem("checkInFriendsFor" + place_id, list);
        if (places[place_id]){
            window.plugins.nativepagetransitions.slide({
                "direction": "left",
                "href": "friends.html?id=" + place_id
            });
        }
    };
    
}]);

// Profile Controller
app.controller('ProfileController', ['$scope', function ($scope){

    // TODO: move this into profile controller
    $scope.phone = window.localStorage.getItem("phone");
    $scope.dob = window.localStorage.getItem("dob");

}]);

