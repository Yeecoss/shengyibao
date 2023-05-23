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
						<view class="tui-drawer-title">
							<text class="tui-title-bold">渠道</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="is_dealer === '1' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="is_dealerClick('1')">已渠道</view>
							</view>
							<view class="tui-attr-item" :class="is_dealer === '0' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="is_dealerClick('0')">未渠道</view>
							</view>
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">上新时间</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<div class="dateItem tui-input" @tap="openDate('min_time')">
								<text v-if="min_time == ''" class="tui-phcolor">开始时间</text>
								<template v-else>
									<text>{{min_time}}</text>
									<text class="iconBox iconfont2 icon-shanchu2" @tap.stop="clearDate('min_time')"></text>
								</template>
							</div>
							<div class="line"></div>
							<div class="dateItem tui-input" @tap="openDate('max_time')">
								<text v-if="max_time == ''" class="tui-phcolor">结束时间</text>
								<template v-else>
									<text>{{max_time}}</text>
									<text class="iconBox iconfont2 icon-shanchu2" @tap.stop="clearDate('max_time')"></text>
								</template>
							</div>
						</view>

						<view class="tui-drawer-title">
							<text class="tui-title-bold">分类</text>
						</view>
						<div v-for="(item, index) in my_cate" :key="index">
							<view class="tui-drawer-title" @tap="changeCate(index)">
								<text>{{item.name}}</text>
								<view class="tui-all-box tui-icon-ml">
									<div class="tipIconBox" :class="onCurrent==index ? 'transIcon' : ''">
										<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
									</div>
									<!-- <tui-icon name="arrowdown" class="tipIconBox" :class="showSet ? 'transIcon' : ''" :size="14" color="#444"></tui-icon> -->
								</view>
							</view>
							<view class="tui-drawer-content tui-flex-attr" v-if="onCurrent==index">
								<view v-for="(items, indexs) in item.child" :key="indexs" class="tui-attr-item" :class="specCheck.indexOf(items.category_id) != -1 ? 'tui-btmItem-active' : ''">
									<view class="tui-attr-ellipsis" @tap="specClick(items.category_id, item.child)">{{items.name}}</view>
								</view>
							</view>
						</div>
						<view class="tui-safearea-bottom"></view>
					</div>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="150" @tap="reset()">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="submit()">确定</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<tui-datetime ref="dateTime" :type="2" :setDateTime="setDateTime" @confirm="dateChange" style="z-index:999999"></tui-datetime>
	</div>
	<!--左抽屉弹层 筛选-->
</template>

<script>
	const App = getApp().globalData;
	export default {
		data() {
			return {
				// 最低价
				min_time: '',
				// 最高价
				max_time: '',
				setDateTime: '',
				fieldName: '',
				is_dealer: '',
				specCheck: [],
				drawer: false,
				drawerH: 0,
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
					this.drawerH = res.windowHeight - uni.upx2px(height);
				}
			});
		},
		methods: {
			clearDate(fieldName) {
				this[fieldName] = ''
			},
			openDate(fieldName) {
				this.fieldName = fieldName
				this.setDateTime = this[fieldName]
				this.$refs.dateTime.show();
			},
			is_dealerClick(is_dealer) {
				if (this.is_dealer === is_dealer) {
					this.is_dealer = ''
				} else {
					this.is_dealer = is_dealer
				}
			},
			specClick(category_id, list) {
				let index = this.specCheck.indexOf(category_id)
				if (index == -1) {
					let num = 0
					list.forEach(item => {
						if (this.specCheck.indexOf(item.category_id) != -1) {
							num++
						}
					})
					if (num > 2) {
						App.showError('同规格最多选三个！')
						return false
					}
					this.specCheck.push(category_id)
				} else {
					this.specCheck.splice(index, 1)
				}
			},
			getCategory() {
				let data = {};
				if (this.wxappId != '') {
					data.wxapp_id = this.wxappId
				}
				App._get('goods.category/store', data, res => {
					let my_cate = res.data.tree || [];
					my_cate.forEach(element => {
						element.show = false
					});
					this.my_cate = my_cate
				});
			},
			reset() {
				this.min_time = ''
				this.max_time = ''

				this.is_dealer = ''
				this.specCheck = []
			},
			changeCate(index) {
				this.onCurrent = this.onCurrent == index ? -1 : index
				this.my_cate[index].show = !this.my_cate[index].show;
			},
			screen(wxappId) {
				this.wxappId = wxappId ||'';
				this.getCategory()
				this.drawer = true;
			},
			closeDrawer: function() {
				this.drawer = false;
			},
			submit() {
				let obj = {}
				if (this.is_dealer != '') {
					obj.is_dealer = this.is_dealer
				}
				if (this.specCheck.length > 0) {
					obj.category_id = this.specCheck.join(',')
				}
				if (this.min_time != '') {
					obj.min_time = this.min_time
				}
				if (this.max_time != '') {
					obj.max_time = this.max_time
				}
				this.$emit('change', obj)
				this.closeDrawer()
			},
			dateChange(data) {
				this[this.fieldName] = data.result
			}
		},
		components: {}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
