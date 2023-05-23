<template>
    <div class="cardBox">
      <div class="card">
        <div class="titleBox dis-flex flex-y-center flex-x-between">
          <div class="title">{{member}}特权</div>
          <div class="tips" @tap.stop="toSpecial">查看特权对比
            <text class="iconfont2 icon-more1"></text>
          </div>
        </div>
        <div class="content dis-flex flex-y-center flex-x-between" :class="'content' + checkItem">
          <div class="item" v-for="(item, index) in list" :key="index" :class="checkItems[checkItem][item.id] ? 'checkItem' : ''">
            <div class="imgBox">
              <text class="iconfont2" :class="item.icon"></text>
            </div>
            <div class="name">{{item.name}}</div>
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
      member: App.member,
      checkItems: {
        1:{
          1: true,
          2: true,
          3: false,
          4: false,
          5: false,
        },
        2:{
          1: true,
          2: true,
          3: true,
          4: true,
          5: true,
        },
        3:{
          1: true,
          2: true,
          3: true,
          4: true,
          5: false,
        }
      },
      list: [
        {
          id: '1',
          name: '商品管理',
          icon: 'icon-commodity1'
        },
        {
          id: '2',
          name: '订单流转',
          icon: 'icon-roam'
        },
        {
          id: '3',
          name: '数据汇总',
          icon: 'icon-data'
        },
        {
          id: '4',
          name: '浏览轨迹',
          icon: 'icon-scanpaths'
        },
        {
          id: '5',
          name: '发展渠道',
          icon: 'icon-retailstore'
        }
      ]
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
    toSpecial() {
      uni.navigateTo({
        url: '/pages/user/member/member-special/index',
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
@import "./index.scss";
</style>