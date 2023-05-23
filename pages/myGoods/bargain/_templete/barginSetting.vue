<template>
	<view>
		<view class="f-30 bgf col-3 wrap30 dis-flex flex-y-center setting" @tap="openRule">
			<view class="oh">砍价规则</view>
			<view class="flex-box m-l-60 oh onelist-hidden">{{rule}}</view>
		</view>
		
		<!-- 砍价规则框 -->
		<popup-input title="砍价规则" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	export default{
		name:'barginSetting',
		components:{
			popupInput,
		},
		data(){
			return{
				rule: '',
				maxlength: '-1',
				inputType: 'largeText',
			}
		},
		mounted() {
			this.settingDetail()
		},
		methods:{
			openRule(){
				let that = this;
				that.$refs.popupInput._open(that.rule, (val) => {
					app._post_form('shop.bargain/editSetting',{bargain_rules: val}, res => {
						that.$api.msg(res.msg)
						that.rule = val;
					})
				})
			},
			settingDetail(){
				app._get('shop.bargain/settingDetail',{}, res => {
					this.rule = res.data.bargain_rules||'';
				})
			}
		}
	}
</script>

<style lang="scss">
	.m-l-60{
		margin-left: 60rpx;
	}
	.setting{
		line-height: 96rpx;
	}
</style>
