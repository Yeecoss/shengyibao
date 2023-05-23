<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="选择自提门店" id="top"></navigationBar>
<view class="container b-f">
  <view class="shop-list">
    <view v-for="(item, index) in shopList" :key="index" @tap.stop="onSelectedShop" :data-id="item.shop_id" class="shop-item dis-flex flex-y-center">
      <view class="shop-item__content flex-box">
        <view class="shop-item__title">
          <text>{{ item.shop_name }}</text>
        </view>
        <view class="shop-item__address">
          <text>地址：{{ item.region.province }}{{ item.region.city }}{{ item.region.region }}{{ item.address }}</text>
        </view>
        <view class="shop-item__phone">
          <text>联系电话：{{ item.phone }}</text>
        </view>
        <view class="shop-item__distance">
          <block v-if="item.distance">
            <text class="iconfont icon-dingwei"></text>
            <text class="f-24">{{ item.distance_unit }}</text>
          </block>
        </view>
      </view>
      <!-- 选中状态 -->
      <view v-if="item.shop_id == selectedId" class="shop-item__right">
        <text class="iconfont icon-iconfontduihaocopy"></text>
      </view>
    </view>
  </view>
  <!-- 无数据提供的页面 -->
  <view v-if="!isLoading && !shopList.length">
    <view class="yoshop-notcont">
      <text class="iconfont icon-wushuju"></text>
      <text class="cont">亲，暂无自提门店哦</text>
    </view>
  </view>
  <!-- 定位按钮 -->
  <view v-if="!isAuthor" class="widget-location dis-flex flex-x-center flex-y-center" @tap.stop="onAuthorize">
    <text class="iconfont icon-locate"></text>
  </view>
</view>
<zan-toptips id="zan-toptips" :content="content"></zan-toptips>
</view>
</template>

<script>
const App = getApp().globalData;
import Toptips from '@/components/toptips/toptips';
import zanToptips from "@/components/toptips/index";

export default {
  data() {
    return {
      selectedId: -1,
      isAuthor: true,
      isLoading: true,
      // 是否正在加载中
      shopList: [] // 门店列表
      ,
      selectedShopId: ""
    };
  },

  components: {
    zanToptips,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this; // 记录已选中的id


    _this.setData({
      selectedId: options.selected_id
    }); // 获取默认门店列表


    _this.getShopList(); // 获取用户坐标


    _this.getLocation(res => {
      _this.getShopList(res.longitude, res.latitude);
    });
  },

  methods: {
    /**
     * 获取门店列表
     */
    getShopList(longitude, latitude) {
      let _this = this;

      _this.setData({
        isLoading: true
      });

      getApp().globalData._get('shop/lists', {
        longitude: longitude || '',
        latitude: latitude || ''
      }, result => {
        _this.setData({
          shopList: result.data.list,
          isLoading: false
        });
      });
    },

    /**
     * 获取用户坐标
     */
    getLocation(callback) {
      let _this = this;

      wx.chooseLocation({
        type: 'wgs84',

        success(res) {
          // console.log(res);
          callback && callback(res);
        },

        fail() {
          Toptips({
            duration: 3000,
            content: '获取定位失败，请点击右下角按钮打开定位权限'
          });

          _this.setData({
            isAuthor: false
          });
        }

      });
    },

    /**
     * 授权启用定位权限
     */
    onAuthorize() {
      let _this = this;

      wx.openSetting({
        success(res) {
          if (res.authSetting["scope.userLocation"]) {
            // console.log('授权成功');

            _this.setData({
              isAuthor: true
            });

            setTimeout(() => {
              // 获取用户坐标
              _this.getLocation(res => {
                // console.log('获取用户坐标');

                _this.getShopList(res.longitude, res.latitude);
              });
            }, 1000);
          }
        }

      });
    },

    /**
     * 选择门店
     */
    onSelectedShop(e) {
      let _this = this,
          selectedId = e.currentTarget.dataset.id; // 设置选中的id


      _this.setData({
        selectedId
      }); // 设置上级页面的门店id


      let pages = getCurrentPages();

      if (pages.length < 2) {
        return false;
      }

      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        selectedShopId: selectedId
      }); // 返回上级页面

      wx.navigateBack({
        delta: 1
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>