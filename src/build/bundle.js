(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _invertedIndex = require('./inverted-index.js');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nameSpace = angular.module('InvertedIndex', ['ngSanitize', 'angularModalService']);

nameSpace.controller('InvertedIndexController', ['$scope', '$sce', 'ModalService', function ($scope, $sce, ModalService) {
  $scope.file_names = [];
  $scope.invertedIndex = new _invertedIndex2.default();
  $scope.index = null;
  $scope.allMostFrequency = {};
  $scope.allContents = {};
  $scope.terms = ['Term'];
  $scope.words = null;
  $scope.index_display = [];
  $scope.index_search_display = [];
  $scope.selected_file = [];
  $scope.search_terms = [];
  $scope.search_words_array = '';
  $scope.allSearchResult = [];
  var reader = void 0;

  $scope.upload = function () {
    $scope.progress = document.querySelector('.percent');
    $scope.handleFileSelect();
  };

  $scope.abortRead = function () {
    reader.abort;
  };

  $scope.updateProgress = function (evt) {
    if (evt.lengthComputable) {
      var percentLoaded = Math.round(evt.loaded / evt.total * 100);
      if (percentLoaded < 100) {
        $scope.progress.style.width = percentLoaded + '%';
        $scope.progress.textContent = percentLoaded + '%';
      }
    }
  };

  $scope.handleFileSelect = function () {
    var fileArray = document.getElementById('files').files;

    var _loop = function _loop(i) {
      $scope.progress.style.width = '0%';
      $scope.progress.textContent = '0%';
      reader = new FileReader();
      reader.onabort = function () {
        $scope.readerAborted = true;
        $scope.abortRead();
        $scope.showErrorModal();
      };
      reader.onloadstart = function () {
        document.getElementById('progress_bar').className = 'loading';
      };
      reader.onload = function (evt) {
        var content = evt.target.result;
        $scope.$apply(function () {
          $scope.content = content;
          if ($scope.file_names.indexOf(fileArray[i].name) === -1) {
            if ($scope.content.length > 0) {
              try {
                $scope.file_object = JSON.parse(content);
                if ($scope.invertedIndex.isValidJsonArray($scope.file_object)) {
                  $scope.invertedIndex.createIndex($scope.file_object, fileArray[i].name);
                  $scope.files = fileArray[i];
                  $scope.file_names.push($scope.files.name);
                  $scope.allContents[$scope.files.name] = $scope.content;
                  $scope.trusted_html_content = $sce.trustAsHtml('<p><code>' + $scope.content + '</code></p>');
                  $scope.index = $scope.invertedIndex.getIndex();
                  $scope.allMostFrequency[$scope.files.name] = $scope.invertedIndex.mostFrequency;
                  $scope.progress.textContent = '100%';
                  $scope.prepareIndexViewComponents();
                } else {
                  $scope.tokenNotFound = false;
                  $scope.notValidJSONFile = true;
                  $scope.isEmptyFile = false;
                  $scope.readerAborted = false;
                  $scope.fileALreadyUploaded = false;
                  $scope.showErrorModal();
                }
              } catch (exception) {
                $scope.tokenNotFound = false;
                $scope.notValidJSONFile = true;
                $scope.isEmptyFile = false;
                $scope.readerAborted = false;
                $scope.fileALreadyUploaded = false;
                $scope.showErrorModal();
              }
            } else {
              $scope.tokenNotFound = false;
              $scope.notValidJSONFile = false;
              $scope.isEmptyFile = true;
              $scope.readerAborted = false;
              $scope.fileALreadyUploaded = false;
              $scope.showErrorModal();
            }
          } else {
            $scope.tokenNotFound = false;
            $scope.notValidJSONFile = false;
            $scope.isEmptyFile = false;
            $scope.readerAborted = false;
            $scope.fileALreadyUploaded = true;
            $scope.showErrorModal();
          }
        });
      };
      reader.readAsText(fileArray[i]);
    };

    for (var i = 0; i < fileArray.length; i++) {
      _loop(i);
    }
  };

  $scope.fileSelected = function (file) {
    $scope.index = $scope.invertedIndex.allIndex[file];
    $scope.prepareIndexViewComponents(file);
  };

  $scope.prepareIndexViewComponents = function (file) {
    $scope.terms = ['Terms'];
    $scope.index_display = [];
    var mostFrequencyKey = '';
    if (file !== undefined) {
      mostFrequencyKey = file;
      $scope.trusted_html_content = $sce.trustAsHtml('<p><code>' + $scope.allContents[file] + '</code></p>');
    } else {
      mostFrequencyKey = $scope.files.name;
      $scope.trusted_html_content = $sce.trustAsHtml('<p><code>' + $scope.allContents[$scope.files.name] + '</code></p>');
    }
    for (var i = 0; i < $scope.allMostFrequency[mostFrequencyKey]; i++) {
      $scope.terms.push('doc' + (i + 1));
    }
    if ($scope.index !== undefined) {
      $scope.words = Object.keys($scope.index).sort();
    }
    var indexObjectSize = $scope.invertedIndex.getObjectSize($scope.index);
    for (var _i = 0; _i < indexObjectSize; _i++) {
      var indexDisplayTemp = [$scope.words[_i]];
      var k = 0;
      for (var j = 0; j < $scope.allMostFrequency[mostFrequencyKey]; j++) {
        var docId = j + 1;
        if (docId === $scope.index[$scope.words[_i]][k]) {
          indexDisplayTemp.push('X');
          k += 1;
        } else {
          indexDisplayTemp.push(' ');
        }
      }
      $scope.index_display[_i] = indexDisplayTemp;
    }
  };

  $scope.search = function () {
    $scope.selected_file = [];
    $scope.setSelectedValues();
    $scope.index_search_display = [];
    var searchWordsArray = [];
    for (var i = 0; i < $scope.selected_file.length; i++) {
      var searchResult = $scope.invertedIndex.search($scope.selected_file[i], $scope.search_strings);
      searchWordsArray = $scope.invertedIndex.removePunctuation($scope.search_strings).split(' ');
      var searchInView = $scope.prepareSearchIndexViewComponents(searchWordsArray, searchResult, i);
      $scope.index_search_display[i] = searchInView;
    }
    if ($scope.invertedIndex.searchStatus === 1) {
      $scope.tokenNotFound = true;
      $scope.notValidJSONFile = false;
      $scope.isEmptyFile = false;
      $scope.readerAborted = false;
      $scope.showErrorModal();
    }
    $scope.index = $scope.invertedIndex.getIndex();
  };

  $scope.prepareSearchIndexViewComponents = function (searchWordsArray, searchResult, counter) {
    $scope.search_terms = ['Terms'];
    $scope.trusted_html_content = $sce.trustAsHtml('<p><code>' + $scope.allContents[$scope.selected_file[counter]] + '</code></p>');
    for (var i = 0; i < $scope.allMostFrequency[$scope.selected_file[counter]]; i++) {
      $scope.search_terms.push('doc' + (i + 1));
    }
    var indexSearchDisplayTemp = [$scope.search_terms];
    var indexSearchDisplayItem = [];
    var size = searchResult.length;
    for (var _i2 = 0; _i2 < size; _i2++) {
      var found = false;
      indexSearchDisplayItem.push(searchWordsArray[_i2]);
      var k = 0;
      for (var j = 0; j < $scope.allMostFrequency[$scope.selected_file[counter]]; j++) {
        var docId = j + 1;
        if (docId === searchResult[_i2][k]) {
          found = true;
          indexSearchDisplayItem.push('X');
          k = +1;
        } else {
          indexSearchDisplayItem.push(' ');
        }
      }
      if (found) {
        indexSearchDisplayTemp.push(indexSearchDisplayItem);
      }
      indexSearchDisplayItem = [];
    }
    return indexSearchDisplayTemp;
  };

  $scope.setSelectedValues = function () {
    var filesSelected = document.getElementById('selected_file');
    for (var i = 0; i < filesSelected.options.length; i++) {
      if (filesSelected.options[i].selected === true) {
        $scope.selected_file.push(filesSelected.options[i].text);
      }
    }
  };

  $scope.showErrorModal = function () {
    if ($scope.notValidJSONFile) {
      $scope.error_message = 'Invalid File Content';
    } else if ($scope.isEmptyFile) {
      $scope.error_message = 'JSON File is empty';
    } else if ($scope.readerAborted) {
      $scope.error_message = 'File Reading was unsuccessful!';
    } else if ($scope.tokenNotFound) {
      $scope.error_message = 'Some or the entire search token(s) not found!';
    } else {
      $scope.error_message = 'File(s) has already been uploaded!';
    }
    $scope.title = 'Fatal Error';
    ModalService.showModal({
      templateUrl: 'error_modal.html',
      controller: 'ErrorModalController',
      scope: $scope
    }).then(function (modal) {
      modal.element.modal();
      modal.close.then(function () {
        if ($scope.notValidJSONFile) {
          $scope.notValidJSONFile = false;
        } else if ($scope.isEmptyFile) {
          $scope.isEmptyFile = false;
        } else {
          $scope.fileALreadyUploaded = false;
        }
      });
    });
  };
}]);

nameSpace.controller('ErrorModalController', ['$scope', '$element', 'close', function ($scope, $element, close) {
  $scope.dismissModal = function (result) {
    close(result, 200); // close, but give 200ms for bootstrap to animate
  };
}]).directive('removeModal', ['$document', function ($document) {
  return {
    restrict: 'A',
    link: function link(scope, element) {
      element.bind('click', function () {
        $document[0].body.classList.remove('modal-open');
        angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
        angular.element($document[0].getElementsByClassName('modal')).remove();
      });
    }
  };
}]);

},{"./inverted-index.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * inverted index class
 * @class {InvertedIndex}
 */
var InvertedIndex = function () {

  /**
   * Create an inverted index.
   * @constructor
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.allIndex = {};
    this.books = [];
    this.index = {};
    this.searchWord = [];
    this.searchOutput = [];
    this.mostFrequency = 0;
    this.searchStatus = 0;
  }

  /**
   * Create an Index.
   * 
   * It Creates the index for the documents
   * in the file object
   * 
   * @param {array} fileObject
   * @param {String} fileName
   * @returns {void} returns nothing
   */


  _createClass(InvertedIndex, [{
    key: 'createIndex',
    value: function createIndex(fileObject, fileName) {
      var isEmptyStatus = this.isEmpty(fileObject);
      if (!isEmptyStatus) {
        var isValidJsonArrayStatus = this.isValidJsonArray(fileObject);
        if (isValidJsonArrayStatus) {
          this.books = fileObject;
          this.generateIndex(fileName);
        }
      }
    }

    /**
     * is empty.
     * 
     * It Checks that the books
     * instance variable is not empty
     * 
     * @param {array} fileObject accepts an array 
     * @returns {boolean} value showing if books is empty or not
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty(fileObject) {
      return fileObject.length === 0;
    }

    /**
     * generate index.
     * 
     * It generates the index 
     * for the uploaded file
     * 
     * @param {string} fileName takes the filename
     * of the uploaded file index is to be 
     * generated.
     * @returns {void} returns no value
     */

  }, {
    key: 'generateIndex',
    value: function generateIndex(fileName) {
      var _this = this;

      var indexTemp = {};
      var title = [];
      var text = [];
      this.books.forEach(function (document, index) {
        title = _this.removePunctuation(document.title).split(' ');
        text = _this.removePunctuation(document.text).split(' ');
        var tokenArrays = title.concat(text);
        indexTemp = _this.getDocumentIndex(tokenArrays, indexTemp, index);
      }, this);
      this.index = indexTemp;
      this.allIndex[fileName] = this.index;
    }

    /**
     * getDocumentIndex.
     * 
     * It processes the passed text to index it
     * following the object array read
     * 
     * @param {array} textAndTitle takes an array of strings
     * @param {object} indexTemp takes a js object
     * @param {number} counter takes a number 
     * indicating the document being considered
     * @returns {object} returns no value
     */

  }, {
    key: 'getDocumentIndex',
    value: function getDocumentIndex(textAndTitle, indexTemp, counter) {
      var _this2 = this;

      this.mostFrequency = 0;
      textAndTitle.forEach(function (token) {
        token = token.toLowerCase();
        if (indexTemp[token] === undefined) {
          indexTemp[token] = [];
        }
        if (indexTemp[token] !== undefined && !indexTemp[token].includes(counter + 1)) {
          indexTemp[token].push(counter + 1);
          if (indexTemp[token].length > _this2.mostFrequency) {
            _this2.mostFrequency = indexTemp[token].length;
          }
        }
      }, this);
      return indexTemp;
    }

    /**
     * gets the index.
     * 
     * It returns the index for a 
     * selected document in the uploaded
     * file
     * 
     * @param {string} documentKey in the uploaded file to return its index
     * @returns {object} the index for the associated documentKey
     */

  }, {
    key: 'getIndex',
    value: function getIndex(documentKey) {
      return documentKey ? this.allIndex[documentKey] : this.index;
    }

    /**
     * search
     * 
     * Search an already generated index
     * or a file for keywords
     * 
     * @param {string} fileName - The file to perform search on.
     * @param {array} terms - The terms value.
     * @returns {array} The searchOutput value.
     */

  }, {
    key: 'search',
    value: function search(fileName) {
      for (var _len = arguments.length, terms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        terms[_key - 1] = arguments[_key];
      }

      if (typeof fileName === 'string' && fileName.endsWith('.json')) {
        this.index = this.allIndex[fileName];
      } else {
        terms.unshift(fileName);
      }
      this.searchOutput = this.searchHelper(terms);
      return this.searchOutput;
    }

    /**
     * searchHelper
     * 
     * Assist search function to
     * perform the search operation
     * 
     * @param {array} terms - The terms value.
     * @returns {array} The searchResult value.
     */

  }, {
    key: 'searchHelper',
    value: function searchHelper(terms) {
      var _this3 = this;

      var searchResult = [];
      var termWord = [];
      var term = ' ';
      this.searchStatus = 0;
      terms.forEach(function (token) {
        if (Array.isArray(token)) {
          token.forEach(function (tokenInner) {
            term = term + ' ' + tokenInner;
          }, _this3);
        } else {
          term = term + ' ' + token;
        }
      }, this);
      var termArray = this.removePunctuation(term).split(' ');
      termArray.forEach(function (token) {
        var key = token.toLowerCase();
        if (_this3.index[key]) {
          searchResult.push(_this3.index[key]);
        } else {
          searchResult.push([]);
          _this3.searchStatus = 1;
        }
        termWord.push(key);
      }, this);
      this.searchWord = termWord;
      return searchResult;
    }

    /**
     * get object size
     * 
     * Get the size of an object.
     * 
     * @param {object} object - The object value.
     * @returns {number} The object size value.
     */

  }, {
    key: 'getObjectSize',
    value: function getObjectSize(object) {
      return Object.keys(object).length;
    }

    /**
     * remove punctuation
     * 
     * Removes punctuation marks.
     * 
     * @param {string} sentence - The sentence value.
     * @returns {string} The sentence value.
     */

  }, {
    key: 'removePunctuation',
    value: function removePunctuation(sentence) {
      sentence = sentence.match(/[^_\W]+/g).join(' ');
      return sentence;
    }

    /**
     * is valid json array
     * 
     * checks that the file read contains a valid json array
     * 
     * @param {array} fileContent An array of objects
     * @returns {boolean} status indicating validity.
     */

  }, {
    key: 'isValidJsonArray',
    value: function isValidJsonArray(fileContent) {
      var status = false;
      if (Array.isArray(fileContent)) {
        fileContent.forEach(function (documentObject) {
          if ((typeof documentObject === 'undefined' ? 'undefined' : _typeof(documentObject)) === _typeof({}) && documentObject['title'] && documentObject['text']) {
            status = true;
          }
        }, this);
      }
      return status;
    }
  }]);

  return InvertedIndex;
}();

exports.default = InvertedIndex;

},{}]},{},[1]);
