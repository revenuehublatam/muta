/* ============ LA CRÓNICA — Capítulo 2: Las Afueras de Villa Gen ============
   Gen 27. Nacida de GEN Rebelde (dos susurros del 18-ago tras completar el Cap. 1):
   1) «el segundo capítulo debería ser una experiencia en primera persona como
      Might and Magic V: Darkside of Xeen donde vas avanzando y hay una ciudad
      y alrededor de ella hay monstruos. En tu party puedes invitar a otros
      genes para jugar contigo, y reciben una invitación»
   2) «cambia el escenario, por ejemplo un bosque, y que tenga música pixel art»
   → Primera persona por casillas, ciudad (Villa Gen) rodeada de bosque con
   monstruos, party de genes (reclutas del ADN inmortalizado + invitación real
   por enlace), música chiptune opcional y el Heraldo del Devorador como jefe.
   Gen 28 (decisión autónoma sobre datos de Gen 27: 33% inició, 0% completó,
   el viajero abandonó a mitad del bosque): LA FOGATA DE LOS VIAJEROS — un
   campamento real en el camino al Heraldo donde descansas (+PV), lees las
   huellas que dejaron otros viajeros reales (endpoint /fogata, honesto sobre
   su memoria temporal) y dejas la tuya con tu gen. Avanzar ▲ ahora se puede
   mantener presionado. Módulo lazy. Sin secretos. El Cap. 3 se escribe con susurros.
   Gen 29 (decisión autónoma sobre datos de Gen 28: el único viajero usó la fogata
   completa, dejó la primera huella real y ganó 7 combates, pero cerró a ~5 casillas
   del Heraldo tras abrir el minimapa 8 veces buscando el rumbo): EL SENDERO DE
   BRASAS — al descansar en la fogata, brasas reales (BFS por el bosque) marcan el
   camino al claro del Heraldo en primera persona y en el minimapa; si viajas sin
   party, la BRASA VIAJERA se ofrece como aliada junto al fuego; y vencer al Heraldo
   ahora genera LA CRÓNICA DEL VIAJERO: una carta personal firmada con tu gen,
   descargable y compartible (lo único que la gente compartió orgánicamente fueron
   objetos personales firmados). */
