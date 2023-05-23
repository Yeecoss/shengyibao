<template>
<view>
	<view class="swiper">
		<view>
			<swiper :autoplay="autoplay" @change="setCurrent" :duration="duration" :indicator-dots="indicatorDots" :interval="interval" :circular="circular" :next-margin="nextMargin" :previous-margin="previousMargin" class="banner-box  swiper-box">
				<template v-for="(item, index) in imageList">
					<swiper-item :key="index">
						<template v-if="item.file_media == 'video'">
      						<!-- #ifdef H5 || MP -->
							<view v-if="!videoBoxShow" class="imgBox" @tap.stop="onPreviewImages(index)">
								<image lazy-load class="slide-image" mode="aspectFill" :src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
								<view class="videoPlay" @tap.stop="videoPlay">
									<text class="iconfont2 icon-broadcast1 f-28 m-left"></text>
								</view>
							</view>
							<view v-if="videoBoxShow" class="imgBox">
								<video preload="meta" :autoplay="true" :show-mute-btn="true" :enable-progress-gesture="false" :show-center-play-btn="false" :id="'myVideo' + index" class="box-w block" :src="item.file_path" objectFit="cover" @ended="bindended">
								</video>
							</view>
      						<!-- #endif -->
      						<!-- #ifdef APP-PLUS -->
							<view v-if="!videoBoxShow" class="imgBox" @tap.stop="videoPlay">
								<image lazy-load class="slide-image" mode="aspectFill" :src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
								<view class="videoPlay" @tap.stop="videoPlay">
									<text class="iconfont2 icon-broadcast1 f-28 m-left"></text>
								</view>
							</view>
      						<!-- #endif -->
						</template>
						<template v-else>
							<view class="imgBox" @tap.stop="onPreviewImages(index)">
								<image lazy-load class="slide-image" mode="aspectFill" :src="item.file_path"></image>
							</view>
						</template>
					</swiper-item>
				</template>
			</swiper>
			<view class="banner-num" v-if="!videoBoxShow">
				<text>{{ currentIndex }}</text>
				<text>/{{ imageList.length }}</text>
			</view>
		</view>
    	<!-- #ifdef APP-PLUS -->
		<view class="videoBox dis-flex flex-y-center" v-if="videoBoxShow" @tap.stop="closeVideoBox">
		  <video preload="none" class="videoAll" id="videoAll" :src="videoPath" :autoplay="true" @tap.stop objectFit="cover" @ended="jieshu"></video>
		</view>
      	<!-- #endif -->
	 </view>
</view>
</template>

<script>
export default {
	name: 'detail-swiper',
	data() {
		return {
			videoBoxShow: false,
			videoPath: '',
			indexCurrent: null,
			indicatorDots: false,
			muted:true,
			// 是否显示面板指示点
			autoplay: false,
			// 是否自动切换
			interval: 3000,
			// 自动切换时间间隔
			duration: 400,
			// 滑动动画时长
			currentIndex: 1,
			// 轮播图指针
			// 轮播数据 + 效果 E
			imageList: [],
		}
	},
	props: {
		circular: {
			type: Boolean,
			default: true
		},
		nextMargin: {
			type: String,
			default: ''
		},
		previousMargin: {
			type: String,
			default: ''
		},
		imageList0: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	watch:{
		imageList0: function observer(newVal,oldVal) {
			if (newVal) {
				this.imageList = newVal;
			}else{
				this.imageList = oldVal;
			}
		},
	},
	methods:{
		_show(data) {
			this.imageList = JSON.parse(JSON.stringify(data.imageList));
		},
		videoPlay() {
			this.unit()
			this.videoBoxShow = true
		},
		unit() {
			this.imageList.forEach(item => {
				if (item.file_media == 'video') {
					this.isHaveVideo = true
					this.videoPath = item.file_path
				}
			})
		},
		// 设置静音
		mutedChange() {
			this.muted = !this.muted
			// 没有播放时播放视频
			if (this.indexCurrent || this.indexCurrent == 0) {
			  	let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);
				videoContextPrev.pause();
				this.$nextTick(() => {
					videoContextPrev.play();
				})
			}
		},
		/**
		 * 设置轮播图当前指针 数字
		 */
		setCurrent(e) {
			this.videoBoxShow = false
			let curIdx = e.detail.current;
			
			this.setData({
				currentIndex: curIdx + 1
			});
			
			if (this.indexCurrent || this.indexCurrent == 0) {
				let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);
			
				if (this.indexCurrent != curIdx) {
					videoContextPrev.pause();
					this.indexCurrent = null
				}
			}
			this.$emit('change',curIdx)
		},
		playVideo(curIdx) {
		  if (this.imageList[curIdx].file_media == 'video') {
			// 没有播放时播放视频
			if (this.indexCurrent) {
			  let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);

			  if (this.indexCurrent != curIdx) {
				videoContextPrev.pause();
			  }
			}

			this.indexCurrent = curIdx
			let videoContext = wx.createVideoContext('myVideo' + curIdx); //这里对应的视频id

			videoContext.play();
		  } else {
			this.indexCurrent = null
		  }
		},
		/**
		 * 浏览商品图片
		 */
		onPreviewImages(index) {
			let imageUrls = [];
			this.imageList.forEach(item => {
				if (item.file_media == 'video') {
					imageUrls.push(item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375');
				} else {
					imageUrls.push(item.file_path);
				}
			});

			wx.previewImage({
				current: imageUrls[index],
				urls: imageUrls
			});
		},

		// 播放
		onPreviewVideo (index) {
			let file_path = this.imageList[index].file_path; // 有播放时播放视频

			if (this.indexCurrent) {
				// 有播放时先将prev暂停，再播放当前点击的current
				let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);
				videoContextPrev.pause();
			}
			this.videoPath = file_path;
			this.videoBoxShow = true;
			let videoContextCurrent = wx.createVideoContext('videoAll');
			videoContextCurrent.play();
		},
		closeVideoBox() {
			// 关闭
			this.videoPath = ''
			this.videoBoxShow = false
			// 有播放时播放视频

			if (this.indexCurrent) {
				// 有播放时恢复播放
				let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);
				videoContextPrev.play();
			}
		},
		bindended() {
			this.indexCurrent = null
		},
	}
}
</script>
<style>
@import "./index.scss";
</style>

