/* ============================================================
   MUTA Gen 21 — TRANCE (módulo lazy)
   Dirección del creador: un ritmo hipnótico basado en música trance
   generada en vivo (WebAudio). No tan movido: hipnotizante. Diseñado
   para muchos toques / barra espaciadora / flechas. Sin muerte: solo
   flujo, combo, estado de trance y ranking honesto (/leaderboard).
   ============================================================ */
(function(){
"use strict";
if(window.MUTA_TRANCE)return;
var API=window.MUTA_API||{};
var cap=API.cap||function(){},haptic=API.haptic||function(){},addEnergy=API.addEnergy||function(){};
var esc=API.esc||function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var VPC=API.VPC||function(){return window.innerWidth<=720?"mobile":"desktop"};
var GEN=API.GEN||"GEN-????",REDUCED=!!API.REDUCED;
var PNAME=API.PNAME||function(){return API.ALIAS||"Errante"};
var gShort=API.g||"0000";
var ev=function(action,extra){var p={action:action,generation:21,experience_id:"trance",game:"trance",viewport_class:VPC()};if(extra)for(var k in extra)p[k]=extra[k];cap("muta_game",p)};

/* ---------- DOM ---------- */
var css=document.createElement("style");
css.textContent=
"#trWrap{display:none;position:fixed;inset:0;z-index:70;background:radial-gradient(130% 110% at 50% 45%,#1a0e33 0%,#0b0620 55%,#050313 100%);touch-action:manipulation}"+
"#trWrap.open{display:block}"+
"#trCv{position:absolute;inset:0;width:100%;height:100%}"+
"#trTop{position:absolute;z-index:3;left:0;right:0;top:0;display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 6px;color:#e8dcff;font-size:13px;pointer-events:none;text-shadow:0 2px 8px rgba(0,0,0,.7)}"+
"#trTop b{color:#ffd76a}"+
"#trX{position:absolute;z-index:4;top:calc(10px + env(safe-area-inset-top,0px));right:12px;width:40px;height:40px;border-radius:50%;background:rgba(20,12,44,.9);border:1px solid #3a2c66;color:#eee;font-size:16px;display:grid;place-items:center;cursor:pointer}"+
"#trFlow{position:absolute;z-index:3;left:14px;right:64px;top:calc(46px + env(safe-area-inset-top,0px));height:6px;border-radius:4px;background:rgba(255,255,255,.09);overflow:hidden;pointer-events:none}"+
"#trFlow i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#7df9c6,#8ec5ff,#e08cff);transition:width .2s}"+
"#trMsg{position:absolute;z-index:3;left:12px;right:12px;bottom:calc(18px + env(safe-area-inset-bottom,0px));text-align:center;color:#b9a8e8;font-size:12px;line-height:1.5;pointer-events:none;text-shadow:0 2px 8px rgba(0,0,0,.7)}"+
"#trStart{position:absolute;z-index:5;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:rgba(5,3,19,.86);text-align:center;padding:20px}"+
"#trStart h2{color:#e8dcff;font-size:20px;letter-spacing:.5px}"+
"#trStart p{color:#b9a8e8;font-size:13px;max-width:46ch;line-height:1.6}"+
"#trStart button{min-height:52px;padding:14px 30px;border-radius:14px;border:none;background:linear-gradient(135deg,#7df9c6,#8ec5ff);color:#0b0620;font-weight:800;font-size:15px;cursor:pointer}"+
"#trStart .cred{font-size:10.5px;color:#8b7ab8}"+
"#trEnd{display:none;position:absolute;z-index:5;left:50%;top:50%;transform:translate(-50%,-50%);background:#150d30;border:1px solid #3a2c66;border-radius:18px;padding:20px;width:min(360px,92vw);text-align:center;color:#e8dcff}"+
"#trEnd.open{display:block}"+
"#trEnd h3{font-size:18px;margin-bottom:8px}"+
"#trEnd p{font-size:13px;color:#b9a8e8;line-height:1.55;margin-bottom:10px}"+
"#trEnd .row{display:flex;gap:8px}"+
"#trEnd button{flex:1;min-height:46px;border-radius:12px;font-weight:700;font-size:13px;cursor:pointer;border:1px solid #3a2c66;background:#221545;color:#e8dcff}"+
"#trEnd button.pri{background:linear-gradient(135deg,#7df9c6,#8ec5ff);border:none;color:#0b0620}"+
"#trBoard{font-size:11.5px;color:#9f8ecf;line-height:1.7;margin-top:8px}";
document.head.appendChild(css);

var wrap=document.createElement("div");wrap.id="trWrap";
wrap.setAttribute("role","dialog");wrap.setAttribute("aria-modal","true");wrap.setAttribute("aria-label","TRANCE: ritmo hipnótico");
wrap.innerHTML=
'<canvas id="trCv" aria-label="Círculos de ritmo: toca cuando el anillo llegue al centro"></canvas>'+
'<div id="trTop">🔮 <b id="trScore">0</b>&nbsp;· combo <b id="trCombo">0</b>&nbsp;· <span id="trState">calentando</span></div>'+
'<div id="trFlow"><i id="trFlowFill"></i></div>'+
'<button id="trX" aria-label="Salir del trance">✕</button>'+
'<div id="trMsg"></div>'+
'<div id="trStart"><h2>🔮 TRANCE</h2>'+
'<p>Un ritmo hipnótico con música trance generada en vivo. <b>Toca la pantalla</b> (o usa <b>ESPACIO</b>) cuando el anillo se cierre sobre el centro. Cuando aparezca una flecha, <b>desliza o presiona esa flecha</b>. Llena el flujo y entra en estado de trance. Aquí no se pierde: solo se fluye.</p>'+
'<button id="trGo">Entrar al trance ▶</button>'+
'<span class="cred">Nacida de una dirección del creador · música generada en tu dispositivo, nada pregrabado · Gen 21</span></div>'+
'<div id="trEnd"><h3>🔮 Fin de la sesión</h3><p id="trEndTxt"></p><div class="row"><button class="pri" id="trAgain">Otra vez</button><button id="trOut">Salir</button></div><div id="trBoard"></div></div>';
document.body.appendChild(wrap);

var cv=wrap.querySelector("#trCv"),cx=cv.getContext("2d");
var W=0,H=0,DPR=1,CXx=0,CYy=0;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);W=wrap.clientWidth||window.innerWidth;H=wrap.clientHeight||window.innerHeight;
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cx.setTransform(DPR,0,0,DPR,0,0);CXx=W/2;CYy=H*0.52}
window.addEventListener("resize",function(){if(open_)resize()});

