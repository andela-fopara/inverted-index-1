(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  }

  /**
   * Create an Index.
   * 
   * It Creates the index for the documents
   * in the file object
   * 
   * @param {array} FileObject
   * @param {String} fileName
   * @returns {void} returns nothing
   */


  _createClass(InvertedIndex, [{
    key: 'createIndex',
    value: function createIndex(FileObject, fileName) {
      var isEmptyStatus = this.isEmpty(FileObject);
      if (!isEmptyStatus) {
        var isValidJsonArrayStatus = this.isValidJsonArray(FileObject);
        if (isValidJsonArrayStatus) {
          this.books = FileObject;
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
     * @param {array} FileObject accepts an array 
     * @returns {boolean} value showing if books is empty or not
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty(FileObject) {
      var status = true;
      if (FileObject.length) {
        status = false;
      }
      return status;
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
      var IndexTemp = {};
      var title = [];
      var text = [];
      for (var i = 0; i < this.books.length; i++) {
        var Obj = this.books[i];
        title = this.removePunctuation(Obj.title).split(' ');
        text = this.removePunctuation(Obj.text).split(' ');
        IndexTemp = this.process(title, IndexTemp, i);
        IndexTemp = this.process(text, IndexTemp, i);
      }
      this.index = IndexTemp;
      this.allIndex[fileName] = this.index;
    }

    /**
     * process.
     * 
     * It processes the passed text to index it
     * following the object array read
     * 
     * @param {array} textOrTitle takes an array of strings
     * @param {object} IndexTemp takes a js object
     * @param {number} counter takes a number 
     * indicating the document being considered
     * @returns {object} returns no value
     */

  }, {
    key: 'process',
    value: function process(textOrTitle, IndexTemp, counter) {
      for (var j = 0; j < textOrTitle.length; j++) {
        textOrTitle[j] = textOrTitle[j].toLowerCase();
        if (IndexTemp[textOrTitle[j]] === undefined) {
          IndexTemp[textOrTitle[j]] = [];
        }
        if (IndexTemp[textOrTitle[j]] !== undefined && !IndexTemp[textOrTitle[j]].includes(counter + 1)) {
          IndexTemp[textOrTitle[j]].push(counter + 1);
          if (IndexTemp[textOrTitle[j]].length > this.mostFrequency) {
            this.mostFrequency = IndexTemp[textOrTitle[j]].length;
          }
        }
      }
      return IndexTemp;
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
      var searchResult = [];
      var termWord = [];

      for (var _len = arguments.length, terms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        terms[_key - 1] = arguments[_key];
      }

      if (typeof fileName === 'string' && fileName.endsWith('.json')) {
        this.index = this.allIndex[fileName];
      } else {
        terms.unshift(fileName);
      }
      var term = ' ';
      for (var i = 0; i < terms.length; i++) {
        if (Array.isArray(terms[i])) {
          for (var j = 0; j < terms[i].length; j++) {
            term = term + ' ' + terms[i][j];
          }
        } else {
          term = term + ' ' + terms[i];
        }
      }
      var termArray = this.removePunctuation(term).split(' ');
      for (var _i = 0; _i < termArray.length; _i++) {
        var key = termArray[_i].toLowerCase();
        if (this.index[key]) {
          searchResult.push(this.index[key]);
        } else {
          searchResult.push([]);
        }
        termWord.push(key);
      }
      this.searchWord = termWord;
      this.searchOutput = searchResult;
      return this.searchOutput;
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
        for (var i = 0; i < fileContent.length; i++) {
          if (_typeof(fileContent[i]) === _typeof({}) && fileContent[i]['title'] && fileContent[i]['text']) {
            status = true;
          }
        }
      }
      return status;
    }
  }]);

  return InvertedIndex;
}();

exports.InvertedIndex = InvertedIndex;

},{}],2:[function(require,module,exports){
'use strict';

var _invertedIndex = require('../lib/js/inverted-index.js');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _books = require('./json_files/books1.json');

var _books2 = _interopRequireDefault(_books);

var _books3 = require('./json_files/books2.json');

var _books4 = _interopRequireDefault(_books3);

var _books5 = require('./json_files/books3.json');

var _books6 = _interopRequireDefault(_books5);

var _books7 = require('./json_files/books4.json');

var _books8 = _interopRequireDefault(_books7);

var _books9 = require('./json_files/books5.json');

var _books10 = _interopRequireDefault(_books9);

var _books11 = require('./json_files/books6.json');

var _books12 = _interopRequireDefault(_books11);

var _correctIndex = require('./json_files/correctIndex.json');

var _correctIndex2 = _interopRequireDefault(_correctIndex);

var _wrongAnswer = require('./json_files/wrongAnswer.json');

var _wrongAnswer2 = _interopRequireDefault(_wrongAnswer);

var _correctArrayOfIndices = require('./json_files/correctArrayOfIndices.json');

var _correctArrayOfIndices2 = _interopRequireDefault(_correctArrayOfIndices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* test suites for the inverted index project */
var invertedIndex = new _invertedIndex2.default();

/* testSuite 1 
*
*Tests that the file read when createIndex 
*is called is not empty 
*/
describe('Read book data', function () {
  describe('assert that json file read as at the time index is created not empty', function () {
    invertedIndex.createIndex(_books2.default, 'book1.json');
    it('assert that isEmpty function return false for book1', function () {
      expect(invertedIndex.isEmpty(invertedIndex.books)).toBeFalsy();
    });
    it('assert that isEmpty function return true for book2', function () {
      expect(invertedIndex.isEmpty(_books4.default)).toBeTruthy();
    });
    invertedIndex.createIndex(_books4.default, 'book2.json');
    it('assert that index is never generated for empty arrays', function () {
      expect(invertedIndex.allIndex['book2.json']).toEqual(undefined);
    });
  });
});

/* testSuite 2 
*
* Tests that file contains a valid json
* Tests the index is populated immediately
* file is read 
* Tests that the tokens are matched to
* to the correct objects in the array
*/
describe('Populate Index', function () {
  describe('Ensures the file content is actually a valid JSON Array', function () {
    it('assert that isValidJsonArray returns true for book1', function () {
      expect(invertedIndex.isValidJsonArray(_books6.default)).toBeTruthy();
    });
    it('assert that isValidJsonArray returns false for book2', function () {
      expect(invertedIndex.isValidJsonArray(book4)).toBeFalsy();
    });
    it('assert that isValidJsonArray returns false for book3', function () {
      expect(invertedIndex.isValidJsonArray(book5)).toBeFalsy();
    });
  });
  invertedIndex.createIndex(_books6.default, 'book3.json');
  describe('Test that Index is created once JSON file has been read', function () {
    it('assert that index is populated each time json file is read', function () {
      expect(invertedIndex.index).toEqual(_correctIndex2.default);
    });
    it('assert that index is populated each time json file is read', function () {
      expect(Object.keys(invertedIndex.index).length).toBeGreaterThan(0);
    });
    it('assert that getObjectSize works properly', function () {
      expect(Object.keys(invertedIndex.index).length).toBe(invertedIndex.getObjectSize(invertedIndex.index));
    });
  });
  describe('Test that the index maps the string keys to the correct objects in the JSON array', function () {
    describe('Confirm that isMapCorrect function works as expected', function () {
      it('invertedIndex.index[ada]).toEqual(correctIndex[ada]', function () {
        expect(invertedIndex.index['ada']).toEqual(_correctIndex2.default['ada']);
      });
      it('invertedIndex.index[world]).toEqual(correctIndex[world]', function () {
        expect(invertedIndex.index['world']).toEqual(_correctIndex2.default['world']);
      });
      it('invertedIndex.index[moon]).toEqual(correctIndex[moon]', function () {
        expect(invertedIndex.index['moon']).toEqual(_correctIndex2.default['moon']);
      });
      it('invertedIndex.index[moon] !== wrongAnswer[moon]', function () {
        expect(invertedIndex.index['moon'] === _wrongAnswer2.default['moon']).toBeFalsy();
      });
      it('invertedIndex.index[to] !== wrongAnswer[to]', function () {
        expect(invertedIndex.index['to'] === _wrongAnswer2.default['to']).toBeFalsy();
      });
      it('invertedIndex.index[a] !== wrongAnswer[a]', function () {
        expect(invertedIndex.index['a'] === _wrongAnswer2.default['a']).toBeFalsy();
      });
    });
    describe('Confirm that I can get the index with document id specified', function () {
      it('assert that invertedIndex.getIndex(book2.json) === invertedIndex.allIndex[book2.json]', function () {
        expect(invertedIndex.getIndex('book2.json')).toEqual(invertedIndex.allIndex['book2.json']);
      });
    });
    describe('Confirm that I can get the index with document id not specified', function () {
      it('assert that invertedIndex.getIndex() === invertedIndex.index', function () {
        expect(invertedIndex.getIndex()).toEqual(invertedIndex.allIndex['book3.json']);
        expect(invertedIndex.getIndex()).toEqual(invertedIndex.index);
      });
    });
  });
});

/* testSuite 3 
*
* Tests the search function works
* for most possible cases
*/
describe('Search index -:', function () {
  var searchResult = invertedIndex.search('book3.json', 'Ada', 'In', ['world', 'Moon'], 'hello');
  describe('Confirm that search works well for array of array mixed with words', function () {
    it('assert that correctArrayOfIndices[0] === invertedIndex.index[ada]', function () {
      expect(_correctArrayOfIndices2.default[0]).toEqual(invertedIndex.index['ada']);
      expect(searchResult[0]).toEqual(invertedIndex.index['ada']);
    });
    it('assert that correctArrayOfIndices[1] === invertedIndex.index[in]', function () {
      expect(_correctArrayOfIndices2.default[1]).toEqual(invertedIndex.index['in']);
      expect(searchResult[1]).toEqual(invertedIndex.index['in']);
    });
    it('assert that correctArrayOfIndices[2] === invertedIndex.index[world]', function () {
      expect(_correctArrayOfIndices2.default[2]).toEqual(invertedIndex.index['world']);
      expect(searchResult[2]).toEqual(invertedIndex.index['world']);
    });
    it('assert that correctArrayOfIndices[3] === invertedIndex.index[moon]', function () {
      expect(_correctArrayOfIndices2.default[3]).toEqual(invertedIndex.index['moon']);
      expect(searchResult[3]).toEqual(invertedIndex.index['moon']);
    });
    it('assert that correctArrayOfIndices[4] === invertedIndex.index[hello]', function () {
      expect(searchResult[4]).toEqual([]);
      expect(_correctArrayOfIndices2.default[4]).toEqual(searchResult[4]);
    });
  });
  var searchResult2 = invertedIndex.search('book3.json', 'Ada', 'In', 'world', 'Moon', 'hello');
  describe('Confirm that search works well for array of words', function () {
    it('assert that correctArrayOfIndices[0] === invertedIndex.index[ada]', function () {
      expect(_correctArrayOfIndices2.default[0]).toEqual(invertedIndex.index['ada']);
      expect(searchResult2[0]).toEqual(invertedIndex.index['ada']);
    });
    it('assert that correctArrayOfIndices[1] === invertedIndex.index[in]', function () {
      expect(_correctArrayOfIndices2.default[1]).toEqual(invertedIndex.index['in']);
      expect(searchResult2[1]).toEqual(invertedIndex.index['in']);
    });
    it('assert that correctArrayOfIndices[2] === invertedIndex.index[world]', function () {
      expect(_correctArrayOfIndices2.default[2]).toEqual(invertedIndex.index['world']);
      expect(searchResult2[2]).toEqual(invertedIndex.index['world']);
    });
    it('assert that correctArrayOfIndices[3] === invertedIndex.index[moon]', function () {
      expect(_correctArrayOfIndices2.default[3]).toEqual(invertedIndex.index['moon']);
      expect(searchResult2[3]).toEqual(invertedIndex.index['moon']);
    });
    it('assert that correctArrayOfIndices[4] === invertedIndex.index[hello]', function () {
      expect(searchResult2[4]).toEqual([]);
      expect(_correctArrayOfIndices2.default[4]).toEqual(searchResult[4]);
    });
  });

  var searchResult3 = invertedIndex.search('Ada', 'In', 'world', 'Moon', 'hello');
  describe('Confirm that search works when fileName is undefined', function () {
    it('assert that correctArrayOfIndices[0] === invertedIndex.index[ada]', function () {
      expect(_correctArrayOfIndices2.default[0]).toEqual(invertedIndex.index['ada']);
      expect(searchResult3[0]).toEqual(invertedIndex.index['ada']);
    });
    it('assert that correctArrayOfIndices[1] === invertedIndex.index[in]', function () {
      expect(_correctArrayOfIndices2.default[1]).toEqual(invertedIndex.index['in']);
      expect(searchResult3[1]).toEqual(invertedIndex.index['in']);
    });
    it('assert that correctArrayOfIndices[2] === invertedIndex.index[world]', function () {
      expect(_correctArrayOfIndices2.default[2]).toEqual(invertedIndex.index['world']);
      expect(searchResult3[2]).toEqual(invertedIndex.index['world']);
    });
    it('assert that correctArrayOfIndices[3] === invertedIndex.index[moon]', function () {
      expect(_correctArrayOfIndices2.default[3]).toEqual(invertedIndex.index['moon']);
      expect(searchResult3[3]).toEqual(invertedIndex.index['moon']);
    });
    it('assert that correctArrayOfIndices[4] === searchResult[hello]', function () {
      expect(searchResult3[4]).toEqual([]);
      expect(_correctArrayOfIndices2.default[4]).toEqual(searchResult3[4]);
    });
  });
});

},{"../lib/js/inverted-index.js":1,"./json_files/books1.json":3,"./json_files/books2.json":4,"./json_files/books3.json":5,"./json_files/books4.json":6,"./json_files/books5.json":7,"./json_files/books6.json":8,"./json_files/correctArrayOfIndices.json":9,"./json_files/correctIndex.json":10,"./json_files/wrongAnswer.json":11}],3:[function(require,module,exports){
module.exports=[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]

},{}],4:[function(require,module,exports){
module.exports=[]
},{}],5:[function(require,module,exports){
module.exports=[{
  "title": "Ada in the Wonderland",
  "text": "Going to the Moon!"
},
{
  "title": "Obi is a boy",
  "text": "Rules the world."
}
]
},{}],6:[function(require,module,exports){
module.exports=[{
  "echo": "Ada in Wonderland",
  "me": "Going to the Moon!"
},
{
  "you": "Obi is a boy",
  "us": "Rules the world."
}
]
},{}],7:[function(require,module,exports){
module.exports=["elahsoft", "ladyb", "urchman"]
},{}],8:[function(require,module,exports){
module.exports=[
  {
    "title": "Story of a Brother",
    "text": "This is the story of a brother who slept and woke up in forever land. He looked around nothing is familiar. He wondered how he got to be there. He saw this brick house with a small door."
  },

  {
    "title": "Story of a Brother - Part Two",
    "text": "He walked into the room and saw a man in White, must be an angel so he said. Mr. Angel can you tell me what is going on, the last thing I remembered was I slept last night! This is the border down that takes you where you get a crown, you must have heard of heaven where you came from. Only those whose name is found written in this book of life will forever be in paradise. Is my name in this book of life? Tell me is my name in this book of life yea!"
  },
  {
    "title": "Story of a Brother - Part Three",
    "text": "Flipping through the pages of this great book, this brother gave a cursory gaze, he saw the name of prophets, saints and martyrs, who kept the faith and won a race. And he said Mr. Angel where is my name? Can you tell me what is going on? I am a pillar in my local church, I gave the offerings and the thithe, I feed the poor and have myself a good name! Is my name is this book of life, tell me is my name in this book of life yea..."
  },
  {
    "title": "Story of a Brother - Part Four",
    "text": "Unforgiveness lurks within your heart, some folks you will never let go. Little unforseens and secret faults will spring surprises on that final day!!! Oh Oh Oh Oh Oh! Think about this!"
  }
]

},{}],9:[function(require,module,exports){
module.exports=[
    [1],
    [1],
    [2],
    [1],
    []
]
},{}],10:[function(require,module,exports){
module.exports={
  "ada": [1],
  "in": [1],
  "wonderland": [1],
  "going": [1],
  "to": [1],
  "the": [1, 2],
  "moon": [1],
  "obi": [2],
  "is": [2],
  "a": [2],
  "boy": [2],
  "rules": [2],
  "world": [2]
}
},{}],11:[function(require,module,exports){
module.exports={
    "ada": [1],
    "in": [1],
    "wonderland": [1, 9, 8, 7],
    "going": [1],
    "to": [1, 5],
    "the": [1, 2],
    "moon": [1, 3],
    "obi": [2],
    "is": [2, 3],
    "a": [1, 2],
    "boy": [2],
    "rules": [2],
    "world": [2]
}
},{}]},{},[2]);
