'use strict';

/**
 * Provides translations for keys based on the primary browser language of the user.
 * Makes use of the CoDArchLab Transl8 tool.
 *
 * @author: Daniel de Oliveira
 * @author: Jan G. Wieners
 * @author: Sebastian Cuy
 */
angular.module('idai.components')
    .factory('transl8', ['$location', 'language', 'componentsSettings',
        function ($location, language, componentsSettings) {

            var lang = language.currentLanguage(),
                i, translations = {}; // Map: [transl8_key,translation]

            if (['de', 'en'].indexOf(lang) === -1) lang = 'en';

            translations = transl8[lang];

            return {

                /**
                 * @param key an existing key in transl8 with
                 *   translations for all existing language sets.
                 * @returns translation text
                 * @throws Error if the key does not exist in transl8 or
                 *   there is no translation for the given key.
                 */
                getTranslation: function(key) {

                    var translation = translations[key];
                    if (!translation || 0 === translation.length) {
                        throw new Error("No translation found for key '" + key + "'");
                    }
                    return translation;
                },

                onLoaded: function () {
                    return Promise.resolve();
                }

            }
        }
    ]);
