<template>
<view class="containerBox">
<view class="container">
  <div class="heardBox">
    <div style="background: white;">
      <div class="heardBg">
        <!-- 自定义标题栏 -->
        <navigationBar :title="member + '中心'" extClass="nav" id="top" background="linear-gradient(275deg, #818181 0%, #4a4a4a 100%)" color="white"></navigationBar>
      </div>
      <member-card ref="memberCard" :userInfo="userInfo" :checkItem="checkItem" @check="check" @showTips="showTips"></member-card>
    </div>
    <div class="privilege bgW">
      <privilege :checkItem="checkItem"></privilege>
    </div>
    <div class="member bgW m-top">
      <member :checkItem="checkItem" :userInfo="userInfo" @check="check" @getData="getData"></member>
    </div>
    <div class="task bgW m-top">
      <task></task>
    </div>
    <div class="special bgW m-top">
      <special></special>
    </div>
    <div class="increment bgW m-top">
      <increment></increment>
    </div>
    <div class="recommend bgW m-top">
      <recommend @showOfficial="showOfficial"></recommend>
    </div>
    <div class="introduce bgW m-top">
      <introduce></introduce>
    </div>
    <div class="butBox bgW m-top">
      <div class="receiveBut" :class="'receiveBut' + checkItem" @tap.stop="showTips1(checkItem)">{{checkItemBut[checkItem]}}</div>
    </div>
    <popup :show="show">
      <div class="tipsBox">
      <view class="tipsImgBox dis-flex flex-y-center flex-x-center">
        <image mode="aspectFit" class="tipsBg" :src="types[type].bgUrl"></image>
        <view class="tipsImg">
          <image mode="aspectFit" :src="types[type].url"></image>
        </view>
      </view>
        <div class="title" :style="{color: types[type].color}">
          {{types[type].title}}
        </div>
        <div class="content">
          {{types[type].content}}
        </div>
        <div class="tipsButBox" :style="{background: types[type].butBg}" @tap.stop="closeTips">
          确定
        </div>
      </div>
    </popup>
    <popup-official ref="popupOfficial"></popup-official>
  </div>
</view>
</view>
</template>

<script>
let App = getApp().globalData;
import popup from '@/components/popup/index';
import popupOfficial from '@/components/popup-official/index';

import increment from './common/increment/index';
import introduce from './common/introduce/index';
import member from './common/member/index';
import privilege from './common/privilege/index';
import recommend from './common/recommend/index';
import special from './common/special/index';
import task from './common/task/index';
import memberCard from './common/member-card/index';


export default {
  data() {
    return {
      member: App.member,
		userInfo: {},
      checkItem: '1',
      checkItemBut: {
        1: '立即领取',
        2: '立即购买',
        3: '立即购买'
      },

      show: false,
      type: '3',
      types: {
        1: {
          color: '#BAB6B9',
          butBg: '#BAB6B9',
          title: '领取成功!',
          content: '您已成为虾米' + App.member,
          url: 'http://pic.kaidanxia.com/2020-07-15/20200715155646489ee6716.png',
		  bgUrl: 'http://pic.kaidanxia.com/2020-07-15/202007151556493a6148442.png',
		  vip: 1
        },
        2: {
          color: '#F1BA68',
          butBg: '#FF7541',
          title: '购买成功！',
          content: '您已成为龙虾' + App.member,
          url: 'http://pic.kaidanxia.com/2020-07-15/20200715155649423a99239.png',
		  bgUrl: 'http://pic.kaidanxia.com/2020-07-15/20200715155648800ca7992.png',
		  vip: 4
        },
        3: {
          color: '#F1BA68',
          butBg: '#F1BA68',
          title: '购买成功！',
          content: '您已成为明虾' + App.member,
          url: 'http://pic.kaidanxia.com/2020-07-15/202007151556481c3d97259.png',
		  bgUrl: 'http://pic.kaidanxia.com/2020-07-15/20200715155649918a22091.png',
		  vip: 3
        }
      }
    };
  },

  components: {
    increment,
    introduce,
    member,
    privilege,
    recommend,
    special,
    task,
    memberCard,
    popup,
    popupOfficial
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  this.getData()
  },
  methods: {
	  getData() {
        App._get('user.index/vipDetail', {}, (result) => {
          if (result.code == '1') {
            let data = result.data.userInfo || {}
            data.vip_expireText = data.vip_expire ? data.vip_expire.substring(0, 10) : ''
            this.userInfo = data
            let index = 1
            if (this.userInfo.vip == '2' || this.userInfo.vip == '3') {
              index = 3
            } else if (this.userInfo.vip == '4') {
              index = 2
            }
            this.$refs.memberCard.updata(index)
          }
        })
	  },
    closeTips() {
      this.show = false
    },
    showTips1(type) {
      if (!this.userInfo.vip || (this.userInfo.vip == '' || this.userInfo.vip <= this.types[type].vip || this.userInfo.vip <= this.types[type].vip1)) {
        this.showTips(type)
      } else {
        let obj = {
          1: '虾米' + this.member,
          2: '体验' + this.member,
          3: '明虾' + this.member,
          4: '龙虾' + this.member,
        }
        this.$api.msg('当前已是' + obj[this.userInfo.vip] + this.member + '，有效期为' + this.userInfo.vip_expireText + '天')
      }
    },
    payMember() {

    },
    showTips(type) {
      let next = () => {
        this.type = type
        this.show = true
        this.getData()
      }
      if (type == 1) {
        uni.showLoading()
        App._post_form('vip.collection/getXiamiVip', {}, (result) => {
          if (result.code == '1') {
            next()
          } else {
            App.showSuccess(result.msg);
          }
        }, false, () => {
          uni.hideLoading()
        })
      } else {
        if (App.ios) {
          this.showOfficial()
          return
        }
        let data = {}
        if (type == 2) {
          data.rights = '4'
        }
        if (type == 3) {
          data.rights = '3'
        }
        /* #ifdef APP-PLUS */
          data.platform = 'app'
        /* #endif */
        uni.showLoading();
        App._post_form('weixin.mini_program/appletsPay', data, (result) => {
          if (result.code == '1') {
            let data =  result.data
            let that = this
            let data1 = {}
            /* #ifdef MP */
            data1 = {
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: 'MD5',
              paySign: data.paySign,
              sign: data.sign,
              success(res) {
                next()
              },
              fail(res) {
                // console.log(res)
              },
              complete(res) {
                // console.log(res)
              }
            }
            /* #endif */
            /* #ifdef APP-PLUS || H5 */
            data1 = {
              provider: 'wxpay',
              orderInfo: JSON.stringify(data),
              success(res) {
                next()
              },
              fail(res) {
                // console.log(res)
              },
              complete(res) {
                // console.log(res)
              }
            }
            /* #endif */
            wx.requestPayment(data1);
          } else {
            App.showSuccess(result.msg);
          }
        }, (result) => {
          // console.log(result)
        }, () => {
          uni.hideLoading()
        })
          
        // #ifdef H5
        this.showOfficial()
        /* #endif */
      }
    },
    showOfficial() {
       this.$refs.popupOfficial.open()
    },
    check(val, isHeard) {
      this.checkItem = val
      if (!isHeard) {
        this.$refs.memberCard.updata(val)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>