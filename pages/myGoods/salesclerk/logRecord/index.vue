<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="操作记录" extClass="nav" id="top"></navigationBar>
		<!-- tab -->
		<view class="top-wrap">
			<view class="top bgf">
				<scroll-view class="top-tab" scroll-x="true" enhanced :show-scrollbar="true">
					<view class="tab-item" :class="tabIndex==item.value?'active':''" v-for="(item, index) in tabList" :key="index" @tap="changeTab(item.value)">
						{{item.text}}<template v-show="item.operate_num>0">({{item.operate_num}})</template>
					</view>
				</scroll-view>
				<!-- 日历 -->
				<view class="rangeBox wrap30 app-red f-24 dis-flex flex-y-center flex-x-between">
					<view class="flex-box" @tap.stop="onShowDatePicker">
						<text class="iconfont2 icon-calendar f-32 m-r-10"></text>
						<text v-if="startDate != '' && endDate != ''">{{startDate}} ~ {{endDate}}</text>
						<text v-else>时间筛选</text>
					</view>
					<view class="clear-date" @tap="clearDate">清空</view>
				</view>
				<view class="h_div20"></view>
			</view>
		</view>
		<!-- list -->
		<view class="main wrap30" v-if="list.data!=''">
			<!-- 绑定订单 -->
			<view class="order-list">
				<view class="order-top f-24 col-9 dis-flex flex-x-between">
					<view class="order1">类型/时间</view>
					<view class="order2 m-l-20 m-r-20">状态</view>
					<view class="order3">操作</view>
				</view>
				<template v-for="(vo,k) in list.data">
					<view class="order-item dis-flex f-26 col-3 flex-y-center flex-x-between" :key="k" @tap.stop="toOrder(vo.link.h5)">
						<view class="order1 break-all">
							<text>{{vo.type.text}}-{{vo.detail}}</text>
							<view class="col-6 f-24">{{vo.create_time}}</view>
						</view>
						<view class="order2 m-l-20 m-r-20 oh">
							{{vo.operate.text}}
						</view>
						<view class="order3 oh">
							<template v-if="vo.link.h5">
								详情<text class="iconfont2 m-l-10 icon-more2 f-28"></text>
							</template>
						</view>
					</view>
				</template>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		
		<tui-calendar :type="2" @change="onSelected" ref="tuiCalender" isFixed></tui-calendar>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components:{
		},
		data (){
			return {
				tabList: [],
				tabIndex: 'all',
				startDate: '',
				endDate: '',
				list: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
				store_user_id: '',//员工
			}
		},
		onLoad(options) {
			if(options.store_user_id){
				this.store_user_id = options.store_user_id;
			}
			this.getList()
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
				// that.loadding = that.page>1;
				let data = {
					store_user_id: that.store_user_id,
					type: that.tabIndex,
					startDate: that.startDate,
					endDate: that.endDate,
					page: that.page,
				};
				app._get('shop.setting.salesclerk/getOperateList',data, res => {
					that.loadding = false;
					that.tabList = res.data.types;
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
			changeTab(index){
				this.tabIndex = index
				this.page = 1;
				this.loadding = false;
				this.pullUpOn = true;
				this.getList();
			},
			//去订单详情
			toOrder(url){
				uni.navigateTo({
					url: url
					// '/pages/myGoods/order/detail/index?order_no='+ order_no,
				})
			},
			// 时间选框显示
			onShowDatePicker(){
			  this.$refs.tuiCalender.show()
			},
			//选择
			onSelected(e) {
			  if(e) {
			    this.startDate = e.startDate
			    this.endDate = e.endDate
			  }
			  this.page = 1;
			  this.loadding = false;
			  this.pullUpOn = true;
			  this.getList();
			},
			// 清空
			clearDate(){
				this.startDate = ''
				this.endDate = ''
				
				this.page = 1;
				this.loadding = false;
				this.pullUpOn = true;
				this.getList();
			},
			// --end
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
