'use strict';

angular.module('idai.components')


/**
 * @author Patrick Jominet
 * @author Jan Wieners
 * @author Daniel de Oliveira
 * @author philipp Franck
 *
 */
.component('idaiSearch', {
    restrict: 'E',
    templateUrl: 'forms/idai-search.html',
    bindings: {
        buttonClass: '@',
        searchScope: '<'
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

			/**
			 * [scoped search]
			 *
			 * about: I tried to make it flexible, that the component can be used in a system with different architecture as well..
			 *
			 * the value serachScope takes one object,
			 * with 4 optional parameters
			 *
			 * searchScope.title - the title of the scope
			 * searchScope.search - a function taking the serach query q and returning the query url
			 * searchScope.leaveScope - a function get called when leave scope is clicked
			 * searchScope.page - url of the info page of the scope
			 *
			 *
			 */

            $scope.noSearchScope = false;
            var lastScope = ''; //  we track this to know, when scope is changed and removed scope button shall be shown again

			$scope.getSearchScopeShortTitle = function() {
				if (typeof this.searchScope === "undefined") {
					return false;
				}
				if (!this.searchScope.title  || (this.searchScope.title === '')) {
					return false;
                }
                if (this.searchScope.title.length > 10) {
                    return this.searchScope.title.substr(0, 7) + '...';
                }
                return this.searchScope.title;
            }.bind(this);

			$scope.getSearchScope = function() {
			    return this.searchScope
            }.bind(this);

			var getScopeSearchUrl = function(q) {
				if ($scope.hasSearchScope() && angular.isFunction(this.searchScope.search)) {
					return this.searchScope.search(q);
				} else {
					return '/search?q=' + q;
				}
			}.bind(this);

            $scope.hasSearchScope = function()  {

            	var searchScopeGiven = !!this.searchScope &&
					angular.isObject(this.searchScope) &&
					(Object.keys(this.searchScope).length > 0);

            	if (searchScopeGiven) {
					if (lastScope !== JSON.stringify(this.searchScope.title))  {
						lastScope = JSON.stringify(this.searchScope.title);
						$scope.noSearchScope = false;
					}
				} else {
                    lastScope = '';
					$scope.noSearchScope = false;
				}

            	return searchScopeGiven && !$scope.noSearchScope;
			}.bind(this);

			$scope.leaveSearchScope = function leaveSearchScope() {
				//console.log('leave scope',this.searchScope.leaveScope)
				if (angular.isFunction(this.searchScope.leaveScope)) {
					this.searchScope.leaveScope();
				}
				$scope.noSearchScope = true;
			}.bind(this);


            idaiSearchService.register(function(term) {
                $scope.placeholder = term;
            }.bind(this));

            // -- end scoped serach -- //

            $scope.$on('$locationChangeStart', function (event,next) { // ????
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

                var url = getScopeSearchUrl(searchTerm);

		$location.url(url);

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
