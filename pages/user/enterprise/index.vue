<template>
<view class="myinfo">
  <!-- 自定义标题栏 -->
  <navigationBar title="企业认证" extClass="nav" id="top"></navigationBar>
  <div class="padding-Box"></div>
  <div class="fieldBox1 dis-flex flex-y-center flex-x-between">
    <div class="label">证件类型</div>
    <div class="content">
      <picker @change="pickerChange" :value="certificate" :range="certificateList">
        <text>{{certificate != '' ? certificate : '选择证件类型'}}</text>
        
        <text class="iconfont2 icon-gengduobeifen2"></text>
      </picker>
    </div>
  </div>
  <div class="padding-Box"></div>
  <div class="fieldBox">
    <div class="fieldTitle">上传资质<text class="fieldTitleTip">(仅限一张)</text>
    </div>
    <div v-if="formData.upload_pic == ''">
      <div @tap.stop="chooseImage('upload_pic')" class="add dis-flex flex-x-center flex-y-center">
        <div>
          <text class="iconfont2 icon-jiahao"></text>
          <div class="addText">上传图片</div>
        </div>
      </div>
    </div>
    <div v-else class="itemImageBox">
      <image @tap="previewImage" class="itemImage" :src="formData.upload_pic"></image>
      <div v-if="!disabled" class="delItem" @tap.stop="delItem('upload_pic')">
        <text class="iconfont2 icon-cross-mini"></text>
      </div>
    </div>
  </div>
  <div class="tip">
    <div class="tipTitle" @tap="showTip">认证信息
      <text class="iconfont2 icon-questionmark" style="font-weight: normal;"></text>
    </div>
    <div class="tipContent">
      <p v-for="(item, key) in auth_info" :key="key">{{key}}：{{item}}</p>
    </div>
  </div>
  <view class="footer">
    <button class="but" @tap.stop="submit"  :disabled="butDisabled" :class="butDisabled ? 'butDisabled' : ''" :limit="1">申请认证</button>
  </view>
  <popup-tips ref="popupTips" title="提示" content="1.提交认证代表同意用户协议和隐私政策。 2.审核将在2-3个工作日完成。 3.请上传真实的证件信息。"></popup-tips>
</view>
</template>

<script>
let App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      certificate: '个体工商户',
      certificateList: [
        '个体工商户', '企业三证合一营业执照'
      ],
      showHeardTip: true,
      butDisabled: true,
      footerText: '申请认证',
      fieldName: '',
      formData:{
        upload_pic: '',
        certificateVal: '1'
      },
      auth_info: {},
      auth_info_data: {},
      // showPopup: false,
      inputType: 'text'
    };
  },

  components: {
    popupTips
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fieldName = options.fieldName || ''
    this.getDetailData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
    previewImage() {
      uni.previewImage({
        current: 0,
        urls: [this.formData.upload_pic]
      })
    },
    pickerChange(e) {
      let value = parseInt(e.detail.value || 0)
      this.formData.certificateVal = value + 1 + ''
      this.certificate = this.certificateList[value]
      this.auth_info = {}
      this.formData.upload_pic = ''
    },
    showTip() {
      this.$refs.popupTips.open()
    },
    delItem(fieldName) {
      this.formData[fieldName] = ''
      this.auth_info = {}
      this.auth_info_data = {}
    },
    chooseImage(fieldName) {
      let params = {}
      if (fieldName == 'upload_pic') {
        params = {
          certificate: this.formData.certificateVal,
          type:'company'
        }
        this.auth_info = {}
      }
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
              params: params,
              success: (res) => {
                if (res.code === 1) {
                  this.formData[fieldName] = res.data.file_path
                  if (fieldName == 'upload_pic') {
                    this.auth_info = res.data.auth_info.show
                    this.auth_info_data = res.data.auth_info.data
                  }
                } else {
                  this.$api.msg(res.msg)
                }
              },
              complete: (res) => {
                this.checkIsSubmit()
              }
            });
						// #ifdef H5 || MP
						} else {
							App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
						}
						// #endif
        }
      });
    },
    closeHeadTip() {
      this.showHeardTip = false
    },
    getDetailData() {
      App._get('user.company/detail', {}, (result) => {
        if (result.code == '1') {
          let data = result.data.company || {}
          this.unitData(data)
        }
      })
    },
    unitData(data) {
      this.disabled = false
      let obj = {
        upload_pic: data.upload_pic ? data.upload_pic[0] || '' : '',
        certificateVal: data.auth_type || '1'
      }
      this.auth_info = data.other_info ? data.other_info.show || {} : {}
      this.formData = JSON.parse(JSON.stringify(obj))
      this.formOldData = JSON.parse(JSON.stringify(obj))
      this.checkIsSubmit()
    },
    // 提交数据
    submit() {
      let obj = {}
      let arr = ['upload_pic']
      arr.forEach(item => {
        this.checkItemSame(item, obj)
      })
      obj.flatform_id = App.getUniacid()
      obj.certificate = this.formData.certificateVal
      let auth_info = this.auth_info_data
      auth_info.other_info.show = this.auth_info
      obj = Object.assign(obj, auth_info)
      wx.showLoading();
      App._post_json_form('user.company/apply', {
        auth_info: obj
      }, result => {
        wx.hideLoading();
        if (result.code == '1') {
          App.showSuccess(result.msg)
          let data = result.data.company || {}
          this.unitData(data)
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2]; //上一个页面
          if (prevPage.$vm.change) {
            prevPage.$vm.change(this.fieldName, 1)
          }
          uni.navigateBack();
        }
      }, false, () => {
        wx.hideLoading();
      });
    },
    checkItemSame(fieldName, obj) {
      let newVal = this.formData[fieldName]
      obj[fieldName] = newVal
    },
    change(fieldName, val) {
      this.formData[fieldName] = val
      this.checkIsSubmit()
    },
    // 校验数据是否发生改变
    checkIsSubmit() {
      let isSame = true
      for(let k in this.formData) {
        let newVal = this.formData[k]
        let oldVal = this.formOldData[k]
        if (newVal != oldVal) {
          isSame = false
        }
      }
      let arr = ['upload_pic', 'certificateVal']
      arr.forEach(element => {
        if (this.formData[element] == '') {
          isSame = true
        }
      })
      this.butDisabled = isSame
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>