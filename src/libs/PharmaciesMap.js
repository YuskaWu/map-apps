// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-dev';
import MapboxMap from './MapboxMap';
import mapboxgl from 'mapbox-gl';

const PHARMACIE_GEOJSON_API_URL = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR1fBp7vspAUE_1Gaxt5X9je30oCfFTNRf3co_6dOmRf6SJoZ9nBY1Z_lds';
// const PHARMACIE_GEOJSON_API_URL = '/points.json';

// NOTE: The class for pin-marker & cluster-marker was defined in map-marker.styl
const pinMarkerTemplate = `
  <div class="map-pin-marker">
    <svg viewBox="-1 -1 50 74">
      <path d="M24,0 C11.406,0 0,10.209 0,22.806 C0,35.4 10.407,50.436 24,72 C37.593,50.436 48,35.4 48,22.806 C48,10.209 36.597,0 24,0 L24,0 Z M24,33 C19.029,33 15,28.971 15,24 C15,19.029 19.029,15 24,15 C28.971,15 33,19.029 33,24 C33,28.971 28.971,33 24,33 L24,33 Z"></path>
    </svg>
    <div class="shadow"></div>
  </div>
`;

const options = {
  // remove rotat button
  // navigationControl: {showCompass: false},
  navigationControl: {},
  userPositionZoom: 15,
  updateMarkerDelay: 50,
  sources: {
    'pharmacies': {
      type: 'geojson',
      data: PHARMACIE_GEOJSON_API_URL,
      cluster: true,
      clusterMaxZoom: 15, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points
    }
  },

  layers: [
    {
      id: 'unclustered-point',
      type: 'symbol',
      source: 'pharmacies',
      filter: ['!', ['has', 'point_count']]
    },
    // official 3d-buildings example:
    // https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
    {
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    }
  ]
};


class PharmaciesMap extends MapboxMap {
  // objects for caching and keeping track of marker objects
  cacheMarkers = new Map();
  visibleMarkers = new Map();

  constructor() {
    super();
  }

  async create(container, opt) {
    const map = this.createMap(container, opt);
    this.map = map;

    map.addControl(new mapboxgl.NavigationControl(options.navigationControl));
    this.getUserPosition()
        .then((position) => {
          const coords = position.coords;
          // map.setZoom(options.userPositionZoom);
          // map.setCenter({
          //   lat: coords.latitude,
          //   lon: coords.longitude
          // });
          map.easeTo({
            center: [coords.longitude, coords.latitude],
            zoom: options.userPositionZoom
          });
        }).catch((err) => console.warn(err.message));

    map.on('load', () => this._onLoad());

    return map;
  }

  _onLoad() {
    const map = this.map;
    this.addSources(options.sources);
    this.addLayers(options.layers);

    map.on('sourcedataloading', (e) => {
      if (!e.isSourceLoaded) {
        this._emit('sourceDataLoading', e);
      }
    });

    // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
    map.on('data', (e) => {
      if (e.sourceId !== 'pharmacies' || !e.isSourceLoaded) {
        return;
      }

      map.on('move', () => this._updateMarkers('move'));
      map.on('moveend', () => this._updateMarkers('moveend'));
      this._updateMarkers();

      // map.on('move', () => this._updateMarkerInstantly('move'));
      // map.on('moveend', () => this._updateMarkerInstantly('moveend'));
      // this._updateMarkerInstantly();
    });
  }

  _updateMarkers(event) {
    const visibleFeatures = new Set();
    const newFeatures = new Map();
    const features = this.map.querySourceFeatures('pharmacies');
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const props = feature.properties;
      const id = props.cluster_id ?? props.id;

      // filter duplicate features
      visibleFeatures.add(id);

      // if there is a marker created for current feature.
      if (this.visibleMarkers.has(id)) {
        continue;
      }

      newFeatures.set(id, feature);
    }

    const removeIds = [];
    this.visibleMarkers.forEach((value, id, map) => {
      if (!visibleFeatures.has(id)) {
        removeIds.push(id);
      }
    });

    // remove existed markers which is invisible in current map scope.
    removeIds.forEach((id) => {
      this.visibleMarkers.get(id).remove();
      this.visibleMarkers.delete(id);
    });


    clearTimeout(this._updateMarkersTimeout);
    this._updateMarkersTimeout = setTimeout(() => {
      // create markers for new visible features and then add to map.
      newFeatures.forEach((feature, id, map) => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties;

        let marker = this.cacheMarkers.get(id);
        if (!marker) {
          let el;
          if (props.cluster) {
            el = this._createClusterMarkerElement(props, coords);
          } else {
            el = this._createPinMarkerElement(props);
          }
          marker = new mapboxgl.Marker({element: el}).setLngLat(coords);
        }
        marker.addTo(this.map);
        this.visibleMarkers.set(id, marker);
      });
    }, options.updateMarkerDelay);
  }

  _updateMarkerInstantly(event) {
    const newVisibleMarkers = new Map();
    const features = this.map.querySourceFeatures('pharmacies');

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const coords = feature.geometry.coordinates;
      const props = feature.properties;

      const id = props.cluster_id ?? props.id;

      let marker = this.cacheMarkers.get(id);
      if (!marker) {
        let el;
        if (props.cluster) {
          el = this._createClusterMarkerElement(props, coords);
        } else {
          el = this._createPinMarkerElement(feature);
        }
        marker = new mapboxgl.Marker({element: el}).setLngLat(coords);
        this.cacheMarkers.set(id, marker);
      }
      newVisibleMarkers.set(id, marker);

      if (!this.visibleMarkers.has(id)) {
        marker.addTo(this.map);
      }
    }

    this.visibleMarkers.forEach((marker, id, map) => {
      if (!newVisibleMarkers.has(id)) {
        this.visibleMarkers.get(id).remove();
      }
    });

    this.visibleMarkers = newVisibleMarkers;
  }

  _createClusterMarkerElement(props, coords) {
    const pointCount = props.point_count;
    const el = document.createElement('div');
    el.innerText = pointCount;

    el.classList.add('map-cluster-marker');
    if (pointCount < 100) {
      el.classList.add('map-cluster-marker--1');
    } else if (100 <= pointCount && pointCount < 1000) {
      el.classList.add('map-cluster-marker--2');
    } else {
      el.classList.add('map-cluster-marker--3');
    }

    el.addEventListener('click', () => this._onClusterMarkerClick(props.cluster_id, coords));

    return el;
  }

  _createPinMarkerElement(props) {
    const tmp = document.createElement('template');
    tmp.innerHTML = pinMarkerTemplate;
    const el = tmp.content.children[0];

    const amount = props.mask_adult + props.mask_child;
    if (amount === 0) {
      el.classList.add('map-pin-marker--gray');
    } else {
      el.classList.add('map-pin-marker--red');
    }

    el.addEventListener('click', () => this._emit('pinMarkerClick', el, {...props}));

    return el;
  }

  _onClusterMarkerClick(clusterId, coords) {
    this.map.getSource('pharmacies').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) {
            return;
          }
          this.map.easeTo({center: coords, zoom: (zoom+0.1)*1.01});
        }
    );
  }

  async fetchPharmacieGeoJson() {
    const geojson = await fetch(PHARMACIE_GEOJSON_API_URL)
        .then((res) => res.json());

    return geojson;

    // const pharmacieList = geojson.features.map((feature) => {
    //   return {
    //     ...feature.properties,
    //     coordinates: feature.geometry?.coordinates
    //   };
    // });
  }
}

export default PharmaciesMap;
