'use strict';

angular.module('idai.components')


/**
 * @author Patrick Jominet
 * @author Jan Wieners
 * @author Daniel de Oliveira
 */
.component('idaiSearch', {
    restrict: 'E',
    templateUrl: 'forms/idai-search.html',
    bindings: {
        buttonClass: '@'
    },
    controller: [ '$scope', '$location', 'componentsSettings', '$http','idaiSearchService',
        function($scope,$location,componentsSettings,$http,idaiSearchService) {

            var NUM_SEARCHES_TO_KEEP = 3;
            var localStorageKey='previousSearchQueries';
            $scope.placeholder = undefined;

            $scope.buttonClass = 'btn-primary';
            if (this.buttonClass) {
                $scope.buttonClass = this.buttonClass;
            }

            idaiSearchService.register(function(term) {
                $scope.placeholder = term;
            }.bind(this));

            $scope.$on('$locationChangeStart', function (event,next) {
                if (next.indexOf('search')==-1) idaiSearchService.notify(undefined)
                $scope.q = $location.search().q
            });

            

            $scope.search = function ($item) {
                var searchTerm;
                if ($item) {
                    searchTerm = '"' + $item.model + '"';
                } else {
                    searchTerm = $scope.q;
                }
                memorizeSearch(searchTerm,NUM_SEARCHES_TO_KEEP);

                $scope.q = searchTerm;

                if (!searchTerm) searchTerm = "";
                
                // consider subfolder based search
                var path = ($location.path().match(/search$/).length) ? $location.path() : '/search';
				$location.url(path + '?q=' + searchTerm);

                idaiSearchService.notify(searchTerm);
            };

            $scope.selectQueryString = function (event) {
                event.target.select();
            }


            $scope.getSuggestions = function (value) {
                if (!componentsSettings.searchUri) return;

                return $http.get(componentsSettings.searchUri + value)
                    .then(function (response) {
                        if (!response.data.suggestions) return [];

                        var suggestions=
                            response.data.suggestions.map(function(e){return {model:e}});
                        if (!suggestions) return [];
                        enrichWithOldQueries(suggestions);
                        return suggestions;
                    });
            };

            function enrichWithOldQueries(suggestions) {
                var queries = JSON.parse(localStorage.getItem(localStorageKey));
                if (queries) {
                    queries.reverse();
                    queries.forEach(function(term){
                        suggestions.push({model:term,extra:true})
                    });
                }
            }

            function memorizeSearch(searchTerm,searchesToKeep) {

                var queries = JSON.parse(localStorage.getItem(localStorageKey));

                if (queries === null || !queries) {
                    queries = [searchTerm];
                } else {

                    queries.push(searchTerm);

                    // Make unique
                    queries = queries.filter(function(item, pos) {
                        return queries.indexOf(item) == pos;
                    });

                    if (queries.length > searchesToKeep +1) {
                        queries.shift();
                    }
                }
                localStorage.setItem(localStorageKey, JSON.stringify(queries));
            }
        }
    ]
});
