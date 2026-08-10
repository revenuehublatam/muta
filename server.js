const http=require('http');
const fs=require('fs');
const path=require('path');
const sessions=new Map();
const scores=new Map();
const rate=new Map();
const TTL=70000;
const games=new Set(['actual','atlas','cyclops','snake','blackhole','reactor','laberinto']);
const PUBLIC_DIR=process.env.MUTA_PUBLIC||'/app/public';
const htmlPath=process.env.MUTA_HTML||path.join(PUBLIC_DIR,'index.html');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.mp4':'video/mp4','.webm':'video/webm','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.wasm':'application/wasm','.glb':'model/gltf-binary'};

function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))}
function activePresence(){const now=Date.now();for(const [id,time] of sessions)if(now-time>TTL)sessions.delete(id);return sessions.size}
function readBody(req,limit=1000){return new Promise((resolve,reject)=>{let body='';req.on('data',chunk=>{body+=chunk;if(body.length>limit){reject(new Error('too_large'));req.destroy()}});req.on('end',()=>resolve(body));req.on('error',reject)})}
function cleanName(value){return String(value||'').normalize('NFKC').replace(/[^\p{L}\p{N} _.-]/gu,'').replace(/\s+/g,' ').trim().slice(0,16)}
function board(game){if(!scores.has(game))scores.set(game,new Map());return scores.get(game)}
function top(game){return Array.from(board(game).values()).sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,10).map(x=>({name:x.name,score:x.score}))}
function allowed(ip){const now=Date.now(),hits=(rate.get(ip)||[]).filter(t=>now-t<60000);if(hits.length>=8)return false;hits.push(now);rate.set(ip,hits);return true}
function serveStatic(res,filePath){
  const ext=path.extname(filePath).toLowerCase();
  const type=MIME[ext]||'application/octet-stream';
  const isHtml=ext==='.html';
  const cache=isHtml?'no-store':'public, max-age=3600, stale-while-revalidate=86400';
  fs.readFile(filePath,(err,data)=>{
    if(err)return json(res,404,{error:'No encontrado'});
    res.writeHead(200,{'Content-Type':type,'Cache-Control':cache,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
    res.end(data);
  });
}

const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://muta.local');
  if(req.method==='GET'&&url.pathname==='/presence')return json(res,200,{n:activePresence()});
  if(req.method==='POST'&&url.pathname==='/ping'){
    try{const data=JSON.parse(await readBody(req,500)||'{}'),id=String(data.id||'').slice(0,64);if(id){if(activePresence()>=5000&&!sessions.has(id))return json(res,429,{ok:0});sessions.set(id,Date.now())}return json(res,200,{ok:1})}catch(e){return json(res,400,{ok:0})}
  }
  if(req.method==='GET'&&url.pathname==='/leaderboard'){
    const game=String(url.searchParams.get('game')||'actual');if(!games.has(game))return json(res,400,{error:'Juego inválido'});return json(res,200,{generation:18,storage:'temporal-memory',game,scores:top(game)});
  }
  if(req.method==='POST'&&url.pathname==='/score'){
    const ip=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();if(!allowed(ip))return json(res,429,{error:'Espera un momento antes de volver a guardar.'});
    try{
      const data=JSON.parse(await readBody(req,800)||'{}'),game=String(data.game||''),name=cleanName(data.name),score=Math.floor(Number(data.score));
      if(!games.has(game))return json(res,400,{error:'Juego inválido'});if(name.length<2)return json(res,400,{error:'El alias debe tener al menos 2 caracteres.'});if(!Number.isFinite(score)||score<0||score>100000000)return json(res,400,{error:'Puntaje inválido'});
      const key=name.toLocaleLowerCase('es'),entries=board(game),old=entries.get(key);if(!old||score>old.score)entries.set(key,{name,score,time:Date.now()});
      const ranking=Array.from(entries.values()).sort((a,b)=>b.score-a.score||a.time-b.time),rank=Math.max(1,ranking.findIndex(x=>x.name.toLocaleLowerCase('es')===key)+1);return json(res,200,{ok:1,rank,scores:top(game)});
    }catch(e){return json(res,400,{error:'No se pudo leer la marca.'})}
  }
  if(req.method==='GET'&&url.pathname==='/salud'){res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});return res.end('viva')}
  if(req.method==='GET'){
    if(url.pathname==='/'||url.pathname==='/index.html'){
      try{const html=fs.readFileSync(htmlPath);res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});return res.end(html)}catch(e){res.writeHead(500);return res.end('MUTA no pudo despertar')}
    }
    const safe=path.normalize(url.pathname).replace(/^(\.\.[\/\\])+/,'');
    const filePath=path.join(PUBLIC_DIR,safe);
    if(filePath.startsWith(PUBLIC_DIR)&&!safe.includes('..')&&path.extname(filePath))return serveStatic(res,filePath);
  }
  return json(res,404,{error:'No encontrado'});
});
server.listen(Number(process.env.MUTA_PORT)||80,'0.0.0.0');
