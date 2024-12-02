const AREADIM = 0.2;

// sets up the bounds for the area. A cube of lines
function makeArea() {
    const b = AREADIM;
    const cube = [
        -b, -b, -b,
        -b, b, -b,

        -b, b, -b,
        -b, b, b,

        -b, b, b,
        -b, -b, b,

        b, -b, -b,
        b, b, -b,

        b, b, -b,
        b, b, b,

        b, b, b,
        b, -b, b,

        b, -b, b,
        -b, -b, b,

        b, b, b,
        -b, b, b,

        b, b, -b,
        -b, b, -b,

        b, -b, -b,
        -b, -b, -b,
    ];

}

// takes translation coords around center of object
function makeFrisk() {

}

// translates bridge item to x, y, z. In a square of side length size
function makeBridge(x, y, z, size) {
    let a = size / 27;
    let b = size / 11;
    for (let i = 0; i < 9; i++) { // top boards, supports
        makeRectPrism(x, y, z + (size / 9 * i), size, a, b);
        if (i % 2) {
            makeCylinder(x+b, y-b*2, z + (size / 9 * i), b/2, 2*b, 8, 1);
            makeCylinder(x+size-b, y-b*2, z + (size / 9 * i), b/2, 2*b, 8, 1);

            // makeCylinder(x, y, z + (size / 9 * i), b/2, b/2, 8, 1);
        }
    }
    let c = size / 4 - b; // for even spacing of bottom boards
    for (let i = 0; i < 4; i++) { // bottom boards
        makeRectPrism(x + (size / 4 * i) + c / 4 * i, y-a, z, b, a, size);
    }
}

// makes the water part of the scene
function makeWater() {
    makeRectPrism(-AREADIM, -AREADIM, -AREADIM, 2*AREADIM, AREADIM/5, 2*AREADIM);
}

// MAKES THE SCENE
function makeScene() {
    makeWater();
    makeBridge(-AREADIM, -AREADIM+AREADIM/5+0.05, 0, AREADIM);
    return 2;
};

// Translates rect prism to (x, y, z)- has dimensions w (width), h (height), d (depth)
function makeRectPrism(x, y, z, w, h, d)  {

    // // NOTE: your triangles need to be clockwise for the pipeline not to cull them!
    // front 
    addTriangle(x, y, z,
        x, y+h, z,
        x+w, y+h, z);
    addTriangle(x, y, z,
        x+w, y+h, z,
        x+w, y, z);

    // back
    addTriangle(x+w, y+h, d+z,
        x, y+h, d+z,
        x, y, d+z);
    addTriangle(x+w, y, d+z,
        x+w, y+h, d+z,
        x, y, d+z);

    // top
    addTriangle(x, y+h, z+d, 
        x+w, y+h, z+d, 
        x+w, y+h, z);
    addTriangle(x, y+h, z+d,
        x+w, y+h, z,
        x, y+h, z);

    // bottom
    addTriangle(x+w, y, z,
        x+w, y, z+d,
        x, y, z+d);
    addTriangle(x, y, z,
        x+w, y, z,
        x, y, z+d);

    // left
    addTriangle(x, y, z+d,
        x, y+h, z+d,
        x, y, z);
    addTriangle(x, y+h, z+d,
        x, y+h, z,
        x, y, z);

    // right
    addTriangle(x+w, y, z,
        x+w, y+h, z+d,
        x+w, y, z+d);
    addTriangle(x+w, y, z,
        x+w, y+h, z,
        x+w, y+h, z+d);
    
}


//
// fill in code that creates the triangles for a cylinder with diameter 0.5
// and height of 0.5 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder (x, y, z, radius, height, radialdivision, heightdivision){
    let heightMax = height + y;
    let heightMin = y;
    let radialAngle = 2 * Math.PI / radialdivision;
    let divheight = height / heightdivision;

    for (let i = 0; i < radialdivision; i++) {
        let startAngle = radialAngle * i;
        let endAngle = startAngle + radialAngle;

        let point1 = getRadialCoords(startAngle, radius);
        let point1x = point1[0] + x;
        let point1z = point1[1] + z;

        let point2 = getRadialCoords(endAngle, radius);
        let point2x = point2[0] + x;
        let point2z = point2[1] + z;

        // top
        addTriangle(point2x, heightMax, point2z, 
            point1x, heightMax, point1z, 
            x, heightMax, z);
        // bottom
        addTriangle(x, heightMin, z, 
            point1x, heightMin, point1z,
            point2x, heightMin,point2z);
        
        for (let j = 0; j < heightdivision; j++) {
            let divHeightStart = divheight * j + heightMin;
            let divHeightEnd = divHeightStart + divheight;
            addTriangle(point2x, divHeightEnd, point2z,
                point2x, divHeightStart, point2z,
                point1x, divHeightStart, point1z);
            addTriangle(point1x, divHeightStart, point1z,
                point1x, divHeightEnd, point1z,
                point2x, divHeightEnd, point2z);
        }
    }

}

