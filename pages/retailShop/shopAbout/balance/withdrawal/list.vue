<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="提现记录" extClass="nav" id="top"></navigationBar>
		<!-- list -->
		<view class="main" v-if="list.data!=''">
			<navigator :url="'detail?id='+item.id" hover-class="none" class="list-item col-3 dis-flex flex-y-center flex-x-between" v-for="(item,index) in list.data" :key="index">
				<view class="">
					<view class="f-30 col-6">{{item.create_time}}</view>
					<view class="f-26 m-t-4" :class="item.status&&item.status.value=='FAIL'?'app-red':''">
						{{item.status?item.status.text:''}}
					</view>
				</view>
				<view class="f-32">¥{{item.amount}}</view>
			</navigator>
			<!--加载loadding-->
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
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
		components:{
		},
		data (){
			return {
				defaultImg:'/static/images/defaultImg.png',
				list: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
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
				that.loadding = false;
				that.getList();
			}
		},
		methods: {
			// 获取列表
			getList (){
				let that = this;
				let data = {
					page: that.page,
				};
				app._get('shop.commerce.fund/withdrawList',data, res => {
					let _list = that.list;
					let data = res.data;
					
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
		},
	}
</script>

<style lang="scss">
	@import 'list';
</style>
