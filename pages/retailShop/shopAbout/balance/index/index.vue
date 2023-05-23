<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="余额管理" extClass="nav" id="top" color="#fff" background="linear-gradient(270deg, #FF8383 0%, #FF3440 100%)"></navigationBar>
		<view class="mian">
			<!-- 标题 -->
			<view class="top-wrap wrap30 col-f f-24 dis-flex flex-x-between">
				<view class="yue_info m-t-10">
					<view class="dis-flex flex-y-center flex-wrap" @tap="toLook">
						余额【包含待入账金额 {{balance.pending_amount}} 元】
						<view class="isShare" v-if="balance.is_shared"><text class="iconfont2 icon-xingzhuang f-26"></text></view>
					</view>
					<view class="m-t-10 f-56">{{allMoney}}</view>
					
					<!-- <view class="m-t-10 f-56">{{balance.available_amount}}</view> -->
				</view>
				<view class="merchant-stauts m-t-50">
					<text class="iconfont2 f-24 m-r-10" :class="!ifApproved?'icon-Notcertified':'icon-Certified'"></text>
					{{!ifApproved?'商户未认证':'商户已认证'}}
				</view>
			</view>
			<!-- 可提现金额 -->
			<view class="allowed-yue wrap30 bgf dis-flex flex-y-center flex-x-between">
				<view class="f-28 col-9">可提现余额：<text class="col-3">{{balance.available_amount}}元</text></view>
				<view @tap="toWithdrawal" :class="!ifApproved?'disabled':''" class="withdrawal-btn f-24 col-f">提现</view>
			</view>
			<!-- 会员信息 -->
			<template v-if="isExpire==1||isExpire==2">
				<view class="expire_info wrap30 dis-flex flex-y-center flex-x-between f-24" v-if="vip>1&&vip<5">
					<view>
						<text class="iconfont2 icon-xingzhuang f-24 m-r-10"></text>您的会员{{isExpire==1?'已经':'即将'}}到期，将无法继续收款！
					</view>
					<navigator class="buy-btn t-c" url="/pages/user/member/index">去购买</navigator>
				</view>
			</template>
			
			<!-- 操作按钮 -->
			<view class="operate-wrap">
				<view v-if="!ifApproved" @tap="merchantCA" class="operate-item toMerchant">商户收款认证</view>
				<view v-else @tap="lookList" class="operate-item toMerchant1">查看资金账单</view>
				<!-- <template v-if="isExamine">
					<view class="operate-item toMerchant disabled">资料审核中</view>
				</template>
				<template v-if="applyment_state=='NEED_SIGN'">
					<view @tap="lookStatus" class="operate-item toMerchant">待签约</view>
				</template>
				<view v-if="applyment_state=='REJECTED'" @tap="merchantCA" class="operate-item toMerchant">审核失败</view> -->
				
				<!-- <view v-if="ifApproved" @tap="downloadBill" class="operate-item downloadBill">下载账单</view> -->
				<view class="operate-item" @tap="tokefu">咨询客服</view>
			</view>
		</view>
		
		<share-bottom ref="shareBottom" pageType="userIndex"></share-bottom>
		<!-- 提示 -->
		<popup-tips ref="popupTips0" title="提示" content="请选择联系方式" confirmText="二维码" concelText="手机号"></popup-tips>
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import util from "@/utils/util.js";
	import popupTips from '@/components/popup-tips/index';
	import shareBottom from '@/components/share-bottom/index';
	export default {
		components: {
			popupTips,
			shareBottom,
		},
		data() {
			return {
				mtitle:'',
				mcontent:'',
				applyment_state: '',//商户认证进度
				isExamine: false,//是否审核中
				ifApproved: false,//是否通过
				allMoney: 0,//所有余额
				balance: {//余额信息
					available_amount: 0,
					pending_amount: 0,
					sub_mchid: "",
					is_shared:0
				},
				vip: 0,
				vip_end_time: '',
				isExpire: -1,//判断会员是否到期/即将到期
			}
		},
		onShow() {
			this.getMoney()
			this.getInfo()
		},
		methods: {
			lookList() {
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/balance/list/index'
				})
			},
			// 获取商户实时余额
			getMoney(){
				app._get('shop.commerce.amount/merchantCurrentBalance',{}, res => {
					this.balance = {
						available_amount: res.data.available_amount||0,
						pending_amount: res.data.pending_amount||0,
						sub_mchid: res.data.sub_mchid||"",
						is_shared: res.data.is_shared||0,
					};
					this.allMoney = res.data.total_amount||0;
					
					this.vip = res.data.vip||1;
					this.vip_end_time = res.data.vip_end_time||'';
					this.vipCompare()
				});
			},
			vipCompare(){
				let newDate =  new Date();
				let now = util.dateFormat('YYYY-mm-dd HH:MM:SS',newDate);
				let now7 = this.addDateTime(now,7);//七天后的时间
				
				let isExpire = this.compareDate(now, this.vip_end_time);
				let isExpire2 = this.compareDate(now7, this.vip_end_time);
				// 已过期
				if(isExpire){
					this.isExpire = 1;
				}else if(isExpire2){// 即将过期
					this.isExpire = 2;
				}else{
					this.isExpire = -1;
				}
			},
			compareDate (d1, d2) {
			  let reg = new RegExp('-', 'g')
			  return ((new Date(d1.replace(reg, '/'))) > (new Date(d2.replace(reg, '/'))))
			},
			addDateTime(val,num) {
        let dateTime = new Date(val.replace(/\-/g, '/'));
        dateTime = dateTime.setDate(dateTime.getDate() + num);
        dateTime = new Date(dateTime);
        dateTime = util.dateFormat('YYYY-mm-dd HH:MM:SS', dateTime);
        return dateTime;
	    },
			// 认证信息
			getInfo(){
				app._get('shop.commerce.applyment/status',{}, res => {
					let applyment_state = res.data.applyment_state;
					if(applyment_state=='CHECKING'||applyment_state=='ACCOUNT_NEED_VERIFY'||applyment_state=='AUDITING'){
						this.isExamine = true;
					}
					if(applyment_state=='FINISH'||applyment_state=='FROZEN'){
						this.ifApproved = true;
					}
					
					this.applyment_state = applyment_state;
				});
			},
			// 下载账单
			downloadBill(){
			},
			tokefu(){
				this.$refs.popupTips0.open(()=>{
					let qrcode = 'http://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png';
					this.$refs.shareBottom._popupShowImg('下载',qrcode)
				},()=>{
					this.official();
				})
			},
			official() {
				this.mtitle = '官方电话'
				this.mcontent = '021-54321599'
				this.$refs.popupTips.open(()=>{
					uni.makePhoneCall({
					    phoneNumber: this.mcontent
					})
				})
			},
			toWithdrawal(){
				if(this.ifApproved){
					uni.navigateTo({
						url: '../withdrawal/index'
					})
				}
			},
			// 待签约
			lookStatus(){
				if(this.applyment_state=='NEED_SIGN'){
					uni.navigateTo({
						url: '/pages/user/collectCertificat/index'
					})
				}
			},
			merchantCA(){
				// 去认证
				if(this.applyment_state=='CONTRACT_NOT_EXIST'){
					uni.navigateTo({
						url: '/pages/user/collectionAgreement/index'
					})
				}else{
					uni.navigateTo({
						url: '/pages/user/collectCertificat/index'
					})
				}
			},
			toLook(){
				let that = this;
				if(this.balance.is_shared==1){
					uni.showModal({
						title:'待入账金额包含【分享赚钱】功能店小二佣金',
						confirmText:'查看明细',
						confirmColor:'#FF7541',
						success: (res) => {
							if(res.confirm){
								uni.navigateTo({
									url: '/pages/makeMoney/sellerIndex/index'
								})
							}
						}
					})
				}
			},
		},
	}
</script>

<style lang="scss">
	@import 'index';
</style>
