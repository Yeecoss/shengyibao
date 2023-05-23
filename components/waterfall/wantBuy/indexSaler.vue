<template>
	<!-- 卖手圈模板 -->
	<view class="minishop-list" :class="type=='marketing'?'list-marketing':''">
			<checkbox-group class="goods-list" @change="choose">
				<view class="goods-item bgf" v-for="(dataItem, index) in listData" :key="dataItem.article_id" @tap="toDetail(dataItem.article_id)">
					<!-- 商品图片 -->
					<view class="top dis-flex flex-y-center">
						<view class="default-check check-wrap">
							<checkbox @tap.stop v-show="ifManage" class="checkbox" :value="dataItem.article_id+''" :checked="dataItem.checked" />
						</view>
						<view class="goods-item_pic">
							<image lazy-load :src="dataItem.image ? dataItem.image.file_path : ''" mode="aspectFill"></image>
						</view>
					
						<view class="detail">
							<!-- 商品名称 -->
							<view class="goods-name onelist-hidden col-3 f-28">
								<text>{{ dataItem.article_title }}</text>
							</view>
							<view class="goods-decr twolist-hidden col-6 f-24">
								<text>{{ dataItem.summary }}</text>
							</view>
							<view class="dis-flex flex-y-center flex-x-between">
								<view class="user-info dis-flex flex-y-center">
									<view class="user-img"><image :src="dataItem.wxapp.logo" mode="aspectFill"></image></view>
									<view class="f-24 col-6 flex-box onelist-hidden">{{dataItem.wxapp.wxapp_name}}</view>
								</view>
								<view class="has-num f-24" v-if="dataItem.goods_relation_count>0"><text class="iconfont2 icon-commodity f-22"></text>内容含{{dataItem.goods_relation_count}}个商品</view>
							</view>
						</view>
					</view>
					<view class="bottom dis-flex flex-y-center flex-x-between">
						<view class="f-24 col-9">{{dataItem.create_time.split(' ')[0]}}</view>
						<view class="f-24 col-9 read-num">
							<text class="iconfont2 icon-eye f-24"></text>{{dataItem.show_views}}
						</view>
					</view>
				
				</view>
			</checkbox-group>
			
			<!-- 底部操作栏 -->
			<view class="fot-operation dis-flex flex-y-center flex-x-between" v-if="ifManage">
				<checkbox-group class=" checked-all f-28 col-3" @change="chooseAll">
						<label class="check-wrap default-check dis-flex flex-y-center"><checkbox :checked="isAll"/>全选</label>
				</checkbox-group>
				<view class="fot-opera-r dis-flex flex-y-center">
					<view class="checked-num col-6 f-24" v-show="checkList.length>0">
						已选<text>{{checkList.length}}</text>件商品
					</view>
					<view class="fot-del f-24 col-6" @tap.stop="delData"><text class="iconfont2 icon-shanchu"></text>删除</view>
					<!-- <view class="fot-share f-24 col-6 m-l-20"><text class="iconfont2 icon-copy1"></text>复制</view>
					<view class="fot-share f-24 col-6 m-l-20"><text class="iconfont2 icon-synchro"></text>同步</view> -->
					<!-- <button open-type="share" class="fot-share f-24 col-6" hover-class="none"><text class="iconfont2 icon-synchro"></text>同步</button> -->
				</view>
			</view>
			
	</view>
</template>

<script>
	export default {
		props: {
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
			type: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				listData: [],
				checkList: '',//选中的数据
				isAll: false,
			}
		},
		watch: {
		  list: function observer(newVal,oldVal) {
				if (newVal) {
					this.listData = newVal;
				}else{
					this.listData = oldVal;
				}
		  },
			
		},
		methods: {
			// 删除取消收藏
			delData(){
				let that = this;
				let type = 4;
				uni.showModal({
					title: '提示',
					content: '确认取消收藏？',
					success(res) {
						if(res.confirm){
							that.$emit('delete',that.checkList,type);
						}
					}
				});
			},
			// 选中
			choose(e) {
				let that = this;
				var items = this.listData,
						values = e.detail.value;
						
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i];
					if(values.includes(item.article_id.toString())){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
				//  是否全部勾选，判断全选与否状态
				var checkList = [];
				this.listData.forEach(item => item.checked == true? checkList.push(item.article_id): '');
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
				this.listData.forEach(item => item.checked == true? checkList.push(item.article_id): '');
				this.checkList = checkList;
				this.$emit('click', this.checkList);
			},
			// 去详情
			toDetail(id){
				uni.navigateTo({
					url: '/pages/optimization/extend/detail/detail?article_id='+id + '&type=' + this.type,
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "indexSaler";
</style>