<template>
	<view>
		<!-- 同步组件 -->
		<!-- 菜单栏 -->
		<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
		<!-- 加价 -->
		<updata-tips ref="updataTips" @tipsCallback="updataPrice" :optType="optType" @tipsClickmask="tipsClickmask"></updata-tips>
		<popup-tips ref="popupTips" :content="content" :confirmText="confirmText"></popup-tips>
		<popup-tips ref="popupTips1" content="是否复制商品到您的店铺？"></popup-tips>
		<contact ref="contact"></contact>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import updataTips from '@/components/updata/updata-tips/index';
	import contact from '@/components/myGoodsCommon/contact/index';
	export default {
		components: {
			popupTips,
			updataTips,
			contact
		},
		props: {
			noLogin: {
				type: Boolean,
				default: false
			},
			nowNum: {
				type: String,
				default: '50'
			},
			allChecked: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				url: '',
				obj: {},
				content: '',
				confirmText: '',
				showActionSheet: false,
				optType: 'updata',
				itemList1: [{
					text: "直接复制",
					color: "#333333",
				}, {
					text: "加价复制",
					color: "#333333"
				}],
				itemList2: [{
					text: "直接同步",
					color: "#333333",
				}, {
					text: "加价同步",
					color: "#333333"
				}],
				itemList: [{
					text: "直接同步",
					color: "#333",
				}, {
					text: "加价同步",
					color: "#333"
				}],
				single: true,
				next: null,
				callBack: null,
				wxapp_goods_id:'',//单个同步商品
				wxapp_id: '',//店铺id
				checkList: [],//批量商品的id
			};
		},
		methods: {
			// 点击菜单栏
			itemClick(e) {
				this.showActionSheet = false;
				if (e.index == 1) {
					this.$refs.updataTips.open();
				} else {
					this.updataPrice({isUpNow:true})
				}
			},
			//关闭菜单栏
			closeActionSheet() {
				this.showActionSheet = false;
				this.wxapp_goods_id = '';
				this.tipsClickmask()
			},
			tipsClickmask() {
				if (this.callBack) {
					this.callBack()
				}
			},
			updataPrice(e) {
				let obj = {

				}
				let url = ''
				if (this.optType == 'updata') {
					url = 'shop.dealer/addgoods'
					if (e.isUpNow){
						obj = {
							dealer_wxapp_id: this.wxapp_id,
							dealer_type: '3'
						}
					} else {
						obj = {
							dealer_wxapp_id: this.wxapp_id,
							dealer_type: e.currentTab == '1' ? '2' : '1',
							dealer_num: e.val ? e.val : '0'
						}
					}
					if (this.single) {
						obj.dealer_goods_id = this.wxapp_goods_id
						obj.dealer_goods_type = '1'
					} else {
						if (this.allChecked) {
							obj.dealer_goods_id = this.nowNum
							obj.dealer_goods_type = '3'
						} else {
							obj.dealer_goods_id = this.checkList.join(',')
							obj.dealer_goods_type = '2'
						}
					}
				} else {
					url = 'shop.wxapp.goods/addgoods'
					if (e.isUpNow){
						obj = {
							copy_wxapp_id: this.wxapp_id,
							copy_type: '3'
						}
					} else {
						obj = {
							copy_wxapp_id: this.wxapp_id,
							copy_type: e.currentTab == '1' ? '2' : '1',
							copy_num: e.val ? e.val : '0'
						}
					}
					if (this.single) {
						obj.copy_goods_id = this.wxapp_goods_id
						obj.copy_goods_type = '1'
					} else {
						if (this.allChecked) {
							obj.copy_goods_id = this.nowNum
							obj.copy_goods_type = '3'
						} else {
							obj.copy_goods_id = this.checkList.join(',')
							obj.copy_goods_type = '2'
						}
					}
				}
				this.url = url
				this.obj = obj
				let next = (callBack) => {
					app._post_form(this.url, this.obj, (result) => {
						if (result.code == -1) {
							this.$emit('showLogin', callBack)
						} else if (result.code == 1001) {
							this.content = result.msg
							this.confirmText = result.btn_msg
							this.$refs.popupTips.open(() => {
								if (result.url) {
								uni.navigateTo({
									url: '/' + result.url
								});
								}
							})
						} else {
							if (result.code == 1000) {
								this.content = '该店铺没有渠道权限，是否联系Ta?'
								this.confirmText = '联系他'
								this.$refs.popupTips.open(() => {
									this.toShopInformation()
								})
							} else {
								this.$api.msg(result.msg)
								if (result.code == 1) {
									if (this.callBack) {
										this.callBack()
									}
								}
							}
						}
					}, false, false, false, this.noLogin)
				}
				next(next)
			},
			//复制商品-单个商品复制
			copy(item) {
				this.itemList = this.itemList1
				this.wxapp_id = item.wxapp_id;
				this.optType = 'copy'
				this.single = true
				this.wxapp_goods_id = item.wxapp_goods_id || ''
				this.showActionSheet = true
			},
			//复制商品-批量商品复制
			allCopy(wxapp_id,checkList, callBack) {
				this.itemList = this.itemList1
				this.optType = 'copy'
				this.wxapp_id = wxapp_id;
				this.single = false;
				this.checkList = checkList || [];
				this.showActionSheet = true
				this.callBack = callBack || null
				
			},
			//同步商品-单个商品同步
			updata(item) {
				this.itemList = this.itemList2
				this.optType = 'updata'
				this.wxapp_id = item.wxapp_id;
				this.single = true;
				this.wxapp_goods_id = item.wxapp_goods_id || ''
				this.showActionSheet = true
			},
			//同步商品-批量商品同步
			allUpdata(wxapp_id,checkList, callBack) {
				this.itemList = this.itemList2
				this.optType = 'updata'
				this.single = false;
				// if (this.myVip == '2' || this.myVip == '3' ||  this.myVip == '4') {
				// 	if (this.vip == '4') {
				this.wxapp_id = wxapp_id;
				this.checkList = checkList || [];
				this.showActionSheet = true;
				this.callBack = callBack || null
				// 	} else {
				// 		this.$refs.popupTips.open()
				// 	}
				// } else {
				// 	this.$api.msg('开通明虾权限才能渠道商品哦！')
				// }
			},
			// 店铺资料
			toShopInformation() {
				this.$refs.contact.open(this.user)
			},
			//买家会员信息
			getWxappData(callback) {
				app._get('user.index/vipDetail', {}, (res) => {
					if (res.code == '1') {
						let data = res.data.userInfo || {}
						this.myVip = data.vip || ''
						typeof callback === 'function' && callback();
					}
				})
			},
			// 商家会员数据
			getShowData(wxapp_id,next) {
				this.next = next || null;
				this.wxapp_id = wxapp_id
				let nextC = (callBack) => {
					app._get('wxapp/info', {
						wxapp_id: this.wxapp_id
					}, (res) => {
						if (res.code == -1) {
							this.$emit('showLogin', callBack)
						} else {
							let values = res.data.shop || {}
							this.user = values
							this.name = values.name || ''
							this.logo = values.logo || ''
							this.wxapp_remark = values.wxapp_remark || ''
							this.notice = values.notice || ''
							this.saleTotal = values.saleTotal || 0
							this.pvTotal = values.pvTotal || 0
							this.own_goods = values.own_goods || 0
							this.vip = values.vip || ''
							this.company = values.company || '';
							this.next();
						}
					}, false, false, false, this.noLogin)
				}
				nextC(nextC)
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .popup-main .pop-input{font-size: 30rpx;}
</style>
