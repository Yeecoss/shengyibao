<template>
<view :class="'pop pop--' + type + ' ' + ( show ? 'pop--show' : '' )">
  <view v-if="overlay" :class="'pop__mask ' + ( showOverlay ? '' : 'pop__mask--hide' )" @tap="handleMaskClick" catchtouchmove='true'></view>
  <view class="pop__container" :class="isInput ? 'pop__container_input' : ''">
    <slot></slot>
  </view>
</view>
</template>

<script>

export default {
  data() {
    return {};
  },

  components: {},
  props: {
    isInput: { // 输入框上移
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    // 是否有遮罩层
    overlay: {
      type: Boolean,
      default: true
    },
    // 遮罩层是否会显示
    showOverlay: {
      type: Boolean,
      default: true
    },
    // 内容从哪个方向出，可选 center top bottom left right
    type: {
      type: String,
      default: 'center'
    }
  },
  methods: {
    handleMaskClick: function() {
      this.$emit('clickmask', {});
    }
  }
};
</script>
<style>
@import "./index.css";
</style>