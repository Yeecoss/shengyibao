<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="积分明细" extClass="nav" id="top"></navigationBar>
<view class="container">
  <scroll-view @scrolltolower="onPageDown" scroll-y :style="'height: ' + scrollHeight + 'px'">
    <view class="recharge-order">
      <view v-for="(item, index) in list.data" :key="index" class="order-item dis-flex flex-x-between flex-y-center">
        <view class="item-left flex-box">
          <view class="rec-status">
            <text>{{ item.describe }}</text>
          </view>
          <view class="rec-time">
            <text>{{ item.create_time }}</text>
          </view>
        </view>
        <view :class="'item-right ' + ( item.value > 0 ? 'col-green' : 'col-6' )">
          <text>{{ item.value > 0 ? '+' : '' }}{{ item.value }}</text>
        </view>
      </view>
      <!-- 没有记录 -->
      <view class="yoshop-notcont" v-if="!list.data.length && !isLoading">
        <text class="iconfont icon-wushuju"></text>
        <text class="cont">亲，暂无积分明细哦</text>
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
      page: 1,
      // 当前页码
      scrollHeight: null,
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
    let _this = this; // 获取积分明细列表


    _this.getPointsLog();
  },

  methods: {
    /**
     * 获取积分明细列表
     */
    getPointsLog(isPage, page) {
      let _this = this;

      getApp().globalData._get('points.log/index', {
        page: page || 1
      }, result => {
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
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度

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
    onPageDown() {
      let _this = this; // 已经是最后一页


      if (_this.page >= _this.list.last_page) {
        _this.setData({
          no_more: true
        });

        return false;
      } // 加载下一页列表


      _this.getPointsLog(true, ++_this.page);
    }

  }
};
</script>
<style>
@import "./index.css";
</style>