(function(){
"use strict";
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var addEnergy=API.addEnergy||function(){};
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};
var esc=API.esc||function(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]})};
var VPC=API.VPC||function(){return innerWidth<=720?"mobile":"desktop"};
var G=Number(API.generation)||32;
var GEN=API.GEN||"GEN-0000";
var ALIAS=API.ALIAS||"Anónimo";
var KEY="muta_brujula_g32";
var TODAY=(new Date()).toISOString().slice(0,10);
var root=null,lastFocus=null,view="choose",topic=null,lever=null,committed=false,drag=null;
var nodes={deseo:{x:.23,y:.38},duda:{x:.76,y:.34},paso:{x:.50,y:.76}};
var progress={routes:0,days:[],last:null};
var TOPICS={
 crear:{icon:"✦",label:"Crear algo",prompt:"Hay algo que quieres traer al mundo.",verb:"crear"},
 decir:{icon:"◌",label:"Decir algo",prompt:"Hay una conversación que necesita forma.",verb:"decir"},
 cambiar:{icon:"↺",label:"Cambiar algo",prompt:"Hay una costumbre o situación que ya no encaja.",verb:"cambiar"},
 explorar:{icon:"⌁",label:"Explorar algo",prompt:"Hay una dirección que todavía no conoces.",verb:"explorar"}
};
var LEVERS={
 pequeno:{icon:"10′",label:"Hacerlo más pequeño",short:"UN PASO DE 10 MINUTOS"},
 ayuda:{icon:"+1",label:"Pedir una ayuda concreta",short:"PEDIR AYUDA"},
 hora:{icon:"◷",label:"Ponerle hora",short:"RESERVAR UNA HORA"}
};
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&typeof saved==="object")progress=Object.assign(progress,saved)}catch(e){}

