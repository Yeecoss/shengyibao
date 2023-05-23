<template>
<view>
<pop-manager :show="show" type="center">
  <view class="zan-dialog--container">
    <view v-if="title" class="zan-dialog__header">{{ title }}</view>
    <view :class="'zan-dialog__content ' + ( title ? 'zan-dialog__content--title' : '' )">
      <scroll-view class="zan-dialog__content--scroll" :scroll-y="isScroll">
        <text>{{ message }}</text>
      </scroll-view>
    </view>
    <view :class="'zan-dialog__footer ' + ( buttonsShowVertical ? 'zan-dialog__footer--vertical' : 'zan-dialog__footer--horizon' )">
      <block v-for="(item, index) in buttons" :key="index">
        <!-- <zan-button class="zan-dialog__button" :custom-class="index === 0 ? 'zan-dialog__button-inside--first' : 'zan-dialog__button-inside'" :data-type="item.type" :data-open-type="item.openType" :open-type="item.openType" @btnclick="handleButtonClick" @getuserinfo="handleUserInfoResponse" @getphonenumber="handlePhoneResponse" @opensetting="handleOpenSettingResponse"> -->
        <zan-button class="zan-dialog__button" :custom-class="index === 0 ? 'zan-dialog__button-inside--first' : 'zan-dialog__button-inside'" @btnclick="handleButtonClick">
          <view :style="'color: ' + item.color || '#333'">{{ item.text }}</view>
        </zan-button>
      </block>
    </view>
  </view>
</pop-manager>
</view>
</template>

<script>
var _f = function _f() {};
var needResponseOpenTypes = ['getUserInfo', 'getPhoneNumber', 'openSetting'];
import popManager from "../pop-manager/index";
import zanButton from "../btn/index";

export default {
  data() {
    return {
      // 标题
      title: '',
      // 自定义 btn 列表
      // { type: 按钮类型，回调时以此作为区分依据，text: 按钮文案, color: 按钮文字颜色, openType: 微信开放能力 }
      buttons: [],
      // 内容
      message: ' ',
      // 选择节点
      selector: '#zan-dialog',
      // 是否允许滚动
      isScroll: false,
      // 按钮是否展示为纵向
      buttonsShowVertical: false,
      // 是否展示确定
      showConfirmButton: true,
      // 确认按钮文案
      confirmButtonText: '确定',
      // 确认按钮颜色
      confirmButtonColor: '#3CC51F',
      // 是否展示取消
      showCancelButton: false,
      // 取消按钮文案
      cancelButtonText: '取消',
      // 取消按钮颜色
      cancelButtonColor: '#333',
      key: '',
      autoClose: true,
      show: false,
      showCustomBtns: false,
      promiseFunc: {},
      openTypePromiseFunc: {}
    };
  },

  components: {
    popManager,
    zanButton
  },
  props: {},
  methods: {
    handleButtonClick: function handleButtonClick(e) {
      var _this = this;

      // var _e$currentTarget = e.currentTarget,
      //     currentTarget = _e$currentTarget === undefined ? {} : _e$currentTarget;
      // var _currentTarget$datase = currentTarget.dataset,
      //     dataset = _currentTarget$datase === undefined ? {} : _currentTarget$datase; // 获取当次弹出框的信息

      // var _ref = this.promiseFunc || {},
      //     _ref$resolve = _ref.resolve,
      //     resolve = _ref$resolve === undefined ? _f : _ref$resolve,
      //     _ref$reject = _ref.reject,
      //     reject = _ref$reject === undefined ? _f : _ref$reject; // 重置展示


      if (this.autoClose) {
        this.setData({
          show: false
        });
      } // 自定义按钮，全部 resolve 形式返回，根据 type 区分点击按钮


      // if (this.showCustomBtns) {
      //   var isNeedOpenDataButton = needResponseOpenTypes.indexOf(dataset.openType) > -1;
      //   var resolveData = {
      //     type: dataset.type
      //   }; // 如果需要 openData，就额外返回一个 promise，用于后续 open 数据返回

      //   if (isNeedOpenDataButton) {
      //     resolveData.openDataPromise = new Promise(function (resolve, reject) {
      //       _this.setData({
      //         openTypePromiseFunc: {
      //           resolve: resolve,
      //           reject: reject
      //         }
      //       });
      //     });
      //     resolveData.hasOpenDataPromise = true;
      //   }

      //   resolve(resolveData);
      //   return;
      // } // 默认按钮，确认为 resolve，取消为 reject


      // if (dataset.type === 'confirm') {
      //   resolve({
      //     type: 'confirm'
      //   });
      // } else {
      //   reject({
      //     type: 'cancel'
      //   });
      // }

      this.setData({
        promiseFunc: {}
      });
    },
    // 以下为处理微信按钮开放能力的逻辑
    handleUserInfoResponse: function handleUserInfoResponse(_ref2) {
      var detail = _ref2.detail;

      this._handleOpenDataResponseFun({
        type: detail.errMsg === 'getUserInfo:ok' ? 'resolve' : 'reject',
        data: detail
      });
    },
    handlePhoneResponse: function handlePhoneResponse(_ref3) {
      var detail = _ref3.detail;

      this._handleOpenDataResponseFun({
        type: detail.errMsg === 'getPhoneNumber:ok' ? 'resolve' : 'reject',
        data: detail
      });
    },
    handleOpenSettingResponse: function handleOpenSettingResponse(_ref4) {
      var detail = _ref4.detail;

      this._handleOpenDataResponseFun({
        type: detail.errMsg === 'openSetting:ok' ? 'resolve' : 'reject',
        data: detail
      });
    },
    _handleOpenDataResponseFun: function __handleOpenDataResponse(_ref5) {
      var _ref5$type = _ref5.type,
          type = _ref5$type === undefined ? 'resolve' : _ref5$type,
          _ref5$data = _ref5.data,
          data = _ref5$data === undefined ? {} : _ref5$data;
      var promiseFuncs = this.openTypePromiseFunc || {};
      var responseFunc = promiseFuncs[type] || _f;
      responseFunc(data);
      this.setData({
        openTypePromiseFunc: null
      });
    }
  }
};
</script>
<style>
@import "./index.css";
</style>