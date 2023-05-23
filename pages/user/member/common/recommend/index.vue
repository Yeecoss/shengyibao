<template>
  <div class="cardBox">
    <div class="card">
      <div class="titleBox dis-flex flex-y-center flex-x-between">
        <div class="title">推荐</div>
      </div>
      <div class="content dis-flex flex-y-center flex-x-between">
        <div class="item dis-flex flex-y-center" @tap.stop="toAddGoods">
          <div class="imgBox">
            <image src="http://pic.kaidanxia.com/2020-07-08/202007081354298f4d65538.png" mode="aspectFill"></image>
          </div>
          <div class="wdBox"></div>
          <div class="infoBox">
            <div class="name">店铺管理</div>
            <div class="info">开店+上传商品</div>
          </div>
        </div>
        <div class="item dis-flex flex-y-center" @tap.stop="showOfficial">
          <div class="imgBox">
            <image src="http://pic.kaidanxia.com/2020-07-08/2020070813542824df36362.png" mode="aspectFill"></image>
          </div>
          <div class="wdBox"></div>
          <div class="infoBox">
            <div class="name">安装APP体验更佳</div>
            <div class="info">微信公众号下载</div>
          </div>
        </div>
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
    toAddGoods() {
			uni.navigateTo({
				url: '/pages/myGoods/goodsAdd/index'
			})
    },
    showOfficial() {
      this.$emit('showOfficial')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>