<template>
	<view class="retailShop container">
		<navigationBar title="我的店铺" extClass="nav" id="top" color="white" background="transparent" :fixed="false"></navigationBar>
		
		<view class="bgBox">
			<view class="bg">
				<image :src="imgBaseUrl + 'shopBg.png'" mode="aspectFill"></image>
			</view>
		</view>
		<scroll-view scroll-y :style="'height: ' + scrollHeight + 'px;'">
			<!-- 气泡 -->
			<!-- #ifdef MP-WEIXIN -->
			<tui-bubble-popup direction="top" :top="topHeight+48 + 'px'" right="84rpx" :mask="false" :show="showBubble" triangleTop="-20rpx" triangleRight="60rpx" borderWidth="14rpx 14rpx" width="520rpx" radius="12rpx" :flexEnd="true" backgroundColor="#2A2A30">
				<view class="tui-chat-text f-26">
					<text class="flex-box">添加到我的小程序，下次使用更方便</text>
					<view class="iconfont2 icon-shanchu1 f-28 m-l-10 oh" @tap="clickBubble(2)"></view>
				</view>
			</tui-bubble-popup>
			<!-- #endif -->
			<view class="contentBox">
				<view class="pdBox">
					<view class="nameBox dis-flex">
						<view class="imgBox">
							<img :src="logo" mode="aspectFill" alt="">
						</view>
						<view class="info" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/shopInformation/index')">
							<view class="dis-flex flex-y-center">
								<view class="title onelist-hidden">
									{{name}}
								</view>
								<!-- 编辑 -->
								<!-- <text class="editBox m-l-20 f-w">
									<text class="iconfont2 icon-bianji f-24"></text>
								</text> -->
							</view>
							<view class="content twolist-hidden">
								{{notice || '欢迎来到' + name + '~'}}
							</view>
							<view class="yuEBox" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/balance/index/index')">
								<text class="iconfont2 icon-cash f-24" style="margin-right: 4rpx;"></text>余额
							</view>
						</view>
					</view>
					<view class="shopInfo shopInfo1">
						<view class="dataBox dis-flex flex-y-center" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/dataSummary/index')">
							<view class="dataItem">
								<view class="num">{{saleTotal || '0.00'}}</view>
								<view class="dataTit">销售额</view>
							</view>
							<view class="dataItem" @tap.stop="toOtherPage2('/pages/retailShop/shopAbout/trajectory/index')">
								<view class="num">{{uvTotal || '0'}}</view>
								<view class="dataTit">访客数</view>
							</view>
							<view class="dataItem">
								<view class="num">{{pvTotal || '0'}}</view>
								<view class="dataTit">浏览量</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="listBox">
				<view class="list" v-for="(item, index) in list" :key="index">
					<div class="title">{{item.module}}</div>
					<div class="content dis-flex flex-wrap">
						<template  v-for="(items, indexs) in item.itemsList">
							<div class="itemBox" :key="indexs" @tap.stop="listClick(items)">
								<div class="imgBox">
									<!-- <text class="f-48 iconfont2" :class="items.icon" :style="{color: items.is_active ? items.active_color : items.disable_color}"></text> -->
									<image mode="aspectFill" :src="imgIconUrl + items.icon + '.png'"></image>
									<template v-if="items.is_notice">
										<text v-if="items.notice_num > 0" class="redDot1">{{items.notice_num}}</text>
										<text v-else class="redDot"></text>
									</template>
								</div>
								<div class="itemName">
									{{items.alias}}
								</div>
							</div>
						</template>
					</div>
				</view>
			</view>
			
			<div v-show="isLoading">
				<loading></loading>
			</div>
		</scroll-view>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import footTabBar from '@/components/foot-tabBar';
	import loading from '@/components/loading';
	import custSwitch from '@/components/cust-switch/index.vue';
	import popupTips from '@/components/popup-tips/index';
	
	export default {
		data() {
			return {
				imgBaseUrl: App.imgBaseUrl,
				imgIconUrl: App.imgIconUrl,
				myShopInfo: {
					wxapp_id: '',
					wxapp_name: ''
				},
				subLoad: false,
				name: '',
				logo: '',
				notice: '',
				saleTotal: '',
				pvTotal: '',
				uvTotal: '',
				topHeight: 0,
				scrollHeight: 0,
				list: [],
				isLoading: true,
				homeStyle: '',
				is_super: 1,//是否为店员
				showBubble: false,//默认显示气泡
				
				store_is_super: '',
				shopLock: false,
				maskBoxShow: false,
				maskTitle: '',
				maskContent: '',
				maskButText: '',
				maskToUrl: ''
			};
		},

		components: {
			'foot-tabBar': footTabBar,
			loading,
			custSwitch,
			popupTips
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		created() {
		},
		onShow() {
			this.homeStyle = App.homeStyle?App.homeStyle:'div';
			this.getShowData()
		},
		methods: {
			maskBut() {
				uni.navigateTo({
					url: this.maskToUrl
				});
			},
			back() {
				uni.switchTab({
					url: '/pages/userIndex/index'
				});
			},
			myShop() {
				uni.navigateTo({
					url: "/pages/retailShop/shopAbout/choiceShop/index",
				});
				// if (this.myShopInfo.wxapp_id) {
				// 	App.myShopInfo = JSON.parse(JSON.stringify(this.myShopInfo))
				// 	wx.setStorageSync("wxapp_id", App.myShopInfo.wxapp_id)
				// 	wx.setStorageSync("myShopInfo", JSON.stringify(this.myShopInfo))
				// 	App.wxapp_id = App.myShopInfo.wxapp_id;
				// 	wx.setStorageSync("wxapp_id", App.myShopInfo.wxapp_id)
				// 	uni.reLaunch({
				// 		url:'/pages/index/index'
				// 	})
				// } else {
				// 	this.$api.msg('暂无店铺信息')
				// }
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
						topHeight = res[0].height - 48, // swiper高度
						scrollHeight = systemInfo.windowHeight - res[0].height; 
					this.topHeight = topHeight

					this.scrollHeight = scrollHeight
					// #ifdef MP-WEIXIN
					this.clickBubble(1)
					// #endif
				});
			},
			// 展示数据
			getShowData() {
				App._get('shop.setting/store', {}, (result) => {
					// this.shopLock = !!result.data.status
					this.shopLock = true
					
					this.isLoading = false
					this.unitsData(result.data)
					// 更新主题tabbar
					this.$store.commit('getTheme',App);
				}, false, () => {
					this.isLoading = false
				})
				  App._get('user.index/detail', {}, (result) => {
				    if (result.code == '1') {
						// 店铺信息
						if(result.data.store){
							let store = result.data.store;
							if(JSON.stringify(store)=="{}"){
								this.store_is_super = -1;//未登录/没有店铺
							}else if(JSON.stringify(store.salesclerk)=="{}"){
								this.store_is_super = 1;//店主
							}else{
								this.store_is_super = 0;//店员
							}
						}
				    }
				  });
			},
			unitsData(data) {
				
				let values = data.values || {}
				this.name = values.name || ''
				this.logo = values.logo || ''
				this.notice = values.notice || ''
				this.saleTotal = values.saleTotal || 0
				this.pvTotal = values.pvTotal || 0
				this.uvTotal = values.uvTotal || 0
				this.is_super = values.is_super;
				if (values.wxapp_id) {
					this.myShopInfo = {
						wxapp_id: values.wxapp_id,
						wxapp_name: values.name
					}
				}
				let newList = data.menus.all_menus || []
				newList.forEach(item => {
					let itemsList = []
					item.items.forEach(items => {
						if (items.is_active) {
							itemsList.push(items)
						}
					})
					item.itemsList = itemsList
				})
				
				let  list = newList
				this.list = list
				let backlogs = values.backlogs || []
			},
			listClick(item) {
				if (item.name == 'myStore') {
					this.myShop()
				} else if (item.is_active) {
					this.toOtherPage(item.page)
				} else {
					if (item.warn_type == 1) {
						this.$api.msg(item.warning)
					} else if (item.warn_type == 2) {
					}
				}
			},
			toOtherPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			// 店员特殊处理
			toOtherPage2(url) {
				if(this.is_super!=1){
					this.$api.msg('抱歉，您暂无此权限哦~')
				}else{
					uni.navigateTo({
						url: url
					});
				}
			},
			// #ifdef MP-WEIXIN
			clickBubble(type){
				// 显隐
				if(type==1){
					let bubble = uni.getStorageSync('guideBubble') || false;
					if(!bubble){
						this.showBubble = true;
					}else{
						return
					}
				}
				// 点击关闭
				if(type==2){
					if(this.showBubble){
						this.showBubble = false;
						uni.setStorageSync('guideBubble',true)
					}else{
						
					}
				}
			},
			// #endif
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
