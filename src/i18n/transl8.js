'use strict';

/**
 * Provides translations for keys based on the primary browser language of the user.
 * Makes use of the CoDArchLab Transl8 tool.
 *
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 */
angular.module('idai.components')
    .factory('transl8', ['$http', '$location', '$sce', 'language', 'componentsSettings',
        function ($http, $location, $sce, language, componentsSettings) {

            var lang = language.currentLanguage(),
                translationsLoaded = false,
                transl8Url, res, promise, i, translations = {}; // Map: [transl8_key,translation]

            if (['de', 'en'].indexOf(lang) === -1) lang = 'en';

            transl8Url = componentsSettings.transl8Uri.replace('{LANG}', lang);

            promise = $http.jsonp($sce.trustAsResourceUrl(transl8Url)).then(function (result) {

                res = result.data;
                i = res.length;

                for (i; i--;) {
                    translations[res[i].key] = res[i].value;
                }
                translationsLoaded = true;
            }).catch(function (error) {
                console.error("ERROR: Could not get translations.");
            });

            return {

                /**
                 * @param key an existing key in transl8 with
                 *   translations for all existing language sets.
                 * @returns translation text
                 * @throws Error if the key does not exist in transl8 or
                 *   there is no translation for the given key.
                 */
                getTranslation: function(key) {
                    if (!translationsLoaded) return key;

                    var translation = translations[key];
                    if (!translation || 0 === translation.length) {
                        throw new Error("No translation found for key '" + key + "'");
                    }
                    return translation;
                },

                onLoaded: function () {
                    return promise;
                }

            }
        }
    ]);