<template>
<view v-if="comment_data.length">
  <view class="goods-comment" @tap="onTargetToComment" v-if="comment_data.length">
    <view class="cont-box b-f goods-property-box">
      <text class="col-0 f-30">商品评论 ({{ comment_data_count }}条)</text>
    </view>
    <view class="goods-comment-box b-f" v-for="(item, index) in comment_data" :key="index">
      <view class="b-f dis-flex">
        <view class="img-box">
          <image class="imageDefault" lazy-load :src="item.user && item.user.avatarUrl ? item.user.avatarUrl : ''"></image>
        </view>
        <view style="width: 100%;" class="b-b line">
          <view class="dis-flex titleBox">
            <view class="user">
              <text class="user_name f-24">{{ item.user && item.user.nickName ? item.user.nickName : '' }}</text>
            </view>
            <view class="com_xing">
              <text class="iconfont icon-shoucang active"></text>
              <block v-if="item.score < 30">
                <text class="iconfont icon-shoucang active"></text>
                <text class="iconfont icon-shoucang active"></text>
              </block>
              <block v-if="item.score < 20">
                <text class="iconfont icon-shoucang active"></text>
                <text class="iconfont icon-shoucang active"></text>
              </block>
            </view>
            <view class="f-24 col-9 m-top10 time">{{ item.create_newtime }}</view>
          </view>
          <view class="goods-comment-cont m-top20">
            <text class="f-26 twolist-hidden">{{ item.content }}</text>
          </view>
          <!-- 评价图片 -->
          <view class="comment-images row" v-if="item.image.length">
            <view class="image-preview" v-for="(image, imgIndex) in item.image" :key="imgIndex">
              <image lazy-load :data-comment-index="index" :data-img-index="imgIndex" mode="aspectFill" :src="image.file_path"></image>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="comment-num f-24 theme4_gray">查看全部评论</view>
  </view>
  <view v-else class="nogoods-comment dis-flex flex-x-between">
    <text class="col-0 f-30">商品评论</text>
    <text class="theme4_gray f-24">暂无评论</text>
  </view>
	<view class="gray-bg20"></view>
</view>
</template>

<script>

export default {
	name: 'detail-swiper',
	data() {
		return {
		}
	},
	props: {
    comment_data_count: {
      type: [Number, String],
      default: 0
    },
    goods_id: {
      type: [Number, String],
      default: ''
    },
		comment_data: {
			type: Array,
			default: () => {
				return []
			}
    },
	},
	methods:{
    /**
     * 跳转到评论
     */
    onTargetToComment() {
      uni.navigateTo({
        url: '/pages/goods/comment/comment?goods_id=' + this.goods_id
      });
    },
  }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>