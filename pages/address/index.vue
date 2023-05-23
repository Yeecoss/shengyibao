<template>
	<view class="page">
	<!-- 自定义标题栏 -->
	<navigationBar title="地址薄" extClass="nav" id="top"></navigationBar>
	
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight+'px'}">
			<!-- 头部 -->
			<view class="search-bar dis-flex flex-x-between">
				<view class="search flex-box">
					<search @search="searchCity" placeholder="搜索姓名、电话、地址"></search>
				</view>
				<tui-button type="danger" width="144rpx" height="60rpx" :size="24" shape="circle" plain margin="0 0 0 26rpx" @tap="createAddress">
					<text class="iconfont2 icon-jiahao f-24"></text>
					<text class="m-l-10">添加</text>
				</tui-button>
			</view>
			<!-- 默认 -->
			<view class="tui-list city-list" v-if="defaults!='' &&inputVal==''">
				<view class="tui-list-cell-divider">默认寄件人</view>
				<view class="tui-list-cell pad_lr30" hover-class="tui-list-cell-hover">
					<view class="list-top f-28 m-b-20">
						{{defaults.name}} <text>{{defaults.phone}}</text>
					</view>
					<view class="tui-list-cell-navigate dis-flex flex-y-center flex-x-between">
						<radio-group @tap.stop="setDefault($event,defaults)" class="radio-group">
							<label class="radio dis-flex flex-y-center">
								<radio v-if="ifRadio" :checked="defaults.address_id == checkedItem.address_id" :value="defaults.address_id+''"></radio>
							</label>
						</radio-group>
						<view class="content f-24 col-6">
							{{defaults.region?defaults.region.province:''}} {{defaults.region?defaults.region.city:''}} {{defaults.region?defaults.region.region:''}} {{defaults.detail}}
						</view>
						<view class="operate-btn dis-flex flex-y-center flex-x-center" @tap.stop="selectAddr(defaults)">
							<text class="iconfont2 icon-more-mini col-6 f-24"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 常用 -->
			<view class="tui-list city-list" v-if="commonly!=''&&inputVal==''">
				<view class="tui-list-cell-divider">常用</view>
				<view class="tui-list-cell pad_lr30 border-b-20" hover-class="tui-list-cell-hover" v-for="(item,index) in commonly" :key="index" :class="[commonly.length-1==index?'last':'']">
					<view class="list-top f-28 m-b-20">
						{{item.name}} <text>{{item.phone}}</text>
					</view>
					<view class="tui-list-cell-navigate dis-flex flex-y-center flex-x-between" v-for="(vo,i) in item.data" :key="i">
						<radio-group @tap.stop="setDefault($event,vo)" class="radio-group">
							<label class="radio dis-flex flex-y-center">
								<radio v-if="ifRadio" :checked="vo.address_id == checkedItem.address_id" :value="vo.address_id+''"></radio>
							</label>
						</radio-group>
						<view class="content f-24 col-6">
							{{vo.region.province}} {{vo.region.city}} {{vo.region.region}} {{vo.detail}}
						</view>
						<view class="operate-btn dis-flex flex-y-center flex-x-center" @tap.stop="selectAddr(vo)">
							<text class="iconfont2 icon-more-mini col-6 f-24"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 搜索列表 -->
			<view v-if="searchList!=''&&inputVal!=''">
				<view class="tui-list city-list">
					<block v-for="(list,index) in searchList" :key="index" v-if="list.data[0]">
						<view class="tui-list-cell-divider" :id="list.letter">
							{{list.letter}}
						</view>
						<view class="tui-list-cell pad_lr30 border-b-20" hover-class="tui-list-cell-hover" v-for="(item,index2) in list.data" :key="index2">
							<view class="list-top f-28 m-b-20">
								{{item.name}} <text>{{item.phone}}</text>
							</view>
							<view class="tui-list-cell-navigate dis-flex flex-y-center flex-x-between" 
								:class="[list.data.length-1==index2?'last':'']" v-for="(vo,i) in item.data" :key="i">
								<radio-group @tap.stop="setDefault($event,vo)" class="radio-group">
								  <label class="radio dis-flex flex-y-center">
								    <radio v-if="ifRadio" :checked="vo.address_id == checkedItem.address_id" :value="vo.address_id+''"></radio>
								  </label>
								</radio-group>
								<view class="content f-24 col-6">
									{{vo.region.province}} {{vo.region.city}} {{vo.region.region}} {{vo.detail}}
								</view>
								<view class="operate-btn dis-flex flex-y-center flex-x-center" @tap.stop="selectAddr(vo)">
									<text class="iconfont2 icon-more-mini col-6 f-24"></text>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 列表 -->
			<view v-if="list!=''&&inputVal==''">
				<view class="tui-list city-list">
					<block v-for="(list,index) in list" :key="index" v-if="list.data[0]">
						<view class="tui-list-cell-divider" :id="list.letter">
							{{list.letter}}
						</view>
						<view class="tui-list-cell pad_lr30 border-b-20" hover-class="tui-list-cell-hover" v-for="(item,index2) in list.data" :key="index2">
							<view class="list-top f-28 m-b-20">
								{{item.name}} <text>{{item.phone}}</text>
							</view>
							<view class="tui-list-cell-navigate dis-flex flex-y-center flex-x-between" 
								:class="[list.data.length-1==index2?'last':'']" v-for="(vo,i) in item.data" :key="i">
								<radio-group @tap.stop="setDefault($event,vo)" class="radio-group">
								  <label class="radio dis-flex flex-y-center">
								    <radio v-if="ifRadio" :checked="vo.address_id == checkedItem.address_id" :value="vo.address_id+''"></radio>
								  </label>
								</radio-group>
								<view class="content f-24 col-6">
									{{vo.region.province}} {{vo.region.city}} {{vo.region.region}} {{vo.detail}}
								</view>
								<view class="operate-btn dis-flex flex-y-center flex-x-center" @tap.stop="selectAddr(vo)">
									<text class="iconfont2 icon-more-mini col-6 f-24"></text>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			
			<view v-if="list==''">
			  <view class="yoshop-notcont">
			    <text class="iconfont2 icon-bianzu1"></text>
			    <text class="cont">亲，您还没有收货地址哦～</text>
			  </view>
			</view>
			<!-- 底部 -->
			<view class="footer" v-if="checkedItem && ifRadio">
				<view class="foot wrap30">
					<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
				</view>
			</view>
		</scroll-view>
		<!-- 索引列表 -->
		<view class="tui-indexed-list-bar" :style="{height:indexBarHeight+'px'}" @touchstart="touchStart" @touchmove.stop="touchMove"
		 @touchend.stop="touchEnd" @touchcancel.stop="touchCancel" v-if="list!=''&&inputVal==''">
			<text v-for="(items,index)  in list" :key="index" class="tui-indexed-list-text" :style="{height:indexBarItemHeight+'px'}">
				{{items.letter=="well"?"#":items.letter}}
			</text>
		</view>
		<view class="tui-indexed-list-alert" v-if="touchmove && list[touchmoveIndex].letter">
			{{list[touchmoveIndex].letter=="well"?"#":list[touchmoveIndex].letter}}
		</view>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
	</view>
