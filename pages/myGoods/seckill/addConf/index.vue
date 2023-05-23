<template>
	<div class="pageBox dis-flex flex-dir-column">
		<!-- 自定义标题栏 -->
		<navigationBar :title="title" id="top">
		</navigationBar>
		<view class="contentBox">
			<scroll-view :style="{height: scrollHeight + 'px'}" scroll-y>
				<view class="padBox">
				</view>
				<view class="numBox dis-flex flex-y-center flex-x-between" @tap="selectTime">
					<view class="label">
						活动日期
					</view>
					<view class="value value1" v-if="active_date">
						{{active_date}}
					</view>
					<view class="value" v-else>
						选择日期
						<text class="iconfont2 icon-more4"></text>
					</view>
				</view>
				<view class="tips">
					<text class="iconfont2 icon-jingshi"></text>
					提示(活动日期保存后不能更改)
				</view>
				<view class="numBox dis-flex flex-y-center flex-x-between">
					<view class="label">
						活动场次
					</view>
					<view class="value">
						{{timeName}}
					</view>
				</view>
				<view class="timeBox" v-if="!active_time_id">
					<!-- 列表 -->
					<checkbox-group @change="listChange">
						<view class="timeList dis-flex flex-y-center flex-x-between flex-wrap">
							<label class="timeItem prolist-add check-wrap default-check" v-for="(item, index) in timeList" :key="index">
								<text v-if="item.disabled" class="iconfont2 icon-Certified"></text>
								<checkbox v-else class="checkbox" :value="item.id + ''" :checked="item.check" :disabled="item.disabled" color="#FF7541" />
								{{item.time}}
							</label>
						</view>
					</checkbox-group>
				</view>
				<view class="padBox">
				</view>
				<view class="numBox dis-flex flex-y-center flex-x-between" @tap="selectGoods">
					<view class="label">
						选择商品
					</view>
					<view class="value">
						选择秒杀商品
						<text class="iconfont2 icon-more4"></text>
					</view>
				</view>
				
				<view class="wrap30 related-pros" v-if="sharp_goods.length">
					<view class="related-item dis-flex" v-for="(item, index) in sharp_goods" :key="index">
						<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index)"><text class="iconfont2 icon-subtract"></text></view>
						<view class="related-pic"><image lazy-load :src="item.goods_image" mode="aspectFill"></image></view>
						<view class="related-info oh flex-box">
							<view class="f-28 onelist-hidden">{{item.goods_name}}</view>
						</view>
					</view>
				</view>
				<view class="padBox">
				</view>
				<view class="numBox dis-flex flex-y-center">
					<view class="label">
						活动状态
					</view>
					<view class="value">
						<radio-group @change="radioChange">
							<view class="timeList dis-flex flex-y-center flex-x-between flex-wrap">
								<label class="dis-flex flex-y-center" style="margin-right: 40rpx;">
									<radio value="1" color="#FF7541" :checked="status == '1'"/>
									<text>启用</text>
								</label>
								<label class="dis-flex flex-y-center">
									<radio value="0" color="#FF7541" :checked="status == '0'"/>
									<text>禁用</text>
								</label>
							</view>
						</radio-group>
					</view>
				</view>
				<view style="height: 100rpx;">
					
				</view>
			</scroll-view>
			<view class="footer dis-flex flex-y-center flex-x-center" @tap="submit">
				<view class="footBut">
					确定
				</view>
			</view>
		</view>
		<tui-datetime ref="dateTime" :type="2" @confirm="timeChange"></tui-datetime>
	</div>
