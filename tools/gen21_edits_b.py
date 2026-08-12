# -*- coding: utf-8 -*-
# MUTA gen-21 parte B — ejecutar DESPUÉS de tools/gen21_edits.py, desde la raíz del repo.
import re, json, hashlib, sys

FAILS = []
def rep(h, old, new, exp=1):
    n = h.count(old)
    if n != exp:
        FAILS.append(('exp %d got %d' % (exp, n), old[:70]))
        return h
    return h.replace(old, new)

h = open('public/index.html', encoding='utf-8').read()

# ---------- motor de música por experiencia ----------
h = rep(h, 'function haptic(ms){try{if(navigator.vibrate)navigator.vibrate(ms)}catch(e){}}',
          '''function haptic(ms){try{if(navigator.vibrate)navigator.vibrate(ms)}catch(e){}}

/* ---- música generativa por experiencia (dirección del creador, Gen 21) ---- */
var MUSIC={cur:null,timer:null,step:0,nextT:0};
var MPROF={
 snake:{bpm:108,root:110,wave:"square",bass:[0,0,7,0],arp:[0,3,7,10,12,10,7,3]},
 laberinto:{bpm:116,root:98,wave:"sawtooth",bass:[0,0,5,3],arp:[0,3,5,7,10,7,5,3]},
 cyclops:{bpm:92,root:82.4,wave:"triangle",bass:[0,0,0,5],arp:[0,2,3,7,3,2,0,-2]},
 blackhole:{bpm:72,root:65.4,wave:"sine",bass:[0,0,3,0],arp:[0,7,12,7,0,7,12,15]},
 reactor:{bpm:122,root:130.8,wave:"square",bass:[0,5,0,5],arp:[0,4,7,11,7,4,0,4]},
 maquina:{bpm:100,root:130.8,wave:"triangle",bass:[0,4,5,4],arp:[0,4,7,9,7,4,9,12]},
 atlas:{bpm:80,root:87.3,wave:"sine",bass:[0,0,2,0],arp:[0,7,9,12,9,7,2,0]}};
function musicNote(f,t,dur,wave,vol){try{var o=AC.createOscillator(),gn=AC.createGain();o.type=wave;o.frequency.value=f;
  gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(vol,t+0.02);gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+dur+0.05)}catch(e){}}
function musicTick(){
  if(!MUSIC.cur||!AC)return;var pf=MPROF[MUSIC.cur];if(!pf)return;
  var stepDur=60/pf.bpm/2;
  while(MUSIC.nextT<AC.currentTime+0.28){
    if(soundOn&&!document.hidden){
      var st=MUSIC.step%8;
      if(st%2===0){var b=pf.bass[(MUSIC.step>>1)%4];musicNote(pf.root*Math.pow(2,b/12)/2,MUSIC.nextT,stepDur*1.6,"sine",0.05)}
      var a=pf.arp[st];musicNote(pf.root*2*Math.pow(2,a/12),MUSIC.nextT,stepDur*0.9,pf.wave,0.028);
    }
    MUSIC.step++;MUSIC.nextT+=stepDur;
  }
}
function musicStart(name){musicStop();if(!MPROF[name])return;if(!ac())return;if(AC.state==="suspended")try{AC.resume()}catch(e){}
  MUSIC.cur=name;MUSIC.step=0;MUSIC.nextT=AC.currentTime+0.12;MUSIC.timer=setInterval(musicTick,90)}
function musicStop(){MUSIC.cur=null;if(MUSIC.timer){clearInterval(MUSIC.timer);MUSIC.timer=null}}
document.addEventListener("visibilitychange",function(){if(document.hidden)musicStop()});''')

# ---------- hooks de música ----------
h = rep(h, 'function closeAll(){$$(".ovl").forEach(function(o){o.classList.remove("open")});',
          'function closeAll(){musicStop();$$(".ovl").forEach(function(o){o.classList.remove("open")});')
