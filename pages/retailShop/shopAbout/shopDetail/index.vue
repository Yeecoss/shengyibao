<template>
	<scroll-view class="retailShop container" scroll-y @scrolltolower="bindDownLoad" ref="retailShop">
		<div class="retailShopBox">
			<div class="navBox">
				<navigationBar id="top" background="transparent" color="white" :fixed="false"></navigationBar>
			</div>
			<view class="bgBox">
				<view class="bg">
					<image :src="logo" mode="aspectFill"></image>
					<div class="mask"></div>
				</view>
				<view class="contentBox" :style="{'margin-top': scrollTop + 'rpx'}" v-if="!loading">
					<view class="shopInfo">
						<view class="nameBox dis-flex">
							<view class="imgBox">
								<image :src="logo" alt=""></image>
							</view>
							<div class="empty"></div>
							<view class="info dis-flex flex-y-center">
								<div class="infoBox">
									<view class="title dis-flex flex-y-center">
										<text>{{name}}{{wxapp_remark == '' ? '' : ('(' + wxapp_remark + ')')}}</text>
										<view class="titleVip">
											<image v-if="vip" mode="aspectFit" :src="vips[vip]"></image>
										</view>
										<text class="editBox" @tap.stop="edit()">
											<text class="iconfont2 icon-bianji"></text>
										</text>
									</view>
									<view class="content">
										<text v-if="company">
											<text class="iconfont2 icon-Personalcertification m-r10" style="color:#7FD224"></text>
											已认证
										</text>
										<template v-if="wxapp_level">
											<image v-for="(item, index) in wxapp_level" :key="index" class="shopGrade" src="/static/images/shopGrade.png"></image>
										</template>
									</view>
								</div>
							</view>
						</view>
						<view class="dataBox dis-flex flex-y-center">
							<view class="dataItem">
								<view class="num">{{pvTotal || '0'}}</view>
								<view class="dataTit">浏览量</view>
							</view>
							<view class="dataItem">
								<view class="num">{{own_goods_num || '0'}}</view>
								<view class="dataTit">货品数</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<div class="tabs dis-flex flex-y-center">
				<div class="tabsItem" :class="showType == '1' ? 'active' : ''" @tap.stop="checkeType('1')">全部
					<div class="line" v-if="showType == '1'"></div>
				</div>
				<div class="tabsItem" :class="showType == '2' ? 'active' : ''" @tap.stop="checkeType('2')">图集
					<div class="line" v-if="showType == '2'"></div>
				</div>
			</div>
			<div class="content">
				<view class="tui-header-box">
					<view class="tui-header flex-y-center">
						<view class="search-input">
							<view class="dis-flex flex-y-center search-box">
								<text class="iconfont2 icon-searchfor col-9"></text>
								<input v-model="searchKey" @blur="searchBlur" class="input" placeholder="搜索" placeholderStyle="color:#aba9a9;font-size:24rpx;"
								 type="text" />
							</view>
						</view>
						<view class="tui-top-item tui-top-item1" @tap.stop="screen" data-index="3">
							<text class="mr-5">筛选</text>
							<text class="iconfont2 icon-screen f-24"></text>
						</view>
					</view>
				</view>
				<div v-if="list.length > 0" style="min-height: 100%">
					<div v-show="showType == '1'">
						<div class="groupBox" v-for="(item, index) in list" :key="index">
							<div class="groupTime">
								<text class="f-36">{{item.day}}/</text>
								<text class="f-24">{{item.year}}</text>
							</div>
							<div class="groupListBox">
								<div class="list dis-flex flex-y-center" v-for="(items, indexs) in item.list" :key="indexs" @tap.stop="toDetail(items)">
									<div class="checkItem" v-if="is_all" @tap.stop="radioChange(items)">
										<radio color="#FF7541" :checked="items.checked" />
										<div class="clickBox"></div>
									</div>
									<div class="imgBox">
										<image mode="aspectFill imageDefault" :src="items.goods.goods_image"></image>
									</div>
									<div class="w-20"></div>
									<div class="goodsInfo">
										<div class="goodsName twolist-hidden">{{items.goods.goods_name}}</div>
										<div class="optBox">
											<text class="opt-m-r" @tap.stop="upload(items)">下载</text>
											<text class="opt-m-r" @tap.stop="copy(items)">复制</text>
											<!-- #ifdef MP -->
											<!-- <button class="but" @click.stop="shareWx(items)" open-type="share">分享</button> -->
											<!-- #endif -->
											<!-- #ifdef APP-PLUS -->
											<text @click.stop="share(items)">分享</text>
											<!-- #endif -->
											<div class="updata updataActive" :class="!items.open_dealer || items.wxapp_goods_type.value == 2 ? 'updataDisable' : ''" @tap.stop="updata(items)">
												<text>同步</text>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-show="showType == '2'">
						<div class="imgListBox dis-flex flex-y-center flex-wrap">
							<template v-for="(item) in list">
								<template v-for="items in item.list">
									<div class="imgList" :key="items.wxapp_goods_id" @tap.stop="toDetail(items)">
										<div class="imgItem">
											<image mode="aspectFill imageDefault" :src="items.goods.goods_image"></image>
											<div class="imgNum">{{items.goods.image ? items.goods.image.length : 0}}</div>
											<div class="checkItem check-wrap" v-if="is_all">
												<!-- <radio color="#FF7541" :checked="items.checked" /> -->
												<checkbox class="checkbox" :checked="items.checked"/>
												<div class="clickBox"></div>
											</div>
										</div>
									</div>
								</template>
							</template>
						</div>
					</div>
					<view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
					<view v-if="more_loading" class="no-more f-24 col-9">加载中...</view>
				</div>
				<div v-else style="padding-top:150rpx">
					<!-- 无数据 -->
					<tui-no-data :fixed="false" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png">
						<view class="col-9">亲, 此店铺暂无商品！</view>
					</tui-no-data>
				</div>
			</div>
		</div>
		<div class="footer dis-flex flex-y-center">
			<div class="footItem" @tap.stop="toShopInformation">联系Ta</div>
			<div class="line"></div>
			<div class="footItem" @tap.stop="allCheck">{{is_all ? '完成' : '批量'}}</div>
			<div class="allCheckBox dis-flex flex-y-center" v-if="is_all">
				<div class="allCheck" @tap.stop="allCheckedItem">
					<radio color="#FF7541" :checked="allChecked" />
					<div class="clickBox"></div>
				</div>
				<div class="selectNum">
					<div class="dis-flex flex-y-center" @tap.stop="openShowNum">
						<div class="selectCheckNum"> {{checkListNum}}/</div>
						<div class="selectAllNum dis-flex flex-y-center">
							<div class="nowNum">{{nowNum}}</div>
							<div class="iconBox">
								<text class="iconfont2 icon-pull-down"></text>
							</div>
						</div>
					</div>
				</div>
				<div class="optBox dis-flex flex-y-center">
					<div class="optItem" @tap.stop="allCopy">复制</div>
					<div class="optItem" @tap.stop="allUpdata">同步</div>
				</div>
			</div>
		</div>
		<popup-input ref="popupInput" title="改备注" placeholder="请输入备注" :maxlength="12" showlength></popup-input>
		<!-- 底部弹窗 -->
		<tui-actionsheet :show="showNumList" :item-list="numList" @click="numListClick" @cancel="closeNumList"></tui-actionsheet>

		<popup-tips ref="popupTips" :content="content" :confirmText="confirmText"></popup-tips>

		<contact ref="contact"></contact>
		<!-- 右拉筛选 -->
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
		<!-- 加价 -->
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- 同步 -->
		<updata ref="updata" :nowNum="nowNum" :allChecked="allChecked"></updata>
	</scroll-view>
