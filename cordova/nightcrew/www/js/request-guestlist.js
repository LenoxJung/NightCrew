// Place Controller
app.controller('GuestlistController', ['$scope', 'APIService', 'HelperService', function ($scope, APIService, HelperService){

    // Get place ID
    var place_id = HelperService.get_param("place_id");

    // Init Vars
    $scope.title = "When are you going?";
    var inputFielld = $('#input');
    inputFielld.focus();


    // Back Button
    $scope.goBack = function(){
        window.plugins.nativepagetransitions.slide({
            "direction": "right",
            "href": 'place.html?id=' + place_id
        });
    };

    

}]);
