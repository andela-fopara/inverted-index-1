// test suites for the inverted index project

// testSuite 1
describe("Read book data", function() {

	//creates an object of the Reader class
	var reader = new Reader();

	//calls function to get all the books data in an array
	var arrayBookData = reader.getAllBooks();

  it("assert that json file read is not empty", function() {
  	// if array returned is greater than 0, imperatively file is not empty
    expect(arrayBookData.length).toBeGreaterThan(0);

  });
});

// testSuite 2
describe("Populate Index", function() {

	//creates an object of the Reader class
	var reader = new Reader();

	//calls function to populate index
	var status = reader.populateIndex();

  it("assert that json file read is not empty", function() {
  	// if array returned is greater than 0, imperatively file is not empty
    expect(status).toBe(true);

  });

  //nesting describe
  describe("Test that Index is populated when file is read", function() {

	//creates an object of the Reader class
	var reader = new Reader();

	//calls function to populate index
	// call the function inside isIndexPopulated
	// var allBooks = reader.getAllBooks(); //get the object in the selected file, and does the mapping and populate index

  it("assert that index is populated each time json file is read", function() {
  	//calls function isIndexPopulated() to see if the status variable is set to true or false

  	expect(reader.isIndexPopulated()).toBe(true);

  });
});


  describe("Test that the index maps the string keys to the correct objects in the JSON array.", function() {

	//creates an object of the Reader class
	var reader = new Reader();

	//map the documents name to each object in the array
	//following the format doc_1, doc_2, doc_3, etc.
	reader.map([
	  {
	    "title": "Alice in Wonderland",
	    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
	  },

	  {
	    "title": "The Lord of the Rings: The Fellowship of the Ring.",
	    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
	  }
	]);

	//sets the correct answer that should be returned from mapping
	var correctAnswer = {
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
  	//calls function isMapCorrect() to see if the status variable is set to true or false

  	expect(reader.isMapCorrect(correctAnswer)).toBe(true);

  });
});

});

// testSuite 3
describe("Search index", function() {

	//creates an object of the Reader class
	var reader = new Reader();

	//calls function to get all the books data in an array
	var arrayBooksData = reader.getAllBooks();


	//map the documents name to each object in the array
	//following the format doc_1, doc_2, doc_3, etc.
	reader.map([
	  {
	    "title": "Alice in Wonderland",
	    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
	  },

	  {
	    "title": "The Lord of the Rings: The Fellowship of the Ring.",
	    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
	  }
	]);

	//sets the correct answer that should be returned from the search called below
	var correctAnswer = ["doc_1","doc_2"];


  it("assert that search returns an array of indices of the correct objects that contain the words in the search query.", function() {
  	// call the search function which returns an array of indices
  	// of objects that contain the words passed in
    expect(reader.search("Alice and Lord").toBe(correctAnswer);

  });
});
