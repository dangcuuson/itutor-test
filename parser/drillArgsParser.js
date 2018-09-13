const { parseCompute, parseBranch, parseJumpTable, parseRealArithmetic, parseSelectVariants } = require('./commonParser');
const parseSpecialProc = require('./specialProcParser');
const parseDraw = require('./drawParser');

const argsParser = () => {
    //Parser Arguments State
    var tableCommands = [];
    var textColor;

    const parseText = (args) => {
        let content = (args.split(',')).slice(4);
        let text = content.join('\n');
        return { type: 'text', text: text }
    };

    const parseParagraphDefine = (args) => {
        let content = (args.split(',')).slice(5);
        let text = content.join('\n');

        return { type: 'text', text: text };
    };

    const parseFieldQuestion = (args) => {
        return {
            type: 'answer',
            answer: args.split(',')[0]
        };
    };

    const parseDoQuestion = (args) => {
        const content = args.split(',');
        return { type: 'problem', answer: content[0], question: content[3] };
    };

    const parseUserPhase = (args) => {
        return { type: 'end' }
    };

    const parseSetResponse = (args) => {
        args = args.replace(/\\m?|/g, '');

        let correctMessage = args.split('|')[0];
        let wrongMessage = args.split('|')[1];

        return { type: 'feedbackMessage', correct: correctMessage, wrong: wrongMessage };
    };

    const parseGridQuestion = (args, endCode) => {
        const content = (args.split(',')).slice(4);

        if (endCode == 'C') {
            const length = content.length / 3;
            var arr = [];
            for (let i = 1; i <= length; i++) {
                arr.push(content[i * 3 - 1]);
            }
            return { type: 'result', answer: arr };
        } else {
            return { type: 'result', TODO: true, answer: args }
        }
    };

    const parseSelectQuestion = (args) => {
        let content = args.split(',');
        let answer = content[4];
        let choices = content.slice(5);
        return { type: 'multipleChoice', choices: choices, answer: answer }
    };

    const parseSetSolution = (args) => {
        //Somethin may be wrong in DEMOQ1(Don't know which exercise related to this)
        let content = args.replace(';', '\n');
        return { type: 'solution', solution: content };
    };

    const parseInstructionArgs = (type, endCode, args) => {
        switch (type) {
            case '@': //Compute
                return parseCompute(args);
            case 'Y': //Branch
                return parseBranch(args);
            case 'J': //JumpTable
                return parseJumpTable(args);
            case '`': //RealArithmetic
                return parseRealArithmetic(args);
            case 'X': //SpecialProc
                return parseSpecialProc(args);

            case 't': //TextWork
            case 'T': //TextDefine
                return parseText(args);

            case 'F': //FieldQuestion
                return parseFieldQuestion(args);

            case 'R': //SetResponse
                return parseSetResponse(args);

            case 'g': //GridQuestion
                return parseGridQuestion(args, endCode);

            case 'V': //SelectVariants
                return parseSelectVariants(args);

            case 'Q': //DoQuestion
                return parseDoQuestion(args);

            case 'P': //ParagraphDefine
                return parseParagraphDefine(args);

            case '^': //SelectQuestion
                return parseSelectQuestion(args);

            case 'D': //DrawImageDefine
            case 'd': //DrawImageWork
                return parseDraw(args);

            case 'S': //SetSolution
                return parseSetSolution(args);

            case 'E': //UserPhase => Last step of the exercise
                return parseUserPhase(args);

            case ';': //Title
            case ':': //Animation => it is ignored since we are working with content only
            default:
                return {};
        }
    }

    return parseInstructionArgs;
}

module.exports = argsParser();