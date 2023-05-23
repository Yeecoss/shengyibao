<template>
	<view class="wrap30 bgf7 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="物流公司" extClass="nav" id="top"></navigationBar>
		
		<view class="main" v-if="list.data!=''">
			<view class="list" v-for="(item,index) in list.data" :key="index" @tap.stop="pageBack(item)">
				<!-- 名称类型 -->
				<view class="list-top dis-flex flex-y-center flex-x-between">
					<view class="title f-28 col-3">{{item.express_name}}</view>
					<view class="type f-24 col-6">{{item.express_code}}</view>
				</view>
				<view class="bottom m-top30 dis-flex flex-y-center flex-x-between">
					<radio-group @tap.stop="setDefault(item.id)" class="radio-group">
						<label class="radio f-24 col-6 dis-flex flex-y-center">
						<radio :checked="item.is_default==1" color="#ff495e" :value="item.express_id+''"></radio>
						<text class="cont" v-if="item.is_default">默认</text>
						<text class="cont" v-else>选择</text>
						</label>
					</radio-group>
					<view class="operation dis-flex flex-y-center f-24 col-8">
						<!-- <view @tap.stop="toEdit(item.express_id)">编辑<text class="iconfont2 icon-edit1 f-24"></text></view> -->
						<view @tap.stop="toDelete(index)">删除<text class="iconfont2 icon-shanchu f-24"></text></view>
					</view>
				</view>
			</view>
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
				<view class="foot-btn f-32 col-f" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>添加物流公司</view>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				index: 1,//提示框
				list: '',
				page: 1,
				loadding: false,
				pullUpOn: true,
				express_type: ''
			}
		},
		onLoad(options) {
			if (options.express_type && options.express_type == 1) {
				this.express_type = '2'
			}
		},
		onShow(options) {
			this.list = [];
			this.page = 1;
			this.getList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			let that = this;
			//延时为了看效果
			setTimeout(() => {
				that.list = [];
				that.page = 1;
				that.getList();
				that.pullUpOn = true;
				that.loadding = false;
				uni.stopPullDownRefresh();
				that.$api.msg('刷新成功!');
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
			// 物流公司列表
			getList(){
				let that = this;
				let url = 'shop.express/index'
				app._get(url,{page: that.page},res => {
					that.loadding = false
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
			toDelete(index){
				let that = this;
				uni.showModal({
					title: '友情提示',
					content: '确认删除该模板？',
					confirmColor: '#FF7541',
					success: (res) => {
						if(res.confirm){
							app._post_form('shop.express/delete',{express_id: that.list.data[index].express_id},res => {
									that.$api.msg(res.msg);
								if(res.code==1){
									that.list.data.splice(index,1)
								}
							})
						}
					}
				})
			},
			//设置为默认地址
			setDefault: function (e) {
				let that = this,
						id = parseInt(e);
				app._post_form('shop.express/default',{express_id: id}, res => {
						that.$api.msg(res.msg);
					if(res.code==1){
						that.list = [];
						that.page = 1;
						that.pullUpOn = true;
						that.loadding = false;
						that.getList();
					}
				});
			},
			//更新页面
			pageChange(e){
				this.list = [];
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList();
			},
			// 点击编辑
			toEdit(express_id){
				uni.navigateTo({
					url: `./detail?express_id=${express_id}&type=2`
				})
			},
			// 新增
			toAddbtn(){
				uni.navigateTo({
					url: `./detail?type=1`
				});
			},
			//选择返回
			
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.expressChange){
					prevPage.$vm.expressChange(data)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/index.scss';
	.list-top{
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
</style>
