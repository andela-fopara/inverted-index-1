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
            "title": "Ada in Wonderland",
            "text": "Going to the Moon!"
        },

        {
            "title": "Obi is a boy",
            "text": "Rules the world."
        }
    ];

    invertedIndex.createIndex(book);

       describe("Ensures the file content is actually a valid JSON Array", () => {

        it("assert that the file content is actually a valid JSON Array", () => {

            expect(invertedIndex.isValidJsonArray()).toBeTruthy();

        });
    });

    describe("Test that Index is created once JSON file has been read", () => {

        it("assert that index is populated each time json file is read", () => {

            expect(invertedIndex.isIndexCreated()).toBeTruthy();

        });
    });

    describe("Test that the index maps the string keys to the correct objects in the JSON array.", () => {

        let correctAnswer = {
            ada: [1],
            in: [1],
            going: [1],
            to: [1],
            the: [1,2],
            moon: [1],
            obi: [2],
            is: [2],
            a: [2],
            boy: [2],
            rules: [2],
            world: [2]
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
            "title": "Ada in Wonderland",
            "text": "Going to the Moon!"
        },

        {
            "title": "Obi is a boy",
            "text": "Rules the world."
        }
    ];

    let correctArrayOfIndices = [[1],[1],[2],[1]];

    invertedIndex.createIndex(book);

    let searchResult = invertedIndex.search(['Ada', 'In', ['world', 'Moon']]);


    it("assert that search returns an array of indices of the correct objects that contain the words in the search query - File Name not specified", () => {
        expect(invertedIndex.areAllValidIndex(searchResult,correctArrayOfIndices)).toBeTruthy();

    });

});
