const nameSpace = angular.module('InvertedIndex', ['ngSanitize', 'angularModalService']);

nameSpace.controller('InvertedIndexController', ['$scope', '$sce', 'ModalService', ($scope, $sce, ModalService) => {
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

  $scope.upload = () => {
    $scope.progress = document.querySelector('.percent');
    $scope.handleFileSelect();
  };

  $scope.abortRead = () => {
    reader.abort;
  };

  $scope.updateProgress = (evt) => {
    if (evt.lengthComputable) {
      const percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      if (percentLoaded < 100) {
        $scope.progress.style.width = `${percentLoaded}%`;
        $scope.progress.textContent = `${percentLoaded}%`;
      }
    }
  };

  $scope.handleFileSelect = () => {
    const fileArray = document.getElementById('files').files;
    for (let i = 0; i < fileArray.length; i++) {
      $scope.progress.style.width = '0%';
      $scope.progress.textContent = '0%';
      reader = new FileReader();
      reader.onabort = () => {
        $scope.readerAborted = true;
        $scope.abortRead();
        $scope.showErrorModal();
      };
      reader.onloadstart = () => {
        document.getElementById('progress_bar').className = 'loading';
      };
      reader.onload = (evt) => {
        const content = evt.target.result;
        $scope.$apply(() => {
          $scope.content = content;
          if ($scope.file_names.indexOf(fileArray[i].name) === -1) {
            if ($scope.content.length > 0) {
              try {
                $scope.file_object = JSON.parse(content);
                if ($scope.invertedIndex.isValidJsonArray($scope.file_object)) {
                  $scope.invertedIndex.createIndex($scope.file_object, fileArray[i].name);
                  $scope.files = fileArray[i];
                  $scope.file_names.push($scope.files.name);
                  $scope.allContents[$scope.files.name] = $scope.content;
                  $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.content}</code></p>`);
                  $scope.index = $scope.invertedIndex.getIndex();
                  $scope.allMostFrequency[$scope.files.name] = $scope.invertedIndex.mostFrequency;
                  $scope.progress.textContent = '100%';
                  $scope.prepareIndexViewComponents();
                } else {
                  $scope.tokenNotFound = false;
                  $scope.notValidJSONFile = true;
                  $scope.isEmptyFile = false;
                  $scope.readerAborted = false;
                  $scope.fileALreadyUploaded = false;
                  $scope.showErrorModal();
                }
              } catch (exception) {
                $scope.tokenNotFound = false;
                $scope.notValidJSONFile = true;
                $scope.isEmptyFile = false;
                $scope.readerAborted = false;
                $scope.fileALreadyUploaded = false;
                $scope.showErrorModal();
              }
            } else {
              $scope.tokenNotFound = false;
              $scope.notValidJSONFile = false;
              $scope.isEmptyFile = true;
              $scope.readerAborted = false;
              $scope.fileALreadyUploaded = false;
              $scope.showErrorModal();
            }
          } else {
             $scope.tokenNotFound = false;
              $scope.notValidJSONFile = false;
              $scope.isEmptyFile = false;
              $scope.readerAborted = false;
              $scope.fileALreadyUploaded = true;
            $scope.showErrorModal();
          }
        });
      };
      reader.readAsText(fileArray[i]);
    }
  };

  $scope.fileSelected = (file) => {
    $scope.index = $scope.invertedIndex.allIndex[file];
    $scope.prepareIndexViewComponents(file);
  };

  $scope.prepareIndexViewComponents = (file) => {
    $scope.terms = ['Terms'];
    $scope.index_display = [];
    let mostFrequencyKey = '';
    if (file !== undefined) {
      mostFrequencyKey = file;
      $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.allContents[file]}</code></p>`);
    } else {
      mostFrequencyKey = $scope.files.name;
      $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.allContents[$scope.files.name]}</code></p>`);
    }
    for (let i = 0; i < $scope.allMostFrequency[mostFrequencyKey]; i++) {
      $scope.terms.push(`doc${i + 1}`);
    }
    if ($scope.index !== undefined) {
      $scope.words = Object.keys($scope.index).sort();
    }
    const indexObjectSize = $scope.invertedIndex.getObjectSize($scope.index);
    for (let i = 0; i < indexObjectSize; i++) {
      const indexDisplayTemp = [$scope.words[i]];
      let k = 0;
      for (let j = 0; j < $scope.allMostFrequency[mostFrequencyKey]; j++) {
        const docId = j + 1;
        if (docId === $scope.index[$scope.words[i]][k]) {
          indexDisplayTemp.push('X');
          k += 1;
        } else {
          indexDisplayTemp.push(' ');
        }
      }
      $scope.index_display[i] = indexDisplayTemp;
    }
  };

  $scope.search = () => {
    $scope.selected_file = [];
    $scope.setSelectedValues();
    $scope.index_search_display = [];
    for (let i = 0; i < $scope.selected_file.length; i++) {
      const searchResult = $scope.invertedIndex.search($scope.selected_file[i],
        $scope.search_strings);
      const searchWordsArray = $scope.invertedIndex.removePunctuation($scope.search_strings).split(' ');
      const searchInView = $scope.prepareSearchIndexViewComponents(searchWordsArray,
        searchResult, i);
      $scope.index_search_display[i] = searchInView;
    }

    if ($scope.index_search_display[1] === undefined) {
      $scope.tokenNotFound = true;
      $scope.notValidJSONFile = false;
      $scope.isEmptyFile = false;
      $scope.readerAborted = false;
      $scope.showErrorModal();
    }
    $scope.index = $scope.invertedIndex.getIndex();


  };

  $scope.prepareSearchIndexViewComponents = (searchWordsArray, searchResult, counter) => {
    $scope.search_terms = ['Terms'];
    $scope.trusted_html_content = $sce.trustAsHtml(`<p><code>${$scope.allContents[$scope.selected_file[counter]]}</code></p>`);
    for (let i = 0; i < $scope.allMostFrequency[$scope.selected_file[counter]]; i++) {
      $scope.search_terms.push(`doc${i + 1}`);
    }
    const indexSearchDisplayTemp = [$scope.search_terms];
    let indexSearchDisplayItem = [];
    const size = searchResult.length;
    for (let i = 0; i < size; i++) {
      let found = false;
      indexSearchDisplayItem.push(searchWordsArray[i]);
      let k = 0;
      for (let j = 0; j < $scope.allMostFrequency[$scope.selected_file[counter]]; j++) {
        const docId = j + 1;
        if (docId === searchResult[i][k]) {
          found = true;
          indexSearchDisplayItem.push('X');
          k = +1;
        } else {
          indexSearchDisplayItem.push(' ');
        }
      }
      if (found) {
        indexSearchDisplayTemp.push(indexSearchDisplayItem);
      }
      indexSearchDisplayItem = [];
    }
    return indexSearchDisplayTemp;
  };

  $scope.setSelectedValues = () => {
    const filesSelected = document.getElementById('selected_file');
    for (let i = 0; i < filesSelected.options.length; i++) {
      if (filesSelected.options[i].selected === true) {
        $scope.selected_file.push(filesSelected.options[i].text);
      }
    }
  };

  $scope.showErrorModal = () => {
    if ($scope.notValidJSONFile) {
      $scope.error_message = 'Invalid File Content';
    } else if ($scope.isEmptyFile) {
      $scope.error_message = 'JSON File is empty';
    } else if ($scope.readerAborted) {
      $scope.error_message = 'File Reading was unsuccessful!';
    } else if ($scope.tokenNotFound) {
      $scope.error_message = 'The entire search token(s) not found!';
    } else {
      $scope.error_message = 'File(s) has already been uploaded!';
    }
    $scope.title = 'Fatal Error';
    ModalService.showModal({
      templateUrl: 'error_modal.html',
      controller: 'ErrorModalController',
      scope: $scope
    }).then((modal) => {
      modal.element.modal();
      modal.close.then(() => {
        if ($scope.notValidJSONFile) {
          $scope.notValidJSONFile = false;
        } else if ($scope.isEmptyFile) {
          $scope.isEmptyFile = false;
        } else {
          $scope.fileALreadyUploaded = false;
        }
      });
    });
  };
}]);

nameSpace.controller('ErrorModalController', ['$scope', '$element', 'close', ($scope, $element, close) => {
  $scope.dismissModal = (result) => {
    close(result, 200); // close, but give 200ms for bootstrap to animate
  };
}]).directive('removeModal', ['$document', ($document) => {
  return {
    restrict: 'A',
    link: (scope, element) => {
      element.bind('click', () => {
        $document[0].body.classList.remove('modal-open');
        angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
        angular.element($document[0].getElementsByClassName('modal')).remove();
      });
    }
  };
}]);