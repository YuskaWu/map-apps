<template>
  <app-tooltip ref="tooltip" :stick="true">
    <div class="tooltip-body">
      <div class="tooltip-head">
        <span>{{info.name}}</span>
        <span @click="hide()" class="tooltip-close"><i class="fas fa-times"></i></span>
      </div>
      <div class="tooltip-content">
        <div class="tooltip-info">
          <span class="tooltip-info-icon"><span class="mask-icon">😷</span></span>
          <span>口罩數量(成人/小孩)：</span>
          <span style="margin-left: 1rem">{{info.mask_adult}} &nbsp; / &nbsp; {{info.mask_child}}</span>
        </div>
        <div class="tooltip-info">
          <span class="tooltip-info-icon"><i class="fas fa-phone-alt"></i></span>
          <span>{{info.phone}}</span>
        </div>
        <div class="tooltip-info">
          <span class="tooltip-info-icon"><i class="fas fa-map-marked-alt"></i></span>
          <span>{{info.address}}</span>
        </div>
        <div class="tooltip-info">
          <span class="tooltip-info-icon"><i class="fas fa-history"></i></span>
          <span>更新時間： {{info.updated}}</span>
        </div>
      </div>
    </div>
  </app-tooltip>
</template>

<script>

const popperOptions = {
  placement: 'top',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [5, 5]
      }
    },
    {
      name: 'arrow',
      options: {
        padding: 10
      }
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: []
      }
    },
    {
      name: 'computeStyles',
      options: {
        // instead of transform, set false to update position with left & top
        // because we use transform to rotate arrow element.
        gpuAcceleration: false,
        adaptive: false
      }
    },
    {
      name: 'preventOverflow',
      options: {
        padding: 20
      }
    }
  ]
};

export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },

  methods: {
    show(el) {
      this.$refs.tooltip.show(el, popperOptions);
    },

    hide() {
      this.$refs.tooltip.hide();
    }
  }
};
</script>

<style lang="stylus" scoped>
.tooltip-body {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 8px;
  min-width: 250px;
  max-width: 80vw;
}

.tooltip-head {
  display: flex;
  align-items: center;
  font-weight: 700;
  padding-top: 2px;
  padding-bottom: 7px;
}

.tooltip-close {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: auto;
  margin-right: 5px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 50%;
  width: 18px;
  height: 18px;
}

.tooltip-close:hover {
  background-color: rgba(0,0,0,0.1);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.tooltip-info {
  display: flex;
  align-items: flex-start;
  padding: 5px 0 5px 0;
}

.tooltip-info-icon {
  width: 15px;
  height: 15px;
  margin-left: 2px;
  margin-right: 15px;
  position: relative;
  top: 1px;
}

.mask-icon {
  position: relative;
  left: -2px;
  top: -1px;
}

</style>
