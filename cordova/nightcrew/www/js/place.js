// Place Controller
app.controller('PlaceController', ['$scope', 'APIService', 'HelperService', function ($scope, APIService, HelperService){

    // GET ID param from URL
    var id = HelperService.get_param("id");
    
    // Get friends who checked in
    var places = JSON.parse(window.localStorage.getItem("get_friends_checkins_cache"));
    var friendsCheckedIn = "";
    for (var user in places[id]){
        if (places[id].hasOwnProperty(user)){
            var userObj = places[id][user];
            friendsCheckedIn += "<div class='mui--divider-bottom'>" + "<img src='" + userObj['picture'] + "' style='border-radius: 50%' /> " + userObj['firstname'] + " " + userObj['lastname'] + "</div>";
        }
    }
    if (friendsCheckedIn.length > 1){
        var friendsCheckedInDiv = $('#friendsCheckedIn');
        var numFriends = places[id].length;
        friendsCheckedInDiv.css('display', 'block');
        if (numFriends == 1){
            $('#title').html(numFriends + " friend checked in");
        } else {
            $('#title').html(numFriends + " friends checked in");
        }
        friendsCheckedInDiv.append(friendsCheckedIn);
    }

    
    // Helper Func to disable check-in if user already checked in
    var disableCheckin = function(){
        APIService.get_checkins(window.localStorage.getItem("user_id"), function (place_ids_arr) {
            for (var i in place_ids_arr){
                if (place_ids_arr[i] == id){
                    var btn = $('#checkin-btn');
                    // Change button to check-out
                    btn.html('<span class="icon"><i class="fa fa-sign-out" aria-hidden="true"></i></span>Check out');
                    btn.removeClass('mui-btn--primary');
                    btn.addClass('mui-btn--danger');
                    break;
                }
            }
        });
    };

    // Try loading from cache, if not, load from API
    $scope.place = {};
    var places_cache = JSON.parse(window.localStorage.getItem("get_places_cache"));
    if (places_cache){
        $scope.place = function() {
            for (var i in places_cache) {
                if (places_cache[i].id == id) {
                    return places_cache[i];
                }
            }
        }();
        // Disable check-in if user already checked in
        disableCheckin();
    } else {
        APIService.get_places(function(response){
            $scope.place = function() {
                for (var i in response.places) {
                    if (response.places[i].id == id) {
                        return response.places[i];
                    }
                }
            }();
            $scope.$apply();
            // Disable check-in if user already checked in
            disableCheckin();
        });
    }

    // Venues Button
    $scope.goVenues = function(){
        window.plugins.nativepagetransitions.slide({
            "direction": "right",
            "href": 'home.html?tab=venues#place-' + id
        });
    };

    // Guestlist Button
    $scope.requestGuestlist = function(place_id){
        window.plugins.nativepagetransitions.slide({
            "direction": "left",
            "href": 'request-guestlist.html?place_id=' + place_id
        });
    };
    
    // Get Directions Button
    $scope.getDirections = function(){
        launchnavigator.navigate([$scope.place.lat, $scope.place.lng]);
    };

    // Checkin Function
    var checkInFunc = function(place_id, place_name){
        navigator.notification.confirm("You will remain checked in until 5 AM.", function(buttonIndex){
            if (buttonIndex == 1){
                var user_id = window.localStorage.getItem("user_id");
                APIService.checkin(user_id, place_id, function (checked_in) {
                    if (checked_in){
                        navigator.notification.alert("You have been checked in.", function(){
                            // Change button to check-out
                            var btn = $('#checkin-btn');
                            btn.html('<span class="icon"><i class="fa fa-sign-out" aria-hidden="true"></i></span>Check out');
                            btn.removeClass('mui-btn--primary');
                            btn.addClass('mui-btn--danger');
                        }, "Success");
                    }
                });
            }
        }, "Check-in to " + place_name + "?", ["Yes", "No"]);
    };

    // Checkout Function
     var checkOutFunc = function(place_id, place_name){
        navigator.notification.confirm("Check out of " + place_name + "?", function (buttonIndex) {
            if (buttonIndex == 1){
                var user_id = window.localStorage.getItem("user_id");
                APIService.checkout(user_id, place_id, function (checked_out) {
                    if (checked_out){
                        navigator.notification.alert("You have checked out of " + place_name + ".", function () {
                            // Change to check-in
                            var btn = $('#checkin-btn');
                            btn.html('<span class="icon"><i class="fa fa-map-marker" aria-hidden="true"></i></span>Check In');
                            btn.removeClass('mui-btn--danger');
                            btn.addClass('mui-btn--primary');
                        }, "Checked out");
                    }
                });
            }
        });
    };

    // Checkin/Checkout Button
    $scope.checkInButton = function(place_id, place_name){
        // Check state of button, if it's checkin or checkout
        if ($('#checkin-btn').hasClass('mui-btn--primary')){
            checkInFunc(place_id, place_name);
        } else {
            checkOutFunc(place_id, place_name);
        }
    };

}]);
