const parseSelectVariants = (args) => {
    const content = args.split(',');
    let sequential = (content[0] === 'S');

    const variants = sequential
        ? content.slice(2)
        : content.slice(1);

    const map = variants.map((item) => {
        return (item.split('|')).map((option, index) => {
            return {
                variable: `#${index + 1}`,
                value: option
            };
        });
    });

    return {type: 'selectOptions', sequential: sequential, options: map};
};

const parseCompute = (args) => {
    var type = args[0];
    const parameters = (args.split(',')).slice(1);
    switch (type) {
        case 'R': //Random from n1 to n2 inclusive
        case 'r': //Random from n1 to n2-1 inclusive
            return {
                type: 'algorithm',
                variable: '#' + parameters[2],
                algorithm: 'random',
                min: parameters[0],
                max: (type === 'r' && (parameters[1]instanceof Number))
                    ? (parameters[1] - 1)
                    : parameters[1]
            };

        case 'L': //uses n1 to select an option and store in the n2
            return {
                type: 'algorithm',
                variable: '#' + parameters[1],
                algorithm: 'randomSelect',
                options: parameters.slice(2),
                randomVariable: parameters[0]
            };

        case 'S':
            const startIndex = parameters[0];
            const options = (parameters.slice(2)).map((item) => {
                return (item.split('|')).map((option, index) => {
                    const varIndex = parseInt(startIndex) + parseInt(index);
                    return {variable: `#${varIndex}`, value: option};
                });
            });

            return {type: 'algorithm', algorithm: 'skipRandomSelect', skipRandomVariable: parameters[1], options: options};

        case '=': //assign n1(can be a variable or a value) to n2
            /*
             * from: n1
             * variable: n2
            */
            return {
                type: 'algorithm',
                algorithm: "assign",
                from: parameters[1],
                variable: '#' + parameters[0]
            };

        case 'T': //format as 24 hour time
            return {
                type: 'algorithm',
                algorithm: 'formatTime',
                hour: parameters[0],
                minute: parameters[1],
                variable: '#' + parameters[2]
            };

        case 'ö':
            return {
                type: 'algorithm',
                algorithm: 'simplifyFraction',
                numerator: parameters[0],
                denominator: parameters[1],
                numeratorVariable: '#' + parameters[2],
                denominatorVariable: '#' + parameters[3]
            }
    }
};

const parseBranch = (args) => {
    var content = args.split(',');
    var type = content[0];
    switch (type) {
        case '?': //if ValidExpression then Jump
            return {
                type: 'conditionalJump',
                condition: 'validExpression',
                validExpression: content[1].replace('=', '=='),
                jumpTo: content[2]
            };

        case 'i': //if QInitDone then Jump
            return {type: 'conditionalJump', condition: 'false', jumpTo: content[2]};

        case '1': //if not AltAnswer then Jump (I believe there is no alternative answer)
        case '=': //Jump
            return {type: 'conditionalJump', condition: 'true', jumpTo: content[2]};

        case '~': //if not ValidExpression then Jump
            return {
                type: 'conditionalJump',
                condition: 'invalidExpression',
                invalidExpression: content[1].replace('=', '=='),
                jumpTo: content[2]
            };

        case '.': //if trunc then Jump
            return {type: 'conditionalJump', condition: 'notInteger', notInteger: content[1], jumpTo: content[2]}

        case '+': //if correct then Jump
            return {type: 'conditionalJump', condition: 'correct', jumpTo: content[2]};

        case '-': //if not correct then Jump
            return {type: 'conditionalJump', condition: 'incorrect', jumpTo: content[2]};

        default:
            return {type: 'conditionalJump', TODO: true, args: args};
    }
};

const parseJumpTable = (args) => {
    const variable = args.split(',')[0]
    const choices = (args.split(',')).slice(1);
    return {type: 'jumpTo', jumpChoices: choices, index: variable};
};

const parseRealArithmetic = (args) => {
    args = args.split(',');
    var type = args[0];
    const n1 = args[1];
    const n2 = args[2];
    const variable = '#' + args[3];

    let optionalArgs = {};
    if (args[4]) {
        optionalArgs.width = args[4];
    }
    if (args[5]) {
        optionalArgs.decimal = args[5];
    }
    if (args[6]) {
        optionalArgs.trimZeroes = args[6] == 1;
    }

    return Object.assign({
        type: 'calculation',
        var1: n1,
        var2: n2,
        calculation: type,
        variable: variable
    }, optionalArgs);
};

exports.parseCompute = parseCompute;
exports.parseBranch = parseBranch;
exports.parseJumpTable = parseJumpTable;
exports.parseRealArithmetic = parseRealArithmetic;
exports.parseSelectVariants = parseSelectVariants;