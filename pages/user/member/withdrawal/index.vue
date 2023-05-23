<template>
<view class="invite">
  <!-- 自定义标题栏 -->
  <navigationBar title="邀请开店" extClass="nav" id="top"></navigationBar>
  
  <scroll-view refresher-enabled :refresher-triggered="triggered" @refresherrefresh="refresherrefresh" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
    <view class="container">
      <view class="swiperBox">
        <swiper autoplay="true" circular indicator-dots class="swiperBox1" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="white">
            <swiper-item>
              <view class="imgBox" @tap.stop="showTip('2')">
                <image lazy-load class="slide-image" mode="aspectFill" src="https://pic.kaidanxia.com/2020-11-30/13330494c734345.png"></image>
              </view>
            </swiper-item>
            <swiper-item>
              <view class="imgBox" @tap.stop="showTip('2')">
                <image lazy-load class="slide-image" mode="aspectFill" src="https://pic.kaidanxia.com/2020-09-01/202009011112117b7e97841.png"></image>
              </view>
            </swiper-item>
        </swiper>
      </view>
      <div class="tipBox" @tap.stop="showTip('2')">
        <text class="iconfont2 icon-questionmark f-26"></text>提现规则
      </div>
      <view class="titleBox">
        <image lazy-load mode="aspectFill" src="https://pic.kaidanxia.com/2020-09-01/202009011112132fd1a2695.png"></image>
        <div class="titleContent dis-flex flex-y-center">
          <div class="content">
            <div class="title">
              可提现金额(元)
            </div>
            <div class="num">{{applyCash}}</div>
          </div>
          <div class="line"></div>
          <div class="content">
            <div class="title">
              提现中金额(元)
            </div>
            <div class="num">{{applyCashing}}</div>
          </div>
          <div class="but" v-if="can_apply=='1'" @click="getMoney()">
            立即提现
          </div>
          <div class="but" v-else @click="showTip(1)">
            提现中
          </div>
        </div>
      </view>
      <div class="tapsBox dis-flex flex-y-center flex-x-between">
        <div class="leftTaps dis-flex flex-y-center">
          <div class="tapItem" :class="tapItem == 'all' ? 'tapActiveItem' : ''" @tap="tapItemClick('all')">
            全部
            <div class="line"></div>
          </div>
          <div class="tapItem m-left" :class="tapItem == 'pay' ? 'tapActiveItem' : ''" @tap="tapItemClick('pay')">
            已支付
            <div class="line"></div>
          </div>
        </div>
        <div class="moreBox" @tap.stop="hostory">
          提现记录<text class="iconfont2 icon-gengduobeifen2"></text>
        </div>
      </div>
      <div class="listBox" v-if="list.length > 0">
        <div class="list dis-flex flex-y-center flex-x-between" v-for="(item, index) in list" :key="index" @tap.stop="showBuyList(item)">
          <div class="userImg">
              <image lazy-load class="slide-image" mode="aspectFill" :src="item.avatarUrl"></image>
          </div>
          <div class="w-box dis-flex flex-y-center flex-x-between">
            <div class="userName">
              <div class="col-3 f-30 onelist-hidden">{{item.nickName}}</div>
              <div class="col-9 f-24 m-t-10">{{item.createTime}}</div>
            </div>
            <div class="payPrice">
              <div class="col-3 f-26">
                {{item.pay_price}}
              </div>
              <div class="col-9 f-24 m-t-10">
                支付金额
              </div>
            </div>
            <div class="getPrice">
              <div class="col-3 f-26">{{item.commission}}</div>
              <div class="col-9 f-24 m-t-10">奖励</div>
            </div>
          </div>
          <div class="detail col-6 f-24">
            <text class="f-28 iconfont2 icon-gengduobeifen2"></text>
          </div>
        </div>
        <view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
      </div>
      <div v-else class="nodata">
        <tui-no-data :fixed="false" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="240" :imgHeight="240">
          <view class="col-9">暂无数据！</view>
        </tui-no-data>
      </div>
    </view>
  </scroll-view>
  <popup ref="popup" :show="show">
    <view class="popup-main">
      <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
      <view class="poptitle f-32">{{title}}</view>
      <view class="pop-input f-30">
        <div v-if="showType == 1" class="nodeBox">
          <div class="nodeList" v-for="(item, index) in nodeList" :key="index">
            <div class="price col-3 f-26">{{item.pay_price}}（{{item.commission}}）</div>
            <div class="col-6 f-24">{{item.createTime}}</div>
            <div class="dots"></div>
            <div class="line" v-if="index != nodeList.length - 1"></div>
          </div>
        </div>
        <div v-else>
          {{content}}
        </div>
      </view>
      <view class="pop-btn">
        <view @tap.stop="confirm" class="submit">我知道了</view>
      </view>
    </view>
  </popup>
  
  <popup ref="popup" :show="show2" type="bottom" class="popupBox" @close="close">
    <view class="popup-main1">
      <view class="pop-close" @tap="show2 = false"><text class="iconfont2 icon-shanchu1"></text></view>
      <view class="poptitle f-32">活动规则</view>
      <view class="pop-input1 f-30">
        <div class="text-left">
          <p>【邀请朋友开店】邀请奖励金，最高149.8元享不停，所有生意宝用户自注册成功后自动拥有邀请朋友开店的权限</p>
          <p>1. 任何人通过您分享的生意宝会员中心的【邀请好友】功能注册并领取店铺后，该客户即成为您的推荐客户，如该客户购买生意宝【明虾版VIP】或【龙虾版SVIP】权限，您将获得此次购买升级总费用的10%；</p>
          <p>2. 如【龙虾版VIP】开通权限费用为1498元，用户实际支付1498元，您可以获得推荐奖励金为：1498*10%=149.8元； </p>
          <p>3. 如【明虾版VIP】开通权限费用为498元，用户实际支付498元，您可以获得推荐奖励金为：498*10%=49.8元； </p>
          <p>4. 邀请奖励金首年首次按照实付金额的10%计算，次年该客户成功续费后仍按照实付金额的10%计算，若客户持续每年付费，则一直享有该奖励金收益； </p>
          <p>5. 该活动详情信息，会公示在企业官网和其他内容发布渠道，上海旭冉信息科技有限公司保留最终解释权。</p>
        </div>
      </view>
			<view class="drawer-foot-btn f-32 col-f" @tap.stop="show2 = false">确定</view>
    </view>
  </popup>
  <popup-input ref="popupInput" tips="该账号为支付宝提现账号，绑定后不可更改，请确认后再绑定！" placeholder="请输入支付宝帐号"></popup-input>
