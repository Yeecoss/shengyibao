<template>
	<div class="pageBox dis-flex flex-dir-column">
		<!-- 自定义标题栏 -->
		<navigationBar :title="title" isHelpme id="top">
		</navigationBar>
		<loading v-if="isLoading"></loading>
		<view class="contentBox" v-else>
			<scroll-view :style="{height: scrollHeight + 'px'}" scroll-y>
				<view class="heardBox dis-flex flex-y-center">
					<view class="imgBox">
						<image :src="goodsImg" mode="aspectFill"></image>
					</view>
					<view class="infoBox">
						<view class="goodsName twolist-hidden">
							{{goodsName || '-'}}
						</view>
						<view class="goodsPrice dis-flex flex-y-end flex-x-between">
							<view>
								¥{{goodsPrice || '-'}}
							</view>
							<view class="allSet" @tap="showAll" v-if="spec_type == 20">
								批量设置
							</view>
						</view>
					</view>
				</view>
				<view class="specBox">
					<view class="tableTitle dis-flex flex-y-center flex-x-between">
						<view class="tableTd">
							规格
						</view>
						<view class="tableTd">
							价格
						</view>
						<view class="tableTd">
							秒杀价格
						</view>
						<view class="tableTd">
							秒杀库存
						</view>
					</view>
					<view v-for="(item, index) in list" :key="index" v-show="index == 0 || onshow">
						<view class="tableContent dis-flex flex-y-center flex-x-between" :class="list.length == 1 ? 'noBorder' : ''">
							<view class="tableTd">
								{{item.spec_name}}
							</view>
							<view class="tableTd">
								¥{{item.form.goods_price}}
							</view>
							<view class="tableTd dis-flex flex-y-center flex-x-center">
								<text style="margin-right: 10rpx;">¥</text>
								<input type="text" v-model="item.form.seckill_price" />
							</view>
							<view class="tableTd dis-flex flex-y-center flex-x-center">
								<input type="text" v-model="item.form.seckill_stock" />
							</view>
						</view>
					</view>
					<view v-if="list.length > 1" class="showBox dis-flex flex-y-center flex-x-center" @tap="onshowChange">
						<view :class="onshow ? 'top' : 'bottom'">
							<text class="iconfont2 icon-more3"></text>
						</view>
					</view>
				</view>
				<view class="tips">
					<text class="iconfont2 icon-jingshi"></text>
					提示(秒杀库存为独立库存，与主商品库存不同步)
				</view>
				<view class="numBox dis-flex flex-y-center flex-x-between">
					<view class="numItem dis-flex flex-y-center">
						<view class="label">
							限购数量
						</view>
						<input type="text" placeholder="请输入" v-model="limit_num" />
					</view>
					<view class="line"></view>
					<view class="numItem dis-flex flex-y-center">
						<view class="label" style="padding-left: 40rpx;margin-right: 134rpx;">
							上架
						</view>
						<view>
							<cust-switch :checked="status == 1" @change="checkedChange"></cust-switch>
						</view>
					</view>
				</view>
				<view class="tips">
					<text class="iconfont2 icon-jingshi"></text>
					提示(填写0则不限购)
				</view>
				<view style="height: 100rpx;">
					
				</view>
				<popup-inputsAll ref="popupInputsAll"></popup-inputsAll>
				<popup-tips ref="popupTips" content="新增成功,是否前往秒杀会场？" confirmText="前往" concelText="再等等"></popup-tips>
			</scroll-view>
			<view class="footer dis-flex flex-y-center flex-x-center" @tap="submit">
				<view class="footBut">
					确定
				</view>
			</view>
		</view>
		<guidePage ref="guidePage"></guidePage>
	</div>
