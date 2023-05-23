<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="商品详情" extClass="nav" id="top"></navigationBar>
		<view v-if="active.active_id" class="container" :style="storeColor[homeStyle]">
			<!-- 富文本组件 -->


			<!-- 滚动容器 -->
			<scroll-view class="scroll-container" @scroll="onScrollEvent" :scroll-top="scrollTop" scroll-y="true">
				<!-- 商品图片 -->
				<!--运动模板 -->
				<template v-if="homeStyle=='sportshop'">
					<detail-swiper4 ref="detailSwiper4" pageType="bargin" :goodsActive="active" @onClickShare="onClickShare" @clipboard="clipboard">
						<view class="detail-swiper-bttom">
							<!-- 砍价倒计时 top-->
							<view class="info-item__top">
								<view v-if="!active.is_end" class="info-item_countdown dis-flex flex-y-center">
									<view>距离结束</view>
									<block v-for="(item, index) in actEndTimeList" :key="index">
										<view class="countdown">
											<text>{{ item.dynamic.hou }}</text>:<text>{{ item.dynamic.min }}</text>:<text>{{ item.dynamic.sec }}</text>
										</view>
									</block>
								</view>
								<!-- 活动已结束 -->
								<view v-if="active.is_end" class="info-item_end f-28">
									<text>活动已结束</text>
								</view>
							</view>
							<!-- 砍成 -->
							<view class="goods-sales f-24 theme4_gray t-c p-b-30">
								<text>{{ active.active_sales }}人已砍成</text>
							</view>
						</view>
					</detail-swiper4>
				</template>
				<!--卖手圈模板 -->
				<template v-else-if="homeStyle=='saler'">
					<detail-swiper2 ref="detailSwiper2" :imageList0="detail.image"></detail-swiper2>
				</template>
				<!--小商店模板 -->
				<template v-else-if="homeStyle=='minishop'">
					<detail-swiper3 ref="detailSwiper3" :imageList0="detail.image"></detail-swiper3>
				</template>
				<!--默认模板 -->
				<template v-else>
					<detail-swiper ref="detailSwiper" :imageList0="detail.image"></detail-swiper>
				</template>
				<view class="main">
					<!-- 商品标题内容 -->
					<template v-if="homeStyle!='sportshop'">
						<goods-info :homeStyle="homeStyle" :goodsActive="active" :goodsDetail="detail" :actEndTimeList="actEndTimeList" @onClickShare="onClickShare" @clipboard="clipboard"></goods-info>
					</template>
					<view class="gray-bg20"></view>

					<!-- 砍价玩法 -->
					<view class="bargain-rules top-nav-bar b-f">
						<form @submit="onToggleRules" report-submit="true">
							<button formType="submit" class="btn-normal">

								<view class="item-title dis-flex flex-y-center">
									<view class="block-left flex-box f-28 col-0">
										<text>砍价玩法</text>
									</view>
									<view class="block-right">
										<text class="show-more col-9 f-24">查看规则</text>
									</view>
								</view>

								<!-- 砍价步骤 -->
								<view class="rule-simple dis-flex flex-x-around">
									<view class="simple-item dis-flex flex-dir-column flex-y-center">
										<view class="i-number dis-flex flex-x-center flex-y-center">
											<view class="i-inner"></view>
											<view class="i-line"></view>
										</view>
										<view class="i-text f-24 col-3">点击砍价</view>
									</view>
									<view class="simple-item dis-flex flex-dir-column flex-y-center">
										<view class="i-number dis-flex flex-x-center flex-y-center">
											<view class="i-line"></view>
										</view>
										<view class="i-text f-24 col-9">找人帮砍</view>
									</view>
									<view class="simple-item dis-flex flex-dir-column flex-y-center">
										<view class="i-number dis-flex flex-x-center flex-y-center">
											<view class="i-line"></view>
										</view>
										<view class="i-text f-24 col-9">砍到最低</view>
									</view>
									<view class="simple-item dis-flex flex-dir-column flex-y-center">
										<view class="i-number dis-flex flex-x-center flex-y-center">
										</view>
										<view class="i-text f-24 col-9">优惠购买</view>
									</view>
								</view>
							</button>
						</form>
					</view>
					<view class="gray-bg20"></view>
					<!-- 卖点 -->
					<selling-point :selling_point="detail.selling_point"></selling-point>
					<!-- 商品评价 -->
					<goods-comment :comment_data="goods.comment_data" :comment_data_count="goods.comment_data_count"
						:goods_id="goods.wxapp_goods_id"></goods-comment>
					<!-- 商品描述 -->
					<goods-describe :article_content="article_content"></goods-describe>
					<!-- 购前说明 -->
					<goods-instructions></goods-instructions>
					<!-- 谁购买了 -->
					<goods-buyers :buyerList="buy_user" :goods_id="goods.wxapp_goods_id"></goods-buyers>
					<!-- 猜你喜欢 -->
					<goods-like :goodsLikeList="list.data"></goods-like>
				</view>
			</scroll-view>

			<!-- 底部选项卡 -->
			<view class="footer-fixed" :class="homeStyle+'-footer'">
				<view class="footer-container dis-flex">
					<!-- 导航图标 -->
					<view class="foo-item-fast dis-flex flex-x-center flex-y-center">
						<view class="fast-item fast-item_home" @tap="onTargetHome">
							<text class="iconfont2 icon-Fill1 fast-icon"></text>
							<view class="fast-text">
								<text>首页</text>
							</view>
						</view>
						<!-- 下载 -->
						<view class="fast-item fast-item_home" style="margin-right: 0;" @tap="upload(goods.goods.image)">
							<text class="iconfont2 icon-download fast-icon"></text>
							<view class="fast-text">
								<text>下载</text>
							</view>
						</view>
					</view>
					<!-- 操作按钮 -->
					<view class="foo-item-trigger flex-box">
						<form @submit="openDialog('buyNow')" report-submit>
							<button v-if="active.is_start && !active.is_end" class="opt-btn btn-main btn-normal"
								formType="submit">
								<text>{{ is_partake ? '继续砍价' : '立即砍价' }}</text>
							</button>
							<button v-else class="opt-btn btn-gray btn-normal">
								<text>{{ active.is_end ? '活动已结束' : '活动未开启' }}</text>
							</button>
						</form>
					</view>
				</view>
			</view>

			<!-- 确认购买弹窗 -->
			<proSpecs ref="proSpecs"></proSpecs>


			<!-- 砍价规则 -->
			<zan-dialog id="zan-base-dialog"></zan-dialog>

			<!-- 快捷导航 -->
			<shortcut bottom="120rpx"></shortcut>

			<!-- 返回顶部 -->
			<view @tap.stop="onScrollTop" class="widget-goTop" v-if="showTopWidget">
				<text class="iconfont icon-fanhuidingbu"></text>
			</view>
			<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
			<share-bottom ref="shareBottom" pageType="bargin"></share-bottom>

		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	// 工具类
	import util from "@/utils/util"; // 倒计时插件
	// 倒计时插件
	import CountDown from "@/utils/countdown"; // 对话框插件
	// 对话框插件
	import Dialog from '@/components/dialog/dialog'; // 记录规格的数组
	// 记录规格的数组
	let goodsSpecArr = [];
	import zanDialog from "@/components/dialog/index";
	import shortcut from "@/components/shortcut/shortcut";
	import detailSwiper from '@/components/goods/detail-swiper/index';
	import detailSwiper2 from '@/components/goods/detail-swiper2/index';
	import detailSwiper3 from '@/components/goods/detail-swiper3/index';
	import detailSwiper4 from '@/components/goods/detail-swiper4/index';
	import goodsInfo from '../_templete/goodsInfo';
	import goodsComment from '@/components/goods/goods-comment/index';
	import goodsDescribe from '@/components/goods/goods-describe/index';
	import sellingPoint from '@/components/goods/selling-point/index';
	import goodsBuyers from '@/components/goods/goods-buyers/index';
	import goodsInstructions from '@/components/goods/goods-instructions/index';
	import goodsLike from '@/components/goods/goods-like/index';
	import downloadFile from '@/components/download-file';
	import shareBottom from '@/components/share-bottom/index';
	import proSpecs from '../proSpecs/pro-specs';

	export default {
		components: {
			zanDialog,
			shortcut,
			detailSwiper,
			detailSwiper2,
			detailSwiper3,
			detailSwiper4,
			goodsInfo,
			goodsComment,
			goodsDescribe,
			sellingPoint,
			goodsBuyers,
			goodsInstructions,
			goodsLike,
			downloadFile,
			shareBottom,
			proSpecs
		},
		data() {
			return {
				// 返回顶部
				detail: {},// 商品详情信息
				goodsMultiSpec: {},// 多规格信息\
				
				actEndTimeList: [],// 倒计时
				active: {},// 砍价活动详情
				share_image: '',
				goods: {},// 商品详情
				setting: {},// 砍价配置
				is_partake: false,// 当前用户是否正在参与
				task_id: false, // 当前用户正在参与的任务id
				active_id: "",
				article_content: "",
				buy_user: [], //谁购买了
				homeStyle: 'div',
				storeColor:'',
				
				scrollTop: 0,
				showTopWidget: false,// 返回顶部

				// 猜你喜欢
				list: '', //信息
				page: 1,
				loadding: false,
				pullUpOn: true,
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			//切换店铺
			if (options.wid) {
				app.wxapp_id = options.wid;
				wx.setStorageSync("wxapp_id", options.wid)
			}

			let that = this,
				scene = app.getSceneData(options);
			// 砍价商品id
			that.active_id = options.active_id ? options.active_id : scene.aid

			if (scene.wid) {
				app.wxapp_id = scene.wid;
				wx.setStorageSync("wxapp_id", scene.wid)
			}

			// #ifdef MP
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline'],
				success(res) {},
				fail(e) {}
			})
			// #endif
			
			that.homeStyle = app.homeStyle ? app.homeStyle : 'div';
			that.storeColor = app.storeColor;
			// 猜你喜欢
			that.page = 1;
			that.list = '';
			that.loadding = false;
			that.pullUpOn = true;
			that.getLikes()
		},
		// 上拉加载下一页
		onReachBottom() {
			let that = this;
			if (!that.pullUpOn) return;
			that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false;
			} else {
				that.page = ++that.page;
				that.loadding = false;
				that.getLikes();
			}
		},
		// 设置菜单中的转发按钮触发转发事件时的转发内容
		// #ifdef MP
		onShareAppMessage(res) {
			let shareObj = {
				title: this.goods.goods.goods_name,
				path: '/pages/bargain/goods/index?active_id=' + this.active_id + '&wid=' + this.goods.wxapp_id,
				imageUrl: this.share_image
			};
			return shareObj;
		},
		onShareTimeline() {
			return {
				title: this.goods.goods.goods_name,
				query: 'active_id=' + this.active_id + '&wid=' + this.goods.wxapp_id,
				imageUrl: this.share_image
			};
		},
		// #endif
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow(options) {
			let _this = this; // 获取砍价商品信息


			_this.getActiveDetail();
		},

		methods: {
			//猜你喜欢
			getLikes() {
				let data = {
					paginate: true,
					page: this.page,
					shop_rmd: 1
				};
				app._get('wxapp.goods/simpleLists', data, res => {
					let _list = this.list;
					let data = res.data.list;
					if (this.page == 1) {
						_list = data;
					} else {
						_list.data = _list.data.concat(data.data);
					}
					this.list = _list;
				})
			},
			/**
			 * 获取砍价商品信息
			 */
			getActiveDetail() {
				let that = this;

				getApp().globalData._get('bargain.active/detail', {
					active_id: that.active_id
				}, result => {
					// 谁购买了
					that.buy_user = result.data.buy_user || [];
					that.share_image = result.data.share_image;
					// 初始化详情数据
					let data = that.initDataFun(result.data);
					that.setData(data); 

					// 执行倒计时
					if (!data.active.is_end) {
						CountDown.onSetTimeList(that, 'actEndTimeList');
					}
					
					that.$nextTick(() =>{
						if(that.homeStyle=='sportshop'){
							that.$refs.detailSwiper4._show({
								good: that.detail,
								goodsActive: that.active,
								imageList: that.detail.image
							})
						}
						if(that.homeStyle=='minishop'){
							that.$refs.detailSwiper3._show({
								imageList: that.detail.image
							})
						}
						if(that.homeStyle=='saler'){
							that.$refs.detailSwiper2._show({
								imageList: that.detail.image
							})
						}
						if(that.homeStyle=='div'){
							that.$refs.detailSwiper._show({
								imageList: that.detail.image
							})
						}
					})
				}, result => {
					that.back();
				});
			},

			back: function back() {
				var data = this;
				wx.navigateBack({
					delta: data.delta
				});
				this.$emit('back', {
					delta: data.delta
				}, {});
			},

			/**
			 * 初始化详情数据
			 */
			initDataFun(data) {
				let that = this; // 商品详情


				let goodsDetail = data.goods.goods; // 富文本转码

				if (goodsDetail.content.length > 0) {
					setTimeout(() => {
						that.article_content = goodsDetail.content;
					}, 200);
				}

				// 商品图片列表将视频放在首位
				if (goodsDetail.image) {
					data.goods.image = that.initImageList(goodsDetail.image);
				} 

				// 初始化商品多规格
				if (goodsDetail.spec_type == 20) {
					data.goodsMultiSpec = that.initManySpecDataFun(goodsDetail.goods_multi_spec);
				} 

				// 商品评价时间截取
				if (goodsDetail.comment_data_count > 0) {
					data.comment_data = that.initCommentDataFun(goodsDetail.comment_data);
				} 
				that.detail = goodsDetail;

				// 记录活动到期时间
				data.actEndTimeList = [{
					date: data.active.end_time
				}];
				return data;
			},

			// 初始化图片列表
			initImageList(data) {
				let newData = [];
				data.forEach(item => {
					if (item.file_type == 'video') {
						newData.push(item);
					}
				});
				data.forEach(item => {
					if (item.file_type == 'image') {
						newData.push(item);
					}
				});
				return newData;
			},
			/**
			 * 初始化商品多规格
			 */
			initManySpecDataFun(data) {
				goodsSpecArr = [];

				for (let i in data.spec_attr) {
					for (let j in data.spec_attr[i].spec_items) {
						if (j < 1) {
							data.spec_attr[i].spec_items[0].checked = true;
							goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id;
						}
					}
				}

				return data;
			},

			/**
			 * 初始化评论时间
			 */
			initCommentDataFun(data) {

				for (let i = 0; i < data.length; i++) {
					if (data[i].create_time) {
						data[i].create_newtime = data[i].create_time.substring(5, 16);
					}
				}

				return data;
			},

			/**
			 * 跳转到评论
			 */
			// onTargetToComment() {
			// 	let _this = this;

			// 	uni.navigateTo({
			// 		url: `../../goods/comment/comment?goods_id=${_this.goods.goods_id}`
			// 	});
			// },

			//返回顶部
			onScrollTop(t) {
				this.scrollTop = 0
			},
			// 显示/隐藏 返回顶部按钮
			onScrollEvent(e) {
				this.showTopWidget = e.detail.scrollTop > 200
			},
			// 显示分享选项
			onClickShare(e) {
				let goods = this.goods;
				goods.active_id = this.active.active_id;
				let data = {
					opeText: 'weChat, weChatFriends',
					isTwo: true,
					upGoods: goods
				}
				this.$refs.shareBottom.open(data);
			},

			// 显示砍价规则
			onToggleRules(e) {
				Dialog({
					title: '砍价规则',
					message: this.setting.bargain_rules,
					selector: '#zan-base-dialog',
					isScroll: true,
					// 滚动
					buttons: [{
						text: '关闭',
						color: 'red',
						type: 'cash'
					}]
				});
			},
			// 确认砍价
			openDialog(btnType) {
				let that = this;

				// 判断是否已参与当前的砍价活动，如果已参与的话跳转到砍价任务
				if (that.is_partake) {
					uni.navigateTo({
						url: `../task/index?task_id=${that.task_id}`
					});
					return;
				}else{
					let goods = that.goods;
					goods.active_id = that.active.active_id;
					goods.floor_price = that.active.floor_price;
					that.$refs.proSpecs._open(goods, btnType || '')
					
					return;
				}
			},
			// 跳转到首页
			onTargetHome(e) {
				uni.switchTab({
					url: '/pages/index/index'
				});
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
			//下载回调
			comfirmStatusS(promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res ? "保存成功~" : '取消保存')
				})
			},
			// 复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "index";
</style>
