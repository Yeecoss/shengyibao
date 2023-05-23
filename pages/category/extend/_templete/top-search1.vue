<template>
	<view class="top-search dis-flex flex-y-center flex-x-between pad_lr30">
		<!-- 小商店模板 -->
		<template v-if="homeStyle=='minishop'||homeStyle=='sportshop'">
			<view class="search minishop-search">
				<search :disabled="true" @gosearch="triggerSearch" radius="0" :placeholder="placeholder" background="rgba(187, 188, 205, .15)"></search>
			</view>
			<view class="filter-btn col-0 minishop-filter" @tap="screen"><text class="iconfont2 icon-screen f-36 m-r-10"></text></view>
		</template>
		
		<!-- 其他模板 -->
		<template v-else>
			<view class="search default-search">
				<search :disabled="true" @gosearch="triggerSearch" :placeholder="placeholder" background="rgba(255,255,255,.9)"></search>
			</view>
			<view class="filter-btn col-f f-28" @tap="screen">筛选<text class="iconfont2 icon-screen f-28 m-l-10"></text></view>
		</template>
		
	</view>
</template>

<script>
	
	import search from '@/components/uni-search/index';
	export default{
		components:{
			search
		},
		props:{
			placeholder:{
				type: String,
				default: '搜索你想找的商品'
			},
			homeStyle:String
		},
		methods:{
			//商品搜索
			triggerSearch() {
				let pages = getCurrentPages(); // 判断来源页面
				
				if (pages.length > 1 && pages[pages.length - 2].route === 'pages/search/index') {
					wx.navigateBack();
					return;
				} // 跳转到商品搜索
			
			
				uni.navigateTo({
					url: '/pages/search/index'
				});
			},
			screen(){
				this.$emit('screen')
			}
		}
	}
</script>

<style lang="scss">
	//搜索
	.top-search {
	  position: fixed;
	  left: 0;
	  width: 100%;
	  padding-top: 20rpx;
	  padding-bottom: 20rpx;
	  box-sizing: border-box;
	  z-index: 3;
	}
	.default-search{
		width: 520rpx;
		.filter-btn{
			width: 128rpx;
			height: 48rpx;
			line-height: 48rpx;
			text-align: center;
			border-radius: 30rpx;
			background:rgba(0,0,0,0.4);
			overflow: hidden;
		}
		
	}
	.minishop-search{
		width: 600rpx;
	}
	.minishop-filter{
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
	}
</style>
