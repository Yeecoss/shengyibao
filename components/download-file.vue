<template>
	<view>
		<!-- <button @tap="_downloadFileS" v-show="!displayStatus">一键下载</button> -->
		<!-- #ifdef MP-WEIXIN -->
		<uni-popup :show="show" ref="popup" type="center">
			<view class="popup-prompt">
				<view class="Pprompt-text">
					小程序需要您的微信授权保存，是否重新授权？
				</view>
				<view class="Pprompt-btn">
					<button @tap="_promptCancel">取消</button>
					<button class="PPb-comfirm" open-type="openSetting" @opensetting="_promptComfirm">确定</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup :show="show" ref="popup" type="center">
			<view class="popup-prompt">
				<view class="Pprompt-text">
					小程序需要您的微信授权保存，是否重新授权？
				</view>
				<view class="Pprompt-btn">
					<button @tap="_promptCancel">取消</button>
					<button class="PPb-comfirm" open-type="openSetting" @opensetting="_promptComfirm">确定</button>
				</view>
			</view>
		</uni-popup>
		<!-- #endif -->
	</view>
</template>

<script>
	import uniPopup from '@/components/pop-manager/index'
	export default{
		name: "downloadFile",
		components: {
			uniPopup
		},
		props: {
			// fileArray: {
			// 	type: Array
			// },
			// displayStatus: {
			// 	type: Number
			// }
		},
		data () {
			return {
				fileArray: "",
				show:false,
			}
		},
		methods: {
			_downloadFileS (currImgSrcArray) {
				let that = this;

				that.fileArray = currImgSrcArray;
				var urls = currImgSrcArray;
				// #ifdef MP-WEIXIN
				uni.getSetting({
				    success(res) {
					  let status = res
				      if (!res.authSetting["scope.writePhotosAlbum"]) {
				        uni.authorize({
				          scope: "scope.writePhotosAlbum",
				          success: function () {
										that._fileList(urls); //图片视频逐步
				          },
				          fail: function (res) {
								// #ifndef MP-WEIXIN
								that.show = true;
								// #endif
				          }
				        })
				      } else {
								that._fileList(urls); //图片视频逐步
				      }
				    }
				  })
				// #endif
				// #ifndef MP-WEIXIN
				that._fileList(urls); //图片视频逐步
				// #endif
			},
			// #ifdef MP-WEIXIN
			_promptCancel () {
				this.show = false;
			},
			_promptComfirm (e) {
				let that = this;
				if (!e.detail.authSetting["scope.writePhotosAlbum"]) {
					that.show = true;
				  return
				}
				that.show = false;
				that._fileList(that.fileArray)
			},
			// #endif
			_fileList (urls,imgStutastype,mskStatus) {
				let that = this;
				let promise = Promise.resolve();
				if(imgStutastype == 1) {
					promise = promise.then(() => {
						return this.saveFile(urls)
					})
					that.$emit('comfirmStatus',promise)
				}else{
					urls.forEach((url, index) => {
						promise = promise.then(() => {
							return this.fileDownload(url,mskStatus)
						})
					})
					that.$emit('comfirmStatus',promise)
				}
			  return promise
			},
			fileDownload (url,mskStatus) {
				let that = this;
				if(mskStatus != 1){
					uni.showLoading({
						title: '保存中...',
						mask: true,
					});
				}
				return new Promise((resolve, reject) => {
					uni.downloadFile({
					  url: url,
					  success: (res) => {
						// #ifdef H5
						resolve(res.tempFilePath);
						// #endif
						
						// #ifndef H5
						var temp = res.tempFilePath;
						this.saveFile(temp).then(res => {
							resolve(res)
						});
						// #endif
						
					  },
					  fail: (err) => {
						reject(err);
						// #ifdef H5
						reject(err.tempFilePath);
						// #endif
					  }
					});
			  });
			},
			saveFile (temp) {
				// #ifndef H5
				let that = this;
				return new Promise((resolve, reject) => {
					if (temp.indexOf("mp4") >= 0 || temp.indexOf("MOV") >= 0) {
					  uni.saveVideoToPhotosAlbum({
							filePath: temp,
							success: function (res) {
								resolve(res)
							},
							fail: function (err) {
								reject(err)
									that.$api.msg("保存视频已取消")
							}
					  })
					}
					if (temp.indexOf("jpg") >= 0 || temp.indexOf("png") >= 0 || temp.indexOf("jpeg") >= 0 || temp.indexOf("gif") >= 0) {
					  uni.saveImageToPhotosAlbum({
							filePath: temp,
							success: function (res) {
								resolve(res)
							},
							fail: function (err) {
								reject(err)
									that.$api.msg("保存图片已取消")
							}
					  });
					}
				}).catch((e) => {})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-prompt{
		width: 520rpx;
		background: #fff;
	}
	.Pprompt-text{
		padding: 30rpx;
	}
	.Pprompt-btn{
		display: flex;
		font-size: 32rpx;
		border-top: 1rpx solid #dedede;
		button{
			width: 50%;
			font-size: 32rpx;
		}
		.PPb-comfirm{
			color: $red;
			border-left: 1rpx solid #DEDEDE;
		}
	}
</style>
