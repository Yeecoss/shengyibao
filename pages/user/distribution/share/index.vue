<template>
<view class="bgf5">
	<!-- 自定义标题栏 -->
	<navigationBar :title="title" extClass="nav" id="top"></navigationBar>
	<view class="container">
		<swiper @change="change" previous-margin="80rpx" next-margin="30rpx" class="swiper" :indicator-dots="false"
			:autoplay="false" :interval="3000" :duration="1000">
			<template v-for="(item, index) in image">
				<swiper-item :key="index">
					<view class="swiper-item small">
						<div class="bgBox">
							<image :src="item.file_path" mode="aspectFill"></image>
						</div>
					</view>
				</swiper-item>
			</template>
		</swiper>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30 bgf">
				<view class="foot-btn f-32 col-f" @tap.stop="toAdd">去分享</view>
			</view>
		</view>
	</view>
	<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
	<div v-show="isLoading">
		<loading></loading>
	</div>
</view>
</template>

<script>
let app = getApp().globalData;
import downloadFile from '@/components/download-file';
import loading from '@/components/loading';

export default {
	data() {
		return {
			name: '',
			isLoading: true,
			title: '渠道推广',
			indexs: 0,
			image: []
		};
	},

	components: {
		downloadFile,
		loading
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (options.name && options.name == 'goods') {
			this.name = options.name || ''
			this.title = '店铺推广'
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getData()
	},
	methods: {
	  	changeIndex() {
			let num = Math.floor(Math.random() * this.image.length)
			if (num == this.indexs) {
				this.changeIndex()
				return
			}
			this.indexs = num
		},
		// 点击下载
		upload(){
			let files = this.image[this.indexs].file_path || ''
			if (files.length == 0) {
				return false
			}
			const that = this;
			let uploads = [];
			uploads.push(files)
			that.$refs.download._downloadFileS(uploads);

		},
		//下载回调
		comfirmStatusS (promise) {
			promise.then((res) => {
				uni.hideLoading();
				uni.hideToast();
				this.$api.msg(res?"保存成功~":'取消保存')
			})
		},
	  	toAdd() {
			this.upload()
		},
		appShare() {
			// let data = {
			// 	provider: 'weixin',
			// 	scene: scene,
			// 	type: this.style_on == -1 ? 5 : 2,
			// 	"imageUrl": goods_image + '?vframe/jpg/offset/0|imageView2/1/w/300/h/300',
			// 	success: ret => {
			// 		console.log(JSON.stringify(ret));
			// 	},
			// 	fail: ret => {
			// 		// 分享失败
			// 		console.log(JSON.stringify(ret))
			// 	}
			// }
			// uni.share(data);
		},
		getData() {
			let url = 'wxapp/getDealerPoster'
			if (this.name == 'goods') {
				url = 'wxapp/getWxappPoster'
			}
			app._get(url,{},res => {
				let imgs = res.data.qrcode
				let list = []
				imgs.forEach(element => {
					list.push({
						file_type: 'img',
						file_path: element
					});
				})
				this.image = list
				this.isLoading = false
			})
		},
		change(e){
			this.indexs = e.detail.current
		}
  	}
};
</script>
<style lang="scss" scoped>
	@import "index";
</style>