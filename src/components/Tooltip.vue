<template>
  <div class="app-tooltip">
    <slot></slot>
    <div ref="arrow" class="app-tooltip__arrow" data-popper-arrow></div>
  </div>
</template>

<script>
import {createPopper} from '@popperjs/core';
// import {createPopper} from '@popperjs/core/lib/popper-lite';

const defOptions = {
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
        // make arrow padding form the edge of popup body.
        padding: 10
      }
    }
  ]
};

export default {
  props: {
    stick: {
      type: Boolean,
      default: false
    }
  },

  beforeDestroy() {
    cancelAnimationFrame(this._animateId);
  },

  methods: {
    show(refEl, opt) {
      this.destory();

      const el = this.$el;
      el.style.display = 'block';
      setTimeout(() => el.style.opacity = 1, 1);

      this.createPopper(refEl, opt);

      if (!this.stick) {
        return;
      }

      // keep update position
      const animateFrame = () => {
        if (!this._popperIns) {
          cancelAnimationFrame(this._animateId);
          return;
        }
        this._popperIns.update();
        this._animateId = requestAnimationFrame(animateFrame);
      };

      this._animateId = requestAnimationFrame(animateFrame);
    },

    hide() {
      this.destory();
      const el = this.$el;
      el.style.display = 'none';
      el.style.opacity = 0;
    },

    destory() {
      cancelAnimationFrame(this._animateId);
      if (!this._popperIns) {
        return;
      }
      this._popperIns.destroy();
      this._popperIns = null;
    },

    createPopper(refEl, options = {}) {
      const opt = Object.assign({}, defOptions, options);
      this._popperIns = createPopper(refEl, this.$el, opt);
    }
  }
};
</script>

<style lang="stylus" scoped>
$background-color = white;
$border = 1px solid rgba(0,0,0,0.4);
$arrow-size = 5px;
// 1px is the border size of main element
$arrow-offset = -($arrow-size) - 1px;

.app-tooltip {
  text-align: left;
  display: none;
  border: $border;
  padding: 5px;
  background-color: $background-color;
  box-shadow: $shadow-dark;
  border-radius: 3px;
  // transition: opacity 0.3s;
}

.app-tooltip__arrow {
  width: $arrow-size*2;
  height: $arrow-size*2;
  position: absolute;
  box-shadow: 1px 1px 1px -1px rgba(0, 0, 0, 0.9);
  background-color: $background-color;
  border-right: $border;
  border-bottom: $border;
}

.app-tooltip[data-popper-placement^="bottom"] > .app-tooltip__arrow {
  transform: rotate(-135deg);
  top: $arrow-offset;
}

.app-tooltip[data-popper-placement^="top"] > .app-tooltip__arrow {
  transform: rotate(45deg);
  bottom: $arrow-offset;
}

.app-tooltip[data-popper-placement^="left"] > .app-tooltip__arrow {
  transform: rotate(-45deg);
  right: $arrow-offset;
}

.app-tooltip[data-popper-placement^="right"] > .app-tooltip__arrow {
  transform: rotate(135deg);
  left: $arrow-offset;
}
</style>
