<template>
<view v-if="show" :class="'zan-noticebar ' + ( hasRightIcon ? 'zan-noticebar--within-icon' : '' )" :style="'color: ' + color + ';background-color: ' + backgroundColor + '; padding: ' + paddingTop + 'px 10px;'">
  <view v-if="leftIcon" class="zan-noticebar__left-icon">
    <image lazy-load class="image" :src="leftIcon"></image>
  </view>
  <view class="zan-noticebar__content-wrap">
    <view class="zan-noticebar__content" :animation="animationData">{{ text }}</view>
  </view>

  <block v-if="mode">
    <zan-icon v-if="mode === 'closeable'" class="zan-noticebar__right-icon" type="close" @tap="handleButtonClickFun"></zan-icon>
    <navigator v-if="mode === 'link'" :url="url" :open-type="openType">
      <zan-icon class="zan-noticebar__right-icon" type="arrow"></zan-icon>
    </navigator>
  </block>

</view>
</template>

<script>
var VALID_MODE = ['closeable'];
var FONT_COLOR = '#f60';
var BG_COLOR = '#fff7cc';

export default {
  data() {
    return {
      show: true,
      hasRightIcon: false,
      width: undefined,
      wrapWidth: undefined,
      elapse: undefined,
      animation: null,
      resetAnimation: null,
      timer: null,
      animationData: ""
    };
  },

  components: {},
  props: {
    text: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    openType: {
      type: String,
      default: 'navigate'
    },
    delay: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 40
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    leftIcon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: FONT_COLOR
    },
    backgroundColor: {
      type: String,
      default: BG_COLOR
    },
    paddingTop: {
      type: String,
      default: 4
    }
  },
  watch: {
    text: function observer(newVal) {
      this.setData({}, this.initFun);
    }
  },
  beforeMount: function attached() {
    var mode = this.mode;

    if (mode && this.checkModeFun(mode)) {
      this.setData({
        hasRightIcon: true
      });
    }
  },
  destroyed: function detached() {
    var timer = this.timer;
    timer && clearTimeout(timer);
  },
  methods: {
    checkModeFun: function _checkMode(val) {
      var isValidMode = ~VALID_MODE.indexOf(val);

      if (!isValidMode) {
        console.warn('mode only accept value of ' + VALID_MODE + ', now get ' + val + '.');
      }

      return isValidMode;
    },
    initFun: function _init() {
      var _this = this;

      wx.createSelectorQuery().in(this).select('.zan-noticebar__content').boundingClientRect(function (rect) {
        if (!rect || !rect.width) {
          return;
        }

        _this.setData({
          width: rect.width
        });

        wx.createSelectorQuery().in(_this).select('.zan-noticebar__content-wrap').boundingClientRect(function (rect) {
          if (!rect || !rect.width) {
            return;
          }

          var wrapWidth = rect.width;
          var _data = _this,
              width = _data.width,
              speed = _data.speed,
              scrollable = _data.scrollable,
              delay = _data.delay;

          if (scrollable && wrapWidth < width) {
            var elapse = width / speed * 1000;
            var animation = wx.createAnimation({
              duration: elapse,
              timeingFunction: 'linear',
              delay: delay
            });
            var resetAnimation = wx.createAnimation({
              duration: 0,
              timeingFunction: 'linear'
            });

            _this.setData({
              elapse: elapse,
              wrapWidth: wrapWidth,
              animation: animation,
              resetAnimation: resetAnimation
            }, function () {
              _this.scrollFun();
            });
          }
        }).exec();
      }).exec();
    },
    scrollFun: function _scroll() {
      var _this2 = this;

      var _data2 = this,
          animation = _data2.animation,
          resetAnimation = _data2.resetAnimation,
          wrapWidth = _data2.wrapWidth,
          elapse = _data2.elapse,
          speed = _data2.speed;

      resetAnimation.translateX(wrapWidth).step();
      var animationData = animation.translateX(-(elapse * speed) / 1000).step();
      this.setData({
        animationData: resetAnimation.export()
      });
      setTimeout(function () {
        _this2.setData({
          animationData: animationData.export()
        });
      }, 100);
      var timer = setTimeout(function () {
        _this2.scrollFun();
      }, elapse);
      this.setData({
        timer: timer
      });
    },
    handleButtonClickFun: function _handleButtonClick() {
      var timer = this.timer;
      timer && clearTimeout(timer);
      this.setData({
        show: false,
        timer: null
      });
    }
  }
};
</script>
<style>
@import "./index.css";
</style>