<template>
<view class="shopInformation">
  <!-- 自定义标题栏 -->
  <navigationBar title="添加客户">
  </navigationBar>
  <view class="cardBox">
    <div class="cardList dis-flex flex-y-center line">
      <div class="label">客户名</div>
      <div class="inputBox">
        <input v-model="name" type="text" placeholder="请输入客户">
      </div>
    </div>
    <div class="cardList dis-flex flex-y-center">
      <div class="label">手机号</div>
      <div class="inputBox">
        <input v-model="phone" type="text" placeholder="请输入手机号">
      </div>
    </div>
  </view>
  <div class="butBox dis-flex flex-y-center">
    <div class="submit" @tap.stop="submit">
      <text class="iconfont2 icon-jiahao"></text>
      确定
    </div>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      name: '',
      phone: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  methods: {
    submit() {
      if (this.name == '') {
        this.$api.msg('请输入客户名称')
        return
      }
      uni.showLoading()
      App._post_form('store.shop.client/add', {
        name: this.name,
        phone: this.phone
      }, (result) => {
        this.$api.msg(result.msg)
        if (result.code == '1') {
          wx.navigateBack();
        }
      }, () => {
        uni.hideLoading()
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>