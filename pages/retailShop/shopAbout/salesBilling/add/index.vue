<template>
	<view class="shopInformation">
		<!-- 自定义标题栏 -->
		<navigationBar title="销售开单" isHelpme></navigationBar>
		<view class="cardBox">
			<div class="orderNo line">开单号:{{formData.number}}</div>
			<div class="cardList dis-flex flex-y-center line">
				<div class="label">客户名</div>
				<div class="inputBox">
					<input type="text" :disabled="formData.client_id != ''" v-model="formData.client_name"
						placeholder="请输入客户">
				</div>
				<div class="opt">
					<div class="but" @tap.stop="choose('customer')">选择</div>
				</div>
			</div>
			<div class="cardList dis-flex flex-y-center line">
				<div class="label">手机号</div>
				<div class="inputBox">
					<input type="text" :disabled="formData.client_id != ''" v-model="formData.client_phone"
						placeholder="请输入手机号">
				</div>
			</div>
			<div class="cardList dis-flex flex-y-center">
				<div class="label">仓库</div>
				<div class="inputBox">
					<input type="text" :disabled="formData.warehouse_id != ''" v-model="formData.warehouse_name"
						placeholder="请输入仓库">
				</div>
				<div class="opt">
					<div class="but" @tap.stop="choose('wareHouse')">选择</div>
				</div>
			</div>
		</view>
		<view class="cardBox" @tap.stop="toCheckGoods">
			<div class="cardList dis-flex flex-y-center">
				<div class="label">关联商品</div>
				<div class="inputBox">
				</div>
				<div class="opt">
					选择商品
					<text class="butIcon iconfont2 icon-more1"></text>
				</div>
			</div>
			<!-- 关联商品 -->
			<view class="wrap30 related-pros" v-if="goods.length > 0">
				<view class="related-item dis-flex" v-for="(item, index) in goods" :key="index">
					<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index)"><text
							class="iconfont2 icon-subtract"></text></view>
					<view class="related-pic">
						<image lazy-load :src="item.goods_image" mode="aspectFill"></image>
					</view>
					<view class="related-info">
						<view class="f-28 onelist-hidden">{{item.goods_name}}</view>
						<view class="f-24 col-9 m-top10">
							<block v-for="(spec, indexs) in item.specList" :key="indexs">
								<block v-if="indexs == 0 && spec.goods_sku_name != ''">{{'规格:'}}</block>
								{{spec.goods_sku_name && spec.goods_sku_name != '' ? spec.goods_sku_name + ':' : ''}}<text
									class="app-red">{{spec.goods_num}}</text>;
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cardBox">
			<div class="cardList dis-flex flex-y-center line">
				<div class="dis-flex flex-y-center">
					<div class="label2 col-9">货款金额</div>
					<div class="inputBox inputBox1">
						<input type="digit" v-model="formData.total_price" class="borderInput">
					</div>
				</div>
				<div class="dis-flex flex-y-center">
					<div class="label2 col-9">商品数量</div>
					<div class="inputBox">
						<input type="digit" v-model="formData.total_num" class="borderInput">
					</div>
				</div>
			</div>
			<div class="cardList">
				<div class="title">
					结算方式
				</div>
				<radio-group @change="expireChange">
					<div class="dis-flex flex-y-center flex-wrap">
						<label v-for="(item,index) in expireItems" class="radio-item dis-flex flex-y-center labelBox"
							:key="index">
							<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value"
								:checked="item.value == formData.pay_way"></radio>
							<text class="col-6 f-24">{{item.name}}</text>
							<image :src="imgUrl[item.imgName] ? imgUrl[item.imgName] : item.baseImg" v-if="item.haveImg"
								@tap.stop="showImgBox(item)"></image>
						</label>
					</div>
				</radio-group>
			</div>
		</view>
		<view class="cardBox">
			<div class="cardList dis-flex flex-y-center line">
				<div class="label">销售员</div>
				<div class="inputBox">
					<input type="text" :disabled="formData.store_user_id != ''" v-model="formData.real_name"
						placeholder="请输入销售员">
				</div>
				<div class="opt">
					<div class="but" @tap.stop="choose('salesPerson')">选择</div>
				</div>
			</div>
			<div class="cardList dis-flex flex-y-center flex-x-between line" @tap.stop="checkTime">
				<div class="label">开单时间</div>
				<div class="opt">
					{{formData.sale_time != '' ? formData.sale_time : '选择时间'}}
					<text class="butIcon iconfont2 icon-more1"></text>
				</div>
			</div>
			<div class="cardList dis-flex flex-y-center">
				<div class="label">发货方式</div>
				<radio-group @change="typeChange">
					<div class="dis-flex flex-y-center flex-wrap">
						<label v-for="(item,index) in typeList" class="radio-item dis-flex flex-y-center labelBox"
							:key="index">
							<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value"
								:checked="item.value == formData.delivery_way"></radio>
							<text class="col-6 f-24">{{item.name}}</text>
						</label>
					</div>
				</radio-group>
			</div>
		</view>

		<view class="cardBox">
			<div class="cardList dis-flex flex-y-center">
				<div class="inputBox">
					<input v-model="formData.remark" maxlength="50" placeholder-class="place-holder" type="text"
						placeholder="备注（50字内）">
				</div>
			</div>
		</view>
		<view class="cardBox">
			<div class="cardList">
				<div class="label1">附件<text class="f-24">（最多添加3张图片）</text></div>
				<div style="line-height:1">
					<tui-upload ref="tuiUpload" :limit="3" isShop :videoLimit="0" source="goods" :value="annex"
						@complete="result" @remove="remove"></tui-upload>
				</div>
			</div>
		</view>
		<div class="butBox dis-flex flex-y-center">
			<div class="submit" @tap.stop="submit">
				<text class="iconfont2 icon-jiahao"></text>
				确定
			</div>
		</div>
		<div class="imgBoxShowMask" v-show="imgBoxShow">
			<div class="imgBoxShow">
				<div class="maskTitle">{{imgTitle}}收款码</div>
				<div class="close" @tap.stop="closeDrawer">
					<text class="iconfont2 icon-shanchu1"></text>
				</div>
				<div class="loadImg">
					<image mode="aspectFill"
						:src="nowImgUrl ? nowImgUrl : 'https://pic.kaidanxia.com/2020-09-21/160508aec715558.png'">
					</image>
				</div>
				<div class="imgBut" @tap.stop="imgSubmit">确定</div>
			</div>
		</div>
		<tui-datetime ref="dateTime" :setDateTime="formData.sale_time" @confirm="dateChange" style="z-index:999999">
		</tui-datetime>
		<popup-tips ref="popupTips" content="您还没有上传微信收款码哦！是否去店铺资料页上传?" confirmText="去上传"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';

	export default {
		data() {
			return {
				ispec: false,
				item: {},
				sale_id: '',
				imgTitle: '',
				imgBoxShow: false,
				goods: [],
				imgUrl: {
					alpay_qrcode: '',
					wxpay_qrcode: ''
				},
				nowImgUrl: '',
				formData: {
					number: '',
					total_price: 0,
					total_num: 0,
					sale_time: '',
					pay_way: '1',
					delivery_way: '0',
					client_name: '',
					client_id: '',
					client_phone: '',
					warehouse_id: '',
					warehouse_name: '',
					store_user_id: '',
					real_name: '',
					remark: ''
				},
				baseImages: [],
				typeList: [{
					name: '自提',
					value: '0',
					checked: true
				}, {
					name: '快递',
					value: '1',
					checked: false
				}],
				expireItems: [{
					name: '微信',
					value: '1',
					img: '',
					baseImg: 'https://pic.kaidanxia.com/2020-09-21/160508aec715558.png',
					haveImg: true,
					imgName: 'wxpay_qrcode',
					checked: true
				}, {
					name: '支付宝',
					value: '2',
					img: '',
					baseImg: 'https://pic.kaidanxia.com/2020-09-21/160508aec715558.png',
					haveImg: true,
					imgName: 'alpay_qrcode',
					checked: false
				}, {
					name: '现金',
					value: '3',
					checked: false
				}, {
					name: 'POS机',
					value: '4',
					checked: false
				}, {
					name: '赊账',
					value: '5',
					checked: false
				}],
				annex: []
			}
		},

		components: {
			popupTips,
			guidePage
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			if (options.sale_id) {
				this.sale_id = options.sale_id
				this.getDetail()
			}
			this.getShowData(true)
		},
		onShow() {
			this.getShowData()
			this.getTime()
		},
		methods: {
			getDetail() {
				App._get('store.shop.sale/getSaleDetail', {
					sale_id: this.sale_id
				}, (result) => {
					if (result.code == '1') {
						this.item = result.data || {}
						this.formData = {
							number: this.item.number,
							total_price: this.item.total_price || '',
							total_num: this.item.total_num || '',
							sale_time: this.item.sale_time || '',
							pay_way: this.item.pay_way.value || '',
							delivery_way: this.item.delivery_way.value || '0',
							client_name: this.item.clientor.client_id || '',
							client_id: this.item.clientor.client_id || '',
							client_phone: this.item.clientor.phone || '',
							warehouse_id: this.item.warehouse.warehouse_id || '',
							warehouse_name: this.item.warehouse.name || '',
							store_user_id: this.item.clerkor.store_user_id || '',
							real_name: this.item.clerkor.real_name || '',
							remark: this.item.remark || ''
						}
						this.annex = this.unitImg(this.item.sale_annex)
						this.goods = this.unitGoods(this.item.sale_goods)

						this.imgUrl.alpay_qrcode = this.item.alpay_qrcode
						this.imgUrl.wxpay_qrcode = this.item.wxpay_qrcode
						this.$nextTick(() => {
							if (this.$refs.tuiUpload) {
								this.$refs.tuiUpload.unit()
							}
						})
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			unitImg(list) {
				let baseImages = []
				list.forEach(element => {
					baseImages.push({
						type: element.file_media,
						path: element.file_path,
						wxapp_file_id: element.image_id
					})
				});
				return baseImages
			},
			checkTime() {
				this.$refs.dateTime.show()
			},
			dateChange(e) {
				this.formData.sale_time = e.result
			},
			checkSalesPerson(item) {
				this.formData.store_user_id = item.store_user_id || ''
				this.formData.real_name = item.real_name || ''
			},
			checkCustomer(item) {
				this.formData.client_name = item.name || ''
				this.formData.client_id = item.client_id || ''
				this.formData.client_phone = item.phone || ''
			},
			checkWareHouse(item) {
				this.formData.warehouse_id = item.warehouse_id || ''
				this.formData.warehouse_name = item.name || ''
			},
			choose(type) {
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/salesBilling/' + type + '/index'
				})
			},
			getTime() {
				if (this.sale_id == '') {
					let day = new Date();
					day.setTime(day.getTime());
					let month = (day.getMonth() + 1) + ''
					month = month.length == 1 ? '0' + month : month
					let date = day.getDate() + ''
					date = date.length == 1 ? '0' + date : date
					let hours = day.getHours() + ''; //获取当前小时数(0-23)
					hours = hours.length == 1 ? '0' + hours : hours
					let minutes = day.getMinutes() + ''; //获取当前分钟数(0-59)
					minutes = minutes.length == 1 ? '0' + minutes : minutes
					let today = day.getFullYear() + "-" + month + "-" + date + ' ' + hours + ':' + minutes;
					this.formData.sale_time = today
				}
			},
			closeDrawer() {
				this.imgBoxShow = false
			},
			imgSubmit() {
				this.imgBoxShow = false
			},
			showImgBox(item) {
				let nowImgUrl = this.imgUrl[item.imgName]
				if (nowImgUrl && nowImgUrl != '') {
					this.imgTitle = item.name
					this.nowImgUrl = this.imgUrl[item.imgName]
					this.imgBoxShow = true
				} else {
					this.$refs.popupTips.open(() => {
						uni.navigateTo({
							url: '/pages/retailShop/shopAbout/shopInformation/index'
						})
					})
				}
			},
			toCheckGoods() {
				uni.navigateTo({
					url: '/pages/myGoods/printorder/selectProduct/list'
				})
			},
			// 选择类型赋值
			pickerChange(e) {
				let val = e.target.value
				this.formData.sale_time = val
			},
			//关联商品
			proCheck(data) {
				this.getGoods(data);
			},
			//删除关联商品
			delPro(index) {
				this.goods.splice(index, 1)
				this.computNum()
			},
			unitGoods(list) {
				let newList = []
				list.forEach(item => {
					let isHave = false
					newList.forEach(items => {
						if (item.goods_id == items.goods_id) {
							isHave = true
							let specIsHave = false
							items.specList.forEach(element => {
								if (element.goods_sku_id == item.goods_sku_id) {
									specIsHave = true
									element.goods_num = parseFloat(element.goods_num) + parseFloat(
										item.goods_num)
								}
							})
							if (!specIsHave) {
								items.specList.push({
									spec_sku_id: item.spec_sku_id,
									goods_sku_id: item.goods_sku_id,
									goods_num: item.goods_num,
									goods_sku_name: item.goods_sku_name,
									goods_price: item.goods_price
								})
							}
						}
					})
					if (!isHave) {
						newList.push({
							goods_id: item.goods_id,
							wxapp_goods_id: item.wxapp_goods_id,
							goods_name: item.goods_name,
							goods_short_name: item.goods_short_name,
							goods_image: item.goods_image,
							specList: [{
								spec_sku_id: item.spec_sku_id,
								goods_sku_id: item.goods_sku_id,
								goods_num: item.goods_num,
								goods_sku_name: item.goods_sku_name,
								goods_price: item.goods_price
							}]
						})
					}
				})
				return newList
			},
			// 格式选中相关商品
			getGoods(list) {
				let goods_list = [];
				let isHave = false
				for (let i in list) {
					let goods = {
						goods_id: list[i].goods_id,
						wxapp_goods_id: list[i].wxapp_goods_id,
						goods_name: list[i].goods.goods_name,
						goods_short_name: list[i].goods.goods_short_name,
						goods_image: list[i].goods.goods_image,
						specList: []
					};
					this.goods.forEach(item => {
						if (list[i].goods_id == item.goods_id) {
							isHave = true
							if (list[i].goods.spec_type == 20) {
								let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
								let spec_list = list[i].goods.goods_multi_spec.spec_list;

								for (let i2 in spec_list) {
									if (spec_list[i2].goods_num > 0) {
										let item_spec = {};
										let data = {}
										data.spec_sku_id = spec_list[i2].spec_sku_id;
										data.goods_sku_id = spec_list[i2].goods_sku_id;
										data.goods_num = spec_list[i2].goods_num;

										let specIsHave = false
										item.specList.forEach(element => {
											if (element.goods_sku_id == data.goods_sku_id) {
												specIsHave = true
												element.goods_num = parseFloat(element.goods_num) +
													parseFloat(data.goods_num)
											}
										})
										if (!specIsHave) {
											let arr = spec_list[i2].spec_sku_id.split('_');
											let str = [];
											for (let i3 in arr) {
												for (let k1 in spec_attr) {
													for (let k2 in spec_attr[k1].spec_items) {
														let item = spec_attr[k1].spec_items[k2];
														if (arr[i3] == item.item_id) {
															str.push(item.spec_value)
														}
													}
												}
											}

											data.goods_sku_name = str.join(',');
											data.goods_price = spec_list[i2].form.goods_price;
											item.specList.push(data);
										}
									}
								}
							} else {
								if (list[i].checked_num > 0) {
									let data = JSON.parse(JSON.stringify(goods))
									data.spec_sku_id = list[i].goods.goods_sku.spec_sku_id;
									data.goods_num = list[i].checked_num;
									data.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
									data.goods_sku_name = '';
									data.goods_price = list[i].goods.goods_sku.goods_price;

									let specIsHave = false
									item.specList.forEach(element => {
										if (element.goods_sku_id == data.goods_sku_id) {
											specIsHave = true
											element.goods_num = parseFloat(element.goods_num) + parseFloat(
												data.goods_num)
										}
									})
									if (!specIsHave) {
										item.specList.push(data);
									}

								}
							}
						}
					})
					if (!isHave) {
						if (list[i].goods.spec_type == 20) {
							let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
							let spec_list = list[i].goods.goods_multi_spec.spec_list;

							for (let i2 in spec_list) {
								if (spec_list[i2].goods_num > 0) {
									let item_spec = {};
									let data = {}
									data.spec_sku_id = spec_list[i2].spec_sku_id;
									data.goods_sku_id = spec_list[i2].goods_sku_id;
									data.goods_num = spec_list[i2].goods_num;

									let arr = spec_list[i2].spec_sku_id.split('_');
									let str = [];
									for (let i3 in arr) {
										for (let k1 in spec_attr) {
											for (let k2 in spec_attr[k1].spec_items) {
												let item = spec_attr[k1].spec_items[k2];
												if (arr[i3] == item.item_id) {
													str.push(item.spec_value)
												}
											}
										}
									}

									data.goods_sku_name = str.join(',');
									data.goods_price = spec_list[i2].form.goods_price;

									goods.specList.push(data);
								}
							}
						} else {
							if (list[i].checked_num > 0) {
								let data = JSON.parse(JSON.stringify(goods))
								data.spec_sku_id = list[i].goods.goods_sku.spec_sku_id;
								data.goods_num = list[i].checked_num;
								data.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
								data.goods_sku_name = '';
								data.goods_price = list[i].goods.goods_sku.goods_price;
								goods.specList.push(data);
							}
						}
						goods_list.push(goods);
					}
				}
				this.goods = this.goods.concat(goods_list);
				this.computNum()
			},
			computNum() {
				let checked_num = 0
				let total_price = 0
				this.goods.forEach(item => {
					item.specList.forEach(element => {
						checked_num += element.goods_num
						total_price += parseFloat(element.goods_price) * parseFloat(element.goods_num)
					})
				})
				this.formData.total_price = total_price.toFixed(2)
				this.formData.total_num = checked_num
			},
			submit() {
				let data = JSON.parse(JSON.stringify(this.formData))
				let annex = []
				this.annex.forEach(element => {
					annex.push(element.wxapp_file_id)
				});
				let goods = []
				this.goods.forEach(element => {
					let obj = {
						goods_id: element.goods_id,
						wxapp_goods_id: element.wxapp_goods_id,
						goods_name: element.goods_name,
						goods_short_name: element.goods_short_name,
						goods_image: element.goods_image
					}
					element.specList.forEach(item => {
						let newObj = JSON.parse(JSON.stringify(obj))
						newObj.goods_sku_name = item.goods_sku_name
						newObj.goods_price = item.goods_price
						newObj.goods_num = item.goods_num
						newObj.goods_sku_id = item.goods_sku_id
						newObj.spec_sku_id = item.spec_sku_id
						goods.push(newObj)
					})
				});
				data.annex = annex.join(',')
				data.goods = goods
				let url = 'store.shop.sale/add'
				let obj = {}
				if (this.sale_id != '') {
					url = 'store.shop.sale/edit'
					data.sale_id = this.sale_id
				}
				obj.sale = JSON.stringify(data)
				uni.showLoading()
				App._post_form(url, obj, (result) => {
					if (result.code == '1') {
						this.$api.msg(result.msg)
						wx.navigateBack();
					} else {
						this.$api.msg(result.msg)
					}
				}, () => {
					uni.hideLoading()
				})
			},
			result(e) {
				this.annex = e.imgArr
			},
			remove(e) {
				this.annex = e.imgArr
			},
			expireChange(e) {
				this.formData.pay_way = e.detail.value
			},
			typeChange(e) {
				this.formData.delivery_way = e.detail.value
			},
			// 展示数据
			getShowData(upData) {
				App._get('store.shop.sale/getAddDefault', {}, (result) => {
					if (result.code == '1') {
						if (this.sale_id == '' && upData) {
							this.formData.number = result.data.number
							if (result.data.warehouse) {
								this.formData.warehouse_id = result.data.warehouse.warehouse_id
								this.formData.warehouse_name = result.data.warehouse.name
							}
							if (result.data.clerk) {
								this.formData.store_user_id = result.data.clerk.store_user_id
								this.formData.real_name = result.data.clerk.real_name
							}
						}
						this.imgUrl.alpay_qrcode = result.data.alpay_qrcode
						this.imgUrl.wxpay_qrcode = result.data.wxpay_qrcode
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			materialChange(data) {
				// this.annex = this.annex.concat(data)
				this.annex = data
				this.$nextTick(() => {
					if (this.$refs.tuiUpload) {
						this.$refs.tuiUpload.unit()
					}
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