(function(){
"use strict";
if(window.MUTA_C2)return;
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var addEnergy=API.addEnergy||function(){};
var esc=API.esc||function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var GEN=API.GEN||"GEN-0000";
var VPC=API.VPC||function(){return window.innerWidth<=720?"mobile":"desktop"};
var REDUCED=!!API.REDUCED;
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};
var LSg=function(k){try{return localStorage.getItem(k)}catch(e){return null}};
var LSs=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
function ev(action,extra){var p={action:action,experience_id:"rpg",chapter:2,viewport_class:VPC(),gene_origin:"GEN-0866"};if(extra)for(var k in extra)p[k]=extra[k];cap("muta_rpg",p)}

/* ---------- mundo: 23x23 hecho a mano ----------
   T=árbol ~=agua #=muralla .=claro/sendero
   S=inicio (puerta de la ciudad) C=interior ciudad N=posada Q=plaza de genes
   e=Zorro de Ruido w=Seta Gritona a=Astilla del Devorador
   P=poción R=reliquia B=claro del Heraldo F=Fogata de los Viajeros (Gen 28) */
var MAPA=[
"TTTTTTTTTTTTTTTTTTTTTTT",
"T....T...T....T..P...TT",
"T.TT...w....T...TTT.a.T",
"T.T..TTTT.e...T.T~~T..T",
"T...T....T..TT..T~~T.TT",
"TT.e..TT..w....T..T...T",
"T...T....TTT.TTT...e..T",
"T.TT...T..........TT..T",
"T.....a..#####..w.....T",
"T.TTT....#CCC#....TT.TT",
"T..P..e..#CNQ#..a...R.T",
"T.T......#CCC#......T.T",
"T.TT..w..##S##..e..TT.T",
"T...T.......e...TT....T",
"TT..e..TT....w...T..a.T",
"T..T...T~~T....TT.TT..T",
"T.TTT.e.T~~T.TT..e.F..T",
"T..R......T...T....TTTT",
"TT...TT.a...e...TT....T",
"T..w....TT...TT...e.B.T",
"T....T.....w....T.....T",
"TT..T..T....T...T..P.TT",
"TTTTTTTTTTTTTTTTTTTTTTT"];

/* ---------- bestiario del bosque (intenciones visibles, marca del Cap. 1) ---------- */
var FOES={
 e:{n:"Zorro de Ruido",em:"🦊",hp:10,atk:3,xp:6,
    plan:function(t){var r=(t*7)%10;return r<6?{k:"hit",txt:"baja las orejas: va a morder"}:r<8?{k:"skip",txt:"ladra estática, confundido"}:{k:"dust",txt:"levanta polvo de píxeles (tu próximo golpe hará menos daño)"}}},
 w:{n:"Seta Gritona",em:"🍄",hp:13,atk:2,xp:8,
    plan:function(t){return t%3===2?{k:"big",txt:"⚠ infla el sombrero: GRITO DE ESPORAS (defiéndete)"}:{k:"hit",txt:"escupe una espora silbante"}}},
 a:{n:"Astilla del Devorador",em:"🕳️",hp:16,atk:4,xp:11,
    plan:function(t){return t%2===0?{k:"guard",txt:"se endurece: si la atacas ahora, contraataca"}:{k:"hit",txt:"lanza un mordisco de sombra"}}},
 B:{n:"El Heraldo del Devorador",em:"🌑",hp:44,atk:5,xp:40,boss:true,
    plan:function(t,self){var f2=self.hp<=22;if(f2&&t%2===1)return{k:"big",txt:"⚠ abre un cielo sin estrellas: ECLIPSE (defiéndete)"};if(!f2&&t%3===2)return{k:"big",txt:"⚠ toma aire del bosque entero: ECLIPSE (defiéndete)"};return{k:"hit",txt:"azota con una rama robada"}}}};

/* ---------- aliados: los genes inmortalizados del ADN + el gen que te invitó ---------- */
var ALIADOS=[
 {id:"fosfo",gen:"GEN Fosforescente",em:"💡",skill:"Brillo vital",d:"cura 8 PV",cd:3,fx:function(H,F,log){H.hp=Math.min(H.maxhp,H.hp+8);log("💡 GEN Fosforescente ilumina: +8 PV.")}},
 {id:"voraz",gen:"GEN Voraz",em:"🕳",skill:"Bocado",d:"7 de daño",cd:3,fx:function(H,F,log){F.hp-=7;log("🕳 GEN Voraz da un bocado: 7 de daño.")}},
 {id:"sigilo",gen:"GEN Sigiloso",em:"🌫",skill:"Niebla",d:"esquivas el próximo golpe",cd:4,fx:function(H,F,log){H.veil=true;log("🌫 GEN Sigiloso te envuelve: esquivarás el próximo golpe.")}},
 {id:"salvaje",gen:"GEN Salvaje",em:"🐾",skill:"Zarpazo",d:"5 de daño y aturde",cd:4,fx:function(H,F,log){F.hp-=5;F.stun=true;log("🐾 GEN Salvaje aturde al enemigo: pierde su turno.")}},
 {id:"rebelde",gen:"GEN Rebelde",em:"⚔️",skill:"Doble filo",d:"2 golpes de 4",cd:3,fx:function(H,F,log){F.hp-=8;log("⚔️ GEN Rebelde golpea dos veces: 8 de daño.")}},
 {id:"magnet",gen:"GEN Magnético",em:"🧲",skill:"Imán",d:"el enemigo pierde 2 ATQ",cd:4,fx:function(H,F,log){F.atk=Math.max(1,F.atk-2);log("🧲 GEN Magnético debilita: el enemigo pierde 2 ATQ.")}}];

/* ---------- estado ---------- */
var SAVE_KEY="muta_rpg_c2";
var DIRS=[[0,-1],[1,0],[0,1],[-1,0]]; /* N E S O */
var DIRN=["norte","este","sur","oeste"];
var G={open:false,raf:0,grid:[],W:23,Hh:23,x:11,y:12,dir:2,hero:null,foes:[],items:[],seen:{},combat:null,turnCount:0,msg:"",done:false,kills:0,deaths:0,t:0,bob:0,party:[],cds:{},invited:false,inviterGen:null,steps:0,mini:false,music:false,trailLit:false,trail:{}};
/* Gen 29: la Brasa Viajera — aliada de la fogata para quien viaja sin party */
var BRASA={id:"brasa",gen:"La Brasa Viajera",em:"🔥",skill:"Chispa",d:"5 de daño y +2 PV",cd:3,fx:function(H,F,lg){F.hp-=5;H.hp=Math.min(H.maxhp,H.hp+2);lg("🔥 La Brasa Viajera chisporrotea: 5 de daño y te abriga (+2 PV).")}};

function newHero(){
  var h={hp:26,maxhp:26,atk:4,def:1,pots:2,xp:0,lvl:1,veil:false,dusted:false,scar:false};
  try{var c1=JSON.parse(LSg("muta_rpg_c1")||"null");
    if(c1&&c1.done){h.atk+=1;h.scar=true}}catch(e){}
  return h}
function save(){try{LSs(SAVE_KEY,JSON.stringify({x:G.x,y:G.y,dir:G.dir,hero:G.hero,party:G.party.map(function(a){return a.id}),foesDead:G.foes.filter(function(f){return f.dead}).map(function(f){return f.ix}),itemsUsed:G.items.filter(function(i){return i.used}).map(function(i){return i.ix}),done:G.done,kills:G.kills,deaths:G.deaths,invited:G.invited,steps:G.steps,trailLit:G.trailLit}))}catch(e){}}
function load(){try{var d=JSON.parse(LSg(SAVE_KEY)||"null");if(d&&d.hero)return d}catch(e){}return null}

/* ---------- DOM ---------- */
var css="#c2Wrap{position:fixed;inset:0;z-index:1200;display:none;background:#03100a;color:#fff;font-family:inherit;overflow:hidden;touch-action:none}"+
"#c2Wrap.open{display:block}"+
"#c2Cv{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges}"+
"#c2Top{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));left:8px;right:8px;display:flex;align-items:center;gap:6px;z-index:4;pointer-events:none;flex-wrap:wrap}"+
"#c2Top .pill{background:rgba(4,16,10,.9);border:1px solid rgba(190,255,205,.3);border-radius:12px;padding:6px 10px;font-size:11.5px;font-weight:700;letter-spacing:.3px;pointer-events:auto}"+
"#c2Hp{min-width:118px}#c2HpBar{height:6px;border-radius:4px;background:rgba(255,255,255,.15);margin-top:4px;overflow:hidden}#c2HpFill{height:100%;background:linear-gradient(90deg,#ff5d7a,#b6ff9e);width:100%;transition:width .25s}"+
"#c2X{margin-left:auto;background:rgba(4,16,10,.9);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:12px;padding:8px 12px;font-size:14px;font-weight:800;cursor:pointer;pointer-events:auto}"+
"#c2Party{position:absolute;top:calc(52px + env(safe-area-inset-top,0px));right:8px;z-index:4;display:flex;flex-direction:column;gap:4px;pointer-events:none}"+
"#c2Party .al{background:rgba(4,16,10,.88);border:1px solid rgba(190,255,205,.35);border-radius:10px;padding:4px 8px;font-size:10.5px;font-weight:700}"+
"#c2Log{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(118px + env(safe-area-inset-bottom,0px));z-index:4;background:rgba(4,16,10,.92);border:1px solid rgba(190,255,205,.28);border-radius:12px;padding:8px 14px;font-size:12.5px;max-width:92%;text-align:center;pointer-events:none}"+
"#c2Pad{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:5;display:flex;gap:8px;background:rgba(4,14,9,.94);border:1px solid rgba(190,255,205,.3);border-radius:16px;padding:9px}"+
"#c2Pad button{background:#123324;border:1px solid rgba(190,255,205,.4);color:#eaffe9;border-radius:12px;padding:13px 15px;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;min-width:54px}"+
"#c2Pad button:active{transform:scale(.93)}"+
"#c2Side{position:absolute;left:8px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:5;display:flex;flex-direction:column;gap:6px}"+
"#c2Side button{background:rgba(4,14,9,.94);border:1px solid rgba(190,255,205,.35);color:#eaffe9;border-radius:12px;padding:9px 11px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit}"+
"#c2Combat{position:absolute;inset:0;z-index:6;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(2,8,5,.86);padding:14px}"+
"#c2Combat.on{display:flex}"+
"#c2Combat .arena{background:#0b2417;border:1px solid rgba(190,255,205,.35);border-radius:18px;padding:18px 16px;max-width:440px;width:100%;text-align:center;max-height:88vh;overflow-y:auto;-webkit-overflow-scrolling:touch}"+
"#c2Combat .foe{font-size:52px;margin:4px 0}"+
"#c2Combat .bar{height:8px;border-radius:5px;background:rgba(255,255,255,.15);overflow:hidden;margin:6px auto;max-width:280px}"+
"#c2Combat .bar>div{height:100%;background:linear-gradient(90deg,#ff5d7a,#ffb46a);transition:width .3s}"+
"#c2Combat .intent{font-size:12.5px;color:#ffe9a8;background:rgba(60,40,6,.5);border:1px solid rgba(255,220,140,.35);border-radius:10px;padding:7px 10px;margin:8px 0}"+
"#c2Combat .clog{font-size:12.5px;color:#cfeedd;min-height:34px;margin:6px 0;line-height:1.45}"+
"#c2Combat .acts{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-top:8px}"+
"#c2Combat .acts button{background:#1c4a30;border:1px solid rgba(190,255,205,.45);color:#fff;border-radius:12px;padding:12px 13px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;min-width:76px}"+
"#c2Combat .acts button:disabled{opacity:.35}#c2Combat .acts button:active{transform:scale(.94)}"+
"#c2Modal{position:absolute;inset:0;z-index:7;display:none;align-items:center;justify-content:center;background:rgba(2,6,4,.84);padding:16px}"+
"#c2Modal.on{display:flex}"+
"#c2Modal .card{background:#0d2818;border:1px solid rgba(190,255,205,.35);border-radius:18px;padding:22px 20px;max-width:430px;width:100%;text-align:center;max-height:84vh;overflow-y:auto;-webkit-overflow-scrolling:touch}"+
"#c2Modal h3{margin:0 0 10px;font-size:18px}#c2Modal p{font-size:13.5px;line-height:1.55;color:#d7f2df;margin:8px 0}"+
"#c2Modal .big{font-size:44px;margin:6px 0}"+
"#c2Modal button{background:#1c4a30;border:1px solid rgba(190,255,205,.5);color:#fff;border-radius:12px;padding:12px 15px;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;margin:6px 4px 0}"+
"#c2Modal button:active{transform:scale(.95)}"+
"#c2Modal .aliRow{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.06);border:1px solid rgba(190,255,205,.25);border-radius:12px;padding:9px 10px;margin:7px 0;text-align:left}"+
"#c2Modal .aliRow .e{font-size:24px}#c2Modal .aliRow .t{flex:1;font-size:12.5px;line-height:1.4}"+
"#c2Modal .aliRow button{margin:0;padding:9px 12px;font-size:12px}"+
"@media (max-width:720px){#c2Pad button{min-width:50px;padding:12px 12px}#c2Side button{font-size:12px}}";
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
var wrap=document.createElement("div");wrap.id="c2Wrap";
wrap.innerHTML='<canvas id="c2Cv"></canvas>'+
'<div id="c2Top"><div class="pill" id="c2Loc"></div><div class="pill" id="c2Hp">❤️ <span id="c2HpT"></span><div id="c2HpBar"><div id="c2HpFill"></div></div></div><div class="pill" id="c2Stats"></div><button id="c2X" aria-label="Salir del Capítulo 2">✕</button></div>'+
'<div id="c2Party" aria-label="Tu party"></div>'+
'<div id="c2Log" aria-live="polite"></div>'+
'<div id="c2Side"><button id="c2Mini" aria-label="Ver mapa">🗺️</button><button id="c2Music" aria-label="Música pixel">🎵</button></div>'+
'<div id="c2Pad"><button id="c2L" aria-label="Girar a la izquierda">↰</button><button id="c2F" aria-label="Avanzar">▲</button><button id="c2B" aria-label="Retroceder">▼</button><button id="c2R" aria-label="Girar a la derecha">↱</button></div>'+
'<div id="c2Combat" role="dialog" aria-modal="true" aria-label="Combate"><div class="arena"><div id="c2FoeName" style="font-weight:800;font-size:15px"></div><div class="foe" id="c2FoeEm"></div><div class="bar"><div id="c2FoeHp"></div></div><div class="intent" id="c2Intent"></div><div class="clog" id="c2CLog"></div><div class="acts" id="c2Acts"></div></div></div>'+
'<div id="c2Modal"><div class="card" id="c2Card"></div></div>';
document.body.appendChild(wrap);
function $(s){return wrap.querySelector(s)}
var cv=$("#c2Cv"),ctx=cv.getContext("2d");
var off=document.createElement("canvas");off.width=256;off.height=168;var octx=off.getContext("2d");

/* ---------- música chiptune (opcional, WebAudio propio, sin assets) ---------- */
var AC=null,musicTimer=null,musStep=0;
var BASS=[0,0,3,3,5,5,3,3],ARP=[[0,4,7],[0,4,7],[3,7,10],[3,7,10],[5,9,12],[5,9,12],[3,7,10],[3,7,10]];
function nfreq(semi){return 220*Math.pow(2,semi/12)}
function beep(freq,dur,type,vol,when){var o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.value=freq;gn.gain.setValueAtTime(vol,when);gn.gain.exponentialRampToValueAtTime(0.0001,when+dur);o.connect(gn);gn.connect(AC.destination);o.start(when);o.stop(when+dur+0.02)}
function musicTick(){if(!G.music||!G.open)return;var t=AC.currentTime+0.05;var b=BASS[musStep%8],arp=ARP[musStep%8];
  beep(nfreq(b-24),0.22,"triangle",0.05,t);
  for(var i=0;i<3;i++)beep(nfreq(arp[(musStep+i)%3]),0.09,"square",0.022,t+i*0.083);
  musStep++;musicTimer=setTimeout(musicTick,250)}
function musicToggle(){
  if(G.music){G.music=false;clearTimeout(musicTimer);$("#c2Music").textContent="🎵";log("Música pixel apagada.");return}
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume()}catch(e){log("Tu navegador no dejó encender la música.");return}
  G.music=true;$("#c2Music").textContent="🔇";log("🎵 Música pixel encendida.");musicTick();ev("music_on")}