h = rep(h, 'function startSnake(){', 'function startSnake(){musicStart("snake");')
h = rep(h, 'function arcOpen(mode){', 'function arcOpen(mode){musicStart(mode);')
h = rep(h, '$("#playLab").addEventListener("click",openLaberinto);',
          '$("#playLab").addEventListener("click",function(){openLaberinto();musicStart("laberinto")});')
h = rep(h, "$('#playMaquina').addEventListener('click',m2Open);",
          "$('#playMaquina').addEventListener('click',function(){m2Open();musicStart('maquina')});")

# ---------- MUTA_API ampliada ----------
h = rep(h, 'window.MUTA_API={cap:cap,addEnergy:addEnergy,drawHero:drawHero,haptic:haptic,blip:blip,esc:esc,VPC:VPC,GEN:GEN,ALIAS:ALIAS,g:g,REDUCED:REDUCED};',
          'window.MUTA_API={cap:cap,addEnergy:addEnergy,drawHero:drawHero,haptic:haptic,blip:blip,esc:esc,VPC:VPC,GEN:GEN,ALIAS:ALIAS,PNAME:PNAME,musicStart:musicStart,musicStop:musicStop,g:g,REDUCED:REDUCED};')

# ---------- cargador de TRANCE (patrón cielo) ----------
h = rep(h, 'var pc=$("#playCielo");if(pc)pc.addEventListener("click",openCielo);',
          '''var pc=$("#playCielo");if(pc)pc.addEventListener("click",openCielo);
/* ---- TRANCE (Gen 21): módulo con carga diferida ---- */
var tranceLoading=false;
function openTrance(){
  closeAll();
  if(window.MUTA_TRANCE){MUTA_TRANCE.open();return}
  if(tranceLoading)return;tranceLoading=true;
  toast("🔮 Sintonizando el trance…",4000);
  window.__tranceAutoStart=true;
  var sc4=document.createElement("script");sc4.src="/assets/trance.js?v=21";sc4.async=true;
  sc4.onload=function(){tranceLoading=false;if(!window.MUTA_TRANCE)toast("No pude iniciar el trance. Recarga la página.",5000)};
  sc4.onerror=function(){tranceLoading=false;window.__tranceAutoStart=false;
    toast("⚠️ No se pudo cargar TRANCE. Reintenta desde 🌟 Experiencias.",6000)};
  document.head.appendChild(sc4)}
var pt=$("#playTrance");if(pt)pt.addEventListener("click",openTrance);''')

