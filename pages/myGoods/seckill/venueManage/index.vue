<template>
	<view class="pageBox">
		<!-- 自定义标题栏 -->
		<navigationBar title="场次管理" isHelpme id="top">
		</navigationBar>
		<view v-show="!loading">
			<scroll-view v-if="list.length > 0" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
				<view class="contentBox">
					<view class="listBox1" v-for="(item, index) in list" :key="index">
						<view class="listTitle dis-flex flex-y-center flex-x-between">
							<view class=" dis-flex flex-y-center">
								<view class="titleTime">
									{{item.active_time.text}}
								</view>
							</view>
							<view v-if="item.status == 1">
								启用中
							</view>
							<view v-else class="colRed">
								禁用中
							</view>
						</view>
						<view class="listContent">
							<view class="contentItem dis-flex flex-y-center flex-x-between">
								<view class="label">
									商品数量：<text class="col-3">共{{item.goods_count}}件</text>
								</view>
								<view class="line">
									
								</view>
								<view class="value">
									创建时间：<text class="col-3">{{item.createTime}}</text>
								</view>
							</view>
							<view class="butBox dis-flex flex-y-center flex-x-end">
								<view class="butItem but1" @tap="deleteItem(item)">
									删除
								</view>
								<view class="butItem but2" @tap="toEdit(item)">
									编辑
								</view>
							</view>
						</view>
					</view>
					<view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
					<view v-if="more_loading" class="no-more f-24 col-9">加载中...</view>
				</view>
			</scroll-view>
			<tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png"
				:imgWidth="264" :imgHeight="264">
				<view class="col-9">
					暂无数据
				</view>
			</tui-no-data>
			<view class="footer dis-flex flex-y-center flex-x-center" @tap="add">
				<view class="footBut">
					新增场次
				</view>
			</view>
		</view>
		<view v-show="loading">
			<loading></loading>
		</view>
		<popup-tips ref="popupTips" :title="popupObj.title" :content="popupObj.content"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>
<script>
	import popupTips from '@/components/popup-tips/index';
	let App = getApp().globalData;
	import loading from '@/components/loading';
	import guidePage from '@/components/guide-page';
	export default {
		data() {
			return {
				list: [],
				page: 1,
				loading: true,
				more_loading: false,
				no_more: false,
				last_page: 1,
				total: 0,
				scrollHeight: 0,
				popupObj: {
					title: '',
					content: ''
				}
			};
		},

		components: {
			loading,
			popupTips,
			guidePage
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.active_id = options.active_id
		},
		onShow() {
			this.getListData(true)
		},
		mounted() {
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		methods: {
			deleteItem(item) {
				this.popupObj = {
					title: '提示',
					content: '是否删除该场次？'
				}
				this.$refs.popupTips.open(() => {
					uni.showLoading()
					App._post_form('shop.market.sharp.active_time/delete', {
						active_time_id: item.active_time_id
					}, (result) => {
						this.getListData(true, true)
						uni.hideLoading()
						this.$api.msg(result.msg)
					}, false, () => {
						uni.hideLoading()
					})
				})
			},
			add() {
				uni.navigateTo({
					url: '/pages/myGoods/seckill/addConf/index?active_id=' + this.active_id
				})
			},
			toEdit(item) {
				uni.navigateTo({
					url: '/pages/myGoods/seckill/addConf/index?active_time_id=' + item.active_time_id
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
						scrollHeight = systemInfo.windowHeight - res[0].height - 100*rpx; // swiper高度

					this.scrollHeight = scrollHeight
				});
			},
			bindDownLoad() {
				// 已经是最后一页
				if (this.page >= this.last_page) {
					this.no_more = true
					return false;
				} // 加载下一页列表
				this.page++;
				this.getListData();
			},
			// 获取数据
			getListData(unit) {
				if (unit) {
					this.page = 1
				}
				if (this.page != 1) {
					this.more_loading = true
				}
				App._get('shop.market.sharp.active_time/index', {
					page: this.page,
					active_id: this.active_id
				}, (result) => {
					if (this.page != 1) {
						this.more_loading = false
					}
					let newList = result.data.list.data || []
					newList.forEach(item => {
						item.createTime =  item.create_time.slice(0,11)
					})
					this.total = result.data.list.total || 0
					this.list = unit ? newList : this.list.concat(newList)
					this.last_page = result.data.list.last_page || 1
					this.$nextTick(() => {
						this.loading = false
					})
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
