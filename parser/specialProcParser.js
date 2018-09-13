const {PRIMARY_MATHS_IMAGE_SERVER_END} = require('../utils');

var rowPicture = '';

const parseSpecialProc = (args) => {
    const content = args.split(',');
    const procedureType = content[0];

    switch (procedureType) {
        case '180': //AddUpCoins;
            return {type: 'special', special: 'addUpCoins', minCoin: content[1], maxCoin: content[2]};

        case '192': //RegularPolygon
            /*192, color: 13, penWidth: 2, n: #2, x1: 150, y1: 200, r: #3*/
            const edges = content[3];
            const length = content[6];
            return {type: 'special', special: 'regularPolygon', edges: edges, length: length};

        case '191': //SymmetryPolygon;
            //191, #2, 150, 200, #3, 4, 4
            return {
                type: 'special',
                special: 'symmetryPolygon',
                edges: content[1],
                radius: content[4],
                randomMaxTo: content[5],
                variable: '#' + content[6]
            };

        case '193': //GenTriangle
            /*193, color: 9, width: 1, mode: #1, x1: 150, y1: 200*/
            return {type: 'special', special: 'triangle', mode: content[3]};

        case '194': //GenQuad(QWork.Canvas,ParmColour,IParm,IParm,xParm,yParm);
            /*194, color: 9, width: 1, mode: 5, x: 150, y: 200*/
            return {type: 'special', special: 'quadrilateral', mode: content[3]};

        case '146': //ClockDefine(QDefine);
            return; //we don't need it
        case '147': //ClockSet(QDefine);
            return {
                type: 'special',
                special: 'clock',
                hour: content[1],
                minute: content[2],
                clockType: (content[3] === 0)
                    ? 'analogic'
                    : 'digital'
            };

        case '51': //SetRowPicture
            //return {type: 'special', special: 'rowPicture', file: content[1]};
            rowPicture = content[1];
            break;

        case '52': //DrawRowPicture
            //"52, rowStart: 1, count: 10, xGap: 18, yGap: 20, colorIndex: 14, 0,2"
            return {
                type: 'special',
                special: 'rowPicture',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + rowPicture.toUpperCase(),
                imageIndex: content[5]
            };

        case '149': //TimeZoneEffects(QDefine)
            return {type: 'special', special: 'timezone', mode: content[1], centreOn: content[2]};

        case '189': //RotatedText(QDefine.Canvas);
            return {type: 'special', special: 'rotatedText', text: content[6]};

        case '04': //RabbitRows
            const amountPerRow = 10; //constant from delphi
            return {
                type: 'special',
                special: 'displayRabbits',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + 'RABBITA',
                amount: content[1] * amountPerRow
            };

        case '01': //DisplayRabbits
            return {
                type: 'special',
                special: 'displayRabbits',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + 'RABBITA',
                amount: content[1]
            };

        case '03': //SubtractRabbits
        case '3':
            return {type: 'special', special: 'removeRabbits', amount: content[1]};

        case '05': //Move3RabbitsUp
            return {type: 'special', special: 'moveRabbitsUp', amount: 3};

        case '02': //RabbitEquation
            return {
                type: 'special',
                special: 'rabbitEquation',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + 'RABBITA',
                equation: {
                    op1: content[1],
                    sign: content[2],
                    op2: content[3],
                    result: content[4]
                }
            };

        case '10': //FruitCode
            const images = [
                PRIMARY_MATHS_IMAGE_SERVER_END + 'PRESENT',
                PRIMARY_MATHS_IMAGE_SERVER_END + 'APPLE',
                PRIMARY_MATHS_IMAGE_SERVER_END + 'ORANGE',
                PRIMARY_MATHS_IMAGE_SERVER_END + 'BANANA',
                PRIMARY_MATHS_IMAGE_SERVER_END + 'LEMON',
                PRIMARY_MATHS_IMAGE_SERVER_END + 'GRAPES',
                PRIMARY_MATHS_IMAGE_SERVER_END + 'PEAR'
            ];
            let index = 0;
            //"10,1,240,?,130"

            let n1 = content[2];
            let n2 = content[4];
            return {
                type: 'special',
                special: 'fruitCode',
                variable: '#' + content[1],
                n1: n1,
                operator: content[3],
                n2: n2,
                files: images
            };

        case '11': //RandomLions
            return {
                type: 'special',
                special: 'randomDrawLions',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + 'smlion',
                amount: content[1]
            };

        case '12': //NumberLine
            if (content[3] === '1') {
                return {
                    type: 'special',
                    special: 'drawLines',
                    drawLines: 'highlight',
                    hightlightLines: content.slice(5)
                };
            } else {
                return {type: 'special', special: 'drawLines', drawLines: 'draw', lineAmount: 25};
            }

        case '14': //AddingEffect
            let variants = content.slice(2);
            let count = parseInt(variants[2]); //StartWith
            for (let i = 0; i < variants.length; i += 4) {
                /*Row: variants[0], Count: variants[1], StartWith: variants[2], Indent: variants[3]*/
                count += parseInt(variants[i + 1]);
            }

            return {type: 'special', special: 'countStamps', amount: count};

        case '6':
        case '06': //DoDefineSum
            //"6,150,80,25+13" 25+13
            const op1 = content[3].split('+')[0];
            const op2 = content[3].split('+')[1];
            return {type: 'special', special: 'verticalSum', op1: op1, op2: op2};

        case '9':
        case '09': //HighlightSum
            return {type: 'special', special: 'highlightVerticalSum', col: content[1], row: content[2]};

        case '7':
        case '07': //ShowSum
            return {type: 'special', special: 'showResultVerticalSum', col: content[1], row: content[2], result: content[3]};

        case '08': //ShowCarry
            //"08,2,0,1"
            switch (content[2]) {
                case '0':
                    return {
                        type: 'special',
                        special: 'showCarryVerticalSum',
                        col: content[1],
                        mode: 'over',
                        carry: content[3],
                        strikeThrough: (content[4] === '1' || content[4] === 1)
                    };
                case '1':
                    return {type: 'special', special: 'showCarryVerticalSum', col: content[1], mode: 'left', carry: content[3]};
                case '2':
                    return {type: 'special', special: 'showCarryVerticalSum', col: content[1], mode: 'below', carry: content[3]};
            }

            return {type: 'special', special: 'showCarryVerticalSum', col: content[1], mode: mode, result: content[3]};

        case '#1':
        case '#2':
        case '#3':
        case '#3':
        case '#4':
        case '#5':
        case '#6':
        case '#7':
        case '#8':
        case '#9':
            return {type: 'special', special: 'toBeParsed', args: args};

        case '23': //ColourPicture
        case '30': //Calculator.dInitCalc
        case '31': //Calculator dClickCalc
        case '32': //Calculator.dEraseCalc
        case '33': //Calculator.keySequence
        case '46': //ClockDefine
        case '47': //ClockSet
        case '48': //ClockRun
        case '49': //TimeZoneEffects
        case '65': //DivideUp
        case '66': //EatAnt
        case '68': //DispTables
        case '68': //PizzaStuff
        case '69': //Blocks
        case '70': //PizzaStuff
        case '71': //Blocks
        case '72': //DeciBars
        case '73': //DeciBlock
        case '75': //DoFractapillar
        case '76': //LCMTable
        case '80': //CrayonLength
        case '81': //DrawRuler
        case '83': //DrawPrism(xParm,yParm,IParm,IParm,IParm,IParm,IParm,IParm)
        case '86': //GeomEffects
        case '89': //RotatedText(Static.Canvas)
        case '91': //DrawProtractor(xParm,yParm,(IParm > 0)); resetScaling;end;
        case '92': //RegularPolygon(Static.Canvas,ParmColour,IParm,IParm,xParm,yParm,xParm);  resetScaling;end;
        case '93': //GenTriangle(Static.Canvas,ParmColour,IParm,IParm,xParm,yParm); resetScaling;end;
        case '94': //GenQuad(Static.Canvas,ParmColour,IParm,IParm,xParm,yParm)
        case '97': //AreaBox; resetScaling;end;
        case '98': //CubicBox
        case '200': //PushButton;
        case '201': //ShowClickButton(EShow,xParm,yParm);
        case '202': //PointTo;
        case '206': //DoExampleSum;
        case '207': //ShowSum(EShow);
        case '208': //ShowCarry(EShow);
        case '209': //HighlightSum(EShow);
        case '230': //Calculator.dInitCalc(EShow,xParm,yParm,sParm);
        case '231': //Calculator.dClickCalc(EShow,xParm,yParm,sParm[1]);
        case '232': //Calculator.dEraseCalc(EShow,xParm,yParm,ParmColour);
        case '246': //ClockDefine(EShow);
        case '247': //ClockSet(EShow);
        case '249': //TimeZoneEffects(EShow)
        case '251': //SetRowPicture;  {not really necessary}
        case '289': //RotatedText(EShow.Canvas);

            // not sure, it seems that delphi does not do anything with it
        case '19':
        case '88':
            return {};

        default:
            return {type: 'special', TODO: true, args: args};
    };
};

module.exports = parseSpecialProc;