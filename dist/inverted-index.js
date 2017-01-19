export class InvertedIndex{

	//constructor method
	//initializes
	//instance variables
  constructor() {

  	//default is 
  	//our books.json
    this.jsonFile = 'books.json';
    this.books = null;
    this.objectMap = null;
    this.index = {};

  }


  //function to actually
  //create the index
  //of the app but
  //reads the file first
  //before index generation
  createIndex(filePath){

    //set the jsonFile Instance variable
    this.jsonFile = filePath;

    //call function to read file
    //and set the books instance variable
    this.readFile(this.jsonFile, function(response) {

        let actual_JSON = JSON.parse(response);
        this.books = actual_JSON;
    });

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

      for (let i = 0; i <= this.books.length - 1; i++) {
          key = key+(i+1);
          object[key] = books[i];

      }
      //assign generated object
      //from map to our
      //instance variable
      this.objectMap = object;


    }
  }

//checks that 
//instance variable
//was instantiated 
//on file read and
//that file read
//isn't empty
  isEmpty(){
  	if(this.books !== null && this.books.length > 0)
  		return false;
  	else
  		return true;
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

		for (let i = 0; i < this.objectMap.length; i++) {

			//generate a fully defined key
			//for a specific element
			//in object
			keyy = key+(i+1);

			//get the current object
			const obj = this.objectMap.keyy;

			//split the title
			//of book into
			//individual words
			title = obj.title.split("");

			//split the text of
			//book into individual words
			text = obj.text.split("");

			//map title words to the
			//currect document key
			for (let j = 0; j < title.length; j++) {
				//if word has already
				//been indexed

				if(index[title[j]]){
					//check if it is
					//indexed in same
					//document as this
					let doc_list = index[title[j]].split("");

					if(doc_list.indexOf(keyy)){
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
						index[title[j]] = `${index[title[j]]} ${keyy}`;
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


			}

			//map text words to the
			//currect document key
			for (let j = 0; j < text.length; j++) {
				//if word has already
				//been indexed
				if(index[text[j]]){
					//check if it is
					//indexed in same
					//document as this
					let doc_lists = index[text[j]].split("");

					if(doc_list.indexOf(keyy)){
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
						index[text[j]] = `${index[text[j]]} ${keyy}`;
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

		//index fully generated
		//set the index
		//instance variable
		this.index = index;

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

		searchIndex(filename, ...terms){
			let searchResult = [];
			let searchResultSuper = [];
			let termWord = [];

			//check if filename
			//parameter
			//is truely passed
			if(!filename === undefined){

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

			//rest of code
			//to run not 
			//minding whether 
			//filename is 
			//undefined or not
			
			for (let i = 0; i < terms.length; i++) {
					
					//check if we are
					//dealing with an array
					if(typeof(terms[i]) === typeof([])){
						//define an inner 
						//loop for it
						//
						for (let k = 0; k < terms[i].length; k++) {
							
							//first split
							//to get doc word
							//is mapped to
							let docArray = this.index[terms[i][k]].split(",");

							//loop through
							//each of them
							//and get the index
							//number
							let index = 0;
							for (let j = 0; j < docArray.length; j++) {
								index = docArray[j].substring(2,docArray[j].length);

								//check if index
								//number has been
								//added before
								if(searchResult[j].indexOf(index) > -1){
									continue;
								}
								else{
									searchResult[j] = index;
								}
							}
							//set term word
							termWord[termWord.length] = terms[i][k];

							//set searchResultSuper
							searchResultSuper[searchResultSuper.length] = searchResult;

							//reset searchResult 
							//to empty
							searchResult = [];
						}
					}
					else{
						//we are dealing
						//with a word
			
						//first split
						//to get doc word
						//is mapped to
						let docArray = this.index[terms[i]].split(",");

						//loop through
						//each of them
						//and get the index
						//number
						let index = 0;
						for (let j = 0; j < docArray.length; j++) {
							index = docArray[j].substring(2,docArray[j].length);

							//check if index
							//number has been
							//added before
							if(searchResult[j].indexOf(index) > -1){
								continue;
							}
							else{
								searchResult[j] = index;
							}
						}
						//set term word
						termWord[termWord.length] = terms[i];

						//set searchResultSuper
						searchResultSuper[searchResultSuper.length] = searchResult;

						//reset searchResult 
						//to empty
						searchResult = [];
					}
				}
			//es6 style of
			//returning 
			//multiple values
			//by function
			//e.g. [go,you,we] = [[1,2],[1],[1,2,3]]
			//calling go[0] returns 1;
			//showing go appeared
			//in document 1 
			//in the uploaded file
			termWord = this.returnSearchResult(searchResultSuper);

			return termWord;
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

		for (let i = 0; i < rightMap.length; i++) {
			if(rightMap[i] === this.objectMap[i]){
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

}
