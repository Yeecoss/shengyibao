<template>
<view>
  <!-- 菜单栏 -->
	<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
  <!-- 提示弹窗 -->
  <popup-tips ref="popupTips" :title="title" :content="content" @tipsCallback="tipsCallback" :confirmText="confirmText"></popup-tips>
  <div class="wxImgBg" v-show="showImg">
    <div class="wxImgBox">
      <image class="bgImg" src="/static/images/wxImgbg.png"></image>
      <div class="wxImgTip">
        客服二维码
      </div>
      <image @tap.stop="onPreviewSkuImage(service_qrcode)" show-menu-by-longpress class="wxImg" :src="service_qrcode"></image>
      <text class="close iconfont2 icon-shanchu1" @tap.stop="closeImg"></text>
    </div>
  </div>
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
        color: "#333333",
        type: 'isHave',
        val: '1'
      }, {
        text: "微信",
        color: "#333333",
        type: 'isHave',
        val: '1'
      }, {
        text: "微信二维码",
        color: "#333333",
        type: 'isHave',
        val: '1'
      }],
      address: '',
      title: '',
      content: '',
      confirmText: '',
      showImg: false,

      service_qrcode: '',
      wechat_id: '',
      contact_phone: ''
    };
  },

  components: {
    popupTips
  },
  props: {
  },

  methods: {
    open(obj) {
      if (obj.open_contact && obj.open_contact == '1') {
        this.showActionSheet = true
        if (!obj.contact_phone || obj.contact_phone == '') {
          this.itemList[0].val = ''
          this.contact_phone = ''
        } else {
          this.contact_phone = obj.contact_phone
          this.itemList[0].val = '1'
        }
        if (!obj.wechat_id || obj.wechat_id == '') {
          this.wechat_id = ''
          this.itemList[1].val = ''
        } else {
          this.wechat_id = obj.wechat_id
          this.itemList[1].val = '1'
        }
        if (!obj.service_qrcode || obj.service_qrcode == '') {
          this.itemList[2].val = ''
          this.service_qrcode = ''
        } else {
          this.service_qrcode = obj.service_qrcode
          this.itemList[2].val = '1'
        }
      } else {
        this.$api.msg('对方未公开联系方式！')
      }
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
    closeActionSheet() {
      this.showActionSheet = false
    },
    itemClick(e) {
      this.closeActionSheet()
      if (e.index == 0) {
        this.title = '手机号'
        let contact_phone = this.contact_phone || ''
        if (contact_phone == '') {
          this.tui.toast("无手机号信息！")
          return false
        }
        this.content = contact_phone
        this.confirmText = '拨打'
        this.$refs.popupTips.open()
      } else if (e.index == 1) {
        this.title = '微信号'
        let wechat_id = this.wechat_id || ''
        if (wechat_id == '') {
          this.tui.toast("无微信号信息！")
          return false
        }
        this.content = wechat_id
        this.$refs.popupTips.open()
        this.confirmText = '复制'
      } else if (e.index == 2) {
        let service_qrcode = this.service_qrcode || ''
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