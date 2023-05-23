<template>
<view class="container bgf5">
  <!-- 自定义标题栏 -->
  <navigationBar title="退款/售后" extClass="nav" id="top"></navigationBar>
  <!-- 顶部选项卡 -->
  <view class="header f-28 col-3">
    <block v-for="(item, index) in tabList" :key="index">
      <view :class="'tabItem ' + ( dataType == item.value ? 'active' : '')" @tap="swichNav(item.value)">
				<text>{{ item.text }}</text>
				<view class="line"></view>
      </view>
    </block>
  </view>
  <!-- 退款/售后单 -->
  <scroll-view scroll-y @scrolltolower="onPageDown" :style="'height: ' + swiperHeight + 'px;margin-top:88rpx;'">
    <view class="listbox">
      <view class="widget-list wrapper" v-if="list.data!=''">
				<view class="m-top20 list bgf" v-for="(item, index) in list.data" :key="item.order_id">
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
				  <view class="order-box order-img_list m-b-40" v-for="(vo,k) in item.refund_goods" :key="vo.goods_id" @tap.stop="onTargetDetail(item.order_refund_id)">
				    <view class="order-shop">
				      <view class="order-list-box dis-flex">
				        <view class="left">
				          <view class="dis-flex">
										<view class="order-shop-left">
											<image lazy-load :src="vo.goods_image" mode="aspectFill"></image>
										</view>
				          </view>
				        </view>
				        <view class="right">
				          <view class="goods-name f-28 col-3">
				            <text class="twolist-hidden">{{ vo.goods_name }}</text>
				          </view>
				          <view class="goods-attr onelist-hidden col-6 f-24">
				            <text>{{ vo.goods_sku_name }}</text>
				          </view>
									<view class="goods-status app-red f-28 m-top10" v-if="item.status.value!=41">{{item.status.text}}</view>
				        </view>
								<view class="pri_num m-l-20">
				          <view class="goods-price">
				            <text class="f-28 col-3">￥{{ vo.goods_price }}</text>
				          </view>
				          <view class="goods-num">
				            <text class="f-28 col-3">×{{ vo.goods_num }}</text>
				          </view>
								</view>
				      </view>
				    </view>
				  </view>
				  <view class="order-box b-f">
				    <view class="order-btn dis-flex flex-y-center">
				      <view class="order-left with300">
				        <!-- <view class="text dis-flex flex-y-center"> -->
				          <text class="f-28 col-3">共{{item.goods_total_num ||0}}件，合计:</text>
				          <text class="col-m f-28">￥{{item.refund_money||0}}</text>
				        <!-- </view> -->
				      </view>
				      <view class="order-right">
				        <view class="btn-group dis-flex">
									<!-- 查看详情 -->
				          <view class="btn-default" @tap.stop="onTargetDetail(item.order_refund_id)">查看详情</view>
				          <!-- 取消售后 -->
				          <template v-if="item.status.value==0">
				            <view @tap.stop="cancelRefund(item.order_refund_id)" class="btn-main" >取消售后</view>
				          </template>
				        </view>
				      </view>
				    </view>
				  </view>
				</view>
        <!-- 没有更多 -->
        <view v-if="list.data!='' && !isLoading && isLastPage" class="no-more f-30">亲, 没有更多了</view>
      </view>
      <!-- 没有记录 -->
      <view class="yoshop-notcont" v-if="list.data=='' && !isLoading">
        <text class="iconfont icon-wushuju"></text>
        <text class="cont">亲，暂无退款/售后单哦</text>
      </view>
    </view>
  </scroll-view>
	<!-- 提示 -->
	<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
</view>
</template>

