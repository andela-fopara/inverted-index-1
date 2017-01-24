/**
 * inverted index class
 * @class {InvertedIndex}
 */

class InvertedIndex {
  /**
   * Create an inverted index.
   * @constructor
   * @param {null} takes no parameter
   * @return {null} returns nothing
   */
  constructor() {
    this.books = [];
    this.objectMap = {};
    this.index = {};
    this.searchWord = [];
    this.searchOutput = [];
    this.mostFrequency = 0;
  }

  /**
   * Create an Index.
   * It Creates the index for the documents
   * in the file object
   * @param {array} FileObject
   * @return {null} returns nothing
   */
  createIndex(FileObject) {
    if (FileObject.length > 0) {
      this.books = FileObject;
      this.generateIndex();
    }
  }

  /**
   * Create a map.
   * It Creates the map for the documents in the
   * selected file
   * @param {null} takes no parameter
   * @return {null} returns no value
   */
  createMap() {
    if (!this.isEmpty()) {
      const key = 'doc';
      let keyy = '';
      for (let i = 0; i <= this.books.length - 1; i++) {
        keyy = key + (i + 1);
        this.objectMap[keyy] = this.books[i];
      }
    }
  }

  /**
   * is empty.
   * It Checks that the books
   * instance variable is not empty
   * @param {null} accepts no parameter
   * @return {boolean} value showing if books is empty or not
   */
  isEmpty() {
    let status = true;
    if (this.books.length > 0) {
      status = false;
    }
    return status;
  }

  /**
   * generate index.
   * It generates the index 
   * for the uploaded file
   * @param {null} takes no parameter
   * @return {null} returns no value
   */
  generateIndex() {
    const IndexTemp = {};
    let title = [];
    let text = [];
    let mostFrequency = 0;
    for (let i = 0; i < this.books.length; i++) {
      const Obj = this.books[i];
      title = this.removePunctuation(Obj.title).split('');
      text = this.removePunctuation(Obj.text).split('');
      for (let j = 0; j < title.length; j++) {
        title[j] = title[j].toLowerCase();
        if (IndexTemp[title[j]] !== undefined && IndexTemp[title[j]].includes(i + 1)) {
          continue;
        } else {
          if (IndexTemp[title[j]] === undefined) {
            IndexTemp[title[j]] = [];
          }
          IndexTemp[title[j]].push(i + 1);
          if (IndexTemp[title[j]].length > mostFrequency) {
            mostFrequency = IndexTemp[title[j]].length;
          }
        }
      }
      for (let j = 0; j < text.length; j++) {
        text[j] = text[j].toLowerCase();
        if (IndexTemp[text[j]] !== undefined && IndexTemp[text[j]].includes(i + 1)) {
          continue;
        } else {
          if (IndexTemp[text[j]] === undefined) {
            IndexTemp[text[j]] = [];
          }
          IndexTemp[text[j]].push(i + 1);
          if (IndexTemp[text[j]].length > mostFrequency) {
            mostFrequency = IndexTemp[text[j]].length;
          }
        }
      }
    }
    this.index = IndexTemp;
    this.mostFrequency = mostFrequency;
  }

  /**
   * gets the index.
   * It returns the index for a 
   * selected document in the uploaded
   * file
   * @param {string} DocumentKey in the uploaded file to return its index
   * @return {object} the index for the associated DocumentKey
   */
  getIndex(DocumentKey) {
    if (DocumentKey !== undefined) {
      const tempObjectMap = {};
      tempObjectMap[DocumentKey] = this.objectMap[DocumentKey];
      this.objectMap = tempObjectMap;
      this.generateIndex();
    }
    return this.index;
  }

  /**
   * search
   * Search an already generated index
   * or a file for keywords
   * @param {string} filename - The file to perform search on.
   * @param {array} terms - The terms value.
   * @return {array} The searchOutput value.
   */
  search(filename, ...terms) {
    const searchResult = [];
    const termWord = [];
    if (filename !== undefined && terms.length > 0) {
      this.createIndex(filename);
    } else {
      terms = filename;
    }
    terms = this.removePunctuation(terms[0]).split('');
    for (let i = 0; i < terms.length; i++) {
      if (searchResult !== [] && searchResult[i] !== undefined) {
        continue;
      }
      if (this.index[terms[i]]) {
        searchResult.push(this.index[terms[i]]);
      } else {
        searchResult.push([]);
      }
      termWord.push(terms[i]);
    }
    this.searchWord = termWord;
    this.searchOutput = searchResult;
    return this.searchOutput;
  }

  /**
   * is index created
   * Check if index was created
   * @param {boolean} The true/false value.
   * @return {null} returns nothing
   */
  isIndexCreated() {
    let status = false;
    if (this.index !== {}) {
      status = true;
    }
    return status;
  }

  /**
   * is map correct
   * Verify that each word is mapped to
   * the correct document
   * @param {array} rightMap - The rightMap value.
   * @return {boolean} The status value.
   */
  isMapCorrect(rightMap) {
    let status = false;
    for (let i = 0; i < this.getObjectSize(rightMap); i++) {
      if (rightMap[i] === this.objectMap[i]) {
        status = true;
      } else {
        status = false;
        break;
      }
    }
    return status;
  }

  /**
   * are all valid index
   * Check that index generated from search is correct.
   * @param {array} searchResult - The searchResult value.
   * @return {boolean} The status value.
   */
  areAllValidIndex(searchResult) {
    let status = false;
    for (let i = 0; i < searchResult.length; i++) {
      if (typeof (searchResult[i]) === typeof ([])) {
        for (let j = 0; j < searchResult[j].length; j++) {
          if (this.books[searchResult[i][j]] !== undefined) {
            status = true;
          } else {
            status = false;
            break;
          }
        }
      } else {
        if (typeof (searchResult[i][j]) === typeof (0)) {
          status = true;
        } else {
          status = false;
          break;
        }
      }
    }
    return status;
  }

  /**
   * get object size
   * Get the size of an object.
   * @param {object} object - The object value.
   * @return {number} The object size value.
   */
  getObjectSize(object) {
    return Object.keys(object).length;
  }

  /**
   * remove punctuation
   * Removes punctuation marks.
   * @param {string} sentence - The sentence value.
   * @return {string} The sentence value.
   */
  removePunctuation(sentence) {
    sentence = sentence.match(/[^_\W]+/g).join(' ');
    return sentence;
  }

  /**
   * set books
   * Set the book instance variable
   * @param {array} book - The book value.
   *@returns {null} returns nothing.
   */
  setBooks(book) {
    this.books = book;
  }

}
