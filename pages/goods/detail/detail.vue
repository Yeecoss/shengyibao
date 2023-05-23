<template>
	<view :style="storeColor[homeStyle]">
		<!-- 自定义标题栏 -->
		<view id="top">
			<navigationBar title="商品详情" extClass="nav"></navigationBar>
		</view>

		<view class="container p-bottom" v-if="detail.goods_id">
			<scroll-view @scroll="scroll" :scroll-top="scrollTop" scroll-y="true">
				<template v-if="homeStyle=='sportshop'">
					<detail-swiper4 ref="detailSwiper4" @onClickShare="onClickShare" @clipboard="clipboard"></detail-swiper4>
				</template>
				<template v-if="homeStyle=='minishop'">
					<detail-swiper3 ref="detailSwiper3" :imageList="detail.image"></detail-swiper3>
				</template>
				<template v-if="homeStyle=='saler'">
					<detail-swiper2 ref="detailSwiper2" :imageList="detail.image"></detail-swiper2>
				</template>
				<template v-if="homeStyle=='div'">
					<detail-swiper ref="detailSwiper" :imageList="detail.image"></detail-swiper>
				</template>
				<view class="cont-box">
					<!-- 商品标题内容 -->
					<template v-if="homeStyle!='sportshop'">
						<goods-info :homeStyle="homeStyle" :goodsDetail="detail" @onClickShare="onClickShare" @clipboard="clipboard"></goods-info>
					</template>
					<view class="gray-bg20"></view>
					<!-- 选择商品规格 -->
					<view v-if="goodsMultiSpec.spec_attr" @tap.stop="openDialog('')">
						<view class="sku-selector b-f dis-flex flex-y-center">
							<view class="flex-box f-28">
								<text class="col-9 f-30">选择：</text>
								<text v-for="(item, index) in goodsMultiSpec.spec_attr" :key="index">
									<text v-if="index != 0">/</text>
									{{ item.group_name }}
								</text>
							</view>
							<view class="f-26 col-9 t-r">
								<text class="iconfont icon-xiangyoujiantou f-w"></text>
							</view>
						</view>
					</view>
					<view v-if="goodsMultiSpec.spec_attr" class="gray-bg20"></view>
					<!-- 卖点 -->
					<selling-point :selling_point="detail.selling_point"></selling-point>
					<!-- 商品评价 -->
					<goods-comment :comment_data="detail.comment_data" :comment_data_count="detail.comment_data_count" :goods_id="goods_id"></goods-comment>
					<!-- 商品描述 -->
					<goods-describe :article_content="article_content" :hiddenOrder="hiddenOrder"></goods-describe>
					<!-- 购前说明 -->
					<goods-instructions></goods-instructions>
					<!-- 谁购买了 -->
					<goods-buyers @showLogin="showLogin" :noLogin="noLogin" :buyerList="buy_user" :goods_id="goods_id"></goods-buyers>
					<!-- 猜你喜欢 -->
					<goods-like :goodsLikeList="goodsLikeList"></goods-like>
				</view>

			</scroll-view>
			<!-- 底部操作栏 -->
			<view class="footer-fixed f-30 flex-y-center" :class="homeStyle+'-footer'">
				<!-- 主页按钮 -->
				<view @tap.stop="onNavigationHome" class="goods-fixed-icon dis-flex flex-dir-column flex-x-center flex-y-center">
					<text class="iconfont2 icon-Fill1 f-20"></text>
					<view class="fast-text">
						<text>首页</text>
					</view>
				</view>
				<!-- 收藏按钮 -->
				<view class="goods-fixed-icon  dis-flex flex-dir-column flex-x-center flex-y-center" @tap="toCollect">
					<text class="iconfont2 icon-delete2 f-20" :class="ifCollect?'checked':''"></text>
					<view class="fast-text">
						<text>关注</text>
					</view>
				</view>
				<!-- 下载 -->
				<view class="goods-fixed-icon dis-flex flex-dir-column flex-x-center flex-y-center" @tap="upload(detail.image)">
					<text class="iconfont2 icon-download"></text>
					<view class="fast-text">
						<text>下载</text>
					</view>
				</view>
				<view class="order-bt m-r-30 f-28" style="margin-left: 200rpx;" @tap.stop="openDialog('addCart')">加入购物车</view>
				<!-- <view class="order-bt m-r-30 f-28" @tap.stop="openDialog('buyNow')">立即购买</view> -->
			</view>
		</view>
		<!-- 确认购买弹窗 -->
		<proSpecs @showLogin="showLogin" :noLogin="noLogin" ref="proSpecs" :pageType="pageType"></proSpecs>
		<!-- 返回顶部 -->
		<view @tap.stop="onScrollTop" class="widget-goTop" v-if="floorstatus">
			<text class="iconfont icon-fanhuidingbu"></text>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- 分享同步 -->
		<share-bottom @showLogin="showLogin" :noLogin="noLogin" ref="shareBottom" pageType="goods"></share-bottom>
		<login ref="login"></login>
	</view>
</template>

