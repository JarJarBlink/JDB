/* @ts-self-types="./anim_unit_wasm.d.ts" */

export class WasmAnimUnit {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmAnimUnitFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmanimunit_free(ptr, 0);
    }
    /**
     * 對應 destroy()（wasm-bindgen 自動 drop，但保留語意介面）
     */
    destroy() {
        wasm.wasmanimunit_destroy(this.__wbg_ptr);
    }
    /**
     * 對應 get animType
     * @returns {any}
     */
    getAnimType() {
        const ret = wasm.wasmanimunit_getAnimType(this.__wbg_ptr);
        return ret;
    }
    /**
     * 對應 getFinalAngle(id)
     * @param {number} id
     * @returns {number}
     */
    getFinalAngle(id) {
        const ret = wasm.wasmanimunit_getFinalAngle(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * 對應 getFinalFlipX(id)
     * @param {number} id
     * @returns {number}
     */
    getFinalFlipX(id) {
        const ret = wasm.wasmanimunit_getFinalFlipX(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * 對應 getFinalFlipY(id)
     * @param {number} id
     * @returns {number}
     */
    getFinalFlipY(id) {
        const ret = wasm.wasmanimunit_getFinalFlipY(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * 對應 getFinalOpacity(id)
     * @param {number} id
     * @returns {number}
     */
    getFinalOpacity(id) {
        const ret = wasm.wasmanimunit_getFinalOpacity(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * 對應 getFinalScaleX(id)
     * @param {number} id
     * @returns {number}
     */
    getFinalScaleX(id) {
        const ret = wasm.wasmanimunit_getFinalScaleX(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * 對應 getFinalScaleY(id)
     * @param {number} id
     * @returns {number}
     */
    getFinalScaleY(id) {
        const ret = wasm.wasmanimunit_getFinalScaleY(this.__wbg_ptr, id);
        return ret;
    }
    /**
     * 對應 getMaxFrame()
     * @returns {number}
     */
    getMaxFrame() {
        const ret = wasm.wasmanimunit_getMaxFrame(this.__wbg_ptr);
        return ret;
    }
    /**
     * 對應 get spritesNow → 回傳 JSON 字串，JS 側解析
     * @returns {string}
     */
    getSpritesJson() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmanimunit_getSpritesJson(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 從 JSON 字串建立 WasmAnimUnit
     * JSON 格式與 JS 中 unitData 相同：{ imgcut, mamodel, maanim, isSoul }
     * @param {string} unit_data_json
     */
    constructor(unit_data_json) {
        const ptr0 = passStringToWasm0(unit_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmanimunit_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0];
        WasmAnimUnitFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 對應 removeBasePivot()
     */
    removeBasePivot() {
        wasm.wasmanimunit_removeBasePivot(this.__wbg_ptr);
    }
    /**
     * 對應 setAnimation(idx)
     * @param {number} idx
     */
    setAnimation(idx) {
        wasm.wasmanimunit_setAnimation(this.__wbg_ptr, idx);
    }
    /**
     * 對應 showFrame(f)
     * @param {number} f
     */
    showFrame(f) {
        wasm.wasmanimunit_showFrame(this.__wbg_ptr, f);
    }
}
if (Symbol.dispose) WasmAnimUnit.prototype[Symbol.dispose] = WasmAnimUnit.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
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
        "./anim_unit_wasm_bg.js": import0,
    };
}

const WasmAnimUnitFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmanimunit_free(ptr, 1));

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
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

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
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

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
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
        module_or_path = new URL('anim_unit_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
