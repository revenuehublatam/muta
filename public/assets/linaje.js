(function(){
"use strict";
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var addEnergy=API.addEnergy||function(){};
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};
var VPC=API.VPC||function(){return innerWidth<=720?"mobile":"desktop"};
var G=Number(API.generation)||35;
var GEN=API.GEN||"GEN-0000";
var ALIAS=API.ALIAS||"Anónimo";
var HISTORY=Array.isArray(API.history)?API.history.slice():[];
var KEY="muta_linaje_g35";
var WORLD={w:1900,h:1040};
var root=null,world=null,viewport=null,lastFocus=null,openedAt=0,selected=G,drag=null,scale=1,tx=0,ty=0,traceFired=false;
var pointers=new Map(),pinch=null;
var sessionVisited=new Set(),visited=new Set(),route=[];
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(saved&&Array.isArray(saved.visited))saved.visited.forEach(function(n){visited.add(Number(n))})}catch(e){}

var TITLES={
1:"Núcleo mutante",2:"El Cíclope",3:"Snake Dandi",4:"Sala de Mutación",5:"El Reactor",6:"Mundo fullscreen",7:"Archivo Vivo",8:"Juegos sin fin",9:"Ideas por revelar",10:"Atlas Vivo",11:"Máquina de Decirlo",12:"Ranking Vivo",13:"Carta de Gen",14:"Organismo Galáctico",15:"Archivo restaurado",16:"Huevo Estelar",17:"León jugable",18:"Laberinto Estelar",19:"Cielo Cultural",20:"Cielo Total",21:"Voz del Usuario",22:"Oráculo del León",23:"Carta del Oráculo",24:"Máquina del Tiempo",25:"Cocina del Tiempo",26:"La Crónica I",27:"La Crónica II",28:"Fogata de Viajeros",29:"Sendero de Brasas",30:"Taller de Prompts",31:"Rescate de Prompts",32:"Brújula Abisal",33:"Pulso de Ruta",34:"Pulso en Marcha",35:"Atlas de las 35 vidas"
};
var FORMS={organismo:{label:"ORGANISMO",color:"#83ffd0",icon:"◉"},participacion:{label:"PARTICIPACIÓN",color:"#ffcf72",icon:"✦"},juego:{label:"JUEGO",color:"#ff7f93",icon:"◆"},mapa:{label:"MAPA",color:"#77d8ff",icon:"⌖"},ritual:{label:"RITUAL",color:"#c9a6ff",icon:"◐"},herramienta:{label:"HERRAMIENTA",color:"#dfff72",icon:"▣"},narrativa:{label:"NARRATIVA",color:"#ff9f69",icon:"↗"}};
function formFor(n){
  if(n<=3||n===14||n===15||n===17)return "organismo";
  if((n>=4&&n<=6)||n===12||n===13||n===21)return "participacion";
  if((n>=7&&n<=9)||n===11||n===18)return "juego";
  if(n===10||n===19||n===20||n===35)return "mapa";
  if(n===16||n===22||n===23||n===24)return "ritual";
  if(n>=26&&n<=29)return "narrativa";
  return "herramienta";
}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function entryFor(n){for(var i=0;i<HISTORY.length;i++)if(Number(HISTORY[i].generacion)===n)return HISTORY[i];return {generacion:n,resumen:"Una vida anterior de MUTA. Su registro completo permanece en la bitácora pública."}}
function summaryFor(n){var e=entryFor(n),s=String(e.resumen||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();return s.length>440?s.slice(0,437)+"…":s}
function save(){try{localStorage.setItem(KEY,JSON.stringify({visited:Array.from(visited).sort(function(a,b){return a-b}),last:selected}))}catch(e){}}
function capture(action,extra){var p={action:action,generation:G,experience_id:"atlas-35-vidas",mode:"lineage-map",input_type:"button",viewport_class:VPC(),gene_origin:GEN,result:action};if(extra)Object.keys(extra).forEach(function(k){p[k]=extra[k]});cap("muta_linaje",p)}
function nodes(){var a=[];for(var n=1;n<=G;n++){var i=n-1,row=Math.floor(i/7),col=i%7,x=170+col*250+(row%2?100:0),y=170+row*170+Math.sin(n*1.43)*28;a.push({n:n,x:x,y:y,form:formFor(n)})}return a}
var NODES=nodes();
function nodeFor(n){for(var i=0;i<NODES.length;i++)if(NODES[i].n===n)return NODES[i];return NODES[NODES.length-1]}

var CSS='\
#linajeOvl{position:fixed;inset:0;z-index:175;display:none;background:#05070d;color:#f7f5ef;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden}\
#linajeOvl.open{display:block}\
#linajeOvl *{box-sizing:border-box}\
#linajeOvl button{font:inherit}\
#linajeOvl button:focus-visible{outline:3px solid #f7ff9c;outline-offset:3px}\
#linajeOvl .shell{height:100vh;height:100dvh;display:grid;grid-template-rows:auto minmax(0,1fr);padding:calc(10px + env(safe-area-inset-top)) clamp(10px,2vw,28px) calc(10px + env(safe-area-inset-bottom));background:radial-gradient(circle at 15% 12%,rgba(119,216,255,.14),transparent 26%),radial-gradient(circle at 87% 82%,rgba(201,166,255,.13),transparent 31%),#05070d}\
#linajeOvl .top{position:relative;z-index:4;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;padding-bottom:10px}\
#linajeOvl .sigil{width:52px;height:52px;display:grid;place-items:center;border:1px solid #77d8ff;border-radius:50%;background:#0b1420;color:#77d8ff;font:950 23px/1 ui-monospace,monospace;box-shadow:0 0 30px rgba(119,216,255,.2)}\
#linajeOvl .eyebrow{margin:0 0 3px;color:#77d8ff;font:850 9px/1.25 ui-monospace,monospace;letter-spacing:1.5px;text-transform:uppercase}\
#linajeOvl h1{margin:0;font-size:clamp(25px,3.2vw,46px);line-height:.92;letter-spacing:-1.8px}\
#linajeOvl .deck{margin:5px 0 0;color:#b8c2d3;font-size:clamp(10px,1.25vw,14px);line-height:1.35}\
#linajeOvl .close{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:#101621;color:#fff;cursor:pointer}\
#linajeOvl .main{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,390px);gap:12px}\
#linajeOvl .mapwrap{position:relative;min-height:0;overflow:hidden;border:1px solid rgba(255,255,255,.18);border-radius:26px;background:radial-gradient(circle at center,rgba(119,216,255,.07),transparent 58%),linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),#070b13;background-size:auto,42px 42px,42px 42px,auto;touch-action:none;cursor:grab}\
#linajeOvl .mapwrap.dragging{cursor:grabbing}\
#linajeOvl .world{position:absolute;left:0;top:0;width:1900px;height:1040px;transform-origin:0 0;will-change:transform}\
#linajeOvl .thread{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}\
#linajeOvl .thread path{fill:none;stroke:rgba(119,216,255,.26);stroke-width:4;stroke-linecap:round;stroke-dasharray:5 13}\
#linajeOvl .thread path.glow{stroke:rgba(223,255,114,.13);stroke-width:18;stroke-dasharray:none;filter:blur(6px)}\
#linajeOvl .era{position:absolute;color:rgba(255,255,255,.22);font:900 13px/1 ui-monospace,monospace;letter-spacing:3px;text-transform:uppercase;pointer-events:none}\
#linajeOvl .node{position:absolute;transform:translate(-50%,-50%);width:92px;height:92px;border:1px solid color-mix(in srgb,var(--c) 64%,#fff);border-radius:50%;background:#101722;color:#fff;display:grid;place-items:center;text-align:center;padding:7px;cursor:pointer;box-shadow:0 0 0 8px rgba(255,255,255,.025),0 12px 28px rgba(0,0,0,.35);transition:transform .18s,box-shadow .18s}\
#linajeOvl .node:hover,#linajeOvl .node.sel{transform:translate(-50%,-50%) scale(1.1);box-shadow:0 0 0 9px color-mix(in srgb,var(--c) 12%,transparent),0 0 34px color-mix(in srgb,var(--c) 26%,transparent)}\
#linajeOvl .node.seen:after{content:"✓";position:absolute;right:-2px;top:-2px;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#dfff72;color:#0c1208;font:950 11px ui-monospace,monospace}\
#linajeOvl .node.current{border-width:3px;animation:linajePulse 2.2s ease-in-out infinite}\
#linajeOvl .node b{display:block;color:var(--c);font:950 18px/1 ui-monospace,monospace}\
#linajeOvl .node small{display:block;margin-top:4px;font:800 8px/1.15 ui-monospace,monospace;letter-spacing:.3px}\
#linajeOvl .controls{position:absolute;left:12px;bottom:12px;z-index:3;display:flex;gap:7px}\
#linajeOvl .controls button{min-width:42px;height:42px;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:#101621;color:#fff;font-weight:900;cursor:pointer}\
#linajeOvl .hint{position:absolute;left:50%;top:12px;transform:translateX(-50%);z-index:3;margin:0;padding:7px 11px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(5,8,14,.9);color:#c7d0df;font:800 9px/1.2 ui-monospace,monospace;letter-spacing:.8px;white-space:nowrap;pointer-events:none}\
#linajeOvl .panel{min-height:0;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;border:1px solid rgba(255,255,255,.18);border-radius:26px;background:rgba(13,18,29,.97);padding:18px}\
#linajeOvl .form{display:inline-flex;align-items:center;gap:6px;color:var(--c);font:900 9px/1 ui-monospace,monospace;letter-spacing:1.2px}\
#linajeOvl .panel h2{margin:9px 0 8px;font-size:clamp(34px,4.5vw,58px);line-height:.88;letter-spacing:-2.5px}\
#linajeOvl .panel h2 span{color:var(--c)}\
#linajeOvl .summary{color:#c2cada;font-size:13px;line-height:1.52;margin:0 0 13px}\
#linajeOvl .metric{border-left:3px solid var(--c);padding:8px 0 8px 11px;color:#fff;font-size:11px;line-height:1.45;margin:12px 0}\
#linajeOvl .progress{height:8px;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.08);margin:14px 0 7px}\
#linajeOvl .progress i{display:block;height:100%;width:var(--p);background:linear-gradient(90deg,#77d8ff,#dfff72);border-radius:inherit;transition:width .25s}\
#linajeOvl .status{min-height:18px;color:#dfff72;font:800 9px/1.35 ui-monospace,monospace;letter-spacing:.4px}\
#linajeOvl .actions{display:grid;gap:8px;margin-top:14px}\
#linajeOvl .primary,#linajeOvl .secondary{border-radius:14px;padding:13px 14px;font-weight:900;cursor:pointer}\
#linajeOvl .primary{border:0;background:#dfff72;color:#111708;box-shadow:0 5px 0 #65752f}\
#linajeOvl .secondary{border:1px solid rgba(255,255,255,.26);background:#141b29;color:#fff}\
#linajeOvl .route{margin-top:14px;padding:13px;border:1px solid rgba(119,216,255,.25);border-radius:17px;background:#090f19}\
#linajeOvl .route h3{margin:0 0 8px;font:900 10px/1.2 ui-monospace,monospace;color:#77d8ff;letter-spacing:1px}\
#linajeOvl .chips{display:flex;flex-wrap:wrap;gap:5px}\
#linajeOvl .chip{border:1px solid rgba(255,255,255,.17);border-radius:999px;padding:5px 7px;color:#d9dfeb;font-size:9px}\
@keyframes linajePulse{0%,100%{box-shadow:0 0 0 8px rgba(119,216,255,.06),0 0 22px rgba(119,216,255,.2)}50%{box-shadow:0 0 0 15px rgba(119,216,255,.02),0 0 45px rgba(119,216,255,.4)}}\
@media(max-width:760px){#linajeOvl{overflow:auto}#linajeOvl .shell{height:auto;min-height:100vh;min-height:100dvh;overflow-y:auto;overflow-x:hidden;touch-action:pan-y;overscroll-behavior:contain;padding:calc(8px + env(safe-area-inset-top)) 9px calc(12px + env(safe-area-inset-bottom))}#linajeOvl .top{gap:8px}#linajeOvl .sigil{width:42px;height:42px;font-size:18px}#linajeOvl h1{font-size:25px}#linajeOvl .deck{font-size:10px}#linajeOvl .main{display:flex;flex-direction:column;overflow:visible}#linajeOvl .mapwrap{height:58vh;min-height:430px;flex:0 0 auto;border-radius:21px}#linajeOvl .panel{overflow:visible;border-radius:21px}#linajeOvl .panel h2{font-size:42px}#linajeOvl .hint{font-size:8px;max-width:calc(100% - 18px);white-space:normal;text-align:center}}\
@media(prefers-reduced-motion:reduce){#linajeOvl *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}';

function header(){return '<header class="top"><div class="sigil" aria-hidden="true">⌖</div><div><p class="eyebrow">MUTA · GEN '+G+' · mapa vivo</p><h1>El Atlas de las '+G+' vidas</h1><p class="deck">Explora '+G+' vidas. Abre tres. Elige una para pedir que vuelva mañana.</p></div><button class="close" data-action="close" aria-label="Cerrar El Atlas de las '+G+' vidas">✕</button></header>'}
function pathD(){return NODES.map(function(n,i){return (i?'L':'M')+n.x+' '+n.y}).join(' ')}
function nodeHtml(n){var f=FORMS[n.form],title=TITLES[n.n]||('Vida '+n.n);return '<button class="node '+(visited.has(n.n)?'seen ':'')+(n.n===G?'current ':'')+'" data-gen="'+n.n+'" style="left:'+n.x+'px;top:'+n.y+'px;--c:'+f.color+'" aria-label="Gen '+n.n+': '+esc(title)+'"><span><b>'+n.n+'</b><small>'+esc(title)+'</small></span></button>'}
function worldHtml(){return '<svg class="thread" viewBox="0 0 '+WORLD.w+' '+WORLD.h+'" aria-hidden="true"><path class="glow" d="'+pathD()+'"/><path d="'+pathD()+'"/></svg><span class="era" style="left:80px;top:66px">ORIGEN · 1—9</span><span class="era" style="left:980px;top:410px">EXPANSIÓN · 10—23</span><span class="era" style="left:560px;top:910px">PROFUNDIDAD · 24—'+G+'</span>'+NODES.map(nodeHtml).join('')}
function build(){if(root)return;var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);root=document.createElement('section');root.id='linajeOvl';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','El Atlas de las '+G+' vidas de MUTA');root.innerHTML='<main class="shell">'+header()+'<section class="main"><div class="mapwrap" id="linajeViewport" aria-label="Mapa arrastrable de las generaciones de MUTA"><p class="hint">ARRASTRA PARA VIAJAR · TOCA UNA VIDA · ± PARA ACERCAR</p><div class="world" id="linajeWorld">'+worldHtml()+'</div><div class="controls" aria-label="Controles del mapa"><button data-action="zoom-in" aria-label="Acercar">＋</button><button data-action="zoom-out" aria-label="Alejar">－</button><button data-action="center" aria-label="Centrar en la vida actual">◎</button></div></div><aside class="panel" id="linajePanel"></aside></section></main>';document.body.appendChild(root);viewport=root.querySelector('#linajeViewport');world=root.querySelector('#linajeWorld');root.addEventListener('click',onClick);root.addEventListener('keydown',onKey);viewport.addEventListener('pointerdown',onPointerDown);viewport.addEventListener('pointermove',onPointerMove);viewport.addEventListener('pointerup',onPointerUp);viewport.addEventListener('pointercancel',onPointerUp);viewport.addEventListener('wheel',onWheel,{passive:false});document.addEventListener('visibilitychange',onVisibility)}
function applyTransform(){if(world)world.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')'}
function centerOn(n,animate){if(!viewport)return;var p=nodeFor(n),r=viewport.getBoundingClientRect();scale=Math.max(.48,Math.min(1.05,r.width<650?.55:.75));tx=r.width/2-p.x*scale;ty=r.height/2-p.y*scale;if(!animate||API.REDUCED)world.style.transition='none';else world.style.transition='transform .42s cubic-bezier(.2,.8,.2,1)';applyTransform();setTimeout(function(){if(world)world.style.transition=''},450)}
function setScale(next,cx,cy){if(!viewport)return;var r=viewport.getBoundingClientRect(),px=(cx==null?r.width/2:cx-r.left),py=(cy==null?r.height/2:cy-r.top),old=scale;scale=Math.max(.36,Math.min(1.45,next));tx=px-(px-tx)*(scale/old);ty=py-(py-ty)*(scale/old);applyTransform()}
function visit(n,input){n=Math.max(1,Math.min(G,Number(n)||G));selected=n;var first=!sessionVisited.has(n);sessionVisited.add(n);visited.add(n);route=route.filter(function(x){return x!==n});route.push(n);route=route.slice(-5);save();root.querySelectorAll('.node').forEach(function(b){var bn=Number(b.dataset.gen);b.classList.toggle('sel',bn===n);b.classList.toggle('seen',visited.has(bn))});if(first){var f=formFor(n);capture('inspect',{result:'gen-'+n,node_generation:n,node_form:f,input_type:input||'button',distinct_nodes:sessionVisited.size});haptic(10);blip(420+n*7,.07,'sine',.035)}if(sessionVisited.size>=3&&!traceFired){traceFired=true;capture('trace',{result:'three-lives',distinct_nodes:sessionVisited.size,route:route.join('-')});addEnergy(3,'linaje_explorado');haptic([12,20,28]);blip(880,.16,'sine',.07)}renderPanel()}
function renderPanel(){var n=nodeFor(selected),f=FORMS[n.form],pct=Math.min(100,Math.round(sessionVisited.size/3*100)),traced=sessionVisited.size>=3;var routeHtml=traced?'<div class="route"><h3>TU TRAZA YA EXISTE</h3><div class="chips">'+route.map(function(x){return '<span class="chip">GEN '+x+' · '+esc(TITLES[x]||'Vida')+'</span>'}).join('')+'</div></div>':'';root.querySelector('#linajePanel').innerHTML='<p class="form" style="--c:'+f.color+'">'+f.icon+' '+f.label+' · GEN '+selected+'</p><h2 style="--c:'+f.color+'"><span>'+selected+'</span> · '+esc(TITLES[selected]||('Vida '+selected))+'</h2><p class="summary">'+esc(summaryFor(selected))+'</p><p class="metric" style="--c:'+f.color+'">Decisión autónoma Gen 35: el Atlas histórico reunió 24 personas arrastrando y 19 abriendo señales. La ventana Gen 34 solo tuvo smoke técnico; por eso hoy MUTA prueba exploración e influencia, no otra herramienta de decisión.</p><div class="progress" aria-hidden="true"><i style="--p:'+pct+'%"></i></div><div class="status" aria-live="polite">'+(traced?'TRAZA ABIERTA · ahora puedes pedir un regreso o compartirla':sessionVisited.size+' de 3 vidas abiertas · faltan '+(3-sessionVisited.size))+'</div>'+routeHtml+'<div class="actions"><button class="primary" data-action="reactivate">Pedir que vuelva esta vida</button><button class="secondary" data-action="share" '+(traced?'':'disabled')+'>Compartir mi traza</button><button class="secondary" data-action="next">Abrir la vida siguiente</button></div><p class="summary" style="margin-top:14px;font-size:10px">El radar de vuelos comerciales de GEN Hipnótico sigue pendiente: este Atlas no finge datos externos ni reemplaza esa solicitud.</p>'}
function open_(){build();lastFocus=document.activeElement;root.classList.add('open');document.documentElement.style.overflow='hidden';openedAt=Date.now();try{localStorage.setItem('muta_seen_gen',String(G))}catch(e){}capture('open',{result:visited.size?'return':'new',saved_nodes:visited.size});cap('muta_mode_switch',{mode:'lineage-map',generation:G,experience_id:'atlas-35-vidas',viewport_class:VPC(),gene_origin:GEN});selected=Number((function(){try{return JSON.parse(localStorage.getItem(KEY)||'{}').last}catch(e){return G}})())||G;renderPanel();setTimeout(function(){centerOn(selected,false);var b=root.querySelector('[data-gen="'+selected+'"]');if(b){b.classList.add('sel');b.focus()}},45)}
function close_(){if(!root)return;root.classList.remove('open');document.documentElement.style.overflow='';capture('close',{result:'closed',active_seconds:Math.max(0,Math.round((Date.now()-openedAt)/1000)),distinct_nodes:sessionVisited.size});if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function reactivate(){var title=TITLES[selected]||('la vida '+selected),text='Quiero que vuelva '+title+' (Gen '+selected+'), reinterpretado para la próxima mutación.';capture('choose',{result:'reactivate',node_generation:selected,node_form:formFor(selected),distinct_nodes:sessionVisited.size});addEnergy(2,'linaje_eleccion');if(API.prefillProposal){close_();API.prefillProposal(text,'Transformación','linaje-gen-'+selected)}else{status('Abre “Pide el cambio” y solicita el regreso de Gen '+selected+'.')}}
function copyText(t){if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t);return new Promise(function(resolve,reject){var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')?resolve():reject()}catch(e){reject(e)}document.body.removeChild(ta)})}
function share(){if(sessionVisited.size<3)return;var names=route.slice(-3).map(function(n){return 'Gen '+n+' '+(TITLES[n]||'')}).join(' → '),url='https://muta.revenuehub.cloud/?g='+encodeURIComponent(GEN),txt='Abrí una traza entre '+names+'. Explora las '+G+' vidas de MUTA y elige cuál debería volver: '+url;capture('share',{result:'attempt',route:route.join('-'),distinct_nodes:sessionVisited.size});cap('muta_share',{red:'linaje_ruta',gen:GEN,generation:G,mode:'lineage-map',experience_id:'atlas-35-vidas',viewport_class:VPC(),gene_origin:GEN});if(navigator.share)navigator.share({title:'Mi traza en MUTA',text:txt,url:url}).then(function(){status('Traza compartida.')},function(){});else copyText(txt).then(function(){status('Traza y enlace copiados.')},function(){status('No pude copiar la traza.',true)})}
function status(msg,bad){var s=root&&root.querySelector('.status');if(s){s.textContent=msg;s.style.color=bad?'#ff8998':'#dfff72'}}
function onClick(e){var node=e.target.closest&&e.target.closest('[data-gen]'),a=e.target.closest&&e.target.closest('[data-action]');if(node){visit(node.dataset.gen,'button');return}if(!a)return;var k=a.dataset.action;if(k==='close')close_();else if(k==='zoom-in')setScale(scale*1.18);else if(k==='zoom-out')setScale(scale/1.18);else if(k==='center')centerOn(G,true);else if(k==='reactivate')reactivate();else if(k==='share')share();else if(k==='next'){var n=selected>=G?1:selected+1;visit(n,'button');centerOn(n,true)}}
function onPointerDown(e){if(e.target.closest&&e.target.closest('button'))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(viewport.setPointerCapture)try{viewport.setPointerCapture(e.pointerId)}catch(err){}if(pointers.size===1){drag={x:e.clientX,y:e.clientY,tx:tx,ty:ty};viewport.classList.add('dragging')}else if(pointers.size===2){var p=Array.from(pointers.values());pinch={distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),scale:scale}}}
function onPointerMove(e){if(!pointers.has(e.pointerId))return;e.preventDefault();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>=2&&pinch){var p=Array.from(pointers.values()),d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),mx=(p[0].x+p[1].x)/2,my=(p[0].y+p[1].y)/2;setScale(pinch.scale*(d/Math.max(1,pinch.distance)),mx,my)}else if(drag){tx=drag.tx+(e.clientX-drag.x);ty=drag.ty+(e.clientY-drag.y);applyTransform()}}
function onPointerUp(e){pointers.delete(e.pointerId);if(pointers.size<2)pinch=null;if(!pointers.size){drag=null;if(viewport)viewport.classList.remove('dragging')}}
function onWheel(e){e.preventDefault();setScale(scale*(e.deltaY<0?1.1:.9),e.clientX,e.clientY)}
function onVisibility(){if(document.hidden&&root&&root.classList.contains('open'))capture('visibility',{result:'hidden',active_seconds:Math.max(0,Math.round((Date.now()-openedAt)/1000)),distinct_nodes:sessionVisited.size})}
function onKey(e){if(!root.classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();close_();return}var active=document.activeElement;if(active&&active.classList.contains('node')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key)>=0){e.preventDefault();var step=(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:1,n=Math.max(1,Math.min(G,Number(active.dataset.gen)+step)),b=root.querySelector('[data-gen="'+n+'"]');if(b){b.focus();visit(n,'keyboard');centerOn(n,true)}return}if(e.key!=='Tab')return;var focusable=[].slice.call(root.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')).filter(function(el){return el.offsetParent!==null});if(!focusable.length)return;var first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}

window.MUTA_LINAJE={open:open_,close:close_};
if(window.__linajeAutoStart){window.__linajeAutoStart=false;open_()}
})();
