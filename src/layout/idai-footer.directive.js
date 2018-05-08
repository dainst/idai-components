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
                version: '@'
            },
            transclude: true,
            templateUrl: 'layout/idai-footer.html',
            controller: ['$scope', '$http', '$sce', 'localizedContent', '$transclude', 'componentsSettings',
                function ($scope, $http, $sce, localizedContent, $transclude, componentsSettings) {

                    $scope.dataProtectionPolicyUri = componentsSettings.dataProtectionPolicyUri;
                    $scope.mailto = componentsSettings.mailTo;

                    $transclude(function(clone){
                        $scope.hasTranscludedContent = (clone.length > 0);
                    });

                    $scope.date = new Date();
                    $scope.getFooterLinks = function (contentDir) {

                        var contentInfo = 'info/content.json';

                        $http.get(contentInfo).then(function (success) {

                            var footerLinks = localizedContent.getNodeById(success.data, 'footer');

                            if (!footerLinks) {
                                console.error('error: no footer links found in file ' + contentInfo);
                            } else {
                                localizedContent.reduceTitles(footerLinks);
                                $scope.dynamicLinkList = footerLinks.children;
                            }
                        }, function(error) {
                            console.error(error.data);
                        });
                    }
                }],
            link: function (scope, element, attrs) {

                scope.getFooterLinks(attrs.contentDir);
            }
        }
    });