</template>
<script>
	let App = getApp().globalData;
	export default {
		data() {
			return {
				title: '添加会场',
				active_time_id: '',
				active_id: '',
				active_date: '',
				sharp_goods: [],
				scrollHeight: 0,
				status: '1',
				timeName: '',
				timeLists: [],
				timeList: [{
						time: '00:00',
						id: 0,
						disabled: false,
						check: false
					}, {
						time: '01:00',
						id: 1,
						disabled: false,
						check: false
					}, {
						time: '02:00',
						id: 2,
						disabled: false,
						check: false
					}, {
						time: '03:00',
						id: 3,
						disabled: false,
						check: false
					}, {
						time: '04:00',
						id: 4,
						disabled: false,
						check: false
					}, {
						time: '05:00',
						id: 5,
						disabled: false,
						check: false
					}, {
						time: '06:00',
						id: 6,
						disabled: false,
						check: false
					}, {
						time: '07:00',
						id: 7,
						disabled: false,
						check: false
					}, {
						time: '08:00',
						id: 8,
						disabled: false,
						check: false
					}, {
						time: '09:00',
						id: 9,
						disabled: false,
						check: false
					}, {
						time: '10:00',
						id: 10,
						disabled: false,
						check: false
					}, {
						time: '11:00',
						id: 11,
						disabled: false,
						check: false
					}, {
						time: '12:00',
						id: 12,
						disabled: false,
						check: false
					}, {
						time: '13:00',
						id: 13,
						disabled: false,
						check: false
					}, {
						time: '14:00',
						id: 14,
						disabled: false,
						check: false
					}, {
						time: '15:00',
						id: 15,
						disabled: false,
						check: false
					}, {
						time: '16:00',
						id: 16,
						disabled: false,
						check: false
					}, {
						time: '17:00',
						id: 17,
						disabled: false,
						check: false
					}, {
						time: '18:00',
						id: 18,
						disabled: false,
						check: false
					}, {
						time: '19:00',
						id: 19,
						disabled: false,
						check: false
					}, {
						time: '20:00',
						id: 20,
						disabled: false,
						check: false
					}, {
						time: '21:00',
						id: 21,
						disabled: false,
						check: false
					}, {
						time: '22:00',
						id: 22,
						disabled: false,
						check: false
					}, {
						time: '23:00',
						id: 23,
						disabled: false,
						check: false
					}
				]
			};
		},

		components: {
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.active_time_id = options.active_time_id || ''
			this.active_id = options.active_id || ''
			
			if (this.active_time_id) {
				this.title = '编辑场次'
				this.getData()
			}
			if (this.active_id) {
				this.title = '新增场次'
				this.getActiveData()
			}
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		mounted() {},
		methods: {
			getActiveData() {
				App._get('shop.market.sharp.active_time/add', {
					active_id: this.active_id
				}, (result) => {
					if (result.code == 1) {
						this.active_date = result.data.active.active_date
						
						this.timeLists = result.data.existTimes || []
						
						let newList = []
						this.timeList.forEach(item => {
							if (this.timeLists.indexOf(item.id) != -1) {
								newList.push(item.time)
								item.check = true
								item.disabled = true
							}
						})
						let newList1 = newList.slice(0,2)
						let timeName = newList1.join('/')
						if (this.timeLists.length > 2) {
							timeName += '等' + this.timeLists.length + '个场次'
						}
						this.timeName = timeName
						// this.timeLists = [this.timeName]
						// this.status = result.data.status
						// this.sharp_goods = result.data.goodsList
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			getData() {
				App._get('shop.market.sharp.active_time/edit', {
					active_time_id: this.active_time_id
				}, (result) => {
					if (result.code == 1) {
						this.active_date = result.data.model.active.active_date
						let active_time = result.data.model.active_time
						this.timeName = active_time.text
						this.timeLists = [active_time.value]
						this.status = result.data.model.status
						this.sharp_goods = result.data.goodsList
					} else {
						this.$api.msg(result.msg)
					}
				})
			},
			submit() {
				let timeList = []
				if (this.active_date == '') {
					this.$api.msg('请选择活动日期！')
				} else if (this.timeLists.length == 0) {
					this.$api.msg('请选择活动场次！')
				} else if (this.sharp_goods.length == 0) {
					this.$api.msg('请选择秒杀商品！')
				} else {
					let sharp_goods = []
					this.sharp_goods.forEach(item => {
						sharp_goods.push(item.sharp_goods_id)
					})
					let obj = {
						active_date: this.active_date,
						active_times: this.timeLists,
						sharp_goods: sharp_goods,
						status: this.status
					}
					let url = 'shop.market.sharp.active/add'
					if (this.active_time_id) {
						obj.active_time_id = this.active_time_id
						url = 'shop.market.sharp.active_time/edit'
					}
					if (this.active_id) {
						obj.active_id = this.active_id
						url = 'shop.market.sharp.active_time/add'
					}
					uni.showLoading()
					App._post_json_form(url, obj, (result) => {
						uni.hideLoading()
						this.$api.msg(result.msg)
						if (result.code == 1) {
							setTimeout(() => {
								uni.navigateBack()
							}, 500)
						}
					}, false, () => {
						uni.hideLoading()
					})
				}
			},
			selectTime() {
				if (this.active_time_id || this.active_id) {
					return
				}
				this.$refs.dateTime.show()
			},
			timeChange(e) {
				this.active_date = e.result
			},
			//关联商品
			proCheck(data){
				// this.formData.sharp_goods = data;
				let list = [];
				for (let i in data) {
					let obj = {
						goods_image: data[i].goods.goods_image,
						goods_name: data[i].goods.goods_name,
						goods_price: data[i].goods.goods_sku.goods_price,
						goods_sales: data[i].goods.goods_sales,
						image: data[i].goods.goods_image,
						line_price: data[i].goods.goods_sku.line_price,
						sharp_goods_id: data[i].sharp_goods_id
					}
					list.push(obj)
				}
				this.sharp_goods = list;
			},
			//删除关联商品
			delPro(index){
				this.sharp_goods.splice(index, 1)
			},
			selectGoods() {
				uni.navigateTo({
					url: '/pages/myGoods/seckill/selectGoods/index'
				})
			},
			radioChange(e) {
				this.status = e.detail.value
			},
			listChange(e) {
				this.timeLists = e.detail.value || []
				
				let newList = []
				this.timeList.forEach(item => {
					if (this.timeLists.indexOf(item.id) != -1) {
						newList.push(item.time)
					}
				})
				let newList1 = newList.slice(0,2)
				let timeName = newList1.join('/')
				if (this.timeLists.length > 2) {
					timeName += '等' + this.timeLists.length + '个场次'
				}
				this.timeName = timeName
			},
			/**
			 * 设置列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750
					let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
					this.ios = ios
						// tap高度
					let scrollHeight = systemInfo.windowHeight - res[0].height - 100 * rpx; // swiper高度
					this.scrollHeight = scrollHeight
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