</template>
<script>
	import custSwitch from '@/components/cust-switch/index.vue';
	import popupInputsAll from './popup-inputsAll/index.vue';
	import popupTips from '@/components/popup-tips/index.vue';
	import loading from '@/components/loading';
	import guidePage from '@/components/guide-page';
	
	let App = getApp().globalData;
	export default {
		data() {
			return {
				title: '添加商品',
				limit_num: '0',
				status: '1',
				scrollHeight: 0,
				goods_id: '',
				sharp_goods_id: '',
				onshow: false,
				checked: true,
				isLoading: true,
				spec_type: '',
				goodsName: '',
				goodsPrice: '',
				goodsImg: '',
				spec_attr: [],
				list: []
			};
		},

		components: {
			custSwitch,
			popupInputsAll,
			loading,
			popupTips,
			guidePage
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.goods_id = options.goods_id || ''
			this.sharp_goods_id = options.sharp_goods_id || ''
			if (this.sharp_goods_id) {
				this.title = '编辑商品'
				this.getDetail()
			} else {
				this.getGoodsDetail()
			}
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		mounted() {},
		methods: {
			/**
			 * 设置列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750
					let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
					this.ios = ios
						// tap高度
					let scrollHeight = systemInfo.windowHeight - res[0].height - 100*rpx; // swiper高度
					this.scrollHeight = scrollHeight
				});
			},
			submit() {
				let titleMsg = ''
				if (this.limit_num === '') {
					titleMsg = '限购数量不能为空！'
				}
				this.list.forEach(item => {
					let seckill_price = item.form.seckill_price || ''
					let seckill_stock = item.form.seckill_stock || ''
					if (seckill_price == '') {
						titleMsg = '秒杀价格不能为空！'
						return
					}
					if (seckill_stock == '') {
						titleMsg = '秒杀库存不能为空！'
						return
					}
				})
				if (titleMsg != '') {
					this.$api.msg(titleMsg)
					return
				}
				
				let obj = {
					wxapp_goods_id: this.goods_id,
					deduct_stock_type: 10,
					limit_num: this.limit_num,
					status: this.status,
					sort: 100
				}
				if (this.spec_type == 10) {
					let sku = this.list[0] || {
						form: {}
					}
					obj.sku = {
					    seckill_price: sku.form.seckill_price,
					    seckill_stock: sku.form.seckill_stock
					}
				}
				if (this.spec_type == 20) {
					obj.spec_many = {
						spec_list: this.list
					}
				}
				uni.showLoading()
				let url = 'shop.market.sharp.goods/add'
				if (this.sharp_goods_id) {
					url = 'shop.market.sharp.goods/edit'
					obj.sharp_goods_id = this.sharp_goods_id
				}
				App._post_json_form(url, obj, (result) => {
					uni.hideLoading()
					if (result.code == 1) {
						let seckillMsg = uni.getStorageSync('seckillMsg')
						if (!seckillMsg) {
							seckillMsg = 0
						}
						uni.setStorageSync('seckillMsg', seckillMsg+1)
						if (seckillMsg >= 3) {
							this.$api.msg(result.msg)
							setTimeout(() => {
								uni.navigateBack()
							}, 500)
						} else {
							this.$refs.popupTips.open(() => {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; //上一个页面
								if(prevPage.$vm){
									prevPage.$vm.currentTab = 1
								}
								uni.navigateBack()
							})
						}
					} else {
						this.$api.msg(result.msg)
					}
				}, false, () => {
					uni.hideLoading()
				})
			},
			// 获取商品信息
			getDetail() {
				let data = {
					sharp_goods_id: this.sharp_goods_id
				};
				App._get('shop.market.sharp.goods/edit', data, result => {
					this.isLoading = false
					let goods = result.data.goods || {}
					let model =  result.data.model || {}
					this.goods_id = model.wxapp_goods_id || ''
					this.goodsName = goods.goods_name || ''
					this.goodsPrice = goods.goods_sku.goods_price || ''
					this.goodsImg = goods.goods_image || ''
					this.spec_type = goods.spec_type
					let goods_multi_spec = result.data.specData || {}
					this.spec_attr = goods_multi_spec.spec_attr || []
					
					this.limit_num = model.limit_num
					this.status = model.status
					let list = []
					if (this.spec_type == 10) {
						let spec_sku = model.sku[0] || {}
						spec_sku.goods_price = this.goodsPrice
						spec_sku.seckill_price = spec_sku.seckill_price || ''
						spec_sku.seckill_stock = spec_sku.seckill_stock || ''
						
						list = [{
							spec_sku_id: '0',
							spec_name: '单规格',
							rows: [],
							form: spec_sku
						}]
					}
					if (this.spec_type == 20) {
						list = goods_multi_spec.spec_list || []
						list.forEach(item => {
							let spec_sku_id = item.spec_sku_id.split('_') || []
							let spec_name = []
							spec_sku_id.forEach(skuItem => {
								this.spec_attr.forEach(items => {
									items.spec_items.forEach(element => {
										if (element.item_id == skuItem) {
											spec_name.push(element.spec_value)
										}
									})
								})
							})
							item.spec_name = spec_name.join('/')
							item.form.seckill_price = item.form.seckill_price || ''
							item.form.seckill_stock = item.form.seckill_stock || ''
						})
					}
					this.list = list
				});
			},
			// 获取商品信息
			getGoodsDetail() {
				let data = {
					wxapp_goods_id: this.goods_id
				};
				App._get('wxapp.goods/detail', data, result => {
					this.isLoading = false
					let goods = result.data.detail || {}
					this.goodsName = goods.goods.goods_name || ''
					this.goodsPrice = goods.goods.min_price || ''
					this.goodsImg = goods.goods.goods_image || ''
					this.spec_type = goods.goods.spec_type
					let goods_multi_spec = goods.goods.goods_multi_spec || {}
					this.spec_attr = goods_multi_spec.spec_attr || []
					
					let list = []
					if (this.spec_type == 10) {
						let spec_sku = goods.goods.goods_sku
						spec_sku.seckill_price = ''
						spec_sku.seckill_stock = ''
						list = [{
							spec_sku_id: '0',
							spec_name: '单规格',
							rows: [],
							form: spec_sku
						}]
					}
					if (this.spec_type == 20) {
						list = goods_multi_spec.spec_list || []
						list.forEach(item => {
							let spec_sku_id = item.spec_sku_id.split('_') || []
							let spec_name = []
							spec_sku_id.forEach(skuItem => {
								this.spec_attr.forEach(items => {
									items.spec_items.forEach(element => {
										if (element.item_id == skuItem) {
											spec_name.push(element.spec_value)
										}
									})
								})
							})
							item.spec_name = spec_name.join('/')
							item.form.seckill_price = ''
							item.form.seckill_stock = ''
						})
					}
					this.list = list
				});
			},
			onshowChange() {
				this.onshow = !this.onshow
			},
			checkedChange(e) {
				e ? this.status = 1 : this.status = 0
			},
			showAll() {
				this.$refs.popupInputsAll._open((obj) => {
					this.list.forEach(item => {
						if (obj.seckill_price) {
							item.form.seckill_price = obj.seckill_price
						}
						if (obj.seckill_stock) {
							item.form.seckill_stock = obj.seckill_stock
						}
					})
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
