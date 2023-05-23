<template>
<view>
  <!-- 自定义标题栏 -->
  <navigationBar title="浏览轨迹" isHelpme id="top">
  </navigationBar>
  <scroll-view @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;'">
    <view class="dataList dis-flex">
      <view class="dataItem1">
        <view class="num">
          {{allData.todayUv || 0}}
        </view>
        <view class="title">
          本日
        </view>
        <view class="rightLine"></view>
      </view>
      <view class="dataItem2">
        <view class="num">
          {{allData.monthUv || 0}}
        </view>
        <view class="title">
          本月
        </view>
        <view class="rightLine"></view>
      </view>
      <view class="dataItem1">
        <view class="num">
          {{allData.totalUv || 0}}
        </view>
        <view class="title">
          全部
        </view>
      </view>
    </view>
    <template v-if="!loading">
      <div v-if="list && list.length > 0">
        <view class="listBox">
          <view class="listItem dis-flex flex-y-center" v-for="(item, index) in list" :key="index" :class="index < 3 ? 'listItem' + (index+1) : ''" @tap.stop="toDetail(item)">
            <view class="imgBox dis-flex flex-y-center" :class="item.is_locked ? 'filter' : ''">
              <image class="userImg imageDefault" :src="item.avatarUrl" alt=""></image>
              <image class="itemTip" v-if="item.vip" :src="vips[item.vip]" alt=""></image>
            </view>
            <view class="name dis-flex flex-y-center">
              <div class="nameBox">
                <div class="dis-flex flex-y-center">
                  <view class="onelist-hidden nameText" :class="item.is_locked ? 'filter' : ''">
                    <text>{{item.nickName}}</text>
                  </view>
                  <div class="salesFee">
                    <template v-if="item.pay_level">
                      <image v-for="(items, index) in item.pay_level" :key="index" class="saleGrade" src="/static/images/saleGrade.png"></image>
                    </template>
                    <template v-if="item.total_pay_money && item.total_pay_money != '0.00'">
                      <text class="cross">跨</text>￥{{item.total_pay_money}}
                    </template>
                  </div>
                </div>
                <div class="lastTime" v-if="item.lastTime">
                  最近访问：{{returnTime(item.lastTime)}}
                </div>
              </div>
              <view class="num">
                <div>
                  {{item.num || 0}}次
                </div>
                <div class="unlock" v-if="item.is_locked" @tap.stop="toMember(item)">
                  立即解锁
                </div>
              </view>
            </view>
          </view>
        </view>
        <view class="no-more f-24 col-9" v-if="no_more">生意宝技术支持～</view>
      </div>
      <tui-no-data v-else imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
        <view class="col-9">暂无数据</view>
      </tui-no-data>
    </template>
  </scroll-view>
		<guidePage ref="guidePage"></guidePage>
    <popup-tips ref="popupTips" title="温馨提示" content="此用户未公开联系方式，是否继续解锁！"></popup-tips>
</view>
</template>

<script>
const App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';
import guidePage from '@/components/guide-page';

export default {
  data() {
    return {
      isMember: true,
      vips: {
        1: '/static/images/xiami.png',
        2: '/static/images/mingxia.png',
        3: '/static/images/mingxia.png',
        4: '/static/images/longxia.png',
      },
      allData: {},
      list: [],
      loading: true,
      scrollHeight: 0,
      page: 1,
      last_page: 1,
      no_more: false,
      userInfo: {}
    };
  },

  components: {
    guidePage,
    popupTips
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let date = new Date()
    let y = date.getFullYear()
    let m = (date.getMonth() + 1)
    let d = date.getDate()
    this.date = y + '-' + m + '-' + d
    this.unit()
    this.follow()
  },

  methods: {
    follow() {
      App._post_form('shop.wxapp.click_record/reportClickRecord', {
        module: 'follow'
      }, res => {
      });
    },
    returnTime(time) {
      let str = ''
      if (time) {
        if (time.indexOf(this.date) == -1) {
          str = time.substring(5,16)
        } else {
          str = time.substring(11,16)
        }
      }
      return str
    },
    unit() {
      this.$nextTick(() => {
        this.setListHeight()
      })
      this.getShowData()
      this.getListData()
      App._get('user.index/vipDetail', {}, (result) => {
        if (result.code == '1') {
          let data = result.data.userInfo || {}
          data.vip_expireText = data.vip_expire ? data.vip_expire.substring(0, 10) : ''
          this.userInfo = data
        }
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
        scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度

        this.setData({
          scrollHeight: scrollHeight
        });
      });
    },
    // 头部展示数据
    getShowData () {
      App._get('shop.visit_log/listsdata', {}, (result) => {
        this.allData = result.data.statistics || {}
      })
    },
    // 列表数据
    getListData () {
      App._get('shop.visit_log/lists', {
        page: this.page
      }, (result) => {
        this.loading = false
        let list = result.data.data || []
        if (this.page == 1) {
          this.list = list
        } else {
          this.list = this.list.concat(list)
        }
        this.last_page = result.data.last_page || 1
      })
    },
    // 浏览轨迹详情
    toDetail(item) {
      if (!item.is_locked) {
        uni.navigateTo({
            url: '/pages/retailShop/shopAbout/trajectory/detail/index?userId=' + item.userId
        });
      }
    },
    toMember(item) {
      if (this.userInfo.vip) {
        let next = () => {
          App._post_form('shop.visit_log/unlockVisit', {
            visit_id: item.userId
          }, (result) => {
            if (result.code == 1) {
              item.is_locked = 0
            }
            this.$api.msg(result.msg)
          })
        }
        if (item.has_contact) {
          next()
        } else {
          this.$refs.popupTips.open(next)
        }
      } else {
        App.toMember()
      }
    },
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.last_page) {
        this.no_more = true
        return false;
      } // 加载下一页列表
      this.page ++;
      this.getListData();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/components/myGoodsCommon/list.scss";
@import "./index.scss";
</style>