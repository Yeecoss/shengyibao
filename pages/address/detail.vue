<template>
<view class="bgf5">
<view class="container">
  <!-- 自定义标题栏 -->
  <navigationBar title="编辑地址" extClass="nav" id="top"></navigationBar>

  <view class="common-header-xian"></view>
  <!-- 表单 -->
  <form @submit="saveData" report-submit="true">
    <view class="address-cont-title b-f">
			<!-- 解析 -->
			<view class="analysis-wrap bgf">
				<view class="analysis f-24 dis-flex flex-x-between">
					<textarea v-model="addrText" placeholder="输入或粘贴地址" placeholder-class="place" @blur="analysis"/>
					<view class="clear dis-flex flex-x-center flex-y-center" v-if="addrText!=''" @tap="clear">
						<text class="iconfont2 icon-cross-mini col-9"></text>
					</view>
				</view>
			</view>
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>收货人</text>
        </view>
        <view class="right-cont flex-box">
          <input name="name" placeholder="请输入收货人姓名" :value="detail.name"/>
        </view>
      </view>
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>手机号</text>
        </view>
        <view class="right-cont flex-box">
          <input name="phone" placeholder="请输入收货人联系电话" type="number" :value="detail.phone"/>
        </view>
      </view>
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>所在地区</text>
        </view>
        <view class="address-cont-box flex-box">
					<view class="right-cont flex-box" @tap="bindRegionChange">
					  <text v-if="region" class="f-24">{{region_val}}</text>
					  <text v-else class="f-24 col-7">选择省、市、区</text>
					</view>
					<simple-address :pickerValueDefault="cityPickerValueDefault" ref="simpleAddress"></simple-address>
        </view>
      </view>
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>详细地址</text>
        </view>
        <view class="right-cont flex-box">
          <input name="detail" placeholder="请输入街道小区楼层" type="text" :value="detail.detail"/>
        </view>
      </view>
    </view>
    <view class="address-cont-title b-f">
      <view class="list address-box dis-flex flex-y-center flex-x-between">
        <view class="left-name1 f-28 col-3">
          <text>是否设为常用</text>
        </view>
				<cust-switch ref="switch" :checked="isused" @change="switchCange($event,'isused')"></cust-switch>
      </view>
      <!-- <view class="list address-box dis-flex flex-y-center flex-x-between">
        <view class="left-name1 f-28 col-3">
          <text>保存到地址薄</text>
        </view>
				<cust-switch ref="switch" :checked="issave" @change="switchCange($event,'issave')"></cust-switch>
      </view> -->
      <view class="list address-box dis-flex flex-y-center flex-x-between" v-if="pindex===''">
        <view class="left-name1 f-28 col-3">
          <text>是否设为默认寄件人</text>
        </view>
				<cust-switch ref="switch" :checked="isdefault" @change="switchCange($event,'isdefault')"></cust-switch>
      </view>
    </view>
    <!-- 操作按钮 -->
     <view class="btn-wrap dis-flex flex-x-between">
      <view class="btn-green btn-sm">
        <button class="f-32" @tap.stop="chooseAddress">一键获取微信地址</button>
      </view>
      <view class="profile-btn">
        <button formType="submit" :disabled="disabled">保存</button>
      </view>
    </view>
  </form>
</view>

</view>
</template>

<script>
let app = getApp().globalData;
import custSwitch from '@/components/cust-switch/index.vue';
import AddressParse from './zh-address-parse/zh-address-parse.min.js';

export default {
  components: {
		custSwitch,
  },
  data() {
    return {
      disabled: false,
      nav_select: false,
      // 快捷导航
      region: '',
			cityPickerValueDefault: [0,0,0],
			region_val: '',
      detail: {},
			address_id: '',
      error: '',
			
			addrText:'',//粘贴文本
			isused:false,//是否设置为常用
			// issave: true,//保存到地址薄
			isdefault: false,//是否设为默认寄件人
			pindex:'',
    };
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
			// 当前页面参数
			this.options = options;
			this.pindex = options.pindex?options.pindex : '';
    // 获取当前地址信息
    this.getAddressDetail(options.address_id);
  },
  methods: {
    //获取当前地址信息
    getAddressDetail(address_id) {
      let _this = this;

      app._get('address/detail', {
        address_id
      }, (result) => {
				_this.detail = result.data.detail;
				_this.address_id = result.data.detail.address_id;
				_this.region = result.data.region;
				_this.isused = result.data.detail.is_commonly==1? true : false;
				_this.isdefault = result.data.detail.is_default==1? true : false;
				_this.region_val = result.data.region.join(',');
      });
    },

    //表单提交
    saveData: function (e) {
      let _this = this,
          values = e.detail.value;

      values.region = this.region;
  
			// 表单验证
      if (!_this.validation(values)) {
        app.showError(_this.error);
        return false;
      } // 按钮禁用
			values.is_commonly = _this.isused==true? 1: 0;
			values.is_default = _this.isdefault==true? 1: 0;


      _this.setData({
        disabled: true
      }); // 提交到后端


      values.address_id = _this.address_id;

      app._post_form('address/edit', values, function (result) {
        app.showSuccess(result.msg, function () {
          wx.navigateBack();
        });
      }, false, function () {
        // 解除禁用
        _this.setData({
          disabled: false
        });
      });
    },

    //表单验证
    validation: function (values) {
      if (values.name === '') {
        this.error = '收件人不能为空';
        return false;
      }

      if (values.phone.length < 1) {
        this.error = '手机号不能为空';
        return false;
      } // if (values.phone.length !== 11) {
      //   this.data.error = '手机号长度有误';
      //   return false;
      // }


      let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;

      if (!reg.test(values.phone)) {
        this.error = '手机号不符合要求';
        return false;
      }

      if (!this.region) {
        this.error = '省市区不能空';
        return false;
      }

      if (values.detail === '') {
        this.error = '详细地址不能为空';
        return false;
      }

      return true;
    },

    //修改地区
    bindRegionChange: function (e) {
			let _this = this;
			
			let index = _this.$refs.simpleAddress.queryIndex(_this.region, 'label');
			_this.cityPickerValueDefault = index.index;
				
			_this.$refs.simpleAddress.open(val => {
				var val = val.split("-");
				_this.region = val;
				val = val.join(',');
				_this.region_val = val;
			});
    },

    //获取微信地址
    chooseAddress: function () {
      let _this = this;

      wx.chooseAddress({
        success: function (res) {
				var region = [res.provinceName, res.cityName, res.countyName];
				_this.region = region;
				var val = region.join(',');
				_this.region_val = val;
				
        _this.detail.name = res.userName;
        _this.detail.phone = res.telNumber;
        _this.detail.detail = res.detailInfo;
        }
      });
    },
		//解析
		analysis(e){
			if(this.addrText){
				const parseResult = AddressParse(this.addrText, 0)
				
				this.detail.name = parseResult.name;
				this.detail.phone = parseResult.phone;
				this.detail.detail = parseResult.detail;
				
				if(parseResult.province!=''&& parseResult.city!=''&& parseResult.area!=''){
					let region = [parseResult.province, parseResult.city, parseResult.area];
					this.region = region;
					let val = region.join(',');
					this.region_val = val;
				}
			}
		},
		//switch
		switchCange(e,fieldName) {
		  this[fieldName] = e;
		},
		//清空粘贴
		clear(){
			this.addrText = '';
		},
  }
};
</script>
<style>
@import "./create.css";
</style>