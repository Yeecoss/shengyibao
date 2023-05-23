<template>
	<view class="pageBox">
		<!-- 自定义标题栏 -->
		<navigationBar title="秒杀商品" id="top">
		</navigationBar>
		<view v-show="!loading">
			<scroll-view v-if="list.length > 0" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight  + 'px;'">
				<checkbox-group @change="listChange">
					<div class="contentBox">
						<div class="listBox" v-for="(item, index) in list" :key="index">
							<label class="goodsContent dis-flex flex-y-center goodsContentNo">
								<view class="radioBox prolist-add check-wrap default-check">
									<checkbox class="checkbox" :value="item.sharp_goods_id + ''" :checked="item.checked" color="#FF7541" />
								</view>
								<div class="pad-r">
									<div class="imgBox">
										<image mode="aspectFill" class="imageDefault" :src="item.goods.goods_image"></image>
										<div class="state" v-if="item.status == '0'">已下架</div>
									</div>
								</div>
								<div class="goodsInfo dis-flex flex-wrap">
									<div class="goods_name dis-flex flex-y-center">
										<text class="onelist-hidden"
											style="line-height:40rpx">{{item.goods.goods_name}}</text>
										<text style="width:56rpx"></text>
									</div>
									<div class="dis-flex flex-y-center stateBox">
										<div class="goods_price">
											{{item.goods.goods_sku.goods_price ? '￥' + item.goods.goods_sku.goods_price : ''}}
										</div>
										<!-- 暂时没有 -->
										<div class="line"></div>
										<div>限购数量:{{item.limit_num}}</div>
										<div class="line"></div>
										<div>累计销量:{{item.total_sales}}</div>
									</div>
									<div class="dis-flex flex-y-center stateBox m-top20">
										<div>
											库存总量:{{item.seckill_stock}}
										</div>
										<div class="line"></div>
										<div>
											创建时间:{{item.createTime}}
										</div>
									</div>
								</div>
							</label>
						</div>
						<view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
						<view v-if="more_loading" class="no-more f-24 col-9">加载中...</view>
					</div>
				</checkbox-group>
			</scroll-view>
			<tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png"
				:imgWidth="264" :imgHeight="264">
				<div class="col-9">
					暂无数据
				</div>
			</tui-no-data>
		</view>
		<view v-show="loading">
			<loading></loading>
		</view>
		<view class="footer dis-flex flex-y-center flex-x-center" @tap="submit">
			<view class="footBut">
				确定
			</view>
		</view>
	</view>
</template>
<script>
	let App = getApp().globalData;
	import loading from '@/components/loading';
	export default {
		data() {
			return {
				list: [],
				checkList: [],
				page: 1,
				loading: true,
				more_loading: false,
				no_more: false,
				last_page: 1,
				total: 0,
				scrollHeight: 0
			};
		},

		components: {
			loading
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.getListData(true)
		},
		mounted() {
			this.$nextTick(() => {
				this.setListHeight()
			})
		},
		methods: {
			submit() {
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.proCheck){
					prevPage.$vm.proCheck(this.checkList)
				}
				uni.navigateBack();
			},
			listChange(e) {
				let values = e.detail.value;
				let checkList = [];
				this.list.forEach(item => {
					if(values.includes(item.sharp_goods_id.toString())){
						item.checked = true
						checkList.push(item)
					}else{
						item.checked = false
					}
				})
				this.checkList = checkList;
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
						scrollHeight = systemInfo.windowHeight - res[0].height - 100 * rpx; // swiper高度

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
				App._get('shop.market.sharp.goods/data', {
					page: this.page
				}, (result) => {
					if (this.page != 1) {
						this.more_loading = false
					}
					let newList = result.data.list.data || []
					newList.forEach(item => {
						item.checked = false
						item.createTime = item.create_time.slice(0,11)
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
