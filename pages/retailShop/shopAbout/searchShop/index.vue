<template>
<view class="choiceShopBox">
  <!-- 自定义标题栏 -->
  <navigationBar title="搜索结果"></navigationBar>
  <view class="shopBox">
      <div class="search-input-box">
        <view class="search-input">
          <view class="dis-flex flex-y-center search-box">
              <text class="iconfont2 icon-searchfor col-9"></text>
              <input v-model="searchVal" @blur="search" class="input" placeholder="搜索" placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text"/>
          </view>
        </view>
      </div>
  </view>
  <view class="shopBox" v-if="shopList.length > 0">
    <view v-for="(item, index) in shopList" :key="index">
      <list-item :groupList="groupList" :itemData="item" @toShopInformation="toShopInformation" :isLast="(index == shopList.length - 1)" @getGroup="getGroup"></list-item>
    </view>
    <view class="no-more f-24 col-9">生意宝技术支持～</view>
  </view>
  <contact ref="contact"></contact>
</view>
</template>

<script>
const App = getApp().globalData;
import listItem from '@/components/myGoodsCommon/list-item/index';
import contact from '@/components/myGoodsCommon/contact/index';

export default {
  data() {
    return {
      shopList: [],
      groupList: [],
      searchVal: ''
    };
  },
  components: {
    listItem,
    contact
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  onShow() {
    this.getGroup()
  },

  methods: {
    // 店铺资料
    toShopInformation(itemData) {
      this.$refs.contact.open(itemData)
    },
    choiceShop(item) {
      App.wxapp_id = item.wxapp_id;
      wx.setStorageSync("wxapp_id", item.wxapp_id)
			uni.reLaunch({
				url:'/pages/index/index'
			})
    },
    search() {
      this.getGroup()
    },
    getGroup() {
      if (this.searchVal == '') {
        this.shopList = []
        return false
      }
      let data = {
        name: this.searchVal
      }
      App._post_form('user/searchStore', {
        search: JSON.stringify(data)
      }, result => {
        this.shopList = result.data.list || []
        this.groupList = result.data.groups || []
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>