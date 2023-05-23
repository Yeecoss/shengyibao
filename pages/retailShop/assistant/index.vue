<template>
	<view>
		<view class="fixedView icon" v-if="showGif" @touchmove.stop.prevent="moveIcon" @tap="showTip"
			 :style="{left:iconPosition.left+'px',top:iconPosition.top+'px',width:iconSize.width+'rpx',height:iconSize.height+'rpx'}">
			 <image src="https://pic.kaidanxia.com/2021-01-27/1358415ee3e9444.gif" mode="aspectFit"></image>
			 <text class="iconfont2 icon-shanchu1" @tap.stop="hideTip()"></text>
		</view>
		<view class="mask">
			<popup :show="isShow" @clickmask="clickmask">
				<view class="maskBox">
					<view class="maskTitle">
						功能介绍
						<text class="iconfont2 icon-shanchu1" @tap="clickmask"></text>
					</view>
					<scroll-view scroll-y style="height:926rpx">
						<view class="scrollBox">
							<view v-for="(item, index) in scrollList" :key="index">
								<view class="scrollList dis-flex flex-y-center flex-x-between" @tap="showItem(item)">
									<text>{{item.title}}</text>
									<text class="iconfont2 icon-shangjiantou" v-if="showItemId == item.id"></text>
									<text class="iconfont2 icon-xiajiantou" v-else></text>
								</view>
								<view class="content dis-flex flex-y-center flex-wrap" v-if="showItemId == item.id">
									<view class="contentItem dis-flex flex-y-center" v-for="(items, indexs) in item.relations" :class="items.class" :key="indexs">
										<view class="flex-box">
											<view class="itemIcon">
												<text class="iconfont2" :class="items.menu.icon"></text>
											</view>
											<view class="contentItemTitle">
												{{items.menu.name}}
											</view>
										</view>
										<view class="flex-box" style="height:88rpx">
											<view class="but1" :class="!items.menu.article_id ? 'hide' : ''" @tap.stop="toArticle(items.menu)">
												功能介绍
											</view>
											<view class="but2" v-if="items.menu.is_active" :class="!items.menu.page ? 'hide' : ''" @tap.stop="toPage(items.menu)">
												去体验
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="pop-btn dis-flex flex-y-center flex-x-end">
						<view class="submit" @tap="showImg">
							进店主群
							<slot></slot>
						</view>
					</view>
				</view>
			</popup>
			<share-bottom ref="shareBottom" pageType="userIndex"></share-bottom>
		</view>
	</view>
</template>

