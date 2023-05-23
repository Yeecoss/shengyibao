<template>
<!-- banner轮播 -->
<view class="diy-banner" :class="styleClass">
  <swiper :autoplay="autoplay" :class="'banner-box swiper-box dot-' + itemStyle.btnShape" :duration="duration" circular="true" :indicator-dots="indicatorDots" :interval="interval" :indicator-color="itemStyle.btnColor" indicator-active-color="#000" @change="bindChangeFun" :data-item-key="itemIndex" style="height: 300rpx">
    <swiper-item class="swiper-item" :for-item="banner" v-for="(banner, index) in dataList" :key="index">
      <image lazy-load mode="aspectFill" @tap.stop="navigationTo(banner)" class="slide-image" @load="imagesHeightFun" :src="banner.imgUrl" :data-id="index" :data-item-key="itemIndex"></image>
    </swiper-item>
  </swiper>
  <view class="dots">
    <view class="dots-item" :class="imgCurrent == index ? 'on' : ''" v-for="(item, index) in dataList" :key="index" :style="'background: ' + ( imgCurrent == index ? itemStyle.btnColor : '') + ';'">
    </view>
  </view>
  <!-- 顶部置灰 -->
  <!-- <view class="linear"></view>  -->
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      // banner轮播组件属性
      indicatorDots: false,
      // 是否显示面板指示点	
      autoplay: true,
      // 是否自动切换
      duration: 800,
      // 滑动动画时长
      imgHeights: [],
      // 图片的高度
      imgCurrent: 0 // 当前banne所在滑块指针

    };
  },
  computed: {
    interval() {
      let interval = 2000
      if (this.params.interval) {
        interval = parseInt(this.params.interval) * 1000
      }
      return interval
    }
  },
  components: {},
  props: {
    itemIndex: String,
    itemStyle: Object,
    dataList: [Object, Array],
    params: Object,
		styleClass: String
  },
  options: {},
  methods: {
    /**
     * 计算图片高度
     */
    imagesHeightFun: function (e) {
      // 获取图片真实宽度
      let imgwidth = e.detail.width,
          imgheight = e.detail.height,
          // 宽高比
      ratio = imgwidth / imgheight; // 计算的高度值

      let viewHeight = 750 / ratio,
          imgHeights = this.imgHeights; // 把每一张图片的高度记录到数组里

      imgHeights.push(viewHeight);
      this.setData({
        imgHeights
      });
    },

    /**
     * 记录当前指针
     */
    bindChangeFun: function (e) {
      this.setData({
        imgCurrent: e.detail.current
      });
    },

    /**
     * 跳转到指定页面
     */
    navigationTo(item) {
		if(item.linkUrlType==3){
        // #ifdef MP
		uni.navigateTo({
			url: '/pages/user/otherPage/index?url=' + item.linkUrl
        });
		// #endif
		} else if (item.linkUrlType==1) {
			if (item.goods_id) {
			  uni.navigateTo({
				url: '/pages/goods/index?goods_id=' + item.goods_id
			  });
			} else {
				App.navigationTo(item.linkUrl);
			}
		} else{
			App.navigationTo(item.linkUrl);
		}
    }
  }
};
</script>
<style lang="scss">
	@import "banner";
</style>