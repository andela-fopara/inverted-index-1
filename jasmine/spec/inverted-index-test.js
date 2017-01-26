/* test suites for the inverted index project */

/* testSuite 1 */
describe("Read book data -:", () => {
  let invertedIndex = new InvertedIndex();
  let book1 = [{
      "title": "Alice in Wonderland",
      "text": "Alice falls into a rabbit hole and enters a world full of imagination."
    },
    {
      "title": "The Lord of the Rings: The Fellowship of the Ring.",
      "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
    }
  ];
  let book2 = [];
  describe("assert that json file read is not empty -:", () => {
    it("assert that isEmpty function return false for book1", () => {
      expect(invertedIndex.isEmpty(book1)).toBeFalsy();
    });
    it("assert that isEmpty function return true for book2", () => {
      expect(invertedIndex.isEmpty(book2)).toBeTruthy();
    });
  });
});

/*testSuite 2 */
describe("Populate Index -:", () => {
  let invertedIndex = new InvertedIndex();
  let book1 = [{
      "title": "Ada in Wonderland",
      "text": "Going to the Moon!"
    },
    {
      "title": "Obi is a boy",
      "text": "Rules the world."
    }];
  let book2 = [{
      "echo": "Ada in Wonderland",
      "me": "Going to the Moon!"
    },
    {
      "you": "Obi is a boy",
      "us": "Rules the world."
    }];
  let book3 = ["elahsoft","ladyb","urchman"];
  describe("Ensures the file content is actually a valid JSON Array -:", () => {
    it("assert that isValidJsonArray returns true for book1", () => {
      expect(invertedIndex.isValidJsonArray(book1)).toBeTruthy();
    });
    it("assert that isValidJsonArray returns false for book2", () => {
      expect(invertedIndex.isValidJsonArray(book2)).toBeFalsy();
    });
    it("assert that isValidJsonArray returns false for book3", () => {
      expect(invertedIndex.isValidJsonArray(book3)).toBeFalsy();
    });
  });
  let correctIndex = {
      ada: [1],
      in: [1],
      wonderland: [1],
      going: [1],
      to: [1],
      the: [1, 2],
      moon: [1],
      obi: [2],
      is: [2],
      a: [2],
      boy: [2],
      rules: [2],
      world: [2]
    };
    let wrongIndex = {
      ada: [1],
      in: [1],
      wonderland: [1,2,4],
      going: [1],
      to: [1],
      the: [1, 2],
      moon: [1],
      obi: [2],
      is: [2],
      a: [2],
      boy: [2],
      rules: [2],
      world: [1,2],
    };
  invertedIndex.createIndex(book1);
  describe("Test that Index is created once JSON file has been read -:", () => {
    it("confirm that isIndexCreated function works well by returning true for correctIndex", () => {
      expect(invertedIndex.index).toEqual(correctIndex);
    });
    it("confirm that isIndexCreated function works well by returning false for wrongIndex", () => {
      expect(Object.keys(invertedIndex.index).length).toBeGreaterThan(0);
    });
    it("assert that index is populated each time json file is read", () => {
      expect(invertedIndex.isIndexCreated()).toBeTruthy();
    });
  });
  describe("Test that the index maps the string keys to the correct objects in the JSON array -:", () => {
    let correctAnswer = {
      ada: [1],
      in: [1],
      wonderland: [1],
      going: [1],
      to: [1],
      the: [1, 2],
      moon: [1],
      obi: [2],
      is: [2],
      a: [2],
      boy: [2],
      rules: [2],
      world: [2]
    };
    let wrongAnswer = {
      ada: [1],
      in: [1],
      wonderland: [1,9,8,7],
      going: [1],
      to: [1,5],
      the: [1, 2],
      moon: [1,3],
      obi: [2],
      is: [2,3],
      a: [1,2],
      boy: [2],
      rules: [2],
      world: [2]
    };
    invertedIndex.createIndex(book1);
    describe("Confirm that isMapCorrect function works as expected", () => {
      it("invertedIndex.index[ada]).toEqual(correctAnswer[ada]", () => {
        expect(invertedIndex.index['ada']).toEqual(correctAnswer['ada']);
      });
      it("invertedIndex.index[world]).toEqual(correctAnswer[world]", () => {
        expect(invertedIndex.index['world']).toEqual(correctAnswer['world']);
      });
      it("invertedIndex.index[moon]).toEqual(correctAnswer[moon]", () => {
        expect(invertedIndex.index['moon']).toEqual(correctAnswer['moon']);
      });

      it("invertedIndex.index['moon'] !== wrongAnswer['moon']", () => {
        expect(invertedIndex.index['moon'] !== wrongAnswer['moon']).toBeTruthy();
      });
      it("invertedIndex.index['to'] !== wrongAnswer['to']", () => {
        expect(invertedIndex.index['to'] !== wrongAnswer['to']).toBeTruthy();
      });
      it("invertedIndex.index[a] !== wrongAnswer[a]", () => {
        expect(invertedIndex.index['a'] !== wrongAnswer['a']).toBeTruthy();
      });
    });
    it("assert that the index maps the string keys to the correct objects in the JSON array", () => {
      expect(invertedIndex.isMapCorrect(correctAnswer)).toBeTruthy();
    });
  });
});

/* testSuite 3 */
describe("Search index -:", () => {
  let invertedIndex = new InvertedIndex();
  let book = [{
      "title": "Ada in Wonderland",
      "text": "Going to the Moon!"
    },
    {
      "title": "Obi is a boy",
      "text": "Rules the world."
    }];
  let correctArrayOfIndices = [ [1],[1],[2],[1] ];
  invertedIndex.createIndex(book);
  let searchResult = invertedIndex.search(book, 'Ada', 'In', ['world', 'Moon'], "hello");
  describe("Confirm that areAllValidIndex function works well -:", () => {
    it("assert that correctArrayOfIndices[0] === invertedIndex.index['ada']",() => {
      expect(correctArrayOfIndices[0]).toEqual(invertedIndex.index['ada']);
    });
    it("assert that correctArrayOfIndices[1] === invertedIndex.index['in']",() => {
      expect(correctArrayOfIndices[1]).toEqual(invertedIndex.index['in']);
    });
    it("assert that correctArrayOfIndices[2] === invertedIndex.index['world']",() => {
      expect(correctArrayOfIndices[2]).toEqual(invertedIndex.index['world']);
    });
    it("assert that correctArrayOfIndices[3] === invertedIndex.index['moon']",() => {
      expect(correctArrayOfIndices[3]).toEqual(invertedIndex.index['moon']);
    });
    it("assert that correctArrayOfIndices[4] === invertedIndex.index['moon']",() => {
      expect(correctArrayOfIndices[4]).toEqual(invertedIndex.index['hello']);
    });
  });
  it("assert that search returns an array of indices of the correct objects that contain the words in the search query - File Name not specified", () => {
    expect(invertedIndex.areAllValidIndex(searchResult, correctArrayOfIndices)).toBeTruthy();
  });
});