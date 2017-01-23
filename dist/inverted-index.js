/** Class representing an Inverted Index */

class InvertedIndex {

    /**
     * Create an inverted index.
     */
    constructor() {


        //assume that file
        //has been read
        //and books is set
        this.books = [];

        this.objectMap = {};
        this.index = {};

        //searchWord for search
        this.searchWord = [];
        this.searchOutput = [];

        this.mostFrequency = 0;

    }

    /**
     * Create an Index.
     * @param {array} file_object
     */

    createIndex(file_object) {

        if (file_object.length > 0) {
            this.books = file_object;

            this.generateIndex();
        }

    }


    /**
     * Create a map.
     */
    createMap() {

        if (!this.isEmpty()) {

            const key = "doc";
            let keyy = "";
            for (let i = 0; i <= this.books.length - 1; i++) {
                keyy = key + (i + 1);
                this.objectMap[keyy] = this.books[i];

            }
        }

    }

    /**
     * Checks if this.books is empty.
     * @return {boolean} The status value.
     */

    isEmpty() {
        let status = true;

        if (this.books.length > 0)
            status = false;

        return status;
    }

    /**
     * Generates index.
     */

    generateIndex() {

        let index = {};

        let title = [];

        let text = [];

        let mostFrequency = 0;

        for (let i = 0; i < this.books.length; i++) {

            let obj = this.books[i];

            title = this.removePunctuation(obj.title).split(" ");

            text = this.removePunctuation(obj.text).split(" ");

            for (let j = 0; j < title.length; j++) {

                title[j] = title[j].toLowerCase();

                if (index[title[j]] !== undefined && index[title[j]].includes(i + 1)) {
                    continue;
                } else {

                    if (index[title[j]] === undefined) {
                        index[title[j]] = [];
                    }

                    index[title[j]].push(i + 1);

                    if (index[title[j]].length > mostFrequency) {
                        mostFrequency = index[title[j]].length;
                    }

                }


            }

            for (let j = 0; j < text.length; j++) {

                text[j] = text[j].toLowerCase();

                //if word has already
                //been indexed
                if (index[text[j]] !== undefined && index[text[j]].includes(i + 1)) {
                    continue;
                } else {

                    if (index[text[j]] === undefined) {
                        index[text[j]] = [];
                    }

                    index[text[j]].push(i + 1);

                    if (index[text[j]].length > mostFrequency) {
                        mostFrequency = index[text[j]].length;
                    }

                }

            }

        }

        this.index = index;
        this.mostFrequency = mostFrequency;

    }

    /**
     * Gets the Index.
     * @param {string} document_key - The document_key value, which is optional.
     * @return {object} The index value.
     */
    getIndex(document_key) {

        if (document_key !== undefined) {

            let tempObjectMap = {};

            tempObjectMap[document_key] = this.objectMap[document_key];

            this.objectMap = tempObjectMap;

            this.generateIndex();

            return this.index;
        } else {
            return this.index
        }
    }

    /**
     *Search an Index or file for keyword.
     * @param {string} filename - The file to perform search on.
     * @param {array} terms - The terms value.
     * @return {array} The searchOutput value.
     */
    search(filename, ...terms) {
        let searchResult = [];
        let termWord = [];

        if (filename !== undefined && terms.length > 0) {

            this.createIndex(filename);
        } else {
            terms = filename;
        }

        terms = this.removePunctuation(terms[0]).split(" ");

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
     * Check if index was created.
     * @return {boolean} The true/false value.
     */
    isIndexCreated() {
        if (this.index !== {}) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * Verify that each word is mapped to the correct document.
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
     * Check that index generated from search is correct.
     * @param {array} searchResult - The searchResult value.
     * @return {boolean} The status value.
     */
    areAllValidIndex(searchResult) {

        let status = false;

        for (let i = 0; i < searchResult.length; i++) {

            if (typeof(searchResult[i]) === typeof([])) {
                for (let j = 0; j < searchResult[j].length; j++) {

                    if (this.books[searchResult[i][j]] !== undefined) {
                        status = true;
                    } else {
                        status = false;

                        break;
                    }
                }
            } else {

                if (typeof(searchResult[i][j]) === typeof(0)) {
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
     * Get the size of an object.
     * @param {object} object - The object value.
     * @return {number} The object size value.
     */

    getObjectSize(object) {
        return Object.keys(object).length;
    }

    /**
     * Removes punctuation marks.
     * @param {string} sentence - The sentence value.
     * @return {string} The sentence value.
     */
    removePunctuation(sentence) {
        sentence = sentence.match(/[^_\W]+/g).join(' ');

        return sentence;
    }

    /**
     * Set the book instance variable
     * @param {array} book - The book value.
     */
    setBooks(book) {
        this.books = book;
    }

}
