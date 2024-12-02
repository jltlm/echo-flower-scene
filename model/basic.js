/**
 * @file Provides basic 3D objects (includes helpers to make them)
 * 
 * functions include:
 * - makeRectPrism
 * - makeCylinder
 * - makeCone (hopefully works, not tested yet)
 */


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
function makeRectPrism(x, y, z, w, h, d)  {
    // NOTE: this uses quads, in the order of
    // (1) - (2)
    //  |     |
    // (3) - (4)

    // front 
    addQuad( x+w, y, z, x, y, z,
        x+w, y+h, z, x, y+h, z, );

    // back
    addQuad( x, y, d+z, x+w, y, d+z,
        x, y+h, d+z, x+w, y+h, d+z, );

    // top
    addQuad(x, y+h, z+d, x+w, y+h, z+d, 
        x, y+h, z, x+w, y+h, z, );

    // bottom
    addQuad( x+w, y, z+d, x, y, z+d, 
        x+w, y, z, x, y, z,);

    // left
    addQuad( x+w, y+h, z, x+w, y+h, z+d,
        x+w, y, z, x+w, y, z+d, );

    // right
    addQuad( x, y+h, z+d, x, y+h, z,
        x, y, z+d, x, y, z, );
    
}


//
// fill in code that creates the triangles for a cylinder with diameter 0.5
// and height of 0.5 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder (x, y, z, radius, height, radialdivision, heightdivision){
    // pi = Math.PI;
    // // edited
    // // radius
    // for(let f = 0; f < radialdivision; f++){
    //     let r = radius;
    //     let a = ((2 * pi)/ radialdivision) * f;
    //     let a2 = ((2 * pi)/ radialdivision) * (f + 1);

    //     let x1 = x + (r * Math.cos(a));
    //     let z1 = z + (r * Math.sin(a));
    //     let x2 = x + (r * Math.cos(a2));
    //     let z2 = z + (r * Math.sin(a2));
    //     let m = height / heightdivision;
        
    //     // top face
    //     addTriangle(x, y - (height/2), z,
    //         x1, y - (height/2), z1,
    //         x2, y - (height/2), z2
    //     );

    //     addTriangle(x, y - (height/2), z,
    //         x2, y - (height/2), z2,
    //         x1, y - (height/2), z1,
    //     );

    //     // height
    //     for(let h = 0; h < heightdivision; h++){
    //         let y1 = y + (m * h - (height/2));
    //         let y2 = y + (m * (h+1) - (height/2));

    //         addTriangle(x1, y1, z1,
    //             x2, y1, z2,
    //             x2, y2, z2
    //         );

    //         addTriangle(
    //             x2, y1, z2,
    //             x1, y1, z1,
    //             x2, y2, z2
    //         );

    //         addTriangle(x2, y2, z2,
    //             x1, y2, z1,
    //             x1, y1, z1
    //         );

    //         addTriangle(
    //             x1, y2, z1,
    //             x2, y2, z2,
    //             x1, y1, z1
    //         );
    //     }

    //     // bottom face

    //     addTriangle(x1, y + (height/2), z1,
    //         x, y + (height/2), z,
    //         x2, y + (height/2), z2
    //     );

    //     addTriangle(x2, y + (height/2), z2,
    //         x, y + (height/2), z,
    //         x1, y + (height/2), z1
    //     );
    // }

// original
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


// fill in code that creates the triangles for a cone with diameter 0.5
// and height of 0.5 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions along the surface of the cone
// given by heightdivision.
function makeCone (radialdivision, heightdivision) {
    let diameter = 0.5;
    let radius = diameter / 2;
    let height = 0.5;
    let heightBottom = -height/2;
    let heightTop = height/2;
    let radialAngle = 2 * Math.PI / radialdivision;
    let divheight = height / heightdivision;

    for (let i = 0; i < radialdivision; i++) {
        let startAngle = radialAngle * i;
        let endAngle = startAngle + radialAngle;

        let point1 = getRadialCoords(startAngle, radius);
        let point1x = point1[0];
        let point1y = point1[1];

        let point2 = getRadialCoords(endAngle, radius);
        let point2x = point2[0];
        let point2y = point2[1];

        // base
        addTriangle(point2x, point2y, heightBottom,
            point1x, point1y, heightBottom,
            0, 0, heightBottom);
        
        // cone side, per side
        let divHeightStart = heightBottom;
        let divHeightEnd = heightTop;
        for (let j = 0; j < heightdivision - 1; j++) {
            divHeightStart = divheight * j + heightBottom;
            divHeightEnd = divHeightStart + divheight;

            // points closer to base
            let bp1x = scaleToHeight(point1x, heightdivision, j);
            let bp1y = scaleToHeight(point1y, heightdivision, j);
            let bp2x = scaleToHeight(point2x, heightdivision, j);
            let bp2y = scaleToHeight(point2y, heightdivision, j);

            //  points closer to top
            let tp1x = scaleToHeight(point1x, heightdivision, j+1);
            let tp1y = scaleToHeight(point1y, heightdivision, j+1);
            let tp2x = scaleToHeight(point2x, heightdivision, j+1);
            let tp2y = scaleToHeight(point2y, heightdivision, j+1);
            
            addQuad(
                bp1x, bp1y, divHeightStart,
                bp2x, bp2y, divHeightStart,
                tp2x, tp2y, divHeightEnd,
                tp1x, tp1y, divHeightEnd,
            )
        }
        // tippy top
        // points closer to base
        let p1x = scaleToHeight(point1x, heightdivision, heightdivision-1);
        let p1y = scaleToHeight(point1y, heightdivision, heightdivision-1);
        let p2x = scaleToHeight(point2x, heightdivision, heightdivision-1);
        let p2y = scaleToHeight(point2y, heightdivision, heightdivision-1);

        addTriangle(p1x, p1y, heightBottom + divheight*(heightdivision-1),
            p2x, p2y, heightBottom + divheight*(heightdivision-1),
            0, 0, heightTop);
    }
}

// helper for cone
// basically just scaling the point inward (x or y) by how far from the base it is.
function scaleToHeight(value, totalDivisions, currentDivision) {
    return value / totalDivisions * (totalDivisions - currentDivision);
}

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// arbitrary defaults
function addTriangle (x0,y0,z0, x1,y1,z1, x2,y2,z2,
                    uvx0=0,uvy0=0, uvx1=1,uvy1=0, uvx2=1,uvy2=1) {
    var nverts = points.length / 3;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    uvs.push(uvx0);
    uvs.push(uvy0);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    uvs.push(uvx1);
    uvs.push(uvy1);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    uvs.push(uvx2);
    uvs.push(uvy2);
    indices.push(nverts);
    nverts++;

}

/**
 Add vertices in order of top left,
 top right, bottom left, bottom right
 (or some rotation of that)
 */
function addQuad (x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3) {
    addTriangle(x0,y0,z0,x1,y1,z1,x2,y2,z2,0,0,1,0,0,1);
    addTriangle(x1,y1,z1,x3,y3,z3,x2,y2,z2,1,0,1,1,0,1);
}

