<template>
	<view class="salesBilling">
		<!-- 自定义标题栏 -->
		<navigationBar title="销售开单" isHelpme id="top"></navigationBar>
		<div class="tabsBox">
			<tui-tabs :tabs="navbar" :currentTab="currentTab" @change="change" itemWidth="50%" color="#999"
				selectedColor="#FF7541" :height="80" :sliderWidth="80" :sliderHeight="4" sliderBgColor="#FF7541">
			</tui-tabs>
		</div>
		<view class="dis-flex search-input-box">
			<view class="search-input">
				<view class="dis-flex flex-y-center search-box">
					<text class="iconfont2 icon-searchfor col-9"></text>
					<input v-model="keywords" @submit="search" @blur="search" class="input" placeholder="客户名/手机号"
						placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text" />
				</view>
			</view>
		</view>
		<scroll-view class="listBox" :refresher-threshold="20" refresher-enabled :refresher-triggered="triggered"
			@refresherrefresh="refresherrefresh" @scrolltolower="bindDownLoad" scroll-y
			:style="'height: ' + scrollHeight  + 'px;'">
			<template v-if="list.length > 0">
				<div class="listItem" v-for="(item, index) in list" :key="index" @tap.stop="toDetail(item)">
					<div class="topBox dis-flex flex-y-center flex-x-between">
						<div class="orderNum">
							<text class="iconfont2 icon-guest" style="color:#57B8FB"
								v-if="item.sale_role.value == 2"></text>
							<text class="iconfont2 icon-merchant" style="color:rgb(251, 87, 87);" v-else></text>
							开单号：{{item.number}}
						</div>
						<div class="money dis-flex flex-y-center" @tap.stop="payment(item)">
							<label>
								货款
							</label>
							<view :class="item.status && item.status.value == 1 ? 'done-btn1' : 'done-btn'"><text
									class="iconfont2 icon-duihao f-24"></text></view>
						</div>
						<div class="time">{{item.sale_time}}</div>
					</div>
					<div class="midLine"></div>
					<div class="botBox dis-flex flex-y-center flex-x-between">
						<div class="phone">{{item.client_name}} {{item.client_phone}} </div>
						<div class="goodsNum"><text class="col-m">{{item.total_num}}</text>(件) | ¥{{item.total_price}}
						</div>
					</div>
					<div class="mark" v-if="item.status && item.status.value == 1">
						<div class="mark-b">
							已付款
						</div>
					</div>
				</div>
				<view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
			</template>
			<tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png"
				:imgWidth="264" :imgHeight="264">
				<div class="col-9">
					暂无数据
				</div>
			</tui-no-data>
		</scroll-view>
		<div class="butBox dis-flex flex-y-center">
			<div class="submit" @tap.stop="add">
				<text class="iconfont2 icon-jiahao"></text>
				添加销售单
			</div>
			<div class="submit1" @tap.stop="show">
				接单码
			</div>
		</div>
		<div v-show="loading">
			<loading></loading>
		</div>
		<popup-tips ref="popupTips" confirmText="仍要继续" title="警示！！！" content="该订单是“已收款”状态，请确认是否更改为“未收款”状态？">
		</popup-tips>
		<guidePage ref="guidePage"></guidePage>

	</view>
</template>

<script>
	const App = getApp().globalData;
	import loading from '@/components/loading';
	import popupTips from '@/components/popup-tips/index';
	import downloadFile from '@/components/download-file';
	import guidePage from '@/components/guide-page';

	export default {
		data() {
			return {
				currentTab: 0,
				qrcode: '',
				navbar: [{
					name: "全部"
				}, {
					name: "开单"
				}, {
					name: "接单"
				}],
				keywords: '',
				scrollHeight: 0,
				list: [],
				triggered: true,
				last_page: 1,
				page: 1,
				loading: true,
				no_more: false,
				topHeight: 0
			};
		},
		components: {
			loading,
			popupTips,
			downloadFile,
			guidePage
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		mounted() {},
		onShow() {
			this.getListData()
		},

		methods: {
			show() {
				uni.navigateTo({
					url: './singleCode/index'
				})
			},
			change(e) {
				this.currentTab = e.index
				this.page = 1
				this.getListData()
			},
			payment(item) {
				let next = () => {
					App._post_form('store.shop.sale/payment', {
						sale_id: item.sale_id
					}, (result) => {
						this.$api.msg(result.msg)
						if (result.code == '1') {
							this.page = 1
							this.getListData()
						}
					})
				}
				if (item.status && item.status.value == 1) {
					this.$refs.popupTips.open(() => {
						next()
					})
				} else {
					next()
				}
			},
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/salesBilling/detail/index?sale_id=' + item.sale_id
				});
			},
			add() {
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/salesBilling/add/index'
				});
			},
			getListData(next) {
				let obj = {
					page: this.page,
					search: this.keywords || '',
					role: this.currentTab
				}
				App._get('store.shop.sale/getSaleList', obj, (result) => {
					if (result.code == '1') {
						if (next) {
							next ? next() : ''
						}
						let newList = result.data.list.data || []
						if (this.page == 1) {
							this.list = newList
						} else {
							this.list = this.list.concat(newList)
						}
						this.last_page = result.data.list.last_page || 1
					} else {
						this.$api.msg(result.msg)
					}
				}, false, () => {
					this.loading = false
				})
			},
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						// tap高度
						scrollHeight = systemInfo.windowHeight - res[0].height - 144 * rpx * 2; // swiper高度
					this.topHeight = res[0].height
					this.scrollHeight = scrollHeight
				});
			},
			bindDownLoad() {
				// 已经是最后一页
				if (this.page >= this.last_page) {
					this.no_more = true
					return false;
				} // 加载下一页列表
				this.page++;
				this.getListData();
			},
			search() {
				this.page = 1
				this.getListData()
			},
			refresherrefresh() {
				this.page = 1;
				this.triggered = true
				this.getListData(() => {
					this.triggered = false
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