<script>
import popup from "@/components/pop-manager/index";
import shareBottom from '@/components/share-bottom/index';
 const app = getApp().globalData;
 export default {
  components: {
	popup,
	shareBottom
  },
		data() {
			return {
				// 弹窗显示控制
				isShow: false,
				showGif: true,
				showItemId: '',
				scrollList: [],
				transparent: true,

				icon_path:"",
				windowSize:{
					width:0,
					height:0,
					margin:{
						left:10,
						right:10,
						top:10,
						bottom:10,
					}
				},
				iconSize:{
					width:200,
					height:200
				},
				iconPosition:{
					left:0,
					top:0,
					touchPostion:{
						x:0,
						y:0
					}
				},
			}
		},
		props:{
			startPostion:{
				type:Number,
				default:2
			},
			iconWidth:{
				type:Number,
				default:78
			},
			iconHeight:{
				type:Number,
				default:78
			},
			marginLeft:{
				type:Number,
				default:0
			},
			marginRight:{
				type:Number,
				default:10
			},
			marginTop:{
				type:Number,
				default:70
			},
			marginBottom:{
				type:Number,
				default:50
			}
		},
		options: {
			multipleSlots: true // 在组件定义时的选项中启用多slot支持

		},
		mounted() {
			let systemInfo = uni.getSystemInfoSync()
			let windowTop = systemInfo.windowTop || systemInfo.statusBarHeight
			this.$set(this.windowSize.margin,'left',this.marginLeft);
			this.$set(this.windowSize.margin,'right',this.marginRight);
			this.$set(this.windowSize.margin,'top',this.marginTop + windowTop);
			this.$set(this.windowSize.margin,'bottom',this.marginBottom);
			this.$set(this.windowSize,'width',systemInfo.windowWidth);
			this.$set(this.windowSize,'height',systemInfo.windowHeight);
			switch(this.startPostion){
				case 0:
				//初始位置左上角
				this.$set(this.iconPosition,'left',this.windowSize.margin.left);
				this.$set(this.iconPosition,'top',this.windowSize.margin.top);
				break;
				case 1:
				//初始位置右上角
				this.$set(this.iconPosition,'left',this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
				this.$set(this.iconPosition,'top',this.windowSize.margin.top);
				break;
				case 2:
				//初始位置左下角
				this.$set(this.iconPosition,'left',this.windowSize.margin.left);
				this.$set(this.iconPosition,'top',this.windowSize.height - uni.upx2px(this.iconSize.height) - 100);
				break;
				default:
				//初始位置右下角
				this.$set(this.iconPosition,'left',this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
				this.$set(this.iconPosition,'top',this.windowSize.height - uni.upx2px(this.iconSize.height) - 125);
				break;
			}
			this.getData()
		},
		methods: {
			showImg() {
				// #ifndef MP-WEIXIN
				let qrcode = 'https://pic.kaidanxia.com/2020-12-23/1518452c0af7367.png';
				this.$refs.shareBottom._popupShowImg('下载',qrcode)
				// #endif
			},
			toPage(item) {
				if (!item.page || item.page == '') {
					return
				} else {
					uni.navigateTo({
						url: item.page
					})
				}
			},
			toArticle(item) {
				if (!item.article_id || item.article_id == '') {
					return
				} else {
					uni.navigateTo({
						url: '/pages/user/help/article/index?article_id=' + item.article_id
					})
				}
			},
			getData() {
				app._get('shop.guide/getList', {}, (result) => {
					if (result.code == 1) {
						let scrollList = result.data || []
						let newList = []
						scrollList.forEach(item => {
							item.relations.forEach((items, indexs) => {
								let classList = []
								if (indexs > 1) {
									classList.push('contentItemBottom')
								}
								if (indexs % 2 == 1) {
									classList.push('contentItemRight')
								}
								items.class = classList.join(' ')
							})
							if (item.is_active) {
								newList.push(item)
							}
						})
						this.scrollList = scrollList
					}
				}, false, () => {
				})
			},
			showItem(item) {
				this.showItemId == item.id ? this.showItemId = '' : this.showItemId = item.id
			},
			clickmask() {
				this.isShow = false
			},
			showTip() {
				this.isShow = true
			},
			hideTip() {
				this.showGif = false
			},
			touchIcon(e){
				this.$set(this.iconPosition.touchPostion,'x',e.touches[0].clientX);
				this.$set(this.iconPosition.touchPostion,'y',e.touches[0].clientY);
			},
			moveIcon(e){
				//console.log(e)
				/*this.iconPosition.left += (e.touches[0].clientX - this.iconPosition.touchPostion.x);
				this.iconPosition.top += (e.touches[0].clientY - this.iconPosition.touchPostion.y);
				this.iconPosition.touchPostion.x = e.touches[0].clientX;
				this.iconPosition.touchPostion.y = e.touches[0].clientY;*/
				this.$set(this.iconPosition,'left', e.touches[0].clientX - uni.upx2px(this.iconSize.width / 2));
				this.$set(this.iconPosition,'top', e.touches[0].clientY - uni.upx2px(this.iconSize.height / 2));

				this.$set(this.iconPosition,'left',Math.min(this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right, this.iconPosition.left));
				this.$set(this.iconPosition,'left',Math.max(this.windowSize.margin.left, this.iconPosition.left));
				this.$set(this.iconPosition,'top',Math.min(this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom, this.iconPosition.top));
				this.$set(this.iconPosition,'top',Math.max(this.windowSize.margin.top, this.iconPosition.top));
			}
		}
	}
</script>

<style scoped lang="scss">
@import "./index.css";
	.fixedView{
		position: fixed;
		z-index: 6;
		overflow: inherit;
		image{
			width: 100%;
			height: 100%;
		}
		.iconfont2{
			position: absolute;
			right: 0rpx;
			top: 0rpx;
		}
	}
	.hide{
		opacity: 0;
	}
	.mask{
		position: relative;
		z-index: 9999;
		.maskTitle{
			height: 110rpx;
			line-height: 110rpx;
			position: relative;
			color: #2A2A30;
			font-size: 30rpx;
			text-align: center;
			.iconfont2{
				position: absolute;
				right: 30rpx;
			}
			
		}
		.icon{
			border-radius: 50%;
		}
		.maskBox{
			width: 690rpx;
			background: white;
			border-radius: 16rpx;
		}
		.scrollBox{
			padding: 0 30rpx;
			.scrollList{
				height: 80rpx;
				border-top: 1rpx solid #EEEEEE;
				color: #666666;
				font-size: 26rpx;
				.iconfont2{
					font-size: 52rpx;
				}
			}
			.content{
				.contentItem{
					width: 310rpx;
					height: 128rpx;
					background: #FFFFFF;
					border: 1rpx solid #EEEEEE;
					text-align: center;
					font-size: 24rpx;
					.itemIcon{
						height: 48rpx;
						.iconfont2{
							font-size: 48rpx;
							color: #333;
						}
					}
					.contentItemTitle{
						margin-top: 16rpx;
						color: #666666;
					}
					.but1, .but2{
						width: 124rpx;
						height: 36rpx;
						border-radius: 20rpx;
						text-align: center;
					}
					.but1{
						border: 1rpx solid #F8B14A;
						color: #F8B14A;
					}
					.but2{
						border: 1px solid #DEDEDE;
						color: #666666;
						margin-top: 20rpx;
					}
				}
				.contentItemRight{
					margin-left: -1rpx;
				}
				.contentItemBottom{
					margin-top: -1rpx;
				}
			}
		}
		.pop-btn{
			height: 104rpx;
			padding: 0 30rpx;
			border-top: 1rpx solid #EEEEEE;
			.submit{
				width: 200rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				border-radius: 40rpx;
				border: 1rpx solid #FF7541;
				color: #FF7541;
				font-size: 28rpx;
				position: relative;
			}
		}
	}
</style>
