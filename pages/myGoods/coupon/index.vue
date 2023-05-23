<template>
	<view class="wrap30 bgf7 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="优惠券" extClass="nav" id="top"></navigationBar>
		<view class="main" v-if="list.data!=''">
			<view class="list" v-for="(item,index) in list.data" :key="index">
				<!-- 名称类型 -->
				<view class="dis-flex flex-y-center flex-x-between">
					<view class="title f-28 col-3">{{item.name}}</view>
					<view class="type f-24 col-6">{{item.coupon_type.text}}</view>
				</view>
				<view class="content">
					<!-- 折扣数量 -->
					<view class="dis-flex flex-y-center">
						<template v-if="item.coupon_type.value == 10">
						  <view class="money f-40">￥{{ item.reduce_price }}</view>
						</template>
						<view class="money" v-if="item.coupon_type.value == 20">{{ item.discount }}折</view>
						<view class="quan-num f-24 col-9">{{item.total_num && item.total_num!=-1? '限量'+ item.total_num +'张' :'不限量'}}</view>
						<view class="quan-num2 f-24 col-9">已领取{{item.receive_num?item.receive_num:0}}张</view>
					</view>
					<!-- 限期 -->
					<view class="bottom m-top20 f-24 col-9">
						<text class="term" v-if="item.expire_type == 10">领取 {{ item.expire_day }} 天内有效</text>
						<text class="term" v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
					</view>
				</view>
				<view class="operation dis-flex flex-y-center flex-x-end f-24 col-8 m-top20">
					<view @tap="toEdit(item.coupon_id)">编辑<text class="iconfont2 icon-edit1 f-24"></text></view>
					<view @tap="toDelete(index)">删除<text class="iconfont2 icon-shanchu f-24"></text></view>
				</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#F7F7F7"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449086e84e4417.png " :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无优惠券</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toAddCoupon"><text class="iconfont2 icon-jiahao f-36"></text>添加优惠券</view>
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
				list: [],
				page: 1,
				loadding: false,
				pullUpOn: true,
				index: 1,//提示框
			}
		},
		onLoad(options) {
			let that = this;
			that.getList();
			
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
			//优惠券列表
			getList(){
				let that = this;
				app._get('shop.coupon/index',{page: that.page},res => {
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
				let coupon_id = that.list.data[index].coupon_id;
				uni.showModal({
					title: '友情提示',
					content: '确认删除该优惠券？',
					confirmColor: '#FF7541',
					success: (res) => {
						if(res.confirm){
							app._post_form('shop.coupon/delete',{coupon_id: coupon_id}, res => {
								that.$api.msg(res.msg);
								if(res.code==1){
									that.list.data.splice(index,1);
								}
							});
						}
					}
				})
			},
			//更新页面
			couplChange(e){
				if(e){
					this.list = [];
					this.page = 1;
					this.loadding= false;
					this.pullUpOn= true;
					this.getList();
				}
			},
			// 点击编辑
			toEdit(id){
				uni.navigateTo({
					url: `./detail?coupon_id=${id}&type=2`
				})
			},
			// 新增
			toAddCoupon(){
				uni.navigateTo({
					url: './detail?type=1'
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "index"
</style>
