<template>
	<div class="pageBox">
		<navigationBar background="transparent" color="white" ref="navigationBar" title="标识解析"></navigationBar>
		<view class="circular_bg"></view>
		<view class="circular_bg1"></view>
		<div class="imagList dis-flex flex-y-center flex-wrap flex-x-between">
			<div v-for="(item, index) in list" :key="index" @tap.stop="showTips(item)">
				<div class="imgItem dis-flex flex-y-center flex-x-center">
					<div class="imgBox" :style="{width: item.width + 'rpx', height: item.height + 'rpx'}">
						<image :src="item.img" mode="aspectFit"></image>
					</div>
				</div>
				<div class="title">
					{{item.content}}
				</div>
			</div>
		</div>
		<popup-tips ref="popupTips" :title="title" :content="tip"></popup-tips>
	</div>
</template>
<script>
	import popupTips from '@/components/popup-tips/index';
	let App = getApp().globalData;
	export default {
		data() {
			return {
				tip: '',
				title: '',
				list: [{
					img: 'http://pic.kaidanxia.com/2020-08-06/202008060944399bda78839.png',
					content: '消费等级',
					tip: '消费一次一颗钻，消费满1000两颗钻，消费满10000三颗钻',
					width: 90,
					height: 73
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093705dcd3c3313.png',
					content: '店铺等级',
					tip: '完成订单数量满10一个皇冠，满100两个皇冠，满1000三个皇冠',
					width: 80,
					height: 80
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093703f4dff2758.png',
					content: '企业认证',
					tip: '进行过企业认证的店铺',
					width: 80,
					height: 80
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093705bce4d6987.png',
					content: '身份认证',
					tip: '进行过身份信息上传的店铺',
					width: 128,
					height: 40
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093701e776a3750.png',
					content: '虾米' + App.member,
					tip: '终身免费' + App.member,
					width: 128,
					height: 40
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
					content: '明虾' + App.member,
					tip: '普通vip' + App.member,
					width: 128,
					height: 40
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093702403126378.png',
					content: '龙虾' + App.member,
					tip: '高级vip' + App.member,
					width: 128,
					height: 40
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/202008060937045400d7792.png',
					content: '虾米' + App.member,
					tip: '终身免费' + App.member,
					width: 210,
					height: 210
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/202008060937048bd2d4908.png',
					content: '明虾' + App.member,
					tip: '普通vip' + App.member,
					width: 210,
					height: 210
				}, {
					img: 'http://pic.kaidanxia.com/2020-08-06/20200806093703149b26146.png',
					content: '龙虾' + App.member,
					tip: '高级vip' + App.member,
					width: 210,
					height: 210
				}]
			};
		},

		components: {
			popupTips
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
		},
		mounted() {},
		methods: {
			showTips(item) {
				this.title = item.content
				this.tip = item.tip
				this.$refs.popupTips.open()
			}
		}
	}
</script>
<style lang="scss" scoped>
.pageBox{
	position: relative;
	padding-top: 140rpx;
	.circular_bg{
		position: absolute;
		left: -50%;
		width: 1500rpx;
		height: 1500rpx;
		top: -1280rpx;
		background: linear-gradient(270deg,rgba(245,91,91,1) 0%,rgba(232,46,46,1) 100%);
		border-radius: 50%;
		z-index: 9;
		overflow: hidden;
	}
	.circular_bg1{
		position: absolute;
		left: -1120rpx;
		width: 3000rpx;
		height: 3000rpx;
		top: -2760rpx;
		background: linear-gradient(180deg,rgba(245,91,91,.1) 0%,rgba(232,46,46,.1) 100%);
		border-radius: 50%;
		z-index: 9;
		overflow: hidden;
	}
	.imagList{
		background: white;
		padding: 0 30rpx;
		.imgItem{
			width:210rpx;
			height:210rpx;
			background:rgba(248,248,248,1);
			text-align: center;
			margin-top: 30rpx;
			.imgBox{
				display: inline-block;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.title{
			text-align: center;
			color: #333333;
			font-size: 28rpx;
			margin-top: 16rpx;
			margin-bottom: 30rpx;
		}
	}
}
</style>