/* ---------- log ---------- */
var logT=null;
function log(t){$("#c2Log").innerHTML=t;$("#c2Log").style.display="block";clearTimeout(logT);logT=setTimeout(function(){if(!G.combat)$("#c2Log").style.display="none"},5200)}

/* ---------- construir mundo ---------- */
function buildWorld(){
  G.grid=[];G.foes=[];G.items=[];
  for(var y=0;y<G.Hh;y++){var row=[];var line=MAPA[y];
    for(var x=0;x<G.W;x++){var c=line[x]||"T";
      if(c==="e"||c==="w"||c==="a"||c==="B"){G.foes.push({ix:G.foes.length,x:x,y:y,t:c,hp:FOES[c].hp,atk:FOES[c].atk,dead:false,stun:false});row.push(".")}
      else if(c==="P"||c==="R"){G.items.push({ix:G.items.length,x:x,y:y,t:c,used:false});row.push(".")}
      else if(c==="S"){G.x=x;G.y=y;row.push("G")}
      else row.push(c)}
    G.grid.push(row)}}
function cell(x,y){if(x<0||y<0||x>=G.W||y>=G.Hh)return"T";return G.grid[y][x]}
function walkable(c){return c==="."||c==="C"||c==="N"||c==="Q"||c==="G"||c==="F"}
function foeAt(x,y){for(var i=0;i<G.foes.length;i++){var f=G.foes[i];if(!f.dead&&f.x===x&&f.y===y)return f}return null}
/* Gen 29: EL SENDERO DE BRASAS — BFS real de la fogata al claro del Heraldo.
   Se enciende al descansar en la fogata; sin teletransportes ni atajos falsos. */
function computeTrail(){
  var fx=-1,fy=-1,bx=-1,by=-1,y,x;
  for(y=0;y<G.Hh;y++)for(x=0;x<G.W;x++){
    if(cell(x,y)==="F"){fx=x;fy=y}}
  for(var i=0;i<G.foes.length;i++)if(G.foes[i].t==="B"){bx=G.foes[i].x;by=G.foes[i].y}
  G.trail={};
  if(fx<0||bx<0)return;
  var prev={},q=[[fx,fy]],seen={};seen[fx+"_"+fy]=true;
  while(q.length){
    var c=q.shift();
    if(c[0]===bx&&c[1]===by)break;
    for(var d=0;d<4;d++){
      var nx=c[0]+DIRS[d][0],ny=c[1]+DIRS[d][1],k=nx+"_"+ny;
      if(seen[k]||!walkable(cell(nx,ny)))continue;
      seen[k]=true;prev[k]=c;q.push([nx,ny])}}
  var cur=[bx,by],key=bx+"_"+by;
  if(!prev[key]&&!(fx===bx&&fy===by))return;
  while(cur&&!(cur[0]===fx&&cur[1]===fy)){G.trail[cur[0]+"_"+cur[1]]=true;cur=prev[cur[0]+"_"+cur[1]]}
  G.trail[fx+"_"+fy]=true}
function itemAt(x,y){for(var i=0;i<G.items.length;i++){var it=G.items[i];if(!it.used&&it.x===x&&it.y===y)return it}return null}

