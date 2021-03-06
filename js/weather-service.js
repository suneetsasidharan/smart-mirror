(function() {
    'use strict';

    function WeatherService($http) {
        var service = {};
        service.forcast = null;
        var geoloc = null;

        service.init = function(geoposition) {
            geoloc = geoposition;
            return $http.jsonp('https://api.forecast.io/forecast/'+FORCAST_API_KEY+'/'+geoposition.coords.latitude+','+geoposition.coords.longitude+'?units=si&callback=JSON_CALLBACK').
                then(function(response) {
                    return service.forcast = response;
                });
        };

        //Returns the current forcast along with high and low tempratures for the current day 
        service.currentForcast = function() {
            if(service.forcast === null){
                return null;
            }
            service.forcast.data.currently.day = moment.unix(service.forcast.data.currently.time).format('ddd');
            service.forcast.data.currently.temperature = Math.floor(service.forcast.data.currently.temperature);
            service.forcast.data.currently.apparentTemperature = Math.floor(service.forcast.data.currently.apparentTemperature);
            return service.forcast.data.currently;
        }

        service.weeklyForcast = function(){
            if(service.forcast === null){
                return null;
            }
            // Add human readable info to info
            for (var i = 0; i < service.forcast.data.daily.data.length; i++) {
                service.forcast.data.daily.data[i].day = moment.unix(service.forcast.data.daily.data[i].time).format('ddd');
                service.forcast.data.daily.data[i].temperatureMax = Math.floor(service.forcast.data.daily.data[i].temperatureMax);
                service.forcast.data.daily.data[i].temperatureMin = Math.floor(service.forcast.data.daily.data[i].temperatureMin);
            };
            return service.forcast.data.daily;
        }

        service.refreshWeather = function(){
            return service.init(geoloc);
        }
        
        return service;
    }

    angular.module('SmartMirror')
        .factory('WeatherService', WeatherService);

}());
