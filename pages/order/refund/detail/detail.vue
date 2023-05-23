<template>
	<view v-if="detail.order_refund_id" class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar extClass="nav" title="售后详情"></navigationBar>
		
		<view class="container">
			<!-- 顶部状态栏 -->
			<view class="order-state">
				<view class="col-f f-44 pad_lr30">{{ detail.status.text }}</view>
			</view>
		</view>
		<!-- 快递配送：配送地址 -->
		<view class="buyer_wrap bgf pad_lr30" v-if="detail.is_agree.value == 10 && detail.address">
			<view class="buyer_title f-30 col-3">退货地址</view>
			<view class="address dis-flex flex-y-center flex-x-between m-t-20">
				<view class="address-type f-26 col-9"><text class="iconfont2 icon-address"></text></view>
				<view class="address-info">
						<view class="f-w f-28 col-3 dis-flex flex-y-center flex-x-between">
							{{detail.address.name}}  {{detail.address.phone}} 
						</view>
						<view class="f-28 col-6 m-top10">
							{{detail.region?detail.region.province+detail.region.city+detail.region.region:''}}{{detail.address.detail}}
						</view>
						<!-- <view class="f-28 col-6 m-top10" v-if="detail.address.region">{{detail.address.region.province}} {{detail.address.region.city}} {{detail.address.region.region}} {{detail.address.detail}}</view> -->
				</view>
			</view>
		</view>
		<!-- 快递 -->
		<view class="container" v-if="detail.type.value == 10 && detail.is_agree.value == 10">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">快递名称</view>
					<view class="control" v-if="detail.express_name">
						<text class="f-30">{{detail.express_name}}</text>
					</view>
					<view class="control" v-else @tap.stop="openItem('express')">
						<text class="f-30" :class="express?'':'col-9'">{{express?express:'选择物流公司'}}</text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">快递单号</view>
					<view class="control" v-if="detail.express_no">
						<text class="f-30">{{detail.express_no}}</text>
					</view>
					<view class="control" v-else @tap.stop="openItem('express_no')">
						<text class="f-30" :class="express_no?'':'col-9'">{{express_no?express_no:'输入快递单号'}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="checkout_list padding-box bgf">
		  <view class="flow-shopList dis-flex flex-wrap b-f" v-for="(item,index) in detail.refund_goods" :key="item.wxapp_goods_id" @tap.stop="onGoodsDetail(item.wxapp_goods_id)">
		    <view class="flow-list-left m-r-20">
		      <image lazy-load mode="scaleToFill" :src="item.goods_image"></image>
		    </view>
		    <view class="flow-list-right flex-box">
		      <!-- 商品名称 -->
		      <text class="f-28 col-3 onelist-hidden">{{item.goods_name}}</text>
		      <view class="goods-price f-28 col-6">￥{{ item.goods_price }}</view>
		      <!-- 商品sku信息 -->
		      <view class="goods_attr f-28 col-6 onelist-hidden">{{item.goods_sku_name||''}}</view>
		    </view>
		  </view>
		</view>
		
		<view class="container">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">申请原因</view>
					<view class="control text-right">
						<text class="col-3 f-30">{{ detail.apply_desc }}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label">退款金额</view>
					<view class="control text-right">
						<text class="col-3 f-30">￥{{detail.refund_money}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label">申请件数</view>
					<view class="control text-right">
						<text class="col-3 f-30">{{detail.goods_total_num}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label">订单号</view>
					<view class="control text-right">
						<text class="col-3 f-30">{{detail.order_no}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label">提交时间</view>
					<view class="control text-right">
						<text class="col-3 f-30">{{detail.create_time}}</text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list">
					<view class="control">
						<text class="f-30">订单留言：</text>
						<text class="col-6 f-30">{{ detail.user_remark ||'无'}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 已退款金额 -->
		<!-- <view v-if="detail.status.value == 10 && detail.is_agree.value == 10" class="detail-order b-f row-block dis-flex flex-x-end flex-y-center">
			<text >已退款金额：</text>
			<text class="col-m">￥{{ detail.refund_money }}</text>
		</view> -->

		<!-- 售后信息 -->
		<!-- <view v-if="detail.status.value == 30" class="detail-refund b-f m-top20">
			<view class="detail-refund__row dis-flex">
				<view class="text">
					<text class="col-m">拒绝原因：</text>
				</view>
				<view class="flex-box">
					<text>{{ detail.refuse_desc||'' }}</text>
				</view>
			</view>
		</view> -->
		
		<!-- 操作栏 -->
		<view class="flow-fixed-footer-box" v-if="detail.status.value==0||(detail.type.value == 10 && detail.is_agree.value == 10)">
			<view class="flow-fixed-footer pad_lr30 b-f dis-flex flex-x-end flex-y-center">
			    <!-- 取消售后 -->
			    <view class="flow-btnn" v-if="detail.status.value==0">
			      <text @tap.stop="cancelRefund(order_refund_id)">取消售后</text>
			    </view>
			    <!-- 提交物流 -->
			    <view class="flow-btnn" v-if="detail.type.value == 10 && detail.is_agree.value == 10 && !detail.express_no">
			      <text @tap.stop="onSubmit">提交</text>
			    </view>
			</view>
		</view>
		<!-- 填写物流信息 -->
		<!-- <form v-if="detail.type.value == 10 && detail.is_agree.value == 10 && detail.is_user_send == 0" @submit="onSubmit" report-submit>
			<view class="detail-express b-f m-top20">
				<view class="form-group dis-flex flex-y-center">
					<view class="field">物流公司：</view>
					<view class="flex-box">
						<picker mode="selector" @change="onExpressChange" :range="expressList" range-key="express_name" name="express_id" :value="expressList[expressIndex].express_id">
							<text v-if="expressIndex > -1">{{ expressList[expressIndex].express_name }}</text>
							<text v-else class="col-80">请选择物流公司</text>
						</picker>
					</view>
				</view>
				<view class="form-group dis-flex flex-y-center">
					<view class="field">物流单号：</view>
					<view class="flex-box">
						<input placeholder="请填写物流单号" name="express_no"/>
					</view>
				</view>
			</view>

			确认发货
			<view class="padding-box profile-btn">
				<button formType="submit" :disabled="disabled">确认发货</button>
			</view>
		</form> -->

		<popup-input :title="ptitle" ref="popupInput"></popup-input>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
const app = getApp().globalData;
import popupInput from '@/components/popup-input/index';
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      // 售后单id
      order_refund_id: null,
      // 订单详情
      detail: {},
			express: '',//物流公司
			express_no: '',//物流单号
      // expressList: [],
      // 物流公司索引
      // expressIndex: -1
			ptitle: '',//弹窗输入标题
			mtitle: '',
			mcontent: '',
    };
  },

  components: {
		popupInput,
		popupTips
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // 记录页面参数
    this.order_refund_id = options.order_refund_id; // 获取售后单详情

    this.getRefundDetail();
  },
  methods: {
		// 提交物流
		onSubmit() {
		  let that = this;
			if(that.express_no==''){
				that.$api.msg('快递单号不能为空！');
				return false;
			}
			uni.showLoading({
			  title: '正在处理...',
			  mask: true
			}); 
			app._post_form('user.refund/addUserExpress',{
				refund_id: that.order_refund_id,
				express_name: that.express,
				express_no: that.express_no,
			},res => {
				that.$api.msg(res.msg);
				that.getRefundDetail();
			},false, res=>{
				uni.hideLoading(); // 解除禁用
				that.$api.msg(res.msg);
			});
		},
		//取消售后
		cancelRefund(refund_id){
			this.mtitle = '提示';
			this.mcontent = '确定取消售后？';
			this.$refs.popupTips.open(()=>{
				app._post_form('user.refund/cancelRefund',{refund_id: refund_id},res => {
					if(res.code==1){
						this.$api.msg(res.msg);
						this.getRefundDetail();
					}
				});
			})
		},
    /**
     * 获取售后单详情
     */
    getRefundDetail() {
      let _this = this;

      app._get('user.refund/detail', {
        refund_id: this.order_refund_id
      }, res => {
        _this.detail = res.data;
      });
    },

    /**
     * 跳转商品详情
     */
    onGoodsDetail (e) {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + e
      });
    },

    /**
     * 凭证图片预览
     */
    // previewImages: function (e) {
    //   let imageUrls = [];
    //   this.detail.image.forEach(function (item) {
    //     imageUrls.push(item.file_path);
    //   });
    //   wx.previewImage({
    //     current: imageUrls[e.target.dataset.index],
    //     urls: imageUrls
    //   });
    // },
		
		// 输入
		openItem(fieldName) {
			let that = this;
			that.ptitle = fieldName=='express'?'选择物流公司':'输入快递单号';
			that.$refs.popupInput._open(that[fieldName], (val) => {
				that[fieldName] = val;
			});
		},
  }
};
</script>
<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import "../../detail";
	@import 'detail';
</style>