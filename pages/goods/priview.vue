<template>
	<view>
		<detail ref="detail" pageType="goodsPriview" :goodsLikeList="list.data"></detail>
		<view v-show="isLoading">
			<loading></loading>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData; // 富文本插件
	import detail from "./detail/detail.vue";
	import loading from '@/components/loading';

	export default {
		components: {
			detail,
			loading,
		},
		data() {
			return {
				index: 1,
				isLoading: true,
				goods: {},
				
				// 猜你喜欢
				list: '',//信息
				page: 1,
				loadding: false,
				pullUpOn: true,
			};
		},
		onLoad(e) {
			
		},
		// 生命周期函数--监听页面加载
		onShow(e) {
			this.getGoodsDetail();// 获取商品信息
			
			// 猜你喜欢
			this.page = 1;
			this.list = '';
			this.loadding= false;
			this.pullUpOn= true;
			this.getLikes()
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false;
			} else {
				that.page = ++that.page;
				that.loadding = false;
				that.getLikes();
			}
		},
		methods: {
			// 获取商品信息
			getGoodsDetail() {
				let that = this;
				that.isLoading = false;
				let data = uni.getStorageSync('goodsPreview') || '{}';
				let goods = JSON.parse(data);
				
				let minPrice = goods.sku.goods_price
				let maxPrice = goods.sku.goods_price
				if (goods.goods_status == 10 && goods.spec_many && goods.spec_many.spec_list) {
					goods.spec_many.spec_list.forEach(item => {
						if (item.form.goods_price > maxPrice) {
							maxPrice = item.form.goods_price
						}
						if (item.form.goods_price < minPrice) {
							minPrice = item.form.goods_price
						}
					})
				}
				let price_range = minPrice
				if (minPrice != maxPrice) {
					price_range = price_range + '~' + maxPrice
				}
				let sku = goods.spec_many ? goods.spec_many.spec_list || [] : []
				let result = {
					collection_status: 0,
					detail: {
						goods_tag: '',
						wxapp_goods_id: 1,
						goods_id: 1,
						goods: {
							wxapp_goods_id: 1,
							goods_id: 1,
							category_id: goods.category_id,
							content: goods.content,
							goods_name: goods.goods_name,
							goods_short_name: goods.goods_short_name,
							goods_image: goods.images[0].path,
							delivery_id: goods.delivery_id,
							goods_sort: goods.goods_sort,
							selling_point: goods.selling_point,
							spec_type: goods.spec_type,
							spec_multi_type: goods.spec_multi_type,
							price_range: price_range,
							sku: sku,
							goods_sku: goods.sku,
							goods_multi_spec: goods.spec_many,
							image: that.unitImg(goods.images),
						}
					}
				};
				// that.goods = goods; 
				that.$nextTick(()=>{
				that.$refs.detail.getDetail(result);
				})
			},
			unitImg(images) {
				if (!images) {
					images = []
				} else {
					let newList = []
					images.forEach(element => {
						if (element.type == 'video') {
							newList.push({
								file_path: element.path,
								file_media: element.type
							})
						}
					});
					images.forEach((element, index) => {
						if (element.type == 'image') {
							if (index == 0) {
								this.skuCoverImage = element.path || ''
							}
							newList.push({
								file_path: element.path,
								file_media: element.type
							})
						}
					});
					images = newList
				}
				return images;
			},
			initSpec(spec_many){
				let spec_list = spec_many.spec_list;
				for (let i = 0; i < spec_list.length; i++) {
					spec_list[i].form.image_id = 0;
					spec_list[i].form.image_path ='';
					spec_list[i].goods_sku_id = i+1;
				}
			},
			//猜你喜欢
			getLikes(){
				let data = {
					page: this.page,
					sortType: 'recommend',
					shop_rmd: 1
				};
				app._get('wxapp.goods/lists', data, res => {
					let _list = this.list;
					let data = res.data.list;
					if(this.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					this.list = _list;
				})
			},
		}
	};
</script>
<style lang="scss" scoped>
</style>
