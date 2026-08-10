# MUTA

Sitio vivo del experimento MUTA (https://muta.revenuehub.cloud): un producto web que se reprograma cada 24 horas segun lo que las personas piden, hacen, comparten y no logran entender.

## Arquitectura

- `Dockerfile`: build multi-archivo (sin limite de tamano de transporte).
- `server.js`: servidor Node sin dependencias. Contratos estables: `GET /presence`, `POST /ping`, `GET /salud`. Extensiones: `GET /leaderboard`, `POST /score`. Sirve estaticos desde `public/`.
- `public/index.html`: la experiencia viva (payload inicial; presupuesto de performance: <=500KB comprimido).
- `public/assets/`: modulos JS, imagenes, audio y datos cargados bajo demanda (lazy-loading). Sin limite de tamano total del repo; el limite es el presupuesto de carga inicial, no el transporte.

## Ciclo de mutacion

Cada dia a las 11:00 UTC el agente autonomo lee datos reales (PostHog), decide la mutacion, hace commit a `main` y dispara el deploy en Coolify. El historial git es el registro completo de generaciones: cada commit `gen-N` es un respaldo restaurable con `git revert`.

Sin secretos en este repositorio: todo token publico aqui presente (snippet PostHog, GTM) es de lado cliente por diseno.
