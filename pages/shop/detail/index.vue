<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="门店详情" extClass="nav" id="top"></navigationBar>
<view v-if="detail.shop_id" class="container">
  <view class="header">
    <view class="shop-logo">
      <image lazy-load :src="detail.logo.file_path"></image>
    </view>
    <view class="shop-name">
      <text>{{ detail.shop_name }}</text>
    </view>
    <view v-if="detail.summary" class="shop-summary dis-flex">
      <text>门店简介：{{ detail.summary }}</text>
    </view>
  </view>
  <view class="content">
    <view class="content-item dis-flex flex-y-center">
      <view class="content-item__icon dis-flex">
        <text class="iconfont icon-shijian"></text>
      </view>
      <view class="content-item__text flex-box dis-flex">
        <text class="f-26">{{ detail.shop_hours }}</text>
      </view>
    </view>
    <view @tap.stop="onOpenLocation" class="content-item dis-flex flex-y-center">
      <view class="content-item__icon dis-flex">
        <text class="iconfont icon-dingwei"></text>
      </view>
      <view class="content-item__text flex-box dis-flex">
        <text class="f-26">{{detail.region.province}}{{detail.region.city}}{{detail.region.region}}{{detail.address}}</text>
      </view>
      <view class="content-item__arrow dis-flex">
        <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
      </view>
    </view>
    <view @tap.stop="onMakePhoneCall" class="content-item dis-flex flex-y-center">
      <view class="content-item__icon dis-flex">
        <text class="iconfont icon-dianhua"></text>
      </view>
      <view class="content-item__text flex-box dis-flex">
        <text class="f-26">{{ detail.phone }}</text>
      </view>
      <view class="content-item__arrow dis-flex">
        <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
      </view>
    </view>
  </view>
</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      // 门店详情
      detail: {}
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this; // 获取门店详情


    _this.getShopDetail(options.shop_id);
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this; // 构建页面参数


    let params = getApp().globalData.getShareUrlParams({
      'shop_id': _this.detail.shop_id
    });
    return {
      title: _this.detail.article_title,
      path: "/pages/shop/detail/index?" + params
    };
  },

  methods: {
    /**
     * 获取门店详情
     */
    getShopDetail(shop_id) {
      let _this = this;

      getApp().globalData._get('shop/detail', {
        shop_id
      }, function (result) {
        _this.setData(result.data);
      });
    },

    /**
     * 拨打电话
     */
    onMakePhoneCall() {
      let _this = this;

      wx.makePhoneCall({
        phoneNumber: _this.detail.phone
      });
    },

    /**
     * 查看位置
     */
    onOpenLocation() {
      let _this = this,
          detail = _this.detail;

      wx.openLocation({
        name: detail.shop_name,
        address: detail.region.province + detail.region.city + detail.region.region + detail.address,
        longitude: Number(detail.longitude),
        latitude: Number(detail.latitude),
        scale: 15
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>