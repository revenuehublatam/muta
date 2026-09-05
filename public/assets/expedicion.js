(function(){
"use strict";
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var addEnergy=API.addEnergy||function(){};
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};
var VPC=API.VPC||function(){return innerWidth<=720?"mobile":"desktop"};
var G=Number(API.generation)||36;
var GEN=API.GEN||"GEN-0000";
var KEY="muta_expedicion_g36";
var root=null,lastFocus=null,openedAt=0,selected="cronica";
var state={stamps:[],pending:null,departed:[]};
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&Array.isArray(saved.stamps)){state.stamps=saved.stamps;state.pending=saved.pending||null;state.departed=Array.isArray(saved.departed)?saved.departed:[]}}catch(e){}

var WORLDS=[
  {id:"cronica",launch:"rpg",icon:"⚔",kicker:"AVENTURA",title:"La Crónica",color:"#ff8f70",gene:"GEN-0866 «Rebelde»",mission:"Explora la biblioteca, lee la intención del enemigo y gana un combate por turnos.",why:"La visita no técnica de Gen 35 venció cuatro combates y un jefe antes de seguir viajando."},
  {id:"maquina",launch:"maquina",icon:"✦",kicker:"INGENIO",title:"La Máquina Increíble",color:"#dfff72",gene:"GEN-3BAE «Fosforescente»",mission:"Coloca piezas, prueba el flujo y lleva la estrella desde A hasta B.",why:"La misma visita construyó, retiró y volvió a colocar piezas: decisiones, no toques vacíos."},
  {id:"laberinto",launch:"laberinto",icon:"◆",kicker:"REFLEJOS",title:"El Laberinto Estelar",color:"#77d8ff",gene:"GEN-0866 «Rebelde»",mission:"Guía al León, recoge fragmentos y decide cuándo arriesgar la cola de cometa.",why:"La ruta real terminó probando también Reactor, Snake y Laberinto; el archivo produjo profundidad."}
];
function world(id){for(var i=0;i<WORLDS.length;i++)if(WORLDS[i].id===id)return WORLDS[i];return WORLDS[0]}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function inputType(e){return e&&e.detail===0?"keyboard":"button"}
function capture(action,extra){var p={action:action,generation:G,experience_id:"expedicion-mundos-36",mode:"world-route",input_type:"button",viewport_class:VPC(),gene_origin:GEN,result:action};if(extra)Object.keys(extra).forEach(function(k){p[k]=extra[k]});cap("muta_expedicion",p)}
function unique(list){return list.filter(function(v,i,a){return a.indexOf(v)===i})}
function checkReturn(){if(!state.pending)return false;var p=state.pending,elapsed=Math.max(0,Math.round((Date.now()-Number(p.at||0))/1000));if(elapsed<30)return false;if(state.stamps.indexOf(p.id)<0){state.stamps.push(p.id);state.stamps=unique(state.stamps);capture("return",{result:"stamp",world_id:p.id,active_seconds:elapsed,stamp_count:state.stamps.length});addEnergy(3,"expedicion_regreso");haptic([12,18,26]);blip(784,.16,"sine",.07)}state.pending=null;save();return true}

