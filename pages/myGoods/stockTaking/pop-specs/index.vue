<template>
	<popup :show="ifshow" type="bottom" @clickmask="close">
		<view class="popup-main" v-if="ifshow" catchtouchmove='true'>
			<view class="pop-close" @tap="close"><text class="iconfont2 icon-shanchu1"></text></view>
			<view class="wrap30 prinit-main">
				<!-- 商品内容 -->
				<view class="proinfo dis-flex">
					<view class="proinfo-pic bgf">
						<image lazy-load :src="goods.goods.goods_image" mode="aspectFill"></image>
					</view>
					<view class="proinfo-info flex-box">
						<view class="onelist-hidden f-28 col-3">{{goods.goods.goods_name}}</view>
						<!-- <view class="f-24 col-6 m-top10">货号：{{goods.goods_sku.goods_no}}</view> -->
						<view class="f-24 col-6 m-top30">库存：{{goods.goods.stock_num}}</view>
					</view>
				</view>
				<!-- 规格列表 -->
				<view class="spects-wrap" v-if="goods.goods.spec_type == 20">
					<scroll-view scroll-y="true" class="prinit-spects">
						<view class="spect-list" v-for="(item,index) in goodsMultiSpec.spec_attr" :key="item.group_id">
							<view class="spect-name">{{item.group_name}}</view>

							<block v-for="(v,k) in item.spec_items" :key="v.item_id">
								<view v-if="index==(goodsMultiSpec.spec_attr.length-1)" class="spect-item2 dis-flex flex-y-center">
									<view class="spect-item-l dis-flex flex-y-center">
										<text class="stokeNum col-9 m-r-30">库存：{{v.stock_num}}</text>
										<view class="spec_value col-6">{{v.spec_value}}</view>
									</view>
									<view style="height: 48rpx;" class="m-r-20">
										<template v-if="listNumShow">
											<!-- <tui-numberbox v-if="noMax" :min="0" :isDisabled="false" :value="v.goods_num" @change="change($event,k)"></tui-numberbox>
											<tui-numberbox v-else :min="0" :max="v.stock_num" :isDisabled="false" :value="v.goods_num" @change="change($event,k)"></tui-numberbox> -->
											<tui-numberbox :min="-999" :isDisabled="false" :value="v.goods_num" @change="change($event,k)"></tui-numberbox>
										</template>
									</view>
								</view>
								
								<view v-else @tap="onSwitchSpec(index,k)" :class="'spect-item '+ (v.checked==true ? 'on': '')">
									<view class="spec_value">{{v.spec_value}}</view>
									<view class="spect-item-num" v-show="index==0 && v.goods_num>0">{{v.goods_num}}</view>
								</view>
							</block>

						</view>
					</scroll-view>
				</view>
				<view v-else class="numBox m-r-20">
						<tui-numberbox :min="-999" :isDisabled="false" :value="goods_num" @change="goodsNumChange($event)"></tui-numberbox>
					<!-- <template v-if="noMax">
						<tui-numberbox :min="0" :isDisabled="false" :value="goods_num" @change="goodsNumChange($event)"></tui-numberbox>
					</template>
					<template v-else>
						<tui-numberbox :min="0" :max="parseInt(goods.goods.goods_sku.stock_num)" :isDisabled="false" :value="goods_num" @change="goodsNumChange($event)"></tui-numberbox>
					</template> -->
				</view>
			</view>
			<view class="wrap30 pop-btn">
				<view>共{{allNum}}(件)</view>
				<view class="confirm" @tap="confirm">确认</view>
			</view>
		</view>
	</popup>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	let goodsSpecArr = [];// 记录规格的数组
	
	export default {
		components: {
			popup,
		},
		props: {
			// data: {
			// 	type: Object,
			// },
		},
		data() {
			return {
				ifshow: false,
				goods: null,
				goods_num: 0,
				indexId: '',
				listNumShow: true,
				goodsMultiSpec:{},//规格列表
				noMax: false,
			}
		},
		computed: {
			allNum() {
				let num = 0
				if (this.goods && this.goods.goods.spec_type == 20) {
					if (this.goodsMultiSpec.spec_list) {
						this.goodsMultiSpec.spec_list.forEach(item => {
							num += Math.abs(item.goods_num)
						})
					}
				} else {
					num = this.goods_num
				}
				return num;
			}
		},
		methods: {
			_open(data) {
				this.indexId = data.index;
				this.noMax = data.noMax? data.noMax: false;
				this.goods_num = 0;
				let obj = JSON.parse(JSON.stringify(data.goods));
				this.goods = obj;
				if (obj.goods.spec_type == 20) {
					this.goodsMultiSpec = this.initManySpecDataFun(obj.goods.goods_multi_spec);
					if (this.goodsMultiSpec.spec_attr.length <= 1) {
						this.updateSpecGoodsFun();
					} else {
						this.unitCheck()
					}
				} else {
					this.goodsMultiSpec = {}
					this.goods_num = obj.checked_num||0;
				}
				this.ifshow = true;
			},
			goodsNumChange(e) {
				this.goods_num = parseInt(e.value)
			},
			close() {
				this.ifshow = false;
			},
			//点击确认
			confirm() {
				let data = {
					spec_type: this.goods.goods.spec_type,
					goods_num: this.goods.goods.spec_type == 20 ? this.allNum : this.goods_num,
				}
				if (this.goods.goods.spec_type == 20) {
					data.goodsMultiSpec = JSON.parse(JSON.stringify(this.goodsMultiSpec))
				}
				this.$emit('confirm', data, this.indexId);
				this.ifshow = false;
			},
			unitCheck() {
				let data = this.goodsMultiSpec
				for (let i in data.spec_attr) {
					if(i<(data.spec_attr.length-1)){
						for (let j in data.spec_attr[i].spec_items) {
							if (j < 1) {
								this.onSwitchSpec(i, j)
							}
						}
					}
				}
			},
			// 初始化商品多规格
			initManySpecDataFun(datas) {
				let data = JSON.parse(JSON.stringify(datas))
				goodsSpecArr = [];
				
				for (let i in data.spec_attr) {
					if(i<(data.spec_attr.length-1)){
						for (let j in data.spec_attr[i].spec_items) {
							if (j < 1) {
								data.spec_attr[i].spec_items[0].checked = true;
								goodsSpecArr[i] = data.spec_attr[i].spec_items[j].item_id;
							}else{
								data.spec_attr[i].spec_items[j].checked = false;
							}
							if (!data.spec_attr[i].spec_items[j].goods_num) {
								data.spec_attr[i].spec_items[j].goods_num = 0;
							}
						}
					}else{
						for (let j in data.spec_attr[i].spec_items) {
							if (!data.spec_attr[i].spec_items[j].goods_num) {
								data.spec_attr[i].spec_items[j].goods_num = 0;
							}
							
							if (!data.spec_attr[i].spec_items[j].stock_num) {
								data.spec_attr[i].spec_items[j].stock_num = 0;
							}
						}
					}
				}
				data.spec_list.forEach(item => {
					if (!item.goods_num) {
						item.goods_num = 0
					}
				})
				return data;
			},
			//点击切换不同规格
			onSwitchSpec(index, k) {
				this.listNumShow = false
				let that = this,
					goodsMultiSpec = that.goodsMultiSpec;

				for (let i in goodsMultiSpec.spec_attr) {
					for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
						if (index == i) {
							goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;

							if (k == j) {
								goodsMultiSpec.spec_attr[i].spec_items[k].checked = true;
								goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[k].item_id;
							}
						}
					}
				}
				that.goodsMultiSpec = goodsMultiSpec; // 更新商品规格信息
				that.updateSpecGoodsFun();
				this.$nextTick(() => {
					this.listNumShow = true
				})
			},

			//更新商品规格信息
			updateSpecGoodsFun() {
			  let _this = this,
				  specSkuId = goodsSpecArr.join('_'); // 查找skuItem
			  let spec_list = _this.goodsMultiSpec.spec_list;
			  this.goodsMultiSpec.spec_attr[this.goodsMultiSpec.spec_attr.length - 1].spec_items.forEach((item) => {
					let str = specSkuId
					if (str != '') {
						str += '_'
					}
					str += item.item_id
						let skuItem = spec_list.find(val => {
						return val.spec_sku_id == str;
					}); // 记录goods_sku_id
					// 更新商品价格、划线价、库存
					if (typeof skuItem === 'object') {
						item.stock_num = parseInt(skuItem.form.stock_num || 0)
						item.goods_num = skuItem.goods_num
					}
			  })
			},

			change: function(e,k) {
				let attr = this.goodsMultiSpec.spec_attr[this.goodsMultiSpec.spec_attr.length - 1].spec_items[k]
				attr.goods_num = parseInt(e.value);
				let specSkuId = goodsSpecArr.join('_'); // 查找skuItem

				let spec_list = this.goodsMultiSpec.spec_list;
				let str = specSkuId
				if (str != '') {
					str += '_'
				}
				str += attr.item_id
				let skuItem = spec_list.find(val => {
					return val.spec_sku_id == str;
				});
				// 记录goods_sku_id
				// 更新商品价格、划线价、库存
				if (typeof skuItem === 'object') {
					skuItem.goods_num = parseInt(e.value)
				}
				this.goodsMultiSpec.spec_attr.forEach(item => {
					item.spec_items.forEach(element => {
						let num = 0
						spec_list.forEach(items => {
							if (items.spec_sku_id.indexOf(element.item_id) != -1) {
								num += Math.abs(items.goods_num)
							}
						})
						element.goods_num = num
					})
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.popup-main {
		position: relative;
		width: 750rpx;
		border-radius: 16rpx 16rpx 0 0;
		background: #fff;
	}

	.pop-close {
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		color: #999;
	}

	// 按钮
	.pop-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		background-color: #F7F7F7;

		view {
			color: $red;
			font-size: 32rpx;
			letter-spacing: 0.05em;
			overflow: hidden;
		}

		.confirm {
			width: 200rpx;
			border-radius: 50rpx;
			font-size: 28rpx;
			line-height: 64rpx;
			text-align: center;
			border: 1rpx solid $red;
			box-sizing: border-box;
		}
	}

	// 商品内容
	.proinfo-pic {
		width: 160rpx;
		height: 160rpx;
		margin-right: 10rpx;
		margin-top: -24rpx;
		border-radius: 8rpx;
		background: #D8D8D8;
		border: 6rpx solid #fff;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}

	.proinfo-info {
		line-height: 1.1;
		padding-top: 20rpx;
	}

	// 规格列表
	.spects-wrap {
		padding-top: 40rpx;
		padding-bottom: 30rpx;
		overflow: hidden;
	}
	.numBox{
		height: 100rpx;
		text-align: right;
	}

	.prinit-spects {
		max-height: 602rpx;
		overflow: hidden;
		overflow-y: auto;
	}

	.spect-list {
		display: flex;
		flex-wrap: wrap;
		color: #333;
		font-size: 24rpx;
	}

	.spect-name,
	.spect-item {
		margin-bottom: 30rpx;
	}

	.spect-name {
		width: 100%;
		line-height: 1.1;
		overflow: hidden;
	}
	.spect-list:last-child .spect-name{
		padding-left: 26%;
		margin-left: 30rpx;
		margin-bottom: 10rpx;
	}
	.stokeNum{width: 38%;}
	.spect-item {
		position: relative;
		margin-right: 30rpx;
		min-width: 120rpx;
		padding: 0 24rpx;
		height: 44rpx;
		text-align: center;
		color: #999;
		border-radius: 26rpx;
		border: 1rpx solid #999;
		box-sizing: border-box;

		.spec_value {
			line-height: 44rpx;
		}

		&.on {
			border-color: $red;
			color: $red;
		}

		.spect-item-num {
			position: absolute;
			right: 0;
			top: 0;
			transform: translate(30%, -50%);
			font-size: 24rpx;
			min-width: 30rpx;
			line-height: 34rpx;
			padding: 0 2rpx;
			border-radius: 15rpx;
			background-color: $red;
			color: #fff;
		}
	}

	.spect-item2 {
		width: 100%;
		padding: 10rpx 0;
		border-top: 1rpx solid #DEDEDE;

		.spect-item-l {
			flex: 1;
			overflow: hidden;
		}

		.spec_value {
			width: 50%;
			margin-right: 30rpx;
		}
	}

	.spect-item2:last-child {
		border-bottom: 1rpx solid #DEDEDE;
	}

</style>