/* ---------- audio: trance generativo 118 bpm ---------- */
var TAC=null,master=null,delayN=null;
var BPM=118,BEAT=60/BPM;
function audioInit(){
  if(TAC)return true;
  try{
    TAC=new (window.AudioContext||window.webkitAudioContext)();
    master=TAC.createGain();master.gain.value=0.5;master.connect(TAC.destination);
    delayN=TAC.createDelay(1.0);delayN.delayTime.value=BEAT*0.75;
    var fb=TAC.createGain();fb.gain.value=0.32;
    delayN.connect(fb);fb.connect(delayN);delayN.connect(master);
    return true;
  }catch(e){return false}
}
function note(f,t,dur,wave,vol,useDelay,filterF){
  try{
    var o=TAC.createOscillator(),gn=TAC.createGain();o.type=wave;o.frequency.value=f;
    var dest=gn;
    if(filterF){var fl=TAC.createBiquadFilter();fl.type="lowpass";fl.frequency.value=filterF;o.connect(fl);fl.connect(gn)}
    else o.connect(gn);
    gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(vol,t+0.015);gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    gn.connect(master);if(useDelay)gn.connect(delayN);
    o.start(t);o.stop(t+dur+0.1);
  }catch(e){}
}
function kick(t){
  try{
    var o=TAC.createOscillator(),gn=TAC.createGain();o.type="sine";
    o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+0.11);
    gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(0.34,t+0.008);gn.gain.exponentialRampToValueAtTime(0.0001,t+0.24);
    o.connect(gn);gn.connect(master);o.start(t);o.stop(t+0.3);
  }catch(e){}
}
/* escala menor hipnótica en La (A) */
var SCALE=[0,3,5,7,10,12,15];
var ARPS=[[0,2,4,2,1,2,4,5],[0,3,4,3,2,3,4,6],[1,2,3,2,4,2,3,2],[0,4,2,5,0,4,2,6]];
var beatTimes=[],schedStep=0,schedNext=0,schedTimer=null,barCount=0;
function schedule(){
  if(!TAC)return;
  while(schedNext<TAC.currentTime+0.35){
    var st=schedStep%8,bar=Math.floor(schedStep/8),t=schedNext,lvl=level();
    if(st===0||st===4)kick(t);
    if(st===2||st===6)note(55*Math.pow(2,SCALE[0]/12),t,BEAT*0.4,"sawtooth",0.11,false,240); /* bajo offbeat */
    var arp=ARPS[bar%ARPS.length];
    note(220*Math.pow(2,SCALE[arp[st]]/12),t,BEAT*0.42,"triangle",lvl>=2?0.075:0.055,true,1800);
    if(lvl>=2&&st%2===1)note(3520,t,0.03,"square",0.012,false); /* hat sutil */
    if(lvl>=3&&st===0)note(110*Math.pow(2,SCALE[arp[0]]/12),t,BEAT*3.6,"sawtooth",0.03,true,500); /* pad */
    if(st===0||st===4)beatTimes.push(t); /* pulsos jugables: cada media barra */
    schedStep++;schedNext+=BEAT/2;
  }
  while(beatTimes.length&&beatTimes[0]<TAC.currentTime-0.6)beatTimes.shift();
}
function level(){return flow>=75?3:flow>=38?2:1}

