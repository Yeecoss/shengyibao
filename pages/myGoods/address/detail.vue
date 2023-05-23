<template>
<view class="bgf5 min_h_100">
<view class="main">
  <!-- 自定义标题栏 -->
  <navigationBar title="编辑地址" extClass="nav" id="top"></navigationBar>

  <view class="common-header-xian"></view>
  <!-- 表单 -->
  <form @submit="saveData" report-submit="true">
    <view class="address-cont-title b-f">
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>姓名</text>
        </view>
        <view class="right-cont flex-box">
          <input name="name" placeholder="请输入姓名" :value="detail.name"/>
        </view>
      </view>
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>手机号</text>
        </view>
        <view class="right-cont flex-box">
          <input name="phone" placeholder="请输入手机号" type="number" :value="detail.phone"/>
        </view>
      </view>
   <!-- </view>
    <view class="address-cont-title b-f"> -->
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>所在地区</text>
        </view>
        <view class="address-cont-box flex-box">
					
					<view class="right-cont flex-box" @tap="bindRegionChange">
					  <text v-if="region" class="f-28 col-3">{{region_val}}</text>
						<input v-else placeholder="请选择所在地区" type="text" disabled/>
					</view>
        </view>
      </view>
      <view class="list address-box dis-flex flex-y-center">
        <view class="left-name f-28">
          <text>详细地址</text>
        </view>
        <view class="right-cont flex-box">
          <input name="detail" placeholder="请输入详细地址" type="text" :value="detail.detail"/>
        </view>
      </view>
    </view>
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30">
					<button class="foot-btn f-32 col-f" formType="submit" :disabled="disabled">确定</button>
				</view>
			</view>
  </form>
</view>
	<simple-address :pickerValueDefault="cityPickerValueDefault" ref="simpleAddress"></simple-address>
</view>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
      disabled: false,
      region: '',
			cityPickerValueDefault: [0,0,0],
			region_val: '',
      detail: {},
      error: '',
			status: '',//地址类型
    };
  },
  components: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		this.status = options.status || '';
    // 获取当前地址信息
    this.getAddressDetail(options.address_id);
  },
  methods: {
    /**
     * 获取当前地址信息
     */
    getAddressDetail (address_id) {
      let _this = this;

      getApp().globalData._get('shop.address/edit', {
        address_id
      }, result => {
				_this.detail = result.data.address;
				let region = result.data.address.region;
				let arr = [];
				arr[0] = region.province;
				arr[1] = region.city;
				arr[2] = region.region;
				_this.region = arr;
				_this.region_val = arr.join(',');
				
      });
    },

    /**
     * 表单提交
     */
    saveData (e) {
      let _this = this,
          values = e.detail.value;

      values.region = this.region; 

      if (!_this.validation(values)) {
        getApp().globalData.showError(_this.error);
        return false;
      } // 按钮禁用


      _this.setData({
        disabled: true
      }); // 提交到后端


      values.address_id = _this.detail.address_id;

      getApp().globalData._post_form('shop.address/edit', values, function (result) {
        getApp().globalData.showSuccess(result.msg, function () {
          wx.navigateBack();
        });
      }, false, function () {
        // 解除禁用
        _this.setData({
          disabled: false
        });
      });
    },

    /**
     * 表单验证
     */
    validation (values) {
      if (values.name === '') {
        this.error = '收件人不能为空';
        return false;
      }

      if (values.phone.length < 1) {
        this.error = '手机号不能为空';
        return false;
      }


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

			if(this.cal(values.detail)<3){
				this.error = '详细地址不能小于3个汉字！';
				return false;
			}

      return true;
    },
		
		// 中文字符验证
		cal(str) {    
			let re=/[\u4E00-\u9FA5]/g; //测试中文字符的正则
					 
			if(re.test(str)){   //使用正则判断是否存在中文      
				return str.match(re).length //返回中文的个数    
			}else{
				return 0 
			} 
		},

    /**
     * 修改地区
     */
    bindRegionChange (e) {
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

    /**
     * 获取微信地址
     */
    // chooseAddress () {
    //   let _this = this;

    //   wx.chooseAddress({
    //     success: function (res) {
				// var region = [res.provinceName, res.cityName, res.countyName];
				// _this.region = region;
				// var val = region.join(',');
				// _this.region_val = val;
				
    //       _this.setData({
    //         name: res.userName,
    //         phone: res.telNumber,
    //         region: [res.provinceName, res.cityName, res.countyName],
    //         detail: res.detailInfo
    //       });
    //     }
    //   });
    // }
  }
};
</script>
<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
@import "./create";
</style>