<template>
<view class="container">
  <!-- 自定义标题栏 -->
  <navigationBar title="商品搜索"></navigationBar>
	<!-- 搜索 -->
	<view class="p-l-30 p-r-30 p-t-30">
    <view class="dis-flex search-input-box">
      <view class="search-input">
        <view class="dis-flex flex-y-center search-box">
			<text class="iconfont2 icon-searchfor col-9"></text>
            <input v-model="searchValue" @blur="search" class="input" focus="true" placeholder="请输入您搜索的商品" placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text"/>
        </view>
      </view>
    </view>
	</view>
	<!-- tab -->
	<view class="tab-wrap dis-flex flex-y-center">
		<view class="tab-item" :class="tabIndex==index?'on':''" v-for="(item,index) in tabList" :key="index" @tap="tabIndex = index">
			{{item}}
		</view>
	</view>
	<!-- 最近搜索 -->
  <view class="p-l-30 p-r-30 p-b-20">
    <view class="search-cont-box" v-if="recentSearch.length">
      <view class="title-box col-3">
        <text>最近搜索</text>
        <text @tap="clearSearch" class="iconfont icon-lajixiang"></text>
      </view>
      <view class="sale-button-box">
        <view class="seconds-kill-li" v-for="(recent, idx) in recentSearch" :key="idx">
          <view @tap="goSearch(recent)" class="recent-button col-6">{{recent}}</view>
        </view>
      </view>
    </view>
    <view class="hotBox" v-if="hotList.length">
      <view class="hot-title f-28 dis-flex flex-y-center">
        <text class="iconfont2 icon-Hotsale2 f-28 m-r-10"></text>热销</view>
      <navigator class="hotList dis-flex" hover-class="none" :url="'../goods/index?goods_id=' + item.wxapp_goods_id" v-for="(item, index) in hotList" :key="index">
        <view class="number">
          <!-- <image lazy-load wx:if="{{index < 3}}" src="/images/num{{index + 1}}.png"></image> -->
          <text :style="index < 3 ? 'color:#FA2B2D' : ''">{{index + 1}}</text>
        </view>
        <view :class="'imgBox ' + (index < 3 ? 'imgBoxHot' : '')">
          <image lazy-load :src="item.goods.goods_image"></image>
        </view>
        <view class="goods_info f-24 col-3">
          <view class="goods_name onelist-hidden">{{item.goods.goods_name}}</view>
          <view class="col-9">销量{{ item.goods?item.goods.goods_sales : item.goods_sales || 0}}</view>
        </view>
      </navigator>
    </view>
  </view>
</view>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
      recentSearch: [],
      searchValue: '',
      hotList: [],
			tabList: ['商品','标签'],
			tabIndex: 0,
    };
  },

  components: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取历史搜索
    this.getRecentSearch();
  },
  methods: {
    // 获取热销商品列表
    getHotList: function () {
      let _this = this;

      let data = {
        s: '/xapi/wxapp.goods/lists',
        is_hot: '1'
      };

      getApp().globalData._get('index.php', data, result => {
        let resList = result.data.list.data;
        resList = resList.splice(0, 5);

        _this.setData({
          hotList: resList
        });
      });
    },

    /**
     * 获取历史搜索
     */
    getRecentSearch: function () {
      let recentSearch = wx.getStorageSync('recentSearch');
      this.setData({
        recentSearch
      });
    },

    /**
     * 绑定输入值
     */
    // getSearchContent: function (e) {
    //   this.searchValue = e.detail.value;
    // },

    /**
     * 搜索提交
     */
    search: function () {
      if (this.searchValue) {
        // 记录最近搜索
        let recentSearch = wx.getStorageSync('recentSearch') || [];
        let index = recentSearch.indexOf(this.searchValue);
        index > -1 && recentSearch.splice(index, 1);
        recentSearch.unshift(this.searchValue);
        wx.setStorageSync('recentSearch', recentSearch); // 跳转到商品列表页
				
				let url = '';
				if(this.tabIndex==1){
					url = '/pages/goods/tagGoodsList/tagGoodsList?tag=' + this.searchValue;
				}else{
					url = '/pages/category/extend/list?search=' + this.searchValue;
				}
        uni.navigateTo({
          url: url
        });
      }
    },

    /**
     * 清空最近搜索记录
     */
    clearSearch: function () {
      wx.removeStorageSync('recentSearch');
      this.getRecentSearch();
    },

    /**
     * 跳转到最近搜索
     */
    goSearch (e) {
			let url = '';
			if(this.tabIndex==1){
				url = '/pages/goods/tagGoodsList/tagGoodsList?tag=' + e;
			}else{
				url = '/pages/category/extend/list?search=' + e;
			}
      uni.navigateTo({
        url: url
      });
    },
		// changeTab(index){
		// 	this.tabIndex = index
		// }
  }
};
</script>
<style lang="scss">
	@import "index";
</style>