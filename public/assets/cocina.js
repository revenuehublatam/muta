/* ============ LA COCINA DEL TIEMPO — Gen 25 ============
   Nacida de la parte pendiente del susurro de GEN Viajero (15-ago):
   «Podemos agregar recetas saludables en nuestros calendarios.»
   Cada época de la Máquina del Tiempo tiene ahora su cocina: recetas
   saludables inspiradas en su era (autoría de MUTA, honestas, sin marcas),
   una RECETA DORADA por día (la de la época dorada), colección "la cociné",
   y el botón que cumple el pedido literal: llevar una SEMANA SALUDABLE
   a tu calendario real (.ics con una receta por día y tu gen de vuelta).
   Todo determinista por gen + fecha. Módulo lazy. Sin secretos. */
(function(){
"use strict";
if(window.MUTA_COCINA)return;
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

/* ---- épocas (mismos colores que la Máquina del Tiempo) ---- */
var ERAS=[
{id:"1520",ano:"1520",nombre:"El Estrecho",colores:["#03182e","#0a3a5c","#0e5a7a"],acc:"#7fd4ff",em:"⛵"},
{id:"1889",ano:"1889",nombre:"La Belle Époque",colores:["#2b1608","#5a3315","#8a5a24"],acc:"#ffd98a",em:"🎩"},
{id:"1925",ano:"1925",nombre:"Jazz y Radio",colores:["#1a0e24","#3d1e4e","#6a2e6e"],acc:"#ff9ed2",em:"🎷"},
{id:"1969",ano:"1969",nombre:"La Luna",colores:["#050510","#101028","#1c1c46"],acc:"#cfd8ff",em:"🌕"},
{id:"1999",ano:"1999",nombre:"Internet Vintage",colores:["#001a00","#003300","#0a4d0a"],acc:"#7dff7d",em:"💾"},
{id:"2126",ano:"2126",nombre:"El Mañana",colores:["#0a0018","#1e0640","#3a0e6e"],acc:"#b48aff",em:"🛸"}];

/* ---- recetario: 3 recetas saludables por época (autoría MUTA, inspiradas en cada era) ---- */
var RECETAS={
"1520":[
 {id:"ceviche",em:"🐟",n:"Ceviche de reineta al limón",min:20,
  ing:["300 g de reineta fresca","4 limones","1 cebolla morada","cilantro","sal y ají verde opcional"],
  pasos:["Corta la reineta en cubos y cúbrela con el jugo de limón 15 min en frío.","Suma cebolla pluma, cilantro picado y una pizca de sal.","Sirve helado, con hojas verdes o camote cocido."],
  dato:"Pescado fresco y limón: lo que una carabela de 1520 hubiera soñado contra el escorbuto."},
 {id:"caldillo",em:"🍲",n:"Caldillo de pescado con verduras",min:35,
  ing:["400 g de pescado blanco","2 papas","1 zanahoria","1 cebolla","apio, laurel y perejil"],
  pasos:["Sofríe cebolla, zanahoria y apio en poco aceite.","Agrega agua caliente, papas y laurel; cocina 15 min.","Suma el pescado en trozos 8 min más y termina con perejil."],
  dato:"El plato de olla que reponía a las tripulaciones del fin del mundo, en versión liviana."},
 {id:"cochayuyo",em:"🌿",n:"Ensalada de cochayuyo",min:15,
  ing:["1 taza de cochayuyo cocido","1 tomate","1/2 cebolla","cilantro","limón y aceite de oliva"],
  pasos:["Pica el cochayuyo cocido en trozos pequeños.","Mezcla con tomate, cebolla y cilantro.","Adereza con limón, oliva y una pizca de sal."],
  dato:"El alga que las costas chilenas comían siglos antes de que la llamaran superalimento."}],
"1889":[
 {id:"consome",em:"🥣",n:"Consomé de verduras con hierbas",min:30,
  ing:["2 zanahorias","1 puerro","2 ramas de apio","1 cebolla","tomillo y laurel"],
  pasos:["Dora las verduras en trozos grandes en la olla.","Cubre con agua, suma hierbas y hierve suave 20 min.","Cuela y sirve caliente con perejil fresco."],
  dato:"Los salones de 1889 abrían la cena con consomé: elegancia era empezar liviano."},
 {id:"salmon",em:"🐠",n:"Salmón al horno con eneldo",min:25,
  ing:["2 filetes de salmón","1 limón","eneldo fresco","espárragos","aceite de oliva"],
  pasos:["Pon el salmón y los espárragos en una fuente con oliva.","Cubre con rodajas de limón y eneldo.","Hornea 15-18 min a 200 °C y sirve al momento."],
  dato:"Un plato digno de vals y lámparas a gas, sin la crema pesada de la época."},
 {id:"peras",em:"🍐",n:"Peras pochadas con canela",min:25,
  ing:["3 peras firmes","1 rama de canela","3 clavos de olor","cáscara de naranja","agua"],
  pasos:["Pela las peras dejando el tallo.","Cocínalas 20 min en agua con canela, clavo y naranja.","Sirve tibias con un poco del líquido reducido."],
  dato:"El postre de la Belle Époque sin el vino ni el azúcar: la fruta hace todo el trabajo."}],
"1925":[
 {id:"waldorf",em:"🥗",n:"Waldorf ligera con pollo",min:25,
  ing:["1 pechuga grillada","1 manzana verde","apio","nueces","yogur natural y limón"],
  pasos:["Grilla la pechuga y córtala en cubos.","Mezcla con manzana, apio y nueces.","Adereza con yogur natural, limón y pimienta."],
  dato:"La ensalada estrella de los hoteles del jazz, con yogur en vez de mayonesa."},
 {id:"tostadas",em:"🥑",n:"Tostadas integrales con palta y huevo",min:10,
  ing:["2 rebanadas de pan integral","1 palta","2 huevos","tomates cherry","pimienta y merkén opcional"],
  pasos:["Tuesta el pan y muele la palta encima.","Suma huevo a la plancha o duro.","Corona con cherry y una pizca de merkén."],
  dato:"Desayuno con ritmo de charlestón: listo antes de que termine el disco."},
 {id:"frutayogur",em:"🍓",n:"Copa de fruta con yogur y miel",min:5,
  ing:["1 taza de frutas de estación","yogur natural","1 cucharadita de miel","granola sin azúcar","menta"],
  pasos:["Pica la fruta en una copa baja, estilo años 20.","Cubre con yogur y un hilo de miel.","Termina con granola y menta."],
  dato:"En 1925 la servían en copa de cristal. La copa es opcional, la fruta no."}],
"1969":[
 {id:"tortilla",em:"🌕",n:"Tortilla de espinaca al horno",min:25,
  ing:["4 huevos","2 tazas de espinaca","1/2 cebolla","queso fresco opcional","nuez moscada"],
  pasos:["Saltea cebolla y espinaca hasta secar el agua.","Mezcla con huevos batidos y nuez moscada.","Hornea 15 min a 180 °C hasta dorar la superficie."],
  dato:"Comida de módulo lunar: pocos ingredientes, cero gravedad de sobremesa."},
 {id:"hummus",em:"🥕",n:"Hummus con bastones de verdura",min:15,
  ing:["1 taza de garbanzos cocidos","1 diente de ajo","limón","aceite de oliva","zanahoria y apio en bastones"],
  pasos:["Muele garbanzos con ajo, limón, oliva y agua fría.","Ajusta sal y comino.","Sirve con bastones de zanahoria y apio para dipear."],
  dato:"Proteína compacta y sin cocina: lo habrían llevado a la Luna si cabía en el Apolo."},
 {id:"avena",em:"🥣",n:"Avena del astronauta",min:10,
  ing:["1/2 taza de avena","1 plátano","leche o bebida vegetal","nueces","canela"],
  pasos:["Cocina la avena con la leche 5 min.","Suma plátano en rodajas y canela.","Corona con nueces antes de servir."],
  dato:"Energía lenta para caminatas largas, lunares o de lunes."}],
"1999":[
 {id:"wrap",em:"🌯",n:"Wrap integral de atún",min:12,
  ing:["1 tortilla integral","1 lata de atún al agua","lechuga","tomate","yogur natural con limón"],
  pasos:["Mezcla el atún con el yogur y limón.","Arma el wrap con lechuga y tomate.","Enróllalo apretado y córtalo en diagonal."],
  dato:"Comida de una mano: la otra estaba ocupada esperando que cargara la página."},
 {id:"fideos",em:"🍝",n:"Fideos integrales pomodoro",min:20,
  ing:["200 g de fideos integrales","4 tomates maduros","1 diente de ajo","albahaca","aceite de oliva"],
  pasos:["Cuece los fideos al dente.","Salsea tomate rallado con ajo dorado 8 min.","Junta todo y termina con albahaca fresca."],
  dato:"El plato que sobrevivió al Y2K sin un solo bug."},
 {id:"smoothie",em:"🥤",n:"Smoothie frutilla-plátano",min:5,
  ing:["1 taza de frutillas","1 plátano","yogur natural","avena","hielo"],
  pasos:["Licúa todo hasta que quede cremoso.","Ajusta espesor con agua o hielo.","Sirve de inmediato, sonido de módem opcional."],
  dato:"Se prepara en menos de lo que tardaba una foto en descargar en 1999."}],
"2126":[
 {id:"quinoa",em:"🛸",n:"Bowl de quinoa del mañana",min:30,
  ing:["1 taza de quinoa","verduras asadas (zapallo, pimentón, cebolla)","semillas de maravilla","limón","oliva"],
  pasos:["Lava y cuece la quinoa 15 min.","Asa las verduras con oliva al horno.","Arma el bowl y corona con semillas y limón."],
  dato:"En 2126 lo llamarán 'comida clásica del siglo XXI'. Tú lo comes primero."},
 {id:"legumbres",em:"🫘",n:"Ensalada fría de legumbres",min:15,
  ing:["1 taza de porotos o lentejas cocidas","1/2 pimentón","cebolla morada","comino","limón y cilantro"],
  pasos:["Mezcla las legumbres frías con pimentón y cebolla picados.","Adereza con limón, comino y oliva.","Deja reposar 5 min y sirve con cilantro."],
  dato:"Proteína de la que no se acaba: los futuros la cultivan hasta en las estaciones orbitales."},
 {id:"brochetas",em:"🍢",n:"Brochetas de fruta con menta",min:10,
  ing:["Fruta de estación variada","hojas de menta","limón","jengibre rallado opcional","palitos de brocheta"],
  pasos:["Corta la fruta en cubos parejos.","Ármalas alternando colores.","Roc\u00eda con limón, menta y jengibre."],
  dato:"Postre de nave nodriza: colores que se ven desde órbita."}]};

/* ---- determinismo compartido con la Máquina del Tiempo ---- */
function hstr(s){var h=5381,i;for(i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h}
function hoyUTC(){var d=new Date();return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0")}
function eraDorada(){return ERAS[hstr("dorada|"+hoyUTC())%ERAS.length].id}
function recetaDelDia(era){var arr=RECETAS[era]||[];return arr[hstr("receta|"+hoyUTC()+"|"+era)%arr.length]}

/* ---- colección persistida por gen ---- */
var CKEY="muta_ck_cocinadas_"+GEN;
function getCocinadas(){try{return JSON.parse(LSg(CKEY)||"{}")}catch(e){return{}}}
function setCocinadas(p){LSs(CKEY,JSON.stringify(p))}
function totalCocinadas(){var c=getCocinadas(),n=0,k;for(k in c)if(c[k])n++;return n}

/* ---- estado ---- */
var CK={open:false,idx:0};

/* ---- estilos ---- */
var css=document.createElement("style");
css.textContent=
"#ckWrap{position:fixed;inset:0;z-index:1300;display:none;background:#0d0a06;color:#fff;font-family:inherit;overflow:hidden;touch-action:pan-y}"+
"#ckWrap.open{display:flex;flex-direction:column}"+
"#ckTop{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 8px}"+
"#ckTitle{font-size:13px;font-weight:800;letter-spacing:1.2px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:7px 12px}"+
"#ckX{width:44px;height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.4);color:#fff;font-size:18px;cursor:pointer}"+
"#ckEras{flex:0 0 auto;display:flex;gap:6px;overflow-x:auto;padding:4px 12px 8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}"+
"#ckEras::-webkit-scrollbar{display:none}"+
"#ckEras button{flex:0 0 auto;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;border-radius:12px;padding:7px 11px;font-size:12px;font-weight:700;cursor:pointer;min-height:40px}"+
"#ckEras button.on{background:rgba(255,255,255,.22);border-color:#fff}"+
"#ckEras button.gold{border-color:#ffd98a;color:#ffd98a;box-shadow:0 0 8px rgba(255,217,138,.35)}"+
"#ckBody{flex:1 1 auto;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:4px 14px calc(16px + env(safe-area-inset-bottom,0px));touch-action:pan-y}"+
"#ckHero{text-align:center;max-width:640px;margin:0 auto 10px}"+
"#ckHero .y{font-size:34px;font-weight:900;letter-spacing:1px}"+
"#ckHero .nm{font-size:15px;font-weight:800;opacity:.95;margin-top:2px}"+
"#ckGold{display:none;margin:8px auto 2px;font-size:11.5px;font-weight:800;letter-spacing:.5px;color:#ffd98a;background:rgba(90,60,10,.55);border:1px solid #ffd98a;border-radius:20px;padding:4px 12px;width:max-content;max-width:94%}"+
".ckCard{max-width:640px;margin:10px auto;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.22);border-radius:16px;padding:14px}"+
".ckCard.dia{border-color:#ffd98a;background:rgba(90,60,10,.28)}"+
".ckCard h3{font-size:16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}"+
".ckCard .tm{font-size:11px;font-weight:700;color:#ffd98a;background:rgba(0,0,0,.35);border-radius:10px;padding:3px 8px}"+
".ckCard .dia-tag{font-size:10px;font-weight:800;letter-spacing:.6px;color:#0d0a06;background:#ffd98a;border-radius:10px;padding:3px 8px}"+
".ckCard .dato{font-size:12px;opacity:.8;font-style:italic;margin:6px 0 8px;line-height:1.45}"+
".ckCard b.sec{display:block;font-size:11px;letter-spacing:1px;opacity:.7;margin:8px 0 3px;text-transform:uppercase}"+
".ckCard ul,.ckCard ol{margin:0 0 4px 18px;font-size:13px;line-height:1.55}"+
".ckCard .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}"+
".ckCard .acts button{min-height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:#fff;font-size:12.5px;font-weight:700;padding:8px 13px;cursor:pointer}"+
".ckCard .acts button.done{border-color:#7df9c6;color:#7df9c6;background:rgba(20,80,60,.3)}"+
"#ckCal{max-width:640px;margin:14px auto;background:rgba(20,60,40,.35);border:1px solid #7df9c6;border-radius:16px;padding:14px;text-align:center}"+
"#ckCal h3{font-size:15px;color:#7df9c6}"+
"#ckCal p{font-size:12.5px;opacity:.9;line-height:1.5;margin:6px 0 10px}"+
"#ckCal button{min-height:46px;border-radius:12px;border:1px solid #7df9c6;background:rgba(125,249,198,.14);color:#7df9c6;font-size:13px;font-weight:800;padding:10px 16px;cursor:pointer}"+
"#ckProg{text-align:center;font-size:11.5px;opacity:.75;margin:10px auto 0;max-width:640px}"+
"#ckHint{text-align:center;font-size:10.5px;opacity:.55;margin:8px auto 0;max-width:640px}"+
"@media (max-width:720px){#ckHero .y{font-size:28px}}"+
"@media (prefers-reduced-motion:reduce){#ckWrap *{animation:none!important;transition:none!important}}";
document.head.appendChild(css);

/* ---- markup ---- */
var wrap=document.createElement("div");wrap.id="ckWrap";
wrap.setAttribute("role","dialog");wrap.setAttribute("aria-modal","true");
wrap.setAttribute("aria-label","La Cocina del Tiempo: recetas saludables por época");
wrap.innerHTML=
'<div id="ckTop"><span id="ckTitle">🍲 LA COCINA DEL TIEMPO</span><button id="ckX" aria-label="Cerrar la cocina">✕</button></div>'+
'<div id="ckEras" role="tablist" aria-label="Épocas"></div>'+
'<div id="ckBody"></div>';
document.body.appendChild(wrap);
var $=function(s){return wrap.querySelector(s)};

function bg(){var E=ERAS[CK.idx];
  wrap.style.background="linear-gradient(180deg,"+E.colores[0]+" 0%,"+E.colores[1]+" 55%,"+E.colores[2]+" 100%)"}

function renderTabs(){
  var el=$("#ckEras");el.innerHTML="";
  ERAS.forEach(function(E,i){
    var b=document.createElement("button");
    b.setAttribute("role","tab");b.setAttribute("aria-selected",i===CK.idx?"true":"false");
    b.className=(i===CK.idx?"on ":"")+(E.id===eraDorada()?"gold":"");
    b.textContent=E.em+" "+E.ano;
    b.addEventListener("click",function(){CK.idx=i;
      cap("muta_receta",{action:"nav",era:E.id,experience_id:"cocina",viewport_class:VPC(),gene_origin:GEN});
      render();haptic(10);blip(430+i*50,0.08,"sine",0.06)});
    el.appendChild(b)})}

function recetaCard(E,R,esDia){
  var C=getCocinadas(),done=!!C[E.id+"/"+R.id];
  var d=document.createElement("div");d.className="ckCard"+(esDia?" dia":"");
  d.innerHTML="<h3>"+R.em+" "+esc(R.n)+' <span class="tm">'+R.min+" min</span>"+
    (esDia?' <span class="dia-tag">'+(E.id===eraDorada()?"RECETA DORADA DE HOY ✨":"RECETA DEL DÍA")+"</span>":"")+"</h3>"+
    '<p class="dato">'+esc(R.dato)+"</p>"+
    '<b class="sec">Ingredientes</b><ul>'+R.ing.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ul>"+
    '<b class="sec">Preparación</b><ol>'+R.pasos.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ol>"+
    '<div class="acts"><button class="ck-cook'+(done?" done":"")+'">'+(done?"✅ Ya la cociné":"🍳 La cociné")+"</button>"+
    '<button class="ck-share">📤 Compartir receta</button></div>';
  d.querySelector(".ck-cook").addEventListener("click",function(){
    var C2=getCocinadas(),k=E.id+"/"+R.id;
    if(C2[k]){toastCK("Esta ya está en tu recetario 🍳");return}
    C2[k]=hoyUTC();setCocinadas(C2);
    this.classList.add("done");this.textContent="✅ Ya la cociné";
    addEnergy(2,"cocina");haptic(16);blip(700,0.14,"triangle",0.09);
    toastCK("🍳 Receta guardada en tu recetario ("+totalCocinadas()+" de 18) · +2 ⚡");
    cap("muta_receta",{action:"cook",era:E.id,receta:R.id,total:totalCocinadas(),experience_id:"cocina",viewport_class:VPC(),gene_origin:GEN});
    renderProg()});
  d.querySelector(".ck-share").addEventListener("click",function(){compartirReceta(E,R)});
  return d}

function render(){
  var E=ERAS[CK.idx],dia=recetaDelDia(E.id),arr=RECETAS[E.id]||[];
  bg();renderTabs();
  var body=$("#ckBody");body.innerHTML="";
  var hero=document.createElement("div");hero.id="ckHero";
  hero.innerHTML='<div class="y">'+E.em+" "+E.ano+'</div><div class="nm">La cocina de '+esc(E.nombre)+"</div>"+
    '<div id="ckGold"'+(E.id===eraDorada()?' style="display:block"':'')+'>✨ ÉPOCA DORADA: hoy su receta del día brilla</div>';
  body.appendChild(hero);
  body.appendChild(recetaCard(E,dia,true));
  arr.forEach(function(R){if(R.id!==dia.id)body.appendChild(recetaCard(E,R,false))});
  var cal=document.createElement("div");cal.id="ckCal";
  cal.innerHTML="<h3>📅 Tu semana saludable, en tu calendario de verdad</h3>"+
    "<p>Descarga 7 días de recetas (una por día, elegidas para tu gen) como archivo de calendario. Ábrelo y tu propio calendario —el del teléfono o el del computador— te recordará qué cocinar cada tarde. Sin correos, sin cuentas: un archivo y listo.</p>"+
    '<button id="ckIcs">📅 Llevar la semana a mi calendario</button>';
  body.appendChild(cal);
  cal.querySelector("#ckIcs").addEventListener("click",descargarICS);
  var prog=document.createElement("div");prog.id="ckProg";body.appendChild(prog);
  var hint=document.createElement("div");hint.id="ckHint";
  hint.textContent="Recetas de autoría de MUTA inspiradas en cada época · marca las que cocines y junta las 18";
  body.appendChild(hint);
  renderProg();
  body.scrollTop=0}

function renderProg(){
  var el=$("#ckProg");if(!el)return;
  var C=getCocinadas(),tot=totalCocinadas();
  var porEra=ERAS.map(function(E){var n=(RECETAS[E.id]||[]).filter(function(R){return C[E.id+"/"+R.id]}).length;
    return E.em+" "+n+"/3"}).join(" · ");
  el.textContent="Tu recetario: "+tot+" de 18 cocinadas · "+porEra;
  if(tot>=18&&LSg("muta_ck_full_"+GEN)!=="1"){LSs("muta_ck_full_"+GEN,"1");
    addEnergy(5,"cocina_full");haptic(30);
    toastCK("🏆 ¡RECETARIO COMPLETO! Las 18 recetas del tiempo son tuyas · +5 ⚡");
    cap("muta_receta",{action:"collect_all",gene_origin:GEN})}}

/* ---- toast ---- */
var toastT=0;
function toastCK(msg){
  var t=$("#ckToast");
  if(!t){t=document.createElement("div");t.id="ckToast";
    t.style.cssText="position:absolute;left:50%;transform:translateX(-50%);bottom:calc(12% + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.95);color:#241505;font-size:13px;font-weight:700;border-radius:12px;padding:10px 16px;z-index:5;max-width:86%;text-align:center;box-shadow:0 6px 22px rgba(0,0,0,.4)";
    wrap.appendChild(t)}
  t.textContent=msg;t.style.display="block";
  clearTimeout(toastT);toastT=setTimeout(function(){t.style.display="none"},3800)}

/* ---- calendario .ics: la parte literal del pedido de GEN Viajero ---- */
function icsEscape(s){return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n")}
function fmtDate(d){return d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,"0")+String(d.getUTCDate()).padStart(2,"0")}
function descargarICS(){
  var todas=[];ERAS.forEach(function(E){(RECETAS[E.id]||[]).forEach(function(R){todas.push({E:E,R:R})})});
  var url="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN);
  var hoy=new Date(),lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//MUTA//Cocina del Tiempo//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Semana saludable MUTA"];
  for(var i=0;i<7;i++){
    var d=new Date(Date.UTC(hoy.getUTCFullYear(),hoy.getUTCMonth(),hoy.getUTCDate()+i));
    var d2=new Date(Date.UTC(hoy.getUTCFullYear(),hoy.getUTCMonth(),hoy.getUTCDate()+i+1));
    var pick=todas[hstr(GEN+"|semana|"+fmtDate(d))%todas.length];
    lines.push("BEGIN:VEVENT",
      "UID:muta-receta-"+fmtDate(d)+"-"+pick.R.id+"@muta.revenuehub.cloud",
      "DTSTAMP:"+fmtDate(hoy)+"T120000Z",
      "DTSTART;VALUE=DATE:"+fmtDate(d),
      "DTEND;VALUE=DATE:"+fmtDate(d2),
      "SUMMARY:"+icsEscape("🍲 Receta MUTA: "+pick.R.n+" ("+pick.E.ano+")"),
      "DESCRIPTION:"+icsEscape("Receta saludable de La Cocina del Tiempo, época "+pick.E.ano+" · "+pick.E.nombre+".\nIngredientes: "+pick.R.ing.join(", ")+".\nPasos completos y receta nueva cada día en: "+url),
      "END:VEVENT")}
  lines.push("END:VCALENDAR");
  var blob=new Blob([lines.join("\r\n")],{type:"text/calendar;charset=utf-8"});
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download="muta-semana-saludable.ics";a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href)},4000);
  var dayKey="muta_ck_ics_"+GEN;
  if(LSg(dayKey)!==hoyUTC()){LSs(dayKey,hoyUTC());addEnergy(2,"calendario")}
  haptic(20);blip(620,0.16,"triangle",0.1);
  toastCK("📅 Listo: abre el archivo y tu calendario recibirá 7 días de recetas.");
  cap("muta_receta",{action:"ics",era:ERAS[CK.idx].id,experience_id:"cocina",viewport_class:VPC(),gene_origin:GEN});
  cap("muta_share",{red:"calendario_ics",gen:GEN})}

/* ---- carta-receta compartible 1080x1350 ---- */
function cartaReceta(E,R,cb){
  var cv=document.createElement("canvas");cv.width=1080;cv.height=1350;
  var cx=cv.getContext("2d");
  var g=cx.createLinearGradient(0,0,0,1350);
  g.addColorStop(0,E.colores[0]);g.addColorStop(.55,E.colores[1]);g.addColorStop(1,E.colores[2]);
  cx.fillStyle=g;cx.fillRect(0,0,1080,1350);
  var dor=E.id===eraDorada();
  cx.strokeStyle=dor?"#ffd98a":"rgba(255,255,255,.5)";cx.lineWidth=dor?14:8;
  cx.strokeRect(40,40,1000,1270);
  cx.textAlign="center";cx.fillStyle="#fff";
  cx.font="700 42px system-ui,sans-serif";cx.fillText("LA COCINA DEL TIEMPO"+(dor?" · DORADA ✨":""),540,140);
  cx.font="900 150px system-ui,sans-serif";cx.fillText(E.ano,540,330);
  cx.font="130px serif";cx.fillText(R.em,540,510);
  cx.font="800 54px system-ui,sans-serif";
  var nombre=R.n;if(nombre.length>28){cx.font="800 44px system-ui,sans-serif"}
  cx.fillText(nombre,540,610);
  cx.font="700 34px system-ui,sans-serif";cx.fillStyle=E.acc;
  cx.fillText(R.min+" minutos · "+E.nombre,540,670);
  cx.fillStyle="rgba(255,255,255,.9)";cx.font="400 32px system-ui,sans-serif";
  var y=760;cx.fillText("Ingredientes:",540,y-40);
  R.ing.slice(0,6).forEach(function(inx){cx.fillText(inx,540,y);y+=44});
  cx.font="italic 400 30px system-ui,sans-serif";cx.fillStyle="rgba(255,255,255,.75)";
  var dato=R.dato;if(dato.length>60)dato=dato.slice(0,57)+"…";
  cx.fillText(dato,540,1090);
  cx.font="700 38px system-ui,sans-serif";cx.fillStyle=dor?"#ffd98a":"#fff";
  cx.fillText("Receta saludable de "+GEN,540,1170);
  cx.font="400 32px system-ui,sans-serif";cx.fillStyle="rgba(255,255,255,.8)";
  cx.fillText("Cocina nueva cada día · muta.revenuehub.cloud",540,1230);
  cb(cv)}
function compartirReceta(E,R){
  cap("muta_receta",{action:"share",era:E.id,receta:R.id,experience_id:"cocina",viewport_class:VPC(),gene_origin:GEN});
  cartaReceta(E,R,function(cv){
    cv.toBlob(function(blob){
      if(!blob)return;
      var file=new File([blob],"muta-receta-"+R.id+".png",{type:"image/png"});
      var url=location.origin+"/?g="+encodeURIComponent(GEN);
      var texto="Receta saludable de la época "+E.ano+" ("+E.nombre+") en La Cocina del Tiempo de MUTA, el sitio que muta cada día con lo que la gente pide. Puedes llevar la semana completa a tu calendario:";
      if(navigator.canShare&&navigator.canShare({files:[file]})){
        navigator.share({files:[file],title:"MUTA · Receta del Tiempo",text:texto+" "+url})
          .then(function(){cap("muta_share",{red:"receta_carta",gen:GEN});addEnergy(2,"share")})
          .catch(function(){})}
      else{var a=document.createElement("a");a.href=URL.createObjectURL(blob);
        a.download="muta-receta-"+R.id+".png";a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href)},4000);
        try{navigator.clipboard.writeText(texto+" "+url)}catch(e){}
        toastCK("📥 Carta-receta descargada y texto copiado. Compártela donde quieras.");
        cap("muta_share",{red:"receta_carta",gen:GEN});addEnergy(2,"share")}
    },"image/png")})}

