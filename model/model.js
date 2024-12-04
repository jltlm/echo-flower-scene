// models size constants
const AREADIM = 0.2;
const FRISKFACEDIM = 0.2;


// takes translation coords around center of object
function makeFrisk(x,y,z) {
    makeCylinder(x, y, z, 0.08,0.1,12,1);
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
        makeRectPrism(x, y, z + (size / 9 * i), size, a, b);
        if (i % 2) {
            makeCylinder(x+b, y-b*2, z + (size / 9 * i), b/2, 2*b);
            makeCylinder(x+size-b, y-b*2, z + (size / 9 * i), b/2, 2*b);
        }
    }
    let c = size / 4 - b; // for even spacing of bottom boards
    for (let i = 0; i < 4; i++) { // bottom boards
        makeRectPrism(x + (size / 4 * i) + c / 4 * i, y-a, z, b, a, size);
    }
}

// makes the water part of the scene
function makeWater() {
    makeRectPrism(-AREADIM, -AREADIM, -AREADIM+0.2, 2*AREADIM, AREADIM/5, 2*AREADIM);
}


// MAKES THE SCENE
function makeScene() {
    makeWater();
    makeBridge(-AREADIM, -AREADIM+AREADIM/5+0.05, 0, AREADIM);
    makeFrisk(0, 0, 0);
};

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
