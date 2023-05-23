<template>
	<view :class="homeStyle+'-main_goods'" v-if="activeList.length>0">
		<view class="main_goods dis-flex flex-x-between" v-for="(item, index) in activeList" :key="index" @tap.stop="onTargetActive(item.sharp_goods_id)">
			<!-- 商品图片 -->
			<view class="main_goods_left oh">
				<image :src="item.goods_image||defaultImg" mode="aspectFill"></image>
				<view v-if="item.progress >= 100" class="loot-all t-c">已抢完</view>
			</view>
			<view class="main_goods_right flex-box oh m-l-20">
				<!-- 商品标题 -->
				<view class="main_goods_title_box">
					<view>
						<text class="main_goods_title twolist-hidden">{{ item.goods_name }}</text>
					</view>
				</view>
				<!-- 秒杀进度条 -->
				<template v-if="homeStyle!='saler'&&homeStyle!='minishop'">
					<view v-if="status == stateEnum" :class="'sharp-progress dis-flex flex-y-center flex-x-between ' + (status != stateEnum?'nosharp-progress':'')">
						<view class="yoo-progress" v-if="(item.progress>0)">
							<view class="yoo-progress--portion" :style="'width: ' + item.progress + '%;'"></view>
							<!-- <text class="yoo-progress--text">{{ item.progress }}%</text> -->
						</view>
						<view class="sharp-sales" v-if="status == stateEnum && (item.progress>0)">已抢{{ item.progress }}%</view>
						<view class="sharp-sales" v-if="status != stateEnum">即将开抢</view>
					</view>
				</template>
				<!-- 商品信息 -->
				<view class="desc_footer" v-else>
					<template v-if="item.goods_sku">
						<text class="price_x app-red f-28">¥{{ item.goods_sku.seckill_price }}</text>
						<text class="price_y cl-9 f-24">¥{{ item.goods_sku.original_price }}</text>
					</template>
				</view>
				<view class="main_goods_desc dis-flex flex-x-end flex-y-center m-t-40">
					<!-- 秒杀进度条 -->
					<template v-if="homeStyle=='saler'||homeStyle=='minishop'">
						<view v-if="status == stateEnum" class="sharp-progress flex-box dis-flex flex-y-center" :class="status != stateEnum?'nosharp-progress':''">
							<template v-if="(item.progress>0)">
								<view class="yoo-progress" v-if="homeStyle=='minishop'">
									<view class="yoo-progress--portion" :style="'width: ' + item.progress + '%;'"></view>
								</view>
								<tui-circular-progress v-else :fontShow="false" progressColor="#FF7541" defaultColor="rgba(130, 131, 147, .2)" :diam="15" :lineWidth="2" :percentage="item.progress"></tui-circular-progress>
							</template>
							<view class="sharp-sales m-l-20" v-if="status == stateEnum && (item.progress>0)">已抢{{ item.progress }}%</view>
							<view class="sharp-sales m-l-20" v-if="status != stateEnum">即将开抢</view>
						</view>
					</template>
					<!-- 商品信息 -->
					<view class="desc_footer flex-box oh" v-else>
						<template v-if="item.goods_sku">
							<text class="price_x app-red f-28">¥{{ item.goods_sku.seckill_price }}</text>
							<text class="price_y cl-9 f-24">¥{{ item.goods_sku.original_price }}</text>
						</template>
					</view>
					<!-- 操作按钮 -->
					<view class="optbox-wrap oh">
						<button class="qiang-btn" v-if="item.progress >= 100" disabled><template v-if="homeStyle=='saler'">立即</template>抢</button>
						<button class="qiang-btn" v-else-if="status == stateEnum" @tap.stop="onToggleTrade(item)"><template v-if="homeStyle=='saler'">立即</template>抢</button><!-- openDialog -->
						<template v-else>
							<button class="settlement" v-if="homeStyle!='sportshop'">查看商品</button>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			sharpList: {
				type: Array,
				default:()=> {
					return []
				}
			},
			status: {
				type: Number,
			},
			stateEnum: {
				type: Number,
			},
			homeStyle: {
				type: String,
				default: 'div'
			}
		},
		data(){
			return{
				defaultImg:'/static/images/defaultImg.png',
				activeList: this.sharpList,
			}
		},
		watch: {
		  sharpList: function observer(newVal,oldVal) {
				if (newVal) {
					this.activeList = newVal;
				}else{
					this.activeList = oldVal;
				}
		  },
		},
		methods:{
			onTargetActive(sharp_goods_id){
				this.$emit('onTargetActive',sharp_goods_id)
			},
			onToggleTrade(item){
				this.$emit('onToggleTrade',item)
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