<script>
	const app = getApp().globalData; // 富文本插件

	// 工具类
	const util = require("utils/util.js"); // 记录规格的数组
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	// 记录规格的数组
	let goodsSpecArr = [];
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
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	import downloadFile from '@/components/download-file';
	import shareBottom from '@/components/share-bottom/index';
	import login from '@/components/login/index';

	export default {
		components: {
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
			proSpecs,
			downloadFile,
			shareBottom,
			login
		},
		data() {
			return {
				noLogin: false,
				goods_id: '',
				detail: {},// 商品详情信息
				buy_user: [],//谁购买了
				article_content: "",
				hiddenOrder: false,
				
				goodsMultiSpec: {},// 多规格信息
				
				floorstatus: false,// 返回顶部\
				scrollTop: 0,
				
				ifCollect: false, //默认没有收藏
				btnType: '', //点击的按钮类型购买/购物车
				homeStyle: 'div',
				storeColor:'',
			};
		},

		props: {
			pageType: {
				type: String
			},
			goodsLikeList: {
				type: Array,
				default: () => []
			}
		},
		created() {
			// #ifdef MP
			this.noLogin = true
			// #endif
		},
		methods: {
			// 获取商品信息
			getDetail(data) {
				let that = this;
				that.homeStyle = app.homeStyle ? app.homeStyle : 'div';
				that.goods_id = data.detail.wxapp_goods_id;
				that.ifCollect = data.collection_status; //收藏状态
				that.upGood = data.detail;
				// 谁购买了
				that.buy_user = data.buy_user || [];
				// 初始化商品详情数据
				that.initGoodsDetailDataFun(data);
				that.storeColor = app.storeColor;
				setTimeout(() => {
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
				}, 200)
			},
			// 初始化商品详情数据
			initGoodsDetailDataFun(data) {
				let goodsDetail = data.detail.goods; // 富文本转码

				if (goodsDetail.content.length > 0) {
					setTimeout(() => {
						let content = goodsDetail.content || ''
						// content = content.replace(/video/g, 'iframe')
						// let reg = /<video+[^<>]+><\/video>/ig;
						// let r = content.match(reg)
						// let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
						// let newList = []
						// if (r) {
						// 	r.forEach(item => {
						// 		let src = item.match(srcReg)
						// 		let newContent = 
						// 		'<p style="position:relative;"><image imgType="video" style="min-width: 100%; max-width: 100%;position:relative;" src="'
						// 		+ src[1]
						// 		+ '?vframe/jpg/offset/0|imageView2/1/"></image><view class="videoPlay"><text class="iconfont2 icon-broadcast1 f-28 m-left"></text></view></p>'
						// 		newList.push({
						// 			content: item,
						// 			newContent: newContent
						// 		})
						// 	})
						// }
						// newList.forEach(item => {
						// 	content = content.replace(item.content, item.newContent)
						// })
						this.article_content = content;
					}, 200);
				} 

				// 商品图片列表将视频放在首位
				if (goodsDetail.image) {
					this.detail.image = this.initImageList(goodsDetail.image);
				} 

				// 初始化商品多规格
				if (goodsDetail.spec_type == 20) {
					this.goodsMultiSpec = this.initManySpecDataFun(goodsDetail.goods_multi_spec);
				} 

				// 商品评价时间截取
				if (data.detail.comment_data_count > 0) {
					goodsDetail.comment_data_count = data.detail.comment_data_count;
					goodsDetail.comment_data = this.initCommentDataFun(data.detail.comment_data);
				}
				this.detail = goodsDetail;
			},

			// 初始化图片列表
			initImageList(data) {
				let newData = [];
				data.forEach(item => {
					if (item.file_media == 'video') {
						newData.push(item);
					}
				});
				data.forEach(item => {
					if (item.file_media == 'image') {
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
			// 初始化评论时间
			initCommentDataFun(data) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].create_time) {
						data[i].create_newtime = data[i].create_time.substring(5, 16);
					}
				}
				return data;
			},
			// 初始化谁购买了
			initBuyerDataFun(data) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].create_time) {
						data[i].create_newtime = data[i].create_time.substring(5, 16);
						data[i].create_newtime = data[i].create_time.substring(5, 16);
					}
				}
				return data;
			},
			//返回顶部
			onScrollTop(t) {
				this.scrollTop = 0
			},
			// 显示/隐藏 返回顶部按钮
			scroll(e) {
				this.floorstatus = e.detail.scrollTop > 200
			},
			// 显示分享选项
			onClickShare(e) {
				if(this.pageType!='goodsPriview'){
					let data = {
						opeText: 'upGoods,copyGoods,weChat, weChatFriends',
						isTwo: true,
						upGoods: this.upGood
					}
					this.$refs.shareBottom.open(data);
				}
			},
			// 确认购买弹窗
			//立即购买
			openDialog(btnType) {
				this.$refs.proSpecs._open(this.upGood,btnType||'')
			},
			// 返回主页
			onNavigationHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			showLogin(next) {
				app.doLogin(1, (code) => {
					if (code == 1) {
						this.$refs.login.open(next)
					} else {
						next()
					}
				}, true, true)
			},
			//点击收藏
			toCollect() {
				let that = this;
				if(that.pageType!='goodsPriview'){
					let url = that.ifCollect ? 'user.collection/del' : 'user.collection/add';
					app._post_form(url, {
						type: 1,
						object_id: that.goods_id
					}, res => {
						if (res.code == -1) {
							that.showLogin(that.toCollect)
						} else {
							that.ifCollect = !that.ifCollect;
							that.$api.msg(res.msg);
						}
					}, false, false, false, that.noLogin);
				}
			},
			// 点击下载
			upload(files) {
				const that = this;
				if(that.pageType!='goodsPriview'){
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
			// toTagPros(item){
			// 	uni.navigateTo({
			// 		url: '/pages/goods/tagGoodsList/tagGoodsList?tag='+item
			// 	})
			// },
		}
	};
</script>
<style lang="scss" scoped>
	@import "detail";
</style>
