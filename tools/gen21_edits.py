# -*- coding: utf-8 -*-
# MUTA gen-21 "La Voz del Usuario" — edits deterministas sobre la base gen-20 (sha d8ed8ec).
# Ejecutar desde la raíz del repo: python3 tools/gen21_edits.py
import re, json, hashlib, sys

FAILS = []
def rep(h, old, new, exp=1):
    n = h.count(old)
    if n != exp:
        FAILS.append(('exp %d got %d' % (exp, n), old[:70]))
        return h
    return h.replace(old, new)

# ============================================================ server.js
s = open('server.js', encoding='utf-8').read()
s = rep(s, "const games=new Set(['actual','atlas','cyclops','snake','blackhole','reactor','laberinto']);",
          "const games=new Set(['actual','atlas','cyclops','snake','blackhole','reactor','laberinto','trance']);")
s = rep(s, "return json(res,200,{generation:20,storage:'temporal-memory',game,scores:top(game)});",
          "return json(res,200,{generation:21,storage:'temporal-memory',game,scores:top(game)});")
open('server.js', 'w', encoding='utf-8').write(s)

# ============================================================ index.html
h = open('public/index.html', encoding='utf-8').read()

# ---------- metas ----------
NEW_TITLE = 'MUTA Gen 21 — El organismo que te escucha'
NEW_DESC = ('Un organismo vivo que evoluciona cada día con lo que la gente pide. Hoy te escucha de verdad: '
            'aliméntalo y toda la experiencia se transforma (absurdo, belleza o caos), vota ideas, ponte un nombre, '
            'califica la interfaz con estrellas y entra en TRANCE, su nuevo ritmo hipnótico con música en vivo.')
h = rep(h, '<title>MUTA Gen 20 — El Cielo Total de Santiago</title>', '<title>' + NEW_TITLE + '</title>')
h = rep(h, 'content="MUTA Gen 20 — El Cielo Total de Santiago"', 'content="' + NEW_TITLE + '"', 2)
h = rep(h, 'Un organismo vivo que evoluciona cada día con lo que la gente pide. Hoy abrió los dos ojos y su cielo se volvió El Cielo Total de Santiago: cultura, clima real de 8 días y cumbres de montaña verificadas. Explora, comparte y decide su próxima forma.',
        NEW_DESC, 3)

# ---------- generación / llaves ----------
h = rep(h, 'if(p.generation==null)p.generation=20;', 'if(p.generation==null)p.generation=21;')
h = rep(h, 'muta_votes_g20', 'muta_votes_g21', 3)
h = rep(h, '<span class="gen">MUTA · GEN 20</span>', '<span class="gen">MUTA · GEN 21</span>')
h = rep(h, 'ctx.fillText("CARTA DE GEN · MUTA GEN 20",w/2,48)', 'ctx.fillText("CARTA DE GEN · MUTA GEN 21",w/2,48)')

# ---------- dock: VOTA IDEAS + EXPERIENCIAS ----------
h = rep(h, '<button class="act" id="btnWall"><span class="e">🏛️</span><span class="n">Muro</span></button>',
          '<button class="act" id="btnWall"><span class="e">🗳️</span><span class="n">Vota ideas</span></button>')
h = rep(h, '<button class="act" id="btnArchive"><span class="e">🎮</span><span class="n">Juegos</span></button>',
          '<button class="act" id="btnArchive"><span class="e">🌟</span><span class="n">Experiencias</span></button>')

# ---------- muro: reencuadre a votación ----------
h = rep(h, '<h2>🏛️ Muro de propuestas</h2>\n    <p class="sub">Ideas reales de personas reales. Apoya las que quieres ver en la próxima mutación. Las marcadas ✓ ya fueron ejecutadas.</p>',
          '<h2>🗳️ Vota la próxima mutación</h2>\n    <p class="sub">Ideas reales de personas reales: <b>un toque = un voto</b>. Lo más votado tiene prioridad en la mutación de mañana a las 7am. Las marcadas ✓ ya fueron ejecutadas — aquí las promesas se cumplen.</p>')
h = rep(h, 'o apoya ideas de otros en el 🏛️ Muro. Todo se evalúa en el próximo ciclo.',
          'o vota ideas de otros en 🗳️ VOTA IDEAS. Todo se evalúa en el próximo ciclo.')

