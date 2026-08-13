/* ============ EL ORÁCULO DEL LEÓN — Gen 22 ============
   Nacido de GEN Fractal: «una bola de cristal que al tocarla entregue un mensaje
   positivo distinto para cada persona, una vez al día» + GEN Sutil: «deja el valor
   de la UF diario de Chile». Honesto por diseño: el Oráculo no predice el futuro,
   te presta un enfoque para hoy. El mensaje es determinista por gen + fecha + orbe.
   Módulo con carga diferida. Sin secretos. */
(function(){
"use strict";
if(window.MUTA_ORACULO)return;
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var esc=API.esc||function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var GEN=API.GEN||"GEN-0000";
var PNAME=API.PNAME||function(){return "viajera"};
var VPC=API.VPC||function(){return window.innerWidth<=720?"mobile":"desktop"};
var REDUCED=!!API.REDUCED;
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};

/* ---- mensajes del día: reflexión y bienestar, es-CL, sin promesas ---- */
var MSGS=[
"Hoy conversa cinco minutos sin mirar ninguna pantalla. Lo que escuches completo vale doble.",
"Elige la tarea que llevas tres días evitando y hazle solo el primer paso. El resto se ordena solo.",
"Camina una cuadra más de lo necesario. Las mejores ideas llegan a pie.",
"Hoy di que no a una cosa. Cada no honesto es un sí con más fuerza.",
"Toma agua antes del segundo café. Tu cabeza va a rendir mejor que ayer.",
"Escríbele hoy a esa persona que hace tiempo no ves. Dos líneas bastan.",
"Antes de responder algo que te molestó, cuenta hasta diez. El mensaje que no enviaste también comunica.",
"Ordena un solo cajón. El orden chico contagia al grande.",
"Hoy pregunta más de lo que afirmas. Quien pregunta dirige la conversación.",
"Sal a mirar el cielo un minuto. Santiago también tiene techo, aunque se nos olvide.",
"Anota tres cosas que salieron bien esta semana. La memoria es injusta con lo bueno.",
"Hoy haz una cosa a la vez. La multitarea es la manera más elegante de no terminar nada.",
"Duerme media hora más esta noche. Nadie recuerda el capítulo extra, todos notan el descanso.",
"Agradécele hoy a alguien que te facilitó el trabajo. En voz alta, no en silencio.",
"Deja el teléfono en otra pieza durante la comida. La sobremesa es un lujo gratis.",
"Hoy aprende una cosa chica: una palabra, un atajo, un dato. Chica pero tuya.",
"Perdónate un error de esta semana. Ya pagaste la lección, no sigas pagando intereses.",
"Mueve el cuerpo diez minutos antes del almuerzo. La tarde se nota distinta.",
"Hoy escucha una canción completa sin hacer nada más. Solo eso.",
"Dile a alguien de tu casa algo que haga bien. Lo obvio también necesita decirse.",
"Antes de comprar algo hoy, espera una hora. Si sigue haciendo sentido, adelante.",
"Hoy cierra una pestaña, un pendiente o una conversación a medias. Cerrar también es avanzar.",
"Respira hondo tres veces antes de la próxima reunión. Llegar entero vale más que llegar rápido.",
"Hoy pide ayuda en algo concreto. Pedir bien es una habilidad, no una derrota.",
"Cocina algo simple con calma. El resultado importa menos que el rato.",
"Hoy revisa tu semana y saca una cosa de la agenda. El espacio vacío también trabaja.",
"Ofrece ayuda antes de que te la pidan. Una vez basta para cambiar el día de alguien.",
"Hoy escribe a mano una idea que te dé vueltas. El papel piensa distinto.",
"Ponle nombre a lo que te tiene inquieto. Lo que se nombra se achica.",
"Hoy celebra un avance chico tuyo o de alguien más. Los grandes se construyen de estos.",
"Estira la espalda ahora mismo. Tu cuerpo lleva rato pidiéndolo.",
"Hoy deja algo mejor de como lo encontraste: una taza, un documento, una conversación.",
"Elige bien tu primera hora de mañana esta noche. El día se decide temprano.",
"Hoy mira un problema viejo con una pregunta nueva: ¿qué haría alguien que recién llega?",
"Guarda un rato para no hacer nada. El ocio bien llevado es mantenimiento, no flojera.",
"Hoy dale las gracias a tu yo de hace un año por algo que sembró. Y siembra algo para el que viene.",
"Reduce una notificación hoy. Tu atención es tuya, cóbrala.",
"Hoy conversa con alguien que piensa distinto y busca entender antes de responder.",
"Toma once con calma aunque sea un día ocupado. Los ritos chicos sostienen semanas grandes.",
"Hoy revisa qué estás postergando por miedo y qué por flojera. Se tratan distinto.",
"Camina bajo los árboles si puedes. La sombra verde arregla más de lo que parece.",
"Hoy simplifica una explicación que das seguido. Si no cabe en dos frases, aún no es tuya.",
"Apunta una idea antes de dormir. La almohada es mala bodega.",
"Hoy sonríele primero a alguien. Es el experimento más barato que existe.",
"Deja listo esta noche lo que tu mañana te va a agradecer: la ropa, la mochila, la primera tarea.",
"Hoy pon música mientras ordenas. El ánimo también se coreografía.",
"Antes de opinar hoy, pregunta una vez más. La segunda pregunta es donde vive lo interesante.",
"Hoy toma aire afuera aunque haga frío. Cinco minutos de invierno despejan una hora de pantalla."
];
var ORB_TONO=["🌙 el orbe de la calma","⭐ el orbe del impulso","🔥 el orbe del coraje"];

function hashStr(s){var h=5381,i;for(i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0}return Math.abs(h)}
function hoyKey(){var d=new Date();var p=function(x){return (x<10?"0":"")+x};return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())}
function msgFor(orb){var idx=(hashStr(GEN+"|"+hoyKey())+orb*7)%MSGS.length;return MSGS[idx]}
function LSget(k){try{return localStorage.getItem(k)}catch(e){return null}}
function LSset(k,v){try{localStorage.setItem(k,v)}catch(e){}}

