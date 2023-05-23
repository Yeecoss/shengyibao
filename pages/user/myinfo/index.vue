<template>
	<scroll-view class="myinfo" scroll-y>
    <!-- 自定义标题栏 -->
    <navigationBar title="个人资料" extClass="nav" id="top" :back="!isLogin">
      <view v-if="isLogin" slot="left" class="cate_btn" @tap.stop="back">
        <text class="title">跳过</text>
      </view>
    </navigationBar>
    <field-list ref="fieldList" :formData="formData" :fieldList="fieldList" :footerText="footerText" @change="change" @submit="butSubmit" :isSubmit="isSubmit" :butDisabled="butDisabled"></field-list>
    <div v-show="isLoading">
      <loading ></loading>
    </div>
  </scroll-view>
</template>

<script>
let App = getApp().globalData;
import fieldList from '@/components/field-list/index';
import loading from '@/components/loading';

export default {
  data() {
    return {
      isLoading: true,
      title: '修改', // 弹窗标题
      inputType: 'text', // 弹窗输入类型
      footerText: '完成',
      formData:{
        avatarUrl: '',
        nickName: '',
        birthday: '',
        gender: null,
        phone: '',
        contact_phone: '',
        wechat_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        address_detail: '',
        remark: '',
        open_contact: false
      },
      // 老数据用作比对
      formOldData:{
        avatarUrl: '',
        nickName: '',
        birthday: '',
        gender: null,
        phone: '',
        contact_phone: '',
        wechat_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        address_detail: '',
        remark: '',
        open_contact: false
      },
      // 是否可提交
      butDisabled: true,
      isSubmit: false,
      isLogin: false,
      delta: 2,
      fieldList: [
        {
          group: '1',
          fieldList: [{
            labelFw: '800',
            labelFS: '36',
            labelW: '600',
            label: '开启联系方式(建议开启)',
            fieldName: 'open_contact',
            type: 'switch',
            showRemark: '开启后用户能通过填写的微信、二维码、手机号联系到你。',
            showRemarkBg: 'white',
            contentColor: '#FF7541',
            tipDot: true,
            showRemarkTips: '选择开启联系方式，表示你充分认知并理解选择开启联系方式后，其他用户能够通过展示的联系方式跟你发生联系，你允许并同意在app小程序内各个功能区进行展示，包含但不限于联系、浏览轨迹等功能处。如选择关闭此功能，则外部人员不能看到该联系方式。平台开发者严格遵从《生意宝软件许可及服务协议》关于用户隐私的保密协议。'
          }]
        },
        {
          group: '1',
          fieldList: [{
            label: '头像',
            fieldName: 'avatarUrl',
            type: 'img',
            tip: '/static/images/default-avatar.jpg',
            tipType: '',
            isShop: true
          }, {
            label: '昵称',
            fieldName: 'nickName',
            type: 'text',
            tip: '未填写',
            tipType: 'text'
          }, {
            label: '生日',
            fieldName: 'birthday',
            type: 'date',
            tip: '未填写',
            tipType: 'text'
          }, {
            label: '性别',
            fieldName: 'gender',
            type: 'select',
            selectList: ['男', '女'],
            selectListId: [1, 2],
            tip: '未填写',
            tipType: 'text'
          }]
        },
        {
          group: '1',
          fieldList: [{
            label: '手机号',
            fieldName: 'phone',
            type: '',
            linkUrl: '',
			noShowRight: true,
            linkUrls: {
              add: '/pages/user/mobile/bind/index',
              edit: '/pages/user/mobile/check/index'
            },
            linkType: 'mobile',
            tip: '自动获取',
            tipType: 'text'
          }, {
            label: '联系手机号',
            fieldName: 'contact_phone',
            type: 'text',
            tip: '(建议填写)',
            tipType: 'text',
            tipDot: true
          }, {
            label: '微信号',
            fieldName: 'wechat_id',
            type: 'text',
            tip: '(建议填写)',
            tipType: 'text',
            tipDot: true
          }]
        },
        {
          group: '1',
          fieldList: [{
            label: '地址信息',
            fieldName: 'address',
            type: 'link',
            linkUrl: '/pages/user/address/index',
            tip: '未填写',
            linkType: 'address',
            tipType: 'text'
          }]
        },
        // {
        //   group: '1',
        //   fieldList: [{
        //     label: '备注',
        //     fieldName: 'remark',
        //     type: 'largeText',
        //     tip: '备注（50字内）',
        //     tipType: 'text'
        //   }]
        // },
        {
          group: '1',
          fieldList: [{
            label: '注销账号',
            fieldName: 'logout',
            type: 'link',
            linkUrl: '/pages/user/logout/index',
          }]
        }
      ]
    };
  },

  components: {
    fieldList,
    loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.login) {
      this.isLogin = true
      this.butDisabled = false
      this.isSubmit = true
      this.delta = options.delta ? Number(options.delta) : 2
    }
    this.getUserDetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
    back() {
      this.setInfo()
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - Number(this.delta) - 1]; //上一个页面
      if(prevPage.$vm.unitData){
        prevPage.$vm.unitData()
      }
      wx.navigateBack({
        delta: this.delta
      });
    },
    setInfo() {
      if (this.isLogin) {
        App._post_form('user/edit', {
          is_setting_info: 1
        });
      }
    },
    getUserDetail() {
      App._get('user/detail', {}, (result) => {
        let userInfo = result.data.userInfo

        let province = userInfo.province || ''
        let city = userInfo.city || ''
        let district = userInfo.district || ''
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
        let gender = null
        this.fieldList.forEach(item => {
          item.fieldList.forEach(element => {
            if (element.fieldName == 'gender') {
              element.selectList.forEach((items,index) => {
                if (userInfo.gender == items) {
                  gender = index
                }
              })
            }
          })
        })
        let obj = {
          avatarUrl: userInfo.avatarUrl || '',
          nickName: userInfo.nickName || '',
          birthday: userInfo.birthday || '',
          contact_phone: userInfo.contact_phone || '',
          open_contact: !!userInfo.open_contact,
          gender: (gender || gender == 0) ? gender : '',
          phone: userInfo.phone,
          wechat_id: userInfo.wechat_id,
          province: userInfo.province || '',
          city: userInfo.city || '',
          district: userInfo.district || '',
          address_detail: userInfo.address_detail || '',
          address: arr.join('-'),
          remark: userInfo.remark || ''
        }
        this.formData = JSON.parse(JSON.stringify(obj))
        this.formOldData = JSON.parse(JSON.stringify(obj))
        if (this.isLoading) {
          this.isLoading = false
        }
      })
    },
    // 提交逻辑
    submit() {
      let obj = {}
      let arr = ['nickName', 'avatarUrl', 'district', 'province', 'city', 'address_detail', 'gender', 'birthday', 'remark', 'wechat_id', 'open_contact', 'contact_phone']
      arr.forEach(item => {
        this.checkItemSame(item, obj)
      })
      App._post_form('user/edit', obj, result => {
        if (result.code == 1) {
        } else {
          App.showSuccess(result.msg)
          this.getUserDetail()
        }
      }, false, () => {
        wx.hideLoading();
      });
      this.setInfo()
    },
    butSubmit() {
      // if (this.isLogin) {
      //   uni.switchTab({
      //     url: '/pages/index/index'
      //   })
      // } else {
      // }
      wx.navigateBack({
        delta: this.delta
      });
    },
    checkItemSame(fieldName, obj) {
      if (this.formData[fieldName] != this.formOldData[fieldName]) {
        if (fieldName == 'gender'){
          let gender = ''
          this.fieldList.forEach(item => {
            item.fieldList.forEach(element => {
              if (element.fieldName == 'gender' && element.selectListId[this.formData[fieldName]]) {
                gender = element.selectListId[this.formData[fieldName]]
              }
            })
          })
          obj[fieldName] = gender
        } else if (fieldName == 'open_contact') {
          obj[fieldName] = this.formData[fieldName] ? '1' : '0'
        } else {
          obj[fieldName] = this.formData[fieldName]
        }
      }
    },
    // 数据赋值
    change(fieldName, val) {
      this.formData[fieldName] = val
      this.submit()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>