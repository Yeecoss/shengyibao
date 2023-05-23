<template>
	<view class="page min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="设置" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">主题色</view>
					<view class="control dis-flex flex-y-center flex-x-end" @tap.stop="toColors">
						<view class="theme m-r-10" :style="{background:theme.color,borderColor:theme.color}"></view>
						<view class="f-30" :style="'color:'+themeColor">{{theme.name||''}}</view>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
			</view>
		</view>
		<selecColor ref="selecColor" @changeTheme="changeTheme"></selecColor>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import selecColor from'./selecColor/index';
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			selecColor,
			popupTips
		},
		data() {
			return {
				theme: {},
				themeColor:'#828393',
				colors:[],
				mtitle:'',
				mcontent:'',
			}
		},
		onLoad() {
			this.getSettings();
		},
		methods: {
			getSettings(){
				app._get('user.setting/getSettings',{}, res => {
					if(res.data.theme){
						this.theme = res.data.theme;
						uni.setStorageSync('theme', res.data.theme);
					}
					this.getColors()
				})
			},
			getColors(){
				app._get('user.setting/getOfficalColors',{}, res => {
					this.colors = res.data ||[];
					if(JSON.stringify(this.theme) == "{}"){
						this.theme = res.data[0];
					}
				});
			},
			toColors(){
				if(this.colors){
					let index = this.initTheme();
					this.$refs.selecColor.openModal(JSON.stringify(this.colors),index);
				}
			},
			initTheme(){
				let index = 0;
				for (let i in this.colors) {
					if(this.theme.color == this.colors[i].color){
						index = i;
					}
				}
				return index;
			},
			// 修改颜色主题
			changeTheme(data){
				this.mtitle = '提示';
				this.mcontent = '确定使用当前主题色？';
				this.$refs.popupTips.open(()=>{
					let obj = {
						theme: data
					};
					app._post_form('user.setting/updateSettings',{settings: JSON.stringify(obj)},res => {
						this.$api.msg(res.msg);
						this.getSettings()
						// 更新主题tabbar
						// app.getTheme(this.$bus)
						this.$store.commit('getTheme',app)
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	.page{
		background: #F8F8FA;
	}
	.theme{
		width: 30rpx;
		height: 30rpx;
		background: #fff;
		border-radius: 50%;
		border: 1rpx solid #828393;
		box-sizing: border-box;
		overflow: hidden;
	}
	.default{
		color: #828393;
	}
</style>
