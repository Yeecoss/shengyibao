<template>
	<!-- 打单信息弹窗 -->
	<view class="prinit-model">
		<popup-tips ref="popupTips" type="custom" confirmText="复制地址+单号" @tipsClickmask="complete" @cancel="complete"><!-- @tipsClickmask="pageback" -->
			<view class="popTips-title f-32 tb-lr-center">{{titleTxt}}</view>
			<view class="mcontent">
				<view class="address-info p-t-20 p-b-20 pad_lr30 bgf5" v-if="printCon.receiver">
						<view class="f-32 col-3">{{printCon.receiver.name}}  {{printCon.receiver.phone}}</view>
						<view class="f-26 col-6 m-top10">
							{{printCon.receiver.region.province}} {{printCon.receiver.region.city}} {{printCon.receiver.region.region}} {{printCon.receiver.detail}}
						</view>
				</view>
				<view class="dis-flex flex-x-between m-t-20">
					<view class="f-26">
						订单号：{{printCon.order_no}}
					</view>
				</view>
				<view class="dis-flex flex-x-between m-t-20">
					<view class="f-26">
						快递公司：{{express_name}}
					</view>
				</view>
				<view class="dis-flex flex-x-between m-t-20">
					<view class="f-26">
						<!-- <text class="iconfont2 icon-couriernumber m-r-10"></text> -->
						快递单号：{{printCon.express_no}}
					</view>
					<view class="f-28 copy" @tap.stop="clipboard(printCon.express_no)">复制</view>
				</view>
				<view class="dis-flex flex-x-between f-30 m-t-20">
					<view class="f-26">
						<!-- <text class="iconfont2 icon-time1 m-r-10"></text> -->
						打单时间：{{printCon.now_time}}
					</view>
				</view>
			</view>
		</popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			popupTips,
		},
		data() {
			return {
				titleTxt:'详情',
				printCon: '',
				next: null,
				express_name:''
			}
		},
		methods: {
			_open(data, next){
				this.printCon = data || ''
				this.titleTxt = data.express_type==4?'预约成功':'打印成功';
				if(data.express_type==4){
					this.express_name = data.express.express_name||''
				}else{
					this.express_name = data.customer.express_name||''
				}
				this.next = next || null
				this.$refs.popupTips.open(() => {
					let data = this.printCon.receiver.name +' ' + this.printCon.receiver.phone +' ' + this.printCon.receiver.region.province +' ' + this.printCon.receiver.region.city +' ' + this.printCon.receiver.region.region +' ' + this.printCon.receiver.detail +' '+ this.express_name +'：'+ this.printCon.express_no;
					this.clipboard(data);
				})
			},
			complete(){
				this.$emit('complete')
			},
			//复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
		}
	}
</script>

<style lang="scss">
	// 打单信息
	.mcontent{
		padding:	40rpx 40rpx 36rpx;
		max-height: 300px;
		overflow: hidden;
		overflow-y: auto;
	}
	.copy{color: #F8B14A;}
</style>
