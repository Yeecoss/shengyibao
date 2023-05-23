<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" :back="false" id="top">
    <view slot="left" class="cate_btn" @tap.stop="back">
      <text class="iconfont2 icon-fanhui f-32"></text>
      <text class="title">充值记录</text>
    </view>
</navigationBar>
<view class="container">
  <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px'">
    <view class="recharge-order">
      <view v-for="(item, index) in list.data" :key="index" class="order-item dis-flex flex-x-between flex-y-center">
        <view class="item-left">
          <view class="rec-status">
            <text>充值成功</text>
          </view>
          <view class="rec-time">
            <text>{{ item.pay_time.text }}</text>
          </view>
        </view>
        <view class="item-right">
          <text>+{{ item.actual_money }}元</text>
        </view>
      </view>
      <!-- 没有记录 -->
      <view class="yoshop-notcont" v-if="!list.data.length && !isLoading">
        <text class="iconfont icon-wushuju"></text>
        <text class="cont">亲，暂无充值记录哦</text>
      </view>
    </view>
  </scroll-view>
</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      list: [],
      // 充值记录
      isLoading: true,
      // 是否正在加载中
      page: 1 // 当前页码
      ,
      scrollHeight: "",
      no_more: false
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this; // 设置列表容器高度


    _this.setListHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this; // 获取充值记录


    _this.getRechargeOrder();
  },

  methods: {
    // 返回
    back() {
      var data = this;
      wx.navigateBack({
        delta: data.delta
      });
      this.$emit('back', {
        delta: data.delta
      }, {});
    },

    /**
     * 获取充值记录列表
     */
    getRechargeOrder(isPage, page) {
      let _this = this;

      getApp().globalData._get('recharge.order/lists', {
        page: page || 1
      }, function (result) {
        let resList = result.data.list,
            dataList = _this.list;

        if (isPage == true) {
          _this.setData({
            'list.data': dataList.data.concat(resList.data),
            isLoading: false
          });
        } else {
          _this.setData({
            list: resList,
            isLoading: false
          });
        }
      });
    },

    /**
     * 设置列表容器高度
     */
    setListHeight: function () {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        tapHeight = Math.floor(rpx * 74),
            // tap高度
        scrollHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度

        this.setData({
          scrollHeight: scrollHeight
        });
      }); // let _this = this,
      //   systemInfo = wx.getSystemInfoSync();
      // _this.setData({
      //   scrollHeight: systemInfo.windowHeight * 0.98
      // });
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad() {
      let _this = this; // 已经是最后一页


      if (_this.page >= _this.list.last_page) {
        _this.setData({
          no_more: true
        });

        return false;
      } // 加载下一页列表


      _this.getRechargeOrder(true, ++_this.page);
    }

  }
};
</script>
<style>
@import "./index.css";
</style>