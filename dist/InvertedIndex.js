//export 
export class InvertedIndexParent{

	//constructor method
	//initializes
	//instance variables
  constructor() {

  	//default is
  	//our books.json
    //this.jsonFile = 'books.json';
    //assume that file
    //has been read
    //and books is set
    this.books = [];

    this.objectMap = {};
    this.index = {};

    //searchWord for search
    this.searchWord = [];
    this.searchOutput = [];

  }


  //function to actually
  //create the index
  //of the app but
  //reads the file first
  //before index generation
  createIndex(bookObject){
  	this.books = bookObject;

    //start index generation

    //first call map 
    //creator function
    this.createMap();

    //call function that 
    //generates the index
    this.generateIndex();


  }

  //function to read
  //the json file
  readFile(file, callback){

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); 
    console.log(file);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
             
            callback(xobj.responseText);
          }
    };
    xobj.send(null);


  }

  //function that maps
  //objects in the json
  //file to the 
  //appropriate keys
  createMap(){

    //maps the string keys 
    //to the correct object
    // if the it is not empty and 
    // contains an array
    if(!this.isEmpty()){

      //stores the result of the map
      let object = { };

      const key = "doc";
      let keyy = "";
      for (let i = 0; i <= this.books.length - 1; i++) {
          keyy = key+(i+1);
          this.objectMap[keyy] = this.books[i];

      }
      //assign generated object
      //from map to our
      //instance variable
      //this.objectMap = object;


    }
    console.log(this.objectMap);

  }

