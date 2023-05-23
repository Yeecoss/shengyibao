<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="用户列表" extClass="nav" id="top"></navigationBar>
		
		<tui-sticky :isNativeHeader="false" :scrollTop="0" :container="true" stickyHeight="100rpx">
			<view class="wrap30 search" slot="header">
				<search @search="search" placeholder="搜索姓名" :focus="false"></search>
			</view>
			<template slot="content">
				<block v-if="list.data!=''">
					<view class="list dis-flex flex-y-center" v-for="(item,index) in list.data" :key="index" @tap.stop="lookOrder(item.user_id)">
						<view class="user_img">
							<image lazy-load :src="item.avatarUrl||defaultImg" mode="aspectFill"></image>
							<view :class="'user_sex iconfont2 f-20 '+[item.gender=='女'?'icon-girl':'icon-boy']"></view>
						</view>
						<view class="user_info">
							<view class="dis-flex flex-y-center flex-x-between">
								<view class="user_name onelist-hidden f-28 col-3">{{item.nickName}}</view>
								<view class="block-btn-wrap">
									<view :class="'block-btn ' +[item.is_black?'isblock':'']" @tap.stop="toBlock(index)">{{item.is_black?'取消拉黑':'拉黑'}}</view>
								</view>
							</view>
							<view class="user_spend m-top20 f-24 col-6">
								<!-- <text class="jifen">积分:{{item.points}}</text> -->
								<text class="spend">实际消费:{{item.pay_money}}</text><text>{{item.create_time}}</text>
							</view>
							<view class="user_address m-top20 f-24 col-6 onelist-hidden">{{item.address_detail}}</view>
						</view>
					</view>
					<!--加载loadding-->
					<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
					<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#F7F7F7" text="生意宝技术支持～"></tui-nomore>
				</block>
				
				<!-- 无数据 -->
				<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
					<view class="col-9">暂无数据</view>
				</tui-no-data>
				
			</template>
		</tui-sticky>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import search from '@/components/uni-search/index';
	export default {
		components: {
			search,
		},
		data() {
			return {
				defaultImg:'https://pic.kaidanxia.com/2020-09-01/202009011505247912a9701.png',
				page: 1,
				keyword:'',//关键字
				list: {},//列表
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			let that = this;
			that.getList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			this.list = [];
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
				app._get('shop.users/index',{keyword: that.keyword,page: that.page},res => {
					that.loadding = false;
					let _list = that.list,
							data = res.data.list.data;
					data.forEach(item => {
						let create_time = item.create_time.split(' ');
						item.create_time = create_time[0]
					});	
					if(_list.data){
						_list.data = _list.data.concat(data);
					}else{
						_list = res.data.list;
					}
					that.list = _list;
				});
			},
			// 是否拉黑
			toBlock(index){
				let that = this;
				let title='',content='';
				if(that.list.data[index].is_black){
					title = '确定将该用户取消拉黑？';
					content = '取消拉黑后将能进入我的店铺';
				}else{
					title = '确定将该用户拉黑？';
					content = '拉黑后将不能进入我的店铺';
				}
				uni.showModal({
					title: title,
					content: content,
					confirmColor: '#FF7541',
					success: (res) => {
						if (res.confirm) {
							let url = that.list.data[index].is_black ? 'shop.users/removeBlack' : 'shop.users/addBlack';
							app._post_form(url, {user_store_id: that.list.data[index].user_store_id}, res => {
								that.$api.msg(res.msg);
								if(res.code==1){
									that.list.data[index].is_black = !that.list.data[index].is_black;
								}
							});
						}
					}
				})
			},
			// 搜索
			search(e){
				let that = this;
				that.keyword = e;
				that.list = {};
				that.page = 1;
				that.getList();
				that.pullUpOn = true;
				that.loadding = false;
			},
			// 查看用户订单
			lookOrder(user_id){
				uni.navigateTo({
					url: 'userOrder/index?user_id='+user_id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
