/* ============================================================
   MUTA Gen 19 — EL CIELO CULTURAL DE SANTIAGO (módulo lazy)
   Nacido de GEN Fractal: «datos sobre arte y cultura en Santiago»
   + «titular de westthorn.cl con link y fuegos artificiales al compartir».
   Guía curada con lugares REALES (verificada 11-ago-2026) + titular
   en vivo de WestThorn vía /cartelera (con estados de carga/error honestos).
   ============================================================ */
(function(){
"use strict";
if(window.MUTA_CIELO)return;
var API=window.MUTA_API||{};
var cap=API.cap||function(){};
var esc=API.esc||function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var blip=API.blip||function(){},haptic=API.haptic||function(){},addEnergy=API.addEnergy||function(){};
var VPC=API.VPC||function(){return window.innerWidth<=720?"mobile":"desktop"};
var GEN=API.GEN||"GEN-????",REDUCED=!!API.REDUCED;
var ev=function(action,extra){var p={action:action,generation:19,experience_id:"cielo",viewport_class:VPC()};if(extra)for(var k in extra)p[k]=extra[k];cap("muta_constellation",p)};

/* ---------- datos curados (reales, con link oficial o de referencia) ---------- */
var VERIFICADO="11-ago-2026";
var CONSTELACIONES=[
 {nombre:"EL MUSEO",hue:45,stars:[
  {id:"precolombino",fx:0.14,fy:0.22,nombre:"Museo Chileno de Arte Precolombino",tipo:"Museo · Santiago Centro",desc:"5.000 años de arte de América en pleno centro. Uno de los museos mejor curados de Chile.",link:"https://precolombino.cl"},
  {id:"mnba",fx:0.27,fy:0.13,nombre:"Museo Nacional de Bellas Artes",tipo:"Museo · Parque Forestal",desc:"El museo de arte más antiguo de Sudamérica (1880). Entrada liberada, edificio monumental.",link:"https://www.mnba.gob.cl"},
  {id:"mim",fx:0.38,fy:0.26,nombre:"Museo Interactivo Mirador (MIM)",tipo:"Museo interactivo · La Granja",desc:"Ciencia para tocar: salas interactivas de luz, sonido y percepción. Imperdible con niñas y niños.",link:"https://mim.cl"},
  {id:"mnhn",fx:0.22,fy:0.35,nombre:"Museo Nacional de Historia Natural",tipo:"Museo · Quinta Normal",desc:"El esqueleto de ballena más famoso de Chile vive aquí. Entrada liberada en un parque histórico.",link:"https://www.mnhn.gob.cl"}]},
 {nombre:"EL ESCENARIO",hue:16,stars:[
  {id:"gam",fx:0.60,fy:0.16,nombre:"Centro Gabriela Mistral (GAM)",tipo:"Centro cultural · Alameda",desc:"Teatro, danza y música al centro de Santiago. Su plaza abierta es un panorama en sí misma.",link:"https://gam.cl"},
  {id:"municipal",fx:0.73,fy:0.24,nombre:"Teatro Municipal de Santiago",tipo:"Ópera y ballet · Agustinas",desc:"Ópera, ballet y conciertos desde 1857. Revisa la cartelera: hay funciones con entradas accesibles.",link:"https://www.municipal.cl"},
  {id:"m100",fx:0.85,fy:0.14,nombre:"Matucana 100",tipo:"Arte contemporáneo · Estación Central",desc:"Teatro emergente y artes visuales en una ex bodega ferroviaria de 1911.",link:"https://www.m100.cl"},
  {id:"cclm",fx:0.70,fy:0.36,nombre:"Centro Cultural La Moneda",tipo:"Centro cultural · bajo Plaza de la Ciudadanía",desc:"Grandes exposiciones bajo tierra, más la Cineteca Nacional de Chile.",link:"https://www.cclm.cl"}]},
 {nombre:"EL BARRIO",hue:158,stars:[
  {id:"lastarria",fx:0.30,fy:0.55,nombre:"Barrio Lastarria",tipo:"Paseo cultural",desc:"Librerías, cine arte y terrazas a pasos del cerro Santa Lucía: el paseo cultural clásico de Santiago.",link:"https://es.wikipedia.org/wiki/Barrio_Lastarria"},
  {id:"italia",fx:0.48,fy:0.62,nombre:"Barrio Italia",tipo:"Diseño y galerías",desc:"Anticuarios, diseño y galerías entre Providencia y Ñuñoa: el barrio creativo para perderse una tarde.",link:"https://es.wikipedia.org/wiki/Barrio_Italia"},
  {id:"santalucia",fx:0.63,fy:0.54,nombre:"Cerro Santa Lucía",tipo:"Parque histórico",desc:"El jardín donde se fundó Santiago en 1541. Subida corta, vista total de la ciudad.",link:"https://es.wikipedia.org/wiki/Cerro_Santa_Luc%C3%ADa"},
  {id:"mapocho",fx:0.80,fy:0.63,nombre:"Centro Cultural Estación Mapocho",tipo:"Centro cultural · Barrio Mapocho",desc:"La ex estación de trenes de 1912 convertida en un centro cultural monumental junto al río.",link:"https://www.estacionmapocho.cl"}]}
];

/* ---------- DOM propio del módulo ---------- */
var css=document.createElement("style");
css.textContent=
"#cieloWrap{display:none;position:fixed;inset:0;z-index:70;background:radial-gradient(120% 100% at 50% 0%,#101638 0%,#070b22 55%,#04061a 100%);flex-direction:column;touch-action:manipulation}"+
"#cieloWrap.open{display:flex}"+
"#cieloCv{position:absolute;inset:0;width:100%;height:100%}"+
"#cieloTop{position:relative;z-index:3;display:flex;align-items:flex-start;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 0}"+
"#cieloTop h2{font-size:15px;color:#ffd98a;letter-spacing:.4px;line-height:1.25;text-shadow:0 2px 8px rgba(0,0,0,.6)}"+
"#cieloTop .sub2{font-size:11px;color:#aab4dd;margin-top:2px;max-width:64ch}"+
"#cieloX{margin-left:auto;flex:0 0 auto;width:38px;height:38px;border-radius:50%;background:rgba(13,17,42,.9);border:1px solid #2c355f;color:#eef;font-size:16px;display:grid;place-items:center;cursor:pointer}"+
"#cieloFoot{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:8px 12px calc(10px + env(safe-area-inset-bottom,0px));font-size:10.5px;line-height:1.45;color:#8b96c6;background:linear-gradient(0deg,rgba(4,6,20,.92),rgba(4,6,20,0));pointer-events:none}"+
"#cieloFoot b{color:#c9d2f5}"+
"#cieloCard{display:none;position:absolute;z-index:4;background:#131a3d;border:1px solid #39406e;border-radius:16px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,.55)}"+
"#cieloCard.open{display:block}"+
"@media(max-width:720px){#cieloCard{left:8px;right:8px;bottom:calc(10px + env(safe-area-inset-bottom,0px));max-height:62dvh;overflow:auto;touch-action:pan-y;overscroll-behavior:contain}}"+
"@media(min-width:721px){#cieloCard{left:50%;top:50%;transform:translate(-50%,-50%);width:min(430px,92vw)}}"+
"#cieloCard .tipo{font-size:10.5px;letter-spacing:.6px;text-transform:uppercase;color:#ffd98a;margin-bottom:4px}"+
"#cieloCard h3{font-size:17px;color:#f2f5ff;margin-bottom:6px;line-height:1.3}"+
"#cieloCard p{font-size:13px;color:#c3cbec;line-height:1.55;margin-bottom:10px}"+
"#cieloCard .gene{font-size:10.5px;color:#7df9c6;margin-bottom:12px}"+
"#cieloCard .row{display:flex;gap:8px;flex-wrap:wrap}"+
"#cieloCard a.go,#cieloCard button{flex:1 1 auto;min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:12px;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer;padding:10px 12px}"+
"#cieloCard a.go{background:#223060;border:1px solid #39406e;color:#dfe6ff}"+
"#cieloCard button.shareStar{background:#ffd98a;border:none;color:#3a2a05}"+
"#cieloCard button.cx{flex:0 0 auto;background:transparent;border:1px solid #39406e;color:#aab4dd;min-width:44px}"+
"#cieloWt{display:none;position:absolute;z-index:3;left:12px;right:12px;top:auto;bottom:84px;pointer-events:none;text-align:center;font-size:11px;color:#9fb0e8}";
document.head.appendChild(css);

var wrap=document.createElement("div");wrap.id="cieloWrap";
wrap.setAttribute("role","dialog");wrap.setAttribute("aria-modal","true");wrap.setAttribute("aria-label","El Cielo Cultural de Santiago");
wrap.innerHTML=
'<canvas id="cieloCv" aria-label="Cielo con constelaciones culturales de Santiago. Toca una estrella para ver el panorama."></canvas>'+
'<div id="cieloTop"><div><h2>🌌 El Cielo Cultural de Santiago</h2>'+
'<div class="sub2">Cada estrella es un panorama real de arte y cultura. Tócala, conócelo y compártelo: los fuegos artificiales son de verdad (bueno, de canvas).</div></div>'+
'<button id="cieloX" aria-label="Cerrar el cielo">✕</button></div>'+
'<div id="cieloCard"></div>'+
'<div id="cieloFoot"><b>Nacida de GEN Fractal</b> · «datos sobre arte y cultura en Santiago» + «titular de westthorn.cl con fuegos artificiales al compartir». Guía curada con lugares reales, verificada '+VERIFICADO+' — horarios y entradas: revisa cada sitio oficial. Titular en vivo: WestThorn (westthorn.cl).</div>';
document.body.appendChild(wrap);

var cv=wrap.querySelector("#cieloCv"),cx2=cv.getContext("2d");
var card=wrap.querySelector("#cieloCard");
var W=0,H=0,DPR=1,topPad=90,botPad=110;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);W=wrap.clientWidth||window.innerWidth;H=wrap.clientHeight||window.innerHeight;
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cx2.setTransform(DPR,0,0,DPR,0,0);layout()}
var bgStars=[],allStars=[],comet=null,cometState="loading",cometData=null,fw=[],t0=0,running=false,raf=null;
function layout(){
  bgStars=[];var n=W<520?70:120;
  for(var i=0;i<n;i++)bgStars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+0.3,tw:Math.random()*6.28});
  allStars=[];
  var mob=W<=720;
  CONSTELACIONES.forEach(function(c,ci){
    c.stars.forEach(function(s,si){
      var fx=s.fx,fy=s.fy;
      if(mob){ /* en móvil: 3 columnas verticales, una por constelación */
        fx=0.18+ci*0.32+((si%2)*0.13-0.05);
        fy=0.10+si*0.19+(ci%2)*0.04;
      }
      allStars.push({c:c,s:s,x:fx*W,y:topPad+fy*(H-topPad-botPad),r:mob?15:13,ph:Math.random()*6.28});
    });
  });
}
/* ---------- titular en vivo (estado honesto) ---------- */
function loadCartelera(){
  cometState="loading";
  fetch("/cartelera",{cache:"no-store"}).then(function(r){return r.json()}).then(function(d){
    if(d&&d.ok&&d.items&&d.items.length){cometData=d;cometState="ok";
      comet={x:-80,y:topPad+30,vx:W<520?0.55:0.9,t:0};
    }else{cometState="off";ev("comet_error")}
  }).catch(function(){cometState="off";ev("comet_error")});
}
/* ---------- dibujo ---------- */
function draw(ts){
  if(!t0)t0=ts;var t=(ts-t0)/1000;
  cx2.clearRect(0,0,W,H);
  bgStars.forEach(function(b){var a=0.25+0.5*Math.abs(Math.sin(t*0.7+b.tw));cx2.fillStyle="rgba(214,224,255,"+a+")";cx2.beginPath();cx2.arc(b.x,b.y,b.r,0,6.28);cx2.fill()});
  /* líneas de constelación */
  CONSTELACIONES.forEach(function(c){
    var pts=allStars.filter(function(a){return a.c===c});
    cx2.strokeStyle="hsla("+c.hue+",80%,70%,.22)";cx2.lineWidth=1;
    cx2.beginPath();pts.forEach(function(p,i){i?cx2.lineTo(p.x,p.y):cx2.moveTo(p.x,p.y)});cx2.stroke();
    if(pts.length){var lx=Math.max(14,Math.min(W-90,pts[0].x-10)),ly=Math.max(topPad-16,pts[0].y-26);cx2.fillStyle="hsla("+c.hue+",85%,75%,.8)";cx2.font="700 10px system-ui";cx2.textAlign="left";cx2.fillText(c.nombre,lx,ly)}
  });
  /* estrellas-panorama */
  allStars.forEach(function(a){
    var pulse=REDUCED?1:(1+0.15*Math.sin(t*2+a.ph));
    var r=a.r*pulse,hue=a.c.hue;
    var g2=cx2.createRadialGradient(a.x,a.y,0,a.x,a.y,r*2.6);
    g2.addColorStop(0,"hsla("+hue+",95%,80%,.95)");g2.addColorStop(0.4,"hsla("+hue+",90%,65%,.5)");g2.addColorStop(1,"hsla("+hue+",90%,60%,0)");
    cx2.fillStyle=g2;cx2.beginPath();cx2.arc(a.x,a.y,r*2.6,0,6.28);cx2.fill();
    cx2.fillStyle="#fffbe9";cx2.beginPath();cx2.arc(a.x,a.y,r*0.42,0,6.28);cx2.fill();
    cx2.fillStyle="hsla("+hue+",70%,88%,.95)";cx2.font="600 "+(W<=720?"9.5":"11")+"px system-ui";cx2.textAlign="center";
    var short=a.s.nombre.length>26?a.s.nombre.slice(0,24)+"…":a.s.nombre;
    var tw=cx2.measureText(short).width;
    var lblX=Math.max(tw/2+8,Math.min(W-tw/2-8,a.x));
    cx2.fillText(short,lblX,a.y+r*2.6+11);
  });
  /* cometa WestThorn */
  if(cometState==="ok"&&comet){
    comet.x+=REDUCED?0:comet.vx;comet.t+=1;
    if(comet.x>W+560){comet.x=-560;comet.y=topPad+20+Math.random()*40}
    var cy=comet.y+(REDUCED?0:Math.sin(comet.t*0.01)*8);
    var grad=cx2.createLinearGradient(comet.x-120,cy,comet.x,cy);
    grad.addColorStop(0,"rgba(141,197,255,0)");grad.addColorStop(1,"rgba(141,197,255,.8)");
    cx2.strokeStyle=grad;cx2.lineWidth=2;cx2.beginPath();cx2.moveTo(comet.x-120,cy+6);cx2.lineTo(comet.x,cy);cx2.stroke();
    cx2.fillStyle="#cfe6ff";cx2.beginPath();cx2.arc(comet.x,cy,5,0,6.28);cx2.fill();
    cx2.fillStyle="rgba(207,230,255,.9)";cx2.font="600 11px system-ui";cx2.textAlign="left";
    var head=cometData.items[0].titular;if(head.length>60)head=head.slice(0,58)+"…";
    cx2.fillText("📰 "+head+"  · toca el cometa",comet.x+12,cy+4);
    comet.hit={x:comet.x,y:cy};
  }else if(cometState==="loading"){
    cx2.fillStyle="rgba(159,176,232,.7)";cx2.font="600 11px system-ui";cx2.textAlign="center";
    cx2.fillText("🔭 buscando la señal de WestThorn…",W/2,topPad+18);
  }else if(cometState==="off"){
    cx2.fillStyle="rgba(159,176,232,.55)";cx2.font="600 10.5px system-ui";cx2.textAlign="center";
    cx2.fillText("🔭 El observatorio no captó señal de WestThorn ahora. Los panoramas siguen brillando.",W/2,topPad+18);
  }
  /* fuegos artificiales */
  for(var i=fw.length-1;i>=0;i--){var p=fw[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.045;p.l-=0.012;
    if(p.l<=0){fw.splice(i,1);continue}
    cx2.fillStyle="hsla("+p.hue+",95%,"+(55+p.l*30)+"%,"+p.l+")";cx2.beginPath();cx2.arc(p.x,p.y,2.2*p.l+0.4,0,6.28);cx2.fill()}
  if(running)raf=requestAnimationFrame(draw);
}
function fireworks(n){
  if(REDUCED){return}
  var bursts=n||3;
  for(var b=0;b<bursts;b++){
    (function(b2){setTimeout(function(){
      var x=W*(0.2+Math.random()*0.6),y=H*(0.15+Math.random()*0.4),hue=[45,16,158,210][b2%4];
      for(var i=0;i<70&&fw.length<450;i++){var a=Math.random()*6.28,v=1+Math.random()*3.6;
        fw.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,l:1,hue:hue+Math.random()*30})}
      blip(660+b2*120,0.2,"triangle",0.14);haptic(30);
    },b2*260)})(b);
  }
}
/* ---------- tarjetas ---------- */
var openStar=null;
function showStar(a){
  openStar=a;ev("star",{star_id:a.s.id});blip(587,0.12);haptic(12);
  card.innerHTML='<div class="tipo">'+esc(a.s.tipo)+' · constelación '+esc(a.c.nombre)+'</div>'+
   '<h3>'+esc(a.s.nombre)+'</h3><p>'+esc(a.s.desc)+'</p>'+
   '<div class="gene">⭐ Panorama real · guía curada por MUTA, verificada '+VERIFICADO+' · pedida por GEN Fractal</div>'+
   '<div class="row"><a class="go" href="'+esc(a.s.link)+'" target="_blank" rel="noopener">Ver sitio ↗</a>'+
   '<button class="shareStar">🎆 Compartir panorama</button>'+
   '<button class="cx" aria-label="Cerrar">✕</button></div>';
  card.classList.add("open");
  card.querySelector(".cx").addEventListener("click",closeCard);
  card.querySelector(".go").addEventListener("click",function(){ev("link",{star_id:a.s.id})});
  card.querySelector(".shareStar").addEventListener("click",function(){shareStar(a)});
}
function showComet(){
  if(cometState!=="ok"||!cometData)return;
  ev("comet");blip(523,0.12);
  var items=cometData.items.map(function(it){return '<p style="margin-bottom:6px">📰 <a style="color:#8ec5ff" href="'+esc(it.link)+'" target="_blank" rel="noopener">'+esc(it.titular)+'</a></p>'}).join("");
  card.innerHTML='<div class="tipo">Titular en vivo · fuente: WestThorn (westthorn.cl)</div>'+
   '<h3>Lo último en cultura, según WestThorn</h3>'+items+
   '<div class="gene">Señal captada '+esc((cometData.actualizado||"").slice(0,16).replace("T"," "))+' UTC · crédito completo a westthorn.cl, la revista que pidió leer GEN Fractal</div>'+
   '<div class="row"><button class="cx" aria-label="Cerrar" style="flex:1">Cerrar</button></div>';
  card.classList.add("open");
  card.querySelector(".cx").addEventListener("click",closeCard);
}
function closeCard(){card.classList.remove("open");openStar=null}
function shareStar(a){
  var url=location.origin+"/?g="+encodeURIComponent(GEN);
  var txt="⭐ Panorama cultural real en Santiago: "+a.s.nombre+" — lo encontré en el Cielo Cultural de MUTA, un producto vivo que evoluciona cada día con lo que la gente pide.";
  ev("share",{star_id:a.s.id});cap("muta_share",{red:"cielo",gen:GEN});addEnergy(2,"cielo_share");
  var done=function(){fireworks(4);var g3=card.querySelector(".gene");if(g3)g3.innerHTML="🎆 ¡Fuegos artificiales! Compartiste un panorama real y tu huevo ganó +2 ⚡. Si alguien entra con tu enlace, tu gen gana contagio."};
  if(navigator.share){navigator.share({title:"El Cielo Cultural · MUTA",text:txt,url:url}).then(done).catch(function(){})}
  else{try{navigator.clipboard.writeText(txt+" "+url);done()}catch(e){done()}}
}
/* ---------- input ---------- */
cv.addEventListener("pointerdown",function(e){
  var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(comet&&comet.hit&&cometState==="ok"){var dxc=x-comet.hit.x,dyc=y-comet.hit.y;
    if(dxc>-14&&dxc<220&&Math.abs(dyc)<20){showComet();return}}
  var best=null,bd=1e9;
  allStars.forEach(function(a){var dx=x-a.x,dy=y-a.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=a}});
  if(best&&bd<Math.pow(W<=720?34:30,2)){showStar(best)}else closeCard();
});
wrap.querySelector("#cieloX").addEventListener("click",function(){apiClose()});
/* ---------- API pública ---------- */
function apiOpen(){
  if(wrap.classList.contains("open"))return;
  wrap.classList.add("open");running=true;t0=0;
  resize();loadCartelera();ev("open");
  raf=requestAnimationFrame(draw);
}
function apiClose(){wrap.classList.remove("open");running=false;if(raf)cancelAnimationFrame(raf);closeCard()}
window.addEventListener("resize",function(){if(running)resize()});
document.addEventListener("visibilitychange",function(){if(document.hidden&&running){running=false;if(raf)cancelAnimationFrame(raf)}else if(!document.hidden&&wrap.classList.contains("open")&&!running){running=true;raf=requestAnimationFrame(draw)}});
window.MUTA_CIELO={open:apiOpen,close:apiClose,stop:apiClose};
if(window.__cieloAutoStart){window.__cieloAutoStart=false;apiOpen()}
})();
