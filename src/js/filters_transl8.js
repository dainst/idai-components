'use strict';

/* Services */
angular.module('idai.filters')

	/**
	 * Author: Daniel M. de Oliveira
	 */
	.filter('transl8', ['transl8',function(transl8){
		return function(key) {
			var trans = transl8.getTranslation(key);
			return trans;
		}
	}]);