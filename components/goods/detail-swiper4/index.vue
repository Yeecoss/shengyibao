<template>
	<view>
		<view class="swiper">
			<view>
				<!-- 大图轮播 -->
				<swiper circular :current="tabIndex" :duration="800" @change="setCurrent" :next-margin="nextMargin"
					:previous-margin="previousMargin" class="banner-box swiper-box">
						<swiper-item  class="banner-box-item" v-for="(item, index) in imageList" :key="index">
							<template v-if="item.file_media == 'video'">
								<!-- #ifdef H5 || MP -->
								<view v-if="!videoBoxShow" class="imgBox" @tap.stop="onPreviewImages(index)">
									<!-- 背景蒙版 -->
									<view class="imgBox-bg">
										<image lazy-load class="slide-image" mode="aspectFill" :src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
									</view>
									<image lazy-load class="slide-image" mode="aspectFit"
										:src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
									<view class="videoPlay" @tap.stop="videoPlay">
										<text class="iconfont2 icon-broadcast1 f-28 m-left"></text>
									</view>
								</view>
								<view v-if="videoBoxShow" class="imgBox">
									<video preload="meta" :autoplay="true" :show-mute-btn="true"
										:enable-progress-gesture="false" :show-center-play-btn="false"
										:id="'myVideo' + index" class="box-w block" :src="item.file_path"
										objectFit="cover" @ended="bindended">
									</video>
								</view>
								<!-- #endif -->
								<!-- #ifdef APP-PLUS -->
								<view v-if="!videoBoxShow" class="imgBox" @tap.stop="videoPlay">
									<!-- 背景蒙版 -->
									<view class="imgBox-bg">
										<image lazy-load class="slide-image" mode="aspectFill"
										:src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
									</view>
									<image lazy-load class="slide-image" mode="aspectFit"
										:src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
									<view class="videoPlay" @tap.stop="videoPlay">
										<text class="iconfont2 icon-broadcast1 f-28 m-left"></text>
									</view>
								</view>
								<!-- #endif -->
							</template>
							<template v-else>
								<view class="imgBox" @tap.stop="onPreviewImages(index)">
									<!-- 背景蒙版 -->
									<view class="imgBox-bg">
										<image lazy-load class="slide-image" mode="aspectFill" :src="item.file_path">
									</view>
									<image lazy-load class="slide-image" mode="aspectFit" :src="item.file_path">
									</image>
								</view>
							</template>
						</swiper-item>
				</swiper>
				<!-- 大图轮播-end -->
				<!-- 缩略图 -->
				<!-- <scroll-view class="thumb-banner-box" scroll-x scroll-with-animation :show-scrollbar="false" :scroll-into-view="scrollIndex" :style="{width:(imageList.length>3?100*3:100*imageList.length)+'rpx'}"> -->
				<scroll-view class="thumb-banner-box" scroll-x scroll-with-animation :show-scrollbar="false" :scroll-into-view="scrollIndex" :style="{width:imgWidt}">
					<view class="thumb-banner-item" v-for="(item, index) in imageList" :key="index" :id="'thumb'+index" :data-current="index" @tap.stop="tabClick" :class="{ 'active': tabIndex == index }">
						<template v-if="item.file_media == 'video'">
							<view class="imgBox">
								<image lazy-load class="slide-image" mode="aspectFill"
									:src="item.file_path + '?vframe/jpg/offset/0|imageView2/1/w/375/h/375'"></image>
							</view>
						</template>
						<template v-else>
							<view class="imgBox">
								<image lazy-load class="slide-image" mode="aspectFill" :src="item.file_path"></image>
							</view>
						</template>
					</view>
				</scroll-view>
				<!-- 缩略图-end -->
				<!-- 指示点 -->
				<view class="banner-num" v-if="!videoBoxShow">
					<text>{{ currentIndex }}</text>
					<text>/{{ imageList.length }}</text>
				</view>
				<!-- 指示点-end -->
				<!-- 商品价格 -->
				<view class="goods-price dis-flex flex-y-center flex-x-center">
					<view v-if="pageType=='bargin'||pageType=='sharp'" class="goods-price-con dis-flex flex-wrap flex-y-center flex-x-center flex-box min-h100 oh">
						<text class="f-28 theme4_red price1 f-w">¥{{pageType=='bargin'?active.floor_price:(detail.goods_sku?detail.goods_sku.seckill_price: 0)}}</text>
						<text class="f-24 theme4_gray m-l-10 price2">¥{{ (pageType=='bargin'&&detail.goods_sku)?detail.goods_sku.goods_price:(detail.goods_sku?detail.goods_sku.original_price: 0) }}</text>
					</view>
					<view v-else class="goods-price-con dis-flex flex-wrap flex-y-center flex-x-center flex-box min-h100 oh">
						<text class="f-28 theme4_red price1 f-w">¥{{goods_price}}</text>
						<text class="f-24 theme4_gray m-l-10 price2" v-if="line_price > 0 && detail.sku && detail.sku.length == 1">
							¥{{ line_price }}
						</text>
					</view>
					<view class="share-btn" @tap="onClickShare"><text class="iconfont2 icon-share3 f-38"></text></view>
				</view>
				<!-- 商品价格-end -->
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="videoBox dis-flex flex-y-center" v-if="videoBoxShow" @tap.stop="closeVideoBox">
				<video preload="none" class="videoAll" id="videoAll" :src="videoPath" :autoplay="true" @tap.stop
					objectFit="cover" @ended="jieshu"></video>
			</view>
			<!-- #endif -->
		</view>
		<view class="m-t-40">
			<!-- pageTag -->
			<template v-if="pageType=='bargin'||pageType=='sharp'">
				<view class="pageTag f-28 col-f t-c">{{pageType=='sharp'?'限时秒杀':'砍价专区'}}</view>
			</template>
			<!-- 卖点 -->
			<view class="sell_point" v-show="detail.goods_name" :class="showAll?'':'sixlist-hidden'">
				<text class="col-0 f-28 point" @tap.stop="clipboard(detail.goods_name)">{{detail.goods_name}}</text>
				<view class="theme4_red f-28 showAllPoint" @tap.stop="showAllPoint" v-if="isMore">{{showAll ? '收起' : '展开'}}</view>
			</view>
			<!-- 标签 -->
			<view class="tag-wrap dis-flex flex-x-center flex-wrap p-b-30">
				<view @tap="toTagPros(item)" class="f-28 m-r-20" v-for="(item,index) in detail.tags" :key="index"><text>#</text>{{item}}</view>
			</view>
		</view>
		
		<slot></slot>
		
		<!-- 操作 -->
		<!-- <view class="optbox flex-x-between">
			<view class="dis-flex flex-y-center">
				<view class="oper-item f-24 col-0 m-r-60" @tap.stop="upload(detail.image)"><text class="iconfont2 icon-download2 f-38"></text></view>
				<view class="oper-item f-24 col-0 m-r-60" @tap.stop="toShare(good)"><text class="iconfont2 icon-share3 f-38"></text></view>
				<view class="oper-item f-24 col-0 m-r-60" @tap.stop="openDialog(good)"><text class="iconfont2 icon-shopping f-38"></text></view>
			</view>
		</view> -->
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		name: 'wxapp-goods',
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
			// 页面
			pageType: {
				type: String,
				default: 'goods'
			},
			// 砍价页面必传
			goodsActive: {},
			actEndTimeList: {},
		},
		watch:{
			actEndTimeList: function observer(newVal,oldVal) {
				if (newVal) {
					this.countdown = newVal;
				}else{
					this.countdown = oldVal;
				}
			},
		},
		data() {
			return {
				videoBoxShow: false,
				videoPath: '',
				indexCurrent: null,
				indicatorDots: false,
				muted: true,// 是否显示面板指示点
				autoplay: false,// 是否自动切换
				interval: 3000,// 自动切换时间间隔
				duration: 400,// 滑动动画时长
				currentIndex: 1,// 轮播图指针
				// 轮播数据 + 效果 E
				tabIndex: 0,
				scrollIndex:'',
				// 卖点
				showAll: false,
				isMore: true,
				imageList: [],
				imgWidt: '',
				detail: {},
				goods_price: 0,// 商品价格
				line_price: 0,// 划线价格
				
				// 砍价页面
				active: {},
				countdown: {},
			}
		},
		methods: {
			_show(data){
				let obj = JSON.parse(JSON.stringify(data));
				this.unit2(obj)
			},
			unit2(data) {
				this.detail = data.good;
				this.imageList = data.imageList||[];
				this.imgWidt = (data.imageList.length>3?100*3:100*data.imageList.length)+'rpx';
				if(this.pageType=='bargin'){
					this.active = data.goodsActive;
				}else if(this.pageType=='sharp'){
					this.active = data.goodsActive;
				}else{
					this.goods_price = this.detail.price_range;
					this.line_price = this.detail&&this.detail.goods_sku?this.detail.goods_sku.line_price: 0;
				}
				this.$nextTick(() => {
					this.getH()
					this.getH2()
				})
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

				this.currentIndex = curIdx + 1
				this.switchTab(curIdx);

				if (this.indexCurrent || this.indexCurrent == 0) {
					let videoContextPrev = wx.createVideoContext('myVideo' + this.indexCurrent);

					if (this.indexCurrent != curIdx) {
						videoContextPrev.pause();
						this.indexCurrent = null
					}
				}
				this.$emit('change', curIdx)
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
			onPreviewVideo(index) {
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
			// 缩略图
			tabClick(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},
			switchTab(index) {
				this.tabIndex = index;
				let scrollIndex = index - 1 < 0 ? 0 : index - 1;
				this.scrollIndex = 'thumb'+scrollIndex;
			},
			// 卖点
			showAllPoint(){
				this.showAll = !this.showAll
			},
			getH(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.point').boundingClientRect(result => { 
				  if (result) {
				    this.vheight = result.height;
				  }else { 
				    this.getH(); 
					} 
				}).exec();
			},
			getH2(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.sell_point').boundingClientRect(result => { 
				  if (result) {
				    this.vheight0 = result.height;
						if(this.vheight>this.vheight0){
							this.isMore = true;//console.log('高度======',this.vheight,this.vheight0)
						}else{
							this.isMore = false;
						}
				  }else { 
				    this.getH2(); 
					} 
				}).exec();
			},
			// 卖点--end
			//立即购买
			// openDialog(item){
			// 	this.$emit('toBuy',item)
			// },
			// // 点击下载
			// upload(files){
			// 	this.$emit('upload',files)
			// },
			// //点击分享
			// toShare(item){
			// 	this.$emit('toShare',item)
			// },
			
			// 标签列表
			toTagPros(item){
				uni.navigateTo({
					url: '/pages/goods/tagGoodsList/tagGoodsList?tag='+item
				})
			},
			onClickShare(){
				this.$emit('onClickShare')
			},
			// 复制
			clipboard(data) {
				this.$emit('clipboard',data)
			},
		}
	}
</script>
<style lang="scss">
	@import "index";
</style>
