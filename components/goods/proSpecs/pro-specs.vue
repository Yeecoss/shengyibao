<template>
	<view>
		<!-- 确认购买弹窗 -->
		<popup :show="ifshow" type="bottom" @clickmask="close">
			<view class="popup-main" v-if="ifshow" catchtouchmove='true'>
				<view class="pop-close" @tap="close"><text class="iconfont2 icon-shanchu1 f-34 col-3"></text></view>
		    <!-- 主体信息 -->
		    <view class="trade-main">
		      <view class="goods-info dis-flex flex-y-center">
		        <!-- 图片名称 -->
		        <view class="goods-image bgf" @tap.stop="onPreviewSkuImage">
		          <image lazy-load :src="skuCoverImage" mode="aspectFill"></image>
		        </view>
		        <view class="right flex-box">
		          <view class="detail-price money-box dis-flex flex-y-center">
		            <!-- 商品价 -->
		            <view class="goods-price">
		              <text class="col-m f-32">￥</text>
		              <text class="goods-price_num col-m f-32">{{ goods_price }}</text>
		            </view>
		            <!-- 划线价 -->
		            <!-- <view class="line-price col-9" v-if="line_price > 0">
		              <text>￥{{ line_price }}</text>
		            </view> -->
		          </view>
		          <view class="goods-stock f-24 m-t-10">
		            <text class="flex-box col-9 m-r-10">库存</text>{{stock_num}}
		          </view>
		        </view>
		      </view>
		      <!-- 规格列表 -->
		      <view class="goods-attr">
		        <!-- 滚动容器 -->
		        <scroll-view class="goods-attr--scroll" scroll-y="true">
		          <view class="group-item" v-for="(attr, attr_idx) in goodsMultiSpec.spec_attr" :key="attr_idx">
		            <view class="tips-text" :data-id="attr.group_id">{{ attr.group_name }}</view>
		            <view class="spec-item" v-for="(item, item_idx) in attr.spec_items" :class="item.checked ? 'cur' : ''" :key="item_idx" @tap.stop="onSwitchSpec(attr_idx,item_idx)">
		              <view class="spec-itemBox onelist-hidden">{{ item.spec_value }}</view>
		            </view>
		          </view>
		        </scroll-view>
		      </view>
		      <!-- 购买数量 -->
		      <view class="buy_number dis-flex flex-y-center">
		        <view class="buyNumber f-28">
		          <text>购买数量</text>
		        </view>
						<view class="select-number" v-if="listNumShow">
							<tui-numberbox :max="stock_num" :value="goods_num" :height="44" backgroundColor="#fff" @change="onInputGoodsNum($event)"></tui-numberbox>
						</view>
		      </view>
		    </view>
		    <!-- 底部操作栏 -->
		    <view class="foot-operate flex-y-center dis-flex">
		      <block v-if="stock_num > 0">
						<template v-if="btnType">
							<view class="order-bt orderBut m-r-30 m-l-30 flex-box" @tap.stop="onConfirmSubmit">确定</view>
						</template>
						<template v-else>
							<view class="order-number orderBut" @tap.stop="onConfirmSubmit" data-type="addCart">加入购物车</view>
							<view class="order-bt orderBut" @tap.stop="onConfirmSubmit" data-type="buyNow">立即购买</view>
						</template>
		      </block>
		      <view class="default-btn orderBut m-r-30 m-l-30 flex-box" v-else>暂无现货</view>
		    </view>
		  </view>
		</popup>
	</view>
</template>

