<template>
<view class="container">
  <!-- 自定义标题栏 -->
  <navigationBar id="top" title="商品评价" extClass="nav"></navigationBar>
  <!-- 顶部选项卡 -->
  <view class="swiper-tab dis-flex box-align-center flex-y-center">
  <view>
  </view>
    <view :class="'swiper-tab-item ' + (options.scoreType == -1 ? 'on' : '')" data-current="-1" @tap="swichNav">全部({{ total.all || 0 }})<view class="line"></view>
    </view>
    <view :class="'swiper-tab-item ' + (options.scoreType == 10 ? 'on' : '')" data-current="10" @tap="swichNav">好评({{ total.praise || 0 }})<view class="line"></view>
    </view>
    <view :class="'swiper-tab-item ' + (options.scoreType == 20 ? 'on' : '')" data-current="20" @tap="swichNav">中评({{ total.review || 0 }})<view class="line"></view>
    </view>
    <view :class="'swiper-tab-item ' + (options.scoreType == 30 ? 'on' : '')" data-current="30" @tap="swichNav">差评({{ total.negative || 0 }})<view class="line"></view>
    </view>
  </view>

  <!-- 评价列表 -->
  <scroll-view v-if="total.all > 0" scroll-y="true" @scrolltolower="bindDownLoad" :style="'height: ' + swiperHeight + 'px;'">
    <view class="comment-list" v-if="list.data && list.data.length">
      <view class="comment-item" v-for="(item, index) in list.data" :key="index">
        <view class="goods-comment-box dis-flex flex-dir-column b-f">
          <view class="b-b line">
            <image lazy-load class="user_avatar" mode="aspectFill" :src="item.user?item.user.avatarUrl:''"></image>
            <view class="row dis-flex flex-y-center">
              <!-- 用户信息 -->
              <view class="user dis-flex flex-y-center">
                <text class="user_name f-26 f-w">{{ item.user?item.user.nickName:''}}</text>
              </view>
              <!-- 评价评星 -->
              <view class="com_xing dis-flex flex-y-center">
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
              <!-- 评价日期-->
              <view class="flex-box f-24 col-9 t-r">{{ item.create_newtime }}</view>
            </view>
            <!-- 评价内容 -->
            <view class="goods-comment-cont row m-top20">
              <text class="f-26">{{ item.content }}</text>
            </view>
            <!-- 评价图片 -->
            <view class="comment-images row" v-if="item.image.length">
              <view class="image-preview" v-for="(image, imgIndex) in item.image" :key="imgIndex">
                <image lazy-load :data-comment-index="index" :data-img-index="imgIndex" @tap.stop="previewImages" mode="aspectFill" :src="image.file_path"></image>
              </view>
            </view>
            <!-- 商品规格 -->
            <view class="row f-24 col-9">{{ item.order_goods ? item.order_goods.goods_attr || '' : '' }}</view>
          </view>
        </view>
      </view>
      <view class="listBottom col-9 f-24">生意宝技术支持～</view>
    </view>
    <view class="yoshop-notcont" v-else-if="notcont">
      <text class="iconfont icon-wushuju"></text>
      <text class="cont">亲，暂时没有记录哦</text>
    </view>
  </scroll-view>
  <tui-no-data v-else imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
    <view class="col-9">此商品暂无评论！</view>
  </tui-no-data>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      // 当前tab
      // currentTab: -1,
      // 列表高度
      swiperHeight: 0,
      // 页面参数
      options: {
        goods_id: null,
        scoreType: -1
      },
      // 评论列表
      list: [],
      // 当前页码
      page: 1,
      // show
      notcont: false,
      total: "",
      no_more: false
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options.goods_id = options.goods_id
    // 获取评论列表
    this.getCommentList();
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
        tapHeight = Math.floor(rpx * 94) + 1,
            // tap高度
        swiperHeight = systemInfo.windowHeight - res[0].height - tapHeight; // swiper高度

        this.setData({
          swiperHeight
        });
      });
    },

    /**
     * 获取评论列表
     */
    getCommentList: function (isNextPage, page) {
      let params = this.options;
      params.page = page || 1;
      // params.wxapp_goods_id = this.options.goods_id;

      getApp().globalData._get('comment/lists', params, result => {
        let resultList = result.data.list,
            dataList = this.list;

        if (resultList.data && resultList.data.length > 0) {
          resultList.data = this.initCommentDataFun(resultList.data);
        }

        if (isNextPage !== true || typeof dataList.data === 'undefined') {
          this.setData({
            list: resultList,
            total: result.data.total,
            notcont: !resultList.length
          });
        } else {
          this.setData({
            'list.data': dataList.data.concat(resultList.data),
            total: result.data.total
          });
        }
      });
    },

    /**
    * 初始化评论时间
    */
    initCommentDataFun(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].create_time) {
          data[i].create_newtime = data[i].create_time.substring(5, 16);
        }
      }

      return data;
    },

    /** 
     * 点击tab切换 
     */
    swichNav: function (e) {
      let _this = this;

      _this.setData({
        list: {},
        page: 1,
        no_more: false,
        'options.scoreType': e.target.dataset.current
      }, function () {
        // 获取评论列表
        _this.getCommentList();
      });
    },

    /**
     * 图片预览
     */
    previewImages: function (e) {
      let commentIndex = e.target.dataset.commentIndex,
          imgIndex = e.target.dataset.imgIndex,
          images = this.list.data[commentIndex].image,
          imageUrls = [];
      images.forEach(function (item) {
        imageUrls.push(item.file_path);
      });
      wx.previewImage({
        current: imageUrls[imgIndex],
        urls: imageUrls
      });
    },

    /**
     * 下拉到底加载数据
     */
    bindDownLoad: function () {
      // 已经是最后一页
      if (this.page >= this.list.last_page) {
        this.setData({
          no_more: true
        });
        return false;
      }

      this.getCommentList(true, ++this.page);
    }
  }
};
</script>
<style>
@import "./comment.css";
</style>