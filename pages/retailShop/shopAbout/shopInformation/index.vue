<template>
<view class="shopInformation">
  <!-- 自定义标题栏 -->
  <navigationBar title="店铺资料">
  </navigationBar>
  <view class="cardBox">
    <field-list :mapAddress="mapAddress" ref="fieldList" heightLarge :showRight="false" showLine :formData="formData" :fieldList="fieldList" footerText="" @change="change" :isSubmit="false"></field-list>
    
    <view class="footer">
      <button @tap.stop="submit">去填写联系方式-></button>
    </view>
  </view>
  <!-- 提示框 -->
  <tui-tips position="center" ref="toast"></tui-tips>
</view>
</template>

<script>
const App = getApp().globalData;
import fieldList from '@/components/field-list/index';

export default {
  data() {
    return {
      formData: {
        logo: '',
        name: '',
        notice: '',
        service_qrcode: '',
        address: '',
        shopImg: '',
        wxpay_qrcode: '',
        alpay_qrcode: '',
		identity: '',
		enterprise: '',
		biz_start: '',
		biz_end: ''
      },
      mapAddress: {},
      fieldList: [{
        group: '1',
        fieldList: [{
          label: '店铺logo',
          fieldName: 'logo',
          type: 'img',
          tip: '/static/images/default-avatar.jpg',
          tipType: '',
          showRight: true,
          isShop: true
        }, {
          label: '店铺名称',
          fieldName: 'name',
          type: 'text',
          tip: '未填写',
          tipType: 'text',
          color: '#666'
        }, {
          label: '店铺公告',
          fieldName: 'notice',
          type: 'text',
          tip: '未填写',
          tipType: 'text',
          color: '#666'
        },{
          label: '店铺地址',
          fieldName: 'address',
          type: 'mapAddress',
          tip: '未填写',
          linkType: 'address',
          tipType: 'text'
        },{
          label: '营业开始时间',
          fieldName: 'biz_start',
          type: 'time',
          tip: '未填写',
          tipType: 'text',
        },{
          label: '营业结束时间',
          fieldName: 'biz_end',
          type: 'time',
          tip: '未填写',
          tipType: 'text',
        },
        {
          label: '门店照片',
          fieldName: 'shopImg',
          type: 'link',
          linkUrl: '/pages/retailShop/shopAbout/shopInformation/shopImg/index',
          tip: '未上传',
          haveTip: '已上传',
          tipType: 'isHave'
        }, {
          label: '客服二维码',
          fieldName: 'service_qrcode',
          type: 'link',
          linkUrl: '/pages/user/qrcode/index',
          tip: '未上传',
          haveTip: '已上传',
          tipType: 'isHave'
        }, {
          label: '微信收款码',
          fieldName: 'wxpay_qrcode',
          type: 'link',
          linkUrl: '/pages/user/qrcode/index',
          tip: '未上传',
          haveTip: '已上传',
          tipType: 'isHave'
        }, {
          label: '支付宝收款码',
          fieldName: 'alpay_qrcode',
          type: 'link',
          linkUrl: '/pages/user/qrcode/index',
          tip: '未上传',
          haveTip: '已上传',
          tipType: 'isHave'
        }]
      },
        {
          group: '1',
          fieldList: [{
            label: '身份认证',
            fieldName: 'identity',
            type: 'link',
            linkUrl: '/pages/user/identity/index',
            tip: '未认证',
            tipType: 'state',
            showRemark: '',
            tips: [
              {
                text: '审核中',
                code: 0,
                color: '#FF9911'
              },
              {
                code: 1,
                text: '已认证',
                color: '#6DD400'
              },
              {
                code: 2,
                text: '已驳回',
                color: '#FF7541'
              }
            ]
          }, {
            label: '企业认证',
            fieldName: 'enterprise',
            type: 'link',
            linkUrl: '/pages/user/enterprise/index',
            tip: '未认证',
            tipType: 'state',
            showRemark: '',
            tips: [
              {
                text: '审核中',
                code: 0,
                color: '#FF9911'
              },
              {
                code: 1,
                text: '已认证',
                color: '#6DD400'
              },
              {
                code: 2,
                text: '已驳回',
                color: '#FF7541'
              }
            ]
          }]
        }]
    };
  },

  components: {
    fieldList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  onShow() {
    this.getShowData()
  },

  methods: {
    // 展示数据
    getShowData () {
      App._get('shop.setting/store', {}, (result) => {
        let values = result.data.values || {}
        this.formData.name = values.name || ''
        this.formData.logo = values.logo || ''
        this.formData.logoVal = values.logoVal || ''
        this.formData.service_qrcode = values.service_qrcode || ''
        this.formData.address = values.address ? values.address.name || '' : ''
        this.mapAddress = values.address || {}
        this.formData.wxpay_qrcode = values.wxpay_qrcode || ''
        this.formData.alpay_qrcode = values.alpay_qrcode || ''
        this.formData.notice = values.notice || '欢迎来到' + values.name + '~'
        let store_pics = values.store_pics || []
        this.formData.shopImg = store_pics.length > 0 ? '1' : ''
        this.formData.identity = values.identity ? values.identity.status || '' : ''
        this.formData.enterprise = values.company ? values.company.status || '' : ''
        this.formData.biz_start = values.biz_start || ''
        this.formData.biz_end = values.biz_end || ''
		this.fieldList.forEach(item => {
		  item.fieldList.forEach(element => {
		    if (values.identity && values.identity.status == 2) {
		      if (element.fieldName == 'identity') {
		        element.showRemark = values.identity.remark
		      }
		    }
		    if (values.company && values.company.status == 2) {
		      if (element.fieldName == 'enterprise') {
		        element.showRemark = values.company.remark
		      }
		    }
		  })
		})
      })
    },
    change(fieldName, val, id) {
      if (fieldName == 'name' && val.replace(/^\s+|\s+$/g,"") == '') {
        this.$api.msg('店铺名称不能为空！');
        return false
      } else {
        if (fieldName == 'logo') {
          this.formData.logoVal = id
        }
        let data = {}
        if (fieldName == 'name') {
          data.name = val.replace(/^\s+|\s+$/g,"")
        } else if (fieldName == 'logo') {
          data.logo = id
        } else {
          data[fieldName] = val
        }
		  if (fieldName == 'identity' || fieldName == 'enterprise') {
			this.fieldList.forEach(item => {
			  item.fieldList.forEach(element => {
				if (element.fieldName == fieldName) {
				  element.showRemark = ''
				}
			  })
			})
			this.getShowData()
		  } else {
			App._post_form('shop.setting/store', data, (res) => {
			  this.$api.msg(res.msg);
			  if(res.code==1){
				this.getShowData()
			  }
			})
		  }
      }
    },
    submit() {
      uni.navigateTo({
        url: '/pages/user/myinfo/index'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>