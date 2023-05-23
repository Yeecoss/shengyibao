<template>
<view class="container">
  <!-- 自定义标题栏 -->
  <navigationBar id="top" :title="'评价(' + num + ')'" extClass="nav"></navigationBar>
  <div class="goodsDetail">
    <div class="goodsContent dis-flex flex-y-center">
      <div class="pad-r">
        <div class="imgBox" @tap.stop="goDetail">
          <image class="imageDefault" mode="aspectFill" :src="goods_image"></image>
        </div>
      </div>
      <div class="goodsInfo">
        <div class="goods_name">
          <div class="fourlist-hidden">{{goods_name}}</div>
        </div>
        <div class="dis-flex flex-y-center stateBox">
          <div class="f-28 col-3 m-r-60">
            ￥{{goods_min_price}}
          </div>
          <div class="f-24 col-9">
            销量:{{goods_sales}}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isUnit">
    <comment ref="comment" type="myGoods" :goods_id="goods_id" @uptotal="uptotal" :otherHeight="otherHeight"></comment>
  </div>
  <!--底部抽屉-->
  <tui-bottom-popup :show="showAdd" :radius="false" @close="hideModal">
    <div class="popupTitle">
      添加评论
      <div class="close" @tap.stop="hideModal">
        <text class="iconfont2 icon-shanchu1"></text>
      </div>
    </div>
    <view class="popupContent">
      <view class="container p-bottom">
        <view class="goods-list">
          <view class="goods-item">
            <!-- 选择评价 -->
            <view class="score-row dis-flex">
              <view class="title">描述相符</view>
              <view @tap="setScore(10)" :class="'score-item score__praise dis-flex flex-y-center flex-x-center ' + (formData.score==10?'__active':'')">
                <view class="score">
                  <text class="score__icon iconfont2 icon-Favorablecomments"></text>
                  <text class="score__text">好评</text>
                </view>
              </view>
              <view @tap="setScore(20)" :class="'score-item score__review dis-flex flex-y-center flex-x-center ' + (formData.score==20?'__active':'')">
                <view class="score">
                  <text class="score__icon iconfont2 icon-Mediumevaluation"></text>
                  <text class="score__text">中评</text>
                </view>
              </view>
              <view @tap="setScore(30)" :class="'score-item score__negative dis-flex flex-y-center flex-x-center ' + (formData.score==30?'__active':'')">
                <view class="score">
                  <text class="score__icon iconfont2 icon-negativecomment"></text>
                  <text class="score__text">差评</text>
                </view>
              </view>
            </view>
            <!-- 评价内容 -->
            <view class="dis-flex content-row">
              <textarea class="f-28" v-model="formData.content" maxlength="2000" placeholder="请输入评论内容" placeholderStyle="color:#999;font-style:28rpx"></textarea>
            </view>
            <!-- 图片列表 -->
            <view class="image-list">
              <view class="image-preview" v-for="(imagePath, imageIndex) in formData.image_list" :key="imageIndex">
                <text class="image-delete iconfont2 icon-cross-mini" @tap.stop="deleteImage(imageIndex)"></text>
                <image lazy-load mode="aspectFill" :src="imagePath"></image>
              </view>
              <view @tap.stop="chooseImage" class="image-picker dis-flex flex-dir-column flex-x-center flex-y-center" v-if="!formData.image_list || formData.image_list.length < 6">
                <text class="choose__icon iconfont2 icon-jiahao"></text>
                <text class="choose__text">图片</text>
              </view>
            </view>
          </view>
        </view>
        <div class="flow-fixed-footersBox dis-flex flex-y-center flex-x-center">
          <div class="flow-fixed-footers" @tap.stop="uploadFile">
            <text class="iconfont2 icon-upload"></text>
            添加评论
          </div>
        </div>

      </view>
    </view>
  </tui-bottom-popup>
  <div class="flow-fixed-footersBox dis-flex flex-y-center flex-x-center">
    <div class="flow-fixed-footers" @tap.stop="add">
      <text class="iconfont2 icon-upload"></text>
      添加评论
    </div>
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
      goods_image: '',
      goods_name: '',
      goods_min_price: '',
      goods_sales: '',
      total_num: 1,
      goods_attr: '',
      goods_id: '',
      submitDisable: false,
      isUnit: false,
      formData: {
        image_list: [],
        score: '10',
        content: '',
        uploaded: [],
      },
      showAdd: false
    };
  },

  components: {
    comment
  },
  onLoad: function (options) {
      this.goods_id = options.goods_id || ''
      this.goods_name = options.goods_name || ''
      this.goods_image = options.goods_image || ''
      this.goods_min_price = options.goods_min_price || ''
      this.goods_sales = options.goods_sales || ''
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
          // 计算rpx
          tapHeight = Math.floor(rpx * 410) + 1,
          // tap高度
        otherHeight = res[0].height + tapHeight; // swiper高度

        this.otherHeight = otherHeight
        this.isUnit = true
      });
    },
    hideModal() {
      this.showAdd = false
    },
    add() {
      this.formData = {
        image_list: [],
        score: '10',
        content: '',
        uploaded: [],
      }
      this.showAdd = true
    },
    uptotal(val) {
      this.num = val
    },
    goDetail() {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + this.goods_id
      });
    },
    /**
     * 选择图片
     */
    chooseImage () {
      let imageList = this.formData.image_list; // 选择图片
      wx.chooseImage({
        count: 6 - imageList.length,
        // #ifdef H5 || MP
        sizeType: ['compressed', 'original'],
        // #endif
        // #ifdef APP-PLUS
        sizeType: ['compressed', 'original'],
        // #endif
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          let list = []
          res.tempFilePaths.forEach((item,index) => {
            // #ifdef H5 || MP
            if (res.tempFiles[index].size <= 2048000) {
            // #endif
            list.push(item)
            // #ifdef H5 || MP
            } else {
              App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
            }
            // #endif
          })
          this.formData.image_list = imageList.concat(list)
          let uploaded = []
          this.formData.image_list.forEach(element => {
            uploaded.push('')
          });
          this.formData.uploaded = uploaded
        }
      });
    },
    deleteImage(imageIndex) {
			this.formData.image_list.splice(imageIndex, 1);
    },
    setScore(num) {
      this.formData.score = num
    },
    uploadFile () {
      // 文件上传
      let i = 0;
      
      if (this.formData.content != '') {
        if (this.formData.image_list.length > 0) {
          uni.showLoading({
            title: '正在处理图片...',
            mask: true
          });
          this.formData.image_list.forEach((filePath, fileKey) => {
            App.uploadFile({
              filePath: filePath,
              success: (res) => {
                if (res.code === 1) {
                  this.formData.uploaded[fileKey] = res.data.wxapp_file_id;
                }
              },
              complete: () => {
                i++;
                if (this.formData.uploaded.length === i) {
                  // 所有文件上传完成
                  // console.log('upload complete'); // 执行回调函数
                  this.submit()
                }
              }
            });
          });
        } else {
          this.submit()
        }
      } else {
        this.$api.msg("请输入评论内容")
      }
    },
    submit() {
      // if (this.submitDisable) {
      //   return
      // }
      uni.showLoading({
        title: '正在提交数据...',
        mask: true
      });
      this.submitDisable = true;
      let uploaded = []
      this.formData.uploaded.forEach(item => {
        if (item && item != '') {
          uploaded.push(item)
        }
      })
      App._post_json_form('shop.comment/order', {
					wxapp_goods_id: this.goods_id,
					score: this.formData.score,
					content: this.formData.content,
					image: uploaded
        }, (result) => {
          if (result.code === 1) {
            App.showSuccess(result.msg, () => {
              this.showAdd = false
              this.$refs.comment.getCommentList()
            });
          } else {
            App.showError(result.msg);
            this.submitDisable = false;
          }
        }, () => {
          this.submitDisable = false;
        }, () => {
          uni.hideLoading();
        });
    }
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