<template>
	<view class="choiceShopBox">
		<!-- 自定义标题栏 -->
		<navigationBar lLidth="width:0" :back="false" centerAlign="justify-content: flex-start;" extClass="nav" isHelpme id="top">
			  <view slot="center" class="left-title" @tap.stop="back">
					<text class="iconfont2 icon-fanhui"></text>
					<text class="title">返回首页</text>
				</view>
		</navigationBar>
		<scroll-view scroll-y :style="'height: ' + scrollHeight + 'px;'"
			:scroll-top="scrollTop1">
			<div class="recommendBoxFixed" v-if="recommend.length > 0" :style="{top: recommendTop}">
				<div class="recommendTitle">
					官方攻略
					<!-- <text class="notice" @tap.stop="recommendTips">
							如何成为推荐
							<text class="iconfont2 icon-questionmark"></text>
						</text> -->
				</div>
				<scroll-view class="recommendList" scroll-x>
					<div class="recommendItem" v-for="(item, index) in recommend" :key="index"
						@tap.stop="choiceShop(item)">
						<div class="imgBox">
							<image :src="item.logo" alt="" imageDefault></image>
							<image v-if="item.is_offical" class="itemTip"
								src="https://pic.kaidanxia.com/2020-08-20/20200820142204ba4e15756.png" alt="">
							</image>
							<image v-else-if="item.vip" class="itemTip"
								:src="'/static/images/' + vips[item.vip] + '.png'" alt=""></image>
						</div>
						<div class="shopName">
							{{item.name}}
						</div>
						<div class="focusBox">
							<div class="focus" @tap.stop="focusItem(item)">
								关注
							</div>
						</div>
						<text class="close iconfont2 icon-cross f-24" @tap.stop="close(item)"></text>
					</div>
				</scroll-view>
			</div>
			<view class="shopBox searchFixed" :style="{top: scrollTop + 'rpx'}">
				<div class="search-input-box" @tap.stop="toSearch()">
					<view class="search-input">
						<view class="dis-flex flex-y-center search-box">
							<text class="iconfont2 icon-searchfor col-9"></text>
							<input v-model="searchVal" class="input" placeholder="搜索"
								placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text" />
							<div class="searchMask"></div>
						</view>
					</view>
				</div>
			</view>
			<div class="contentBox" :style="{'margin-top': contentTop}">
				<view class="shopBox" v-if="showMyShop && myShopInfo.wxapp_name && myShopInfo.wxapp_name != ''">
					<view class="shopTitle">我的店铺</view>
					<list-item ref="listItem1" @toShopInformation="toShopInformation" @showDetailCard="showDetailCard"
						@closeAllOpt="closeAllOpt" @openOpt="openOpt" :itemData="myShopInfo" isLast noOpt></list-item>
				</view>
				<view class="shopBox" v-if="focusList.length > 0">
					<view class="shopTitle">特别关注</view>
					<view v-for="(item, index) in focusList" :key="index">
						<list-item ref="listItem2" @toShopInformation="toShopInformation"
							@showDetailCard="showDetailCard" @closeAllOpt="closeAllOpt" @openOpt="openOpt"
							:groupList="groupList" :itemData="item" :isLast="(index == focusList.length - 1)"
							@getGroup="getGroup"></list-item>
					</view>
				</view>
				<view class="shopBox" v-if="groupList.length > 0">
					<view class="shopTitle">分组</view>
					<div v-for="(items, indexs) in groupList" :key="indexs">
						<div class="groupTitle" @longpress="longpress(items)" @tap.stop="showSet(items)">
							{{items.group_name}}
							<div class="rightBox dis-flex flex-y-center">
								<div class="groupNum">{{items.shops ? items.shops.length : 0}}</div>
								<div class="tipIconBox" :class="items.showSet ? 'transIcon' : ''">
									<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
								</div>
							</div>
						</div>
						<div v-show="items.showSet" v-if="items.shops">
							<view v-for="(item, index) in items.shops" :key="index">
								<list-item ref="listItem3" @toShopInformation="toShopInformation"
									@showDetailCard="showDetailCard" @closeAllOpt="closeAllOpt" @openOpt="openOpt"
									:groupList="groupListBase" :itemData="item"
									:isLast="(index == items.shops.length - 1)" @getGroup="getGroup"></list-item>
							</view>
						</div>
					</div>
				</view>
				<view class="shopBox" v-if="shopList.length > 0">
					<view class="shopTitle">浏览过的店铺</view>
					<view v-for="(item, index) in shopList" :key="index">
						<list-item ref="listItem4" @toShopInformation="toShopInformation"
							@showDetailCard="showDetailCard" @closeAllOpt="closeAllOpt" @openOpt="openOpt"
							:groupList="groupListBase" :itemData="item" :isLast="(index == shopList.length - 1)"
							@getGroup="getGroup"></list-item>
					</view>
				</view>
				<div class="recommendBox" v-if="recommend.length > 0" v-show="showBotRecommend">
					<div class="recommendTitle">
						官方攻略
						<!-- <text class="notice" @tap.stop="recommendTips">如何成为推荐
								<text class="iconfont2 icon-questionmark"></text>
							</text> -->
					</div>
					<scroll-view class="recommendList" scroll-x>
						<div class="recommendItem" v-for="(item, index) in recommend" :key="index"
							@tap.stop="choiceShop(item)">
							<div class="imgBox">
								<image :src="item.logo" alt="" imageDefault></image>
								<image v-if="item.is_offical" class="itemTip"
									src="https://pic.kaidanxia.com/2020-08-20/20200820142204ba4e15756.png" alt="">
								</image>
								<image v-else-if="item.vip" class="itemTip"
									:src="'/static/images/' + vips[item.vip] + '.png'" alt=""></image>
							</div>
							<div class="shopName">{{item.name}}</div>
							<div class="focusBox">
								<div class="focus" @tap.stop="focusItem(item)">
									关注
								</div>
							</div>
							<text class="close iconfont2 icon-cross f-24" @tap.stop="close(item)"></text>
						</div>
					</scroll-view>
				</div>
				<view class="no-more f-24 col-9">生意宝技术支持～</view>
			</div>
		</scroll-view>
		<popup-input ref="popupInput" title="新建分组" placeholder="请输入分组名" :maxlength="12"></popup-input>

		<tui-actionsheet :show="showActionSheet" :item-list="itemList" :mask-closable="false" :is-cancel="true"
			@click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>

		<tui-actionsheet :show="showActionSheet1" :item-list="itemOptList" @click="itemOptClick"
			@cancel="closeActionSheet1"></tui-actionsheet>
		<tui-actionsheet :show="showActionSheet2" :item-list="moveList" @click="moverClick" @cancel="closeActionSheet2">
		</tui-actionsheet>
		<popup-tips ref="popupTips" title="确定删除该分组？" content="删除分组后，组内店铺将移至其他店铺。" @tipsCallback="delGroup">
		</popup-tips>
		<popup-tips ref="showRecommendTips" title="如何成为推荐?" :content="recommendTipsText" @endlinkClick="endlinkClick"
			endlinkText="我也想成为推荐！"></popup-tips>
		<div class="addGroup" @tap.stop="addGroup()">
			<text class="addIcon iconfont2 icon-add col-3 f-24"></text>
			新建分组
		</div>
		<contact ref="contact"></contact>
		<detailCard ref="detailCard" @focusItem="focusItem" @moverGroup="moverGroup"></detailCard>

		<div v-show="isLoading">
			<loading></loading>
		</div>
		<share-bottom ref="shareBottom" pageType="userIndex"></share-bottom>
		<popup-input ref="popupInput1" title="设置备注" placeholder="请输入备注" :maxlength="12" showlength>
		</popup-input>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import listItem from '@/components/myGoodsCommon/list-item';
	import contact from '@/components/myGoodsCommon/contact/index';
	import detailCard from '@/components/myGoodsCommon/detailCard/index';
	import loading from '@/components/loading';
	import shareBottom from '@/components/share-bottom/index';
	import guidePage from '@/components/guide-page';

	export default {
		data() {
			return {
				unitFlag: true,
				scrollHeight: 0,
				showMyShop: false,
				itemData: {},
				qrcode: '',
				recommendTipsText: '成为推荐后，可以在所有生意宝用户店铺列表区域最上方和最下方展现，有利于让更多的客户看到您的商品，添加到您的客服微信。',
				isLoading: true,
				itemList: [{
						text: "编辑",
						color: "#333"
					},
					{
						text: "删除",
						color: "#333"
					},
				],
				closeRecommend: '',
				showActionSheet: false,
				showActionSheet1: false,
				showActionSheet2: false,
				itemOptList: [{
					text: "设为特别关注",
					color: "#333333"
				}, {
					text: "移动分组",
					color: "#333333"
				}, {
					text: "设置备注",
					color: "#333333"
				}],
				moveList: [],
				shopListBase: [],
				shopList: [],
				focusListBase: [],
				focusList: [],
				groupListBase: [],
				groupList: [],
				recommend: [],
				myShopId: '',
				searchVal: '',
				// 我的店铺信息
				myShopInfo: {},
				scrollTop: 0,
				scrollTop1: 0,
				rpx: .5,
				showBotRecommend: false,
				vips: {
					1: 'xiami',
					2: 'mingxia',
					3: 'mingxia',
					4: 'longxia'
				}
			};
		},
		components: {
			listItem,
			popupInput,
			popupTips,
			contact,
			detailCard,
			loading,
			shareBottom,
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
		onShow() {
			this.getGroup()
			this.showMyShop = !!uni.getStorageSync('shopLock')
		},
		computed: {
			recommendTop() {
				return this.scrollTop + 88 + 'rpx'
			},
			contentTop() {
				return this.recommend.length > 0 ? '488rpx' : '88rpx'
			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 200) {
				this.showBotRecommend = true
			} else {
				this.showBotRecommend = false
			}
		},
		methods: {
			showDetailCard(item) {
				this.$refs.detailCard.open(item)
			},
			openOpt(item) {
				this.itemOptList[0].text = item.is_follow ? '取消特别关注' : '设为特别关注'
				this.itemData = item
				this.showActionSheet1 = true
			},
			endlinkClick() {
				this.qrcode = 'https://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png';
				this.$refs.shareBottom._popupShowImg('下载', this.qrcode)
			},
			closeAllOpt() {
				if (this.$refs.listItem1) {
					this.$refs.listItem1.closeItemOpt()
				}
				if (this.$refs.listItem2) {
					this.$refs.listItem2.forEach(item => {
						item.closeItemOpt()
					})
				}
				if (this.$refs.listItem3) {
					this.$refs.listItem3.forEach(item => {
						item.closeItemOpt()
					})
				}
				if (this.$refs.listItem4) {
					this.$refs.listItem4.forEach(item => {
						item.closeItemOpt()
					})
				}
			},
			recommendTips() {
				this.$refs.showRecommendTips.open()
			},
			// 店铺资料
			toShopInformation(itemData) {
				this.$refs.contact.open(itemData)
			},
			/**
			 * 设置分类列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						// 计算rpx
						// tapHeight = Math.floor(rpx * 74), // tap高度
						// - 47
						scrollTop = res[0].height / rpx; // swiper高度
					this.rpx = rpx
					this.scrollTop = scrollTop
					// tap高度
					let scrollHeight = systemInfo.windowHeight - res[0].height - 98*rpx; // swiper高度
					this.scrollHeight = scrollHeight
				});
			},
			toSearch() {
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/searchShop/index'
				});
			},
			choiceShop(item) {
				App.wxapp_id = item.wxapp_id;
				wx.setStorageSync("wxapp_id", item.wxapp_id)
				// this.back();
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			close(item) {
				// let closeRecommend = uni.getStorageSync('closeRecommend') || ''
				let closeRecommend = this.closeRecommend || ''

				let arr = []
				if (closeRecommend != '') {
					arr = closeRecommend.split(',')
				}
				arr.push(item.wxapp_id)
				// uni.setStorageSync('closeRecommend', arr.join(','))
				this.closeRecommend = arr.join(',')
				this.recommend = this.checkRecommend(this.recommend)
			},
			focusItem(item, next) {
				let objFocus = {
					wxapp_id: item.wxapp_id,
					type: item.is_follow ? '1' : '2'
				}
				App._post_form('user/addFollow', {
					follow: JSON.stringify(objFocus)
				}, (result) => {
					this.getGroup()
					this.$api.msg(item.is_follow ? '已取关' : '已关注')
					if (next) {
						if (result.code == '1') {
							next(true)
						} else {
							next(false)
						}
					}
				});
			},
			longpress(items) {
				this.showActionSheet = true
				this.selectGroup = items
			},
			closeActionSheet() {
				this.showActionSheet = false
			},
			closeActionSheet1() {
				this.showActionSheet1 = false
			},
			closeActionSheet2() {
				this.showActionSheet2 = false
			},
			itemClick(e) {
				this.showActionSheet = false
				if (e.index == 0) {
					this.$refs.popupInput._open(this.selectGroup.group_name, (val) => {
						let group = {
							name: val,
							id: this.selectGroup.group_id
						}
						App._post_form('user/addGroup', {
							group: JSON.stringify(group)
						}, result => {
							App.showSuccess(result.msg, () => {
								this.getGroup()
							})
						});
					})
				} else {
					this.$refs.popupTips.open()
				}
			},
			itemOptClick(e) {
				if (e.index == 0) {
					this.focusItem(this.itemData)
				} else if (e.index == 1) {
					this.showActionSheet2 = true
				} else if (e.index == 2) {
					this.$refs.popupInput1._open(this.itemData.wxapp_remark, (val) => {
						App._post_form('user/modifyRemark', {
							id: this.itemData.wxapp_id,
							remark: val
						}, (result) => {
							this.$api.msg(result.msg)
							this.getGroup()
						})
					})
				}
				this.closeActionSheet1()
			},
			moverGroup(itemData) {
				this.itemData = itemData
				this.showActionSheet2 = true
			},
			moverClick(e) {
				this.closeActionSheet2()
				let val = e.index
				let ids = {
					wxapp_id: this.itemData.wxapp_id,
					group_id: this.moveList[val].group_id
				}
				App._post_form('user/moveStoreGroup', {
					ids: JSON.stringify(ids)
				}, result => {
					this.getGroup()
					this.tui.toast(result.msg)
				});
			},
			delGroup() {
				let group = {
					id: this.selectGroup.group_id
				}
				App._post_form('user/removeGroup', {
					group: JSON.stringify(group)
				}, result => {
					this.getGroup()
				});
			},
			addGroup() {
				this.$refs.popupInput._open('', (val) => {
					let group = {
						name: val
					}
					App._post_form('user/addGroup', {
						group: JSON.stringify(group)
					}, result => {
						this.getGroup()
					});
				})
			},
			showSet(item) {
				item.showSet = !item.showSet
			},
			getGroup() {
				App._get('wxapp.user_follow/getFollowList', {}, result => {
					let groupList = result.data.list ? result.data.list.groups || [] : []
					let moveList = []
					groupList.forEach(item => {
						moveList.push({
							text: item.group_name,
							group_id: item.group_id,
							color: "#333333"
						})
						let showSet = false
						this.groupList.forEach(element => {
							if (item.group_id == element.group_id) {
								showSet = element.showSet
							}
						})
						item.showSet = showSet
					})
					this.moveList = moveList
					this.groupListBase = groupList

					let shopList = result.data.list ? result.data.list.others || [] : []
					this.shopListBase = shopList

					let focusList = result.data.list ? result.data.list.follows || [] : []
					this.focusListBase = focusList

					let recommend = result.data.recommend ? result.data.recommend || [] : []

					this.shopList = shopList
					this.groupList = groupList
					this.focusList = focusList

					this.recommend = this.checkRecommend(recommend)
					if (this.unitFlag) {
						this.unitFlag = false
						this.$nextTick(() => {
							this.scrollTop1 = this.rpx * 400
						})
					}
					this.myShopInfo = result.data.self || {}
					if (!this.myShopInfo.notice || this.myShopInfo.notice == '') {
						this.myShopInfo.notice = '欢迎来到' + this.myShopInfo.wxapp_name + '~'
					}
					this.myShopInfo.wxapp_name = '我的店铺'
					this.isLoading = false
				});
			},
			checkRecommend(recommend) {
				// let closeRecommend = uni.getStorageSync('closeRecommend') || ''
				let closeRecommend = this.closeRecommend
				let arr = []
				recommend.forEach(item => {
					if (closeRecommend.indexOf(item.wxapp_id) == -1) {
						arr.push(item)
					}
				})
				return arr
			},
			back() {
				// var data = this;
				// wx.navigateBack({
				//   delta: data.delta
				// });
				// this.$emit('back', {
				//   delta: data.delta
				// }, {});
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