/* ---------- render primera persona (pixel, 4 profundidades) ---------- */
var PAL={sky1:"#0e2b3f",sky2:"#1d4a3a",ground:"#173a22",path:"#2b5a33",tree:["#0a2413","#123821","#1c5030","#2a6b41"],trunk:["#1d130a","#2a1c0e","#3a2812","#4d3618"],wall:["#3a3f4a","#4c525f","#5e6575","#737b8d"],water:["#0c2f4a","#154a6b","#1f6a92","#2b8ab8"]};
function shade(hex,f){var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return"rgb("+Math.round(r*f)+","+Math.round(g*f)+","+Math.round(b*f)+")"}
function render(){
  var W=off.width,H=off.height,o=octx;
  var inCity=cell(G.x,G.y)!=="."&&cell(G.x,G.y)!=="G";
  /* cielo y suelo */
  var grd=o.createLinearGradient(0,0,0,H*0.55);grd.addColorStop(0,PAL.sky1);grd.addColorStop(1,PAL.sky2);
  o.fillStyle=grd;o.fillRect(0,0,W,H*0.55);
  o.fillStyle="#e8f6c8";o.fillRect(W*0.78,H*0.09,7,7); /* sol pixel */
  o.fillStyle=PAL.ground;o.fillRect(0,H*0.55,W,H*0.45);
  var bob=(REDUCED||!G.bob)?0:Math.round(Math.sin(G.t/3)*1.5);
  var dx=DIRS[G.dir][0],dy=DIRS[G.dir][1],px=DIRS[(G.dir+1)%4][0],py=DIRS[(G.dir+1)%4][1];
  /* perfil de casillas por profundidad z=3..0, lateral s=-2..2 */
  var ZW=[0.06,0.14,0.30,0.62],ZH=[0.10,0.20,0.42,0.86]; /* ancho/alto relativo por z (0=cerca) */
  var ORDER=[2,-2,1,-1,0]; /* bordes primero, centro al final */
  for(var z=3;z>=0;z--){
    var wx=G.x+dx*(z+1),wy=G.y+dy*(z+1);
    for(var si=0;si<ORDER.length;si++){
      var s=ORDER[si];
      var cx0=wx+px*s,cy0=wy+py*s;
      var c=cell(cx0,cy0);
      var cw=ZW[3-z]*W,ch=ZH[3-z]*H;
      var SPREAD=[0.085,0.14,0.22,0.36]; /* separación lateral por profundidad (lejos→cerca) */
      var centerX=W/2+s*W*SPREAD[3-z];
      var baseY=H*0.55+ch*0.5+bob;
      if(c==="T"){ /* árbol pixel */
        var f=FADE(z);var tw=cw*0.9,th=ch;
        o.fillStyle=shade(PAL.trunk[3-z],1);o.fillRect(centerX-tw*0.12,baseY-th*0.45,tw*0.24,th*0.5);
        o.fillStyle=shade(PAL.tree[3-z],1);
        tri(o,centerX,baseY-th*1.05,tw*0.75,th*0.5);
        tri(o,centerX,baseY-th*0.78,tw*0.95,th*0.55);
        tri(o,centerX,baseY-th*0.5,tw*1.1,th*0.6);
      }else if(c==="#"){ /* muralla */
        var ww=cw*1.32,wh=ch*0.95;
        o.fillStyle=PAL.wall[3-z];o.fillRect(centerX-ww/2,baseY-wh,ww,wh);
        o.fillStyle=shade(PAL.wall[3-z],0.75);
        for(var m=0;m<4;m++)o.fillRect(centerX-ww/2+m*(ww/4)+1,baseY-wh-3,ww/4-3,4); /* almenas */
      }else if(c==="~"){o.fillStyle=PAL.water[3-z];o.fillRect(centerX-cw*0.7,baseY-3,cw*1.4,4)}
      else if(walkable(c)){ /* sendero */
        o.fillStyle=shade(PAL.path,0.55+0.14*z);var pw=cw*1.15;
        o.fillRect(centerX-pw/2,baseY-2,pw,3);
        /* Gen 29: brasas del sendero encendido (parpadean, guían al claro del Heraldo) */
        if(G.trailLit&&G.trail[cx0+"_"+cy0]){
          var fl=REDUCED?1:((G.t>>2)+cx0+cy0)%2===0?1:0.55;
          o.globalAlpha=fl;o.fillStyle="#ffb46a";
          o.fillRect(centerX-2,baseY-5,4,3);
          o.fillStyle="#ff8a5d";o.fillRect(centerX-1,baseY-7,2,2);
          o.globalAlpha=1}
        if(c==="G"){o.fillStyle=PAL.wall[3-z];o.fillRect(centerX-cw*0.66,baseY-ch*0.9,cw*0.18,ch*0.9);o.fillRect(centerX+cw*0.48,baseY-ch*0.9,cw*0.18,ch*0.9);o.fillStyle=shade(PAL.wall[3-z],0.8);o.fillRect(centerX-cw*0.66,baseY-ch*0.98,cw*1.32,ch*0.14)}
        if(c==="N"){emoji(o,"🏠",centerX,baseY-ch*0.4,Math.max(8,ch*0.55))}
        if(c==="Q"){emoji(o,"⛲",centerX,baseY-ch*0.4,Math.max(8,ch*0.55))}
        if(c==="F"){emoji(o,"🔥",centerX,baseY-ch*0.38,Math.max(8,ch*0.5));if(!REDUCED&&(G.t>>3)%2===0)emoji(o,"💨",centerX+cw*0.1,baseY-ch*0.85,Math.max(6,ch*0.3))}
        var fz=foeAt(cx0,cy0);if(fz)emoji(o,FOES[fz.t].em,centerX,baseY-ch*0.34,Math.max(9,Math.min(ch*(fz.t==="B"?0.75:0.5),H*(fz.t==="B"?0.42:0.3))));
        var iz=itemAt(cx0,cy0);if(iz)emoji(o,iz.t==="P"?"🧪":"🪶",centerX,baseY-ch*0.28,Math.max(8,ch*0.38));
      }
    }
  }
  /* viñeta */
  o.fillStyle="rgba(2,8,5,0.28)";o.fillRect(0,0,W,4);o.fillRect(0,H-4,W,4);o.fillRect(0,0,4,H);o.fillRect(W-4,0,4,H);
  /* brújula pixel (bajo el HUD) */
  o.fillStyle="rgba(4,16,10,.8)";o.fillRect(W/2-16,30,32,11);
  o.fillStyle="#b6ff9e";o.font="8px monospace";o.textAlign="center";o.fillText(DIRN[G.dir].toUpperCase(),W/2,38);
  /* minimapa */
  if(G.mini){
    var ms=3,mw=G.W*ms,mx=W-mw-6,my=18;
    o.fillStyle="rgba(2,10,6,.85)";o.fillRect(mx-2,my-2,mw+4,G.Hh*ms+4);
    for(var yy=0;yy<G.Hh;yy++)for(var xx=0;xx<G.W;xx++){
      if(!G.seen[xx+"_"+yy])continue;var cc=cell(xx,yy);
      o.fillStyle=cc==="T"?"#153a22":cc==="#"?"#5e6575":cc==="~"?"#1f6a92":cc==="F"?"#ffb46a":"#2b5a33";
      o.fillRect(mx+xx*ms,my+yy*ms,ms,ms);
      var ff=foeAt(xx,yy);if(ff){o.fillStyle=ff.t==="B"?"#ff5d7a":"#ffd98a";o.fillRect(mx+xx*ms,my+yy*ms,ms,ms)}}
    /* Gen 28: el humo de la fogata se ve por sobre los árboles aunque no hayas pasado */
    for(var fy=0;fy<G.Hh;fy++)for(var fx=0;fx<G.W;fx++)if(cell(fx,fy)==="F"){o.fillStyle="#ffb46a";o.fillRect(mx+fx*ms,my+fy*ms,ms,ms)}
    /* Gen 29: sendero de brasas y claro del Heraldo visibles tras descansar en la fogata */
    if(G.trailLit){
      for(var tk in G.trail){var tp=tk.split("_");
        o.fillStyle="rgba(255,150,90,.85)";o.fillRect(mx+(+tp[0])*ms,my+(+tp[1])*ms,ms,ms)}
      for(var bi=0;bi<G.foes.length;bi++)if(G.foes[bi].t==="B"&&!G.foes[bi].dead){
        o.fillStyle="#ff5d7a";o.fillRect(mx+G.foes[bi].x*ms,my+G.foes[bi].y*ms,ms,ms)}
      o.fillStyle="#fff";o.fillRect(mx+G.x*ms,my+G.y*ms,ms,ms)}
    o.fillStyle="#fff";o.fillRect(mx+G.x*ms,my+G.y*ms,ms,ms);
  }
  ctx.imageSmoothingEnabled=false;
  ctx.clearRect(0,0,cv.width,cv.height);
  ctx.drawImage(off,0,0,cv.width,cv.height);
}
function FADE(z){return 1-z*0.18}
function tri(o,cx,topY,w,h){o.beginPath();o.moveTo(cx,topY);o.lineTo(cx-w/2,topY+h);o.lineTo(cx+w/2,topY+h);o.closePath();o.fill()}
function emoji(o,e,x,y,size){o.font=Math.round(size)+"px serif";o.textAlign="center";o.textBaseline="middle";o.fillText(e,x,y)}
function resize(){cv.width=wrap.clientWidth;cv.height=wrap.clientHeight;render()}
window.addEventListener("resize",function(){if(G.open)resize()});

/* ---------- HUD ---------- */
function hud(){
  var inCity=["C","N","Q"].indexOf(cell(G.x,G.y))>=0;
  $("#c2Loc").textContent=inCity?"🏘 Villa Gen (a salvo)":cell(G.x,G.y)==="G"?"🚪 Puerta de Villa Gen":cell(G.x,G.y)==="F"?"🔥 Fogata de los Viajeros":"🌲 Bosque de las Afueras";
  $("#c2HpT").textContent=G.hero.hp+"/"+G.hero.maxhp;
  $("#c2HpFill").style.width=Math.max(0,G.hero.hp/G.hero.maxhp*100)+"%";
  $("#c2Stats").textContent="⚔️"+G.hero.atk+" 🛡"+G.hero.def+" 🧪"+G.hero.pots+" · Nv "+G.hero.lvl+(G.hero.scar?" · 📖":"");
  var ph=G.party.map(function(a){return'<div class="al">'+a.em+" "+esc(a.gen)+'</div>'}).join("");
  $("#c2Party").innerHTML='<div class="al">🦁 Tú · '+esc(GEN)+'</div>'+ph;
}

/* ---------- movimiento ---------- */
function markSeen(){for(var yy=-2;yy<=2;yy++)for(var xx=-2;xx<=2;xx++)G.seen[(G.x+xx)+"_"+(G.y+yy)]=true}
function tryMove(fwd){
  if(G.combat||!G.open)return;
  var d=DIRS[G.dir],nx=G.x+d[0]*(fwd?1:-1),ny=G.y+d[1]*(fwd?1:-1);
  var c=cell(nx,ny);
  if(!walkable(c)){blip(120,0.06,"square",0.05);log(c==="~"?"🌊 El agua está helada. Mejor no.":"🌲 El bosque es demasiado denso por ahí.");render();return}
  var f=foeAt(nx,ny);
  if(f){if(f.t==="B"&&G.party.length<1){log("🌑 El Heraldo ni te mira. <b>Solo emerge ante una expedición de 2 o más.</b> Recluta un gen en la plaza ⛲ de Villa Gen o acepta a la Brasa Viajera en la fogata 🔥.");blip(150,0.1,"square",0.06);return}
    startCombat(f);return}
  G.x=nx;G.y=ny;G.steps++;G.bob=1;markSeen();
  var it=itemAt(nx,ny);
  if(it){it.used=true;if(it.t==="P"){G.hero.pots++;log("🧪 Encontraste una poción entre las raíces. ("+G.hero.pots+" en total)");blip(660,0.12,"triangle",0.08)}else{G.hero.atk+=1;log("🪶 Una <b>Pluma del Bosque</b>: +1 ATQ para siempre.");blip(880,0.15,"triangle",0.09)}haptic(10);ev("pickup",{item:it.t})}
  var here=cell(nx,ny);
  if(here==="N")posada();
  else if(here==="Q")plaza();
  else if(here==="F")fogata();
  else if(here==="G"&&G.steps>1)log("🚪 La puerta de Villa Gen. Al norte: la plaza. Afuera: el bosque.");
  if(G.hero.hp<G.hero.maxhp&&["C","N","Q"].indexOf(here)>=0){} /* la posada cura, no el suelo */
  save();hud();render()}
