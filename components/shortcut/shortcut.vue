<template>
	<view>
		<view class="fixedView icon" @touchmove.stop.prevent="moveIcon"
		 :style="{left:iconPosition.left+'px',top:iconPosition.top+'px',width:iconSize.width+'rpx',height:iconSize.height+'rpx'}">

			<view class="shortcut">

				<!-- 首页 -->
				<!-- <view @tap.stop="onTargetPageFun(0)">
					<view :class="'nav-item btn-normal ' + ( isShow ? 'show_80' : (transparent ? '' : 'hide_80') )">
					<text class="iconfont icon-home"></text>
					</view>
				</view> -->

				<!-- 分类页 -->
				<!-- <view @tap.stop="onTargetPageFun(1)">
					<view :class="'nav-item btn-normal ' + ( isShow ? 'show_60' : (transparent ? '' : 'hide_60') )">
					<text class="iconfont icon-cate"></text>
					</view>
				</view> -->
				<!-- 购物车 -->
				<!-- <view @tap.stop="onTargetPageFun(2)">
					<view :class="'nav-item btn-normal ' + ( isShow ? 'show_40' : (transparent ? '' : 'hide_40') )">
					<text class="iconfont icon-cart"></text>
					</view>
				</view> -->

				<!-- 个人中心 -->
				<!-- <view @tap.stop="onTargetPageFun(3)">
					<view :class="'nav-item btn-normal ' + ( isShow ? 'show_20' : (transparent ? '' : 'hide_20') )">
					<text class="iconfont icon-profile"></text>
					</view>
				</view> -->
				<!-- 客服 -->
				<!-- <view @tap="onTargetPageFun(4)">
					<view :class="'nav-item btn-normal ' + ( isShow ? 'show_20' : (transparent ? '' : 'hide_20') )">
					<text class="iconfont2 icon-contact1"></text>
					</view>
				</view> -->
				<view @tap="onTargetPageFun(4)">
					<view class="nav-item btn-normal" style="opacity: 1;">
					<text class="iconfont2 icon-WeChat"></text>
					</view>
				</view>

				<!-- 显示隐藏开关 -->
				<!-- <view @tap.stop="onToggleShowFun">
					<view :class="'nav-item nav-item__switch btn-normal ' + ( isShow ? 'shortcut_click_show' : '' )">
					<text class="iconfont icon-daohang"></text>
					</view>
				</view> -->
			
			</view>
		</view>
  <!-- 联系商家 -->
  <contact ref="contact" @showLogin="showLogin" :noLogin="noLogin"></contact>
 </view>
</template>

<script>
 const app = getApp().globalData;
 import contact from '@/components/myGoodsCommon/contact/index';
 export default {
  components: {
   contact
  },
		data() {
			return {
				// 弹窗显示控制
				isShow: false,
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
					width:60,
					height:60
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
			noLogin: {
				type: Boolean,
				default: false
			},
			startPostion:{
				type:Number,
				default:3
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
				default:10
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
				default:10
			},
			wxapp_id:{
				type:[Number,String],
				default: ''
			},
		},
		options: {
			multipleSlots: true // 在组件定义时的选项中启用多slot支持

		},
		mounted() {
			let systemInfo = uni.getSystemInfoSync()
			let windowTop = systemInfo.windowTop || systemInfo.statusBarHeight
			this.$set(this.iconSize,'width',this.iconWidth);
			this.$set(this.iconSize,'height',this.iconHeight);
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
				this.$set(this.iconPosition,'top',this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom);
				break;
				default:
				//初始位置右下角
				this.$set(this.iconPosition,'left',this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
				this.$set(this.iconPosition,'top',this.windowSize.height - uni.upx2px(this.iconSize.height) - 125);
				break;
			}
		},
		methods: {
			showLogin(next) {
				this.$emit('showLogin', next)
			},
			
			/**
			 * 导航菜单切换事件
			 */
			onToggleShowFun(e) {
				// 记录formid
				// getApp().globalData.saveFormId(e.detail.formId);
				this.setData({
					isShow: !this.isShow,
					transparent: false
				});
			},

			/**
			 * 导航页面跳转
			 */
			onTargetPageFun(index) {
				let urls = getApp().globalData.getTabBarLinks();

				if (index == 1) {
					uni.navigateTo({
					url: '/' + urls[index]
					});
				}else if(index==4){
				 this.toShopInformation();
				} else {
					uni.switchTab({
					url: '/' + urls[index]
					});
				}
			},
		 // 店铺资料
		 toShopInformation() {
			let obj = {
			 // wxapp_id: uni.getStorageSync('wxapp_id')
			 wxapp_id: this.wxapp_id
			}
			app._get('wxapp/info', obj, (res) => {
				if (res.code == -1) {
					this.$emit('showLogin', this.toShopInformation)
				} else {
					let values = res.data.shop || {}
					this.user = values
					this.$refs.contact.open(this.user)
				}
			}, false, false, false, this.noLogin)
		 },
			touchIcon(e){
				this.$set(this.iconPosition.touchPostion,'x',e.touches[0].clientX);
				this.$set(this.iconPosition.touchPostion,'y',e.touches[0].clientY);
			},
			moveIcon(e){
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
@import "./shortcut.css";
	.fixedView{
		position: fixed;
		// z-index: 200;
		z-index: 5;
		overflow: inherit;
	}
	
	.icon{
		border-radius: 50%;
	}
</style>
