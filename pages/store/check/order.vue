<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar title="订单核销" extClass="nav" id="top"></navigationBar>
<view class="container p-bottom" v-if="order.order_id">

  <scroll-view scroll-y="true">

    <!-- 顶部状态栏 -->
    <view class="detail-header dis-flex flex-y-center">
      <view class="header-backdrop">
        <image lazy-load src="/static/images/refund-bg.png"></image>
      </view>
      <view class="header-state f-32 col-f">
        <text>{{ order.state_text }}</text>
      </view>
    </view>

    <!-- 快递配送：配送地址 -->
    <view v-if="order.delivery_type.value == deliverys.EXPRESS.value" class="flow-delivery">
      <view class="flow-delivery__detail dis-flex flex-y-center">
        <view class="detail-location dis-flex">
          <text class="iconfont icon-dingwei"></text>
        </view>
        <view class="detail-content flex-box">
          <view class="detail-content__title dis-flex">
            <text class="f-30">{{ order.address.name }}</text>
            <text class="detail-content__title-phone f-28">{{ order.address.phone }}</text>
          </view>
          <view class="detail-content__describe">
            <text class="col-7">{{order.address.region.province}} {{order.address.region.city}} {{order.address.region.region}} {{order.address.detail}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 上门自提：自提门店 -->
    <block v-if="curDelivery == DeliveryTypeEnum.EXTRACT.value">
      <view class="m-top20 b-f">
        <view class="flow-delivery">
          <view class="flow-delivery__title m-top20">
            <text class="flow-delivery__title-text f-30">自提门店</text>
          </view>
          <view class="flow-delivery__detail dis-flex flex-y-center" @tap.stop="onTargetShop" :data-id="order.extract_shop.shop_id">
            <view class="detail-location dis-flex">
              <text class="iconfont icon-dingwei"></text>
            </view>
            <view class="detail-content flex-box">
              <view class="detail-content__title dis-flex">
                <text class="f-30">{{ order.extract_shop.shop_name }}</text>
              </view>
              <view class="detail-content__describe">
                <text class="col-7">{{order.extract_shop.region.province}} {{order.extract_shop.region.city}} {{order.extract_shop.region.region}} {{order.extract_shop.address}}</text>
              </view>
            </view>
            <view class="detail-arrow dis-flex">
              <text class="iconfont icon-xiangyoujiantou user-orderJtou"></text>
            </view>
          </view>
        </view>
      </view>
      <!-- 自提联系方式 -->
      <view v-if="order.extract.id" class="flow-extract-contact m-top20 b-f">
        <view class="contact-item dis-flex">
          <view class="item_label dis-flex flex-x-end flex-y-center">
            <text>联系人：</text>
          </view>
          <view class="item_ipt flex-box dis-flex flex-y-center">
            <text>{{ order.extract.linkman }}</text>
          </view>
        </view>
        <view class="contact-item dis-flex">
          <view class="item_label dis-flex flex-x-end flex-y-center">
            <text>联系电话：</text>
          </view>
          <view class="item_ipt flex-box dis-flex flex-y-center">
            <text>{{ order.extract.phone }}</text>
          </view>
        </view>
      </view>
    </block>

    <!-- 物流信息 -->
    <view class="flow-all-money b-f padding-box m-top20" v-if="order.delivery_type.value == deliverys.EXPRESS.value && order.delivery_status.value == 20">
      <view class="flow-all-list dis-flex">
        <text >物流信息</text>
      </view>
      <view class="dis-flex">
        <view class="flex-box">
          <view class="dis-flex flow-all-list-cont">
            <text class="col-7">物流公司：{{order.express.express_name}}</text>
          </view>
          <view class="dis-flex flow-all-list-cont">
            <text class="col-7" selectable="true">物流单号：{{order.express_no}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 标题：商品列表 -->
    <view class="flow-all-money b-f padding-box m-top20">
      <view class="flow-all-list dis-flex">
        <text >商品列表</text>
      </view>
      <view class="order-cont dis-flex">
        <view class="order-num">
          <text selectable="true">订单号：{{order.order_no}}</text>
        </view>
        <view class="order-time">
          <text>{{order.create_time}}</text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="padding-box b-f">
      <view @tap.stop="onTargetGoods" class="dis-flex flow-shopList b-f" :data-id="item.goods_id" v-for="(item, index) in order.goods" :key="index">
        <view class="flow-list-left">
          <image lazy-load mode="scaleToFill" :src="item.image.file_path"></image>
        </view>
        <view class="flow-list-right flex-box">
          <!-- 商品名称 -->
          <text class="f-30 col-3 twolist-hidden">{{item.goods_name}}</text>
          <!-- 商品sku信息 -->
          <text class="f-24 col-7">{{item.goods_attr}}</text>
          <!-- 商品数量和单价 -->
          <view class="flow-list-cont dis-flex flex-x-between flex-y-center">
            <text class="small">×{{item.total_num}}</text>
            <text :class="'flow-cont ' + ( item.is_user_grade ? 'price-delete' : '' )">￥{{item.goods_price}}</text>
          </view>
          <!-- 会员折扣价 -->
          <view v-if="item.is_user_grade" class="grade-price">
            <text>{{member}}折扣价：￥{{ item.grade_goods_price }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="select b-f">
      <view class="flow-num-box b-f">
        <text>共{{order.goods.length}}件商品，合计:</text>
        <text class="flow-money col-m">￥{{order.total_price}}</text>
      </view>
    </view>

    <!-- 买家留言 -->
    <view class="flow-all-money b-f m-top20" v-if="order.buyer_remark.length">
      <view class="dis-flex flow-all-list">
        <text class="flex-five">买家留言</text>
      </view>
      <view class="dis-flex flow-all-list-cont" style="padding: 15rpx 0;">
        <text class="col-7">{{ order.buyer_remark }}</text>
      </view>
    </view>

    <!-- 订单金额 -->
    <view class="flow-all-money b-f padding-box m-top20">
      <view class="dis-flex flow-all-list">
        <text class="flex-five">订单金额</text>
      </view>
      <view class="dis-flex flow-all-list-cont">
        <text class="flex-five col-7">商品金额：</text>
        <text class="flex-five col-m t-r">￥{{order.total_price}}</text>
      </view>
      <view v-if="order.coupon_id > 0" class="dis-flex flow-all-list-cont">
        <text class="flex-five col-7">优惠券抵扣：</text>
        <text class="flex-five col-m t-r">-￥{{order.coupon_money}}</text>
      </view>
      <view v-if="order.points_num > 0" class="dis-flex flow-all-list-cont">
        <text class="flex-five col-7">{{ setting.points_name }}抵扣：</text>
        <text class="flex-five col-m t-r">-￥{{order.points_money}}</text>
      </view>
      <view class="dis-flex flow-all-list-cont">
        <text class="flex-five col-7">配送费用：</text>
        <text class="flex-five col-m t-r">+￥{{order.express_price}}</text>
      </view>
      <view class="dis-flex flow-all-list-cont" v-if="order.update_price.value != '0.00'">
        <text class="flex-five col-7">后台改价：</text>
        <text class="flex-five col-m t-r">{{order.update_price.symbol}}￥{{order.update_price.value}}</text>
      </view>
      <view class="dis-flex flow-all-list-cont">
        <text class="flex-five col-7">实付金额：</text>
        <text class="flex-five col-m t-r">￥{{order.pay_price}}</text>
      </view>
    </view>

  </scroll-view>

  <!-- 操作栏 -->
  <view v-if="order.order_status.value != 20" class="flow-fixed-footer b-f">
    <!-- 订单核销 -->
    <view class="flow-btn h3" v-if="order.pay_status.value==20 && order.delivery_type.value == deliverys.EXTRACT.value && order.delivery_status.value == 10">
      <view @tap.stop="onSubmitExtract">确认核销</view>
    </view>
  </view>

</view>
</view>
</template>

<script>
const App = getApp().globalData;
// 枚举类：发货方式
const DeliveryTypeEnum = require("@/utils/enum/DeliveryType.js");

export default {
  data() {
    return {
      member: App.member,
      // 当前页面参数
      options: {},
      // 配送方式
      deliverys: DeliveryTypeEnum
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this,
        scene = getApp().globalData.getSceneData(options); // 记录options


    _this.setData({
      options: scene
    }); // 获取订单详情


    _this.getOrderDetail();
  },

  methods: {
    /**
     * 获取订单详情
     */
    getOrderDetail() {
      let _this = this;

      getApp().globalData._get('shop.order/detail', {
        order_id: _this.options.oid,
        order_type: _this.options.oty
      }, result => {
        _this.setData(result.data);
      });
    },

    /**
     * 跳转到商品详情
     */
    onTargetGoods(e) {
      let goods_id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: '../../goods/index?goods_id=' + goods_id
      });
    },

    /**
     * 跳转到门店详情
     */
    onTargetShop(e) {
      uni.navigateTo({
        url: '../../shop/detail/index?shop_id=' + e.currentTarget.dataset.id
      });
    },

    /**
     * 确认核销
     */
    onSubmitExtract() {
      let _this = this;

      wx.showModal({
        title: "提示",
        content: "确认核销该订单吗？",

        success(o) {
          if (o.confirm) {
            getApp().globalData._post_form('shop.order/extract', {
              order_id: _this.options.oid,
              order_type: _this.options.oty
            }, result => {
              getApp().globalData.showSuccess(result.msg, () => {
                // 获取订单详情
                _this.getOrderDetail();
              });
            });
          }
        }

      });
    }

  }
};
</script>
<style>
@import "./order.css";
</style>