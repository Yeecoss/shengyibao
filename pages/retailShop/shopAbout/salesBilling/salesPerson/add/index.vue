<template>
<view class="shopInformation">
  <!-- 自定义标题栏 -->
  <navigationBar title="添加销售员">
  </navigationBar>
  <view class="cardBox">
    <div class="cardList dis-flex flex-y-center">
      <div class="label">销售员</div>
      <div class="inputBox">
        <input v-model="name" type="text" placeholder="请输入销售员">
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
      name: ''
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
        this.$api.msg('请输入销售员')
        return
      }
      uni.showLoading()
      App._post_form('store.shop.clerk/add', {
        name: this.name
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