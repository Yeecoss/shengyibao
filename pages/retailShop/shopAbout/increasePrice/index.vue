<template>
	<view class="increasePrice">
		<navigationBar>
			<div class="tabBox dis-flex flex-y-center" slot="center">
				<div @tap="tabChange(0)" class="tabItem" :class="tabVal == 0 ? 'activeTabItem' : ''">
					同步
					<div class="line" v-if="tabVal == 0"></div>
				</div>
				<div @tap="tabChange(1)" class="tabItem" :class="tabVal == 1 ? 'activeTabItem' : ''">
					复制
					<div class="line" v-if="tabVal == 1"></div>
				</div>
			</div>
		</navigationBar>
		<view class="cardBox">
			<view class="popup-main">
				<div class="typeBox dis-flex flex-y-center">
					<div @tap="typeChange(0)" class="typeItem" :class="currentTab == 0 ? 'activeTypeItem' : ''">
						按比例
					</div>
					<div @tap="typeChange(1)" class="typeItem" :class="currentTab == 1 ? 'activeTypeItem' : ''">
						按固定金额
					</div>
				</div>
				<view class="pop-input" v-show="currentTab == 0">
					<div class="addNum dis-flex flex-y-center">
						<div>加价比例</div>
						<input type="digit" :focus="true" class="numInput" v-model="val" :maxlength="10" />
						<div>%</div>
					</div>
					<div class="contentBox">
						<div class="contTitle" v-if="tabVal == 0">举例说明（同步一件商品售价为100元）</div>
						<div class="contTitle" v-else>举例说明（复制一件商品售价为100元）</div>
						<div class="contentItem">例如你设置的比例是10%。</div>
						<div class="contentItem">你的商品售价：100+100×10%=110元。</div>
						<div class="contentItem" v-if="tabVal == 0">你的收入：100×10%=10元。</div>
						<div class="contentItem">0%则是不加价。</div>
						<div class="contentItem">例:49.9+49.9×10%=54.89元。</div>
					</div>
				</view>
				<view class="pop-input" v-show="currentTab == 1">
					<div class="addNum dis-flex flex-y-center">
						<div>加价金额</div>
						<input type="digit" :focus="true" class="numInput" v-model="money" :maxlength="10" />
						<div>元</div>
					</div>
					<div class="contentBox">
						<div class="contTitle" v-if="tabVal == 0">举例说明（同步一件商品售价为100元）</div>
						<div class="contTitle" v-else>举例说明（复制一件商品售价为100元）</div>
						<div class="contentItem">例如你设置的金额是10元。</div>
						<div class="contentItem" v-if="tabVal == 0">你的商品售价：100+10=110元。</div>
						<div class="contentItem">你的收入：10元。</div>
						<div class="contentItem">0元则是不加价。</div>
					</div>
				</view>
			</view>
		</view>
		<view class="pop-btn">
			<view @tap.stop="confirm">确定</view>
		</view>
		<view v-show="isLoading">
			  <loading></loading>
		</view>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import loading from '@/components/loading';

	export default {
		data() {
			return {
				isLoading: true,
				val: '',
				money: '',
				tabVal: 0,
				currentTab: 0,
				dealerSetting: {
					dealer_num: '',
					dealer_type: '1'
				},
				copySetting: {
					copy_num: '',
					copy_type: '1'
				}
			}
		},

		components: {
			loading
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			if (options.tab && options.tab == 'copy') {
				this.tabVal = 1
			}
			this.getData()
		},

		methods: {
			back() {
				uni.navigateBack();
			},
			getData(updata) {
				App._get('shop.xrdealer.setting/detail', {}, (result) => {
					if (result.code == '1') {
						let setting = result.data.setting || {}
						this.dealerSetting = {
							dealer_type: setting.dealer_type || '1',
							dealer_num: setting.dealer_num || '',
						}
						if (!updata) {
							this.unitData()
						}
					}
					this.$nextTick(() => {
						this.isLoading = false
					})
				});
				App._get('shop.setting/store', {}, (result) => {
					if (result.code == '1') {
						let setting = result.data.values || {}
						this.copySetting = {
							copy_num: setting.copy_num || '',
							copy_type: setting.copy_type || '1'
						}
						if (!updata) {
							this.unitData()
						}
					}
				});
			},
			unitData() {
				this.money = ''
				this.val = ''
				if (this.tabVal == 0) {
					this.currentTab = this.dealerSetting.dealer_type == '2' ? 1 : 0
					if (this.currentTab == 1) {
						this.money = this.dealerSetting.dealer_num || ''
					} else {
						this.val = this.dealerSetting.dealer_num || ''
					}
				} else {
					this.currentTab = this.copySetting.copy_type == '2' ? 1 : 0
					if (this.currentTab == 1) {
						this.money = this.copySetting.copy_num || ''
					} else {
						this.val = this.copySetting.copy_num || ''
					}
				}
			},
			tabChange(index) {
				this.tabVal = index
				this.unitData()
			},
			typeChange(index) {
				this.currentTab = index
			},
			confirm() {
				let val = this.currentTab == 1 ? this.money : this.val
				let url = ''
				let data = {}
				if (this.tabVal == 0) {
					url = 'shop.xrdealer.setting/detail'
					data = {
						dealer_type: (this.currentTab + 1),
						dealer_num: val,
					}
				} else {
					url = 'shop.setting/store'
					data = {
						copy_type: (this.currentTab + 1),
						copy_num: val,
					}
				}
				uni.showLoading()
				App._post_form(url, data, (result) => {
					if (result.code == '1') {
						this.$api.msg(result.msg);
						this.getData(true)
					} else {
						this.$api.msg(result.msg);
					}
					uni.hideLoading()
				}, false,  () => {
					uni.hideLoading()
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