<script>
const app = getApp().globalData;
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      applyStatus: [],
      tabList: [],
      dataType: -1,
      submsgSetting: {},
      // 订阅消息配置
      list: [],
      // 列表数据
      page: 1,
      // 当前页码
      isLoading: true,
      // 是否正在加载中
      isLastPage: false // 当前是最后一页
      ,
      swiperHeight: "",
			mtitle: '',
			mcontent: '',
    };
  },

  components: {
		popupTips
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this; // 获取订阅消息配置


    // that.getSubmsgSetting();

    // that.getRefundList();
    // that.$nextTick(() => {
    //   that.setSwiperHeight(); 
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this; // 设置swiper的高度
    that.$nextTick(() => {
      that.setSwiperHeight(); 
    });

    that.getRefundList();
  },

  methods: {
		//取消售后
		cancelRefund(refund_id){
			this.mtitle = '提示';
			this.mcontent = '确定取消售后？';
			this.$refs.popupTips.open(()=>{
				app._post_form('user.refund/cancelRefund',{refund_id: refund_id},res => {
					if(res.code==1){
						this.$api.msg(res.msg);
						this.getRefundList();
					}
				});
			})
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
     * 获取退款/售后单列表
     */
    getRefundList(isNextPage, page) {
      let that = this;
			let url = 'user.refund/getUserRefundList';
      getApp().globalData._get(url, {
        state: that.dataType==-1?0:1,
        page: page || 1
      }, result => {
        // 订单时间截取
        let resList = result.data;

        if (resList.list && resList.list.data && resList.list.data.length > 0) {
          resList.list.data = that.initOrderDataFun(resList.list.data);
        } // 创建页面数据


        that.setData(that.createData(resList, isNextPage));
      });
    },

    /**
     * 获取订阅消息配置
     */
    getSubmsgSetting() {
      let _this = this;

      getApp().globalData._get('wxapp.submsg/setting', {}, result => {
        _this.setData({
          submsgSetting: result.data.setting
        });
      });
    },

    /**
     * 创建页面数据
     */
    createData(data, isNextPage) {
      data['isLoading'] = false; // 列表数据

      let dataList = this.list;

      if (isNextPage == true && typeof dataList !== 'undefined') {
        data.list.data = dataList.data.concat(data.list.data);
      } // 导航栏数据


      data['tabList'] = [{
        value: -1,
        text: '售后中'
      }, {
        value: 0,
        text: '已完结'
      }];
      return data;
    },

    /**
     * 设置swiper的高度
     */
    setSwiperHeight() {
      const query = uni.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {res
        let systemInfo = uni.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // 计算rpx
        tapHeight = Math.floor(rpx * 80),
            // tap高度
        swiperHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度

        this.swiperHeight = swiperHeight;
      });
    },

    /** 
     * 点击tab切换 
     */
    swichNav(value) {
      let _this = this;

      if (_this.dataType == value) {
        return false;
      }

      _this.setData({
        dataType: value,
        list: {},
        page: 1,
        isLastPage: false,
        isLoading: true
      }, () => {
        // 获取退款/售后单列表
        _this.getRefundList();
      });
    },

    /**
     * 下拉到底加载数据
     */
    onPageDown() {
      let _this = this; // 已经是最后一页


      if (_this.page >= _this.list.last_page) {
				_this.isLastPage=true;

        return false;
      } // 获取退款/售后单列表


      _this.getRefundList(true, ++_this.page);
    },

    /**
     * 跳转售后详情页
     */
    onTargetDetail(id) {
      let _this = this; // 跳转售后详情页


      // const onCallback = () => {
        uni.navigateTo({
          url: `./detail/detail?order_refund_id=${id}`
        });
      // }; // 请求用户订阅消息


      // _this.onRequestSubscribeMessageFun(onCallback);
    },

    /**
     * 订阅消息 => [售后状态通知]
     */
    // onRequestSubscribeMessageFun(callback) {
    //   let _this = this;

    //   let tmplItem = _this.submsgSetting.order.refund.template_id;

    //   if (tmplItem.length > 0) {
    //     wx.requestSubscribeMessage({
    //       tmplIds: [tmplItem],

    //       success(res) {},

    //       fail(res) {},

    //       complete(res) {
    //         callback && callback();
    //       }

    //     });
    //   }
    // }

  }
};
</script>
<style lang="scss">
	@import "../index";
</style>