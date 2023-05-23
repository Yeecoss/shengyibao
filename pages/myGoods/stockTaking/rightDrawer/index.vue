<template>
	<!--左抽屉弹层 筛选 -->
	<div>
		<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
			<view class="tui-drawer-box">
				<!-- #ifdef MP-WEIXIN || APP-PLUS -->
				<div class="topSpan" id="topSpan"></div>
				<!-- #endif -->
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px'}">
					<div>
						<view class="tui-drawer-title f-26">
							<text class="tui-title-bold">筛选分类</text>
						</view>
						<div class="cate_list" v-for="(item, index) in my_cate" :key="index">
							<view class="tui-drawer-title" :class="onCurrent==index?'on':''" @tap="changeCate(index)">
								<text>{{item.name}}</text>
								<view class="tui-all-box tui-icon-ml" v-if="onCurrent==index">
									<text class="tipIcon iconfont2 icon-duihao"></text>
								</view>
							</view>
						</div>
						<view class="tui-safearea-bottom"></view>
					</div>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea f-28">
						<view class="tui-drawer-btn tui-drawerbtn-black m-r-20" hover-class="tui-white-hover" :hover-stay-time="150" @tap="reset()">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="submit()">确定</view>
					</view>
				</view>
			</view>
		</tui-drawer>
	</div>
	<!--左抽屉弹层 筛选-->
</template>

<script>
	const App = getApp().globalData;
	export default {
		data() {
			return {
				specCheck: [],
				drawer: false,
				drawerH: 0,
				state: '',
				my_cate: [],
				onCurrent: -1,
				wxappId: ''
			};
		},
		props: {
		},
		created() {
			// this.getCategory()
		},
		mounted: function(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			uni.getSystemInfo({
				success: res => {
					let height = 100
					// #ifdef MP-WEIXIN || APP-PLUS
					height += 100
					// #endif
					this.drawerH = res.windowHeight - uni.upx2px(height) - 20;
				}
			});
		},
		methods: {
			getCategory() {
				let data = {};
				if (this.wxappId != '') {
					data.wxapp_id = this.wxappId
				}
				App._get('goods.category/store', data, res => {
					let my_cate = res.data.tree || [];
					let child = []
					my_cate.forEach(element => {
						element.child.forEach(item => {
							child.push(item)
						})
					});
					this.my_cate = child
				});
			},
			changeCate(index) {
				this.onCurrent = index
			},
			reset() {
				this.onCurrent = -1;
			},
			screen(wxappId) {
				this.wxappId = wxappId ||'';
				this.getCategory()
				this.drawer = true;
			},
			closeDrawer() {
				this.drawer = false;
			},
			submit() {
				let obj = {}
				if (this.onCurrent!=-1) {
					obj.category_id = this.my_cate[this.onCurrent].category_id
				}
				this.$emit('change', obj)
				this.closeDrawer()
			},
		},
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
