<template>
	<view class="bgf5 min_h_100" :class="homeStyle+'-container'">
		<!-- 自定义标题栏 -->
		<template v-if="homeStyle=='minishop'||homeStyle=='sportshop'">
			<navigationBar title="限时秒杀" extClass="nav" id="top"></navigationBar>
		</template>
		<template v-else>
			<view class="listbg" :style="'height:'+listbgH+'px'"></view>
			<navigationBar title="限时秒杀" extClass="nav" id="top" :color="no_tabbar||(opcity >= 1) ? '#000' : '#fff'" :background="'rgba(255,255,255,' + opcity + ')'"></navigationBar>
		</template>
		<view v-if="tabbar.length" class="container">
			<!-- 秒杀时间点tab -->
			<view class="sharp-tabs" id="sharp-tabs">
				<scroll-view scroll-x="true" scroll-with-animation :show-scrollbar="false" :scroll-into-view="scrollViewId">
					<template v-for="(item, index) in tabbar">
						<view :key="index" :id="`id_${index}`" @tap.stop="onToggleTab(index)" :class="'tabs-item ' + ( curTabIndex == index ? 'active' : '' ) + ' flex-dir-column flex-y-center'">
							<block v-if="item.status == StateEnum.ACTIVE_STATE_NOTICE.value">
								<view class="item-time"></view>
								<view class="item-title">{{ item.status_text }}</view>
								<!-- <view class="item-status">{{ item.status_text }}</view> -->
							</block>
							<block v-else>
								<view class="item-time">{{ item.active_time.text }}</view>
								<view class="item-status">{{ item.status_text }}</view>
							</block>
						</view>
					</template>
				</scroll-view>
			</view>
			<!-- 秒杀活动 -->
			<view class="sharp-active dis-flex flex-x-center flex-y-center">
				<!-- 活动状态 -->
				<view class="active-status">
					<!-- <text class="active-status--icon iconfont2 icon-xingzhuang"></text> -->
					<!-- <text class="active-status--text">{{ tabbar[curTabIndex].status_text2 }}</text> -->
					<!-- <text class="active-status--text">限量抢购，先抢先得</text> -->
				</view>
				<!-- 倒计时 -->
				<view class="active--count-down dis-flex flex-y-center">
					<view class="clock-text f-28">
						<text>{{ tabbar[curTabIndex].status == StateEnum.ACTIVE_STATE_BEGIN.value ? '本场还剩' : '距开始' }}</text>
					</view>
					<view class="clock">
						<text class="clock-time">{{ countDownList[0].dynamic.hou }}</text>
						<text class="clock-symbol">:</text>
						<text class="clock-time">{{ countDownList[0].dynamic.min }}</text>
						<text class="clock-symbol">:</text>
						<text class="clock-time">{{ countDownList[0].dynamic.sec }}</text>
					</view>
				</view>
			</view>
			<!-- 内容区域 -->
			<view class="bargain-hall">
				<!-- 商品列表 -->
				<sharpGoods :status="tabbar[curTabIndex].status" :stateEnum="StateEnum.ACTIVE_STATE_BEGIN.value" :homeStyle="homeStyle" :sharpList="goodsList.data" @onTargetActive="onTargetActive" @onToggleTrade="onToggleTrade"></sharpGoods>
				<view v-if="noMore" class="no-more f-28">生意宝技术支持～</view>
			</view>
		</view>
		<!-- 无数据提供的页面 -->
		<view v-else>
			<view class="yoshop-notcont">
				<text class="iconfont2 icon-bianzu1"></text>
				<text class="cont">亲，暂无秒杀商品哦</text>
			</view>
		</view>
		<!-- 确认购买弹窗 -->
		<!-- <proSpecs ref="proSpecs"></proSpecs> -->
		<zan-popup :show="showBottomPopup" type="bottom" @close="onToggleTrade">
			<view class="popup__trade">
				<!-- 关闭按钮 -->
				<view class="trade-close dis-flex flex-x-center flex-y-center" @tap.stop="onToggleTrade">
					<text class="iconfont2 icon-shanchu1 f-34 col-3"></text>
				</view>
				<!-- 主体信息 -->
				<view class="trade-main">
					<view class="fgoods-info dis-flex flex-y-center">
						<!-- 图片名称 -->
						<view class="fgoods-image bgf" @tap.stop="onPreviewSkuImage">
							<image lazy-load :src="skuCoverImage" mode="aspectFill"></image>
						</view>
						<view class="block-right flex-box">
							<view class="block-item dis-flex flex-y-center">
								<!-- 商品价 -->
								<view class="goods-price col-m">
									<template>
										<text class="f-32">￥</text>
										<text class="f-32">{{ seckill_price }}</text>
									</template>
								</view>
								<!-- 划线价 -->
								<view class="line-price col-9" v-if="original_price > 0">
									<text>￥{{ original_price }}</text>
								</view>
							</view>
							<view class="goods-stock dis-flex flex-x-between">
								<text class="f-26 col-7">库存：{{ seckill_stock }}</text>
								<text v-if="goods.limit_num > 0" class="f-26 col-7">限购：{{ goods.limit_num }}件</text>
							</view>
						</view>
					</view>
					<!-- 规格列表 -->
					<view class="goods-attr">
						<!-- 滚动容器 -->
						<scroll-view class="goods-attr--scroll" scroll-y="true">
							<view class="group-item" v-for="(attr, attr_idx) in goodsMultiSpec.spec_attr" :key="attr_idx">
								<view class="tips-text" :data-id="attr.group_id">{{ attr.group_name }}</view>
								<view :class="'spec-item ' + ( item.checked ? 'cur' : '' )" v-for="(item, item_idx) in attr.spec_items" :key="item_idx"
								 :data-attr-idx="attr_idx" :data-item-idx="item_idx" @tap.stop="onSwitchSpec">
									<view class="spec-itemBox onelist-hidden">{{ item.spec_value }}</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 购买数量 -->
					<view class="buy_number dis-flex flex-y-center">
					  <view class="buyNumber f-28">
					    <text>购买数量</text>
					  </view>
						<view class="select-number" v-if="listNumShow">
							<tui-numberbox :max="goods.limit_num > 0?goods.limit_num:seckill_stock" :value="goods_num" :height="44" backgroundColor="#fff" @change="onInputGoodsNum($event)"></tui-numberbox>
						</view>
					</view>
				</view>
				<!-- 底部操作栏 -->
				<view class="foot-operate flex-y-center dis-flex">
				  <block v-if="seckill_stock > 0">
						<view class="order-bt orderBut m-r-30 m-l-30 flex-box" @tap.stop="onCheckout">确定</view>
				  </block>
				  <view class="default-btn" v-else>暂无现货</view>
				</view>
			</view>
		</zan-popup>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import sharpGoods from '../_templete/sharpGoods/index';
	// import proSpecs from '../_templete/proSpecs/pro-specs';
	// 工具类
	import util from "@/utils/util"; // 倒计时插件
	// 倒计时插件
	import CountDown from "@/utils/countdown"; // 枚举类：秒杀会场活动状态
	// 枚举类：秒杀会场活动状态
	import StateEnum from "@/utils/enum/sharp/ActiveStatus"; // 记录规格的数组
	// 记录规格的数组
	let goodsSpecArr = [];
	import zanPopup from "@/components/popup/index";
	import downloadFile from '@/components/download-file';

	export default {
		data() {
			return {
				// 当前tab索引
				listbgH: '',
				opcity: 0,
				scrollH: 0, //滚动总高度
				curTabIndex: 0,
				scrollViewId: "id_0",
				noMore: false,
				// 没有更多数据
				isLoading: true,
				// 是否正在加载中
				page: 1,
				// 当前页码
				StateEnum,
				// 枚举类：秒杀会场活动状态
				// 倒计时
				countDownList: [],
				// 秒杀活动场次
				tabbar: [],
				no_tabbar: false,
				// 秒杀商品列表
				goodsList: [],
				goods: {},
				//商品详情数据
				seckill_price: 0,// 商品价格
				original_price: 0,// 划线价格
				seckill_stock: 0,
				goods_num: 1,
				// 商品数量
				goods_sku_id: 0,
				// 规格id
				goodsMultiSpec: {},
				// 多规格信息
				skuCoverImage: '',
				//商品封面图(确认弹窗)
				showBottomPopup: false, //确认弹窗默认
				listNumShow: true,
				homeStyle: 'div',
			};
		},

		components: {
			zanPopup,
			// proSpecs,
			sharpGoods,
			downloadFile
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			let that = this;
			that.homeStyle = App.homeStyle ? App.homeStyle : 'div';

			if (that.curTabIndex == 0) {
				// 获取列表数据
				that.getApiData();
			}
		},
		updated() {
			this.getH()
			this.getH2()
		},

		/**
		 * 下拉到底部加载下一页
		 */
		onReachBottom() {
			let _this = this,
				listData = _this.goodsList; // 已经是最后一页


			if (_this.page >= listData.last_page) {
				_this.setData({
					noMore: true
				});

				return false;
			} // 加载下一页列表


			_this.setData({
				page: ++_this.page
			});

			_this.getGoodsList(true);
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage() {
			let _this = this; 
			// 构建页面参数
			let params = getApp().globalData.getShareUrlParams();
			return {
				title: '整点秒杀',
				path: `/pages/sharp/index/index?${params}`
			};
		},

		methods: {
			/**
			 * 获取列表数据
			 */
			getApiData() {
				let _this = this;

				getApp().globalData._get('sharp.index/index', {
					s: '/xapi/sharp.index/index'
				}, result => {
					_this.setData(result.data); // 初始化倒计时组件
					_this.initCountDownDataFun();
				},false, (res)=>{
					if(res.data.data==''){
						_this.no_tabbar=true;
					}
				});
			},

			/**
			 * 初始化倒计时组件
			 */
			initCountDownDataFun(data) {
				let _this = this,
					curTabbar = _this.tabbar[_this.curTabIndex]; // 记录倒计时的时间
				if (this.countDownList.length == 0) {
					this.countDownList.push({
						date: curTabbar.count_down_time
					})
				} else {
					this.countDownList[0].date = curTabbar.count_down_time
				}
				// 执行倒计时
				CountDown.onSetTimeList(_this, 'countDownList');
			},

			/**
			 * 切换tabbar
			 */
			onToggleTab(index) {
				this.setData({
					curTabIndex: index,
					goodsList: [],
					page: 1,
					isLoading: true,
					noMore: false
				}); 
				// 获取列表数据
				this.getGoodsList(); 
				// 初始化倒计时组件
				this.initCountDownDataFun();
				this.checkCor();
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor() {
				if (this.curTabIndex > 2) {
					this.scrollViewId = `id_${this.curTabIndex - 2}`;
				} else {
					this.scrollViewId = `id_0`;
				}
			},
			/**
			 * 跳转到砍价商品详情
			 */
			onTargetActive(sharp_goods_id) {
				let that = this,
					curTabbar = that.tabbar[that.curTabIndex]; 
				let query = util.urlEncode({
					active_time_id: curTabbar.active_time_id,
					sharp_goods_id: sharp_goods_id
				});
				uni.navigateTo({
					url: `../goods/index?${query}`
				});
			},

			/**
			 * 获取列表数据
			 */
			getGoodsList(isNextPage) {
				let _this = this,
					curTabbar = _this.tabbar[_this.curTabIndex];

				getApp().globalData._get('index.php', {
					s: 'xapi/sharp.goods/lists',
					page: _this.page || 1,
					active_time_id: curTabbar.active_time_id
				}, result => {
					let resList = result.data.list,
						dataList = _this.goodsList;
					if (isNextPage == true) {
						_this.setData({
							'goodsList.data': dataList.data.concat(resList.data),
							isLoading: false
						});
					} else {
						_this.setData({
							goodsList: resList,
							isLoading: false
						});
					}
				});
			},
			//立即购买
			openDialog(item) {
				let goods = item;
				goods.active_time_id = this.tabbar[this.curTabIndex].active_time_id;
				this.$refs.proSpecs._open(item.wxappgoods,'buyNow')
			},
			//确认购买弹窗
			onToggleTrade(item) {
				let _this = this;
				if (_this.showBottomPopup == false) {
					_this.goods = item;
					_this.listNumShow = false
					_this.goods_num = 1;
					_this.$nextTick(() => {
						_this.initDataFun(item);
						_this.listNumShow = true
					});

					_this.showBottomPopup = !_this.showBottomPopup;
				} else {
					_this.showBottomPopup = !_this.showBottomPopup;
				}
			},

			/**
			 * 初始化详情数据
			 */
			initDataFun(data) {
				let _this = this; // 商品详情

				let goodsDetail = data; // 商品价格/划线价/库存
				
				// 初始化商品多规格
				let goodsMultiSpec = {}; // 初始化商品多规格

				if (goodsDetail.wxappgoods.goods.spec_type == 20) {
						goodsMultiSpec = _this.initManySpecDataFun(goodsDetail.goods_multi_spec);

					_this.setData({
						goodsMultiSpec: goodsMultiSpec
					});
					for (let i in _this.goodsMultiSpec.spec_attr) {
						for (let j in _this.goodsMultiSpec.spec_attr[i].spec_items) {
							if (j < 1) {
								_this.goodsMultiSpec.spec_attr[i].spec_items[0].checked = true;
								goodsSpecArr[i] = _this.goodsMultiSpec.spec_attr[i].spec_items[0].item_id;
							} else {
								_this.goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;
							}
						}
					}
					
					_this.updateSpecGoodsFun();
				} else {
					_this.setData({
						goods_sku_id: goodsDetail.goods_sku.spec_sku_id,
						seckill_price: goodsDetail.goods_sku.seckill_price,
						original_price: goodsDetail.goods_sku.original_price,
						seckill_stock: goodsDetail.goods_sku.seckill_stock,
						skuCoverImage: goodsDetail.goods_image,
						goodsMultiSpec: {}
					});
				}

			},

			/**
			 * 确认购买
			 */
			onCheckout(e) {
				let _this = this; 

				if (!_this.onVerifyFun()) {
					return false;
				} 

				// 立即购买
				uni.navigateTo({
					url: '/pages/flow/checkout?' + util.urlEncode({
						order_type: 'sharp',
						active_time_id: _this.tabbar[_this.curTabIndex].active_time_id,
						sharp_goods_id: _this.goods.sharp_goods_id,
						goods_sku_id: _this.goods_sku_id,
						goods_num: _this.goods_num
					}),

					success() {
						// 关闭弹窗
						_this.setData({
							showBottomPopup: !_this.showBottomPopup
						});
					}

				});
			},

			/**
			 * 表单验证
			 */
			onVerifyFun() {
				let _this = this;

				if (_this.goods_num === '') {
					getApp().globalData.showError('请输入购买数量');
					return false;
				} 

				// 将购买数量转为整型，防止出错
				_this.setData({
					goods_num: parseInt(_this.goods_num)
				});

				if (_this.goods_num <= 0) {
					getApp().globalData.showError('购买数量不能为0');
					return false;
				} // 判断限购数量


				return true;
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
			 * 点击切换不同规格
			 */
			onSwitchSpec(e) {
				this.listNumShow = false;
				let _this = this,
					attrIdx = e.currentTarget.dataset.attrIdx,
					itemIdx = e.currentTarget.dataset.itemIdx,
					goodsMultiSpec = _this.goodsMultiSpec; 

				for (let i in goodsMultiSpec.spec_attr) {
					for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
						if (attrIdx == i) {
							goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;

							if (itemIdx == j) {
								goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
								goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
							}
						}
					}
				}

				_this.setData({
					goodsMultiSpec
				}); // 更新商品规格信息


				_this.updateSpecGoodsFun();
				_this.$nextTick(() => {
					_this.listNumShow = true
				})
			},

			/**
			 * 更新商品规格信息
			 */
			updateSpecGoodsFun() {
				let _this = this,
					specSkuId = goodsSpecArr.join('_'); // 查找skuItem


				let spec_list = _this.goodsMultiSpec.spec_list,
					skuItem = spec_list.find(val => {
						return val.spec_sku_id == specSkuId;
					}); // 记录goods_sku_id
				// 更新商品价格、划线价、库存
				if (typeof skuItem === 'object') {
					_this.setData({
						// showBottomPopup: true,
						goods_sku_id: skuItem.spec_sku_id,
						seckill_price: skuItem.form.seckill_price,
						original_price: skuItem.form.original_price,
						seckill_stock: skuItem.form.seckill_stock,
						skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.goods.goods_image
					});
				}
			},
			/**
			 * 自定义输入商品数量
			 */
			onInputGoodsNum(e) {
				let _this = this,
					iptValue = e.value;

				if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
					iptValue = 1;
				}

				_this.setData({
					goods_num: iptValue
				});
			},

			/**
			 * 预览Sku规格图片
			 */
			onPreviewSkuImage(e) {
				let _this = this;

				wx.previewImage({
					current: _this.skuCoverImage,
					urls: [_this.skuCoverImage]
				});
			},
			// 点击下载
			// upload(files) {
			// 	const that = this;
			// 	let uploads = [];
			// 	files.forEach(item => {
			// 		uploads.push(item.file_path)
			// 	});
			// 	if (uploads != '') {
			// 		uni.showModal({
			// 			title: '友情提示',
			// 			content: '是否下载该商品的图片/视频？',
			// 			confirmColor: '#FF7541',
			// 			confirmText: '是',
			// 			cancelText: '否',
			// 			success: (res) => {
			// 				if (res.confirm) {
			// 					that.$refs.download._downloadFileS(uploads);
			// 				}
			// 			}
			// 		});
			// 	} else {
			// 		that.$api.msg('该商品暂无可下载的图片/视频');
			// 	}
			// },
			// comfirmStatusS(promise) {
			// 	promise.then((res) => {
			// 		uni.hideLoading();
			// 		uni.hideToast();
			// 		this.$api.msg(res ? "保存成功~" : '取消保存')
			// 	})
			// },
			getH(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('#top').boundingClientRect(result => { 
				  if (result) {
				    this.vheight = result.height;
				  }else { 
				    this.getH(); 
					} 
				}).exec();
			},
			getH2(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.tabs-item').boundingClientRect(result => {
				  if (result) {
						let spreadBlur = this.homeStyle=='saler'? 10: 0;
						this.listbgH = result.height + this.vheight + spreadBlur;
						this.scrollH = result.height;
				  }else { 
				    this.getH2(); 
					} 
				}).exec();
			},
			onPageScroll(e) {
				let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
				let opcity = scroll / this.scrollH;
				if (this.opcity >= 1 && opcity >= 1) {
					return;
				}
				this.opcity = opcity;
			},
		}
	};
</script>
<style lang="scss">
	@import "./index";
	@import '@/components/goods/proSpecs/index';
</style>