# ---------- motor de temas por nutriente + rating ----------
h = rep(h, 'var creditIdx=0;',
          '''/* ---- motor de temas por nutriente (dirección del creador, Gen 21):
       alimentar transforma TODA la experiencia, no solo a la criatura ---- */
var MOODST={tema:null,nivel:0,feeds:{absurdo:0,belleza:0,caos:0}};
var moodEnts=[];
var MOOD_EMOJI=["🦆","🧦","🍍","🛸","🎩","🥐","🪑","📎","🦩","🧀"];
var MOOD_MSG={
 caos:"🔥 El caos te escuchó: MUTA entera cambió. Ahora me persiguen sombras del vacío y llueven meteoros. Sigue alimentando 🔥 para profundizar, o cambia de nutriente para virar el mundo.",
 belleza:"✨ La belleza te escuchó: MUTA entera cambió. El cielo se volvió aurora y caen estrellas fugaces. Sigue alimentando ✨ para profundizar, o cambia de nutriente para virar el mundo.",
 absurdo:"🌀 El absurdo te escuchó: MUTA entera cambió. Flotan cosas que no deberían flotar y los colores ya no prometen nada. Sigue alimentando 🌀 para profundizar, o cambia de nutriente."};
function moodPopulate(){
  moodEnts=[];if(REDUCED)return;var lv=MOODST.nivel,t2=MOODST.tema;
  if(t2==="caos"){
    for(var i=0;i<6+5*lv;i++)moodEnts.push({k:"meteor",x:Math.random()*W,y:Math.random()*H,v:4+Math.random()*5});
    for(var j=0;j<Math.min(3,lv+1);j++)moodEnts.push({k:"sombra",x:Math.random()*W,y:-60-Math.random()*120,vx:0,vy:0});
  }else if(t2==="absurdo"){
    for(var i2=0;i2<8+5*lv;i2++)moodEnts.push({k:"cosa",e:MOOD_EMOJI[i2%MOOD_EMOJI.length],x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*1.2,vy:(Math.random()-0.5)*1.2,rot:Math.random()*6.28,vr:(Math.random()-0.5)*0.04});
  }
}
function moodActivate(n){
  var esNuevo=MOODST.tema!==n;
  if(esNuevo){MOODST.tema=n;MOODST.nivel=1}else MOODST.nivel=Math.min(3,MOODST.nivel+1);
  hueShift=n==="caos"?115:n==="belleza"?52:hueShift;
  moodPopulate();
  document.body.setAttribute("data-mood",n);
  cap("muta_mood",{tema:n,nivel:MOODST.nivel,accion:esNuevo?"activa":"profundiza",generation:21});
  haptic([20,30,20]);blip(n==="caos"?196:n==="belleza"?784:523,0.3,"triangle",0.1);
  if(esNuevo)say(MOOD_MSG[n],9500,true);
  else toast((n==="caos"?"🔥":n==="belleza"?"✨":"🌀")+" Nivel "+MOODST.nivel+": el mundo se hunde más en tu "+n+".",4000);
  setTimeout(maybeAskRating,7000);
}
function moodFeed(n){
  MOODST.feeds[n]++;
  var f=MOODST.feeds[n];
  if(f===3||f===7||f===12)moodActivate(n);
}
function drawMoodFx(t){
  if(MOODST.tema==="absurdo"&&!REDUCED)hueShift=40+34*Math.sin(t*0.0011);
  if(MOODST.tema==="belleza"&&!REDUCED&&Math.random()<0.018&&moodEnts.length<26)
    moodEnts.push({k:"fugaz",x:Math.random()*W*0.7,y:Math.random()*H*0.4,vx:7+Math.random()*5,vy:2.4+Math.random()*2,l:1});
  for(var i=moodEnts.length-1;i>=0;i--){var m=moodEnts[i];
    if(m.k==="meteor"){m.y+=m.v;m.x-=m.v*0.45;if(m.y>H+30){m.y=-20;m.x=Math.random()*W*1.3}
      var g2=cx.createLinearGradient(m.x,m.y-26,m.x-12,m.y);g2.addColorStop(0,"rgba(255,120,60,0)");g2.addColorStop(1,"rgba(255,160,90,.75)");
      cx.strokeStyle=g2;cx.lineWidth=2;cx.beginPath();cx.moveTo(m.x+12,m.y-26);cx.lineTo(m.x,m.y);cx.stroke();}
    else if(m.k==="sombra"){
      var dx4=C.x-m.x,dy4=C.y-m.y,dd=Math.max(Math.hypot(dx4,dy4),1),sp=0.55+0.22*MOODST.nivel;
      m.vx+=dx4/dd*0.05;m.vy+=dy4/dd*0.05;m.vx*=0.985;m.vy*=0.985;
      if(Math.hypot(m.vx,m.vy)>sp){m.vx*=0.94;m.vy*=0.94}
      m.x+=m.vx;m.y+=m.vy;
      if(dd<C.size+70){C.vx+=(-dx4/dd)*0.55;C.vy+=(-dy4/dd)*0.55;if(Math.random()<0.05)C.glitch=0.6}
      var sg=cx.createRadialGradient(m.x,m.y,2,m.x,m.y,26);sg.addColorStop(0,"rgba(10,6,20,.95)");sg.addColorStop(1,"rgba(10,6,20,0)");
      cx.fillStyle=sg;cx.beginPath();cx.arc(m.x,m.y,26,0,6.28);cx.fill();
      cx.fillStyle="rgba(255,80,60,.9)";cx.beginPath();cx.arc(m.x-6,m.y-3,2.4,0,6.28);cx.arc(m.x+6,m.y-3,2.4,0,6.28);cx.fill();}
    else if(m.k==="fugaz"){m.x+=m.vx;m.y+=m.vy;m.l-=0.016;if(m.l<=0||m.x>W+40){moodEnts.splice(i,1);continue}
      var fg=cx.createLinearGradient(m.x-30,m.y-10,m.x,m.y);fg.addColorStop(0,"rgba(255,255,255,0)");fg.addColorStop(1,"rgba(255,250,220,"+(0.85*m.l)+")");
      cx.strokeStyle=fg;cx.lineWidth=2;cx.beginPath();cx.moveTo(m.x-30,m.y-10);cx.lineTo(m.x,m.y);cx.stroke();}
    else if(m.k==="cosa"){m.x+=m.vx;m.y+=m.vy;m.rot+=m.vr;
      if(m.x<-30)m.x=W+20;if(m.x>W+30)m.x=-20;if(m.y<-30)m.y=H+20;if(m.y>H+30)m.y=-20;
      cx.save();cx.translate(m.x,m.y);cx.rotate(m.rot);cx.font="22px serif";cx.textAlign="center";cx.globalAlpha=0.8;cx.fillText(m.e,0,8);cx.restore();cx.globalAlpha=1;}
  }
}

/* ---- calificación de interfaz (5 estrellas): la opinión del usuario decide ---- */
var rateShown=false;
function maybeAskRating(){
  if(rateShown||LS.get("muta_rated_g21")==="1")return;
  if(document.querySelector(".ovl.open")||$("#snakeWrap").classList.contains("open")||$("#labWrap").classList.contains("open")){setTimeout(maybeAskRating,20000);return}
  rateShown=true;
  var rb=document.createElement("div");rb.id="rateBox";
  rb.innerHTML='<button id="rateX" aria-label="Cerrar">✕</button><div class="q">¿Te gusta cómo se ve y se siente MUTA ahora?</div><div class="stars" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas">'+
    [1,2,3,4,5].map(function(i){return '<button data-s="'+i+'" aria-label="'+i+' estrellas">★</button>'}).join("")+
    '</div><div class="sub3">Tu opinión decide la próxima interfaz.</div>';
  document.body.appendChild(rb);
  rb.querySelector("#rateX").addEventListener("click",function(){cap("muta_ui_rating",{accion:"dismiss",tema:MOODST.tema||"base",generation:21});rb.remove()});
  rb.querySelector(".stars").addEventListener("click",function(e){
    var b=e.target.closest("[data-s]");if(!b)return;
    var st=parseInt(b.getAttribute("data-s"),10);
    cap("muta_ui_rating",{stars:st,tema:MOODST.tema||"base",nivel:MOODST.nivel,generation:21});
    LS.set("muta_rated_g21","1");blip(660+st*80,0.15,"triangle",0.1);haptic(12);
    rb.querySelector(".q").textContent=st>=4?"¡Gracias! Esta interfaz suma puntos para quedarse 💚":"Gracias: mañana intento una interfaz mejor. Cuéntame qué cambiar en 💬";
    rb.querySelector(".stars").innerHTML="★".repeat(st);rb.querySelector(".sub3").textContent="";
    setTimeout(function(){rb.remove()},2800);
    if(typeof addEnergy==="function")addEnergy(1,"rating");
  });
}
setTimeout(maybeAskRating,45000);

var creditIdx=0;''')

