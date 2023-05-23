<template>
	<view class="container">
		<tui-image-cropper :lockRatio="true" :imageUrl="imageUrl" @ready="ready" @cropper="cropper" :isShop="isShop"></tui-image-cropper>
	</view>
</template>

<script>
let App = getApp().globalData;
export default {
	data() {
		return {
			src: '',
			isShop: false,
			imageUrl: '' //要裁剪的图片
		};
	},
	onLoad(options) {
		this.src = options.src || '';
		this.fieldName = options.fieldName || '';
		if (options.isShop) {
			this.isShop = true
		}
		//如果从上个页面传值时可显示loading
		this.src &&
			uni.showLoading({
				title: '请稍候...',
				mask: true
			});
	},
	methods: {
		ready() {
			this.imageUrl = this.src;
		},
		cropper(e) {
			App.uploadFile({
			  filePath: e.url,
			  isShop: this.isShop,
              success: (res) => {
                if (res.code === 1) {
					//裁剪完成后处理逻辑
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2]; //上一个页面
					if (prevPage.$vm.change) {
						prevPage.$vm.change(this.fieldName, res.data.file_path, res.data.wxapp_file_id)
					}
					uni.navigateBack();
				} else {
					// console.log(res)
				}
              },
              complete: (res) => {
              }
            });
		}
	}
};
</script>

<style></style>