function turn(rt){if(G.combat||!G.open)return;G.dir=(G.dir+(rt?1:3))%4;blip(330,0.04,"square",0.03);save();render()}

/* ---------- ciudad: posada y plaza ---------- */
function modal(html,cb){$("#c2Card").innerHTML=html;$("#c2Modal").classList.add("on");if(cb)cb()}
function closeModal(){$("#c2Modal").classList.remove("on")}
$("#c2Modal").addEventListener("click",function(e){if(e.target.id==="c2Modal")closeModal()});
function posada(){
  ev("inn");
  var healed=G.hero.hp<G.hero.maxhp;G.hero.hp=G.hero.maxhp;hud();save();
  modal('<h3>🏠 Posada «El Susurro»</h3><div class="big">🛏️</div>'+
  '<p>'+(healed?"La posadera te sirve sopa de píxeles. <b>Vida restaurada.</b>":"Ya estás en plena forma. La posadera te cuenta un rumor:")+'</p>'+
  '<p style="color:#b6ff9e">«Dicen que el <b>Heraldo del Devorador</b> acampa en un claro al sureste. Nadie lo ha visto emerger ante un viajero solo… solo ante <b>expediciones</b>.»</p>'+
  '<p style="color:#ffd98a">«Camino al claro hay una <b>fogata de viajeros 🔥</b>. Los que pasan dejan huellas escritas junto al fuego. Descansa ahí antes del final.»</p>'+
  '<button id="c2Ok1">Seguir</button>',function(){$("#c2Ok1").addEventListener("click",closeModal)})}
function plaza(){
  ev("city_plaza");
  var rows="";
  var pool=ALIADOS.slice();
  if(G.inviterGen)rows+='<div class="aliRow"><span class="e">💌</span><div class="t"><b>'+esc(G.inviterGen)+'</b> te invitó a esta expedición.<br><span style="color:#b6ff9e">Su gen pelea contigo.</span></div><button data-join="1">Unir</button></div>';
  pool.forEach(function(a,i){
    var inParty=G.party.some(function(p){return p.id===a.id});
    if(inParty)return;
    rows+='<div class="aliRow"><span class="e">'+a.em+'</span><div class="t"><b>'+esc(a.gen)+'</b> · '+esc(a.skill)+'<br><span style="color:#9fd8b4">'+esc(a.d)+' · cada '+a.cd+' turnos</span></div><button data-rec="'+i+'">Reclutar</button></div>'});
  var slots=1+(G.invited?1:0)+(G.inviterGen?1:0);
  var libre=slots-G.party.length;
  modal('<h3>⛲ Plaza de los Genes</h3>'+
  '<p>Los genes inmortalizados de MUTA descansan aquí, tallados en la fuente. Puedes llevar <b>'+slots+'</b> en tu party ('+(libre>0?libre+" lugar"+(libre>1?"es":"")+" libre"+(libre>1?"s":""):"party completa")+').</p>'+rows+
  '<div style="border-top:1px solid rgba(190,255,205,.25);margin-top:10px;padding-top:10px">'+
  (G.invited?'<p style="color:#b6ff9e">💌 Ya enviaste una invitación: tu segundo lugar está abierto.</p>':
  '<p><b>¿Party más grande?</b> Invita a alguien real: si comparte tu enlace de gen, tu expedición gana un lugar extra <i>(se abre al enviar la invitación)</i>.</p><button id="c2Inv">💌 Invitar a mi party</button>')+
  '</div><button id="c2Ok2" style="background:#123324">Volver al bosque</button>',
  function(){
    $("#c2Ok2").addEventListener("click",closeModal);
    var inv=$("#c2Inv");if(inv)inv.addEventListener("click",invitar);
    Array.prototype.forEach.call($("#c2Card").querySelectorAll("[data-rec]"),function(b){
      b.addEventListener("click",function(){
        var slots2=1+(G.invited?1:0)+(G.inviterGen?1:0);
        if(G.party.length>=slots2){log("Tu party está completa. Invita a alguien para abrir otro lugar.");return}
        var a=ALIADOS[parseInt(b.getAttribute("data-rec"),10)];
        G.party.push(a);G.cds[a.id]=0;ev("recruit",{ally:a.id});haptic(12);blip(720,0.14,"triangle",0.09);
        addEnergy(2,"c2-recluta");save();hud();plaza()})});
    var j=$("#c2Card").querySelector("[data-join]");
    if(j)j.addEventListener("click",function(){
      var slots2=1+(G.invited?1:0)+(G.inviterGen?1:0);
      if(G.party.length>=slots2){log("Tu party está completa.");return}
      var ally={id:"invitado",gen:G.inviterGen,em:"💌",skill:"Eco del gen",d:"golpea 3 y cura 4",cd:3,fx:function(H,F,lg){H.hp=Math.min(H.maxhp,H.hp+4);F.hp-=3;lg("💌 El eco de "+G.inviterGen+" golpea por 3 y te cura 4.")}};
      G.party.push(ally);G.cds[ally.id]=0;ev("party_join",{from:G.inviterGen});haptic(12);blip(760,0.15,"triangle",0.09);
      addEnergy(3,"c2-invitado");save();hud();plaza()})})}
function invitar(){
  var url="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN);
  var txt="Te invito a mi party en LA CRÓNICA de MUTA (Capítulo 2, en primera persona): entra con mi enlace y mi gen pelea contigo contra el Heraldo. "+url;
  ev("party_invite");cap("muta_share",{red:"party_invite",gen:GEN});
  var done=function(){G.invited=true;save();addEnergy(3,"c2-invitacion");log("💌 Invitación lista. Tu segundo lugar de party quedó abierto.");plaza()};
  if(navigator.share)navigator.share({title:"LA CRÓNICA — MUTA",text:txt}).then(done).catch(function(){done()});
  else{try{navigator.clipboard.writeText(txt);log("📋 Invitación copiada. Pégala donde quieras.")}catch(e){}done()}}

/* ---------- LA FOGATA DE LOS VIAJEROS (Gen 28) ----------
   Relevo asíncrono honesto: huellas reales de visitantes reales vía /fogata.
   La memoria del campamento es temporal (se reinicia al desplegar) y se dice. */
