<template>
	<view class="wrap30 bgf7 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="网点账号" extClass="nav" id="top"></navigationBar>
		
		<view class="main">
			<template v-if="rookie!=''">
				<view class="f-28 m-t-40 f-w">菜鸟-淘宝-淘宝名称（{{rookie.length}}）</view>
				<view class="list" v-for="(item,index) in rookie" :key="item.customer_id" @tap.stop="netChange(item)">
					<!-- 名称类型 -->
					<view class="list-top dis-flex flex-y-center flex-x-between">
						<view class="title f-28 col-3" :class="item.is_default?'red':''">
						{{item.send_site}}<!-- {{item.is_default?'（默认）':''}} -->
						</view>
						<view class="type f-24 col-6">{{item.express_name}}</view>
					</view>
					<view class="bottom m-top30 dis-flex flex-y-center flex-x-between">
						<view class="net-info f-26 col-6">
							<text>{{item.send_staff}}</text>
							<text>{{item.pay_type.text}}</text>
							<text>{{item.exp_type.text}}</text>
						</view>
					</view>
				</view>
			</template>
			<template v-if="list.data!=''">
				<view class="f-28 m-t-40 f-w">快递网点账号</view>
				<view class="list" v-for="(item,index) in list.data" :key="index" @tap.stop="netChange(item)">
					<!-- 名称类型 -->
					<view class="list-top dis-flex flex-y-center flex-x-between">
						<view class="title f-28 col-3" :class="item.is_default?'red':''">{{item.send_site}}{{item.is_default?'（默认）':''}}</view>
						<view class="type f-24 col-6">{{item.express_name}}</view>
					</view>
					<view class="bottom m-top30 dis-flex flex-y-center flex-x-between">
						<view class="net-info f-26 col-6">
							<text>{{item.send_staff}}</text>
							<text>{{item.pay_type.text}}</text>
							<text>{{item.exp_type.text}}</text>
						</view>
						<view class="operation dis-flex flex-y-center f-24 col-8">
							<view class="operate-btn dis-flex flex-y-center flex-x-center" @tap.stop="openSheet(index,item)">
								<text class="iconfont2 icon-more-mini col-9"></text>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#F7F7F7"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>添加网点账号</view>
			</view>
		</view>
		<!-- 添加账号操作菜单 -->
		<tui-actionsheet :show="showSheet2" :itemList="itemList2" :radius="false" @click="clickNext2" @cancel="cancel2"></tui-actionsheet>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				list: '',//信息
				page: 1,
				loadding: false,
				pullUpOn: true,
				showSheet: false,//是否显示操作菜单
				itemList: [{text: '设为默认',color: '#333'},{text: '删除',color: '#333'},],
				default_id:'',//默认
				
				rookie:[
// 					{create_time: "2020-12-01 15:00:15",
// customer_id: 35,
// customer_name: "上海闵行邮政网点",
// customer_pwd: "123456",
// exp_type: {value: "1", text: "标准快递"},
// express_code: "YZPY",
// express_id: 10007,
// express_name: "邮政快递包裹",
// ext_params: "true",
// is_default: 0,
// is_delete: 0,
// month_code: "45112",
// pay_type: {value: "1", text: "现付"},
// send_site: "邮政网点",
// send_staff: "忙呢么吗",
// sort: 0,
// update_time: "2020-12-01 15:00:15",
// wxapp_id: 10023},
				],//菜鸟面单
				showSheet2: false,//是否显示操作菜单
				itemList2: [{text: '菜鸟面单账号',color: '#333'},{text: '快递网点账号',color: '#333'},],
			}
		},
		onLoad(options) {
				// this.getList();
		},
		onShow() {
			this.list = [];
			this.loadding= false;
			this.pullUpOn= true;
			this.page = 1;
			this.getList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			//延时为了看效果
			setTimeout(() => {
				this.list = [];
				this.page = 1;
				this.getList();
				this.pullUpOn = true;
				this.loadding = false;
				uni.stopPullDownRefresh();
				this.$api.msg('刷新成功!');
			}, 200)
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			//运费模板列表
			getList(){
				let that = this;
				app._get('shop.express.customer/index',{page: that.page},res => {
					that.loadding = false;
					let _list = that.list,
							data = res.data.list.data;
							
					if(_list.data){
						_list.data = _list.data.concat(data);
					}else{
						_list = res.data.list;
					}
					that.list = _list;
				});
			},
			// 删除
			toDelete(id,index){
				let that = this;
				
				uni.showModal({
					title: '友情提示',
					content: '确认删除该模板？',
					confirmColor: '#FF7541',
					success: (res) => {
						if(res.confirm){
							app._post_form('shop.express.customer/delete',{customer_id: id}, res => {
									that.$api.msg(res.msg);
								if(res.code==1){
									that.list.data.splice(index,1);
								}
							});
						}
					}
				})
			},
			//设置为默认
			setDefault: function (id) {
			  let that = this;
				app._post_form('shop.express.customer/default',{customer_id: id}, res => {
					that.$api.msg(res.msg);
					if(res.code==1){
						this.list = [];
						this.page = 1;
						this.pullUpOn = true;
						this.loadding = false;
						this.getList();
					}
				});
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				// 设置为默认
				if(e.index == 0){
					that.showSheet = false;
					that.setDefault(that.checkedItem.customer_id)
				}
				// 删除
				if(e.index == 1){
					that.showSheet = false;
					that.toDelete(that.checkedItem.customer_id,that.checkItemIndex)
				}
			},
			// 点击操作按钮-打开底部菜单
			openSheet(index, item){
				this.checkedItem = item;
				this.checkItemIndex = index;
				this.showSheet = true;
			},
			//关闭底部菜单
			cancel(){
				this.showSheet = false;
			},
			cancel2(){
				this.showSheet2 = false;
			},
			// 点击底部操作菜单2
			clickNext2(e){
				this.showSheet2 = false;
				// 菜鸟面单账号
				if(e.index == 0){
					uni.navigateTo({
						url: `./rookie`
					})
				}
				// 快递网点账号
				if(e.index == 1){
					uni.navigateTo({
						url: `./detail?type=1`
					})
				}
			},
			//更新页面
			// templChange(e){
			// 	if(e){
			// 		this.list = [];
			// 		this.page = 1;
			// 		this.getList();
			// 	}
			// },
			// 点击编辑
			toEdit(id){
				uni.navigateTo({
					url: `./detail?id=${id}&type=2`
				})
			},
			// 新增
			toAddbtn(){
				// this.showSheet2 = true;
				uni.navigateTo({
					url: `./detail?type=1`
				})
			},
			//选择网点账号-电子面单
			netChange(item){
				this.pageBack(item)
			},
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.netChange){
					prevPage.$vm.netChange(data)
					uni.navigateBack();
				}
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/index.scss';
	.list{
		padding-left: 20rpx;
		padding-right: 20rpx;
	}
	.list-top{
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
	.operation view:first-child{
		margin-left: 0;
		width: 46px;
		overflow: hidden;
	}
	.net-info{
		max-width: 64%;
		text{
			padding-right: 20rpx;
			margin-right: 20rpx;
			border-right: 1rpx solid #DEDEDE;
			&:last-child{border-right: 0;}
		}
	}
	.red{color: $red;}
</style>
