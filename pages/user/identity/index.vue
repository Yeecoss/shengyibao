<template>
<view class="identity">
  <!-- 自定义标题栏 -->
  <navigationBar title="身份证认证" extClass="nav" id="top"></navigationBar>
  <!-- <div class="padding-Box"></div> -->
  <!-- <div class="fieldBox dis-flex flex-y-center flex-x-between">
    <div class="label">证件类型</div>
    <div class="content">
      <picker v-if="!disabled && !isHave" @change="pickerChange" :value="certificate" :range="certificateList">
        <text>{{certificate != '' ? certificate : '选择证件类型'}}</text>
        
        <text class="iconfont2 icon-gengduobeifen2"></text>
      </picker>
      <text v-else>{{certificate != '' ? certificate : '选择证件类型'}}</text>
    </div>
  </div> -->
  <div class="padding-Box"></div>
  <!-- 大图上传-单图-->
  <div class="imgBox">
    <div class="idCardBox dis-flex flex-y-center flex-x-between m-b-10">
      <div class="cardTitBox">
        <div class="cardTitle">头像面</div>
        <div class="cardTip">上传证件正面</div>
      </div>
      <div class="idCard1">
        <div @tap.stop="chooseImage('front_url')" v-if="formData.front_url == ''">
          <image class="bg" src="https://pic.kaidanxia.com/2020-11-02/1059077507d5919.png"></image>
          <image class="itemImage" src="https://pic.kaidanxia.com/2020-11-02/1059070fdb37441.png"></image>
          <div class="add">
            <text class="iconfont2 icon-Uploadphoto"></text>
          </div>
        </div>
        <div v-else @tap="previewImage('front_url')">
          <image class="bg" src="https://pic.kaidanxia.com/2020-11-02/1059077507d5919.png"></image>
          <image class="itemImage" :src="formData.front_url"></image>
          <div v-if="!disabled && !isHave" class="delItem" @tap.stop="delItem('front_url')">
            <text class="iconfont2 icon-cross-mini"></text>
          </div>
        </div>
      </div>
    </div>
    <div class="idCardBox dis-flex flex-y-center flex-x-between" v-if="certificateVal == '1'">
      <div class="cardTitBox">
        <div class="cardTitle">国徽面</div>
        <div class="cardTip">上传身份证反面</div>
      </div>
      <div class="idCard2">
        <div @tap.stop="chooseImage('behind_url')" v-if="formData.behind_url == ''">
          <image class="bg" src="https://pic.kaidanxia.com/2020-11-02/1059077507d5919.png"></image>
          <image class="itemImage" src="https://pic.kaidanxia.com/2020-11-02/105908ee37e4704.png"></image>
          <div class="add">
            <text class="iconfont2 icon-Uploadphoto"></text>
          </div>
        </div>
        <div v-else @tap="previewImage('behind_url')">
          <image class="bg" src="https://pic.kaidanxia.com/2020-11-02/1059077507d5919.png"></image>
          <image class="itemImage" :src="formData.behind_url"></image>
          <div v-if="!disabled && !isHave" class="delItem" @tap.stop="delItem('behind_url')">
            <text class="iconfont2 icon-cross-mini"></text>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="tip">
    <div class="tipTitle" @tap="showTip('1')">认证信息
      <text class="iconfont2 icon-questionmark" style="font-weight: normal;"></text>
    </div>
    <div class="tipContent">
      <p v-for="(item, key) in auth_info" :key="key">{{key}}：{{item}}</p>
    </div>
  </div>
  <view class="footer">
    <button v-if="isHave" class="but" @tap.stop="reSubmit">重新上传</button>
    <button v-else class="but" @tap.stop="submit" :disabled="butDisabled" :class="butDisabled ? 'butDisabled' : ''">提交</button>
  </view>
  <popup-tips ref="popupTips" :title="title" :content="content" :textAlign="textAlign"></popup-tips>
</view>
</template>

<script>
let App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';

