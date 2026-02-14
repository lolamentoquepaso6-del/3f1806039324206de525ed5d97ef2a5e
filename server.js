import http from "http"
import axios from "axios"
import { addonBuilder, serveHTTP } from "stremio-addon-sdk"

const PORT = process.env.PORT || 7000

console.log("UNIFIED ADDON STARTING...")

const SOURCES = [
  "https://torrentio.strem.fun/language=latino,spanish/manifest.json",
  "https://1fe84bc728af-stremio-anime-catalogs.baby-beamup.club/manifest.json",
  "https://848b3516657c-argentinatv.baby-beamup.club/manifest.json",
  "https://cinecalidad-stremio-addon.fly.dev/manifest.json"
]

const manifest = {
  id: "org.unified.clean",
  version: "1.0.0",
  name: "Unified Clean Media",
  description: "Addon unificado: Peliculas | Series | Anime | TV",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt"]
}

const builder = new addonBuilder(manifest)

builder.defineStreamHandler(async ({ type, id }) => {
  const streams = []
  const seen = new Set()

  await Promise.all(
    SOURCES.map(async (source) => {
      try {
        const base = source.replace("/manifest.json", "")
        const url = `${base}/stream/${type}/${id}.json`
        const res = await axios.get(url, { timeout: 5000 })

        if (res.data?.streams) {
          for (const s of res.data.streams) {
            if (s.url && !seen.has(s.url)) {
              seen.add(s.url)
              streams.push(s)
            }
          }
        }
      } catch (e) {}
    })
  )

  return { streams }
})

const addonInterface = builder.getInterface()

http.createServer((req, res) => {
  serveHTTP(addonInterface, req, res)
}).listen(PORT, () => {
  console.log("Unified addon running on port " + PORT)
})
