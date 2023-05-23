<template>
<view class="bgf5">
<!-- 自定义标题栏 -->
  <navigationBar id="top" extClass="nav" title="订单详情" color="#fff" background="linear-gradient(to right,#FF7541,#F55B5B)"></navigationBar>
  <scroll-view scroll-y="true" :style="'height: ' + scrollHeight + 'px;'">
    <view class="main p-bottom" v-if="order.order_id">
        <!-- 顶部状态栏 -->
				<view class="order-state">
					<view class="col-f f-44 pad_lr30">{{ order.order_status.text }}</view>
					<view class="col-f state-text f-28 pad_lr30">{{order.order_status.value==41?'请及时处理订单':''}}</view>
				</view>

        <!-- 快递配送：配送地址 -->
				<view class="buyer_wrap bgf pad_lr30" v-if="order.address">
					<view class="address dis-flex flex-y-center flex-x-between">
						<view class="address-type f-26 col-9"><text class="iconfont2 icon-address"></text></view>
						<view class="address-info">
								<view class="f-w f-28 col-3 dis-flex flex-y-center flex-x-between">
									{{order.address.name}}  {{order.address.phone}} 
								</view>
								<view class="f-28 col-6 m-top10" v-if="order.address.region">{{order.address.region.province}} {{order.address.region.city}} {{order.address.region.region}} {{order.address.detail}}</view>
						</view>
					</view>
				</view>
        <!-- 标题：商品信息 -->
        <view class="flow-all-money b-f padding-box m-t-20">
          <view class="flow-all-list dis-flex">
            <!-- <text >商品信息</text> -->
						<view class="shop_info col-3 f-32">
							<image class="m-r-10 fl" :src="order.wxapp.logo" mode="aspectFill"></image>
							<text>{{order.wxapp.name}}</text>
							<text class="iconfont2 icon-gengduobeifen2 f-24 m-l-10"></text>
						</view>
          </view>
        </view>

        <!-- 商品详情 -->
        <view class="checkout_list">
					<template v-for="(item, index) in order.goods">
						<view class="flow-shopList dis-flex flex-wrap b-f padding-box bgf" :key="index" @tap.stop="onTargetGoods(item.wxapp_goods_id)">
							<view class="flow-list-left m-r-20">
								<image lazy-load mode="aspectFill" :src="item.goods_image"></image>
							</view>
							<view class="flow-list-right flex-box">
								<!-- 商品名称 -->
								<text class="f-28 col-3 twolist-hidden">{{item.goods_name}}</text>
								<!-- 商品sku信息 -->
								<view class="goods_attr f-24 col-7 onelist-hidden" v-if="item.goods_attr">{{item.goods_attr}}</view>
								<view class="goods-status app-red f-28 m-top10" v-if="order.order_status.value!=41">{{item.order_status?item.order_status.text:''}}</view>
							</view>
							<view class="pri_num m-l-20">
								<view class="goods-price">
									<text class="f-28 col-3">￥{{ item.goods_price }}</text>
								</view>
								<view class="goods-num">
									<text class="f-28 col-3">×{{ item.total_num }}</text>
								</view>
							</view>
						</view>
						<!-- 申请售后 -->
						<view class="dis-flex flex-x-end padding-box bgf p-b-40" style="width: 100%;" v-if="item.order_status&&item.order_status.value>=42">
							<view class="btn-default" v-if="item.order_status&&item.order_status.value==43 &&!item.refund" @tap.stop="onApplyRefund(order,item)">申请售后</view>
							<template v-if="item.order_status&&(order.order_status.value==42||item.order_status.value==43)">
								<view class="btn-main" v-if="item.express_no&&item.express_no!=''" @tap.stop="toExpress(item)">查看物流</view>
							</template>
							<template v-if="item.order_status&&item.order_status.value==43">
								<view class="btn-main" v-if="item.is_comment==0" @tap.stop="comment(item)">去评价</view><!-- -->
							</template>
						</view>
						<!-- 快递 -->
						<view class="container" style="width: 100%;" v-if="item.express_no&&item.express_no!=''">
							<view class="listBox bgf">
								<view class="list dis-flex">
									<view class="label">快递名称</view>
									<view class="control">
										<text class="f-30">{{item.express_company||'无'}}</text>
									</view>
									<view class="listLine"></view>
								</view>
								<view class="list dis-flex">
									<view class="label">快递单号</view>
									<view class="control dis-flex flex-y-center flex-x-between">
										<text class="f-30">{{item.express_no||'无'}}</text>
										<view class="scan app-red" @tap.stop="copy(item.express_company+item.express_no)">
											复制物流
										</view>
									</view>
								</view>
								<view class="list dis-flex">
									<view class="label">发货时间</view>
									<view class="control dis-flex flex-y-center flex-x-between">
										<text class="f-30">{{item.delivery_time}}</text>
									</view>
								</view>
							</view>
						</view>
					</template>
					<view class="order-box b-f padding-box border-top">
						<view class="order-btn">
							<view class="text dis-flex flex-y-center flex-x-end">
								<text class="f-28 col-3">共{{order.total_num}}件，合计：</text>
								<text class="col-m f-28">￥{{order.total_price||0}}</text>
							</view>
						</view>
					</view>
        </view>
				

        <!-- 订单金额 -->
        <view class="flow-all-money b-f padding-box m-t-20">
          <view class="dis-flex flow-all-list-cont">
            <text class="flex-five col-3">订单总价</text>
            <text class="flex-five col-3 t-r">￥{{order.total_price}}</text>
          </view>
          <view class="dis-flex flow-all-list-cont">
            <text class="flex-five col-3">配送费用</text>
            <text class="flex-five col-3 t-r">+￥{{ order.express_price }}</text>
          </view>
          <view v-if="order.coupon_id > 0" class="dis-flex flow-all-list-cont">
            <text class="flex-five col-3">优惠券抵扣</text>
            <text class="flex-five col-m t-r">-￥{{ order.coupon_money }}</text>
          </view>
          <!-- <view v-if="order.points_num > 0" class="dis-flex flow-all-list-cont">
            <text class="flex-five col-3">{{ setting.points_name }}抵扣：</text>
            <text class="flex-five col-m t-r">-￥{{ order.points_money }}</text>
          </view> -->
          <!-- <view class="dis-flex flow-all-list-cont" v-if="order.update_price.value != '0.00'">
            <text class="flex-five col-3">后台改价</text>
            <text class="flex-five col-m t-r">{{order.update_price.symbol}}￥{{order.update_price.value}}</text>
          </view> -->
        </view>
        <view class="flow-all-money b-f padding-box m-t-20">
          <view class="dis-flex flow-all-list-cont" style="border:none">
            <text class="flex-five col-3">实付金额</text>
            <text class="flex-five col-m t-r">￥{{order.pay_price}}</text>
          </view>
        </view>
        <!-- 订单编号 -->
        <view class="flow-all-money b-f padding-box m-t-20 f-24">
          <view class="dis-flex flow-all-list-cont">
            <text class="flex-five col-3">订单号：</text>
            <text class="flex-five col-3 t-r">{{order.order_no}}</text>
          </view>
          <view class="dis-flex flow-all-list-cont">
            <text class="flex-five col-3">下单时间：</text>
            <text class="flex-five col-3 t-r">{{order.create_time}}</text>
          </view>
        </view>
        <!-- 买家留言 -->
        <view class="flow-all-money b-f m-t-20">
          <view class="flow-all-list">
            <text class="flex-five">订单留言：</text><text class="col-6">{{ order.buyer_remark ||'无'}}</text>
          </view>
        </view>

      <!-- 操作栏 -->
			<view class="flow-fixed-footer-box" v-if="order.order_status.value>=41">
				<view class="flow-fixed-footer pad_lr30 b-f dis-flex flex-x-end flex-y-center">
				    <!-- 取消订单 -->
				    <view class="flow-btnn" v-if="order.order_status.value==41">
				      <text @tap.stop="cancelOrder">取消订单</text>
				    </view>
						<view class="flow-btnr" v-if="order.order_status.value==41">
							<view @tap.stop="shareOrderInfo">去支付</view>
						</view>
						<view class="flow-btnr" v-if="order.order_status.value==42">
							<view @tap.stop="receipt">确认收货</view>
						</view>
				    <view class="flow-btnn" v-if="order.order_status.value==43 ||order.order_status.value==44">
				      <text @tap.stop="deleteOrder">删除订单</text>
				    </view>
						<view class="flow-btnr" v-if="order.order_status.value==43">
							<view @tap.stop="buyOne">再来一单</view>
						</view>
				    <!-- 订单付款 -->
				    <!-- <view class="flow-btnr" v-if="order.order_status.value==41">
				      <text @tap.stop="onPayOrder">去支付</text>
				    </view> -->
				</view>
			</view>

      <!-- 支付方式弹窗 -->
      <zan-popup :show="showPayPopup" @close="onTogglePayPopup">
        <view class="pop-orderPay pop-example__container">
          <view class="pop-title">
            <text class="f-30">请选择支付方式</text>
          </view>
          <view class="pop-content">
            <view class="pay-method">
              <!-- <form @submit="onSelectPayType" :data-value="PayTypeEnum.WECHAT.value" report-submit="true">
                <button formType="submit" class="btn-normal">
                  <view class="pay-item dis-flex flex-x-between">
                    <view class="item-left dis-flex flex-y-center">
                      <view class="item-left_icon wechat">
                        <text class="iconfont icon-weixinzhifu"></text>
                      </view>
                      <view class="item-left_text">
                        <text>{{ PayTypeEnum.WECHAT.name }}</text>
                      </view>
                    </view>
                  </view>
                </button>
              </form> -->
              <form @submit="onSelectPayType" :data-value="PayTypeEnum.BALANCE.value" report-submit="true">
                <button formType="submit" class="btn-normal">
                  <view class="pay-item dis-flex flex-x-between">
                    <view class="item-left dis-flex flex-y-center">
                      <view class="item-left_icon balance">
                        <text class="iconfont icon-qiandai"></text>
                      </view>
                      <view class="item-left_text">
                        <text>{{ PayTypeEnum.BALANCE.name }}</text>
                      </view>
                    </view>
                  </view>
                </button>
              </form>
            </view>
          </view>
        </view>
      </zan-popup>


    </view>
  </scroll-view>
