<template>
  <view class="container" :style="{'padding-top': padTop + 'rpx'}">
    <popup-input ref="popupInput" :inputType="inputType" :title="title" :maxlength="maxlength"></popup-input>
    <div class="listBox" v-for="(items, indexs) in fieldList" :key="indexs" :style="items.group == 1 ? 'background:white' : ''">
      <div v-for="(item, index) in items.fieldList" :key="index" style="position:relative;">
        <div v-if="item.type != 'tip'" class="list"  :class="[item.type != 'largeImg' ? 'dis-flex flex-wrap' : '', heightLarge ? 'listLarge' : '']">
						<!-- 左边文本 -->
            <div class="label dis-flex" :class="item.type == 'largeImg' ? 'largeImglabel' : '' " :style="{width: (item.labelW ? item.labelW : labelWidth) + 'rpx'}" v-if="item.type != 'largeText' && item.type != 'upload'">
              <text :class="item.tipDot && formData[item.fieldName] == '' ? 'labelText' : ''" :style="{'font-weight': item.labelFw, 'font-size': item.labelFS ? item.labelFS + 'rpx' : ''}">
                {{item.label}}
                <text v-if="item.showIcon" class="iconfont2 icon-guize" @tap.stop="showTip()"></text>
              </text>
				      <text v-if="item.tipDot && formData[item.fieldName] == ''" class="redDot"></text>
            </div>
            <!-- 头像上传 -->
            <div v-if="item.type == 'img'" class="control" :style="{'text-align':textAlign}" @tap.stop="openItem(item)">
              <image class="userImg" :src="formData[item.fieldName] != '' ? formData[item.fieldName] : item.tip"></image>
              <text v-if="showRight || item.showRight" class="iconfont2 icon-gengduobeifen2"></text>
            </div>
            <!-- 日期类型展示 -->
            <div v-else-if="item.type == 'date'" class="control" :style="{'text-align':textAlign}">
              <picker mode="date" @change="pickerChange($event, item)" :value="formData[item.fieldName]">
                  <view class="uni-input onelist-hidden">
                    <text v-if="formData[item.fieldName] != ''">{{formData[item.fieldName]}}</text>
                    <text class="col-9" v-else>{{item.tip}}</text>
                    <text v-if="showRight" class="iconfont2 icon-gengduobeifen2"></text>
                  </view>
              </picker>
            </div>
            <!-- 日期类型展示 -->
            <div v-else-if="item.type == 'time'" class="control" :style="{'text-align':textAlign}">
              <picker mode="time" @change="pickerChange($event, item)" :value="formData[item.fieldName]">
                  <view class="uni-input onelist-hidden">
                    <text v-if="formData[item.fieldName] != ''">{{formData[item.fieldName]}}</text>
                    <text class="col-9" v-else>{{item.tip}}</text>
                    <text v-if="showRight" class="iconfont2 icon-gengduobeifen2"></text>
                  </view>
              </picker>
            </div>
            <!-- 选择类型展示 -->
            <div v-else-if="item.type == 'select'" class="control" :style="{'text-align':textAlign}">
              <picker @change="pickerChange($event, item)" :value="formData[item.fieldName]" :range="item.selectList">
                  <view class="uni-input onelist-hidden">
                    <text v-if="item.showText">{{formData[item.fieldName]}}</text>
                    <text v-else-if="formData[item.fieldName] != null" :class="formData[item.fieldName]?'':'col-9'">{{item.selectList[formData[item.fieldName]] || item.tip}}</text>
                    <text class="col-9" v-else>{{item.tip}}</text>
                    <text v-if="showRight" class="iconfont2 icon-gengduobeifen2"></text>
                  </view>
              </picker>
            </div>
            <!-- 链接类型展示 -->
            <div v-else-if="item.tipType=='state'" class="control" :style="{'text-align':textAlign}" @tap.stop="openItem(item)">
              <text class="col-9" v-if="formData[item.fieldName] === ''">
                {{item.tip}}
              </text>
              <template v-else>
                <template v-for="(tip, tipIndex) in item.tips">
                  <text :key="tipIndex" v-if="formData[item.fieldName] == tip.code" :style="{color: tip.color}">{{tip.text}}</text>
                </template>
              </template>
              <text v-if="showRight" class="iconfont2 icon-gengduobeifen2"></text>
            </div>
            <!-- 大文本框类型展示-备注 -->
            <div v-else-if="item.type == 'largeText'" class="control largeText onelist-hidden" :style="item.notOne?'display:block':''" @tap.stop="openItem(item)">
              <text v-if="formData[item.fieldName] != ''">{{formData[item.fieldName]}}</text>
              <text class="col-9" v-else>{{item.tip}}</text>
            </div>
            <!-- 大图上传-单图-->
            <!-- <div v-else-if="item.type == 'largeImg'" class="control control1 dis-flex" :style="{'text-align':textAlign}">
              <div class="imageList" v-for="(imgItem, imgIndex) in formData[item.fieldName]" :key="imgIndex">
                <image :src="imgItem"></image>
              </div>
              <view v-if="formData[item.fieldName].length < (item.count || 1) && !item.noShowOpt" @tap.stop="openItem(item)" class="image-picker dis-flex flex-dir-column flex-y-center">
                <text class="choose__icon iconfont icon-tubiao_xiangji"></text>
                <text class="choose__text">{{item.tip}}</text>
              </view>
            </div> -->
						<!-- 上传图片-单/多图 -->
						<div v-else-if="item.type == 'upload' || item.type == 'largeImg'" class="control upload">
							<tui-upload ref="tuiUpload" :noShowAdd="item.noShowOpt" :noShowImgBox="item.noShowImgBox" :serverUrl="serverUrl" :value="formData[item.fieldName]" :limit="limit" :videoLimit="0" :addText="addText" @complete="result" @remove="result" :fieldName="item.fieldName"></tui-upload>
						</div>
						<!-- switch切换 -->
						<div v-else-if="item.type == 'switch'" class="control dis-flex flex-x-end flex-y-center">
							<cust-switch :checked="formData[item.fieldName]" @change="switchCange($event,item.fieldName)"></cust-switch>
						</div>
						
            <!-- 文本或数值类型仅展示不操作 -->
            <div v-else-if="item.type == 'notDo'" class="control onelist-hidden" :style="{'text-align':textAlign}">
              <text v-if="formData[item.fieldName] && formData[item.fieldName] != ''">{{formData[item.fieldName]}}</text>
              <text class="col-9" v-else>{{item.tip}}</text>
              <text v-if="item.showIcon" class="iconfont2 icon-gengduobeifen2"></text>
            </div>
            <!-- 文本或数值类型展示 -->
            <div v-else-if="item.tipType == 'isHave'" class="control onelist-hidden" @tap.stop="openItem(item)" :style="{'text-align':textAlign}">
              <text v-if="formData[item.fieldName] != ''" class="success">{{item.haveTip}}</text>
              <text class="col-9" v-else>{{item.tip}}</text>
              <text v-if="showRight" class="iconfont2 icon-gengduobeifen2"></text>
            </div>
            <!-- 文本或数值类型展示 -->
            <div v-else class="control onelist-hidden" @tap.stop="openItem(item)" :style="{'text-align':textAlign, color: item.color || ''}">
              <text v-if="formData[item.fieldName] && formData[item.fieldName] != ''">{{formData[item.fieldName]}}</text>
              <text class="col-9" v-else>{{item.tip}}</text>
              <text v-if="showRight && !item.noShowRight" class="iconfont2 icon-gengduobeifen2"></text>
            </div>
            <div class="listLine" v-if="showLine && index != items.fieldList.length - 1"></div>
        </div>
							
				<div v-else class="tip" :key="index">
          <div class="tipTitle">{{item.label}}</div>
          <div class="tipContent">
            <p>1.提交企业认证代表同意<text class="col-m" @tap.stop="toPermit">用户协议</text>和<text class="col-m" @tap.stop="toPrivacy">隐私政策</text></p>
            <p>2.审核将在2-3个工作日完成；</p>
            <p>3.如有疑问请拨打021-54321599联系我们；</p>
          </div>
        </div>
				<!-- 注 -->
				<view v-if="item.notes" class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>{{item.notes}}</view>
				<slot v-else-if="item.tipType == 'state'" name="link"></slot>
        
        <!-- 展示驳回信息 -->
        <div class="showRemark" v-if="item.showRemark && item.showRemark != ''" :style="{background: item.showRemarkBg, color: item.showRemarkTips ? '#FF7541' : ''}" @tap.stop="showRemarkTips(item)">
          <text class="iconfont2 icon-jingshi"></text>{{item.showRemark}}
        </div>
      </div>
    </div>
    <view class="footer" v-if="isSubmit">
      <button @tap.stop="submit" :disabled="butDisabled" :class="butDisabled ? 'butDisabled' : ''">{{footerText}}</button>
    </view>
		
    <simple-address ref="simpleAddress"></simple-address>
		
    <popup :show="showPopup" @clickmask="clickmask">
      <view class="popup-main">
        <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
        <view class="poptitle">提示</view>
        <view class="pop-input">
          上传有效信息越多成功几率越大，例如:企业营业执照/认证公涵/商标注册证/运营者职位证明等
        </view>
        <view class="pop-btn">
          <view @tap="clickmask">我知道了</view>
        </view>
      </view>
    </popup>
    <popup-tips ref="popupTips" title="提示" :content="showRemarkTipsText" :contentColor="contentColor"></popup-tips>
  </view>