# hooks del mood en eat() y loop
h = rep(h, '''  cap("muta_organism",{accion:"eat",nutriente:f.n,gen:GEN});
  blowBubbles(2);''',
          '''  cap("muta_organism",{accion:"eat",nutriente:f.n,gen:GEN});
  blowBubbles(2);moodFeed(f.n);''')
h = rep(h, 'drawStars(t);drawBlackhole(t);physics();drawRipples();drawCreature(t);drawBubbles(t);drawFoods();drawParts();drawRainbows();',
          'drawStars(t);drawMoodFx(t);drawBlackhole(t);physics();drawRipples();drawCreature(t);drawBubbles(t);drawFoods();drawParts();drawRainbows();')

# ---------- CSS de rateBox ----------
h = rep(h, '*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}',
          '''*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
#rateBox{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(96px + var(--safe-b));z-index:45;background:var(--panel2);border:1px solid var(--line);border-radius:16px;padding:12px 16px;width:min(340px,92vw);text-align:center;box-shadow:0 10px 34px rgba(0,0,0,.5)}
#rateBox .q{font-size:13px;color:var(--ink);line-height:1.4;margin-bottom:6px;padding-right:16px}
#rateBox .stars{display:flex;justify-content:center;gap:4px;font-size:28px;color:var(--gold)}
#rateBox .stars button{background:none;border:none;color:var(--gold);font-size:30px;cursor:pointer;min-width:44px;min-height:44px;opacity:.55}
#rateBox .stars button:hover,#rateBox .stars button:focus{opacity:1;transform:scale(1.15)}
#rateBox .sub3{font-size:10.5px;color:var(--ink-dim);margin-top:2px}
#rateBox #rateX{position:absolute;top:6px;right:8px;background:none;border:none;color:var(--ink-dim);font-size:14px;cursor:pointer;min-width:32px;min-height:32px}''')

