<template>
<view class="mobileLogin">
  <!-- 自定义标题栏 -->
  <navigationBar title="编辑手机号"></navigationBar>
  <view class="container">
    <form @submit="formSubmit">
      <view class="inputBox  dis-flex">
        <view class="areaCode">
          +86
          <text class="iconfont2 icon-pull-down"></text>
        </view>
        <view>
          <input placeholder-class="uni-input" class="inputClass" type="number" v-model="mobileNum" :maxlength="11" placeholder="输入新的手机号" />
        </view>
      </view>
      <view class="inputBox">
        <text class="verificat" v-if="mobileNum.length == 11">
          <text v-if="isTime">{{time}}s后重发</text>
          <text v-else @tap.stop="getVerificat">获取验证码</text>
        </text>
        <input placeholder-class="uni-input" type="number" class="inputClass" :maxlength="6" v-model="verificat" placeholder="请输入验证码" />
      </view>
      <view class="login-btn">
        <button v-if="mobileNum.length == 11 && verificat.length == 6" class="btn-normal" form-type="submit" >提交</button>
        <button v-else class="btn-normal btn-normal1">提交</button>
      </view>
    </form>
  </view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      options: {},
      mobileNum: '',
      verificat: '',
      isTime: false,
      fieldName: '',
      time: 60
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.options  = options
    this.fieldName  = options.fieldName || ''
  },

  methods: {
    /**
     * 登录
     */
    formSubmit() {
      let state = this.mobileNum
      let pages = getCurrentPages();
			let prevPage = pages[pages.length - 3]; //上一个页面
			if (prevPage.$vm.change) {
			  prevPage.$vm.change(this.fieldName, state)
			}
			uni.navigateBack({
        delta: 2
      });
    },
    // 获取验证码
    getVerificat() {
      this.setTime()
    },
    setTime() {
      this.time = 60
      this.isTime = true
      let timer = setInterval(() => {
        this.time += -1
        if (this.time == 0) {
          clearInterval(timer)
          this.isTime = false
        }
      }, 1000)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>