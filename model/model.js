import { makeRectPrism, makeCylinder, addObj, makeGrass } from "./basic.js";

// models size constants
const AREADIM = 0.2;

// ===========================================
// textures / colors!!!
let textures = {
    waterTex: 1,
    friskTex: 2,
    woodTex: 3,
    landTex: 4,
    flowerTex: 5,
    grassTex: 6,
}
// ===========================================

// makes the water part of the scene
function makeWaterBase(x, y, z, waterDepth) {
    makeRectPrism(x, y, z, 2*AREADIM, waterDepth, 2*AREADIM, textures.waterTex);
}

// translates bridge item to x, y, z. In a square of side length size
function makeBridge(x, y, z, size) {
    let a = size / 27;
    let b = size / 11;
    for (let i = 0; i < 9; i++) { // top boards, supports
        makeRectPrism(x, y+b*2, z + (size / 9 * i), size, a, b, textures.woodTex);
        if (i % 2) {
            makeCylinder(x+b, y, z + (size / 9 * i), b/2, 2*b, textures.woodTex);
            makeCylinder(x+size-b, y, z + (size / 9 * i), b/2, 2*b, textures.woodTex);
        }
    }
    let c = size / 4 - b; // for even spacing of bottom boards
    for (let i = 0; i < 4; i++) { // bottom boards
        makeRectPrism(x + (size / 4 * i) + c / 4 * i, y+b*2-a, z, b, a, size, textures.woodTex);
    }
}

function makeLand(x, y, z, size) {
    makeRectPrism(x, y, z, size, size/5, size, textures.landTex);

    y = y+size/5;

    // add a chance of a flower model to each land piece
    if ((Math.floor(x*51) + Math.floor(z*22)) % 7 == 0) {
        // flower model
        

    }
    if ((Math.floor(x*51) + Math.floor(z*22)) % 7 == 4) {
        makeGrass(x, y-size/10, z, size/5, textures.grassTex);
        makeGrass(x+size/3, y-size/10, z+2*size/3, size/5, textures.grassTex);
    } else {
        makeGrass(x+4*size/5, y-size/10, z+size/4, size/5, textures.grassTex);
        makeGrass(x+2*size/3, y-size/10, z+size/2, size/5, textures.grassTex);
    }

}

function frisk(x, y, z) {
    addObj(objModels.friskObj, x, y, z, textures.friskTex, 0.04 * AREADIM)
}

function makeWater(x, y, z, size) {
    // attempting something 'close to random' here in the if statement
    // 'close enough'
    if (Math.floor((x + z)*24) % 5 == 0) {
        lilypad(x+size/2, y, z+size/4);
    } else if (Math.floor((x + z)*24) % 3 == 1) {
        lilypad(x+size/3, y, z+size/4);
        reeds(x+2*size/3, y, z+3*size/4);
    }
}

function lilypad(x, y, z) {
    addObj(objModels.lilypadObj, x, y, z, textures.landTex, 0.04 * AREADIM)
}

function reeds(x, y, z) {
    addObj(objModels.reedsObj, x, y, z, textures.woodTex, 0.05 * AREADIM)
}

// MAKES THE SCENE
// scene is a 4x4 place. a bridge is 1, a land is 1
// 
export function makeScene() {
    const bottom = -AREADIM/2;
    const waterDepth = AREADIM/4;
    const waterLevel = bottom + waterDepth;
    const landNum = 12;
    const landSize = 2 * AREADIM / landNum;
    const landLevel = waterLevel+landSize/5;

    makeWaterBase(-AREADIM, bottom, -AREADIM, waterDepth);
    makeMap(-AREADIM, -AREADIM, landNum, landNum, waterLevel);
    // hardcoded bridge making :')
    // this could've been generated, but I ran out of time
    // conforms to the generated landmap. please don't change land map ;')
    makeBridge(-AREADIM + landSize * 10, waterLevel,
        -AREADIM + landSize * 2, landSize);
    makeBridge(-AREADIM + landSize * 9, waterLevel,
        -AREADIM + landSize * 2, landSize);
    makeBridge(-AREADIM + landSize * 4, waterLevel,
        -AREADIM + landSize * 6, landSize);
    makeBridge(-AREADIM + landSize * 2, waterLevel,
        -AREADIM + landSize * 10, landSize);
    makeBridge(-AREADIM + landSize * 2, waterLevel,
        -AREADIM + landSize * 9, landSize);
    makeBridge(-AREADIM + landSize * 9, waterLevel,
        -AREADIM + landSize * 7, landSize);
    makeBridge(-AREADIM + landSize * 8, waterLevel,
        -AREADIM + landSize * 7, landSize);
    makeBridge(-AREADIM + landSize * 7, waterLevel,
        -AREADIM + landSize * 4, landSize);
    


    // NOTE!!!! THERE IS SOMETHING WRONG WITH THIS FRISK MODEL!!!
    // something is wrong with its topology, i think.
    // it's screwing up the subsequent points. Just try moving the below
    // frisk line to the top.
    // anyway. KEEP FRISK TO BE RENDERED LAST!!!!
    // (don't edit below this line except to change frisk's position!!!)
    frisk(0, landLevel, -0.05);
};

