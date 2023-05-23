<template>
<view>
  <div class="wxImgBg" v-show="showImg">
    <div class="wxImgBox">
      <image class="bgImg" src="/static/images/wxImgbg.png"></image>
      <div class="wxImgTip">
        客服二维码
      </div>
      <image @tap.stop="onPreviewSkuImage(user.service_qrcode)" show-menu-by-longpress class="wxImg" :src="user.service_qrcode"></image>
      <text class="close iconfont2 icon-shanchu1" @tap.stop="closeImg"></text>
    </div>
  </div>
  <!-- 菜单栏 -->
	<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
  <!-- 提示弹窗 -->
  <popup-tips ref="popupTips" :title="title" :content="content" @tipsCallback="tipsCallback" :confirmText="confirmText"></popup-tips>
</view>
</template>

<script>
const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
const App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      showActionSheet: false,
      // 选择
      itemList: [{
        text: "电话",
        color: "#333333"
      }, {
        text: "微信",
        color: "#333333"
      }, {
        text: "微信二维码",
        color: "#333333"
      }],
      title: '',
      content: '',
      confirmText: '',
      showImg: false
    };
  },

  components: {
    popupTips
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },

  methods: {
    open() {
      this.showActionSheet = true
    },
    tipsCallback () {
      if (this.title == '手机号') {
        uni.makePhoneCall({
            phoneNumber: this.content
        })
      } else {
        thorui.getClipboardData(this.content, (res) => {
          if (res) {
            this.tui.toast("复制成功")
          } else {
            this.tui.toast("复制失败")
          }
        })
      }
    },
    copyAddress() {
      let country = this.user.country || ''
      let province = this.user.province || ''
      let city = this.user.city || ''
      let address_detail = this.user.address_detail || ''
      let address = country + province + city + address_detail
      if (address == '') {
        this.tui.toast("无地址信息！")
        return false
      }
      this.title = '地址'
      this.content = address
      this.confirmText = '复制'
      this.$refs.popupTips.open()
    },
    closeActionSheet() {
      this.showActionSheet = false
    },
    itemClick(e) {
      this.closeActionSheet()
      if (e.index == 0) {
        this.title = '手机号'
        let phone = this.user.phone || ''
        if (phone == '') {
          this.tui.toast("无手机号信息！")
          return false
        }
        this.content = phone
        this.confirmText = '拨打'
        this.$refs.popupTips.open()
      } else if (e.index == 1) {
        this.title = '微信号'
        let wechat_id = this.user.wechat_id || ''
        if (wechat_id == '') {
          this.tui.toast("无微信号信息！")
          return false
        }
        this.content = wechat_id
        this.$refs.popupTips.open()
        this.confirmText = '复制'
      } else if (e.index == 2) {
        let service_qrcode = this.user.service_qrcode || ''
        if (service_qrcode == '') {
          this.tui.toast("无二维码信息！")
          return false
        }
        this.showImg = true
      }
    },
    closeImg() {
      this.showImg = false
    },/**
     * 预览图片
     */
    onPreviewSkuImage(url) {
      wx.previewImage({
        current: url,
        urls: [url]
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>