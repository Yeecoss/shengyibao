<template>
  <popup v-if="showPopup" :show="showPopup" @clickmask="clickmask">
    <view class="popup-main" catchtouchmove='true'>
      <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
			<template v-if="type=='center'">
				<view class="poptitle f-32" v-html="title"></view>
				<view class="pop-input f-30" :style="{color: contentColor ? contentColor : '', 'text-align': textAlign}">
          <div v-html="content"></div>
          <div v-if="endCopy && endCopy != ''" class="col-m" style="text-decoration:underline" @tap.stop="toCopy">复制</div>
          <div v-if="endlinkText && endlinkText != ''" class="col-m" style="text-decoration:underline" @tap.stop="toLink">{{endlinkText}}</div>
				</view>
			</template>
			<slot v-else></slot>
      <view class="pop-btn">
        <view @tap.stop="cancel" v-if="showConcle">{{concelText}}</view>
        <view @tap.stop="confirm" :style="showConcle ? '' : 'border-left:0'" class="submit">{{confirmText}}</view>
      </view>
    </view>
  </popup>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	
	export default {
		components: {
			popup,
		},
		props: {
      textAlign: {
        type: String,
				default: 'center'
      },
      contentColor: String,
      endlink: String,
      endlinkText: String,
      endCopy: String,
			title: String,
      content: String,
      showConcle: {
        type: Boolean,
				default: true
      },
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
		data (){
			return{
        showPopup: false,
        next: null,
				cancelNext: null,
			}
		},
		watch: {
		},
		methods: {
			open(next,cancelNext) {
        this.showPopup = true
        this.next = next || null
        this.cancelNext = cancelNext || null
			},
			clickmask() {
				this.showPopup = false
				this.$emit('tipsClickmask')
			},
			cancel() {
				this.showPopup = false
				this.$emit('cancel')
        this.cancelNext ? this.cancelNext() : ''
			},
			confirm() {
				this.showPopup = false
        this.$emit('tipsCallback')
        this.next ? this.next() : ''
      },
      toLink() {
        this.$emit('endlinkClick', this.endlink)
				uni.navigateTo({
					url: this.endlink
				});
      },
      toCopy() {
			// 复制
				thorui.getClipboardData(this.endCopy, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
      }
		},
	}
</script>

<style lang="scss">
.popup-main{
    position: relative;
    width: 600rpx;
    padding-top: 60rpx;
    border-radius: 16rpx;
    background:#fff;
    word-wrap:break-word;
    .pop-close{
        position: absolute;
        right: 20rpx;
        top: 10rpx;
        color: #999;
    }
    .poptitle{
        line-height: 1.1;
        text-align: center;
        color: #333333;
    }
    .pop-input{
        padding: 0 40rpx;
        margin: 40rpx 0 60rpx;
        color: #666;
        line-height: 46rpx;
        text-align: center;
        font-size: 30rpx;
        max-height: 600rpx;
        overflow: auto;
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
    .pop-btn .submit{
        color: $red;
        border-left: 1rpx solid #eee;
    }
}
</style>
