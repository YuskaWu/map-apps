// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev';
import mapboxgl from 'mapbox-gl';
import EventEmitter from 'events';

const ACCESS_TOKEN = 'pk.eyJ1IjoieXVza2EiLCJhIjoiY2s2Y3J5d2hpMWY4aDNucGpwcjJ6M2s4diJ9.mxEvpxy0HrXWkCbhSS7O7g';

/**
 * Predefined Mapbox styles.
 *
 * style's format:
 * mapbox://styles/:owner/:style
 *
 * where :owner is your Mapbox account name and :style is the style ID.
 * for more detail, see official api doc:
 * https://docs.mapbox.com/mapbox-gl-js/api/#map
 */
const MAP_STYLES = {
  'streets-v11': 'mapbox://styles/mapbox/streets-v11',
  'outdoors-v11': 'mapbox://styles/mapbox/outdoors-v11',
  'light-v10': 'mapbox://styles/mapbox/light-v10',
  'dark-v10': 'mapbox://styles/mapbox/dark-v10',
  'satellite-v9': 'mapbox://styles/mapbox/satellite-v9',
  'satellite-streets-v11': 'mapbox://styles/mapbox/satellite-streets-v11',
  'navigation-preview-day-v4': 'mapbox://styles/mapbox/navigation-preview-day-v4',
  'navigation-preview-night-v4': 'mapbox://styles/mapbox/navigation-preview-night-v4',
  'navigation-guidance-day-v4': 'mapbox://styles/mapbox/navigation-guidance-day-v4',
  'navigation-guidance-night-v4': 'mapbox://styles/mapbox/navigation-guidance-night-v4'
};

const defMapOptions = {
  style: MAP_STYLES['streets-v11'],
  // latitude & longitude
  center: {lat: 23.58, lon: 120.9},
  zoom: 6.5
};

mapboxgl.accessToken = ACCESS_TOKEN;

class MapboxMap {
  map = null;
  _event = new EventEmitter();

  constructor() {}

  createMap(container, options = {}) {
    const style = options.style;
    if (style) {
      options.style = MAP_STYLES[style] ?? style;
    }

    const opt = Object.assign({}, defMapOptions, options);
    opt.container = container;

    return new mapboxgl.Map(opt);
  }

  addSources(sources) {
    Object.entries(sources).forEach((entry) => {
      this.map.addSource(entry[0], entry[1]);
    });
  }

  addLayers(layers) {
    layers.forEach((layer) => {
      this.map.addLayer(layer);
    });
  }

  setCenter(latitude, longitude) {
    this.map.setCenter({
      lat: latitude,
      lon: longitude
    });
  }

  static get styles() {
    return {...MAP_STYLES};
  }

  setStyle(styleId, options) {
    // There is a issue about setStyle():
    // After changing map style, all markers and layers on the map will disappear.
    // see https://github.com/mapbox/mapbox-gl-js/issues/8326
    this.map.setStyle(MAP_STYLES[styleId] ?? styleId, options);
  }

  on(eventName, listener) {
    this._event.on(eventName, listener);
  }

  once(eventName, listener) {
    this._event.once(eventName, listener);
  }

  off(eventName, listener) {
    this._event.off(eventName, listener);
  }

  _emit(eventName, ...params) {
    this._event.emit(eventName, ...params);
  }

  destroy() {
    this.map.remove();
  }

  /**
   * The resolved position object is GeolocationPosition, for more detail see the MDN API doc:
   * https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
   *
   * @return {Promise}
   */
  getUserPosition() {
    const promise = new Promise((resolve, reject) => {
      const geolocation = navigator.geolocation;
      if (!geolocation) {
        reject(new Error('Browser does not support Geolocation API.'));
      }

      geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
    });

    return promise;
  }
}

export default MapboxMap;
