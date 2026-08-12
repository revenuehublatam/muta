# -*- coding: utf-8 -*-
# MUTA gen-21 parte C — reconstruye muta-state. Ejecutar DESPUÉS de gen21_edits.py y gen21_edits_b.py.
import re, json, hashlib

p = 'public/index.html'
h = open(p, encoding='utf-8').read()
m = re.search(r'<script type="application/json" id="muta-state">(.*?)</script>', h, re.S)
st = json.loads(m.group(1))
assert st['generation'] == 20

st['generation'] = 21
st['born_utc'] = '2026-08-12T13:20:00Z'
st['traits'] = {
 "paleta": "cosmos que obedece a la gente: absurdo, belleza o caos transforman colores, cielo y criaturas de toda la interfaz",
 "conducta": "alimentar ES votar y ahora también ES transformar: 3 dosis del mismo nutriente cambian el mundo entero; la opinión del usuario (estrellas y votos del muro) decide la evolución",
 "forma": "criatura de dos ojos fullscreen en un mundo que muta con los nutrientes; sección EXPERIENCIAS ordenada por uso real con TRANCE (ritmo hipnótico con música generativa) arriba; El Cielo Total de Santiago sigue vivo"
}
for nueva in ["nutrientes-transforman-toda-la-interfaz","temas-absurdo-belleza-caos-con-entidades-propias",
              "rating-5-estrellas-de-interfaz","identidad-nombre-opcional-con-saludo",
              "experiencias-ordenadas-por-uso-real-medido","trance-ritmo-hipnotico-musica-generativa",
              "motor-musica-webaudio-por-experiencia","suscriptores-visibles-honestos","muro-reencuadrado-a-votacion"]:
    if nueva not in st['mecanicas']:
        st['mecanicas'].append(nueva)

st['stats']['suscriptores'] = 2
st['stats']['nota_gen21'] = "Gen 21 es una mutación dirigida por el creador a las ~13:20 UTC del 12-ago; Gen 20 vivió ~1.5h (El Cielo Total sigue vivo dentro de Gen 21 y su criterio capa_viva se evalúa con la ventana completa de Gen 21)."

st['experimentos'].append({
 "nombre": "la-voz-del-usuario",
 "estado": "ejecutado",
 "generacion": 21,
 "evidencia": "Dirección directa del creador (2026-08-12, sesión en vivo): (1) los nutrientes no producían ningún cambio perceptible de interfaz — 'en mi experiencia no ha cambiado absolutamente nada'; (2) el muro de votación no se ve ni se entiende; (3) los juegos sin orden ni música; (4) falta identidad (nombre) y pertenencia; (5) falta medir la opinión del usuario sobre cada interfaz; (6) mostrar suscriptores del aviso; (7) nueva experiencia de ritmo trance hipnótica con muchos inputs.",
 "problema": "El producto ejecutaba ideas pero no devolvía poder inmediato: alimentar no transformaba nada visible, votar estaba escondido y no había forma de medir qué interfaz le gusta a la gente.",
 "hipotesis": "Si alimentar transforma TODA la experiencia al instante (3 temas con mundos propios), el voto es visible, cada persona puede firmar con su nombre y calificar la interfaz con estrellas, entonces suben interacción, retorno e intriga, y las estrellas revelan qué interfaz gana.",
 "mutacion": "Motor de temas por nutriente (caos: meteoros + sombras que persiguen al león; belleza: aurora + estrellas fugaces; absurdo: colores inestables + objetos absurdos flotando; 3 niveles de profundidad); rating 5 estrellas una vez por generación (muta_ui_rating); muro → VOTA IDEAS en el dock con nudge a los 30s; sección EXPERIENCIAS ordenada por interacciones reales con contadores visibles; TRANCE: ritmo hipnótico 118bpm con música generativa WebAudio, sin muerte, ranking y estado de trance; música generativa propia para las 7 experiencias del archivo; nombre opcional en la carta de gen que firma rankings y saluda al volver; suscriptores del aviso visibles (2 reales).",
 "criterio_exito": {
  "metrica": "voz_usuario",
  "definicion": "promedio de muta_ui_rating.stars de la ventana (principal) y % de visitantes únicos que activan al menos un tema (muta_mood accion=activa); secundarias: apoyos del muro por visitante, starts de trance (muta_game game=trance action=start), % con nombre guardado (muta_identity)",
  "umbral_mantener": 3,
  "umbral_profundizar": 4,
  "ventana_horas": 24}
})

st['genes_acreditados'].append({"idea": "Que alimentar transforme toda la interfaz + votación visible + estrellas + nombre + TRANCE + música + orden por popularidad", "gen": "el creador (dirección de producto, 2026-08-12)", "parte": "toda la Gen 21: motor de temas, rating, VOTA IDEAS, EXPERIENCIAS ordenadas, TRANCE y música generativa"})

st['bucle_viral'] = {"generacion": 21, "tipo": "transformacion-compartible", "descripcion": "tu nutriente transforma MUTA entera y eso es lo que se comparte: el share describe el poder de cambiar la interfaz + TRANCE; fuegos y huevo extra al compartir panoramas siguen vivos", "metricas": "muta_share + muta_mood accion=activa + muta_ui_rating"}

