<template>
	<!-- 商品组 -->
	<view
		v-if="itemData && itemData.goodsList && itemData.goodsList.data && itemData.goodsList.data.length || (dataList && dataList.length)"
		class="diy-sharpGoods radius16" :class="params.source=='hot' ? 'hopSharp' : 'recommendSharp'">
		<view class="sharp-top dis-flex flex-y-end">
			<view class="sharp-top--left flex-box dis-flex flex-y-center">
				<block v-if="params.source=='hot'">
					<view class="sharp-title-img sharp-title164">
						<text class="tag f-32 m-r-20" style="font-weight: bold;">
							<!-- <text class="iconfont2 icon-Hotsale m-r-10 color-hot"></text> -->
							必点美食
						</text>
						<text class="f-24">总有一款你喜欢</text>
					</view>
				</block>
				<block v-else-if="params.source=='recommend'">
					<view class="sharp-title-img sharp-title164 dis-flex flex-y-center">
						<!-- <image lazy-load src="/static/images/recommend-title.png" mode="widthFix"></image> -->
						<view class="tag f-32 col-2 m-r-30">
							<text class="iconfont2 icon-recommend m-r-10 color-rec"></text>为你推荐
						</view>
					</view>
				</block>
				<block v-else>
					<view class="sharp-title-img1">
						<image lazy-load src="/static/images/sharp-title.png" mode="widthFix"></image>
					</view>
				</block>
			</view>
			<view class="sharp-top--right">
				<view @tap="onTargetSharpIndexFun($event, params.source)" class="sharp-more">
					<text class="sharp-more-text">更多</text>
					<text class="sharp-more-arrow iconfont icon-xiangyoujiantou f-w" style="font-size: 20rpx;"></text>
				</view>
			</view>
		</view>

		<view :class="'goods-list display__list clear column__' + itemStyle.column">
			<template v-for="(dataItem, index) in list">
				<view class="goods-item" :key="index" v-if="index<3">
					<form @submit="onTargetGoodsFun($event,dataItem)" report-submit="true">
						<button formType="submit" class="btn-normal">
							<view class="goods-item--container">
								<!-- 单列商品 -->
								<block v-if="itemStyle.column == 1">
								</block>
								<!-- 两列三列 -->
								<block v-else>
									<!-- 商品图片 -->
									<view class="goods-image">
										<image lazy-load class="image" mode="aspectFill" :src="dataItem.goods_image">
										</image>
									</view>
									<view class="detail">
										<!-- 商品标题 -->
										<view v-if="itemStyle.show.goodsName" class="goods-name onelist-hidden">
											{{ dataItem.goods_name }}
										</view>
										<view class="saleNum">
											半年售1.2千+
										</view>
										<!-- 商品价格 -->
										<view class="detail-price onelist-hidden" v-if="params.source=='hot'">
											<text class="goods-price f-24 col-m"><text
													class="f-20">￥</text>{{ dataItem.goods_price }}</text>
											<text class="line-price col-9 f-20" v-if="dataItem.line_price>0"><text
													class="f-20">￥</text>{{ dataItem.line_price }}</text>
										</view>
										<!-- <view class="detail-price onelist-hidden"
											v-else-if="params.source=='recommend'">
											<text class="goods-price f-24 col-m"><text
													class="f-16">￥</text>{{ dataItem.goods_price }}</text>
											<text class="line-price col-9 f-20" v-if="dataItem.line_price>0"><text
													class="f-12">￥</text>{{ dataItem.line_price }}</text>
										</view> -->
										<view class="detail-price onelist-hidden" v-else>
											<text v-if="itemStyle.show.seckillPrice"
												class="goods-price f-24 col-m"><text
													class="f-16">￥</text>{{ dataItem.goods_sku.seckill_price }}</text>
											<text
												v-if="itemStyle.show.originalPrice && dataItem.goods_sku.original_price > 0"
												class="line-price col-9 f-20"><text
													class="f-12">￥</text>{{ dataItem.goods_sku.original_price }}</text>
										</view>
									</view>
								</block>
							</view>
						</button>
					</form>
				</view>
			</template>
		</view>


	</view>
</template>

<script>
	const App = getApp().globalData; // 工具类
	// 工具类
	import util from "../../../utils/util"; // 倒计时插件
	// 倒计时插件
	import CountDown from "../../../utils/countdown"; // 枚举类：秒杀活动商品状态
	// 枚举类：秒杀活动商品状态
	import ActiveStatusEnum from "../../../utils/enum/sharp/GoodsStatus";

	export default {
		data() {
			return {
				list: [],
				goodsList: {},
				ActiveStatusEnum,
				// 秒杀活动商品状态
				countDownList: [] // 倒计时

			};
		},

		components: {},
		props: {
			itemIndex: String,
			itemStyle: Object,
			params: Object,
			itemData: {
				type: Object,
				observer: '_initCountDownData'
			},
			dataList: {
				type: Array
			}
		},
		watch: {
			dataList() {
				this.unit()
			}
		},
		options: {
			addGlobalClass: true,
			dataList: []
		},

		/**
		 * 在组件实例进入页面节点树时执行
		 */
		beforeMount() {
			this.initCountDownDataFun();
			this.getList()
		},

		methods: {
			unit() {
				this.initCountDownDataFun();
				this.getList()
			},
			getList() {
				// console.log(this.params)
				if (!this.params.source) {
					this.list = this.itemData.goodsList.data;
				} else {
					this.list = this.dataList; //热销和爆款
				}
			},
			/**
			 * 跳转商品详情页
			 */
			onTargetGoodsFun(e, dataItem) {
				// 记录formid
				App.saveFormId(e.detail.formId); // 生成query参数
				let _this = this;
				let source = _this.params.source;
				let wxapp_goods_id = dataItem.sharp_goods_id ? dataItem.sharp_goods_id : dataItem.wxapp_goods_id
				if (source == 'hot') {
					uni.navigateTo({
						url: '/pages/goods/index?goods_id=' + wxapp_goods_id
					});
				} else if (source == 'recommend') {
					uni.navigateTo({
						url: '/pages/goods/index?goods_id=' + wxapp_goods_id
					});
				} else {
					let query = util.urlEncode({
						active_time_id: _this.itemData.active.active_time_id,
						sharp_goods_id: wxapp_goods_id
					}); // 跳转到秒杀商品详情页

					uni.navigateTo({
						url: `/pages/sharp/goods/index?${query}`
					});
				}
			},

			/**
			 * 更多秒杀
			 */
			onTargetSharpIndexFun(e, source) {
				// 记录formid
				App.saveFormId(e.detail.formId);

				if (source == 'hot' || source == 'recommend') {
					uni.navigateTo({
						url: `/pages/category/extend/list?sortType=` + source
					});
				} else {
					// 跳转到秒杀会场首页
					uni.navigateTo({
						url: `/pages/sharp/index/index`
					});
				}
			},

			/**
			 * 初始化倒计时组件
			 */
			initCountDownDataFun(data) {
				let _this = this;
				console.log(11111111111)
				console.log(_this.params.source)
				if (!_this.params || !_this.params.source) {
					let active = _this.itemData.active;
					if (!active) return false; // 记录倒计时的时间
					if (this.countDownList.length == 0) {
						this.countDownList.push({
							date: active.count_down_time
						})
					} else {
						this.countDownList[0].date = active.count_down_time
					}
					// 执行倒计时
					CountDown.onSetTimeList(_this, 'countDownList');
				}
			}

		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
