<template>
	<!-- <cover-view> -->

	<scroll-view scroll-y="true" v-if="show">
		<view v-if="show" class="guideBox" :style="!fixed?'position:absolute':''">

			<view class="img-wrap">

				<template v-for="(item,index) in guideItem.image">
					<view class="img-wrap-box" :key="index" v-show="index == onIndex">
						<image lazy-load :src="item.file_path" mode="widthFix"></image>
					</view>
				</template>
				<!-- <template v-if="!fixed">
					<view class="nextStep" :style="nextStyle" v-if="onIndex < (guideItem.image.length-1)"
						@tap.stop="nextStep">
						<image src="http://pic.kaidanxia.com/2020-07-15/202007151630495f1b37716.png" mode="widthFix">
						</image>
					</view>
					<view class="nextStep" :style="endStyle" v-if="onIndex == (guideItem.image.length-1)"
						@tap.stop="Iknow">
						<image src="http://pic.kaidanxia.com/2020-07-15/20200715163054a8e6b6599.png" mode="widthFix">
						</image>
					</view>
					<view class="moreLink" v-if="guideItem.more_url" @tap.stop="learnMore">
						<image src="https://pic.kaidanxia.com/2021-06-10/173131e26396220.png" mode="widthFix"></image>
					</view>
				</template> -->
			</view>
			<!-- <template v-if="fixed">
				<view class="nextStep" :style="nextStyle" v-show="onIndex < (guideItem.image.length-1)"
					@tap.stop="nextStep">
					<image src="http://pic.kaidanxia.com/2020-07-15/202007151630495f1b37716.png" mode="widthFix">
					</image>
				</view>
				<view class="nextStep" :style="endStyle" v-show="onIndex == (guideItem.image.length-1)"
					@tap.stop="Iknow">
					<image src="http://pic.kaidanxia.com/2020-07-15/20200715163054a8e6b6599.png" mode="widthFix">
					</image>
				</view>
			</template> -->
			<!-- 跳过 -->
			<!-- <view class="jump" v-if="title=='goodsList'" @tap.stop="Iknow">
				<image src="http://pic.kaidanxia.com/2020-07-15/2020071516304560f932860.png" mode="widthFix"></image>
			</view> -->

		</view>
		
		<view class="button" v-if="show">
			<view class="moreLink" v-if="guideItem.more_url" @tap.stop="learnMore">了解更多</view>
			<view class="nextStep" :style="nextStyle" v-show="onIndex < (guideItem.image.length-1)"
				@tap.stop="nextStep">下一步</view>
			<view class="nextStep" :style="endStyle" v-show="onIndex == (guideItem.image.length-1)"
				@tap.stop="Iknow">我知道了</view>
		</view>
	</scroll-view>
	<!-- </cover-view> -->
</template>

<script>
	let timer = null; //设置全局定时器变量
	const App = getApp().globalData;
	export default {
		data() {
			return {
				show: false,

				onIndex: 0, //默认显示第一张
				guideItem: '',
				guideData: [],
			};
		},
		props: {
			// 弹出页面
			title: {
				type: String,
				default: '',
			},
			//是否固定
			fixed: {
				type: Boolean,
				default: false,
			},
			//结束按钮样式
			endStyle: {
				type: String,
				default: '',
			},
			//下一步按钮样式
			nextStyle: {
				type: String,
				default: '',
			},
		},
		mounted() {
			this.getGuideData(() => {
				if (this.guideItem.is_see != 1) {
					this.show = true
				}
			});
		},
		methods: {
			getGuideData(callback) {
				let pages = getCurrentPages();
				let currentPage = pages[pages.length - 1].route;
				let guideData = App.guideData;
				if (guideData.length > 0) {
					this.guideData = guideData;
					for (let i in guideData) {
						let page = guideData[i].page;
						if (page.indexOf('?') != -1) {
							page = page.substring(0, page.lastIndexOf("?"))
						}
						if (page == currentPage) {
							this.guideItem = guideData[i];
							callback ? callback() : null;
						}
					}
					// this.guideItem = this.guideData.find(item =>{return item.page == currentPage})||'';
				}
			},
			// 打开初始化
			_open() {
				if(this.guideItem!=''){
					this.guideItem.is_see = 0;
					this.show = true;
					this.onIndex = 0;
				}
			},
			// 下一步
			nextStep() {
				this.onIndex++;
			},
			//知道啦
			Iknow() {
				let that = this;
				let checkItem = that.guideData.find(item => {
					return item.guide_id == that.guideItem.guide_id
				});
				if (checkItem.is_see != 1) {
					App._post_form('shop.guide_pages/see', {
						guide_id: that.guideItem.guide_id
					}, res => {
						if (res.code == 1) {
							for (let i in App.guideData) {
								if (App.guideData[i].guide_id == that.guideItem.guide_id) {
									App.guideData[i].is_see = 1;
								}
							}
							that.show = false;
							that.getGuideData();
						}
					});
				} else {
					that.guideItem.is_see = 1;
					that.show = false;
				}
			},
			// 了解更多
			learnMore() {
				uni.navigateTo({
					url: '/'+this.guideItem.more_url
				})
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
