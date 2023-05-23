<template>
  <view class="shopItem" :style="isLast ? 'margin-bottom: 0':  ''">
    <div class="shopBox">
      <div class="contentBox dis-flex flex-y-center" @tap.stop="choiceShop">
        <view class="imgBox">
          <image :src="itemData.logo" alt=""></image>
          <image v-if="itemData.is_offical" class="itemTip" src="https://pic.kaidanxia.com/2020-08-20/20200820142204ba4e15756.png" alt=""></image>
          <image v-else-if="itemData.vip" class="itemTip" :src="'/static/images/' + vips[itemData.vip] + '.png'" alt=""></image>
        </view>
        <view class="content dis-flex flex-y-center">
          <div style="width:520rpx">
            <div class="itemTitle onelist-hidden">
              {{itemData.wxapp_name}}{{itemData.wxapp_remark && itemData.wxapp_remark != '' ? '(' + itemData.wxapp_remark + ')' : ''}}
              <template v-if="itemData.wxapp_level">
                <image v-for="(item, index) in itemData.wxapp_level" :key="index" class="shopGrade" src="/static/images/shopGrade.png"></image>
              </template>
            </div>
            <div class="itemDescribe onelist-hidden">
              <text>
                {{itemData.notice && itemData.notice != '' ? itemData.notice : ('欢迎来到' + itemData.wxapp_name + '~')}}
              </text>
            </div>
          </div>
          <template v-if="!noOpt">
            <div class="optBox dis-flex flex-y-center flex-x-end" @tap.stop="openOpt">
              <div class="opt">
                <text class="optIcon iconfont2 icon-more-mini f-24 col-6"></text>
              </div>
            </div>
          </template>
        </view>
      </div>
      <view v-if="!noOpt" class="butBox dis-flex flex-y-center flex-x-between" @tap.stop>
        <div class="butContent dis-flex flex-y-center">
          <div class="contact">
            <div class="contactBut dis-flex flex-y-center flex-x-center" @tap.stop="toShopInformation">
              <text class="iconfont2 icon-WeChat f-28"></text>
            </div>
          </div>
          <div class="dis-flex flex-y-center flex-x-between" style="width:280rpx">
            <div class="numBox">
              <div class="num col-m">{{itemData.rencent}}</div>
              <div class="numTitle">上新</div>
            </div>
            <div class="numBox">
              <div class="num">{{itemData.dealer_num}}</div>
              <div class="numTitle">已同步</div>
            </div>
            <div class="numBox">
              <div class="num">{{itemData.copy_num}}</div>
              <div class="numTitle">已复制</div>
            </div>
          </div>
        </div>
        <!-- <div class="but move">
          <picker v-if="groupList.length > 0" @change="pickerChange" :value="moveTo" :range="groupList" range-key="group_name">
            移动分组
          </picker>
          <text v-else @tap.stop="showMoveTips">移动分组</text>
        </div>
        <div class="but focus" @tap.stop="focusItem">{{itemData.is_follow ? '已关注' : '设为特别关注'}}</div> -->
        <div class="butOpt dis-flex flex-y-center">
          <div class="but detail" @tap.stop="showItemCard">店铺详情</div>
          <div class="but select" @tap.stop="selectItem">采购</div>
        </div>
      </view>
    </div>
    <div @tap.stop>
      <popup-tips ref="popupTips" title="暂时没有分组，请先创建分组。"></popup-tips>
    </div>
  </view>
</template>

<script>
const App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      isItem: false,
      moveTo: '',
      list: ['男', '女'],
      vips: {
        1: 'xiami',
        2: 'mingxia',
        3: 'mingxia',
        4: 'longxia'
      }
    };
  },
  props:{
    itemData: {
      type: Object,
      default: () =>  {
        return {}
      }
    },
    isLast: {
      type: Boolean,
      default: false
    },
    noOpt: {
      type: Boolean,
      default: false
    },
    groupList: {
      type: Array,
      default: () =>  {
        return []
      }
    }
  },

  components: {
    popupTips
  },

  methods: {
    // 店铺资料
    toShopInformation() {
      this.$emit('toShopInformation', this.itemData)
    },
    showItemCard() {
      this.$emit('showDetailCard', this.itemData)
    },
    focusItem() {
      let objFocus = {
        wxapp_id: this.itemData.wxapp_id,
        type: this.itemData.is_follow ? '1' : '2'
      }
      App._post_form('user/addFollow', {
          follow: JSON.stringify(objFocus)
      }, (result) => {
        this.closeOpt()
        this.$emit('getGroup')
        this.tui.toast(this.itemData.is_follow ? '已取关' : '已关注')
      });
    },
    selectItem() {
			uni.navigateTo({
				url:'/pages/retailShop/shopAbout/shopDetail/index?wxapp_id=' + this.itemData.wxapp_id
			})
    },
    showMoveTips() {
      this.$refs.popupTips.open()
    },
    pickerChange(e) {
      let val = e.detail.value
      let ids = {
        wxapp_id: this.itemData.wxapp_id,
        group_id: this.groupList[val].group_id
      }
      App._post_form('user/moveStoreGroup', {
        ids: JSON.stringify(ids)
      }, result => {
        this.$emit('getGroup')
        this.tui.toast(result.msg)
      });
    },
    openOpt() {
      this.$emit('openOpt', this.itemData)
    },
    closeItemOpt () {
      if (this.isItem) {
        this.isItem = false
      } else {
        this.closeOpt()
      }
    },
    closeOpt() {
    },
    choiceShop() {
      App.wxapp_id = this.itemData.wxapp_id;
      wx.setStorageSync("wxapp_id", this.itemData.wxapp_id)
      // this.back();
			uni.reLaunch({
				url:'/pages/index/index'
			})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>