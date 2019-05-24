// Friends Controller
app.controller('FriendsController', ['$scope', 'APIService', 'HelperService', function ($scope, APIService, HelperService){

    // Load List of friends
    var place_id = HelperService.get_param("id");
    data = window.localStorage.getItem("checkInFriendsFor" + place_id);
    $('#place-body-container').html("<br><br>" + data);

    // Venues Button
    $scope.goVenues = function(){
        window.plugins.nativepagetransitions.slide({
            "direction": "right",
            "href": 'home.html?tab=venues'
        });
    };

}]);