</view>
</template>

<script>
const app = getApp().globalData; // 枚举类：发货方式
const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
// 枚举类：发货方式
import DeliveryTypeEnum from "../../utils/enum/DeliveryType"; // 枚举类：支付方式
// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType';
import zanPopup from "../../components/popup/index";

export default {
  data() {
    return {
      // 配送方式
      DeliveryTypeEnum,
      // 支付方式
      PayTypeEnum,
      order_id: null,
      order: {},
      setting: {},
      showPayPopup: false,
      scrollHeight: 0
    };
  },

  components: {
    zanPopup,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.order_id = options.order_id; // 获取订单详情
    this.$nextTick(() => {
      this.setListHeight()
    })
  },
	onShow() {
		this.getOrderDetail(this.order_id);
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
        scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度
        this.scrollHeight = scrollHeight
      });
    },
    /**
     * 获取订单详情
     */
    getOrderDetail(order_id) {
      let _this = this;

      app._get('user.order/detail', {
        order_id
      }, result => {
				_this.order = result.data.detail;
      });
    },
		//删除订单
		deleteOrder(){
			let that = this;
			uni.showModal({
			  title: "提示",
			  content: "确认删除订单？",
			
			  success(o) {
			    if (o.confirm) {
						app._post_form('user.order/delete', {
							order_id: that.order_id
						}, res => {
							that.$api.msg(res.msg)
							if(res.code==1){
								uni.navigateBack()
							}
						});
			    }
			  }
			});
		},
    /**
     * 跳转到商品详情
     */
    onTargetGoods(id) {
      uni.navigateTo({
        url: '../goods/index?goods_id=' + id
      });
    },

    /**
     * 取消订单
     */
    cancelOrder(e) {
      let _this = this;

      let order_id = _this.order_id;
      wx.showModal({
        title: "提示",
        content: "确认取消订单？",

        success(o) {
          if (o.confirm) {
            app._post_form('user.order/cancel', {
              order_id
            }, result => {
              wx.navigateBack();
            });
          }
        }
      });
    },

    /**
     * 确认收货
     */
    receipt(e) {
      let _this = this;

      let order_id = _this.order_id;
      wx.showModal({
        title: "提示",
        content: "确认收到商品？",
				confirmColor:'#FF7541',

        success(o) {
          if (o.confirm) {
            app._post_form('user.order/receipt', {
              order_id
            }, result => {
              _this.getOrderDetail(order_id);
            });
          }
        }

      });
    },

    /**
     * 申请售后
     */
    onApplyRefund(order,item) {
      uni.navigateTo({
        url: './refund/apply/apply?order_goods=' + encodeURIComponent(JSON.stringify(item))+'&order=' + encodeURIComponent(JSON.stringify(order))
      });
    },

    /**
     * 跳转到门店详情
     */
    onTargetShop(e) {
      uni.navigateTo({
        url: '../shop/detail/index?shop_id=' + e.currentTarget.dataset.id
      });
    },

    /**
     * 点击付款按钮
     */
    onPayOrder(e) {
      let _this = this; // 显示支付方式弹窗


      _this.onTogglePayPopup();
    },

    /**
     * 选择支付方式
     */
    onSelectPayType(e) {
      let _this = this; // 记录formId


      app.saveFormId(e.detail.formId); // 隐藏支付方式弹窗

      _this.onTogglePayPopup();

      if (!_this.showPayPopup) {
        // 发起付款请求
        _this.payment(e.currentTarget.dataset.value);
      }
    },

    /**
     * 显示/隐藏支付方式弹窗
     */
    onTogglePayPopup() {
      this.setData({
        showPayPopup: !this.showPayPopup
      });
    },

    /**
     * 发起付款请求
     */
    payment(payType) {
      let _this = this,
          orderId = _this.order_id; // 显示loading


      wx.showLoading({
        title: '正在处理...'
      });

      app._post_form('user.order/pay', {
        order_id: orderId,
        payType
      }, result => {
        if (result.code === -10) {
          app.showError(result.msg);
          return false;
        } // 发起微信支付


        // if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
        //   app.wxPayment({
        //     payment: result.data.payment,

        //     success() {
        //       _this.getOrderDetail(orderId);
        //     },

        //     fail() {
        //       app.showError(result.msg.error);
        //     }

        //   });
        // }
        // 余额支付


        if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
          app.showSuccess(result.msg.success, () => {
            _this.getOrderDetail(orderId);
          });
        }
      }, null, () => {
        wx.hideLoading();
      });
    },
		// 再来一单
		async buyOne(){
			// let isbuy = await this.addCar();
			var isbuy = 0;
			for (let i = 0; i < this.order.goods.length; i++) {
				let item = this.order.goods[i];
				app._post_form('cart/add', {
				  wxapp_goods_id: item.wxapp_goods_id,
				  goods_num: item.total_num,
				  goods_sku_id: item.spec_sku_id
				}, res => {
				  if(res.code==1){
						isbuy = isbuy + 1;
						if(isbuy>=this.order.goods.length){
							this.getIds()
						}
					}
				});
			}
		},
		addCar(){
			var isbuy = 0;
			for (let i = 0; i < this.order.goods.length; i++) {
				let item = this.order.goods[i];
				app._post_form('cart/add', {
				  wxapp_goods_id: item.wxapp_goods_id,
				  goods_num: item.total_num,
				  goods_sku_id: item.spec_sku_id
				}, res => {
				  if(res.code==1){
						isbuy = isbuy + 1;
					}
				});
			}
			return isbuy
		},
		getIds(){
			let arrIds = [];
			for (let i = 0; i < this.order.goods.length; i++) {
				let item = this.order.goods[i];
				arrIds.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
			}
			uni.navigateTo({
			  url: '../flow/checkout?order_type=cart&cart_ids=' +arrIds + '&wxapp_id='+ this.order.wxapp_id
			});
		},
		copy(data){
			thorui.getClipboardData(data, (res) => {
				// #ifdef H5 || MP-ALIPAY
				if (res) {
					this.$api.msg("复制成功")
				} else {
					this.$api.msg("复制失败")
				}
				// #endif
			});
		},
		//查看物流
		toExpress(item){
			let express = {
				express_company: item.express_company || '',
				express_no: item.express_no || ''
			};
			
			// let express = {
			// 	express_no: item.express_no||''
			// };
			// if(item.express_type==4){
			// 	express.express_company = item.express.express_name||''
			// }else{
			// 	express.express_company = item.customer.express_name||''
			// }
			let goods = {
				file_path: item.file_path,
				goods_num: item.total_num
			};
			uni.navigateTo({
				url: '/pages/order/express/express?order_no=' + item.suborder.order_no + '&express=' + encodeURIComponent(JSON.stringify(express)) + '&goods=' + encodeURIComponent(JSON.stringify(goods))
			})
		},
		//订单评价
		comment(item){
			uni.navigateTo({
			  url: './comment/comment?order_id=' + item.order_id+ '&order_goods_id='+item.order_goods_id + '&wxapp_goods_id='+ item.wxapp_goods_id
			});
		},
		//订单分享页
		shareOrderInfo(){
			app._get('xr_order/shareOrderInfo', {order_id: this.order_id}, res => {
				let shareOrderInfo = res.data;
				shareOrderInfo.wxapp_user.service_qrcode = shareOrderInfo.wxapp.service_qrcode;
				uni.redirectTo({
					url: '/pages/order/success/index?data='+ encodeURIComponent(JSON.stringify(shareOrderInfo))
				})
			})
		},
  }
};
</script>
<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import "./detail";
</style>