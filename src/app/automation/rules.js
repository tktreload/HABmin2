/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2015 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('HABmin.rules', [
    'ui.router',
    'ui.bootstrap',
    'ngLocalize',
    'angular-growl',
    'openhabBlockly',
    'HABmin.ruleModel',
    'HABmin.designerModel',
    'HABmin.userModel',
    'ResizePanel',
    'HABmin.restModel'
])

    .config(function config($stateProvider) {
        $stateProvider.state('rules', {
            url: '/rules',
            views: {
                "main": {
                    controller: 'AutomationRuleCtrl',
                    templateUrl: 'automation/rules.tpl.html'
                }
            },
            data: {pageTitle: 'Rules'},
            resolve: {
                // Make sure the localisation files are resolved before the controller runs
                localisations: function (locale) {
                    return locale.ready('habmin');
                }
            }
        });
    })

    .controller('AutomationRuleCtrl',
    function AutomationRuleCtrl($scope, locale, growl, DesignerModel, UserService, openhabBlockly, $timeout) {
        var newDesign = [
            {
                type: 'openhab_rule',
                deletable: false,
                movable: false,
                fields: [
                    {name: "NAME", value: locale.getString('habmin.ruleNewRuleTitle')}
                ]
            }
        ];

        $scope.blockRules = [];
        $scope.rulesTotal = -1;
        $scope.isDirty = false;
        $scope.selectedRule = null;

        var restoreRule = null;

        // ------------------------------------------------
        // Load model data

        // Load the list of designs
        DesignerModel.getList().then(
            function (rules) {
                if (rules != null) {
                    $scope.blockRules = rules;
                    $scope.rulesTotal = $scope.blockRules.length;
                }
            },
            function (reason) {
                // handle failure
                growl.warning(locale.getString('habmin.ruleErrorLoadingRuleList'));
                $scope.rulesTotal = 0;
            }
        );

        // ------------------------------------------------
        // Event Handlers

        var onChangeWrapper = null;
        $scope.$on('$destroy', function () {
            // Make sure that the callback is destroyed too
//            openhabBlockly.offChange(onChangeWrapper);
//            onChangeWrapper = null;
        });

        function handleDirtyNotification() {
            if (onChangeWrapper == null) {
                onChangeWrapper = true;
                openhabBlockly.onChange(function () {
                    $scope.isDirty = true;
                    $scope.$apply();
                });
            }
        }

        $scope.selectBlock = function (rule) {
            $scope.selectedRule = rule;

            handleDirtyNotification();

            DesignerModel.getRule(rule.id).then(
                function (rule) {
                    restoreRule = rule;
                    if (rule.block === undefined || rule.block === null) {
                        rule.block = newDesign;
                    }
                    openhabBlockly.setWorkspace({block: rule.block});
                    $scope.isDirty = false;
                },
                function (reason) {
                    // handle failure
                    growl.warning(locale.getString('habmin.ruleErrorLoadingRule', [rule.name, reason]));
                }
            );
        };

        $scope.newRule = function () {
            handleDirtyNotification();
            openhabBlockly.setWorkspace({block: newDesign});
            $scope.isDirty = false;
            $scope.selectedRule = null;
            restoreRule = {block: newDesign};
        };

        $scope.saveRule = function () {
            var rule = {};
            // Read the blocks. If it's not defined, then set to a new rule
            if (openhabBlockly.getWorkspace() != null) {
                rule.block = openhabBlockly.getWorkspace().block[0];
            }
            else {
                rule.block = newDesign;
            }
            if ($scope.selectedRule !== null) {
                rule.id = $scope.selectedRule.id;
            }

            rule.name = "";
            if (rule.block.type === "openhab_rule") {
                rule.name = rule.block.fields[0].value;
            }

            DesignerModel.putRule(rule).then(function (result) {
                $scope.selectedRule = result;
                $scope.isDirty = false;
            });
        };

        $scope.cancelRule = function () {
            if (restoreRule == null) {
                return;
            }
            openhabBlockly.setWorkspace(restoreRule);
            $scope.isDirty = false;
        };

        $scope.deleteRule = function () {
            DesignerModel.deleteRule($scope.selectedRule.id).then(function () {
                openhabBlockly.clearWorkspace();
                $scope.selectedRule = null;
                restoreRule = null;
                $scope.isDirty = false;
            });
        };

        // ------------------------------------------------
        // Private functions


    })

;