<script>
	// 记录规格的数组
	let goodsSpecArr = [];
	// 工具类
	const util = require("@/utils/util.js");
	const app = getApp().globalData;
	import popup from "@/components/pop-manager/index";
	export default {
		components: {
			popup
		},
		props: {
			noLogin: {
				type: Boolean,
				default: false
			},
			pageType: {
				type: String
			}
		},
		data() {
			return {
				ifshow: false,
				detail: {},
				// 商品详情信息
				goods_price: 0,
				// 商品价格
				line_price: 0,
				// 划线价格
				stock_num: 0,
				// 库存数量
				goods_num: 1,
				// 商品数量
				goods_sku_id: 0,
				// 购物车商品总数量
				skuCoverImage: "",
				goodsMultiSpec: {},
				listNumShow: true,
				cart_total_num:'',
				btnType: '', //点击的按钮类型购买/购物车
			};
		},
		methods: {
			_open(data,btnType) {
			   let _this = this;
				 _this.goods_num = 1;
				 
				 _this.btnType = btnType||'';
				 let obj = JSON.parse(JSON.stringify(data));
				 let goodsMultiSpec = {}; // 初始化商品多规格
					
				 if (obj.goods.spec_type == 20) {
					 goodsMultiSpec = _this.initManySpecData(obj.goods.goods_multi_spec);
							
					 _this.detail = obj;
					 _this.goodsMultiSpec = goodsMultiSpec;
	
					 for (let i in _this.goodsMultiSpec.spec_attr) {
						 for (let j in _this.goodsMultiSpec.spec_attr[i].spec_items) {
							 if (j < 1) {
								 _this.goodsMultiSpec.spec_attr[i].spec_items[0].checked = true;
								 goodsSpecArr[i] = _this.goodsMultiSpec.spec_attr[i].spec_items[0].item_id;
							 } else {
								 _this.goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;	
							 }
						 }
					 }
	
					 _this.updateSpecGoodsFun();
				 } else {
					 _this.setData({
						 detail: obj,
						 ifshow: true,
						 goods_sku_id: obj.goods.goods_sku.spec_sku_id,
						 goods_price: obj.goods.goods_sku.goods_price,
						 line_price: obj.goods.goods_sku.line_price,
						 stock_num: obj.goods.goods_sku.stock_num,
						 skuCoverImage: obj.goods.goods_image,
						 goodsMultiSpec: {}
					 });
				 }
			 },
			// 加入购物车and立即购买
			onConfirmSubmit(e) {
				if(this.pageType != 'goodsPriview'){
					let _this = this,
							submitType = ''; // 表单验证
					submitType = _this.btnType?_this.btnType : e.currentTarget.dataset.type;
				
					if (!_this.onVerifyFun()) {
						return false;
					}
				
					if (submitType === 'buyNow') {
						// 立即购买
						let nextc = () => {
							uni.navigateTo({
								url: '/pages/flow/checkout?' + util.urlEncode({
									order_type: 'buyNow',
									goods_id: _this.detail.goods_id,
									wxapp_goods_id: _this.detail.wxapp_goods_id,
									goods_num: _this.goods_num,
									goods_sku_id: _this.goods_sku_id
								}),
								success() {
									// 关闭弹窗
									_this.ifshow = false;
								}
							});
						}
						// #ifdef MP
						_this.ifshow = false;
						let next2 = (callback) => {
							app._get('shop.setting/store', {}, (result) => {
								if (result.code == -1) {
									_this.$emit('showLogin', callback)
								} else {
									nextc()
								}
							}, false, false, false, _this.noLogin);
						}
						next2(nextc)
						// #endif
						// #ifndef MP
						nextc()
						// #endif
					} else if (submitType === 'addCart') {
						// 加入购物车
						let next = (callback) => {
							app._post_form('cart/add', {
								wxapp_goods_id: _this.detail.wxapp_goods_id,
								goods_num: _this.goods_num,
								goods_sku_id: _this.goods_sku_id
							}, result => {
								if (result.code == -1) {
									_this.$emit('showLogin', callback)
								} else {
									app.showSuccess(result.msg);
						
									_this.setData(result.data);
									// 关闭弹窗
									_this.ifshow = false;
									_this.$emit('update')
								}
							}, false, false, false, _this.noLogin);
						}
						next(next)
					}
				}
			},
			// 表单验证
			onVerifyFun() {
			  let _this = this;
			
			  if (_this.goods_num === '') {
			    app.showError('请输入购买数量');
			    return false;
			  } // 将购买数量转为整型，防止出错
			
			
			  _this.setData({
			    goods_num: parseInt(_this.goods_num)
			  });
			
			  if (_this.goods_num <= 0) {
			    app.showError('购买数量不能为0');
			    return false;
			  }
			
			  return true;
			},
			
			// 初始化商品多规格
			initManySpecData(data) {
			  goodsSpecArr = [];
			
			  for (let i in data.spec_attr) {
			    for (let j in data.spec_attr[i].spec_items) {
			      if (j < 1) {
			        data.spec_attr[i].spec_items[0].checked = true;
			        goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id;
			      }
			    }
			  }
			
			  return data;
			},
			
			//更新商品规格信息
			updateSpecGoodsFun() {
			  let _this = this,
			      specSkuId = goodsSpecArr.join('_'); // 查找skuItem
			
			  let spec_list = _this.goodsMultiSpec.spec_list,
			      skuItem = spec_list.find(val => {
			    return val.spec_sku_id == specSkuId;
			  }); // 记录goods_sku_id
			  // 更新商品价格、划线价、库存
			
			  if (typeof skuItem === 'object') {
			    _this.setData({
			      ifshow: true,
			      goods_sku_id: skuItem.spec_sku_id,
			      goods_price: skuItem.form.goods_price,
			      line_price: skuItem.form.line_price,
			      stock_num: skuItem.form.stock_num,
			      skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.detail.goods.goods_image
			    });
			  }
			},
			// 自定义输入商品数量
			onInputGoodsNum(e) {
			  let _this = this,
			      iptValue = e.value;
			
			  if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
			    iptValue = 1;
			  }
			  _this.goods_num = iptValue
			},
			//点击切换不同规格
			onSwitchSpec(attrIdx,itemIdx) {
				this.listNumShow = false;
				
			  let _this = this,
			      goodsMultiSpec = _this.goodsMultiSpec;
			
			  for (let i in goodsMultiSpec.spec_attr) {
			    for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
			      if (attrIdx == i) {
			        goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;
			
			        if (itemIdx == j) {
			          goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
			          goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
			        }
			      }
			    }
			  }
				_this.goodsMultiSpec = goodsMultiSpec; // 更新商品规格信息
				_this.updateSpecGoodsFun();
				_this.$nextTick(() => {
					_this.listNumShow = true
				})
			},
			//关闭弹窗
			close() {
				this.ifshow = false;
			},
			//预览Sku规格图片
			onPreviewSkuImage(e) {
			  let _this = this;
			
			  wx.previewImage({
			    current: _this.skuCoverImage,
			    urls: [_this.skuCoverImage]
			  });
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
