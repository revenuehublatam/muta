/* ============ EL RESCATE DE PROMPTS — Gen 31 ============
   Profundiza el Taller de Prompts pedido por GEN-68A8 «Fractal».
   Evidencia de Gen 30: una persona móvil completó los cinco ingredientes, obtuvo
   53 de nitidez y copió su prompt, pero no encontró una ruta visible para iterar.
   Esta herramienta diagnostica cinco ingredientes, deja mejorar cada hueco y
   compara antes/después. Es una pauta local y determinista: no envía el prompt,
   no llama a una IA y no presenta el puntaje como una evaluación automática.
   El texto del usuario se escapa siempre y jamás entra a analítica. */
(function(){
"use strict";
if(window.MUTA_RESCATE)return;
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var esc=API.esc||function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var addEnergy=API.addEnergy||function(){};
var haptic=API.haptic||function(){};
var blip=API.blip||function(){};
var VPC=API.VPC||function(){return window.innerWidth<=720?"mobile":"desktop"};
var GEN=API.GEN||"GEN-0000";
var G=Number(API.generation)||31;
var REDUCED=!!API.REDUCED;
var KEY="muta_rescate_progress_g31";
var root=null,lastFocus=null,view="intro",original="",beforeScore=0,parts={},detected={},activeField=null,rescued=false,compared=false;
var progress={rescues:0,best_delta:0};
try{progress=Object.assign(progress,JSON.parse(localStorage.getItem(KEY)||"{}")||{})}catch(e){}

var FIELDS=[
 {id:"role",icon:"◉",name:"PUNTO DE VISTA",short:"rol",why:"Define desde qué experiencia debe responder.",examples:["una especialista práctica en el tema","una docente que explica sin jerga","una editora que prioriza claridad"]},
 {id:"context",icon:"⌖",name:"SITUACIÓN",short:"contexto",why:"Aclara para quién es, qué ya sabes y qué restricción existe.",examples:["para una persona que parte desde cero","para un equipo pequeño con recursos limitados","para tomar una decisión esta semana"]},
 {id:"task",icon:"→",name:"ENCARGO",short:"tarea",why:"Convierte la intención en un verbo y un resultado observable.",examples:["analiza el pedido y propone un plan accionable","explica el tema paso a paso y termina con una prueba","compara tres caminos y recomienda uno con razones"]},
 {id:"format",icon:"▦",name:"FORMA DE ENTREGA",short:"formato",why:"Hace que la respuesta llegue lista para usar.",examples:["en una tabla de tres columnas","en cinco pasos numerados con un ejemplo","como un borrador breve listo para editar"]},
 {id:"criterion",icon:"✓",name:"REGLA DE CALIDAD",short:"criterio",why:"Dice qué cuidar, qué evitar y cómo reconocer una buena respuesta.",examples:["usa lenguaje claro y no inventes datos","distingue hechos, supuestos y dudas pendientes","sé breve, específico y termina con el siguiente paso"]}
];

var CSS='\
#rescueOvl{position:fixed;inset:0;z-index:360;display:none;overflow-y:auto;overflow-x:hidden;background:#f6f0df;color:#19221d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;touch-action:pan-y;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}\
#rescueOvl.open{display:block}\
#rescueOvl *{box-sizing:border-box}\
#rescueOvl button,#rescueOvl textarea,#rescueOvl input{font:inherit}\
#rescueOvl button{cursor:pointer}\
#rescueOvl button:focus-visible,#rescueOvl textarea:focus-visible,#rescueOvl input:focus-visible{outline:3px solid #ff6b35;outline-offset:3px}\
#rescueOvl .shell{min-height:100vh;min-height:100dvh;max-width:1180px;margin:0 auto;padding:calc(18px + env(safe-area-inset-top)) 22px calc(70px + env(safe-area-inset-bottom))}\
#rescueOvl .top{display:flex;align-items:flex-start;gap:16px;border-bottom:2px solid #19221d;padding-bottom:13px;margin-bottom:18px}\
#rescueOvl .mark{width:46px;height:46px;display:grid;place-items:center;background:#ff6b35;color:#fff;border-radius:50% 50% 46% 54%;font-size:24px;flex:none;box-shadow:5px 5px 0 #19221d}\
#rescueOvl .toptext{min-width:0;flex:1}\
#rescueOvl .eyebrow{font:800 10px/1.3 ui-monospace,SFMono-Regular,monospace;letter-spacing:2px;text-transform:uppercase;color:#8a442b;margin:0 0 4px}\
#rescueOvl h1{font-size:clamp(28px,5.4vw,56px);line-height:.95;letter-spacing:-2px;margin:0;text-transform:uppercase}\
#rescueOvl .deck{font-size:14px;line-height:1.5;max-width:720px;margin:8px 0 0;color:#47534c}\
#rescueOvl .close{width:42px;height:42px;border:2px solid #19221d;border-radius:50%;background:#fffaf0;color:#19221d;font-size:18px;flex:none}\
#rescueOvl .credit{font-size:12px;line-height:1.45;color:#665d51;margin:0 0 18px;padding:10px 12px;border-left:4px solid #ff6b35;background:rgba(255,255,255,.45)}\
#rescueOvl .introgrid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);gap:18px;align-items:start}\
#rescueOvl .panel{background:#fffaf0;border:2px solid #19221d;border-radius:18px;padding:18px;box-shadow:7px 7px 0 rgba(25,34,29,.14)}\
#rescueOvl .panel h2{font-size:20px;line-height:1.2;margin:0 0 6px}\
#rescueOvl .hint{font-size:13px;line-height:1.5;color:#58635c;margin:0 0 12px}\
#rescueOvl label{font-size:12px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;display:block;margin-bottom:7px}\
#rescueOvl textarea{width:100%;min-height:150px;resize:vertical;border:2px solid #19221d;border-radius:13px;background:#fff;color:#19221d;padding:14px;font-size:16px;line-height:1.5}\
#rescueOvl .counter{text-align:right;font:11px ui-monospace,monospace;color:#6d756f;margin-top:4px}\
#rescueOvl .primary{border:2px solid #19221d;background:#ff6b35;color:#fff;border-radius:999px;padding:12px 18px;font-weight:900;letter-spacing:.5px;box-shadow:4px 4px 0 #19221d}\
#rescueOvl .primary:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #19221d}\
#rescueOvl .secondary{border:1.5px solid #19221d;background:#fffaf0;color:#19221d;border-radius:999px;padding:10px 15px;font-weight:750}\
#rescueOvl .secondary[disabled],#rescueOvl .primary[disabled]{opacity:.45;cursor:not-allowed;box-shadow:none}\
#rescueOvl .examples{display:grid;gap:8px;margin-top:10px}\
#rescueOvl .example{border:1.5px solid #718177;background:#edf2e8;border-radius:12px;padding:11px;text-align:left;color:#25332a;line-height:1.35}\
#rescueOvl .privacy{font-size:12px;line-height:1.5;color:#58635c;margin:13px 0 0}\
#rescueOvl .lab{display:grid;grid-template-columns:minmax(300px,.86fr) minmax(0,1.14fr);gap:18px;align-items:start}\
#rescueOvl .scorebox{display:grid;grid-template-columns:88px 1fr;gap:14px;align-items:center;margin-bottom:14px}\
#rescueOvl .score{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#ff6b35 var(--score),#ded6c6 0);position:relative}\
#rescueOvl .score:after{content:"";position:absolute;inset:9px;border-radius:50%;background:#fffaf0}\
#rescueOvl .score b{position:relative;z-index:1;font-size:25px}\
#rescueOvl .delta{font-weight:850;color:#16633f}\
#rescueOvl .fields{display:grid;gap:8px}\
#rescueOvl .field{width:100%;border:1.5px solid #19221d;border-radius:13px;background:#fffaf0;padding:11px;display:grid;grid-template-columns:34px 1fr auto;gap:9px;text-align:left;align-items:center;color:#19221d}\
#rescueOvl .field .fi{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#e4dccd;font-weight:900}\
#rescueOvl .field.good .fi{background:#cce8d6;color:#095d36}\
#rescueOvl .field.changed .fi{background:#ffdccf;color:#8f2d0d}\
#rescueOvl .field strong{display:block;font-size:12px;letter-spacing:.6px}\
#rescueOvl .field small{display:block;color:#667068;margin-top:3px;line-height:1.3}\
#rescueOvl .field .tag{font:800 10px ui-monospace,monospace;text-transform:uppercase}\
#rescueOvl .editor{margin-top:12px;border:2px dashed #ff6b35;border-radius:15px;padding:13px;background:#fff2e9}\
#rescueOvl .editor h3{font-size:15px;margin:0 0 4px}\
#rescueOvl .suggestions{display:grid;gap:7px;margin:10px 0}\
#rescueOvl .suggestion{border:1.5px solid #19221d;background:#fff;border-radius:10px;padding:10px 11px;text-align:left;line-height:1.35;color:#19221d}\
#rescueOvl .custom{display:flex;gap:8px}\
#rescueOvl .custom input{flex:1;min-width:0;border:1.5px solid #19221d;border-radius:10px;padding:10px;background:#fff;color:#19221d}\
#rescueOvl .paper{background:#16221b;color:#eff5ea;border-radius:16px;padding:18px;min-height:220px;position:relative;overflow:hidden}\
#rescueOvl .paper:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 49%,rgba(255,255,255,.035) 50%,transparent 51%);background-size:28px 28px;pointer-events:none}\
#rescueOvl .paper .label{font:800 10px ui-monospace,monospace;letter-spacing:1.5px;color:#a9b8ad;text-transform:uppercase;margin-bottom:12px}\
#rescueOvl .prompt{position:relative;font:15px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;word-break:break-word}\
#rescueOvl .prompt .added{background:#225f3c;color:#eaffef;border-radius:4px;padding:1px 3px}\
#rescueOvl .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}\
#rescueOvl .compare{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}\
#rescueOvl .compare>div{border:1px solid #667068;border-radius:12px;padding:12px;background:#fff;color:#19221d}\
#rescueOvl .compare b{display:block;font:800 10px ui-monospace,monospace;letter-spacing:1px;text-transform:uppercase;margin-bottom:7px}\
#rescueOvl .compare p{font-size:12.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word}\
#rescueOvl .win{margin-top:12px;background:#d9f1df;border:2px solid #16633f;border-radius:14px;padding:12px;color:#0f4e31;font-size:13px;line-height:1.5}\
#rescueOvl .cardview{text-align:center}\
#rescueOvl .cardview canvas{width:min(420px,100%);border-radius:14px;border:2px solid #19221d;box-shadow:7px 7px 0 rgba(25,34,29,.18)}\
#rescueOvl .status{min-height:22px;margin-top:9px;font-size:12px;color:#16633f;font-weight:750}\
@media(max-width:800px){#rescueOvl .introgrid,#rescueOvl .lab{grid-template-columns:1fr}#rescueOvl .shell{padding-left:13px;padding-right:13px}#rescueOvl .top{gap:10px}#rescueOvl .mark{width:40px;height:40px}#rescueOvl h1{letter-spacing:-1px}#rescueOvl .compare{grid-template-columns:1fr}#rescueOvl .custom{flex-direction:column}#rescueOvl .field{grid-template-columns:32px 1fr auto}}\
@media(prefers-reduced-motion:reduce){#rescueOvl *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}';

function saveProgress(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch(e){}}
function build(){
 if(root)return;
 var style=document.createElement("style");style.textContent=CSS;document.head.appendChild(style);
 root=document.createElement("section");root.id="rescueOvl";root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.setAttribute("aria-label","El Rescate de Prompts");
 document.body.appendChild(root);
 root.addEventListener("click",onClick);
 root.addEventListener("input",function(e){if(e.target.id==="rescueInput"){var c=root.querySelector("#rescueCount");if(c)c.textContent=e.target.value.length+" / 600"}});
 document.addEventListener("keydown",function(e){
  if(!root.classList.contains("open"))return;
  if(e.key==="Escape"){close_();return}
  if(e.key!=="Tab")return;
  var focusable=[].slice.call(root.querySelectorAll('button:not([disabled]),textarea:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(function(el){return el.offsetParent!==null});
  if(!focusable.length)return;
  var first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 });
}
function header(){return '<header class="top"><div class="mark" aria-hidden="true">🧯</div><div class="toptext"><p class="eyebrow">MUTA · GEN '+G+' · herramienta viva</p><h1>El Rescate de Prompts</h1><p class="deck">Escribe un pedido borroso. MUTA muestra cinco huecos; tú decides cómo volverlo útil. El diagnóstico ocurre en tu dispositivo.</p></div><button class="close" data-action="close" aria-label="Cerrar El Rescate">✕</button></header><p class="credit"><b>Nacida de… GEN-68A8 «Fractal».</b> Su Taller enseñó a completar la oración; una persona real llegó a 53/100 y copió el resultado, pero no iteró. Hoy la iteración se vuelve el producto completo.</p>'}
function open_(){
 build();lastFocus=document.activeElement;root.classList.add("open");document.documentElement.style.overflow="hidden";
 try{localStorage.setItem("muta_seen_gen",String(G))}catch(e){}
 cap("muta_rescate",{action:"open",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"button",viewport_class:VPC(),gene_origin:GEN,result:"opened"});
 cap("muta_mode_switch",{mode:"rescue",generation:G,experience_id:"rescate-prompts",viewport_class:VPC(),gene_origin:GEN});
 if(view==="lab")renderLab();else if(view==="card")renderCard();else renderIntro();
 setTimeout(function(){var f=root.querySelector("textarea,button");if(f)f.focus()},40);
}
function close_(){if(!root)return;root.classList.remove("open");document.documentElement.style.overflow="";cap("muta_rescate",{action:"close",generation:G,experience_id:"rescate-prompts",mode:"rescue",viewport_class:VPC(),gene_origin:GEN,result:view});if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function renderIntro(){
 view="intro";root.innerHTML='<main class="shell">'+header()+'<div class="introgrid"><section class="panel"><h2>1. Trae un prompt real</h2><p class="hint">Puede ser una frase corta. No incluyas contraseñas, datos de clientes ni información personal.</p><label for="rescueInput">¿Qué le pedirías a una IA?</label><textarea id="rescueInput" maxlength="600" placeholder="Ejemplo: ayúdame a preparar una reunión con un cliente">'+esc(original)+'</textarea><div class="counter" id="rescueCount">'+original.length+' / 600</div><div class="actions"><button class="primary" data-action="analyze">Diagnosticar cinco huecos →</button></div><p class="privacy">🔒 El texto se procesa localmente en tu navegador. PostHog recibe solo acciones y puntajes, nunca tu prompt.</p></section><aside class="panel"><h2>O prueba una misión</h2><p class="hint">Estas semillas sirven para entender la herramienta; puedes editarlas antes del diagnóstico.</p><div class="examples"><button class="example" data-example="Ayúdame a preparar una reunión comercial importante">Reunión comercial</button><button class="example" data-example="Escribe un correo para resolver un desacuerdo con mi equipo">Correo difícil</button><button class="example" data-example="Explícame cómo aprender una habilidad nueva">Aprender algo</button></div><p class="privacy"><b>La pauta no es una IA.</b> Solo detecta ingredientes explícitos y te ayuda a completarlos sin fingir que entiende más de lo que escribiste.</p></aside></div></main>';
}
function has(re){return re.test(original)}
function diagnose(){
 var ta=root.querySelector("#rescueInput"),raw=String(ta&&ta.value||"").normalize("NFKC").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,600);
 if(raw.length<8){status("Escribe al menos 8 caracteres para diagnosticar.",true);if(ta)ta.focus();return}
 original=raw;parts={};activeField=null;rescued=false;compared=false;
 detected={
  role:has(/\b(act[uú]a|actua|eres|como (un|una)|experto|experta|especialista|asesor|asesora|profesor|profesora|editor|editora)\b/i),
  context:has(/\b(contexto|para (un|una|mi|nuestro|nuestra|el|la)|tengo|somos|necesito|audiencia|p[uú]blico|cliente|equipo)\b/i),
  task:original.length>=8,
  format:has(/\b(tabla|lista|pasos|p[aá]rrafo|guion|formato|json|correo|email|presentaci[oó]n|viñetas|columnas)\b/i),
  criterion:has(/\b(m[aá]ximo|m[ií]nimo|tono|sin |incluye|evita|claro|clara|breve|fuente|cita|no invent|espec[ií]fico)\b/i)
 };
 beforeScore=score();view="lab";
 cap("muta_rescate",{action:"analyze",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"text",viewport_class:VPC(),gene_origin:GEN,result:"diagnosed",progress:beforeScore,ingredients:presentCount()});
 haptic(10);blip(520,.08,"triangle",.06);renderLab();
}
function present(id){return !!(detected[id]||parts[id])}
function presentCount(){return FIELDS.filter(function(f){return present(f.id)}).length}
function score(){return presentCount()*20}
function changedCount(){return Object.keys(parts).filter(function(k){return !!parts[k]}).length}
function fieldBy(id){for(var i=0;i<FIELDS.length;i++)if(FIELDS[i].id===id)return FIELDS[i];return null}
function promptText(){
 var lines=[];
 if(parts.role)lines.push("Actúa como "+parts.role+".");
 if(parts.context)lines.push("Contexto: "+parts.context+".");
 if(parts.task)lines.push(parts.task+".");else lines.push(original.replace(/[.!?]+$/," ").trim()+".");
 if(parts.format)lines.push("Formato: "+parts.format+".");
 if(parts.criterion)lines.push("Criterios: "+parts.criterion+".");
 return lines.join(" ").replace(/\.\./g,".");
}
function promptHTML(){
 var out=[];
 if(parts.role)out.push('<span class="added">Actúa como '+esc(parts.role)+'.</span>');
 if(parts.context)out.push('<span class="added">Contexto: '+esc(parts.context)+'.</span>');
 out.push(parts.task?'<span class="added">'+esc(parts.task)+'.</span>':esc(original.replace(/[.!?]+$/,""))+'.');
 if(parts.format)out.push('<span class="added">Formato: '+esc(parts.format)+'.</span>');
 if(parts.criterion)out.push('<span class="added">Criterios: '+esc(parts.criterion)+'.</span>');
 return out.join(" ");
}
function renderLab(){
 view="lab";var now=score(),delta=now-beforeScore;
 var fields=FIELDS.map(function(f){var cls=parts[f.id]?"changed":(detected[f.id]?"good":"");var state=parts[f.id]?"mejorado":(detected[f.id]?"detectado":"falta");return '<button class="field '+cls+'" data-field="'+f.id+'"><span class="fi">'+f.icon+'</span><span><strong>'+f.name+'</strong><small>'+f.why+'</small></span><span class="tag">'+state+'</span></button>'}).join("");
 var editor="";
 if(activeField){var f=fieldBy(activeField);editor='<section class="editor" aria-label="Mejorar '+esc(f.name)+'"><h3>'+f.icon+' '+f.name+'</h3><p class="hint">'+f.why+' Elige una pista o escribe la tuya.</p><div class="suggestions">'+f.examples.map(function(x,i){return '<button class="suggestion" data-choice="'+i+'">'+esc(x)+'</button>'}).join("")+'</div><div class="custom"><input id="rescueCustom" maxlength="180" aria-label="Escribe tu propia mejora para '+esc(f.name)+'" placeholder="Escribe tu propia mejora…"><button class="secondary" data-action="custom">Usar esta mejora</button></div></section>'}
 var compare=compared?'<div class="compare"><div><b>Antes · '+beforeScore+'/100</b><p>'+esc(original)+'</p></div><div><b>Después · '+now+'/100</b><p>'+esc(promptText())+'</p></div></div>':'';
 var win=rescued?'<div class="win" role="status"><b>Prompt rescatado.</b> Mejoraste '+changedCount()+' ingredientes y ya existe una diferencia concreta para probar. Copia el resultado o crea una tarjeta sin el texto del prompt.</div>':'';
 root.innerHTML='<main class="shell">'+header()+'<div class="lab"><section class="panel"><div class="scorebox"><div class="score" style="--score:'+now+'%"><b>'+now+'</b></div><div><h2>Mapa de huecos</h2><p class="hint">'+presentCount()+' de 5 ingredientes explícitos. <span class="delta">'+(delta>0?"+"+delta+" puntos desde el diagnóstico":"Elige dos huecos para completar el rescate")+'</span></p></div></div><div class="fields">'+fields+'</div>'+editor+'</section><section class="panel"><h2>Tu prompt, reconstruido en vivo</h2><p class="hint">Lo verde es lo que tú agregaste. La herramienta no reescribe ni envía tu pedido por su cuenta.</p><div class="paper"><div class="label">Borrador de trabajo · '+GEN+'</div><div class="prompt">'+promptHTML()+'</div></div><div class="actions"><button class="primary" data-action="copy">Copiar prompt mejorado</button><button class="secondary" data-action="compare">'+(compared?"Ocultar comparación":"Ver antes / después")+'</button><button class="secondary" data-action="card" '+(rescued?"":"disabled")+'>Crear tarjeta del rescate</button><button class="secondary" data-action="restart">Rescatar otro</button></div>'+compare+win+'<div class="status" id="rescueStatus" aria-live="polite"></div></section></div></main>';
}
function choose(value,inputType){
 if(!activeField||!value)return;var id=activeField;parts[id]=String(value).trim().slice(0,180);activeField=null;
 cap("muta_rescate",{action:"improve",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:inputType||"choice",viewport_class:VPC(),gene_origin:GEN,result:id,progress:score(),ingredient:id,improvements:changedCount()});
 haptic(9);blip(620+changedCount()*45,.08,"triangle",.06);
 if(changedCount()>=2&&!rescued){rescued=true;progress.rescues++;var d=score()-beforeScore;if(d>progress.best_delta)progress.best_delta=d;saveProgress();cap("muta_rescate",{action:"rescued",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:inputType||"choice",viewport_class:VPC(),gene_origin:GEN,result:"success",progress:score(),before_score:beforeScore,after_score:score(),improvements:changedCount()});addEnergy(2,"rescate_prompt");haptic([12,25,20]);blip(880,.15,"sine",.09)}
 renderLab();
}
function copyPrompt(){var t=promptText();cap("muta_rescate",{action:"copy",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"clipboard",viewport_class:VPC(),gene_origin:GEN,result:rescued?"rescued":"draft",progress:score(),improvements:changedCount()});function ok(){status("✔ Prompt copiado. Pruébalo en la IA que uses y compara la respuesta.");haptic(10)}function legacy(){if(fallbackCopy(t))ok();else status("No pude copiar automáticamente. Selecciona el texto del borrador y cópialo desde tu navegador.",true)}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,legacy);else legacy()}
function fallbackCopy(t){var ta=document.createElement("textarea"),copied=false;ta.value=t;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{copied=document.execCommand("copy")}catch(e){}document.body.removeChild(ta);return copied}
function status(msg,bad){var el=root&&root.querySelector("#rescueStatus");if(!el){el=root&&root.querySelector(".privacy")}if(el){el.textContent=msg;el.style.color=bad?"#9d280e":"#16633f"}}
function makeCard(){
 cap("muta_rescate",{action:"card",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"button",viewport_class:VPC(),gene_origin:GEN,result:"created",before_score:beforeScore,after_score:score(),improvements:changedCount()});
 view="card";renderCard();
}
function renderCard(){
 root.innerHTML='<main class="shell">'+header()+'<section class="panel cardview"><h2>Tu tarjeta del rescate</h2><p class="hint">No contiene el prompt: solo la mejora, los ingredientes trabajados y tu gen. Así puedes compartir sin revelar el pedido.</p><canvas id="rescueCard" width="1080" height="1350" aria-label="Tarjeta de rescate de prompt"></canvas><div class="actions" style="justify-content:center"><button class="primary" data-action="share">Compartir tarjeta</button><button class="secondary" data-action="save">Guardar imagen</button><button class="secondary" data-action="back">Volver al prompt</button></div><div class="status" id="rescueStatus" aria-live="polite"></div></section></main>';
 drawCard(root.querySelector("#rescueCard"));
}
function drawCard(cv){var x=cv.getContext("2d"),now=score(),delta=now-beforeScore;x.fillStyle="#f6f0df";x.fillRect(0,0,1080,1350);x.fillStyle="#19221d";x.fillRect(0,0,1080,190);x.fillStyle="#ff6b35";x.beginPath();x.arc(120,95,55,0,Math.PI*2);x.fill();x.font="54px serif";x.textAlign="center";x.fillStyle="#fff";x.fillText("🧯",120,113);x.textAlign="left";x.font="800 34px system-ui";x.fillText("MUTA · GEN "+G,210,77);x.font="900 58px system-ui";x.fillText("RESCATE DE PROMPTS",210,137);x.textAlign="center";x.fillStyle="#19221d";x.font="900 178px system-ui";x.fillText("+"+delta,540,430);x.font="700 34px system-ui";x.fillText("PUNTOS DE NITIDEZ",540,480);x.strokeStyle="#19221d";x.lineWidth=5;x.strokeRect(85,535,910,260);x.font="900 72px system-ui";x.fillStyle="#8a442b";x.fillText(beforeScore+"  →  "+now,540,650);x.font="600 30px system-ui";x.fillStyle="#19221d";x.fillText(changedCount()+" ingredientes mejorados por decisión propia",540,720);x.textAlign="left";x.font="800 30px system-ui";x.fillText("INGREDIENTES RESCATADOS",110,885);var yy=950;FIELDS.filter(function(f){return !!parts[f.id]}).forEach(function(f){x.fillStyle="#16633f";x.fillText("✓",125,yy);x.fillStyle="#19221d";x.fillText(f.name,180,yy);yy+=62});x.textAlign="center";x.fillStyle="#665d51";x.font="italic 28px Georgia";x.fillText("Nacido de GEN-68A8 «Fractal» · construido con evidencia real",540,1175);x.fillStyle="#19221d";x.font="800 38px system-ui";x.fillText("Firmado: "+GEN,540,1245);x.fillStyle="#8a442b";x.font="600 24px system-ui";x.fillText("muta.revenuehub.cloud · un producto que cambia cada día",540,1295)}
function shareCard(){var cv=root.querySelector("#rescueCard"),link="https://muta.revenuehub.cloud/?g="+encodeURIComponent(GEN),txt="Rescaté un prompt borroso en MUTA: mejoré "+changedCount()+" ingredientes y pasé de "+beforeScore+" a "+score()+" de nitidez. El texto nunca salió de mi dispositivo. Mañana MUTA vuelve a cambiar. "+link;cap("muta_rescate",{action:"share",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"webshare",viewport_class:VPC(),gene_origin:GEN,result:"attempt",before_score:beforeScore,after_score:score()});cap("muta_share",{red:"rescate_carta",gen:G,generation:G,mode:"rescue",experience_id:"rescate-prompts",viewport_class:VPC(),gene_origin:GEN});cv.toBlob(function(blob){var file=blob?new File([blob],"muta-rescate-gen31.png",{type:"image/png"}):null;if(file&&navigator.canShare&&navigator.canShare({files:[file]}))navigator.share({files:[file],text:txt}).catch(function(){});else if(navigator.share)navigator.share({text:txt}).catch(function(){});else{var copied=fallbackCopy(txt);status(copied?"Texto para compartir copiado.":"No pude abrir Compartir. Usa Guardar imagen o copia el enlace de MUTA.",!copied)}},"image/png")}
function saveCard(){var cv=root.querySelector("#rescueCard");cap("muta_rescate",{action:"card_save",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"download",viewport_class:VPC(),gene_origin:GEN,result:"saved"});var a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download="muta-rescate-gen31.png";document.body.appendChild(a);a.click();document.body.removeChild(a);status("✔ Tarjeta guardada.")}
function restart(){original="";beforeScore=0;parts={};detected={};activeField=null;rescued=false;compared=false;renderIntro();setTimeout(function(){var t=root.querySelector("#rescueInput");if(t)t.focus()},20)}
function onClick(e){var a=e.target.closest("[data-action]"),ex=e.target.closest("[data-example]"),field=e.target.closest("[data-field]"),choice=e.target.closest("[data-choice]");if(ex){var ta=root.querySelector("#rescueInput");if(ta){ta.value=ex.getAttribute("data-example");ta.dispatchEvent(new Event("input"));ta.focus()}cap("muta_rescate",{action:"sample",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"choice",viewport_class:VPC(),gene_origin:GEN,result:"selected"});return}if(field){activeField=field.getAttribute("data-field");renderLab();setTimeout(function(){var q=root.querySelector(".suggestion");if(q)q.focus()},20);return}if(choice){var f=fieldBy(activeField),i=Number(choice.getAttribute("data-choice"));choose(f&&f.examples[i],"choice");return}if(!a)return;var name=a.getAttribute("data-action");if(name==="close")close_();else if(name==="analyze")diagnose();else if(name==="custom"){var inp=root.querySelector("#rescueCustom"),v=String(inp&&inp.value||"").normalize("NFKC").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim();if(v.length<4){if(inp)inp.focus();return}choose(v,"text")}else if(name==="copy")copyPrompt();else if(name==="compare"){compared=!compared;cap("muta_rescate",{action:"compare",generation:G,experience_id:"rescate-prompts",mode:"rescue",input_type:"button",viewport_class:VPC(),gene_origin:GEN,result:compared?"opened":"closed",progress:score()});renderLab()}else if(name==="card")makeCard();else if(name==="share")shareCard();else if(name==="save")saveCard();else if(name==="back"){view="lab";renderLab()}else if(name==="restart")restart()}

window.MUTA_RESCATE={open:open_,close:close_};
if(window.__rescateAutoStart){window.__rescateAutoStart=false;open_()}
})();
