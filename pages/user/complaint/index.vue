<template>
<view class="containerBox">
  <!-- 自定义标题栏 -->
  <navigationBar title="投诉举报" extClass="nav" id="top"></navigationBar>
  <view class="container">
    <view class="help cont-box b-f">
      <view>
        <text class="h4">跳转腾讯110举证</text>
      </view>
      <view class="content">
        <text class="p"> 如您在使用过程中，发现店铺主内出现违法犯罪内容，请您收集相关证据并保存，及时向官方投诉和通过下方腾讯110举报按钮进行举报。官方会及时进行处理违法犯罪内容并配合有关部门核查，官方对任何违反犯罪的行为零容忍，与用户共同维护良好的使用环境。</text>
      </view>
    </view>
  </view>
  <div class="footer dis-flex">
    <div class="footerItem dis-flex flex-x-center">
      <navigator class="but but2" target="miniProgram" app-id="wxcf1f51ec21883acf">腾讯110举报</navigator>
    </div>
  </div>
  <popup-tips ref="popupTips0" title="提示" content="请选择投诉方式" confirmText="二维码" concelText="手机号"></popup-tips>
  <popup-tips ref="popupTips" :title="title" :content="content" confirmText="拨打" @tipsCallback="tipsCallback"></popup-tips>
  <!-- 菜单栏 -->
	<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
  <share-bottom ref="shareBottom"></share-bottom>
</view>
</template>

<script>
const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
let App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';
import shareBottom from '@/components/share-bottom/index';

export default {
  data() {
    return {
      title: '',
      content: '',
      showActionSheet: false,
      itemList: [{
        text: "官方公众号",
        color: "#333333"
      }, {
        text: "官方电话",
        color: "#333333"
      }],
			qrcode:''
    };
  },

  components: {
    popupTips,
		shareBottom
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
    onPreviewImages() {
      let imageUrls = ['http://pic.kaidanxia.com/2020-08-12/20200812104437d3d307157.jpg'];
    
      wx.previewImage({
        current: 0,
        urls: imageUrls
      });
    },
    official() {
			this.$refs.popupTips0.open(()=>{
				// this.qrcode = 'https://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png';
				// this.$refs.shareBottom._popupShowImg('下载',this.qrcode)
				uni.previewImage({
				  urls: ['https://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png'],
				})
			},()=>{
				this.title = '官方电话'
				this.content = '021-54321599'
				this.$refs.popupTips.open()
			})
      // this.showActionSheet = true
    },
    itemClick(e) {
      this.closeActionSheet()
      if (e.index == 0) {
        this.title = '官方公众号'
        this.content = '生意宝'
        this.$refs.popupTips.open()
      } else if (e.index == 1) {
        this.title = '官方电话'
        this.content = '021-54321599'
        this.$refs.popupTips.open()
      }
    },
    closeActionSheet() {
      this.showActionSheet = false
    },
    tipsCallback() {
      uni.makePhoneCall({
          phoneNumber: this.content
      })
      // thorui.getClipboardData(this.content, (res) => {
      //   if (res) {
      //     this.tui.toast("复制成功")
      //   } else {
      //     this.tui.toast("复制失败")
      //   }
      // })
    },
    tengxun() {
      uni.navigateToMiniProgram({
          appId: 'wxcf1f51ec21883acf',
          path: 'pages/index',
          envVersion: 'release',
          success: () => {
              // console.log('success')
          },
          fail: () => {
              // console.log('fail')
          },
          complete: () => {
              // console.log('complete')
          },
      })
    },
    bindload(e) {
      // console.log(e)
    },
    binderror(e) {
      // console.log(e)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>