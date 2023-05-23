<template>
<view class="mobileLogin">
  <!-- 自定义标题栏 -->
  <navigationBar title="验证手机号"></navigationBar>
  <view class="container">
    <form @submit="formSubmit">
      <view class="inputBox  dis-flex">
        当前手机号: {{options.mobile}}
      </view>
      <view class="inputBox">
        <text class="verificat" v-if="options.mobile.length == 11">
          <text v-if="isTime">{{time}}s后重发</text>
          <text v-else @tap.stop="getVerificat">获取验证码</text>
        </text>
        <input placeholder-class="uni-input" type="number" class="inputClass" :maxlength="6" v-model="verificat" placeholder="请输入验证码" />
      </view>
      <view class="login-btn">
        <button v-if="options.mobile.length == 11 && verificat.length == 6" class="btn-normal" form-type="submit" >下一步</button>
        <button v-else class="btn-normal btn-normal1">下一步</button>
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
      verificat: '',
      isTime: false,
      time: 60
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options  = options
  },

  methods: {
    /**
     * 登录
     */
    formSubmit() {
      uni.navigateTo({
          url: '/pages/user/mobile/edit/index?fieldName=' + this.options.fieldName
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