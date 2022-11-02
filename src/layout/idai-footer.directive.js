'use strict';

angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 */

    .directive('idaiFooter', function () {
        return {
            restrict: 'E',
            scope: {
                institutions: '=',
                version: '@',
                contentInfo: '=',
            },
            transclude: true,
            templateUrl: 'layout/idai-footer.html',
            controller: ['$scope', 'localizedContent', '$transclude', 'componentsSettings',
                function ($scope, localizedContent, $transclude, componentsSettings) {

                    $scope.dataProtectionPolicyUri = componentsSettings.dataProtectionPolicyUri;
                    $scope.mailto = componentsSettings.mailTo;

                    $transclude(function(clone){
                        $scope.hasTranscludedContent = (clone.length > 0);
                    });

                    $scope.date = new Date();
                    $scope.getFooterLinks = function () {

                        var footerLinks = localizedContent.getNodeById($scope.contentInfo, 'footer');

                        if (!footerLinks) {
                            console.error('error: no footer links found in file ' + $scope.contentInfo);
                        } else {
                            localizedContent.reduceTitles(footerLinks);
                            $scope.dynamicLinkList = footerLinks.children;
                        }
                    }
                }],
            link: function (scope) {

                scope.getFooterLinks();
            }
        }
    });
