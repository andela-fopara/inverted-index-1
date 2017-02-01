/* test suites for the inverted index project */
const invertedIndex = new InvertedIndex();
const book1 = [{
  title: 'Alice in Wonderland',
  text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
},
{
  title: 'The Lord of the Rings: The Fellowship of the Ring.',
  text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
}
];
const book2 = [];
const book3 = [{
  title: 'Ada in the Wonderland',
  text: 'Going to the Moon!'
},
{
  title: 'Obi is a boy',
  text: 'Rules the world.'
}
];
const book4 = [{
  echo: 'Ada in Wonderland',
  me: 'Going to the Moon!'
},
{
  you: 'Obi is a boy',
  us: 'Rules the world.'
}
];
const book5 = ['elahsoft', 'ladyb', 'urchman'];
const correctIndex = {
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
const wrongAnswer = {
  ada: [1],
  in: [1],
  wonderland: [1, 9, 8, 7],
  going: [1],
  to: [1, 5],
  the: [1, 2],
  moon: [1, 3],
  obi: [2],
  is: [2, 3],
  a: [1, 2],
  boy: [2],
  rules: [2],
  world: [2]
};
const correctArrayOfIndices = [
  [1],
  [1],
  [2],
  [1],
  []
];

/* testSuite 1 
*
*Tests that the file read when createIndex 
*is called is not empty 
*/
describe('Read book data', () => {
  describe('assert that json file read as at the time index is created not empty', () => {
    invertedIndex.createIndex(book1, 'book1.json');
    it('assert that isEmpty function return false for book1', () => {
      expect(invertedIndex.isEmpty(invertedIndex.books)).toBeFalsy();
    });
    it('assert that isEmpty function return true for book2', () => {
      expect(invertedIndex.isEmpty(book2)).toBeTruthy();
    });
    invertedIndex.createIndex(book2, 'book2.json');
    it('assert that index is never generated for empty arrays', () => {
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
describe('Populate Index', () => {
  describe('Ensures the file content is actually a valid JSON Array', () => {
    it('assert that isValidJsonArray returns true for book1', () => {
      expect(invertedIndex.isValidJsonArray(book3)).toBeTruthy();
    });
    it('assert that isValidJsonArray returns false for book2', () => {
      expect(invertedIndex.isValidJsonArray(book4)).toBeFalsy();
    });
    it('assert that isValidJsonArray returns false for book3', () => {
      expect(invertedIndex.isValidJsonArray(book5)).toBeFalsy();
    });
  });
  invertedIndex.createIndex(book3, 'book3.json');
  describe('Test that Index is created once JSON file has been read', () => {
    it('assert that index is populated each time json file is read', () => {
      expect(invertedIndex.index).toEqual(correctIndex);
    });
    it('assert that index is populated each time json file is read', () => {
      expect(Object.keys(invertedIndex.index).length).toBeGreaterThan(0);
    });
    it('assert that getObjectSize works properly', () => {
      expect(Object.keys(invertedIndex.index).length)
      .toBe(invertedIndex.getObjectSize(invertedIndex.index));
    });
  });
  describe('Test that the index maps the string keys to the correct objects in the JSON array', () => {
    describe('Confirm that isMapCorrect function works as expected', () => {
      it('invertedIndex.index[ada]).toEqual(correctIndex[ada]', () => {
        expect(invertedIndex.index['ada']).toEqual(correctIndex['ada']);
      });
      it('invertedIndex.index[world]).toEqual(correctIndex[world]', () => {
        expect(invertedIndex.index['world']).toEqual(correctIndex['world']);
      });
      it('invertedIndex.index[moon]).toEqual(correctIndex[moon]', () => {
        expect(invertedIndex.index['moon']).toEqual(correctIndex['moon']);
      });
      it('invertedIndex.index[moon] !== wrongAnswer[moon]', () => {
        expect(invertedIndex.index['moon'] === wrongAnswer['moon']).toBeFalsy();
      });
      it('invertedIndex.index[to] !== wrongAnswer[to]', () => {
        expect(invertedIndex.index['to'] === wrongAnswer['to']).toBeFalsy();
      });
      it('invertedIndex.index[a] !== wrongAnswer[a]', () => {
        expect(invertedIndex.index['a'] === wrongAnswer['a']).toBeFalsy();
      });
    });
    describe('Confirm that I can get the index with document id specified', () => {
      it('assert that invertedIndex.getIndex(book2.json) === invertedIndex.allIndex[book2.json]', () => {
        expect(invertedIndex.getIndex('book2.json')).toEqual(invertedIndex.allIndex['book2.json']);
      });
    });
    describe('Confirm that I can get the index with document id not specified', () => {
      it('assert that invertedIndex.getIndex() === invertedIndex.index', () => {
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
describe('Search index -:', () => {
  const searchResult = invertedIndex.search('book3.json', 'Ada', 'In', ['world', 'Moon'], 'hello');
  describe('Confirm that search works well for array of array mixed with words', () => {
    it('assert that correctArrayOfIndices[0] === invertedIndex.index[ada]', () => {
      expect(correctArrayOfIndices[0]).toEqual(invertedIndex.index['ada']);
      expect(searchResult[0]).toEqual(invertedIndex.index['ada']);
    });
    it('assert that correctArrayOfIndices[1] === invertedIndex.index[in]', () => {
      expect(correctArrayOfIndices[1]).toEqual(invertedIndex.index['in']);
      expect(searchResult[1]).toEqual(invertedIndex.index['in']);
    });
    it('assert that correctArrayOfIndices[2] === invertedIndex.index[world]', () => {
      expect(correctArrayOfIndices[2]).toEqual(invertedIndex.index['world']);
      expect(searchResult[2]).toEqual(invertedIndex.index['world']);
    });
    it('assert that correctArrayOfIndices[3] === invertedIndex.index[moon]', () => {
      expect(correctArrayOfIndices[3]).toEqual(invertedIndex.index['moon']);
      expect(searchResult[3]).toEqual(invertedIndex.index['moon']);
    });
    it('assert that correctArrayOfIndices[4] === invertedIndex.index[hello]', () => {
      expect(searchResult[4]).toEqual([]);
      expect(correctArrayOfIndices[4]).toEqual(searchResult[4]);
    });
  });
  const searchResult2 = invertedIndex.search('book3.json', 'Ada', 'In', 'world', 'Moon', 'hello');
  describe('Confirm that search works well for array of words', () => {
    it('assert that correctArrayOfIndices[0] === invertedIndex.index[ada]', () => {
      expect(correctArrayOfIndices[0]).toEqual(invertedIndex.index['ada']);
      expect(searchResult2[0]).toEqual(invertedIndex.index['ada']);
    });
    it('assert that correctArrayOfIndices[1] === invertedIndex.index[in]', () => {
      expect(correctArrayOfIndices[1]).toEqual(invertedIndex.index['in']);
      expect(searchResult2[1]).toEqual(invertedIndex.index['in']);
    });
    it('assert that correctArrayOfIndices[2] === invertedIndex.index[world]', () => {
      expect(correctArrayOfIndices[2]).toEqual(invertedIndex.index['world']);
      expect(searchResult2[2]).toEqual(invertedIndex.index['world']);
    });
    it('assert that correctArrayOfIndices[3] === invertedIndex.index[moon]', () => {
      expect(correctArrayOfIndices[3]).toEqual(invertedIndex.index['moon']);
      expect(searchResult2[3]).toEqual(invertedIndex.index['moon']);
    });
    it('assert that correctArrayOfIndices[4] === invertedIndex.index[hello]', () => {
      expect(searchResult2[4]).toEqual([]);
      expect(correctArrayOfIndices[4]).toEqual(searchResult[4]);
    });
  });

  const searchResult3 = invertedIndex.search('Ada', 'In', 'world', 'Moon', 'hello');
  describe('Confirm that search works when fileName is undefined', () => {
    it('assert that correctArrayOfIndices[0] === invertedIndex.index[ada]', () => {
      expect(correctArrayOfIndices[0]).toEqual(invertedIndex.index['ada']);
      expect(searchResult3[0]).toEqual(invertedIndex.index['ada']);
    });
    it('assert that correctArrayOfIndices[1] === invertedIndex.index[in]', () => {
      expect(correctArrayOfIndices[1]).toEqual(invertedIndex.index['in']);
      expect(searchResult3[1]).toEqual(invertedIndex.index['in']);
    });
    it('assert that correctArrayOfIndices[2] === invertedIndex.index[world]', () => {
      expect(correctArrayOfIndices[2]).toEqual(invertedIndex.index['world']);
      expect(searchResult3[2]).toEqual(invertedIndex.index['world']);
    });
    it('assert that correctArrayOfIndices[3] === invertedIndex.index[moon]', () => {
      expect(correctArrayOfIndices[3]).toEqual(invertedIndex.index['moon']);
      expect(searchResult3[3]).toEqual(invertedIndex.index['moon']);
    });
    it('assert that correctArrayOfIndices[4] === searchResult[hello]', () => {
      expect(searchResult3[4]).toEqual([]);
      expect(correctArrayOfIndices[4]).toEqual(searchResult3[4]);
    });
  });
});
