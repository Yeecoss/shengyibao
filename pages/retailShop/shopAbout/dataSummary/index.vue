<template>
<view class="dataSummary">
  <!-- 自定义标题栏 -->
  <navigationBar title="数据汇总">
  </navigationBar>
  <!-- 日历 -->
  <view class="rangeBox" @tap.stop="onShowDatePicker()">
    <text class="iconfont2 icon-calendar"></text>
    <text v-if="startDate != '' && endDate != ''">{{startDate}} - {{endDate}}</text>
  </view>
  <!-- 数据概况 -->
  <data-list :survey="survey"></data-list>
  <!-- 交易走势 -->
  <echart-vue :closeEchats="closeEchats" ref="echart" :echartsList="echartsList"></echart-vue>
  <!-- 总榜单 -->
  <view class="itemTitle">总榜单</view>
  <view>
    <view class="tabBox dis-flex">
      <view class="tabItem" :class="tabItem == '1' ? 'tabItem1' : ''" @tap.stop="tabItem = '1'">
        七日消费榜
        <view class="line"></view>
      </view>
      <view class="tabItem" :class="tabItem == '2' ? 'tabItem1' : ''" @tap.stop="tabItem = '2'">
        七日销量榜
        <view class="line"></view>
      </view>
    </view>
  </view>
  <view>
    <!-- 消费榜页面 -->
    <div v-show="tabItem == '1'">
      <salesFee-list :userExpendRanking="userExpendRanking"></salesFee-list>
    </div>
    <!-- 销量榜页面 -->
    <div v-show="tabItem == '2'">
      <sales-list :goodsRanking="goodsRanking"></sales-list>
    </div>
  </view>
  <view class="no-more f-24 col-9">生意宝技术支持～</view>
  <tui-calendar :type="2" @change="onSelected" ref="tuiCalender" isFixed @timeHide="timeHide"></tui-calendar>
</view>
</template>

<script>
const App = getApp().globalData;
import dataList from '@/components/myGoodsCommon/dataList/index';
import echartVue from './echartVue/index';
import salesFeeList from '@/components/myGoodsCommon/salesFeeList/index';
import salesList from '@/components/myGoodsCommon/salesList/index';


export default {
  data() {
    return {
      tabItem: '1',
      startDate: '',
      endDate: '',
      survey: {},
      echartsList: {},
      userExpendRanking: [],
      goodsRanking: [],
      closeEchats: false
    };
  },

  components: {
    'data-list': dataList,
    'echart-vue': echartVue,
    'salesFee-list': salesFeeList,
    'sales-list': salesList
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAllData()
	this.unitTime()
  },

  methods: {
	  unitTime() {
		  let date1 = new Date()
		  let ty = date1.getFullYear(); //年
		  
		  let tm = date1.getMonth(); //月
		  let td = date1.getDate(); //日
		  let time = date1.getTime() - 24 * 60 * 60 * 1000 * 7
		  let date2 = new Date(time); //一个月前的日期
		  let ty1 = date2.getFullYear(); //年
		  let tm1 = date2.getMonth(); //月
		  let td1 = date2.getDate(); //日
		  
		  let startDate = ty1 + '-' + tm1 + '-' + td1
		  let endDate = ty + '-' + tm + '-' + td
		  
		  this.startDate = startDate
		  this.endDate = endDate
	  },
    // 获取全部数据
    getAllData(update) {
      let data = {}
      if (this.startDate != '') {
        data.startDate = this.startDate
      }
      if (this.endDate != '') {
        data.endDate = this.endDate
      }
      App._get('shop.statistics/index', data, (result) => {
        let data = result.data
        this.survey = data.survey || {}
        if (!update) {
          this.echartsList = data.echarts7days || {}
          this.userExpendRanking = data.userExpendRanking || {}
          this.goodsRanking = data.goodsRanking || {}
          this.$nextTick(() => {
            this.$refs.echart.upDate()
          })
        }
      })
    },
    onShowDatePicker(){//显示
      this.closeEchats = true
      this.$refs.tuiCalender.show()
    },
    onSelected(e) {//选择
      this.closeEchats = false
      if(e) {
        this.startDate = e.startDate
        this.endDate = e.endDate
      }
      this.getAllData(true)
    },
    timeHide() {
      this.closeEchats = false
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>