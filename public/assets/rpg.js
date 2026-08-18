/* ============ LA CRÓNICA — Capítulo 1: La Biblioteca Hundida ============
   Gen 26. Nacida de GEN Rebelde: «Haz un juego como Might and Magic».
   El muro decía "en cola: RPG es un ciclo grande, se evalúa por partes".
   Esta es la primera parte: un RPG por capítulos donde la criatura de MUTA
   baja a rescatar ideas devoradas. Combate por turnos con intenciones
   visibles (defender es una decisión real), exploración con niebla,
   reliquias a elección y un jefe con patrón aprendible. El Capítulo 2
   se escribirá con lo que la gente susurre. Módulo lazy. Sin secretos. */
(function(){
"use strict";
if(window.MUTA_RPG)return;
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
function ev(action,extra){var p={action:action,experience_id:"rpg",chapter:1,viewport_class:VPC(),gene_origin:"GEN-0866"};if(extra)for(var k in extra)p[k]=extra[k];cap("muta_rpg",p)}

/* ---------- mapas: 3 pisos hechos a mano (13x11) ---------- */
/* #=muro .=piso S=inicio D=escalera P=poción R=reliquia e=enemigo g=guardián c=eco B=jefe *=antorcha */
var FLOORS=[
{name:"Piso 1 · El Vestíbulo Anegado",tint:["#0a1430","#132a52"],acc:"#7fd4ff",
 map:[
 "#############",
 "#S..*...#...#",
 "#.###.#.#.e.#",
 "#.#...#.#...#",
 "#.#.###.###.#",
 "#...#e....#.#",
 "###.#.###.#.#",
 "#P..#.*.#...#",
 "#.####..#.###",
 "#......e#..D#",
 "#############"],
 intro:"El agua cubre los primeros peldaños. Entre los estantes flotan páginas en blanco: alguien se comió lo que decían."},
{name:"Piso 2 · La Sala de los Ecos",tint:["#1a0e24","#3d1e4e"],acc:"#ff9ed2",
 map:[
 "#############",
 "#S..#...*..P#",
 "#.#.#.###.###",
 "#.#...#c..#.#",
 "#.##.##.#.#.#",
 "#..g.#..#...#",
 "##.#.#.##.#.#",
 "#..#.#.#..g.#",
 "#.##.#.#.####",
 "#.*..c...R.D#",
 "#############"],
 intro:"Aquí las palabras robadas rebotan sin dueño. Los ecos tienen hambre y repiten tu nombre con acento ajeno."},
{name:"Piso 3 · El Archivo Profundo",tint:["#241005","#4e2410"],acc:"#ffd98a",
 map:[
 "#############",
 "#S....#.....#",
 "#.###.#.###.#",
 "#.#c..#...#.#",
 "#.#.#####.#.#",
 "#.#.#P..#.#.#",
 "#.#.#.#.#.#.#",
 "#g..#.#.#..g#",
 "#.###.#.###.#",
 "#..*..B..*..#",
 "#############"],
 intro:"Al fondo del archivo respira algo enorme. Cada idea que la gente no llegó a pedir termina en su estómago."}];

/* ---------- bestiario con intenciones visibles ---------- */
var FOES={
 e:{n:"Polilla de Papel",em:"🦋",hp:8,atk:2,xp:5,
    plan:function(t){var r=(t*7)%10;return r<6?{k:"hit",txt:"va a lanzarse contra ti"}:r<8?{k:"skip",txt:"revolotea confundida"}:{k:"dust",txt:"sacude polvo de tinta (tu próximo golpe hará menos daño)"}}},
 g:{n:"Guardián de Tinta",em:"🗿",hp:14,atk:3,xp:9,
    plan:function(t){return t%2===0?{k:"guard",txt:"levanta la guardia: si lo atacas ahora, contraataca"}:{k:"hit",txt:"prepara un golpe de lomo"}}},
 c:{n:"Eco Hambriento",em:"🌀",hp:12,atk:2,xp:8,
    plan:function(t){return t%3===2?{k:"big",txt:"⚠ acumula un DOBLE ECO (defiéndete o dolerá)"}:{k:"hit",txt:"susurra un mordisco"}}},
 B:{n:"El Devorador de Ideas",em:"👁️",hp:34,atk:4,xp:30,boss:true,
    plan:function(t,self){var fase2=self.hp<=17;if(fase2&&t%2===1)return{k:"big",txt:"⚠ abre su boca-biblioteca: DEVORAR (defiéndete)"};if(!fase2&&t%3===2)return{k:"big",txt:"⚠ ruge y toma impulso: DEVORAR (defiéndete)"};return{k:"hit",txt:"lanza un zarpazo de páginas"}}}};

var RELICS=[
 {id:"pluma",em:"🪶",n:"Pluma Afilada",d:"+2 ATQ",fx:function(H){H.atk+=2}},
 {id:"tapa",em:"📕",n:"Tapa Dura",d:"+1 DEF",fx:function(H){H.def+=1}},
 {id:"marca",em:"🔖",n:"Marcapáginas Tibio",d:"+8 vida máx.",fx:function(H){H.maxhp+=8;H.hp+=8}},
 {id:"tinta",em:"🫙",n:"Tinta Luminosa",d:"+2 pociones",fx:function(H){H.pots+=2}}];

/* ---------- estado ---------- */
var SAVE_KEY="muta_rpg_c1";
var G={open:false,raf:0,floor:0,grid:[],W:13,Hh:11,hero:null,foes:[],items:[],seen:{},combat:null,turnCount:0,msg:"",done:false,kills:0,deaths:0,t:0,shake:0};
function newHero(){return{x:1,y:1,hp:24,maxhp:24,atk:4,def:1,pots:1,xp:0,lvl:1,relics:[],dusted:false}}
function save(){try{LSs(SAVE_KEY,JSON.stringify({floor:G.floor,hero:G.hero,done:G.done,kills:G.kills,deaths:G.deaths}))}catch(e){}}
function load(){try{var d=JSON.parse(LSg(SAVE_KEY)||"null");if(d&&d.hero)return d}catch(e){}return null}

/* ---------- DOM ---------- */
var css="#rpgWrap{position:fixed;inset:0;z-index:1200;display:none;background:#05030f;color:#fff;font-family:inherit;overflow:hidden;touch-action:none}"+
"#rpgWrap.open{display:block}"+
"#rpgCv{position:absolute;inset:0;width:100%;height:100%}"+
"#rpgTop{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));left:8px;right:8px;display:flex;align-items:center;gap:8px;z-index:4;pointer-events:none}"+
"#rpgTop .pill{background:rgba(8,6,24,.88);border:1px solid rgba(255,255,255,.22);border-radius:12px;padding:6px 10px;font-size:11.5px;font-weight:700;letter-spacing:.3px;pointer-events:auto}"+
"#rpgHp{min-width:120px}#rpgHpBar{height:6px;border-radius:4px;background:rgba(255,255,255,.15);margin-top:4px;overflow:hidden}#rpgHpFill{height:100%;background:linear-gradient(90deg,#ff5d7a,#ffd98a);width:100%;transition:width .25s}"+
"#rpgX{margin-left:auto;background:rgba(8,6,24,.88);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:12px;padding:8px 12px;font-size:14px;font-weight:800;cursor:pointer;pointer-events:auto}"+
"#rpgLog{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(96px + env(safe-area-inset-bottom,0px));z-index:4;background:rgba(8,6,24,.9);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:8px 14px;font-size:12.5px;max-width:92%;text-align:center;pointer-events:none}"+
"#rpgPanel{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:5;display:none;gap:8px;background:rgba(10,8,28,.96);border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:10px}"+
"#rpgPanel.on{display:flex}"+
"#rpgPanel button{background:#1c1740;border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:12px;padding:12px 14px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;min-width:66px}"+
"#rpgPanel button:active{transform:scale(.94)}#rpgPanel button:disabled{opacity:.35}"+
"#rpgModal{position:absolute;inset:0;z-index:6;display:none;align-items:center;justify-content:center;background:rgba(3,2,12,.82);padding:18px}"+
"#rpgModal.on{display:flex}"+
"#rpgModal .card{background:#12102e;border:1px solid rgba(255,255,255,.28);border-radius:18px;padding:22px 20px;max-width:420px;width:100%;text-align:center;max-height:82vh;overflow-y:auto;-webkit-overflow-scrolling:touch}"+
"#rpgModal h3{margin:0 0 10px;font-size:18px}#rpgModal p{font-size:13.5px;line-height:1.55;color:#cfd3f2;margin:8px 0}"+
"#rpgModal .big{font-size:44px;margin:6px 0}"+
"#rpgModal button{background:#2a2160;border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:12px;padding:12px 16px;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;margin:6px 4px 0}"+
"#rpgModal button:active{transform:scale(.95)}"+
"@media (max-width:720px){#rpgPanel button{min-width:60px;padding:11px 10px;font-size:12.5px}}";
var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
var wrap=document.createElement("div");wrap.id="rpgWrap";
wrap.innerHTML='<canvas id="rpgCv"></canvas>'+
'<div id="rpgTop"><div class="pill" id="rpgFloor"></div><div class="pill" id="rpgHp">❤️ <span id="rpgHpT"></span><div id="rpgHpBar"><div id="rpgHpFill"></div></div></div><div class="pill" id="rpgStats"></div><button id="rpgX" aria-label="Salir de La Crónica">✕</button></div>'+
'<div id="rpgLog" aria-live="polite"></div>'+
'<div id="rpgPanel" role="group" aria-label="Acciones de combate"><button id="rpgAtk">⚔️<br>Atacar</button><button id="rpgDef">🛡️<br>Defender</button><button id="rpgPot">🧪<br>Poción</button><button id="rpgRun">🏃<br>Huir</button></div>'+
'<div id="rpgModal"><div class="card" id="rpgCard"></div></div>';
document.body.appendChild(wrap);
var cv=wrap.querySelector("#rpgCv"),cx=cv.getContext("2d");
function $(s){return wrap.querySelector(s)}

/* ---------- construir piso ---------- */
function buildFloor(i){
  var F=FLOORS[i];G.grid=[];G.foes=[];G.items=[];G.seen={};G.combat=null;
  for(var y=0;y<F.map.length;y++){var row=F.map[y].split("");
    for(var x=0;x<row.length;x++){var ch=row[x];
      if(ch==="S"){G.hero.x=x;G.hero.y=y;row[x]="."}
      else if(ch==="P"){G.items.push({x:x,y:y,k:"P"});row[x]="."}
      else if(ch==="R"){G.items.push({x:x,y:y,k:"R"});row[x]="."}
      else if(FOES[ch]){G.foes.push({x:x,y:y,k:ch,hp:FOES[ch].hp});row[x]="."}
    }
    G.grid.push(row)}
  G.W=G.grid[0].length;G.Hh=G.grid.length;
  reveal();log(F.intro);
  ev("floor",{floor:i+1});
  updHud()}
function reveal(){for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++){var x=G.hero.x+dx,y=G.hero.y+dy;if(x>=0&&y>=0&&x<G.W&&y<G.Hh)G.seen[x+","+y]=1}}
function log(m){G.msg=m;$("#rpgLog").innerHTML=m}
function updHud(){
  var H=G.hero,F=FLOORS[G.floor];
  $("#rpgFloor").textContent="📜 "+F.name;
  $("#rpgHpT").textContent=H.hp+"/"+H.maxhp;
  $("#rpgHpFill").style.width=Math.max(0,H.hp/H.maxhp*100)+"%";
  $("#rpgStats").textContent="⚔️"+H.atk+" 🛡️"+H.def+" 🧪"+H.pots+" · Nv "+H.lvl}

/* ---------- movimiento ---------- */
function tryMove(dx,dy){
  if(!G.open||G.combat||$("#rpgModal").classList.contains("on"))return;
  var nx=G.hero.x+dx,ny=G.hero.y+dy;
  if(nx<0||ny<0||nx>=G.W||ny>=G.Hh)return;
  var t=G.grid[ny][nx];
  if(t==="#"){blip(120,0.05,"square",0.04);return}
  for(var i=0;i<G.foes.length;i++){if(G.foes[i].x===nx&&G.foes[i].y===ny){startCombat(G.foes[i]);return}}
  G.hero.x=nx;G.hero.y=ny;reveal();
  if(!REDUCED)G.shake=0;
  blip(300+Math.random()*60,0.03,"sine",0.03);
  for(var j=G.items.length-1;j>=0;j--){var it=G.items[j];
    if(it.x===nx&&it.y===ny){
      if(it.k==="P"){G.hero.pots++;log("🧪 Encontraste una poción. Tienes "+G.hero.pots+".");blip(760,0.12,"triangle",0.08);haptic(10);ev("potion")}
      else relicChoice();
      G.items.splice(j,1)}}
  if(t==="D"){nextFloor();return}
  if(t==="*")log("🕯️ Una antorcha aún encendida. Alguien pasó por aquí antes que tú.");
  updHud();save()}
function nextFloor(){
  if(G.floor>=2)return;
  G.floor++;buildFloor(G.floor);
  log("⬇️ "+FLOORS[G.floor].intro);
  blip(520,0.2,"triangle",0.09);haptic(18);addEnergy(2,"rpg-piso");save()}

/* ---------- reliquias: decisión 1 de 2 ---------- */
function relicChoice(){
  var owned={};G.hero.relics.forEach(function(r){owned[r]=1});
  var pool=RELICS.filter(function(r){return !owned[r.id]});
  if(!pool.length){G.hero.pots++;log("🧪 El cofre guardaba una poción.");return}
  var a=pool[(G.kills+G.floor)%pool.length],b=pool[(G.kills+G.floor+1)%pool.length];
  if(a.id===b.id)b=pool[(G.kills+G.floor+2)%pool.length]||a;
  var html='<h3>📦 Un cofre del Archivo</h3><p>Solo puedes llevar UNA reliquia. El resto vuelve al polvo.</p>';
  html+='<button id="rlA">'+a.em+" "+esc(a.n)+"<br><small>"+esc(a.d)+"</small></button>";
  if(b.id!==a.id)html+='<button id="rlB">'+b.em+" "+esc(b.n)+"<br><small>"+esc(b.d)+"</small></button>";
  modal(html,function(){
    $("#rlA").addEventListener("click",function(){takeRelic(a)});
    var rb=$("#rlB");if(rb)rb.addEventListener("click",function(){takeRelic(b)})})}
function takeRelic(r){
  r.fx(G.hero);G.hero.relics.push(r.id);
  closeModal();log(r.em+" "+r.n+" es tuya: "+r.d);
  blip(880,0.18,"triangle",0.1);haptic(20);addEnergy(1,"rpg-reliquia");
  ev("relic",{relic:r.id});updHud();save()}
function modal(html,after){var m=$("#rpgModal");$("#rpgCard").innerHTML=html;m.classList.add("on");if(after)after()}
function closeModal(){$("#rpgModal").classList.remove("on")}

/* ---------- combate por turnos ---------- */
function startCombat(foe){
  var D=FOES[foe.k];
  G.combat={foe:foe,turn:0,defending:false,over:false};
  G.turnCount=0;
  $("#rpgPanel").classList.add("on");
  $("#rpgRun").disabled=!!D.boss;
  announce();
  ev(D.boss?"boss_start":"battle_start",{foe:D.n,floor:G.floor+1});
  blip(180,0.15,"sawtooth",0.07);haptic(15)}
function announce(){
  var C=G.combat,D=FOES[C.foe.k];
  var plan=D.plan(C.turn,C.foe);C.plan=plan;
  log(D.em+" <b>"+esc(D.n)+"</b> ("+C.foe.hp+" PV) — "+esc(plan.txt)+".")}
function heroAttack(){
  var C=G.combat,D=FOES[C.foe.k],H=G.hero;
  var dmg=H.atk+((C.turn%5===3)?2:0);if(H.dusted){dmg=Math.max(1,dmg-2);H.dusted=false}
  var crit=(C.turn*13+G.kills*7)%10===0;if(crit)dmg*=2;
  if(C.plan.k==="guard"){dmg=Math.max(0,dmg-4);hurtHero(2,"El guardián contraataca (−2)");}
  C.foe.hp-=dmg;
  blip(crit?900:520,0.09,"square",0.08);haptic(crit?24:10);if(!REDUCED)G.shake=6;
  if(C.foe.hp<=0){winCombat();return}
  var line=crit?"💥 ¡CRÍTICO! Haces "+dmg+" de daño.":"⚔️ Haces "+dmg+" de daño.";
  foeAct(line)}
function heroDefend(){G.combat.defending=true;blip(340,0.08,"sine",0.06);foeAct("🛡️ Te cubres tras tu caparazón de ideas.")}
function heroPotion(){
  var H=G.hero;if(H.pots<=0){log("No te quedan pociones.");return}
  H.pots--;H.hp=Math.min(H.maxhp,H.hp+10);
  blip(700,0.12,"triangle",0.08);haptic(12);updHud();
  foeAct("🧪 Recuperas 10 PV.")}
function heroRun(){
  var C=G.combat;
  if((C.turn*17+G.hero.x*3)%10<7){endCombat();log("🏃 Escapas entre los estantes. La criatura no te sigue.");ev("flee")}
  else foeAct("🏃 ¡No encuentras salida!")}
function foeAct(preline){
  var C=G.combat,D=FOES[C.foe.k],H=G.hero;
  if(C.over)return;
  var p=C.plan,txt=preline?preline+" ":"";
  if(p.k==="hit"){var d=Math.max(1,D.atk-H.def-(C.defending?2:0));if(C.defending)d=Math.max(0,Math.ceil(d*0.25));hurt(d,txt+D.em+" ataca: −"+d+" PV.")}
  else if(p.k==="big"){var d2=D.boss?9:6;d2=Math.max(0,C.defending?2:d2-H.def);hurt(d2,txt+D.em+" descarga su golpe fuerte: −"+d2+" PV."+(C.defending?" Tu defensa lo amortiguó.":""))}
  else if(p.k==="guard"){log(txt+D.em+" aguanta tras su guardia.")}
  else if(p.k==="dust"){H.dusted=true;log(txt+"🌫️ Polvo de tinta: tu próximo golpe hará menos daño.")}
  else log(txt+D.em+" revolotea sin atacarte.");
  C.defending=false;C.turn++;updHud();
  if(H.hp>0)setTimeout(function(){if(G.combat&&!G.combat.over)announce()},650)}
function hurt(d,line){
  if(d<=0){log(line.replace(/−0 PV/,"tu defensa absorbe todo"));return}
  hurtHero(d,null);log(line)}
function hurtHero(d,note){
  var H=G.hero;H.hp-=d;if(!REDUCED)G.shake=8;blip(160,0.12,"sawtooth",0.08);haptic(20);updHud();
  if(note)log(note);
  if(H.hp<=0)die()}
function winCombat(){
  var C=G.combat,D=FOES[C.foe.k],H=G.hero;
  C.over=true;G.kills++;
  G.foes=G.foes.filter(function(f){return f!==C.foe});
  H.xp+=D.xp;
  var lvlup=false;
  while(H.xp>=H.lvl*12){H.xp-=H.lvl*12;H.lvl++;H.maxhp+=4;H.hp=Math.min(H.maxhp,H.hp+6);H.atk+=1;lvlup=true}
  endCombat();
  blip(820,0.2,"triangle",0.1);haptic(25);addEnergy(1,"rpg-victoria");
  ev(D.boss?"boss_win":"battle_win",{foe:D.n,floor:G.floor+1});
  if(lvlup){log("✨ "+D.em+" derrotado. ¡Subes a nivel "+H.lvl+"! (+4 PV máx, +1 ATQ)");blip(1000,0.25,"triangle",0.1);ev("levelup",{level:H.lvl})}
  else log("✨ "+D.em+" "+D.n+" se deshace en letras que vuelven a sus libros. +"+D.xp+" XP.");
  updHud();save();
  if(D.boss)setTimeout(chapterComplete,900)}
function endCombat(){G.combat=null;$("#rpgPanel").classList.remove("on")}
function die(){
  G.deaths++;endCombat();
  ev("death",{floor:G.floor+1});
  var H=G.hero;H.hp=H.maxhp;H.pots=Math.max(1,H.pots);
  modal('<div class="big">🕯️</div><h3>Las letras te envuelven…</h3><p>…y despiertas al inicio del piso. En la Biblioteca nadie muere del todo: solo pierde la página. Conservas nivel y reliquias.</p><button id="rpgRevive">Volver a intentarlo</button>',
    function(){$("#rpgRevive").addEventListener("click",function(){closeModal();buildFloor(G.floor);save()})});
  save()}

/* ---------- final del capítulo ---------- */
function chapterComplete(){
  var first=!G.done;G.done=true;save();
  if(first){addEnergy(10,"rpg-capitulo");ev("complete",{deaths:G.deaths,kills:G.kills,level:G.hero.lvl})}
  var url="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN);
  var shareTxt="Terminé el Capítulo 1 de LA CRÓNICA en MUTA: un RPG que se escribe por partes con lo que la gente pide. El Capítulo 2 aún no existe: se decide con las ideas de esta semana. "+url;
  modal('<div class="big">📖</div><h3>CAPÍTULO 1 COMPLETO</h3>'+
    '<p>El Devorador escupe la idea que tenía atragantada: un pergamino en blanco con tu nombre. La Biblioteca queda en silencio… pero abajo hay más pisos.</p>'+
    '<p><b>Nivel '+G.hero.lvl+"</b> · "+G.kills+" criaturas · "+G.deaths+" caídas"+(first?" · <b>+10 ⚡</b>":"")+"</p>"+
    '<p style="color:#ffd98a"><b>El Capítulo 2 no está escrito.</b> Se escribirá en una próxima mutación con lo que la gente pida: un personaje, un piso, un giro. Tu idea puede entrar con tu gen.</p>'+
    '<button id="rpgIdea">💬 Proponer el Capítulo 2</button><button id="rpgShare">📤 Compartir</button><button id="rpgAgain">↺ Rejugar</button>',
    function(){
      $("#rpgIdea").addEventListener("click",function(){closeModal();cerrar();if(API.openProposal)API.openProposal("historia");ev("cta_chapter2")});
      $("#rpgShare").addEventListener("click",function(){
        cap("muta_share",{red:"rpg",gen:GEN});
        if(navigator.share)navigator.share({title:"LA CRÓNICA — MUTA",text:shareTxt}).catch(function(){});
        else{try{navigator.clipboard.writeText(shareTxt);log("📋 Copiado. Pégalo donde quieras.")}catch(e){}}
        ev("share_end")});
      $("#rpgAgain").addEventListener("click",function(){closeModal();G.floor=0;G.hero=newHero();G.kills=0;buildFloor(0);save()})});
  if(!REDUCED)burst()}
var parts=[];
function burst(){for(var i=0;i<60;i++)parts.push({x:cv.width/2,y:cv.height/2,vx:(Math.random()-0.5)*9,vy:(Math.random()-0.5)*9-2,l:60+Math.random()*40,c:["#ffd98a","#ff9ed2","#7fd4ff","#b48aff"][i%4]})}

/* ---------- render ---------- */
function resize(){cv.width=wrap.clientWidth*(window.devicePixelRatio||1);cv.height=wrap.clientHeight*(window.devicePixelRatio||1);cx.setTransform(1,0,0,1,0,0);cx.scale(window.devicePixelRatio||1,window.devicePixelRatio||1)}
function draw(){
  var W=wrap.clientWidth,Hp=wrap.clientHeight,F=FLOORS[G.floor];
  var ts=Math.floor(Math.min(W/(G.W+1),(Hp-170)/(G.Hh+1)));ts=Math.max(18,Math.min(44,ts));
  var ox=(W-G.W*ts)/2,oy=(Hp-G.Hh*ts)/2+8;
  if(G.shake>0){ox+=(Math.random()-0.5)*G.shake;oy+=(Math.random()-0.5)*G.shake;G.shake*=0.85;if(G.shake<0.5)G.shake=0}
  var grd=cx.createLinearGradient(0,0,0,Hp);grd.addColorStop(0,F.tint[0]);grd.addColorStop(1,F.tint[1]);
  cx.fillStyle=grd;cx.fillRect(0,0,W,Hp);
  for(var y=0;y<G.Hh;y++)for(var x=0;x<G.W;x++){
    if(!G.seen[x+","+y])continue;
    var t=G.grid[y][x],px=ox+x*ts,py=oy+y*ts;
    if(t==="#"){cx.fillStyle="rgba(210,220,255,.28)";cx.fillRect(px,py,ts-1,ts-1);
      cx.fillStyle="rgba(255,255,255,.18)";cx.fillRect(px,py,ts-1,3);
      cx.fillStyle="rgba(0,0,0,.4)";cx.fillRect(px,py+ts-5,ts-1,4)}
    else{cx.fillStyle="rgba(255,255,255,.09)";cx.fillRect(px,py,ts-1,ts-1);
      cx.strokeStyle="rgba(255,255,255,.05)";cx.strokeRect(px+0.5,py+0.5,ts-2,ts-2);
      if(t==="D"){cx.fillStyle=F.acc;cx.font=Math.floor(ts*0.7)+"px serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText("⬇️",px+ts/2,py+ts/2)}
      if(t==="*"){cx.font=Math.floor(ts*0.62)+"px serif";cx.textAlign="center";cx.textBaseline="middle";
        var fl=REDUCED?1:(0.75+0.25*Math.sin(G.t*0.15+x));cx.globalAlpha=fl;cx.fillText("🕯️",px+ts/2,py+ts/2);cx.globalAlpha=1}}}
  cx.font=Math.floor(ts*0.72)+"px serif";cx.textAlign="center";cx.textBaseline="middle";
  G.items.forEach(function(it){if(!G.seen[it.x+","+it.y])return;cx.fillText(it.k==="P"?"🧪":"📦",ox+it.x*ts+ts/2,oy+it.y*ts+ts/2)});
  G.foes.forEach(function(f){if(!G.seen[f.x+","+f.y])return;var D=FOES[f.k];
    var bob=REDUCED?0:Math.sin(G.t*0.12+f.x*2)*2;
    cx.fillText(D.em,ox+f.x*ts+ts/2,oy+f.y*ts+ts/2+bob)});
  /* héroe: la criatura de MUTA con lentes */
  var hx=ox+G.hero.x*ts+ts/2,hy=oy+G.hero.y*ts+ts/2+(REDUCED?0:Math.sin(G.t*0.18)*1.5);
  cx.fillStyle="#8de6c8";cx.beginPath();cx.arc(hx,hy,ts*0.34,0,6.28);cx.fill();
  cx.fillStyle="#fff";cx.beginPath();cx.arc(hx-ts*0.12,hy-ts*0.08,ts*0.1,0,6.28);cx.arc(hx+ts*0.12,hy-ts*0.08,ts*0.1,0,6.28);cx.fill();
  cx.fillStyle="#1a1030";cx.beginPath();cx.arc(hx-ts*0.12,hy-ts*0.08,ts*0.045,0,6.28);cx.arc(hx+ts*0.12,hy-ts*0.08,ts*0.045,0,6.28);cx.fill();
  cx.strokeStyle="#ffd98a";cx.lineWidth=1.4;
  cx.beginPath();cx.arc(hx-ts*0.12,hy-ts*0.08,ts*0.13,0,6.28);cx.arc(hx+ts*0.12,hy-ts*0.08,ts*0.13,0,6.28);cx.stroke();
  cx.beginPath();cx.moveTo(hx-ts*0.01,hy-ts*0.08);cx.lineTo(hx+ts*0.01,hy-ts*0.08);cx.stroke();
  for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.l--;
    cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,p.l/80);cx.fillRect(p.x,p.y,4,4);cx.globalAlpha=1;
    if(p.l<=0)parts.splice(i,1)}
  G.t++}
