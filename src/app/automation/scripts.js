/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014-2015 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('HABmin.scripts', [
    'ui.router',
    'ui.bootstrap',
    'ui.ace',
    'ngLocalize',
    'angular-growl',
    'HABmin.ruleModel',
    'HABmin.userModel',
    'ResizePanel',
    'HABmin.restModel'
])

    .config(function config($stateProvider) {
        $stateProvider.state('scripts', {
            url: '/scripts',
            views: {
                "main": {
                    controller: 'AutomationScriptCtrl',
                    templateUrl: 'automation/scripts.tpl.html'
                }
            },
            data: {pageTitle: 'Scripts'},
            resolve: {
                // Make sure the localisation files are resolved before the controller runs
                localisations: function (locale) {
                    return locale.ready('habmin');
                }
            }
        });
    })

    .controller('AutomationScriptCtrl',
    function AutomationScriptCtrl($scope, locale, growl, RuleModel, UserService, $timeout) {
        $scope.codeRules = [];
        $scope.rulesTotal = -1;
        $scope.isDirty = false;
        $scope.selectedRule = null;
        $scope.aceOptions = {
            useWrapMode: false,
            showGutter: true,
            theme: 'tomorrow',
            mode: 'javascript',
            onLoad: function (editor) {
                $scope.aceEditor = editor;
            }
        };

        // Align the Ace Editor theme with the Bootstrap theme
        function setTheme(theme) {
            console.log("Set Ace theme");
            switch (UserService.getTheme()) {
                case 'slate':
                    $scope.aceOptions.theme = 'tomorrow_night_bright';
                    break;
                default:
                    $scope.aceOptions.theme = 'tomorrow';
                    break;
            }
        }

        $scope.$on('habminTheme', function (event, theme) {
            console.log("habminTheme event", theme);
            setTheme(theme);
        });

        setTheme(UserService.getTheme());

        var restoreRule = null;

        // ------------------------------------------------
        // Load model data

        // Load the list of rules
        RuleModel.getList().then(
            function (rules) {
                if (rules != null) {
                    $scope.codeRules = rules;
                }
                $scope.rulesTotal = $scope.codeRules.length;
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
            }
        }

        $scope.selectRule = function (rule) {
            $scope.selectedRule = rule;

            handleDirtyNotification();

            RuleModel.getRule(rule.name).then(
                function (rule) {
                    restoreRule = rule;
                    $scope.codeEditor = rule.source;
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
            $scope.codeEditor = "";
            $scope.isDirty = false;
            $scope.selectedRule = null;
        };

        $scope.saveRule = function () {
            if ($scope.selectedRule !== null) {
                rule.id = $scope.selectedRule.id;
            }

            return;
            DesignerModel.putRule(rule).then(function (result) {
                $scope.selectedRule = result;
                $scope.isDirty = false;
            });
        };

        $scope.cancelRule = function () {
            if (restoreRule == null) {
                return;
            }
            $scope.codeEditor = restoreRule.source;
            $scope.isDirty = false;
        };

        $scope.deleteRule = function () {
            DesignerModel.deleteRule($scope.selectedRule.id).then(function () {
                $scope.codeEditor = "";
                $scope.selectedRule = null;
                restoreRule = null;
                $scope.isDirty = false;
            });
        };

        // ------------------------------------------------
        // Private functions


    })

;
