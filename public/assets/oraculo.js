/* ============ EL ORÁCULO DEL LEÓN — Gen 23: LA CARTA DEL ORÁCULO ============
   Nacido de GEN Fractal: «una bola de cristal que al tocarla entregue un mensaje
   positivo distinto para cada persona, una vez al día» + GEN Sutil: «deja el valor
   de la UF diario de Chile». Gen 23 profundiza el rito (83% de revelación en su
   primer día): tu mensaje ahora es una CARTA-IMAGEN compartible y descargable, y
   consultar el Oráculo días seguidos construye una racha honesta con hitos de energía.
   El Oráculo no predice el futuro: te presta un enfoque para hoy. Mensaje determinista
   por gen + fecha + orbe. Módulo con carga diferida. Sin secretos. */
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

/* ---- racha honesta (Gen 23): días consecutivos revelando; vive en este dispositivo ---- */
function ayerKey(){var d=new Date();d.setDate(d.getDate()-1);var p=function(x){return (x<10?"0":"")+x};
  return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())}
function getStreak(){var st={last:"",n:0};try{st=JSON.parse(LSget("muta_orc_racha"))||st}catch(e){}
  if(st.last!==hoyKey()&&st.last!==ayerKey())st.n=0;return st}
function bumpStreak(){var st=getStreak();
  if(st.last===hoyKey())return st.n;
  st.n=(st.last===ayerKey())?(st.n||0)+1:1;st.last=hoyKey();
  LSset("muta_orc_racha",JSON.stringify(st));
  if(typeof API.addEnergy==="function"){if(st.n===3)API.addEnergy(3,"racha_oraculo");if(st.n===7)API.addEnergy(5,"racha_oraculo")}
  return st.n}
function streakLabel(){var st=getStreak();
  return st.n>=2?"🔥 Racha: "+st.n+" días seguidos con el Oráculo":""}

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
    cap("muta_oracle",{action:"uf",ok:!!(j&&j.ok),generation:23,viewport_class:VPC()});
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
  "#orcCred{font-size:11.5px;color:#9aa3cf;max-width:520px;line-height:1.5}"+
  "#orcRacha{display:none;font-size:13px;font-weight:700;color:#ffd88a;margin-top:8px}"+
  "#orcRacha.show{display:block}"+
  "#orcCarta{display:none;margin-top:14px;border-top:1px solid rgba(255,255,255,.14);padding-top:14px}"+
  "#orcCarta.show{display:block}"+
  "#orcCartaImg{max-width:min(62vw,230px);border-radius:12px;border:1px solid rgba(141,110,255,.5);box-shadow:0 8px 30px rgba(0,0,0,.5)}"+
  "#orcCartaBtns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px}"+
  "#orcCartaBtns button{border:none;border-radius:12px;padding:10px 14px;font-weight:700;cursor:pointer;font-size:13.5px}"+
  "#orcCartaShare{background:linear-gradient(135deg,#ffd88a,#ff9a8a);color:#2a1608}"+
  "#orcCartaDl{background:rgba(255,255,255,.14);color:#fff}"+
  "#orcCartaNote{font-size:11.5px;color:#9aa3cf;margin-top:8px}";
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
     '<div id="orcCard"><p id="orcMsg"></p><div id="orcRacha"></div><div id="orcUf"></div><div id="orcMeta"></div>'+
       '<div id="orcBtns"><button id="orcShare">🖼 Mi carta de hoy</button><button id="orcAgain">Volver al organismo</button></div>'+
       '<div id="orcCarta"><img id="orcCartaImg" alt="Tu carta del Oráculo de hoy"><div id="orcCartaBtns">'+
         '<button id="orcCartaShare">📤 Compartir carta</button><button id="orcCartaDl">⬇️ Guardar imagen</button></div>'+
         '<div id="orcCartaNote">Tu carta lleva tu mensaje, tu racha y la UF real. Compartirla da +2 de energía a tu huevo.</div></div>'+
     '</div>'+
     '<p id="orcCred">Nacido de <b>GEN Fractal</b> (la bola de cristal con un mensaje diario por persona) y <b>GEN Sutil</b> (la UF de cada día). El Oráculo no predice el futuro: te presta un enfoque para hoy. Mañana a las 07:00 hay mensaje nuevo.</p>'+
   '</div>';
  document.body.appendChild(ovl);
  document.getElementById("orcX").addEventListener("click",close);
  document.getElementById("orcAgain").addEventListener("click",close);
  document.getElementById("orcShare").addEventListener("click",makeCarta);
  document.getElementById("orcCartaShare").addEventListener("click",shareCarta);
  document.getElementById("orcCartaDl").addEventListener("click",downloadCarta);
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
  cap("muta_oracle",{action:"pick",orb:orb,generation:23,gene_origin:GEN,viewport_class:VPC(),input_type:"touch"});
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
  var streakN=fresh?bumpStreak():getStreak().n;
  var rl=streakLabel();var re=document.getElementById("orcRacha");
  if(re){re.textContent=rl;re.classList.toggle("show",!!rl)}
  renderUF();if(!ufTried&&ufData===null)loadUF();
  if(fresh){
    burst(60);haptic([18,50,18]);blip(659,0.4,"sine",0.1);blip(880,0.5,"triangle",0.06);
    cap("muta_oracle",{action:"reveal",orb:orb,streak:streakN,generation:23,gene_origin:GEN,viewport_class:VPC()});
    if(typeof API.addEnergy==="function")API.addEnergy(2,"oraculo");
  }
}

