<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="记账" isHelpme extClass="nav" id="top"></navigationBar>
		<view class="main pad_lr30 p-b-30" v-if="list.data!=''">
			<view class="list bgf m-t-20" v-for="(item,index) in list.data" :key="index">
				<!-- 用户总数据 -->
				<view class="user_info dis-flex flex-x-between" @tap.stop="change(index)">
					<view class="buyer_pic m-r-40"><image :src="item.wxapp.logo" mode="aspectFill"></image></view>
					<view class="buyer_data flex-box">
						<view class="dis-flex flex-y-center flex-x-between">
							<view class="f-30 col-3 onelist-hidden">{{item.wxapp.name}}</view>
							<view class="writeOff app-red f-24" @tap.stop="writeOff(item)">
								销账
								<view class="dian"></view>
								<view class="dian"></view>
								<view class="dian"></view>
							</view>
						</view>
						<view class="m-t-20 dis-flex flex-y-center flex-x-between">
							<view class="money_num" @tap.stop="lookRecord(item)">
								<view class="col-3 f-28">{{item.money.show}}</view>
								<view class="col-6 f-24">当前欠款 <text class="iconfont2 icon-time m-l-10 f-24 app-red"></text></view>
							</view>
							<view class="order_num">
								<view class="col-3 f-28">{{item.bill_order.length}}</view>
								<view class="col-6 f-24">订单数</view>
							</view>
							<view class="col-6 f-24">展开 
								<text v-if="current1!=index" class="iconfont2 icon-xiajiantou f-36 m-l-10"></text>
								<text v-if="current1==index" class="iconfont2 icon-shangjiantou f-36 m-l-10"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 绑定订单 -->
				<view class="order-num" v-show="current1==index">
					<view class="order-top dis-flex flex-x-between">
						<view class="order1 col-9 f-24">序号</view>
						<view class="order2 col-9 f-24">订单号/时间</view>
						<view class="order3 col-9 f-24 m-l-20 m-r-20">本单欠款</view>
						<view class="order-del"><text></text></view>
					</view>
					<template v-for="(vo,k) in item.bill_order">
						<view class="order-item dis-flex flex-y-center flex-x-between" :key="k" @tap.stop="toOrder(vo.order_no)">
							<view class="order1 col-9 f-24 oh">
								<text>{{k+1}}</text>
								<view class="clerk-tag" v-if="vo.user_operate&&vo.user_operate!=''" @tap.stop="lookClerk(vo.user_operate)">店员</view>
								<view v-else class="m-top30"></view>
							</view>
							<view class="order2 f-24">
								<text class="col-3">{{vo.order_no}}</text>
								<view class="col-9 m-top10">{{vo.create_time}}</view>
							</view>
							<view class="order3 col-3 f-26 m-l-20 m-r-20 oh">{{vo.money.show}}</view>
							<view class="order-del oh" @tap.stop="delOrder(vo.id)"><text class="iconfont2 icon-shanchu f-28"></text></view>
						</view>
					</template>
				</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5" text="生意宝技术支持～"></tui-nomore>
		</view>
		<tui-no-data v-if="list.data==''" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
		<view class="writeOff_model">
			<!-- 销账弹窗 -->
			<popup-tips ref="popTips1" type="custom" confirmText="确定">
				<view class="popTips-title f-32 col-f tb-lr-center">销账</view>
				<view class="mcontent">
					<view class="col-6 f-32">当前欠款：<text class="col-3">{{writeOff_money}}</text></view>
					<view class="writeOff_value m-top30">
						<input v-model="moneyVal" class="writeOff-money col-3 f-28" type="text" placeholder-style="color:#999" placeholder="请输入销账金额"/>
					</view>
					<view class="writeOff_value f-28 col-3 m-top30" @tap="dateCheck">
						{{setDateTime}}<text class="iconfont2 icon-calendar1 fr"></text>
					</view>
					<view class="col-6 f-26 m-t-40">选择收款方式</view>
					<view class="wayList dis-flex flex-x-between">
						<template v-for="way in wayList">
							<view class="way-item m-top30 col-3 f-24" :class="wayId==way.id?'on':''" :key="way.id" @tap.stop="changeWay(way.id)">
								<text :class="'m-r-10 iconfont2 '+way.icon" :style="'color:'+way.color"></text>
								{{way.text}}
							</view>
						</template>
					</view>
				</view>
			</popup-tips>
			<!-- 销账记录弹窗 -->
			<popup-tips ref="popTips2" type="custom" confirmText="确定">
				<view class="popTips-title popTips-title2 f-32 col-f tb-lr-center">销账记录</view>
				<view class="mcontent">
					<view class="col-6 f-32">当前欠款：<text class="col-3">{{writeOff_money}}</text></view>
					<view class="bill_list m-top30">
						<tui-time-axis>
							<tui-timeaxis-item backgroundColor="transparent" v-for="(bill,k) in bill_destroy" :key="k">
								<template v-slot:node>
									<view class="tui-node-dot"></view>
								</template>
						
								<template v-slot:content>
									<view class="f-26 col-3">{{bill.money.show}}({{bill.way.text}})</view>
									<view class="f-24 col-6">{{bill.time}}</view>
								</template>
							</tui-timeaxis-item>
						
						</tui-time-axis>
					</view>
				</view>
			</popup-tips>
		</view>
		<!-- 日期选择 -->
		<tui-datetime ref="dateTime" :type="1" cancelColor="#999" color="#333" @confirm="dateChange"></tui-datetime>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			guidePage
		},
		data() {
			return {
				index: 1,//提示框
				mtitle:'',
				mcontent:'',
				writeOff_money:'',
				moneyVal: '',
				setDateTime:'',//初始日期
				
				page: 1,
				list: {},//列表
				loadding: false,
				pullUpOn: true,
				current1: -1,
				wayList: [{id:2,icon:'icon-WeChat1',color:'#24AF41',text:'微信'},{id:3,icon:'icon-Alipay',color:'#00A9F2',text:'支付宝'},{id:1,icon:'icon-paybycard',color:'#FF9917',text:'刷卡'},{id:0,icon:'icon-cash',color:'#F78383',text:'现金'},],
				wayId: 2,
				bill_destroy: [],
			}
		},
		onLoad(options) {
		},
		onShow() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.getList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			this.page = 1;
			this.getList();
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh();
			this.$api.msg("刷新成功")
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false;
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			// 获取列表
			getList (){
				let that = this;
				app._get('shop.wxapp.bill/getBillList',{page: that.page},res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data.list;
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			//销账
			writeOff(item){
				this.initSelectValue()
				this.writeOff_money = item.money.show;
				this.$refs.popTips1.open(()=>{
					let moneyVal = this.moneyVal!=''? this.moneyVal*100 : 0;
					if(moneyVal == ''){
						this.$refs.toast.showTips({msg: '销账金额不能为空'});
						return false
					}
					if(moneyVal > item.money.value){
						this.$refs.toast.showTips({msg: '销账金额不能大于欠款数'});
						return false
					}
					let data = {
						bill_id: item.bill_id,
						money: this.moneyVal,
						time: this.setDateTime,
						way: this.wayId
					}
					if(moneyVal == item.money.value){
						this.mtitle = '提示'
						this.mcontent = '请确认当前所有欠款已完结？';
						this.$refs.popupTips.open(()=>{
							this.destroyBill(data);
						});
					}else{
						this.destroyBill(data);
					}
				});
			},
			destroyBill(data){
				app._post_form('shop.wxapp.bill/destroyBill', data, res => {
					this.$refs.toast.showTips({msg: res.msg});
					this.moneyVal = '';
					this.writeOff_money='';
					this.page = 1;
					this.loadding= false;
					this.pullUpOn= true;
					this.getList()
				});
			},
			//查看记录
			lookRecord(item){
				this.writeOff_money = item.money.show;
				this.bill_destroy = item.bill_destroy;
				this.$refs.popTips2.open()
			},
			//校对金额
			// Val(){
			// 	let moneyVal = this.moneyVal!=''? this.moneyVal*100 : 0;
			// },
			//删除欠账订单
			delOrder(id){
				this.mtitle = '提示'
				this.mcontent = '确定删除该订单？'
				this.$refs.popupTips.open(()=>{
					app._post_form('shop.wxapp.bill/delOrder', {id: id}, res => {
						this.$refs.toast.showTips({msg: res.msg});
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList()
					});
				});
			},
			// 一级开关
			change(index1) {
				let that = this;
				that.current1 = that.current1 == index1 ? -1 : index1;
			},
			// 选择时间
			dateCheck(){
				this.$refs.dateTime.show();
			},
			dateChange(e) {
				this.setDateTime = e.result;
			},
			//默认现在
			initSelectValue() {
				let time = null;
				time = new Date();
				let year = time.getFullYear(),
						month = this.formatNum(time.getMonth() + 1),
						day = this.formatNum(time.getDate()),
						hour = this.formatNum(time.getHours()),
						minute = this.formatNum(time.getMinutes()),
						second = this.formatNum(time.getSeconds());
				let setDateTime = `${year}-${month}-${day} ${hour}:${minute}`;
				this.setDateTime = setDateTime;
			},
			formatNum (num) {
				return num < 10 ? '0' + num : num + '';
			},
			//切换收款方式
			changeWay(id){
				this.wayId = id
			},
			//去订单详情
			toOrder(order_no){
				uni.navigateTo({
					url: '/pages/myGoods/order/detail/index?order_no='+ order_no,
				})
			},
			// 查看店员
			lookClerk(user_operate){
				let obj = {};
				let peon = user_operate.reduce((cur,next) => {
				    obj[next.real_name] ? "" : obj[next.real_name] = true && cur.push(next);
				    return cur;
				},[]);
				
				let name = peon.map((obj,index) =>{
						return obj.real_name;
				}).join(",");
				this.$api.msg('参与店员：'+name)
				// uni.showModal({
				// 	title: '店员昵称',
				// 	content: '店员昵称昵称',
				// 	showCancel:false,
				// 	confirmColor: '#FF7541'
				// })
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index';
</style>
