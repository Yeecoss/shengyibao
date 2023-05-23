<template>
  <div class="cardBox">
    <div class="card">
      <div class="titleBox dis-flex flex-y-center flex-x-between">
        <div class="title">增值服务</div>
        <div class="tips">
          <text class="iconfont2 icon-more1"></text>
        </div>
      </div>
      <div class="content dis-flex flex-y-center flex-x-between">
        <div class="item" v-for="(item, index) in list" :key="index" :class="checkItem == item.id ? 'checkItem' : ''" @tap.stop="check(item)">
          <div class="name">{{item.name}}</div>
          <div class="itemTips f-24">{{item.tips}}</div>
        </div>
      </div>
    </div>
    <popup-increment ref="popupIncrement" @confirm="confirm" :confirmText="confirmText"></popup-increment>
  </div>
</template>

<script>
let App = getApp().globalData;
import popupIncrement from '@/components/popup-increment'
export default {
  data() {
    return {
      checkItem: '1',
      confirmText: '立即购买',
      list: [
        {
          id: '1',
          name: '浏览轨迹',
          price: '100条/100元',
          tips: '谁看过我、看了多少次',
          content: '谁看过我的店铺的商品，看了多少次，通过浏览轨迹统计可以添加用户微信或拨打电话进行二次营销。龙虾SVIP版本可无限次免费解锁浏览轨迹。',
          isBuySvip: 1,
          confirmText: '立即购买',
          successTxt: '恭喜您，成功购买100条浏览轨迹查看权限',
          rights: '5'
        },
        {
          id: '2',
          name: '物流查询',
          price: '1000条/55元',
          tips: '一键查询订单物流轨迹',
          content: '买卖双方均可以一键查询包裹流转信息，再也不用手动复制物流单号发给客户，客户可以在订单页面自主查询。',
          confirmText: '立即购买',
          successTxt: '恭喜您，成功购买1000条物流查询权限',
          rights: '6'
        },
        {
          id: '3',
          name: '直播权限',
          price: '100小时/？元（体验价）',
          tips: '高清直播卖货',
          content: '小程序、app内直播，可以上架商品，直播过程中可以跟客户发生互动。',
          confirmText: '确定',
          successTxt: '恭喜您，成功购买100小时直播权限'
        },
        {
          id: '4',
          name: '预约取件',
          price: '1元开通',
          tips: '预约快递员上门取件',
          content: '一键下单给快递公司，预约快递员上门取件，让发货更加便捷高效。',
          confirmText: '确定',
          successTxt: '恭喜您，成功购买预约快递员上门取件服务'
        }
      ]
    };
  },

  components: {
    'popup-increment': popupIncrement
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
  },
  methods: {
    check(item) {
      this.confirmText = App.ios ? '确定' : item.confirmText
      this.checkItem = item.id
      this.$refs.popupIncrement.open(item)
    },
    confirm(item) {
      if (App.ios) {
        return
      }
      if (item.id == 1 || item.id == 2) {
        // #ifdef MP || APP-PLUS
        let data = {
          rights: item.rights
        }
        uni.showLoading()
        App._post_form('weixin.mini_program/appletsPay', data, (result) => {
          if (result.code == '1') {
            let data =  result.data
            let that = this
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: 'MD5',
              paySign: data.paySign,
              sign: data.sign,
              success(res) {
                that.$api.msg(item.successTxt)
              },
              fail(res) {
                // console.log(res)
              },
              complete(res) {
                // console.log(res)
              }
            });
          } else {
            App.showSuccess(result.msg);
          }
        }, false, () => {
          uni.hideLoading()
        })
        /* #endif */
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>