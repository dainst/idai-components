// Karma configuration
// Generated on Mon Jun 15 2015 13:37:24 GMT+0200 (CEST)

const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    browsers : ['ChromeHeadless'],

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
	  'karma-ng-html2js-preprocessor'
    ],
    // list of files / patterns to load in the browser
    files: [

      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
	  'src/**/*.js',
      'test/browser/**/*.spec.js',
	  'src/**/*.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9879,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    //autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher



    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

	ngHtml2JsPreprocessor: {
	    stripPrefix: 'src/',
		moduleName: 'templates'
	},
	preprocessors: {
	    "src/**/*.html": "ng-html2js"
	}
  });
};
