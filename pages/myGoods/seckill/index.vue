<template>
	<view class="container">
		<!-- 自定义标题栏 -->
		<navigationBar title="整点秒杀" isHelpme id="top">
		</navigationBar>
		<scroll-view style="height: 100%;">
			<!--header-->
			<view class="tui-header-box">
				<tui-tabs :tabs="tabs" :unlined="true" :currentTab="currentTab" selectedColor="#FF7541" color="#333333" :height="88" :sliderHeight="4" sliderBgColor="#FF7541" @change="change" itemWidth="33.3333%"></tui-tabs>
			</view>
			<!--header-->
			<div v-if="!loading">
				<div v-show="currentTab == 0">
					<scroll-view v-if="list[0].list.length > 0" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
						<div class="contentBox">
							<div class="listBox" v-for="(item, index) in list[0].list" :key="index">
								<div class="goodsContent dis-flex flex-y-center goodsContentNo">
									<div class="pad-r">
										<div class="imgBox">
											<image mode="aspectFill" class="imageDefault" :src="item.goods.goods_image"></image>
											<div class="state" v-if="item.status == '0'">已下架</div>
										</div>
									</div>
									<div class="goodsInfo dis-flex flex-wrap">
										<div class="goods_name dis-flex flex-y-center">
											<text class="onelist-hidden"
												style="line-height:40rpx">{{item.goods.goods_name}}</text>
											<text style="width:56rpx"></text>
										</div>
										<div class="dis-flex flex-y-center stateBox">
											<div class="goods_price">
												{{item.goods.goods_sku.goods_price ? '￥' + item.goods.goods_sku.goods_price : ''}}
											</div>
											<!-- 暂时没有 -->
											<div class="line"></div>
											<div>限购数量:{{item.limit_num}}</div>
											<div class="line"></div>
											<div>累计销量:{{item.total_sales}}</div>
										</div>
										<div class="dis-flex flex-y-center stateBox m-top20">
											<div>
												库存总量:{{item.seckill_stock}}
											</div>
											<div class="line"></div>
											<div>
												创建时间:{{item.createTime}}
											</div>
										</div>
									</div>
								</div>
								<text class="rightTop iconfont2 icon-more-mini" @tap.stop="openSheet(item)"></text>
							</div>
							<view v-if="list[0].no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
							<view v-if="list[0].more_loading" class="no-more f-24 col-9">加载中...</view>
						</div>
					</scroll-view>
					<tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png"
						:imgWidth="264" :imgHeight="264">
						<div class="col-9">
							暂无数据
						</div>
					</tui-no-data>
					<div class="footBox dis-flex flex-y-center flex-x-center">
						<div class="addGoods" @tap.stop="addGoods">
							<text class="iconfont2 icon-jiahao"></text>
							新增商品
						</div>
					</div>
				</div>
				<div v-show="currentTab == 1">
					<scroll-view v-if="list[1].list.length > 0" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
						<div class="contentBox">
							<div class="listBox1" v-for="(item, index) in list[1].list" :key="index">
								<view class="listTitle dis-flex flex-y-center flex-x-between">
									<view class=" dis-flex flex-y-center">
										<view class="titleLine"></view>
										<view class="titleTime">
											{{item.active_date}}
										</view>
									</view>
									<view v-if="item.status == 1">
										启用中
									</view>
									<view v-else class="colRed">
										禁用中
									</view>
								</view>
								<view class="listContent">
									<view class="contentItem dis-flex flex-y-center flex-x-between">
										<view class="col-6">
											场次数量：<text class="col-3">{{item.active_time_count}}场</text>
										</view>
										<view class="line">
											
										</view>
										<view class="col-6">
											创建时间：<text class="col-3">{{item.createTime}}</text>
										</view>
									</view>
									<view class="butBox dis-flex flex-y-center flex-x-end">
										<view class="butItem but1" @tap="venueDelete(item)">
											删除
										</view>
										<view class="butItem" :class="item.status == 1 ? 'but1' : 'but3'" @tap="stateChange(item)">
											{{item.status == 1 ? '禁用' : '启用'}}
										</view>
										<view class="butItem but2" @tap="toVenueManage(item)">
											场次管理
										</view>
									</view>
								</view>
							</div>
							<view v-if="list[1].no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
							<view v-if="list[1].more_loading" class="no-more f-24 col-9">加载中...</view>
						</div>
					</scroll-view>
					<tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png"
						:imgWidth="264" :imgHeight="264">
						<div class="col-9">
							暂无数据
						</div>
					</tui-no-data>
					<div class="footBox dis-flex flex-y-center flex-x-center">
						<div class="addGoods" @tap.stop="addConf">
							<text class="iconfont2 icon-jiahao"></text>
							添加会场
						</div>
					</div>
				</div>
				
				<div v-show="currentTab == 2">
					<view class="setBox" :style="'height: ' + scrollHeight1  + 'px;'">
						<view class="setItem">
							<view class="setList dis-flex flex-y-center flex-x-between" @tap="setTime">
								<view class="label">
									未支付订单
								</view>
								<view class="value">
									{{settingTime}}分钟后自动关闭
								</view>
							</view>
							<view class="tips dis-flex">
								<view class="tipsItem">
									<text class="iconfont2 icon-jingshi"></text>
								</view>
								<view class="tipsItem">
									提示(秒杀订单下单未付款，n分钟后自动关闭，设置0则不自动关闭)
								</view>
							</view>
						</view>
					</view>
				</div>
			</div>
			<!-- 底部弹窗 -->
			<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet">
			</tui-actionsheet>

			<!-- 提示弹窗 -->
			<popup-tips ref="popupTips" :title="popupObj.title" :content="popupObj.content">
			</popup-tips>
			<popup-input ref="popupInput" inputType="digit" :title="inputTitle" placeholder="请输入"></popup-input>
			<div v-show="loading">
				<loading></loading>
			</div>
		</scroll-view>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	import popupTips from '@/components/popup-tips/index';
	import loading from '@/components/loading';
	import popupInput from '@/components/popup-input/index';
	import guidePage from '@/components/guide-page';

	const App = getApp().globalData;
	export default {
		data() {
			return {
				settingTime: '',
				inputTitle: '',
				currentTab: 0,
				tabs: [{
					name: "秒杀商品"
				}, {
					name: "秒杀会场"
				}, {
					name: "秒杀设置"
				}],
				itemData: {},
				scrollHeight: 0,
				scrollHeight1: 0,
				
				loading: true,
				list: {
					0: {
						list: [],
						page: 1,
						url: 'shop.market.sharp.goods/index',
						last_page: 1,
						total: 0,
						no_more: false,
						more_loading: false,
					},
					1: {
						list: [],
						page: 1,
						last_page: 1,
						url: 'shop.market.sharp.active/index',
						total: 0,
						no_more: false,
						more_loading: false,
					}
				},

				showActionSheet: false,
				itemList: [{
					text: "上架",
					color: "#333333"
				},{
					text: "编辑",
					color: "#333333"
				}, {
					text: "删除",
					color: "#333333"
				}],
				popupOpt: {
					delete: {
						on: {
							title: '确定删除该商品？',
							content: ''
						}
					},
				},
				popupObj: {
					title: '',
					content: '',
					opt: '',
					isAll: false
				}
			};
		},
		onShow() {
			this.getListData(true)
			this.getSet()
		},
		onLoad: function(options) {},
		mounted() {
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		computed: {},
		methods: {
			toVenueManage(item) {
				uni.navigateTo({
					url: '/pages/myGoods/seckill/venueManage/index?active_id=' + item.active_id
				})
			},
			proCheck(checkItem) {
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/myGoods/seckill/addGoods/index?goods_id=' + checkItem.goods_id
					})
				}, 500)
			},
			setTime() {
				this.inputTitle = '未支付订单'
				this.$refs.popupInput._open(this.settingTime, (val) => {
					if (val) {
						uni.showLoading()
						App._post_form('shop.market.sharp.setting/index', {
							order_close: val
						}, (result) => {
							this.getSet()
							uni.hideLoading()
							this.$api.msg('设置成功')
						})
					}
				})
			},
			change(e) {
				this.currentTab = e.index
			},
			addGoods() {
				uni.navigateTo({
					url: '/pages/myGoods/printorder/selectProduct/list?source=seckill'
				})
			},
			addConf() {
				uni.navigateTo({
					url: '/pages/myGoods/seckill/addConf/index'
				});
			},
			getSet() {
				App._get('shop.market.sharp.setting/index', {}, (result) => {
					this.settingTime = result.data.values && result.data.values.order ? result.data.values.order.order_close || '0' : '0'
				})
			},
			// 获取数据
			getListData(unit, one) {
				let currentTab = this.currentTab
				let next = (index) => {
					if (this.list[index].page != 1) {
						this.list[index].more_loading = true
					}
					App._get(this.list[index].url, {
						page: this.list[index].page
					}, (result) => {
						if (this.list[index].page != 1) {
							this.list[index].more_loading = false
						}
						let newList = result.data.list.data || []
						newList.forEach(item => {
							item.createTime =  item.create_time.slice(0,11)
						})
						this.list[index].total = result.data.list.total || 0
						this.list[index].list = unit ? newList : this.list[index].list.concat(newList)
						this.list[index].last_page = result.data.list.last_page || 1
						this.$nextTick(() => {
							this.loading = false
						})
					})
				}
				if (unit) {
					if (one) {
						this.list[currentTab].page = 1
						next(currentTab)
					} else {
						this.list[0].page = 1
						this.list[1].page = 1
						next(0)
						next(1)
					}
				} else {
					next(currentTab)
				}
			},
			/**
			 * 设置商品列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						// tap高度
						scrollHeight1 = systemInfo.windowHeight - res[0].height - 88*rpx,
						scrollHeight = scrollHeight1 - 98*rpx; // swiper高度

					// console.log(res[0].height)
					// console.log(88*rpx)
					// console.log(scrollHeight1)
					this.scrollHeight = scrollHeight
					this.scrollHeight1 = scrollHeight1
				});
			},
			bindDownLoad() {
				let currentTab = this.currentTab
				// 已经是最后一页
				if (this.list[currentTab].page >= this.list[currentTab].last_page) {
					this.list[currentTab].no_more = true
					return false;
				} // 加载下一页列表
				this.list[currentTab].page++;
				this.getListData();
			},
			// 底部弹出
			itemClick(e) {
				this.showActionSheet = false
				if (e.index == 0) {
					this.optClick('on')
				} else if (e.index == 1) {
					this.optClick('otEdit')
				} else if (e.index == 2) {
					this.optClick('delete')
				}
			},
			closeActionSheet() {
				this.showActionSheet = false
			},
			openSheet(item) {
				this.itemData = item
				if (item.status == 1) {
					this.itemList[0].text = '下架'
				} else {
					this.itemList[0].text = '上架'
				}
				this.showActionSheet = true
			},
			venueDelete(item) {
				this.popupObj = {
					title: '提示',
					content: '是否删除该会场？'
				}
				this.$refs.popupTips.open(() => {
					uni.showLoading()
					App._post_form('shop.market.sharp.active/delete', {
						active_id: item.active_id
					}, (result) => {
						this.getListData(true, true)
						uni.hideLoading()
						this.$api.msg(result.msg)
					}, false, () => {
						uni.hideLoading()
					})
				})
			},
			stateChange(item) {
				this.popupObj = {
					title: '提示',
					content: '是否删除该会场？'
				}
				this.$refs.popupTips.open(() => {
					uni.showLoading()
					App._post_form('shop.market.sharp.active/state', {
						active_id: item.active_id,
						state: item.status == 1 ? 0 : 1
					}, (result) => {
						this.getListData(true, true)
						uni.hideLoading()
						this.$api.msg(result.msg)
					}, false, () => {
						uni.hideLoading()
					})
				})
			},
			optClick(opt, item) {
				if (opt == 'delete') {
					this.popupObj = {
						title: '提示',
						content: '是否删除该商品？'
					}
					this.$refs.popupTips.open(() => {
						uni.showLoading()
						App._post_form('shop.market.sharp.goods/delete', {
							sharp_goods_id: this.itemData.sharp_goods_id
						}, (result) => {
							this.getListData(true, true)
							uni.hideLoading()
							this.$api.msg(result.msg)
						}, false, () => {
							uni.hideLoading()
						})
					})
				} else if (opt == 'on') {
					uni.showLoading()
					App._post_form('shop.market.sharp.goods/status', {
						sharp_goods_id: this.itemData.sharp_goods_id,
						status: this.itemData.status == '1' ? '0' : '1'
					}, (result) => {
						this.getListData(true, true)
						uni.hideLoading()
						this.$api.msg(result.msg)
					}, false, () => {
						uni.hideLoading()
					})
				} else if (opt == 'otEdit') {
					uni.navigateTo({
						url: '/pages/myGoods/seckill/addGoods/index?sharp_goods_id=' + this.itemData.sharp_goods_id
					})
				}
			}
		},
		components: {
			popupTips,
			loading,
			popupInput,
			guidePage
		}
	};
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>
