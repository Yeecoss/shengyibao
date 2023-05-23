<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="配置功能" extClass="nav" id="top"></navigationBar>
		<view class="main wrap30" v-if="list.data!=''">
			<block v-for="(item,index) in list.data" :key="index">
				<view class="list" @tap.stop="toEdit(item.id)">
					<!-- 名称类型 -->
					<view class="list-top dis-flex flex-y-center flex-x-between f-28 col-6">
						<view class="title col-3">{{item.printer_name}}</view>
						<view>{{item.module.text}}</view>
						<view class="type">{{item.printer_times}}份</view>
					</view>
					<view class="bottom m-top30 dis-flex flex-y-center flex-x-between">
						<view class="radio-group f-28 col-6 dis-flex flex-y-center">
							<text class="term m-r-20" :class="item.is_active?'app-red':''">{{item.is_active?'开启中':'关闭中'}}</text>
							<cust-switch ref="switch" :checked="item.is_active?true:false" @change="changeActive($event,item)"></cust-switch>
						</view>
						<view class="operation dis-flex flex-y-center f-26 col-6">
							<view class="t-c" @tap.stop="toDelete(item.id)">删除</view>
						</view>
					</view>
				</view>
			</block>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>添加配置</view>
			</view>
		</view>
		<!-- 提示框 -->
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import custSwitch from '@/components/cust-switch/index.vue';
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			custSwitch,
			popupTips
		},
		data() {
			return {
				list: '',//信息
				page: 1,
				loadding: false,
				pullUpOn: true,
				printer_id: '',//打印机id
				mtitle:'',//提示标题
				mcontent:'',//提示内容
			}
		},
		onLoad(options) {
			this.printer_id = options.printer_id || '';
		},
		onShow() {
			this.page = 1;
			this.list = '';
			this.loadding= false;
			this.pullUpOn= true;
			this.getList()
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
			//列表
			getList (){
				let that = this;
				app._get('setting.printer/getModulesList',{page: that.page,printer_id: that.printer_id},res => {
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
			toDelete(id){
				this.mtitle = '提示';
				this.mcontent = '是否确认删除此配置功能？';
				this.$refs.popupTip.open(() => {
					app._post_form('setting.printer/delModule', {
						id: id
					}, res => {
						this.$api.msg(res.msg)
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList();
					});
				})
			},
			toAddbtn(){
				uni.navigateTo({
					url: './add?printer_id=' + this.printer_id
				})
			},
			toEdit(id){
				uni.navigateTo({
					url: './add?printer_id=' + this.printer_id + '&func_id='+id
				})
			},
			// 开关功能
			changeActive(e,item){
				let is_active = item.is_active;
				item.is_active = !is_active
				this.mtitle = '提示';
				this.mcontent = '是否确认打开/关闭？';
				this.$refs.popupTip.open(() => {
					app._post_form('setting.printer/changeActive', {
						id: item.id
					}, res => {
						this.$api.msg(res.msg)
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList();
					});
				},() => {
					item.is_active = is_active
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/index.scss';
	@import '../index';
</style>