var FOG_KEY="muta_fogata_g31"; /* Gen 31: el fuego se renueva con cada generación (la memoria del server también) */
function tiempoRel(min){if(!Number.isFinite(min)||min<0)return"";if(min<1)return"recién";if(min<60)return"hace "+Math.round(min)+" min";var h=Math.round(min/60);if(h<48)return"hace "+h+" h";return"hace "+Math.round(h/24)+" días"}
function fogata(){
  ev("camp_open");
  var healed=false;
  if(G.hero.hp<G.hero.maxhp){G.hero.hp=Math.min(G.hero.maxhp,G.hero.hp+6);healed=true;ev("camp_heal");hud();save()}
  /* Gen 29: descansar enciende el sendero de brasas hacia el claro del Heraldo */
  var recienLit=false;
  if(!G.trailLit){G.trailLit=true;computeTrail();recienLit=true;ev("path_lit");save()}
  var dejada=LSg(FOG_KEY)==="1";
  var brasaEnParty=G.party.some(function(p){return p.id==="brasa"});
  modal('<h3>🔥 La Fogata de los Viajeros</h3><div class="big">🔥</div>'+
  '<p>'+(healed?"El calor del fuego te repara: <b>+6 PV</b>.":"El fuego crepita. Estás en plena forma.")+'</p>'+
  '<p style="color:#ffd98a">'+(recienLit?"✨ <b>Las brasas saltan del fuego y marcan el sendero</b> hasta el claro del Heraldo 🌑. Síguelas por el suelo o míralas en el 🗺️.":"✨ Las brasas siguen marcando el sendero al claro del Heraldo 🌑 (míralo en el 🗺️).")+'</p>'+
  (G.party.length===0&&!brasaEnParty?'<div style="background:rgba(60,35,8,.45);border:1px solid rgba(255,180,106,.4);border-radius:12px;padding:10px;margin:8px 0"><p style="margin:0 0 8px">🔥 <b>La Brasa Viajera</b> nota que viajas sin compañía y se ofrece a acompañarte: <i>Chispa</i> (5 de daño y +2 PV, cada 3 turnos). El Heraldo solo emerge ante expediciones de 2+.</p><button id="c2Brasa">Que me acompañe</button></div>':"")+
  '<div id="c2Huellas" style="text-align:left"><p style="color:#9fd8b4">Leyendo las huellas junto al fuego…</p></div>'+
  (dejada?'<p style="color:#b6ff9e">Tu huella ya está junto al fuego. 🐾</p><button id="c2HuSh">📤 Avisar que dejaste una huella</button>':
   '<div style="border-top:1px solid rgba(190,255,205,.25);margin-top:10px;padding-top:10px"><p><b>Deja tu huella</b> para el próximo viajero real que pase por aquí:</p>'+
   '<input id="c2HuIn" maxlength="80" placeholder="Un consejo, un saludo, una advertencia…" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1px solid rgba(190,255,205,.35);border-radius:10px;color:#fff;padding:11px 12px;font-family:inherit;font-size:13px">'+
   '<button id="c2HuGo">🐾 Dejarla firmada como '+esc(GEN)+'</button></div>')+
  '<p style="font-size:11px;color:#9fd8b4">Las huellas son de visitantes reales. Viven en la memoria del campamento y pueden desaparecer cuando MUTA muta.</p>'+
  '<button id="c2OkF" style="background:#123324">Volver al bosque</button>',
  function(){
    $("#c2OkF").addEventListener("click",closeModal);
    var br=$("#c2Brasa");
    if(br)br.addEventListener("click",function(){
      if(G.party.some(function(p){return p.id==="brasa"}))return;
      G.party.push(BRASA);G.cds[BRASA.id]=0;ev("brasa_join");haptic(12);blip(720,0.14,"triangle",0.09);
      addEnergy(2,"c2-brasa");save();hud();
      log("🔥 La Brasa Viajera se une a tu expedición. El Heraldo ya no podrá ignorarte.");
      br.parentElement.style.display="none"});
    var sh=$("#c2HuSh");if(sh)sh.addEventListener("click",fogataShare);
    var box=$("#c2Huellas");
    fetch("/fogata",{cache:"no-store"}).then(function(r){return r.json()}).then(function(d){
      var hs=(d&&d.huellas)||[];
      ev("camp_read",{n:hs.length});
      if(!hs.length){box.innerHTML='<p style="color:#9fd8b4">Aún no hay huellas de otros viajeros en esta generación. La tuya puede ser la primera. 🐾</p>';return}
      box.innerHTML=hs.map(function(h){return '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,220,140,.25);border-radius:10px;padding:8px 10px;margin:6px 0;font-size:12.5px;line-height:1.45">🐾 <b>'+esc(h.gen)+'</b> <span style="color:#9fd8b4">'+esc(tiempoRel(h.hace_min))+'</span><br>«'+esc(h.texto)+'»</div>'}).join("");
    }).catch(function(){box.innerHTML='<p style="color:#ffb46a">El humo no deja leer las huellas ahora mismo. Intenta de nuevo en un rato.</p>'});
    var go=$("#c2HuGo");
    if(go)go.addEventListener("click",function(){
      var inp=$("#c2HuIn"),txt=(inp&&inp.value||"").replace(/\s+/g," ").trim().slice(0,80);
      if(txt.length<2){log("Escribe al menos un par de letras para tu huella.");return}
      go.disabled=true;go.textContent="Dejando la huella…";
      fetch("/fogata",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gen:GEN,texto:txt})})
      .then(function(r){return r.json()}).then(function(d){
        if(d&&d.ok){LSs(FOG_KEY,"1");ev("camp_trace");addEnergy(3,"c2-fogata");haptic(12);blip(720,0.14,"triangle",0.09);
          log("🐾 Tu huella quedó junto al fuego, firmada por "+GEN+".");closeModal();setTimeout(fogata,50)}
        else{go.disabled=false;go.textContent="🐾 Dejarla firmada como "+GEN;log((d&&d.error)||"La fogata no aceptó la huella. Intenta de nuevo.")}
      }).catch(function(){go.disabled=false;go.textContent="🐾 Dejarla firmada como "+GEN;log("No hay señal junto al fuego. Intenta de nuevo.")})})})}
function fogataShare(){
  var url="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN);
  var txt="Dejé una huella en la Fogata de los Viajeros de LA CRÓNICA (MUTA), un RPG que la gente escribe por partes y muta cada día. Pasa a leerla antes de que el fuego cambie: "+url;
  try{if(navigator.share){navigator.share({title:"LA CRÓNICA — MUTA",text:txt}).then(function(){cap("muta_share",{red:"fogata",gen:GEN})}).catch(function(){})}
  else{navigator.clipboard.writeText(txt);cap("muta_share",{red:"fogata",gen:GEN});log("📋 Aviso copiado: pégalo donde quieras para que alguien encuentre tu huella.")}}catch(e){}}

/* ---------- combate por turnos (intenciones visibles, party activa) ---------- */
function startCombat(f){
  G.combat={f:f,turn:0,def:false};f.stun=false;
  ev(f.t==="B"?"boss_start":"battle_start",{foe:f.t});
  $("#c2Combat").classList.add("on");$("#c2FoeName").textContent=FOES[f.t].n;$("#c2FoeEm").textContent=FOES[f.t].em;
  clog(f.t==="B"?"🌑 El claro se oscurece. El Heraldo del Devorador emerge ante tu expedición.":"¡Un "+FOES[f.t].n+" te corta el paso!");
  combatUI()}
function clog(t){$("#c2CLog").innerHTML=t}
function combatUI(){
  var c=G.combat,f=c.f,spec=FOES[f.t];
  $("#c2FoeHp").style.width=Math.max(0,f.hp/spec.hp*100)+"%";
  var plan=spec.plan(c.turn,f);c.plan=plan;
  $("#c2Intent").innerHTML=f.stun?"😵 Aturdido: perderá su turno":"👁 Intención: "+esc(plan.txt);
  var html='<button data-a="atk">⚔️ Atacar</button><button data-a="def">🛡 Defender</button><button data-a="pot" '+(G.hero.pots<1?"disabled":"")+'>🧪 Poción ('+G.hero.pots+')</button><button data-a="run">🏃 Huir</button>';
  G.party.forEach(function(a){var cd=G.cds[a.id]||0;html+='<button data-s="'+a.id+'" '+(cd>0?"disabled":"")+'>'+a.em+" "+esc(a.skill)+(cd>0?" ("+cd+")":"")+'</button>'});
  $("#c2Acts").innerHTML=html;
  Array.prototype.forEach.call($("#c2Acts").querySelectorAll("button"),function(b){
    b.addEventListener("click",function(){
      var a=b.getAttribute("data-a"),s=b.getAttribute("data-s");
      if(s)useSkill(s);else act(a)})});
  hud()}
function useSkill(id){
  var c=G.combat,f=c.f;var a=G.party.filter(function(p){return p.id===id})[0];if(!a)return;
  a.fx(G.hero,f,clog);G.cds[id]=a.cd;haptic(8);blip(560,0.1,"triangle",0.07);
  if(f.hp<=0){win();return}
  foeTurn()}
function act(a){
  var c=G.combat,f=c.f,spec=FOES[f.t];
  if(a==="run"){
    if(f.t==="B"){clog("El Heraldo bloquea la huida con un muro de sombra.");foeTurn();return}
    $("#c2Combat").classList.remove("on");G.combat=null;log("🏃 Huiste. El "+spec.n+" sigue ahí.");render();return}
  if(a==="pot"){if(G.hero.pots<1)return;G.hero.pots--;G.hero.hp=Math.min(G.hero.maxhp,G.hero.hp+10);ev("potion");clog("🧪 +10 PV.");blip(660,0.1,"triangle",0.08);foeTurn();return}
  if(a==="def"){c.def=true;clog("🛡 Te plantas y cubres a la party.");foeTurn();return}
  /* atacar */
  var dmg=G.hero.atk+((c.turn+G.kills)%3===0?1:0);
  if(G.hero.dusted){dmg=Math.max(1,dmg-2);G.hero.dusted=false}
  if(c.plan&&c.plan.k==="guard"&&!f.stun){f.hp-=Math.max(1,dmg-2);G.hero.hp-=2;clog("⚔️ Golpeas ("+Math.max(1,dmg-2)+") pero su guardia te raspa (-2 PV).")}
  else{f.hp-=dmg;clog("⚔️ Golpe limpio: "+dmg+" de daño.")}
  haptic(6);blip(440,0.07,"square",0.06);
  if(f.hp<=0){win();return}
  foeTurn()}
