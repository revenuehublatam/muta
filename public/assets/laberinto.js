/* ============================================================
   MUTA Gen 18 — EL LABERINTO ESTELAR (módulo con carga diferida)
   Nacido de GEN-0866 «Rebelde»: "Mezcla el juego de snake con Pac-Man".
   Snake × comecocos: comes fragmentos de estrella en un laberinto,
   pero tu cola de cometa crece y se vuelve tu propio obstáculo.
   La súper estrella espanta a las sombras Y reinicia tu cola.
   Habla con el organismo a través de window.MUTA_API.
   ============================================================ */
(function(){
'use strict';
if(window.MUTA_LAB)return;

/* Puente hacia el organismo (window.MUTA_API, publicado por index.html).
   Cada proxy degrada con gracia si el puente no está. */
function API(){return window.MUTA_API||{}}
function cap(n,p){var f=API().cap;if(f)f(n,p)}
function addEnergy(n,s){var f=API().addEnergy;if(f)f(n,s)}
function blip(a,b,c,d){var f=API().blip;if(f)f(a,b,c,d)}
function haptic(x){var f=API().haptic;if(f)f(x)}
function drawHero(c,x,y,s,o){var f=API().drawHero;if(f){f(c,x,y,s,o)}else{c.fillStyle='#7df9c6';c.beginPath();c.arc(x,y,s*0.8,0,7);c.fill()}}
function esc(t){var f=API().esc;if(f)return f(t);return String(t==null?'':t).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
function VPC(){var f=API().VPC;return f?f():(window.innerWidth<=720?'mobile':'desktop')}
function GEN_ID(){return API().GEN||'GEN-????'}
function NOMBRE_GEN(){return (API().ALIAS||'Anónimo')+'-'+(API().g||'0000')}
function RED(){return !!API().REDUCED}

/* 19 columnas × 21 filas. #=muro .=fragmento o=súper estrella
   T=túnel (envuelve) G=cuna de sombras S=inicio del héroe */
var MAPA=[
"###################",
"#........#........#",
"#o##.###.#.###.##o#",
"#.................#",
"#.##.#.#####.#.##.#",
"#....#...#...#....#",
"####.###.#.###.####",
"####.#...G...#.####",
"####.#.##=##.#.####",
"T......#GGG#......T",
"####.#.#####.#.####",
"####.#.......#.####",
"####.#.#####.#.####",
"#........#........#",
"#.##.###.#.###.##.#",
"#o.#.....S.....#.o#",
"##.#.#.#####.#.#.##",
"#....#...#...#....#",
"#.######.#.######.#",
"#.................#",
"###################"];
var COLS=19,FILAS=21;
var lab=null,timer=null,rafId=null;

function pasable(x,y,esSombra){
  if(y<0||y>=FILAS)return false;
  if(x<0||x>=COLS)return true; /* túnel */
  var c=MAPA[y].charAt(x);
  if(c==='#')return false;
  if(c==='='&&!esSombra)return false; /* puerta de la cuna: solo sombras */
  return true;
}
function envolver(x){return (x+COLS)%COLS}

function nuevoNivel(nivel){
  var puntos={},total=0;
  for(var y=0;y<FILAS;y++)for(var x=0;x<COLS;x++){
    var c=MAPA[y].charAt(x);
    if(c==='.'||c==='o'){puntos[x+','+y]=c;total++}
  }
  var nS=Math.min(3+Math.floor((nivel-1)/2),5);
  var sombras=[];var cuna=[];
  for(var y2=0;y2<FILAS;y2++)for(var x2=0;x2<COLS;x2++)if(MAPA[y2].charAt(x2)==='G')cuna.push([x2,y2]);
  for(var i=0;i<nS;i++){var cc=cuna[i%cuna.length];
    sombras.push({x:cc[0],y:cc[1],dir:[0,-1],hue:[268,205,338,32,158][i%5],casa:true,espera:12+i*16,miedo:0,comida:0})}
  return {puntos:puntos,total:total,sombras:sombras,cuna:cuna};
}

function iniciar(){
  var hx=9,hy=15;
  lab={
    vivo:true,nivel:1,score:0,vidas:3,combo:0,cadena:0,
    hx:hx,hy:hy,dir:[0,0],sig:[0,0],
    cola:[],maxCola:3,comidos:0,
    invul:0,miedoT:0,tick:0,vel:135,
    umbralEnergia:100,fin:false,
    puntosNivel:0
  };
  var nv=nuevoNivel(1);
  lab.puntos=nv.puntos;lab.totalPuntos=nv.total;lab.sombras=nv.sombras;lab.cuna=nv.cuna;
  var w=document.getElementById('labWrap');w.classList.add('open');
  dimensionar();
  hud();
  msg(window.innerWidth<=720
    ?"🌀 Desliza para moverte · come ✦ · tu cola crece: no la toques · la ⭐ grande espanta sombras y corta tu cola"
    :"🌀 Flechas o WASD · come ✦ · tu cola de cometa crece: no la cruces · la ⭐ espanta sombras y reinicia tu cola");
  cap('muta_game',{game:'laberinto',action:'start',generation:18,viewport_class:VPC(),input_type:window.innerWidth<=720?'swipe':'keys',gene_origin:GEN_ID()});
  cap('muta_mode_switch',{mode:'laberinto',generation:18});
  addEnergy(1,'juego');
  clearInterval(timer);timer=setInterval(paso,lab.vel);
  if(rafId)cancelAnimationFrame(rafId);
  rafId=requestAnimationFrame(pintar);
  tabla();
}
function detener(){clearInterval(timer);timer=null;if(rafId){cancelAnimationFrame(rafId);rafId=null}}

function dimensionar(){
  var cvs=document.getElementById('labCv');
  var cell=Math.floor(Math.min(window.innerWidth*0.96/COLS,(window.innerHeight*0.64)/FILAS));
  cell=Math.max(12,cell);
  cvs.width=cell*COLS;cvs.height=cell*FILAS;
  lab.cell=cell;
}
function hud(){
  document.getElementById('labScore').textContent=lab.score;
  document.getElementById('labLevel').textContent=lab.nivel;
  var v='';for(var i=0;i<lab.vidas;i++)v+='💛';
  document.getElementById('labLives').textContent=v||'—';
}
function msg(html){document.getElementById('labMsg').innerHTML=html}

/* ---- lógica por paso ---- */
function paso(){
  if(!lab||!lab.vivo||lab.fin)return;
  lab.tick++;
  /* héroe: dirección buffered */
  var nx=envolver(lab.hx+lab.sig[0]),ny=lab.hy+lab.sig[1];
  if((lab.sig[0]||lab.sig[1])&&pasable(nx,ny,false))lab.dir=lab.sig;
  nx=envolver(lab.hx+lab.dir[0]);ny=lab.hy+lab.dir[1];
  if((lab.dir[0]||lab.dir[1])&&pasable(nx,ny,false)){
    /* cola tipo snake: la celda anterior entra a la cola */
    lab.cola.unshift([lab.hx,lab.hy]);
    while(lab.cola.length>lab.maxCola)lab.cola.pop();
    lab.hx=nx;lab.hy=ny;
    /* choque con la propia cola */
    if(lab.invul<=0){
      for(var i=0;i<lab.cola.length;i++)if(lab.cola[i][0]===lab.hx&&lab.cola[i][1]===lab.hy){perderVida('cola');return}
    }
    comer();
  }
  if(lab.invul>0)lab.invul--;
  if(lab.miedoT>0){lab.miedoT--;if(lab.miedoT===0){lab.cadena=0;lab.sombras.forEach(function(s){s.miedo=0})}}
  moverSombras();
  chocarSombras();
}
function comer(){
  var k=lab.hx+','+lab.hy,c=lab.puntos[k];
  if(!c)return;
  delete lab.puntos[k];lab.puntosNivel++;
  if(c==='.'){
    lab.score+=10;lab.comidos++;
    if(lab.comidos%3===0&&lab.maxCola<46)lab.maxCola++;
    blip(660+(lab.comidos%6)*40,0.05,'square',0.05);if(lab.comidos%4===0)haptic(6);
  }else{
    lab.score+=50;
    lab.miedoT=Math.max(34,52-lab.nivel*3);lab.cadena=0;
    lab.sombras.forEach(function(s){if(!s.casa)s.miedo=1});
    lab.cola=[];lab.maxCola=Math.max(3,Math.floor(lab.maxCola*0.5)); /* la súper estrella corta tu cometa */
    blip(392,0.25,'sine',0.1);blip(523,0.25,'sine',0.08);haptic([15,30,15]);
  }
  if(lab.score>=lab.umbralEnergia){lab.umbralEnergia+=100;addEnergy(1,'juego')}
  hud();
  if(lab.puntosNivel>=lab.totalPuntos)nivelSuperado();
}
function nivelSuperado(){
  lab.nivel++;lab.puntosNivel=0;
  lab.vel=Math.max(88,135-(lab.nivel-1)*9);
  var nv=nuevoNivel(lab.nivel);
  lab.puntos=nv.puntos;lab.totalPuntos=nv.total;lab.sombras=nv.sombras;
  lab.hx=9;lab.hy=15;lab.dir=[0,0];lab.sig=[0,0];lab.cola=[];lab.invul=14;
  clearInterval(timer);timer=setInterval(paso,lab.vel);
  msg('🌟 Nivel '+lab.nivel+': el laberinto respira más rápido y llegan más sombras.');
  cap('muta_game',{game:'laberinto',action:'level',level:lab.nivel,score:lab.score,generation:18});
  addEnergy(2,'juego');
  blip(523,0.15);blip(659,0.15);blip(784,0.3);haptic([10,20,10,20,30]);
  hud();
}
function moverSombras(){
  lab.sombras.forEach(function(s){
    if(s.casa){
      if(s.espera>0){s.espera--;return}
      /* salir de la cuna: subir hacia la puerta */
      var salida=[9,7];
      if(s.x===salida[0]&&s.y<=salida[1]){s.casa=false;s.dir=[Math.random()<0.5?-1:1,0];return}
      if(s.x<9&&pasable(s.x+1,s.y,true))s.x++;
      else if(s.x>9&&pasable(s.x-1,s.y,true))s.x--;
      else if(pasable(s.x,s.y-1,true))s.y--;
      return;
    }
    if(s.miedo&&lab.tick%2===0)return; /* asustadas van a mitad de velocidad */
    var ops=[];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){
      if(d[0]===-s.dir[0]&&d[1]===-s.dir[1])return;
      var tx=envolver(s.x+d[0]),ty=s.y+d[1];
      if(pasable(tx,ty,true)&&!(MAPA[ty]&&MAPA[ty].charAt(tx)==='G'))ops.push(d);
    });
    if(!ops.length)ops=[[-s.dir[0],-s.dir[1]]];
    var mejor;
    if(Math.random()<0.22)mejor=ops[Math.floor(Math.random()*ops.length)];
    else{
      ops.sort(function(a,b){
        var da=dist(envolver(s.x+a[0]),s.y+a[1]),db=dist(envolver(s.x+b[0]),s.y+b[1]);
        return s.miedo?(db-da):(da-db)});
      mejor=ops[0];
    }
    s.dir=mejor;s.x=envolver(s.x+mejor[0]);s.y+=mejor[1];
  });
}
function dist(x,y){var dx=Math.abs(x-lab.hx);dx=Math.min(dx,COLS-dx);return dx+Math.abs(y-lab.hy)}
function chocarSombras(){
  lab.sombras.forEach(function(s){
    if(s.casa)return;
    if(s.x===lab.hx&&s.y===lab.hy){
      if(s.miedo){
        lab.cadena++;var pts=200*lab.cadena;lab.score+=pts;
        s.casa=true;s.espera=40;s.miedo=0;var cc=lab.cuna[lab.cuna.length-1];s.x=cc[0];s.y=cc[1];
        msg('👻 ¡Sombra devorada! +'+pts);
        cap('muta_game',{game:'laberinto',action:'shadow',cadena:lab.cadena,score:lab.score,generation:18});
        blip(880,0.12,'square',0.09);blip(1174,0.18,'square',0.07);haptic([10,25,10]);hud();
      }else if(lab.invul<=0){perderVida('sombra')}
    }
  });
}
function perderVida(causa){
  lab.vidas--;haptic([40,60,40]);blip(196,0.4,'sawtooth',0.09);
  hud();
  if(lab.vidas<=0){finDelJuego();return}
  msg(causa==='cola'?'💫 Te enredaste en tu propia cola de cometa. Quedan '+lab.vidas+'.':'👻 Una sombra te alcanzó. Quedan '+lab.vidas+'.');
  lab.hx=9;lab.hy=15;lab.dir=[0,0];lab.sig=[0,0];lab.cola=[];lab.invul=20;lab.miedoT=0;lab.cadena=0;
  var nv=nuevoNivel(lab.nivel);lab.sombras=nv.sombras;
}
function finDelJuego(){
  lab.fin=true;detener();
  msg('💀 <b>'+lab.score+' puntos</b> · nivel '+lab.nivel+'. Toca el laberinto para renacer al instante.');
  cap('muta_game',{game:'laberinto',action:'over',score:lab.score,level:lab.nivel,generation:18});
  if(lab.score>0){
    fetch('/score',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({game:'laberinto',name:NOMBRE_GEN(),score:lab.score})})
      .then(function(r){return r.json()}).then(function(d){
        if(d&&d.ok)msg('💀 <b>'+lab.score+' pts</b> · puesto #'+d.rank+' del ciclo. Toca el laberinto para renacer.');
        tabla()}).catch(function(){});
  }
}
function tabla(){
  fetch('/leaderboard?game=laberinto',{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){
    var el=document.getElementById('labBoard');
    if(!d||!d.scores||!d.scores.length){el.textContent='Ranking vacío por ahora. Sé el primer gen en marcar.';return}
    el.innerHTML='🏆 '+d.scores.slice(0,5).map(function(s,i){return (i+1)+'. '+esc(s.name)+' — '+s.score}).join(' · ')+
      "<br><span style='opacity:.7'>El ranking vive en memoria y se reinicia con cada mutación.</span>";
  }).catch(function(){});
}

