<template>
	<view class=""><!-- v-if="listData!=''"-->
		<view class="list-wrap dis-flex flex-wrap" @touchstart="touchStart" @touchend="touchEnd" @touchcancel="touchCancel">
			<view class="list-item" v-for="(item,index) in listData" :key="index" :data-index="index" @touchmove="touchMove">
				<view class="list-img check-wrap" @tap.stop="onPreview(item, index, listData)">
					<image v-if="item.file_media == 'video'" lazy-load :src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/200/h/200'" mode="aspectFill"></image>
					<image v-else lazy-load :src="item.thumbnail_file_path" mode="aspectFill"></image>
					<text v-if="item.file_media == 'video'" class="iconfont2 icon-broadcast1 playVideo"></text>
					
					<view class="checkbox-wrap0" v-if="ifManage || source!='shop'" @tap.stop="radioChange(item)">
						<view class="checkbox dis-flex flex-y-center flex-x-center" :class="item.checked?'on':''"><text v-if="item.checked" class="iconfont2 icon-duihao col-f f-24 f-w"></text></view>
					</view>
				</view>
				<view class="f-24 col-3 m-b-20 m-top10 break-all"><!-- {{item.file_real_name}} --></view>
			</view>
		</view>
		<!-- 视频弹窗 -->
		<view class="videoBox dis-flex flex-y-center" v-if="videoBoxShow" @tap.stop="closeVideoBox">
		  <video preload="none" class="videoAll" id="videoAll" :src="videoPath" :autoplay="true" @tap.stop objectFit="cover"></video>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		props: {
			ifManage: {
				type: Boolean,
				default: false
			},
			source: {
				type: String,
				default: ''
			},
			scrollTop: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				startScrollTop: 0,
				listData: [],
				//视频弹窗
				videoPath: "",
				videoBoxShow: false,
				isMove: false,
				startX: 0,
				startY: 0,
				startTime: ''
			}
		},
		methods: {
			touchStart(e) {
				this.startX = e.touches[0].pageX; // 获取触摸时的x坐标  
				this.startY = e.touches[0].pageY; // 获取触摸时的x坐标
				this.startScrollTop = this.scrollTop
				this.startTime = new Date().getTime();//获取毫秒数
				this.isMove = false
				this.listData.forEach(item => {
					if(item.tchecked){
						item.tchecked = false
					}
				});
			},
			touchMove(e) {
				let endX = e.changedTouches[0].pageX;
				let endY = e.changedTouches[0].pageY;
				let newTime = new Date().getTime()
				let touchTime = newTime - this.startTime;//计算滑动时间
				//开始判断
				//1.判断时间是否符合
				if (touchTime >= 10) {
					this.startTime = newTime
					//2.判断偏移量：分X、Y
					if (Math.abs(endX - this.startX) > 50) {
						this.isMove = true
					}
					if (Math.abs(this.scrollTop - this.startScrollTop) > 100) {
						this.isMove = false
						return
					}
					let query = wx.createSelectorQuery().in(this)
					query.selectAll('.list-img').boundingClientRect()
					query.exec(res => {
						let list = res[0] || []
						list.forEach((item, index) => {
							if (endY > (item.top + this.scrollTop) && endY < (item.bottom + this.scrollTop) && endX > item.left && endX < item.right) {
								// this.$nextTick(()=>{
									
								this.listData[index].tchecked = true;
								// })
								// this.$emit('radioChange',this.listData[index])
							}
						})
					})
				} else {
					// console.log('滑动时间过短', touchTime)
				}
			},
			touchEnd(){
				if (this.isMove) {
					this.listData.forEach(item => {
						if(item.tchecked){
							this.$emit('radioChange',item)
							item.tchecked = false
						}
					});
					this.isMove = false
				} else {
					this.listData.forEach(item => {
						if(item.tchecked){
							item.tchecked = false
						}
					});
				}
			},
			touchCancel: function (e) {
				this.startX = 0;//开始时的X坐标
				this.startY = 0;//开始时的Y坐标
				this.startTime = 0;//开始时的毫秒数
				this.isMove = false
				this.listData.forEach(item => {
					if(item.tchecked){
						item.tchecked = false
					}
				});
			},
			_show(data){
				// if(data!=''){
					let list = JSON.parse(JSON.stringify(data)) || []
					list.forEach(item => {
						item.checked = item.checked || false
						item.tchecked = false
					})
					this.listData = list;
				// }
			},
			// 单选
			radioChange(item) {
				this.$emit('radioChange',item)
			},
			// 点击预览
			onPreview(item, index, images) {
			  if (item.file_media == 'video') {
			    this.onPreviewVideo(item)
			  } else {
			    this.onPreviewImages(index, images)
			  }
			},
			// 浏览商品图片
			onPreviewImages(index, images) {
			  let imageUrls = [];
			  images.forEach(element => {
			    imageUrls.push(element.file_path+ (element.file_media == 'video' ? '?vframe/jpg/offset/0|imageView2/1' : ''));
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
			},
		}
	}
</script>

<style lang="scss">
	image{
		display: block;
		width: 100%;
		height: 100%;
	}
	view{
		box-sizing: border-box;
	}
	.list-item{
		width: 222rpx;
		margin-right: 12rpx;
		overflow: hidden;
		&:nth-child(3n){
			margin-right: 0;
		}
	}
	.list-img{
		position: relative;
		height: 224rpx;
		background: #F5F5F5;
		border-radius: 10rpx;
		overflow: hidden;
	}
	.playVideo {
		font-size: 40rpx;
		color: white;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -20rpx;
		margin-top: -20rpx;
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
	.checkbox-wrap0{
		position: absolute;
		right: 0;
		top: 0;
		padding: 20rpx;
	}
	.checkbox{
		width: 15px;
		height: 15px;
		border-radius: 50% ;
		background: rgba(0, 0, 0, 0.3);
		border: 0.5px solid #fff;
		&.on{
			background-color: $red;
			border-color: $red;
		}
	}
</style>
