/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('habminChart', [
    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.datepicker',
    'ngLocalize',
    'angular-growl',
    'HABmin.persistenceModel',
    'HABmin.chartModel',
    'HABmin.chartSave',
    'HABmin.iconModel',
    'ngVis',
    'ngConfirmClick',
    'ResizePanel',
    'SidepanelService'
])
    .directive('habminChart', function ($window, $modal, $rootScope, $timeout, $parse) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {





            }
        }
    })
;