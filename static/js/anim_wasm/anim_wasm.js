
export class AnimEngine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AnimEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_animengine_free(ptr, 0);
    }
    /**
     * @param {number} anim_idx
     * @param {number} part_id
     * @param {number} mod_type
     * @param {number} loop_type
     * @param {number} off
     * @param {number} fir
     * @param {number} smax
     * @param {Float64Array} keyframes_flat
     */
    add_channel(anim_idx, part_id, mod_type, loop_type, off, fir, smax, keyframes_flat) {
        const ptr0 = passArrayF64ToWasm0(keyframes_flat, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.animengine_add_channel(this.__wbg_ptr, anim_idx, part_id, mod_type, loop_type, off, fir, smax, ptr0, len0);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    add_imgcut(x, y, w, h) {
        wasm.animengine_add_imgcut(this.__wbg_ptr, x, y, w, h);
    }
    /**
     * @param {number} id
     * @param {number} parent
     * @param {number} z
     * @param {number} x
     * @param {number} y
     * @param {number} pivot_x
     * @param {number} pivot_y
     * @param {number} scale_x
     * @param {number} scale_y
     * @param {number} angle
     * @param {number} opacity
     * @param {number} glow
     * @param {number} sprite_x
     * @param {number} sprite_y
     * @param {number} sprite_width
     * @param {number} sprite_height
     */
    add_sprite(id, parent, z, x, y, pivot_x, pivot_y, scale_x, scale_y, angle, opacity, glow, sprite_x, sprite_y, sprite_width, sprite_height) {
        wasm.animengine_add_sprite(this.__wbg_ptr, id, parent, z, x, y, pivot_x, pivot_y, scale_x, scale_y, angle, opacity, glow, sprite_x, sprite_y, sprite_width, sprite_height);
    }
    /**
     * @param {number} anim_idx
     */
    begin_anim(anim_idx) {
        wasm.animengine_begin_anim(this.__wbg_ptr, anim_idx);
    }
    clear_anims() {
        wasm.animengine_clear_anims(this.__wbg_ptr);
    }
    clear_imgcut() {
        wasm.animengine_clear_imgcut(this.__wbg_ptr);
    }
    clear_sprites() {
        wasm.animengine_clear_sprites(this.__wbg_ptr);
    }
    /**
     * @param {number} anim_idx
     * @param {number} frame
     */
    compute_frame(anim_idx, frame) {
        wasm.animengine_compute_frame(this.__wbg_ptr, anim_idx, frame);
    }
    /**
     * @param {Float32Array} a_js
     * @param {Float32Array} b_js
     * @returns {Float32Array}
     */
    multiply_mat3_js(a_js, b_js) {
        const ret = wasm.animengine_multiply_mat3_js(this.__wbg_ptr, a_js, b_js);
        return ret;
    }
    constructor() {
        const ret = wasm.animengine_new();
        this.__wbg_ptr = ret >>> 0;
        AnimEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Float32Array}
     */
    read_sprites_output() {
        const ret = wasm.animengine_read_sprites_output(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} scale
     * @param {number} rot
     * @param {number} opacity
     */
    set_max_values(scale, rot, opacity) {
        wasm.animengine_set_max_values(this.__wbg_ptr, scale, rot, opacity);
    }
    /**
     * @param {number} ox
     * @param {number} oy
     */
    set_origin_offset(ox, oy) {
        wasm.animengine_set_origin_offset(this.__wbg_ptr, ox, oy);
    }
    /**
     * @returns {number}
     */
    sprite_count() {
        const ret = wasm.animengine_sprite_count(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) AnimEngine.prototype[Symbol.dispose] = AnimEngine.prototype.free;

export function wasm_init() {
    wasm.wasm_init();
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_6ddd609b62940d55: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_get_index_03c5ff6f16397dda: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_new_with_length_81c1c31d4432cb9f: function(arg0) {
            const ret = new Float32Array(arg0 >>> 0);
            return ret;
        },
        __wbg_set_index_f66997fc93f75edc: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./anim_wasm_bg.js": import0,
    };
}

const AnimEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_animengine_free(ptr >>> 0, 1));

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('anim_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