/* ---------- juego ---------- */
var open_=false,playing=false,raf=null;
var score=0,combo=0,maxCombo=0,hits=0,flow=20,trance=false,tranceEnd=0,misses=0;
var cue=null; /* {dir:0..3, until:t} */
var DIRS=["←","↑","→","↓"];
var blooms=[],startedAt=0,energyGiven=0,hitBatch=0;
function hud(){
  wrap.querySelector("#trScore").textContent=score;
  wrap.querySelector("#trCombo").textContent=combo;
  wrap.querySelector("#trState").textContent=trance?"EN TRANCE ×2":level()>=3?"profundo":level()>=2?"fluyendo":"calentando";
  wrap.querySelector("#trFlowFill").style.width=Math.min(100,flow)+"%";
}
function msg(t2,ms){var el=wrap.querySelector("#trMsg");el.innerHTML=t2;clearTimeout(el._t);el._t=setTimeout(function(){el.textContent=""},ms||1800)}
function nearestBeat(now){
  var best=null,bd=1e9;
  for(var i=0;i<beatTimes.length;i++){var d=Math.abs(beatTimes[i]-now);if(d<bd){bd=d;best=beatTimes[i]}}
  return {t:best,d:bd};
}
function pulse(){
  if(!playing||!TAC)return;
  var now=TAC.currentTime,nb=nearestBeat(now);
  var mult=trance?2:1;
  if(nb.t!=null&&nb.d<=0.07){score+=3*mult;combo++;hits++;flow=Math.min(100,flow+6);bloom("#7df9c6","PERFECTO");haptic(14)}
  else if(nb.t!=null&&nb.d<=0.15){score+=1*mult;combo++;hits++;flow=Math.min(100,flow+3);bloom("#8ec5ff","bien");haptic(8)}
  else{combo=0;misses++;flow=Math.max(0,flow-7);bloom("#5a4a8a","")}
  maxCombo=Math.max(maxCombo,combo);
  hitBatch++;if(hitBatch>=25){ev("hit",{score:score,combo:combo,flow:Math.round(flow)});hitBatch=0}
  if(hits>0&&hits%60===0&&energyGiven<6){energyGiven+=2;addEnergy(2,"trance");msg("⚡ +2 de energía para tu huevo",2200)}
  if(flow>=100&&!trance){trance=true;tranceEnd=now+16*BEAT;ev("trance_state",{score:score});msg("🔮 <b>ESTADO DE TRANCE</b> · puntos ×2",3000);haptic([20,40,20,40,20])}
  hud();
}
function answerCue(dir){
  if(!playing||!cue)return;
  var mult=trance?2:1;
  if(dir===cue.dir){score+=5*mult;combo+=2;hits++;flow=Math.min(100,flow+10);bloom("#ffd76a","FLECHA ✓");haptic([10,20,10]);cue=null}
  else{combo=0;flow=Math.max(0,flow-5);bloom("#5a4a8a","");cue=null}
  hud();
}
function bloom(color,label){blooms.push({r:36,a:0.9,c:color,l:label,t:0})}
/* ---------- dibujo ---------- */
function draw(){
  if(!open_)return;raf=requestAnimationFrame(draw);
  if(!TAC)return;
  var now=TAC.currentTime;
  schedule();
  if(trance&&now>tranceEnd){trance=false;flow=58;msg("El trance se disuelve… mantén el pulso",2500);hud()}
  /* cue de flechas: cada ~10 pulsos */
  if(playing&&!cue&&Math.random()<0.004&&!REDUCED){cue={dir:Math.floor(Math.random()*4),until:now+2.6}}
  if(cue&&now>cue.until){cue=null;flow=Math.max(0,flow-4);hud()}
  cx.clearRect(0,0,W,H);
  var hueBase=(now*8)%360;
  /* túnel hipnótico */
  var rings=REDUCED?4:9;
  for(var i=rings;i>0;i--){
    var rr=(i/rings)*Math.min(W,H)*0.62+(trance?Math.sin(now*2+i)*7:0);
    cx.strokeStyle="hsla("+((hueBase+i*14)%360)+",70%,"+(trance?58:40)+"%,"+(0.10+(trance?0.10:0))+")";
    cx.lineWidth=1.5;cx.beginPath();cx.arc(CXx,CYy,rr,0,6.28);cx.stroke();
  }
  /* anillos de beat que se cierran al centro */
  var hitR=Math.min(W,H)*0.11;
  if(!REDUCED)for(var b=0;b<beatTimes.length;b++){
    var dt=beatTimes[b]-now;
    if(dt<-0.15||dt>1.6)continue;
    var rr2=hitR+dt*(Math.min(W,H)*0.34);
    var al=dt<0?Math.max(0,0.9+dt*4):0.85;
    cx.strokeStyle="hsla("+((hueBase+40)%360)+",85%,70%,"+al+")";
    cx.lineWidth=dt<0.12?3.4:2;
    cx.beginPath();cx.arc(CXx,CYy,Math.max(hitR*0.4,rr2),0,6.28);cx.stroke();
  }
  /* centro */
  var pu=1+(Math.sin(now*Math.PI*2/BEAT)*0.5+0.5)*0.14;
  var g3=cx.createRadialGradient(CXx,CYy,2,CXx,CYy,hitR*pu);
  g3.addColorStop(0,"hsla("+hueBase+",90%,75%,.95)");g3.addColorStop(0.6,"hsla("+((hueBase+60)%360)+",85%,55%,.35)");g3.addColorStop(1,"hsla("+hueBase+",80%,50%,0)");
  cx.fillStyle=g3;cx.beginPath();cx.arc(CXx,CYy,hitR*pu,0,6.28);cx.fill();
  cx.strokeStyle="rgba(255,255,255,.75)";cx.lineWidth=2;cx.beginPath();cx.arc(CXx,CYy,hitR,0,6.28);cx.stroke();
  /* cue de flecha */
  if(cue){
    cx.fillStyle="#ffd76a";cx.font="700 "+Math.round(hitR*0.9)+"px system-ui";cx.textAlign="center";
    cx.fillText(DIRS[cue.dir],CXx,CYy-hitR*1.9);
    cx.font="600 12px system-ui";cx.fillStyle="rgba(255,215,106,.8)";
    cx.fillText(VPC()==="mobile"?"desliza hacia la flecha":"presiona esa flecha",CXx,CYy-hitR*1.9+22);
  }
  /* blooms */
  for(var k2=blooms.length-1;k2>=0;k2--){var bl=blooms[k2];bl.r+=3.2;bl.a-=0.03;bl.t++;
    if(bl.a<=0){blooms.splice(k2,1);continue}
    cx.strokeStyle=bl.c;cx.globalAlpha=bl.a;cx.lineWidth=2.5;
    cx.beginPath();cx.arc(CXx,CYy,bl.r,0,6.28);cx.stroke();cx.globalAlpha=1;
    if(bl.l&&bl.t<26){cx.fillStyle=bl.c;cx.font="700 16px system-ui";cx.textAlign="center";cx.fillText(bl.l,CXx,CYy+hitR*1.8)}}
  if(REDUCED&&playing){cx.fillStyle="rgba(232,220,255,.8)";cx.font="600 13px system-ui";cx.textAlign="center";
    cx.fillText("Modo calmo: toca al ritmo del pulso del centro",CXx,H-70)}
}
/* ---------- inputs ---------- */
var pd=null;
wrap.addEventListener("pointerdown",function(e){
  if(!playing)return;
  if(e.target.closest("#trX")||e.target.closest("#trEnd")||e.target.closest("#trStart"))return;
  pd={x:e.clientX,y:e.clientY,t:Date.now()};
  pulse();
});
wrap.addEventListener("pointerup",function(e){
  if(!playing||!pd)return;
  var dx=e.clientX-pd.x,dy=e.clientY-pd.y;pd=null;
  if(Math.hypot(dx,dy)>34&&cue){
    var dir=Math.abs(dx)>Math.abs(dy)?(dx>0?2:0):(dy>0?3:1);
    answerCue(dir);
  }
});
document.addEventListener("keydown",function(e){
  if(!open_||!playing)return;
  if(e.code==="Space"){e.preventDefault();pulse()}
  else if(e.code==="ArrowLeft"){e.preventDefault();cue?answerCue(0):pulse()}
  else if(e.code==="ArrowUp"){e.preventDefault();cue?answerCue(1):pulse()}
  else if(e.code==="ArrowRight"){e.preventDefault();cue?answerCue(2):pulse()}
  else if(e.code==="ArrowDown"){e.preventDefault();cue?answerCue(3):pulse()}
});
/* ---------- sesión ---------- */
function startPlay(){
  if(!audioInit()){msg("Tu navegador no soporta WebAudio 😔 El trance necesita sonido.",5000);return}
  if(TAC.state==="suspended")TAC.resume();
  wrap.querySelector("#trStart").style.display="none";
  wrap.querySelector("#trEnd").classList.remove("open");
  score=0;combo=0;maxCombo=0;hits=0;misses=0;flow=20;trance=false;cue=null;blooms=[];
  beatTimes=[];schedStep=0;barCount=0;schedNext=TAC.currentTime+0.2;
  if(schedTimer)clearInterval(schedTimer);schedTimer=setInterval(schedule,80);
  playing=true;startedAt=Date.now();hitBatch=0;
  ev("start",{});hud();msg("Cierra los ojos… no, mejor no: toca cuando el anillo llegue al centro 🔮",4000);
}
function endPlay(toEnd){
  if(!playing)return;
  playing=false;
  var dur=Math.round((Date.now()-startedAt)/1000);
  ev("over",{score:score,combo_max:maxCombo,hits:hits,duracion_s:dur});
  if(schedTimer){clearInterval(schedTimer);schedTimer=null}
  if(TAC){try{master.gain.setTargetAtTime(0.0001,TAC.currentTime,0.4)}catch(e){}}
  if(toEnd){
    var tx=wrap.querySelector("#trEndTxt");
    tx.innerHTML="<b>"+score+" puntos</b> · combo máximo "+maxCombo+" · "+hits+" pulsos en "+dur+"s.";
    wrap.querySelector("#trEnd").classList.add("open");
    if(score>0){
      fetch("/score",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({game:"trance",name:PNAME()+"-"+gShort,score:score})})
      .then(function(r){return r.json()}).then(function(d){
        if(d&&d.ok)tx.innerHTML+="<br>Puesto <b>#"+d.rank+"</b> del ranking de hoy ✨";
        board();
      }).catch(board);
    }else board();
  }
}
function board(){
  fetch("/leaderboard?game=trance",{cache:"no-store"}).then(function(r){return r.json()}).then(function(d){
    var el=wrap.querySelector("#trBoard");
    if(!d||!d.scores||!d.scores.length){el.textContent="Ranking vacío por ahora: sé la primera persona en dejar su marca. (Se reinicia con cada despliegue.)";return}
    el.innerHTML="🏆 "+d.scores.slice(0,5).map(function(s2,i2){return (i2+1)+". "+esc(s2.name)+" · "+s2.score}).join("<br>");
  }).catch(function(){});
}
wrap.querySelector("#trGo").addEventListener("click",function(){
  if(TAC&&master)try{master.gain.setValueAtTime(0.5,TAC.currentTime)}catch(e){}
  startPlay();
});
wrap.querySelector("#trAgain").addEventListener("click",function(){
  if(TAC&&master)try{master.gain.setValueAtTime(0.5,TAC.currentTime)}catch(e){}
  startPlay();
});
wrap.querySelector("#trOut").addEventListener("click",apiClose);
wrap.querySelector("#trX").addEventListener("click",function(){playing?endPlay(true):apiClose()});
document.addEventListener("visibilitychange",function(){if(document.hidden&&playing)endPlay(false)});
/* ---------- API ---------- */
function apiOpen(){
  if(wrap.classList.contains("open"))return;
  if(API.musicStop)API.musicStop();
  wrap.classList.add("open");open_=true;resize();
  wrap.querySelector("#trStart").style.display="flex";
  wrap.querySelector("#trEnd").classList.remove("open");
  raf=requestAnimationFrame(draw);
  if(!TAC)audioInit();
}
function apiClose(){
  if(playing)endPlay(false);
  wrap.classList.remove("open");open_=false;
  if(raf)cancelAnimationFrame(raf);
  if(TAC){try{TAC.suspend()}catch(e){}}
}
window.MUTA_TRANCE={open:apiOpen,close:apiClose,stop:apiClose};
if(window.__tranceAutoStart){window.__tranceAutoStart=false;apiOpen()}
})();