// helper for radial stuff (make cylinder, make cone)
function getRadialCoords (radialAngle, radius) {
    return [radius * Math.cos(radialAngle), radius * Math.sin(radialAngle)];
}


// //
// // fill in code that creates the triangles for a cone with diameter 0.5
// // and height of 0.5 (centered at the origin) with the number of
// // subdivisions around the base of the cone (given by radialdivision)
// // and the number of subdivisions along the surface of the cone
// //given by heightdivision.
// //
// function makeCone (radialdivision, heightdivision) {
//     let diameter = 0.5;
//     let radius = diameter / 2;
//     let height = 0.5;
//     let heightBottom = -height/2;
//     let heightTop = height/2;
//     let radialAngle = 2 * Math.PI / radialdivision;
//     let divheight = height / heightdivision;

//     for (let i = 0; i < radialdivision; i++) {
//         let startAngle = radialAngle * i;
//         let endAngle = startAngle + radialAngle;

//         let point1 = getRadialCoords(startAngle, radius);
//         let point1x = point1[0];
//         let point1y = point1[1];

//         let point2 = getRadialCoords(endAngle, radius);
//         let point2x = point2[0];
//         let point2y = point2[1];

//         // base
//         addTriangle(point2x, point2y, heightBottom,
//             point1x, point1y, heightBottom,
//             0, 0, heightBottom);
        
//         // cone side, per side
//         let divHeightStart = heightBottom;
//         let divHeightEnd = heightTop;
//         for (let j = 0; j < heightdivision - 1; j++) {
//             divHeightStart = divheight * j + heightBottom;
//             divHeightEnd = divHeightStart + divheight;

//             // points closer to base
//             let bp1x = scaleToHeight(point1x, heightdivision, j);
//             let bp1y = scaleToHeight(point1y, heightdivision, j);
//             let bp2x = scaleToHeight(point2x, heightdivision, j);
//             let bp2y = scaleToHeight(point2y, heightdivision, j);

//             //  points closer to top
//             let tp1x = scaleToHeight(point1x, heightdivision, j+1);
//             let tp1y = scaleToHeight(point1y, heightdivision, j+1);
//             let tp2x = scaleToHeight(point2x, heightdivision, j+1);
//             let tp2y = scaleToHeight(point2y, heightdivision, j+1);

//             addTriangle(bp1x, bp1y, divHeightStart,
//                 bp2x, bp2y, divHeightStart,
//                 tp2x, tp2y, divHeightEnd);
//             addTriangle(tp2x, tp2y, divHeightEnd,
//                 tp1x, tp1y, divHeightEnd,
//                 bp1x, bp1y, divHeightStart);
//         }
//         // tippy top
//         // points closer to base
//         let p1x = scaleToHeight(point1x, heightdivision, heightdivision-1);
//         let p1y = scaleToHeight(point1y, heightdivision, heightdivision-1);
//         let p2x = scaleToHeight(point2x, heightdivision, heightdivision-1);
//         let p2y = scaleToHeight(point2y, heightdivision, heightdivision-1);

//         addTriangle(p1x, p1y, heightBottom + divheight*(heightdivision-1),
//             p2x, p2y, heightBottom + divheight*(heightdivision-1),
//             0, 0, heightTop);
//     }
// }

// // helper for cone
// // basically just scaling the point inward (x or y) by how far from the base it is.
// function scaleToHeight(value, totalDivisions, currentDivision) {
//     return value / totalDivisions * (totalDivisions - currentDivision);
// }

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
    var nverts = points.length / 3;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    uvs.push(0);
    uvs.push(0);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    uvs.push(0);
    uvs.push(0);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    uvs.push(1);
    uvs.push(1);
    indices.push(nverts);
    nverts++;
}