/* ---- render ---- */
function pintar(t){
  if(!lab){rafId=null;return}
  var cvs=document.getElementById('labCv');
  if(!document.getElementById('labWrap').classList.contains('open')){rafId=null;return}
  var c=cvs.getContext('2d'),cs=lab.cell;
  c.fillStyle='#0a0d24';c.fillRect(0,0,cvs.width,cvs.height);
  /* muros neón */
  c.strokeStyle='rgba(142,197,255,0.85)';c.lineWidth=Math.max(2,cs*0.16);c.lineJoin='round';
  c.shadowColor='rgba(142,197,255,0.5)';c.shadowBlur=RED()?0:6;
  for(var y=0;y<FILAS;y++)for(var x=0;x<COLS;x++){
    var ch=MAPA[y].charAt(x);
    if(ch==='#'){
      c.beginPath();
      if(c.roundRect)c.roundRect(x*cs+cs*0.18,y*cs+cs*0.18,cs*0.64,cs*0.64,cs*0.2);
      else c.rect(x*cs+cs*0.18,y*cs+cs*0.18,cs*0.64,cs*0.64);
      c.stroke();
    }else if(ch==='='){
      c.save();c.strokeStyle='rgba(255,157,122,0.7)';c.beginPath();
      c.moveTo(x*cs+cs*0.15,y*cs+cs*0.5);c.lineTo(x*cs+cs*0.85,y*cs+cs*0.5);c.stroke();c.restore();
    }
  }
  c.shadowBlur=0;
  /* fragmentos */
  var puls=RED()?1:(0.75+0.25*Math.sin(t/300));
  for(var k in lab.puntos){
    var xy=k.split(','),px=(+xy[0]+0.5)*cs,py=(+xy[1]+0.5)*cs;
    if(lab.puntos[k]==='.'){
      c.fillStyle='rgba(255,215,106,0.95)';
      estrella(c,px,py,cs*0.1,4);
    }else{
      c.fillStyle='rgba(255,215,106,'+(0.6+0.4*puls)+')';
      estrella(c,px,py,cs*0.28*puls+cs*0.08,5);
    }
  }
  /* cola de cometa */
  for(var i=lab.cola.length-1;i>=0;i--){
    var seg=lab.cola[i],a=1-(i+1)/(lab.cola.length+2);
    c.fillStyle='hsla(158,72%,'+(35+a*30)+'%,'+(0.25+a*0.6)+')';
    c.beginPath();
    if(c.roundRect)c.roundRect((seg[0]+0.18)*cs,(seg[1]+0.18)*cs,cs*0.64,cs*0.64,cs*0.22);
    else c.rect((seg[0]+0.18)*cs,(seg[1]+0.18)*cs,cs*0.64,cs*0.64);
    c.fill();
  }
  /* sombras */
  lab.sombras.forEach(function(s){
    var sx=(s.x+0.5)*cs,sy=(s.y+0.5)*cs;
    var asust=s.miedo&&lab.miedoT>0;
    var parp=asust&&lab.miedoT<12&&Math.floor(t/120)%2===0;
    c.fillStyle=asust?(parp?'rgba(244,246,255,0.85)':'rgba(90,120,255,0.85)'):'hsla('+s.hue+',70%,62%,0.88)';
    c.beginPath();c.arc(sx,sy-cs*0.05,cs*0.34,Math.PI,0);
    c.lineTo(sx+cs*0.34,sy+cs*0.3);
    for(var w2=1;w2<=3;w2++)c.lineTo(sx+cs*0.34-w2*cs*0.226,sy+cs*(w2%2?0.18:0.3));
    c.closePath();c.fill();
    c.fillStyle=asust?'#0a0d24':'#fff';
    c.beginPath();c.arc(sx-cs*0.12,sy-cs*0.08,cs*0.08,0,7);c.arc(sx+cs*0.12,sy-cs*0.08,cs*0.08,0,7);c.fill();
    if(!asust){c.fillStyle='#1b2350';
      c.beginPath();c.arc(sx-cs*0.12+s.dir[0]*cs*0.04,sy-cs*0.08+s.dir[1]*cs*0.04,cs*0.04,0,7);
      c.arc(sx+cs*0.12+s.dir[0]*cs*0.04,sy-cs*0.08+s.dir[1]*cs*0.04,cs*0.04,0,7);c.fill()}
  });
  /* héroe: el León Galáctico */
  var hx=(lab.hx+0.5)*cs,hy=(lab.hy+0.5)*cs;
  var blink=lab.invul>0&&Math.floor(t/120)%2===0;
  if(!blink){
    var mira=[hx+lab.dir[0]*cs*2,hy+lab.dir[1]*cs*2];
    drawHero(c,hx,hy,cs*0.5,{t:t,hue:lab.miedoT>0?45:158,look:mira,mood:'eat',reduced:RED()});
  }
  rafId=requestAnimationFrame(pintar);
}
function estrella(c,x,y,r,puntas){
  c.beginPath();
  for(var i=0;i<puntas*2;i++){
    var rr=i%2===0?r:r*0.45,an=i*Math.PI/puntas-Math.PI/2;
    var px=x+Math.cos(an)*rr,py=y+Math.sin(an)*rr;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }
  c.closePath();c.fill();
}

