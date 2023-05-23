<template>
    <div class="listBox">
      <div class="list dis-flex flex-y-center" v-for="(item, index) in list" :key="index">
        <div class="name">{{item.name}}</div>
        <div class="tips">
          <text v-if="item.tips[checkItem] == 'have'" class="iconfont2 icon-duihao"></text>
          <text v-else>{{item.tips[checkItem]}}</text>
        </div>
      </div>
    </div>
</template>

<script>
let App = getApp().globalData;

export default {
  data() {
    return {
      list: [{
        name: '商品管理',
        tips: {
          1: 'have',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '订单流转',
        tips: {
          1: 'have',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '物流轨迹',
        tips: {
          1: '',
          2: '免费3000',
          3: '免费1000'
        }
      }, {
        name: '数据汇总',
        tips: {
          1: '',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '浏览轨迹',
        tips: {
          1: '',
          2: '不限',
          3: '每天可查看5位用户'
        }
      }, {
        name: '发展渠道',
        tips: {
          1: '',
          2: 'have',
          3: ''
        }
      }, {
        name: '商品橱窗',
        tips: {
          1: 'have',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '同步更新商品',
        tips: {
          1: '',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '商品上架数量',
        tips: {
          1: '50(件)',
          2: '不限',
          3: '500(件)'
        }
      },{
        name: '资源库总空间',
        tips: {
          1: '500M',
          2: '不限',
          3: '10G'
        }
      }, {
        name: '多渠道商品组合上架',
        tips: {
          1: '',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '线上线下核销',
		tips: {
		  1: '',
		  2: 'have',
		  3: 'have'
		},
	}, {
		name: '分享赚钱',
		tips: {
			1: '',
			2: 'have',
			3: ''
		}
	}, {
		name: '记账',
		tips: {
			1: '',
			2: 'have',
			3: ''
		}
	},
	{
		name: '销售开单',
		tips: {
			1: '500',
			2: 'have',
			3: 'have'
		}
},
	{
		name: '库存管理',
		tips: {
			1: 'have',
			2: 'have',
			3: 'have'
		}
	},
	{
		name: '打印',
		tips: {
			1: 'have',
			2: 'have',
			3: 'have'
		}
	},
	{
		name: '在线收款',
		tips: {
			1: '',
			2: 'have',
			3: 'have'
		}
      // }, {
      //   name: '直播',
      //   tips: {
      //     1: '',
      //     2: '增值服务',
      //     3: '增值服务'
      //   }
      // }, {
      //   name: '短视频',
      //   tips: {
      //     1: '',
      //     2: '增值服务',
      //     3: '增值服务'
      //   }
      }, {
        name: '店铺运营',
        tips: {
          1: '',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '上千套商城模版',
        tips: {
          1: 'have',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '前后端数据互通',
        tips: {
          1: 'have',
          2: 'have',
          3: 'have'
        }
      }, {
        name: '多渠道分享',
        tips: {
          1: 'have',
          2: 'have',
          3: 'have'
        }
      }]
    };
  },

  components: {
  },
  props: {
    checkItem: {
      type: String,
      default: '1'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>