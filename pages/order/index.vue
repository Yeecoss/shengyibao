<template>
<view class="container bgf5">
<!-- 自定义标题栏 -->
<div id="top">
  <navigationBar title="全部订单" extClass="nav"></navigationBar>
</div>
  <!-- tab栏 -->
  <view class="header f-28 col-3">
    <view @tap.stop="bindHeaderTap" :class="'tabItem ' + (dataType==='all'?'active':'')" data-type="all">
      <text>全部</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='payment'?'active':'')" data-type="payment">
      <text>待付款</text>
      <view class="line"></view>
    </view>
    <!-- <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='delivery'?'active':'')" data-type="delivery">
      <text>待发货</text>
      <view class="line"></view>
    </view> -->
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='delivery'?'active':'')" data-type="delivery">
      <text>待收货</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='received'?'active':'')" data-type="received">
      <text>已完成</text>
      <view class="line"></view>
    </view>
    <view @tap="bindHeaderTap" :class="'tabItem ' + (dataType==='cancel'?'active':'')" data-type="cancel">
      <text>已取消</text>
      <view class="line"></view>
    </view>
  </view>
  <!-- 订单列表 -->
  <view class="goods-detail-box">
    <scroll-view :refresher-threshold="20" refresher-enabled :refresher-triggered="triggered" @refresherrefresh="refresherrefresh" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;margin-top:88rpx'">
      <view class="wrapper" v-if="list.data && list.data.length > 0">
        <view class="m-top20 list bgf" v-for="(item, index) in list.data" :key="index" @tap.stop="navigateToDetail" :data-id="item.order_id" :data-state_text="item.order_status.text">
          <!-- 订单状态 -->
          <view class="order-box b-f">
            <view class="order-header dis-flex flex-x-between m-b-10">
							<view class="shop_info col-3 f-32">
								<image class="m-r-10 fl" :src="item.wxapp.logo" mode="aspectFill"></image>
								<text>{{item.wxapp.name}}</text>
								<text class="iconfont2 icon-gengduobeifen2 f-24 m-l-10"></text>
							</view>
            </view>
          </view>
          <!-- 商品信息 -->
          <view class="order-box order-img_list m-b-40" v-for="(item1, goods) in item.goods" :key="goods">
            <view class="order-shop">
              <view class="order-list-box dis-flex">
                <view class="left">
                  <view class="dis-flex">
										<view class="order-shop-left">
											<image lazy-load :src="item1.goods_image" mode="aspectFill"></image>
										</view>
                  </view>
                </view>
                <view class="right">
                  <view class="goods-name f-28 col-3">
                    <text class="twolist-hidden">{{ item1.goods_name }}</text>
                  </view>
                  <view class="goods-attr onelist-hidden col-6 f-24" v-if="item1.goods_attr">
                    <text>{{ item1.goods_attr }}</text>
                  </view>
									<view class="goods-status app-red f-28 m-top10">{{item1.order_status.text}}</view>
                </view>
								<view class="pri_num m-l-20">
                  <view class="goods-price">
                    <text class="f-28 col-3">￥{{ item1.goods_price }}</text>
                  </view>
                  <view class="goods-num">
                    <text class="f-28 col-3">×{{ item1.total_num }}</text>
                  </view>
								</view>
              </view>
            </view>
          </view>
          <view class="order-box b-f">
            <view class="order-btn dis-flex">
              <view class="order-left">
                <view class="text dis-flex flex-y-center">
                  <text class="f-28 col-3">共{{item.total_num ||0}}件，合计：</text>
                  <text class="col-m f-28">￥{{item.pay_price||0}}</text>
                </view>
              </view>
              <view class="order-right">
                <view class="btn-group dis-flex">
                  <!-- 未支付取消订单 -->
                  <view v-if="item.order_status.value==41">
                    <view @tap.stop="cancelOrder(item.order_id)" class="btn-default" >取消订单</view>
                  </view>
                  <view v-if="item.order_status.value==43 ||item.order_status.value==44">
                    <view @tap.stop="deleteOrder(item.order_id)" class="btn-default" >删除订单</view>
                  </view>
                  <!-- 订单付款 -->
									<!-- <view v-if="item.order_status.value==41">
                    <view @tap.stop="onPayOrder(item.order_id)" class="btn-main">去支付</view>
                  </view> -->
                  <!-- 确认收货 -->
                  <view v-if="item.order_status.value==42">
                    <view @tap.stop="receipt" class="btn-main" :data-id="item.order_id">确认收货</view>
                  </view>
                  <!-- 订单评价 -->
                  <!-- <view v-if="item.order_status.value==43 && item.is_comment==0">
                    <view @tap.stop="comment" class="btn-main" :data-id="item.order_id">评价</view>
                  </view> -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="no_more" class="no-more f-30">亲, 没有更多了</view>
			<tui-no-data :imgUrl="imgUrl[dataType]" :imgWidth="264" :imgHeight="264" v-if="!isLoading && !list.data.length">
				<view class="col-9">亲，您还没有订单信息哦！</view>
			</tui-no-data>
    </scroll-view>
  </view>

  <div v-show="isLoading">
    <loading ></loading>
  </div>
