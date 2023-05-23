<template>
  <popup :show="showPopup" v-if="showPopup" @clickmask="clickmask">
    <view class="popup-main" catchtouchmove='true'>
      <view class="pop-input f-30" :style="{color: contentColor ? contentColor : ''}">
        <div class="imgBox">
          <image mode="aspectFit" src="http://pic.kaidanxia.com/2020-08-11/20200811174736ef69c6955.png"></image>
        </div>
        <div class="poptitle">{{title}}</div>
      </view>
      <view class="pop-btn">
        <view class="confirm" @tap.stop="confirm">{{confirmText}}</view>
        <view class="concel" @tap.stop="clickmask">{{concelText}}</view>
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
      contentColor: String,
			title: String,
			confirmText: {
				type: String,
				default: '去购买'
			},
			concelText: {
				type: String,
				default: '不用了'
			},
			type: {
				type: String,
				default: 'center'
			},
		},
		data (){
			return{
        showPopup: false,
        next: null
			}
		},
		watch: {
		},
		methods: {
			open(next) {
        this.showPopup = true
        this.next = next || null
			},
			clickmask() {
				this.showPopup = false
				this.$emit('tipsClickmask')
			},
			confirm() {
				this.showPopup = false
        this.next ? this.next() : ''
        App.toMember()
      },
      toLink() {
				uni.navigateTo({
					url: this.endlink
				});
      }
		},
	}
</script>

<style lang="scss">
.popup-main{
    position: relative;
    width: 600rpx;
    border-radius: 16rpx;
    background:#fff;
    .pop-input{
        padding: 64rpx 40rpx 60rpx;
        color: #666;
        line-height: 46rpx;
        text-align: center;
        font-size: 30rpx;
        max-height: 600rpx;
        overflow: auto;
      .imgBox{
        width: 278rpx;
        height: 192rpx;
        display: inline-block;
        image{
          height: 100%;
          width: 100%;
        }
      }
      .poptitle{
        line-height: 1.4;
        text-align: center;
        color: #333333;
        width: 384rpx;
        display: inline-block;
        font-weight: 600;
        font-size: 32rpx;
        margin-top: 40rpx;
      }
    }
    // 按钮
    .pop-btn{
        text-align: center;
        view{
            font-size: 28rpx;
            line-height: 86rpx;
            color: #666;
            letter-spacing: 0.05em;
            overflow: hidden;
        }
        .confirm{
          width:400rpx;
          height:80rpx;
          background:rgba(232,46,46,1);
          border-radius:44rpx;
          color: white;
          display: inline-block;
        }
        .concel{
          width:400rpx;
          height:80rpx;
          border-radius:44rpx;
          display: inline-block;
        }
    }
}
</style>
