'use strict';(function(){const FPS=30;const FRAME_MS=1000/FPS;const DATA_BASE='./static/js/anim/anim_data/';const FORM_ORDER=['f','c','s','u','1','2','3','4','5'];const FORM_LABELS={f:'1',c:'2',s:'3',u:'4',e:'1'};const ZOOM_MIN=0.05,ZOOM_MAX=20;const SPRITE_STRIDE=20;const SPRITE_POS_Y=4;const PACKET_STRIDE=15;const clampZoom=z=>Math.min(ZOOM_MAX,Math.max(ZOOM_MIN,z));const formRank=f=>{const i=FORM_ORDER.indexOf(f);return i===-1?999:i;};const sortForms=list=>list.slice().sort((a,b)=>formRank(a)-formRank(b));const worldToScreen=(wx,zoom)=>Math.floor(wx*(768/2400)*zoom);function multiplyMat3(a,b,out){const a00=a[0],a01=a[1],a02=a[2],a10=a[3],a11=a[4],a12=a[5],a20=a[6],a21=a[7],a22=a[8];const b00=b[0],b01=b[1],b02=b[2],b10=b[3],b11=b[4],b12=b[5],b20=b[6],b21=b[7],b22=b[8];out[0]=b00*a00+b01*a10+b02*a20;out[1]=b00*a01+b01*a11+b02*a21;out[2]=b00*a02+b01*a12+b02*a22;out[3]=b10*a00+b11*a10+b12*a20;out[4]=b10*a01+b11*a11+b12*a21;out[5]=b10*a02+b11*a12+b12*a22;out[6]=b20*a00+b21*a10+b22*a20;out[7]=b20*a01+b21*a11+b22*a21;out[8]=b20*a02+b21*a12+b22*a22;}
function downloadFile(blobOrUrl,filename){const isBlob=typeof blobOrUrl!=='string';const url=isBlob?URL.createObjectURL(blobOrUrl):blobOrUrl;const a=document.createElement('a');a.download=filename;a.href=url;document.body.appendChild(a);a.click();a.remove();if(isBlob)setTimeout(()=>URL.revokeObjectURL(url),60000);}
let wasmReady=false;let wasmError=null;const wasmWaiters=[];function whenWasmReady(){if(wasmReady)return Promise.resolve();if(wasmError)return Promise.reject(wasmError);return new Promise((resolve,reject)=>wasmWaiters.push({resolve,reject}));}
window.notifyWasmReady=function(){wasmReady=true;console.log('Wasm is ready');wasmWaiters.splice(0).forEach(w=>w.resolve());};window.notifyWasmFailed=function(err){wasmError=err instanceof Error?err:new Error(String(err));console.error('[anim_wasm] init failed',err);wasmWaiters.splice(0).forEach(w=>w.reject(wasmError));};async function fetchAnimData(url,extra){const res=await fetch(url);if(!res.ok)throw new Error(`Failed to load ${url}: ${res.status}`);const data=MessagePack.decode(new Uint8Array(await res.arrayBuffer()));if(data.image_bytes&&data.image_bytes.length){data.image_blob=new Blob([data.image_bytes],{type:'image/png'});}
delete data.image_bytes;return Object.assign(data,extra);}
const pad3=id=>String(id).padStart(3,'0');const fetchForm=(unitId,form)=>fetchAnimData(`${DATA_BASE}${pad3(unitId)}_${form}.mpk`,{form});const fetchSoul=soulId=>fetchAnimData(`${DATA_BASE}battle_soul_${pad3(soulId)}.mpk`,{form:'f',isSoul:true});const fetchKbHb=()=>fetchAnimData(`${DATA_BASE}kb_hb.mpk`,{isKbHb:true});function*iterChannels(anim){const data=anim&&anim.data;if(!data)return;for(let i=0;i<data.length;i++){const head=data[i];if(!head||head.length<5)continue;const countRow=data[i+1];if(!countRow)return;const count=countRow[0];const keys=[];for(let k=i+2;k<=i+1+count&&k<data.length;k++){const kf=data[k];if(!kf)break;keys.push(kf[0],kf[1],kf[2]??0,kf[3]??0);}
yield{part:head[0],mod:head[1],loop:head[2],keys:new Float64Array(keys)};i+=count+1;}}
class Unit{constructor(unitData){if(!wasmReady||!window.AnimEngine)throw new Error('[anim_wasm] Wasm engine is not ready');this.unitData=unitData;this.animIdx=0;this.frame=0;this.maxFrame=0;this.packets=null;this._engine=new window.AnimEngine();try{this.spriteCount=this._upload(unitData);}catch(e){this.destroy();throw e;}
this.setAnimation(0);}
setAnimation(idx){this.animIdx=idx;this.maxFrame=this._engine?this._engine.anim_max_frame(idx):0;this.showFrame(0);return this;}
showFrame(frame,animIdx=this.animIdx){const e=this._engine;if(!e)return;this.animIdx=animIdx;this.frame=frame;e.compute_frame(animIdx,frame);this.packets=e.read_draw_packets();}
getKbOffsetY(){if(!this._engine||this.spriteCount<2)return 0;return this._engine.read_sprites_output()[SPRITE_STRIDE+SPRITE_POS_Y];}
destroy(){if(this._engine){try{this._engine.free();}catch(e){console.warn('[anim_wasm] free failed',e);}
this._engine=null;}
this.packets=null;}
_upload(ud){const e=this._engine;const mm=ud.mamodel;const totalParts=mm[2][0];const[scaleU,angleU,opacityU]=mm[3+totalParts];const cfg=ud.isSoul?null:mm[3+totalParts+2];const anchor=cfg&&cfg.length>=4?cfg:null;e.set_max_values(scaleU,angleU,opacityU);e.set_anchor_config(!!anchor,anchor?anchor[0]:0,anchor?anchor[2]:0,anchor?anchor[3]:0);e.set_facing(1);e.clear_imgcut();for(const ic of ud.imgcut||[])e.add_imgcut(ic[0]||0,ic[1]||0,ic[2]||0,ic[3]||0);const rows=mm.filter(r=>r.length>=13);e.clear_sprites();for(const r of rows)e.add_sprite(...r.slice(0,13));e.clear_anims();(ud.maanim||[]).forEach((anim,ai)=>{e.begin_anim(ai);for(const ch of iterChannels(anim))e.add_channel(ai,ch.part,ch.mod,ch.loop,ch.keys);});return rows.length;}}
const GLSL_PRECISION=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif`;const BG_VS=`
attribute vec2 a_quad;
uniform mat3 u_transform;
uniform vec4 u_rect;   // x0, y0, w, h
uniform vec4 u_uv;     // u0, v0, du, dv
varying vec2 v_texcoord;
void main() {
    vec2 p = u_rect.xy + a_quad * u_rect.zw;
    gl_Position = vec4((u_transform * vec3(p, 1.0)).xy, 0.0, 1.0);
    v_texcoord = u_uv.xy + a_quad * u_uv.zw;
}`;const BG_FS=GLSL_PRECISION+`
uniform sampler2D u_texture;
varying vec2 v_texcoord;
void main() { gl_FragColor = texture2D(u_texture, v_texcoord); }`;const SPRITE_VS=`
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute float a_opacity;
uniform mat3 u_transform;
varying vec2 v_uv;
varying float v_opacity;
void main() {
    gl_Position = vec4((u_transform * vec3(a_pos, 1.0)).xy, 0.0, 1.0);
    v_uv = a_uv;
    v_opacity = a_opacity;
}`;const SPRITE_FS=GLSL_PRECISION+`
uniform sampler2D u_texture;
varying vec2 v_uv;
varying float v_opacity;
void main() { gl_FragColor = texture2D(u_texture, v_uv) * v_opacity; }`;class Renderer{constructor(canvas){this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false,depth:false,stencil:false,});if(!this.gl)throw new Error('WebGL not supported');this.lost=false;this.onRestore=null;this._init();canvas.addEventListener('webglcontextlost',(e)=>{e.preventDefault();this.lost=true;console.warn('[renderer] WebGL context lost');});canvas.addEventListener('webglcontextrestored',()=>{console.warn('[renderer] WebGL context restored');this._init();this.lost=false;if(this.onRestore)this.onRestore();});}
get maxTextureSize(){return this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);}
_init(){const gl=this.gl;gl.enable(gl.BLEND);this.bgProg=this._mkProg(BG_VS,BG_FS);this.bg={quad:gl.getAttribLocation(this.bgProg,'a_quad'),transform:gl.getUniformLocation(this.bgProg,'u_transform'),rect:gl.getUniformLocation(this.bgProg,'u_rect'),uv:gl.getUniformLocation(this.bgProg,'u_uv'),};this.quadBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.quadBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,1]),gl.STATIC_DRAW);this.spriteProg=this._mkProg(SPRITE_VS,SPRITE_FS);this.sp={pos:gl.getAttribLocation(this.spriteProg,'a_pos'),uv:gl.getAttribLocation(this.spriteProg,'a_uv'),opacity:gl.getAttribLocation(this.spriteProg,'a_opacity'),transform:gl.getUniformLocation(this.spriteProg,'u_transform'),texture:gl.getUniformLocation(this.spriteProg,'u_texture'),};this.spriteVBuf=gl.createBuffer();this.spriteIBuf=gl.createBuffer();this._spriteCap=0;this._spriteV=new Float32Array(0);}
_mkProg(vs,fs){const gl=this.gl,p=gl.createProgram();const compile=(type,src)=>{const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))console.error('Shader compile error:',gl.getShaderInfoLog(sh));return sh;};const v=compile(gl.VERTEX_SHADER,vs),f=compile(gl.FRAGMENT_SHADER,fs);gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))console.error('Shader link error:',gl.getProgramInfoLog(p));gl.deleteShader(v);gl.deleteShader(f);return p;}
_ensureSpriteCapacity(count){if(count<=this._spriteCap)return;if(count*4>0xffff)throw new Error('[renderer] 單次繪製的部位數超過上限');const gl=this.gl;let cap=Math.max(16,this._spriteCap);while(cap<count)cap*=2;this._spriteCap=cap;this._spriteV=new Float32Array(cap*20);const idx=new Uint16Array(cap*6);for(let i=0;i<cap;i++){const v=i*4,o=i*6;idx[o]=v;idx[o+1]=v+1;idx[o+2]=v+2;idx[o+3]=v;idx[o+4]=v+2;idx[o+5]=v+3;}
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.spriteIBuf);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idx,gl.STATIC_DRAW);}
_setBlendMode(mode){const gl=this.gl;if(mode===1)gl.blendFunc(gl.ONE,gl.ONE);else if(mode===2)gl.blendFunc(gl.DST_COLOR,gl.ZERO);else if(mode===3)gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_COLOR);else gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);}
uploadTexture(img){const gl=this.gl,tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);return{texture:tex,width:img.width,height:img.height};}
deleteTexture(texInfo){if(texInfo&&texInfo.texture&&!this.lost)this.gl.deleteTexture(texInfo.texture);}
clear(r,g,b,a){const gl=this.gl;gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(r,g,b,a);gl.clear(gl.COLOR_BUFFER_BIT);}
drawBackground(texInfo,unitConvert){const gl=this.gl,L=this.bg;gl.useProgram(this.bgProg);gl.bindBuffer(gl.ARRAY_BUFFER,this.quadBuf);gl.enableVertexAttribArray(L.quad);gl.vertexAttribPointer(L.quad,2,gl.FLOAT,false,0,0);gl.bindTexture(gl.TEXTURE_2D,texInfo.texture);gl.uniformMatrix3fv(L.transform,false,unitConvert);gl.blendFunc(gl.ONE,gl.ZERO);gl.uniform4f(L.rect,-texInfo.width/2,texInfo.height/2,texInfo.width,-texInfo.height);gl.uniform4f(L.uv,0,0,1,1);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
drawPackets(texInfo,baseMatrix,pk,count){if(count<=0)return;const gl=this.gl;this._ensureSpriteCapacity(count);const v=this._spriteV;const W=texInfo.width,H=texInfo.height;for(let i=0;i<count;i++){const s=i*PACKET_STRIDE,d=i*20;const u0=pk[s+11]/W,v0=pk[s+12]/H;const u1=(pk[s+11]+pk[s+13])/W,v1=(pk[s+12]+pk[s+14])/H;const op=pk[s+2];v[d]=pk[s+3];v[d+1]=pk[s+4];v[d+2]=u0;v[d+3]=v0;v[d+4]=op;v[d+5]=pk[s+5];v[d+6]=pk[s+6];v[d+7]=u0;v[d+8]=v1;v[d+9]=op;v[d+10]=pk[s+7];v[d+11]=pk[s+8];v[d+12]=u1;v[d+13]=v1;v[d+14]=op;v[d+15]=pk[s+9];v[d+16]=pk[s+10];v[d+17]=u1;v[d+18]=v0;v[d+19]=op;}
const L=this.sp;gl.useProgram(this.spriteProg);gl.uniformMatrix3fv(L.transform,false,baseMatrix);gl.uniform1i(L.texture,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texInfo.texture);gl.bindBuffer(gl.ARRAY_BUFFER,this.spriteVBuf);gl.bufferData(gl.ARRAY_BUFFER,v.subarray(0,count*20),gl.DYNAMIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.spriteIBuf);gl.enableVertexAttribArray(L.pos);gl.vertexAttribPointer(L.pos,2,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(L.uv);gl.vertexAttribPointer(L.uv,2,gl.FLOAT,false,20,8);gl.enableVertexAttribArray(L.opacity);gl.vertexAttribPointer(L.opacity,1,gl.FLOAT,false,20,16);let runStart=0;let runMode=pk[1];for(let i=1;i<=count;i++){const mode=i<count?pk[i*PACKET_STRIDE+1]:-1;if(mode===runMode)continue;this._setBlendMode(runMode);gl.drawElements(gl.TRIANGLES,(i-runStart)*6,gl.UNSIGNED_SHORT,runStart*6*2);runStart=i;runMode=mode;}
gl.disableVertexAttribArray(L.pos);gl.disableVertexAttribArray(L.uv);gl.disableVertexAttribArray(L.opacity);}}
window.Anim={FPS,FRAME_MS,FORM_ORDER,FORM_LABELS,PACKET_STRIDE,clampZoom,sortForms,worldToScreen,multiplyMat3,downloadFile,whenWasmReady,isWasmReady:()=>wasmReady,fetchForm,fetchSoul,fetchKbHb,Unit,Renderer,};window.Unit=Unit;})();