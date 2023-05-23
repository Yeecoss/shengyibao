<template>
	<!-- 运动模板 -->
	<view class="minishop-list" :class="type=='marketing'?'list-marketing':''">
			<view class="mbg"></view>
			<checkbox-group class="goods-list" @change.stop="choose">
				<view class="goods-list-wrap">
					<view class="goods-item" v-for="(dataItem, index) in listData" :key="dataItem.article_id" @tap.stop="toDetail(dataItem.article_id)">
						<!-- 内容 -->
						<view class="detail dis-flex flex-y-end flex-x-between">
							<view class="detail-left flex-box oh dis-flex flex-y-center">
								<view class="user-img"><image :src="dataItem.wxapp.logo" mode="aspectFill"></image></view>
								<view class="user-info m-l-20 flex-box">
									<view class="f-30 col-2a flex-box onelist-hidden">{{dataItem.wxapp.wxapp_name}}</view>
									<view class="f-24 theme4_gray m-t-10">{{dataItem.create_time.split(' ')[0]}}</view>
								</view>
							</view>
							<view class="f-24 theme4_gray read-num oh"><text class="iconfont2 icon-eye f-24"></text>{{dataItem.show_views}}</view>
						</view>
						<!-- 商品图片 -->
						<view class="goods-item_pic check-wrap">
							<image :src="dataItem.image.file_path" mode="aspectFill"></image>
							<checkbox @tap.stop v-show="ifManage" class="checkbox" :value="dataItem.article_id+''" :checked="dataItem.checked" />
							<!-- 商品名称 -->
							<view class="goods-name col-f f-30">
								<text class="twolist-hidden">{{ dataItem.article_title }}</text>
							</view>
							<!-- 关联 -->
							<template v-if="type=='wantbuy'">
								<view class="has-num f-24" v-if="dataItem.goods_relation_count>0">
									<text>内容含{{dataItem.goods_relation_count}}个商品</text>
								</view>
							</template>
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
					<!-- <button class="fot-share f-24 col-6" hover-class="none"><text class="iconfont2 icon-synchro"></text>同步</button> -->
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
				default:()=> {
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
				listData: this.list,
				checkList: [],//选中的数据
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
		  }
		},
		methods: {
			// 删除取消收藏
			delData(){
				let that = this;
				let type = 3;
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
	@import "indexSport";
</style>