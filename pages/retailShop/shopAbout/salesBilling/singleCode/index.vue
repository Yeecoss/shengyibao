<template>
<view class="shopInformation">
	<!-- 自定义标题栏 -->
	<navigationBar title="接单码" :fixed="false">
	</navigationBar>
	<div>
		<div class="autoBox dis-flex flex-y-center flex-x-between">
			<div>自动打印</div>
			<div>
				<cust-switch :checked="auto" @change="change"></cust-switch>
			</div>
		</div>
		<div class="qrcodeBox dis-flex flex-y-center flex-x-center">
			<div>
				<image :src="qrcode" mode="widthFix"></image>
				<div class="qrcodeBut" @tap.stop="downLoad">
				下载
				</div>
			</div>
		</div>
	  </div>
	<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
</view>
</template>

<script>
const App = getApp().globalData;
import downloadFile from '@/components/download-file';
import custSwitch from '@/components/cust-switch/index.vue';
let shareTitle = ''
export default {
  data() {
    return {
		qrcode: '',
		auto: false
    }
  },
  components: {
		downloadFile,
		custSwitch
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  onShow() {
    this.getDetail()
  },
  methods: {
	  change(val) {
		  this.auto = val
		  App._post_form('setting.printer/setAutoPrint', {}, (result) => {
		    if (result.code == '1') {
		    } else {
		      this.$api.msg(result.msg)
		    }
		  }, () => {
		  })
	  },
    downLoad() {
		this.$refs.download._downloadFileS([this.qrcode]);
    },
    //下载回调
    comfirmStatusS (promise, a) {
      promise.then((res) => {
        uni.hideLoading();
        uni.hideToast();
        this.$api.msg(res?"下载成功":'取消保存')
      })
    },
    getDetail() {
      App._get('store.shop.sale/getOrderQrcode', {}, (result) => {
        if (result.code == '1') {
          this.qrcode = result.data.qrcode || 'https://shop.kaidanxia.com/temp/10128/f4fa5a6dfaacfa572c973e46fd352a46.png?t=1603165281'
		  this.auto = result.data.auto_print ? true : false
        } else {
          this.qrcode = 'https://shop.kaidanxia.com/temp/10128/f4fa5a6dfaacfa572c973e46fd352a46.png?t=1603165281'
          this.$api.msg(result.msg)
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>