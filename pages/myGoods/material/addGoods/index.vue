<template>
	<div @tap.stop>
		<div style="position:relative;z-index:10">
			<popup :show="isShow" type="bottom" :closeOnClickOverlay="false"><!-- @clickmask="close"-->
				<view class="popup-main" v-if="isShow">
					
					<!-- 主体信息 -->
					<view class="trade-main pad_lr30">
						<view class="drawer-title f-30 col-3 m-b-20 t-c">
							<view class="fl col-9" @tap.stop="putAway">收起</view>
							新建商品
							<view class="pop-close fr" @tap="_close"><text class="iconfont2 icon-shanchu1 f-38 col-9"></text></view>
						</view>
						<div class="fieldBox">
							<div class="pad-box" style="padding-left:0;padding-right:0;" v-if="baseImages.length > 0">
								<tui-upload ref="tuiUpload" :limit="9" :videoLimit="1" :value="baseImages" @complete="result" @remove="remove" forbidAdd showCustAdd @custAdd="putAway" isShop ></tui-upload>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="toOtherPage('category_id')">
									<div class="label">商品分类</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
										</div>
										<div class="tips dis-flex flex-y-center tipsPlNone flex-x-between">
											<div class="onelist-hidden">
												<text class="col-3">{{formData.category_name}}</text>
											</div>
											<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('goods_name')">
									<div class="label">商品名称</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text v-if="formData.goods_name == ''">必填</text>
											<text v-else class="col-3">{{formData.goods_name}}</text>
										</div>
										<div class="tips">{{formData.goods_name.length}}/60
											<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('goods_short_name')">
									<div class="label">商品简称</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text v-if="formData.goods_short_name == ''">必填</text>
											<text v-else class="col-3">{{formData.goods_short_name}}</text>
										</div>
										<div class="tips">
											<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('selling_point')">
									<div class="label">商品卖点</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden col-3">{{formData.selling_point}}</div>
										<div class="tips">{{formData.selling_point.length}}/500
											<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('sales_initial')">
									<div class="label">初始销量</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden"></div>
										<div class="tips">
											<text v-if="formData.sales_initial == ''">默认100内随机</text>
											<text v-else class="col-3">{{formData.sales_initial}}</text>
										</div>
									</div>
								</div>
							</div>
							<div class="priceItem">
								<div class="pad-box1">
									<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('goods_price')">
										<div class="label">零售价</div>
										<div class="contentBox dis-flex flex-y-center">
											<div class="content onelist-hidden">
												<text v-if="formData.goods_price == ''">必填</text>
												<text v-else class="col-3">{{formData.goods_price}}</text>
											</div>
											<div class="tips1">
												元
											</div>
										</div>
									</div>
								</div>
								<div class="pad-box1">
									<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('line_price')">
										<div class="label">划线价</div>
										<div class="contentBox dis-flex flex-y-center">
											<div class="content onelist-hidden">
												<text class="col-3">{{formData.line_price}}</text>
											</div>
											<div class="tips1">
												元
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('stock_num')">
									<div class="label">库存</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text v-if="formData.stock_num == ''">必填</text>
											<text v-else class="col-3">{{formData.stock_num}}</text>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center" @tap.stop="openItem('goods_weight')">
									<div class="label">重量</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text v-if="formData.goods_weight == ''">非必填，默认0.1</text>
											<text v-else class="col-3">{{formData.goods_weight}}</text>
										</div>
										<div class="tips1">
											kg
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box2 fieldItem">
								<div class="border_b">
									<div class="pad-box3">
										<div class="dis-flex flex-y-center">
											<div class="label">运费模版</div>
											<picker class="contentBox" @change="deliveryChange($event)" :value="formData.delivery_name" :range="deliveryList">
												<div class="dis-flex flex-y-center">
													<div class="content onelist-hidden">
														<text v-if="formData.delivery_name == ''">必填</text>
														<text v-else class="col-3">{{formData.delivery_name}}</text>
													</div>
													<div class="tips">
														<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
													</div>
												</div>
											</picker>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box fieldItem">
								<div class="dis-flex flex-y-center">
									<div class="label">商品详情</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content">
											(您选择的商品图片将自动同步到商品详情中，如果 您想对新建的商品进行编辑可以到店铺-商品列表中）
										</div>
									</div>
								</div>
							</div>
						</div>
						<view class="drawer-foot-btn f-32 col-f" @tap.stop="toAdd">确定</view>
					</view>
				</view>
			</popup>
		</div>
		<div style="position:relative;z-index:11">
			<popup-input :title="title" :inputType="inputType" :maxlength="maxlength" ref="popupInput" :placeholder="placeholder"></popup-input>
		</div>
	</div>
</template>

<script>
	const App = getApp().globalData;
	import popup from "@/components/pop-manager/index";
	import popupInput from '@/components/popup-input/index';
	let initForm = {
		// 标签
		tag: '',
		// 规格
		spec_type: 10,
		spec_multi_type: '',
		// 图片列表
		images: [],
		// 商品名称
		goods_name: '',
		// 商品简称
		goods_short_name: '',
		// 商品卖点
		selling_point: '',
		// 零售价
		goods_price: '',
		// 划线价
		line_price: '',
		// 库存
		stock_num: 100,
		// 重量
		goods_weight: '',
		// 多规格同价继承上面价格
		// 商品详情
		content: '',
		// 模板id
		delivery_id: '',
		delivery_name: '',
		// 商品状态
		goods_status: 10,
		// 初始销量
		sales_initial: '',
		// 商品排序
		goods_sort: 0,
		// 渠道设置
		open_dealer: '',
		// 商品分类
		category_id: '',
		// 分类名称
		category_name: '',
		// 下单减库存
		deduct_stock_type: '10'
	}
	export default {
		components: {
			popup,
			popupInput
		},
		data() {
			return {
				isShow: false,
				title: '',
				placeholder: '',
				maxlength: '-1',
				inputType: '',
				baseImages: [],
				formData: JSON.parse(JSON.stringify(initForm)),
				deliveryList: [],
				deliveryIdList: [],
				// 字段
				field: {
					tag: {
						type: 'text',
						name: '添加标签',
						fieldName: 'tag',
						maxlength: '12',
						showlength: true,
						placeholder: '#请输入标签'
					},
					// 商品名称
					goods_name: {
						type: 'largeText',
						name: '商品名称',
						fieldName: 'goods_name',
						maxlength: '60'
					},
					// 商品简称
					goods_short_name: {
						type: 'text',
						name: '商品简称',
						fieldName: 'goods_short_name',
						maxlength: '20'
					},
					// 商品分类
					category_id: {
						type: 'link',
						name: '商品分类',
						fieldName: 'category_id',
						linkUrl: '/pages/myGoods/category/list/index',
						maxlength: '-1'
					},
					// 商品分类
					content: {
						type: 'link',
						name: '商品详情',
						fieldName: 'content',
						linkUrl: '/pages/robinEditor/robinEditor',
						// linkUrl: '/pages/user/canvas/index',
						maxlength: '-1',
						source: 'goods'
					},
					// 商品卖点
					selling_point: {
						type: 'largeText',
						name: '商品卖点',
						fieldName: 'selling_point',
						maxlength: 500
					},
					// 零售价
					goods_price: {
						type: 'text',
						name: '零售价',
						fieldName: 'goods_price',
						maxlength: '9'
					},
					// 划线价
					line_price: {
						type: 'text',
						name: '划线价',
						fieldName: 'line_price',
						maxlength: '9'
					},
					// 库存
					stock_num: {
						type: 'text',
						name: '库存',
						fieldName: 'stock_num',
						maxlength: '10'
					},
					// 重量
					goods_weight: {
						type: 'text',
						name: '重量',
						fieldName: 'goods_weight',
						maxlength: '10'
					},
					sales_initial: {
						type: 'text',
						name: '初始销量',
						fieldName: 'sales_initial',
						maxlength: '10'
					},
					goods_sort: {
						type: 'text',
						name: '商品排序',
						fieldName: 'goods_sort',
						maxlength: '10'
					},
				},
			}
		},
		methods: {
			//展开正在新建的商品
			_open(obj) {
				this.isShow = !this.isShow
				this.baseImages = []
				this.formData.images = []
				setTimeout(() => {
					if (obj) {
						this.baseImages = obj.data || []
						this.baseImages.forEach(element => {
							this.formData.images.push(element.wxapp_file_id)
						});
					}
				}, 500)
				this.sameImg()
			},
			// 分类选择返回
			checkCategory(obj) {
				this.formData.category_id = obj.category_id
				this.formData.category_name = obj.name
			},
			getDelivery() {
				App._get('shop.delivery/index', {}, (result) => {
					let deliveryBaseList = result.data.list.data || []

					let deliveryList = []
					let deliveryIdList = []

					deliveryBaseList.forEach(item => {
						deliveryList.push(item.name)
						deliveryIdList.push(item.delivery_id)
						if (this.formData.delivery_id === '') {
							if (item.is_default) {
								this.formData.delivery_id = item.delivery_id
								this.formData.delivery_name = item.name
							}
						} else {
							if (item.delivery_id == this.formData.delivery_id) {
								this.formData.delivery_name = item.name
							}
						}
					})
					this.deliveryList = deliveryList
					this.deliveryIdList = deliveryIdList
				})
			},
			// 打开/关闭
			_toDrawer(obj) {
				this.isShow = !this.isShow
				// this.baseImages = images || []
				this.formData = JSON.parse(JSON.stringify(initForm))
				this.baseImages = []
				this.formData.images = []
				setTimeout(() => {
					// console.log(obj)
					if (obj) {
						this.baseImages = obj.data || []
						this.formData.goods_name = obj.group_name
						this.formData.goods_short_name = obj.group_name
						this.baseImages.forEach(element => {
							this.formData.images.push(element.wxapp_file_id)
						});
					}
					this.sameImg()
				}, 500);
				this.getDelivery()
			},
			sameImg() {
				if (this.baseImages.length > 0) {
					let text = '';
					let brDom = '<p><br/></p>'
					this.baseImages.forEach(element => {
						if (element.type == 'video') {
							text += '<p><video style="min-width:100%;" src="' + element.path + '" controls="controls"></video></p>';
						} else {
							text += '<p><img style="min-width:100%;" src="' + element.path + '"></img></p>';
						}
					})
					text = text + brDom
					this.formData.content = text
				} else {
					this.formData.content = ''
				}
			},
			// 图片上传回调
			result: function(e) {
				// console.log(e)
				let arr = []
				let baseImages = []
				e.imgArr.forEach(element => {
					arr.push(element.wxapp_file_id)
					baseImages.push({
					  type: element.type,
					  path: element.path
					})
				});
				this.formData.images = arr;
				this.baseImages = baseImages;
				this.$emit('complete',this.formData.images)
			},
			remove(e) {
				//移除图片
				let index = e.index;
				this.$emit('remove',this.formData.images[index]);
				this.formData.images.splice(index, 1);
				this.baseImages.splice(index, 1);
				this.sameImg()
			},
			toAdd() {
				let goods = this.getSubData()
				if (!goods) {
					return
				}
				// console.log(goods)
				let url = ''
				let obj = {
					goods: goods,
					goods_status: '10'
				}
				if (this.goods_id && this.goods_id != '') {
					url = 'shop.wxapp.goods/edit'
					obj.wxapp_goods_id = this.goods_id
				} else {
					url = 'shop.wxapp.goods/add'
				}
				uni.showLoading()
				App._post_form(url, obj, (result) => {
					this.isSub = true
					this.close()
					this.$emit('toAdd',result)
					App.showSuccess(result.msg);
				}, false, () => {
					uni.hideLoading()
				})
			},
			getSubData() {
				let goods = {
					goods_name: this.formData.goods_name,
					goods_short_name: this.formData.goods_short_name,
					images: this.formData.images,
					selling_point: this.formData.selling_point,
					spec_type: this.formData.spec_type,
					spec_multi_type: this.formData.spec_multi_type || '',
					deduct_stock_type: this.formData.deduct_stock_type,
					delivery_id: this.formData.delivery_id,
					sales_initial: this.formData.sales_initial,
					goods_sort: this.formData.goods_sort,
					content: this.formData.content,
					category_id: this.formData.category_id,
					open_dealer: this.formData.open_dealer,
					sku: {
						goods_price: this.formData.goods_price,
						line_price: this.formData.line_price,
						stock_num: this.formData.stock_num,
						goods_weight: this.formData.goods_weight || '0.1'
					},
					spec_many: {}
				}
				if (!this.checkSubOk(goods)) {
					return false
				}
				return JSON.stringify(goods)
			},
			checkSubOk(goods) {
				let fieldNames = [{
					name: '商品图片',
					field: 'images'
				}, {
					name: '商品名称',
					field: 'goods_name'
				}, {
					name: '商品简称',
					field: 'goods_short_name'
				}, {
					name: '商品规格',
					field: 'spec_type'
				}, {
					name: '库存计算方式',
					field: 'deduct_stock_type'
				}, {
					name: '商品分类',
					field: 'category_id'
				}, {
					name: '运费模板',
					field: 'delivery_id'
				}]
				let skuFieldNames = [{
					name: '零售价',
					field: 'goods_price'
				}, {
					name: '库存',
					field: 'stock_num'
				}]
				let isSub = true
				for (let index = 0; index < fieldNames.length; index++) {
					const item = fieldNames[index];
					let str = goods[item.field]
					// console.log(str)
					if (item.field == 'images') {
						str = JSON.stringify(str)
					}
					if (str === '' || str === '[]') {
						isSub = false
						this.tui.toast(item.name + '不能为空哟')
						return false
					}
				}
				if (!isSub) {
					return false
				}
				if (goods.spec_type == 10) {
					for (let index = 0; index < skuFieldNames.length; index++) {
						const item = skuFieldNames[index];
						let str = goods.sku[item.field]
						if (str === '') {
							isSub = false
							this.tui.toast(item.name + '不能为空哟')
							return false
						}
					}
				}
				return isSub
			},
			openItem(fieldName) {
				let field = this.field[fieldName]
				this.inputType = field.type
				this.title = field.name
				this.maxlength = field.maxlength || '-1'
				this.$refs.popupInput._open(this.formData[fieldName], (val) => {
					this.formData[fieldName] = val
				})
			},
			toOtherPage(fieldName) {
				let field = this.field[fieldName]
				let val = this.formData[fieldName]
				if (fieldName == 'content') {
					val = val.replace(/%/g, '%25')
					val = encodeURIComponent(val)
				}
				let dataFieldName = '?fieldName=' + field.fieldName + '&val=' + val
				if (fieldName == 'category_id') {
					dataFieldName += '&source=goods'
				}
				let linkUrl = field.linkUrl + dataFieldName
				uni.navigateTo({
					url: linkUrl
				});
			},
			// 选择模板触发
			deliveryChange(e) {
				this.formData.delivery_id = this.deliveryIdList[e.detail.value]
				this.formData.delivery_name = this.deliveryList[e.detail.value]
			},
			//收起
			putAway() {
				this._open()
				this.$emit('putAway')
			},
			// 关闭
			close() {
				this.isShow = false
			},
			_close() {
				this.$emit('close')
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
