(function(){

InvertedIndex invertedIndex = new InvertedIndex();

// Makes use of Angular js
//inject directives and services.
const nameSpace = angular.module('InvertedIndex', ['ngFileUpload']);


nameSpace.controller('invertedIndexController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
 $scope.getIndex = function(){
 	invertedIndex.getIndex();
 }


}]);

})();



