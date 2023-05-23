<template>
<view class="cust-switch dis-flex flex-y-center" :class="size == 'large' ? 'cust-switch1' : ''" @tap.stop="checkedItem">
  <div class="colorBg" :style="{width: isCheck ? '100%' : '16rpx'}">
    <div class="circle" :class="isCheck ? 'circleBg1' : 'circleBg2'"></div>
  </div>
</view>
</template>

<script>

export default {
  data() {
    return {
      isCheck: false
    };
  },

  components: {
  },
  props: {
	size:{
		type: String,
		default: ''
	},
	checked: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	}
  },
  watch: {
    checked() {
      this.isCheck = this.checked
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
	mounted() {
		this.isCheck = this.checked
	},
  methods: {
    checkedItem() {
		if (this.disabled) {
			return
		}
		this.isCheck = !this.isCheck
		this.$emit('change',this.isCheck)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>