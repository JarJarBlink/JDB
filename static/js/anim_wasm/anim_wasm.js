
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
     * @param {Float64Array} keyframes_flat
     */
    add_channel(anim_idx, part_id, mod_type, loop_type, keyframes_flat) {
        const ptr0 = passArrayF64ToWasm0(keyframes_flat, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.animengine_add_channel(this.__wbg_ptr, anim_idx, part_id, mod_type, loop_type, ptr0, len0);
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
     * 第 anim_idx 個動畫的最大幀數（官方 maxFrame，至少 1）；索引不存在時回傳 0
     * @param {number} anim_idx
     * @returns {number}
     */
    anim_max_frame(anim_idx) {
        const ret = wasm.animengine_anim_max_frame(this.__wbg_ptr, anim_idx);
        return ret;
    }
    /**
     * 開始定義第 anim_idx 個動畫（若不存在則 push 新的）
     * @param {number} anim_idx
     */
    begin_anim(anim_idx) {
        wasm.animengine_begin_anim(this.__wbg_ptr, anim_idx);
    }
    /**
     * 清除所有動畫資料
     */
    clear_anims() {
        wasm.animengine_clear_anims(this.__wbg_ptr);
    }
    /**
     * 清除並重設 imgcut 表
     */
    clear_imgcut() {
        wasm.animengine_clear_imgcut(this.__wbg_ptr);
    }
    /**
     * 清除並重設 sprites
     */
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
     * 建立新引擎實例
     */
    constructor() {
        const ret = wasm.animengine_new();
        this.__wbg_ptr = ret >>> 0;
        AnimEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 回傳完整的 sprite 輸出資料（wasm-bindgen 會一次 memcpy 成 JS Float32Array）
     * 每個 sprite 佔 20 個 f32：
     *   [0] parent  [1] id     [2] z
     *   [3] pos_x   [4] pos_y
     *   [5] pivot_x [6] pivot_y
     *   [7] sprite_x [8] sprite_y [9] sprite_w [10] sprite_h
     *   [11] opacity_acc [12] glow
     *   [13] scale_x_acc [14] scale_y_acc
     *   [15] angle_acc
     *   [16] flip_x_acc  [17] flip_y_acc
     *   [18] hidden (0/1) [19] reserved
     * 必須在 compute_frame 之後呼叫（acc 由 update_positions 填入）。
     * @returns {Float32Array}
     */
    read_sprites_output() {
        const ret = wasm.animengine_read_sprites_output(this.__wbg_ptr);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * 設定 maxValues = [scaleMax, rotMax, opacityMax]
     * @param {number} scale
     * @param {number} rot
     * @param {number} opacity
     */
    set_max_values(scale, rot, opacity) {
        wasm.animengine_set_max_values(this.__wbg_ptr, scale, rot, opacity);
    }
    /**
     * 設定原點偏移（對應 _updateSprites 裡的 ox/oy 計算）
     * @param {number} ox
     * @param {number} oy
     */
    set_origin_offset(ox, oy) {
        wasm.animengine_set_origin_offset(this.__wbg_ptr, ox, oy);
    }
    /**
     * 回傳 sprites_now 的數量
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
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
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

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

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

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
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

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
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
