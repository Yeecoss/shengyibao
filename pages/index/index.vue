<template>
	<view class="bgf8">
		<!-- 自定义标题栏 -->
		<navigationBar :back="false" id="top"
			background="transparent">
			<view class="left-title dis-flex flex-y-center" slot="left">
				<view class="serchBox" @tap="toOtherPage('/pages/category/extend/list')">
					<text class="iconfont2 icon-searchfor"></text>
					请输入关键词搜索
				</view>
			</view>
		</navigationBar>
		<view class="heardBg"></view>
		<scroll-view class="scrollBox" @scroll="scroll" scroll-y :style="'height: ' + scrollHeight + 'px;'">
			<view class="padBox">
				<view class="heardBox">
					<view class="heardTitle dis-flex flex-y-center">
						<text class="iconfont2 icon-jingshi"></text>
						<text class="textItem">
							请提前联系商家确认营业状态
						</text>
					</view>
					<view class="heardCont dis-flex">
						<view class="imgBox">
							<image class="img" mode="aspectFill" :src="wxapp.logo" alt="" srcset=""></image>
						</view>
						<view class="shopInfo flex-box">
							<view class="shopName">
								{{wxapp.name}}
							</view>
							<view class="shopState">
								普通商户
							</view>
							<view class="shopTime">
								{{wxapp.is_open ? '营业中' : '休息中'}}
								<text v-if="wxapp.biz_start && wxapp.biz_end">
									{{wxapp.biz_start}}-{{wxapp.biz_end}}
								</text>
								<text v-else>
									暂无
								</text>
							</view>
						</view>
						<view class="shopScore">
							4.8
							<text class="score">分</text>
						</view>
					</view>
					<view class="addressBox dis-flex">
						<view class="address flex-box">
							{{wxapp.address ? wxapp.address.address : ''}}
							<text class="length">（距离你{{distance}}公里）</text>
						</view>
						<view class="iconBox" style="margin: 0 48rpx 0 88rpx;" @tap="openMap(wxapp.address)">
							<image class="iconItem" src="../../static/images/map.png" mode=""></image>
							<view>
								导航
							</view>
						</view>
						<view class="iconBox" @tap="toShopInformation">
							<image class="iconItem" src="../../static/images/phone.png" mode=""></image>
							<view>
								电话
							</view>
						</view>
					</view>
					<view class="noticeBox dis-flex flex-y-center">
						<view class="noticeIcon">
							<image class="iconItem" src="../../static/images/notice.png" mode=""></image>
						</view>
						<view class="noticeCont flex-box onelist-hidden">
							{{wxapp.notice}}
						</view>
						<view class="more" @tap.stop="toOtherPage('/pages/myGoods/shopNotice/detail?text=' + wxapp.notice)">
							更多
							<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
						</view>
					</view>
				</view>
			</view>
			<view>
				<diy-component
					:user="user"
					:heardHeight="heardHeight"
					:scrollTop="scrollTop"
					:diyItems="items"
					:wxapp="wxapp"
					:comments="comments"
					:cartList="cartList"
					:coupon_id="coupon_id"
					ref="diyComponent"
				></diy-component>
			</view>
			
		</scroll-view>
		<!-- 自定义tabbar -->
		<foot-tabBar ref="footTabBar" dIndex="0" :homeStyle="homeStyle"></foot-tabBar>
		<popup-tips
		  ref="popupTips"
		  :title="mtitle"
		  :content="mcontent"
		  confirmText="联系商家"
		  concelText="返回个人中心"
		></popup-tips>
		<contact ref="contact"></contact>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import footTabBar from "@/components/foot-tabBar";
	import loading from "@/components/loading";
	import popupTips from "@/pages/index/blockModel/index";
	import diyComponent from "@/components/diy/diyIndex";
	import contact from '@/components/myGoodsCommon/contact/index';
	import Toptips from '@/components/toptips/toptips';

	export default {
		components: {
			footTabBar,
			loading,
			popupTips,
			diyComponent,
			contact
		},
		data() {
			return {
				wxapp: {},
				user: {},
				//是否存在搜索
				// 页面参数
				options: {},
				// 页面元素
				items: {
				},
				page: {},
				scrollHeight: 0,
				heardHeight: 0,
				scrollTop: 0,
				isLoading: true,
				homeStyle: "div", //店铺模板
				mtitle: "",
				mcontent: "",
				comments: [],
				distance: 0,
				cartList: [],
				coupon_id: ''
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.setListHeight()
			// 当前页面参数
			this.setData({
				options,
			});
			let scene = App.getSceneData(options);
			let mbid = options.mbid ? options.mbid : (scene.mbid ? scene.mbid : '');
			let wxapp_id = options.wid ? options.wid : (scene.wid ? scene.wid : '');
			if (options.wid) {
				App.wxapp_id = options.wid;
				wx.setStorageSync("wxapp_id", options.wid);
			}
			if (mbid != '' && mbid != 'undefined') {
				uni.setStorageSync('mbidObj', JSON.stringify({
					mbid: mbid,
					wxapp_id: wxapp_id
				}));
				App.bindMbid();
			}
			// #ifdef MP
			wx.showShareMenu({
				menus: ["shareAppMessage", "shareTimeline"],
				success(res) {},
				fail(e) {},
			});
			// #endif
			this.pageReport()
		},
		onShow() {
			this.getSetting();
			this.getCartList();
		},
		onHide() {
			this.is_shared = 0;
		},
		// 分享当前页面
		onShareAppMessage(res) {
			let user_id = uni.getStorageSync('user_id') || '';
			// 构建分享参数
			if (res.from == 'button' && res.target.id) {
				return {
					title: '商品详情',
					path: "/pages/goods/index?goods_id=" + res.target.id + '&mbid=' + user_id,
					imageUrl: res.target.dataset.shareimg
				};
			} else {
				return {
					title: this.title,
					path: "/pages/index/index?wid=" + App.wxapp_id + '&mbid=' + user_id,
				}
			}
		},
		onShareTimeline(res) {
			let user_id = uni.getStorageSync('user_id') || '';
			let shareObj = {
				title: this.title,
				query: "wid=" + App.wxapp_id + '&mbid=' + user_id,
			};
			return shareObj;
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getSetting(true);
		},
		onReachBottom() {},
		methods: {
			getLocation() {
				let that = this
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						console.log(res);
						let latitude = res.latitude;
						let longitude = res.longitude;
						let distance = 0
						if (that.wxapp.address && that.wxapp.address.latitude) {
							let oldLatitude = that.wxapp.address.latitude;
							let oldLongitude = that.wxapp.address.longitude;
							distance = that.distanceByLnglat(longitude, latitude, oldLongitude, oldLatitude);
							distance = (Number(distance / 1000)).toFixed(2);
							console.log(distance);
						}
						that.distance = distance
					},
					fail(res) {
						console.log(res);
						Toptips({
							duration: 3000,
							content: '获取定位失败，请点击右下角按钮打开定位权限'
						});
					}
				});
			},
			distanceByLnglat(lng1,lat1,lng2,lat2) {
			    var radLat1 = this.Rad(lat1);
			    var radLat2 = this.Rad(lat2);
			    var a = radLat1 - radLat2;
			    var b = this.Rad(lng1) - this.Rad(lng2);
			    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
			    s = s * 6378137.0;// 取WGS84标准参考椭球中的地球长半径(单位:m)
			    s = Math.round(s * 10000) / 10000;
				return s
			},
			Rad(d) {
			    return d * Math.PI / 180.0;
			},
			// 店铺资料
			toShopInformation() {
				let obj = {
					wxapp_id: App.wxapp_id
				}
				App._get('wxapp/info', obj, (res) => {
					let values = res.data.shop || {}
					this.$refs.contact.open(values)
				})
			},
			/**
			 * 设置商品列表高度
			 */
			setListHeight() {
				this.$nextTick(() => {
					const query = wx.createSelectorQuery();
					query.select('#top').boundingClientRect();
					query.selectViewport().scrollOffset();
					query.exec(res => {
						let systemInfo = wx.getSystemInfoSync(),
							// tap高度
							scrollHeight = systemInfo.windowHeight - res[0].height - 40; 
					
							this.scrollHeight = scrollHeight
							this.heardHeight = res[0].height + 10
					});
				})
			},
			scroll(e) {
				this.scrollTop = e.detail.scrollTop + this.heardHeight
			},
			openMap(address) {
				// wx.getLocation({
				// 	type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
				// 	success: function (res) {
				// 		// success
				// 		console.log(res.latitude);
				// 		console.log(res.longitude);
						wx.openLocation({
						   latitude: address.latitude, // 纬度，范围为-90~90，负数表示南纬
						   longitude: address.longitude, // 经度，范围为-180~180，负数表示西经
						   scale: 28, // 缩放比例
						   name:address.name,
						   address: address ? address.address : ''
						})
					// },
					// fail:  function (res) {
					// 	console.log(res)
					// }
				// })
			},
			// 店员特殊处理
			toOtherPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			// 上报
			pageReport() {
				let obj = {
			 	type: "1",
			  url: "pages/index/index",
					wxapp_id: App.wxapp_id + "",
				};
				App._post_form("user/visit", obj, result => {

				});
				let objFollowStore = {
			 	wxapp_id: App.wxapp_id + "",
				};
				App._post_form("user/browseStore", {
					browse: JSON.stringify(objFollowStore),
				}, result => {});
			},
			//获取模板配置
			getSetting(stopPullDown) {
				let that = this;
				let datas = {
					wxapp_id: App.wxapp_id
				};
				
				App._get("wxapp/setting", datas, (res) => {
					//判断是否被拉黑
					if (res.code == 1000) {
						that.mtitle = "提示";
						that.mcontent = res.msg;
						let user = res.user;
						user.service_qrcode = res.wxapp.service_qrcode;
						that.$refs.popupTips.open(
							false,
							() => {
								App.wxapp_id = App.myShopInfo.wxapp_id;
								wx.setStorageSync("wxapp_id", App.myShopInfo.wxapp_id);
								uni.reLaunch({
									url: "/pages/userIndex/index",
								});
							},
							user
						);
						return false;
					}
					//店铺使用模板
					let info = res.data.wxapp;
					that.setWxapp(res.data); //商家信息
					that.getLocation();
					let obj = res.data.user || {};
					obj.service_qrcode = that.wxapp.service_qrcode
					that.user = obj;
					that.$nextTick(() => {
						that.getPageData(() => {
							if (stopPullDown) {
								uni.stopPullDownRefresh();
							}
						});
					})
				});
			},
			/**
			 * 加载页面数据
			 */
			getPageData(callback) {
				let that = this;

				App._get("page/dinner", {
					page_id: that.options.page_id || 0,
				}, result => {
					callback ? callback() : "";
					that.isLoading = false;

					that.page = result.data.page;
					that.comments = result.data.comments || [];
					let items = result.data.items || [];
					for (let key in items) {
						let item = items[key];
						if (item.type == 'banner') {
							that.items.banner = item
						}
						if (item.type == 'coupon') {
							that.items.coupon = item
						}
						if (item.type == 'goods') {
							if (item.params.source === 'hot') {
								that.items.hot = item
							}
							if (item.params.source === 'recommend' || item.params.source === 'choice') {
								that.items.recommend = item
							}
						}
					}
				});
			},
			setWxapp(data) {
				this.wxapp = data.wxapp;
			},
			/**
			 * 获取购物车列表
			 */
			getCartList() {
				App._get('cart/list', {
					wxapp_id: App.wxapp_id,
				}, result => {
					let shop_list = result.data.shop_list || {}
					this.cartList = shop_list.goods_list || []
					this.coupon_id = result.data.coupon_id || ''
				});
			},
		},
	};
</script>
<style lang="scss" scoped>
	@import "./index";
</style>
