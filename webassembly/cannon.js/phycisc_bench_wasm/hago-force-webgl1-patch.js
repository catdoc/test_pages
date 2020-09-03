(function(){

if (typeof yyrt === 'undefined') {
    return;
}

if (!yyrt.getRuntimeVersion) {
    console.error('yyrt.getRuntimeVersion is not found!');
    return;
}

const HAGO_PATCH_VERSION = '1.0.14';

const version = yyrt.getRuntimeVersion();
console.log('Runtime version: ' + version + ', hago patch version: ' + HAGO_PATCH_VERSION);
const versionArr = version.split('.');
if (!versionArr || versionArr.length !== 3) {
    console.error('Wrong runtime version: ' + version);
    return;
}


const gl = window.__ccgl;
const majorVersion = parseInt(versionArr[0]);
const featureVersion = parseInt(versionArr[1]);
const patchVersion = parseInt(versionArr[2]);

function needPatchForVersionsLessThan(mV, fV, pV) {
    if (majorVersion < mV) {
        return true;
    }
    else if (majorVersion > mV) {
        return false;
    }

    if (featureVersion < fV) {
        return true;
    }
    else if (featureVersion > fV) {
        return false;
    }

    if (patchVersion < pV) {
        return true;
    }

    return false;
}

const needPatchLowerThan_3_1_0 = needPatchForVersionsLessThan(3, 1, 24);

console.info('needPatchLowerThan_3_1_0: ' + needPatchLowerThan_3_1_0);


if (needPatchLowerThan_3_1_0) {

var oldGetContext = HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.getContext = function(name) {
    // WebGL 2 support has bugs in hago versions lower than 3.1.0.
    // So disable it for lower versions.
    if (name === 'webgl2') {
        return null;
    }

    return oldGetContext.apply(this, arguments);
};

//
// Extensions
//

class OESTextureFloat {
    constructor() {}

    toString() {
        return '[object OESTextureFloat]'
    }
}
const vOESTextureFloat = new OESTextureFloat();

class OESTextureFloatLinear {
    constructor() {}
    toString() {
        return '[object OESTextureFloatLinear]'
    }
}
const vOESTextureFloatLinear = new OESTextureFloatLinear();

class OESTextureHalfFloat {
    constructor() {
        this.HALF_FLOAT_OES = 36193;
    }
    toString() {
        return '[object OESTextureHalfFloat]'
    }
}
const vOESTextureHalfFloat = new OESTextureHalfFloat();

class OESTextureHalfFloatLinear {
    constructor() {}
    toString() {
        return '[object OESTextureHalfFloatLinear]'
    }
}
const vOESTextureHalfFloatLinear = new OESTextureHalfFloatLinear();

class WebGLDepthTexture {
    constructor() {
        this.UNSIGNED_INT_24_8_WEBGL = 34042;
    }
    toString() {
        return '[object WebGLDepthTexture]'
    }
}
const vWebGLDepthTexture = new WebGLDepthTexture();

class EXTColorBufferFloat {
    constructor() {}
    toString() {
        return '[object EXTColorBufferFloat]'
    }
}
const vEXTColorBufferFloat = new EXTColorBufferFloat();

class EXTColorBufferHalfFloat {
    constructor() {
        this.RGBA16F_EXT = 0x881A;
        this.RGB16F_EXT = 0x881B;
        this.RG16F_EXT = 0x822F;
        this.R16F_EXT = 0x822D;
        this.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 0x8211;
        this.UNSIGNED_NORMALIZED_EXT = 0x8C17;
    }
    toString() {
        return '[object EXTColorBufferHalfFloat]'
    }
}
const vEXTColorBufferHalfFloat = new EXTColorBufferHalfFloat();

class OESElementIndexUint {
    constructor() {}
    toString() {
        return '[object OESElementIndexUint]'
    }
}
const vOESElementIndexUint = new OESElementIndexUint();

class WebGLCompressedTextureS3TC {
    constructor() {
        this.COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;  // A DXT1-compressed image in an RGB image format.
        this.COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1; // A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
        this.COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2; // A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
        this.COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3; // A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.
    }
    toString() {
        return '[object WebGLCompressedTextureS3TC]'
    }
}
const vWebGLCompressedTextureS3TC = new WebGLCompressedTextureS3TC();

class WebGLCompressedTextureETC1 {
    constructor() {
        this.COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // Compresses 24-bit RGB data with no alpha channel.
    }
    toString() {
        return '[object WebGLCompressedTextureETC1]'
    }
}
const vWebGLCompressedTextureETC1 = new WebGLCompressedTextureETC1();

class WebGLCompressedTexturePVRTC {
    constructor() {
        this.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;  //  RGB compression in 4-bit mode. One block for each 4×4 pixels.
        this.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; //  RGBA compression in 4-bit mode. One block for each 4×4 pixels.
        this.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;  //  RGB compression in 2-bit mode. One block for each 8×4 pixels.
        this.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; //  RGBA compression in 2-bit mode. One block for each 8×4 pixe
    }
    toString() {
        return '[object WebGLCompressedTexturePVRTC]'
    }
}
const vWebGLCompressedTexturePVRTC = new WebGLCompressedTexturePVRTC();

class OESStandardDerivatives {
    constructor() {
        this.FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 0x8B8B;
    }
    toString() {
        return '[object OESStandardDerivatives]'
    }
}
const vOESStandardDerivatives = new OESStandardDerivatives();

class EXTsRGB {
    constructor() {
        this.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 33296;
        this.SRGB8_ALPHA8_EXT = 35907;
        this.SRGB_ALPHA_EXT = 35906;
        this.SRGB_EXT = 35904;
    }
    toString() {
        return '[object EXTsRGB]'
    }
}
const vEXTsRGB = new EXTsRGB();

class EXTFragDepth {
    constructor() {}
    toString() {
        return '[object EXTFragDepth]'
    }
}
const vEXTFragDepth = new EXTFragDepth();

class WebGLColorBufferFloat {
    constructor() {
        this.RGBA32F_EXT = 0x8814;
        this.RGB32F_EXT  = 0x8815;
        this.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 0x8211;
        this.UNSIGNED_NORMALIZED_EXT  = 0x8c17;
    }
    toString() {
        return '[object WebGLColorBufferFloat]'
    }
}
const vWebGLColorBufferFloat = new WebGLColorBufferFloat();

//

var extensionPrefixArr = ['MOZ_', 'WEBKIT_'];

var extensionMap = {
    WEBGL_compressed_texture_s3tc: vWebGLCompressedTextureS3TC,
    WEBGL_compressed_texture_pvrtc: vWebGLCompressedTexturePVRTC,
    WEBGL_compressed_texture_etc1: vWebGLCompressedTextureETC1,
    WEBGL_depth_texture: vWebGLDepthTexture,
    WEBGL_color_buffer_float: vWebGLColorBufferFloat,

    OES_element_index_uint: vOESElementIndexUint,
    OES_standard_derivatives: vOESStandardDerivatives,
    OES_texture_float: vOESTextureFloat,
    OES_texture_float_linear: vOESTextureFloatLinear,
    OES_texture_half_float: vOESTextureHalfFloat,
    OES_texture_half_float_linear: vOESTextureHalfFloatLinear,
    EXT_color_buffer_float: vEXTColorBufferFloat,
    EXT_color_buffer_half_float: vEXTColorBufferHalfFloat,
    EXT_sRGB: vEXTsRGB,
    EXT_frag_depth: vEXTFragDepth,
    // EXT_blend_minmax: vEXTBlendMinMax,
};

if (!gl._getSupportedExtensions) {
    gl._getSupportedExtensions = gl.getSupportedExtensions;
}

const GLEXT_TO_WEBGL_EXT = {
    GL_EXT_sRGB : "EXT_sRGB",
    GL_EXT_frag_depth : "EXT_frag_depth",
    GL_OES_element_index_uint : "OES_element_index_uint",
    GL_OES_standard_derivatives : "OES_standard_derivatives",
    GL_OES_depth_texture : "WEBGL_depth_texture",
    GL_OES_texture_half_float : "OES_texture_half_float",
    GL_OES_texture_half_float_linear : "OES_texture_half_float_linear",
    GL_OES_texture_float : "OES_texture_float",
    GL_OES_texture_float_linear : "OES_texture_float_linear",

    GL_EXT_color_buffer_float : "EXT_color_buffer_float",
    GL_EXT_color_buffer_half_float : "EXT_color_buffer_half_float",

    GL_EXT_texture_compression_s3tc : "WEBGL_compressed_texture_s3tc",
    GL_OES_compressed_ETC1_RGB8_texture : "WEBGL_compressed_texture_etc1",
    GL_IMG_texture_compression_pvrtc : "WEBGL_compressed_texture_pvrtc",
};

gl.getSupportedExtensions = function()
{
    var extensions = [];
    let supportedExtensions = gl._getSupportedExtensions();
    let found_GL_EXT_color_buffer_float = false
    supportedExtensions.forEach(function (ext) {
        let tmp = (ext in GLEXT_TO_WEBGL_EXT)? GLEXT_TO_WEBGL_EXT[ext] : ext;
        extensions.push(tmp);
        if (ext === 'GL_EXT_color_buffer_float') {
            extensions.push('WEBGL_color_buffer_float');
        }
    });

    return extensions;
};

var supportedExtensions = gl.getSupportedExtensions();

gl.getExtension = function(extension) {
    var prefix;
    for (var i = 0, len = extensionPrefixArr.length; i < len; ++i) {
        prefix = extensionPrefixArr[i];
        if (extension.startsWith(prefix)) {
            extension = extension.substring(prefix.length);
            break;
        }
    }

    if (supportedExtensions.indexOf(extension) > -1) {
        if (extension in extensionMap) {
            return extensionMap[extension];
        }
        return {};
    }

    return null;
};

} // if (needPatchLowerThan_3_1_0) {

})();
