/* ============ EL TALLER DE PROMPTS — Gen 30 ============
   Nacido del susurro de GEN-68A8 «Fractal» (22-ago-2026): «Un recuadro explicando
   con ejercicio simpático de cómo crear un buen prompt. Algo así como completa la
   oración. Considerando metodología de enseñanza STEAM. En estilo WestThorn.»
   Interpretación: un taller interactivo que enseña a pedirle bien a una IA
   completando la oración por ingredientes (rol, contexto, tarea, formato, criterio),
   con medidor pedagógico de nitidez, iteración al estilo STEAM (explora → construye
   → prueba → mide → itera) y una carta editorial compartible al estilo de una
   revista cultural. El medidor es una pauta de enseñanza determinista, no un juez.
   Módulo con carga diferida. Sin secretos. Texto del usuario siempre escapado. */
(function(){
"use strict";
if(window.MUTA_TALLER)return;
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var esc=API.esc||function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var GEN=API.GEN||"GEN-0000";
var VPC=API.VPC||function(){return window.innerWidth<=720?"mobile":"desktop"};
var REDUCED=!!API.REDUCED;
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};
var G=API.g||30;
var KEY="muta_taller_g30";

/* ---- ingredientes ---- */
var SLOTS=[
 {id:"rol",n:"ROL",exp:"Darle un rol concreto le entrega a la IA un punto de vista y un nivel de experticia desde donde responder."},
 {id:"ctx",n:"CONTEXTO",exp:"El contexto es el ingrediente que más gente olvida: quién eres, para quién es y para qué lo necesitas."},
 {id:"tarea",n:"TAREA",exp:"Un verbo concreto con un objeto claro. «Ayúdame» no es una tarea; «explícame X en 3 pasos» sí."},
 {id:"fmt",n:"FORMATO",exp:"Decir el formato esperado (lista, tabla, cantidad de párrafos) evita respuestas eternas o inservibles."},
 {id:"crit",n:"CRITERIO",exp:"El criterio de calidad le dice a la IA cómo saber si lo hizo bien: tono, largo, público, qué evitar."}
];
/* Cada opción: t = texto, q = nitidez pedagógica (1 vago, 2 claro, 3 nítido). */
var RETOS=[
 {icon:"🔭",area:"Ciencia",titulo:"El cielo rojo",
  caso:"Quieres que una IA te explique por qué el atardecer de Santiago a veces se ve rojo, para contárselo bien a una niña de 8 años.",
  slots:{
   rol:[{t:"alguien que sabe",q:1},{t:"un profesor",q:2},{t:"una astrónoma que hace divulgación para niños",q:3},{t:"un experto en todo",q:1}],
   ctx:[{t:"tengo una duda",q:1},{t:"se lo quiero contar a una niña de 8 años",q:3},{t:"es para conversar en familia",q:2},{t:"me lo preguntaron",q:1}],
   tarea:[{t:"háblame del cielo",q:1},{t:"explícame por qué el atardecer se ve rojo",q:2},{t:"explícame por qué el atardecer de Santiago se ve rojo, con un ejemplo cotidiano",q:3},{t:"dime cosas del atardecer",q:1}],
   fmt:[{t:"como quieras",q:1},{t:"en un párrafo corto",q:2},{t:"en 3 pasos simples y una analogía con juguetes",q:3},{t:"largo y completo",q:1}],
   crit:[{t:"que quede bonito",q:1},{t:"sin palabras técnicas",q:2},{t:"sin palabras técnicas y que una niña de 8 años pueda repetirlo",q:3},{t:"que sea perfecto",q:1}]
  }},
 {icon:"🎨",area:"Arte",titulo:"El cuento del barrio",
  caso:"Quieres un cuento corto sobre un barrio de Santiago, escrito con el cuidado de una revista cultural.",
  slots:{
   rol:[{t:"un escritor",q:2},{t:"alguien creativo",q:1},{t:"una cronista de una revista cultural chilena",q:3},{t:"una IA que escribe",q:1}],
   ctx:[{t:"me gusta leer",q:1},{t:"es para regalárselo a una vecina",q:3},{t:"quiero un cuento",q:1},{t:"es sobre el barrio donde crecí",q:2}],
   tarea:[{t:"escribe algo lindo",q:1},{t:"escribe un cuento corto sobre un barrio",q:2},{t:"escribe un cuento corto donde el barrio despierta antes que su gente",q:3},{t:"haz literatura",q:1}],
   fmt:[{t:"del largo que quieras",q:1},{t:"máximo 300 palabras",q:2},{t:"máximo 300 palabras, en tres escenas breves",q:3},{t:"una novela",q:1}],
   crit:[{t:"que emocione",q:1},{t:"tono cálido, sin clichés",q:2},{t:"tono cálido, sin clichés, con un detalle sensorial por escena",q:3},{t:"estilo libre",q:1}]
  }},
 {icon:"🌱",area:"Ingeniería",titulo:"El huerto del balcón",
  caso:"Quieres armar un huerto en un balcón pequeño y necesitas un plan que de verdad puedas seguir.",
  slots:{
   rol:[{t:"un jardinero",q:2},{t:"una agrónoma especialista en huertos urbanos",q:3},{t:"alguien con plantas",q:1},{t:"un asistente",q:1}],
   ctx:[{t:"quiero plantas",q:1},{t:"nunca he cultivado nada",q:2},{t:"mi balcón mide 2x1 metros y recibe sol solo en la mañana",q:3},{t:"vivo en una casa",q:1}],
   tarea:[{t:"dame ideas",q:1},{t:"arma un plan para partir un huerto de hierbas",q:2},{t:"arma un plan de 4 fines de semana para partir un huerto de hierbas",q:3},{t:"cuéntame de huertos",q:1}],
   fmt:[{t:"como estimes",q:1},{t:"en una lista de pasos",q:2},{t:"en una tabla: paso, materiales y costo aproximado",q:3},{t:"un ensayo",q:1}],
   crit:[{t:"que funcione",q:1},{t:"con materiales fáciles de encontrar en Chile",q:3},{t:"que sea barato",q:2},{t:"lo mejor posible",q:1}]
  }},
 {icon:"📐",area:"Matemática",titulo:"El presupuesto claro",
  caso:"Quieres ordenar el presupuesto del mes en categorías simples, sin planillas eternas ni jerga financiera.",
  slots:{
   rol:[{t:"un contador",q:2},{t:"una asesora de finanzas personales que explica simple",q:3},{t:"alguien ordenado",q:1},{t:"un genio de las platas",q:1}],
   ctx:[{t:"gano un sueldo fijo y nunca sé en qué se me va",q:3},{t:"quiero ahorrar",q:2},{t:"necesito plata",q:1},{t:"soy una persona adulta",q:1}],
   tarea:[{t:"ordena mis gastos del mes en categorías simples",q:2},{t:"ordena mis gastos en 5 categorías y propón un monto tope para cada una",q:3},{t:"ayúdame con la plata",q:1},{t:"hazme rico",q:1}],
   fmt:[{t:"en una tabla de 5 filas con porcentajes del sueldo",q:3},{t:"en una tabla",q:2},{t:"como sea",q:1},{t:"con muchos gráficos",q:1}],
   crit:[{t:"sin jerga financiera y con un ejemplo con montos en pesos chilenos",q:3},{t:"fácil de entender",q:2},{t:"que sea exacto",q:1},{t:"profesional",q:1}]
  }},
 {icon:"🤖",area:"Tecnología",titulo:"El prompt libre",
  caso:"El reto de maestría: escribe los cinco ingredientes con tus propias palabras, para un pedido real tuyo. Aquí no hay opciones: la oración es toda tuya.",
  libre:true,
  slots:{rol:[],ctx:[],tarea:[],fmt:[],crit:[]}}
];
var CAP1=function(t){t=String(t||"");return t.charAt(0).toUpperCase()+t.slice(1)};
var PLANTILLA=function(v){
 return "Actúa como "+(v.rol||"[rol]")+". Contexto: "+(v.ctx||"[contexto]")+". "+CAP1(v.tarea||"[tarea]")+", y entrégalo "+(v.fmt||"[formato]")+". Importante: "+(v.crit||"[criterio]")+".";
};

/* ---- estado persistido (por dispositivo, honesto) ---- */
function loadSt(){try{var s=JSON.parse(localStorage.getItem(KEY)||"{}");return{done:s.done||{},best:s.best||0,bestPrompt:s.bestPrompt||"",iter:s.iter||0}}catch(e){return{done:{},best:0,bestPrompt:"",iter:0}}}
function saveSt(){try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}
var ST=loadSt();
function doneCount(){var n=0;for(var k in ST.done)if(ST.done[k])n++;return n}

/* ---- valoración pedagógica de un texto libre (heurística declarada) ---- */
function qLibre(t){
 t=String(t||"").trim();
 if(t.length<4)return 0;
 if(t.length<14)return 1;
 var pts=2;
 if(/\d/.test(t)||t.length>=28)pts=3; /* números o detalle largo = más concreto */
 return pts;
}

/* ---- UI ---- */
var root=null,cur=0,vals={},quals={},lastScore=0,scored=false;
var CSS='#tOvl{position:fixed;inset:0;z-index:340;display:none;background:#f4eee1;color:#211b12;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;font-family:Georgia,"Times New Roman",serif}'+
'#tOvl.open{display:block}'+
'#tOvl .wrap{max-width:660px;margin:0 auto;padding:calc(14px + env(safe-area-inset-top)) 18px calc(90px + env(safe-area-inset-bottom))}'+
'#tOvl .mast{border-bottom:3px double #211b12;padding-bottom:10px;margin-bottom:4px;text-align:center;position:relative}'+
'#tOvl .mast h1{margin:6px 0 2px;font-size:30px;letter-spacing:2px;font-weight:700}'+
'#tOvl .mast .kicker{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8a5a32}'+
'#tOvl .folio{display:flex;justify-content:space-between;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:#6b6152;border-bottom:1px solid #c9bda6;padding:6px 0;margin-bottom:14px}'+
'#tOvl .xbtn{position:absolute;right:-6px;top:-4px;background:none;border:1px solid #211b12;color:#211b12;width:34px;height:34px;border-radius:50%;font-size:15px;cursor:pointer}'+
'#tOvl .credit{font-size:12.5px;font-style:italic;color:#6b6152;text-align:center;margin:0 0 14px}'+
'#tOvl .steam{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:0 0 16px}'+
'#tOvl .steam span{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;border:1px solid #c9bda6;border-radius:999px;padding:3px 9px;color:#6b6152}'+
'#tOvl .steam span.on{background:#211b12;color:#f4eee1;border-color:#211b12}'+
'#tOvl .card{background:#fbf7ec;border:1px solid #d8ccb4;border-radius:4px;padding:16px 16px 14px;margin-bottom:14px;box-shadow:2px 2px 0 rgba(33,27,18,.08)}'+
'#tOvl .card h2{margin:0 0 6px;font-size:20px}'+
'#tOvl .card .area{font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:#8a5a32}'+
'#tOvl .caso{font-size:14.5px;line-height:1.5;margin:8px 0 0}'+
'#tOvl .prog{display:flex;gap:6px;justify-content:center;margin:0 0 14px}'+
'#tOvl .prog b{width:30px;height:30px;border-radius:50%;border:1.5px solid #211b12;display:flex;align-items:center;justify-content:center;font-size:13px;background:#fbf7ec;cursor:pointer}'+
'#tOvl .prog b.ok{background:#2c5a3f;color:#f4eee1;border-color:#2c5a3f}'+
'#tOvl .prog b.cur{background:#b4552d;color:#f4eee1;border-color:#b4552d}'+
'#tOvl .oracion{font-size:16px;line-height:2.1;margin:4px 0 10px}'+
'#tOvl .slotB{display:inline-block;border:none;border-bottom:2px dashed #b4552d;background:rgba(180,85,45,.07);color:#b4552d;font-family:inherit;font-size:15px;padding:1px 8px;margin:0 2px;cursor:pointer;border-radius:3px 3px 0 0}'+
'#tOvl .slotB.filled{color:#211b12;border-bottom:2px solid #2c5a3f;background:rgba(44,90,63,.07)}'+
'#tOvl .picker{border-top:1px solid #d8ccb4;padding-top:10px;margin-top:6px}'+
'#tOvl .picker .pk{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a5a32;margin:0 0 4px}'+
'#tOvl .picker .pexp{font-size:12.5px;font-style:italic;color:#6b6152;margin:0 0 8px}'+
'#tOvl .chip{display:block;width:100%;text-align:left;background:#f4eee1;border:1px solid #c9bda6;border-radius:4px;padding:9px 11px;margin:0 0 7px;font-family:inherit;font-size:14px;color:#211b12;cursor:pointer;line-height:1.35}'+
'#tOvl .chip:active{background:#e9dfc9}'+
'#tOvl .chip.mine{border-style:dashed}'+
'#tOvl input.libre{width:100%;box-sizing:border-box;background:#fff;border:1px solid #c9bda6;border-radius:4px;padding:10px;font-family:inherit;font-size:14px;color:#211b12;margin-bottom:7px}'+
'#tOvl .preview{background:#211b12;color:#f0e9d8;border-radius:4px;padding:13px 14px;font-size:13.5px;line-height:1.6;margin:12px 0;font-family:"Courier New",monospace;word-wrap:break-word}'+
'#tOvl .preview .ph{color:#8f8672;font-style:italic}'+
'#tOvl .btn{display:inline-block;background:#b4552d;color:#f4eee1;border:none;border-radius:4px;padding:11px 18px;font-family:inherit;font-size:14px;letter-spacing:1px;cursor:pointer;margin:3px 6px 3px 0}'+
'#tOvl .btn.sec{background:#fbf7ec;color:#211b12;border:1px solid #211b12}'+
'#tOvl .btn:disabled{opacity:.45;cursor:default}'+
'#tOvl .medidor{margin:10px 0}'+
'#tOvl .mbar{height:14px;background:#e4dac4;border:1px solid #c9bda6;border-radius:999px;overflow:hidden}'+
'#tOvl .mfill{height:100%;width:0;background:linear-gradient(90deg,#b4552d,#2c5a3f);transition:width .8s ease}'+
'#tOvl.rm .mfill{transition:none}'+
'#tOvl .mnum{font-size:26px;font-weight:700;text-align:center;margin:6px 0 2px}'+
'#tOvl .mleyenda{font-size:11px;color:#6b6152;text-align:center;font-style:italic;margin:0 0 8px}'+
'#tOvl .fb{list-style:none;margin:8px 0;padding:0}'+
'#tOvl .fb li{font-size:13px;line-height:1.45;padding:6px 0;border-bottom:1px dotted #d8ccb4}'+
'#tOvl .fb b{display:inline-block;min-width:86px;letter-spacing:1px;font-size:11px;text-transform:uppercase}'+
'#tOvl .sello{text-align:center;margin:10px 0;font-size:15px;letter-spacing:2px;text-transform:uppercase;color:#2c5a3f;border:2px solid #2c5a3f;border-radius:4px;padding:8px;transform:rotate(-1.5deg)}'+
'#tOvl .cartaBox{text-align:center}'+
'#tOvl .cartaBox canvas{max-width:min(300px,80vw);border:1px solid #c9bda6;border-radius:4px;box-shadow:3px 3px 0 rgba(33,27,18,.12)}'+
'@media(max-width:720px){#tOvl .mast h1{font-size:24px}#tOvl .oracion{font-size:15px}}';

function buildRoot(){
 if(root)return;
 var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
 root=document.createElement("div");root.id="tOvl";
 if(REDUCED)root.classList.add("rm");
 root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.setAttribute("aria-label","El Taller de Prompts");
 document.body.appendChild(root);
}
function open_(){
 buildRoot();
 root.classList.add("open");
 document.documentElement.style.overflow="hidden";
 cap("muta_taller",{action:"open",generation:G,viewport_class:VPC(),retos_hechos:doneCount()});
 cap("muta_mode_switch",{mode:"taller",generation:G});
 renderIntro();
}
function close_(){
 if(root)root.classList.remove("open");
 document.documentElement.style.overflow="";
 cap("muta_taller",{action:"close",generation:G,retos_hechos:doneCount()});
}
function header(){
 return '<div class="mast"><div class="kicker">MUTA · Gen '+G+' · edición diaria</div><h1>EL TALLER DE PROMPTS</h1>'+
 '<button class="xbtn" id="tX" aria-label="Cerrar el taller">✕</button></div>'+
 '<div class="folio"><span>Completa la oración</span><span>'+doneCount()+' / 5 retos</span><span>Método STEAM</span></div>'+
 '<p class="credit">Nacido del susurro de <b>GEN-68A8 «Fractal»</b> · al estilo editorial de una revista cultural</p>';
}
function steamBar(step){
 var S=["Explora","Construye","Prueba","Mide","Itera"];
 return '<div class="steam">'+S.map(function(s,i){return '<span class="'+(i===step?"on":"")+'">'+s+'</span>'}).join("")+'</div>';
}
function progBar(){
 var h="";
 for(var i=0;i<5;i++){
  var cls=ST.done["r"+i]?"ok":(i===cur?"cur":"");
  h+='<b class="'+cls+'" data-reto="'+i+'">'+(ST.done["r"+i]?"✔":(i+1))+'</b>';
 }
 return '<div class="prog">'+h+'</div>';
}
function wireCommon(){
 var x=document.getElementById("tX");if(x)x.onclick=close_;
 var pr=root.querySelectorAll(".prog b");
 for(var i=0;i<pr.length;i++)pr[i].onclick=function(){cur=parseInt(this.getAttribute("data-reto"),10)||0;startReto()};
}
function renderIntro(){
 root.innerHTML='<div class="wrap">'+header()+steamBar(0)+
 '<div class="card"><h2>Aprende a pedirle bien a una IA</h2>'+
 '<p class="caso">Un buen prompt no es magia: es una oración completa. En este taller la armas por ingredientes —<b>rol, contexto, tarea, formato y criterio</b>—, la ves tomar forma, mides su nitidez y la mejoras iterando, como en cualquier laboratorio.</p>'+
 '<p class="caso" style="font-style:italic;color:#6b6152">Cinco retos, uno por disciplina STEAM. El quinto se escribe con tus propias palabras. El medidor es una pauta de enseñanza, no un juez.</p></div>'+
 progBar()+
 '<div style="text-align:center"><button class="btn" id="tGo">'+(doneCount()>0?"Continuar el taller →":"Empezar el reto 1 →")+'</button></div>'+
 '</div>';
 wireCommon();
 document.getElementById("tGo").onclick=function(){
  cur=0;while(cur<4&&ST.done["r"+cur])cur++;
  startReto();
 };
}
function startReto(){
 vals={};quals={};scored=false;lastScore=0;
 cap("muta_taller",{action:"reto_start",reto:cur+1,area:RETOS[cur].area,generation:G});
 renderReto(null);
}
function renderReto(openSlot){
 var R=RETOS[cur];
 var h='<div class="wrap">'+header()+steamBar(openSlot==null&&!Object.keys(vals).length?0:1)+progBar()+
 '<div class="card"><div class="area">Reto '+(cur+1)+' · '+R.icon+' '+R.area+'</div><h2>'+R.titulo+'</h2><p class="caso">'+R.caso+'</p></div>'+
 '<div class="card"><div class="area">Completa la oración</div><p class="oracion">'+
 'Actúa como '+slotBtn("rol")+'. Contexto: '+slotBtn("ctx")+'. '+slotBtn("tarea")+', y entrégalo '+slotBtn("fmt")+'. Importante: '+slotBtn("crit")+'.</p>';
 if(openSlot){
  var S=null;for(var i=0;i<SLOTS.length;i++)if(SLOTS[i].id===openSlot)S=SLOTS[i];
  h+='<div class="picker"><p class="pk">'+S.n+'</p><p class="pexp">'+S.exp+'</p>';
  var ops=R.slots[openSlot]||[];
  for(var j=0;j<ops.length;j++)h+='<button class="chip" data-slot="'+openSlot+'" data-i="'+j+'">'+esc(ops[j].t)+'</button>';
  h+='<input class="libre" id="tLibre" maxlength="140" placeholder="'+(R.libre?"Escribe este ingrediente con tus palabras…":"…o escríbelo con tus palabras")+'">'+
  '<button class="chip mine" id="tLibreOk">✍️ Usar lo que escribí</button></div>';
 }
 h+='</div>'+
 '<div class="card"><div class="area">Tu prompt, en vivo</div><div class="preview" id="tPrev"></div>'+
 '<button class="btn" id="tMedir" '+(allFilled()?"":"disabled")+'>📏 Medir nitidez</button>'+
 '<button class="btn sec" id="tCopy" '+(allFilled()?"":"disabled")+'>📋 Copiar prompt</button>'+
 '<div id="tResultado"></div></div>'+
 '</div>';
 root.innerHTML=h;
 renderPreview();
 wireCommon();
 var bs=root.querySelectorAll(".slotB");
 for(var k=0;k<bs.length;k++)bs[k].onclick=function(){renderReto(this.getAttribute("data-slot"));
  var pk=root.querySelector(".picker");if(pk)pk.scrollIntoView({block:"nearest",behavior:REDUCED?"auto":"smooth"})};
 var chips=root.querySelectorAll(".chip[data-slot]");
 for(var c=0;c<chips.length;c++)chips[c].onclick=function(){
  var s=this.getAttribute("data-slot"),i2=parseInt(this.getAttribute("data-i"),10);
  var op=RETOS[cur].slots[s][i2];
  vals[s]=op.t;quals[s]=op.q;scored=false;haptic(8);blip(520,0.06,"triangle",0.05);
  cap("muta_taller",{action:"slot",reto:cur+1,slot:s,origen:"opcion",generation:G});
  renderReto(null);
 };
 var lo=document.getElementById("tLibreOk");
 if(lo)lo.onclick=function(){
  var inp=document.getElementById("tLibre");
  var t=(inp.value||"").trim().slice(0,140);
  if(t.length<4){inp.focus();return}
  var s=root.querySelector(".picker .pk").textContent;
  var sid="";for(var i3=0;i3<SLOTS.length;i3++)if(SLOTS[i3].n===s)sid=SLOTS[i3].id;
  vals[sid]=t;quals[sid]=qLibre(t);scored=false;haptic(8);
  cap("muta_taller",{action:"slot",reto:cur+1,slot:sid,origen:"propio",generation:G});
  renderReto(null);
 };
 document.getElementById("tMedir").onclick=medir;
 document.getElementById("tCopy").onclick=copiar;
}
function slotBtn(id){
 var S=null;for(var i=0;i<SLOTS.length;i++)if(SLOTS[i].id===id)S=SLOTS[i];
 var filled=!!vals[id];
 return '<button class="slotB'+(filled?" filled":"")+'" data-slot="'+id+'">'+(filled?esc(vals[id]):"["+S.n.toLowerCase()+"]")+'</button>';
}
function allFilled(){for(var i=0;i<SLOTS.length;i++)if(!vals[SLOTS[i].id])return false;return true}
function renderPreview(){
 var p=document.getElementById("tPrev");if(!p)return;
 var v={};for(var i=0;i<SLOTS.length;i++){var id=SLOTS[i].id;v[id]=vals[id]?esc(vals[id]):null}
 function c1(t){return t?t.charAt(0).toUpperCase()+t.slice(1):null}
 p.innerHTML="Actúa como "+(v.rol||'<span class="ph">[rol]</span>')+". Contexto: "+(v.ctx||'<span class="ph">[contexto]</span>')+". "+(c1(v.tarea)||'<span class="ph">[tarea]</span>')+", y entrégalo "+(v.fmt||'<span class="ph">[formato]</span>')+". Importante: "+(v.crit||'<span class="ph">[criterio]</span>')+".";
}
function medir(){
 if(!allFilled())return;
 var total=0,fb="";
 for(var i=0;i<SLOTS.length;i++){
  var S=SLOTS[i],q=quals[S.id]||1;total+=q;
  var icon=q>=3?"✔":(q===2?"△":"✖");
  var col=q>=3?"#2c5a3f":(q===2?"#8a5a32":"#a03427");
  var msg=q>=3?"nítido.":(q===2?"claro; puede afinarse con un detalle más concreto.":"vago: la IA tendrá que adivinar.");
  fb+='<li><b style="color:'+col+'">'+icon+" "+S.n+'</b> '+msg+" <i style='color:#6b6152'>"+S.exp+"</i></li>";
 }
 lastScore=Math.round(total/15*100);
 var iterado=scored;scored=true;
 cap("muta_taller",{action:"score",reto:cur+1,nitidez:lastScore,iterado:iterado,generation:G});
 if(iterado){ST.iter++;saveSt()}
 haptic(lastScore>=70?[15,30,15]:10);blip(lastScore>=70?740:330,0.14,"triangle",0.08);
 var pass=lastScore>=70;
 var h='<div class="medidor"><div class="mnum">'+lastScore+' / 100</div>'+
 '<div class="mbar"><div class="mfill" id="tFill"></div></div>'+
 '<p class="mleyenda">Medidor pedagógico: cuenta ingredientes presentes y su concreción. No juzga tus ideas.</p>'+
 '<ul class="fb">'+fb+'</ul>';
 if(pass){
  var first=!ST.done["r"+cur];
  ST.done["r"+cur]=true;
  if(lastScore>ST.best){ST.best=lastScore;ST.bestPrompt=PLANTILLA(vals)}
  saveSt();
  if(first){
   cap("muta_taller",{action:"complete",reto:cur+1,retos_hechos:doneCount(),nitidez:lastScore,generation:G});
   if(typeof API.addEnergy==="function")API.addEnergy(1,"taller");
  }
  h+='<div class="sello">Reto '+(cur+1)+' superado · '+RETOS[cur].area+'</div>';
  if(doneCount()>=5){
   if(typeof API.addEnergy==="function"&&first)API.addEnergy(2,"taller_completo");
   h+='<div style="text-align:center"><button class="btn" id="tCarta">📜 Recibir mi Carta del Taller</button></div>';
  }else{
   h+='<div style="text-align:center"><button class="btn" id="tNext">Siguiente reto →</button>'+
   (lastScore<100?'<button class="btn sec" id="tIter">🔁 Iterar y subir la nitidez</button>':'')+'</div>';
  }
 }else{
  h+='<div style="text-align:center"><button class="btn" id="tIter">🔁 Iterar: mejora un ingrediente</button></div>'+
  '<p class="mleyenda">Así trabaja el método STEAM: se prueba, se mide y se vuelve a construir. Toca un ingrediente subrayado y cámbialo.</p>';
 }
 h+='</div>';
 document.getElementById("tResultado").innerHTML=h;
 var f=document.getElementById("tFill");
 if(f){if(REDUCED)f.style.width=lastScore+"%";else setTimeout(function(){f.style.width=lastScore+"%"},40)}
 var nx=document.getElementById("tNext");if(nx)nx.onclick=function(){cur=Math.min(cur+1,4);while(cur<4&&ST.done["r"+cur])cur++;startReto()};
 var it=document.getElementById("tIter");if(it)it.onclick=function(){document.getElementById("tResultado").innerHTML="";
  var worst="rol",wq=9;for(var i4=0;i4<SLOTS.length;i4++){var id=SLOTS[i4].id;if((quals[id]||0)<wq){wq=quals[id]||0;worst=id}}
  renderReto(worst)};
 var ca=document.getElementById("tCarta");if(ca)ca.onclick=carta;
}
function copiar(){
 if(!allFilled())return;
 var txt=PLANTILLA(vals);
 cap("muta_taller",{action:"copy",reto:cur+1,generation:G});
 function ok(){var b=document.getElementById("tCopy");if(b){b.textContent="✔ Copiado";setTimeout(function(){b.textContent="📋 Copiar prompt"},1800)}haptic(10)}
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,function(){fallbackCopy(txt);ok()});
 else{fallbackCopy(txt);ok()}
}
function fallbackCopy(t){
 var ta=document.createElement("textarea");ta.value=t;ta.style.position="fixed";ta.style.opacity="0";
 document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}document.body.removeChild(ta);
}
/* ---- LA CARTA DEL TALLER: editorial 1080x1350, con tu mejor prompt ---- */
function carta(){
 cap("muta_taller",{action:"card",nitidez:ST.best,generation:G});
 var cv=document.createElement("canvas");cv.width=1080;cv.height=1350;
 var x=cv.getContext("2d");
 x.fillStyle="#f4eee1";x.fillRect(0,0,1080,1350);
 x.strokeStyle="#211b12";x.lineWidth=3;x.strokeRect(40,40,1000,1270);
 x.lineWidth=1;x.strokeRect(52,52,976,1246);
 x.fillStyle="#8a5a32";x.font="26px Georgia";x.textAlign="center";
 x.fillText("M U T A · G E N "+G+" · E D I C I Ó N  D I A R I A",540,120);
 x.fillStyle="#211b12";x.font="bold 74px Georgia";
 x.fillText("EL TALLER",540,215);x.fillText("DE PROMPTS",540,295);
 x.strokeStyle="#211b12";x.lineWidth=2;
 x.beginPath();x.moveTo(120,330);x.lineTo(960,330);x.stroke();
 x.beginPath();x.moveTo(120,338);x.lineTo(960,338);x.stroke();
 x.fillStyle="#6b6152";x.font="italic 30px Georgia";
 x.fillText("Certificado de oficio · 5 retos STEAM superados",540,395);
 x.fillStyle="#b4552d";x.font="bold 150px Georgia";
 x.fillText(ST.best,540,560);
 x.fillStyle="#6b6152";x.font="28px Georgia";
 x.fillText("de nitidez en su mejor prompt",540,605);
 x.fillStyle="#211b12";x.font="24px Georgia";
 x.fillText("— redactado con rol, contexto, tarea, formato y criterio —",540,660);
 /* mejor prompt, envuelto */
 x.fillStyle="#211b12";x.font="italic 30px Georgia";x.textAlign="left";
 var words=(ST.bestPrompt||"").split(" "),line="",yy=740,maxW=820;
 x.fillText("«",110,yy);
 for(var i=0;i<words.length&&yy<1090;i++){
  var t2=line+words[i]+" ";
  if(x.measureText(t2).width>maxW){x.fillText(line,140,yy);line=words[i]+" ";yy+=44}
  else line=t2;
 }
 if(yy<1130){x.fillText(line.trim()+" »",140,yy)}
 x.textAlign="center";
 x.strokeStyle="#c9bda6";x.beginPath();x.moveTo(200,1160);x.lineTo(880,1160);x.stroke();
 x.fillStyle="#2c5a3f";x.font="bold 34px Georgia";
 x.fillText("Firmado: "+GEN,540,1215);
 x.fillStyle="#8a5a32";x.font="26px Georgia";
 x.fillText("muta.revenuehub.cloud — un producto vivo que muta cada día",540,1270);
 showCarta(cv);
}
function showCarta(cv){
 root.innerHTML='<div class="wrap">'+header()+steamBar(4)+
 '<div class="card cartaBox"><div class="area">Tu carta del taller</div>'+
 '<p class="caso">Cinco retos, cinco disciplinas, un oficio nuevo: pedir bien. Esta carta lleva tu mejor prompt y tu gen. Guárdala o compártela: cada carta viaja con tu enlace de contagio.</p>'+
 '<div id="tCartaImg"></div>'+
 '<div style="margin-top:10px"><button class="btn" id="tShare">📤 Compartir mi carta</button>'+
 '<button class="btn sec" id="tSave">💾 Guardar imagen</button>'+
 '<button class="btn sec" id="tCopyBest">📋 Copiar mi mejor prompt</button></div>'+
 '<p class="mleyenda" style="margin-top:8px">Consejo del taller: pega tu prompt en la IA que uses y observa la diferencia. Luego itera: ese es el método.</p></div>'+
 progBar()+'</div>';
 wireCommon();
 document.getElementById("tCartaImg").appendChild(cv);
 var url=null;try{url=cv.toDataURL("image/png")}catch(e){}
 document.getElementById("tSave").onclick=function(){
  cap("muta_taller",{action:"card_save",generation:G});
  if(!url)return;
  var a=document.createElement("a");a.href=url;a.download="muta-taller-"+GEN+".png";document.body.appendChild(a);a.click();document.body.removeChild(a);
 };
 document.getElementById("tCopyBest").onclick=function(){
  cap("muta_taller",{action:"copy",reto:"carta",generation:G});
  var t=ST.bestPrompt||"";
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t);else fallbackCopy(t);
  this.textContent="✔ Copiado";
 };
 document.getElementById("tShare").onclick=function(){
  var link="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN);
  var texto="Aprendí a escribirle buenos prompts a una IA en El Taller de Prompts de MUTA: 5 retos STEAM, mi mejor oración salió con "+ST.best+" de nitidez. El taller nació del pedido de una persona real y mañana MUTA vuelve a mutar. "+link;
  cap("muta_taller",{action:"share",generation:G});
  cap("muta_share",{red:"taller_carta",gen:G,generation:G});
  if(typeof API.addEnergy==="function")API.addEnergy(2,"share");
  cv.toBlob(function(blob){
   var file=blob?new File([blob],"muta-taller.png",{type:"image/png"}):null;
   if(file&&navigator.canShare&&navigator.canShare({files:[file]})){
    navigator.share({files:[file],text:texto}).catch(function(){});
   }else if(navigator.share){
    navigator.share({text:texto}).catch(function(){});
   }else{
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(texto);else fallbackCopy(texto);
    alert("Texto copiado. Pégalo donde quieras compartirlo.");
   }
  },"image/png");
 };
}

window.MUTA_TALLER={open:open_,close:close_};
if(window.__tallerAutoStart){window.__tallerAutoStart=false;open_()}
})();
