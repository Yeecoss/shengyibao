<template>
  <popup :show="showPopup" @confirm="close">
    <view class="popup-main" catchtouchmove='true'>
      <view class="pop-close" @tap="close"><text class="iconfont2 icon-shanchu1"></text></view>
      <view class="poptitle">生意宝公众号</view>
      <view class="pop-input1">
        <div>
          <image @click="onPreviewImages" style="width:380rpx;height:380rpx;" src="https://pic.kaidanxia.com/2020-08-12/20200812104437d3d307157.jpg"></image>
          <div>保存二维码至本地，使用微信扫一扫打开公众号</div>
        </div>
        <!-- #ifdef MP -->
        <div class="official">
          <official-account @binderror="binderror"></official-account>
        </div>
        <!-- #endif -->
      </view>
      <view class="pop-btn">
        <view @tap.stop="close">取消</view>
        <view @tap.stop="confirm">{{confirmText}}</view>
      </view>
    </view>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
  </popup>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	import downloadFile from '@/components/download-file';
  let App = getApp().globalData;
	export default {
		components: {
      popup,
      downloadFile
		},
		props: {
			confirmText: {
				type: String,
				default: '保存并关闭'
			}
		},
		data (){
			return{
        item: {},
        ios: false,
        showPopup: false,
        showImg: false
			}
		},
		watch: {
    },
    
		created() {
        // console.log(22222222222222)
			this.ios = App.ios
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
			close() {
				this.showPopup = false
			},
			confirm() {
				this.$refs.download._downloadFileS(['http://pic.kaidanxia.com/2020-08-12/20200812104437d3d307157.jpg']);
			},
			//下载回调
			comfirmStatusS (promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
          this.$api.msg(res?"保存成功~":'取消保存')
          this.close()
				})
			},
			binderror(e) {
				this.showImg = true
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
        .font-w{
          font-weight: 600;
        }
    }
    .pop-input1{
        padding: 20rpx 30rpx;
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
