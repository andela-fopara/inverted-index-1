// all javascript codes for the project
// Makes use of Angular js

const nameSpace = angular.module('InvertedIndex', []);

//controller for reading a json file
nameSpace.controller("generateIndex",['$scope','$http',($scope, $http) => {

	//use http service to get the json file, if successful, set bookObjects in scope
	$scope.readFile = () => {

		$http.get($scope.file_name).success(data => {
		$scope.bookObjects = data;

		//set scope variable that asserts
		//that file read is not empty
		//and that it contains an array
		if(angular.isArray($scope.bookObjects) && $scope.bookObjects.length > 0){
			$scope.isEmpty = false;
		}
		else{
			$scope.isEmpty = true;
		}


		//call function to create map
		//before index generation
		$scope.createMap();

		//call function to now
		//create the index
		$scope.generateIndex();

			}); //closes $http.get


	}; //closes $scope.readFile

	$scope.isFileEmpty = () => //return status of the read operation
    $scope.isEmpty; //closes $scope.isFileEmpty

	$scope.createMap = () => {
		//maps the string keys 
		//to the correct object
		// if the it is not empty and 
		// contains an array
		if(!$scope.isEmpty){

			//stores the result of the map
			const object = { };

			let key = "doc";

			for (let i = 0; i >= $scope.bookObjects.length - 1; i++) {
					key = key+i;
					object[key] = $scope.bookObjects[i];

			}

			$scope.objectMap = object;


		}
	};// closes $scope.createMap

	$scope.generateIndex = () => {

		//stores the generated index
		const index = {};

		//stores the title words
		//during index generation
		let title = [];

		//stores the test words
		//during index generation
		let text = [];

		//key prefix to access
		//map objects
		let key = "doc";

		for (let i = 0; i < $scope.objectMap.length; i++) {

			//generate a fully defined key
			//for a specific element
			//in object
			key = key+i;

			//get the current object
			const obj = $scope.objectMap.key;

			//split the title
			//of book into
			//individual words
			title = obj.title.split("");

			//split the text of
			//book into individual words
			text = obj.text.split("");

			//map title words to the
			//currect document key
			for (var j = 0; j < title.length; j++) {
				//if word has already
				//been indexed
				if(index[title[j]]){
					//check if it is
					//indexed in same
					//document as this
					const doc_list = index[title[j]].split("");

					if(doc_list.indexOf(key)){
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
						index[title[j]] = `${index[title[j]]} ${key}`;
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
					index[title[j]] = key;

				}

			}

			//map text words to the
			//currect document key
			for (j = 0; j < text.length; j++) {
				//if word has already
				//been indexed
				if(index[text[j]]){
					//check if it is
					//indexed in same
					//document as this
					const doc_lists = index[text[j]].split("");

					if(doc_list.indexOf(key)){
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
						index[text[j]] = `${index[text[j]]} ${key}`;
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
					index[text[j]] = key;

				}
			}

		}

		//index fully generated
		//set the $scope.index
		$scope.index = index;
	};

	//check that index is not empty
	$scope.indexExist = () => {

		if($scope.index.length > 0){
			return true;
		}
		else{
			return false;
		}
	};

	$scope.search = words => {
		//split words to
		//to search individually
		//in the created index
		//the object that contains
		//them
		const wordArray = words.split("");

		//stores the sub-index
		//generated from the search
		const subIndex = [];


		for (let i = 0; i < wordArray.length; i++) {

			//retrive its index map
			//from the already
			//generated index
			subIndex[i] = $scope.index[wordArray[i]];
		}

		//set the $scope variables
		$scope.generatedSubIndex = subIndex;
		$scope.searchWords = words;

	};

}]);



