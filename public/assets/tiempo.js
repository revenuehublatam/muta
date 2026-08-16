/* ============ LA MÁQUINA DEL TIEMPO — Gen 24 ============
   Nacida de una idea fresca susurrada el 15-ago: «Crea una máquina del tiempo…
   un perro y un gato. Cuentan chistes.» (GEN Viajero) fusionada con el backlog de
   GEN Errante: «vestuario y joyas vintage desde 1800 al 1900». Viaja por 6 épocas,
   cada una con su mundo visual; CRONO el perro y VOLTA la gata te acompañan y
   cuentan un chiste distinto por época y por día. Cada época visitada deja una
   POSTAL coleccionable; cada día una época es LA ÉPOCA DORADA y su postal brilla.
   Todo determinista por gen + fecha: honesto, sin datos inventados.
   Módulo con carga diferida. Sin secretos. */
(function(){
"use strict";
if(window.MUTA_TIEMPO)return;
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

/* ---- épocas ---- */
var ERAS=[
{id:"1520",ano:"1520",nombre:"El Estrecho",sub:"Magallanes cruza el fin del mundo",
 colores:["#03182e","#0a3a5c","#0e5a7a"],acc:"#7fd4ff",em:"⛵",
 deco:"olas",
 desc:"Océano abierto, carabelas y un estrecho que todavía no tiene nombre."},
{id:"1889",ano:"1889",nombre:"La Belle Époque",sub:"vestuario y joyas de 1800 a 1900",
 colores:["#2b1608","#5a3315","#8a5a24"],acc:"#ffd98a",em:"🎩",
 deco:"lamparas",
 desc:"Salones a gas, terciopelo, joyas y valses. La época que pidió GEN Errante."},
{id:"1925",ano:"1925",nombre:"Jazz y Radio",sub:"el mundo baila charlestón",
 colores:["#1a0e24","#3d1e4e","#6a2e6e"],acc:"#ff9ed2",em:"🎷",
 deco:"deco",
 desc:"Art déco, radios de válvulas y un saxofón que no duerme."},
{id:"1969",ano:"1969",nombre:"La Luna",sub:"un pequeño paso",
 colores:["#050510","#101028","#1c1c46"],acc:"#cfd8ff",em:"🌕",
 deco:"luna",
 desc:"Polvo lunar, radios en la Tierra y la humanidad mirando hacia arriba."},
{id:"1999",ano:"1999",nombre:"Internet Vintage",sub:"módem, píxeles y mensajería",
 colores:["#001a00","#003300","#0a4d0a"],acc:"#7dff7d",em:"💾",
 deco:"pixel",
 desc:"El módem canta, las páginas tardan y cada mensaje nuevo suena a campana."},
{id:"2126",ano:"2126",nombre:"El Mañana",sub:"cien años después de MUTA",
 colores:["#0a0018","#1e0640","#3a0e6e"],acc:"#b48aff",em:"🛸",
 deco:"neon",
 desc:"Nadie sabe cómo será. La máquina solo promete que seguirá mutando."}];

/* ---- chistes por época (es-CL neutro, aptos para todo público) ---- */
var CHISTES={
"1520":[
 ["CRONO","¿Por qué el barco de Magallanes nunca se perdía?","Porque siempre seguía el canal… el Canal de Todos los Santos."],
 ["VOLTA","Le dije al vigía que buscara tierra.","Lleva tres días mirando un macetero."],
 ["CRONO","¿Qué le dijo el océano a la carabela?","Nada. Solo hizo olas."],
 ["VOLTA","Los marineros comen galletas duras hace meses.","Yo, con nueve vidas, igual pediría otro menú."],
 ["CRONO","¿Por qué los perros somos buenos navegantes?","Porque nunca perdemos el rumbo del hueso… digo, del norte."]],
"1889":[
 ["VOLTA","¿Por qué la lámpara de gas fue a la ópera?","Porque quería brillar en sociedad."],
 ["CRONO","Me probé un sombrero de copa.","Ahora soy un perro de alta sociedad: guau, digo, wow."],
 ["VOLTA","¿Qué dijo el collar de perlas al vestido?","Contigo hasta el último vals."],
 ["CRONO","En 1889 inauguraron una torre en París.","Dicen que era temporal. Sigo esperando que la saquen."],
 ["VOLTA","Los gatos inventamos la elegancia.","Los humanos de 1889 solo tomaron apuntes."]],
"1925":[
 ["CRONO","¿Por qué el saxofón nunca se enoja?","Porque todo lo resuelve con buen tono."],
 ["VOLTA","Bailé charlestón toda la noche.","Mis nueve vidas quedaron en siete."],
 ["CRONO","¿Qué le dijo la radio al silencio?","Aquí mando yo."],
 ["VOLTA","En los años 20 todo era una fiesta.","Hasta que llegaba el gato del vecino a mejorar la música."],
 ["CRONO","¿Por qué los perros amamos el jazz?","Porque somos expertos en improvisar."]],
"1969":[
 ["VOLTA","¿Por qué el gato no viajó a la Luna?","Porque nadie le garantizó un lugar soleado para dormir."],
 ["CRONO","La Luna no tiene atmósfera.","Igual que algunas reuniones."],
 ["VOLTA","Un pequeño paso para el hombre…","un salto enorme para el gato que estaba en el techo."],
 ["CRONO","¿Qué come un astronauta perro?","Galletas espaciales, obvio."],
 ["VOLTA","La Luna controla las mareas.","Yo controlo la casa. Cada quien su órbita."]],
"1999":[
 ["CRONO","¿Por qué el módem aullaba?","Porque era de la familia: conectaba con los suyos."],
 ["VOLTA","Mandé un mensaje en 1999.","Llegó recién. Saludos desde el pasado."],
 ["CRONO","¿Qué le dijo el disquete al computador?","Guárdame, que valgo 1.44."],
 ["VOLTA","En 1999 la gente esperaba un minuto por una foto.","Hoy no esperan ni que termine de contar el chiste."],
 ["CRONO","¿Por qué internet olía raro en 1999?","Por las páginas con tantas cookies guardadas."]],
"2126":[
 ["VOLTA","En el futuro los gatos gobernamos.","Perdón: eso ya pasaba en el presente."],
 ["CRONO","¿Cómo saluda un robot chileno en 2126?","Hola-hola, ¿cachai el algoritmo?"],
 ["VOLTA","Vi mi taza de café del futuro.","Se lava sola. Por fin una época civilizada."],
 ["CRONO","¿Por qué la máquina del tiempo llega siempre puntual?","Porque si llega tarde, llega temprano igual."],
 ["VOLTA","¿Qué muta MUTA en 2126?","Ni idea. Para eso falta un siglo de ideas de ustedes."]]};

/* ---- determinismo: hash simple gen+fecha+era ---- */
function hstr(s){var h=5381,i;for(i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h}
function hoyUTC(){var d=new Date();return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0")}
function eraDorada(){return ERAS[hstr("dorada|"+hoyUTC())%ERAS.length].id}
function chisteDe(era,extra){var arr=CHISTES[era]||[];if(!arr.length)return null;
  return arr[hstr(GEN+"|"+hoyUTC()+"|"+era+"|"+(extra||0))%arr.length]}

/* ---- postales (persistidas por gen) ---- */
var PKEY="muta_tw_postales_"+GEN;
function getPostales(){try{return JSON.parse(LSg(PKEY)||"{}")}catch(e){return{}}}
function setPostales(p){LSs(PKEY,JSON.stringify(p))}

/* ---- estado ---- */
var TW={open:false,idx:0,raf:0,cv:null,cx:null,t:0,touches:null};

/* ---- estilos ---- */
var css=document.createElement("style");
css.textContent=
"#twWrap{position:fixed;inset:0;z-index:1200;display:none;background:#05030f;color:#fff;font-family:inherit;overflow:hidden;touch-action:pan-y}"+
"#twWrap.open{display:block}"+
"#twCv{position:absolute;inset:0;width:100%;height:100%}"+
"#twUi{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:calc(10px + env(safe-area-inset-top,0px)) 12px calc(12px + env(safe-area-inset-bottom,0px));pointer-events:none}"+
"#twUi>*{pointer-events:auto}"+
"#twTop{display:flex;align-items:center;justify-content:space-between;gap:8px}"+
"#twTitle{font-size:13px;font-weight:800;letter-spacing:1.5px;background:rgba(5,3,15,.65);border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:7px 12px}"+
"#twX{width:44px;height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.35);background:rgba(5,3,15,.65);color:#fff;font-size:18px;cursor:pointer}"+
"#twMid{text-align:center;max-width:560px;margin:0 auto;padding:0 6px}"+
"#twYear{font-size:56px;font-weight:900;letter-spacing:2px;line-height:1;text-shadow:0 2px 18px rgba(0,0,0,.6)}"+
"#twEra{font-size:20px;font-weight:800;margin-top:4px}"+
"#twSub{font-size:12.5px;opacity:.85;margin-top:2px}"+
"#twDesc{font-size:13px;opacity:.9;margin-top:8px;line-height:1.45}"+
"#twGold{display:none;margin:8px auto 0;font-size:11.5px;font-weight:800;letter-spacing:.6px;color:#ffd98a;background:rgba(90,60,10,.55);border:1px solid #ffd98a;border-radius:20px;padding:4px 12px;width:max-content}"+
"#twComp{display:flex;align-items:flex-start;justify-content:center;gap:10px;margin-top:12px}"+
"#twComp .pet{font-size:34px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}"+
"#twBubble{position:relative;background:rgba(255,255,255,.94);color:#1a1030;border-radius:14px;padding:10px 13px;max-width:330px;text-align:left;font-size:13.5px;line-height:1.45;box-shadow:0 6px 20px rgba(0,0,0,.35)}"+
"#twBubble b{display:block;font-size:11px;letter-spacing:1px;opacity:.65;margin-bottom:2px}"+
"#twBubble .punch{display:block;margin-top:4px;font-weight:700}"+
"#twMore{margin-top:8px;font-size:12px;font-weight:700;border:none;background:#2a1a52;color:#e8ddff;border-radius:10px;padding:8px 12px;cursor:pointer;min-height:36px}"+
"#twBot{display:flex;flex-direction:column;gap:10px;align-items:center}"+
"#twAlbum{display:flex;gap:7px;background:rgba(5,3,15,.6);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:8px 10px}"+
"#twAlbum .slot{width:38px;height:48px;border-radius:7px;border:1.5px dashed rgba(255,255,255,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:15px;color:rgba(255,255,255,.4);gap:1px}"+
"#twAlbum .slot small{font-size:8px;letter-spacing:.3px}"+
"#twAlbum .slot.got{border-style:solid;border-color:rgba(255,255,255,.65);color:#fff;background:rgba(255,255,255,.1)}"+
"#twAlbum .slot.gold{border-color:#ffd98a;box-shadow:0 0 10px rgba(255,217,138,.45);color:#ffd98a}"+
"#twNav{display:flex;align-items:center;gap:10px}"+
"#twNav button{min-width:48px;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.35);background:rgba(5,3,15,.7);color:#fff;font-size:20px;cursor:pointer}"+
"#twNav .go{font-size:13px;font-weight:800;letter-spacing:.5px;padding:0 18px}"+
"#twActions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}"+
"#twActions button{min-height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:#fff;font-size:12.5px;font-weight:700;padding:8px 14px;cursor:pointer}"+
"#twHint{font-size:10.5px;opacity:.6;text-align:center}"+
"@media (max-width:720px){#twYear{font-size:44px}#twBubble{max-width:250px;font-size:12.5px}}"+
"@media (prefers-reduced-motion:reduce){#twWrap *{animation:none!important;transition:none!important}}";
document.head.appendChild(css);

/* ---- markup ---- */
var wrap=document.createElement("div");wrap.id="twWrap";
wrap.setAttribute("role","dialog");wrap.setAttribute("aria-modal","true");
wrap.setAttribute("aria-label","La Máquina del Tiempo");
wrap.innerHTML=
'<canvas id="twCv" aria-hidden="true"></canvas>'+
'<div id="twUi">'+
' <div id="twTop"><span id="twTitle">⏳ LA MÁQUINA DEL TIEMPO</span><button id="twX" aria-label="Cerrar la máquina del tiempo">✕</button></div>'+
' <div id="twMid">'+
'  <div id="twYear"></div><div id="twEra"></div><div id="twSub"></div><div id="twDesc"></div>'+
'  <div id="twGold">✨ ÉPOCA DORADA DE HOY: tu postal brilla</div>'+
'  <div id="twComp"><span class="pet" id="twDog" title="CRONO">🐕</span>'+
'   <div id="twBubble"><b id="twWho"></b><span id="twSetup"></span><span class="punch" id="twPunch"></span>'+
'   <button id="twMore">😹 Otro chiste</button></div>'+
'  <span class="pet" id="twCat" title="VOLTA">🐈</span></div>'+
' </div>'+
' <div id="twBot">'+
'  <div id="twAlbum" aria-label="Álbum de postales"></div>'+
'  <div id="twNav"><button id="twPrev" aria-label="Época anterior">‹</button>'+
'  <button class="go" id="twGo">VIAJAR AQUÍ</button>'+
'  <button id="twNext" aria-label="Época siguiente">›</button></div>'+
'  <div id="twActions"><button id="twPostal">📮 Mi postal de esta época</button><button id="twShare">📤 Compartir</button></div>'+
'  <div id="twHint">Desliza ‹ › para moverte por el tiempo · cada época visitada deja una postal · junta las 6</div>'+
' </div></div>';
document.body.appendChild(wrap);
var $=function(s){return wrap.querySelector(s)};

/* ---- fondo canvas por época ---- */
function resize(){var cv=$("#twCv");cv.width=wrap.clientWidth;cv.height=wrap.clientHeight}
function draw(){
  var cv=$("#twCv"),cx=cv.getContext("2d"),E=ERAS[TW.idx],w=cv.width,h=cv.height;
  var g=cx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,E.colores[0]);g.addColorStop(.55,E.colores[1]);g.addColorStop(1,E.colores[2]);
  cx.fillStyle=g;cx.fillRect(0,0,w,h);
  var t=TW.t;cx.save();
  if(E.deco==="olas"){cx.strokeStyle="rgba(127,212,255,.35)";cx.lineWidth=2;
    for(var r=0;r<6;r++){cx.beginPath();for(var x=0;x<=w;x+=8){var y=h*.62+r*26+Math.sin(x*.02+t*.8+r)*7;x===0?cx.moveTo(x,y):cx.lineTo(x,y)}cx.stroke()}
    cx.font=Math.round(Math.min(w,h)*.12)+"px serif";cx.fillText("⛵",w*.5+Math.sin(t*.4)*w*.06-30,h*.6+Math.sin(t*.8)*6)}
  else if(E.deco==="lamparas"){for(var i=0;i<7;i++){var lx=(i+.5)*w/7,ly=h*.16+Math.sin(t*.5+i)*3;
    cx.fillStyle="rgba(255,217,138,.9)";cx.beginPath();cx.arc(lx,ly,5,0,7);cx.fill();
    var gg=cx.createRadialGradient(lx,ly,2,lx,ly,55);gg.addColorStop(0,"rgba(255,217,138,.35)");gg.addColorStop(1,"rgba(255,217,138,0)");
    cx.fillStyle=gg;cx.beginPath();cx.arc(lx,ly,55,0,7);cx.fill();
    cx.strokeStyle="rgba(255,217,138,.3)";cx.beginPath();cx.moveTo(lx,0);cx.lineTo(lx,ly-5);cx.stroke()}
    cx.font=Math.round(Math.min(w,h)*.1)+"px serif";cx.fillText("💎",w*.16,h*.8);cx.fillText("🎻",w*.72,h*.82)}
  else if(E.deco==="deco"){cx.strokeStyle="rgba(255,158,210,.4)";cx.lineWidth=2;
    for(var a=0;a<9;a++){cx.beginPath();cx.arc(w/2,h*.95,(a+1)*Math.min(w,h)*.08+Math.sin(t+a)*3,Math.PI,2*Math.PI);cx.stroke()}
    cx.font=Math.round(Math.min(w,h)*.1)+"px serif";cx.fillText("🎷",w*.2,h*.32);cx.fillText("📻",w*.68,h*.3)}
  else if(E.deco==="luna"){cx.fillStyle="#fff";
    for(var s=0;s<90;s++){var sx=hstr("s"+s)%w,sy=hstr("y"+s)%h,tw2=(Math.sin(t*2+s)+1)/2;
      cx.globalAlpha=.25+tw2*.6;cx.fillRect(sx,sy,2,2)}
    cx.globalAlpha=1;var mg=cx.createRadialGradient(w*.72,h*.26,10,w*.72,h*.26,Math.min(w,h)*.16);
    mg.addColorStop(0,"#f4f2e8");mg.addColorStop(1,"#b9b6a4");cx.fillStyle=mg;
    cx.beginPath();cx.arc(w*.72,h*.26,Math.min(w,h)*.13,0,7);cx.fill();
    cx.fillStyle="rgba(0,0,0,.12)";[[.68,.22,.02],[.75,.29,.015],[.7,.3,.012]].forEach(function(c){cx.beginPath();cx.arc(w*c[0],h*c[1],Math.min(w,h)*c[2]+3,0,7);cx.fill()})}
  else if(E.deco==="pixel"){var cs=22;cx.globalAlpha=.5;
    for(var px=0;px<w;px+=cs)for(var py=0;py<h;py+=cs){if(hstr(px+"|"+py)%17===0){cx.fillStyle=(hstr(py+"·"+px)%2)?"#0f0":"#063";
      var on=(Math.floor(t*2)+px+py)%9!==0;if(on)cx.fillRect(px,py,cs-2,cs-2)}}
    cx.globalAlpha=1;cx.font=Math.round(Math.min(w,h)*.09)+"px monospace";cx.fillStyle="#7dff7d";cx.fillText("@",w*.15,h*.75);cx.fillText("</>",w*.66,h*.72)}
  else{cx.globalAlpha=.85;
    for(var b=0;b<10;b++){var bw=w/12,bx=b*w/10+((b%3)*8),bh=h*(.25+((hstr("b"+b)%40)/100));
      cx.fillStyle="rgba(30,6,64,.9)";cx.fillRect(bx,h-bh,bw,bh);
      cx.fillStyle="rgba(180,138,255,.8)";
      for(var wy=h-bh+10;wy<h-12;wy+=18)if(hstr(b+"·"+wy)%3!==0)cx.fillRect(bx+6,wy,bw-12,4)}
    cx.globalAlpha=1;cx.font=Math.round(Math.min(w,h)*.08)+"px serif";cx.fillText("🛸",w*.5+Math.sin(t*.7)*w*.2-20,h*.2+Math.cos(t*.9)*12)}
  cx.restore()}
function loop(){if(!TW.open)return;TW.t+=.016;draw();if(!REDUCED)TW.raf=requestAnimationFrame(loop)}

/* ---- render de UI por época ---- */
function renderAlbum(){
  var P=getPostales(),el=$("#twAlbum");el.innerHTML="";
  ERAS.forEach(function(E){var got=P[E.id],d=document.createElement("div");
    d.className="slot"+(got?" got":"")+(got&&got.dorada?" gold":"");
    d.title=E.ano+" "+E.nombre+(got?" · postal conseguida"+(got.dorada?" (dorada)":""):" · sin visitar");
    d.innerHTML=(got?E.em:"·")+"<small>"+E.ano+"</small>";el.appendChild(d)})}
function renderEra(nueva){
  var E=ERAS[TW.idx];
  $("#twYear").textContent=E.ano;
  $("#twEra").textContent=E.em+" "+E.nombre;
  $("#twSub").textContent=E.sub;
  $("#twDesc").textContent=E.desc;
  $("#twGold").style.display=(E.id===eraDorada())?"block":"none";
  TW.jokeN=0;renderChiste();
  renderAlbum();resize();draw();
  if(nueva){haptic(14);blip(420+TW.idx*60,0.12,"sine",0.08)}}
function renderChiste(){
  var E=ERAS[TW.idx],c=chisteDe(E.id,TW.jokeN);if(!c)return;
  $("#twWho").textContent=(c[0]==="CRONO"?"🐕 CRONO":"🐈 VOLTA")+" cuenta:";
  $("#twSetup").textContent=c[1];
  $("#twPunch").textContent=c[2]}

/* ---- viajar: postal + energía ---- */
function viajar(){
  var E=ERAS[TW.idx],P=getPostales(),dor=E.id===eraDorada(),hoy=hoyUTC();
  var prev=P[E.id],primera=!prev;
  P[E.id]=P[E.id]||{n:0,desde:hoy,dorada:false};
  P[E.id].n++;if(dor)P[E.id].dorada=true;
  setPostales(P);
  var dayKey="muta_tw_dia_"+GEN+"_"+E.id;
  var yaHoy=LSg(dayKey)===hoy;
  if(!yaHoy){LSs(dayKey,hoy);addEnergy(dor?2:1,"tiempo");
    toastTW(dor?"✨ POSTAL DORADA de "+E.ano+" conseguida · +2 ⚡":"📮 Postal de "+E.ano+" conseguida · +1 ⚡")}
  else toastTW("Ya tienes la postal de hoy de "+E.ano+". Mañana hay otra.");
  cap("muta_tiempo",{action:"travel",era:E.id,dorada:dor,primera_vez:primera,generation:24,experience_id:"tiempo",viewport_class:VPC(),gene_origin:GEN});
  var todas=ERAS.every(function(e){return P[e.id]});
  if(todas&&LSg("muta_tw_full_"+GEN)!=="1"){LSs("muta_tw_full_"+GEN,"1");
    addEnergy(5,"tiempo_full");haptic(30);blip(660,0.3,"triangle",0.12);
    toastTW("🏆 ¡ÁLBUM COMPLETO! Las 6 épocas son tuyas · +5 ⚡");
    cap("muta_tiempo",{action:"collect_all",generation:24,gene_origin:GEN})}
  renderAlbum();renderEra(false);haptic(18)}

/* ---- toast propio ---- */
var toastT=0;
function toastTW(msg){
  var t=$("#twToast");
  if(!t){t=document.createElement("div");t.id="twToast";
    t.style.cssText="position:absolute;left:50%;transform:translateX(-50%);bottom:calc(30% + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.95);color:#1a1030;font-size:13px;font-weight:700;border-radius:12px;padding:10px 16px;z-index:5;max-width:86%;text-align:center;box-shadow:0 6px 22px rgba(0,0,0,.4)";
    wrap.appendChild(t)}
  t.textContent=msg;t.style.display="block";
  clearTimeout(toastT);toastT=setTimeout(function(){t.style.display="none"},3400)}

/* ---- postal-imagen 1080x1350 ---- */
function postalCanvas(cb){
  var E=ERAS[TW.idx],P=getPostales(),got=P[E.id],dor=!!(got&&got.dorada);
  var n=ERAS.filter(function(e){return P[e.id]}).length;
  var cv=document.createElement("canvas");cv.width=1080;cv.height=1350;
  var cx=cv.getContext("2d");
  var g=cx.createLinearGradient(0,0,0,1350);
  g.addColorStop(0,E.colores[0]);g.addColorStop(.55,E.colores[1]);g.addColorStop(1,E.colores[2]);
  cx.fillStyle=g;cx.fillRect(0,0,1080,1350);
  cx.strokeStyle=dor?"#ffd98a":"rgba(255,255,255,.5)";cx.lineWidth=dor?14:8;
  cx.strokeRect(40,40,1000,1270);
  cx.textAlign="center";cx.fillStyle="#fff";
  cx.font="700 44px system-ui,sans-serif";cx.fillText("POSTAL DEL TIEMPO"+(dor?" · DORADA ✨":""),540,150);
  cx.font="900 240px system-ui,sans-serif";cx.fillText(E.ano,540,470);
  cx.font="160px serif";cx.fillText(E.em,540,680);
  cx.font="800 64px system-ui,sans-serif";cx.fillText(E.nombre,540,800);
  cx.font="400 36px system-ui,sans-serif";cx.fillStyle="rgba(255,255,255,.85)";
  cx.fillText(E.sub,540,860);
  var c=chisteDe(E.id,0);
  if(c){cx.font="italic 400 34px system-ui,sans-serif";
    cx.fillText("🐕🐈 "+c[1],540,970);cx.font="italic 700 34px system-ui,sans-serif";cx.fillText(c[2],540,1020)}
  cx.font="700 40px system-ui,sans-serif";cx.fillStyle=dor?"#ffd98a":"#fff";
  cx.fillText("Álbum: "+n+" de 6 épocas",540,1130);
  cx.font="400 32px system-ui,sans-serif";cx.fillStyle="rgba(255,255,255,.8)";
  cx.fillText("Viaje de "+GEN+" · muta.revenuehub.cloud",540,1230);
  cb(cv)}
function compartirPostal(){
  var E=ERAS[TW.idx];
  cap("muta_tiempo",{action:"postal",era:E.id,generation:24,gene_origin:GEN,viewport_class:VPC()});
  postalCanvas(function(cv){
    cv.toBlob(function(blob){
      if(!blob)return;
      var file=new File([blob],"muta-postal-"+E.ano+".png",{type:"image/png"});
      var url=location.origin+"/?g="+encodeURIComponent(GEN);
      var texto="Viajé al año "+E.ano+" ("+E.nombre+") en la Máquina del Tiempo de MUTA, el sitio que muta cada día con lo que la gente pide. Mi postal viaja conmigo:";
      if(navigator.canShare&&navigator.canShare({files:[file]})){
        navigator.share({files:[file],title:"MUTA · Postal del Tiempo",text:texto+" "+url})
          .then(function(){cap("muta_tiempo",{action:"share",era:E.id,red:"native",generation:24});cap("muta_share",{red:"tiempo_postal",gen:GEN});addEnergy(2,"share")})
          .catch(function(){})}
      else{var a=document.createElement("a");a.href=URL.createObjectURL(blob);
        a.download="muta-postal-"+E.ano+".png";a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href)},4000);
        try{navigator.clipboard.writeText(texto+" "+url)}catch(e){}
        toastTW("📥 Postal descargada y texto copiado. Compártela donde quieras.");
        cap("muta_tiempo",{action:"share",era:E.id,red:"download",generation:24});cap("muta_share",{red:"tiempo_postal",gen:GEN});addEnergy(2,"share")}
    },"image/png")})}

