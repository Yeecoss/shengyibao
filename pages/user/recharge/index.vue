<template>
<view>
<!-- 自定义标题栏 -->
<navigationBar extClass="nav" :back="false">
    <view slot="left" class="cate_btn" @tap.stop="back">
      <text class="iconfont2 icon-fanhui f-32"></text>
      <text class="title">充值中心</text>
    </view>
</navigationBar>
<view class="container" v-if="userInfo.user_id">
  <view class="account-panel" style="background:url(http://pic.kaidanxia.com/2020-05-08/202005081620031e7551453.png) no-repeat;background-size:100% 100%;">
    <view class="panel-balance flex-box">
      <text>{{ userInfo.balance }}</text>
    </view>
    <view class="panel-lable">
      <text>账户余额(元)</text>
    </view>
  </view>
  <view class="recharge-panel">
    <view class="recharge-label">
      <text>充值金额</text>
    </view>
    <view class="recharge-plan clear">
      <block v-for="(item, index) in planList" :key="index">
        <view :class="'recharge-plan_item ' + ( selectedPlanId == item.plan_id ? 'active' : '' )" @tap.stop="onSelectPlan" :data-id="item.plan_id">
          <view class="plan_money">
            <text>{{ item.money }}</text>
          </view>
          <view class="plan_gift" v-if="item.gift_money > 0">
            <text>送{{ item.gift_money }}</text>
          </view>
        </view>
      </block>
    </view>
    <!-- 手动充值输入框 -->
    <view class="recharge-input" v-if="setting.is_custom == '1'">
      <input type="digit" placeholder :value="inputValue" @input="bindMoneyInput"/>
    </view>
    <!-- 确认按钮 -->
    <view class="recharge-submit btn-submit">
      <form @submit="onSubmit" report-submit="true">
        <button formType="submit" :disabled="disabled">立即充值</button>
      </form>
    </view>
  </view>
  <!-- 充值描述 -->
  <view class="recharge-describe">
    <view class="recharge-label">
      <text>充值说明</text>
    </view>
    <view class="content">
      <text space="ensp">{{ setting.describe }}</text>
    </view>
  </view>
</view>
</view>
</template>

<script>
const App = getApp().globalData; // 枚举类：充值类型
// 枚举类：充值类型
import RechargeTypeEnum from "@/utils/enum/recharge/order/RechargeType";

export default {
  data() {
    return {
      userInfo: {},
      // 用户信息
      setting: {},
      // 充值设置
      // recharge_type: '', // 充值类型
      selectedPlanId: 0,
      // 当前选中的套餐id
      inputValue: '',
      // 自定义金额
      disabled: false //按钮禁用

    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this; // 获取充值中心数据


    _this.getRechargeIndex();
  },

  methods: {
    // 返回
    back() {
      var data = this;
      wx.navigateBack({
        delta: data.delta
      });
      this.$emit('back', {
        delta: data.delta
      }, {});
    },

    /**
     * 获取充值中心数据
     */
    getRechargeIndex() {
      let _this = this;

      getApp().globalData._get('recharge/index', {}, function (result) {
        _this.setData(result.data);
      });
    },

    /**
     * 选择充值套餐
     */
    onSelectPlan(e) {
      let _this = this;

      _this.setData({
        selectedPlanId: e.currentTarget.dataset.id,
        inputValue: ''
      });
    },

    /**
     * 绑定金额输入框
     */
    bindMoneyInput(e) {
      let _this = this;

      _this.setData({
        inputValue: e.detail.value,
        selectedPlanId: 0
      });
    },

    /**
     * 立即充值
     */
    onSubmit(e) {
      let _this = this; // 记录formid


      getApp().globalData.saveFormId(e.detail.formId); // 按钮禁用

      _this.setData({
        disabled: true
      }); // 提交到后端


      getApp().globalData._post_form('recharge/submit', {
        planId: _this.selectedPlanId,
        customMoney: _this.inputValue
      }, result => {
        // 发起微信支付
        getApp().globalData.wxPayment({
          payment: result.data.payment,

          success() {
            getApp().globalData.showSuccess(result.msg.success, () => {
              wx.navigateBack();
            });
          },

          fail(res) {
            getApp().globalData.showError(result.msg.error);
          },

          complete(res) {}

        });
      }, false, () => {
        // 解除禁用
        _this.setData({
          disabled: false
        });
      });
    }

  }
};
</script>
<style>
@import "./index.css";
</style>