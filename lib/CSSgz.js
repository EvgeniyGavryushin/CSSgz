/**
* Prepares the CSS-code for better compression by gzip
* @author Evgeniy Gavryushin        
* @version 1.0.0 Nov 15, 2013
*/

// functions
//-------------------------------------------------------------------------------------------------------------------------------------

// shows the help information
function help() {
    console.log("Usage:");    
    console.log("    CSSgz");
    console.log("        shows usage information")
    console.log("    CSSgz <filename>");
    console.log("        prepares the CSS in <filename> for better compression by gzip and outputs the result to stdout");
    console.log("    CSSgz <in_filename> <out_filename>\n    CSSgz -i <in_filename> -o <out_filename>\n    CSSgz --input <in_filename> --output <out_filename>");
    console.log("        prepares the CSS in <in_filename> for better compression by gzip and outputs the result to <out_filename>");
    console.log("    CSSgz -h\n    CSSgz --help");
    console.log("        shows usage information");
    console.log("    CSSgz -v\n    CSSgz --version");
    console.log("        shows the version number");
}

// shows the verson number
function version() {
    console.log("CSSgz 1.0.0");
}

/**
* Reads the content of the file
* @method readFile
* @param {String} filePath - the path to the file that we want to prepare for better compression by gzip
* @return {String} data - read data from the file
*/
function readFile(filePath) {
    var fs  = require("fs");
    return data = fs.readFileSync(filePath).toString();
}

/**
* Outputs the prepared data for better compression by gzip to stdout
* @method writeToStdout
* @params {String} data - the prepared data for better compression by gzip
*/
function writeToStdout(data) {
    console.log(data);
}

/**
* Outputs the prepared data for better compression by gzip to the file
* @method writeToFile
* @param {String} data - the prepared data for better compressiong by gzip
* @param {String} filePath - the path to the file which will consist the prepared data for better compression by gzip 
*/
function writeToFile(data, filePath) {
    var fs = require('fs');
    fs.writeFileSync(filePath, data);
}

//-------------------------------------------------------------------------------------------------------------------------------------


// Here we start
//-------------------------------------------------------------------------------------------------------------------------------------

var css = require('./preparation');

var parameters = process.argv.slice(2); // get all parameters

switch (parameters.length) {
    case 0: // no parameters (for example, bin/cssp)
        help();
        break;
    case 1: // one parameter (for example, bin/cssp <filename>)
        switch (parameters[0]) {
            case "-h":
                help();
                break;
            case "--help":
                help();
                break;
            case "-v":
                version();
                break;
            case "--version":
                version();
                break;
            default:
                writeToStdout(css.prepareFile(readFile(parameters[0])));
                break;
        }
        break;
    case 2: // two parameters (for example, bin/cssp <in_filename> <out_filename>)
        writeToFile(css.prepareFile(readFile(parameters[0])), parameters[1]);
        break;
    case 4: // four parameters (for example, bin/cssp -i <in_filename> -o <out_filename>)
        if ((parameters[0] == "-i" && parameters[2] == "-o") || (parameters[0] == "--input" && parameters[2] == "--output")) {
            writeToFile(css.prepareFile(readFile(parameters[1])), parameters[3]);
        }
        else {
            help();
        }
        break;
    default:
        help();
        break;
}

//-------------------------------------------------------------------------------------------------------------------------------------