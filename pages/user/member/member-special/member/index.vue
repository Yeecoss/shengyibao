<template>
    <div class="cardBox">
      <div class="card">
        <div class="titleBox dis-flex flex-y-center flex-x-between">
          <div class="title">VIP{{member}}</div>
          <div class="tips" @tap.stop="toExchange">使用兑换码</div>
        </div>
        <div class="content dis-flex flex-y-center flex-x-between">
          <div class="item" :class="checkItem == '1' ? 'checkItem1' : ''" @tap.stop="clickItem('1')">
            <div class="name">虾米VIP</div>
            <div class="price priceCol1">永久免费</div>
            <div class="linePrice">领取{{member}}</div>
          </div>
          <div class="item" :class="checkItem == '2' ? 'checkItem2' : ''" @tap.stop="clickItem('2')">
            <div class="name">龙虾SVIP包年</div>
            <div class="price priceCol2">
              <text class="f-28">￥</text>
              1498
            </div>
            <div class="linePrice textLine">
              ¥2998
            </div>
          </div>
          <div class="item" :class="checkItem == '3' ? 'checkItem3' : ''" @tap.stop="clickItem('3')">
            <div class="name">明虾VIP包年</div>
            <div class="price priceCol3">
              <text class="f-28">￥</text>498
            </div>
            <div class="linePrice textLine">¥998</div>
          </div>
        </div>
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
    clickItem(type) {
      this.$emit('upCheckItem', type)
    },
    toExchange() {
      uni.navigateTo({
        url: '/pages/user/member/exchange/index',
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/common.scss";
@import "./index.scss";
</style>