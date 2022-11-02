'use strict';

/* Controllers */

angular.module('sampleApp.controllers')

.controller('MainController',	[ '$scope', 'messageService', 'language', '$http',
	function ($scope, messages, language, $http) {

		$scope.language = language;
		$scope.user = {username:"daniel"};

        $scope.addMsg = function(transl8Key, level, showContactInfo) {
            messages.add(transl8Key, level, showContactInfo);
        }

        $scope.searchPathFunction = function(q){return 'some-search-path?q=' + q}

        $http.get('info/content.json').then(response => $scope.contentInfo = response.data);

	}
]);
