function getShader () {
  return `
  struct VertexOutput {
                  @builtin(position) aVertexPosition: vec4<f32>,
                  @location(0) bary: vec3<f32>,
                  @location(1) uv: vec2<f32>
      };

      struct UniformStruct {
          theta : vec4<f32>,
      };

      @group(0) @binding(0) var<uniform> uni : UniformStruct;

      @vertex
        fn vs_main(
                  @location(0) inPos: vec3<f32>,
                  @location(2) uv: vec2<f32>,
                  @location(1) bary : vec3<f32>
                  ) -> VertexOutput {
        var out: VertexOutput;
        // Compute the sines and cosines of each rotation
        // about each axis - must be converted into radians first
        var c = cos(  uni.theta );
        var s = sin(  uni.theta );

        // translation matrix
        var trans = mat4x4<f32> ( 1.0,  0.0,  0.0,  0.0,
                          0.0,  1.0,  0.0,  0.0,
                          0.0, 0.0,  1.0,  0.0,
                          0.0,  0.0, 0.5,  1.0 );
        // scale matrix
         var scale = mat4x4<f32> ( 1.0,  0.0,  0.0,  0.0,
                          0.0,  1.0,  0.0,  0.0,
                          0.0, 0.0,  1.0,  0.0,
                          0.0,  0.0,  0.0,  0.5 );
        // rotation matrices
        var rx = mat4x4<f32> ( 1.0,  0.0,  0.0,  0.0,
                          0.0,  c.x,  s.x,  0.0,
                          0.0, -s.x,  c.x,  0.0,
                          0.0,  0.0,  0.0,  1.0 );

        var ry = mat4x4<f32> ( c.y,  0.0, -s.y,  0.0,
                          0.0,  1.0,  0.0,  0.0,
                          s.y,  0.0,  c.y,  0.0,
                          0.0,  0.0,  0.0,  1.0 );

        var rz = mat4x4<f32> ( c.z,  s.z,  0.0,  0.0,
                        -s.z,  c.z,  0.0,  0.0,
                          0.0,  0.0,  1.0,  0.0,
                          0.0,  0.0,  0.0,  1.0 );


        out.aVertexPosition =  trans * rz * ry * rx * scale * vec4<f32>(inPos.x, inPos.y, inPos.z, 1);
        out.bary = bary;
        out.uv = uv;
        return out;
        }

        @group(0) @binding(1) var TexSampler: sampler;
        @group(0) @binding(2) var Texture: texture_2d<f32>;

        @fragment
        fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
          var fragColor = vec4<f32> (0.0, 0.5, 0.5, 1.0 );
          fragColor = textureSample(Texture, TexSampler, in.uv);

            // bary
            if (in.bary.x < 0.01 || in.bary.y < 0.01 || in.bary.z < 0.01) {
              fragColor = vec4 (1.0, 1.0, 0.0, 1.0);
        }
        return fragColor;
        }
  `
}

// -- given code for texture loader
// struct VertexOutput {
//   @builtin(position) aVertexPosition: vec4<f32>,
//   @location(0) uv : vec2<f32>
// };

// struct UniformStruct {
// uModelViewMatrix : mat4x4<f32>,
// };

// @group(0) @binding(0) var<uniform> uniformStruct : UniformStruct;

// @vertex
// fn vs_main(
//   @location(0) inPos: vec3<f32>,
//   @location(1) inUv : vec2<f32>) -> VertexOutput {
// var out: VertexOutput;

// // Set the varying to be used inside of the fragment shader
// out.uv = inUv;
// out.aVertexPosition =  uniformStruct.uModelViewMatrix * vec4<f32>(inPos.x, inPos.y, inPos.z, 1);
// return out;
// }

// @group(0) @binding(1) var TexSampler: sampler;
// @group(0) @binding(2) var Texture: texture_2d<f32>;

// @fragment
// fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
// return textureSample(Texture, TexSampler, in.uv);
// }