/* ---- abrir / cerrar ---- */
function abrir(eraId){
  if(CK.open){if(eraId)irA(eraId);return}
  CK.open=true;wrap.classList.add("open");
  var dId=eraId||eraDorada();
  CK.idx=Math.max(0,ERAS.findIndex(function(e){return e.id===dId}));
  render();
  cap("muta_receta",{action:"open",era:ERAS[CK.idx].id,experience_id:"cocina",viewport_class:VPC(),gene_origin:GEN});
  cap("muta_enter_experience",{experience_id:"cocina",mode:"cocina",viewport_class:VPC(),gene_origin:GEN})}
function irA(eraId){var i=ERAS.findIndex(function(e){return e.id===eraId});if(i>=0){CK.idx=i;render()}}
function cerrar(){CK.open=false;wrap.classList.remove("open");
  cap("muta_receta",{action:"close",experience_id:"cocina"})}
$("#ckX").addEventListener("click",cerrar);
document.addEventListener("keydown",function(e){if(CK.open&&e.key==="Escape")cerrar()});

window.MUTA_COCINA={open:abrir,close:cerrar};
if(window.__cocinaAutoStart){var st=window.__cocinaAutoStart;window.__cocinaAutoStart=null;
  abrir(st&&st.era?st.era:null)}
})();
