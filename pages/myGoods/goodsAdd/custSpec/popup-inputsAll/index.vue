<template>
	<popup :show="ifshow" @clickmask="clickmask" isInput >
		<view class="popup-main" v-if="ifshow">
			<view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
			<view class="poptitle">批量设置</view>
			<view class="pop-input">
				<view class="dis-flex flex-y-center flex-x-between">
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="label">
							零售价
						</view>
						<input :focus="focus" ref="input" type="digit" v-model="goods_price"/>
					</view>
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="label">
							吊牌价
						</view>
						<input ref="input" type="digit" v-model="line_price"/>
					</view>
				</view>
				<view class="dis-flex flex-y-center flex-x-between" style="margin-top: 28rpx;">
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="label">
							库 存
						</view>
						<input ref="input" type="digit" v-model="stock_num"/>
					</view>
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="label">
							重 量
						</view>
						<input ref="input" type="digit" v-model="goods_weight"/>
					</view>
				</view>
				<view class="dis-flex flex-y-center flex-x-between" style="margin-top: 28rpx;">
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="label">
							图片
						</view>
						<view class="itemImg" v-if="image_id">
							<image :src="image_path" mode="aspectFill"></image>
						</view>
						<view class="addImg" v-else @tap="uploadImg">
							<text class="iconfont2 icon-jiahao"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="pop-btn">
				<view @tap="clickmask()">取消</view>
				<view @tap="confirm()">确定</view>
			</view>
		</view>
	</popup>
</template>

<script>
	const App = getApp().globalData;
	import popup from "@/components/pop-manager/index";
	
	export default {
		components: {
			popup,
		},
		props: {
		},
		data (){
			return{
				goods_price: '',
				line_price: '',
				stock_num: '',
				goods_weight: '',
				image_id: '',
				image_path: '',
				ifshow: false,
				val: '',
				focus: false,
				next: null
			}
		},
		watch: {
		},
		methods: {
			_open(next){
				this.goods_price = '';
				this.line_price = '';
				this.stock_num = '';
				this.image_id = '';
				this.image_path = '';
				this.goods_weight = '';
				
				this.ifshow = !this.ifshow;
				this.next = next || null
				this.focus = true
			},
			clickmask(){
				this.ifshow = !this.ifshow;
				this.focus = false
			},
			uploadImg() {
				let that = this
				uni.chooseImage({
				  count: 1,
				  // #ifdef H5 || MP
				  sizeType: ['compressed', 'original'],
				  // #endif
				  // #ifdef APP-PLUS
				  sizeType: ['compressed', 'original'],
									// #endif
				  sourceType: ['album', 'camera'],
				  success: res => {
				    // #ifdef H5 || MP
				    if (res.tempFiles[0].size <= 2048000) {
				    // #endif
				      const tempFilePaths = res.tempFilePaths[0];
					  App.uploadFile({
					    filePath: tempFilePaths,
							success: (res) => {
								if (res.code === 1) {
									that.image_path = res.data.file_path || ''
									that.image_id = res.data.wxapp_file_id || ''
								}
							}
						});
				    // #ifdef H5 || MP
				    } else {
				      App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
				    }
				    // #endif
				  }
				});
			},
			//点击确认
			confirm(close){
				let data = {
					goods_price: this.goods_price,
					line_price: this.line_price,
					stock_num: this.stock_num,
					image_id: this.image_id,
					image_path: this.image_path,
					goods_weight: this.goods_weight || ''
				}
				this.next(data)
				this.ifshow = !this.ifshow;
				this.focus = false
			},
		},
	}
</script>

<style lang="scss">
	.popup-main{
		position: relative;
		width: 600rpx;
		padding-top: 40rpx;
		border-radius: 16rpx;
		background:#fff;
	}
	.pop-close{
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		color: #999;
	}
	.poptitle{
		font-size: 32rpx;
		line-height: 1.1;
		text-align: center;
	}
	.pop-input{
		position: relative;
		padding: 40rpx 40rpx 60rpx;
		overflow: hidden;
		.label{
			width: 100rpx;
			color: #666666;
			font-size: 24rpx;
		}
		input{
			width: 144rpx;
			height: 56rpx;
			line-height: 56rpx;
			border-radius: 4rpx;
			border: 1rpx solid #DEDEDE;
			padding: 0 10rpx;
			font-size: 28rpx;
			box-sizing: border-box;
		}
		.addImg{
			display: inline-block;
			width: 56rpx;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			border-radius: 4rpx;
			border: 1rpx solid #DEDEDE;
			margin-left: 10rpx;
			margin-right: 32rpx;
			color: #DEDEDE;
			.iconfont2{
				font-size: 40rpx;
			}
		}
		.itemImg{
			width: 56rpx;
			height: 56rpx;
			margin-left: 10rpx;
			margin-right: 32rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 4rpx;
			}
		}
	}
	.text_num{
		position: absolute;
		right: 60rpx;
		bottom: 80rpx;
		font-size: 24rpx;
		color: #BCBCBC;
	}
	// 按钮
	.pop-btn{
		display: flex;
		border-top: 1rpx solid #eee;
		view{
			width: 100%;
			font-size: 28rpx;
			line-height: 86rpx;
			color: #666;
			text-align: center;
			letter-spacing: 0.05em;
			overflow: hidden;
		}
	}
	.pop-btn view:nth-child(2){
		color: $red;
		border-left: 1rpx solid #eee;
	}
</style>
