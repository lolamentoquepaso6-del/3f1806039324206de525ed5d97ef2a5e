// server.js — AUTOCONTENIDO (no necesita unificado.json externo)
import http from "http"
import axios from "axios"
import { addonBuilder, serveHTTP } from "stremio-addon-sdk"

const PORT = process.env.PORT || 7000
console.log("UNIFIED-FULL EMBEDDED STARTING... (marker v2026-02-14)")

/*
  UNIFICADO embebido (contenido exacto que subiste).
  No se necesita archivo externo.
*/
const UNIFICADO = {
  "id": "org.unificado.stremio.meta",
  "version": "1.0.0",
  "name": "Unificado - Complemento Meta",
  "description": "Contenedor que agrupa y organiza todos los addons de tu export en un solo manifest. Campo custom 'sub_addons' contiene las entradas originales agrupadas por sección.",
  "resources": ["catalog", "meta", "stream", "subtitles"],
  "types": ["movie", "series", "channel"],
  "catalogs": [
    {"type": "movie", "id": "peliculas", "name": "Películas y Series (unificado)"},
    {"type": "channel", "id": "tv", "name": "TV e IPTV (unificado)"},
    {"type": "movie", "id": "anime", "name": "Anime (unificado)"},
    {"type": "subtitles", "id": "subtitles", "name": "Subtítulos (unificado)"}
  ],
  "contactEmail": "devnull@example.local",
  "icon": "https://www.strem.io/img/logo/favicon-32x32.png",
  "sub_addons": {
    "PELICULAS_Y_SERIES": [
      {"name":"Cinemeta","manifest":"https://v3-cinemeta.strem.io/manifest.json"},
      {"name":"WatchHub","manifest":"https://watchhub.strem.io/manifest.json"},
      {"name":"Public Domain Movies","manifest":"https://caching.stremio.net/publicdomainmovies.now.sh/manifest.json"},
      {"name":"Archive.org","manifest":"https://dev.nebulawp.org/stremio/archive.org-addon/manifest.json"},
      {"name":"Streaming Catalogs (netflix-like)","manifest":"https://7a82163c306e-stremio-netflix-catalog-addon.baby-beamup.club/bmZ4LGRucCxhbXAsaGJtLHBtcCxwY3AsaGx1LG1nbCxjdHMsbmZrLGF0cCxoYXksY2x2LGdvcCxqaHMsdmlsLG5seix6ZWUsc3R6LGRwZSxzb255bGl2LHZpayxjcGQsaXR2LHNoZCxhY3QsYmJvLHNnbyxiYmMsYWw0LGNyYyxpcWksc2hhLHNzdCxtcDksY3J1Ojo6MTc3MTAzMTM4NTI2NzowOjA6/manifest.json"},
      {"name":"Películas de Cinecalidad","manifest":"https://cinecalidad-stremio-addon.fly.dev/manifest.json"},
      {"name":"Cine Español","manifest":"https://cine-espanol-addon.recurso.workers.dev/manifest.json"},
      {"name":"MUVIBLOX / Dosports","manifest":"https://dosports.vercel.app/manifest.json"},
      {"name":"StreamViX (catálogos mixtos)","manifest":"https://prisonmike.streamvix/.../manifest.json"},
      {"name":"MediaFusion (agregador)","manifest":"https://mediafusion.elfhosted.com/.../manifest.json"},
      {"name":"AIOStreams (agregador)","manifest":"https://aiostreams.fortheweak.cloud/stremio/8dbecbaf-0781-462d-87f0-505ce0e7e5e6/eyJpIjoic3M2MHB5Y3JlQVZMTitJRDNudE5idz09IiwiZSI6IkNqaEpUd2JtWDVLSWsyOVEvaGFZcHJNT1dhYUFLWnNHcGNzOWlaa2lJam89IiwidCI6ImEifQ/manifest.json"}
    ],
    "SUBTITULOS": [
      {"name":"OpenSubtitles v3","manifest":"https://opensubtitles-v3.strem.io/manifest.json"},
      {"name":"OpenSubtitles v1","manifest":"https://opensubtitles.strem.io/stremio/v1"},
      {"name":"OpenSubtitles PRO (alternativo)","manifest":"https://opensubtitlesv3-pro.dexter21767.com/eyJsYW5ncyI6WyJzcGFuaXNoLWxhIiwic3BhbmlzaCIsInNwYW5pc2gtZXUiXSwic291cmNlIjoiYWxsIiwiYWlUcmFuc2xhdGVkIjp0cnVlLCJhdXRvQWRqdXN0bWVudCI6ZmFsc2V9/manifest.json"}
    ],
    "LOCAL": [
      {"name":"Local Files","manifest":"http://127.0.0.1:11470/local-addon/manifest.json"}
    ],
    "TV_IPTV": [
      {"name":"Pluto TV","manifest":"https://dev.nebulawp.org/stremio/pluto-tv-addon/manifest.json"},
      {"name":"Argentina TV (comunidad)","manifest":"https://848b3516657c-argentinatv.baby-beamup.club/manifest.json"},
      {"name":"USA TV (comunidad)","manifest":"https://848b3516657c-usatv.baby-beamup.club/manifest.json"},
      {"name":"M3U/EPG (stiptv entry 1)","manifest":"https://stiptv.ddns.me/eyJ1c2VYdHJlYW0iOnRydWUsInh0cmVhbVVybCI6Imh0dHA6Ly90di5kaWFibG90di5uZXQ6ODA4MCIsInh0cmVhbVVzZXJuYW1lIjoibWlndWVsc2llcnJhMzQiLCJ4dHJlYW1QYXNzd29yZCI6ImhnbURwNTlodjQiLCJlbmFibGVFcGciOnRydWUsImluc3RhbmNlSWQiOiIyZWNlYWQzOS0yMjkyLTQ1MmEtOWU2NS0xMGY4NDIwYjNiOTYifQ==/manifest.json"},
      {"name":"M3U/EPG (stiptv entry 2)","manifest":"https://stiptv.ddns.me/eyJ1c2VYdHJlYW0iOnRydWUsInh0cmVhbVVybCI6Imh0dHBzOi8vcGxwcm8ub3JnIiwieHRyZWFtVXNlcm5hbWUiOiJwIiwieHRyZWFtUGFzc3dvcmQiOiJwIiwiZW5hYmxlRXBnIjp0cnVlLCJpbnN0YW5jZUlkIjoiNjYzOTlkNDctNzc0Ny00YWUwLThjZjUtODFkZjNkYTdiOTkwIn0=/manifest.json"},
      {"name":"TVGardenio","manifest":"https://tvgardenio.hayd.uk/manifest.json"}
    ],
    "ANIME": [
      {"name":"Anime Catalogs","manifest":"https://1fe84bc728af-stremio-anime-catalogs.baby-beamup.club/%7B%22search%22%3A%22on%22%7D/manifest.json"}
    ],
    "OTROS": [
      {"name":"Torrentio (torrents scraper)","manifest":"https://torrentio.strem.fun/language=latino,spanish/manifest.json"},
      {"name":"ThePirateBay+ (comunitario)","manifest":"https://thepiratebay-plus.strem.fun/manifest.json"},
      {"name":"Peerflix","manifest":"https://peerflix.mov/manifest.json"},
      {"name":"StreamViX (streamvix)","manifest":"https://streamvix.hayd.uk/manifest.json"},
      {"name":"MediaFusion (largo)","manifest":"https://mediafusion.elfhosted.com/D-ABAxIJV3Q0jpdp_UNDPM_ctwW6j-J8cBx30Pny6-AmY7xMQHJ9s8Fz0KICj3wXSLFLovm6HPCyAm2vA4IVZ3YI0yvotU1ltCj0cXArxlfYW3mj8I3l_wGjsjCyMJxdkc2hx3udREldiWUKPm3CRyeWQQcdINHWSSTfgJ1GPeZrFfyxfQ1FqJyqsaEYYrp4jrrUJvZQgtmJPntefOGO-duB_irPlzep0CjOTjOzLLf9KXB21J3fGfxjh4s4USWG4C_HuATaufT8sbtDzU0qURzEiL-2g5_VkmKRR2rs3kakM0TXUdmkLwS4kxVKBypBI1-iEvgulBDQikAs9LpkeeWtBQnWbOO9muozh5guUpueXBhj-_cBGVgAOm2vEnAMrLzMdlDjPC1o6UBXzoXBxndA74sBFHBVy0Yfm1Xmq05WnU6UpUrNK-ic8kT_ILYLoi3i2d0igEuLl73gZasln8N7lNOjjcz41OK7i4nXlx8s2rGb8dbO7Vnrikyhpgfidsn6ovYVu_s7lJXYf2jDB2pi8Rm-W8THmsC2IJ6wzeDxKYcXvLDRZGpNI4BKIJAaDJdbnzONmS75spbAFl4RWc7Q/manifest.json"},
      {"name":"stremio-addons.net (catálogo comunitario)","manifest":"https://stremio-addons.net/api/manifest.json"},
      {"name":"Likes / Loved (cuentas)","manifest":"https://likes.stremio.com/addons/loved/movies-shows/user%3D698fbdc9ad327641a67abd74/manifest.json"},
      {"name":"opensubtitles PRO (alternativo)","manifest":"https://opensubtitlesv3-pro.dexter21767.com/eyJsYW5ncyI6WyJzcGFuaXNoLWxhIiwic3BhbmlzaCIsInNwYW5pc2gtZXUiXSwic291cmNlIjoiYWxsIiwiYWlUcmFuc2xhdGVkIjp0cnVlLCJhdXRvQWRqdXN0bWVudCI6ZmFsc2V9/manifest.json"},
      {"name":"yastream (comunitario)","manifest":"https://yastream.tamthai.de/manifest.json"},
      {"name":"dosports (MUVIBLOX)","manifest":"https://dosports.vercel.app/manifest.json"},
      {"name":"cinecalidad (repetido)","manifest":"https://cinecalidad-stremio-addon.fly.dev/manifest.json"},
      {"name":"cine-espanol (repetido)","manifest":"https://cine-espanol-addon.recurso.workers.dev/manifest.json"}
    ]
  }
}

