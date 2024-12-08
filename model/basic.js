/**
 * @file Provides basic 3D objects (includes helpers to make them)
 * 
 * functions include:
 * - makeRectPrism
 * - makeCylinder
 * - makeCone (hopefully works, not tested yet)
 */
import * as mat4 from '../util/mat42.js';


/**
 * Translates rect prism to (x, y, z)- has dimensions
 * w (width), h (height), d (depth)
 * @param {*} x starting x
 * @param {*} y starting y
 * @param {*} z starting z
 * @param {*} w width
 * @param {*} h height
 * @param {*} d depth
 */
export function makeRectPrism(x, y, z, w, h, d, t)  {
    // NOTE: this uses quads, in the order of
    // (1) - (2)
    //  |     |
    // (3) - (4)

    // front 
    addQuad( x+w, y, z, x, y, z,
            x+w, y+h, z, x, y+h, z, t,);

    // back
    addQuad( x, y, d+z, x+w, y, d+z,
            x, y+h, d+z, x+w, y+h, d+z, t,);
    // top
    addQuad(x, y+h, z+d, x+w, y+h, z+d, 
            x, y+h, z, x+w, y+h, z, t,);

    // bottom
    addQuad( x+w, y, z+d, x, y, z+d, 
            x+w, y, z, x, y, z, t,);

    // left
    addQuad( x+w, y+h, z, x+w, y+h, z+d,
            x+w, y, z, x+w, y, z+d, t,);

    // right
    addQuad( x, y+h, z+d, x, y+h, z,
            x, y, z+d, x, y, z, t,);
}


export function makeCylinder (x, y, z, radius, height, t,
            radialdivision=8, heightdivision=1){
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
            x, heightMax, z, t);

        // bottom
        addTriangle(x, heightMin, z, 
            point1x, heightMin, point1z,
            point2x, heightMin, point2z, t);
        
        for (let j = 0; j < heightdivision; j++) {
            let divHeightStart = divheight * j + heightMin;
            let divHeightEnd = divHeightStart + divheight;
            addQuad(
                point2x, divHeightStart, point2z,
                point1x, divHeightStart, point1z,
                point2x, divHeightEnd, point2z,
                point1x, divHeightEnd, point1z,
                t, );
        }
    }
}

// helper for radial stuff (make cylinder, make cone)
function getRadialCoords (radialAngle, radius) {
    return [radius * Math.cos(radialAngle), radius * Math.sin(radialAngle)];
}


// // fill in code that creates the triangles for a cone with diameter 0.5
// // and height of 0.5 (centered at the origin) with the number of
// // subdivisions around the base of the cone (given by radialdivision)
// // and the number of subdivisions along the surface of the cone
// // given by heightdivision.
// export function makeCone (radialdivision, heightdivision) {
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
            
//             addQuad(
//                 bp1x, bp1y, divHeightStart,
//                 bp2x, bp2y, divHeightStart,
//                 tp2x, tp2y, divHeightEnd,
//                 tp1x, tp1y, divHeightEnd,
//             )
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

export function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// use imported OBJs
export function addObj(model, x, y, z, scale=1) {
    let obj = model;
    points.push(...obj.positions.map((v, i) => {
        v*=scale;
        if (i%3 == 0) { // if x coord
            v += x;
        } else if (i%3 == 1) { // if y coord
            v += y;
        } else if (i%3 == 2) { // if z coord
            v += z;
            // tex.push(1)
        }

        return v;
    }));
    obj.indices.forEach((v, i) => {
        indices.length != 0 ?
            indices.push(indices[indices.length-1]+1) :
            indices.push(0);
        if (i%3 == 0) {
            bary.push (0.0);
            bary.push (0.0);
            bary.push (1.0);
        } else if (i%3 == 1) {
            bary.push (0.0);
            bary.push (1.0);
            bary.push (0.0);
        } else if (i%3 == 2) {
            bary.push (1.0);
            bary.push (0.0);
            bary.push (0.0);
        }
    });
    uvs.push(...obj.uvs);
}

// arbitrary defaults for uvs
export function addTriangle (x0,y0,z0, x1,y1,z1, x2,y2,z2, t=1,
                    uvx0=0,uvy0=0, uvx1=1,uvy1=0, uvx2=1,uvy2=1) {
    var nverts = points.length / 3;
    if (t == null || t == undefined) {
        t = 1;
    }
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    uvs.push(uvx0);
    uvs.push(uvy0);
    tex.push(t);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    uvs.push(uvx1);
    uvs.push(uvy1);
    tex.push(t);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    uvs.push(uvx2);
    uvs.push(uvy2);
    tex.push(t);
    indices.push(nverts);
    nverts++;

}

/**
 Add vertices in order of top left,
 top right, bottom left, bottom right
 (or some rotation of that)
 */
export function addQuad (x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3, t=1) {
    addTriangle(x0,y0,z0,x1,y1,z1,x2,y2,z2,t,0,0,1,0,0,1);
    addTriangle(x1,y1,z1,x3,y3,z3,x2,y2,z2,t,1,0,1,1,0,1);
}

/**
 * rotate x1, y1, z1 by angles xa, ya, za (angles on each plane)
 *  around x0, y0, z0
 */
function rotate(x0, y0, z0, x1, y1, z1, a, plane) {
    let transformedToOrigin = mat4.create(
        x1-x0, 0, 0, 0,
        0, y1-y0, 0, 0,
        0, 0, z1-z0, 0);

    let rotated;
    if (plane == 'x') rotated = mat4.rotateX(transformedToOrigin, a);
    else if (plane == 'y') rotated = mat4.rotateY(transformedToOrigin, a);
    else if (plane == 'z') rotated = mat4.rotateZ(transformedToOrigin, a);

    // translate back to original position
    let res = [rotated[0]+x0, rotated[4]+y0, rotated[8]+z0];
    console.log(res);

    return res;    
}

/**
 
compute has to be async, and functions that call it have to be async too

create shader module
offsetstartposition
size
subdivisions

globalinvolcationid
begincompute pass needs more stuff too

fn main_compute(@builtin(global_invocation_iid) GlobalInvocationID: vec3<32>

can write functions in the shader (addTriangle)

workgroup(6, 6, 1) (faces, vertices, 1)
to completely parallelize it (which is cool)
 */