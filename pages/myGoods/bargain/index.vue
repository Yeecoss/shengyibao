<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="砍价活动" isHelpme extClass="nav" id="top"></navigationBar>
		<view class="tui-tabs-wrap">
			<tui-tabs :tabs="navbar" :currentTab="currentTab" @change="change" itemWidth="33.33%" color="#999" selectedColor="#FF7541" :height="88" :sliderWidth="80" :padding="0" :sliderHeight="4" sliderBgColor="#FF7541" :isFixed="true"></tui-tabs>
		</view>
		<!-- 列表内容 -->
		<view class="main" v-if="currentTab!=2">
			<goods-list :currentTab="currentTab" ref="barginList" @openSheet="selectItem"></goods-list>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5"></tui-nomore>
			<!-- 无数据 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 底部 -->
		<view class="footer" v-if="currentTab!=2">
			<view class="foot wrap30 bgf dis-flex flex-y-center flex-x-center">
				<view class="foot-btn f-32 col-f flex-box" @tap.stop="toAdd"><text class="iconfont2 icon-jiahao f-36"></text>添加活动</view>
			</view>
		</view>
		<!-- 砍价设置 -->
		<template v-if="currentTab==2">
			<barginSetting></barginSetting>
		</template>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import goodsList from './_templete/goods-list';
	import barginSetting from './_templete/barginSetting';
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default{
		components:{
			goodsList,
			barginSetting,
			popupTips,
			guidePage
		},
		data(){
			return{
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				currentTab: 0,
				navbar: [{
					name: "活动列表",
					status: 1
				}, {
					name: "砍价记录",
					status: 2
				}, {
					name: "砍价设置",
					status: 3
				}],
				showSheet: false,//是否显示操作菜单
				itemList: [{text: '编辑',color: '#333'},{text: '删除',color: '#333'}],
				list: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onShow() {
			if(this.currentTab!=2){
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.list = '';
				this.getList()
			}
		},
		//页面相关事件处理函数--监听用户下拉动作
		// onPullDownRefresh () {
		// 	this.page = 1;
		// 	this.getList();
		// 	this.pullUpOn = true;
		// 	this.loadding = false;
		// 	uni.stopPullDownRefresh();
		// 	this.$api.msg("刷新成功")
		// },
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
				that.getList()
			}
		},
		methods:{
			// 获取列表
			getList (){
				let that = this;
				let url = '', dataObj = {page: that.page};
				if(that.currentTab==0){
					url = 'shop.bargain/getAllActive';
				}
				if(that.currentTab==1){
					url = 'shop.bargain/getAllTask';
				}
				app._get(url, dataObj, res => {
					let _list = that.list;
					let data = res.data.list;
					if(that.page==1){
						_list = data;
					}else{
						let new_list = Object.assign({},_list,data);
						new_list.data = _list.data.concat(data.data);
						_list = new_list;
					}
					that.list = _list;
						that.$nextTick(() => {
							if(that.currentTab!=2){
									that.$refs.barginList._show({list:_list.data,currentTab:that.currentTab})
							}
						});
				});
			},
			// 切换
			change(e) {
				this.currentTab = e.index;
				if(e.index!=2){
					this.page = 1;
					this.loadding= false;
					this.pullUpOn= true;
					this.list = {};
					this.getList()
				}else{
					
				}
			},
			// 删除
			toDelete(item){
				let that = this;
				that.mtitle = '提示';
				that.mcontent = '是否确认删除？';
				that.$refs.popupTip.open(() => {
					let url = '', data = {};
					if(that.currentTab==0){
						url = 'shop.bargain/delActive';
						data.active_id = item.active_id;
					}
					if(that.currentTab==1){
						url = 'shop.bargain/delTask';
						data.task_id = item.task_id;
					}
					app._post_form(url, data, res => {
						that.$api.msg(res.msg)
						that.change({index: that.currentTab});
					});
				})
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				that.showSheet = false;
				if(that.currentTab==0){
					// 编辑
					if(e.index == 0){
						uni.navigateTo({
							url:'./add?type=1&active_id='+that.checkedItem.active_id
						})
					}
					// 删除
					if(e.index == 1){
						that.toDelete(that.checkedItem)
					}
				}else{
					// 删除
					if(e.index == 0){
						that.toDelete(that.checkedItem)
					}
				}
			},
			// 点击操作按钮-打开底部菜单
			selectItem(item){
				if(this.currentTab==1){
					this.itemList = [{text: '删除',color: '#333'}];
				}else{
					this.itemList = [{text: '编辑',color: '#333'},{text: '删除',color: '#333'}];
				}
				this.checkedItem = item;
				this.showSheet = true;
			},
			//关闭底部菜单
			cancel(){
				this.showSheet = false;
			},
			toAdd(){
				uni.navigateTo({
					url:'./add'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
