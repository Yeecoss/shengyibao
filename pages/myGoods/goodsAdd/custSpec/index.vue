<template>
	<div class="pageBox">
		<!-- <view class="scrollBox"> -->
		<!-- 自定义标题栏 -->
		<navigationBar isHelpme id="top" title="多规格"></navigationBar>
		<scroll-view class="scrollBox" scroll-y :style="'height: ' + scrollHeight + 'px;'">
			<view class="recommendList">
				<view class="listTitle">
					推荐规格
				</view>
				<view class="listBox dis-flex flex-wrap flex-y-center">
					<view class="listItem" v-for="(item, index) in recommendList" :key="index" @tap="historyListChange(item, 'history')">
						{{item.spec_name}}
					</view>
				</view>
			</view>
			<view class="recommendList">
				<view class="listTitle dis-flex">
					<view>
						历史规格
					</view>
					<div class="addSpecTips" @tap.stop="showTip1">
						<text class="iconfont2 icon-juxing"></text>
					</div>
				</view>
				<view class="listBox dis-flex flex-wrap flex-y-center">
					<view class="listItem" v-for="(item, index) in historyList" :key="index" @tap="historyListChange(item, 'history')">
						{{item.spec_name}}
					</view>
				</view>
			</view>
			<div class="pad-box2 specList">
				<div class="listItem" v-for="(item, index) in specListNew" :key="index">
					<div class="label dis-flex">
						<div class="leftTit">
							规格名称
						</div>
						<div class="itemValue">
							<text class="col-3" v-if="item.label && item.label != ''">{{item.label}}</text>
							<text v-else>例如“尺码”</text>
						</div>
					</div>
					<div class="content">
						<div class="spec dis-flex" v-for="(items, indexs) in item.list" :key="indexs">
							<view class="leftTit">
								{{indexs == 0 ? '子规格' : ''}}
							</view>
							<view class="itemValue">
								<text class="col-3" v-if="items.label && items.label != ''">{{items.label}}</text>
								<text v-else>例如“S”</text>
							</view>
							<text class="iconBox iconfont2 icon-close" @tap.stop="delChild(index, indexs)"></text>
						</div>
						<div class="addSpec spec dis-flex flex-y-center flex-x-between">
							<view @tap.stop="addChildSpec(item)">
								<text class="iconfont2 icon-jiahao"></text>子规格
							</view>
						</div>
					</div>
					<div class="delSpecBox" @tap.stop="delSpec(index)">
						<text class="iconfont2 icon-cross-mini"></text>
					</div>
				</div>
				<div class="listItem">
					<div class="content dis-flex flex-y-center flex-x-center pad1">
						<div class="butBox addSpec1" @tap.stop="addSpec">
							<text class="iconfont2 icon-jiahao"></text>
							规格
						</div>
					</div>
				</div>
			</div>
			<view class="tableList" v-if="specListNew.length > 0">
				<view class="tableTitBg">
					<view class="tableTit dis-flex flex-y-center flex-x-between">
						<view>
							{{priceLabel}}
						</view>
						<view class="allSet" @tap="allSet">
							批量设置
						</view>
					</view>
				</view>
				<view class="priceList" v-for="(item, index) in priceList" :key="index">
						<view class="priceTit dis-flex flex-y-center flex-x-between">
							<view>
								规格：<text class="childLabel">{{item.label}}</text>
							</view>
							<view class="dis-flex flex-y-center" @tap="uploadImg(item)">
								<view>
									图片
								</view>
								<view class="itemImg" v-if="item.image_id">
									<image :src="item.image_path" mode="aspectFill"></image>
								</view>
								<view class="addImg" v-else>
									<text class="iconfont2 icon-jiahao"></text>
								</view>
							</view>
						</view>
						<view class="priceContent dis-flex flex-y-center flex-x-between">
							<view class="dis-flex flex-y-center">
								<view>
									零售价
								</view>
								<input type="digit" v-model="item.goods_price" />
							</view>
							<view class="dis-flex flex-y-center">
								<view>
									吊牌价
								</view>
								<input type="digit" v-model="item.line_price" />
							</view>
							<view class="dis-flex flex-y-center">
								<view>
									库存
								</view>
								<input type="digit" v-model="item.stock_num" />
							</view>
							<view class="dis-flex flex-y-center">
								<view>
									重量
								</view>
								<input type="digit" v-model="item.goods_weight" />
							</view>
						</view>
				</view>
			</view>
		</scroll-view>
		<view class="submitBox dis-flex flex-x-center"  :class="ios ? 'submitBox1' : 'submitBox2'">
			<view class="submitBut" @tap="submit">
				确定
			</view>
		</view>
		<!-- </view> -->
		<popup :show="showPopup" @clickmask="clickmask">
			<view class="popup-main">
				<view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
				<view class="poptitle">确认删除所选规格？</view>
				<view class="pop-input">
					规格删除之后将不能恢复
				</view>
				<view class="pop-btn">
					<view @tap="clickmask">取消</view>
					<view @tap="confirm">确认</view>
				</view>
			</view>
		</popup>
		<popup :show="showPopup1" @clickmask="clickmask1">
			<view class="popup-main1">
				<view class="pop-close" @tap.stop="clickmask1"><text class="iconfont2 icon-shanchu1"></text></view>
				<view class="poptitle">提示</view>
				<view class="pop-input">
					1、新增规格分为“多规格同价”和多规格异价 两类，“多规格同价”不可更改“零售价”和“划 线价”，“多规格异价”可选择更改“零售价” 和“划线价”。<br>
					2、可自主添加规格，也可使用模版添加规格 自主添加规格将记录在历史规格内。<br>
					3、规格可编辑可删除，删除后将不能恢复。<br>
				</view>
				<view class="pop-btn">
					<view @tap.stop="clickmask1">我知道了</view>
				</view>
			</view>
		</popup>
		<popup-input :title="inputTitle" :inputType="inputType" :placeholder="placeholder" ref="popupInput" :maxlength="maxlength"></popup-input>
		<popup-inputs :title="inputTitle" :inputType="inputType" :placeholder="placeholder" ref="popupInputs" :maxlength="maxlength"></popup-inputs>
		<popup-inputsAll ref="popupInputsAll"></popup-inputsAll>
		<guidePage ref="guidePage"></guidePage>
	</div>
