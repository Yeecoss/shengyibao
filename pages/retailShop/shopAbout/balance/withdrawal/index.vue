<template>
	<view class="bgf5 min_h_100 wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="提现" extClass="nav" id="top"></navigationBar>
		<view class="mian">
			<view class="top-title f-28 t-c m-top30 m-b-30">
				<text class="m-r-10 col-3">{{available_amount}}</text>元
			</view>
			<view class="tixian-wrap bgf radius16">
				<view class="ifAll dis-flex flex-y-center flex-x-between">
					<view class="f-28 col-6">提现余额</view>
					<view class="f-24 all-btn t-c app-red" @tap="totalMomey">全部提现</view>
				</view>
				<view class="dis-flex moneyVal">
					<text class="f-48">¥</text>
					<input class="flex-box m-l-10 f-28" type="digit" v-model="moneyVal" @blur="numberVal"/>
				</view>
			</view>
			<view class="operate-wrap">
				<button @tap="withdrawal" :disabled="disabled" class="operate-item toMerchant">确认提现</button>
			</view>
			<!-- 链接 -->
			<navigator class="navigateTo dis-flex flex-y-center flex-x-between wrap30" url="/pages/retailShop/shopAbout/balance/withdrawal/list" hover-class="none">
				提现记录<text class="iconfont2 icon-gengduobeifen2 f-24"></text>
			</navigator>
		</view>
		
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			popupTips,
		},
		data() {
			return {
				index: 1,//提示框
				mtitle:'',
				mcontent:'',
				available_amount: 0,//可提现金额
				moneyVal: '',
				// disabled: true,
			}
		},
		onLoad() {
			this.getMoney()
		},
		computed:{
			disabled(){
				let isshow = true;
				if((0<this.moneyVal) && (this.moneyVal<=this.available_amount)){
					isshow = false
				}else{
					isshow = true;
				}
				return isshow
			}
		},
		methods: {
			// 获取商户实时余额
			getMoney(){
				app._get('shop.commerce.amount/merchantCurrentBalance',{}, res => {
					this.available_amount = res.data.available_amount||0;
				});
			},
			withdrawal(){
				this.mtitle = '提现金额'
				this.mcontent = this.moneyVal;
				this.$refs.popupTips.open(()=>{
					let data = {
						amount: this.moneyVal
					}
					app._post_form('shop.commerce.fund/withdrawApply',data, res => {
						this.$refs.toast.showTips({msg: res.msg});
						if(res.code==1){
							this.getMoney()
						}
					})
				})
			},
			numberVal(){
				this.moneyVal = Number(this.moneyVal).toFixed(2)
			},
			totalMomey(){
				this.moneyVal = this.available_amount
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