</template>

<script>
let App = getApp().globalData;
import popupInput from '@/components/popup-input/index';
import popupTips from '@/components/popup-tips/index';
import popup from '@/components/popup/index';
import custSwitch from '@/components/cust-switch/index.vue';

export default {
  data() {
    return {
      showRemarkTipsText: '',
      contentColor: '',
      title: '', // 弹窗标题
      inputType: 'text', // 弹窗输入类型
      showPopup: false, // 提示
    };
  },

  components: {
    popupInput,
    popup,
    custSwitch,
    popupTips
  },
  props: {
    mapAddress: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showLine: {
      type: Boolean,
      default: false
    },
    heightLarge: {
      type: Boolean,
      default: false
    },
    // 数据对象
    formData:{
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWidth: {
      type: [String,Number],
      default: '200'
    },
    padTop: {
      type: [String,Number],
      default: '20'
    },
		maxlength:{
			type: [String,Number],
      default: '-1'
		},
    // 内容排列
    textAlign: {
      type: String,
      default: 'right'
    },
    // 展示右箭头
    showRight: {
      type: Boolean,
      default: true
    },
		// 是否需要提交按钮
		isSubmit: {
      type: Boolean,
      default: true
		},
    // 提交内容
    footerText: {
      type: String,
      default:''
    },
    // 字段列表
    fieldList:{
      type: Array,
      default: () => {
        return []
      }
    },
    // 提交按钮不可点击
    butDisabled: {
      type: Boolean,
      default: true
    },
		//服务器地址
		serverUrl: {
			type: String,
			default: ""
		},
		// 上传图片按钮文字
		addText:{
			type: String,
			default: '上传图片'
		},
		//限制数
		limit: {
			type: Number,
			default: 9
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
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
    // 提交数据
    submit() {
      this.$emit('submit')
    },
    // 打开提示框
    showTip() {
      this.showPopup = true
    },
    // 关闭提示框
    clickmask() {
      this.showPopup = false
    },
    // 选择类型赋值
    pickerChange(e, item) {
      let val = e.target.value
      if (item.showText) {
        val = item.selectList[val] || ''
      }
      this.$emit('change', item.fieldName, val)
    },
		//switch
		switchCange(e,fieldName) {
      this.$emit('change', fieldName, e)
    },
    // 展示提示信息
    showRemarkTips(item) {
      if (item.showRemarkTips) {
        this.showRemarkTipsText = item.showRemarkTips
        this.contentColor = item.contentColor || ''
        
        this.$refs.popupTips.open()
      }
    },
    // 点击按钮触发事件
    openItem(item) {
        console.log(item)
      let inputType = item.type
      // inputType = inputType == 'largeText' ? 'text' : inputType
      // inputType = inputType == 'largeImg' ? 'img' : inputType
      switch (inputType) {
        // 输入框文本类型事件
        case 'text':
          this.inputType = inputType
          this.title = item.label
          this.$refs.popupInput._open(this.formData[item.fieldName], (val) => {
            this.$emit('change', item.fieldName, val)
          })
          break;
        // 输入框文本类型事件
        case 'largeText':
          this.inputType = inputType
          this.title = item.label
          this.$refs.popupInput._open(this.formData[item.fieldName], (val) => {
            this.$emit('change', item.fieldName, val)
          })
          break;
        // 输入框数字类型事件
        case 'number':
          this.inputType = inputType
          this.title = item.label
          this.$refs.popupInput._open(this.formData[item.fieldName], (val) => {
            this.$emit('change', item.fieldName, val)
          })
          break;
        // 跳转事件
        case 'link':
          let dataFieldName =  '?fieldName=' + item.fieldName
          let linkUrl = item.linkUrl + dataFieldName
          if (item.linkType == 'mobile') {
            if (this.formData[item.fieldName] == '') {
              linkUrl = item.linkUrls.add + dataFieldName
            } else {
              linkUrl = item.linkUrls.edit + dataFieldName + '&mobile=' + this.formData[item.fieldName]
            }
          }
          if (item.linkType == 'address') {
            linkUrl += '&address_detail=' + this.formData.address_detail + '&province=' + this.formData.province + '&city=' + this.formData.city + '&district=' + this.formData.district
          }
          if (item.fieldName == 'service_qrcode' || item.fieldName == 'wxpay_qrcode' || item.fieldName == 'alpay_qrcode') {
            linkUrl += '&url=' + this.formData[item.fieldName]
          }
          if (item.source) {
            linkUrl += '&source=' + item.source
          }
		  console.log(linkUrl)
          uni.navigateTo({
            url: linkUrl
          });
          break;
        // 上传图片事件
        case 'img':
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
                let imgUrl = '/pages/user/cropper-default/cropper-default?fieldName=' + item.fieldName + '&src=' + tempFilePaths
                if (item.isShop) {
                  imgUrl += '&isShop=1'
                }
                uni.navigateTo({
                  url: imgUrl
                });
              // #ifdef H5 || MP
              } else {
                App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
              }
              // #endif
            }
          });
          break;
        // 上传大图事件不裁剪
        case 'largeImg':
          uni.chooseImage({
            count: item.count || 1,
            // #ifdef H5 || MP
            sizeType: ['compressed', 'original'],
            // #endif
            // #ifdef APP-PLUS
            sizeType: ['compressed', 'original'],
            // #endif
            sourceType: ['album', 'camera'],
            success: res => {
              let tempFiles = [];
              res.tempFiles.forEach(item => {
                // #ifdef H5 || MP
                if (item.size <= 2048000) {
                // #endif
                  tempFiles.push(item.path)
                // #ifdef H5 || MP
                } else {
                  App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
                }
                // #endif
              })
              let newList = tempFiles.concat(this.formData[item.fieldName])
              this.$emit('change', item.fieldName, newList)
            }
          });
          break;
          
        //  地址三级联动
        case 'location':
          this.inputType = inputType
          this.$refs.simpleAddress.open((val) => {
            this.$emit('change', item.fieldName, val)
          })
          break;
        //  地址三级联动
        case 'mapAddress':
          this.inputType = inputType
          let obj = {
            success: (res) => {
              let data = res
              delete data.errMsg
              this.$emit('change', item.fieldName, JSON.stringify(data))
            }
          }
          // #ifdef H5 || MP
          if (this.mapAddress.latitude && this.mapAddress.longitude){
            obj.latitude = this.mapAddress.latitude
            obj.longitude = this.mapAddress.longitude
          }
          // #endif
          // #ifdef APP-PLUS
          if (this.mapAddress.address){
            obj.keyword = this.mapAddress.address
          }
          // #endif
          obj.fail = (e) => {
            if (e.errMsg == 'chooseLocation:fail:auth denied' || e.errMsg == 'chooseLocation:fail auth deny' || e.errMsg == 'chooseLocation:fail authorize no response') {
              // 用户拒绝了授权
              uni.showModal({
                title: '提示',
                confirmText: '去设置',
                content: '您拒绝了定位权限，将无法使用定位功能',
                success: res => {
                  if (res.confirm) {
                    // 跳转设置页面
                    uni.openSetting({
                      success: res => {
                        if (res.authSetting['scope.userLocation']) {
                          uni.chooseLocation(obj)
                        } else {
                          // 没有允许定位权限
                          wx.showToast({
                            title: '您拒绝了定位权限，将无法使用定位功能',
                            icon: 'none'
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          }
          uni.chooseLocation(obj)
          break;
      }
    },
    // 图片上传回调
    result: function(e) {
      let arr = []
      e.imgArr.forEach(element => {
        arr.push(element.path)
      });
      this.$emit('change', e.fieldName, arr)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>