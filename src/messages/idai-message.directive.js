'use strict';

angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 */

.directive('idaiMessage', function() {
    return {
        restrict: 'E',
        templateUrl: 'messages/idai-message.html',
        controller: [ '$scope', 'message',
            function($scope,message) {

                $scope.messages = message.getMessages();

                $scope.removeMessage = function(transl8Key){
                    message.removeMessage(transl8Key)
                };

            }]
    }});