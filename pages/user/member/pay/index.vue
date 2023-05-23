<template>
	<div class="pageBox">
		<!-- https://dev-shop.kaidanxia.com -->
		<!-- http://localhost:9090 -->
		<web-view v-if="showView" :src="baseUrl" frameborder="0" @message="message"></web-view>
	</div>
</template>
<script>
	let App = getApp().globalData;
	export default {
		data() {
			return {
				baseUrl: App.siteroot +'index.php?s=/wechat/wxapp_h5pay/index',
				showView: false,

			};
		},

		components: {
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.showView = true
		},
		mounted() {},
		methods: {
			message(data) {
				// console.log(data)
			},
			backPage(url) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if (prevPage.$vm.canvaChange) {
					prevPage.$vm.canvaChange(this.indexId, url)
				}
				this.showView = false
				uni.navigateBack();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.pageBox {
		width: 100%;
		height: 100%;
	}
</style>
