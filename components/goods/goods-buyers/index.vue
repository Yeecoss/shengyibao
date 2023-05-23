<template>
	<view>
		<view class="gray-bg20"></view>
		<view class="goods-comment">
		  <view v-if="buyerList.length" class="cont-box b-f goods-property-box dis-flex flex-y-center flex-x-between" @tap.stop="openPoint">
		    <text class="col-0 f-30 m-r-40">谁购买了</text>
				<view class="f-26 theme4_gray">
					查看全部<text class="iconfont icon-xiangyoujiantou f-26 theme4_gray m-l-10 f-w"></text>
				</view>
		  </view>
		  
			<view v-else class="cont-box b-f goods-property-box dis-flex flex-x-between">
				<text class="col-0 f-30">谁购买了</text>
				<text class="theme4_gray f-24">暂无</text>
			</view>
			<view class="buyerList-wrap wrap30" v-if="buyerList.length">
				<view class="buyer dis-flex flex-y-center flex-x-between f-28 m-b-30" v-for="(item,index) in buyerList" :key="index">
					<view class="col-3">{{item.name}}</view>
					<view class="theme4_gray">{{item.buy_time}}</view>
					<view class="buyer-total app-red">x{{item.total_num}}</view>
				</view>
			</view>
		</view>
		
		<!-- 卖点弹窗 -->
		<tui-bottom-popup :show="isShow" @close="close">
			<view class="popup-main" v-if="isShow" catchtouchmove='true'>
				<view class="pop-close" @tap="openPoint"><text class="iconfont2 icon-shanchu1 f-34 col-3"></text></view>
				<view class="title f-32 col-3 m-b-20">谁购买了</view>
		    <!-- 主体信息 -->
		    <scroll-view scroll-y class="trade-main" @scrolltolower="_bottom">
					<view class="buyer dis-flex flex-y-center flex-x-between f-28 m-b-30" v-for="(item,index) in list" :key="index">
						<view class="col-3">{{item.name}}</view>
						<view class="col-6">{{item.buy_time}}</view>
						<view class="buyer-total app-red">x{{item.total_num}}</view>
					</view>
					<!-- <tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="transparent"></tui-nomore> -->
					<tui-nomore backgroundColor="#fff" text="仅显示最新10次购买记录"></tui-nomore>
				</scroll-view>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				isShow: false,
				
				list: '',//信息
				page: 1,
				loadding: false,
				pullUpOn: true,
			};
		},
		props: {
			noLogin: {
				type: Boolean,
				default: false
			},
			buyerList: {
				type: [Object,Array],
			},
			goods_id:{
				type: [String,Number],
			}
		},
		methods: {
			openPoint(){
				this.isShow = !this.isShow;
				if(this.list==''||this.list.data==''){
					this.page = 1;
					this.list = '';
					this.loadding= false;
					this.pullUpOn= true;
					this.getBuyerList()
				}
			},
			close(){
				this.isShow = false
			},
			// 谁购买了
			getBuyerList(){
				app._get('order/buyerList',{wxapp_goods_id: this.goods_id,page: this.page}, res => {
					if (res.code == -1) {
						this.$emit('showLogin', this.getBuyerList)
					} else {
						let data = res.data.list;
						this.list = data;
					}
				}, false, false, false, this.noLogin);
			},
			_bottom(){
				let that = this;
				if (!that.pullUpOn) return;
					that.loadding = true;
				if (that.page >= that.list.last_page) {
					that.loadding = false;
					that.pullUpOn = false;
				} else {
					that.page = ++that.page;
					that.loadding = false;
					that.getBuyerList();
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popup-main {
	  padding: 30rpx 30rpx 40rpx;
		position: relative;
	  border-radius: 16rpx 16rpx 0 0;
	  background: #fff;
	  box-sizing: border-box;
	 //  z-index: 11;
	}
	.trade-main {
		max-height: 600rpx;
		min-height: 400rpx;
	  box-sizing: border-box;
	}
	.pop-close {
		position: absolute;
		right: 0;
		top: 0;
		padding: 30rpx;
		color: #999;
	}
	// 内容
	.content{
		line-height: 48rpx;
	}
	.title{
		text-align: center;
		line-height: 1.1;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
	.buyer-total{
		color: var(--storeColor);
	}
</style>