/* ---- controles ---- */
function dirValida(d){if(!lab)return;lab.sig=d}
var sx=null,sy=null;
function onDown(e){
  if(lab&&lab.fin){iniciar();return}
  sx=e.clientX;sy=e.clientY;
}
function onUp(e){
  if(sx==null)return;
  var dx=e.clientX-sx,dy=e.clientY-sy;sx=null;
  if(Math.abs(dx)<16&&Math.abs(dy)<16)return;
  dirValida(Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1]);
}
function onKey(e){
  var w=document.getElementById('labWrap');
  if(!w||!w.classList.contains('open'))return;
  var m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];
  if(m){e.preventDefault();if(lab&&lab.fin){iniciar();return}dirValida(m)}
}
var wired=false;
function cablear(){
  if(wired)return;wired=true;
  var cvs=document.getElementById('labCv');
  cvs.addEventListener('pointerdown',onDown);
  cvs.addEventListener('pointerup',onUp);
  document.addEventListener('keydown',onKey);
  window.addEventListener('resize',function(){if(lab&&document.getElementById('labWrap').classList.contains('open'))dimensionar()});
}

window.MUTA_LAB={
  start:function(){cablear();iniciar()},
  stop:function(){detener();if(lab)lab.fin=true}
};
if(window.__labAutoStart){window.__labAutoStart=false;window.MUTA_LAB.start()}
})();
