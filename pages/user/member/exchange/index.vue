<template>
<view class="exchange">
  <!-- 自定义标题栏 -->
  <navigationBar :title="'兑换' + member" extClass="nav" id="top"></navigationBar>
  <view class="container">
	<div class="logoBox" v-if="channel_name != ''">
		<div class="logo" @tap="backHome">
			<image mode="aspectFit" :src="channel.logo"></image>
			<div>{{channel.notice}}</div>
		</div>
	</div>
    <div class="inputBox">
      <input v-model="cdkey" type="text" placeholder="请输入您的兑换码" placeholder-class="inputPlaceholder">
    </div>
    <div class="bindUserBox" v-if="bindUser" @tap.stop="showTips">
      <text class="bindUser">已绑定代理：白萝卜白白</text>
    </div>
    <div class="butBox">
      <div class="but" @tap.stop="getVip">立即兑换</div>
    </div>
    <div class="tipsBox">
      <div class="title">兑换规则</div>
        <p class="content">1. 兑换码可以用来兑换【生意宝】{{member}}权限；</p>
        <p class="content">2. 兑换码是有N个字符组成，输入后即可兑换相应{{member}}权限；</p>
        <p class="content">3. 兑换码只能使用一次，兑换后立即失效；</p>
        <p class="content">4. 请谨慎保存兑换码，如忘记或遗失平台不予负责；</p>
        <p class="content">5. 兑换码是【生意宝】上海旭冉信息科技有限公司提供给{{member}}体验不同权限的体验码，任何人或单位不得通过销售、转卖兑换码获利，一经发现，将追究相应责任；</p>
        <p class="content">6. 上海旭冉信息科技有限公司保留最终解释权。</p>
    </div>
  </view>
  <popup-tips ref="popupTips" title="代理商资料" content=""></popup-tips>
	<login ref="login"></login>
</view>
</template>

<script>
let App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';
import login from '@/components/login/index';

export default {
  data() {
    return {
		channel_name: '',
		channel: {},
      bindUser: false,
      member: App.member,
      list: [],
	  logo: '',
	  cdkey: ''
    };
  },

  components: {
    popupTips,
		login
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
		let scene = App.getSceneData(e);
		this.channel_name = e.channel_name ? e.channel_name : scene.channel_name || ''
		if (this.channel_name != '') {
			this.getData()
		}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		if (this.channel_name != '') {
			this.getData()
		}
  },
  methods: {
	  backHome() {
		uni.switchTab({
		  url: '/pages/index/index'
		});
	  },
	  getData() {
			App._get('vip.channel/getCdkey', {
				channel_name: this.channel_name
			}, (result) => {
				if (result.code == '1') {
					this.channel = result.data || {}
					this.cdkey = this.channel.cdkey || ''
				}
			}, () => {
			})
	  },
		getVip() {
			uni.showLoading()
			if (this.channel_name == '') {
				App._post_form('vip.collection/exchangeCdkey', {
					cdkey: this.cdkey
				}, (result) => {
					uni.hideLoading()
					this.$api.msg(result.msg)
					if (result.code == '1') {
						// this.$emit('showTips', i + 1 + '')
					}
				}, () => {
					uni.hideLoading()
				})
			} else {
				App._post_form('vip.channel/exchangeCdkey', {
					cdkey: this.cdkey,
					channel_name: this.channel_name
				}, (result) => {
					if (result.code == -1) {
						this.showLogin()
					} else if (result.code == '1') {
						this.$api.msg(result.msg)
						setTimeout(() => {
							this.backHome()
						}, 500)
					}
				}, false, () => {
					uni.hideLoading()
				},  false, true)
			}
    },
	showLogin() {
		App.doLogin(1, (code) => {
			if (code == 1) {
				this.$refs.login.open()
			}
		}, true, true)
	},
    showTips() {
      this.$refs.popupTips.open()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>