</template>

<script>
	let app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import search from '@/components/uni-search/index';
	export default {
		components: {
			search
		},
		data() {
			return {
				list: [],
				defaults: {},//默认
				commonly: [],//常用
				inputVal:'',//val
				searchList: [],//搜索结果
				checkedItem:'',//选择的item
				checkedItem0:'',//选择操作的item
				ifRadio: true,//是否显示选择按钮
				showSheet: false,//是否显示操作菜单
				itemList: [{text: '复制',color: '#333'},{text: '编辑',color: '#333'},{text: '删除',color: '#333'},],
				
				touchmove: false, // 是否在索引表上滑动
				touchmoveIndex: -1,
				titleHeight: 0, // A字距离窗口顶部的高度
				indexBarHeight: 0, // 索引表高度
				indexBarItemHeight: 0, // 索引表子项的高度
				scrollViewId: '', // scroll-view滚动到的子元素的id
				winHeight: 0,
			}
		},
		onLoad(options) {
			// 当前页面参数
			this.options = options;
			this.ifRadio = options.ifRadio=='false'? false : true;
			// 获取收货地址列表
			// this.getAddressList();
			// 设置商品列表高度
			// this.$nextTick(() => {
			// 	this.setListHeight(); 
			// })
			// setTimeout(() => {
			// 	this.setListHeight();
			// }, 50)
			
		},
		onShow() {
			// 获取收货地址列表
			this.getAddressList();
		},
		methods: {
			// 选择确认
			toSubmit(){
				this.pageBack(this.checkedItem,this.options.pindex)
			},
			//获取收货地址列表
			getAddressList  () {
				let that = this;

				app._get('address/lists', {}, function (res) {
					that.list = res.data.list;
					that.commonly = res.data.commonly;
					that.defaults = res.data.default;
					that.$nextTick(() => {
						that.setListHeight(); 
					})
				});
			},
			//选择地址
			setDefault(e,item) {
			  let _this = this;
			  this.checkedItem = this.checkedItem==item? '' : item;
			},
			// 添加新地址
			createAddress() {
				let url = '';
				if(this.options.pindex ||this.options.pindex==0){
					url ='./create?pindex='+this.options.pindex
				}else{
					url ='./create'
				}
			  uni.navigateTo({
			    url: url
			  });
			},
			//移除收货地址
			removeAddress(id) {
			  let _this = this,
			      address_id = id;
			
			  wx.showModal({
			    title: "提示",
			    content: "您确定要移除当前收货地址吗?",
			    success: function (o) {
			      o.confirm && getApp().globalData._post_form('address/delete', {
			        address_id
			      }, function (result) {
			        _this.getAddressList();
			      });
			    }
			  });
			},
			//编辑地址
			editAddress: function (id) {
				let url = '';
				if(this.options.pindex ||this.options.pindex==0){
					url = "./detail?address_id=" + id+'&pindex='+this.options.pindex
				}else{
					url = "./detail?address_id=" + id
				}
			  uni.navigateTo({
			    url: url
			  });
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				if(e.index == 0){
					that.showSheet = false;
					let data = that.checkedItem0.name + that.checkedItem0.phone + that.checkedItem0.region.province + that.checkedItem0.region.city + that.checkedItem0.region.region + that.checkedItem0.detail;
					that.clipboard(data);
				}
				// 编辑地址
				if(e.index == 1){
					that.showSheet = false;
					that.editAddress(that.checkedItem0.address_id)
				}
				// 删除种草文章
				if(e.index == 2){
					that.showSheet = false;
					that.removeAddress(that.checkedItem0.address_id)
				}
			},
			// 点击操作按钮-打开底部菜单
			selectAddr(item){
				this.checkedItem0 = item;
				this.showSheet = true;
			},
			//关闭底部菜单
			cancel(){
				let that = this;
				that.showSheet = false;
			},
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
			//返回上一页
			pageBack(v,i){
				// 返回上一页传递选中的分类
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.iplChange){
					prevPage.$vm.iplChange(v,i)
				}
				uni.navigateBack();
			},
			// 搜索城市
			searchCity(inputVal) {
				if (inputVal=='') {
					// this.$api.msg("请输入搜索关键词")
					this.getAddressList()
					return
				}
				this.inputVal = inputVal;
				let result = [];
				
				this.list.forEach((item1, index1) => {
					item1.data.forEach((item2, index2) => {
						if (item2.name.indexOf(inputVal) !== -1 || item2.phone==inputVal) {
							let obj = {};
							obj.letter = item1.letter;
							let data = [];
							data.push(item2);
							obj.data = data;
							result.push(obj)
						}else{
							let obj = {};
							obj.letter = item1.letter;
							let data = [];
							let obj2 = {};
							obj2.name = item2.name;
							obj2.phone = item2.phone;
							obj2.data = item2.data.filter((item3, index3) =>{
								let addr = item3.region.province+' '+item3.region.city+' '+item3.region.region+' '+item3.detail;
								if (addr.indexOf(inputVal) != -1) {
									return item3;
								}
							});
							if(obj2.data!=''){
								data.push(obj2)
							}
							if(data!=''){
								obj.data = data;
								result.push(obj)
							}
						}
					})
				});
				this.$nextTick(() => {
					this.searchList = result;
				})
				
			},
			// 选择城市
			selectCity(e) {
				//返回并刷新上一页面
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
							that.winHeight = winHeight - res[0].height;// - 60底部
							that.indexBarHeight = barHeight;
							that.indexBarItemHeight = barHeight / 25;
							// that.indexBarItemHeight = 25 * that.list.length;
							that.titleHeight = uni.upx2px(128) + res[0].height;
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
