angular
  .module('LocationCtrl', [])
  .controller('LocationCtrl', LocationCtrl);

LocationCtrl.$inject = [$scope, $ionicPlatform, $interval, locationServices];

function LocationCtrl($scope, $ionicPlatform, $interval, locationServices) {
  console.log('LocationCtrl Loaded.');

  var vm = this;

  vm.callback = callback;
  vm.location = {};

  // Options for BackgroundGeoLocation
  var backgroundOptions = {
    notificationText: 'DISABLED',
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false, // enable to hear sound for bg-gps lifecycle
    stopOnTerminate: false // enable to clear bg-gps settings when app terminates
  };

  $ionicPlatform.ready(readyPlatform);
  $scope.$on('$ionicView.enter', enterViewController);

  ///////////////

  function callback() {
    console.log('Inside Callback');
    $scope.$apply(function() {
      vm.location = locationServices.getPosition();
      console.log('Location: ', vm.location);
    });
  }

  function readyPlatform() {
    vm.interval = $interval(function() {
      locationServices.checkLocation(callback);
    }, 1000);

    // startBgGPS();
  }

  function enterViewController() {
    console.log("Entered View; enabled Controller");

    if (angular.isDefined(vm.interval)) {
      $interval.cancel(vm.interval);
      vm.interval = undefined;
    }

    vm.interval = $interval(function() {
      locationServices.checkLocation(callback);
    }, 1000);
  }

  function startBgGPS() {
    backgroundGeoLocation.configure(backgroundCall, backgroundFail, backgroundOptions);
    backgroundGeoLocation.start();

    function backgroundCall(location) {
      console.log('Background Location Call: ', location);
      backgroundGeoLocation.finish();
    }

    function backgroundFail(error) {
      console.log('backgroundGeolocation error: ', error);
    }
  }
}