var CSS='\
#brujulaOvl{position:fixed;inset:0;z-index:160;background:#090b24;color:#f8f4e6;display:none;overflow:hidden;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}\
#brujulaOvl.open{display:block}\
#brujulaOvl *{box-sizing:border-box}\
#brujulaOvl .aurora{position:absolute;inset:-20%;pointer-events:none;background:radial-gradient(circle at 18% 26%,rgba(149,255,150,.2),transparent 25%),radial-gradient(circle at 78% 62%,rgba(255,105,124,.22),transparent 28%),radial-gradient(circle at 52% 12%,rgba(116,138,255,.2),transparent 34%);filter:blur(22px)}\
#brujulaOvl .shell{position:relative;z-index:1;width:100%;height:100vh;height:100dvh;display:flex;flex-direction:column;padding:calc(14px + env(safe-area-inset-top)) clamp(14px,3vw,46px) calc(16px + env(safe-area-inset-bottom));overflow:hidden}\
#brujulaOvl .top{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;flex:0 0 auto}\
#brujulaOvl .sigil{width:54px;height:54px;border:1px solid rgba(255,255,255,.46);border-radius:50%;display:grid;place-items:center;font:900 25px/1 ui-monospace,monospace;color:#98ff9f;background:#12183e;box-shadow:0 0 34px rgba(152,255,159,.2)}\
#brujulaOvl .eyebrow{margin:0 0 2px;font:800 10px/1.2 ui-monospace,monospace;letter-spacing:1.6px;color:#98ff9f;text-transform:uppercase}\
#brujulaOvl h1{margin:0;font-size:clamp(25px,4vw,48px);line-height:.96;letter-spacing:-1.5px}\
#brujulaOvl .deck{margin:5px 0 0;color:#c5c9e8;font-size:clamp(12px,1.35vw,15px);line-height:1.35}\
#brujulaOvl .close{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:#171b3e;color:#fff;font-size:20px;cursor:pointer}\
#brujulaOvl button{font:inherit}\
#brujulaOvl button:focus-visible{outline:3px solid #98ff9f;outline-offset:3px}\
#brujulaOvl .credit{margin:10px 0 0;padding:7px 10px;border-left:3px solid #ff697c;color:#c5c9e8;font-size:11px;line-height:1.4;max-width:900px}\
#brujulaOvl .credit b{color:#fff}\
#brujulaOvl .choose{flex:1;min-height:0;display:grid;grid-template-columns:minmax(260px,.78fr) minmax(0,1.22fr);gap:clamp(16px,4vw,62px);align-items:center;padding:clamp(12px,3vh,34px) 0}\
#brujulaOvl .question{font-size:clamp(38px,6.3vw,86px);font-weight:900;line-height:.92;letter-spacing:-4px;margin:0}\
#brujulaOvl .question em{display:block;color:#ff697c;font-style:normal}\
#brujulaOvl .plain{margin:18px 0 0;max-width:520px;color:#c5c9e8;font-size:clamp(15px,1.8vw,20px);line-height:1.45}\
#brujulaOvl .topicgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
#brujulaOvl .topic{position:relative;min-height:148px;border:1px solid rgba(255,255,255,.24);border-radius:24px;padding:20px;text-align:left;background:rgba(19,24,60,.82);color:#fff;cursor:pointer;overflow:hidden;transition:transform .18s,border-color .18s,background .18s}\
#brujulaOvl .topic:hover{transform:translateY(-4px);border-color:#98ff9f;background:#182150}\
#brujulaOvl .topic .ti{display:block;font-size:36px;color:#98ff9f;margin-bottom:24px}\
#brujulaOvl .topic strong{display:block;font-size:clamp(18px,2vw,25px)}\
#brujulaOvl .topic small{display:block;margin-top:5px;color:#aeb4d6;font-size:11px;line-height:1.35}\
#brujulaOvl .mapwrap{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(270px,360px);gap:18px;padding-top:12px}\
#brujulaOvl .fieldbox{position:relative;min-height:360px;border:1px solid rgba(255,255,255,.22);border-radius:28px;overflow:hidden;background:radial-gradient(circle at 50% 48%,rgba(116,138,255,.13),transparent 36%),linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),rgba(8,11,35,.78);background-size:auto,38px 38px,38px 38px,auto}\
#brujulaOvl .fieldbox:before{content:"ARRASTRA LAS TRES FUERZAS";position:absolute;left:18px;top:14px;font:800 9px ui-monospace,monospace;letter-spacing:1.5px;color:#7e86ae}\
#brujulaOvl .routes{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}\
#brujulaOvl .routes line{stroke:rgba(255,255,255,.22);stroke-width:1.4;stroke-dasharray:5 7}\
#brujulaOvl .routes .active{stroke:#98ff9f;stroke-width:3;stroke-dasharray:none;filter:drop-shadow(0 0 7px rgba(152,255,159,.7))}\
#brujulaOvl .node{position:absolute;transform:translate(-50%,-50%);width:clamp(90px,12vw,142px);aspect-ratio:1;border-radius:50%;border:2px solid rgba(255,255,255,.75);color:#fff;background:#171d49;display:grid;place-items:center;text-align:center;padding:12px;cursor:grab;touch-action:none;user-select:none;box-shadow:0 12px 38px rgba(0,0,0,.4);transition:box-shadow .18s}\
#brujulaOvl .node:active{cursor:grabbing}\
#brujulaOvl .node[data-node=deseo]{background:radial-gradient(circle at 36% 30%,#d8ffd5,#319c68 68%,#123c38);color:#071e19}\
#brujulaOvl .node[data-node=duda]{background:radial-gradient(circle at 36% 30%,#ffd2d8,#b53558 68%,#481338)}\
#brujulaOvl .node[data-node=paso]{background:radial-gradient(circle at 36% 30%,#e1e5ff,#6375eb 66%,#232a71)}\
#brujulaOvl .node strong{display:block;font:900 clamp(11px,1.3vw,15px)/1 ui-monospace,monospace;letter-spacing:.8px}\
#brujulaOvl .node small{display:block;margin-top:5px;font-size:9px;line-height:1.2;opacity:.82}\
#brujulaOvl .node.moving{box-shadow:0 0 0 10px rgba(152,255,159,.12),0 16px 50px rgba(0,0,0,.55)}\
#brujulaOvl .panel{border:1px solid rgba(255,255,255,.2);border-radius:24px;padding:18px;background:rgba(18,23,56,.92);overflow:auto;overscroll-behavior:contain}\
#brujulaOvl .panel h2{margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#98ff9f}\
#brujulaOvl .scoreline{display:flex;align-items:end;gap:8px;margin:2px 0 12px}\
#brujulaOvl .scoreline b{font-size:52px;line-height:.9;letter-spacing:-3px}\
#brujulaOvl .scoreline span{font:700 10px ui-monospace,monospace;color:#9299bd;padding-bottom:5px}\
#brujulaOvl .insight{border-left:3px solid #ff697c;padding:9px 0 9px 12px;margin:10px 0 14px;font-size:14px;line-height:1.45;color:#fff}\
#brujulaOvl .hint{font-size:11px;line-height:1.45;color:#aeb4d6;margin:0 0 12px}\
#brujulaOvl .levers{display:grid;gap:8px}\
#brujulaOvl .lever{display:flex;align-items:center;gap:10px;width:100%;border:1px solid rgba(255,255,255,.2);border-radius:13px;padding:10px 12px;text-align:left;background:#111738;color:#fff;cursor:pointer}\
#brujulaOvl .lever.sel{border-color:#98ff9f;background:#1c3a42}\
#brujulaOvl .lever .li{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#ff697c;color:#210812;font:900 12px ui-monospace,monospace;flex:0 0 auto}\
#brujulaOvl .primary,#brujulaOvl .secondary{width:100%;border-radius:14px;padding:13px 15px;font-weight:900;cursor:pointer;margin-top:10px}\
#brujulaOvl .primary{border:0;background:#98ff9f;color:#081d18;box-shadow:0 7px 0 #397c62}\
#brujulaOvl .primary:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}\
#brujulaOvl .secondary{border:1px solid rgba(255,255,255,.32);background:#171b3e;color:#fff}\
#brujulaOvl .status{min-height:20px;margin-top:9px;color:#98ff9f;font-size:11px;line-height:1.35}\
#brujulaOvl .result{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(290px,440px);gap:clamp(16px,4vw,52px);align-items:center;padding:18px 0}\
#brujulaOvl .resultcopy h2{font-size:clamp(44px,7vw,98px);line-height:.9;letter-spacing:-4px;margin:0 0 18px}\
#brujulaOvl .resultcopy h2 span{color:#98ff9f}\
#brujulaOvl .resultcopy p{max-width:620px;font-size:clamp(15px,1.8vw,20px);line-height:1.5;color:#c5c9e8}\
#brujulaOvl .routebox{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0;max-width:640px}\
#brujulaOvl .routebox div{border:1px solid rgba(255,255,255,.22);border-radius:13px;padding:11px;background:#14193b}\
#brujulaOvl .routebox small{display:block;color:#8f96bc;font:800 9px ui-monospace,monospace;letter-spacing:1px}\
#brujulaOvl .routebox b{display:block;margin-top:5px;font-size:12px}\
#brujulaOvl .cardpanel{text-align:center;border:1px solid rgba(255,255,255,.2);border-radius:24px;padding:14px;background:#111534}\
#brujulaOvl .cardpanel canvas{width:min(100%,360px);max-height:62vh;object-fit:contain;border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.46)}\
#brujulaOvl .cardactions{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
#brujulaOvl .cardactions button{margin-top:8px}\
@media(max-width:760px){#brujulaOvl{overflow:auto}#brujulaOvl .shell{height:auto;min-height:100vh;min-height:100dvh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:calc(10px + env(safe-area-inset-top)) 12px calc(20px + env(safe-area-inset-bottom))}#brujulaOvl .sigil{width:40px;height:40px;font-size:19px}#brujulaOvl .top{gap:8px}#brujulaOvl h1{font-size:25px;letter-spacing:-1px}#brujulaOvl .deck{font-size:11px}#brujulaOvl .credit{font-size:10px;margin-top:7px}#brujulaOvl .choose{grid-template-columns:1fr;align-items:start;padding:16px 0 8px}#brujulaOvl .question{font-size:45px;letter-spacing:-2px}#brujulaOvl .plain{font-size:14px;margin-top:10px}#brujulaOvl .topicgrid{gap:8px}#brujulaOvl .topic{min-height:112px;padding:14px;border-radius:18px}#brujulaOvl .topic .ti{font-size:27px;margin-bottom:14px}#brujulaOvl .topic strong{font-size:17px}#brujulaOvl .mapwrap{display:flex;flex-direction:column;overflow:visible}#brujulaOvl .fieldbox{height:53vh;min-height:390px;flex:0 0 auto}#brujulaOvl .panel{overflow:visible}#brujulaOvl .node{width:94px}#brujulaOvl .result{grid-template-columns:1fr;align-items:start}#brujulaOvl .resultcopy h2{font-size:48px;letter-spacing:-2px}#brujulaOvl .routebox{grid-template-columns:1fr}#brujulaOvl .cardpanel canvas{max-height:none}}\
@media(prefers-reduced-motion:reduce){#brujulaOvl *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}';

function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch(e){}}
function capture(action,extra){var p={action:action,generation:G,experience_id:"brujula-abisal",mode:"decision-map",input_type:"button",viewport_class:VPC(),gene_origin:GEN,result:action};if(extra)Object.keys(extra).forEach(function(k){p[k]=extra[k]});cap("muta_brujula",p)}
function header(){return '<header class="top"><div class="sigil" aria-hidden="true">⌖</div><div><p class="eyebrow">MUTA · GEN '+G+' · herramienta viva</p><h1>La Brújula Abisal</h1><p class="deck">Tres fuerzas. Una ruta. Arrastra lo que quieres mover.</p></div><button class="close" data-action="close" aria-label="Cerrar La Brújula Abisal">✕</button></header><p class="credit"><b>Nacida de GEN-0D9B «Abisal»:</b> pidió una interacción que nos hiciera cuestionarnos todo. Su idea se volvió un mapa táctil para convertir una duda en un próximo paso.</p>'}
function build(){
 if(root)return;
 var style=document.createElement("style");style.textContent=CSS;document.head.appendChild(style);
 root=document.createElement("section");root.id="brujulaOvl";root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.setAttribute("aria-label","La Brújula Abisal: mapa de decisiones");document.body.appendChild(root);
 root.addEventListener("click",onClick);root.addEventListener("pointerdown",onPointerDown);root.addEventListener("keydown",onKey);
 document.addEventListener("pointermove",onPointerMove,{passive:false});document.addEventListener("pointerup",onPointerUp);
}
function open_(){build();lastFocus=document.activeElement;root.classList.add("open");document.documentElement.style.overflow="hidden";try{localStorage.setItem("muta_seen_gen",String(G))}catch(e){}capture("open",{result:progress.last&&progress.last.date===TODAY?"return":"new"});cap("muta_mode_switch",{mode:"decision-map",generation:G,experience_id:"brujula-abisal",viewport_class:VPC(),gene_origin:GEN});if(progress.last&&progress.last.date===TODAY){topic=progress.last.topic;lever=progress.last.lever;committed=true;nodes=progress.last.nodes||nodes;renderResult()}else renderChoose();setTimeout(focusFirst,40)}
function close_(){if(!root)return;root.classList.remove("open");document.documentElement.style.overflow="";capture("close",{result:view});if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function focusFirst(){var f=root&&root.querySelector("button:not([disabled])");if(f)f.focus()}
function renderChoose(){view="choose";committed=false;root.innerHTML='<div class="aurora"></div><main class="shell">'+header()+'<section class="choose"><div><p class="question">¿QUÉ QUIERES <em>MOVER HOY?</em></p><p class="plain">Elige una dirección. Después acomoda <b>Deseo</b>, <b>Duda</b> y <b>Próximo paso</b> hasta que el mapa se parezca a lo que sientes.</p></div><div class="topicgrid">'+Object.keys(TOPICS).map(function(k){var t=TOPICS[k];return '<button class="topic" data-topic="'+k+'"><span class="ti">'+t.icon+'</span><strong>'+t.label+'</strong><small>'+t.prompt+'</small></button>'}).join("")+'</div></section></main>'}
function resetNodes(){nodes={deseo:{x:.23,y:.38},duda:{x:.76,y:.34},paso:{x:.50,y:.76}}}
function renderMap(){
 view="map";var t=TOPICS[topic];
 root.innerHTML='<div class="aurora"></div><main class="shell">'+header()+'<section class="mapwrap"><div class="fieldbox" id="brField" aria-label="Campo de decisión. Arrastra los nodos o usa las flechas del teclado."><svg class="routes" aria-hidden="true"><line id="brLineDuda"/><line class="active" id="brLinePaso"/></svg><button class="node" data-node="deseo" aria-label="Deseo. Arrastra o usa flechas"><span><strong>DESEO</strong><small>'+esc(t.label)+'</small></span></button><button class="node" data-node="duda" aria-label="Duda. Arrastra o usa flechas"><span><strong>DUDA</strong><small>lo que pesa</small></span></button><button class="node" data-node="paso" aria-label="Próximo paso. Arrastra o usa flechas"><span><strong>PASO</strong><small>lo que sí harás</small></span></button></div><aside class="panel"><h2>Lectura del campo</h2><div class="scoreline"><b id="brScore">0</b><span>CLARIDAD<br>DE RUTA</span></div><p class="insight" id="brInsight" aria-live="polite"></p><p class="hint">Mueve las fuerzas hasta que el mapa sea honesto. Luego elige una palanca concreta.</p><div class="levers">'+Object.keys(LEVERS).map(function(k){var l=LEVERS[k];return '<button class="lever '+(lever===k?"sel":"")+'" data-lever="'+k+'"><span class="li">'+l.icon+'</span><span><b>'+l.label+'</b></span></button>'}).join("")+'</div><button class="primary" data-action="commit" '+(lever?"":"disabled")+'>FIJAR ESTA RUTA →</button><button class="secondary" data-action="restart">Cambiar de dirección</button><div class="status" id="brStatus" aria-live="polite">Consejo: con teclado, enfoca una fuerza y usa las flechas.</div></aside></section></main>';
 updateMap();
}
function dist(a,b){var dx=a.x-b.x,dy=a.y-b.y;return Math.sqrt(dx*dx+dy*dy)}
function score(){var close=1-Math.min(dist(nodes.paso,nodes.deseo)/1.05,1),space=Math.min(dist(nodes.paso,nodes.duda)/.95,1);return Math.max(0,Math.min(100,Math.round(close*68+space*32)))}
function insight(){var s=score();if(s<36)return "Tu próximo paso todavía vive junto a la duda. Hazlo tan pequeño que puedas empezarlo sin negociar contigo.";if(s<70)return "La ruta ya existe. Le falta una condición visible: tiempo, ayuda o una versión más pequeña.";return "Deseo y paso ya se reconocen. Protégelos con una señal de inicio concreta."}
function updateMap(){
 if(!root)return;Object.keys(nodes).forEach(function(k){var el=root.querySelector('[data-node="'+k+'"]');if(el){el.style.left=(nodes[k].x*100)+"%";el.style.top=(nodes[k].y*100)+"%"}});
 var desire=nodes.deseo,doubt=nodes.duda,step=nodes.paso,l1=root.querySelector("#brLineDuda"),l2=root.querySelector("#brLinePaso");
 if(l1){l1.setAttribute("x1",(doubt.x*100)+"%");l1.setAttribute("y1",(doubt.y*100)+"%");l1.setAttribute("x2",(step.x*100)+"%");l1.setAttribute("y2",(step.y*100)+"%")}
 if(l2){l2.setAttribute("x1",(desire.x*100)+"%");l2.setAttribute("y1",(desire.y*100)+"%");l2.setAttribute("x2",(step.x*100)+"%");l2.setAttribute("y2",(step.y*100)+"%")}
 var sc=root.querySelector("#brScore"),ins=root.querySelector("#brInsight");if(sc)sc.textContent=score();if(ins)ins.textContent=insight();
}
function chooseTopic(k){if(!TOPICS[k])return;topic=k;lever=null;resetNodes();capture("choose",{result:k,topic:k});haptic(10);blip(480,.08,"triangle",.05);renderMap();setTimeout(function(){var n=root.querySelector('[data-node="paso"]');if(n)n.focus()},30)}
function chooseLever(k){if(!LEVERS[k])return;lever=k;if(k==="pequeno"){nodes.paso.x=nodes.deseo.x+.12;nodes.paso.y=nodes.deseo.y+.18}else if(k==="ayuda"){nodes.duda.x=.86;nodes.duda.y=.18;nodes.paso.x=nodes.deseo.x+.18;nodes.paso.y=nodes.deseo.y+.08}else{nodes.paso.x=nodes.deseo.x+.07;nodes.paso.y=nodes.deseo.y+.16}capture("lever",{result:k,topic:topic,progress:score()});haptic([8,22,12]);blip(690,.09,"sine",.06);renderMap()}
function commit(){if(!topic||!lever)return;committed=true;var rec={date:TODAY,topic:topic,lever:lever,score:score(),nodes:JSON.parse(JSON.stringify(nodes))};progress.routes=(Number(progress.routes)||0)+1;progress.last=rec;progress.days=(progress.days||[]).filter(function(d){return d!==TODAY});progress.days.push(TODAY);progress.days=progress.days.slice(-14);save();capture("commit",{result:lever,topic:topic,progress:rec.score,routes:progress.routes});addEnergy(3,"brujula_ruta");haptic([14,30,24]);blip(840,.18,"sine",.08);renderResult()}
function renderResult(){view="result";var t=TOPICS[topic]||TOPICS.explorar,l=LEVERS[lever]||LEVERS.pequeno,s=progress.last&&progress.last.score!=null?progress.last.score:score();root.innerHTML='<div class="aurora"></div><main class="shell">'+header()+'<section class="result"><div class="resultcopy"><p class="eyebrow">RUTA FIJADA · '+TODAY+'</p><h2>YA NO ES SOLO <span>UNA DUDA.</span></h2><p>Elegiste <b>'+esc(t.label.toLowerCase())+'</b> y convertiste el campo en una acción: <b>'+esc(l.label.toLowerCase())+'</b>. La geometría no adivina tu futuro; te devuelve una decisión visible que tú construiste.</p><div class="routebox"><div><small>DIRECCIÓN</small><b>'+esc(t.label)+'</b></div><div><small>PALANCA</small><b>'+esc(l.short)+'</b></div><div><small>CLARIDAD</small><b>'+s+' / 100</b></div></div><button class="primary" data-action="card">CREAR MI CARTA DE RUTA</button><button class="secondary" data-action="redo">Dibujar otra ruta</button><div class="status" id="brStatus">Tu decisión queda solo en este dispositivo. Analítica recibe la dirección, la palanca y el puntaje; nunca texto personal.</div></div><aside class="cardpanel"><canvas id="brMini" width="1080" height="1350" aria-label="Vista previa de la carta de ruta"></canvas><p class="hint">La carta contiene solo símbolos, la dirección elegida, tu palanca y tu gen.</p></aside></section></main>';drawCard(root.querySelector("#brMini"),t,l,s)}
function renderCard(){view="card";var t=TOPICS[topic],l=LEVERS[lever],s=progress.last.score;root.innerHTML='<div class="aurora"></div><main class="shell">'+header()+'<section class="result"><div class="resultcopy"><p class="eyebrow">IDENTIDAD COMPARTIBLE · SIN TEXTO PRIVADO</p><h2>TU CARTA DE <span>RUTA.</span></h2><p>Guárdala para recordar la palanca que elegiste o compártela para traer otro gen a MUTA.</p><div class="cardactions"><button class="primary" data-action="share">COMPARTIR</button><button class="secondary" data-action="save">Guardar imagen</button><button class="secondary" data-action="back">Volver a la ruta</button><button class="secondary" data-action="redo">Dibujar otra</button></div><div class="status" id="brStatus" aria-live="polite"></div></div><aside class="cardpanel"><canvas id="brCard" width="1080" height="1350" aria-label="Carta de ruta de La Brújula Abisal"></canvas></aside></section></main>';drawCard(root.querySelector("#brCard"),t,l,s);capture("card",{result:"created",topic:topic,progress:s})}
function drawCard(cv,t,l,s){if(!cv)return;var x=cv.getContext("2d"),w=cv.width,h=cv.height;x.fillStyle="#090b24";x.fillRect(0,0,w,h);var g=x.createRadialGradient(250,260,20,250,260,560);g.addColorStop(0,"rgba(152,255,159,.34)");g.addColorStop(1,"rgba(9,11,36,0)");x.fillStyle=g;x.fillRect(0,0,w,h);var g2=x.createRadialGradient(890,840,20,890,840,560);g2.addColorStop(0,"rgba(255,105,124,.34)");g2.addColorStop(1,"rgba(9,11,36,0)");x.fillStyle=g2;x.fillRect(0,0,w,h);x.strokeStyle="rgba(255,255,255,.12)";x.lineWidth=2;for(var i=80;i<w;i+=80){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}for(var j=80;j<h;j+=80){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke()}x.fillStyle="#98ff9f";x.font="800 28px ui-monospace,monospace";x.textAlign="left";x.fillText("MUTA · GEN "+G,76,88);x.fillStyle="#f8f4e6";x.font="900 74px system-ui";x.fillText("LA BRÚJULA",76,174);x.fillText("ABISAL",76,254);var px={deseo:{x:280,y:610,r:130,c:"#75e89a"},duda:{x:810,y:520,r:104,c:"#ff697c"},paso:{x:555,y:870,r:122,c:"#7a8cff"}};x.lineWidth=10;x.strokeStyle="#98ff9f";x.beginPath();x.moveTo(px.deseo.x,px.deseo.y);x.lineTo(px.paso.x,px.paso.y);x.stroke();x.lineWidth=4;x.setLineDash([16,18]);x.strokeStyle="rgba(255,255,255,.38)";x.beginPath();x.moveTo(px.duda.x,px.duda.y);x.lineTo(px.paso.x,px.paso.y);x.stroke();x.setLineDash([]);Object.keys(px).forEach(function(k){var p=px[k];x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fill();x.fillStyle=k==="deseo"?"#071e19":"#fff";x.textAlign="center";x.font="900 30px ui-monospace,monospace";x.fillText(k.toUpperCase(),p.x,p.y-2);x.font="700 21px system-ui";x.fillText(k==="deseo"?t.label:(k==="duda"?"LO QUE PESA":l.short),p.x,p.y+38)});x.textAlign="left";x.fillStyle="#f8f4e6";x.font="900 58px system-ui";x.fillText("CLARIDAD "+s+"/100",76,1105);x.fillStyle="#c5c9e8";x.font="600 27px system-ui";x.fillText("Palanca elegida: "+l.label,76,1160);x.fillStyle="#ff697c";x.font="800 27px ui-monospace,monospace";x.fillText("FIRMADA "+GEN+" · «"+ALIAS+"»",76,1242);x.fillStyle="#9ca4ca";x.font="500 20px system-ui";x.fillText("Nacida de GEN-0D9B «Abisal» · muta.revenuehub.cloud",76,1295)}
function fallbackCopy(t){var ta=document.createElement("textarea"),ok=false;ta.value=t;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{ok=document.execCommand("copy")}catch(e){}document.body.removeChild(ta);return ok}
function status(msg,bad){var el=root&&root.querySelector("#brStatus");if(el){el.textContent=msg;el.style.color=bad?"#ff9aab":"#98ff9f"}}
function shareCard(){var cv=root.querySelector("#brCard"),t=TOPICS[topic],l=LEVERS[lever],link="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN),txt="Dibujé una ruta en La Brújula Abisal de MUTA: elegí "+t.label.toLowerCase()+" y la palanca «"+l.label.toLowerCase()+"». Mañana MUTA vuelve a cambiar. "+link;capture("share",{result:"attempt",topic:topic,progress:progress.last.score});cap("muta_share",{red:"brujula_carta",gen:GEN,generation:G,mode:"decision-map",experience_id:"brujula-abisal",viewport_class:VPC(),gene_origin:GEN});cv.toBlob(function(blob){var file=blob?new File([blob],"muta-brujula-gen32.png",{type:"image/png"}):null;if(file&&navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],text:txt}).then(function(){status("Ruta compartida.")},function(){});else if(navigator.share)navigator.share({text:txt}).then(function(){status("Ruta compartida.")},function(){});else{var ok=fallbackCopy(txt);status(ok?"Texto y enlace copiados.":"No pude abrir Compartir. Guarda la imagen y copia el enlace.",!ok)}} ,"image/png")}
function saveCard(){var cv=root.querySelector("#brCard");capture("card_save",{result:"saved",topic:topic,progress:progress.last.score});var a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download="muta-brujula-gen32.png";document.body.appendChild(a);a.click();document.body.removeChild(a);status("Carta guardada.")}
function onPointerDown(e){var n=e.target.closest&&e.target.closest("[data-node]");if(!n||view!=="map")return;var field=root.querySelector("#brField");if(!field)return;e.preventDefault();drag={key:n.getAttribute("data-node"),field:field,moved:false,input:e.pointerType||"pointer"};n.classList.add("moving");if(n.setPointerCapture)try{n.setPointerCapture(e.pointerId)}catch(err){}}
function onPointerMove(e){if(!drag)return;e.preventDefault();var r=drag.field.getBoundingClientRect();nodes[drag.key].x=Math.max(.09,Math.min(.91,(e.clientX-r.left)/r.width));nodes[drag.key].y=Math.max(.16,Math.min(.87,(e.clientY-r.top)/r.height));drag.moved=true;updateMap()}
function onPointerUp(){if(!drag)return;var n=root&&root.querySelector('[data-node="'+drag.key+'"]');if(n)n.classList.remove("moving");if(drag.moved){capture("drag",{result:drag.key,input_type:drag.input,topic:topic,progress:score(),distance_goal:Math.round(dist(nodes.paso,nodes.deseo)*100),distance_doubt:Math.round(dist(nodes.paso,nodes.duda)*100)});haptic(7);blip(430+score()*2,.05,"triangle",.035)}drag=null}
function onKey(e){if(!root.classList.contains("open"))return;if(e.key==="Escape"){e.preventDefault();close_();return}var n=e.target.closest&&e.target.closest("[data-node]");if(n&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].indexOf(e.key)>=0){e.preventDefault();var k=n.getAttribute("data-node"),d=e.shiftKey ? .01 : .035;if(e.key==="ArrowLeft")nodes[k].x-=d;if(e.key==="ArrowRight")nodes[k].x+=d;if(e.key==="ArrowUp")nodes[k].y-=d;if(e.key==="ArrowDown")nodes[k].y+=d;nodes[k].x=Math.max(.09,Math.min(.91,nodes[k].x));nodes[k].y=Math.max(.16,Math.min(.87,nodes[k].y));updateMap();capture("nudge",{result:k,input_type:"keyboard",topic:topic,progress:score()});return}if(e.key!=="Tab")return;var f=[].slice.call(root.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')).filter(function(el){return el.offsetParent!==null});if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
function onClick(e){var t=e.target.closest&&e.target.closest("[data-topic]"),l=e.target.closest&&e.target.closest("[data-lever]"),a=e.target.closest&&e.target.closest("[data-action]");if(t){chooseTopic(t.getAttribute("data-topic"));return}if(l){chooseLever(l.getAttribute("data-lever"));return}if(!a)return;var name=a.getAttribute("data-action");if(name==="close")close_();else if(name==="commit")commit();else if(name==="restart"||name==="redo"){topic=null;lever=null;committed=false;resetNodes();renderChoose()}else if(name==="card")renderCard();else if(name==="share")shareCard();else if(name==="save")saveCard();else if(name==="back")renderResult()}

window.MUTA_BRUJULA={open:open_,close:close_};
if(window.__brujulaAutoStart){window.__brujulaAutoStart=false;open_()}
})();
