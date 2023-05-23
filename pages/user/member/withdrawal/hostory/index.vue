<template>
<view class="invite">
  <!-- 自定义标题栏 -->
  <navigationBar title="提现记录" extClass="nav" id="top"></navigationBar>
  <scroll-view refresher-enabled :refresher-triggered="triggered" @refresherrefresh="refresherrefresh" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
    <view class="container">
      <view class="titleBox">
        <div class="titleContent dis-flex flex-y-center flex-x-center">
          <div class="content">
            <div class="num">{{applyCashing}}</div>
            <div class="title">
              提现中金额(元)
            </div>
          </div>
          <div class="line"></div>
          <div class="content">
            <div class="num">{{appliedCash}}</div>
            <div class="title">
              已提现金额(元)
            </div>
          </div>
        </div>
      </view>
      <div class="listBox" v-if="list.length > 0">
        <div class="list dis-flex flex-y-center flex-x-between" v-for="(item, index) in list" :key="index" @tap.stop="open(item)">
          <div class="payPrice">
            <div class="col-3 f-30">
              {{item.updateTime}}
            </div>
            <div class="f-26 m-t-10" :style="colors[item.status.value] ? 'color:' + colors[item.status.value] : ''">
              <text>
                {{item.status.text}}<text v-if="item.status.value == '3'" class="iconfont2 icon-questionmark"></text>
              </text>
            </div>
          </div>
          <div class="detail col-6 f-32" :class="item.status.value == 2 ? 'col-m' : ''">
            {{item.commission.text}}
          </div>
        </div>
      </div>
      <div v-else class="nodata">
        <tui-no-data :fixed="false" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="240" :imgHeight="240">
          <view class="col-9">暂无数据！</view>
        </tui-no-data>
      </div>
    </view>
  </scroll-view>
  <popup-tips ref="popupTips" title="未通过原因" :content="content" :showConcle="false" confirmText="我知道了"></popup-tips>
  <div v-show="isLoading">
	  <loading></loading>
  </div>
</view>
</template>

<script>
let App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';
import loading from '@/components/loading';

export default {
  data() {
    return {
      colors: {
        1: '#F8B14A',
        3: '#FF7541',
      },
      isLoading: true,
      no_more: false,
      triggered: false,
      page: 1,
      last_page: 1,
      scrollHeight: 0,
      
      list: [],
      content: '',
      appliedCash: '¥0.00',
      applyCashing: '¥0.00'
    };
  },
  components: {
    popupTips,
    loading
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$nextTick(() => {
      this.setListHeight()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  computed: {
  },
  methods: {
    /**
     * 设置商品列表高度
     */
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // tap高度
        scrollHeight = systemInfo.windowHeight - res[0].height ; // swiper高度

        this.scrollHeight = scrollHeight
      });
    },
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.last_page) {
        this.no_more = true
        return false;
      } // 加载下一页列表
      this.page ++;
      this.getData();
    },
    refresherrefresh() {
      this.triggered = true
      this.getData(() => {
        this.triggered = false
      });
    },
    getData(next) {
      App._get('shop.rebate.commission/getApplyCommissionLog', {
        page: this.page
      }, (result) => {
        this.isLoading = false
        if (result.code == '1') {
          this.appliedCash = result.data.appliedCash || "¥0.00"
          this.applyCashing = result.data.applyCashing || "¥0.00"

          let list = result.data.list.data || []
          list.forEach(element => {
            element.updateTime = element.create_time ? element.update_time.slice(0, 16) : ''
          });
          this.list = list
        } else {
          this.appliedCash = "¥0.00"
          this.applyCashing = "¥0.00"
          this.list = []
        }
        next ? next() : ''
      }, () => {
        this.isLoading = false
        next ? next() : ''
      });
    },
    open(item) {
      if (item.status.value == '3') {
        this.content = item.remark || ''
        this.$refs.popupTips.open()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>