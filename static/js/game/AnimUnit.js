'use strict';
import init, { WasmAnimUnit } from './anim_unit_wasm.js';

let _wasmReady = false;

export class AnimUnit {
    /**
     * @param {string} [wasmUrl]
     */
    static async init(wasmUrl) {
        if (_wasmReady) return;
        await init({ module_or_path: wasmUrl }); 
        _wasmReady = true;
    }

    constructor(unitData) {
        if (!_wasmReady) {
            throw new Error('[AnimUnit] WASM 尚未初始化，請先呼叫 await AnimUnit.init()');
        }

        this.unitData = unitData;

        // null / NaN / 字串 → 0，遞迴處理巢狀陣列
        function cleanNulls(v) {
            if (Array.isArray(v)) return v.map(cleanNulls);
            if (typeof v === 'number' && !isNaN(v)) return v;
            return 0;
        }

        const mm = unitData.mamodel ?? [];
        const payload = {
            imgcut:  (unitData.imgcut  ?? []).map(cleanNulls),
            mamodel: mm.map(r => Array.isArray(r) ? r.map(v => (typeof v === 'number' && !isNaN(v)) ? v : 0) : []),
            maanim:  (unitData.maanim ?? []).map(anim => {
                if (!anim) return null;
                return {
                    ...anim,
                    data: anim.data
                        ? anim.data.map(row => Array.isArray(row) ? cleanNulls(row) : [])
                        : null,
                };
            }),
            is_soul: unitData.isSoul  ?? false,
        };

        this._inner = new WasmAnimUnit(JSON.stringify(payload));
        this._sprites = this._parseSprites();
    }

    /** @param {number} idx */
    setAnimation(idx) {
        this._inner.setAnimation(idx);
        this._sprites = this._parseSprites();
        return this;
    }

    /** @param {number} f */
    showFrame(f) {
        this._inner.showFrame(f);
        this._sprites = this._parseSprites();
        return this;
    }

    /** @returns {number} */
    getMaxFrame() {
        return this._inner.getMaxFrame();
    }

    /** @returns {number|null} */
    get animType() {
        const t = this._inner.getAnimType();
        return t === null ? null : t;
    }

    /** @returns {Array<object>}  */
    get spritesNow() {
        return this._sprites;
    }

    destroy() {
        if (this._inner) {
            this._inner.destroy();
            this._inner.free?.();
            this._inner = null;
        }
        this._sprites = null;
    }

    getFinalOpacity(id) { return this._inner.getFinalOpacity(id); }
    getFinalAngle(id)   { return this._inner.getFinalAngle(id); }
    getFinalScaleX(id)  { return this._inner.getFinalScaleX(id); }
    getFinalScaleY(id)  { return this._inner.getFinalScaleY(id); }
    getFinalFlipX(id)   { return this._inner.getFinalFlipX(id); }
    getFinalFlipY(id)   { return this._inner.getFinalFlipY(id); }

    removeBasePivot() {
        this._inner.removeBasePivot();
        this._sprites = this._parseSprites();
        return this;
    }

    /* ── 內部 ── */
    _parseSprites() {
        const raw = JSON.parse(this._inner.getSpritesJson());
        return raw.map(s => ({
            id:           s.id,
            parent:       s.parent,
            z:            s.z,
            x:            s.x,
            y:            s.y,
            pivotX:       s.pivotX,
            pivotY:       s.pivotY,
            scaleX:       s.scaleX,
            scaleY:       s.scaleY,
            angle:        s.angle,
            opacity:      s.opacity,
            glow:         s.glow,
            spriteX:      s.spriteX,
            spriteY:      s.spriteY,
            spriteWidth:  s.spriteWidth,
            spriteHeight: s.spriteHeight,
            flipX:        s.flipX,
            flipY:        s.flipY,
            posX:         s.posX,
            posY:         s.posY,
            hidden:       s.hidden,
        }));
    }
}

window.AnimUnit = AnimUnit;
