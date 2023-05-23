<template>
<view>
  <!-- 自定义标题栏 -->
  <navigationBar title="消费榜" id="top">
  </navigationBar>
  <template v-if="!loading">
    <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;'" v-if="userExpendRanking && userExpendRanking.length > 0">
      <salesFee-list nomore :userExpendRanking="userExpendRanking"></salesFee-list>
      <view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
    </scroll-view>
    <tui-no-data v-else fixed imgUrl="/static/images/no_content.png" :imgWidth="380" :imgHeight="328">
      <div>
        暂无数据
      </div>
    </tui-no-data>
  </template>
</view>
</template>

<script>
const App = getApp().globalData;
import salesFeeList from '@/components/myGoodsCommon/salesFeeList/index';

export default {
  data() {
    return {
      scrollHeight: 0,
      last_page: 0,
      no_more: false,
      loading: true,
      page: 1,
      userExpendRanking: []
    };
  },

  components: {
    'salesFee-list': salesFeeList
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.$nextTick(() => {
      this.setListHeight()
    })
    this.getListData()
  },

  methods: {
    // 获取数据
    getListData() {
      App._get('shop.statistics/userExpendRanking', {
        page: this.page
      }, (result) => {
        this.loading = false
        this.userExpendRanking = this.userExpendRanking.concat(result.data.data || [])
        this.last_page = result.data.last_page || 1
      })
    },
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
        scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度

        this.setData({
          scrollHeight: scrollHeight
        });
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>