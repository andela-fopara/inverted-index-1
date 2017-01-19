// test suites for the inverted index project

//import the required file
//import InvertedIndex from "../src/js/inverted-index";
//import {InvertedIndex} from '../../src/js/inverted-index';

// testSuite 1
describe("Read book data", function() {

	//creates an object of the InvertedIndex class
	let invertedIndex = new InvertedIndex();

	//calls function to
	//create index
	//which in turn calls
	//the function
	//to read the json
	//file
	invertedIndex.createIndex("books.json");

  it("assert that json file read is not empty", function() {
  		//call isEmpty function
  	expect(invertedIndex.isEmpty()).toBeFalsy();

  });
});

// testSuite 2
describe("Populate Index", function() {

	//creates an object of the InvertedIndex class
	let invertedIndex = new InvertedIndex();

	//calls function to
	//create index
	//which in turn calls
	//the function
	//to read the json
	//file
	invertedIndex.createIndex("books.json");

	//nesting describe
	  describe("Test that Index is created once JSON file has been read", function() {

	  it("assert that index is populated each time json file is read", function() {
	  	//calls function isIndexCreated() 
	  	//to see if the status variable 
	  	//is set to true or false

	  	expect(invertedIndex.isIndexCreated()).toBeTruthy();

	  });
	});
  


  describe("Test that the index maps the string keys to the correct objects in the JSON array.", function() {

	//sets the correct 
	//answer that 
	//should be returned 
	//from mapping
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


  it("assert that the index maps the string keys to the correct objects in the JSON array", function() {
  	//calls function 
  	//isMapCorrect() 
  	//to see if the status 
  	//variable is set to 
  	//true or false

  	expect(invertedIndex.isMapCorrect(correctAnswer)).toBeTruthy();

  });

});

});

// testSuite 3
describe("Search index", function() {

	//creates an object of the InvertedIndex class
	let invertedIndex = new InvertedIndex();

	//calls function to
	//create index
	//which in turn calls
	//the function
	//to read the json
	//file
	invertedIndex.createIndex("books.json");

	// run a search
	let searchResult = invertedIndex.search(['Alice','Lord',['unusual','Fellowship']]);


  it("assert that search returns an array of indices of the correct objects that contain the words in the search query - File Name not specified", function() {
  	// call the areAllValidIndex
  	// to verify that what 
  	// is returned are all
  	// integers of valid index
    expect(invertedIndex.areAllValidIndex(searchResult)).toBeTruthy();

  });

});
