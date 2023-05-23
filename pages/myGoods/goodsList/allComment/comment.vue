<template>
<view class="container">
  <!-- 自定义标题栏 -->
  <navigationBar id="top" :title="'评价(' + num + ')'" extClass="nav"></navigationBar>
  <div v-if="isUnit">
    <comment ref="comment" type="myGoods" goods_id="all" @uptotal="uptotal" :otherHeight="otherHeight"></comment>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;
import comment from "@/components/goods/comment/comment.vue"
export default {
  data() {
    return {
      tapHeight: 0,
      otherHeight: 0,
      num: 0,
      isUnit: false
    };
  },

  components: {
    comment
  },
  onLoad: function (options) {
  },
  mounted() {
    this.$nextTick(() => {
      this.setSwiperHeight()
    })
  },
  methods: {
    /**
     * 设置swiper的高度
     */
    setSwiperHeight: function () {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        // 获取系统信息(拿到屏幕宽度)
        let systemInfo = wx.getSystemInfoSync(),
          rpx = systemInfo.windowWidth / 750,
          // tap高度
        otherHeight = res[0].height; // swiper高度

        this.otherHeight = otherHeight
        this.isUnit = true
      });
    },
    uptotal(val) {
      this.num = val
    },
  }
};
</script>
<style lang="scss">
.container{
  position: relative;
  .goodsDetail{
    height: 196rpx;
    width: 690rpx;
    margin: 0 auto;
    background: #F8F8F8;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    padding: 0 20rpx;
    position: relative;
    .pad-r{
        padding-right: 20rpx;
    }
    .m-r-60{
      margin-right: 120rpx;
    }
    .goodsContent{
        height: 204rpx;
        padding-right: 46rpx;
        .imgBox{
            width: 144rpx;
            height: 144rpx;
            overflow: hidden;
            border-radius: 8rpx;
            image{
                width: 100%;
                height: 100%;
            }
        }
        .goodsInfo{
            width: 100%;
            .goods_name{
                width: 100%;
                color: #333;
                font-size: 28rpx;
                font-weight: 600;
                height: 116rpx;
                line-height: 1;
            }
            .goods_price{
                color: #333;
                font-size: 28rpx;
                margin-top: 10rpx;
                font-weight: 600;
            }
            .stateBox{
                color: #666;
                font-size: 24rpx;
                line-height: 1;
                .line{
                    height: 24rpx;
                    width: 1rpx;
                    background: #D8D8D8;
                    margin: 0 16rpx;
                }
            }
        }
    }
  }
  .flow-fixed-footersBox{
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 11;
    text-align: center;
    height: 100rpx;
    line-height: 100rpx;
    border-top: 1rpx solid rgba(222, 222, 222, 1);
    background: white;
    .flow-fixed-footers {
      background: #E82F2F;
      width: 690rpx;
      height: 72rpx;
      line-height: 72rpx;
      background: #FF7541;
      color: white;
      box-shadow: 0px 0px 16rpx wrpx rgba(222, 222, 222, 0.5);
      border-radius: 40rpx;
      .iconfont2{
        margin-right: 10rpx;
      }
    }
  }
  .popupTitle{
    font-size: 30rpx;
    color: #333333;
    line-height: 90rpx;
    height: 90rpx;
    text-align: center;
    position: relative;
    .close{
      width: 90rpx;
      height: 90rpx;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .popupContent{
    .goods-list {
      font-size: 28rpx; 
    }

    .goods-item {
      margin-bottom: 30rpx;
      background: #F2F2F2;
    }
    .goods-item .score-row {
        padding: 0 30rpx;
        background: white;
      }
      .goods-item .title{
        padding: 22rpx 0;
        margin-right: 40rpx;
        font-size: 30rpx;
      }
      .goods-item .score-row .score-item {
        color: #999999;
        font-size: 24rpx;
      }
      .goods-item .score-row .score-item.score__negative {
        color: #9b9b9b; }
        .goods-item .score-row .score-item.score__negative .score__icon {
      }
      .goods-item .score-row .score-item .score {
        padding: 10rpx 20rpx 10rpx 10rpx;
        border-radius: 30rpx;
      }
      .goods-item .score-row .score-item .score .score__icon {
        margin-right: 10rpx;
        padding: 10rpx;
        border-radius: 50%;
        font-size: 30rpx;
      }
      .goods-item .score-row .score-item.__active .score {
        color: #F9B954;
      }
      .goods-item .content-row {
        padding: 20rpx 30rpx;
        background: white;
      }
      .goods-item .content-row textarea {
        width: 100%;
        height: 200rpx;
        padding: 12rpx;
        box-sizing: border-box;
        border-radius: 8rpx;
        border: 1rpx solid #DEDEDE;

      }
      .goods-item .image-list {
        padding: 0 30rpx 24rpx;
        background: white;
      }
      .goods-item .image-list:after {
        clear: both;
        content: " ";
        display: table;
      }
      .goods-item .image-list image {
        display: block;
        width: 144rpx;
        height: 144rpx;
        border-radius: 8rpx;
      }
      .goods-item .image-list .image-picker {
        width: 144rpx;
        height: 144rpx;
        border: 1rpx solid #DEDEDE;
        color: #999;
        border-radius: 8rpx;
      }
      .goods-item .image-list .image-picker .choose__icon {
        font-size: 56rpx;
        margin-bottom: 6rpx;
      }
      .goods-item .image-list .image-picker .choose__text {
        font-size: 22rpx;
      }
      .goods-item .image-list .image-picker, .goods-item .image-list .image-preview {
        margin-right: 30rpx;
        margin-top: 20rpx;
        float: left;
      }
      .goods-item .image-list .image-picker:nth-child(4n+0), .goods-item .image-list .image-preview:nth-child(4n+0) {
        margin-right: 0;
      }
      .goods-item .image-list .image-preview {
        position: relative;
      }
    .goods-item .image-list .image-preview .image-delete {
      position: absolute;
      top: -15rpx;
      right: -15rpx;
      height:32rpx;
      width: 32rpx;
      line-height: 32rpx;
      background: rgba(0, 0, 0, 0.64);
      border-radius: 50%;
      color: #fff;
      font-weight: bolder;
      font-size: 32rpx;
      z-index: 10;
      text-align: center;
    }
  }
}
</style>