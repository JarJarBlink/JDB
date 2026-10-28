/* @ts-self-types="./anim_wasm.d.ts" */

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
     * 加入一個通道。keyframes_flat: [frame, value, ease, param, ...]（未正規化的原始幀）
     *
     * 正規化（官方 normalizeKeyFrames）：
     *   loop != 1 或第一幀為負 → 整條軌道平移，讓第一個 keyframe 落在 frame 0，位移量記為 off。
     *   之後 fir = 第一幀、smax = 最後一幀。
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
     * 加入一個部位（依 mamodel 列順序呼叫，index = 呼叫順序）。
     * 參數就是 mamodel 一列的前 13 欄（原始整數）：
     *   parent, id, imageIndex, zIndex, x, y, pivotX, pivotY, scaleX, scaleY, angle, opacity, glow
     * @param {number} parent
     * @param {number} id
     * @param {number} image_index
     * @param {number} z_index
     * @param {number} x
     * @param {number} y
     * @param {number} pivot_x
     * @param {number} pivot_y
     * @param {number} scale_x
     * @param {number} scale_y
     * @param {number} angle
     * @param {number} opacity
     * @param {number} glow
     */
    add_sprite(parent, id, image_index, z_index, x, y, pivot_x, pivot_y, scale_x, scale_y, angle, opacity, glow) {
        wasm.animengine_add_sprite(this.__wbg_ptr, parent, id, image_index, z_index, x, y, pivot_x, pivot_y, scale_x, scale_y, angle, opacity, glow);
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
     * 計算第 anim_idx 動畫的第 frame 幀。frame 會對動畫總長取模並 floor（原生模式只在整數幀求值）。
     * @param {number} anim_idx
     * @param {number} frame
     */
    compute_frame(anim_idx, frame) {
        wasm.animengine_compute_frame(this.__wbg_ptr, anim_idx, frame);
    }
    /**
     * 標準的 in->loop 對應版本。
     *   looping = true  ：frame 對動畫總長 + 1 取模（與舊版 compute_frame 相同）
     *   looping = false ：frame 不取模（只播一次）；只有 loop == -1 的通道會折返
     * @param {number} anim_idx
     * @param {number} frame
     * @param {boolean} looping
     */
    compute_frame_ex(anim_idx, frame, looping) {
        wasm.animengine_compute_frame_ex(this.__wbg_ptr, anim_idx, frame, looping);
    }
    constructor() {
        const ret = wasm.animengine_new();
        this.__wbg_ptr = ret >>> 0;
        AnimEngineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 本幀的繪製封包（已依 zOrder 排序、已過濾不可見部位、blendMode 已解析）。
     * 每個封包 PACKET_STRIDE(15) 個 f32：
     *   [0] partIndex  [1] blendMode(0–3)  [2] opacity(0–1)
     *   [3..11) 四個頂點 (x0,y0, x1,y1, x2,y2, x3,y3)，順序 = 官方（左上、左下、右下、右上）
     *           座標已減去模型錨點，且 y 軸翻成「向上為正」（整數）
     *   [11..15) 該部位的 imgcut：x, y, w, h（UV 由 JS 以貼圖尺寸換算）
     * @returns {Float32Array}
     */
    read_draw_packets() {
        const ret = wasm.animengine_read_draw_packets(this.__wbg_ptr);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * 每個部位（依 mamodel 索引順序）佔 SPRITE_STRIDE(20) 個 f32：
     *   [0] parent  [1] id  [2] zIndex  [3] pos_x  [4] pos_y（矩陣平移，減去錨點、y 向上）
     *   [5] pivot_x [6] pivot_y  [7..11) imgcut x,y,w,h
     *   [11] opacity(0–1)  [12] glow  [13] scale_x  [14] scale_y（原生縮放 / scaleUnit，含 flip 符號）
     *   [15] angle（度，矩陣旋轉量）  [16] flip_x  [17] flip_y  [18] hidden(0/1)  [19] 保留
     * @returns {Float32Array}
     */
    read_sprites_output() {
        const ret = wasm.animengine_read_sprites_output(this.__wbg_ptr);
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * 模型錨點（官方 model.configs[0]）：enabled=false 表示沒有 config（錨點 = 0,0）
     * target = config[0]、x = config[2]、y = config[3]
     * @param {boolean} enabled
     * @param {number} target
     * @param {number} x
     * @param {number} y
     */
    set_anchor_config(enabled, target, x, y) {
        wasm.animengine_set_anchor_config(this.__wbg_ptr, enabled, target, x, y);
    }
    /**
     * 官方 options.facing（>= 0 為朝右，< 0 為朝左）
     * @param {number} facing
     */
    set_facing(facing) {
        wasm.animengine_set_facing(this.__wbg_ptr, facing);
    }
    /**
     * mamodel 的基準值：[scaleUnit, angleUnit, opacityUnit]
     * @param {number} scale
     * @param {number} rot
     * @param {number} opacity
     */
    set_max_values(scale, rot, opacity) {
        wasm.animengine_set_max_values(this.__wbg_ptr, scale, rot, opacity);
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
