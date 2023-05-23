<template>
<view class="identity">
  <!-- 自定义标题栏 -->
  <navigationBar title="地址信息" extClass="nav" id="top"></navigationBar>
  <field-list ref="fieldList" :formData="formData" :butDisabled="butDisabled" :fieldList="fieldList" @change="change" @submit="submit" :footerText="footerText" textAlign="left" :showRight="false"></field-list>
</view>
</template>

<script>
let App = getApp().globalData;
import fieldList from '@/components/field-list/index';


export default {
  data() {
    return {
      title: '修改',
      footerText: '保存',
      fieldName: '',
      butDisabled: true,
      province: '',
      city: '',
      district: '',
      formData:{
        location: '',
        address_detail: '',
      },
      formOldData:{
        location: '',
        address_detail: '',
      },
      fieldList: [
        {
          group: '1',
          fieldList: [{
            label: '所在地区',
            fieldName: 'location',
            type: 'location',
            tip: '请选择省、市、区',
            tipType: 'text'
          }, {
            label: '详细地址',
            fieldName: 'address_detail',
            type: 'text',
            tip: '请输入街道小区楼层',
            tipType: 'text'
          }]
        }
      ]
    };
  },

  components: {
    fieldList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fieldName = options.fieldName || ''
    let province = options.province || ''
    let city = options.city || ''
    let district = options.district || ''
    
    let arr = []
    if (province != '') {
      arr.push(province)
      if (city != '') {
        arr.push(city)
        if (district != '') {
          arr.push(district)
        }
      }
    }
    this.formData.location = arr.join('-')
    this.formData.address_detail = options.address_detail || ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
    // 提交数据
    submit() {
      let location = this.formData.location.split('-')
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.$vm.change) {
        prevPage.$vm.change(this.fieldName, this.formData.location)
        prevPage.$vm.change('province', location[0] || '')
        prevPage.$vm.change('city', location[1] || '')
        prevPage.$vm.change('district', location[2] || '')
        prevPage.$vm.change('address_detail', this.formData.address_detail)
      }
			uni.navigateBack();
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
      this.butDisabled = isSame
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>