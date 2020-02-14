<template>
  <div class="page-container">
    <div id="pharmaciesMap"></div>

    <div class="mapstyle-select-container">
      <label class="mapstyle-select-label" for="">Map Style</label>
      <select v-model="mapStyle" class="mapstyle-select">
        <option :key="key" v-for="(value, key) in mapStyles" :value="key">
          {{key}}
        </option>
      </select>
    </div>

    <app-loading v-show="showLoading" class="loading" color="#ff4040"/>

    <pharmacies-tooltip ref="tooltip" :info="pharmacyInfo" />
  </div>
</template>

<script>
import PharmaciesMap from '@/libs/PharmaciesMap';
import PharmaciesMapTooltip from './PharmaciesMapTooltip';


export default {
  components: {
    'pharmacies-tooltip': PharmaciesMapTooltip
  },

  data() {
    return {
      mapStyle: 'streets-v11',
      pharmacyInfo: {},
      showLoading: false
    };
  },

  computed: {
    mapStyles() {
      return PharmaciesMap.styles;
    }
  },

  watch: {
    mapStyle() {
      // Due to the issue 8326 (https://github.com/mapbox/mapbox-gl-js/issues/8326),
      // changing style directly does not work. The workaround is to destroy the map
      // and then create again.
      this.destory();
      this.create();
    }
  },

  mounted() {
    this._pharmaciesMap = new PharmaciesMap();
    this._pharmaciesMap.on('pinMarkerClick', (el, info) => {
      this.pharmacyInfo = info;
      this.$refs.tooltip.show(el);
    });

    this._pharmaciesMap.on('sourceDataLoading', (e) => {
      this.showLoading = true;
      clearTimeout(this._loadingTimeout);
      this._loadingTimeout = setTimeout(() => {
        this.showLoading = false;
      }, 3000);
    });

    this.create();
  },

  methods: {
    create() {
      this._pharmaciesMap.create('pharmaciesMap', {style: this.mapStyle});
    },

    destory() {
      this._pharmaciesMap.destroy();
    }
  }
};
</script>

<style lang="stylus" scoped>
.page-container {
  width: 100vw;
  height: 100vh;
}

#pharmaciesMap {
  width: 100vw;
  height: 100vh;
}

.loading {
  position: fixed;
  right: 10px;
  top: 110px;
  width: 30px;
  height: 30px;
  font-size: 20px;
}

.mapstyle-select-container {
  position: absolute;
  top: 5%;
  left: 3%;

  display: flex;
  align-items: center;
  padding: 0 8px 0 8px;
  border-radius: 2px;
  box-shadow: $shadow-dark;
  background-color: white;
}

.mapstyle-select-label {
  margin-right: 10px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.mapstyle-select {
  outline: none;
  border: 0;
  height: 34px;
  background-color: transparent;
}

@media (max-width: $extra-small-width) {
  .mapstyle-select-container {
    max-width: 60%;
    top: 10px;
    left: 10px;
  }

  .mapstyle-select {
    appearance: none;
  }
}
</style>
