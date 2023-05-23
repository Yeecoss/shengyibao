<template>
<view class="container bgf5 min_h_100">
  <!-- 自定义标题栏 -->
  <navigationBar :back="false">
    <view slot="left" class="cart-edit-wrap dis-flex flex-x-end">
      <text v-if="action === 'complete'" @tap.stop="switchAction" class="f-30" data-action="edit">编辑</text>
      <text v-if="action === 'edit'" @tap.stop="switchAction" class="f-30" data-action="complete">完成</text>
    </view>
  </navigationBar>
  <view class="flow-list">
    <view v-if="goods_list.length">
      <view class="goods_list_box">
        <view class="dish-item-box" v-for="(item, index) in goods_list" :key="index">
          <view class="m-b-10" @tap.stop="onShopChecked" :data-index="index">
            <label class="check-wrap default-check f-32">
              <checkbox :checked="item.checked"/>{{item.wxapp.name}}
							<text class="iconfont2 icon-gengduobeifen2 f-24 m-l-10"></text>
						</label>
          </view>
          <view v-for="(item, index2) in item.goods_list" :key="index2" class="dish-item dis-flex flex-y-center" :data-shopindex="index" :data-index="index2" :style="item.txtStyle">
            <!-- 选择框 -->
            <view class="dish-item-radio" @tap.stop="onChecked(index,index2)">
              <label class="check-wrap default-check">
                <checkbox :checked="item.checked"/>
              </label>
            </view>
            <view class="dish-item-wrp dis-flex flex-box">
              <!-- 商品图片 -->
              <navigator hover-class="none" :url="`/pages/goods/index?goods_id=${item.wxapp_goods_id}&wid=${item.wxapp_id}`">
                <view class="dish-item-pic">
                  <image lazy-load mode="aspectFill" class="image" :src="item.goods.goods_image"></image>
                  <view class="state" v-if="item.goods_status.value == '20'">已失效</view>
                </view>
              </navigator>
              <!-- 商品信息 -->
              <view class="dish-item-info flex-box">
                <navigator hover-class="none" :url="`/pages/goods/index?goods_id=${item.wxapp_goods_id}&wid=${item.wxapp_id}`">
                  <view class="goods-name">
                    <text class="twolist-hidden f-24 col-3">{{item.goods.goods_name}}</text>
                  </view>
                  <view class="goods-attr onelist-hidden col-7 f-24">{{item.goods_sku.goods_attr}}</view>
                </navigator>
                <view class="dis-flex flex-x-between m-t-20">
                  <!-- 商品价格 -->
                  <view class="wx-goods_price dis-flex flex-y-center">
                    <!-- <text v-if="item.is_user_grade" class="dish-item-money">￥{{ item.grade_goods_price }}</text> -->
                    <text class="dish-item-money col-3 f-28">￥{{ item.goods_sku.goods_price }}</text>
                  </view>
                  <!-- 数量选择器 -->
                  <view class="select-number">
										<tui-numberbox :value="item.total_num" :disabledInput="true" :width="56" :height="44" backgroundColor="#fff" @change="onInputGoodsNum($event,index,index2,item.goods_sku.spec_sku_id)"></tui-numberbox>
                  </view>
                </view>
                <!-- 删除按钮 -->
                <!-- <view catchtap="del" class="flow-dete" data-goods-id="{{item.goods_id}}" data-sku-id="{{item.goods_sku_id}}">
                  <text class="iconfont icon-lajixiang"></text>
                </view> -->
              </view>
            </view>
          </view>
					<!-- 店合计 -->
					<view class="dian_total dis-flex flex-y-center flex-x-between m-t-20">
						<view class="f-28">共{{item.checkedNum ||0}}件，合计：<text class="app-red">¥{{item.checkedPrice ||0}}</text></view>
						<view @tap.stop="submit(index,item.wxapp.wxapp_id)" class="total-btn f-26 app-red">立即购买</view>
					</view>
        </view>
      </view>
      <!-- 底部操作栏 -->
			<view class="fot-operation dis-flex flex-y-center flex-x-between" v-if="action == 'edit'">
				<view class="checked-all f-28 col-3 dis-flex flex-y-center">
				  <label @tap.stop="onCheckedAll" class="dis-flex flex-y-center default-check check-wrap">
						<checkbox :checked="checkedAll"/>
				    <text class="f-28">全选</text>
				  </label>
					<view class="checked-num col-6 f-26 m-l-20">
						已选<text>{{cartTotalNum}}</text>件商品
					</view>
				</view>
				<view class="fot-opera-r dis-flex flex-y-center">
					<!-- <view v-if="action == 'complete'" class="fot-del f-26 col-6" @tap.stop="submit">立即购买</view> -->
					<view class="fot-share f-26 col-6" @tap.stop="onDelete">删除<text class="iconfont2 icon-shanchu m-l-10 f-26"></text></view>
				</view>
			</view>
      <!-- <view class="cart-tab-wrp dis-flex">
        <view class="cart-item-total cart-tab-item dis-flex flex-y-center flex-x-between">
          <view class="checked-all">
            <label @tap.stop="onCheckedAll" class="dis-flex flex-y-center radio">
              <radio class="margin-right: 10rpx;" :checked="checkedAll" color="#E82E2D"></radio>
              <text class="f-28">全选</text>
            </label>
          </view>
          <view v-if="action === 'complete'" class="cart-item-total-price dis-flex">
            <text>
              <text class="f-22 col-9">合计</text>
              <text class="f-32 col-m">￥{{cartTotalPrice}}</text>
            </text>
          </view>
        </view>
        <view class="cart-tab-item_1">
          <view v-if="action === 'complete'" @tap.stop="submit" class="cart-tab-item-btn">立即购买</view>
          <view v-if="action === 'edit'" @tap.stop="onDelete" class="cart-tab-item-btn">删除</view>
        </view>
      </view> -->
    </view>
    <view v-else>
      <view class="yoshop-notcont" style="position:relative;margin-top:0">
        <text class="iconfont2 icon-bianzu1 col-9"></text>
        <text class="cont">亲，购物车还没有商品哦～</text>
        <view @tap.stop="goShopping" class="flow-btn-min">去逛逛</view>
      </view>
    </view>
    <!-- <view class="line20 bgf5"></view> -->
    <!-- 为你推荐 -->
    <view class="tuijian" v-if="list!=''">
			<tui-divider class="m-b-10" :size="28" width="52%" :height="60" backgroundColor="#f5f5f5" dividerColor="#FF7541" color="#FF7541"><text class="iconfont2 icon-like app-red m-r-10 f-28"></text>猜你喜欢</tui-divider>
      <view class="tj-list dis-flex flex-x-between">
        <navigator v-for="(item, index) in list" :key="index" :url="'../goods/index?goods_id=' + item.wxapp_goods_id" class="tj-item" hover-class="none">
          <view class="tj-pic"><image lazy-load mode="aspectFill" :src="item.goods.goods_image"></image></view>
          <view class="tj-info">
            <view class="tj-goods-name onelist-hidden f-28 col-2">{{item.goods.goods_name}}</view>
            <view class="dis-flex flex-x-between flex-y-center">
              <view class="tj-goods-price"><text>¥</text>{{item.goods.min_price}}</view>
              <view class="tj-sales-num col-9">销量{{item.goods.goods_sales}}</view>
            </view>
          </view>
        </navigator>
      </view>
    </view>
  </view>
  
  <loading ref="loading" v-if="isLoading"></loading>
  
  <!-- 自定义tabbar -->
  <foot-tabBar ref="footTabBar" dIndex='2' :homeStyle="homeStyle"></foot-tabBar>