export default {
  data() {
    return {
      isHave: false,
      certificateVal: '1',
      certificate: '中国大陆居民-身份证',
      certificateList: [
        '中国大陆居民-身份证',
        '港澳通行证',
        '台湾通行证',
        '护照'
      ],
      textAlign: '',
      title: '',
      content: '',
      auth_info: {},
      back_auth_info: {},
      auth_info_data: {},
      back_auth_info_data: {},
      showHeardTip: true,
      footerText: '提交',
      fieldName: '',
      butDisabled: true,
      disabled: false,
      formData:{
        front_url: '',
        behind_url: ''
      },
      formOldData: {
        front_url: '',
        behind_url: ''
      }
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
    reSubmit() {
      this.isHave = false
      this.auth_info = {}
      this.back_auth_info = {}
      this.auth_info_data = {}
      this.back_auth_info_data = {}
      this.formData = {
        front_url: '',
        behind_url: ''
      }
    },
    previewImage(type) {
      uni.previewImage({
        current: 0,
        urls: [this.formData[type]]
      })
    },
    pickerChange(e) {
      let value = parseInt(e.detail.value || 0)
      this.certificateVal = value + 1 + ''
      this.certificate = this.certificateList[value]
      this.auth_info = {}
      this.back_auth_info = {}
      this.auth_info_data = {}
      this.back_auth_info_data = {}
      this.formData = {
        front_url: '',
        behind_url: ''
      }
    },
    showTip(type) {
      if (type=='1') {
        this.textAlign = 'left'
        this.title = '认证规则'
        this.content = '<p>1.提交认证代表同意用户协议和隐私政策。</p> <p>2.请上传真实的证件信息。</p><p>3.如有疑问请拨打021-54321599联系我们；</p>'
        this.$refs.popupTips.open()
      }
    },
    toPermit() {
      uni.navigateTo({
        url: '/pages/user/agreement/permit'
      });
    },
    toPrivacy() {
      uni.navigateTo({
        url: '/pages/user/agreement/privacy'
      });
    },
    closeHeadTip() {
      this.showHeardTip = false
    },
    delItem(fieldName) {
      this.formData[fieldName] = ''
    },
    getDetailData() {
      App._get('user.identity/detail', {}, (result) => {
        if (result.code == '1') {
          if (result.data.identity) {
            this.isHave = true
            let data = result.data.identity
            this.unitData(data)
          }
        }
      })
    },
    unitData(data) {
      this.disabled = false
      let obj = {
        front_url: data.front_url || '',
        behind_url: data.behind_url || ''
      }
      this.formData = JSON.parse(JSON.stringify(obj))
      this.formOldData = JSON.parse(JSON.stringify(obj))
      this.auth_info = data.other_info.show || {}
      this.checkIsSubmit()
    },
    // 提交数据
    submit() {
      let obj = {}
      let arr = []
      if (this.certificateVal == 1) {
        arr = ['front_url', 'behind_url']
      } else {
        arr = ['front_url']
      }
      arr.forEach(item => {
        this.checkItemSame(item, obj)
      })
      obj.flatform_id = App.getUniacid()

      let auth_info = {}
      let other_info = Object.assign(this.auth_info_data.other_info, this.back_auth_info_data.other_info)
      auth_info = Object.assign(this.auth_info_data, this.back_auth_info_data)
      other_info.show = this.auth_info
      auth_info.other_info = other_info
      auth_info = Object.assign(auth_info, obj)

      this.title = '提示'
      this.content = '请确认上传证件为用户真实证件，证件信息将用于商户信息留存以及后续相关审核。'
      this.textAlign = 'center'
      this.$refs.popupTips.open(() => {
        wx.showLoading();
        App._post_json_form('user.identity/apply', {
          auth_info: auth_info
        }, result => {
          wx.hideLoading();
          if (result.code == '1') {
            this.$api.msg(result.msg)
            let data = result.data.identity || {}
            this.unitData(data)
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //上一个页面
            if (prevPage.$vm.change) {
              prevPage.$vm.change(this.fieldName, 1)
            }
            uni.navigateBack();
          }
        }, false, () => {
          // wx.hideLoading();
        });
      })
    },
    chooseImage(fieldName) {
      let params = {}
      if (fieldName == 'front_url') {
        params = {
          certificate: this.certificateVal,
          type:'identity',
          side:'front'
        }
        this.auth_info = {}
        this.auth_info_data = {}
        this.formData.front_url = ''
      }
      if (fieldName == 'behind_url') {
        params = {
          certificate: this.certificateVal,
          type:'identity',
          side:'back'
        }
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
				console.log(111111)
          // #ifdef H5 || MP
          if (res.tempFiles[0].size <= 2048000) {
          // #endif
          const tempFilePaths = res.tempFilePaths[0];
			    App.uploadFile({
            filePath: tempFilePaths,
            params: params,
            success: (res) => {
				console.log(111111)
              if (res.code === 1) {
                this.formData[fieldName] = res.data.file_path
                if (fieldName == 'front_url') {
                  this.auth_info = res.data.auth_info.show
                  this.auth_info_data = res.data.auth_info.data
                }
                if (fieldName == 'behind_url') {
                  this.back_auth_info = res.data.auth_info.back
                  this.back_auth_info_data = res.data.auth_info.data
                }
              } else {
                this.$api.msg(res.msg.msg)
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
    checkItemSame(fieldName, obj) {
      obj[fieldName] = this.formData[fieldName]
    },
    change(fieldName, val) {
      if (fieldName == 'identityImg') {
        this.formData[fieldName].push(val)
      } else {
        this.formData[fieldName] = val
      }
      this.checkIsSubmit()
    },
    // 校验数据是否发生改变
    checkIsSubmit() {
      let isSame = true
      for(let k in this.formData) {
        if (this.formData[k] != this.formOldData[k]) {
          isSame = false
        }
      }
      let arr = []
      if (this.certificateVal == 1) {
        arr = ['front_url', 'behind_url']
      } else {
        arr = ['front_url']
      }
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