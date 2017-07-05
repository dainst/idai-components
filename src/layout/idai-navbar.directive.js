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
				getSearchPathFn: '='
			},
			templateUrl: 'layout/idai-navbar.html',
			transclude: true,
			controller: [ '$scope', '$http', 'localizedContent', '$location', '$window',
				function($scope, $http, localizedContent, $location, $window) {
$scope.getSearchPathFn2 = "du hund!"
					$scope.langCode = localStorage.getItem('lang');

					$scope.getNavbarLinks = function(contentDir){

                        var contentInfo = 'info/content.json';

						$http.get(contentInfo).then(function(success){

							var navbarLinks = localizedContent.getNodeById(success.data,'navbar');

							if (!navbarLinks) {
								console.error('error: no navbar links found in file ' + contentInfo);
							} else {
                                localizedContent.reduceTitles(navbarLinks);
                                $scope.dynamicLinkList = navbarLinks.children;
							}
						}, function(error) {
							console.error(error.data)
						});
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
			link: function(scope,element,attrs){
				scope.getNavbarLinks(attrs.contentDir);
			}
		}});