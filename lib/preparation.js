// functions
//------------------------------------------------------------------------------------------------------------------------------------

/**
* Prepares the data for better compression by gzip
* @method prepareFile
* @param {String} data - the data need to be prepared for better compression by gzip
* @return {String} - the prepared data for better compression by gzip.
*/
exports.prepareFile = function(data) {
	return _toLowerCase(replaceQuotes(data));
}

/**
* Replaces single quotes with double quotes where it is possible (in order not to distrup the css-code correctness)
* @method replaceQuotes
* @param {String} data - the data with both single and double quotes
* @return {String} - the data without single quotes (they were replaced by double quotes where it was possible)
*/
function replaceQuotes(data) {
	singleQuotes = getSingleQuotesPositionsBetween("\"", "\"", data);

	data = data.replace(/'/g,"\"").split("");

	for (i = 0; i < singleQuotes.length; i++) {
		data[singleQuotes[i]] = "'";
	}

	data = data.join("");

	return data;
}

/**
* Converts symbols in the data to lower case. It takes the block of code between '{' and '}' and converts it to lower case (where it is
* possible, of course, in order not to distrup the css-code correctness)
* @method _toLowerCase
* @param {String} data - this we are going to convert
* @return {String} data - the data converted to lower case where it was possible 
*/
function _toLowerCase(data) {
	data = toLowerCaseExpressions(toLowerCaseCharset(data), "@import ", "url(", "expression(", "src=", "format(", "contant:");

	bracesInQuotes = getBracesPositionsBetween("\"", "\"", data);
	bracesInComments = getBracesPositionsBetween("/*", "*/", data);
	bracesInBrackets = getBracesPositionsBetween("(", ")", data);

	braces = bracesInQuotes.concat(bracesInComments, bracesInBrackets);
	
	pos = 0;

	while (data.indexOf("{", pos) != -1) { // while there are symbols of '{' in data
		if (inArray(braces, data.indexOf("{", pos))) {
			pos = data.indexOf("{", pos) + 1;
			continue;
		}

		str1 = data.substring(0, data.indexOf("{", pos) + 1); // the sequence of characters before '{'

		_pos = data.indexOf("{", pos) + 1;
		while (inArray(braces, data.indexOf("}", _pos))) { 
			_pos = data.indexOf("}", _pos) + 1;
			continue; 
		}

		str2 = data.substring(data.indexOf("{", pos) + 1, data.indexOf("}", _pos)); // the sequence of characters between '{' '}'
		
		str3 = data.substring(data.indexOf("}", _pos), data.length); // the sequence of characters after '}'

		pos = data.indexOf("}", _pos); // we will start to find another '{' from this position

		flag = 0;
		_pos = 0;
		str = str2;
		str2 = ""

		/* Here we convert everything that is possible between '{' and '}' to lower case and ignore some 
		expressions (because if we convert them to lower case this will distrup the correctness of css-code)
		*/
		while (str.indexOf("url(", _pos) != -1 || str.indexOf("/*", _pos) != -1 || 
				str.indexOf("expression(", _pos) != -1 || str.indexOf("src=", _pos) != -1 ||
					str.indexOf("format(", _pos) != -1 || str.indexOf("contant:\"", _pos) != -1) {

			flag = 1;

			index = _min(str.indexOf("url(", _pos), str.indexOf("/*", _pos), 
						str.indexOf("expression(", _pos), str.indexOf("src=", _pos),
							str.indexOf("format(", _pos), str.indexOf("contant:\"", _pos));

			switch (index) {
				case 0:
					if (str[str.indexOf("url(", _pos) + 4] == "\"") res = ignore(str, "url(\"", _pos, "\")");
					else res = ignore(str, "url(", _pos, ")");
					break;
				case 1:
					res = ignore(str, "/*", _pos, "*/");
					break;
				case 2:
					res = ignore(str, "expression(", _pos, ";");
					break;
				case 3:
					res = ignore(str, "src=\"", _pos, "\"");
					break;
				case 4:
					if (str[str.indexOf("format(", _pos) + 7] == "\"") res = ignore(str, "format(\"", _pos, "\")");
					else res = ignore(str, "format(", _pos, ")");
					break;
				case 5:
					res = ignore(str, "contant:\"", _pos, "\"");
					break;
			}

			str2 += res[0].toLowerCase() + res[1];
			_pos = res[3];
		}

		if (!flag) {
			str2 = str.toLowerCase();
		}
		else {
			str2 += res[2].toLowerCase();
		}

		data = str1 + str2 + str3;
	}

	return data;
}

/** 
* Converts the encoding name in lower case
* @method toLowerCaseCharset
* @param {String} data - this we are going to convert
* @return {String} data - returns the data where the encoding name are writen in lower case
*/
function toLowerCaseCharset(data) {
	if (data.indexOf("@charset ", 0) != -1) {
		str1 = data.substring(0, data.indexOf("@charset \"", 0) + 10);
		str2 = data.substring(data.indexOf("@charset \"", 0) + 10, data.indexOf("\"", data.indexOf("@charset \"", 0) + 10));
		str3 = data.substring(data.indexOf("\"", data.indexOf("@charset ", 0) + 10), data.length);

		str2 = str2.toLowerCase();
		data = str1 + str2 + str3; 
	}

	return data;
}

/**
* Converts given as parameters strings to lower case
* @method toLowerCaseExpressions
* @param {String} data - this we are going to convert
* @param 
* ...		- the list of strings that we want to convert to lower case in the data
* @param
* return {String} data - the data where given as parameters strings are writen in lower case
*/
function toLowerCaseExpressions(data) {
	_data = data.toLowerCase();

	for (i = 1; i < arguments.length; i++) {
		expression = arguments[i];
		pos = 0;
		while (_data.indexOf(expression, pos) != -1) {
			str1 = data.substring(0, _data.indexOf(expression, pos));
			str2 = data.substring(_data.indexOf(expression, pos) + expression.length, data.length);

			data = str1 + expression + str2;
			pos = _data.indexOf(expression, pos) + expression.length;
		}
	}	

	return data;
}

/**
* Ignore the expression in block between '{' and '}', because the converting of its symboles to lower case will distrupt the
* correctness of css-code.
* @method ignore
* @param {String} str - the data between '{' and '}'
* @param {String} expression - the expression that need to be ignored
* @param {Int} _pos - the position in block between '{' and '}' from which we start the search of expression
* @param {String} end - the sequence of characters on which the ignoring expression ends
* @return {Array} res - res[0] - the sequence of characters before the ignoring expression
* 						res[1] - the ignoring expression
* 						res[2] - the sequence of characters after the ignoring expression
* 						res[3] - the position from which we are going to search the next expression that need to be ignored
*/
function ignore(str, expression, _pos, end) {
	res = [];

	_str1 = str.substring(_pos, str.indexOf(expression, _pos) + expression.length);

	if (str.indexOf(end, str.indexOf(expression, _pos) + expression.length) != -1) {
		_str2 = str.substring(str.indexOf(expression, _pos) + expression.length, 
			str.indexOf(end, str.indexOf(expression, _pos) + expression.length));
		_str3 = str.substring(str.indexOf(end, str.indexOf(expression, _pos) + expression.length), str.length);
		_pos = str.indexOf(end, str.indexOf(expression, _pos) + expression.length);
	}
	else {
		_str2 = str.substring(str.indexOf(expression, _pos) + expression.length, str.length);
		_str3 = "";
		_pos = str.length;	
	}

	res.push(_str1);
	res.push(_str2);
	res.push(_str3);
	res.push(_pos);

	return res;
}

/**
* Find the the smallest positive parameter
* @method _min
* @param - the variable number of parameters
* @return - the smallest positive parameter
*/
function _min() {
	min = 999999999;
	for (i = 0; i < arguments.length; i++) {
		if (arguments[i] != -1) {
			if (arguments[i] < min) {
				index = i;
				min = arguments[i];
			}
		}
	}

	return index;
}

/**
* Writes the positions of '{' and '}' that are placed between 
* the sequence of characters '@param {String} start' and '@param {String} end' to an array
* @method getBracesPositionsBetween
* @param {String} start 
* @param {String} end
* @param {String} data - we search '{' and '}' in it
* @return {Array} res - the positions of '{' and '}'
*/

function getBracesPositionsBetween(start, end, data) {
	res = [];
	pos = 0;

	if (start != "/*") {
		while (data.indexOf(start, pos) != -1) {
			for (i = data.indexOf(start, pos) + 1; data[i] != end; i++) {
				if (data[i] == "{" || data[i] == "}") {
					res.push(i);
				}
			}
			pos = i + 1;
		}
	}
	else {
		while (data.indexOf(start, pos) != -1) {
			for (i = data.indexOf(start, pos) + 2; (data[i] + data[i + 1]) != end; i++) {
				if (data[i] == "{" || data[i] == "}") {
					res.push(i);
				}
			}
			pos = i + 2;
		}
	}	

	return res;
}

/**
* Writes the positions of single quotes that are placed between 
* the sequence of characters '@param {String} start' and '@param {String} end' to an array
* @method getSingleQuotesPositionsBetween
* @param {String} start 
* @param {String} end
* @param {String} data - we search singleQuotes in it
* @return {Array} res - the positions of single quotes
*/
function getSingleQuotesPositionsBetween(start, end, data) {
	res = [];
	pos = 0;

	while (data.indexOf(start, pos) != -1) {
		for (i = data.indexOf(start, pos) + 1; data[i] != end; i++) {
			if (data[i] == "'") {
				res.push(i);
			}
		}
		pos = i + 1;
	}

	return res;
}

/**
* Checks wheather the value are in the array
* @method inArray
* @param {Array} array
* @param {Int} value
*/
function inArray(array, value) {
	for (i = 0; i < array.length; i++) {
		if (array[i] == value) return true;
	}

	return false;
}

//------------------------------------------------------------------------------------------------------------------------------------