</view>
</template>

<script>
let App = getApp().globalData;
import popup from '@/components/popup/index';
import popupInput from '@/components/popup-input/index';

export default {
  data() {
    return {
      no_more: false,
      triggered: false,
      showType: 1,
      page: 1,
      last_page: 1,
      can_apply: '1',
      tapItem: 'all',
      nodeList: [],
      list: [],
      title: '',
      content: '',
      show: false,
      show2: false,
      scrollHeight: 0,
      applyCash: '',
      applyCashing: '',
	  account: ''
    };
  },
  components: {
    popupInput,
    popup
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$nextTick(() => {
      this.setListHeight()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  computed: {
  },
  methods: {
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
            // tap高度
        scrollHeight = systemInfo.windowHeight - res[0].height ; // swiper高度
        this.scrollHeight = scrollHeight
      });
    },
    refresherrefresh() {
      this.triggered = true
      this.getData(() => {
        this.triggered = false
      });
    },
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.last_page) {
        this.no_more = true
        return false;
      } // 加载下一页列表
      this.page ++;
      this.getData();
    },
    tapItemClick(type) {
      this.page = 1
      this.tapItem = type
      this.getData()
    },
    getData(next) {
      App._get('shop.rebate.commission/getCommissionList', {
        ispay: this.tapItem == 'pay' ? '1' : '0',
        page: this.page
      }, (result) => {
        if (result.code == '1') {
          this.applyCash = result.data.applyCash || '¥0.00'
          this.applyCashing = result.data.applyCashing || '¥0.00'
          this.can_apply = result.data.can_apply || ''
          this.account = result.data.account || ''
		  
          let list = result.data.list.data || []
          list.forEach(element => {
            element.createTime = element.create_time ? element.create_time.slice(0, 16) : ''
            if (element.paylog) {
              element.paylog.forEach(item => {
                item.createTime = item.create_time ? item.create_time.slice(0, 16) : ''
              })
            }
          });
          if (this.page == 1) {
            this.list = list
          } else {
            this.list = this.list.concat(list)
          }
        } else {
          this.applyCash = ''
          this.applyCsahing = ''
          this.can_apply = '1'
		  this.account = ''
          this.list = []
        }
        next ? next() : ''
      }, () => {
        next ? next() : ''
      });
    },
    showTip(type) {
      if (type == '1') {
        this.showType = 2
        this.title = '提示'
        this.content = '官方审核通过后，48小时到账！'
      }
      if (type == '2') {
        this.show2 = true
      } else {
        this.show = true
      }
    },
    getMoney() {
	  if (this.account) {
        uni.showLoading()
        App._post_form('shop.rebate.commission/applyCommission', {}, (result) => {
          uni.hideLoading()
          // this.$api.msg(result.msg)
          App.showSuccess(result.msg);
          this.getData()
        }, (result) => {
          uni.hideLoading()
        })
	  } else {
		  uni.navigateTo({
		  	url: '/pages/user/qrcodeWithdrawal/index'
		  })
	  }
    },
    hostory() {
      uni.navigateTo({
        url: './hostory/index'
      });
    },
    showBuyList(item) {
      this.nodeList = item.paylog || []
      if (this.nodeList.length > 0) {
        this.showType = 1
        this.title = '购买记录'
        this.content = ''
      } else {
        this.showType = 2
        this.title = '提示'
        this.content = '暂无购买记录'
      }
      this.show = true
    },
    clickmask() {
      this.show = false
    },
    confirm() {
      this.show = false
    },
    close() {
      this.show2 = false
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>