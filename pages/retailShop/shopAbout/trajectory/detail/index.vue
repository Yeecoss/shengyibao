<template>
<view>
  <!-- 自定义标题栏 -->
  <navigationBar id="top">
  </navigationBar>
  <div class="headBgBox"></div>
  <view class="shopInfo">
    <view class="nameBox dis-flex">
      <view class="imgBox">
        <img :src="wxapp.avatarUrl && wxapp.avatarUrl != '' ? wxapp.avatarUrl : '/static/images/default-avatar.jpg'" alt="">
          <text v-if="wxapp.gender === '女'" class="gender iconfont2 icon-girl"></text>
          <text v-else-if="wxapp.gender === '男'" class="gender iconfont2 icon-boy"></text>
      </view>
      <view class="info">
        <view class="title dis-flex flex-y-center">
          <text>{{wxapp.nickName}}</text>
          <view class="titleVip">
            <image v-if="wxapp.vip" mode="aspectFit" :src="vips[wxapp.vip]"></image>
          </view>
        </view>
        <view class="content dis-flex flex-y-center">
          <text class="m-r20" v-if="verify.identity == '1'">
            <text class="iconfont2 icon-Personalcertification m-r10" style="color:#7FD224"></text>
            已认证
          </text>
          <text class="iconfont2 icon-Authentication m-r20" v-if="verify.company == '1'" style="color:#FFC927"></text>
          <!-- <text class="iconfont2 icon-store m-r20" v-if="verify.shop == '1'" style="color:#F55B5B"></text> -->
          <image class="imgIcon m-r20" v-if="verify.company == '1'" src="/static/images/qiyerenzheng.png"></image>
          <template v-if="wxapp.wxapp_level">
            <image v-for="(item, index) in wxapp.wxapp_level" :key="index" class="imgIcon m-r10" src="/static/images/saleGrade.png"></image>
          </template>
        </view>
        <div class="notice">
          {{wxapp.notice && wxapp.notice != '' ? wxapp.notice : '这个人很懒，什么都没有留下！'}}
        </div>
      </view>
      <view class="chat">
        <text class="iconfont2 icon-WeChat f-28" @tap.stop="toShopInformation"></text>
      </view>
    </view>
    <view class="dataBox dis-flex flex-y-center">
        <view class="dataItem">
          <view class="num">{{statistics.total_pv || 0}}</view>
          <view class="dataTit">访问总数</view>
        </view>
        <view class="dataItem">
          <view class="num">{{statistics.local_pay_money || 0.00}}</view>
          <view class="dataTit">本店总消费</view>
        </view>
        <view class="dataItem">
          <view class="num">{{statistics.total_pay_money || 0.00}}</view>
          <view class="dataTit">跨店总消费</view>
        </view>
    </view>
  </view>
  <div class="tabsBox dis-flex flex-y-center">
    <div class="tabItem" :class="tabs == '1' ? 'active' : ''" @tap.stop="tabs = '1'">
      足迹
      <div class="line"></div>
    </div>
    <div class="tabItem" :class="tabs == '2' ? 'active' : ''" @tap.stop="tabs = '2'">
      订单
      <div class="line"></div>
    </div>
  </div>
  <template v-if="!loading">
    <div v-show="tabs == '1'">
      <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;'">
        <view class="listBox" v-if="list.length > 0">
          <view class="yearItem" v-for="(item, index) in list" :key="index">
            <view class="yearTitle" v-if="item.year">
              <view class="yearDots"></view>
              <view>{{item.year}}</view>
              <view class="leftLine"></view>
            </view>
            <view class="dateItem" v-for="(items, indexs) in item.list" :key="indexs" :class="index == list.length - 1 && indexs == item.list.length - 1 ? 'lastItem' : ''">
              <view class="dateTitle dis-flex flex-y-center flex-x-between">
                <view class="dateDots"></view>
                <view>{{items.time}}</view>
                <view class="all" v-if="items.list && items.list.length > 4">
                  全部{{items.list.length}}<text class="iconfont2 icon-gengduobeifen2"></text>
                </view>
              </view>
              <view class="imgBox" v-if="items.list">
                <view class="imgItem" v-for="(imgItem, imgIndex) in items.list" :key="imgIndex" @tap.stop="onTargetGoods(imgItem.wxapp_goods_id)">
                  <image class="imageDefault" :src="imgItem.goods_image"></image>
                  <view class="numBox">共{{imgItem.num}}次</view>
                </view>
              </view>
            </view>
          </view>
          <view class="no-more f-24 col-9" v-if="no_more">生意宝技术支持～</view>
        </view>
        <div class="nodata" v-else>
          <tui-no-data imgUrl="/static/images/no_content.png" :fixed="false" :imgWidth="380" :imgHeight="328">
            <div>
              暂无数据
            </div>
          </tui-no-data>
        </div>
      </scroll-view>
    </div>
    <div v-show="tabs == '2'">
      <scroll-view scroll-y @scrolltolower="bindDownLoad1" :style="'height: ' + scrollHeight + 'px;'">
        <div class="orderListBox">
          <div class="orderTitle dis-flex flex-y-center">
            <div class="orderNum">序号</div>
            <div class="orderTime">订单号/时间</div>
            <div class="orderPrice">订单金额</div>
          </div>
          <template v-if="orderList.length > 0">
            <div class="orderList dis-flex flex-y-center flex-x-between" v-for="(item, index) in orderList" :key="index" @tap.stop="toOrderDetail(item)">
              <div class=" dis-flex flex-y-center">
                <div class="orderNum orderListNum">{{index + 1}}</div>
                <div class="orderTime">
                  <div class="order_no">{{item.order_no}}</div>
                  <div class="create_time">{{item.createTime}}</div>
                </div>
                <div class="orderPrice">{{item.pay_price}}</div>
              </div>
              <div class="listMore">
                <div class="listMoreBox">
                  <text class="iconfont2 icon-Top"></text>
                </div>
              </div>
            </div>
            <view class="no-more f-24 col-9" v-if="no_more1">生意宝技术支持～</view>
          </template>
          <div class="nodata" v-else>
            <tui-no-data imgUrl="/static/images/no_content.png" :fixed="false" :imgWidth="380" :imgHeight="328">
              <div>
                暂无数据
              </div>
            </tui-no-data>
          </div>
        </div>
      </scroll-view>
    </div>
  </template>
  <contact ref="contact"></contact>
	<guidePage title="trajectoryDe"></guidePage>
