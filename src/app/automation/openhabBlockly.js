/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2015 Chris Jackson (chris@cd-jackson.com)
 */
angular.module("openhabBlockly", [])
    .provider("openhabBlockly", function () {
        this.options = {
            path: "assets/",
            trashcan: true,
            toolbox: []
        };

        this.$get = function () {
            var localOptions = this.options;
            return {
                getOptions: function () {
                    return localOptions;
                }
            };
        };

        this.setOptions = function (options) {
            this.options = options;
        };
    })

    .service('openhabBlockly', function ($timeout) {
        'use strict';
        var me = this;
        this.holdoffChanges = false;
        this.setWorkspace = function (workspace) {
            if (Blockly.getMainWorkspace() != null && Blockly.getMainWorkspace().topBlocks_.length != 0) {
                Blockly.getMainWorkspace().clear();
            }
            Blockly.JSON.setWorkspace(Blockly.getMainWorkspace(), workspace);

            // Blockly sends an immediate change - we want to filter this out
            me.holdoffChanges = true;
        };

        this.clearWorkspace = function () {
            if (Blockly.getMainWorkspace() != null && Blockly.getMainWorkspace().topBlocks_.length != 0) {
                Blockly.getMainWorkspace().clear();
            }

            // Blockly sends an immediate change - we want to filter this out
            me.holdoffChanges = true;
        };

        this.getWorkspace = function () {
            return Blockly.JSON.workspaceToObject(Blockly.getMainWorkspace());
        };

        this.setToolbox = function (toolbox) {
//            return Blockly.JSON.getWorkspace(Blockly.getMainWorkspace());
        };

        this.onChange = function (callback) {
            Blockly.addChangeListener(function () {
                if (me.holdoffChanges === false) {
                    // Send a notification
                    callback();
                }
                else {
                    me.holdoffChanges = false;
                    console.log("Change, but on hold-off");
                }
            })
        };
    })

    .directive('ngBlockly', function ($window, $timeout, $rootScope, openhabBlockly) {
        return {
            restrict: 'E',
            scope: { // Isolate scope
            },
            template: '<div style="height:100%" class="ng-blockly"></div>',
            link: function ($scope, element, attrs) {
                var options = {
                    pathToMedia: 'assets/',
                    sounds: false,
                    trashcan: true,
                    toolbox: '<xml>' +
                    '<category name="Logic" id="toolbox-green">' +
                    '<block type="controls_if"></block>' +
                    '<block type="logic_compare"></block>' +
                    '<block type="logic_operation"></block>' +
                    '<block type="logic_negate"></block>' +
                    '<block type="logic_ternary"></block>' +
                    '<block type="logic_boolean"></block>' +
                    '</category>' +
                    '<category name="Loops" id="toolbox-blue">' +
                    '<block type="controls_repeat_ext">' +
                    '<value name="TIMES">' +
                    '<block type="math_number">' +
                    '<field name="NUM">10</field>' +
                    '</block>' +
                    '</value>' +
                    '</block>' +
                    '</category>' +
                    '<category name="Math" id="toolbox-blue1">' +
                    '<block type="math_number"></block>' +
                    '<block type="math_arithmetic"></block>' +
                    '<block type="math_constrain"></block>' +
                    '<block type="math_constant"></block>' +
                    '<block type="math_trig"></block>' +
                    '<block type="math_number_property"></block>' +
                    '<block type="math_change"></block>' +
                    '</category>' +
                    '<category name="OpenHAB">' +
                    '<block type="openhab_rule"></block>' +
                    '</category>' +
                    '<sep></sep>' +
                    '<category name="Variables" custom="VARIABLE"></category>' +
                    '</xml>'
                };
                Blockly.inject(element.children()[0], options);

                $scope.$on('$destroy', function () {
                    console.log("destroy");
                    Blockly.getMainWorkspace().dispose();
                });
            }
        };
    });
