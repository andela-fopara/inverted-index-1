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
   * @param {array} FileObject
   * @param {String} fileName
   * @returns {void} returns nothing
   */
  createIndex(FileObject, fileName) {
    const isEmptyStatus = this.isEmpty(FileObject);
    if (!isEmptyStatus) {
      const isValidJsonArrayStatus = this.isValidJsonArray(FileObject);
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
  isEmpty(FileObject) {
    let status = true;
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
  generateIndex(fileName) {
    let IndexTemp = {};
    let title = [];
    let text = [];
    for (let i = 0; i < this.books.length; i++) {
      const Obj = this.books[i];
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
  process(textOrTitle, IndexTemp, counter) {
    for (let j = 0; j < textOrTitle.length; j++) {
      textOrTitle[j] = textOrTitle[j].toLowerCase();
      if (IndexTemp[textOrTitle[j]] === undefined) {
        IndexTemp[textOrTitle[j]] = [];
      }
      if (IndexTemp[textOrTitle[j]] !== undefined &&
        !IndexTemp[textOrTitle[j]].includes(counter + 1)) {
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
    const searchResult = [];
    const termWord = [];
    if (typeof (fileName) === 'string' && fileName.endsWith('.json')) {
      this.index = this.allIndex[fileName];
    } else {
      terms.unshift(fileName);
    }
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

export { InvertedIndex };