/* ---- estado del día ---- */
function revealedToday(){var raw=LSget("muta_oraculo");if(!raw)return null;
  try{var o=JSON.parse(raw);if(o&&o.d===hoyKey()&&typeof o.orb==="number")return o}catch(e){}return null}

/* ---- UF real ---- */
var ufData=null,ufTried=false;
function fmtCLP(n){try{return "$"+Number(n).toLocaleString("es-CL",{minimumFractionDigits:2,maximumFractionDigits:2})}catch(e){return "$"+n}}
function renderUF(){
  var el=document.getElementById("orcUf");if(!el)return;
  if(ufData===null&&!ufTried){el.innerHTML="⏳ Buscando la UF de hoy…";return}
  if(!ufData||!ufData.ok||!ufData.uf){el.innerHTML="La fuente de indicadores no responde ahora mismo. Sin señal, no invento cifras.";return}
  var html="💠 <b>UF hoy: "+fmtCLP(ufData.uf.valor)+"</b>";
  if(ufData.dolar)html+=" · 💵 Dólar: "+fmtCLP(ufData.dolar.valor);
  html+="<span class=\"orcSrc\">Fuente: "+esc(ufData.fuente)+" · "+esc(ufData.uf.fecha)+" · pedido por <b>GEN Sutil</b></span>";
  el.innerHTML=html;
}
function loadUF(){
  fetch("/uf").then(function(r){return r.json()}).then(function(j){ufTried=true;ufData=j;renderUF();
    cap("muta_oracle",{action:"uf",ok:!!(j&&j.ok),generation:22,viewport_class:VPC()});
  }).catch(function(){ufTried=true;ufData={ok:false};renderUF()});
}

