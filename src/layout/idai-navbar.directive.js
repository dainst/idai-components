'use strict';

/* Directives */
angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 */

    .directive('idaiNavbar', function() {
        return {
            restrict: 'E',
            scope: {
                userObject: '=',
                loginFunction: '&',
                logoutFunction: '&',
                hideSearchForm: '=',
                hideRegisterButton: '=', // set "true" to hide it
                hideContactButton: '=', // set "true" to hide it
                hideLanguageSwitcher: '=', // set "true" to hide it
                projectId: '@',
                searchScope: '=',
                contentInfo: '=',
            },
            templateUrl: 'layout/idai-navbar.html',
            transclude: true,
            controller: [ '$scope', 'localizedContent', '$window', 'language',
                function($scope, localizedContent, $window, language) {

                    $scope.langCode = language.currentLanguage();

                    $scope.getNavbarLinks = function(){

                        var navbarLinks = localizedContent.getNodeById($scope.contentInfo, 'navbar');

                        if (!navbarLinks) {
                            console.error('error: no navbar links found in file ' + $scope.contentInfo);
                        } else {
                            localizedContent.reduceTitles(navbarLinks);
                            $scope.dynamicLinkList = navbarLinks.children;
                        }
                    };

                    $scope.toggleNavbar = function() {

                            $scope.isCollapsed = true;
                            $scope.$on('$routeChangeSuccess', function () {
                                $scope.isCollapsed = true;
                            });
                    };

                    $scope.switchLanguage = function(lang) {
                        localStorage.setItem('lang', lang);
                        $window.location.reload();
                    };

                }],
            link: function(scope){
                scope.getNavbarLinks();
            }
        }});
