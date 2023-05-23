<template>
	<!-- 买单 -->
	<view class="diy-evaluate">
		<div class="heardFix">
			<div class="heardBox">
				<view class="dis-flex flex-x-between flex-y-end evaluateHeard">
					<view class="score">
						<text class="scoreNum">
							4.8
						</text>
						分
						<text class="scorePeople">{{comments.length}}人评价</text>
					</view>
					<view class="scoreLine"></view>
					<view class="scoreList dis-flex flex-y-center flex-x-end">
						<view class="scoreItem">
							<view class="name">
								口味
							</view>
							<view class="scoreNum">
								4.9
							</view>
						</view>
						<view class="scoreItem">
							<view class="name">
								服务
							</view>
							<view class="scoreNum">
								4.8
							</view>
						</view>
						<view class="scoreItem">
							<view class="name">
								性价比
							</view>
							<view class="scoreNum">
								4.7
							</view>
						</view>
						<view class="scoreItem">
							<view class="name">
								环境
							</view>
							<view class="scoreNum">
								4.8
							</view>
						</view>
					</view>
				</view>
				<view class="tabBoxFix" id="tabBoxFix">
					<view class="tabBox dis-flex flex-y-center" :class="scrollTop > tabBoxHeight ? 'tabBoxTop' : ''" :style="{top: heardHeight + 'px'}">
						<view class="tabItem" :class="tabItem == 1 ? 'active' : ''" @tap="check(1)">
							全部
						</view>
						<view class="tabItem" :class="tabItem == 10 ? 'active' : ''" @tap="check(10)">
							好评
						</view>
						<view class="tabItem" :class="tabItem == 20 ? 'active' : ''" @tap="check(20)">
							中评
						</view>
						<view class="tabItem" :class="tabItem == 30 ? 'active' : ''" @tap="check(30)">
							差评
						</view>
					</view>
				</view>
			</div>
		</div>
		<view class="commentBox">
			<view class="comment-list" v-if="comments.length > 0">
				<view class="comment-item" v-for="(item, index) in comments" :key="index" v-if="tabItem == item.score || tabItem == 1">
					<view class="goods-comment-box b-f">
						<view class="row dis-flex flex-y-center flex-x-between">
							<view class="userBox dis-flex flex-y-center">
								<image lazy-load class="user_avatar" mode="aspectFill"
									:src="item.user ? item.user.avatarUrl : ''"></image>
								<!-- 用户信息 -->
								<view class="user">
									<text class="user_name f-28">{{ item.user ? item.user.nickName : '' }}</text>
									<!-- 评价日期-->
									<view class="f-22 col-9">{{ item.create_time }}</view>
								</view>
							</view>
							<view class="comment-score">
								4.8
							</view>
						</view>
						<!-- 评价内容 -->
						<view class="goods-comment-cont row m-top20">
							<text class="f-26 col-6">{{ item.content }}</text>
						</view>
						<!-- 评价图片 -->
						<view class="comment-images row" v-if="item.image.length">
							<view class="image-preview" v-for="(image, imgIndex) in item.image" :key="imgIndex">
								<image lazy-load :data-comment-index="index" :data-img-index="imgIndex"
									@tap.stop="previewImages(item, imgIndex)" mode="aspectFill" :src="image.file_path"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="listBottom col-9 f-24">生意宝技术支持～</view>
			</view>
			<view class="yoshop-notcont" v-else>
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">亲，暂时没有记录哦</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabBoxHeight: 0,
				tabItem: 1,
			};
		},

		components: {},
		props: {
			heardHeight: {
				type: Number,
				default: 0
			},
			scrollTop: {
				type: Number,
				default: 0
			},
			comments: {
				type: Array,
				default: () => {
					return []
				}
			},
		},
		mounted() {
			setTimeout(() => {
				uni.createSelectorQuery().in(this).select("#tabBoxFix").boundingClientRect((data) => {
					console.log(data)
					this.tabBoxHeight = data.top + data.height - 32
					console.log(this.tabBoxHeight);
				}).exec();
			}, 1000)
		},
		methods: {
			check(val) {
				this.tabItem = val
			},
			/**
			 * 图片预览
			 */
			previewImages: function (item, imgIndex) {
				let images = item.image
				let imageUrls = [];
				images.forEach(function (item) {
					imageUrls.push(item.file_path);
				});
				console.log(imageUrls)
				console.log(imgIndex)
				wx.previewImage({
					current: imageUrls[imgIndex],
					urls: imageUrls
				});
			},
		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
