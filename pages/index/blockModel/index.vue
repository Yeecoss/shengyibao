<template>
	<!-- 拉黑提示 -->
	<view class="block-model" v-if="showPopup">
		<popup :show="showPopup" @clickmask="clickmask">
			<view class="popup-main">
				<!-- <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view> -->
				<template v-if="type=='center'">
					<view class="poptitle f-32" v-html="title"></view>
					<view class="pop-input f-30" :style="{color: contentColor ? contentColor : ''}">
						<div v-html="content"></div>
						<div v-if="endlinkText && endlinkText != ''" class="col-m" style="text-decoration:underline" @tap.stop="toLink">{{endlinkText}}</div>
					</view>
				</template>
				<slot v-else></slot>
				<view class="pop-btn">
					<view @tap.stop="cancel">{{concelText}}</view>
					<view @tap.stop="confirm">{{confirmText}}</view>
				</view>
			</view>
		</popup>
		<!-- 联系商家 -->
		<contact ref="contact"></contact>
	</view>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	import contact from '@/components/myGoodsCommon/contact/index';
	export default {
		components: {
			popup,
			contact
		},
		props: {
			contentColor: String,
			endlink: String,
			endlinkText: String,
			title: String,
			content: String,
			confirmText: {
				type: String,
				default: '确认'
			},
			concelText: {
				type: String,
				default: '取消'
			},
			type: {
				type: String,
				default: 'center'
			},
		},
		data() {
			return {
				showPopup: false,
				next: null,
				cancelNext: null,
				user: {},
			}
		},
		watch: {},
		methods: {
			open(next, cancelNext,user) {
				this.showPopup = true
				this.user = user || {}
				this.next = next || null
				this.cancelNext = cancelNext || null;
			},
			clickmask() {
				// this.showPopup = false
				this.$emit('tipsClickmask')
			},
			cancel() {
				// this.showPopup = false
				this.$emit('cancel')
				this.cancelNext ? this.cancelNext() : ''
			},
			confirm() {
				// this.showPopup = false
				this.$refs.contact.open(this.user)
				this.$emit('tipsCallback')
				this.next ? this.next() : ''
			},
			toLink() {
				this.$emit('endlinkClick')
				uni.navigateTo({
					url: this.endlink
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .pop__mask{
		z-index: 99;
	}
	/deep/ .pop__container{
		z-index: 99;
	}
	/deep/ .wxImgBg{
		z-index: 99;
	}
	.popup-main {
		position: relative;
		width: 600rpx;
		padding-top: 60rpx;
		border-radius: 16rpx;
		background: #fff;

		.pop-close {
			position: absolute;
			right: 20rpx;
			top: 10rpx;
			color: #999;
		}

		.poptitle {
			line-height: 1.1;
			text-align: center;
			color: #333333;
		}

		.pop-input {
			padding: 40rpx 40rpx 60rpx;
			color: #666;
			line-height: 46rpx;
			text-align: center;
			font-size: 30rpx;
			max-height: 600rpx;
			overflow: auto;
		}

		// 按钮
		.pop-btn {
			display: flex;
			border-top: 1rpx solid #eee;

			view {
				width: 100%;
				font-size: 28rpx;
				line-height: 86rpx;
				color: #666;
				text-align: center;
				letter-spacing: 0.05em;
				overflow: hidden;
			}
		}

		.pop-btn view:nth-child(2) {
			color: $red;
			border-left: 1rpx solid #eee;
		}
	}
</style>
