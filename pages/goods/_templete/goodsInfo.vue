<template>
	<view class="goods-info b-f f-30" :class="homeStyle+'-goods-info'">
		<view class="dis-flex">
			<view class="left flex-box">
				<view class="money-box dis-flex flex-y-center m-b-10">
					<!-- 商品价 -->
					<view class="goods-price f-44">
						<text class="goods-price_num">￥{{ goods_price }}</text>
					</view>
					<!-- 划线价 -->
					<view class="line-price" v-if="line_price > 0 && detail.sku && detail.sku.length == 1">
						<text>￥{{ line_price }}</text>
					</view>
					<!-- 会员价标签 -->
					<!-- <view v-if="detail.is_user_grade" class="tag-grade-price">
						<text>{{member}}折扣价</text>
					</view> -->
				</view>
				<view class="goods-sales-box f-24 dis-flex theme4_gray">
					<text class="flex-box num">销量:{{detail.goods_sales}}</text>
				</view>
			</view>
			<view class="right goods__share">
					<view @tap="onClickShare" class="share-btn dis-flex flex-dir-column">
						<text v-if="homeStyle=='minishop'" class="share__icon iconfont2 icon-share3"></text>
						<text v-else-if="homeStyle=='saler'" class="share__icon iconfont2 icon-share4"></text>
						<template v-else>
							<text class="share__icon iconfont2 icon-share"></text>
							<text class="f-24">分享</text>
						</template>
					</view>
			</view>
		</view>
				<!-- 商品名称 -->
				<view class="goods-title m-t-10" :class="showTitle ? '' : 'sixlist-hidden'">
					<text class="title f-30" @tap.stop="clipboard(detail.goods_name)">{{detail.goods_name}}</text>
				</view> 
				<view v-if="isMore" @tap="showAllTitle" class="showTitle">
					{{showTitle ? '收起' : '全文'}}
				</view>
		<!-- 标签 -->
		<view class="tag-wrap dis-flex flex-wrap">
			<view @tap="toTagPros(item)" class="f-28 m-r-20" v-for="(item,index) in detail.tags" :key="index"><text>#</text>{{item}}</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default{
		name:'goods-info',
		props:{
			goodsDetail: {},
			homeStyle: {
				type: String,
				default: 'div'
			}
		},
		data(){
			return{
				member: app.member,
				detail: {},
				goods_price: 0,// 商品价格
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
				this.goods_price = this.detail.price_range;
				this.line_price = this.detail.goods_sku.line_price;
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