var CSS='\
#expedicionOvl{position:fixed;inset:0;z-index:176;display:none;background:#05070d;color:#f8f5ec;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden}\
#expedicionOvl.open{display:block}\
#expedicionOvl *{box-sizing:border-box}\
#expedicionOvl button{font:inherit}\
#expedicionOvl button:focus-visible{outline:3px solid #fff59a;outline-offset:3px}\
#expedicionOvl .shell{position:relative;height:100vh;height:100dvh;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;padding:calc(12px + env(safe-area-inset-top)) clamp(12px,2.5vw,34px) calc(12px + env(safe-area-inset-bottom));overflow:hidden;background:radial-gradient(circle at 50% 48%,rgba(119,216,255,.13),transparent 34%),radial-gradient(circle at 12% 18%,rgba(255,143,112,.16),transparent 28%),radial-gradient(circle at 88% 82%,rgba(223,255,114,.13),transparent 30%),#05070d}\
#expedicionOvl .stars,#expedicionOvl .stars:before,#expedicionOvl .stars:after{position:absolute;inset:0;pointer-events:none;content:"";background-image:radial-gradient(#fff 1px,transparent 1px);background-size:67px 67px;opacity:.18}\
#expedicionOvl .stars:before{transform:translate(22px,19px);background-size:103px 103px;opacity:.24}\
#expedicionOvl .stars:after{transform:translate(51px,37px);background-size:149px 149px;opacity:.32}\
#expedicionOvl .top{position:relative;z-index:3;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px}\
#expedicionOvl .sigil{width:54px;height:54px;border:1px solid #77d8ff;border-radius:18px;display:grid;place-items:center;color:#77d8ff;background:#0b1420;box-shadow:0 0 28px rgba(119,216,255,.2);font:950 22px/1 ui-monospace,monospace}\
#expedicionOvl .eyebrow{margin:0 0 4px;color:#77d8ff;font:850 9px/1.2 ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase}\
#expedicionOvl h1{margin:0;font-size:clamp(25px,3.8vw,52px);line-height:.9;letter-spacing:-2px}\
#expedicionOvl .deck{margin:6px 0 0;color:#b9c4d5;font-size:clamp(11px,1.2vw,14px)}\
#expedicionOvl .close{width:44px;height:44px;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:#101621;color:#fff;cursor:pointer}\
#expedicionOvl .main{position:relative;z-index:2;min-height:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:12px}\
#expedicionOvl .cosmos{position:relative;min-height:0;border:1px solid rgba(255,255,255,.16);border-radius:30px;overflow:hidden;background:radial-gradient(circle at center,rgba(119,216,255,.09),transparent 56%),rgba(5,8,14,.76)}\
#expedicionOvl .orbit{position:absolute;left:50%;top:50%;width:min(62vw,700px);aspect-ratio:1;transform:translate(-50%,-50%);border:1px solid rgba(119,216,255,.19);border-radius:50%;animation:expSpin 55s linear infinite;pointer-events:none}\
#expedicionOvl .orbit:before,#expedicionOvl .orbit:after{content:"";position:absolute;border:1px solid rgba(255,255,255,.09);border-radius:50%;inset:13%}\
#expedicionOvl .orbit:after{inset:30%}\
#expedicionOvl .core{position:absolute;left:50%;top:50%;width:104px;height:104px;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 35% 30%,#fff7bf 0 4%,#77d8ff 10%,#1a4660 34%,#080d15 72%);box-shadow:0 0 70px rgba(119,216,255,.35);font:900 9px/1.25 ui-monospace,monospace;letter-spacing:.8px}\
#expedicionOvl .portal{--c:#77d8ff;position:absolute;width:clamp(128px,17vw,210px);min-height:116px;border:1px solid color-mix(in srgb,var(--c) 65%,white);border-radius:24px;padding:13px;color:#fff;background:color-mix(in srgb,#08101c 88%,var(--c));text-align:left;cursor:pointer;box-shadow:0 16px 34px rgba(0,0,0,.35),0 0 25px color-mix(in srgb,var(--c) 17%,transparent);transition:transform .2s,box-shadow .2s}\
#expedicionOvl .portal:hover,#expedicionOvl .portal.sel{transform:translateY(-5px);box-shadow:0 20px 42px rgba(0,0,0,.45),0 0 38px color-mix(in srgb,var(--c) 34%,transparent)}\
#expedicionOvl .portal[data-world="cronica"]{left:7%;top:12%}\
#expedicionOvl .portal[data-world="maquina"]{right:7%;top:20%}\
#expedicionOvl .portal[data-world="laberinto"]{left:27%;bottom:8%}\
#expedicionOvl .portal .icon{display:block;color:var(--c);font-size:25px;line-height:1}\
#expedicionOvl .portal small{display:block;margin:7px 0 3px;color:var(--c);font:900 8px/1 ui-monospace,monospace;letter-spacing:1.1px}\
#expedicionOvl .portal b{font-size:clamp(15px,1.6vw,21px);line-height:1}\
#expedicionOvl .portal em{display:block;margin-top:8px;color:#c8d1df;font:700 9px/1.25 ui-monospace,monospace;font-style:normal}\
#expedicionOvl .portal.stamped:after{content:"SELLO ✓";position:absolute;right:10px;top:10px;border-radius:99px;padding:4px 7px;background:#dfff72;color:#101607;font:950 8px/1 ui-monospace,monospace}\
#expedicionOvl .panel{min-height:0;overflow:auto;touch-action:pan-y;overscroll-behavior:contain;border:1px solid rgba(255,255,255,.16);border-radius:30px;padding:clamp(16px,2.2vw,28px);background:rgba(12,17,27,.96)}\
#expedicionOvl .panel .kind{margin:0;color:var(--c);font:900 9px/1.2 ui-monospace,monospace;letter-spacing:1.2px}\
#expedicionOvl .panel h2{margin:10px 0;font-size:clamp(36px,4.8vw,64px);line-height:.87;letter-spacing:-3px}\
#expedicionOvl .panel .copy{color:#c6cedb;font-size:13px;line-height:1.52;margin:0 0 12px}\
#expedicionOvl .mission{margin:14px 0;padding:13px;border-left:3px solid var(--c);background:rgba(255,255,255,.035);font-size:12px;line-height:1.45}\
#expedicionOvl .credit{color:#fff0b6;font:800 10px/1.4 ui-monospace,monospace}\
#expedicionOvl .depart,#expedicionOvl .share,#expedicionOvl .propose{width:100%;margin-top:10px;border-radius:15px;padding:13px 15px;font-weight:950;cursor:pointer}\
#expedicionOvl .depart{border:0;background:var(--c);color:#08100e;box-shadow:0 5px 0 color-mix(in srgb,var(--c) 48%,#000)}\
#expedicionOvl .share,#expedicionOvl .propose{border:1px solid rgba(255,255,255,.25);background:#141b29;color:#fff}\
#expedicionOvl .share:disabled,#expedicionOvl .propose:disabled{opacity:.38;cursor:not-allowed}\
#expedicionOvl .status{min-height:20px;margin-top:12px;color:#dfff72;font:800 9px/1.4 ui-monospace,monospace}\
#expedicionOvl .passport{position:relative;z-index:3;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.17);border-radius:18px;padding:9px 12px;background:rgba(11,15,24,.94)}\
#expedicionOvl .passport b{font:950 9px/1.2 ui-monospace,monospace;letter-spacing:1px;color:#77d8ff}\
#expedicionOvl .stamps{display:flex;gap:7px}\
#expedicionOvl .stamp{width:28px;height:28px;display:grid;place-items:center;border:1px dashed rgba(255,255,255,.28);border-radius:50%;color:rgba(255,255,255,.35);font-size:12px}\
#expedicionOvl .stamp.on{border-style:solid;border-color:#dfff72;color:#dfff72;background:rgba(223,255,114,.09)}\
#expedicionOvl .passport span:last-child{color:#aeb8c8;font-size:10px}\
@keyframes expSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}\
@media(max-width:760px){#expedicionOvl{overflow:auto}#expedicionOvl .shell{height:auto;min-height:100vh;min-height:100dvh;overflow:auto;touch-action:pan-y;overscroll-behavior:contain;padding:calc(9px + env(safe-area-inset-top)) 9px calc(12px + env(safe-area-inset-bottom))}#expedicionOvl .sigil{width:43px;height:43px;border-radius:14px}#expedicionOvl h1{font-size:27px}#expedicionOvl .deck{font-size:10px}#expedicionOvl .main{display:flex;flex-direction:column}#expedicionOvl .cosmos{height:56vh;min-height:430px;flex:0 0 auto;border-radius:22px}#expedicionOvl .orbit{width:540px}#expedicionOvl .portal{width:145px;min-height:112px;border-radius:19px;padding:11px}#expedicionOvl .portal[data-world="cronica"]{left:4%;top:8%}#expedicionOvl .portal[data-world="maquina"]{right:4%;top:23%}#expedicionOvl .portal[data-world="laberinto"]{left:13%;bottom:7%}#expedicionOvl .panel{overflow:visible;border-radius:22px}#expedicionOvl .passport{grid-template-columns:auto 1fr}#expedicionOvl .passport span:last-child{grid-column:1/-1}}\
@media(prefers-reduced-motion:reduce){#expedicionOvl *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}';

