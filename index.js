const path = require('path');
const fs = require('fs');
const parseDrillArgs = require('./parser/drillArgsParser');
const { split, readFileSync, sliceArrayWhenFindChar } = require('./utils');

const MAT_PATH = path.resolve('MAT');
const OUTPUT_FOLDER = path.resolve('output');

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdir(OUTPUT_FOLDER);
}

const parseInteractions = (interactions, parseFunction) => {
    return interactions.map((exercise) => {
        return exercise.map((line) => {
            var isSkipped = line.charAt(0) === '*';
            if (isSkipped || !line) {
                return;
            }

            const matArgs = line.substr(8);
            var endCode = (line.substr(4, 3)).replace(/\s/g, '');
            const jsonArgs = parseFunction(line.charAt(2), endCode, matArgs);
            var jumpLabel;
            if (!!line.charAt(0) && line.charAt(0) !== ' ')
                jumpLabel = line.charAt(0);

            if (!!jumpLabel && !!jsonArgs) {
                return Object.assign({}, jsonArgs, { jumpLabel: jumpLabel })
            } else {
                return jsonArgs;
            }
        }).filter((item) => {
            return !!item && (Object.keys(item).length > 0)
        });
    });
};

const parseDrillExercise = (lines) => {
    const firstJumpLineValidChars = (lines[0].split(',')).slice(1);
    const interactions = sliceArrayWhenFindChar(lines, firstJumpLineValidChars);

    // include the first jump line to the first instruction list
    interactions[0] = [].concat(lines[0], interactions[0]);

    return parseInteractions(interactions, parseDrillArgs);
};

const parseArgs = (matFile) => {
    const matFilePath = path.resolve(MAT_PATH, matFile + '.MAT');
    if (!fs.existsSync(matFilePath)) {
        fs.writeFileSync(matFilePath, '');
        throw `exerciseParser.parse >>> File does not exist: ${matFilePath}`;
    }

    const lines = split(readFileSync(matFilePath));

    return parseDrillExercise(lines);
};

// MAIN FUNCTION
const readExercise = (matFile) => {
    let exerciseOutputDir = path.resolve(OUTPUT_FOLDER, matFile);
    if (!fs.existsSync(exerciseOutputDir)) {
        fs.mkdirSync(exerciseOutputDir);
    }

    //writes the interactions json files
    const interactions = parseArgs(matFile);
    //when the parser is covering all scenarios, we should remove this
    (interactions).map((interaction, index) => {
        let paddedIndex = ("00" + index).slice(-2);
        let interactionFilePath = path.resolve(exerciseOutputDir, paddedIndex + '.json');
        fs.writeFileSync(interactionFilePath, JSON.stringify(interaction, null, '\t'), 'utf-8');
    });
}

// here is where we call the main function
readExercise('TSUBQ');
