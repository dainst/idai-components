'use strict';

/* Directives */
angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
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
				projectId: '@'
			},
			templateUrl: 'layout/idai-navbar.html',
			controller: [ '$scope', '$http', 'localizedContent', '$location',
				function($scope, $http, localizedContent, $location) {

					$scope.getNavbarLinks = function(contentDir){
						$http.get('info/content.json').success(function(data){
							var navbarLinks = localizedContent.getNodeById(data,'navbar');
							if (navbarLinks==undefined) {console.log('error: no navbarLinks found');}
							localizedContent.reduceTitles(navbarLinks)
							$scope.dynamicLinkList=navbarLinks.children;
						});
					};

					$scope.toggleNavbar = function() {

							$scope.isCollapsed = true;
							$scope.$on('$routeChangeSuccess', function () {
								$scope.isCollapsed = true;
							});
					};
					
				}],
			link: function(scope,element,attrs){
				scope.getNavbarLinks(attrs.contentDir);
			}
		}});