</template>

<script>
	const App = getApp().globalData;
	import popup from '@/components/popup/index';
	import popupInput from '@/components/popup-input/index';
	import popupInputs from './popup-inputs/index';
	import popupInputsAll from './popup-inputsAll/index';
	import guidePage from '@/components/guide-page';

	export default {
		data() {
			return {
				inputType: 'text',
				inputTitle: '新增规格',
				placeholder: '例如：颜色、尺码',
				maxlength: '-1',
				showPopup: false,
				showPopup1: false,
				next: null,
				scrollHeight: 0,
				specListNew: [],
				priceList: [],
				priceLabel: '',
				checkLabel: '',
				// 历史列表
				historyList: [],
				ios: false,
				// 推荐
				recommendList: []
			};
		},

		components: {
			popup,
			popupInput,
			popupInputs,
			popupInputsAll,
			guidePage
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		created() {
			this.getHistoryList()
		},
		mounted() {
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			if (prevPage) {
				let specGoods = prevPage.$vm.goods_multi_spec || {}
				this.updata(specGoods)
			}
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
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
					// tap高度
				let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
				this.ios = ios
					// tap高度
				let scrollHeight = systemInfo.windowHeight - res[0].height - (ios ? 152 : 100) *rpx; // swiper高度
				this.scrollHeight = scrollHeight
			  });
			},
			allSet() {
				this.$refs.popupInputsAll._open((data, next) => {
					this.priceList.forEach(item => {
						if (data.goods_price && data.goods_price != '') {
							item.goods_price = data.goods_price
						}
						if (data.line_price && data.line_price != '') {
							item.line_price = data.line_price
						}
						if (data.stock_num && data.stock_num != '') {
							item.stock_num = data.stock_num
						}
						if (data.image_id && data.image_id != '') {
							item.image_id = data.image_id
						}
						if (data.image_path && data.image_path != '') {
							item.image_path = data.image_path
						}
						if (data.goods_weight && data.goods_weight != '') {
							item.goods_weight = data.goods_weight || ''
						}
					})
				})
			},
			uploadImg(item) {
				uni.chooseImage({
				  count: 1,
				  // #ifdef H5 || MP
				  sizeType: ['compressed', 'original'],
				  // #endif
				  // #ifdef APP-PLUS
				  sizeType: ['compressed', 'original'],
									// #endif
				  sourceType: ['album', 'camera'],
				  success: res => {
				    // #ifdef H5 || MP
				    if (res.tempFiles[0].size <= 2048000) {
				    // #endif
				      const tempFilePaths = res.tempFilePaths[0];
					  App.uploadFile({
					    filePath: tempFilePaths,
							success: (res) => {
								if (res.code === 1) {
									item.image_path = res.data.file_path || ''
									item.image_id = res.data.wxapp_file_id || ''
								}
							}
						});
				    // #ifdef H5 || MP
				    } else {
				      App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
				    }
				    // #endif
				  }
				});
			},
			getHistoryList() {
				App._get('shop.wxapp.goods/add', {}, (result) => {
					if (result.code == '1') {
						this.historyList = result.data.specList.common || []
						this.recommendList = result.data.specList.recommend || []
					} else {
						this.historyList = []
						this.recommendList = []
					}
				})
			},
			
			updata(data) {
				let specListNew = []
				let priceList = []
				if (data.spec_attr) {
					data.spec_attr.forEach(item => {
						specListNew.push({
							spec_id: item.group_id,
							label: item.group_name,
							list: this.unitSpecItems(item.spec_items)
						})
					})
				}
				if (data.spec_list) {
					data.spec_list.forEach(item => {
						let labels = []
						specListNew.forEach(items => {
							items.list.forEach(element => {
								if (item.spec_sku_id.indexOf(element.spec_value_id) != '-1') {
									labels.push(element.label)
								}
							})
						})
						priceList.push({
							item_id: item.spec_sku_id,
							label: labels.join('/'),
							goods_price: item.form.goods_price,
							line_price: item.form.line_price,
							stock_num: item.form.stock_num,
							goods_weight: item.form.goods_weight || '',
							goods_code: item.form.goods_code || '',
							image_id: item.form.image_id || '',
							image_path: item.form.image_path || '',
							goods_no: item.form.goods_no || '',
						})
					})
				}
				this.specListNew = specListNew
				this.priceList = priceList
			},
			unitSpecItems(list) {
				let newList = []
				list.forEach((item, index) => {
					let obj = {
						label: item.spec_value,
						spec_value_id: item.item_id
					}
					newList.push(obj)
				})
				return newList
			},
			submit() {
				let specListNew = []
				this.specListNew.forEach(item => {
					let list = []
					item.list.forEach(items => {
						list.push({
							item_id: items.spec_value_id,
							spec_value: items.label
						})
					})
					let data = {
						group_id: item.spec_id,
						group_name: item.label,
						spec_items: list
					}
					specListNew.push(data)
				})
				let priceList = []
				let isHave = false
				this.priceList.forEach((item, index) => {
					let rows = []
					let item_id = item.item_id.split('_')
					item_id.forEach((element, indexs) => {
						specListNew.forEach(items => {
							items.spec_items.forEach(itemObj => {
								if (element == itemObj.item_id) {
									rows.push({
										rowspan: indexs,
										item_id: element,
										spec_value: itemObj.spec_value
									})
								}
							})
						})
					})
					let data = {
						spec_sku_id: item.item_id,
						rows: rows,
						form: {
							stock_num: item.stock_num,
							line_price: item.line_price,
							goods_price: item.goods_price,
							goods_weight: item.goods_weight || '',
							goods_code: item.goods_code || '',
							image_id: item.image_id || '',
							image_path: item.image_path || '',
							goods_no: item.goods_no || '',
						}
					}
					priceList.push(data)
					if (!item.goods_price || item.goods_price == '') {
						isHave = true
					}
				})
				if (isHave) {
					this.$api.msg('零售价不能为空哟')
					return false
				}
				let subObj = {
					spec_attr: specListNew,
					spec_list: priceList
				}
				// console.log(subObj)
				
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if (prevPage.$vm.getSpec) {
					prevPage.$vm.getSpec(subObj)
				}
				uni.navigateBack();
			},
			// 历史选择
			historyListChange(data, type) {
				let isHave = false
				this.specListNew.forEach(items => {
					if (items.label == data.spec_name) {
						isHave = true
					}
				})
				if (isHave) {
					App.showError('与其他规格重复，请重新添加！')
					return false
				}

				let list = []
				data.spec_value ? data.spec_value.forEach((items, index) => {
					let obj = {
						label: items.spec_value,
						spec_value_id: items.spec_value_id
					}
					list.push(obj)
				}) : ''
				let obj = {
					spec_id: data.spec_id,
					label: data.spec_name,
					list: list
				}
				this.specListNew.push(obj)
				// console.log(this.specListNew)
				this.priceList = this.uniPrice()
				// console.log(this.priceList)
			},
			checkIsUse() {
				if (this.checkLabel != '') {
					this.$api.msg('多规格同价不可修改单规格价格！')
				}
			},
			// 处理价格列表
			uniPrice() {
				let newList = []
				let array = []
				let priceLabel = []
				this.specListNew.forEach(item => {
					let itemList = []
					priceLabel.push(item.label)
					item.list.forEach(items => {
						itemList.push(items)
					})
					array.push(itemList)
				})
				this.priceLabel = priceLabel.join('/')
				if (array.length < 2) {
					let newArr = []
					array.forEach(item => {
						item.forEach(items => {
							let list = []
							list.push(items)
							newArr.push(list)
						})

					})
					newList = newArr || [];
				} else {
					newList = [].reduce.call(array, (col, set) => {
						var res = [];
						col.forEach((c) => {
							set.forEach((s) => {
								var t = [].concat(Array.isArray(c) ? c : [c]);
								t.push(s);
								res.push(t);
							})
						});
						return res;
					});
				}
				// console.log(newList)
				let arr = []
				newList.forEach(item => {
					let item_ids = []
					let labels = []
					item.forEach(items => {
						item_ids.push(items.spec_value_id)
						labels.push(items.label)
					})
					arr.push({
					  item_id: item_ids.join('_'),
					  label: labels.join('/'),
					  image_id: '',
					  image_path: '',
					  goods_price: '',
					  line_price: '',
					  stock_num: '',
					  goods_weight: ''
					})
				})
				arr.forEach(item => {
					this.priceList.forEach(items => {
						if (item.item_id == items.item_id) {
							item.goods_price = items.goods_price
							item.line_price = items.line_price
							item.stock_num = items.stock_num
							item.goods_weight = items.goods_weight || ''
							item.goods_code = items.goods_code || ''
							item.image_id = items.image_id || ''
							item.image_path = items.image_path || ''
							
							item.goods_no = items.goods_no || ''
						}
					})
				})
				return arr
			},
			// 新增规格
			addSpec() {
				this.inputTitle = '新增规格'
				this.placeholder = '例如：颜色、尺码'
				this.inputType = 'text'
				this.maxlength = '-1'
				this.$refs.popupInput._open('', (val) => {
					if (val && val != 0) {
						let isHave = false
						this.specListNew.forEach(items => {
							if (items.label == val) {
								isHave = true
							}
						})
						if (isHave) {
							App.showError('与其他规格重复，请重新添加！')
							return false
						}
						App._post_form('shop.goods.spec/addSpec', {
							spec_name: val
						}, (result) => {
							this.specListNew.push({
								label: val,
								spec_id: result.data.spec_id,
								list: []
							})
							this.priceList = this.uniPrice()
						})
					}
				})
			},
			// 新增规格
			addChildSpec(item) {
				this.inputTitle = '新增子规格'
				this.placeholder = '例如：白色、黑色、S、M'
				this.inputType = 'text'
				this.maxlength = '-1'
				this.$refs.popupInputs._open('', (val, next) => {
					if (val && val != '') {
						let isHave = false
						item.list.forEach(items => {
							if (items.label == val) {
								isHave = true
							}
						})
						if (isHave) {
							App.showError('与其他子规格重复，请重新添加！')
							return false
						}
						App._post_form('shop.goods.spec/addSpecValue', {
							spec_value: val,
							spec_id: item.spec_id
						}, (result) => {
							item.list.push({
								label: val,
								spec_value_id: result.data.spec_value_id
							})
							this.priceList = this.uniPrice()
							next()
						})
					}
				})
			},
			// 打开提示框
			showTip(next) {
				this.showPopup = true
			},
			// 打开提示框
			showTip1(next) {
				this.showPopup1 = true
			},
			// 关闭提示框
			clickmask() {
				this.showPopup = false
			},
			clickmask1() {
				this.showPopup1 = false
			},
			confirm() {
				this.next()
				this.next = null
				this.clickmask()
			},
			// 删除规格
			delSpec(index) {
				this.next = () => {
					this.specListNew[index].list.forEach(item => {
						if (item.label == this.checkLabel) {
							this.checkLabel = ''
						}
					})
					this.specListNew.splice(index, 1)
					this.priceList = this.uniPrice()
				}
				this.showTip()
			},
			// 删除子规格
			delChild(index, childIndex) {
				if (this.specListNew[index].list[childIndex].label == this.checkLabel) {
					this.checkLabel = ''
				}
				this.specListNew[index].list.splice(childIndex, 1)
				this.priceList = this.uniPrice()
			}
		}
	};
</script>
<style lang="scss">
	@import "../index.scss";
	@import "./index.scss";
</style>