</view>
</template>

<script>
const app = getApp().globalData;
import loading from '@/components/loading';

export default {
  data() {
    return {
      dataType: 'all',
      triggered: true,// 列表类型
      list: {},// 订单列表
      scrollHeight: 0,// 列表容器高度
      no_more: false,// 没有更多数据
      isLoading: true,// 是否正在加载中
      page: 1,// 当前页码
			imgUrl: {
				all: 'http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png',
				payment: 'http://pic.kaidanxia.com/2020-06-22/202006221449002c4f91525.png',
				delivery: 'http://pic.kaidanxia.com/2020-06-22/20200622144845e61934196.png',
				received: 'http://pic.kaidanxia.com/2020-06-22/202006221448494dcf33432.png',
				comment: 'http://pic.kaidanxia.com/2020-06-22/20200622144847fb7112214.png',
			},
    };
  },

  components: {
    loading
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.$nextTick(() => {
      // 设置scroll-view高度
      this.setListHeight();
    })

    this.dataType = options.type || 'all'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取订单列表
    this.getOrderList();
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  methods: {
    refresherrefresh() {
      this.page = 1;
      this.triggered = true
      this.getOrderList(false, false, () => {
        this.triggered = false
      })
    },
    /**
     * 获取订单列表
     */
    getOrderList(isPage, page, next) {
      let _this = this;

      app._get('user.order/lists', {
        page: page || 1,
        dataType: _this.dataType
      }, result => {
        let resList = result.data.list,
            dataList = _this.list; // 订单时间截取

        if (resList.data && resList.data.length > 0) {
          resList.data = _this.initOrderDataFun(resList.data);
        }

        if (isPage == true) {
          _this.setData({
            'list.data': dataList.data.concat(resList.data),
            isLoading: false
          });
        } else {
          _this.setData({
            list: resList,
            isLoading: false
          });
        }
        next ? next() : ''
      });
    },

    /**
      * 初始化订单时间
      */
    initOrderDataFun(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].create_time) {
          data[i].create_newtime = data[i].create_time.substring(0, 11);
        }
      }

      return data;
    },

    /**
     * 切换标签
     */
    bindHeaderTap(e) {
      this.setData({
        dataType: e.currentTarget.dataset.type,
        list: {},
        isLoading: true,
        page: 1,
        no_more: false
      }); // 获取订单列表

      this.getOrderList(e.currentTarget.dataset.type);
    },

    /**
     * 取消订单
     */
    cancelOrder(order_id) {
      let _this = this;

      wx.showModal({
        title: "友情提示",
        content: "确认要取消该订单吗？",

        success(o) {
          if (o.confirm) {
            app._post_form('user.order/cancel', {
              order_id
            }, result => {
              _this.getOrderList(_this.dataType);
            });
          }
        }

      });
    },

    /**
     * 确认收货
     */
    receipt(e) {
      let _this = this;

      let order_id = e.currentTarget.dataset.id;
      wx.showModal({
        title: "提示",
        content: "确认收到商品？",
				confirmColor:'#FF7541',
        success(o) {
          if (o.confirm) {
            app._post_form('user.order/receipt', {
              order_id
            }, result => {
							_this.$api.msg(result.msg)
              _this.getOrderList(_this.dataType);
            });
          }
        }

      });
    },
		//删除订单
		deleteOrder(order_id){
			let that = this;
			uni.showModal({
			  title: "提示",
			  content: "确认删除订单？",
			  success(e) {
			    if (e.confirm) {
						app._post_form('user.order/delete', {
							order_id: order_id
						}, res => {
							that.$api.msg(res.msg)
							if(res.code==1){
								 that.getOrderList(that.dataType);
							}
						});
			    }
			  }
			});
		},
    /**
     * 点击付款按钮
     */
    onPayOrder(order_id) {
        // 显示loading
        wx.showLoading({
          title: '正在处理...'
        });
      
        // app._post_form('user.order/pay', {
        //   order_id: orderId,
        //   payType: payType
        // }, result => {
          
        // }, null, () => {
        //   wx.hideLoading();
        // });
    },

    /**
     * 订单评价
     */
    // comment(e) {
    //   let _this = this;

    //   let order_id = e.currentTarget.dataset.id;
    //   uni.navigateTo({
    //     url: './comment/comment?order_id=' + order_id
    //   });
    //   console.log(order_id);
    // },

    /**
     * 跳转订单详情页
     */
    navigateToDetail(e) {
      let order_id = e.currentTarget.dataset.id;
      let state_text = e.currentTarget.dataset.state_text;
      uni.navigateTo({
        url: '../order/detail?order_id=' + order_id + '&&state_text=' + state_text
      });
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.list.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      } // 加载下一页列表


      this.getOrderList(true, ++this.page);
    },

    /**
     * 设置商品列表高度
     */
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        tapHeight = Math.floor(rpx * 88),
            // tap高度
        scrollHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度
        this.setData({
          scrollHeight: scrollHeight
        });
      });
    },

  }
};
</script>
<style lang="scss">
@import "index";
</style>