function getShader() {
    return `
    struct VertexOutput {
        @builtin(position) aVertexPosition: vec4<f32>,
        @location(0) bary: vec3<f32>,
        @location(1) uv: vec2<f32>,
        @location(2) tex: f32,
    };

    struct ViewTransforms {
        theta : vec4<f32>,
        scale: vec4<f32>,
        translation: vec4<f32>,
        matrix: mat4x4<f32>,
    };

    @group(0) @binding(0) var<uniform> uni : ViewTransforms;
    @group(0) @binding(1) var TexSampler: sampler;
    @group(0) @binding(2) var Texture: texture_2d<f32>;
    @group(0) @binding(3) var Texture2: texture_2d<f32>;

    @vertex
    fn vs_main( @location(0) inPos: vec3<f32>,
                @location(1) bary : vec3<f32>,
                @location(2) uv: vec2<f32>,
                @location(3) tex : f32,
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
            var scale = mat4x4<f32> ( uni.scale.x,  0.0,  0.0,  0.0,
                            0.0, uni.scale.y,  0.0,  0.0,
                            0.0, 0.0,  uni.scale.z,  0.0,
                            0.0,  0.0,  0.0,  1 );
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

        var temp = uni.matrix * trans * rz * ry * rx * scale *
            vec4<f32>(inPos.x, inPos.y, inPos.z, 1);
        
        out.aVertexPosition = vec4<f32>(temp.x + uni.translation.x,
            temp.y + uni.translation.y,
            temp.z + uni.translation.z, temp.w);

        out.bary = bary;
        out.uv = uv;
        out.tex = tex;
        return out;
    }


    @fragment
    fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
        var fragColor = vec4 (1.0, 0.0, 0.0, 1.0);;
        var fragColor1 = textureSample(Texture, TexSampler, in.uv);
        var fragColor2 = textureSample(Texture2, TexSampler, in.uv);
        var land = vec4 (0.11, 0.18, 0.11, 1.0);;
        var flower = vec4 (1.0, 0.0, 0.0, 1.0);;

        if (in.tex > 2) {
            fragColor = land;
        } else if (in.tex > 1) {
            fragColor = fragColor2; // water texture
        } else if (in.tex > 0) {
            fragColor = fragColor1; // wood texture
        }

        // bary
        if (in.bary.x < 0.01 || in.bary.y < 0.01 || in.bary.z < 0.01) {
            // fragColor = vec4 (1.0, 0.0, 0.0, 1.0);

            // fragColor = vec4 (0.05, 0.28, 0.42, 1.0);
    }
    return fragColor;
    }
    `
}