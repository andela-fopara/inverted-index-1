/* test suites for the inverted index project */

/* testSuite 1 */
describe("Read book data", () => {

    let invertedIndex = new InvertedIndex();

    let book = [{
            "title": "Alice in Wonderland",
            "text": "Alice falls into a rabbit hole and enters a world full of imagination."
        },

        {
            "title": "The Lord of the Rings: The Fellowship of the Ring.",
            "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
        }
    ];

    invertedIndex.createIndex(book);

    it("assert that json file read is not empty", () => {

        expect(invertedIndex.isEmpty()).toBeFalsy();

    });
});

/*testSuite 2 */

describe("Populate Index", () => {

    let invertedIndex = new InvertedIndex();

    let book = [{
            "title": "Alice in Wonderland",
            "text": "Alice falls into a rabbit hole and enters a world full of imagination."
        },

        {
            "title": "The Lord of the Rings: The Fellowship of the Ring.",
            "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
        }
    ];

    invertedIndex.createIndex(book);

    describe("Test that Index is created once JSON file has been read", () => {

        it("assert that index is populated each time json file is read", () => {

            expect(invertedIndex.isIndexCreated()).toBeTruthy();

        });
    });



    describe("Test that the index maps the string keys to the correct objects in the JSON array.", () => {

        let correctAnswer = {
            doc_1: {
                "title": "Alice in Wonderland",
                "text": "Alice falls into a rabbit hole and enters a world full of imagination."
            },
            doc_2: {
                "title": "The Lord of the Rings: The Fellowship of the Ring.",
                "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
            }
        };


        it("assert that the index maps the string keys to the correct objects in the JSON array", () => {

            expect(invertedIndex.isMapCorrect(correctAnswer)).toBeTruthy();

        });

    });

});

/* testSuite 3 */
describe("Search index", () => {

    let invertedIndex = new InvertedIndex();

    let book = [{
            "title": "Alice in Wonderland",
            "text": "Alice falls into a rabbit hole and enters a world full of imagination."
        },

        {
            "title": "The Lord of the Rings: The Fellowship of the Ring.",
            "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
        }
    ];

    invertedIndex.createIndex(book);

    let searchResult = invertedIndex.search(['Alice', 'Lord', ['unusual', 'Fellowship']]);


    it("assert that search returns an array of indices of the correct objects that contain the words in the search query - File Name not specified", () => {
        expect(invertedIndex.areAllValidIndex(searchResult)).toBeTruthy();

    });

});
