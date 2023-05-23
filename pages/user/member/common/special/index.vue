<template>
    <div class="cardBox">
      <div class="card">
        <div class="titleBox dis-flex flex-y-center flex-x-between">
          <div class="title">特别推荐</div>
        </div>
        <div class="content dis-flex flex-y-center flex-x-between flex-wrap">
          <div class="item itemBg1">
            <div class="name">独立小程序+APP</div>
            <div class="info">多平台管理店铺</div>
            <div class="bgBox">
              <image src="http://pic.kaidanxia.com/2020-07-08/20200708135429f6b577568.png" mode="aspectFill"></image>
            </div>
          </div>
          <div class="item itemBg2">
            <div class="name">我要设计</div>
            <div class="info">作图神器 千万素材</div>
            <div class="bgBox">
              <image src="http://pic.kaidanxia.com/2020-07-08/20200708135430a9a406128.png" mode="aspectFill"></image>
            </div>
          </div>
          <div class="item itemBg3">
            <div class="name">同步商品</div>
            <div class="info">一键同步 批量管理</div>
            <div class="bgBox">
              <image src="http://pic.kaidanxia.com/2020-07-08/20200708135431710b81645.png" mode="aspectFill"></image>
            </div>
          </div>
          <div class="item itemBg4">
            <div class="name">我要推广</div>
            <div class="info">转发朋友圈 转发素材</div>
            <div class="bgBox">
              <image src="http://pic.kaidanxia.com/2020-07-08/20200708135430f00c33029.png" mode="aspectFill"></image>
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
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>