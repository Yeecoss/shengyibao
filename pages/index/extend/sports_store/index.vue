<template>
	<view class="bgf min_h_100" v-if="homeStyle=='sportshop'" :style="theme.themeStyle">
		<!-- 首页头部 -->
		<view class="header">
		  <header class="wrap30 index-header dis-flex flex-y-center flex-x-between">
		
		    <view class="index-header-c dis-flex flex-y-center">
		      <view class="on theme4_color" @tap="switchTab(0)">首页</view>
		      <view class="theme4_gray" @tap="switchTab(1)">优选</view>
		      <view class="theme4_gray" @tap="switchTab2" v-if="isCheckGoods">采购</view>
		    </view>
		
		    <view class="index-header-r dis-flex flex-y-center flex-x-end theme4_color">
		      <navigator
		        class="cate_btn f-28"
		        openType="navigate"
		        url="/pages/optimization/extend/attention/attention"
		        hover-class="none"
		      >
		        <text class="iconfont2 icon-Purchaseattention f-32 m-r-10"></text>
		        <text class="text">关注</text>
		      </navigator>
		      <navigator
		        class="search_btn f-28 m-l-30"
		        openType="navigate"
		        url="/pages/search/index"
		        hover-class="none"
		      >
		        <text class="iconfont2 icon-search f-32 m-r-10"></text>
						<text class="text">搜索</text>
		      </navigator>
		    </view>
		  </header>
		</view>
		<!-- 内容 -->
		<view class="main p-b-40">
			<view class="">
				<!-- banner轮播 -->
				<diy-banner itemIndex="0" :itemStyle="ban_style" :params="ban_params" :dataList="infoData.banners"></diy-banner>
				<!-- 导航组 -->
				<view class="navBar p-t-20">
					<navBar ref="navBar"></navBar>
				</view>
				<!-- 店铺公告 -->
				<view>
					<notice :wxapp="wxapp"></notice>
				</view>
				<!-- 优惠券 -->
				<!-- <coupon-templete1 v-if="couponList.length" styleClass="minishop" :list="couponList" @toCoupon="receive" @receive="receive"></coupon-templete1> -->
				<!-- 推荐专区 -->
				<template v-if="rHotTbs.length>0">
				<view class="recomHot m-t-20" v-if="rHotTbs[sortType].list.length>0">
					<view class="recomHot-top dis-flex flex-x-between wrap30 m-b-40">
						<view class="rHotTbs f-30 theme4_gray dis-flex flex-y-end">
							<view :class="sortType==index?'on m-r-30':'m-r-30'" v-for="(item, index) in rHotTbs" :key="index" @tap="sortTypeChange(index)">
								{{item.text}}
							</view>
						</view>
					</view>
					<scroll-view :show-scrollbar="false" class="mgoods_list">
						<view class="mgoods_list_wrap m-b-60"
							v-for="(item,index) in rHotTbs[sortType].list" :key="index"
							@tap="toOtherPage(`/pages/goods/index?goods_id=${item.wxapp_goods_id}`)"
						>
							<wxappGoods ref="wxappGoods" :imageList="item.goods.image" :good="item" @openDialog="openDialog" @upload="upload" @toShare="toShare">
							</wxappGoods>
						</view>
					</scroll-view>
				</view>
				</template>
			</view>
			<!-- 商品展示 -->
			<navigator v-if="infoData.all_goods&&infoData.all_goods.length>0"
				:url='`/pages/category/extend/list?sortType=` + rHotTbs[sortType].type'
				hover-class="none" class="more-img t-c f-24 col-3 p-t-10 p-b-10">
			 <!-- :url="`/pages/category/extend/list?sortType=${rHotTbs[sortType].type}`" -->
				<view class="theme4-more dis-flex flex-x-center flex-y-center">
					<text class="iconfont2 icon-MORE f-24"></text>
				</view>
			</navigator>
		</view>
		<view class="saler_nodata p-bottom" v-if="infoData.all_goods==''">
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<!-- 确认购买弹窗 -->
		<view class="proSpec">
			<proSpecs ref="proSpecs"></proSpecs>
		</view>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- 分享同步 -->
		<share-bottom ref="shareBottom" pageType="goods"></share-bottom>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import {mapState,mapMutations} from 'vuex';
	import diyBanner from "./banner/banner";
	import navBar from "./navBar/navBar";
	import notice from "./notice/notice";
	import wxappGoods from "./wxappGoods/index";
	import diySharpGoods from "./sharpGoods/index";
	// import couponTemplete1 from '@/pages/coupon/_templete/templete1/index';
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	import downloadFile from '@/components/download-file';
	import shareBottom from '@/components/share-bottom/index';
	export default {
		components: {
			diyBanner,
			navBar,
			notice,
			wxappGoods,
			// couponTemplete1,
			proSpecs,
			downloadFile,
			shareBottom,
		},
		props: {
			homeStyle: {
				type: String,
				default: ''
			},
			isCheckGoods: {
				type: Boolean,
				default: false
			},
		},
		data(){
			return{
				mtitle:'',
				mcontent:'',
				next: null,
				infoData: {},
				banner: [],
				ban_style: {btnColor: "#CB0133",btnShape: "round"},
				ban_params: {interval: "2800"},
				// couponList: [],//优惠券
				rHotTbs:[
					{type: 'recommend', text:'推荐',list: []},
					{type: 'hot', text:'热销',list: []},
					{type: 'all', text:'全部商品',list: []},
				],
				sortType: 0,
				sharpGoods:{
					params: {showNum: 6},
					style: {background: "#F27257",column: 3,show: {goodsName: 1,seckillPrice: "1",originalPrice: "1"}},
				},
				sharpGood: '',
				
				wxapp: {},
				// otherObj: {},//筛选条件
			}
		},
		computed:{
			//对全局变量theme进行监控
			...mapState(['theme'])
		},
		methods: {
			// 局部更新
			_show(next){
				this.page = 1;
				// this.otherObj = {}
				this.next = next || null;
				this.getInfo();
			},
			//获取数据
			getInfo(){
				app._get('page/sportshop',{}, res => {
					this.infoData = res.data || '';
					this.$refs.navBar._show(res.data.subscript);
					this.wxapp = res.data.wxapp;
					this.sharpGood = res.data.sharp_active||'';
					// if(res.data.coupon){
					// 	this.couponList[0] = res.data.coupon||'';
					// }
					// 热销推荐
					let rHotTbs = [];
					if(res.data.rmd_goods.length>0){
						let obj = {
							type: 'recommend', text:'推荐',list: res.data.rmd_goods
						};
						rHotTbs.push(obj);
					}
					if(res.data.hot_goods.length>0){
						let obj = {
							type: 'hot', text:'热销',list: res.data.hot_goods
						};
						rHotTbs.push(obj)
					}
					if(res.data.all_goods&&res.data.all_goods.length>0){
						let obj = {
							type: 'all', text:'全部商品',list: res.data.all_goods
						};
						rHotTbs.push(obj)
					}
					this.rHotTbs = rHotTbs;
					this.next(res.data);
				})
			},
			//立即购买
			openDialog(item){
				this.$refs.proSpecs._open(item)
			},
			// 点击下载
			upload(files){
				const that = this;
				let uploads = [];
				files.forEach(item => {
					uploads.push(item.file_path)
				});
				if(uploads!=''){
					uni.showModal({
						title: '友情提示',
						content: '是否下载该商品的图片/视频？',
						confirmColor: '#FF7541',
						confirmText: '是',
						cancelText: '否',
						success: (res) => {
							if(res.confirm){
								that.$refs.download._downloadFileS(uploads);
							}
						}
					});
				}else{
					that.$api.msg('该商品暂无可下载的图片/视频');
				}
			},
			//下载回调
			comfirmStatusS (promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res?"保存成功~":'取消保存')
				})
			},
			//点击分享
			toShare(item){
				let data = {
					opeText: 'upGoods,copyGoods,weChat',
					isTwo: true,
					upGoods: item,
					styleList: '-1,1,4,8'
				}
				this.$refs.shareBottom.open(data);
			},
			//筛选框确定
			// rightDrawerChange(obj) {
			// 	this.otherObj = obj;
			// 	this.page = 1;
			// 	// 获取商品列表
			// 	// this.getList();
			// },
			// 店铺资料
			// toShopInformation() {
			// 	let obj = {
			// 		wxapp_id: app.wxapp_id
			// 	}
			// 	app._get('wxapp/info', obj, (res) => {
			// 		let values = res.data.shop || {}
			// 		this.user = values
			// 		this.$refs.contact.open(this.user)
			// 	})
			// },
			// 切换tab
			switchTab(id) {
				this.$emit('switchTab',id)
			},
			// 去采购
			switchTab2() {
			  uni.navigateTo({
			    url:"/pages/retailShop/shopAbout/shopDetail/index?wxapp_id=" + app.wxapp_id,
			  });
			},
			// 立即领取
			// receive(couponId) {
			// 	uni.navigateTo({
			// 		url:'/pages/coupon/coupon'
			// 	})
			// },
			//推荐热销
			sortTypeChange(index){
				this.sortType = index;
			},
			toOtherPage(url){
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss';
</style>