# ---------- sección EXPERIENCIAS (orden: lo último arriba, resto por uso real) ----------
NEW_ARCH = '''    <h2>🌟 Experiencias</h2>
    <p class="sub">Cada experiencia nació de una idea real de alguien y todas dan ⚡ energía a tu huevo estelar. Están ordenadas por uso real: lo más nuevo arriba y el resto según las interacciones medidas de la gente (PostHog, 12-ago). Pide la tuya en 💬.</p>
    <div class="arc">
      <h3>🔮 TRANCE <span class="badge new">nueva hoy</span></h3>
      <p>Un ritmo hipnótico con música trance generada en vivo. Toca al pulso (o usa ESPACIO y las flechas), encadena el flujo y entra en estado de trance. Sin muerte: solo tú, el beat y el ranking.</p>
      <button class="play" id="playTrance">Entrar al trance</button>
    </div>
    <div class="arc">
      <h3>🌌 El Cielo Total de Santiago <span class="badge live">mutación del cielo · 109 interacciones</span></h3>
      <p>La guía real de Santiago que crece con lo que pides: 12 panoramas de arte y cultura (<b>GEN Fractal</b>), el clima real de 8 días con fuente Open-Meteo (<b>GEN Radiante</b>), la constelación LA CUMBRE (<b>GEN Silvestre</b>) y el cometa con el titular en vivo de WestThorn.</p>
      <button class="play" id="playCielo">Abrir el cielo</button>
    </div>
    <div class="arc">
      <h3>👁️ Guardián del Vacío <span class="badge live">738 interacciones</span></h3>
      <p>El ojo de <b>GEN Furtivo</b>, rediseñado: atrapa lo que cae antes de que se pierda en el vacío. Tres vidas, combos y un guardián que crece con cada captura.</p>
      <button class="play" data-arc="cyclops">Custodiar el vacío</button>
    </div>
    <div class="arc">
      <h3>🕳️ Devorador <span class="badge live">738 interacciones</span></h3>
      <p>La idea de <b>GEN Voraz</b>, rediseñada: absorbe materia, crece y desata el frenesí cada 12 capturas, cuando el espacio entero se vuelca hacia ti.</p>
      <button class="play" data-arc="blackhole">Devorar</button>
    </div>
    <div class="arc">
      <h3>🗺️ Atlas Vivo <span class="badge live">424 interacciones</span></h3>
      <p>Nacido de <b>GEN Hipnótico</b> (mapa mundi + radar de vuelos, Gen 10). Un planeta que gira con tus manos: descubre las señales que la comunidad dejó sobre él y apóyalas.</p>
      <button class="play" data-arc="atlas">Explorar el Atlas</button>
    </div>
    <div class="arc">
      <h3>⚛️ Pulso <span class="badge live">228 interacciones</span></h3>
      <p>El reto de ritmo de la Gen 5, ahora con aceleración: cada 5 aciertos el pulso late más rápido. PERFECTO +3, BIEN +1, y el combo es tu música.</p>
      <button class="play" data-arc="reactor">Sentir el pulso</button>
    </div>
    <div class="arc">
      <h3>🛠️ La Máquina Increíble <span class="badge live">203 interacciones</span></h3>
      <p>Lo que <b>GEN Fosforescente</b> pidió de verdad: una versión moderna de The Incredible Machine. Coloca rampas, cintas y trampolines para que la estrella fluya del punto Ⓐ al Ⓑ. 5 niveles verificados.</p>
      <button class="play" id="playMaquina">Construir la máquina</button>
    </div>
    <div class="arc">
      <h3>☄️ Serpiente Estelar <span class="badge live">63 interacciones</span></h3>
      <p>Nacida de <b>GEN Errante</b>. Un cometa vivo que crece comiendo fragmentos de estrella: desliza para dirigirlo, encadena combos, sube de ciclo y deja tu marca en el ranking.</p>
      <button class="play" id="playSnake">Jugar Snake</button>
    </div>
    <div class="arc">
      <h3>🌀 El Laberinto Estelar <span class="badge live">Gen 18 · 24 interacciones</span></h3>
      <p>Nacido de <b>GEN Rebelde</b>: «mezcla el juego de snake con Pac-Man». El León Galáctico come fragmentos de estrella en un laberinto neón, pero su cola de cometa crece y se vuelve su propio obstáculo.</p>
      <button class="play" id="playLab">Entrar al laberinto</button>
    </div>
  </div>
</div>

<!-- ============ SNAKE'''
pat = re.compile(r'    <h2>🎮 Juegos y experiencias</h2>[\s\S]*?\n  </div>\n</div>\n\n<!-- ============ SNAKE')
if len(pat.findall(h)) != 1:
    FAILS.append(('archivo regex', str(len(pat.findall(h)))))
else:
    h = pat.sub(lambda _: NEW_ARCH, h, count=1)