function foeTurn(){
  var c=G.combat,f=c.f,spec=FOES[f.t];
  Object.keys(G.cds).forEach(function(k){if(G.cds[k]>0)G.cds[k]--});
  if(f.stun){f.stun=false;c.turn++;combatUI();return}
  var plan=c.plan||spec.plan(c.turn,f);
  setTimeout(function(){
    if(!G.combat)return;
    if(plan.k==="skip"){clog($("#c2CLog").innerHTML+"<br>El enemigo duda y pierde el turno.")}
    else if(plan.k==="dust"){G.hero.dusted=true;clog($("#c2CLog").innerHTML+"<br>🌫 Polvo de tinta: tu próximo golpe hará menos daño.")}
    else{
      var dmg=plan.k==="big"?f.atk*2+1:f.atk;
      if(c.def)dmg=Math.max(0,Math.floor(dmg/2)-G.hero.def);
      else dmg=Math.max(1,dmg-G.hero.def);
      if(G.hero.veil){G.hero.veil=false;dmg=0;clog($("#c2CLog").innerHTML+"<br>🌫 La niebla de Sigiloso te esconde: fallan.")}
      else{G.hero.hp-=dmg;clog($("#c2CLog").innerHTML+"<br>💥 Recibes "+dmg+" de daño.");haptic(dmg>5?20:8)}
      if(G.hero.hp<=0){lose();return}}
    c.def=false;c.turn++;combatUI()},650)}
function win(){
  var c=G.combat,f=c.f,spec=FOES[f.t];
  f.dead=true;G.kills++;G.hero.xp+=spec.xp;
  ev(f.t==="B"?"boss_win":"battle_win",{foe:f.t});
  var lvlTxt="";
  if(G.hero.xp>=G.hero.lvl*14){G.hero.lvl++;G.hero.maxhp+=5;G.hero.hp=Math.min(G.hero.maxhp,G.hero.hp+5);G.hero.atk+=1;lvlTxt="<br>⬆️ <b>¡Nivel "+G.hero.lvl+"!</b> +5 PV máx, +1 ATQ.";ev("levelup",{level:G.hero.lvl})}
  addEnergy(1,"c2-combate");blip(700,0.12,"triangle",0.09);blip(940,0.12,"triangle",0.08);
  clog("🏆 "+spec.n+" derrotado. +"+spec.xp+" XP."+lvlTxt);
  $("#c2Intent").innerHTML="—";$("#c2Acts").innerHTML='<button id="c2W">Seguir</button>';
  $("#c2W").addEventListener("click",function(){
    $("#c2Combat").classList.remove("on");G.combat=null;save();hud();render();
    if(f.t==="B")ending()});
  save();hud()}
function lose(){
  G.deaths++;ev("battle_lose",{foe:G.combat.f.t});
  clog("💤 Caes. El bosque te devuelve, magullado, a la puerta de Villa Gen.");
  $("#c2Intent").innerHTML="—";$("#c2Acts").innerHTML='<button id="c2Lz">Despertar</button>';
  $("#c2Lz").addEventListener("click",function(){
    $("#c2Combat").classList.remove("on");G.combat=null;
    G.hero.hp=Math.max(6,Math.floor(G.hero.maxhp/2));
    /* volver a la puerta */
    for(var y=0;y<G.Hh;y++)for(var x=0;x<G.W;x++)if(cell(x,y)==="G"){G.x=x;G.y=y}
    G.dir=2;save();hud();render();log("La posada 🏠 cura gratis. El Heraldo sigue en su claro.")});
  save()}

/* ---------- final del capítulo ---------- */
/* Gen 29: LA CRÓNICA DEL VIAJERO — carta personal firmada con tu gen al vencer
   al Heraldo. Lo único que la gente compartió orgánicamente en 3 ventanas fueron
   objetos personales firmados (la carta-receta): el final ahora produce uno. */
function cronicaCard(){
  var c=document.createElement("canvas");c.width=380;c.height=480;var o=c.getContext("2d");
  var grd=o.createLinearGradient(0,0,0,480);grd.addColorStop(0,"#0e2b3f");grd.addColorStop(0.5,"#123821");grd.addColorStop(1,"#03100a");
  o.fillStyle=grd;o.fillRect(0,0,380,480);
  o.strokeStyle="#ffb46a";o.lineWidth=3;o.strokeRect(8,8,364,464);
  o.strokeStyle="rgba(255,180,106,.35)";o.lineWidth=1;o.strokeRect(14,14,352,452);
  o.textAlign="center";
  o.fillStyle="#ffd98a";o.font="700 13px monospace";o.fillText("LA CRÓNICA — CAPÍTULO 2",190,44);
  o.fillStyle="#9fd8b4";o.font="10px monospace";o.fillText("Las Afueras de Villa Gen · MUTA Gen 29",190,62);
  o.font="54px serif";o.fillText("🌅",190,120);
  o.font="30px serif";var ems="🦁"+(G.party.length?G.party.map(function(a){return a.em}).join(""):"");o.fillText(ems,190,165);
  o.fillStyle="#eaffe9";o.font="700 15px monospace";o.fillText("CRÓNICA DEL VIAJERO",190,200);
  o.fillStyle="#b6ff9e";o.font="700 14px monospace";o.fillText(GEN,190,222);
  o.fillStyle="#d7f2df";o.font="11.5px monospace";
  var dejada=LSg(FOG_KEY)==="1";
  var lines=[
    "venció al Heraldo del Devorador",
    "— — —",
    "Nivel alcanzado: "+G.hero.lvl,
    "Combates ganados: "+G.kills,
    (G.deaths?"Caídas en el bosque: "+G.deaths:"Sin caer ni una vez"),
    (G.party.length?"Expedición: "+G.party.map(function(a){return a.gen}).join(" · "):"Expedición en solitario"),
    (dejada?"Dejó su huella en la fogata 🐾":"El fuego aún espera su huella"),
    (G.hero.scar?"Porta la cicatriz del Cap. 1 📖":"")];
  var yy=252;lines.forEach(function(l){if(!l)return;
    if(l.length>44)l=l.slice(0,43)+"…";
    o.fillText(l,190,yy);yy+=20});
  o.fillStyle="#ffd98a";o.font="11px monospace";o.fillText("El bosque respira de nuevo.",190,yy+8);
  o.fillStyle="#9fd8b4";o.font="10px monospace";
  o.fillText("El Capítulo 3 aún no está escrito.",190,436);
  o.fillStyle="#ffb46a";o.font="700 11px monospace";o.fillText("muta.revenuehub.cloud",190,456);
  return c}
