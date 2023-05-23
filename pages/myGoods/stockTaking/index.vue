<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="库存盘点" extClass="nav" id="top"></navigationBar>
		<view class="tui-tabs-wrap">
			<tui-tabs :tabs="navbar" :currentTab="currentTab>1?0:currentTab" @change="change" itemWidth="50%" color="#999" selectedColor="#FF7541" :height="80" :sliderWidth="80" :sliderHeight="4" sliderBgColor="#FF7541" :isFixed="true"></tui-tabs>
		</view>
		<view class="main" v-if="list.data!=''">
			<view class="list-wrap p-b-40">
				<view class="list-item wrap30 f-28 col-3 m-t-20 bgf" v-for="(item, index) in list.data" :key="index" @tap.stop="toDetail(item.check_id)">
					<view class="list-top p-t-20 p-b-20">
						<view class="list-top-i fl">{{item.create_time}}</view>
						<view class="list-top-i fl">{{item.store_warehouse? item.store_warehouse.name: '默认仓库'}}</view>
						<view class="list-top-i fl">{{item.store_user? item.store_user.real_name: ''}}</view>
					</view>
					<view class="list-i-main">
						<view class="fl col-3 f-32 m-r-60">盘点序号:{{item.check_no}}</view>
						<view class="fl col-3 f-32 m-r-30">{{item.total_finish_goods_num}}(件)</view>
						<template v-if="currentTab==1">
							<view class="refund_end dis-flex flex-y-center flex-x-center">
								<view class="dis-flex flex-y-center flex-x-center">已盘点</view>
							</view>
						</template>
						<template v-else>
							<view class="fr app-red p-r-10 p-l-10" @tap.stop="toEdit(item.check_id)"> <text class="iconfont2 icon-edit f-32"></text></view>
						</template>
					</view>
				</view>
			</view>
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
			<view class="foot wrap30 dis-flex flex-y-center flex-x-center">
				<view class="foot-btn f-32 col-f m-r-60" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>添加盘点单</view>
				<view class="foot-btn f-32 col-f bgY" @tap.stop="loadFile"><text class="iconfont2 icon-jiahao f-36"></text>下载库存表</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
			
		},
		data(){
			return{
				currentTab: 0,
				navbar: [{
					name: "草稿",
					status: 1
				}, {
					name: "已盘点",
					status: 2
				}],
				list: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
		},
		onShow() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.list = '';
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
		methods:{
			// 获取列表
			getList (){
				let that = this;
				let status = that.navbar[that.currentTab].status;
				app._get('shop.goods.stock_check/list',{page: that.page, status: status},res => {
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
			change(e) {
				this.currentTab = e.index;
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.list = ''
				this.getList()
			},
			//添加
			toAddbtn(){
				uni.navigateTo({
					url: './add/add'
				})
			},
			//编辑
			toEdit(id){
				uni.navigateTo({
					url: './add/add?id='+id
				})
			},
			toDetail(id){
				if(this.currentTab==1){
					uni.navigateTo({
						url: 'add/detail?id=' + id
					})
				}
			},
			loadFile() {
        		uni.showLoading({title: '下载中...'});
				app._get('shop.goods.stock_check/downloadFile',{},res => {
					if (res.code == 1) {
						uni.downloadFile({
							url: res.data.file_path,
							success: (res) => {
								var filePath = res.tempFilePath;
								const FileSystemManager = wx.getFileSystemManager();
								let suffixIndex = filePath.lastIndexOf('.');
								let suffix = filePath.slice(suffixIndex,);
								FileSystemManager.saveFile({
									tempFilePath:filePath,
									filePath:`${wx.env.USER_DATA_PATH}/${new Date().getTime()}${suffix}`,
									success:(res)=>{
										let savedFilePath = res.savedFilePath;
										uni.hideLoading();
										wx.showModal({
											title: '是否要打开文件？',
											content: '',
											success: (res)=> {
												if (res.confirm) {
													wx.openDocument({//打开
														showMenu:true,
														fileType:'xls',
														filePath: savedFilePath,
														success: res=> {
															// console.log(res);
															// console.log('打开文档成功');
														},
														fail: function (res) {
															// console.log(res);
														}
													})
												}
											}
										})
									},
									fail:(res)=>{
										// console.log(res)
										uni.hideLoading();
									}
								})
							},
							fail: (res) => {
								this.$api.msg('下载失败')
        						uni.hideLoading();
							}
						});
					} else {
						this.$api.msg(res.msg)
					}
				});
			}
		},
	}
</script>

<style lang="scss">
	@import 'index';
</style>
