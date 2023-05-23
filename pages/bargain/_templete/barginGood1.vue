<template>
	<view :class="homeStyle+'-main_goods'">
		<view class="main_goods" :class="'main_goods'+currentTab" v-for="(item, index) in activeList" :key="index" @tap.stop="onTargetActive(item.active_id)">
		  <!-- 商品图片 -->
			<view class="main_goods_image">
				<image :src="item.wxappgoods.goods.goods_image||defaultImg" mode="aspectFill"></image>
			</view>
							
			<template v-if="homeStyle=='sportshop'">
				<view class="main_goods_right">
					<!-- 商品信息 -->
					<view class="main_goods_desc">
						<view class="desc_footer dis-flex flex-y-center">
							<text class="price_x col-theme">¥{{ item.floor_price }}</text>
							<text class="price_y cl-9">¥{{ item.wxappgoods.goods.goods_sku.goods_price }}</text>
						</view>
						<!-- 砍价进度 -->
						<view class="task-rate" v-if="currentTab==1">
							<block v-if="item.status">
								<block v-if="!item.is_floor">
									<text>已砍</text>
									<text class="col-theme">{{ item.cut_money }}元，</text>
									<text></text>
									<text>只差</text>
									<text class="col-theme">{{ item.surplus_money }}元</text>
									<text></text>
								</block>
								<block v-if="item.is_floor">
									<text>已砍至最低</text>
									<text class="col-theme">{{ item.floor_price }}元</text>
									<text></text>
								</block>
							</block>
						</view>
					</view>
					<!-- 商品标题 -->
					<view class="main_goods_title_box">
						<view>
							<text class="main_goods_title twolist-hidden">{{ item.wxappgoods.goods.goods_name }}</text>
						</view>
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="optbox-wrap" :class="item.status?'':'disabled'">
					<!-- 参与的用户头像 -->
					<view v-if="item.helps_count > 0 &&currentTab==0" class="peoples dis-flex">
						<view class="user-list dis-flex">
							<view v-for="(help, index2) in item.helps" :key="index2" class="user-item-avatar">
								<image lazy-load :src="help.avatarUrl"></image>
							</view>
						</view>
						<view class="people__text">
							<text>{{ item.helps_count }}人正在砍价</text>
						</view>
					</view>
					<!-- 任务状态 -->
					<view class="task-status dis-flex flex-y-center" v-if="currentTab==1">
						<!-- 倒计时 -->
						<view v-if="item.status" class="count-down dis-flex flex-y-center">
							<view class="clock-text">
								<text>剩余</text>
							</view>
							<view class="clock">
									<tui-countdown :time="countDownList0[index]" color="#fff" :width="28" :height="28" backgroundColor="#000" borderColor="#000" :size="24" colonColor="#fff" :colonSize="28" :scale="true"></tui-countdown>
							</view>
						</view>
						<view v-if="!item.status" class="task-status__text">
							<text class="col-theme f-28">{{ item.is_buy ? '砍价成功' : '已结束' }}</text>
						</view>
					</view>
					<template v-if="currentTab==1">
						<view class="settlement" v-if="item.status" @tap.stop="onTargetTask(item.task_id)">继续砍价</view>
						<view class="settlement disabled" v-else>已结束</view>
					</template>
					<template v-else>
						<view class="settlement" @tap.stop="openDialog(item)">立即参加</view>
					</template>
				</view>
			</template>
			<template v-else>
				<view class="main_goods_right">
					<!-- 商品标题 -->
					<view class="main_goods_title_box">
						<view>
							<text class="main_goods_title twolist-hidden">{{ item.wxappgoods.goods.goods_name }}</text>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="main_goods_desc">
						<view class="desc_footer dis-flex flex-y-center">
							<text class="price_x col-theme">¥{{ item.floor_price }}</text>
							<text class="price_y cl-9">¥{{ item.wxappgoods.goods.goods_sku.goods_price }}</text>
						</view>
						<!-- 砍价进度 -->
						<view class="task-rate" v-if="currentTab==1">
							<block v-if="item.status">
								<block v-if="!item.is_floor">
									<text>已砍</text>
									<text class="col-theme">{{ item.cut_money }}元，</text>
									<text></text>
									<text>只差</text>
									<text class="col-theme">{{ item.surplus_money }}元</text>
									<text></text>
								</block>
								<block v-if="item.is_floor">
									<text>已砍至最低</text>
									<text class="col-theme">{{ item.floor_price }}元</text>
									<text></text>
								</block>
							</block>
						</view>
					</view>
					<!-- 操作按钮 -->
					<view class="optbox-wrap">
						<!-- 参与的用户头像 -->
						<view v-if="item.helps_count > 0 &&currentTab==0" class="peoples dis-flex">
							<view class="user-list dis-flex">
								<view v-for="(help, index2) in item.helps" :key="index2" class="user-item-avatar">
									<image lazy-load :src="help.avatarUrl"></image>
								</view>
							</view>
							<view class="people__text">
								<text>{{ item.helps_count }}人正在砍价</text>
							</view>
						</view>
						<!-- 任务状态 -->
						<view class="task-status dis-flex flex-y-center" v-if="currentTab==1">
							<!-- 倒计时 -->
							<view v-if="item.status" class="count-down dis-flex flex-y-center">
								<view class="clock-text">
									<!-- <text class="iconfont2 icon-shijian col-theme"></text> -->
									<text>剩余</text>
								</view>
								<view class="clock" v-if="homeStyle=='saler'">
										<tui-countdown :time="countDownList0[index]" color="#2A2A30" :height="46" borderColor="#fff" :size="28" colonColor="#333" :colonSize="28" :scale="true"></tui-countdown>
								</view>
								<view class="clock" v-else>
										<tui-countdown :time="countDownList0[index]" color="#fff" :width="28" :height="28" backgroundColor="#333" borderColor="#333" :size="24" colonColor="#333" :colonSize="28" :scale="true"></tui-countdown>
								</view>
							</view>
							<view v-if="!item.status" class="task-status__text">
								<text class="col-theme f-28">{{ item.is_buy ? '砍价成功' : '已结束' }}</text>
							</view>
						</view>
						<template v-if="currentTab==1">
							<view class="settlement" v-if="item.status" @tap.stop="onTargetTask(item.task_id)">继续砍价</view>
							<view class="settlement disabled" v-else>已结束</view>
						</template>
						<template v-else>
							<view class="settlement" @tap.stop="openDialog(item)">立即参加</view>
						</template>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	const App = getApp().globalData;
	export default{
		components: {
		},
		props:{
			currentTab: [String,Number],
			barginList: {
				type: Array,
				default:()=> {
					return []
				}
			},
			// 倒计时列表
			countDownList: {
				type: Array,
				default:()=> {
					return []
				}
			},
			homeStyle: {
				type: String,
				default: 'div'
			}
		},
		data() {
			return {
				defaultImg:'/static/images/defaultImg.png',
				activeList: this.barginList,
				countDownList0: this.countDownList,
				checkList: [],//选中的数据
				isAll: false,
			}
		},
		watch: {
		  barginList: function observer(newVal,oldVal) {
				if (newVal) {
					this.activeList = newVal;
				}else{
					this.activeList = oldVal;
				}
		  },
		  countDownList: function observer(newVal,oldVal) {
			  console.log(newVal);
				if (newVal) {
					this.countDownList0 = newVal;
				}else{
					this.countDownList0 = oldVal;
				}
		  },
		},
		methods:{
			openDialog(item){
				this.$emit('openDialog', item)
			},
			onTargetTask(task_id){
				this.$emit('onTargetTask', task_id)
			},
			onTargetActive(active_id){
				uni.navigateTo({
				  url: `../goods/index?active_id=${active_id}`
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'barginGood1';
</style>
