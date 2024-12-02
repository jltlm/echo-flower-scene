'use strict';

import * as mat4 from './mat42.js';

// buffers
let myVertexBuffer = null;
let myBaryBuffer = null;
let myIndexBuffer = null;
let myUvBuffer = null;
let uniformBuffer = null;

// Other globals with default values;
var updateDisplay = true;
var anglesReset = [-20.0, 30.0, 0.0, 0.0];
var angles = [-20.0, 30.0, 0.0, 0.0];
var angleInc = 5.0;
var zoomLevel = 1;
var zoomInc = .5;
var zoomReset = 1;

// set up the shader var's
function setShaderInfo() {
    // set up the shader code var's
    code = getShader();
    shaderDesc = { code: code };
    shaderModule = device.createShaderModule(shaderDesc);
    colorState = {
        format: 'bgra8unorm'
    };

    // set up depth
    // depth shading will be needed for 3d objects in the future
    depthTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
}

// Create a program with the appropriate vertex and fragment shaders
async function initProgram() {

    // Check to see if WebGPU can run
    if (!navigator.gpu) {
        console.error("WebGPU not supported on this browser.");
        return;
    }

    // get webgpu browser software layer for graphics device
    adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.error("No appropriate GPUAdapter found.");
        return;
    }

    // get the instantiation of webgpu on this device
    device = await adapter.requestDevice();
    if (!device) {
        console.error("Failed to request Device.");
        return;
    }

    // configure the canvas
    context = canvas.getContext('webgpu');
    const canvasConfig = {
        device: device,
        // format is the pixel format
        format: navigator.gpu.getPreferredCanvasFormat(),
        // usage is set up for rendering to the canvas
        usage:
            GPUTextureUsage.RENDER_ATTACHMENT,
        alphaMode: 'opaque'
    };
    context.configure(canvasConfig);

}

// general call to make and bind a new object based on current
// settings..Basically a call to shape specfic calls in cgIshape.js
async function createNewShape() {

    // Call the functions in an appropriate order
    setShaderInfo();

    // clear your points and elements
    points = [];
    indices = [];
    bary = [];
    uvs = [];

    // make the scene
    makeScene();

    // create and bind vertex buffer

    // set up the attribute we'll use for the vertices
    const vertexAttribDesc = {
        shaderLocation: 0, // @location(0) in vertex shader
        offset: 0,
        format: 'float32x3' // 3 floats: x,y,z
    };

    // this sets up our buffer layout
    const vertexBufferLayoutDesc = {
        attributes: [vertexAttribDesc],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 3, // sizeof(float) * 3 floats
        stepMode: 'vertex'
    };

    // buffer layout and filling
    const vertexBufferDesc = {
        size: points.length * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    };
    myVertexBuffer = device.createBuffer(vertexBufferDesc);
    let writeArray =
        new Float32Array(myVertexBuffer.getMappedRange());

    writeArray.set(points); // this copies the buffer
    myVertexBuffer.unmap();

    // set up the uv buffer
    // set up the attribute we'll use for the vertices
    const uvAttribDesc = {
        shaderLocation: 2, // @location(2) in vertex shader
        offset: 0,
        format: 'float32x2' // 2 floats: u,v
    };

    // this sets up our buffer layout
    const uvBufferLayoutDesc = {
        attributes: [uvAttribDesc],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 2, // sizeof(float) * 2 floats
        stepMode: 'vertex'
    };

    // buffer layout and filling
    const uvBufferDesc = {
        size: uvs.length * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    };
    myUvBuffer = device.createBuffer(uvBufferDesc);
    let writeArrayUvs =
        new Float32Array(myUvBuffer.getMappedRange());

    writeArrayUvs.set(uvs); // this copies the buffer
    myUvBuffer.unmap();

    // create and bind bary buffer
    const baryAttribDesc = {
        shaderLocation: 1, // @location(1) in vertex shader
        offset: 0,
        format: 'float32x3' // 3 floats: x,y,z
    };

    // this sets up our buffer layout
    const myBaryBufferLayoutDesc = {
        attributes: [baryAttribDesc],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 3, // 3 bary's
        stepMode: 'vertex'
    };

    // buffer layout and filling
    const myBaryBufferDesc = {
        size: bary.length * Float32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    };
    myBaryBuffer = device.createBuffer(myBaryBufferDesc);
    let writeBaryArray =
        new Float32Array(myBaryBuffer.getMappedRange());

    writeBaryArray.set(bary); // this copies the buffer
    myBaryBuffer.unmap();

    // setup index buffer

    // first guarantee our mapped range is a multiple of 4
    // mainly necessary becauses uint16 is only 2 and not 4 bytes
    if (indices.length % 2 != 0) {
        indices.push(indices[indices.length - 1]);
    }
    const myIndexBufferDesc = {
        size: indices.length * Uint16Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    };
    myIndexBuffer = device.createBuffer(myIndexBufferDesc);
    let writeIndexArray =
        new Uint16Array(myIndexBuffer.getMappedRange());

    writeIndexArray.set(indices); // this copies the buffer
    myIndexBuffer.unmap();

    // Set up the uniform var
    let uniformBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {}
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {
                    type: "filtering",
                },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType: "float",
                    viewDimension: "2d",
                    multisampled: false,
                },
            }
        ]
    });

    // set up the pipeline layout
    const pipelineLayoutDesc = { bindGroupLayouts: [uniformBindGroupLayout] };
    const layout = device.createPipelineLayout(pipelineLayoutDesc);

    // pipeline desc
    const pipelineDesc = {
        layout,
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
            buffers: [vertexBufferLayoutDesc, myBaryBufferLayoutDesc, uvBufferLayoutDesc]
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs_main',
            targets: [colorState]
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus',
        },
        primitive: {
            topology: 'triangle-list', //<- MUST change to draw lines! 
            frontFace: 'cw', // this doesn't matter for lines
            cullMode: 'back'
        }
    };

    pipeline = device.createRenderPipeline(pipelineDesc);

    uniformValues = new Float32Array(angles);
    uniformBuffer = device.createBuffer({
        size: uniformValues.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    // copy the values from JavaScript to the GPU
    device.queue.writeBuffer(uniformBuffer, 0, uniformValues);

    // // now create the texture to render
    const url = './assets/texture1.jpg';
    imageSource = await loadImageBitmap(url);
    texture = device.createTexture({
        label: "image",
        format: 'rgba8unorm',
        size: [imageSource.width, imageSource.height],
        usage: GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
        { source: imageSource, flipY: true },
        { texture: texture },
        { width: imageSource.width, height: imageSource.height, depthOrArrayLayers: 1 },
    );

    const samplerTex = device.createSampler();
    
    uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer,
                },
            },
            { binding: 1, resource: samplerTex },
            { binding: 2, resource: texture.createView() },
        ],
    });

    // indicate a redraw is required.
    updateDisplay = true;
}

