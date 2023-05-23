<template>
<view class="echartVue">
  <div class="checkBox dis-flex flex-x-between">
    <view class="itemTitle">交易走势</view>
    <div class="dis-flex flex-x-end">
      <div class="saleNum" :class="select == '1' ? 'checked' : ''" @tap.stop="selectItem('1')">
        <div class="icon"></div>
        成交量
      </div>
      <div class="saleFee" :class="select == '2' ? 'checked' : ''" @tap.stop="selectItem('2')">
        <div class="icon"></div>
        成交额
      </div>
    </div>
  </div>
  <!-- 折线图 -->
  <div v-show="!closeEchats">
	  <uCharts ref="uCharts"  chartType="line" canvasId="saleline" :opts="opts"  :cWidth="345"></uCharts>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;
import uCharts from '@/components/u-charts/component';
export default {
  data() {
    return {
      select: '1',
      opts: {
        categories: [],
        series: [],
      }
    };
  },

  components: {
    uCharts
  },
  props: {
    closeEchats: {
      type: Boolean,
      default: false
    },
    echartsList: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  
  methods: {
    selectItem(type) {
      this.select = type
      this.checkData()
      this.$nextTick(() => {
        this.$refs.uCharts.changeData('saleline', this.opts)
      })
    },
    checkData() {
        this.opts = {
          categories: this.unitList(this.echartsList.date || []),
          series: []
        }
      if (this.select == '1') {
        this.opts.series = [{
          name: '成交量',
          data: this.echartsList.order_total || [],
          color: '#2E5FE8',
          pointShape: 'circle',
          legendShape: 'circle',
          lineType: 'solid'
        }]
      } else {
        this.opts.series = [{
          name: '成交额',
          data: this.echartsList.order_total_price || [],
          color: '#FF7541',
          pointShape: 'circle',
          legendShape: 'circle'
        }]
      }
    },
    upDate() {
      this.checkData()
      this.$nextTick(() => {
        this.$refs.uCharts.init()
      })
    },
    unitList(list) {
      let newList = []
      list.forEach(element => {
        newList.push(element.slice(8,10))
      })
      return newList
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>