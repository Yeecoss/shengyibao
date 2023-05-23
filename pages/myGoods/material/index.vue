<template>
	<view class="page">
		<!-- 自定义标题栏 -->
		<navigationBar title="素材中心" extClass="nav" id="top"></navigationBar>
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight+'px'}">
			<view class="search wrap30">
				<search :value="searchValue" @search="searchList" placeholder="搜索"></search>
			</view>
			<!-- 头部 -->
			<view class="upgrade dis-flex flex-y-center flex-x-between" v-if="wxapp.collection_id!=4">
				<view class="upgrade-now">
					<view class="f-24">图片容量：{{totalPicSpace.name||''}}/{{limitPicSpace.name||''}}</view>
					<view class="progress m-t-20"><view :style="'width: '+progress+'%;'"></view></view>
				</view>
				<view class="to-upgrade f-28 app-red" @tap="toVip">升级空间<text class="iconfont2 icon-gengduobeifen2 f-24 m-l-10"></text></view>
			</view>
			<!-- 列表 -->
			<view v-if="list!=''">
				<view class="tui-list city-list">
					<block v-for="(list,index) in list" :key="index">
						<view class="tui-list-cell pad_lr30" hover-class="tui-list-cell-hover" @tap.stop="toList(list.group_id)">
							<view class="tui-list-cell-navigate dis-flex flex-y-center flex-x-between">
								<view class="list_pic m-r-20">
									<image :src="list.first_img||'https://pic.kaidanxia.com/2020-09-01/202009011505247912a9701.png'" mode="aspectFill"></image>
								</view>
								<view class="content f-30 col-3">{{list.group_name}}({{list.img_count}})</view>
								<view class="operate-btn dis-flex flex-y-center flex-x-center" v-if="list.group_id>0 &&source=='shop'" @tap.stop="selectItem(list)">
									<text class="iconfont2 icon-more-mini col-6 f-24"></text>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 无数据 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list==''">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
			<!-- 底部 -->
			<view class="footer" v-if="source=='shop'">
				<view class="foot">
					<view class="foot-btn f-28 col-3" @tap.stop="toAdd"><text class="iconfont2 icon-jiahao f-28 f-w"></text>创建分组</view>
				</view>
			</view>
		</scroll-view>
		<!-- 索引列表 -->
		<!-- <view class="tui-indexed-list-bar" :style="{height:indexBarHeight+'px'}" @touchstart="touchStart" @touchmove.stop="touchMove"
		 @touchend.stop="touchEnd" @touchcancel.stop="touchCancel" v-if="list!=''">
			<text v-for="(items,index)  in list" :key="index" class="tui-indexed-list-text" :style="{height:indexBarItemHeight+'px'}">
				{{items.letter==undefined?"#":items.letter}}
			</text>
		</view>
		<view class="tui-indexed-list-alert" v-if="touchmove && list[touchmoveIndex].letter">
			{{list[touchmoveIndex].letter==undefined?"#":list[touchmoveIndex].letter}}
		</view> -->
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
		<popup-input :title="ptitle" :placeholder="placeholder" :maxlength="20" :showlength="true" ref="popupInput"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<!--下抽屉-->
		<popup :show="isShow" type="bottom" @clickmask="toDrawer">
			<view class="popup-main" v-if="isShow" catchtouchmove='true'>
				<view class="pop-close" @tap="toDrawer"><text class="iconfont2 icon-shanchu1 f-38 col-9"></text></view>
		    <!-- 主体信息 -->
		    <view class="trade-main pad_lr30">
					<view class="drawer-title f-30 col-3 m-b-20 t-c">删除分组</view>
					<picker class="control" @change="pickerChange" :value="defIndex" :range="upgradeList">
						<view class="drawer-content dis-flex flex-y-center flex-x-between">
							<view class="f-28 col-6">移动到</view>
							<view class="f-28 col-3">{{groupList[defIndex].group_name}}<text class="iconfont2 icon-gengduobeifen2 f-26 m-l-10"></text></view>
						</view>
					</picker>
					<view class="drawer-tip f-24 col-9 m-t-20"><text class="iconfont2 icon-jingshi f-24 m-r-10"></text>注：删除后该分组下的所有图片将移动到其他分组</view>
					<view class="drawer-foot-btn f-32 col-f" @tap.stop="toDelete">确定</view>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	import popup from "@/components/pop-manager/index";
	import search from '@/components/uni-search/index';
	export default {
		components: {
			popupInput,
			popup,
			search
		},
		data (){
			return {
				touchmove: false, // 是否在索引表上滑动
				touchmoveIndex: -1,
				titleHeight: 0, // A字距离窗口顶部的高度
				indexBarHeight: 0, // 索引表高度
				indexBarItemHeight: 0, // 索引表子项的高度
				scrollViewId: '', // scroll-view滚动到的子元素的id
				winHeight: 0,
				
				defIndex: -1,
				upgradeList: [],
				groupList: [],
				checkedItem: {},
				list: [],
				searchValue: '',
				progress: 0,//进度
				limitPicSpace: {},
				totalPicSpace: {},
				showSheet: false,//是否显示操作菜单
				bottomDrawer: false,
				itemList: [{text: '重命名',color: '#333'},{text: '删除',color: '#333'},{text: '置顶',color: '#333'},],
				ptitle: '',
				placeholder: '',
				isShow: false,
				
				source: '',//来源
				limit: '',
				videoLimit: '',
				
				wxapp: {},//商家信息
			}
		},
		onLoad(options) {
			this.source = options.source || '';
			this.limit = options.limit!==''? options.limit : '';
			this.videoLimit = options.videoLimit!==''? options.videoLimit : '';
			//带入的图片
			let imageList = uni.getStorageSync('materialImages') ||[];
			this.imageList = imageList;
			uni.removeStorageSync('materialImages');
		},
		onShow() {
			// 获取分组列表
			this.getList();
		},
		methods: {
			//获取分组列表
			getList  () {
				let that = this;
			
				app._get('shop.image.category/index', {name: this.searchValue},res =>{
					that.wxapp = res.data.vipInfo;
					let list = res.data.category;
					that.list = list;
					
					that.$nextTick(() => {
						that.setListHeight(); 
					})
					that.limitPicSpace = res.data.limitPicSpace;
					that.totalPicSpace = res.data.totalPicSpace;
					if(res.data.vipInfo.collection_id!=4){
						let number = Number(res.data.totalPicSpace.value);
						let all_number = Number(res.data.limitPicSpace.value);
						that.progress = (number/all_number*100).toFixed(2);
					}
				});
			},
			//搜索
			searchList(e){
				this.searchValue = e;
				this.getList()
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				// 重命名
				if(e.index == 0){
					that.showSheet = false;
					that.ptitle = '重命名分组';
					that.placeholder = '请输入分组名称';
					that.$refs.popupInput._open(that.checkedItem.group_name, (val) => {
						app._post_form('shop.image.category/edit', {
							group_name: val,
							group_id: that.checkedItem.group_id
						},res => {
							that.$api.msg(res.msg);
							if(res.code==1){
								that.getList()
							}
						})
					});
				}
				// 删除
				if(e.index == 1){
					that.showSheet = false;
					that.toDrawer()
				}
				// 置顶
				if(e.index == 2){
					that.showSheet = false;
					that.topping()
				}
			},
			//删除
			toDelete(){
				app._post_form('shop.image.category/delete', {
					group_id: this.checkedItem.group_id,
					move_group_id: this.groupList[this.defIndex].group_id,
				},res => {
					this.$api.msg(res.msg);
					if(res.code==1){
						this.getList()
						this.checkedItem = {}
						this.toDrawer()
					}
				})
			},
			//置顶
			topping(item){
				app._post_form('shop.image.category/setTop', {group_id: this.checkedItem.group_id,}, res => {
					this.$api.msg(res.msg);
					if(res.code==1){
						this.getList()
					}
				});
			},
			// 点击操作按钮-打开底部菜单
			selectItem(item){
				this.checkedItem = item;
				this.showSheet = true;
				
				if(this.list!=''){
					let upgradeList = [];
					let groupList = [];
					let categoryList = [];
					this.list.forEach(item => {
						categoryList.push(item)
					});
					categoryList.forEach((vo,i) => {
						if(vo.group_id==0){
							this.defIndex = i
						}
						if(this.checkedItem.group_id != vo.group_id){
							upgradeList.push(vo.group_name)
							groupList.push(vo)
						}
					})
					this.upgradeList = upgradeList;
					this.groupList = groupList;
				}
			},
			//关闭底部菜单
			cancel(){
				let that = this;
				that.showSheet = false;
			},
			// 创建分组
			toAdd(){
				this.ptitle = '添加分组';
				this.placeholder = '请输入分组名称';
				this.$refs.popupInput._open('', (val) => {
					app._post_form('shop.image.category/add', {
						group_name: val
					},res => {
						this.$api.msg(res.msg);
						if(res.code==1){
							this.getList()
						}
					})
				});
			},
			// 设置容器高度等
			setListHeight() {
				const that = this;
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					// let systemInfo = wx.getSystemInfoSync(),
					//     rpx = systemInfo.windowWidth / 750,
					//     // 计算rpx
					// tapHeight = Math.floor(rpx * 80),
							// tap高度
					// scrollHeight = systemInfo.windowHeight - tapHeight - res[0].height - 10; // swiper高度
					uni.getSystemInfo({
						success: function(systemInfo) {
							let winHeight = systemInfo.windowHeight;
							let barHeight = winHeight - uni.upx2px(204) - res[0].height;
							that.winHeight = winHeight - res[0].height;// - 50底部
							that.indexBarHeight = barHeight;
							that.indexBarItemHeight = barHeight / 25;
							// that.indexBarItemHeight = 25 * that.list.length;
							that.titleHeight = uni.upx2px(128) + res[0].height;
						}
					});
				});
			},
			//关闭下抽屉
			toDrawer(e) {
				this.isShow = !this.isShow
			},
			// 选择类型赋值
			pickerChange(e) {
			  this.defIndex = e.detail.value;
			},
			//去升级
			toVip(){
        		app.toMember()
			},
			toList(group_id){
				let url = '/pages/myGoods/material/list/index?group_id=' + group_id;
				url += '&source=' + this.source+'&videoLimit=' + this.videoLimit+ '&limit=' + this.limit;
				if(this.imageList){
					uni.setStorageSync('materialImages', this.imageList);//带入素材中心
				}
				uni.navigateTo({
					url: url
				})
			},
			touchStart(e) {
				this.touchmove = true
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight);
				let item = this.list[index];
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
				let item = this.list[index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
