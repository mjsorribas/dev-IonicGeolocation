angular
  .module('locationServices', [])
  .factory('locationServices', locationServices);

function locationServices() {
  console.log('locationServices Loaded.');

  var data = {GPSEnabled: false};

  return {
    checkLocation: checkLocation,
    getPosition: getPosition,
    isGPSEnabled: isGPSEnabled
  };

  ///////////////////////

  function getPosition() {
    return new Object({
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      speed: data.speed,
      GPSEnabled: data.GPSEnabled
    });
  }

  function checkLocation(callback) {
    console.log('checkLocation function called.');

    var options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(showPosition, showError, options);

    function showError(error) {
      data.GPSEnabled = false;

      if (error.code == 1) {
        // Permissions Denied
        console.log('Location service denied permissions.');
        data.GPSEnabled = false;
      } else if (error.code == 2) {
        // GPS cannot get location
        console.log('Unable to get location');
      } else if (error.code == 3) {
        // GPS timed-out
        console.log('Unable to get location (timeout)');
      } else {
        console.log('Unknown error');
      }

      // Inform controller, query complete
      callback();
    }

    function showPosition(position) {
      data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        GPSEnabled: true
      };

      // Inform controller position determined
      callback();
    }
  }

  function isGPSEnabled() {
    return data.GPSEnabled;
  }
}