st['aprendizajes'].extend([
 {"gen": 21, "texto": "El creador probó los nutrientes y no percibió ningún cambio: la mecánica central prometía transformación y entregaba partículas → ahora 3 dosis del mismo nutriente transforman el mundo entero (tema, entidades, conducta del león)."},
 {"gen": 21, "texto": "El muro con tracción histórica (24 apoyos de 15 personas) estaba escondido detrás de la palabra 'Muro' → se renombra VOTA IDEAS en el dock, con nudge a los 30s; votar es el corazón del experimento, no una sección."},
 {"gen": 21, "texto": "Los juegos se listaban por antigüedad: ahora EXPERIENCIAS se ordena por uso real medido (Guardián 738 y Devorador 738 interacciones arriba; lo nuevo siempre primero) con contadores visibles como prueba social."},
 {"gen": 21, "texto": "muta_ui_rating (5 estrellas, 1 vez por gen y por tema activo) es desde hoy la métrica norte de interfaz: cada generación compite por estrellas, no por la intuición del agente."},
 {"gen": 21, "texto": "Gen 20 vivió solo ~1.5h por esta mutación dirigida: su criterio capa_viva se evalúa con la ventana de Gen 21, donde el Cielo Total sigue accesible."}
])

st['bitacora'].append({
 "generacion": 21,
 "resumen": "La Voz del Usuario: mutación dirigida por el creador en sesión en vivo. Alimentar ahora transforma TODA la interfaz (caos: meteoros y sombras que cazan al león; belleza: aurora y estrellas fugaces; absurdo: colores inestables y objetos imposibles), con 3 niveles de profundidad y un rating de 5 estrellas que convierte la opinión del usuario en la métrica norte. El muro pasa al frente como VOTA IDEAS, las EXPERIENCIAS se ordenan por uso real medido y nace TRANCE: un ritmo hipnótico con música trance generada en vivo, muchos toques y cero muerte. Cada experiencia del archivo suena con música generativa propia y la gente puede firmar con su nombre."
})

st['preguntas_ciclo'] = {
 "1_entraron": "Ventana Gen 20 abreviada (~1.5h) por mutación dirigida del creador; los datos de la ventana Gen 19 (21 visitantes, 95% activación, 12 retornantes) siguen siendo la última medición completa.",
 "2_pidieron": "El creador, con feedback de primera mano como usuario: los nutrientes no cambiaban nada perceptible, el voto estaba escondido, faltaba música, identidad, orden por popularidad, suscriptores visibles y una experiencia de ritmo trance.",
 "3_que_es": "Un organismo que ahora devuelve poder inmediato: alimentar transforma el mundo entero, votar es visible, y la opinión (estrellas) decide qué interfaz sobrevive.",
 "4_necesidad": "Agencia y pertenencia: la gente necesita VER su efecto al instante (transformación), SER alguien dentro del producto (nombre) y DECIDIR de verdad (voto + estrellas).",
 "5_forma": "Producto inmersivo con motor de temas + capa de opinión (rating) + sección EXPERIENCIAS meritocrática + TRANCE como experiencia insignia nueva.",
 "6_por_que_volver": "Cada día una interfaz puede ganar o morir según las estrellas; tu voto se construye mañana; tu nombre firma rankings; TRANCE y las experiencias dan energía al huevo diario.",
 "7_credito": "La dirección del creador queda acreditada en muta-state; los genes históricos conservan su crédito en cada experiencia y el muro marca ejecutadas con ✓.",
 "8_senales": "Promedio muta_ui_rating (mantener ≥3, profundizar ≥4), % visitantes con muta_mood activa, apoyos del muro por visitante, starts y dwell de TRANCE, muta_identity, y capa_viva del Cielo (pendiente de Gen 20)."
}

st['nota_para_mi_proxima_version'] = ("CADENCIA DIARIA 11:00 UTC (07:00 Chile invierno). Gen 21 = dirección del creador: LA OPINIÓN DEL USUARIO PRIMERO. "
 "Evalúa voz_usuario: promedio muta_ui_rating (mantener ≥3, profundizar ≥4) + % de visitantes con muta_mood activa + apoyos de muro por visitante + starts de TRANCE. "
 "También evalúa capa_viva de Gen 20 (cielo: muta_weather day + estrellas cumbre) con la ventana de Gen 21, porque Gen 20 vivió ~1.5h. "
 "Reglas nuevas permanentes: (1) cada generación muestra el rating 1 vez por persona (llave muta_rated_gNN) y reporta promedio por tema; itera la interfaz según estrellas y propuestas, puedes A/B randomizar UNA dimensión de interfaz por gen (mood inicial, paleta, protagonista) midiendo rating+dwell por variante, siempre honesto; "
 "(2) el motor de temas por nutriente se profundiza, no se quita: cada tema puede cambiar protagonista y entorno (ej: caos = alguien corriendo de perseguidores) — la transformación es la promesa central; "
 "(3) EXPERIENCIAS se reordena cada ciclo por interacciones reales de PostHog (lo último arriba, contadores visibles actualizados); "
 "(4) toda experiencia nueva nace con música generativa propia (motor MUSIC en index; TRANCE trae la suya); pendiente: pasar música a los módulos lazy si el index crece; "
 "(5) VOTA IDEAS visible en dock + nudge 30s: mide apoyos por visitante; (6) nombre opcional (muta_identity) firma rankings; (7) suscriptores visibles y reales (hoy: 2 email, 0 notif). "
 "Llave de votos: renombra muta_votes_g21 a g22 y muta_rated_g21 a g22. Backlog GEN Rebelde pendiente: RPG por partes y platformer fiestas patrias (septiembre cerca). "
 "El repo es la fuente de verdad; deploy = commit Composio + deploy Coolify. NUNCA vuelvas al Dockerfile embebido.")

new_json = json.dumps(st, ensure_ascii=False, separators=(',', ':'))
h = h[:m.start(1)] + new_json + h[m.end(1):]
open(p, 'w', encoding='utf-8').write(h)
print('OK muta-state gen21, bytes:', len(new_json))
print('index  sha256:', hashlib.sha256(open('public/index.html','rb').read()).hexdigest())
print('server sha256:', hashlib.sha256(open('server.js','rb').read()).hexdigest())
