<template>
	<view class="shopInformation">
		<!-- 自定义标题栏 -->
		<navigationBar :title="'开单号:' + title" :fontWeight="600" titleColor="#FF7541" isHelpme>
		</navigationBar>
		<div class="content">
			<div class="list dis-flex flex-y-center flex-x-between line">
				<div class="label">
					开单号：{{item.number}}
				</div>
				<div class="content1">
					开单时间：{{item.sale_time}}
				</div>
			</div>
			<div class="list1 dis-flex flex-x-between">
				<div class="label dis-flex flex-x-between">
					<div style="width:100rpx">客户：</div>
					<div style="flex:1">{{item.clientor ? item.clientor.name : '-'}}</div>
				</div>
				<div class="content1 dis-flex flex-x-between">
					<div style="width:140rpx">销售员：</div>
					<div style="flex:1">{{item.clerkor ? item.clerkor.real_name : '-'}}</div>
				</div>
			</div>
			<div class="tableBox" v-if="item.sale_goods && item.sale_goods.length > 0">
				<div class="heard dis-flex flex-y-center">
					<div class="order">序号</div>
					<div class="name">商品简称</div>
					<div class="spec">规格</div>
					<div class="num">数量</div>
					<div class="price">单价</div>
				</div>
				<div class="dis-flex flex-y-center line" v-for="(items, index) in item.sale_goods" :key="index">
					<div class="order" style="line-height:40rpx">
						<div>{{index + 1}}</div>
						<div class="dis-flex flex-x-center" @tap.stop="checkItem(items)">
							<view :class="items.checked ? 'done-btn1' : 'done-btn'"><text
									class="iconfont2 icon-duihao f-24"></text></view>
						</div>
					</div>
					<div class="name dis-flex flex-y-center"><text>{{items.goods_short_name}}</text></div>
					<div class="spec dis-flex flex-y-center"><text>{{items.goods_sku_name || '——'}}</text></div>
					<div class="num dis-flex flex-y-center"><text>{{items.goods_num}}</text></div>
					<div class="price"><text>{{items.goods_price}}</text></div>
				</div>
			</div>
			<div class="remark">
				<div>货款金额：¥{{item.total_price || '0.00'}}</div>
				<div>商品数量：{{item.total_num || '0'}}</div>
				<div v-if="item.pay_way">结算方式：{{item.pay_way.text || '-'}}</div>
				<div v-if="item.delivery_way">发货方式：{{item.delivery_way.text || '-'}}</div>
				<div v-if="item.warehouse">仓库：{{item.warehouse.name || '-'}}</div>
				<div v-if="item.remark">备注：{{item.remark}} </div>
				<div v-if="item.sale_annex && item.sale_annex.length > 0">附件：
					<image v-for="(items, index) in item.sale_annex" :key="index" :src="items.file_path"></image>
				</div>
			</div>
			<div class="dis-flex flex-y-center flex-x-between" style="margin-top:20rpx">
				<div class="imgBox" @tap="lookImg('store_qrcode')">
					<image :src="item.store_qrcode || 'https://pic.kaidanxia.com/2020-09-21/160508aec715558.png'">
					</image>
					<div>
						店铺二维码
					</div>
				</div>
				<div class="imgBox magin" @tap="lookImg('wxpay_qrcode')">
					<image :src="item.wxpay_qrcode || 'https://pic.kaidanxia.com/2020-09-21/160508aec715558.png'">
					</image>
					<div>
						微信付款
					</div>
				</div>
				<div class="imgBox" @tap="lookImg('alpay_qrcode')">
					<image :src="item.alpay_qrcode || 'https://pic.kaidanxia.com/2020-09-21/160508aec715558.png'">
					</image>
					<div>
						支付宝付款
					</div>
				</div>
			</div>
			<div class="logo dis-flex flex-y-center flex-x-center">
				<div class="line"></div>
				<div class="iconBox">
					<text class="iconfont2 icon-bianzu6 f-32 col-m"></text>
				</div>
				<div class="line"></div>
			</div>
		</div>
		<div class="butBox dis-flex flex-y-center flex-x-center">
			<div class="submit m-r-20 bg-w" @tap.stop="edit" v-if="item.status && item.status.value != 1">
				编辑
			</div>
			<div class="submit bg-y" @tap.stop="printTicket">
				打印
			</div>
			<!-- #ifdef MP || H5 -->
			<button open-type="share" class="submit bg-r f-32 m-l-20">
				分享
			</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<button class="submit bg-r f-32 m-l-20" @tap.stop="toShare">分享</button>
			<!-- #endif -->
		</div>
		<popup-tips ref="popupTips" :content="tipTit" confirmText="去上传"></popup-tips>
		<div v-show="loading">
			<loading></loading>
		</div>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import loading from '@/components/loading';
	import guidePage from '@/components/guide-page';
	let shareTitle = ''
	export default {
		data() {
			return {
				loading: true,
				specList: [],
				title: '',
				sale_id: '',
				tipTit: '',
				item: {}
			}
		},
		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			return {
				title: shareTitle,
				path: "/pages/retailShop/shopAbout/salesBilling/shareDetail/index?sale_id=" + this.sale_id
			};
		},
		components: {
			popupTips,
			loading,
			guidePage
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.sale_id = options.sale_id || ''
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			toShare() {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let ws = page.$getAppWebview();
				let bitmap = new plus.nativeObj.Bitmap('drawScreen1');
				// 将webview内容绘制到Bitmap对象中 
				uni.showLoading({
					title: '截图生成中，请稍等...'
				});
				ws.draw(bitmap, () => {
					// 保存图片到本地  
					bitmap.save("_doc/drawScreen1.jpg", {
						overwrite: true
					}, res => {
						// console.log(res.target); // 图片地址
						App.uploadFile({
							filePath: res.target,
							noLoad: true,
							success: res => {
								// console.log(JSON.stringify(res)); // 保存失败信息
								let data = {
									provider: 'weixin',
									scene: "WXSceneSession",
									type: 5,
									imageUrl: res.data.file_path +
										'?vframe/jpg/offset/0|imageView2/0/w/1000',
									miniProgram: {
										id: App.applets_id,
										path: "/pages/retailShop/shopAbout/salesBilling/shareDetail/index?sale_id=" +
											this.sale_id,
										type: 0,
										webUrl: 'http://uniapp.dcloud.io'
									},
									success: ret => {
										// console.log(JSON.stringify(ret));
									},
									fail: ret => {
										// console.log(JSON.stringify(ret));
									}
								}
								// console.log(JSON.stringify(data))
								uni.share(data)
								bitmap.clear(); // 清除Bitmap对象  ,
							},
							fail: res => {
								// console.log(JSON.stringify(res)); // 保存失败信息
							},
							complete: ret => {
								uni.hideLoading();
								// console.log(JSON.stringify(ret));
							}
						})
					}, error => {
						// console.log(JSON.stringify(error)); // 保存失败信息
						bitmap.clear(); // 清除Bitmap对象  
					});
				}, error => {
					// console.log(JSON.stringify(error)); // 绘制失败  
					this.$api.msg('绘制失败')
				}, {
					check: true, // 设置为检测白屏  
				});
			},
			checkItem(items) {
				items.checked = !items.checked
			},
			lookImg(type) {
				if (this.item[type] && this.item[type] != '') {
					uni.previewImage({
						urls: [this.item[type]]
					})
				} else {
					if (type == 'store_qrcode') {
						return
					}
					if (type == 'alpay_qrcode') {
						this.tipTit = '您还没有上传支付宝收款码哦！是否去店铺资料页上传?'
					}
					if (type == 'wxpay_qrcode') {
						this.tipTit = '您还没有上传微信收款码哦！是否去店铺资料页上传?'
					}
					this.$refs.popupTips.open(() => {
						uni.navigateTo({
							url: '/pages/retailShop/shopAbout/shopInformation/index'
						})
					})
				}
			},
			edit() {
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/salesBilling/add/index?sale_id=' + this.sale_id
				});
			},
			printTicket() {
				App._post_form('store.shop.sale/printTicket', {
					sale_id: this.sale_id
				}, (result) => {
					if (result.code == '1') {
						App.showSuccess(result.msg)
					} else {
						App.showError(result.msg)
					}
				})
			},
			submit() {},
			getDetail() {
				App._get('store.shop.sale/getSaleDetail', {
					sale_id: this.sale_id
				}, (result) => {
					if (result.code == '1') {
						let data = result.data || {}
						data.sale_goods.forEach(item => {
							item.checked = false
						})
						this.item = data
						this.title = this.item.number
						shareTitle = '开单号：' + this.item.number + ' 客户：' + (this.item.clientor ? this.item.clientor
							.name : '') + '\n' + '时间：' + this.item.sale_time
						// console.log(shareTitle)
					} else {
						this.$api.msg(result.msg)
					}
					this.loading = false
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
