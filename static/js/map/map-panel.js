export function initFloatingPanel({gCC,isDojo}={}){const jumpHtml=`
        <style>
            #stage-jump-input::-webkit-outer-spin-button,
            #stage-jump-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            #stage-jump-input { -moz-appearance: textfield; }

            #stage-jump-wrap {
                position: fixed;
                bottom: 80px;
                right: 0;
                z-index: 9999;
                display: flex;
                flex-direction: row;
                align-items: stretch;
                overflow: visible;
            }

            /* ── 抽屜面板 ── */
            #stage-jump-panel {
                display: flex;
                flex-direction: column;
                gap: 0;
                border-right: none;
                border-radius: 8px 0 0 8px;
                width: 0;
                overflow: hidden;
                transition: width 0.22s ease, padding 0.22s ease;
                white-space: nowrap;
                border-width: 0;
                border-style: solid;
            }

            /* ── 各區塊 ── */
            .sjump-section {
                padding: 8px 12px;
            }
            .sjump-section + .sjump-section {
                border-top-width: 1px;
                border-top-style: solid;
            }
            .sjump-section-title {
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.06em;
                margin-bottom: 6px;
                opacity: 0.55;
                text-transform: uppercase;
            }

            /* ── 欄位 toggle chips ── */
            .col-toggle-row {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            .col-chip {
                font-size: 11px;
                padding: 2px 7px;
                border-radius: 10px;
                cursor: pointer;
                border-width: 1px;
                border-style: solid;
                transition: opacity 0.15s, background 0.15s;
                user-select: none;
            }
            .col-chip.hidden-col {
                opacity: 0.35;
                text-decoration: line-through;
            }

            /* ── 快轉區 ── */
            .sjump-jump-row {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 5px;
            }
            #stage-jump-input {
                width: 60px;
                flex-shrink: 0;
                padding: 5px 6px;
                font-size: 14px;
                border-radius: 6px;
                text-align: center;
                outline: none;
                border-width: 1px;
                border-style: solid;
            }
            #stage-jump-go {
                flex-shrink: 0;
                padding: 5px 11px;
                font-size: 13px;
                font-weight: 600;
                border-radius: 6px;
                border-width: 1px;
                border-style: solid;
                cursor: pointer;
                transition: background 0.12s;
                letter-spacing: 0.04em;
            }

            /* ── tab ── */
            #stage-jump-tab {
                width: 14px;
                min-height: 36px;
                align-self: center;
                border-right: none;
                border-radius: 5px 0 0 5px;
                cursor: pointer;
                transition: background 0.12s;
                flex-shrink: 0;
                border-width: 1px;
                border-style: solid;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #stage-jump-tab::before {
                content: '‹';
                font-size: 12px;
                opacity: 0.6;
                transition: transform 0.22s;
            }
            #stage-jump-wrap.panel-open #stage-jump-tab::before {
                transform: rotate(180deg);
            }

            /* ── Dark theme ── */
            #stage-jump-wrap.sjump-dark #stage-jump-panel {
                background: #2c303d;
                border-color: #373b3e;
                box-shadow: -3px 2px 10px rgba(0,0,0,0.5);
                color: rgb(220,220,220);
            }
            #stage-jump-wrap.sjump-dark .sjump-section + .sjump-section {
                border-top-color: #3d4250;
            }
            #stage-jump-wrap.sjump-dark .col-chip {
                background: #3a3f50;
                border-color: #4a5060;
                color: rgb(220,220,220);
            }
            #stage-jump-wrap.sjump-dark .col-chip:hover { background: #454b60 !important; }
            #stage-jump-wrap.sjump-dark #stage-jump-input {
                background: rgb(20,20,20);
                border-color: #464b4f;
                color: rgb(227,227,227);
            }
            #stage-jump-wrap.sjump-dark #stage-jump-input::placeholder { color: #555; }
            #stage-jump-wrap.sjump-dark #stage-jump-input:focus {
                border-color: #666 !important;
                background: #111 !important;
            }
            #stage-jump-wrap.sjump-dark #stage-jump-go {
                background: rgb(40,40,40);
                border-color: #464b4f;
                color: rgba(227,227,227,0.95);
            }
            #stage-jump-wrap.sjump-dark #stage-jump-go:hover  { background: #333 !important; }
            #stage-jump-wrap.sjump-dark #stage-jump-go:active { background: #1a1a1a !important; }
            #stage-jump-wrap.sjump-dark #stage-jump-tab {
                background: #2c303d;
                border-color: #373b3e;
                box-shadow: -2px 1px 6px rgba(0,0,0,0.4);
            }
            #stage-jump-wrap.sjump-dark #stage-jump-tab:hover  { background: #3a3f50 !important; }
            #stage-jump-wrap.sjump-dark #stage-jump-tab:active { background: #232733 !important; }

            /* ── Light theme ── */
            #stage-jump-wrap.sjump-light #stage-jump-panel {
                background: #FFF8E8;
                border-color: #C8A060;
                box-shadow: -3px 2px 10px rgba(0,0,0,0.15);
                color: rgb(20,20,20);
            }
            #stage-jump-wrap.sjump-light .sjump-section + .sjump-section {
                border-top-color: #ccc;
            }
            #stage-jump-wrap.sjump-light .col-chip {
                background: #FFF0CC;
                border-color: #C8A060;
                color: rgb(20,20,20);
            }
            #stage-jump-wrap.sjump-light .col-chip:hover { background: #FFE8AA !important; }
            #stage-jump-wrap.sjump-light #stage-jump-input {
                background: #FFE8AA;
                border-color: #C8A060;
                color: rgb(15,15,15);
            }
            /*#stage-jump-wrap.sjump-light #stage-jump-input::placeholder { color: #C8A060; }*/
         
            #stage-jump-wrap.sjump-light #stage-jump-input:focus {
                border-color: #FFE8AA !important;
                background: #fff !important;
            }
            #stage-jump-wrap.sjump-light #stage-jump-go {
                background: #FFF0CC;
                border-color: #C8A060;
                color: rgb(15,15,15);
            }
            #stage-jump-wrap.sjump-light #stage-jump-go:hover  { background: #FFE8AA !important; }
            #stage-jump-wrap.sjump-light #stage-jump-go:active { background: #FFE8AA !important; }
            #stage-jump-wrap.sjump-light #stage-jump-tab {
                background: #FFF0CC;
                border-color: #C8A060;
                box-shadow: -2px 1px 6px rgba(0,0,0,0.15);
            }
            #stage-jump-wrap.sjump-light #stage-jump-tab:hover  { background: #FFE8AA !important; }
            #stage-jump-wrap.sjump-light #stage-jump-tab:active { background: #FFE8AA !important; }

            @media (max-width: 480px) {
                #stage-jump-wrap { bottom: 60px !important; }
            }
        </style>

        <div id="stage-jump-wrap">
            <div id="stage-jump-panel">

                <!-- 區塊一：欄位顯示 -->
                <div class="sjump-section">
                    <div class="sjump-section-title" id="col-section-title">欄位顯示</div>
                    <div class="col-toggle-row" id="col-toggle-row"></div>
                </div>

                <!-- 區塊二：快轉 -->
                <div class="sjump-section">
                    <div class="sjump-section-title" id="jump-section-title">快轉</div>
                    <div class="sjump-jump-row">
                        <input id="stage-jump-input" type="number" min="1" inputmode="numeric" pattern="[0-9]*"
                            placeholder="Stage #" />
                        <button id="stage-jump-go">GO</button>
                    </div>
                </div>

            </div>
            <div id="stage-jump-tab"></div>
        </div>
    `;$('body').append(jumpHtml);const COL_LABELS={enemy:{tw:'敵人',ja:'敵',kr:'적',en:'Enemy'},multi:{tw:'倍率',ja:'倍率',kr:'배율',en:'Mult.'},amount:{tw:'數量',ja:'出現数',kr:'출현 수',en:'Amount'},castle:{tw:isDojo?'傷害累積':'城連動',ja:isDojo?'ダメージ累積':'城連動',kr:isDojo?'대미지 누적':'성 연동',en:isDojo?'Dmg Accum.':'Castle',},start:{tw:'初生成',ja:'初登場',kr:'첫 등장',en:'Start'},respawn:{tw:'再生成',ja:'再生産',kr:'재생산',en:'Respawn'},layer:{tw:'圖層數',ja:'レイヤー',kr:'레이어',en:'Layer'},score:{tw:'分數',ja:'基礎点',kr:'기본 점수',en:'Score'},count:{tw:'魂召喚',ja:'キル数',kr:'처치 수',en:'Count'},};const COL_SECTION_TITLE={tw:'欄位顯示',ja:'列表示',kr:'열 표시',en:'Columns'};const COL_JUMP_TITLE={tw:'快轉',ja:'ジャンプ',kr:'점프',en:'Jump'};const ccKey=['tw','ja','kr'].includes(gCC)?gCC:'en';$('#col-section-title').text(COL_SECTION_TITLE[ccKey]);$('#jump-section-title').text(COL_JUMP_TITLE[ccKey]);const COL_KEYS=['enemy','multi','amount','castle','start','respawn','layer','score','count'];const COL_STORAGE_KEY='map_hidden_cols';let hiddenCols=new Set(JSON.parse(localStorage.getItem(COL_STORAGE_KEY)||'[]'));const $colStyle=$('<style id="col-visibility-style"></style>').appendTo('head');function applyColVisibility(){const rules=[...hiddenCols].map(col=>`[data-col="${col}"] { display: none !important; }`).join('\n');$colStyle.text(rules);localStorage.setItem(COL_STORAGE_KEY,JSON.stringify([...hiddenCols]));}
COL_KEYS.forEach(key=>{const label=(COL_LABELS[key]??{})[ccKey]??key;const $chip=$(`<span class="col-chip" data-col-key="${key}">${label}</span>`);if(hiddenCols.has(key))$chip.addClass('hidden-col');$chip.on('click',function(){if(hiddenCols.has(key)){hiddenCols.delete(key);$chip.removeClass('hidden-col');}else{hiddenCols.add(key);$chip.addClass('hidden-col');}
applyColVisibility();});$('#col-toggle-row').append($chip);});applyColVisibility();function applyJumpTheme(mode){$('#stage-jump-wrap, #stage-select-wrap').toggleClass('sjump-dark',mode==='dark').toggleClass('sjump-light',mode==='light');}
function getCurrentMode(){return document.documentElement.classList.contains('dark')?'dark':'light';}
applyJumpTheme(getCurrentMode());document.addEventListener('colorschemechange',(e)=>{const s=e.detail&&e.detail.colorScheme;if(s==='dark'||s==='light')applyJumpTheme(s);});let jumpOpen=false;function openJump(){jumpOpen=true;$('#stage-jump-wrap').addClass('panel-open');$('#stage-jump-panel').css({width:'200px',borderWidth:'1px'});}
function closeJump(){jumpOpen=false;$('#stage-jump-wrap').removeClass('panel-open');$('#stage-jump-panel').css({width:'0',borderWidth:'0'});}
$(document).on('click','#stage-jump-tab',function(e){e.stopPropagation();jumpOpen?closeJump():openJump();});$(document).on('click',function(e){if(jumpOpen&&!$(e.target).closest('#stage-jump-wrap').length){closeJump();}});function jumpToStage(){const val=parseInt($('#stage-jump-input').val());if(isNaN(val)||val<1)return;const total=window.allLoadedStages?window.allLoadedStages.length:0;const $target=$(`#stage-${Math.min(val, total)}`);if($target.length){$target[0].scrollIntoView({behavior:'smooth',block:'start'});}
$('#stage-jump-input').val('');closeJump();}
$(document).on('click','#stage-jump-go',jumpToStage);$(document).on('keydown','#stage-jump-input',function(e){if(e.key==='Enter')jumpToStage();if(e.key==='Escape')closeJump();});}