/* ---------------------------
   EXTRACCIÓN DINÁMICA DE FUENTES
   --------------------------- */
function extractSourcesFromUnificado(u) {
  const out = []
  for (const group of Object.values(u.sub_addons || {})) {
    for (const a of group) {
      if (a && a.manifest && !out.includes(a.manifest)) out.push(a.manifest)
    }
  }
  return out
}

/* ---------------------------
   CACHE SIMPLE EN MEMORIA
   --------------------------- */
const CACHE = new Map()
// cache entry: { expiresAt: number (ms), value: any }
function getCached(key) {
  const e = CACHE.get(key)
  if (!e) return null
  if (Date.now() > e.expiresAt) {
    CACHE.delete(key)
    return null
  }
  return e.value
}
function setCached(key, value, ttlSeconds=30) {
  CACHE.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
}

/* ---------------------------
   UTILIDADES HTTP + REQUESTS CONCURRENCY
   --------------------------- */
const axiosInstance = axios.create({ timeout: 6000 })

async function fetchSingle(baseManifestUrl, path) {
  try {
    const base = baseManifestUrl.replace(/\/?manifest\.json$/, "")
    const url = `${base}${path}`
    const res = await axiosInstance.get(url)
    return res.data
  } catch (err) {
    return null
  }
}