</template>

<script>
	const App = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import contact from '@/components/myGoodsCommon/contact/index';
	import rightDrawer from './rightDrawer/index';
	import downloadFile from '@/components/download-file';
	import updata from '@/components/updata/updata';
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	export default {
		data() {
			return {
				confirmText: '',
				content: '',
				showType: '1',
				company: '',
				wxapp_level: 0,
				scrollTop: 0,
				vip: '',
				myVip: '',
				otherObj: {},
				user: {},
				wxapp_goods_id: '',
				optType: '',
				showActionSheet: false,
				nowNum: '50',
				list: [],
				checkList: [],
				allChecked: false,
				is_all: false,
				showNumList: false,
				numList: [{
					text: "50",
					color: "#333333",
				}, {
					text: "100",
					color: "#333333"
				}, {
					text: "全部",
					color: "#333333"
				}],
				single: true,
				page: 1,
				last_page: 1,
				total: 0,
				no_more: false,
				more_loading: false,
				name: '',
				wxapp_remark: '',
				logo: '',
				notice: '',
				saleTotal: '',
				pvTotal: '',
				own_goods_num: '',
				searchKey: '',
				loading: true,
				vips:{
					1: 'http://pic.kaidanxia.com/2020-08-06/20200806093701e776a3750.png',
					2: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
					3: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
					4: 'http://pic.kaidanxia.com/2020-08-06/20200806093702403126378.png',
				}
			};
		},
		computed: {
			checkListNum() {
				let num = 0
				if (this.allChecked) {
					if (this.nowNum == '50') {
						if (this.total < 50) {
							num = this.total
						} else {
							num = this.nowNum
						}
					}
					if (this.nowNum == '100') {
						if (this.total < 100) {
							num = this.total
						} else {
							num = this.nowNum
						}
					}
					if (this.nowNum == '全部') {
						num = this.nowNum
					}
				} else {
					num = this.checkList.length
				}
				return num;
			}
		},
		components: {
			popupInput,
			contact,
			rightDrawer,
			popupTips,
			downloadFile,
			updata
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.wxapp_id = options.wxapp_id || ''
			this.page = 1
			this.getShowData()
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		onShow() {
		},
		methods: {
			unitData() {
				this.page = 1
				this.getShowData()
			},
			checkeType(type) {
				this.showType = type
			},
			getMyVip () {
				App._get('user.index/vipDetail', {}, (result) => {
					if (result.code == '1') {
						let data = result.data.userInfo || {}
						this.myVip = data.vip || ''
					}
				})
			},
			share(items) {
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5,
					imageUrl: items.goods.goods_image + '?vframe/jpg/offset/0|imageView2/1/w/300/h/300',
					title: items.goods.goods_name,
					miniProgram: {
						id: App.applets_id,
						path: '/pages/retailShop/shopAbout/shopDetail/detail/index?wxapp_goods_id=' + items.wxapp_goods_id + '&wxapp_id=' + items.wxapp_id,
						type: 0,
						webUrl: 'http://uniapp.dcloud.io'
					},
					success: ret => {
						// console.log(JSON.stringify(ret));
					}
				});
			},
			// 点击下载
			upload(item){
				let files = item.goods.image || []
				if (files.length == 0) {
					return false
				}
				const that = this;
				let uploads = [];
				files.forEach(item => {
					uploads.push(item.file_path)
				});
				if(uploads!=''){
					uni.showModal({
						title: '友情提示',
						content: '是否下载该商品的图片/视频？',
						confirmColor: '#FF7541',
						confirmText: '是',
						cancelText: '否',
						success: (res) => {
							if(res.confirm){
								let name = item.goods.goods_name;
								that.clipboard(name)
								that.$refs.download._downloadFileS(uploads);
							}
						}
					});
				}else{
					that.$api.msg('该商品暂无可下载的图片/视频');
				}
			},
			//下载回调
			comfirmStatusS (promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res?"下载成功，文案已复制":'取消保存')
				})
			},
			// 复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						// this.$refs.toast.showTips({msg: "复制标题成功"});
					} else {
						// this.$refs.toast.showTips({msg: "复制失败"});
					}
					// #endif
				})
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
				this.scrollTop = scrollTop
				this.loading = false
			  });
			},
			toDetail(item) {
				if (this.is_all) {
					this.radioChange(item)
				} else {
					uni.navigateTo({
						url: './detail/index?wxapp_goods_id=' + item.wxapp_goods_id + '&wxapp_id=' + this.wxapp_id
					});
				}
			},
			rightDrawerChange(obj) {
				this.otherObj = obj
				this.getShowData()
			},
			screen() {
				this.$refs.rightDrawer.screen(this.wxapp_id)
			},
			allCopy() {
				this.$refs.updata.allCopy(this.wxapp_id, this.checkList);
			},
			allUpdata() {
				this.$refs.updata.allUpdata(this.wxapp_id, this.checkList);
			},
			allCheckedItem() {
				this.allChecked = !this.allChecked
				this.upCheckList(true)
			},
			numListClick(e) {
				this.showNumList = false
				this.nowNum = this.numList[e.index].text
				this.upCheckList()
			},
			closeNumList() {
				this.showNumList = false
			},
			openShowNum() {
				this.showNumList = true
			},
			upCheckList(unit) {
				this.checkList = []
				if (this.allChecked) {
					if (this.nowNum == '50') {
						this.list.forEach((items, indexs) => {
							items.list.forEach((item, index) => {
								if (this.checkList.length < 50) {
									item.checked = true
									this.checkList.push(item.wxapp_goods_id)
								} else {
									item.checked = false
								}
							})
						})
					}
					if (this.nowNum == '100') {
						this.list.forEach((items, indexs) => {
							items.list.forEach((item, index) => {
								if (this.checkList.length < 100) {
									item.checked = true
									this.checkList.push(item.wxapp_goods_id)
								} else {
									item.checked = false
								}
							})
						})
					}
					if (this.nowNum == '全部') {
						this.list.forEach((items, indexs) => {
							items.list.forEach((item, index) => {
								item.checked = true
								this.checkList.push(item.wxapp_goods_id)
							})
						})
					}
				} else {
					if (unit) {
						this.list.forEach((items, indexs) => {
							items.list.forEach((item, index) => {
								item.checked = false
							})
						})
					} else {
						this.list.forEach((items, indexs) => {
							items.list.forEach((item, index) => {
								if (item.checked) {
									this.checkList.push(item.wxapp_goods_id)
								}
							})
						})
					}
				}
			},
			allCheck() {
				// 批量管理
				if (this.is_all) {
					this.checkList = []
					this.allChecked = false
					this.list.forEach(item => {
						item.list.forEach(items => {
							items.checked = false
						})
					})
				}
				this.is_all = !this.is_all
			},
			// 店铺资料
			toShopInformation() {
				this.$refs.contact.open(this.user)
			},
			radioChange(item) {
				if (item.checked) {
					let index = this.checkList.indexOf(item.wxapp_goods_id)
					if (index != -1) {
						this.checkList.splice(index, 1)
					}
				} else {
					this.checkList.push(item.wxapp_goods_id)
				}
				item.checked = !item.checked
				item.noShow = true
				this.$nextTick(() => {
					item.noShow = false
				})
				this.allChecked = false
			},
			edit() {
				this.$refs.popupInput._open(this.wxapp_remark, (val) => {
					App._post_form('user/modifyRemark', {
						id: this.wxapp_id,
						remark: val
					}, (result) => {
						this.$api.msg(result.msg)
						this.getShowData()
					})
				})
			},
			closeActionSheet() {
				this.showActionSheet = false
				this.wxapp_goods_id = ''
			},
			copy(item) {
				this.$refs.updata.copy(item);
			},
			updata(item) {
				this.$refs.updata.updata(item);
			},
			// 展示数据
			getShowData() {
				let obj = {
					wxapp_id: this.wxapp_id
				}
				App._get('wxapp/info', obj, (result) => {
					let values = result.data.shop || {}
					this.user = values
					this.name = values.name || ''
					this.logo = values.logo || ''
					this.wxapp_remark = values.wxapp_remark || ''
					this.notice = values.notice || ''
					this.saleTotal = values.saleTotal || 0
					this.pvTotal = values.pvTotal || 0
					this.own_goods_num = values.own_goods_num || 0
					this.vip = values.vip || ''
					this.company = values.wxapp_detail.company || ''
					this.wxapp_level = values.wxapp_detail.wxapp_level || 0
					this.getListData()
					this.getMyVip()
				})
			},
			searchBlur() {
				this.getListData()
			},
			getListData(more) {
				let obj = {
					wxapp_id: this.wxapp_id,
					page: this.page,
					search: this.searchKey
				}
				obj = Object.assign(obj, this.otherObj)
				  if (this.page != 1) {
					  this.more_loading = true
				  }
				App._get('wxapp.goods/ownLists', obj, (result) => {
					if (this.page != 1) {
						this.more_loading = false
					}
					this.last_page = result.data.list.last_page || 1
					this.total = result.data.list.total || 0
					let list = result.data.list.data || []
					list.forEach(item => {
						item.year = item.date.substring(0, 4)
						item.day = item.date.substring(5, 11)
						if (item.list) {
							item.list.forEach(items => {
								items.checked = false
							})
						} 
					})
					if (more) {
						list.forEach(item => {
							let ishave = false
							this.list.forEach(items => {
								if (item.date == items.date) {
									ishave = true
									items.list = items.list.concat(item.list)
								}
							})
							if (!ishave) {
								this.list.push(item)
							}
						})
						this.upCheckList()
					} else {
						this.list = JSON.parse(JSON.stringify(list))
						this.upCheckList(true)
					}
				})
			},
			bindDownLoad() {
				// 已经是最后一页
				if (this.page >= this.last_page) {
					this.no_more = true
					return false;
				} // 加载下一页列表
				this.page++;
				this.getListData(true)
			},
			toOtherPage(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
