<template>
	<view class="tabbar-wrap">
		<view class="tabbar dis-flex">
			<view class="tabbar-item"
				v-for="(item, index) in tabbarList" :key="index"
				:class="[dIndex==index?'on':'']"
				@tap="navgateTo(item)">
				<image class="iconImg" :src="'/static/images/tabbar/' + item.icon + (dIndex==index?'Active':'Icon') + '.png'" mode=""></image>
				<view>{{item.text}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		props:{
			dIndex:{
				type: [Number,String],
				default: 1
			},
			homeStyle: {
				type: String,
				default: 'div'
			}
		},
		data() {
			return {
				tabbarList: [{
					icon: 'home',
					text: '首页',
					url: '/pages/index/index'
				},{
					icon: 'food',
					text: '点餐',
					url: '/pages/category/index'
				},{
					icon: 'my',
					text: '我的',
					url: '/pages/userIndex/index'
				},],
				isShow: false,
			};
		},
		mounted() {
			uni.hideTabBar();
		},
		methods: {
			navgateTo (item){
				console.log(item)
				uni.switchTab({
					url: item.url
				})
			},
		}
	}
</script>

<style lang="scss">
.tabbar-wrap,.tabbar{
	width: 100%;
	// height:98rpx;
	// padding-bottom: env(safe-area-inset-bottom);
	// box-sizing: content-box;
}
.tabbar{
	position: fixed;
	left: 0;
	bottom: 0;
	font-size: 22rpx;
	color: #999;
	background:#fff;
	box-shadow:0 0 16rpx 2rpx rgba(222,222,222,0.5);
	z-index: 99;
	padding-bottom:calc(env(safe-area-inset-bottom)/2);
	padding-top: 10rpx;
}
.tabbar-item{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	&.on{
		color: #FF7541;
	}
	.iconImg{
		width: 48rpx;
		height: 48rpx;
	}
}
</style>