// simple concurrency runner
async function fetchAllWithConcurrency(sources, path, concurrency = 6) {
  const results = []
  const pool = []
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i]
    const p = (async () => {
      const data = await fetchSingle(src, path)
      return data
    })()
    pool.push(p)

    if (pool.length >= concurrency) {
      const settled = await Promise.allSettled(pool)
      for (const s of settled) if (s.status === "fulfilled" && s.value) results.push(s.value)
      pool.length = 0
    }
  }
  // remaining
  if (pool.length) {
    const settled = await Promise.allSettled(pool)
    for (const s of settled) if (s.status === "fulfilled" && s.value) results.push(s.value)
  }
  return results
}

/* ---------------------------
   NORMALIZACIÓN Y DEDUPE
   --------------------------- */
function extractArrayFromResponse(resData) {
  if (!resData) return []
  if (Array.isArray(resData)) return resData
  // claves comunes
  if (resData.metas) return resData.metas
  if (resData.meta) return [resData.meta].filter(Boolean)
  if (resData.streams) return resData.streams
  if (resData.subtitles) return resData.subtitles
  if (resData.catalogs) return resData.catalogs
  // fallback: primer campo array
  const keys = Object.keys(resData)
  for (const k of keys) if (Array.isArray(resData[k])) return resData[k]
  return []
}

