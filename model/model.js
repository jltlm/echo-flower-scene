import { makeRectPrism, makeCylinder, addObj } from "./basic.js";

// models size constants
const AREADIM = 0.1;
const FRISKFACEDIM = 0.2;

// textures / colors!!!
// 1 for wood (texture)
// 2 for water (texture)
// 3 for land (color)

// takes translation coords around center of object
function makeFrisk(x,y,z) {
    makeCylinder(x, y, z, 0.08,0.1, 12,1);
    makeCylinder(x, y-0.05, z, 0.05, 0.08, 12);
    makeCylinder(x, y-0.14, z, 0.08, 0.1, 12);
    makeCylinder(x + 0.1, y-0.14, z, 0.04, 0.1, 12);
    makeCylinder(x - 0.1, y-0.14, z, 0.04, 0.1, 12);
    makeCylinder(x - 0.025,y-0.24,z, 0.04, 0.25, 12);
    makeCylinder(x + 0.025, y-0.24, z, 0.04, 0.25, 12);
    makeRectPrism(x + 0.02,y-0.27, z-0.05, 0.04, 0.04, 0.05);
    makeRectPrism(x-0.04,y-0.27, z-0.05, 0.04, 0.04, 0.05);
}

// translates bridge item to x, y, z. In a square of side length size
function makeBridge(x, y, z, size) {
    let a = size / 27;
    let b = size / 11;
    for (let i = 0; i < 9; i++) { // top boards, supports
        makeRectPrism(x, y+b*2, z + (size / 9 * i), size, a, b, 1);
        if (i % 2) {
            makeCylinder(x+b, y, z + (size / 9 * i), b/2, 2*b, 1);
            makeCylinder(x+size-b, y, z + (size / 9 * i), b/2, 2*b, 1);
        }
    }
    let c = size / 4 - b; // for even spacing of bottom boards
    for (let i = 0; i < 4; i++) { // bottom boards
        makeRectPrism(x + (size / 4 * i) + c / 4 * i, y+b*2-a, z, b, a, size, 1);
    }
}

function makeLand(x, y, z, size) {
    makeRectPrism(x, y, z, size, size/5, size, 3);
}

// makes the water part of the scene
function makeWater(x, y, z, waterDepth) {
    makeRectPrism(x, y, z, 2*AREADIM, waterDepth, 2*AREADIM, 2);
}

function frisk(x, y, z) {
    addObj(objModels.friskObj, x, y, z, 0.008)
}

// MAKES THE SCENE
// scene is a 4x4 place. a bridge is 1, a land is 1
// 
export function makeScene() {
    const bottom = -AREADIM;
    const waterDepth = AREADIM/4;
    const waterLevel = bottom + waterDepth;

    makeWater(-AREADIM, bottom, -AREADIM, waterDepth);

    makeBridge(-AREADIM/2, waterLevel, AREADIM/2, AREADIM/2);
    makeLand(-AREADIM, waterLevel, 0, AREADIM/2)
    makeLand(-AREADIM/2, waterLevel, 0, AREADIM/2)
    makeLand(-AREADIM/2, waterLevel,  -AREADIM/2, AREADIM/2)
    makeLand(0, waterLevel, 0, AREADIM/2)
    makeLand(0, waterLevel, -AREADIM/2, AREADIM/2)
    makeLand(AREADIM/2, waterLevel, -AREADIM/2, AREADIM/2)
    makeBridge(0, waterLevel, -AREADIM, AREADIM/2);

    // makeFrisk(0, 0, 0);
    // frisk(-AREADIM, waterLevel+AREADIM/10, -AREADIM);
    // makeFlower(0,0,0,.3, 5)
};

// // procedural generation
// // takes in a [x, y] of a place to start generating land
// // returns a nested array of land vs bridge vs empty (open water) spots
// // as L, B, and X
// function generateGroundMap(axiom) {
//     // bounds are a 4x4
//     let ax = axiom[0];
//     let ay = axiom[1];
//     let land = "L";
//     let bridge = "B";
//     let empty = "X";

//     let map = new Map();
//     let checked = new Set();

//     map.set(axiom, land);
//     checked.add(axiom);
//     while (map.length < 16) {

//     }
    

//     for (let x = 0; x < 4; x++) {
//         for (let y = 0; y < 4; y++) {

//         }
//     }

// }

// procedural generation
// (getting there)
/**

axiom: a
variables:
- a: line
- b: line ending in leaf
- c: line ending in flower
constants:
- [ push the position and angle state and turn left 45 degrees
- ] push the position and angle state and turn right 45 degrees
rules:
a -> aa
b -> a[b]
c -> [c
 */
function makeFlower(x, y, z, height, iterations) {
    let rule = new Map();
    rule.set('a', 'ab');
    rule.set('b', 'a');

    let genString = "a";

    for (let i = 1; i < iterations; i++) {
        let newString = "";
        for (let j = 0; j < genString.length; j++) {
            let insert = rule.get(genString.charAt(j).toString());
            // add the substitution into new string
            newString += insert;
        }
        // reassign genString to newString
        genString = newString;
    }

    let itemHeight = height / genString.length;


    function addStem(startY) {
        // stem is 1/10th width to height
        makeCylinder(x, startY, z, itemHeight/10, itemHeight);
    }
    function addLeaf(startY) {
        addStem(startY);
        makeRectPrism(x+itemHeight/10, startY, z, itemHeight, itemHeight/2, itemHeight);
    }
    function addFlower(startY) {
        
    }

    for (let i = 0; i < genString.length; i++) {
        let ch = genString.charAt(i);
        if (ch == 'a') {
            addStem(i * itemHeight);
        } else if (ch == 'b') {
            addLeaf(i * itemHeight);
        }
    }

}


// // sets up the bounds for the area. A cube of lines, would require point line list thing
// // UNUSED
// function makeArea() {
//     const b = AREADIM;
//     const cube = [
//         -b, -b, -b,
//         -b, b, -b,

//         -b, b, -b,
//         -b, b, b,

//         -b, b, b,
//         -b, -b, b,

//         b, -b, -b,
//         b, b, -b,

//         b, b, -b,
//         b, b, b,

//         b, b, b,
//         b, -b, b,

//         b, -b, b,
//         -b, -b, b,

//         b, b, b,
//         -b, b, b,

//         b, b, -b,
//         -b, b, -b,

//         b, -b, -b,
//         -b, -b, -b,
//     ];

// }