function loop(){if(!G.open)return;draw();G.raf=requestAnimationFrame(loop)}

/* ---------- controles ---------- */
document.addEventListener("keydown",function(e){
  if(!G.open)return;
  var k=e.key;
  if(k==="Escape"){if($("#rpgModal").classList.contains("on"))return;cerrar();return}
  if(G.combat){if(k==="1")heroAttack();else if(k==="2")heroDefend();else if(k==="3")heroPotion();else if(k==="4"&&!$("#rpgRun").disabled)heroRun();return}
  if(k==="ArrowUp"||k==="w"||k==="W"){e.preventDefault();tryMove(0,-1)}
  else if(k==="ArrowDown"||k==="s"||k==="S"){e.preventDefault();tryMove(0,1)}
  else if(k==="ArrowLeft"||k==="a"||k==="A"){e.preventDefault();tryMove(-1,0)}
  else if(k==="ArrowRight"||k==="d"||k==="D"){e.preventDefault();tryMove(1,0)}});
var ts0=null;
cv.addEventListener("touchstart",function(e){if(e.touches.length===1)ts0={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()}},{passive:true});
cv.addEventListener("touchend",function(e){
  if(!ts0)return;var dx=e.changedTouches[0].clientX-ts0.x,dy=e.changedTouches[0].clientY-ts0.y;ts0=null;
  if(Math.abs(dx)<24&&Math.abs(dy)<24)return;
  if(Math.abs(dx)>Math.abs(dy))tryMove(dx>0?1:-1,0);else tryMove(0,dy>0?1:-1)},{passive:true});
