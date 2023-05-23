<template>
<view class="shopInformation">
  <!-- 自定义标题栏 -->
  <navigationBar :title="'开单号:' + title" :fontWeight="600">
  </navigationBar>
  <div class="heardBox dis-flex flex-y-center flex-x-between">
    <div class="dis-flex flex-y-center">
      <div class="imgBox" v-if="wxappInfo.logo">
        <image :src="wxappInfo.logo"></image>
      </div>
      <div class="name">
        {{wxappInfo.name || ''}}
      </div>
    </div>
    <div>
      <div class="toShop" @tap="toShop">
        进入店铺
      </div>
    </div>
  </div>
  <div class="content">
    <div class="list dis-flex flex-y-center flex-x-between line">
      <div class="label">
        开单号：{{item.number}}
      </div>
      <div class="content1">
        开单时间：{{item.sale_time}}
      </div>
    </div>
    <div class="list1 dis-flex flex-x-between">
      <div class="label dis-flex flex-x-between">
        <div style="width:100rpx">客户：</div>
        <div style="flex:1">{{item.clientor ? item.clientor.name : '-'}}</div>
      </div>
      <div class="content1 dis-flex flex-x-between">
        <div style="width:140rpx">销售员：</div>
        <div style="flex:1">{{item.clerkor ? item.clerkor.real_name : '-'}}</div>
      </div>
    </div>
    <div class="tableBox" v-if="item.sale_goods && item.sale_goods.length > 0">
      <div class="heard dis-flex flex-y-center">
        <div class="order">序号</div>
        <div class="name">商品简称</div>
        <div class="spec">规格</div>
        <div class="num">数量</div>
        <div class="price">单价</div>
      </div>
      <div class="dis-flex flex-y-center line" v-for="(items, index) in item.sale_goods" :key="index">
        <div class="order" style="line-height:40rpx">
          <div>{{index + 1}}</div>
          <div class="dis-flex flex-x-center" @tap.stop="checkItem(items)">
            <view :class="items.checked ? 'done-btn1' : 'done-btn'"><text class="iconfont2 icon-duihao f-24"></text></view>
          </div>
        </div>
        <div class="name dis-flex flex-y-center"><text>{{items.goods_short_name}}</text></div>
        <div class="spec dis-flex flex-y-center"><text>{{items.goods_sku_name || '——'}}</text></div>
        <div class="num dis-flex flex-y-center"><text>{{items.goods_num}}</text></div>
        <div class="price"><text>{{items.goods_price}}</text></div>
      </div>
    </div>
    <div class="remark">
      <div>货款金额：¥{{item.total_price || '0.00'}}</div>
      <div>商品数量：{{item.total_num || '0'}}</div>
      <div v-if="item.pay_way">结算方式：{{item.pay_way.text || '-'}}</div>
      <div v-if="item.delivery_way">发货方式：{{item.delivery_way.text || '-'}}</div>
      <div v-if="item.warehouse">仓库：{{item.warehouse.name || '-'}}</div>
      <div v-if="item.remark">备注：{{item.remark}} </div>
    </div>
    <div class="logo dis-flex flex-y-center flex-x-center">
      <div class="line"></div>
      <div class="iconBox">
        <text class="iconfont2 icon-bianzu6 f-32 col-m"></text>
      </div>
      <div class="line"></div>
    </div>
  </div>
	<popup-tips ref="popupTips" :content="tipTit" confirmText="去上传"></popup-tips>
  <div v-show="loading">
    <loading ></loading>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';
import loading from '@/components/loading';
export default {
  data() {
    return {
      loading: true,
      specList: [],
      title: '',
      sale_id: '',
      tipTit: '',
      wxappInfo: {},
      item: {}
    }
  },
  components: {
    popupTips,
    loading
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.sale_id = options.sale_id || ''
  },
  onShow() {
    this.getDetail()
  },
  methods: {
    toShop() {
      let wxapp_id = this.wxappInfo.wxapp_id || '';
      if (wxapp_id != '') {
        App.wxapp_id = wxapp_id;
        wx.setStorageSync("wxapp_id", wxapp_id)
      }
      // this.back();
			uni.reLaunch({
				url:'/pages/index/index'
			})
    },
    checkItem(items) {
      items.checked = !items.checked
    },
    edit() {
      uni.navigateTo({
        url: '/pages/retailShop/shopAbout/salesBilling/add/index?sale_id=' + this.sale_id
      });
    },
    printTicket() {
      App._post_form('store.shop.sale/printTicket', {
        sale_id: this.sale_id
      }, (result) => {
        if (result.code == '1') {
          this.$api.msg(result.msg)
        } else {
          this.$api.msg(result.msg)
        }
      })
    },
    submit() {},
    getDetail() {
      App._get('common/getSaleDetail', {
        sale_id: this.sale_id
      }, (result) => {
        if (result.code == '1') {
          let data = result.data.detail || {}
          data.sale_goods.forEach(item => {
            item.checked = false
          })
          this.item = data
          this.title = this.item.number
          this.wxappInfo = result.data.wxappInfo || {}
          this.contact = result.data.contact || {}
        } else {
          this.$api.msg(result.msg)
        }
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>