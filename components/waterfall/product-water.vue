<template>
	<view>
			<checkbox-group :class="'goods-list ' + listClass" @change="choose">
				<view class="goods-list-wrap">
					<view class="goods-item" v-for="(dataItem, index) in listData" :key="dataItem.wxapp_goods_id" v-if="(index + 1) % 2 != 0" @tap="toDetail(dataItem.wxapp_goods_id)">
						<!-- 商品图片 -->
						<view class="goods-item_pic check-wrap">
							<image lazy-load :src="dataItem.image || dataItem.goods.goods_image" mode="widthFix"></image>
							<checkbox @tap.stop v-if="ifManage" class="checkbox" :value="dataItem.wxapp_goods_id+''" :checked="dataItem.checked" />
						</view>
					
						<view class="detail">
							<!-- 商品名称 -->
							<view class="goods-name twolist-hidden">
								<text>{{ dataItem.goods_name || dataItem.goods.goods_name }}</text>
							</view>
							<view class="desc_footer dis-flex flex-y-center flex-x-between">
								<view class="goods_price1"><text>¥</text>{{ dataItem.goods_price ||dataItem.goods.min_price }}</view>
								<view class="goods_sales col-9">销量{{ dataItem.goods?dataItem.goods.goods_sales : dataItem.goods_sales || 0}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="goods-list-wrap">
					<view class="goods-item" v-for="(dataItem, index) in listData" :key="dataItem.wxapp_goods_id" v-if="(index + 1) % 2 == 0" @tap="toDetail(dataItem.wxapp_goods_id)">
						<!-- 商品图片 -->
						<view class="goods-item_pic check-wrap">
							<image lazy-load :src="dataItem.image || dataItem.goods.goods_image" mode="widthFix"></image>
							<checkbox @tap.stop v-if="ifManage" class="checkbox" :value="dataItem.wxapp_goods_id+''" :checked="dataItem.checked" />
						</view>
						<view class="detail">
							<!-- 商品名称 -->
							<view class="goods-name twolist-hidden">
								<text>{{ dataItem.goods_name || dataItem.goods.goods_name }}</text>
							</view>
							<view class="desc_footer dis-flex flex-y-center flex-x-between">
								<view class="goods_price1"><text>¥</text>{{dataItem.goods_price ||dataItem.goods.min_price }}</view>
								<view class="goods_sales col-9">销量{{ dataItem.goods?dataItem.goods.goods_sales : dataItem.goods_sales || 0 }}</view>
							</view>
						</view>
					</view>
				</view>
		
			</checkbox-group>
			
			<!-- 底部操作栏 -->
			<view class="fot-operation dis-flex flex-y-center flex-x-between" v-if="ifManage">
				<checkbox-group class=" checked-all f-28 col-3" @change="chooseAll">
						<label class="check-wrap default-check dis-flex flex-y-center"><checkbox :checked="isAll"/>全选</label>
				</checkbox-group>
				<view class="fot-opera-r dis-flex flex-y-center flex-box p-l-20">
					<view class="checked-num col-6 f-24 flex-box">
						<template v-if="checkList.length>0">已选<text>{{checkList.length}}</text>件商品
						</template>
					</view>
					<button class="fot-del f-24 col-6 p-l-10 p-r-10" @tap.stop="delData"><text class="iconfont2 icon-shanchu"></text>删除</button>
					<button class="fot-del f-24 col-6 p-l-10 p-r-10" @tap.stop="copyData"><text class="iconfont2 icon-copy1"></text>复制</button>
					<button class="fot-share f-24 col-6 p-l-10 p-r-10" hover-class="none" @tap.stop="toUpData"><text class="iconfont2 icon-synchro"></text>同步</button>
				</view>
			</view>
			<!-- 同步 -->
			<updata ref="updata"></updata>
			
	</view>
</template>

<script>
	const app = getApp().globalData;
	import updata from '@/components/updata/updata';
	export default {
		components: {
			updata
		},
		props: {
			listClass: {
				type: String,
				default: ''
			},
			// 数据列表
			list: {
				type: Array,
				default() {
					return []
				}
			},
			ifManage: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				listData: this.list || [],
				checkList: '',//选中的数据
				isAll: false,
				wxapp: {},//买家信息
			}
		},
		watch: {
		  list: function observer(newVal,oldVal) {
				if (newVal) {
					this.listData = newVal;
				}else{
					this.listData = oldVal;
				}
		  }
		},
		methods: {
			//会员信息
			getWxappData(callback) {
				app._get('user.index/vipDetail', {}, (res) => {
					if (res.code == '1') {
						let wxapp = res.data.userInfo || {}
						typeof callback === 'function' && callback(wxapp);
					}
				})
			},
			//同步商品
			toUpData(){
				if(this.checkList.length){
					// this.getWxappData((wxapp) => {
					// 	if(wxapp.vip>1){
					// 		let wxapp_id = this.listData[0].wxapp_id
					// 		this.$refs.updata.allUpdata(wxapp_id,this.checkList);
					// 	}else{
					// 		this.$api.msg('至少开通明虾权限才能渠道商品哦')
					// 	}
					// })
					let wxapp_id = this.listData[0].wxapp_id
					this.$refs.updata.allUpdata(wxapp_id,this.checkList);
				}else{
					this.$api.msg('你还没有选择哦');
				}
			},
			//复制商品
			copyData(){
				if(this.checkList.length){
					let wxapp_id = this.listData[0].wxapp_id
					this.$refs.updata.allCopy(wxapp_id,this.checkList);
				}else{
					this.$api.msg('你还没有选择哦');
				}
			},
			// 删除取消收藏
			delData(){
				let that = this;
				let type = 1;
				uni.showModal({
					title: '提示',
					content: '确认取消收藏？',
					success(res) {
						if(res.confirm){
							that.$emit('delete',that.checkList,type);
							that.checkList = '';
						}
					}
				})
			},
			// 选中
			choose(e) {
				let that = this;
				var items = this.listData,
						values = e.detail.value;
						
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i];
					if(values.includes(item.wxapp_goods_id.toString())){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
				//  是否全部勾选，判断全选与否状态
				var checkList = [];
				this.listData.forEach(item => item.checked == true? checkList.push(item.wxapp_goods_id): '');
				let allChecks = checkList.length == this.listData.length;
				this.isAll = allChecks ? true:false;
				this.checkList = checkList;
				this.$emit('click', this.checkList);
			},
			// 全选
			chooseAll(e){
				if (e.detail.value.length == 0) {
						this.listData.map(item => this.$set(item, 'checked', false))
						this.isAll= false;
				} else {
						this.listData.map(item => this.$set(item, 'checked', true))
						this.isAll= true;
				}
				var checkList = []
				this.listData.forEach(item => item.checked == true? checkList.push(item.wxapp_goods_id): '');
				this.checkList = checkList;
				this.$emit('click', this.checkList);
			},
			// 去详情
			toDetail(id){
				uni.navigateTo({
					url: '/pages/goods/index?goods_id='+id,
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "product-water.scss";
</style>