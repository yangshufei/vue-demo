import 'leaflet/dist/leaflet.css'
import $L from 'leaflet'

const createMap = (divId, options) => {
  const map = $L.map(divId, options)
  return map
}

const createTileLayer = async (map, url, options) => {
  const tileLayer = await $L.tileLayer(url, options)
  tileLayer.addTo(map)
  return tileLayer
}
export default { createMap, createTileLayer }
