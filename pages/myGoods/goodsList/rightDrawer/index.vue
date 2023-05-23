<template>
	<!--左抽屉弹层 筛选 -->
	<view>
		<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
			<view class="tui-drawer-box">
				<!-- #ifdef MP-WEIXIN || APP-PLUS -->
				<view class="topSpan" id="topSpan"></view>
				<!-- #endif -->
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px'}">
					<view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">状态</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="goods_status === '10' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="goods_statusClick('10')">上架</view>
							</view>
							<view class="tui-attr-item" :class="goods_status === '20' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="goods_statusClick('20')">下架</view>
							</view>
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">来源</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="souceCheck === '1,3' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="souceCheckClick('1,3')">自建</view>
							</view>
							<view class="tui-attr-item" :class="souceCheck === '2' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="souceCheckClick('2')">渠道</view>
							</view>
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">价格</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<input v-model="min_price" placeholder-class="tui-phcolor" class="tui-input"
								placeholder="输入最低价" maxlength="11" type="number" />
							<view class="line"></view>
							<input v-model="max_price" placeholder-class="tui-phcolor" class="tui-input"
								placeholder="输入最高价" maxlength="11" type="number" />
						</view>
						<view class="tui-drawer-title">
							<text class="tui-title-bold">添加时间</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="dateItem tui-input" @tap="openDate('min_time')">
								<text v-if="min_time == ''" class="tui-phcolor">开始时间</text>
								<template v-else>
									<text>{{min_time}}</text>
									<text class="iconBox iconfont2 icon-shanchu2"
										@tap.stop="clearDate('min_time')"></text>
								</template>
							</view>
							<view class="line"></view>
							<view class="dateItem tui-input" @tap="openDate('max_time')">
								<text v-if="max_time == ''" class="tui-phcolor">结束时间</text>
								<template v-else>
									<text>{{max_time}}</text>
									<text class="iconBox iconfont2 icon-shanchu2"
										@tap.stop="clearDate('max_time')"></text>
								</template>
							</view>
						</view>

						<view class="tui-drawer-title">
							<text class="tui-title-bold">类别</text>
						</view>
						<view class="tui-drawer-content tui-flex-attr">
							<view class="tui-attr-item" :class="typeCheck === '0' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="typeCheckClick('0')">热销</view>
							</view>
							<view class="tui-attr-item" :class="typeCheck === '1' ? 'tui-btmItem-active' : ''">
								<view class="tui-attr-ellipsis" @tap="typeCheckClick('1')">推荐</view>
							</view>
						</view>

						<view class="tui-drawer-title">
							<text class="tui-title-bold">分类</text>
						</view>
						<view v-for="(item, index) in my_cate" :key="index">
							<view class="tui-drawer-title" @tap="changeCate(index)">
								<text>{{item.name}}</text>
								<view class="tui-all-box tui-icon-ml">
									<view class="tipIconBox" :class="onCurrent==index  ? 'transIcon' : ''">
										<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
									</view>
									<!-- <tui-icon name="arrowdown" class="tipIconBox" :class="showSet ? 'transIcon' : ''" :size="14" color="#444"></tui-icon> -->
								</view>
							</view>
							<view class="tui-drawer-content tui-flex-attr" v-if="onCurrent==index">
								<view v-for="(items, indexs) in item.child" :key="indexs" class="tui-attr-item"
									:class="specCheck.indexOf(items.category_id) != -1 ? 'tui-btmItem-active' : ''">
									<view class="tui-attr-ellipsis" @tap="specClick(items.category_id, item.child)">
										{{items.name}}</view>
								</view>
							</view>
						</view>
						<view class="tui-safearea-bottom"></view>
					</view>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover"
							:hover-stay-time="150" @tap="reset()">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover"
							:hover-stay-time="150" @tap="submit()">确定</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<tui-datetime ref="dateTime" :type="2" :setDateTime="setDateTime" @confirm="dateChange"
			style="z-index:999999;position:relative;"></tui-datetime>
	</view>
	<!--左抽屉弹层 筛选-->
</template>

<script>
	const App = getApp().globalData;
	export default {
		data() {
			return {
				// 最低价
				min_price: '',
				// 最高价
				max_price: '',
				// 最低价
				min_time: '',
				// 最高价
				max_time: '',
				setDateTime: '',
				fieldName: '',
				goods_status: '',
				souceCheck: '',
				typeCheck: '',
				specCheck: [],
				drawer: false,
				drawerH: 0,
				state: '',
				my_cate: [],
				onCurrent: -1,
			};
		},
		created() {
			this.getCategory()
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
			souceCheckClick(souceCheck) {
				if (this.souceCheck == souceCheck) {
					this.souceCheck = ''
				} else {
					this.souceCheck = souceCheck
				}
			},
			goods_statusClick(goods_status) {
				if (this.goods_status == goods_status) {
					this.goods_status = ''
				} else {
					this.goods_status = goods_status
				}
			},
			typeCheckClick(typeCheck) {
				if (this.typeCheck == typeCheck) {
					this.typeCheck = ''
				} else {
					this.typeCheck = typeCheck
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
				App._get('goods.category/my', {}, res => {
					let my_cate = res.data.tree || [];
					my_cate.forEach(element => {
						element.show = false
					});
					this.my_cate = my_cate
				});
			},
			changeCate(index) {
				this.onCurrent = this.onCurrent == index ? -1 : index
				this.my_cate[index].show = !this.my_cate[index].show;
			},
			reset() {
				this.min_price = ''
				this.max_price = ''
				this.min_time = ''
				this.max_time = ''

				this.goods_status = ''
				this.souceCheck = ''
				this.typeCheck = ''
				this.specCheck = []
			},
			screen() {
				this.drawer = true;
			},
			closeDrawer: function() {
				this.drawer = false;
			},
			submit() {
				let obj = {}
				if (this.goods_status != '') {
					obj.status = this.goods_status
				}
				if (this.typeCheck === '0') {
					obj.is_hot = '1'
				}
				if (this.typeCheck === '1') {
					obj.shop_rmd = '1'
				}
				if (this.specCheck.length > 0) {
					obj.category_id = this.specCheck.join(',')
				}
				if (this.min_price != '') {
					obj.min_price = this.min_price
				}
				if (this.max_price != '') {
					obj.max_price = this.max_price
				}
				if (this.min_time != '') {
					obj.min_time = this.min_time
				}
				if (this.max_time != '') {
					obj.max_time = this.max_time
				}
				obj.wxapp_goods_type = this.souceCheck
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
