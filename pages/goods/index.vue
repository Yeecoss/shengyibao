<template>
	<view>
		<detail ref="detail" :goodsLikeList="list.data"></detail>
    <!-- 赚钱功能-赚一赚 -->
    <view class="applyImg" v-if="is_shared==1" @tap="toApply">
      <image src="https://pic.kaidanxia.com/2020-12-22/170617bce027884.gif" mode="aspectFit"></image>
    </view>
		<!-- 快捷导航 -->
		<shortcut @showLogin="showLogin" :noLogin="noLogin" :marginBottom="50" :marginTop="48" :wxapp_id="upGood.wxapp_id"></shortcut>
		<view v-show="isLoading">
			<loading></loading>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<popup-tips ref="popupTips" :content="content" :confirmText="confirmText" :showConcle="false"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData; // 富文本插件
	import detail from "./detail/detail";
	import popupTips from '@/components/popup-tips/index';
	import shortcut from "@/components/shortcut/shortcut";
	import loading from '@/components/loading';

	export default {
		components: {
			detail,
			shortcut,
			loading,
			popupTips
		},
		data() {
			return {
				content: '',
				confirmText: '',
				noLogin: false,
				index: 1,
				isLoading: true,
				goods_id: '',
				wid: '', //wxapp_id
				upGood: {}, //要同步的未处理的详情
				share_image: '',
				
				// 猜你喜欢
				list: '',//信息
				page: 1,
				loadding: false,
				pullUpOn: true,
				
				// mbid: '',//赚一赚b的参数
				is_shared: 0,//默认赚关闭
				commission_pass: -1,//默认新用户 并未申请
			};
		},
		// 显示/隐藏 返回顶部按钮
		// onPageScroll(e) {
		// 	// this.floorstatus = e.detail.scrollTop > 200
		// },
		// 生命周期函数--监听页面加载
		onLoad(e) {
			let that = this;
			let scene = app.getSceneData(e);
			that.goods_id = e.goods_id ? e.goods_id : scene.gid; 
			let mbid = e.mbid ? e.mbid : (scene.mbid? scene.mbid: ''); 
			let wxapp_id = e.wid ? e.wid : (scene.wid? scene.wid: ''); 
			if(mbid!=''&&mbid!='undefined'){
				uni.setStorageSync('mbidObj',JSON.stringify({mbid: mbid,wxapp_id: wxapp_id}));
				app.bindMbid();
			}
			//切换店铺
			if(wxapp_id!=''&&wxapp_id!='undefined'){
				app.wxapp_id = wxapp_id;
				wx.setStorageSync("wxapp_id", wxapp_id)
			}
			// #ifdef MP
			this.noLogin = true
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline'],
				success(res) {},
				fail(e) {}
			})
			// #endif
			
			// 猜你喜欢
			that.page = 1;
			that.list = '';
			that.loadding= false;
			that.pullUpOn= true;
			that.getLikes()
		},
		onShow() {
			let that = this;
			that.getGoodsDetail();// 获取商品信息
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
				that.getLikes();
			}
		},
		// 设置菜单中的转发按钮触发转发事件时的转发内容
		// #ifdef MP
		onShareAppMessage(res) {
			let user_id = uni.getStorageSync('user_id')||'';
			let shareObj = {      
				title: this.upGood.goods.goods_name,
				path: '/pages/goods/index?goods_id='+this.goods_id + '&wid=' + this.upGood.wxapp_id+'&mbid='+user_id,
				imageUrl: this.share_image
			};
			return shareObj;
		},
		onShareTimeline(){
			let user_id = uni.getStorageSync('user_id')||'';
			let shareObj = {
				title: this.upGood.goods.goods_name,
				query: 'goods_id='+ this.goods_id + '&wid=' + this.upGood.wxapp_id+'&mbid='+user_id,
				imageUrl: this.share_image
			};
			return shareObj;
		},
		// #endif
		methods: {
			showLogin(next) {
				this.$refs.detail.showLogin(next)
			},
			toApply() {
				if(this.commission_pass==-1 || this.commission_pass==0||this.commission_pass==2){
					uni.navigateTo({
						url: '/pages/makeMoney/apply/index'
					});
				}else if(this.commission_pass==1){
					uni.navigateTo({
						url: '/pages/makeMoney/index?wxapp_id='+app.wxapp_id
					});
				}
			},
			// 获取商品信息
			getGoodsDetail() {
				let data = {
					wxapp_goods_id: this.goods_id
				};
				app._get('wxapp.goods/detail', data, result => {
					
					if(result.code==1001){
						this.content = result.msg;
						this.confirmText = result.btn_msg;
						this.$refs.popupTips.open(() => {
							uni.reLaunch({
								url: '/'+result.url
							})
						})
					}else{
						this.isLoading = false
						this.upGood = result.data.detail;
						this.share_image = result.data.share_image;
						//切换店铺
						app.wxapp_id = result.data.detail.wxapp_id;
						wx.setStorageSync("wxapp_id", result.data.detail.wxapp_id)
						// 赚的参数
						this.is_shared = result.data.wxapp.is_shared || 0;
						if(app.myShopInfo.wxapp_id==app.wxapp_id){
							this.is_shared = 0;
						}
						this.commission_pass = result.data.commission_pass || -1;
						// 初始化商品详情数据
						this.$refs.detail.getDetail(result.data);
						this.visit(this.upGood.wxapp_id || '');
					}
				});
			},
			visit(wxapp_id) {
				let obj = {
					type: '1',
					url: 'pages/goods/index?wxapp_goods_id=' + this.goods_id,
					wxapp_id: wxapp_id
				};
				app._post_form('user/visit', obj, function(result) {
					
				});
			},
			//猜你喜欢
			getLikes(){
				let data = {
					paginate: true,
					page: this.page,
					shop_rmd: 1
				};
				app._get('wxapp.goods/simpleLists', data, res => {
					let _list = this.list;
					let data = res.data.list;
					if(this.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					this.list = _list;
				})
			},
		}
	};
</script>
<style lang="scss" scoped>
	
	// 赚钱功能-赚一赚
	.applyImg{
		width: 200rpx;
		height: 200rpx;
		position: fixed;
		right: 0;
		bottom: 100rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
