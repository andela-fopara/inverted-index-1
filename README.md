
### Inverted-Index

[![Coverage Status](https://coveralls.io/repos/github/andela-f-opara/inverted-index-1/badge.svg?branch=development)](https://coveralls.io/github/andela-f-opara/inverted-index-1?branch=development)
[![Build Status](https://travis-ci.org/andela-f-opara/inverted-index-1.svg?branch=development)](https://travis-ci.org/andela-f-opara/inverted-index-1)

This is an application that generates Index for uploaded files. The files can be uploaded in groups or singly. The files are expected to contain an array of JSON objects, else an error is thrown. The JSON objects are expected to be documents with keys 'title' and 'text'. After the generation of the index, user can search for a group of words from any of the uploaded files.

**Usage**

- Clone the repository git clone https://github.com/andela-f-opara/inverted-index-1.git
- Run npm install to install all dependencies.
- To run test, run npm test
- To use inverted index, run gulp and go to localhost://8004
- Upload your file(s), here is a sample file that contains data of the format:
  *Sample File Content*
              [
                {
                  "title": "Alice in Wonderland",
                  "text": "Alice falls into a rabbit hole and enters a world full of imagination."
                },

                {
                  "title": "The Lord of the Rings: The Fellowship of the Ring.",
                  "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
                }
              ]

- The last file in the group of files have its content shown and its index displayed to view other's use the buttons shown.
- To search the created index of a file, select file and enter the word(s) you want to search in the search box.
- Click on search to see your result, the result table does not display 'X' for words not found in the index for the selected file.

**Technologies and Services**

The application is a node based application which uses AngularJS, JQuery, Bootstrap CSS for the front end design. The codes are written following the ECMAScript 6 coding style. 
Other Technologies were employed to ensure the quality of the code include:
- Gulp
- HoundCI
- TravisCI
- Coveralls
- Eslint

**Contributions**
Make the uploaded files to save on the directory of server and then create a pull request.



