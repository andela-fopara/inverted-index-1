/**
 * @ngdoc module
 * @name InvertedIndex:InvertedIndex
 * @description
 * This is InvertedIndex module.
 **/

const nameSpace = angular.module('InvertedIndex', ['ngSanitize', 'angularModalService']);



/**
 * @ngdoc controller
 * @name InvertedIndex.InvertedIndexController:InvertedIndexController
 * @description
 * A controller that controls the update of the 
 * app front end when the scope variables
 * changes based on events
 * @param {String, array} The name of controller and an  array of global variables/callback function
 * @returns {null} Returns nothing
 */

nameSpace.controller('InvertedIndexController', ['$scope', '$sce', 'ModalService', ($scope, $sce, ModalService) => {
  $scope.allFiles = {};
  $scope.file_names = [];
  $scope.invertedIndex = new InvertedIndex();
  $scope.index = null;
  $scope.allMostFrequency = {};
  $scope.allContents = {};

  $scope.terms = ['Term'];

  $scope.words = null;

  $scope.index_display = [];
  $scope.index_search_display = [];

  $scope.selected_file = [];
  $scope.search_terms = [];
  $scope.search_words_array = '';
  $scope.allSearchResult = [];

  let reader;

  /**
   * @ngdoc function
   * @name upload
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function calls functions that read
   * the selected file 
   */
  $scope.upload = (file) => {
    if (file === undefined) {
      $scope.progress = document.querySelector('.percent');
      $scope.handleFileSelect();
    }
  };


  /**
   * @ngdoc function
   * @name abortRead
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function aborts the file reading
   */
  $scope.abortRead = () => {
    reader.abort;
  };

  /**
   * @ngdoc function
   * @name updateProgress
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function updates the UI progress bar
   */
  $scope.updateProgress = (evt) => {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      const percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      if (percentLoaded < 100) {
        $scope.progress.style.width = `${percentLoaded}%`;
        $scope.progress.textContent = `${percentLoaded}%`;
      }
    }
  };

  /**
   * @ngdoc function
   * @name handleFileSelect
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description This function reads the selected file,
   * resets progress bar on new file selection,
   * calls function to prepare generated index for viewing
   */
  $scope.handleFileSelect = (evt) => {
    let fileArray = document.getElementById('files').files;
    for (let i = 0; i < fileArray.length; i++) {
      $scope.progress.style.width = '0%';
      $scope.progress.textContent = '0%';
      reader = new FileReader();
      reader.onabort = e => {
        $scope.readerAborted = true;
        $scope.showErrorModal();
      };
      reader.onloadstart = e => {
        document.getElementById('progress_bar').className = 'loading';
      };
      reader.onload = e => {
        let content = e.target.result;
        $scope.$apply(() => {
          $scope.content = content;
          if ($scope.file_names.indexOf(fileArray[i].name) === -1) {
            if ($scope.content) {
              $scope.file_object = JSON.parse(content);
              if ($scope.invertedIndex.isValidJsonArray($scope.file_object)) {
                $scope.invertedIndex.createIndex($scope.file_object);
                $scope.files = fileArray[i];
                $scope.allFiles[$scope.files.name] = $scope.file_object;
                $scope.file_names.push($scope.files.name);
                $scope.allContents[$scope.files.name] = $scope.content;
                $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.content}</code></p>`);
                $scope.index = $scope.invertedIndex.index;
                $scope.allMostFrequency[$scope.files.name] = $scope.invertedIndex.mostFrequency;
                $scope.progress.textContent = '100%';
                $scope.prepareIndexViewComponents();
              } else {
                $scope.notValidJSONFile = true;
                $scope.showErrorModal();
              }
            } else {
              $scope.isEmptyFile = true;
              $scope.showErrorModal();
            }
          } else {
            $scope.fileALreadyUploaded = true;
            $scope.showErrorModal();
          }
        });
        setTimeout("document.getElementById('progress_bar').className='';", 2000);
      };
      reader.readAsText(fileArray[i]);
    }
  };


  /**
   * @ngdoc function
   * @name file_selected
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function regenerates index for an already
   * uploaded file that is selected by user,
   * calls function to prepare generated index for viewing
   */
  $scope.file_selected = (file) => {
    $scope.invertedIndex.createIndex($scope.allFiles[file]);
    $scope.index = $scope.invertedIndex.index;
    $scope.prepareIndexViewComponents(file);
  };

  /**
   * @ngdoc function
   * @name prepareIndexViewComponents
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function transforms the index generated
   * the human readable form
   */
  $scope.prepareIndexViewComponents = (file) => {
    $scope.terms = ["Terms"];
    $scope.index_display = [];
    let mostFrequencyKey = "";
    if (file !== undefined) {
      mostFrequencyKey = file;
      $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.allContents[file]}</code></p>`);
    } else {
      mostFrequencyKey = $scope.files.name;
      $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.allContents[$scope.files.name]}</code></p>`);
    }
    for (var i = 0; i < $scope.allMostFrequency[mostFrequencyKey]; i++) {
      $scope.terms.push(`doc${i + 1}`);
    }
    if ($scope.index !== undefined) {
      $scope.words = Object.keys($scope.index).sort();
    }
    let index_object_size = $scope.invertedIndex.getObjectSize($scope.index);
    for (let i = 0; i < index_object_size; i++) {
      let index_display_temp = [$scope.words[i]];
      let k = 0;
      for (let j = 0; j < $scope.allMostFrequency[mostFrequencyKey]; j++) {
        let doc_id = j + 1;
        if (doc_id == $scope.index[$scope.words[i]][k]) {
          index_display_temp.push("X");
          k = k + 1;
        } else {
          index_display_temp.push(" ");
        }
      }
      $scope.index_display[i] = index_display_temp;
    }
  };

  /**
   * @ngdoc function
   * @name search
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function searches a selected file or the recent selected file
   * for a set of word/terms,
   * calls function to transform the search result to human readable form
   */
  $scope.search = () => {
    $scope.selected_file = [];
    $scope.setSelectedValues();
    $scope.index_search_display = [];
    for (let i = 0; i < $scope.selected_file.length; i++) {
      let search_result = $scope.invertedIndex.search($scope.allFiles[$scope.selected_file[i]], $scope.search_strings);
      let search_words_array = $scope.invertedIndex.removePunctuation($scope.search_strings).split(" ");
      let search_in_view = $scope.prepareSearchIndexViewComponents(search_words_array, search_result, i);
      $scope.index_search_display[i] = search_in_view;
    }
    $scope.index = $scope.invertedIndex.index;
    };
  };

  /**
   * @ngdoc function
   * @name prepareSearchIndexViewComponents
   * @methodOf InvertedIndex.InvertedIndexController:InvertedIndexController
   * @description
   * This function searches prepares the search result into a human readble form
   */
  $scope.prepareSearchIndexViewComponents = (search_words_array, search_result,counter) => {

    $scope.search_terms = ["Terms"];
    $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.allContents[$scope.selected_file[counter]]}</code></p>`);
    for (var i = 0; i < $scope.allMostFrequency[$scope.selected_file[counter]]; i++) {
      $scope.search_terms.push(`doc${i + 1}`);
    }
    let index_search_display_temp = [$scope.search_terms];
    let index_search_display_item = [];
    let size = search_result.length;
    for (let i = 0; i < size; i++) {

      let found = false;

      index_search_display_item.push(search_words_array[i]);
      let k = 0;
      for (let j = 0; j < $scope.allMostFrequency[$scope.selected_file[counter]]; j++) {
        let doc_id = j + 1;
        if (doc_id == search_result[i][k]) {

          found = true;

          index_search_display_item.push("X");
          k = k + 1;
        } else {
          index_search_display_item.push(" ");
        }
      }

      index_search_display_temp.push(index_search_display_item);
      index_search_display_item = [];
      }
      return index_search_display_temp;
  };

      if (found) {
        index_search_display_temp.push(index_search_display_item);
      }
      index_search_display_item = [];
    }
    return index_search_display_temp;
  };

  $scope.setSelectedValues = () => {
    let x = document.getElementById("selected_file");
    for (let i = 0; i < x.options.length; i++) {
      if(x.options[i].selected ==true){
            $scope.selected_file.push(x.options[i].text);
        }
    }
  };

  $scope.showErrorModal = function () {
    if ($scope.notValidJSONFile) {
      $scope.error_message = "Invalid File Content ";
    }
    if ($scope.isEmptyFile) {
      $scope.error_message = "JSON File is empty ";
    }
    if ($scope.fileALreadyUploaded) {
      $scope.error_message = "File(s) has already been uploaded!";
    }
    $scope.title = "Fatal Error";
    ModalService.showModal({
      templateUrl: "error_modal.html",
      controller: "ErrorModalController",
      scope: $scope
    }).then(function (modal) {
      modal.element.modal();
      modal.close.then(function (result) {
        if ($scope.notValidJSONFile) {
          $scope.notValidJSONFile = false;
        }
        if ($scope.isEmptyFile) {
          $scope.isEmptyFile = false;
        }
        if ($scope.fileALreadyUploaded) {
          $scope.fileALreadyUploaded = false;
      }
      });
    });
  };

}]);
nameSpace.controller('ErrorModalController', ['$scope', '$element', 'close', ($scope, $element, close) => {
  $scope.dismissModal = function (result) {
    close(result, 200); // close, but give 200ms for bootstrap to animate
  };
}]).directive('removeModal', ['$document', function ($document) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        $document[0].body.classList.remove('modal-open');
        angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
        angular.element($document[0].getElementsByClassName('modal')).remove();
      });
    }
  };
}]);