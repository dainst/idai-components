'use strict';

angular.module('sampleApp',[
	'ui.bootstrap',
	'ngRoute',
	'ngAnimate',
	'idai.components',
	'idai.templates',
	'sampleApp.controllers'
])
.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/', {templateUrl: 'demo/home.html'})
			.when('/info/layout', {templateUrl: 'demo/layout.html'})
			.when('/info/i18n', {templateUrl: 'demo/i18n.html'})
			.when('/info/forms', {templateUrl: 'demo/forms.html'})
			.when('/info/msgs', {templateUrl: 'demo/messages.html'});
	}
])
.constant('transl8map', transl8)
.constant('componentsSettings', {
		transl8Uri: 'https://arachne.dainst.org/transl8/translation/jsonp?application=shared&lang={LANG}',
		searchUri: 'http://bogusman02.dai-cloud.uni-koeln.de/data/suggest?q=',
        dataProtectionPolicyUri: 'http://www.dainst.org/datenschutz',
		mailTo: 'idai.objects@dainst.org'
	}
);