$("#rpgAtk").addEventListener("click",heroAttack);
$("#rpgDef").addEventListener("click",heroDefend);
$("#rpgPot").addEventListener("click",heroPotion);
$("#rpgRun").addEventListener("click",heroRun);
$("#rpgX").addEventListener("click",cerrar);
window.addEventListener("resize",function(){if(G.open)resize()});

/* ---------- abrir / cerrar ---------- */
function intro(){
  modal('<div class="big">📖</div><h3>LA CRÓNICA — Capítulo 1</h3>'+
  '<p><b>La Biblioteca Hundida.</b> Algo se está comiendo las ideas que la gente pide y las guarda a medio digerir en un archivo bajo el agua. La criatura de MUTA baja a recuperarlas.</p>'+
  '<p>'+(VPC()==="mobile"?"Desliza para moverte.":"Muévete con flechas o WASD.")+' Toca a una criatura para combatir por turnos: <b>cada enemiga anuncia su intención</b>, así que defender en el momento justo importa.</p>'+
  '<p style="font-size:12px;color:#9aa0c8">Nacida de <b>GEN Rebelde</b>: «Haz un juego como Might and Magic» — un RPG grande, construido por partes. Esta es la parte 1.</p>'+
  '<button id="rpgGo">Entrar a la Biblioteca</button>',
  function(){$("#rpgGo").addEventListener("click",function(){closeModal();LSs("muta_rpg_intro","1")})})}
function abrir(){
  if(G.open)return;G.open=true;wrap.classList.add("open");
  document.documentElement.style.overflow="hidden";
  resize();
  var sv=load();
  if(sv&&sv.hero){G.floor=Math.min(2,sv.floor||0);G.hero=sv.hero;G.done=!!sv.done;G.kills=sv.kills||0;G.deaths=sv.deaths||0}
  else{G.floor=0;G.hero=newHero();G.done=false;G.kills=0;G.deaths=0}
  buildFloor(G.floor);
  if(!LSg("muta_rpg_intro"))intro();
  ev("start",{resumed:!!sv});
  cap("muta_mode_switch",{mode:"rpg"});
  if(REDUCED)draw();else loop()}
function cerrar(){
  if(!G.open)return;G.open=false;wrap.classList.remove("open");
  document.documentElement.style.overflow="";
  cancelAnimationFrame(G.raf);endCombat();closeModal();save();
  ev("close")}
window.MUTA_RPG={open:abrir,close:cerrar};
if(window.__rpgAutoStart){window.__rpgAutoStart=false;abrir()}
})();