function makeMap(xpos, zpos, xbound, ybound, waterLevel) {
    let inmap = generateGroundMap(xbound, ybound);

    // fill new map to have 'L'(land) or 'W' (water) or 'B' (bridge)
    let map = new Array(xbound).fill(0).map(() => new Array(ybound).fill(0));
    for (let x=0; x < xbound; x++) {
        for (let y=0; y < ybound; y++) {
            map[x][y] = inmap[x][y] < 0 ? 'L' : 'W';

            // let's fill the map!!
            if (map[x][y] == 'L') {
                makeLand(xpos + x * (AREADIM*2/xbound), waterLevel,
                zpos + y * (2*AREADIM/ybound), 2*AREADIM/xbound);
            } else {
                makeWater(xpos + x * (AREADIM*2/xbound), waterLevel,
                zpos + y * (2*AREADIM/ybound), 2*AREADIM/xbound);
            }
        }
    }
    return map;
}

// uses procedural generation - uses perlin noise
function generateGroundMap(xbound, ybound) {
    let map = new Array(xbound).fill(0).map(() => new Array(ybound).fill(0));
    let gridsize = 12;
    // bounds are a 6x6
    for (let x=0; x < xbound; x++) {
        for (let y=0; y < ybound; y++) {

            let val = 0;
            let freq = 1;
            let amp = 1;
            let oct = 1;

            // per octave
            for (let i = 0; i < oct; i++) {
                val += perlin(x * freq/gridsize, y * freq/gridsize) * amp;
                freq *= 2;
                amp /= 2;
            }
            val = val / oct;

            // // clip to 0 to 1
            // if (val > 1) val = 1;
            // else if (val < -1) val = -1;

            // add to our map
            map[x][y] = val;
        }
    }

    return map;

}

// let's hear some (perlin) noiiiiiise!!!!!
// procedural generation
// perlin help from https://www.youtube.com/watch?v=kCIaHqb60Cw
function perlin(x, y) {
    let x0 = Math.floor(x);
    let y0 = Math.floor(y);
    let x1 = x + 1;
    let y1 = y + 1;

    // compute interpolation weights
    let sx = x-x0;
    let sy = y-y0;

    // compute and interpolate top 2 corners
    let n0 = dotGridGradient(x0, y0, x, y);
    let n1 = dotGridGradient(x1, y0, x, y);
    let ix0 = interpolate(n0, n1, sx);

    // compute and interpolate bottom 2
    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    let ix1 = interpolate(n0, n1, sx);

    // compute between the top 2 and bottom 2 (in y)
    let value = interpolate(ix0, ix1, sy);

    return value;

}

function randomGradient(ix, iy) {
    // "random". random from https://stackoverflow.com/a/35377265

    ix = ix * 3266489917 + 374761393;
    ix = (ix << 17) | (ix >> 15);
  
    /* mix around the bits in y and mix those into x: */
    ix += iy * 3266489917;
  
    /* Give x a good stir: */
    ix *= 668265263;
    ix ^= ix >> 15;
    ix *= 2246822519;
    ix ^= ix >> 13;
    ix *= 3266489917;
    ix ^= ix >> 16;
  
    /* trim the result and scale it to a float in [0,1): */
    let random = (ix & 0x00ffffff) ;
  
    let out = [Math.sin(random), Math.cos(random)];
    return out;
}

function interpolate(a0, a1, w) {
    return (a1-a0) * (3-w*2) * w * w + a0;
}

// finds dot product between distance vector and gradient vectors
function dotGridGradient(ix, iy, x, y) {
    let gradient = randomGradient(ix, iy);

    let dx = x - ix;
    let dy = y - iy;

    return dx * gradient[0] + dy * gradient[1];
}

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