function ending(){
  var first=!G.done;G.done=true;save();
  if(first){addEnergy(12,"c2-capitulo");ev("complete",{deaths:G.deaths,kills:G.kills,level:G.hero.lvl,party:G.party.length})}
  var url="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN);
  var shareTxt="Mi expedición venció al Heraldo en el Capítulo 2 de LA CRÓNICA (MUTA): un RPG en primera persona que la gente escribe por partes. Esta es mi crónica firmada. El Capítulo 3 aún no existe. "+url;
  var card=null,dataUrl="";
  try{card=cronicaCard();dataUrl=card.toDataURL("image/png");ev("cronica_card",{level:G.hero.lvl,kills:G.kills})}catch(e){}
  modal('<h3>🌅 El bosque respira de nuevo</h3>'+
  (dataUrl?'<img src="'+dataUrl+'" alt="Tu Crónica del Viajero, firmada con tu gen" style="width:100%;max-width:280px;border-radius:12px;border:1px solid rgba(255,180,106,.45);margin:6px 0">':'<div class="big">🦁'+(G.party.length?G.party.map(function(a){return a.em}).join(""):"")+'</div>')+
  '<p>El Heraldo se deshace en páginas en blanco. Tu expedición — '+esc(GEN)+(G.party.length?" junto a "+esc(G.party.map(function(a){return a.gen}).join(", ")):" en solitario")+' — cerró el Capítulo 2 con '+G.kills+' combates ganados. Esta crónica es tuya: llévatela.</p>'+
  '<p style="color:#b6ff9e"><b>El Capítulo 3 no está escrito.</b> ¿Qué hay más allá del bosque? ¿Quién manda al Devorador? Tu idea puede entrar con tu gen, como las de GEN Rebelde entraron en este.</p>'+
  (dataUrl?'<button id="c2Dl">💾 Guardar mi crónica</button>':"")+
  '<button id="c2Share">📤 Compartir</button><button id="c2Idea">💬 Proponer el Capítulo 3</button><button id="c2Again">↺ Rejugar</button>',
  function(){
    $("#c2Idea").addEventListener("click",function(){closeModal();cerrar();if(API.openProposal)API.openProposal("historia");ev("cta_chapter3")});
    var dl=$("#c2Dl");
    if(dl)dl.addEventListener("click",function(){
      try{var a=document.createElement("a");a.href=dataUrl;a.download="cronica-del-viajero-"+GEN+".png";document.body.appendChild(a);a.click();a.remove();ev("cronica_save");log("💾 Tu crónica quedó guardada, firmada por "+GEN+".")}catch(e){log("Tu navegador no dejó guardar la imagen.")}});
    $("#c2Share").addEventListener("click",function(){
      cap("muta_share",{red:"cronica_final",gen:GEN});
      var shared=false;
      try{
        if(navigator.share&&card){
          card.toBlob(function(b){
            try{
              var f=b?new File([b],"cronica-"+GEN+".png",{type:"image/png"}):null;
              if(f&&navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({title:"LA CRÓNICA — MUTA",text:shareTxt,files:[f]}).catch(function(){});
              else navigator.share({title:"LA CRÓNICA — MUTA",text:shareTxt}).catch(function(){})
            }catch(e){navigator.share({title:"LA CRÓNICA — MUTA",text:shareTxt}).catch(function(){})}});
          shared=true}
      }catch(e){}
      if(!shared){try{navigator.clipboard.writeText(shareTxt);log("📋 Copiado. Pégalo donde quieras junto a tu crónica guardada.")}catch(e){}}
      ev("share_end")});
    $("#c2Again").addEventListener("click",function(){try{localStorage.removeItem(SAVE_KEY)}catch(e){};closeModal();iniciar(true)})})}

/* ---------- intro ---------- */
function intro(){
  var c1done=false;try{var d=JSON.parse(LSg("muta_rpg_c1")||"null");c1done=!!(d&&d.done)}catch(e){}
  modal('<h3>📖 LA CRÓNICA — Capítulo 2</h3><div class="big">🌲🏘🌲</div>'+
  '<p><b>Las Afueras de Villa Gen.</b> '+(c1done?"Venciste al Devorador allá abajo — tu 📖 cicatriz te da +1 ATQ — pero su <b>Heraldo</b> escapó a la superficie.":"En el Capítulo 1, alguien venció al Devorador en la Biblioteca Hundida. Su <b>Heraldo</b> escapó a la superficie.")+' Ahora caza ideas en el bosque que rodea la ciudad de los genes.</p>'+
  '<p>Es <b>en primera persona</b>: avanza con ▲ (mantenlo presionado para caminar), gira ↰ ↱ o desliza el dedo. En la ciudad: la posada 🏠 cura y la plaza ⛲ recluta genes para tu party. Camino al Heraldo hay una <b>fogata 🔥</b> donde otros viajeros reales dejan huellas — descansar ahí enciende un <b>sendero de brasas ✨</b> que marca el camino exacto al jefe, y si viajas sin compañía la Brasa Viajera se une a ti. Al vencerlo te llevas tu <b>Crónica del Viajero</b> firmada.</p>'+
  '<p style="color:#9fd8b4;font-size:12px">Nacida de <b>GEN Rebelde</b>: capítulo en primera persona con ciudad, monstruos alrededor y party por invitación — y el bosque con música pixel 🎵 también fue su susurro.</p>'+
  '<button id="c2Go">Salir al bosque</button>',
  function(){$("#c2Go").addEventListener("click",function(){closeModal();ev("start",{c1_scar:c1done});log("🌲 Estás en la puerta de Villa Gen, mirando al sur. La plaza ⛲ queda al norte, dentro.")})})}

/* ---------- abrir / cerrar ---------- */
function iniciar(fresh){
  buildWorld();
  var sv=fresh?null:load();
  if(sv){
    G.hero=sv.hero;G.done=!!sv.done;G.kills=sv.kills||0;G.deaths=sv.deaths||0;G.invited=!!sv.invited;G.steps=sv.steps||0;
    G.x=sv.x;G.y=sv.y;G.dir=sv.dir||2;
    (sv.foesDead||[]).forEach(function(ix){if(G.foes[ix])G.foes[ix].dead=true});
    (sv.itemsUsed||[]).forEach(function(ix){if(G.items[ix])G.items[ix].used=true});
    G.party=[];(sv.party||[]).forEach(function(id){
      if(id==="invitado"&&G.inviterGen){G.party.push({id:"invitado",gen:G.inviterGen,em:"💌",skill:"Eco del gen",d:"golpea 3 y cura 4",cd:3,fx:function(H,F,lg){H.hp=Math.min(H.maxhp,H.hp+4);F.hp-=3;lg("💌 El eco del gen golpea por 3 y te cura 4.")}});return}
      if(id==="brasa"){G.party.push(BRASA);return}
      var a=ALIADOS.filter(function(x){return x.id===id})[0];if(a)G.party.push(a)});
    G.trailLit=!!sv.trailLit;if(G.trailLit)computeTrail();
    G.cds={};G.party.forEach(function(a){G.cds[a.id]=0});
    ev("resume",{});
    if(LSg("muta_c2_sendero_aviso")!=="1"){LSs("muta_c2_sendero_aviso","1");
      setTimeout(function(){log("✨ <b>Nuevo desde hoy:</b> descansar en la fogata 🔥 enciende un <b>sendero de brasas</b> que marca el camino exacto al claro del Heraldo. Si viajas sin party, la <b>Brasa Viajera</b> se ofrece a acompañarte. Y al vencerlo, tu <b>Crónica del Viajero</b> firmada es tuya para guardar y compartir.")},900)}
  }else{
    G.hero=newHero();G.party=[];G.cds={};G.done=false;G.kills=0;G.deaths=0;G.invited=false;G.steps=0;G.dir=2;
    intro()}
  markSeen();hud();resize();loop()}
function loop(){if(!G.open)return;G.t++;if(G.bob>0)G.bob--;render();G.raf=requestAnimationFrame(REDUCED?function(){setTimeout(loop,140)}:loop)}
function abrir(){
  if(G.open){wrap.classList.add("open");return}
  G.open=true;wrap.classList.add("open");
  /* gen que invita: viene en ?g= (mismo parámetro de contagio de MUTA) */
  try{var m=/[?&]g=([^&]+)/.exec(location.search);if(m){var ig=decodeURIComponent(m[1]).replace(/[^A-Za-z0-9 ·_-]/g,"").slice(0,24);if(ig&&ig!==GEN)G.inviterGen=ig}}catch(e){}
  iniciar(false)}
function cerrar(){G.open=false;wrap.classList.remove("open");cancelAnimationFrame(G.raf);clearTimeout(musicTimer);G.music=false;$("#c2Music").textContent="🎵";ev("close",{steps:G.steps,kills:G.kills});save()}
$("#c2X").addEventListener("click",cerrar);
$("#c2L").addEventListener("click",function(){turn(false)});
$("#c2R").addEventListener("click",function(){turn(true)});
/* Gen 28: avanzar/retroceder con mantener presionado (el mapa por casillas hacía
   tediosa la caminata a un toque por paso; los ▲ repetidos de Gen 27 lo mostraron) */
function holdMove(btn,fwd){
  var rep=null;
  function stop(){if(rep){clearInterval(rep);rep=null}}
  btn.addEventListener("pointerdown",function(e){e.preventDefault();stop();tryMove(fwd);rep=setInterval(function(){if(G.combat||!G.open||$("#c2Modal").classList.contains("on")){stop();return}tryMove(fwd)},250)});
  ["pointerup","pointercancel","pointerleave"].forEach(function(evn){btn.addEventListener(evn,stop)});
  btn.addEventListener("click",function(e){e.preventDefault()});
}
holdMove($("#c2F"),true);
holdMove($("#c2B"),false);
$("#c2Mini").addEventListener("click",function(){G.mini=!G.mini;render();ev("minimap",{on:G.mini})});
$("#c2Music").addEventListener("click",musicToggle);
document.addEventListener("keydown",function(e){
  if(!G.open||G.combat)return;
  if(e.key==="ArrowUp"||e.key==="w")tryMove(true);
  else if(e.key==="ArrowDown"||e.key==="s")tryMove(false);
  else if(e.key==="ArrowLeft"||e.key==="a")turn(false);
  else if(e.key==="ArrowRight"||e.key==="d")turn(true);
  else if(e.key==="Escape")cerrar()});
/* swipe móvil: horizontal=girar, vertical=avanzar/retroceder */
var tS=null;
cv.addEventListener("touchstart",function(e){if(e.touches.length===1)tS={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
cv.addEventListener("touchend",function(e){
  if(!tS)return;var t=e.changedTouches[0],dx=t.clientX-tS.x,dy=t.clientY-tS.y;tS=null;
  if(Math.abs(dx)<24&&Math.abs(dy)<24)return;
  if(Math.abs(dx)>Math.abs(dy))turn(dx>0);
  else tryMove(dy<0)},{passive:true});

window.MUTA_C2={open:abrir,close:cerrar};
if(window.__c2AutoStart){window.__c2AutoStart=false;abrir()}
})();
