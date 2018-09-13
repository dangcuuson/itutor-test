const {PRIMARY_MATHS_IMAGE_SERVER_END} = require('../utils');

const parseDrawImageWork = (args) => {
    let content = args.split(',');
    let type = content[0];
    switch (type) {
        case 'B': //FillRectToCanvas it probably does not need for the new frontend
            //return {type: 'draw', draw: 'fillRectangle', TODO: true, args: 'check all the usages, I think it doesnt need to exist'};
            return {};

        case 'P': //DoPicture
            //TODO: consider maybe to create a sanetizer function for images, look at: procedure Internat in Common.pas
            if (content[1] === '!') {
                content = content.slice(1);
            }

            let fileName = content[1];
            switch (fileName) {
                case '~carry~':
                case '~CARRY~':
                case '~borrow~':
                case '~BORROW~':
                    fileName = 'TRADE';
                    break;

                case '~borrowed~':
                case '~BORROWED~':
                    fileName = 'TRADED';
                    break;

                case '~coin~':
                case '~COIN~':
                    fileName = 'CENT20';
                    break;
            }

            return {
                type: 'draw',
                draw: 'picture',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + fileName.toUpperCase(),
                x: content[2],
                y: content[3]
            };

        case 'V': //Vector
            /*procedure Vector(Canvas; x1,y1,x2,y2: integer; arrows: byte; lab: string)*/
            /* V, color: 1,width: 1,  x1: 40, y1: 70, x2:200, y2: 10,  arrows:  6, lab:   #A*/
            return {
                type: 'draw',
                draw: 'vector',
                x1: content[3],
                y1: content[4],
                x2: content[5],
                y2: content[6],
                label: content[8]
            };

        case 'A': //DrawAngle
            /*DrawAngle(Canvas,xParm,yParm,IParm,IParm,IParm,IParm,IParm,sParm,sParm) */
            /*procedure DrawAngle(Canvas; x1,y1,l,StAngle,EndAngle,arrows,mark: integer; lab1,lab2: string) */
            /* A, color: 2, width: 3, x: 200, y: 200,  length: 190, angle: #1, endAngle: #5, arrows: 0, mark: 50 */
            return {
                type: 'draw',
                draw: 'angle',
                length: content[5],
                angle: content[6],
                endAngle: content[7],
                mark: content[9]
            };

        case 'C': //DoCircle
            return {type: 'draw', draw: 'circle', x: content[3], y: content[4], radius: content[5]};

        case 'L': //DoShape
            //"L,13,1,180,90,180,270"
            let p = [];
            let variants = content.slice(3);
            for (let i = 0; i < variants.length; i += 2) {
                p.push({
                    x: variants[i],
                    y: variants[i + 1]
                });
            }

            return {type: 'draw', draw: 'shape', vectors: p};

        case 'l': //DoLabelShape
            //l, 1, 1,      [(100,20)],[(#3,20),6,#1#5] ,[#3,#4,6,],[100,#4,6,],[100,20,6,#2#5]
            const points = [];
            points.push({x: content[3], y: content[4]});

            const vectors = content.slice(5);
            const pointsLength = vectors.length / 4;
            for (let i = 0; i < pointsLength; i++) {
                const x = vectors[i * 4 + 0];
                const y = vectors[i * 4 + 1];
                const arrow = vectors[i * 4 + 2];
                const label = vectors[i * 4 + 3];

                if (!!x && !!y){
                    points.push({x: x, y: y, arrow: arrow, label: label});   
                }
            }

            return {type: 'draw', draw: 'labelShape', vectors: points};

        case 'c': //DoCopyRect
            //"c,file: bflyleft,180-103,120,180,120+159"
            return {
                type: 'draw',
                draw: 'rectangleImage',
                file: PRIMARY_MATHS_IMAGE_SERVER_END + content[1].toUpperCase(),
                left: content[2],
                top: content[3],
                right: content[4],
                bottom: content[5]
            };

        case 'R': //RectangleToCanvas
            //"R,9,3,100,150,300,350"
            return {
                type: 'draw',
                draw: 'rectangle',
                colorIndex: content[1],
                left: content[3],
                top: content[4],
                right: content[5],
                bottom: content[6]
            };

        case 'p': //DoFillPoly
            //"p, color: 10, width: 2, brushCOlor: 2, n: 4, 50,200,150,200,150,300,50,300"
            let v = [];
            let vectorsArgs = content.slice(5);
            for (let i = 0; i < vectorsArgs.length; i += 2) {
                v.push({
                    x: vectorsArgs[i],
                    y: vectorsArgs[i + 1]
                });
            }
            return {type: 'draw', draw: 'fillPolygon', color: content[3], vectors: v};

        case 'F': //DoFloodFill
            // d d10 F,12,110,110,10
            return {type: 'draw', draw: 'fillRectangle', width: content[2], height: content[3], colorIndex: content[4]};

        case 'a': //Doarc
            //"a,0,1,x: 95,y: 350,startAngle: 180,endAngle:390,radius: +32"
            return {
                type: 'draw',
                draw: 'arc',
                x: content[3],
                y: content[4],
                startAngle: content[5],
                endAngle: content[6],
                colourIndex: content[1]
            };

        case 'D': //Dot
            // "D,9,2,200,200"
            return {type: 'draw', draw: 'dot', x: content[3], y: content[4], colourIndex: content[1]};

        case '#233': //PolarLine
        case 'W': //DoWindow
            return {type: 'draw', TODO: true, args: args}
    }
};

module.exports = parseDrawImageWork;