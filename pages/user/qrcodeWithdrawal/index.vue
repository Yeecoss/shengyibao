<template>
<view class="qrcode">
  <!-- 自定义标题栏 -->
  <navigationBar :title="title" extClass="nav" id="top"></navigationBar>
  <view class="container">
    <view class="heard dis-flex flex-y-center flex-x-between" @tap="show">
        <view class="col-3 f-28">
          分佣收款码
        </view>
        <view class="col-9 f-28">
			<text v-if="baseQrcodeImg == ''">未上传</text>
			<text v-else style="color: #6DD400;">已上传</text>
			<text class="iconfont2 icon-gengduobeifen2 f-24"></text>
        </view>
    </view>
  </view>
  <tui-bottom-popup :radius="false" class="popupBox" :show="popupShow" @close="closePopup">
    <div class="bottomTitle">分佣收款码
      <div class="closeBox" @tap="closePopup">
        <text class="iconfont2 icon-shanchu1"></text>
      </div>
    </div>
    <div class="qrcodeBox">
      <div class="imgBox">
        <div class="qrcodeImgBox">
          <image v-if="qrcodeImg != ''" class="qrcodeImg imageDefault" :src="qrcodeImg" mode="aspectFill"></image>
          <image v-else class="qrcodeImg" src="https://pic.kaidanxia.com/2021-02-21/145410599ff3075.png" mode="aspectFill"></image>
        </div>
      </div>
	  <view class="showText t-c f-28" v-if="qrcodeImg != ''">
	  	{{subText[checked]}}收款码
	  </view>
    </div>
    <view class="footer" v-if="showCheck">
      <button @tap.stop="changeImg">更换收款码</button>
    </view>
    <view v-else class="footerBox dis-flex flex-y-center">
		<view class="but1" @tap="radioChange(0)">
			上传微信收款码
		</view>
		<view class="but2" @tap="radioChange(1)">
			上传支付宝收款码
		</view>
    </view>
  </tui-bottom-popup>
</view>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
		showCheck: false,
		baseQrcodeImg: '',
		baseWxapp_file_id: '',
		qrcodeImg: '',
		wxapp_file_id: '',
		popupShow: false,
		title: '分佣收款码',
		checked: 0,
		subText:{
			0: '微信',
			1: '支付宝'
		}
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  this.getData()
  },
  methods: {
	  changeImg() {
		  this.showCheck = false
	  },
	getData() {
		App._get('user.index/withdrawQrcode', {}, result => {
			if (result.code == 1) {
				this.baseQrcodeImg = result.data.qrcode_path || ''
				this.baseWxapp_file_id = result.data.withdraw_account_pic || ''
				this.checked = result.data.qrcode_type ? result.data.qrcode_type.value : 0
				
				this.qrcodeImg = this.baseQrcodeImg
				if (this.qrcodeImg != '') {
					this.showCheck = true
				}
				this.wxapp_file_id = this.baseWxapp_file_id
			} else {
			  App.showSuccess(result.msg)
			}
		}, false, () => {
			wx.hideLoading();
		});
	},
	show() {
		this.popupShow = true
	},
	radioChange(type) {
		this.openItem(type)
	},
    closePopup() {
      this.popupShow = false
    },
    // 提交数据
    submit() {
		let obj = {
			qrcode_type: this.checked,
			withdraw_account: this.wxapp_file_id
		}
		App._post_form('user.index/withdrawQrcode', obj, result => {
			if (result.code == 1) {
				this.showCheck = true
			  this.$api.msg(result.msg)
			  this.baseQrcodeImg = this.qrcodeImg
			} else {
			  App.showSuccess(result.msg)
			}
		}, false, () => {
			wx.hideLoading();
		});
    },
    openItem(type) {
		let that = this
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
		  App.uploadFile({
            filePath: tempFilePaths,
			success: (res) => {
				if (res.code === 1) {
					that.qrcodeImg = res.data.file_path || ''
					that.wxapp_file_id = res.data.wxapp_file_id || ''
					that.checked = type
					that.submit()
				}
			  }
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