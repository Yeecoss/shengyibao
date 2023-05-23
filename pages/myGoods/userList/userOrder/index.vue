<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="用户订单" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<view class="list bgf m-t-20 wrap30" v-if="list.data!=''">
				<!-- 绑定订单 -->
				<view class="order-num">
					<view class="order-top dis-flex flex-x-between">
						<view class="order1 col-9 f-24">序号</view>
						<view class="order2 col-9 f-24">订单号/时间</view>
						<view class="order3 col-9 f-24 m-l-20 m-r-20">订单金额</view>
						<view class="order-del"><text></text></view>
					</view>
					<template v-for="(vo,k) in list.data">
						<view class="order-item dis-flex flex-y-center flex-x-between" :key="k" @tap.stop="toOrder(vo.order_no)">
							<view class="order1 col-9 f-24">{{k+1}}</view>
							<view class="order2 f-24">
								<view class="col-3">{{vo.order_no}}</view>
								<view class="col-9 m-top10">{{vo.create_time}}</view>
							</view>
							<view class="order3 col-3 f-26 m-l-20 m-r-20">¥{{vo.pay_price}}</view>
							<view class="order-del"><text class="iconfont2 icon-more2 f-28"></text></view>
						</view>
					</template>
				</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5" text="生意宝技术支持～"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				index: 1,//提示框
				page: 1,
				keyword:'',//关键字
				list: {},//列表
				loadding: false,
				pullUpOn: true,
				user_id: '',
			}
		},
		onLoad(options) {
			if(options.user_id){
				this.user_id = options.user_id || '';
				this.getList();
			}
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
				this.getList();
			}
		},
		methods: {
			// 获取列表
			getList (){
				app._get('shop.order/getSimpleOrderList',{
					user_id: this.user_id,
				},res => {
					this.loadding = false;
					let _list = this.list;
					let data = res.data.list;
					if(this.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					this.list = _list;
				})
			},
			//去订单详情
			toOrder(order_no){
				uni.navigateTo({
					url: '/pages/myGoods/order/detail/index?order_no='+ order_no,
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
