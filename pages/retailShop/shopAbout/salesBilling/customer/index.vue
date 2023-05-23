<template>
<view class="salesBilling">
  <!-- 自定义标题栏 -->
  <navigationBar title="客户" id="top"></navigationBar>
  <view class="dis-flex search-input-box">
    <view class="search-input">
      <view class="dis-flex flex-y-center search-box">
          <text class="iconfont2 icon-searchfor col-9"></text>
          <input v-model="keywords" @submit="search()" @blur="search()" class="input" placeholder="搜索客户" placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text"/>
      </view>
    </view>
  </view>
  <scroll-view class="listBox" :refresher-threshold="20" refresher-enabled :refresher-triggered="triggered" @refresherrefresh="refresherrefresh" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
    <template v-if="list.length > 0">
      <div class="listItem" v-for="(item, index) in list" :key="index" @tap="checkItem(item)">
        <div class="name">{{item.name}}</div>
        <div class="phone">手机号：{{item.phone || '-'}}</div>
      </div>
      <view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
    </template>
    <tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png" :imgWidth="264" :imgHeight="264">
      <div class="col-9">
        暂无数据
      </div>
    </tui-no-data>
  </scroll-view>
  <div class="butBox dis-flex flex-y-center">
    <div class="submit" @tap.stop="add">
      <text class="iconfont2 icon-jiahao"></text>
      添加客户
    </div>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      keywords: '',
      scrollHeight: 0,
      list: [],
      triggered: true,
      last_page: 1,
      page: 1,
      no_more: false
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.$nextTick(() => {
      this.setListHeight()
    })
  },
  mounted() {
  },
  onShow() {
    this.getListData()
  },

  methods: {
    checkItem(item) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.$vm.checkCustomer) {
        prevPage.$vm.checkCustomer(item)
      }
      uni.navigateBack();
    },
    search() {
      this.page = 1
      this.getListData()
    },
    getListData(next) {
      let obj = {
        page: this.page,
        search: this.keywords || ''
      }
      App._get('store.shop.client/getClientList', obj, (result) => {
        if (result.code == '1') {
          if (next) {
            next ? next() : ''
          }
          this.loading = false
          let newList = result.data.list.data || []
          if (this.page == 1) {
            this.list = newList
          } else {
            this.list = this.list.concat(newList)
          }
          this.last_page = result.data.list.last_page || 1
        } else {
          this.$api.msg(result.msg)
        }
      })
    },
    add() {
      uni.navigateTo({
        url: '/pages/retailShop/shopAbout/salesBilling/customer/add/index'
      });
    },
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // tap高度
        scrollHeight = systemInfo.windowHeight - res[0].height - 100 * rpx * 2; // swiper高度

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
      this.getListData();
    },
    refresherrefresh() {
      this.page = 1;
      this.triggered = true
      this.getListData(() => {
        this.triggered = false
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>