/* ---- LA CARTA DEL ORÁCULO (Gen 23): tu mensaje como imagen compartible ---- */
var cartaCanvas=null;
function wrapText(c,text,x,y,maxW,lh){
  var words=text.split(" "),line="",lines=[];
  for(var i=0;i<words.length;i++){var t=line?line+" "+words[i]:words[i];
    if(c.measureText(t).width>maxW&&line){lines.push(line);line=words[i]}else line=t}
  if(line)lines.push(line);
  for(var j=0;j<lines.length;j++)c.fillText(lines[j],x,y+j*lh);
  return y+lines.length*lh;
}
function buildCarta(){
  var st=revealedToday();if(!st)return null;
  var msg=msgFor(st.orb);
  var cw=1080,ch=1350;
  var cv2=document.createElement("canvas");cv2.width=cw;cv2.height=ch;
  var c=cv2.getContext("2d");
  var g=c.createLinearGradient(0,0,0,ch);
  g.addColorStop(0,"#1a1440");g.addColorStop(0.55,"#0d1130");g.addColorStop(1,"#070a1e");
  c.fillStyle=g;c.fillRect(0,0,cw,ch);
  for(var i=0;i<130;i++){c.globalAlpha=0.25+Math.random()*0.6;c.fillStyle="#dfe6ff";
    c.beginPath();c.arc(Math.random()*cw,Math.random()*ch,Math.random()*2.4+0.6,0,6.28);c.fill()}
  c.globalAlpha=1;
  /* bola de cristal */
  var bx=cw/2,by=330,br=150;
  var rg=c.createRadialGradient(bx-br*0.35,by-br*0.4,br*0.1,bx,by,br);
  rg.addColorStop(0,"rgba(255,255,255,.9)");rg.addColorStop(0.2,"rgba(180,160,255,.4)");
  rg.addColorStop(0.6,"rgba(90,70,190,.55)");rg.addColorStop(1,"rgba(30,25,80,.95)");
  c.fillStyle=rg;c.beginPath();c.arc(bx,by,br,0,6.28);c.fill();
  c.strokeStyle="rgba(141,110,255,.8)";c.lineWidth=4;c.beginPath();c.arc(bx,by,br,0,6.28);c.stroke();
  c.shadowColor="rgba(141,110,255,.8)";c.shadowBlur=60;c.beginPath();c.arc(bx,by,br,0,6.28);c.stroke();c.shadowBlur=0;
  c.font="110px serif";c.textAlign="center";c.fillText(["🌙","⭐","🔥"][st.orb],bx,by+40);
  /* textos */
  c.fillStyle="#c9d0f2";c.font="700 34px system-ui,sans-serif";
  c.fillText("🔮 EL ORÁCULO DEL LEÓN · MUTA",cw/2,92);
  c.fillStyle="#9aa3cf";c.font="28px system-ui,sans-serif";
  c.fillText("Mensaje del "+hoyKey()+" · "+ORB_TONO[st.orb].replace(/^[^ ]+ /,""),cw/2,136);
  c.fillStyle="#f4f6ff";c.font="600 46px Georgia,serif";
  var yEnd=wrapText(c,"«"+msg+"»",cw/2,565,880,62);
  var y2=yEnd+30;
  var rl=streakLabel();
  if(rl){c.fillStyle="#ffd88a";c.font="700 34px system-ui,sans-serif";c.fillText(rl,cw/2,y2);y2+=56}
  if(ufData&&ufData.ok&&ufData.uf){
    c.fillStyle="#8ec5ff";c.font="700 34px system-ui,sans-serif";
    var ufTxt="💠 UF hoy: "+fmtCLP(ufData.uf.valor)+(ufData.dolar?"  ·  💵 Dólar: "+fmtCLP(ufData.dolar.valor):"");
    c.fillText(ufTxt,cw/2,y2);
    c.fillStyle="#9aa3cf";c.font="24px system-ui,sans-serif";
    c.fillText("Fuente: "+String(ufData.fuente||"mindicador.cl")+" · "+String(ufData.uf.fecha||hoyKey()),cw/2,y2+40);
    y2+=96}
  c.strokeStyle="rgba(255,255,255,.18)";c.lineWidth=2;
  c.beginPath();c.moveTo(160,ch-190);c.lineTo(cw-160,ch-190);c.stroke();
  c.fillStyle="#c9d0f2";c.font="700 30px system-ui,sans-serif";
  c.fillText("Carta de "+GEN,cw/2,ch-152);
  c.font="26px system-ui,sans-serif";c.fillStyle="#9aa3cf";
  c.fillText("cada persona recibe un mensaje distinto cada día",cw/2,ch-112);
  c.fillStyle="#7df9c6";c.font="700 34px system-ui,sans-serif";
  c.fillText("muta.revenuehub.cloud",cw/2,ch-62);
  return cv2;
}
function makeCarta(){
  var st=revealedToday();
  if(!st){document.getElementById("orcSub").textContent="Primero revela tu mensaje de hoy eligiendo un orbe.";return}
  cartaCanvas=buildCarta();if(!cartaCanvas)return;
  var img=document.getElementById("orcCartaImg");
  img.src=cartaCanvas.toDataURL("image/png");
  document.getElementById("orcCarta").classList.add("show");
  haptic(12);blip(740,0.2,"triangle",0.08);burst(30);
  cap("muta_oracle",{action:"card",orb:st.orb,streak:getStreak().n,generation:23,gene_origin:GEN,viewport_class:VPC()});
}
function cartaBlob(cb){if(!cartaCanvas)cartaCanvas=buildCarta();
  if(!cartaCanvas){cb(null);return}
  cartaCanvas.toBlob(function(b){cb(b)},"image/png")}
