<template>
	<view>
		<view class="gray-bg20"></view>
		<view class="goods-comment">
			<tui-collapse :index="0" :current="current" @click="change">
				<template v-slot:title>
					<tui-list-cell :hover="false" :unlined="true" :size="30" color="#000">购前说明</tui-list-cell>
				</template>
				<template v-slot:content>
					<view class="tui-content intro-wrap">
						<view class="f-28">
							此页面所展示的商品/服务的标题、价格、详情等信息由店铺经营者发布;其真实性、准确性和合法性由店铺经营者负责。如消费者对商品/服务的标题、价格、详情等任何信息有任何疑问，请在购买前与店铺经营者沟通确认。 
						</view>
						<view class="m-t-40 m-b-10 f-28 col-3"> 依法纳税: </view>
						<view class="f-28">依法纳税是每个公司、公民的基本义务。如消费者需要发票,请购买前联系店铺经营者确认。 </view>
						<view class="m-t-40 m-b-10 f-28 col-3"> 划线价格: </view>
						<view class="f-28">商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品曾经展示过的销售价等，并非原价，仅供参考。  </view>
					</view>
				</template>
			</tui-collapse>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
			
		},
		data() {
			return {
				current: -1,
			};
		},
		props: {
		  content: {
		    type: String,
		    default: ''
		  },
		},
		methods: {
			change(e) {
				let index = e.index;
				this.current = this.current == index ? -1 : index
			},
		}
	}
</script>

<style lang="scss" scoped>
	.intro-wrap{
		padding: 0 30rpx 30rpx;
		color: #828393;
	}
	/deep/ .tui-icon-arrow{
		color: #666 !important;
	}
</style>