/* ---- navegación ---- */
function go(delta){TW.idx=(TW.idx+delta+ERAS.length)%ERAS.length;
  cap("muta_tiempo",{action:"navigate",era:ERAS[TW.idx].id,generation:24,viewport_class:VPC()});
  renderEra(true)}
$("#twPrev").addEventListener("click",function(){go(-1)});
$("#twNext").addEventListener("click",function(){go(1)});
$("#twGo").addEventListener("click",viajar);
$("#twPostal").addEventListener("click",compartirPostal);
$("#twShare").addEventListener("click",compartirPostal);
$("#twMore").addEventListener("click",function(){TW.jokeN=(TW.jokeN||0)+1;renderChiste();
  blip(560,0.07,"sine",0.06);
  cap("muta_tiempo",{action:"joke",era:ERAS[TW.idx].id,n:TW.jokeN,generation:24})});
$("#twX").addEventListener("click",cerrar);
document.addEventListener("keydown",function(e){if(!TW.open)return;
  if(e.key==="Escape")cerrar();
  else if(e.key==="ArrowLeft")go(-1);else if(e.key==="ArrowRight")go(1)});
/* swipe horizontal */
wrap.addEventListener("touchstart",function(e){if(e.touches.length===1)TW.touches={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
wrap.addEventListener("touchend",function(e){if(!TW.touches)return;
  var dx=e.changedTouches[0].clientX-TW.touches.x,dy=e.changedTouches[0].clientY-TW.touches.y;
  TW.touches=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(dx<0?1:-1)},{passive:true});
window.addEventListener("resize",function(){if(TW.open){resize();draw()}});

function abrir(){
  if(TW.open)return;TW.open=true;wrap.classList.add("open");
  document.documentElement.style.overflow="hidden";
  /* época inicial: la dorada del día, para que el rito diario tenga destino */
  var dId=eraDorada();TW.idx=Math.max(0,ERAS.findIndex(function(e){return e.id===dId}));
  resize();renderEra(false);TW.t=0;
  if(REDUCED)draw();else loop();
  cap("muta_tiempo",{action:"open",era:ERAS[TW.idx].id,generation:24,experience_id:"tiempo",viewport_class:VPC(),gene_origin:GEN});
  cap("muta_mode_switch",{mode:"tiempo",generation:24})}
function cerrar(){TW.open=false;wrap.classList.remove("open");
  document.documentElement.style.overflow="";
  cancelAnimationFrame(TW.raf);
  cap("muta_tiempo",{action:"close",generation:24})}

window.MUTA_TIEMPO={open:abrir,close:cerrar};
if(window.__tiempoAutoStart){window.__tiempoAutoStart=false;abrir()}
})();
