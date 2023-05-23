<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar :title="title" extClass="nav" id="top"></navigationBar>
		<view class="wrap">
			<!-- 详情富文本 -->
			<view class="detail">
				<!-- 商品描述 -->
				<goods-describe :article_content="info.content" :isTitle="false"></goods-describe>
			</view>
		</view>
		
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import goodsDescribe from '@/components/goods/goods-describe/index';
	export default {
		components: {
			goodsDescribe
		},
		data() {
			return {
				info:'',//页面信息
				article_id:'',
				title: '详情'
			}
		},
		onLoad(options) {
			this.article_id = options.article_id ||'';
			this.getInfo()
		},
		methods: {
			// 获取详情信息
			getInfo(){
				let that = this;
				app._get('shop.guide/getDetail',{article_id: that.article_id},res => {
					let article = res.data;
					that.info = article;
					that.title = article.title || '详情'
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
