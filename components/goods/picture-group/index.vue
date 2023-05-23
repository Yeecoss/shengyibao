<template>
	<view>
		<view :class="'main_goods_left goods_pic' + (mini ? '_mini' : '') + (images.length<=3?images.length:'')">
		<template v-for="(vo, idx) in images">
		  <view class="goods_pic_item" :key="idx" v-if="mini || idx<6" @tap.stop="onPreview(vo, idx, images)">
				<image mode="aspectFill" lazy-load :src="vo.file_path + (vo.file_media == 'video' ? '?vframe/jpg/offset/0|imageView2/1/w/105/h/105' : '')">
					<text v-if="vo.file_media == 'video'" class="iconfont2 icon-broadcast1 playVideo"></text>
				</image>
		    <!-- 大于六张的蒙版 -->
		    <view v-if="!mini && images.length>6 && idx==5" class="goods_pic_mark dis-flex flex-y-center flex-x-center">+{{images.length-6}}</view>
		  </view>
		</template>
		</view>
		
		<view class="videoBox dis-flex flex-y-center" v-if="videoBoxShow" @tap.stop="closeVideoBox">
		  <video preload="none" class="videoAll" id="videoAll" :src="videoPath" :autoplay="true" @tap.stop objectFit="cover"></video>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			mini: {
				type: Boolean,
      			default: false
			},
			images: [Object,Array]
		},
		data() {
			return {
				videoPath: "",
				videoBoxShow: false
			};
		},
		onLoad() {
			
		},
		methods: {
			onPreview(item, index, images) {
			  if (item.file_media == 'video') {
			    this.onPreviewVideo(item)
			  } else {
			    this.onPreviewImages(index, images)
			  }
				this.$emit('priview',true)
			},
			/**
			 * 浏览商品图片
			 */
			onPreviewImages(index, images) {
			  let imageUrls = [];
			  images.forEach(element => {
			    imageUrls.push(element.file_path + (element.file_media == 'video' ? '?vframe/jpg/offset/0|imageView2/1' : ''));
			  });
			
			  wx.previewImage({
			    current: imageUrls[index],
			    urls: imageUrls
			  });
			},
			
			onPreviewVideo(item) {
			  this.videoPath = item.file_path
			  this.videoBoxShow = true
			  let videoContextCurrent = wx.createVideoContext('videoAll');
			  videoContextCurrent.play();
			},
			
			closeVideoBox() {
			  // 关闭
			  this.setData({
			    videoPath: '',
			    videoBoxShow: false
			  });
			}
		}
	}
</script>

<style lang="scss">
	.main_goods_left {
	  display: flex;
	  align-items: center;
	  flex-wrap: wrap;
	  height: 100%;
	  background: #fff;
	  overflow: hidden;
	}
	.main_goods_left image, .main_goods_left video{
	  width: 100%;
	  height: 100%;
	}
	.main_goods_left .playVideo {
		font-size: 40rpx;
		color: white;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -20rpx;
		margin-top: -20rpx;
	}
	.main_goods_left .goods_pic_item{
	  position: relative;
	  display: block;
	  margin-bottom: 10rpx;
	  border-radius: 8rpx;
		overflow: hidden;
	}
	/* <=2 */
	.goods_pic1,.goods_pic2, .goods_pic_mini1, .goods_pic_mini2{
	  justify-content: space-between;
	}
	
	.goods_pic1 .goods_pic_item,.goods_pic2 .goods_pic_item{
	  width: 321rpx;
	  height: 321rpx;
	}
	.goods_pic_mini1 .goods_pic_item,.goods_pic_mini2 .goods_pic_item{
	  width: 284rpx;
	  height: 284rpx;
	}
	/* 3 */
	.goods_pic3, .goods_pic_mini3{
	  display: block;
	}
	.goods_pic3 .goods_pic_item:nth-child(1){
	  width:438rpx;
	  height:418rpx;
	  float: left;
	  margin-right: 10rpx;
	}
	.goods_pic_mini3 .goods_pic_item:nth-child(1){
	  width:360rpx;
	  height:360rpx;
	  float: left;
	  margin-right: 10rpx;
	}
	.goods_pic3 .goods_pic_item:nth-child(2),.goods_pic3 .goods_pic_item:nth-child(3){
	  float: left;
	  width:204rpx;
	  height:204rpx;
	}
	.goods_pic_mini3 .goods_pic_item:nth-child(2),.goods_pic_mini3 .goods_pic_item:nth-child(3){
	  float: left;
	  width:176rpx;
	  height:176rpx;
	}
	/* >3 */
	.goods_pic .goods_pic_item {
	  width: 210rpx;
	  height: 210rpx;
	  margin-right: 10rpx;
	}
	.goods_pic_mini .goods_pic_item {
	  width: 176rpx;
	  height: 176rpx;
	  margin-right: 6rpx;
	}
	.goods_pic .goods_pic_item:nth-child(3n), .goods_pic_mini .goods_pic_item:nth-child(3n){
	  margin-right: 0;
	}
	/* 大于六张的蒙版 */
	.goods_pic_mark{
	  position: absolute;
	  right: 0;
	  bottom: 0;
	  width: 210rpx;
	  height: 210rpx;
	  border-radius: 4rpx;
	  font-size:48rpx;
	  font-weight:500;
	  color:rgba(255,255,255,0.8);
	  background: rgba(0,0,0,0.5);
	}
	// 视频弹窗
	.videoBox{
	  position: fixed;
	  left: 0;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  background: #000;
	  z-index: 9999;
	}
	.videoAll{
	  width: 100%;
	}
</style>
