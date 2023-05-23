<template>
  <popup :show="showPopup" @clickmask="clickmask">
    <view class="popup-main" catchtouchmove='true'>
      <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
      <view class="poptitle">公众号</view>
      <view class="pop-input">
        请前往公众号进行开通。
      </view>
      <view class="pop-input1">
        <div>
          <image @click="onPreviewImages" style="width:380rpx;height:380rpx;" src="http://pic.kaidanxia.com/2020-08-12/20200812104437d3d307157.jpg"></image>
        </div>
        <!-- #ifdef MP -->
        <div class="official">
          <official-account></official-account>
        </div>
        <!-- #endif -->
      </view>
      <view class="pop-btn">
        <view @tap.stop="clickmask">取消</view>
        <view @tap.stop="confirm">{{confirmText}}</view>
      </view>
    </view>
  </popup>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	
	export default {
		components: {
			popup,
		},
		props: {
			confirmText: {
				type: String,
				default: '确认'
			}
		},
		data (){
			return{
      			showPopup: false
			}
		},
		watch: {
		},
		methods: {
			onPreviewImages() {
			  let imageUrls = ['http://pic.kaidanxia.com/2020-08-12/20200812104437d3d307157.jpg'];
			
			  wx.previewImage({
			    current: 0,
			    urls: imageUrls
			  });
			},
			open(item) {
				this.showPopup = true
			},
			clickmask() {
				this.showPopup = false
			},
			confirm() {
				this.showPopup = false
			}
		},
	}
</script>

<style lang="scss">
.popup-main{
    position: relative;
    width: 660rpx;
    padding-top: 60rpx;
    border-radius: 16rpx;
    background:#fff;
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
        color: #333333;
    }
    .pop-input, .pop-input1{
        color: #666;
        font-size: 26rpx;
        line-height: 46rpx;
        text-align: center;
    }
    .pop-input{
        padding: 40rpx 30rpx 0;
    }
    .pop-input1{
        padding: 40rpx 30rpx;
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
}
</style>
