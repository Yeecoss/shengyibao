<template>
	<view class="container">
		<!-- 自定义标题栏 -->
		<navigationBar :back="false" title="点餐" extClass="nav" id="top"></navigationBar>
		<view class="addGoodsBox" @tap="toAddGoods" v-if="isShop">
			<view class="addGoods">
				<image class="bg" src="/static/images/checkBg.png" mode="aspectFill"></image>
				<view class="info dis-flex flex-y-center flex-x-between">
					<view class="tipBox">
						<view class="tip1">
							没找到想推荐的菜？
						</view>
						<view class="tip2">
							上传你推荐的菜品
						</view>
					</view>
					<view class="upload">
						上传
					</view>
				</view>
			</view>
		</view>
		<view class="recommend">
			<text>为你推荐</text>
			<view class="recommendBg"></view>
		</view>
		<template v-if="tabbar.length">
			<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-into-view="scrollViewId"
				:style="{ height: height + 'px', top: top + 'px' }">
				<view :id="`id_toView${index}`" v-for="(item, index) in tabbar" :key="index" class="tab-bar-item"
					:class="[currentTab == index ? 'active' : '']" @tap.stop="swichNav(index)">
					<text class="onelist-hidden">{{ item.tag }}</text>
					<view class="tabbar_icon m-r-10" v-if="item.icon"
						:style="'background: linear-gradient(to bottom,'+item.top_color+','+item.bottom_color+');-webkit-background-clip: text;-webkit-text-fill-color: transparent;'">
						<text class="iconfont2 f-28 col-f" :class="item.icon"></text>
					</view>
					<template v-if="currentTab == index">
						<view class="topMask" v-if="index != 0">
							<view class="maskCont"></view>
						</view>
						<view class="bottomMask" v-if="index != tabbar.length - 1">
							<view class="maskCont"></view>
						</view>
					</template>
				</view>
			</scroll-view>
			<scroll-view scroll-y class="right-box" @scroll="scroll" :scroll-into-view="toView" scroll-with-animation :style="{ height: height + 'px', top: top + 'px' }">
				<view class="page-view">
					<!-- 非热销等 -->
					<view class="class-box" v-for="(item0, index0) in tabbar" :key="index0" :id="'toView' + index0">
						<view class="tagName">
							{{item0.tag}}
						</view>
						<template v-if="item0.goods">
							<view class="class-item">
								<view class="g-container">
										<view class="g-box m-b-30 dis-flex flex-x-between" v-for="(vo, k) in item0.goods" :key="k"
											@tap.stop="toDetail(vo)">
											<view class="g-box-pic">
												<image lazy-load mode="aspectFill" :src="vo.goods_image"
													class="g-image" />
											</view>
											<view class="g-box-info flex-box m-l-20" @tap.stop>
												<view class="g-title onelist-hidden f-30 col-3 f-w">
													{{vo.goods_name}}</view>
												<view class="f-26 col-6 m-t-4" style="line-height: 36rpx;">
													销量{{vo.goods_sales||0}}</view>
												<view class="app-red f-32 f-w" style="margin-top: 44rpx;"><text
														class="f-26">¥</text>{{vo.min_price||0}}</view>
												<view class="prolist-addBox" v-if="vo.spec_type == 20">
													<view class="selectBut" @tap.stop="openDialog(vo)">选规格</view>
												</view>
												<view v-else class="prolist-addBox dis-flex" v-else>
													<tui-numberbox :value="vo.total_num" :disabledInput="true"
														:width="56" :height="44" backgroundColor="#fff"
														@change="onInputGoodsNum($event,vo)" :min="0"></tui-numberbox>
												</view>
											</view>
										</view>
								</view>
							</view>
						</template>
						<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
						<!-- <tui-loadmore v-if="loadding" :index="2" type="primary"></tui-loadmore> -->
						<tui-nomore v-if="(!pullUpOn && item0.list.data!='') || page==item0.list.last_page"
							text="生意宝技术支持" backgroundColor="#fff"></tui-nomore>
					</view>
					<view style="height: 140rpx;"></view>
				</view>
				<!-- 无数据 -->
				<view class="g-container-nodata min_h_100 p-t-30 dis-flex flex-x-center flex-y-center"
					v-if="item0.list==''||(item0.list&&item0.list.data=='')">
					<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png"
						:imgWidth="264" :imgHeight="264" :fixed="false">
						<view class="col-9">暂无数据</view>
					</tui-no-data>
				</view>
				<!--内容部分 end 自定义可删除-->
			</scroll-view>
		</template>
		<!-- 无分类数据 -->
		<view class="g-container-nodata min_h_100 p-t-30 dis-flex flex-x-center flex-y-center" v-else>
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264"
				:imgHeight="264">
				<view class="col-9">亲, 没有相关内容</view>
			</tui-no-data>
		</view>
		<!-- 确认购买弹窗 -->
		<proSpecs ref="proSpecs" @update="getCartList()"></proSpecs>
		<view class="couponMask">
			<couponMask ref="couponMask" :coupon_money="coupon_money" :order_price="order_price" :cartTotalPrice="cartTotalPrice" @upCoupon="upCoupon" @footOptShadowShow="footOptShadowShow" :coupon_list="coupon_list" :coupon_id="coupon_id"></couponMask>
		</view>
		<view class="buyCar">
			<buyCar ref="buyCar" @footOptShadowShow="footOptShadowShow" :list="cartList" @getGoodsNum="getGoodsNum" @getCartList="getCartList"></buyCar>
		</view>
		<view class="footOpt dis-flex flex-x-between flex-y-center" :class="footOptShadow ? 'footOptShadow' : ''">
			<view class="dis-flex">
				<view class="imgBox" @tap="openList">
					<image src="/static/images/car.png" mode="aspectFill"></image>
					<view class="num">
						{{cartTotalNum}}
					</view>
				</view>
				<view class="allPrice dis-flex flex-wrap flex-y-end">
					<view class="dis-flex flex-y-end">
						<text>￥</text>
						<text class="priceNum">{{cartTotalPrice}}</text>
					</view>
					<text class="coupon" @tap.stop="openCoupon()">
						已优惠<text>￥{{coupon_money}}</text>
						<text class="iconfont2 icon-shangjiantou"></text>
					</text>
				</view>
			</view>
			<view class="toBuy" @tap.stop="showMask">
				立即购买
			</view>
		</view>
		<!-- 自定义tabbar -->
		<foot-tabBar ref="footTabBar" dIndex='1' :homeStyle="homeStyle"></foot-tabBar>
		
		<popup v-if="showPopup" :show="showPopup" @clickmask="clickmask">
			<view class="popup-main" catchtouchmove='true'>
				<view class="title">
					选择点餐方式
					<view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
				</view>
				<view class="checkList dis-flex flex-y-center" @tap="submit(1)">
					<view class="imgBox">
						<image src="/static/images/tangshi.png" mode="aspectFill"></image>
					</view>
					<view class="checkInfo flex-box">
						<view class="checkName">
							堂食
						</view>
						<view class="checkMsg">
							新鲜美味可口
						</view>
					</view>
					<text class="iconfont2 icon-more4"></text>
				</view>
				<view class="checkList dis-flex flex-y-center" @tap="submit(2)" style="margin-top: 32rpx;">
					<view class="imgBox">
						<image src="/static/images/waimai.png" mode="aspectFill"></image>
					</view>
					<view class="checkInfo flex-box">
						<view class="checkName">
							外卖
						</view>
						<view class="checkMsg">
							干净方便快捷
						</view>
					</view>
					<text class="iconfont2 icon-more4"></text>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import footTabBar from '@/components/foot-tabBar';
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	import buyCar from '@/components/goods/buyCar/index';
	import couponMask from '@/components/goods/couponMask/index';
	
	import popup from '@/components/popup/index';
	
	export default {
		components: {
			footTabBar,
			proSpecs,
			buyCar,
			popup,
			couponMask
		},
		data() {
			return {
				footOptShadow: true,
				tabbar: [],
				height: 0, //scroll-view高度
				top: 0,
				currentTab: 0, //预设当前项的值
				scrollViewId: "id_toView0",
				page: 1,
				loadding: false,
				pullUpOn: true,
				homeStyle: 'div',
				cartList: [],
				order_price: '0.00',
				cartTotalPrice: '0.00',
				cartTotalNum: '0',
				coupon_money: '0',
				coupon_list: [],
				coupon_id: '',
				showPopup: false,
				toView: '',
				isShop: false,
				isScroll: false
			};
		},
		onLoad(options) {
			this.isShop = (app.myShopInfo.wxapp_id == app.wxapp_id)
			// 设置分类列表高度
			this.$nextTick(() => {
				this.setListHeight();
			});
		},
		onShow() {
			this.homeStyle = app.homeStyle ? app.homeStyle : 'div';
			this.getList()
		},
		methods: {
			scroll(e) {
				if (!this.isScroll) {
					let currentTab = 0;
					this.tabbar.forEach((item, index) => {
						if (e.detail.scrollTop + 216 > item.top) {
							currentTab = index
						}
					})
					this.currentTab = currentTab
				}
			},
			footOptShadowShow() {
				this.footOptShadow = true
			},
			toAddGoods() {
				uni.navigateTo({
					url: '/pages/myGoods/goodsAdd/index'
				});
			},
			clickmask() {
				this.showPopup = false
			},
			showMask() {
				let cartIds = this.getCheckedIds();
				if (!cartIds.length) {
					app.showError('您还没有选择商品');
					return false;
				}
				this.showPopup = true
			},
			getCheckedIds() {
				let arrIds = [];
				this.cartList.forEach(item => {
					arrIds.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
				});
				return arrIds;
			},
			/**
			 * 购物车结算
			 */
			submit(type) {
				this.clickmask();
				let cartIds = this.getCheckedIds();
				if (!cartIds.length) {
					app.showError('您还没有选择商品');
					return false;
				}
				uni.navigateTo({
					url: '/pages/flow/checkout?order_type=cart&cart_ids=' + cartIds + '&wxapp_id=' + app.wxapp_id + '&checkType=' + type + '&coupon_id=' + this.coupon_id
				});
			},
			/**
			 * 递增指定的商品数量
			 */
			onAddCount(goods) {
				// 后端同步更新
				wx.showLoading({
					title: '加载中',
					mask: true
				});

				app._post_form('cart/add', {
					wxapp_goods_id: goods.wxapp_goods_id,
					goods_num: 1,
					goods_sku_id: goods.goods_sku.spec_sku_id
				}, () => {
				}, null, () => {
					wx.hideLoading();
					// 获取购物车列表
					this.getCartList();
				});
			},
			/**
			 * 获取购物车列表
			 */
			getCartList() {
				app._get('cart/list', {
					wxapp_id: app.wxapp_id,
					user_coupon_id: this.coupon_id
				}, result => {
					let shop_list = result.data.shop_list || {}
					this.cartList = shop_list.goods_list || []
					this.setPrice()
					this.cartTotalPrice = result.data.order_total_coupon_price || 0
					this.order_price = result.data.order_price || 0
					this.cartTotalNum = result.data.order_total_num || 0
					this.coupon_money = result.data.order_reduced_price || 0
					this.coupon_list = result.data.coupon_list || []
				});
			},
			upCoupon(val) {
				this.coupon_id = val
				this.getCartList()
			},
			/**
			 * 加法
			 */
			mathadd(arg1, arg2) {
				return (Number(arg1) + Number(arg2)).toFixed(2);
			},
			/**
			 * 递减指定的商品数量
			 */
			onSubCount(goods) {
				// 后端同步更新
				wx.showLoading({
			  title: '加载中',
					mask: true
				});

				app._post_form('cart/sub', {
					wxapp_goods_id: goods.wxapp_goods_id,
					goods_sku_id: goods.goods_sku.spec_sku_id
				}, () => {
				}, null, () => {
					wx.hideLoading();
					// 获取购物车列表
					this.getCartList();
				});
			},
			getGoodsNum(obj) {
				this.onInputGoodsNum(obj.e, obj.goods)
			},
			onInputGoodsNum(e, goods) {
				if (e.type == "plus") {
					this.onAddCount(goods)
				}
				if (e.type == "reduce") {
					this.onSubCount(goods)
				}
			},
			//获取数据
			getList() {
				app._get('category/getDinnerList', {}, res => {
					let list = res.data || [];
					list.forEach(item => {
						item.top = 0
						item.goods.forEach(element => {
							element.total_num = 0
						})
					})
					this.tabbar = list;
					this.getCartList()
					this.$nextTick(() => {
						const query = uni.createSelectorQuery().in(this);
						this.tabbar.forEach((item, index) => {
							query.select('#toView' + index).boundingClientRect(data => {
								item.top = data.top
							}).exec();
						})
					})
				});
			},
			setPrice() {
				this.tabbar.forEach(item => {
					item.total_num = 0
					item.goods.forEach(element => {
						if (element.spec_type != 20) {
							let ishave = false;
							this.cartList.forEach(items => {
								if (element.goods_id == items.goods_id) {
									element.total_num = items.total_num
									ishave = true;
								}
							})
							if (!ishave) {
								element.total_num = 0
							}
						}
					})
				})
			},
			//立即购买
			openDialog(item) {
				this.$refs.proSpecs._open(item, 'addCart')
			},
			openList() {
				let cartIds = this.getCheckedIds();
				if (!cartIds.length) {
					this.$api.msg('您还没有选择商品');
					return false;
				}
				this.$refs.buyCar.close()
				this.footOptShadow = false
				this.$refs.buyCar._open()
			},
			openCoupon() {
				if (this.coupon_list.length == 0) {
					this.$api.msg('暂无优惠')
				} else {
					this.$refs.buyCar.close()
					this.footOptShadow = false
					this.$refs.couponMask._open()
				}
			},
			// 设置分类列表高度
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						scrollHeight = systemInfo.windowHeight - res[0].height - 49 - 112; // swiper高度

					this.height = this.isShop ? scrollHeight : scrollHeight + 77;
					this.top = this.isShop ? res[0].height + 128 : res[0].height + 128 - 77
				});
			},
			// 点击标题切换当前页时改变样式
			swichNav(cur) {
				this.toView = 'toView' + cur;
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur;
					if (this.tabbar[cur].goods == undefined) { //||this.tabbar[cur].list.length<=0
						this.page = 1;
						this.checkCor();
					}
					this.isScroll = true
					setTimeout(() => {
						this.isScroll = false
					}, 1000)
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor() {
				if (this.currentTab > 6) {
					this.scrollViewId = `id_toView${this.currentTab - 2}`;
				} else {
					this.scrollViewId = `id_toView0`;
				}
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/goods/index?goods_id=' + item.wxapp_goods_id
				});
			},
			productList(item) {
				let url = '';
				if (item.category_id == "tag") {
					url = '/pages/goods/tagGoodsList/tagGoodsList?tag=' + item.name;
				} else {
					url = '/pages/category/extend/list?source=category&category_id=' + item.category_id
				}
				uni.navigateTo({
					url: url
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
