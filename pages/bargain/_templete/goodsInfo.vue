<template>
	<view class="wrap" :class="homeStyle+'-goods-info'">
		<!-- 价格、倒计时 top-->
		<view class="info-item__top dis-flex flex-x-between flex-y-center">
			<image v-if="homeStyle=='div'" lazy-load :src="imgBaseUrl + 'kanjia_bg.png'"
				style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;"></image>
			<view class="block-left dis-flex flex-y-center">
				<!-- 底价 -->
				<text class="floor-price__samll">￥</text>
				<text class="floor-price">{{ active.floor_price }}</text>
				<!-- 原价 -->
				<text class="original-price">￥{{ line_price }}</text>
			</view>
			<!-- 活动倒计时 -->
			<view v-if="!active.is_end" class="info-item_countdown">
				<view>{{homeStyle=='saler'?'本场还剩':homeStyle=='minishop'?'剩余':'距离结束'}}</view>
				<block v-for="(item, index) in actEndTimeList" :key="index">
					<view class="countdown">
						<text>{{ item.dynamic.hou }}</text>:<text>{{ item.dynamic.min }}</text>:<text>{{ item.dynamic.sec }}</text>
					</view>
				</block>
			</view>
			<!-- 活动已结束 -->
			<view v-if="active.is_end" class="info-item_end f-32">
				<text>活动已结束</text>
			</view>
			<!-- 分享 -->
			<view class="goods__share" v-if="homeStyle!='div'">
				<view @tap="onClickShare" class="share-btn dis-flex flex-dir-column">
					<text v-if="homeStyle=='minishop'" class="share__icon iconfont2 icon-share3"></text>
					<text v-else class="share__icon iconfont2 icon-share4"></text>
				</view>
			</view>
		</view>
		<!-- 商品信息 -->
		<view class="goods-info b-f f-30">
			<view class="info-item">
				<!-- 商品名称 -->
				<view class="goods-title" :class="showTitle ? '' : 'sixlist-hidden'">
					<text class="active-tag">限时砍价</text>
					<text class="title f-30" @tap.stop="clipboard(detail.goods_name)">{{detail.goods_name}}</text>
				</view> 
				<view v-if="isMore" @tap="showAllTitle" class="showTitle">
					{{showTitle ? '收起' : '全文'}}
				</view>
				<view class="block-right dis-flex flex-y-center flex-x-between m-t-20">
					<!-- 砍成 -->
					<view class="goods-sales f-24 dis-flex theme4_gray">
						<text>{{ active.active_sales }}人已砍成</text>
					</view>
					<!-- 分享 -->
					<view class="goods__share" v-if="homeStyle=='div'">
						<view @tap="onClickShare" class="share-btn dis-flex flex-dir-column">
							<text class="share__icon iconfont2 icon-share"></text>
							<text class="f-24">分享</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 标签 -->
			<view class="tag-wrap dis-flex flex-wrap">
				<view @tap="toTagPros(item)" class="f-28 m-r-20" v-for="(item,index) in detail.tags" :key="index"><text>#</text>{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default{
		name:'goods-info',
		props:{
			goodsDetail: {},
			goodsActive: {},
			actEndTimeList: {},
			homeStyle: {
				type: String,
				default: 'div'
			}
		},
		data(){
			return{
				imgBaseUrl: app.imgBaseUrl,
				member: app.member,
				active: {},
				detail: {},
				// goods_price: 0,// 商品价格
				line_price: 0,// 划线价格
				showTitle: false,
				isMore: true,
			}
		},
		mounted() {
			this.unit();
		},
		methods:{
			onClickShare(){
				this.$emit('onClickShare')
			},
			// 复制
			clipboard(data) {
				this.$emit('clipboard',data)
			},
			// 标签列表
			toTagPros(item){
				uni.navigateTo({
					url: '/pages/goods/tagGoodsList/tagGoodsList?tag='+item
				})
			},
			// 初始值
			unit() {
				this.detail = JSON.parse(JSON.stringify(this.goodsDetail));
				this.active = JSON.parse(JSON.stringify(this.goodsActive));
				// this.goods_price = this.detail.price_range;
				this.line_price = this.detail.goods_sku.goods_price;
				this.$nextTick(() => {
					this.getH()
					this.getH2()
				})
			},
			getH(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.title').boundingClientRect(result => { 
					if (result) {
						this.vheight = result.height;
					}else { 
						this.getH(); 
					} 
				}).exec();
			},
			getH2(){
				let vheight = '';
				uni.createSelectorQuery().in(this).select('.goods-title').boundingClientRect(result => { 
					if (result) {
						this.vheight0 = result.height;
						if(this.vheight>this.vheight0){
							this.isMore = true;
						}else{
							this.isMore = false;
						}
					}else { 
						this.getH2(); 
					} 
				}).exec();
			},
			showAllTitle() {
				this.showTitle = !this.showTitle
			},
				
		}
	}
</script>

<style lang="scss">
	@import 'goodsInfo';
</style>
