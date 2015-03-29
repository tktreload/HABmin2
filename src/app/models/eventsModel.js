/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2015 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('HABmin.eventsModel', [
    'HABmin.userModel'
])

    .service('EventsService', function ($http, $q, UserService) {
        var feed;

        this.listen = function () {
            feed = new EventSource("/feed/1");
            feed.addEventListener("message", $scope.addMessage, false);
        }
    })
;