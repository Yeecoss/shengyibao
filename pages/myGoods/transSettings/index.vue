<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="交易设置" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox" style="background:white">
				
				<block v-for="(item, index) in field" :key="index">
					<view class="list dis-flex">
						<view class="label f-28">{{item.title}}</view>
						<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem(item.fieldName)">
							<view :class="formData[item.fieldName]?'':'col-9'">{{formData[item.fieldName]?formData[item.fieldName]:item.name}}</view>
							<text class="col-9">天后自动关闭</text>
						</view>
					</view>
					<!-- 注意 -->
					<view class="notes f-24 col-9 dis-flex">
						<text class="iconfont2 icon-jingshi f-24"></text>{{item.notes}}
					</view>
				</block>
				
				<!-- 运费组合策略 -->
				<radio-group @change="radioChange" class="list">
					<view class="label f-28 m-bot20">运费组合策略</view>
					<block v-for="(item,index) in freights" :key="index">
						<view class="control flex-box dis-flex flex-y-center">
							<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value" :checked="item.checked"></radio>
							<label :for="item.value"><text>{{item.name}}</text></label>
						</view>
						<!-- 注意 -->
						<view class="notes flex-box f-24 col-9 dis-flex nopad" style="background:white">
							<text class="iconfont2 icon-jingshi f-24"></text>{{item.notes}}
						</view>
					</block>
				</radio-group>
				
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
		
		<popup-input :title="ptitle" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	export default {
		components: {
			popupInput,
		},
		data() {
			return {
				ptitle: '',//弹窗输入标题
				index: 1,//提示框
				maxlength: '-1',
				inputType: '',
				formData: {
					unpaidOrders: '',//未支付订单
					shippedOrder:'',//已发货订单
					completedOrder: '',//已完成订单
					freight: 1,//运费组合策略
				},
				// 字段
				field: {
				  unpaidOrders:  {
				    type: 'number',
				    title: '未支付订单',
						name:'请输入',
						tip: '天后自动关闭',
				    fieldName: 'unpaidOrders',
						notes: '订单下单未付款，n天后自动关闭，设置0天不自动关闭'
				  },
					shippedOrder: {
				    type: 'number',
				    title: '已发货订单',
						name:'请输入',
				    fieldName: 'shippedOrder',
						notes: '如果在期间未确认收货，系统自动完成收货，设置0天不自动收货'
					},
					completedOrder: {
				    type: 'number',
				    title: '已完成订单',
						name:'请输入',
				    fieldName: 'completedOrder',
						notes: '订单完成后 ，用户在n天内可以发起售后申请，设置0天不允许申请售后'
					},
				},
				freights:[{
				  name: '叠加',
				  checked: true,
				  value: '1',
					notes: '订单中的商品有多个运费模板时，将每个商品的运费之和订为订单总运费'
				}, 
				// {
				//   name: '以最低运费结算',
				//   checked: false,
				//   value: '2',
				// 	notes: '订单中的商品有多个运费模板时，取订单中运费最少的商品的运费计为订单总运费'
				// }, {
				//   name: '以最高运费结算',
				//   checked: false,
				//   value: '3',
				// 	notes: '订单中的商品有多个运费模板时，取订单中运费最多的商品的运费计为订单总运费'
				// },
				],
				
			}
		},
		onLoad() {
			this.getInfo();
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				app._post_form('shop.setting/trade',{
					close_days: that.formData.unpaidOrders,
					receive_days: that.formData.shippedOrder,
					refund_days: that.formData.completedOrder,
					freight_rule: that.formData.freight == 1? 10: that.formData.freight == 2? 20: 30,
				},res => {
					that.$api.msg(res.msg);
					setTimeout(()=>{uni.navigateBack()},1500)
				})
			},
			getInfo(){
				let that = this;
				app._get('shop.setting/trade', {}, res => {
					let values = res.data.values;
					that.formData.unpaidOrders = values.order.close_days;
					that.formData.shippedOrder = values.order.receive_days;
					that.formData.completedOrder = values.order.refund_days;
					that.formData.freight = values.freight_rule == 10? 1: values.freight_rule == 20? 2: 3;
					that.freights.map(item => {
						item.checked = false;
					})
					that.freights[that.formData.freight-1].checked = true;
				})
			},
			// 输入
			openItem(fieldName) {
				let field = this.field[fieldName];
				this.inputType = field.type;
				this.ptitle = field.name;
				this.maxlength = field.maxlength || '-1';
				this.$refs.popupInput._open(this.formData[fieldName], (val) => {
					this.formData[fieldName] = val;
				})
			},
			radioChange(e){
				this.formData.freight = e.detail.value;
			},
			
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	.container .listBox .list .label.f-28{
		font-size: 28rpx;
	}
	.nopad{padding-left: 0;padding-right: 0;}
	.m-bot20{margin-bottom: 20rpx;}
	.radioItem{margin-left: -12rpx;}
</style>
