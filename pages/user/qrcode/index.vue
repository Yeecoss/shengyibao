<template>
<view class="qrcode">
  <!-- 自定义标题栏 -->
  <navigationBar :title="title" extClass="nav" id="top"></navigationBar>
  <view class="container">
    <div class="qrcodeBox">
      <div class="qrcodeTitBox">
        <div class="qrcodeTitle">{{title}}</div>
        <div class="qrcodeTitContent">{{content}}</div>
        <div class="leftIconBox">
          <div class="icon"></div>
        </div>
        <div class="rightIconBox">
          <div class="icon"></div>
        </div>
      </div>
      <div class="imgBox">
        <div class="qrcodeImgBox" v-if="formData.qrcodeImg != ''">
          <image class="qrcodeImg imageDefault" :src="formData.qrcodeImg"></image>
          <div class="botIcon" @tap.stop="openItem()">
            <text class="choose__icon iconfont2 icon-Uploadphoto"></text>
          </div>
        </div>
        <div v-else class="checkImg" @tap.stop="openItem()">
            <text class="choose__icon iconfont2 icon-Uploadphoto"></text>
            <div class="checkImgText">上传图片</div>
        </div>
      </div>
      <div class="logoBox">
        <div class="leftLine"></div>
        <image src="/static/images/kaidanxia.png"></image>
        <div class="rightLine"></div>
      </div>
    </div>
  </view>
  <view class="footer">
    <button @tap.stop="submit">完成</button>
  </view>
</view>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
      formData: {
        qrcodeImg: ''
      },
      content: '',
      title: '',
      fieldName: '',
      showObj: {
        service_qrcode: {
          title: '店铺二维码',
          content: '上传微信二维码，用于客户咨询服务，方便用户完成下单。'
        },
        wxpay_qrcode: {
          title: '微信收款码',
          content: '上传微信收款码，方便客户支付订单。'
        },
        alpay_qrcode: {
          title: '支付宝收款码',
          content: '上传支付宝收款码，方便客户支付订单。'
        }
      }
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fieldName = options.fieldName || ''
    this.formData.qrcodeImg = options.url || ''
    this.title = this.showObj[this.fieldName] ? this.showObj[this.fieldName].title : ''
    this.content = this.showObj[this.fieldName] ? this.showObj[this.fieldName].content : ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
    // 提交数据
    submit() {
      let state = this.formData.qrcodeImg
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面
			if (prevPage.$vm.change) {
			  prevPage.$vm.change(this.fieldName, state)
			}
			uni.navigateBack();
    },
    change(fieldName, val) {
      this.formData.qrcodeImg = val
    },
    openItem() {
      uni.chooseImage({
        count: 1,
        // #ifdef H5 || MP
        sizeType: ['compressed', 'original'],
        // #endif
        // #ifdef APP-PLUS
        sizeType: ['compressed', 'original'],
        // #endif
        sourceType: ['album', 'camera'],
        success: res => {
          // #ifdef H5 || MP
          if (res.tempFiles[0].size <= 2048000) {
          // #endif
          const tempFilePaths = res.tempFilePaths[0];
          uni.navigateTo({
            url: '../cropper-default/cropper-default?fieldName=qrcodeImg&src=' + tempFilePaths
          });
          // #ifdef H5 || MP
          } else {
            App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
          }
          // #endif
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>