/* ---- UI ---- */
var built=false,ovl,cvs,ctx,anim=null,parts=[],T0=0;
function build(){
  if(built)return;built=true;
  var css=document.createElement("style");
  css.textContent=
  "#orcOvl{position:fixed;inset:0;z-index:1400;display:none;background:radial-gradient(120% 100% at 50% 0%,#1a1440 0%,#0b0f2a 62%,#070a1e 100%);color:#f4f6ff;overflow:hidden;touch-action:pan-y}"+
  "#orcOvl.open{display:block}"+
  "#orcCv{position:absolute;inset:0;width:100%;height:100%}"+
  "#orcIn{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:calc(env(safe-area-inset-top,0px) + 18px) 18px calc(env(safe-area-inset-bottom,0px) + 22px);text-align:center;overflow-y:auto;overscroll-behavior:contain}"+
  "#orcX{position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);right:12px;z-index:3;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(11,15,42,.85);color:#fff;font-size:17px;cursor:pointer}"+
  "#orcTitle{font-size:clamp(21px,4.6vw,30px);font-weight:800;letter-spacing:.4px;margin:0;text-shadow:0 2px 18px rgba(141,110,255,.55)}"+
  "#orcSub{max-width:520px;color:#c9d0f2;font-size:14.5px;line-height:1.55;margin:0}"+
  "#orcBall{width:min(46vw,190px);height:min(46vw,190px);border-radius:50%;position:relative;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.85) 0%,rgba(180,160,255,.35) 18%,rgba(90,70,190,.5) 55%,rgba(30,25,80,.9) 100%);box-shadow:0 0 46px rgba(141,110,255,.5),inset 0 0 34px rgba(255,255,255,.14);animation:orcFloat 5s ease-in-out infinite}"+
  "@media (prefers-reduced-motion:reduce){#orcBall{animation:none}}"+
  "@keyframes orcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}"+
  "#orcOrbs{display:flex;gap:18px;flex-wrap:wrap;justify-content:center}"+
  ".orcOrb{width:86px;height:86px;border-radius:50%;border:none;cursor:pointer;font-size:30px;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px rgba(141,110,255,.45);transition:transform .18s ease}"+
  ".orcOrb:active{transform:scale(.92)}"+
  ".orcOrb.o0{background:radial-gradient(circle at 34% 30%,#9db8ff,#2a2f7a)}"+
  ".orcOrb.o1{background:radial-gradient(circle at 34% 30%,#ffe9a3,#8a6a1f)}"+
  ".orcOrb.o2{background:radial-gradient(circle at 34% 30%,#ffb08a,#8a2f22)}"+
  ".orcLbl{font-size:11.5px;color:#c9d0f2;margin-top:6px;display:block}"+
  "#orcCard{display:none;max-width:560px;background:rgba(15,20,54,.92);border:1px solid rgba(141,110,255,.4);border-radius:18px;padding:20px 18px;backdrop-filter:blur(6px)}"+
  "#orcCard.show{display:block}"+
  "#orcMsg{font-size:clamp(17px,3.8vw,21px);line-height:1.55;font-weight:600;margin:0 0 10px}"+
  "#orcUf{font-size:14px;color:#d9def7;border-top:1px solid rgba(255,255,255,.14);margin-top:12px;padding-top:12px;line-height:1.6}"+
  ".orcSrc{display:block;font-size:11.5px;color:#9aa3cf;margin-top:4px}"+
  "#orcMeta{font-size:12px;color:#9aa3cf;margin-top:10px}"+
  "#orcBtns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}"+
  "#orcBtns button{border:none;border-radius:12px;padding:11px 16px;font-weight:700;cursor:pointer;font-size:14px}"+
  "#orcShare{background:linear-gradient(135deg,#7df9c6,#8ec5ff);color:#0b0f2a}"+
  "#orcAgain{background:rgba(255,255,255,.12);color:#fff}"+
  "#orcCred{font-size:11.5px;color:#9aa3cf;max-width:520px;line-height:1.5}";
  document.head.appendChild(css);
  ovl=document.createElement("div");ovl.id="orcOvl";ovl.setAttribute("role","dialog");ovl.setAttribute("aria-modal","true");ovl.setAttribute("aria-label","El Oráculo del León");
  ovl.innerHTML=
   '<canvas id="orcCv" aria-hidden="true"></canvas>'+
   '<button id="orcX" aria-label="Cerrar el Oráculo">✕</button>'+
   '<div id="orcIn">'+
     '<h2 id="orcTitle">🔮 El Oráculo del León</h2>'+
     '<p id="orcSub"></p>'+
     '<div id="orcBall" aria-hidden="true"></div>'+
     '<div id="orcOrbs" role="group" aria-label="Elige un orbe"></div>'+
     '<div id="orcCard"><p id="orcMsg"></p><div id="orcUf"></div><div id="orcMeta"></div>'+
       '<div id="orcBtns"><button id="orcShare">📤 Compartir mi mensaje</button><button id="orcAgain">Volver al organismo</button></div>'+
     '</div>'+
     '<p id="orcCred">Nacido de <b>GEN Fractal</b> (la bola de cristal con un mensaje diario por persona) y <b>GEN Sutil</b> (la UF de cada día). El Oráculo no predice el futuro: te presta un enfoque para hoy. Mañana a las 07:00 hay mensaje nuevo.</p>'+
   '</div>';
  document.body.appendChild(ovl);
  document.getElementById("orcX").addEventListener("click",close);
  document.getElementById("orcAgain").addEventListener("click",close);
  document.getElementById("orcShare").addEventListener("click",share);
  cvs=document.getElementById("orcCv");ctx=cvs.getContext("2d");
  window.addEventListener("resize",sizeCv);
}
function sizeCv(){if(!cvs)return;var d=Math.min(window.devicePixelRatio||1,2);
  cvs.width=Math.round(window.innerWidth*d);cvs.height=Math.round(window.innerHeight*d);
  ctx.setTransform(d,0,0,d,0,0)}
