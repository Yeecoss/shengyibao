<template>
    <div class="cardBox">
      <div class="card">
        <div class="titleBox dis-flex flex-y-center flex-x-between">
          <div class="title">做任务领{{member}}</div>
          <div class="tips" @click="toHostory">
            会员领取记录
            <text class="iconfont2 icon-more1"></text>
          </div>
        </div>
        <div class="content">
          <div class="listItem dis-flex flex-y-center">
            <div class="imgBox imgBg1">
              <text class="iconfont2 icon-shop2"></text>
            </div>
            <div class="widBox"></div>
            <div class="lineBox dis-flex flex-y-center">
              <div class="infoBox">
                <div class="name">店铺指引</div>
                <div class="info">每完成一个店铺指引任务+7天{{member}}</div>
              </div>
              <div class="optBox" @tap.stop="toInvite">
                <div class="but">领取{{member}}</div>
                <div class="VIPAdd">VIP+7天</div>
              </div>
            </div>
          </div>
          <div class="listItem dis-flex flex-y-center">
            <div class="imgBox imgBg2">
              <text class="iconfont2 icon-InviteFriends"></text>
            </div>
            <div class="widBox"></div>
            <div class="lineBox dis-flex flex-y-center">
              <div class="infoBox">
                <div class="name">邀请好友</div>
                <div class="info">邀好友 领{{member}}</div>
              </div>
              <div class="optBox" @tap.stop="toShare">
                <div class="but">去做任务</div>
                <div class="VIPAdd1">领现金</div>
              </div>
            </div>
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
    toInvite() {
      uni.reLaunch({
        url: '/pages/retailShop/index?task=1',
      });
    },
    toShare() {
      uni.navigateTo({
        url: '/pages/user/member/invite/index',
      });
    },
    toHostory () {
			uni.navigateTo({
				url: '/pages/user/member/hostory/index'
			})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>