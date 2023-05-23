<template>
	<!--左抽屉弹层 筛选 -->
	<view>
		<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
			<view class="tui-drawer-box">
				<!-- #ifdef MP-WEIXIN || APP-PLUS -->
				<view class="topSpan" id="topSpan"></view>
				<!-- #endif -->
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px'}">
					<view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">订单筛选</text>
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">订单号</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<input v-model="order_no" placeholder-class="tui-phcolor" class="tui-input tui-input-384"
								placeholder="请输入订单号" type="number" />
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">快递单号</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<input v-model="express_no" placeholder-class="tui-phcolor" class="tui-input tui-input-384"
								placeholder="请输入快递单号" type="number" />
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">商品名称</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<input v-model="goods_name" placeholder-class="tui-phcolor" class="tui-input tui-input-384"
								placeholder="请输入商品名称" type="text" />
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">订单类型</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="souceCheck === '0' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="souceCheckClick('0')">全部</view>
							</view>
							<view class="tui-attr-item" :class="souceCheck === '1' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="souceCheckClick('1')">直销</view>
							</view>
							<view class="tui-attr-item" :class="souceCheck === '2' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="souceCheckClick('2')">渠道</view>
							</view>
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">收货人信息</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="address_type === '1' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="address_typeClick('1')">姓名</view>
							</view>
							<view class="tui-attr-item" :class="address_type === '2' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="address_typeClick('2')">手机号</view>
							</view>
							<view class="tui-attr-item" :class="address_type === '3' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="address_typeClick('3')">微信昵称</view>
							</view>
							<input v-model="address_keyword" placeholder-class="tui-phcolor" class="tui-input tui-input-384"
								:placeholder="'请输入'+[address_type == '1'?'姓名':address_type == '2'?'手机号':'微信昵称']" type="text" />
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">渠道商</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="dealer_type === '1' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="dealer_typeClick('1')">手机号</view>
							</view>
							<view class="tui-attr-item" :class="dealer_type === '2' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="dealer_typeClick('2')">店铺名</view>
							</view>
							<view class="tui-attr-item" :class="dealer_type === '3' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="dealer_typeClick('3')">微信昵称</view>
							</view>
							<input v-model="dealer_keyword" placeholder-class="tui-phcolor" class="tui-input tui-input-384"
								:placeholder="'请输入渠道商'+[dealer_type == '1'?'手机号':dealer_type == '2'?'店铺名':'微信昵称']" type="text" />
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">下单时间</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="dateItem tui-input" @tap="openDate('start_time')">
								<text v-if="start_time == ''" class="tui-phcolor">开始时间</text>
								<template v-else>
									<text>{{start_time}}</text>
									<text class="iconBox iconfont2 icon-shanchu2"
										@tap.stop="clearDate('start_time')"></text>
								</template>
							</view>
							<view class="line"></view>
							<view class="dateItem tui-input" @tap="openDate('end_time')">
								<text v-if="end_time == ''" class="tui-phcolor">结束时间</text>
								<template v-else>
									<text>{{end_time}}</text>
									<text class="iconBox iconfont2 icon-shanchu2"
										@tap.stop="clearDate('end_time')"></text>
								</template>
							</view>
							<view class="tui-attr-item">
								<view class="tui-attr-ellipsis" @tap="setTime('1')">今天</view>
							</view>
							<view class="tui-attr-item">
								<view class="tui-attr-ellipsis" @tap="setTime('2')">昨天</view>
							</view>
							<view class="tui-attr-item">
								<view class="tui-attr-ellipsis" @tap="setTime('3')">近七日</view>
							</view>
							<view class="tui-attr-item">
								<view class="tui-attr-ellipsis" @tap="setTime('4')">近30日</view>
							</view>
						</view>
						<view class="tui-safearea-bottom"></view>
					</view>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover"
							:hover-stay-time="150" @tap="reset()">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover"
							:hover-stay-time="150" @tap="submit()">确定</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<tui-datetime ref="dateTime" :type="2" :setDateTime="setDateTime" @confirm="dateChange"
			style="z-index:999999;position:relative;"></tui-datetime>
	</view>
	<!--左抽屉弹层 筛选-->
