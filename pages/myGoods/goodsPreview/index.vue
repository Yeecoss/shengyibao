<template>
	<view class="container">
    <!-- 自定义标题栏 -->
    <navigationBar title="预览" id="top">
    </navigationBar>
    <div>
      <view class="main_goods">
        <!-- 商品图片 -->
        <view :class="'main_goods_left goods_pic' + (goods.images && goods.images.length<=3?goods.images.length:'')">
          <template v-for="(vo, idx) in goods.images">
            <view class="goods_pic_item" :key="idx" v-if="idx<6" @tap.stop="onPreview(vo, idx, goods.images)">
              <image mode="aspectFill" lazy-load :src="vo.path + (vo.type == 'video' ? '?vframe/jpg/offset/0|imageView2/1/w/105/h/105' : '')">
                <text v-if="vo.type == 'video'" class="iconfont2 icon-bofang"></text>
              </image>
              <!-- 大于六张的蒙版 -->
              <view v-if="goods.images && goods.images.length>6 && idx==5" class="goods_pic_mark dis-flex flex-y-center flex-x-center">+{{goods.images.length-6}}</view>
            </view>
          </template>
        </view>
        <view class="main_goods_right">
          <!-- 商品标题 -->
          <view class="main_goods_title_box">
            <view>
              <text class="main_goods_title twolist-hidden">{{ goods.goods_name }}</text>
            </view>
            <text class="more f-24 col-m" @tap.stop="onTargetGoods">更多<text class="iconfont2 icon-gengduobeifen2 f-24"></text></text>
          </view>
          <!-- 商品信息 -->
          <view class="main_goods_desc">
            <view class="desc_footer dis-flex flex-y-center">
              <text class="price_x col-m">¥{{ goods.sku.goods_price || '0' }}</text>
              <text class="price_y col-9 f-24" v-if="goods.sku.line_price">¥{{ goods.sku.line_price }}</text>
            </view>
            <!-- <view class="">
              <text class="desc_introduction onelist-hidden">{{ goods.selling_point }}</text>
            </view> -->
            <view class="sku f-24">
              <view v-if="goods.spec_many && goods.spec_many.spec_attr">
                <view class="sku_goods" v-for="(goods, index2) in goods.spec_many.spec_attr" :key="index2">
                  <text class="sku_title col-9">{{goods.group_name}}</text>
                  <text>{{goods.group_text}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="optbox">
          <div class="optItem f-24 m-r30 col-9">
            <text class="iconfont2 icon-download f-24 m-r10 col-9"></text>
            下载
          </div>
          <div class="optItem f-24 col-9">
            <text class="iconfont2 icon-relay f-24 m-r10 col-9"></text>
            转发
          </div>
          <button class="settlement" style="padding:0">立即购买</button>
        </view>
      </view>
    </div>
    <view class="videoBox dis-flex flex-y-center" v-if="videoBoxShow" @tap.stop="closeVideoBox">
      <video preload="none" class="videoAll" id="videoAll" :src="videoPath" autoplay="true" @tap.stop objectFit="cover" @ended="jieshu"></video>
    </view>
	</view>
</template>

<script>
const App = getApp().globalData;
export default {
	data() {
		return {
      goods: {},
      videoBoxShow: false,
      options: {}
		};
	},
	onLoad: function(options) {
    let goods = uni.getStorageSync('goodsPreview') || '{}'
    this.goods = this.initListFun(JSON.parse(goods))
    console.log(this.goods)
  },
  mounted() {
  },
  methods: {
    onPreview(item, index, images) {
      if (item.type == 'video') {
        this.onPreviewVideo(item)
      } else {
        this.onPreviewImages(index, images)
      }
    },
    /**
     * 浏览商品图片
     */
    onPreviewImages(index, images) {
      let imageUrls = [];
      images.forEach(element => {
        imageUrls.push(element.path);
      });

      wx.previewImage({
        current: imageUrls[index],
        urls: imageUrls
      });
    },

    onPreviewVideo(item) {
      this.videoPath = item.path
      this.videoBoxShow = true
      let videoContextCurrent = wx.createVideoContext('videoAll');
      videoContextCurrent.play();
    },
    closeVideoBox() {
      // 关闭
      this.setData({
        videoPath: '',
        videoBoxShow: false
      });
    },
    // 拼接规格
    initListFun(data) {
      if (data.spec_many && data.spec_many.spec_attr) {
        for (let j = 0; j < data.spec_many.spec_attr.length; j++) {
          data.spec_many.spec_attr[j].group_text = this.getText(data.spec_many.spec_attr[j].spec_items);
        }
      }
      if (data.spec_type == 20) {
        if (data.spec_many.spec_list[0]) {
          data.spec_many.spec_list.forEach(item => {
            if (item.form.goods_weight == '') {
              item.form.goods_weight = '0.1'
            }
          })
          data.sku = data.spec_many.spec_list[0].form
        } else {
          data.sku = {
            goods_price: '',
            line_price: '',
            stock_num: '',
            goods_weight: ''
          }
        }
      }
      if (data.sku.goods_weight == '') {
        data.sku.goods_weight = '0.1'
      }
      return data;
    },
    getText(list) {
      let str = '';

      for (let i = 0; i < list.length; i++) {
        str += list[i].spec_value;

        if (i < list.length - 1) {
          str += '/';
        }
      }

      return str;
    },
    onTargetGoods(){
      uni.navigateTo({
        url: '/pages/goods/priview'
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