# ---------- otros textos "Juegos" ----------
h = rep(h, 'La energía se junta alimentando al organismo, jugando en 🎮 y proponiendo ideas.',
          'La energía se junta alimentando al organismo, usando las 🌟 Experiencias y proponiendo ideas.')
h = rep(h, '["¿Dónde están los juegos anteriores?","En 🎮 Juegos:',
          '["¿Dónde están las experiencias anteriores?","En 🌟 Experiencias: TRANCE (nueva hoy), El Cielo Total,')
h = rep(h, "say('Al huevo le falta energía: aliméntame, juega en 🎮 o susúrrame una idea. '",
          "say('Al huevo le falta energía: aliméntame, usa una 🌟 experiencia o susúrrame una idea. '")

# ---------- guía: qué cambió hoy ----------
h = rep(h, '''["¿Qué cambió hoy (Gen 20)?","Cuatro ideas de la gente, ejecutadas: el organismo abrió su segundo ojo 👀 (GEN Sigiloso), sopla burbujas al comer 🫧 (GEN Espectral) y su cielo se volvió 🌌 El Cielo Total de Santiago: a la cultura de GEN Fractal se sumó el clima real de 8 días (GEN Radiante, fuente Open-Meteo) y la constelación LA CUMBRE con 4 montañas y escalada reales (GEN Silvestre). Ábrelo con el botón 🌌."],''',
          '''["¿Qué cambió hoy (Gen 21)?","MUTA ahora te escucha de verdad: alimenta al organismo con 3 dosis del mismo nutriente y TODA la experiencia se transforma (🌀 absurdo, ✨ belleza o 🔥 caos, cada uno con su mundo). Nació 🔮 TRANCE, un ritmo hipnótico con música en vivo. El muro ahora es 🗳️ VOTA IDEAS, puedes ponerte un nombre en tu carta de gen, calificar la interfaz con ⭐ estrellas y las Experiencias se ordenan por lo que la gente más usa. El Cielo Total (Gen 20) sigue vivo en 🌌."],''')

# ---------- guía sub ----------
h = rep(h, 'MUTA es un experimento vivo: un producto web que <b>evoluciona cada día a las 7am de Chile</b> según lo que las personas piden, hacen y comparten. Hoy abrió los dos ojos y su cielo es una guía real de Santiago: cultura, clima de 8 días y montañas. Mañana puede ser otra cosa: tú decides.',
          'MUTA es un experimento vivo: un producto web que <b>evoluciona cada día a las 7am de Chile</b> según lo que las personas piden, hacen y comparten. Hoy aprendió a escucharte: tus nutrientes transforman toda su interfaz y tu voto decide la próxima mutación.')

# ---------- THOUGHTS ----------
h = rep(h, '"Hoy abrí mi segundo ojo 👀 (lo pidió GEN Sigiloso) y mi 🌌 cielo ahora también muestra el <b>clima real de Santiago de 8 días</b> y 4 cumbres de montaña verificadas.",',
          '"Aliméntame en serio: con 3 dosis del mismo nutriente <b>toda mi interfaz se transforma</b> — 🌀 absurdo, ✨ belleza o 🔥 caos. Tú decides quién soy hoy.",')
h = rep(h, '"Cuando como, soplo burbujas 🫧 (idea de GEN Espectral): reviéntalas — algunas traen un ⭐ lugar real de Santiago.",',
          '''"Cuando como, soplo burbujas 🫧 (idea de GEN Espectral): reviéntalas — algunas traen un ⭐ lugar real de Santiago.",
 "🔮 <b>TRANCE</b> es mi experiencia más nueva: ritmo hipnótico con música en vivo. Sin muerte, puro flujo. Está arriba en 🌟 Experiencias.",
 "🗳 En <b>VOTA IDEAS</b> hay propuestas reales de otras personas esperando tu voto: lo más votado se construye mañana.",
 "Ponte un nombre en tu 🧬 carta de gen: firmarás los rankings y te saludaré cuando vuelvas 💫",''')

# ---------- aviso a recurrentes ----------
h = rep(h, '''  if(seenG&&seenG<20)setTimeout(function(){say("👀 Mutación de hoy: abrí mi <b>segundo ojo</b> (GEN Sigiloso), soplo burbujas al comer (GEN Espectral) y mi cielo ahora es <b>El Cielo Total de Santiago</b>: clima real de 8 días (GEN Radiante) + montañas y escalada verificadas (GEN Silvestre). Toca el botón 🌌.",11000,true)},2600);
  LS.set("muta_seen_gen","20");''',
          '''  if(seenG&&seenG<21)setTimeout(function(){say("🎛 Mutación de hoy: ahora te escucho de verdad. Aliméntame con 3 dosis del mismo nutriente y <b>toda mi interfaz se transforma</b>. Nació 🔮 <b>TRANCE</b> (ritmo hipnótico con música), el muro ahora es 🗳️ <b>VOTA IDEAS</b> y puedes ponerte nombre y calificarme con ⭐.",11000,true)},2600);
  LS.set("muta_seen_gen","21");''')

