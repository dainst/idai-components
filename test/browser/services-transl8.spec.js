/**
 * Author: Daniel M. de Oliveira
 */

describe('transl8', function (){

	var KEY = "navbar_about";
	var KEY_INVALID = "navbar_xyz";
	var TRANSL8_JSONP_URL = "https://arachne.dainst.org/transl8/translation/jsonp?application=shared&lang={LANG}";
	var TRANSLATION_EN = 'About Arachne';
	var TRANSLATION_DE = 'Über Arachne';

	var mockDataEn = [ {key: KEY, value: TRANSLATION_EN} ];
	var mockDataDe = [ {key: KEY, value: TRANSLATION_DE} ];
	var transl8UrlEn = TRANSL8_JSONP_URL.replace('{LANG}',COMPONENTS_ENGLISH_LANG);
	var transl8UrlDe = TRANSL8_JSONP_URL.replace('{LANG}',COMPONENTS_GERMAN_LANG);

	var transl8,$httpBackend;

	/**
	 * Done this way to make it configurable with primaryLanguage.
	 * @param primaryLanguage
	 */
	function myBeforeEach(primaryLang){

		module('idai.components',function($provide) {
				$provide.value('language', {
					currentLanguage: function () {
						return primaryLang;
					}
				});
				$provide.constant('componentsSettings', {
					transl8Uri: TRANSL8_JSONP_URL
				});
			}
		);

		inject(function(_transl8_, _$httpBackend_) {
			transl8 = _transl8_;
			$httpBackend = _$httpBackend_;
		});

		$httpBackend.whenJSONP(transl8UrlDe).respond(mockDataDe);
		$httpBackend.whenJSONP(transl8UrlEn).respond(mockDataEn);
	}

	xit('should provide german menu items for german users', function () {

		myBeforeEach('de');

		$httpBackend.flush();
		expect(transl8.getTranslation(KEY)).toBe(TRANSLATION_DE);
	});

	xit('should provide english menu items for english users', function () {

		myBeforeEach('en');

		$httpBackend.flush();
		expect(transl8.getTranslation(KEY)).toBe(TRANSLATION_EN);
	});

	xit('should provide english menu items for danish users', function () {

		myBeforeEach('da');

		$httpBackend.flush();
		expect(transl8.getTranslation(KEY)).toBe(TRANSLATION_EN);
	});

	xit('lacks a german translation (german user)', function () {

		myBeforeEach('de');

		$httpBackend.flush();
		expect(function(){transl8.getTranslation(KEY_INVALID)}).toThrow();
	});

	xit('lacks an english translation (english user)', function () {

		myBeforeEach('en');

		$httpBackend.flush();
		expect(function(){transl8.getTranslation(KEY_INVALID)}).toThrow();
	});

	xit('lacks an english translation (danish user)', function () {

		myBeforeEach('da');

		$httpBackend.flush();
		expect(function(){transl8.getTranslation(KEY_INVALID)}).toThrow();
	});

	xit ('shows nothing if items not loaded yet', function () {

		myBeforeEach('da');

		expect(transl8.getTranslation(KEY)).toBe('');
	});
});