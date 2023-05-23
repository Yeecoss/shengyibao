<template>
    <div class="cardBox">
      <div class="card">
        <div class="titleBox dis-flex flex-y-center flex-x-between">
          <div class="title">VIP{{member}}</div>
          <div class="tips" @tap.stop="toExchange">使用兑换码</div>
        </div>
        <div class="content dis-flex flex-y-center flex-x-between">
          <div class="item" :class="checkItem == '1' ? 'checkItem1' : ''" @tap.stop="check('1')">
            <div class="name">虾米VIP</div>
            <div class="price priceCol1">永久免费</div>
            <div class="linePrice">领取{{member}}</div>
          </div>
          <div class="item" :class="checkItem == '2' ? 'checkItem2' : ''" @tap.stop="check('2')">
            <div class="name">龙虾SVIP包年</div>
            <div class="price priceCol2">
              <text class="f-28">￥</text>
              1498
            </div>
            <div class="linePrice textLine">
              ¥2998
            </div>
          </div>
          <div class="item" :class="checkItem == '3' ? 'checkItem3' : ''" @tap.stop="check('3')">
            <div class="vipHeard vipHeard2" @tap.stop="getVip3">领取体验版VIP</div>
            <div class="name">明虾VIP包年</div>
            <div class="price priceCol3">
              <text class="f-28">￥</text>498
            </div>
            <div class="linePrice textLine">¥998</div>
          </div>
        </div>
        <div class="Canva"><image src="https://pic.kaidanxia.com/2020-09-11/161201d3cd88318.gif" mode="widthFix" @tap.stop="showCanva"></image></div>
      </div>
    </div>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
      member: App.member
    };
  },

  components: {
  },
  props: {
    userInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    checkItem: {
      type: String,
      default: '1'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
    getVip3() {
      if (!this.userInfo.vip || (this.userInfo.vip == '' || this.userInfo.vip <= 2 || this.userInfo.vip <= 3)) {
        uni.showLoading()
        App._post_form('vip.collection/getExperienceVip', {}, (result) => {
          this.$api.msg(result.msg)
          this.$emit('getData')
        }, false, () => {
          uni.hideLoading()
        })
      } else {
        let obj = {
          1: '虾米' + this.member,
          2: '体验' + this.member,
          3: '明虾' + this.member,
          4: '龙虾' + this.member,
        };
        this.$api.msg('当前已是' + obj[this.userInfo.vip] + '，有效期为' + this.userInfo.vip_expireText + '天')
      }
    },
    check(val) {
      this.$emit('check', val)
    },
    toExchange() {
      uni.navigateTo({
        url: '/pages/user/member/exchange/index',
      });
    },
    showCanva() {
      uni.navigateTo({
        url: '/pages/user/canvas/index'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>