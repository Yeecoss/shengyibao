<template>
<view class="invite">
<!-- 自定义标题栏 -->
<navigationBar title="邀请好友" extClass="nav" id="top"></navigationBar>
<view class="container">
  <div class="imgBox">
    <image mode="aspectFit" src="https://pic.kaidanxia.com/2020-09-03/20200903102121024157422.png"></image>
  </div>
  <div class="progressBox">
    <div class="progress">
      <div class="progressBg">
        <div class="activeBg" :style="'width:' + activeWidth + 'rpx'">
            <div class="topTipsBox" v-if="num > 0">
              <div class="topTips">
                <text>已邀请{{num}}人</text>
                <div class="triangle"></div>
              </div>
            </div>
        </div>
        <div class="progressList dis-flex flex-y-center flex-x-between">
          <div class="progressItem" :class="num >= 5 ? 'progressItemActive' : ''">
            <!-- <div class="topTipsBox">
              <div class="topTips" v-if="show1">
                <text v-if="num < 5">已邀请{{num}}人</text>
                <text v-else>已领取</text>
                <div class="triangle"></div>
              </div>
            </div> -->
            <div class="bottomTips">邀请5人</div>
          </div>
          <div class="progressItem" :class="num >= 10 ? 'progressItemActive' : ''">
            <!-- <div class="topTipsBox">
              <div class="topTips" v-if="num > 5 && show2">
                <text v-if="num < 10">已邀请{{num}}人</text>
                <text v-else>已领取</text>
                <div class="triangle"></div>
              </div>
            </div> -->
            <div class="bottomTips">邀请10人</div>
          </div>
          <div class="progressItem" :class="num >= 20 ? 'progressItemActive' : ''">
            <!-- <div class="topTipsBox">
              <div class="topTips" v-if="num > 10 && show3">
                <text v-if="num < 20">已邀请{{num}}人</text>
                <text v-else>已领取</text>
                <div class="triangle"></div>
              </div>
            </div> -->
            <div class="bottomTips">邀请20人</div>
          </div>
          <div class="progressItem" :class="num >= 50 ? 'progressItemActive' : ''">
            <!-- <div class="topTipsBox">
              <div class="topTips" v-if="num > 20 && show4">
                <text v-if="num < 50">已邀请{{num}}人</text>
                <text v-else>已领取</text>
                <div class="triangle"></div>
              </div>
            </div> -->
            <div class="bottomTips">邀请50人</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="tipsBox">
    <div class="tips">
      <div class="tipTitle f-w">
        邀请规则
      </div>
      <div class="content">
        <div>1.拉5位新用户获取7天明虾{{member}}期延长；拉10位新用户获取14天明虾{{member}}期延长；拉20位新用户获取30天明虾{{member}}期延长。</div>
        <div>2.邀请新用户数量累计叠加，达到上述数量要求后自动解锁对应权益。</div>
        <div class="f-w">3.全民推荐奖励金：凡是通过当前页面进行邀请注册的用户，除了累计叠加延长{{member}}期，还享有官方全民推荐官奖励，
          <text class="mainText">用户购买{{member}}后你将能获得相应的现金奖励(49.8-149.8元)，并能进行提现，次年续费后，仍享有对应奖励。</text>
          <div class="toInviteBox" @tap.stop="toInvite">
            <div class="toInvite">
              去提现
            </div>
            <image class="money" src="https://pic.kaidanxia.com/2020-09-03/20200903102121b614d2669.png"></image>
            《提现规则》
          </div>
        </div>
        <div class="colBlue f-w">
          附：必须通过当前页面的邀请功能邀请用户才能生效相关的会员延期和现金奖励！
        </div>
      </div>
      <image class="foot" src="https://pic.kaidanxia.com/2020-09-03/202009031021226a4392802.png"></image>
    </div>
  </div>
  <div class="butBox">
		<!-- #ifdef MP -->
    <button class="but" open-type="share">去邀请</button>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
    <button class="but" @tap.stop="toShare">去邀请</button>
		<!-- #endif -->
  </div>
</view>
</view>
</template>

<script>
let App = getApp().globalData;
let shareList = ['店主都在用这软件，你也看下！', '店主开店更方便，你也瞅瞅！', '店主必备工具，你也试试！', '开店、开单就用生意宝！', '不用刷屏朋友圈了，用这个！']

let shareText = shareList[Math.floor(Math.random()*5)]

let shareImgList = ['https://pic.kaidanxia.com/2020-08-21/20200821112903e13230475.jpg', 'https://testpic.kaidanxia.com/2020-12-08/092821d9e9a5758.png', 'https://testpic.kaidanxia.com/2020-12-08/0928219e6650129.png']
let shareImg = shareImgList[Math.floor(Math.random()*3)]
let wid = App.myShopInfo.wxapp_id

export default {
  data() {
    return {
      member: App.member,
      activeWidth: 0,
      num: 0,
      code: '',
      show1: true,
      show2: true,
      show3: true,
      show4: true
    };
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    return {
      title: shareText,
      path: "/pages/index/index?invitation_code=" + this.code + '&wid=' + wid,
      imageUrl: shareImg
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo()
    this.randomText()
  },
  computed: {
  },
  methods: {
    toShare() {
		let data = {
			provider: 'weixin',
			scene: "",
			type: 5,
			imageUrl: shareImg,
			title: shareText,
			miniProgram: {
				id: App.applets_id,
				path: "/pages/index/index?invitation_code=" + this.code + '&wid=' + wid,
				type: 0,
				webUrl: 'http://uniapp.dcloud.io'
			},
			success: ret => {
				// console.log(JSON.stringify(ret));
			},
			fail: ret => {
				// 分享失败
				// console.log(JSON.stringify(ret))
			}
		}
		uni.share(data);
    },
    randomText() {
      shareText = shareList[Math.floor(Math.random()*5)]
      shareImg = shareImgList[Math.floor(Math.random()*3)]
    },
    toInvite() {
      uni.navigateTo({
        url: '/pages/user/member/withdrawal/index'
      });
    },
    setActiveWidth() {
      if (this.num == 0) {
        this.activeWidth = 0
      } else if (this.num < 5) {
        this.activeWidth = 76 * this.num / 5
      } else if (this.num == 5) {
        this.activeWidth = 76
      } else if (this.num > 5 && this.num <= 10) {
        this.activeWidth = 76 + 142 * (this.num - 5) / 5
      } else if (this.num > 10 && this.num <= 20) {
        this.activeWidth = 218 + 144 * (this.num - 10) / 10
      } else if (this.num > 20 && this.num <= 50) {
        this.activeWidth = 362 + 142 * (this.num - 20) / 30
      } else {
        this.activeWidth = 600
      }
    },
    getInfo() {
      App._get('vip.collection/getinvitationCode', {}, (result) => {
        if (result.code == '1') {
          this.num =  result.data.invitation_num
          this.code = result.data.invitation_code
          wid = result.data.wxapp_id
        } else {
          this.num = 0
          this.code = ''
        }
        this.setActiveWidth()
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>