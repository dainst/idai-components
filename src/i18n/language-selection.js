'use strict';

angular.module('idai.components')

/**
 * Given a language, determines by a
 * rule if this language is applicable or if not which
 * other language is applicable in a given context.
 * Once found a suitable language, an operation to
 * apply that language in the clients context gets performed.
 *
 * @author: Daniel de Oliveira
 */
    .factory('languageSelection', ['language', function (language) {

        return {

            /**
             * The language selection rule.
             *
             * @param isLangApplicable - callback function(lang,param) for testing
             *   if lang is applicable in the clients context
             * @param applyLang - callback function(lang_,param) for applying
             *   lang in the clients context
             * @param param - used as second param for the callbacks
             */
            __: function (isLangApplicable, applyLang, param) {

                var lang = localStorage.getItem('lang');

                if (lang) {

                    if (lang === COMPONENTS_GERMAN_LANG || lang === COMPONENTS_ENGLISH_LANG) {
                        applyLang(lang, param);
                        return;
                    }
                }

                if (language.currentLanguage() == COMPONENTS_GERMAN_LANG) {
                    applyLang(COMPONENTS_GERMAN_LANG, param);
                    return;
                }

                if (isLangApplicable(language.currentLanguage(), param)) {
                    applyLang(language.currentLanguage(), param);
                } else if (language.currentLanguage() == COMPONENTS_ENGLISH_LANG) {
                    applyLang(COMPONENTS_GERMAN_LANG, param);
                } else if (isLangApplicable(COMPONENTS_ENGLISH_LANG, param))
                    applyLang(COMPONENTS_ENGLISH_LANG, param);
                else
                    applyLang(COMPONENTS_GERMAN_LANG, param);
            }
        }
    }]);