# ---------- shareTxt ----------
h = rep(h, 'var shareTxt="Hoy MUTA abrió los dos ojos y su cielo es una guía real de Santiago: panoramas culturales, el clima de los próximos 8 días y montañas para escalar. Es un organismo que evoluciona cada día con lo que la gente pide. Mi gen es "+GEN+". Explora su cielo y decide su próxima forma:";',
          'var shareTxt="MUTA ahora te escucha: aliméntalo y TODA su interfaz se transforma (absurdo, belleza o caos), vota ideas, ponte un nombre y entra en TRANCE, su ritmo hipnótico con música en vivo. Es un organismo que evoluciona cada día con lo que la gente pide. Mi gen es "+GEN+":";')

# ---------- identidad: nombre en la carta de gen ----------
h = rep(h, '<p class="sub">Tu variante única del organismo, generada con tu gen <b id="genFull2"></b> y los nutrientes que le diste hoy. Compártela: si alguien entra con tu enlace, tu gen gana contagio y puede inmortalizarse en el ADN.</p>',
          '''<p class="sub">Tu variante única del organismo, generada con tu gen <b id="genFull2"></b> y los nutrientes que le diste hoy. Compártela: si alguien entra con tu enlace, tu gen gana contagio y puede inmortalizarse en el ADN.</p>
    <div style="display:flex;gap:8px;margin:4px 0 10px"><input id="identName" maxlength="16" placeholder="Tu nombre (opcional)" autocomplete="nickname" style="flex:1;min-width:0"><button class="cta" id="identSave" style="flex:0 0 auto;margin:0;width:auto;padding:10px 14px">Guardar</button></div>
    <p id="identOk" style="display:none;color:var(--brand);font-size:12px;margin:-4px 0 8px">Listo: firmarás los rankings con tu nombre y MUTA te saludará al volver 💫</p>''')

# ---------- PNAME ----------
h = rep(h, 'var ALIAS=(function(){var names=["Errante","Voraz","Sutil","Furtivo","Salvaje","Abisal","Radiante","Hipnótico","Fractal","Insólito","Cuántico","Sigiloso","Efímero","Etéreo","Rebelde","Espectral","Anómalo","Indomable","Magnético","Vibrante","Fosforescente","Galáctico","Eterno","Silvestre"];var n=parseInt(g,16)||0;return names[n%names.length]})();',
          '''var ALIAS=(function(){var names=["Errante","Voraz","Sutil","Furtivo","Salvaje","Abisal","Radiante","Hipnótico","Fractal","Insólito","Cuántico","Sigiloso","Efímero","Etéreo","Rebelde","Espectral","Anómalo","Indomable","Magnético","Vibrante","Fosforescente","Galáctico","Eterno","Silvestre"];var n=parseInt(g,16)||0;return names[n%names.length]})();
function PNAME(){var n=LS.get("muta_name");return (n&&n.length>1)?n:ALIAS}''')
h = rep(h, 'body:JSON.stringify({game:"snake",name:ALIAS+"-"+g,score:snake.score})',
          'body:JSON.stringify({game:"snake",name:PNAME()+"-"+g,score:snake.score})')

# ---------- stats rotativos: suscriptores ----------
h = rep(h, 'var rotate=[["visitantes","personas han influido en MUTA"],["susurros","ideas susurradas"],["genes_vivos","genes viven en el ADN"],["votos","nutrientes entregados"]],ri=0;',
          'var rotate=[["visitantes","personas han influido en MUTA"],["susurros","ideas susurradas"],["suscriptores","personas suscritas al aviso de mutación"],["genes_vivos","genes viven en el ADN"],["votos","nutrientes entregados"]],ri=0;')

# ---------- avisos: contador visible ----------
h = rep(h, '<p>Un aviso por generación como máximo, solo cuando haya una mutación real. Tu correo se usa únicamente para esto y puedes borrarte cuando quieras.</p>',
          '<p>Un aviso por generación como máximo, solo cuando haya una mutación real. Tu correo se usa únicamente para esto y puedes borrarte cuando quieras.</p>\n        <p id="subCount" style="color:var(--brand);font-size:12px"></p>')

open('public/index.html', 'w', encoding='utf-8').write(h)
if FAILS:
    print('FAILS parte A:'); [print(' ', f) for f in FAILS]; sys.exit(1)
print('OK parte A')
