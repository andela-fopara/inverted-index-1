/**
 * inverted index class
 * @class {InvertedIndex}
 */
class InvertedIndex {

  /**
   * Create an inverted index.
   * @constructor
   */
  constructor() {
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
   * @param {array} fileObject
   * @param {String} fileName
   * @returns {void} returns nothing
   */
  createIndex(fileObject, fileName) {
    const isEmptyStatus = this.isEmpty(fileObject);
    if (!isEmptyStatus) {
      const isValidJsonArrayStatus = this.isValidJsonArray(fileObject);
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
  isEmpty(fileObject) {
    return fileObject.length ? false : true;
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
  generateIndex(fileName) {
    let indexTemp = {};
    let title = [];
    let text = [];
    for (let i = 0; i < this.books.length; i++) {
      const Obj = this.books[i];
      title = this.removePunctuation(Obj.title).split(' ');
      text = this.removePunctuation(Obj.text).split(' ');
      const tokenArrays = title.concat(text);
      indexTemp = this.getDocumentIndex(tokenArrays, indexTemp, i);
    }
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
   * @param {object} IndexTemp takes a js object
   * @param {number} counter takes a number 
   * indicating the document being considered
   * @returns {object} returns no value
   */
  getDocumentIndex(textAndTitle, IndexTemp, counter) {
    this.mostFrequency = 0;
    for (let j = 0; j < textAndTitle.length; j++) {
      textAndTitle[j] = textAndTitle[j].toLowerCase();
      if (IndexTemp[textAndTitle[j]] === undefined) {
        IndexTemp[textAndTitle[j]] = [];
      }
      if (IndexTemp[textAndTitle[j]] !== undefined &&
        !IndexTemp[textAndTitle[j]].includes(counter + 1)) {
        IndexTemp[textAndTitle[j]].push(counter + 1);
        if (IndexTemp[textAndTitle[j]].length > this.mostFrequency) {
          this.mostFrequency = IndexTemp[textAndTitle[j]].length;
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
  getIndex(documentKey) {
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
  search(fileName, ...terms) {
    if (typeof (fileName) === 'string' && fileName.endsWith('.json')) {
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
  searchHelper(terms) {
    const searchResult = [];
    const termWord = [];
    let term = ' ';
    for (let i = 0; i < terms.length; i++) {
      if (Array.isArray(terms[i])) {
        for (let j = 0; j < terms[i].length; j++) {
          term = `${term} ${terms[i][j]}`;
        }
      } else {
        term = `${term} ${terms[i]}`;
      }
    }
    const termArray = this.removePunctuation(term).split(' ');
    for (let i = 0; i < termArray.length; i++) {
      const key = termArray[i].toLowerCase();
      if (this.index[key]) {
        searchResult.push(this.index[key]);
      } else {
        searchResult.push([]);
      }
      termWord.push(key);
    }
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
  getObjectSize(object) {
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
  removePunctuation(sentence) {
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
  isValidJsonArray(fileContent) {
    let status = false;
    if (Array.isArray(fileContent)) {
      for (let i = 0; i < fileContent.length; i++) {
        if (typeof (fileContent[i]) === typeof ({}) &&
          fileContent[i]['title'] && fileContent[i]['text']) {
          status = true;
        }
      }
    }
    return status;
  }
}

export default InvertedIndex;