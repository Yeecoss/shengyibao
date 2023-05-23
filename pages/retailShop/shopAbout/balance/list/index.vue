<template>
	<view class="page">
		<!-- 自定义标题栏 -->
		<navigationBar title="资金账单记录" extClass="nav" id="top"></navigationBar>
		<!-- list -->
		<!-- 日历 -->
		<view class="rangeBox" @tap.stop="onShowDatePicker()">
			<text class="iconfont2 icon-calendar f-36"></text>
			<text class="f-28" v-if="startDate != '' && endDate != ''">{{startDate}} - {{endDate}}</text>
			<text v-else class="f-28">筛选</text>
		</view>
		<scroll-view scroll-y v-if="listData.length!=0" :style="{height: scrollHeight + 'px'}" @scrolltolower="bindDownLoad">
			<view class="main">
				<view hover-class="none" class="list-item col-3 dis-flex flex-y-center flex-x-between" v-for="(item,index) in listData" :key="index">
					<view class="">
						<view class="f-30 col-6 title">{{item.date}}</view>
						<view class="f-26 m-t-4 content">
							余额 ¥{{item.total_amount}}
						</view>
					</view>
					<view class="f-32" :class="item.trade_type.value == 10 ? 'app-red' : ''">
						<text v-if="item.trade_type.value == 20">-</text>
						<text v-else>+</text>
						{{item.change_amount}}
					</view>
				</view>
			</view>
          <view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
          <view v-if="more_loading" class="no-more f-24 col-9">加载中...</view>
		</scroll-view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="listData.length==0">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<tui-calendar :type="2" @change="onSelected" ref="tuiCalender" isFixed @timeHide="timeHide"></tui-calendar>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				closeEchats: false,
				scrollHeight: 0,
				startDate: '',
				endDate: '',
				page: 1,
				loading: true,
				more_loading: false,
				no_more: false,
				total: 0,
				listData: [],
				last_page: 1
			}
		},
		onShow() {
		},
		mounted() {
			this.getData()
			this.$nextTick(() => {
			  this.setListHeight()
			})
		},
		methods: {
			bindDownLoad() {
			  // 已经是最后一页
			  if (this.page >= this.last_page) {
				this.no_more = true
				return false;
			  } // 加载下一页列表
			  this.page ++;
			  this.getData();
			},
			getData() {
				let obj = {
					page: this.page
				}
				if (this.startDate != '') {
					obj.start_date = this.startDate + ' 00:00:00'
				}
				if (this.endDate != '') {
					obj.end_date = this.endDate + ' 23:59:59'
				}
				
				if (this.page != 1) {
					this.more_loading = true
				}
				app._get('shop.commerce.bill/subCashLog', obj, (result) => {
					this.loading = false
					if (this.page != 1) {
						this.more_loading = false
					}
					let newList = result.data.list.data || []
					this.total = result.data.list.total || 0
					this.listData = this.page == 1 ? newList : this.listData.concat(newList)
					this.last_page = result.data.list.last_page || 1
					
					if (this.page >= this.last_page) {
						this.no_more = true
					}
				})
			},
			/**
			 * 设置商品列表高度
			 */
			setListHeight() {
			  const query = wx.createSelectorQuery();
			  query.select('#top').boundingClientRect();
			  query.selectViewport().scrollOffset();
			  query.exec(res => {
				let systemInfo = wx.getSystemInfoSync(),
					rpx = systemInfo.windowWidth / 750,
					// tap高度
				scrollHeight = systemInfo.windowHeight - res[0].height - 45; // swiper高度

				this.scrollHeight = scrollHeight
			  });
			},
			onShowDatePicker(){//显示
			  this.closeEchats = true
			  this.$refs.tuiCalender.show()
			},
			onSelected(e) {//选择
			  this.closeEchats = false
			  if(e) {
				this.startDate = e.startDate
				this.endDate = e.endDate
				this.page = 1
				this.no_more = false
				this.getData()
			  }
			  // this.getAllData(true)
			},
			timeHide() {
			  this.closeEchats = false
			}
		},
	}
</script>

<style lang="scss">
	@import 'index';
</style>
