'use strict';

/* Services */
angular.module('idai.components')

/**
 * @author: Daniel de Oliveira
 */
    .filter('transl8Number', ['language',function(language){

        var filterFunction = function(nu) {

            if (typeof nu == 'undefined') return undefined;

			if (typeof nu === 'string' && isNaN(nu)) return nu;

			var num = (typeof nu === 'string' && !isNaN(nu)) ? +nu : nu;

            if (language.currentLanguage()==COMPONENTS_GERMAN_LANG) {
                return num.toLocaleString(COMPONENTS_GERMAN_LANG+"-DE");
            } else {
                return num.toLocaleString(COMPONENTS_ENGLISH_LANG+"-US");
            }
        };
        filterFunction.$stateful=true;
        return filterFunction;
    }]);