function dedupeAppend(target, items, seen) {
  for (const it of items) {
    const key = it && it.url ? it.url : JSON.stringify(it)
    if (!seen.has(key)) {
      seen.add(key)
      target.push(it)
    }
  }
}

/* ---------------------------
   PROXY GENÉRICO (usa cache)
   --------------------------- */
function rootKeyForPath(path) {
  if (path.includes("/stream/")) return "streams"
  if (path.includes("/catalog/")) return "metas"
  if (path.includes("/meta/")) return "meta"
  if (path.includes("/subtitles/")) return "subtitles"
  return "result"
}

async function proxyResource(sources, path, options = {}) {
  // options: {cacheTTL}
  const cacheKey = `proxy:${path}`
  const ttl = options.cacheTTL ?? (path.includes("/stream/") ? 15 : 120) // streams = 15s, metas/catalogs = 120s
  const cached = getCached(cacheKey)
  if (cached) return cached

  // fetch all sources with concurrency
  const responses = await fetchAllWithConcurrency(sources, path, options.concurrency ?? 6)

  const merged = []
  const seen = new Set()
  for (const resp of responses) {
    const arr = extractArrayFromResponse(resp)
    dedupeAppend(merged, arr, seen)
  }

  const out = { [rootKeyForPath(path)]: merged }
  setCached(cacheKey, out, ttl)
  return out
}

/* ---------------------------
   MANIFEST Y HANDLERS
   --------------------------- */
const SOURCES = extractSourcesFromUnificado(UNIFICADO)
console.log("Fuentes cargadas (count):", SOURCES.length)

const manifest = {
  id: "org.unificado.proxy.full",
  version: "2.0.0",
  name: "Unificado FULL (Proxy Embebido)",
  description: "Proxy que agrupa todas tus fuentes embebidas (no necesita archivo externo).",
  resources: ["catalog", "meta", "stream", "subtitles"],
  types: ["movie", "series", "channel"],
  catalogs: UNIFICADO.catalogs || [],
  idPrefixes: UNIFICADO.idPrefixes || ["tt"]
}

const builder = new addonBuilder(manifest)

builder.defineStreamHandler(async ({ type, id }) =>
  proxyResource(SOURCES, `/stream/${type}/${id}.json`, { cacheTTL: 20, concurrency: 6 })
)

builder.defineMetaHandler(async ({ type, id }) =>
  proxyResource(SOURCES, `/meta/${type}/${id}.json`, { cacheTTL: 120, concurrency: 6 })
)

builder.defineCatalogHandler(async ({ type, id }) =>
  proxyResource(SOURCES, `/catalog/${type}/${id}.json`, { cacheTTL: 300, concurrency: 4 })
)

builder.defineSubtitlesHandler(async ({ type, id }) =>
  proxyResource(SOURCES, `/subtitles/${type}/${id}.json`, { cacheTTL: 300, concurrency: 6 })
)

/* ---------------------------
   SERVIDOR HTTP NATIVO
   --------------------------- */
const addonInterface = builder.getInterface()

http.createServer((req, res) => {
  if (req.url === "/manifest.json") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(manifest))
    return
  }
  serveHTTP(addonInterface, req, res)
}).listen(PORT, () => {
  console.log("Unified FULL embedded running on port", PORT)
})