function stars(){var out=[],n=window.innerWidth<520?60:110,i;
  for(i=0;i<n;i++)out.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*1.4+0.3,tw:Math.random()*6.28});
  return out}
var STARS=[];
function loop(t){
  if(!ovl.classList.contains("open"))return;
  var W=window.innerWidth,H=window.innerHeight;
  ctx.clearRect(0,0,W,H);
  for(var i=0;i<STARS.length;i++){var s=STARS[i];
    ctx.globalAlpha=REDUCED?0.6:0.35+0.4*Math.abs(Math.sin(t*0.001+s.tw));
    ctx.fillStyle="#dfe6ff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill()}
  ctx.globalAlpha=1;
  for(var j=parts.length-1;j>=0;j--){var p=parts[j];
    p.x+=p.vx;p.y+=p.vy;p.vy+=0.02;p.l-=0.012;
    if(p.l<=0){parts.splice(j,1);continue}
    ctx.globalAlpha=p.l;ctx.fillStyle="hsl("+p.h+",90%,72%)";
    ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,6.28);ctx.fill()}
  ctx.globalAlpha=1;
  anim=requestAnimationFrame(loop);
}
function burst(n){if(REDUCED)return;var W=window.innerWidth,H=window.innerHeight;
  for(var i=0;i<n;i++){var a=Math.random()*6.28,v=1+Math.random()*3;
    parts.push({x:W/2,y:H*0.42,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,l:1,h:250+Math.random()*80})}}

