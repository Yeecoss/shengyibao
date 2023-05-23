<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="商品详情" extClass="nav" id="top"></navigationBar>
		<view v-if="active.active_id" class="container" :style="storeColor[homeStyle]">

			<!-- 滚动容器 -->
			<scroll-view class="scroll-container" @scroll="onScrollEvent" :scroll-top="scrollTop" scroll-y="true">

				<!-- 商品图片 -->
				<!--运动模板 -->
				<template v-if="homeStyle=='sportshop'">
					<detail-swiper4 ref="detailSwiper4" pageType="sharp" :goodsActive="active" @onClickShare="onClickShare" @clipboard="clipboard">
						<view class="detail-swiper-bttom sportshop-countwrap" v-if="homeStyle=='sportshop'">
							<!-- 砍价倒计时 top-->
							<view class="info-item__top">
								<view v-if="active.active_status != ActiveStatusEnum.STATE_END.value" class="info-item_countdown dis-flex flex-y-center">
									<view>距离{{ active.active_status == ActiveStatusEnum.STATE_SOON.value ? '开始' : '结束' }}</view>
									<block v-for="(item, index) in actEndTimeList" :key="index">
										<view class="countdown">
											<text>{{ item.dynamic.hou }}</text>:<text>{{ item.dynamic.min }}</text>:<text>{{ item.dynamic.sec }}</text>
										</view>
									</block>
								</view>
								<!-- 活动已结束 -->
								<view v-else class="info-item_end f-32">
									<text>活动已结束</text>
								</view>
							</view>
							<!-- 秒杀进度条 -->
							<view :class="'sharp-progress ' + (active.active_status == ActiveStatusEnum.STATE_SOON.value?'nosharp-progress':'')">
								<block v-if="active.active_status != ActiveStatusEnum.STATE_SOON.value && (goods.progress>0)">
									<view class="yoo-progress">
										<view class="yoo-progress--portion" :style="'width: ' + goods.progress + '%;'">
										</view>
									</view>
									<view class="sharp-sales sharp-sales-progress">已抢{{ goods.progress }}%</view>
								</block>
								<view class="sharp-sales" v-if="active.active_status == ActiveStatusEnum.STATE_SOON.value">即将开抢</view>
								<view class="sharp-sales" v-if="active.active_status != ActiveStatusEnum.STATE_SOON.value && (goods.progress==0)">已开抢</view>
							</view>
						</view>
					</detail-swiper4>
				</template>
				<!--小商店模板 -->
				<template v-if="homeStyle=='minishop'">
					<detail-swiper3 ref="detailSwiper3" :imageList0="detail.image"></detail-swiper3>
				</template>
				<!--卖手圈模板 -->
				<template v-if="homeStyle=='saler'">
					<detail-swiper2 ref="detailSwiper2" :imageList0="detail.image"></detail-swiper2>
				</template>
				<!--默认模板 -->
				<template v-if="homeStyle=='div'">
					<detail-swiper ref="detailSwiper" :imageList0="detail.image"></detail-swiper>
				</template>
				<view class="main">
					<!-- 商品标题内容 -->
					<template v-if="homeStyle!='sportshop'">
						<goods-info :homeStyle="homeStyle" :stateEnum="ActiveStatusEnum" :goodsActive="active" :goodsDetail="goods" :actEndTimeList="actEndTimeList" @onClickShare="onClickShare" @clipboard="clipboard"></goods-info>
					</template>
					<view class="gray-bg20"></view>

					<!-- 卖点 -->
					<selling-point :selling_point="goods.goods.selling_point"></selling-point>
					<!-- 商品评价 -->
					<goods-comment :comment_data="goods.goods.comment_data" :comment_data_count="goods.goods.comment_data_count"
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
							<button v-if=" active.active_status == ActiveStatusEnum.STATE_BEGIN.value" class="opt-btn btn-main btn-normal"
							 form-type="submit">
								<text>立即购买</text>
							</button>
							<button v-else class="opt-btn btn-gray btn-normal">
								<text>{{ active.active_status == ActiveStatusEnum.STATE_SOON.value ? '活动未开始' : '活动已结束' }}</text>
							</button>
						</form>
					</view>
				</view>
			</view>

			<!-- 确认购买弹窗 -->
			<proSpecs ref="proSpecs"></proSpecs>

			<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
			<!-- 分享同步 -->
			<share-bottom ref="shareBottom" pageType="sharp"></share-bottom>
			<!-- 快捷导航 -->
			<shortcut bottom="120rpx"></shortcut>

			<!-- 返回顶部 -->
			<view @tap.stop="onScrollTop" class="widget-goTop" v-if="showTopWidget">
				<text class="iconfont icon-fanhuidingbu"></text>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	// 工具类
	import util from "@/utils/util"; 
	// 倒计时插件
	import CountDown from "@/utils/countdown"; 
	// 枚举类：秒杀活动商品状态
	import ActiveStatusEnum from "@/utils/enum/sharp/GoodsStatus"; 
	// 记录规格的数组
	let goodsSpecArr = [];
	import shortcut from "@/components/shortcut/shortcut";
	import detailSwiper from '@/components/goods/detail-swiper/index';
	import detailSwiper2 from '@/components/goods/detail-swiper2/index';
	import detailSwiper3 from '@/components/goods/detail-swiper3/index';
	import detailSwiper4 from '@/components/goods/detail-swiper4/index';
	import goodsInfo from '../_templete/goodsInfo';
	import goodsComment from '@/components/goods/goods-comment/index';
	import goodsDescribe from '@/components/goods/goods-describe/index';
	import downloadFile from '@/components/download-file';
	import sellingPoint from '@/components/goods/selling-point/index';
	import goodsBuyers from '@/components/goods/goods-buyers/index';
	import goodsInstructions from '@/components/goods/goods-instructions/index';
	import goodsLike from '@/components/goods/goods-like/index';
	import shareBottom from '@/components/share-bottom/index';
	import proSpecs from '../_templete/proSpecs/pro-specs';

	export default {
		components: {
			shortcut,
			detailSwiper,
			detailSwiper2,
			detailSwiper3,
			detailSwiper4,
			goodsInfo,
			goodsComment,
			goodsDescribe,
			downloadFile,
			sellingPoint,
			goodsBuyers,
			goodsInstructions,
			goodsLike,
			shareBottom,
			proSpecs
		},
		data() {
			return {
				showTopWidget: false,// 返回顶部
				goodsMultiSpec: {},// 多规格信息
				
				ActiveStatusEnum,
				actEndTimeList: [],// 倒计时
				active: {},// 秒杀活动详情
				goods: {}, // 商品详情
				buy_user: [], //谁购买了
				
				active_time_id: "",
				sharp_goods_id: "",
				skuCoverImage: "",
				scrollTop: 0,
				article_content: "",
				homeStyle: 'div',
				storeColor:'',

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
				scene = app.getSceneData(options); // 秒杀商品id

			that.setData({
				active_time_id: options.active_time_id ? options.active_time_id : scene.aid,
				sharp_goods_id: options.sharp_goods_id ? options.sharp_goods_id : scene.gid
			});
			if (scene.wid) {
				app.wxapp_id = scene.wid;
				wx.setStorageSync("wxapp_id", scene.wid)
			}
			// 获取秒杀商品信息
			that.homeStyle = app.homeStyle ? app.homeStyle : 'div';
			that.storeColor = app.storeColor;
			that.getActiveDetail();
			// #ifdef MP
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline'],
				success(res) {
				},
				fail(e) {
				}
			})
			// #endif

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
		// 用户点击右上角分享
		// #ifdef MP
		onShareAppMessage() {
			return {
				title: this.goods.goods.goods_name,
				path: '/pages/sharp/goods/index?active_time_id=' + this.active_time_id + '&sharp_goods_id=' + this.sharp_goods_id +
					'&wid=' + this.goods.wxapp_id,
			};
		},
		onShareTimeline() {
			return {
				title: this.goods.goods.goods_name,
				query: 'active_time_id=' + this.active_time_id + '&sharp_goods_id=' + this.sharp_goods_id + '&wid=' + this.goods.wxapp_id
			};
		},
		// #endif

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
			// 获取秒杀商品信息
			getActiveDetail() {
				let that = this;

				app._get('sharp.goods/detail', {
					active_time_id: that.active_time_id,
					sharp_goods_id: that.sharp_goods_id
				}, result => {
					// 初始化详情数据
					let data = that.initDataFun(result.data);
					
					that.setData(data); 
					// 执行倒计时
					CountDown.onSetTimeList(that, 'actEndTimeList');
					
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
					});
				});
			},
			// 初始化详情数据
			initDataFun(data) {
				let that = this; 
				// 商品详情
				let goodsDetail = data.goods.goods; // 富文本转码

				if (goodsDetail.content.length > 0) {
					//wxParse.wxParse('content', 'html', goodsDetail.content, that, 0)
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
				that.detail = goodsDetail;
				// 记录活动到期时间
				data.actEndTimeList = [{
					date: data.active.active_status == ActiveStatusEnum.STATE_SOON.value ? data.active.start_time : data.active.end_time
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
			// 初始化商品多规格
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
				goods.active_time_id = this.active.active_time_id;
				let data = {
					opeText: 'weChat, weChatFriends',
					isTwo: true,
					upGoods: goods
				}
				this.$refs.shareBottom.open(data);
			},

			// 确认购买弹窗
			openDialog(btnType) {
				let goods = this.goods;
				goods.active_time_id = this.active_time_id;
				this.$refs.proSpecs._open(goods, btnType || '')
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
<style lang="scss">
	@import 'index';
</style>