</view>
</template>

<script>
const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
const App = getApp().globalData;
import contact from '@/components/myGoodsCommon/contact/index';
import guidePage from '@/components/guide-page';

export default {
  data() {
    return {
      tabs: '1',
      userId: '',
      orderList: [],
      page1: 1,
      loading: true,
      last_page: 1,
      last_page1: 1,
      no_more1: false,
      page: 1,
      no_more: false,
      scrollHeight: 0,
      user: {},
      verify: {},
      statistics: {},
      wxapp: {},
      list: [],
      vips:{
        1: 'http://pic.kaidanxia.com/2020-08-06/20200806093701e776a3750.png',
        2: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
        3: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
        4: 'http://pic.kaidanxia.com/2020-08-06/20200806093702403126378.png',
      }
    };
  },

  components: {
    contact,
		guidePage
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.userId = options.userId || ''
    this.unit()
  },

  methods: {
    toOrderDetail(item) {
      uni.navigateTo({
        url: '/pages/myGoods/order/detail/index?order_no=' + item.order_no
      })
    },
    unit() {
      this.getShowData()
      this.getListData()
      this.getOrderList()
      this.$nextTick(() => {
        this.setListHeight()
      })
    },
    /**
     * 设置列表高度
     */
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // tap高度
        scrollHeight = systemInfo.windowHeight - res[0].height - 189; // swiper高度

        this.scrollHeight = scrollHeight
      });
    },
    // 头部展示数据
    getShowData () {
      App._get('shop.visit_log/detaildata', {
        user_id: this.userId
      }, (result) => {
        this.user = result.data.user || {}
        this.verify = result.data.verify || {}
        this.statistics = result.data.statistics || {}
        this.wxapp = result.data.wxapp || {}
      })
    },
    // 列表数据
    getListData () {
      App._get('shop.visit_log/detail', {
        user_id: this.userId
      }, (result) => {
        this.loading = false
        this.transList(result.data.data || [])
        this.last_page = result.data.last_page || 1
      })
    },
    getOrderList () {
      App._get('shop.order/getSimpleOrderList', {
        page: this.page1,
        user_id: this.userId
      }, (result) => {
        let list = result.data.list.data || []
        list.forEach(item => {
          item.createTime = item.create_time.substring(0, 16)
        })
        if (this.page1 == 1) {
          this.orderList = list
        } else {
          this.orderList = this.orderList.concat(list)
        }
        this.last_page1 = result.data.list.last_page || 1
      })
    },
    // 转换列表数据
    transList(list) {
      list.forEach(element => {
        if (element.length > 0) {
          let obj = {
            list: element,
            time: element[0].time.substring(5, 16)
          }
          let isHave = false
          let time = element[0].time.substring(0, 4)
          this.list.forEach(item => {
            if (item.year == time) {
              item.list.push(obj)
              isHave = true
            }
          })
          if (!isHave) {
            let newList = []
            newList.push(obj)
            this.list.push({
              year: time,
              list: newList
            })
          }
        }
      })
    },
    // 店铺资料
    toShopInformation() {
      this.$refs.contact.open(this.user)
    },
    /**
     * 跳转商品详情页
     */
    onTargetGoods(goods_id) {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + goods_id
      });
    },
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.last_page) {
        this.no_more = true
        return false;
      } // 加载下一页列表
      this.page ++;
      this.getListData();
    },
    bindDownLoad1() {
      // 已经是最后一页
      if (this.page1 >= this.last_page1) {
        this.no_more1 = true
        return false;
      } // 加载下一页列表
      this.page1 ++;
      this.getOrderList()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>