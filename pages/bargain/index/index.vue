<template>
	<view class="container" :class="[homeStyle+'container',homeStyle=='sportshop'&&((currentTab==0&&activeList.data=='')||(currentTab==1&&myList.data==''))?'nobg':'']">
		<!-- 自定义标题栏 -->
		<template v-if="homeStyle!='div'">
			<navigationBar :lLidth="homeStyle=='sportshop'?'width:60rpx':''" id="top">
				<view class="index-header-c flex-box dis-flex"
					:class="['top-'+homeStyle,homeStyle!='sportshop'?'flex-x-center':'']" slot="center">
					<view :class="currentTab==v.id?'on':''" v-for="v in tabs" :key="v.id" @tap="onToggleTab(v.id)">
						{{v.text}}</view>
				</view>
			</navigationBar>
		</template>
		<template v-else>
			<navigationBar :title="title" background="transparent" color="#fff" id="top"></navigationBar>
			<view class="mbg"></view>
			<view class="index-header">
				<view class="index-header-c flex-box dis-flex flex-y-center flex-x-between">
					<view :class="currentTab==v.id?'on':''" v-for="v in tabs" :key="v.id" @tap="onToggleTab(v.id)">
						{{v.text}}</view>
				</view>
			</view>
		</template>
		
		<!-- 内容区域 -->
		<scroll-view class="container--scroll-view" @scrolltolower="onScrollToLower" scroll-y="true"
			@scroll="onScrollEvent" :style="'height: ' + scrollHeight + 'px;'">
			<view class="mbg2" v-if="homeStyle=='minishop'"></view>
			<!-- 砍价会场 -->
			<block v-if="currentTab == 0">
				<!-- 内容区域 -->
				<view class="bargain-hall">
					<!-- <barginGood :barginList="activeList.data" :currentTab="currentTab" @upload="upload"	@openDialog="openDialog"></barginGood> -->
					<barginGood1 :homeStyle="homeStyle" :barginList="activeList.data" :currentTab="currentTab" @upload="upload"	@openDialog="openDialog"></barginGood1>
					<view v-if="noMore" class="no-more f-28">亲, 没有更多了</view>
					<!-- 无数据提供的页面 -->
					<view class="saler_nodata" v-if="!isLoading && !activeList.data.length">
						<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png"
							:imgWidth="264" :imgHeight="264">
							<view class="col-9">亲，暂无砍价活动哦</view>
						</tui-no-data>
					</view>
				</view>
			</block>

			<!-- 我的砍价 -->
			<block v-if="currentTab == 1">
				<!-- 内容区域 -->
				<view class="bargain-hall">
					<!-- 商品列表 -->
					<!-- <barginGood :barginList="myList.data" :currentTab="currentTab" :countDownList="countDownList" @upload="upload" @onTargetTask="onTargetTask"></barginGood> -->
					<barginGood1 :homeStyle="homeStyle" :barginList="myList.data" :currentTab="currentTab" :countDownList="countDownList" @upload="upload" @onTargetTask="onTargetTask"></barginGood1>
					<view v-if="noMore" class="no-more f-28">亲, 没有更多了</view>
					<!-- 无数据提供的页面 -->
					<view class="saler_nodata" v-if="!isLoading && !myList.data.length">
						<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png"
							:imgWidth="264" :imgHeight="264">
							<view class="col-9">亲，暂未参与砍价活动哦</view>
						</tui-no-data>
					</view>
				</view>
			</block>
		</scroll-view>
		<!-- 确认购买弹窗 -->
		<proSpecs ref="proSpecs"></proSpecs>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import barginGood1 from '../_templete/barginGood1';
	import downloadFile from '@/components/download-file';
	import proSpecs from '../proSpecs/pro-specs';

	export default {
		components: {
			barginGood1,
			downloadFile,
			proSpecs,
		},
		data() {
			return {
				tabs: [{
					id: 0,
					text: '砍价专区'
				}, {
					id: 1,
					text: '我的砍价'
				}, ],
				// 当前tab索引
				currentTab: 0, //默认第一个tab
				title: '砍价专区',
				//标题
				controls: false,
				// 列表容器高度
				scrollHeight: null,
				// 列表容器滚动的位置
				scrollTop: 0,
				noMore: false,
				// 没有更多数据
				isLoading: true,
				// 是否正在加载中
				page: 1,
				// 当前页码
				// 时间记录
				countDownList: [],
				// 砍价会场商品列表
				activeList: [],
				// 我的砍价列表
				myList: [],
				// 砍价弹窗
				goods: {},
				// 商品详情信息
				active_id: '',
				homeStyle: 'div',
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 设置scroll-view高
			this.$nextTick(() => {
				this.setListHeightFun();
			})
			// 设置当前tab索引
			this.setCurrentTabFun(options);
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			let that = this;
			that.homeStyle = App.homeStyle ? App.homeStyle : 'div';
			if (that.scrollTop == 0) {
				// 获取列表数据
				that.activeList = [];
				that.myList = [];
				that.page = 1;
				that.isLoading = true;
				that.noMore = false;
				that.getListFun();
			}
		},

		methods: {

			/**
			 * 用户点击右上角分享
			 */
			onShareAppMessage() {
				// 构建页面参数
				let params = getApp().globalData.getShareUrlParams();
				return {
					title: '砍价专区',
					path: `/pages/bargain/index/index?${params}`
				};
			},
			//立即参加
			openDialog(item) { 
				let goods = item.wxappgoods;
				goods.active_id = item.active_id;
				goods.floor_price = item.floor_price;
				this.$refs.proSpecs._open(goods, 'buyNow')
			},
			/**
			 * 设置当前tab索引
			 */
			setCurrentTabFun(options) {
				let that = this;

				if (options.hasOwnProperty('tab')) {
					let title = options.tab == 0 ? '砍价专区' : '我的砍价';

					that.currentTab = options.tab;
					that.title = options.title;
				}
			},

			/**
			 * 设置商品列表高度
			 */
			setListHeightFun() {
				let that = this;
				const query = uni.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(function(res) {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						// 计算rpx
						tapHeight = that.homeStyle != 'div' ? 0 : Math.floor(rpx * (108)),
						// tap高度
						scrollHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度

					that.setData({
						scrollHeight
					});
				});
			},

			/**
			 * 获取砍价活动列表
			 */
			getActiveList(isPage) {
				let that = this;

				getApp().globalData._get('index.php', {
					s: '/xapi/bargain.active/lists',
					page: that.page || 1
				}, result => {
					let resList = result.data.activeList,
						dataList = that.activeList;

					if (isPage == true) {
						that.setData({
							'activeList.data': dataList.data.concat(resList.data),
							isLoading: false
						});
					} else {
						that.setData({
							activeList: resList,
							isLoading: false
						});
					}
				});
			},

			/**
			 * 获取我的砍价列表
			 */
			getMyList(isPage) {
				let that = this;

				getApp().globalData._get('bargain.task/lists', {
					page: that.page || 1
				}, result => {
					let resList = result.data.myList,
						dataList = that.myList;

					if (isPage == true) {
						that.setData({
							'myList.data': dataList.data.concat(resList.data),
							isLoading: false
						});
					} else {
						that.setData({
							myList: resList,
							isLoading: false
						});
					} // 初始化倒计时组件


					that.initCountDownDataFun(result.data, isPage);
				});
			},

			/**
			 * 初始化倒计时组件
			 */
			initCountDownDataFun(data, isPage) {
				let that = this; // 记录活动到期时间

				let countDownList = [];
				data.myList.data.forEach(item => {

					let now_time = Math.round(new Date() / 1000);
					let end_time = Math.round(new Date(item.end_time.replace(/\-/g, '/')).getTime() / 1000);
					if (now_time < end_time) {
						let time = end_time - now_time;
						countDownList.push(time);
					}

				});
				if (isPage) {
					that.countDownList = that.countDownList.concat(countDownList);
				} else {
					that.countDownList = countDownList;
				}
				console.log(countDownList);
			},

			/**
			 * 记录滚动的位置
			 */
			onScrollEvent(e) {
				let that = this;
				that.scrollTop = e.detail.scrollTop
			},

			/**
			 * 切换tabbar
			 */
			onToggleTab(e) {
				let that = this; // 保存formid

				that.currentTab = e;
				that.title = e == 0 ? '砍价专区' : '我的砍价';
				that.activeList = [];
				that.myList = [];
				that.page = 1;
				that.isLoading = true;
				that.noMore = false;
				that.countDownList = [];
				// 获取列表数据
				that.getListFun();
			},
			/**
			 * 跳转到砍价商品详情
			 */
			onTargetActive(id) {
				// 保存formid
				uni.navigateTo({
					url: `../goods/index?active_id=${id}`
				});
			},

			/**
			 * 跳转到砍价任务详情
			 */
			onTargetTask(task_id) {
				uni.navigateTo({
					url: `../task/index?task_id=${task_id}`
				});
			},

			/**
			 * 下拉到底部加载下一页
			 */
			onScrollToLower() {
				let _this = this,
					listData = _this.currentTab == 0 ? _this.activeList : _this.myList; // 已经是最后一页


				if (_this.page >= listData.last_page) {
					_this.setData({
						noMore: true
					});

					return false;
				} // 加载下一页列表


				_this.setData({
					page: ++_this.page
				});

				_this.getListFun(true);
			},

			/**
			 * 获取列表数据
			 */
			getListFun(isPage) {
				let _this = this;

				_this.currentTab == 0 ? _this.getActiveList(isPage) : _this.getMyList(isPage);
			},
			// 点击下载
			upload(files) {
				const that = this;
				let uploads = [];
				files.forEach(item => {
					uploads.push(item.file_path)
				});
				if (uploads != '') {
					uni.showModal({
						title: '友情提示',
						content: '是否下载该商品的图片/视频？',
						confirmColor: '#FF7541',
						confirmText: '是',
						cancelText: '否',
						success: (res) => {
							if (res.confirm) {
								that.$refs.download._downloadFileS(uploads);
							}
						}
					});
				} else {
					that.$api.msg('该商品暂无可下载的图片/视频');
				}
			},
			comfirmStatusS(promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res ? "保存成功~" : '取消保存')
				})
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";

	/deep/ .tui-countdown-item {
		border-color: transparent !important;
		box-shadow: 0 0 2rpx 0 #D0D0D0;
	}
</style>