function shareCarta(){
  var st=revealedToday();var msg=st?msgFor(st.orb):"";
  var url=location.origin+"/?g="+encodeURIComponent(GEN);
  var txt="🔮 Mi carta del Oráculo de MUTA de hoy: «"+msg+"». Cada persona recibe un mensaje distinto cada día, junto a la UF real de Chile. Pide el tuyo: "+url;
  cap("muta_oracle",{action:"share_card",generation:23,gene_origin:GEN});
  cap("muta_share",{red:"oraculo_carta",gen:GEN});
  if(typeof API.addEnergy==="function")API.addEnergy(2,"share");
  cartaBlob(function(b){
    if(b&&navigator.share&&navigator.canShare&&navigator.canShare({files:[new File([b],"x.png",{type:"image/png"})]})){
      var f=new File([b],"oraculo-muta-"+hoyKey()+".png",{type:"image/png"});
      navigator.share({title:"El Oráculo de MUTA",text:txt,files:[f]}).catch(function(){});
    }else if(navigator.share){
      navigator.share({title:"El Oráculo de MUTA",text:txt,url:url}).catch(function(){});
      downloadCarta(true);
    }else{
      downloadCarta(true);
      try{navigator.clipboard.writeText(txt);
        var n=document.getElementById("orcCartaNote");
        if(n)n.textContent="📋 Texto copiado y carta descargada: súbela donde quieras. Tu gen viaja con ella."}catch(e){}
    }
  });
}
function downloadCarta(silent){
  cartaBlob(function(b){if(!b)return;
    var a=document.createElement("a");a.href=URL.createObjectURL(b);
    a.download="oraculo-muta-"+hoyKey()+".png";document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000)});
  if(silent!==true)cap("muta_oracle",{action:"card_download",generation:23,gene_origin:GEN});
}
function open(){
  build();sizeCv();STARS=stars();
  ovl.classList.add("open");
  if(anim)cancelAnimationFrame(anim);
  anim=requestAnimationFrame(loop);
  if(API.musicStart)API.musicStart("oraculo");
  cap("muta_oracle",{action:"open",generation:23,gene_origin:GEN,viewport_class:VPC()});
  cap("muta_enter_experience",{experience_id:"oraculo",mode:"oraculo",viewport_class:VPC(),gene_origin:GEN});
  var st=revealedToday();
  if(st){reveal(st.orb,false)}else{showOrbs()}
  loadUF();
}
function close(){
  ovl.classList.remove("open");
  if(anim){cancelAnimationFrame(anim);anim=null}
  if(API.musicStop)API.musicStop();
  cap("muta_oracle",{action:"close",generation:23});
}
window.MUTA_ORACULO={open:open};
if(window.__oraculoAutoStart){window.__oraculoAutoStart=false;open()}
})();