function portalHtml(w){return '<button class="portal '+(state.stamps.indexOf(w.id)>=0?'stamped ':'')+(selected===w.id?'sel':'')+'" data-world="'+w.id+'" style="--c:'+w.color+'" aria-label="Elegir '+w.title+'"><span class="icon" aria-hidden="true">'+w.icon+'</span><small>'+w.kicker+'</small><b>'+w.title+'</b><em>'+w.gene+'</em></button>'}
function build(){if(root)return;var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);root=document.createElement("section");root.id="expedicionOvl";root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.setAttribute("aria-label","La Expedición de los Mundos de MUTA");root.innerHTML='<main class="shell"><div class="stars" aria-hidden="true"></div><header class="top"><div class="sigil" aria-hidden="true">✦</div><div><p class="eyebrow">MUTA · GEN '+G+' · ruta viva</p><h1>La Expedición de los Mundos</h1><p class="deck">Elige un portal. Juega. Vuelve por tu sello. Dos sellos abren tu pasaporte.</p></div><button class="close" data-action="close" aria-label="Cerrar La Expedición">✕</button></header><section class="main"><div class="cosmos" aria-label="Tres portales de experiencias"><div class="orbit" aria-hidden="true"></div><div class="core" aria-hidden="true">ELIGE<br>UN MUNDO</div><div data-portals></div></div><aside class="panel" data-panel></aside></section><footer class="passport"><b>PASAPORTE<br>GEN '+G+'</b><div class="stamps" aria-label="Sellos de regreso"><span class="stamp" data-stamp="cronica">⚔</span><span class="stamp" data-stamp="maquina">✦</span><span class="stamp" data-stamp="laberinto">◆</span></div><span data-pass-text>0/2 regresos para abrirlo</span></footer></main>';document.body.appendChild(root);root.addEventListener("click",onClick);root.addEventListener("keydown",onKey)}
function render(){if(!root)return;var w=world(selected);root.querySelector("[data-portals]").innerHTML=WORLDS.map(portalHtml).join("");root.querySelectorAll("[data-stamp]").forEach(function(el){el.classList.toggle("on",state.stamps.indexOf(el.dataset.stamp)>=0)});var ready=state.stamps.length>=2;root.querySelector("[data-pass-text]").textContent=ready?"PASAPORTE ABIERTO · "+state.stamps.length+" mundos registrados":state.stamps.length+"/2 regresos para abrirlo";var pending=state.pending,wait=pending?Math.max(0,30-Math.round((Date.now()-Number(pending.at||0))/1000)):0;root.querySelector("[data-panel]").innerHTML='<p class="kind" style="--c:'+w.color+'">'+w.icon+' '+w.kicker+' · PORTAL '+(WORLDS.indexOf(w)+1)+'/3</p><h2>'+w.title+'</h2><p class="copy">'+w.why+'</p><div class="mission" style="--c:'+w.color+'"><b>MISIÓN</b><br>'+w.mission+'</div><p class="credit">Nacida de '+w.gene+'. Su idea construyó este mundo; Gen 36 lo convierte en una ruta elegible.</p><button class="depart" data-action="depart" style="--c:'+w.color+'">Entrar a '+w.title+'</button><button class="share" data-action="share" '+(ready?'':'disabled')+'>Compartir mi pasaporte</button><button class="propose" data-action="propose" '+(ready?'':'disabled')+'>Pedir el próximo portal</button><p class="status" aria-live="polite">'+(pending?(wait>0?'VIAJE EN CURSO · vuelve en '+wait+' s o más para sellarlo':'REGRESASTE · cierra y abre la expedición para registrar el sello'):(ready?'DOS REGRESOS REALES · tu ruta ya tiene valor para compartir':'Cada sello exige salir a un mundo y volver después de 30 s.'))+'</p>'}
function open_(){build();lastFocus=document.activeElement;var got=checkReturn();root.classList.add("open");document.documentElement.style.overflow="hidden";openedAt=Date.now();try{localStorage.setItem("muta_seen_gen",String(G))}catch(e){}capture("open",{result:state.stamps.length?"returning":"new",stamp_count:state.stamps.length});cap("muta_mode_switch",{mode:"world-route",generation:G,experience_id:"expedicion-mundos-36",viewport_class:VPC(),gene_origin:GEN});render();setTimeout(function(){var b=root.querySelector('[data-world="'+selected+'"]');if(b)b.focus();if(got)status("SELLO REGISTRADO · el siguiente mundo puede abrir tu pasaporte.")},35)}
function close_(){if(!root)return;root.classList.remove("open");document.documentElement.style.overflow="";capture("close",{result:"closed",active_seconds:Math.max(0,Math.round((Date.now()-openedAt)/1000)),stamp_count:state.stamps.length});if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function choose(id,input){selected=id;capture("choose",{result:"world-selected",world_id:id,input_type:input||"button",stamp_count:state.stamps.length});haptic(8);blip(460+WORLDS.indexOf(world(id))*130,.07,"sine",.035);render()}
function depart(){var w=world(selected);state.pending={id:w.id,at:Date.now()};if(state.departed.indexOf(w.id)<0)state.departed.push(w.id);save();capture("depart",{result:"experience-launched",world_id:w.id,target_experience:w.launch,stamp_count:state.stamps.length});addEnergy(1,"expedicion_salida");haptic([10,16,20]);blip(720,.14,"sine",.06);close_();if(typeof API.launchExperience==="function")API.launchExperience(w.launch);else{open_();state.pending=null;save();status("No pude abrir este mundo. Reintenta desde Experiencias.",true);capture("error",{result:"launcher-missing",world_id:w.id})}}
function copyText(t){if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t);return new Promise(function(resolve,reject){var ta=document.createElement("textarea");ta.value=t;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy")?resolve():reject()}catch(e){reject(e)}document.body.removeChild(ta)})}
function share(){if(state.stamps.length<2)return;var names=state.stamps.slice(0,3).map(function(id){return world(id).title}).join(" + "),url="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN),txt="Mi pasaporte de MUTA recorrió "+names+". Elige tu propia ruta entre mundos vivos: "+url;capture("passport",{result:"unlocked",stamp_count:state.stamps.length,route:state.stamps.join("-")});capture("share",{result:"attempt",stamp_count:state.stamps.length,route:state.stamps.join("-")});cap("muta_share",{red:"expedicion_pasaporte",gen:GEN,generation:G,mode:"world-route",experience_id:"expedicion-mundos-36",viewport_class:VPC(),gene_origin:GEN});if(navigator.share)navigator.share({title:"Mi pasaporte de MUTA",text:txt,url:url}).then(function(){status("Pasaporte compartido.")},function(){});else copyText(txt).then(function(){status("Pasaporte y enlace copiados.")},function(){status("No pude copiar el pasaporte.",true)})}
function propose(){if(state.stamps.length<2)return;capture("propose",{result:"prefill",stamp_count:state.stamps.length,route:state.stamps.join("-")});if(typeof API.prefillProposal==="function"){close_();API.prefillProposal("Quiero que la próxima expedición abra un mundo de…","Transformación","expedicion-gen-36")}else status("Abre Pide el cambio para proponer el próximo mundo.")}
function status(msg,bad){var s=root&&root.querySelector(".status");if(s){s.textContent=msg;s.style.color=bad?"#ff8998":"#dfff72"}}
function onClick(e){var p=e.target.closest&&e.target.closest("[data-world]"),a=e.target.closest&&e.target.closest("[data-action]");if(p){choose(p.dataset.world,inputType(e));return}if(!a)return;var k=a.dataset.action;if(k==="close")close_();else if(k==="depart")depart();else if(k==="share")share();else if(k==="propose")propose()}
function onKey(e){if(!root.classList.contains("open"))return;if(e.key==="Escape"){e.preventDefault();close_();return}if(e.key!=="Tab")return;var focusable=[].slice.call(root.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')).filter(function(el){return el.offsetParent!==null});if(!focusable.length)return;var first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}

window.MUTA_EXPEDICION={open:open_,close:close_};
if(window.__expedicionAutoStart){window.__expedicionAutoStart=false;open_()}
})();
