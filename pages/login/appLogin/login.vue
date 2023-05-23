<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="授权登录"></navigationBar>

<view class="container">
  <view class="wechatapp">
    <view class="header">
      <open-data type="userAvatarUrl"></open-data>
    </view>
  </view>
  <view class="auth-title">申请获取以下权限</view>
  <view class="auth-subtitle">获得你的公开信息（昵称、头像等）</view>
  <view class="login-btn">
    <button class="btn-normal" openType="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo">授权登录</button>
    <button openType="getPhoneNumber" lang="zh_CN" @getphonenumber="getPhoneNumber">同意</button>
  </view>
  <view class="no-login-btn">
    <button class="btn-normal" @tap.stop="onNotLogin">暂不登录</button>
  </view>
</view>
</view>
</template>

<script>
const App = getApp().globalData;
export default {
  data() {
    return {
      options: {}
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;

    _this.setData({
      options
    });
  },

  methods: {
    /**
     * 授权登录
     */
    getUserInfo(e) {
      App.wxUserInfo = e.detail
    },
    getPhoneNumber(e) {
      if (App.wxUserInfo.errMsg == 'getUserInfo:ok' && e.detail.errMsg == 'getPhoneNumber:ok') {
        App._post_form('weixin.mini_program/getPhoneNumber', {
          sessionKey: App.session.session_key,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }, result => {
          if (result.data.purePhoneNumber) {
            // 跳转授权页面
            uni.navigateTo({
              url: "/pages/login/mobileLogin/login?phone=" + result.data.purePhoneNumber
            });
          }
        })
      }
    },
    /**
     * 暂不登录
     */
    onNotLogin() {
      let _this = this; // 跳转回原页面


      _this.onNavigateBack(_this.options.delta);
    },

    /**
     * 授权成功 跳转回原页面
     */
    onNavigateBack(delta) {
      wx.navigateBack({
        delta: Number(delta || 1)
      });
    }

  }
};
</script>
<style>
@import "./login.css";
</style>