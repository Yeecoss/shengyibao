<template>
	<view class="min_h_100 bg_blue">
		<!-- 自定义标题栏 -->
		<navigationBar title="送会员" extClass="nav" id="top"></navigationBar>
		
		<view class="top">
			<image lazy-load src="https://pic.kaidanxia.com/2020-12-29/110112ab8348262.png" mode="widthFix"></image>
			<view class="f-26 col-f t-c rule-btn" @tap="looRule">活动规则</view>
			<view class="activity-time f-30" v-if="info.activity">活动时间：{{info.activity.start_time}}-{{info.activity.end_time}}</view>
		</view>
		<view class="main wrap30">
			<view class="qual-title"><image lazy-load src="https://pic.kaidanxia.com/2020-11-18/160016d9fb31340.png" mode="widthFix"></image></view>
			<!-- 获取资格 -->
			<view class="qualification dis-flex flex-x-between m-top30">
				<template v-for="(item,index) in qualList">
					<template v-if="item.value">
						<view class="qual-item dis-flex flex-dir-column flex-x-center flex-y-center" :key="index">
							<view class="qual-icon t-c"><text class="iconfont2" :class="item.icon"></text></view>
							<view class="qual-txt t-c f-26">{{item.text}}</view>
							<view class="qual-btn f-24 t-c">已认证</view>
						</view>
					</template>
					<template v-else>
						<navigator :url="item.url" hover-class="none" class="qual-item dis-flex flex-dir-column flex-x-center flex-y-center" :key="index">
							<view class="qual-icon t-c"><text class="iconfont2" :class="item.icon"></text></view>
							<view class="qual-txt t-c f-26">{{item.text}}</view>
							<view class="qual-btn f-24 t-c border">去认证</view>
						</navigator>
					</template>
				</template>
			</view>
			<view class="bg_pic1"><image src="https://pic.kaidanxia.com/2020-11-18/1533429ed438946.png" mode="widthFix"></image></view>
			<!-- 距开始 -->
			<view class="countDown-wrap dis-flex flex-x-center flex-y-center m-t-10">
				<view class="countLine"></view>
				<text class="f-28 m-r-20">{{info.cur_sessions&&info.cur_sessions[1].expired=='已开始'?'距结束':'距开始'}}</text>
				<template>
					<tui-countdown :time="countTime" :width="36" color="#FF3229" borderColor="#FEEDDA" backgroundColor="#FEEDDA" colonColor="#FEEDDA"></tui-countdown>
				</template>
				<view class="countLine"></view>
			</view>
			<!-- 时间列表 -->
			<view class="timeList-wrap t-c dis-flex flex-x-between flex-y-center m-t-40" @tap="lookTimes">
				<image class="timeList-bg" lazy-load src="https://pic.kaidanxia.com/2020-11-18/1600175a8df6208.png" mode="widthFix"></image>
				<view class="time-item" :class="index==1&&item.expired=='已开始'?'active':''" v-for="(item,index) in info.cur_sessions" :key="index">
					<view class="f-28">{{item.date}}</view>
					<view class="f-26">{{item.time}}</view>
					<view class="f-24 m-t-10 time-status">{{item.expired}}</view>
				</view>
				<view class="more"><text class="iconfont2 icon-more3 f-32"></text></view>
			</view>
			<!-- 地址 -->
			<view class="address-wrap t-c f-32 col-f" @tap="toAddress">
				<text class="iconfont2 icon-address f-34 m-r-10"></text>
				<template v-if="address!=''">
					{{address}}<text>（{{info.resources!=''?info.resources.total_num+'份':'该地区暂未开放'}}）</text>
				</template>
				<text v-else>您还没有选择地址～</text>
				<view class="bg_pic2"><image src="https://pic.kaidanxia.com/2020-11-18/1533417e8e27544.png" mode="widthFix"></image></view>
			</view>
			<view class="member-wrap dis-flex flex-x-end">
				<view class="member-info">
					<view class="f-40">1年龙虾会员</view>
					<view class="money f-32 m-t-6">¥0 <text class="col-9 line-through m-l-20">¥1498</text></view>
					<view class="f-24 m-t-6" v-if="address==''">请先选择地址～</view>
					<!-- 进度条 -->
					<view v-if="info.resources!=''&&address!=''" class="sharp-progress dis-flex flex-y-center flex-x-between">
						<view class="yoo-progress m-r-10">
							<view class="yoo-progress--portion" :style="'width: ' + progress + '%;'"></view>
						</view>
						<view class="sharp-sales">已抢{{ progress }}%</view>
					</view>
				</view>
				<view class="receive-btn t-c" :class="isAllqual&&address!=''&&info.resources!=''?'receive-active':''" @tap="sharpVip">
					<view class="receive-btn-c">
						<view class="receive-btn-v"><image lazy-load src="https://pic.kaidanxia.com/2020-11-18/191209d7c5b3388.png" mode="widthFix"></image></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 成功弹窗 -->
		<tui-modal :show="showModal" :custom="true" fadeIn padding="0" width="520rpx" radius="16rpx" :maskClosable="false">
			<view class="tui-modal-custom tipsBox">
				<view class="tipsImgBox dis-flex flex-y-center flex-x-center">
				  <image mode="aspectFit" class="tipsBg" :src="types[type].bgUrl"></image>
				  <view class="tipsImg">
				    <image mode="aspectFit" :src="types[type].url"></image>
				  </view>
				</view>
				<view class="title" :style="{color: types[type].color}">{{types[type].title}}</view>
				<view class="content">{{types[type].content}}</view>
				<view class="tipsButBox" :style="{background: types[type].butBg}" @tap.stop="changeModal">确定</view>
			</view>
		</tui-modal>
		<!-- 规则 -->
		<popupRule ref="activityRule"></popupRule>
		<!-- 场次 -->
		<activity-times ref="activityTimes"></activity-times>
		<!-- <popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips> -->
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	// import StateEnum from "@/utils/enum/sharp/ActiveStatus";// 枚举类：秒杀会场活动状态
	// import CountDown from "@/utils/countdown";// 倒计时插件
	// import popupTips from '@/components/popup-tips/index';
	import popupRule from './activity-rule/index';
	import activityTimes from './activity-times/index';
	import popup from '@/components/popup/index';
	export default {
		components: {
			// popupTips,
			popupRule,
			activityTimes,
			popup,
		},
		data() {
			return {
				// mtitle:'',
				// mcontent:'',
				qualList:[
					{icon:'icon-identity',text:'身份认证',url:'/pages/user/identity/index?fieldName=identity',value:0},
					{icon:'icon-enterprise1',text:'企业认证',url:'/pages/user/enterprise/index?fieldName=enterprise',value:0},
					{icon:'icon-Photo',text:'门店照片',url:'/pages/retailShop/shopAbout/shopInformation/shopImg/index?fieldName=shopImg',value:0},
					{icon:'icon-Collection',text:'收款认证',url:'/pages/user/collectCertificat/index',value:0},
				],
				// StateEnum,// 枚举类：秒杀会场活动状态
				countDownList: [],// 倒计时
				info:'',
				address:'',
				all_sessions: [],//更多场次
				isAllqual: false,
				countTime: 0,//倒计时秒
				
				showModal: false,
				type: '2',
				types: {
				  2: {
				    color: '#FF7541',
				    butBg: '#FF7541',
				    title: '恭喜您！',
				    content: '您已成为龙虾x1年',
				    url: 'http://pic.kaidanxia.com/2020-07-15/20200715155649423a99239.png',
						bgUrl: 'http://pic.kaidanxia.com/2020-07-15/20200715155648800ca7992.png',
						vip: 4
				  },
				},
				progress:0,//进度条
			}
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			// 活动详情
			getInfo(){
				app._get('vip.activity/detail', {}, res =>{
					this.info = res.data;
					this.address = res.data.address||'';
					this.all_sessions = res.data.all_sessions || [];
					
					let auth = res.data.auth;
					this.qualList[0].value = auth.identity;
					this.qualList[1].value = auth.company;
					this.qualList[2].value = auth.store;
					this.qualList[3].value = auth.payment;
					let resources = res.data.resources;
					if(resources!=''){
						this.progress = (Number(resources.actual_num)/Number(resources.total_num)).toFixed(2)*100
					}
					this.initCountDownDataFun();
					this.$nextTick(() => {
						this.Valqual()
					})
				});
			},
			// 初始化倒计时组件
			initCountDownDataFun(data) {
			  let countDownDate = this.info.cur_sessions[1].expire_time||0;
				
				if(countDownDate!=''){
					let now_time = Math.round(new Date() / 1000);
					let end_time = Math.round(new Date(countDownDate.replace(/\-/g, '/')).getTime()/1000);
					if(now_time < end_time){
						let time = end_time - now_time;
						this.countTime = time;
					}
				}else{
					this.countTime = 0;
				}
			},
			// 领取vip
			sharpVip(){
				if(!this.isAllqual){
					this.$refs.toast.showTips({msg: '请先完成认证！'});
					return false;
				}else if(this.address==''){
					this.$refs.toast.showTips({msg: '请先选择地址！'});
					return false;
				}else if(this.info.resources==''){
				}else{
					app._post_form('vip.activity/sharpVip', {}, res => {
						if(res.code==1){
							this.changeModal();
						}else{
							this.$refs.toast.showTips({msg: res.msg});
						}
					});
				}
			},
			// 判断认证是否
			Valqual(){
				let num = 0;
				for (let i in this.qualList) {
					if(this.qualList[i].value==1){
						num++;
					}
				}
				if(num>=4){
					this.isAllqual = true
				}else{
					this.isAllqual = false
				}
			},
			// 初始化倒计时组件
			// initCountDownDataFun(data) {
			// 	let that = this,
			// 		curTabbar = that.tabbar[that.curTabIndex]; 
			// 		// 记录倒计时的时间
			// 	if (this.countDownList.length == 0) {
			// 		this.countDownList.push({
			// 			date: curTabbar.count_down_time
			// 		})
			// 	} else {
			// 		this.countDownList[0].date = curTabbar.count_down_time
			// 	}
			// 	// 执行倒计时
			// 	CountDown.onSetTimeList(that, 'countDownList');
			// },
			// 查看规则
			looRule(){
				this.$refs.activityRule._open()
			},
			// 查看场次
			lookTimes(){
				this.$refs.activityTimes._open(JSON.stringify(this.all_sessions))
			},
			toAddress(){
				uni.navigateTo({
					url: '/pages/retailShop/shopAbout/shopInformation/index'
				})
			},
			changeModal(){
				this.showModal = !this.showModal;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
