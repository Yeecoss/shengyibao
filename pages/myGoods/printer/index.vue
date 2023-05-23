<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="打印机" isHelpme extClass="nav" id="top"></navigationBar>
		<!-- tab -->
		<view class="tab-wrap">
			<tui-tabs :tabs="tabs" :currentTab="tabOn" @change="changeTab" itemWidth="50%" color="#333" selectedColor="#FF7541" :height="88" :sliderWidth="80" :size="30" :padding="0" :sliderHeight="4" sliderBgColor="#FF7541" :isFixed="true"></tui-tabs>
		</view>
		<!-- 快递单 -->
		<view class="main-wrap" v-show="tabOn==0">
			<view class="main wrap30" v-if="list1.data!=''">
				<block v-for="(item,index) in list1.data" :key="index">
					<view class="list1 dis-flex flex-y-center flex-x-between">
						<view class="radio-group f-28 col-6 dis-flex flex-y-center">
							<text class="term m-r-10 width330 onelist-hidden">{{item.printer_name}}</text>
							<text class="iconfont2 icon-wifi f-24 col-CE m-l-10" :class="item.online_status==1?'green':''"></text>
							<text class="f-24 col-CE m-l-10" :class="item.online_status==1?'green':''">{{item.online_status==1?'在线':'离线'}}</text>
							<view class="default_tag f-24 m-l-30" v-if="item.is_default">默认</view>
						</view>
						<view class="dis-flex flex-y-center flex-x-center operate-btn-wrap" @tap.stop="selectItem(item)">
							<view class="operate-btn dis-flex flex-y-center flex-x-center">
								<text class="iconfont2 icon-more-mini col-6 f-24"></text>
							</view>
						</view>
					</view>
				</block>
				<!--加载loadding-->
				<tui-loadmore v-if="loadding1" :index="3" type="primary"></tui-loadmore>
				<tui-nomore v-if="(!pullUpOn1 && list1.data!='') || page1==list1.last_page" backgroundColor="#f5f5f5"></tui-nomore>
			</view>
			<!-- 无数据 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list1.data==''">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 小票 -->
		<view class="main-wrap" v-show="tabOn==1">
			<!-- 打印机链接 -->
			<navigator class="sell-link m-top30 p-l-30 p-r-30" hover-class="none" url="./sell-printer/index">
				<image src="https://pic.kaidanxia.com/2020-11-02/17374930f002291.png" mode="widthFix"></image>
			</navigator>
			
			<view class="main wrap30" v-if="list.data!=''">
				<block v-for="(item,index) in list.data" :key="index">
					<view class="list" @tap.stop="toEdit(item.printer_id)">
						<!-- 名称类型 -->
						<view class="list-top dis-flex flex-y-center flex-x-between f-28 col-6">
							<view class="title col-3">{{item.printer_name}}</view>
							<view class="type">{{item.features.text}}</view>
						</view>
						<view class="bottom m-top30 dis-flex flex-y-center flex-x-between">
							<view class="radio-group f-28 col-6 dis-flex flex-y-center">
								<text class="term m-r-20">{{item.printer_type.text}}</text>
							</view>
							<view class="operation dis-flex flex-y-center f-26 col-6">
								<view class="t-c" @tap.stop="toDelete(item.printer_id)">删除</view>
								<view class="t-c oper-red" @tap.stop="toConfig(item.printer_id)">配置功能</view>
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
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30 bgf dis-flex flex-y-center">
				<view class="foot-btn f-32 col-f flex-box" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>添加打印机</view>
			</view>
		</view>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
		<!-- 提示框 -->
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
		<tui-tips position="center" ref="toast"></tui-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			guidePage
		},
		data() {
			return {
				list: '',//信息
				page: 1,
				loadding: false,
				pullUpOn: true,
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				tabs:[{name: '快递单'},{name: '小票'}],
				tabOn:0,
				
				list1: '',//信息
				page1: 1,
				loadding1: false,
				pullUpOn1: true,
				showSheet: false,//是否显示操作菜单
				itemList: [{text: '配置网络',color: '#333'},{text: '测试打印',color: '#333'},{text: '删除',color: '#333'},{text: '设为默认',color: '#333'},],
			}
		},
		onLoad(options) {
		},
		onShow() {
			if(this.tabOn==1){
				this.page = 1;
				this.list = '';
				this.loadding= false;
				this.pullUpOn= true;
				this.getList()
			}else{
				this.page1 = 1;
				this.list1 = '';
				this.loadding1= false;
				this.pullUpOn1= true;
				this.getList1()
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
			if(that.tabOn==1){
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
			}else{
				if (!that.pullUpOn1) return;
					that.loadding1 = true;
				if (that.page1 >= that.list1.last_page) {
					that.loadding1 = false;
					that.pullUpOn1 = false;
				} else {
					that.page1 = ++that.page1;
					that.loadding1 = true;
					that.getList1();
				}
			}
		},
		methods: {
			//列表
			getList (){
				let that = this;
				app._get('setting.printer/getPrintersList',{page: that.page},res => {
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
			// 蓝牙打印机列表
			getList1 (){
				let that = this;
				app._get('setting.printer/getPrintersList',{page: that.page1,printer_type:'YUAN_P_YUN'},res => {
					that.loadding1 = false;
					let _list = that.list1;
					let data = res.data.list;
					if(that.page1==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list1 = _list;
				});
			},
			toDelete(id){
				this.mtitle = '提示';
				this.mcontent = '是否确认删除此打印机？';
				this.$refs.popupTip.open(() => {
					app._post_form('setting.printer/delPrinter', {
						printer_id: id
					}, res => {
						this.$api.msg(res.msg)
						if(this.tabOn==1){
							this.page = 1;
							this.getList();
						}else{
							this.page1 = 1;
							this.getList1();
						}
					});
				})
			},
			// tab切换
			changeTab(e){
				this.tabOn = e.index;
				if(this.tabOn==1){
					this.page = 1;
					this.list = '';
					this.loadding= false;
					this.pullUpOn= true;
					this.getList()
				}else{
					this.page1 = 1;
					this.list1 = '';
					this.loadding1= false;
					this.pullUpOn1= true;
					this.getList1()
				}
			},
			// 测试打印
			testPrint(){
				app._get('setting.printer/testPrint', {
					printer_id: this.checkedItem.printer_id
				}, res => {
					this.$api.msg(res.msg)
				});
			},
			// 设为默认
			toDefault(printer_id){
				app._get('setting.printer/setDefault', {
					printer_id: printer_id
				}, res => {
					this.$api.msg(res.msg)
					if(res.code==1){
						this.page1 = 1;
						this.list1 = '';
						this.loadding1= false;
						this.pullUpOn1= true;
						this.getList1()
					}
				});
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				that.showSheet = false;
				// 配置网络
				if(e.index == 0){
					/* #ifdef MP */
					uni.navigateTo({
						url: '/pages/myGoods/printer/configBluetooth/index?printer_name=' + that.checkedItem.printer_name
					})
					/* #endif */
					/* #ifdef APP-PLUS  */
					this.$api.msg('app端暂不支持蓝牙，请至微信小程序端进行操作。', 3000)
					/* #endif */
				}
				// 测试打印
				if(e.index == 1){
					if(that.checkedItem.online_status==1){
						that.testPrint()
					}else{
						that.$api.msg('打印机无网络，请正确配置网络！')
					}
				}
				// 删除
				if(e.index == 2){
					that.toDelete(that.checkedItem.printer_id)
				}
				// 设为默认
				if(e.index == 3){
					that.toDefault(that.checkedItem.printer_id)
				}
			},
			// 点击操作按钮-打开底部菜单
			selectItem(item){
				if(item.is_default){
					this.itemList = [{text: '配置网络',color: '#333'},{text: '测试打印',color: '#333'},{text: '删除',color: '#333'},];
				}else{
					this.itemList = [{text: '配置网络',color: '#333'},{text: '测试打印',color: '#333'},{text: '删除',color: '#333'},{text: '设为默认',color: '#333'},];
				}
				this.checkedItem = item;
				this.showSheet = true;
			},
			//关闭底部菜单
			cancel(){
				this.showSheet = false;
			},
			toConfig(id){
				uni.navigateTo({
					url: 'config/index?printer_id='+id
				})
			},
			toAddbtn(){
				let url = ''
				if (this.tabOn==1) {
					url = './add'
					uni.navigateTo({
						url: url
					})
				} else {
					/* #ifdef MP */
					url = '/pages/myGoods/printer/configBluetooth/add';
					uni.navigateTo({
						url: url
					})
					/* #endif */
					/* #ifdef APP-PLUS  */
					// this.$api.msg('app端暂不支持蓝牙，请至微信小程序端进行操作。')
					url = '/pages/myGoods/printer/configBluetooth/add';
					uni.navigateTo({
						url: url
					})
					/* #endif */
				}
			},
			toEdit(id){
				uni.navigateTo({
					url: './add?printer_id='+id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/index.scss';
	@import 'index';
</style>
