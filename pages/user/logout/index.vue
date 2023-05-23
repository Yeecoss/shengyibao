<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="注销账号" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<view class="title f-28">注销账号规则:</view>
			<view class="rules f-24 col-6">1、该账号上的店铺(或买家)近三个月有交易，请全部交易完成(已关闭订单不计算)三个月再申请注销；</view>
			<view class="rules f-24 col-6">2、账户内有余额尚未提现，如需注销账号，请先将账户余额全部提现；</view>
			<view class="rules f-24 col-6">3、该账号上的店铺有商品尚未下架，如需注销账号请先将所以商下架；</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot">
				<view class="foot-btn f-32 col-f" :class="status==0?'disabled':''" @tap.stop="toSubmit">{{status==0?'审核中':'申请注销'}}</view>
			</view>
			<view class="notes f-24 col-9 t-c m-top30" v-if="status==0">
				<text class="iconfont2 icon-jingshi f-24"></text>
				<text class="m-l-10">将在72小时内审核完成</text>
			</view>
			<view class="notes f-24 col-9 t-c m-top30" v-if="status==2">
				<text class="iconfont2 icon-jingshi f-24"></text>
				<text class="m-l-10">已驳回，</text>
				<text class="red" @tap="look">驳回原因</text>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	export default {
		data() {
			return {
				status: 3,//初始值未申请过
				remark: '',//驳回原因
				index: 1,//提示框
			}
		},
		onLoad() {
			this.getInfo();
		},
		methods: {
			// 注销状态查询
			getInfo(){
				app._get('user.destroy/info',{}, res => {
					this.status = res.data.status;
					this.remark = res.data.remark || '';
					if(res.data.status==1){
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/index/index'
							})
						},1500)
					}
				})
			},
			// 申请注销
			toSubmit(){
				let that = this;
				if(!that.status==0){
					uni.showModal({
						title: '确定注销该账号？',
						confirmColor: '#FF7541',
						success: (res) => {
							if(res.confirm){
								app._post_form('user.destroy/add',{}, res => {
									//申请后续操作
									if(res.code==1){
										that.$api.msg(res.msg);
										that.status = res.data.status;
										that.remark = res.data.remark;
										if(res.data.status==1){
											setTimeout(()=>{
												uni.switchTab({
													url: '/pages/index/index'
												})
											},1500)
										}
									}else{
										that.$api.msg(res.msg);
									}
								});
							}
						}
					})
				}
			},
			// 查看驳回原因
			look(){
				uni.showModal({
					title: this.remark,
					confirmColor: '#FF7541',
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
