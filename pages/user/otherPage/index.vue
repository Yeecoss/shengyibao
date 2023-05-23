<template>
	<div class="pageBox">
		<web-view v-if="showView" :src="url" frameborder="0"></web-view>
	</div>
</template>
<script>
	let App = getApp().globalData;
	export default {
		data() {
			return {
				showView: true,
				url: 'https://www.baidu.com'
			};
		},

		components: {
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			if (options.url) {
				this.url  = options.url
			}
			this.showView = true
		},
		mounted() {},
		methods: {
		}
	}
</script>
<style lang="scss" scoped>
	.pageBox {
		width: 100%;
		height: 100%;
	}
</style>