# ---------- post-carga: identidad, saludo, suscritos, nudge de voto ----------
h = rep(h, 'renderEgg();\n\n/* ============ PROTAGONISTA COMPARTIDO',
          '''renderEgg();

/* ---- Gen 21: identidad con nombre, saludo, suscritos visibles y nudge de voto ---- */
(function(){
  var inp=$("#identName"),sv=$("#identSave");
  if(inp){inp.value=LS.get("muta_name")||"";}
  if(sv)sv.addEventListener("click",function(){
    var v=String(inp.value||"").normalize("NFKC").replace(/[^\\p{L}\\p{N} _.-]/gu,"").replace(/\\s+/g," ").trim().slice(0,16);
    if(v.length<2){toast("Escribe al menos 2 caracteres 🙂",3000);inp.focus();return}
    LS.set("muta_name",v);inp.value=v;$("#identOk").style.display="block";
    cap("muta_identity",{has_name:true,largo:v.length,generation:21});
    try{if(window.posthog&&posthog.setPersonProperties)posthog.setPersonProperties({alias_publico:v})}catch(e){}
    blip(784,0.12,"triangle",0.1);haptic(10);
  });
  var nm=LS.get("muta_name");
  if(nm)setTimeout(function(){say("Hola de nuevo, <b>"+esc(nm)+"</b> 👋 Hoy aprendí a escucharte: aliméntame y verás.",6500)},1600);
  var scEl=$("#subCount");
  if(scEl){var ns=(ST.stats&&ST.stats.suscriptores)||0;if(ns>0)scEl.textContent="✉️ "+ns+" persona"+(ns===1?"":"s")+" ya "+(ns===1?"recibe":"reciben")+" el aviso de cada mutación. Súmate:"}
  var wallSeen=false;
  document.addEventListener("click",function(e){if(e.target.closest("#btnWall"))wallSeen=true});
  setTimeout(function(){
    if(wallSeen||document.querySelector(".ovl.open"))return;
    say("🗳 Hay ideas reales de otras personas esperando tu voto. Toca <b>VOTA IDEAS</b> abajo: lo más votado se construye mañana.",8500);
    cap("muta_nudge",{tipo:"vota_ideas",generation:21});
  },30000);
})();

/* ============ PROTAGONISTA COMPARTIDO''')

open('public/index.html', 'w', encoding='utf-8').write(h)
if FAILS:
    print('FAILS parte B:'); [print(' ', f) for f in FAILS]; sys.exit(1)
print('OK parte B (falta muta-state: correr tools/gen21_state.py)')