//checks that 
//instance variable
//was instantiated 
//on file read and
//that file read
//isn't empty
  isEmpty(){
  		var status = true;
	  	if(this.books.length > 0)
	  		status = false;

	  return status;
  }

  generateIndex(){

  		//stores the generated index
		let index = {};

		//stores the title words
		//during index generation
		let title = [];

		//stores the test words
		//during index generation
		let text = [];

		//key prefix to access
		//map objects
		const key = "doc";

		let keyy = "";

		for (let i = 0; i < this.getObjectSize(this.objectMap); i++) {

			//generate a fully defined key
			//for a specific element
			//in object
			keyy = key+(i+1);

			//get the current object
			var obj = this.objectMap[keyy];
			
			//split the title
			//of book into
			//individual words
			title = obj.title.split(" ");
			
			//split the text of
			//book into individual words
			text = obj.text.split(" ");

			//map title words to the
			//currect document key
			for (let j = 0; j < title.length; j++) {

				//remove trailing
				//punctuation before
				//continuing
				//with other
				//operations
				title[j] = this.removeTrailingPunctuation(title[j]);

				//if word has already
				//been indexed
				if(index[title[j]] !== undefined){
					
					//check if it is
					//indexed in same
					//document as this
					let doc_list = index[title[j]].split(",");

					if(doc_list.indexOf(keyy) >= 0){
						//continue with
						//the next word,
						//word has been
						//indexed to be
						//on this doc
						continue;
					}
					else{
						//word hasn't been
						//indexed to be
						//on this document
						//so add the document
						//index[title[j]] = `${index[title[j]]} ${keyy}`;
						index[title[j]] = index[title[j]]+","+keyy;
					}
				}
				else{
					//word hasn't been
					//indexed on this
					//document
					//so index it for the
					//first time
					//key stores the
					//document id
					//which is also
					//the string key
					//in the object
					//map
					index[title[j]] = keyy;

				}

				

			}

			//map text words to the
			//currect document key
			for (let j = 0; j < text.length; j++) {

				//remove trailing
				//punctuation before
				//continuing
				//with other
				//operations
				text[j] = this.removeTrailingPunctuation(text[j]);

				//if word has already
				//been indexed
				if(index[text[j]] !== undefined){
					
					//check if it is
					//indexed in same
					//document as this
					let doc_list = index[text[j]].split(",");

					if(doc_list.indexOf(keyy) >= 0){
						//continue with
						//the next word,
						//word has been
						//indexed to be
						//on this doc
						continue;
					}
					else{
						//word hasn't been
						//indexed to be
						//on this document
						//so add the document
						//index[title[j]] = `${index[title[j]]} ${keyy}`;
						index[text[j]] = index[text[j]]+","+keyy;
					}
				}
				else{
					//word hasn't been
					//indexed on this
					//document
					//so index it for the
					//first time
					//key stores the
					//document id
					//which is also
					//the string key
					//in the object
					//map
					index[text[j]] = keyy;

				}

				

			}


			

			
			}

		//index fully generated
		//set the index
		//instance variable
		this.index = index;
		console.log(this.index);
		}

		//document_key
		//can be undefined
		//indicating we want
		//the index of the
		//content of the
		// json file
		getIndex(document_key){

			if(!document_key === undefined){
				//initialize objectMap to 
				//contain only the document
				//key
				let tempObjectMap = {};

				tempObjectMap[document_key] = this.objectMap[document_key];

				this.objectMap = tempObjectMap;

				this.generateIndex();

				return this.index;
			}
			else{
				return this.index
			}
		}

		search(filename, ...terms){
			let searchResult = {};
			let temp = [];
			let termWord = [];


			//check if filename
			//parameter
			//is truely passed
			//and terms is passed
			//terms must be
			//passed else
			//whatever file
			//contains could
			//be our
			//array of terms
			if(!filename === undefined && terms.length>0){

				//a new file name 
				//is passed, so don't
				//use default
				//we call 
				//createIndex first
				this.createIndex(filename);

				//index now exist 
				//we can continue 
				//with other stuffs

			}
			else{
				//initialize terms
				//with filename
				//because it
				//imperatively
				//contains our
				//array of
				//words
				terms = filename;
			}

			//reformat terms in 
			//a form that we can
			//process
			//terms = this.reformatSearchTerms(terms);
			//console.log(terms);

			//rest of code
			//to run not
			//minding whether
			//filename is
			//undefined or not
			
			for (let i = 0; i < terms.length; i++) {
						
					//check if we are
					//dealing with an array
					if(typeof(terms[i]) == typeof([])){
						//define an inner 
						//loop for it
						for (let j = 0; j< terms[i].length; j++) {
							
							//check if word
							//is already in 
							//searchResult
							if(searchResult[terms[i][j]] !== undefined){
								//continue 
								//with next
								//word 
								continue;
							}

							//first split
							//to get doc word
							//is mapped to
							let docArray = this.index[terms[i][j]].split(",");
							
							//loop through
							//each of them
							//and get the index
							//number
			
							for (let k = 0; k < docArray.length; k++) {
								temp[k] = docArray[k].substring(3,docArray[k].length) - 1;
							}
							//set term word
							//searchResult 
							//for word
							termWord[termWord.length] = terms[i][j];
							searchResult[terms[i][j]] = temp;
							
							//reset temp
							//to empty
							temp = [];
						}
					}
					else{
						//we are dealing
						//with a word
						
						//check if word
						//is already in 
						//searchResult
						if(searchResult[terms[i]] !== undefined){
							//continue
							//with next
							//word
								continue;
							}

						//first split
						//to get doc word
						//is mapped to
						//console.log(this.index);

						let docArray = this.index[terms[i]].split(",");

						//loop through
						//each of them
						//and get the index
						//number
						for (let k = 0; k < docArray.length; k++) {
							temp[k] = docArray[k].substring(3,docArray[k].length) - 1;
						}

						//set term word
						//searchResult 
						//for word
						termWord[termWord.length] = terms[i];
						searchResult[terms[i]] = temp;
						
						//reset temp
						//to empty
						temp = [];
					}
				}
			//set termWord 
			//Instance Variable
			this.searchWord = termWord;
			
			//call function to 
			//transform object
			//output to
			//array of indices
			let finalSearchResult = this.transform(searchResult);

			this.searchOutput = finalSearchResult;

			console.log(this.searchOutput);
			return finalSearchResult;

			
		}

	//function just returns 
	//its parameter
	//this facilitates
	//es 6 multiple value
	//return by function
	returnSearchResult(searchResult){
		return searchResult;
	}

	//function to check
	//if Index is created
	//that is not {}
	isIndexCreated(){
		if(this.index !== {}){
			return true;
		}
		else{
			return false;
		}

	}

	//verifies that mapping
	//used to generate
	//index is correct
	isMapCorrect(rightMap){

		//initially
		//assume that
		//mapping is wrong
		let status = false;

		for (let i = 0; i < this.getObjectSize(rightMap); i++) {
			if(rightMap[i] == this.objectMap[i]){
				status = true;
			}
			else{
				status = false;
				//no need to 
				//continue till
				//end of loop
				
				break;
			}

		}
		
		return status;

	}

	areAllValidIndex(searchResult){
			//assume that indices
			//are wrong at the onset
			let status = false;

			//loop through
			//to check that
			//they are integers
			//and they are index
			//this.books
			for (let i = 0; i < searchResult.length; i++) {
				//check if 
				//I am looking
				//at an array of indices
				if(typeof(searchResult[i]) === typeof([])){
					for (let j = 0; j < searchResult[j].length; j++) {
						//check indice 
						//exist in book
						
						console.log(searchResult[i][j]);
						console.log(this.books[searchResult[i][j]]);
						if(this.books[searchResult[i][j]] !== undefined){
							status = true;
						}
						else{
							status = false;
							//no need to continue
							//so break
							break;
						}
					}
				}
				else{
						//check elements 
						//are all integers
						if(typeof(searchResult[i][j]) === typeof(0)){
							status = true;
						}
						else{
							status = false;
							//no need to continue
							//so break
							break;
						}
				}
			}
			return status;
	}

	getObjectSize(object){
		return Object.keys(object).length;
	}

	removeTrailingPunctuation(word){
		//get length of word
		let l = word.length;

		//set array of
		//punctuation marks
		let pMarks = [",","?",",",".",":",";","!"];

		//check that last
		//character is
		//not a 
		//punctuation mark
		if(pMarks.indexOf(word.substring(l-1)) >= 0){
			//word contains
			//trailing
			//punctuation
			//mark, take it
			//out
			word = word.substring(0,l-1);
		}
		return word;
	}

	transform(searchResult){

		//variable to
		//hold result
		let temp = [];

		//loop through 
		//searchWord
		//instance variables
		//since they are
		//keys of the
		//searchResult
		
		for (let i = 0; i < this.getObjectSize(this.searchWord); i++) {
			//assign the array
			//of indices
			//at that
			//key to temp
			//at index i
			temp[i] = searchResult[this.searchWord[i]];
		}

		return temp;
		
	}

	setBooks(book){
		this.books = book;
	}

}
export { InvertedIndex };