</view>
</template>

<script>
const app = getApp().globalData; // 工具类
import footTabBar from '@/components/foot-tabBar';
import loading from '@/components/loading';
// 工具类
import Util from "../../utils/util";

export default {
  data() {
    return {
      isLogin: false,
      // 商品列表
      goods_list: [],
      list: [],
      //推荐商品列表
      // 当前动作
      action: 'complete',
      // 选择的商品
      checkedData: [],
      // 是否全选
      checkedAll: false,
      // 商品总价格
      cartTotalPrice: '0.00',
      // 商品总个数
			cartTotalNum: 0,
      // 商品个数
      goodsLength: 0,
      isLoading: true,
      order_total_price: "",
			homeStyle: '',
    };
  },

  components: {
	'foot-tabBar':footTabBar,
		loading,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
	},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
		
		that.homeStyle = app.homeStyle?app.homeStyle:'div';

    that.setData({
      isLogin: app.checkIsLogin()
    });

    if (that.isLogin) {
      // 获取购物车列表
      that.getCartList();
    } // 获取推荐商品列表
		 wx.removeStorageSync('checkedData');

    that.getGoodsList();
  },

  methods: {
    // 返回
    back() {
      var data = this;
      wx.navigateBack({
        delta: data.delta
      });
      this.$emit('back', {
        delta: data.delta
      }, {});
    },

    /**
     * 获取购物车列表
     */
    getCartList() {
      let _this = this;

      app._get('cart/lists', {}, result => {
        _this.initGoodsCheckedFun(result.data);
      });
    },

    /**
    * 获取商品列表
    * @param {bool} isPage 是否分页
    * @param {number} page 指定的页码
    */
    getGoodsList(isPage, page) {
      let _this = this;

      let data = {
        shop_rmd: 1
      };

      app._get('wxapp.goods/simpleLists', data, result => {
				_this.isLoading = false
        let resList = result.data.list;
        _this.setData({
          list: resList.length > 6 ? resList.slice(0, 6) : resList
        });
      });
    },

    /**
     * 初始化商品选中状态
     */
    initGoodsCheckedFun(data) {
      let _this = this;

      let checkedData = _this.getCheckedData();

      let length = 0;
      let shop_list = []; // 将商品设置选中

      data.shop_list.forEach(element => {
        if (element.goods_list) {
          let checked = true;
          element.goods_list.forEach(item => {
            item.checked = Util.inArray(`${item.wxapp_goods_id}_${item.spec_sku_id}`, checkedData);

            if (!item.checked) {
              checked = false;
            }
          });
          element.checkedNum = 0;
          element.checkedPrice = 0;
					
          element.checked = checked;
          length += element.goods_list.length;
          shop_list.push(element);
        }
      });

      _this.setData({
        goods_list: shop_list,
        order_total_price: data.order_total_price,
        action: 'complete',
        checkedAll: checkedData.length == length,
        goodsLength: length
      }); // 更新购物车已选商品总价格


      _this.updateTotalPrice();
    },

    onShopChecked(e) {
      let index = e.currentTarget.dataset.index,
          shop = this.goods_list[index],
          checked = !shop.checked;
      shop.checked = checked;
      shop.goods_list.forEach((item, index) => {
        item.checked = checked;
      }); // 选中状态

      this.setData({
        ['goods_list[' + index + ']']: shop
      }); // 更新选中记录

      this.onUpdateChecked(); // 更新购物车已选商品总价格

      this.updateTotalPrice(); // 更新全选状态

      this.setData({
        checkedAll: this.getCheckedData().length == this.goodsLength
      });
    },

    /**
     * 选择框选中
     */
    onChecked(index,index2) {
      let shop = this.goods_list[index];
      shop.goods_list[index2].checked = !shop.goods_list[index2].checked; // 更新商铺选中状态

      let checked = true;
      shop.goods_list.forEach(item => {
        if (!item.checked) {
          checked = false;
        }
      });
      shop.checked = checked;
			this.goods_list[index] = shop;
      // this.setData({
      //   ['goods_list[' + shopindex + ']']: shop
      // }); // 更新选中记录
      this.onUpdateChecked(); // 更新购物车已选商品总价格

      this.updateTotalPrice(); // 更新全选状态

      this.setData({
        checkedAll: this.getCheckedData().length == this.goodsLength
      });
    },

    /**
     * 获取选中的商品
     */
    getCheckedData() {
      let checkedData = wx.getStorageSync('checkedData');
      return checkedData ? checkedData : [];
    },

    /**
     * 选择框全选
     */
    onCheckedAll(e) {
      let goodsList = this.goods_list; // 更新商品选中记录
      goodsList.forEach(item => {
        item.checked = !this.checkedAll;
        item.goods_list.forEach(item => {
          item.checked = !this.checkedAll;
        })
      });

      this.setData({
        goods_list: goodsList,
        checkedAll: !this.checkedAll
      }); // 更新购物车已选商品总价格


      this.updateTotalPrice(); // 更新选中记录


      this.onUpdateChecked();
    },

    /**
     * 更新商品选中记录
     */
    onUpdateChecked() {
      let _this = this,
          checkedData = [];

      _this.goods_list.forEach(element => {
        element.goods_list.forEach(item => {
          if (item.checked == true) {
            checkedData.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
          }
        });
      });

      wx.setStorageSync('checkedData', checkedData);
    },

    /**
     * 切换编辑/完成
     */
    switchAction(e) {
      let _this = this;

      _this.setData({
        action: e.currentTarget.dataset.action
      });
    },

    /**
     * 删除商品
     */
    onDelete() {
      let _this = this,
          cartIds = _this.getCheckedIds();

      if (!cartIds.length) {
        app.showError('您还没有选择商品');
        return false;
      }

      wx.showModal({
        title: "提示",
        content: "您确定要移除选择的商品吗?",

        success(e) {
          e.confirm && app._post_form('cart/delete', {
            goods_sku_id: cartIds
          }, result => {
            // 删除选中的商品
            _this.onDeleteEvent(cartIds); // 获取购物车列表


            _this.getCartList();
          });
        }

      });
    },

    /**
     * 商品删除事件
     */
    onDeleteEvent(cartIds) {
      let _this = this;
			let list = _this.goods_list;

      cartIds.forEach(cartIndex => {
        list.forEach((item, goodsIndex) => {
          if (cartIndex == `${item.wxapp_goods_id}_${item.spec_sku_id}`) {
            list.splice(goodsIndex, 1);
          }
        });
      }); // 更新选中记录
			_this.goods_list = list

      _this.onUpdateChecked();

      return true;
    },

    /**
     * 获取已选中的商品
     */
    getCheckedIds(index) {
      let _this = this;

      let arrIds = [];
			if(index!=='' &&index!=undefined){
				_this.goods_list.forEach((element,k) => {
					if(index==k){
						element.goods_list.forEach(item => {
							if (item.checked === true) {
								arrIds.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
							}
						});
					}
				});
			}else{
				_this.goods_list.forEach((element,k) => {
				  element.goods_list.forEach(item => {
				    if (item.checked === true) {
				      arrIds.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
				    }
				  });
				});
			}

      return arrIds;
    },

    /**
     * 更新购物车已选商品总价格
     */
    updateTotalPrice() {
      let cartTotalPrice = 0;
			let cartTotalNum = 0;
      this.goods_list.forEach(element => {
				let checkedPrice = 0;
				let checkedNum = 0;
        element.goods_list.forEach(item => {
          if (item.checked === true) {
            cartTotalPrice = this.mathadd(cartTotalPrice, item.total_price);
						cartTotalNum = cartTotalNum + parseInt(item.total_num);
						
						checkedPrice = this.mathadd(checkedPrice, item.total_price);
						checkedNum = checkedNum + parseInt(item.total_num);
          }
        });
				element.checkedPrice = Number(checkedPrice).toFixed(2);
				element.checkedNum = checkedNum;
      });
      this.setData({
        cartTotalPrice: Number(cartTotalPrice).toFixed(2),
        cartTotalNum: cartTotalNum,
      });
    },

    /**
     * 递增指定的商品数量
     */
    onAddCount(shopindex,index,goodsSkuId) {
      let _this = this,
          goods = _this.goods_list[shopindex].goods_list[index]; // order_total_price = _this.data.order_total_price;
      // 后端同步更新


      wx.showLoading({
        title: '加载中',
        mask: true
      });

      app._post_form('cart/add', {
        wxapp_goods_id: goods.wxapp_goods_id,
        goods_num: 1,
        goods_sku_id: goodsSkuId
      }, () => {
        // 获取购物车列表
        _this.getCartList();
      }, null, () => {
        wx.hideLoading();
      });
    },

    /**
     * 递减指定的商品数量
     */
    onSubCount(shopindex,index,goodsSkuId) {
      let _this = this,
          goods = _this.goods_list[shopindex].goods_list[index];

      if (goods.total_num > 1) {
        // 后端同步更新
        wx.showLoading({
          title: '加载中',
          mask: true
        });

        app._post_form('cart/sub', {
          wxapp_goods_id: goods.wxapp_goods_id,
          goods_sku_id: goodsSkuId
        }, () => {
          // 获取购物车列表
          _this.getCartList();
        }, null, () => {
          wx.hideLoading();
        });
      }
    },
		onInputGoodsNum(e,shopindex,index,goodsSkuId){
			if(e.type=="plus"){
				this.onAddCount(shopindex,index,goodsSkuId)
			}
			if(e.type=="reduce"){
				this.onSubCount(shopindex,index,goodsSkuId)
			}
		},
    /**
     * 购物车结算
     */
    submit(index,wxapp_id) {
      let _this = this,
          cartIds = _this.getCheckedIds(index);
				
      if (!cartIds.length) {
        app.showError('您还没有选择商品');
        return false;
      }

      uni.navigateTo({
        // url: '../flow/checkout?order_type=cart&cart_ids=' + encodeURIComponent(JSON.stringify(cartIds)) + '&wxapp_id='+wxapp_id
        url: '../flow/checkout?order_type=cart&cart_ids=' +cartIds + '&wxapp_id='+wxapp_id
      });
    },

    /**
     * 加法
     */
    mathadd(arg1, arg2) {
      return (Number(arg1) + Number(arg2)).toFixed(2);
    },

    /**
     * 减法
     */
    // mathsub(arg1, arg2) {
    //   return (Number(arg1) - Number(arg2)).toFixed(2);
    // },

    /**
     * 去购物
     */
    goShopping() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }

  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>