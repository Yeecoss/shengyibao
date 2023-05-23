<template>
<view :class="'zan-toptips ' + ( isShow ? 'zan-toptips--show' : '' )" :style="'background-color:' + backgroundColor">{{ content }}</view>
</template>

<script>
var FONT_COLOR = '#fff';
var BG_COLOR = '#e64340';

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    content: String,
    color: {
      type: String,
      default: FONT_COLOR
    },
    backgroundColor: {
      type: String,
      default: BG_COLOR
    },
    isShow: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    show: function show() {
      var _this = this;

      var duration = this.duration;
      this._timer && clearTimeout(this._timer);
      this.setData({
        isShow: true
      });

      if (duration > 0 && duration !== Infinity) {
        this._timer = setTimeout(function () {
          _this.hide();
        }, duration);
      }
    },
    hide: function hide() {
      this._timer = clearTimeout(this._timer);
      this.setData({
        isShow: false,
        backgroundColor: BG_COLOR
      });
    }
  }
};
</script>
<style>
@import "./index.css";
</style>