function showOrbs(){
  var box=document.getElementById("orcOrbs");box.innerHTML="";
  document.getElementById("orcSub").innerHTML="Hola, <b>"+esc(PNAME())+"</b>. El León guarda un mensaje para ti hoy. Elige un orbe: cada uno abre un mensaje distinto y solo puedes revelar uno al día.";
  document.getElementById("orcCard").classList.remove("show");
  for(var i=0;i<3;i++)(function(orb){
    var wrap=document.createElement("div");
    var b=document.createElement("button");b.className="orcOrb o"+orb;b.textContent=["🌙","⭐","🔥"][orb];
    b.setAttribute("aria-label","Elegir "+ORB_TONO[orb]);
    b.addEventListener("click",function(){pick(orb)});
    var l=document.createElement("span");l.className="orcLbl";l.textContent=ORB_TONO[orb].replace(/^[^ ]+ /,"");
    wrap.appendChild(b);wrap.appendChild(l);box.appendChild(wrap);
  })(i);
}
function pick(orb){
  cap("muta_oracle",{action:"pick",orb:orb,generation:22,gene_origin:GEN,viewport_class:VPC(),input_type:"touch"});
  haptic(12);blip(392,0.2,"sine",0.09);
  var box=document.getElementById("orcOrbs");box.innerHTML="";
  document.getElementById("orcSub").textContent="El cristal gira…";
  burst(40);
  var delay=REDUCED?250:1600;
  if(!REDUCED){var k=0;var iv=setInterval(function(){burst(14);blip(523+k*60,0.12,"triangle",0.05);k++;if(k>2)clearInterval(iv)},420)}
  setTimeout(function(){
    LSset("muta_oraculo",JSON.stringify({d:hoyKey(),orb:orb}));
    reveal(orb,true);
  },delay);
}
function reveal(orb,fresh){
  var msg=msgFor(orb);
  document.getElementById("orcOrbs").innerHTML="";
  document.getElementById("orcSub").textContent=fresh?"Tu mensaje de hoy, solo tuyo:":"Ya revelaste tu mensaje de hoy. Aquí lo tienes de nuevo:";
  var card=document.getElementById("orcCard");card.classList.add("show");
  document.getElementById("orcMsg").textContent="«"+msg+"»";
  document.getElementById("orcMeta").innerHTML="Elegiste "+esc(ORB_TONO[orb])+" · mensaje del "+esc(hoyKey())+" para <b>"+esc(GEN)+"</b> · mañana hay uno nuevo";
  renderUF();if(!ufTried&&ufData===null)loadUF();
  if(fresh){
    burst(60);haptic([18,50,18]);blip(659,0.4,"sine",0.1);blip(880,0.5,"triangle",0.06);
    cap("muta_oracle",{action:"reveal",orb:orb,generation:22,gene_origin:GEN,viewport_class:VPC()});
    if(typeof API.addEnergy==="function")API.addEnergy(2,"oraculo");
  }
}
function share(){
  var st=revealedToday();var msg=st?msgFor(st.orb):"";
  var url=location.origin+"/?g="+encodeURIComponent(GEN);
  var txt="🔮 El Oráculo de MUTA me dejó este mensaje de hoy: «"+msg+"». Cada persona recibe uno distinto cada día, y de paso te muestra la UF real. Pide el tuyo:";
  cap("muta_oracle",{action:"share",generation:22,gene_origin:GEN});
  cap("muta_share",{red:"oraculo",gen:GEN});
  if(typeof API.addEnergy==="function")API.addEnergy(2,"share");
  if(navigator.share){navigator.share({title:"El Oráculo de MUTA",text:txt,url:url}).catch(function(){})}
  else{try{navigator.clipboard.writeText(txt+" "+url);
    var m=document.getElementById("orcMeta");if(m)m.innerHTML="📋 Mensaje copiado: pégalo donde quieras. Tu gen viaja con él."}catch(e){}}
}
function open(){
  build();sizeCv();STARS=stars();
  ovl.classList.add("open");
  if(anim)cancelAnimationFrame(anim);
  anim=requestAnimationFrame(loop);
  if(API.musicStart)API.musicStart("oraculo");
  cap("muta_oracle",{action:"open",generation:22,gene_origin:GEN,viewport_class:VPC()});
  cap("muta_enter_experience",{experience_id:"oraculo",mode:"oraculo",viewport_class:VPC(),gene_origin:GEN});
  var st=revealedToday();
  if(st){reveal(st.orb,false)}else{showOrbs()}
  loadUF();
}
function close(){
  ovl.classList.remove("open");
  if(anim){cancelAnimationFrame(anim);anim=null}
  if(API.musicStop)API.musicStop();
  cap("muta_oracle",{action:"close",generation:22});
}
window.MUTA_ORACULO={open:open};
if(window.__oraculoAutoStart){window.__oraculoAutoStart=false;open()}
})();
