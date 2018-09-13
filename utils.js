const fs = require('fs');
const iconv = require('iconv-lite');

const split = (str) => {
    str = str.replace(/\r\n/g, '\n');
    return str.split('\n');
};

const cleanText = (str) => {
    if (!str) 
        return "";
    str = str.replace(/[\\]?\\s\\/g, ' ');
    return str.replace(/\\T[0-9]*[\\]?/g, ' ');
};

const readFileSync = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    return iconv.decode(fileBuffer, 'iso-8859-15');
};

const sliceArrayWhenFindChar = (array, validCharsArray, indexOf = 0) => {
    // break array when type matches and push all pieces of array into a big one
    const indexes = array.map((item, index) => {
        if (validCharsArray.indexOf(item.charAt(indexOf)) >= 0) {
            return index;
        }
        return;
    }).filter(item => !!item || item === '0' || item === 0);

    let lastIndex;
    let arraysResult = [];
    for (let i = 0; i < indexes.length; i++) {
        arraysResult.push(array.slice(indexes[i], indexes[i + 1]));
    }

    return arraysResult;
};

exports.split = split;
exports.cleanText = cleanText;
exports.readFileSync = readFileSync;
exports.sliceArrayWhenFindChar = sliceArrayWhenFindChar;
const SERVER_IMAGE_ADDRESS = (process.env.NODE_ENV === 'release')
    ? 'https://devmoltres.pulacapital.com.au/image/'
    : 'http://localhost:8000/image/';

exports.PRIMARY_MATHS_IMAGE_SERVER_END = SERVER_IMAGE_ADDRESS + 'primarymaths/';