</template>

<script>
	const App = getApp().globalData;
	export default {
		data() {
			return {
				drawer: false,
				drawerH: 0,
				
				order_no: '',//订单号
				express_no: '',//快递单号
				goods_name: '',//商品名称
				start_time: '',// 开始时间
				end_time: '',// 结束时间
				setDateTime: '',
				fieldName: '',
				address_type: '1',//收货人信息
				address_keyword: '',
				dealer_type: '1',//渠道商信息
				dealer_keyword: '',
				souceCheck: '',//订单类型
			};
		},
		mounted: function(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			uni.getSystemInfo({
				success: res => {
					let height = 100
					// #ifdef MP-WEIXIN || APP-PLUS
					height += 100
					// #endif
					this.drawerH = res.windowHeight - uni.upx2px(height) - 20;
				}
			});
		},
		methods: {
			clearDate(fieldName) {
				this[fieldName] = ''
			},
			openDate(fieldName) {
				this.fieldName = fieldName
				this.setDateTime = this[fieldName]
				this.$refs.dateTime.show();
			},
			// 订单类型
			souceCheckClick(souceCheck) {
				if (this.souceCheck == souceCheck) {
					this.souceCheck = ''
				} else {
					this.souceCheck = souceCheck
				}
			},
			// 收货人信息
			address_typeClick(address_type) {
				this.address_type = address_type
			},
			dealer_typeClick(dealer_type) {
				this.dealer_type = dealer_type
			},
			// 时间
			getDay(day){
				let today = new Date();  
						
				let targetday_milliseconds=today.getTime() + 1000*60*60*24*day;          
		
				today.setTime(targetday_milliseconds); 
						
				let tYear = today.getFullYear();  
				let tMonth = today.getMonth();  
				let tDate = today.getDate();  
				tMonth = this.doHandleMonth(tMonth + 1);  
				tDate = this.doHandleMonth(tDate);  
				return tYear+"-"+tMonth+"-"+tDate;  
			},
			doHandleMonth(month){
			    let m = month;  
			    if(month.toString().length == 1){  
			        m = "0" + month;  
			    }  
			    return m;  
			},
			setTime(type) {
				if (type == '1') {
					this.start_time = this.getDay(0)
					this.end_time = this.getDay(0)
				} else if (type == '2') {
					this.start_time = this.getDay(-1)
					this.end_time = this.getDay(-1)
				} else if (type == '3') {
					this.start_time = this.getDay(-7)
					this.end_time = this.getDay(0)
				} else if (type == '4') {
					this.start_time = this.getDay(-30)
					this.end_time = this.getDay(0)
				}
			},
			reset() {
				this.order_no = ''
				this.express_no = ''
				this.goods_name = ''
				
				this.start_time = ''
				this.end_time = ''

				this.address_type = '1'
				this.address_keyword = ''
				this.dealer_type = '1'
				this.dealer_keyword = ''
				this.souceCheck = ''
			},
			screen() {
				this.drawer = true;
			},
			closeDrawer: function() {
				this.drawer = false;
			},
			submit() {
				let obj = {}
				if (this.order_no != '') {
					obj.order_no = this.order_no
				}
				if (this.express_no != '') {
					obj.express_no = this.express_no
				}
				if (this.goods_name != '') {
					obj.goods_name = this.goods_name
				}
				if (this.start_time != '') {
					obj.start_time = this.start_time
				}
				if (this.end_time != '') {
					obj.end_time = this.end_time
				}
				if (this.address_keyword != '') {
					obj.address_type = this.address_type
					obj.address_keyword = this.address_keyword
				}
				if (this.dealer_keyword != '') {
					obj.dealer_type = this.dealer_type
					obj.dealer_keyword = this.dealer_keyword
				}
				obj.order_type = this.souceCheck==0?'':this.souceCheck
				this.$emit('change', obj)
				this.closeDrawer()
			},
			dateChange(data) {
				this[this.fieldName] = data.result
			}
		},
		components: {}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