// We call draw to render to our canvas
function draw() {
    // set up color info
    colorTexture = context.getCurrentTexture();
    colorTextureView = colorTexture.createView();

    // a color attachment ia like a buffer to hold color info
    colorAttachment = {
        view: colorTextureView,
        clearValue: { r: 0.2, g: 0.2, b: 0.0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store'
    };
    renderPassDesc = {
        colorAttachments: [colorAttachment],
        depthStencilAttachment: {
            view: depthTexture.createView(),

            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        },
    };

    // convert to radians before sending to shader
    uniformValues[0] = radians(angles[0]);
    uniformValues[1] = radians(angles[1]);
    uniformValues[2] = radians(angles[2]);

    // copy the values from JavaScript to the GPU
    device.queue.writeBuffer(uniformBuffer, 0, uniformValues);

    // create the render pass
    commandEncoder = device.createCommandEncoder();
    passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, myVertexBuffer);
    passEncoder.setVertexBuffer(1, myBaryBuffer);
    passEncoder.setVertexBuffer(2, myUvBuffer);
    passEncoder.setIndexBuffer(myIndexBuffer, "uint16");
    passEncoder.drawIndexed(indices.length, 1);
    passEncoder.end();

    // submit the pass to the device
    device.queue.submit([commandEncoder.finish()]);
}

// function obtained from:
// https://webgpufundamentals.org/webgpu/lessons/webgpu-importing-textures.html
async function loadImageBitmap(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return await createImageBitmap(blob, { colorSpaceConversion: 'none' });
}

// Entry point to our application
async function init() {
    // Retrieve the canvas
    canvas = document.querySelector("canvas");

    // deal with keypress
    window.addEventListener('keydown', (event) => {

        var key = event.key;

        //  incremental rotation
        if (key == 'x')
            angles[0] -= angleInc;
        else if (key == 'y')
            angles[1] -= angleInc;
        else if (key == 'z')
            angles[2] -= angleInc;
        else if (key == 'X')
            angles[0] += angleInc;
        else if (key == 'Y')
            angles[1] += angleInc;
        else if (key == 'Z')
            angles[2] += angleInc;
        else if (key == '+')
            zoomLevel += zoomInc;
        else if (key == '-')
            zoomLevel -= zoomInc;

        // reset
        else if (key == 'r' || key == 'R') {
            angles[0] = anglesReset[0];
            angles[1] = anglesReset[1];
            angles[2] = anglesReset[2];
            zoomLevel = zoomReset;
        }

        // create a new shape and do a redo a draw
        createNewShape();
        draw();
    }, false);

    // Read, compile, and link your shaders
    await initProgram();

    // create and bind your current object
    await createNewShape();

    // do a draw
    draw();
}
window.onload = init;
