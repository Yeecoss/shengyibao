<template>
  <div class="cardBox">
    <div class="card">
      <div class="titleBox dis-flex flex-y-center flex-x-between">
        <div class="title">什么是生意宝？</div>
      </div>
      <div class="content">
        <li><text class="dot"></text>免费小程序+APP店铺</li>
        <li><text class="dot"></text>免费相册、一键转发朋友圈</li>
        <li><text class="dot"></text>直播带货，玩转私域流量</li>
        <li><text class="dot"></text>微信收款更便捷</li>
        <li><text class="dot"></text>发展渠道、客户管理更方便</li>
        <li><text class="dot"></text>批量打印快递单</li>
        <li><text class="dot"></text>腾讯云支持、数据更安全</li>
        <li><text class="dot"></text>作图神器，5000万素材任性用--<text class="col-m" style="text-decoration:underline" @tap.stop="toLink">跳转canva优惠码页面</text></li>
        <li><text class="dot"></text>一站式服务，再也不用多软件来回切换</li>
      </div>
    </div>
  </div>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
    };
  },

  components: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
      toLink() {
				uni.navigateTo({
					url: '/pages/user/canvas/index'
				});
      }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>