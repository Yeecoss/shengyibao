<template>
<view :class="'weui-navigation-bar ' + extClass">
  <view :class="'weui-navigation-bar__placeholder ' + (ios ? 'ios' : 'android')" :style="'padding-top: ' + statusBarHeight + 'px;visibility: hidden;'"></view>
  <view :class="'weui-navigation-bar__inner ' + (ios ? 'ios' : 'android')" :style="'padding-top: ' + statusBarHeight + 'px; color: ' + color + ';background: ' + background + ';' + displayStyle + ';' + innerPaddingRight + ';' + innerWidth + ';' + (fixed ? '' : 'position:absolute')">

    <view class="weui-navigation-bar__left" :style="lLidth ? lLidth : leftWidth">
      <block v-if="back">
        <view v-if="!hideBut" @tap="backNext" class="weui-navigation-bar__buttons">
          <text class="iconfont2 icon-fanhui"></text>
        </view>
        <view v-else @tap="backHome" class="weui-navigation-bar__buttons">
          <text class="iconfont2 icon-Fill1 f-34"></text>
        </view>
      </block>
      <block v-else>
        <slot name="left"></slot>
      </block>
    </view>

    <view class="weui-navigation-bar__center" :style="centerAlign">
      <view v-if="loading" class="weui-navigation-bar__loading">
        <view class="weui-loading" :style="'width:' + size.width + 'rpx;height:' + size.height + 'rpx;'"></view>
      </view>
      <block v-if="title">
        <text :style="'font-size:' + fontSize + ';font-weight:' + fontWeight + ' !important;' + 'color:' + titleColor">{{title}}</text>
      </block>
      <block v-else>
        <slot name="center"></slot>
      </block>
			<!-- 引导页按钮 -->
			<view class="helpme" :style="{color:helpmeColor}" @tap="helpme" v-if="isHelpme&&guideItem">
				<text class="iconfont2 icon-questionmark f-28"></text>
			</view>
    </view>

    <view class="weui-navigation-bar__right">
      <slot name="right"></slot>
    </view>
  </view>
</view>
</template>

<script>
const App = getApp().globalData;
export default {
  data() {
    return {
      hideBut: false,
      displayStyle: '',
      ios: "",
      statusBarHeight: "",
      innerWidth: "",
      innerPaddingRight: "",
      leftWidth: "",
			guideItem: '',
    };
  },

  components: {},
  props: {
		// 左上角宽度
		lLidth: {
      type: String,
      default: ''
		},
		// centeraligin
		centerAlign: {
      type: String,
      default: ''
    },
		// 自定义类名
    extClass: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: ''
    },
    titleColor: {
      type: String,
      default: ''
    },
    back: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    },
    delta: {
      type: Number,
      default: 1
    },
    fixed: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: String,
      default: '32rpx'
    },
    fontWeight: {
      type: Number,
      default: 400
    },
		isHelpme: {
      type: Boolean,
      default: false
    },
		helpmeColor: {
      type: String,
      default: '#FF7541'
    },
  },
  watch: {
    show: '_showChange'
  },
  externalClasses: 'i-class',
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  beforeMount: function attached() {
    var _this = this;

    let pages = getCurrentPages();

    if (pages.length && pages.length > 1) {
      this.setData({
        hideBut: false
      });
    } else {
      this.setData({
        hideBut: true
      });
    }
    // #ifdef MP-WEIXIN || APP-PLUS
    var isSupport = false
    // #ifdef MP-WEIXIN
    isSupport = !!wx.getMenuButtonBoundingClientRect;
    var rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
		// #endif
    wx.getSystemInfo({
      success: function success(res) {
        var ios = !!(res.system.toLowerCase().search('ios') + 1);

        _this.setData({
          ios: ios,
          statusBarHeight: res.statusBarHeight,
          innerWidth: isSupport ? 'width:' + rect.left + 'px' : '',
          innerPaddingRight: isSupport ? 'padding-right:' + (res.windowWidth - rect.left) + 'px' : '',
          leftWidth: isSupport ? 'width:' + (res.windowWidth - rect.left) + 'px' : ''
        });
      }
    });
		// #endif
  },
	mounted() {
		this.getGuideData()
	},
  methods: {
    showChangeFun: function _showChange(show) {
      var animated = this.animated;
      var displayStyle = '';

      if (animated) {
        displayStyle = 'opacity: ' + (show ? '1' : '0') + ';-webkit-transition:opacity 0.5s;transition:opacity 0.5s;';
      } else {
        displayStyle = 'display: ' + (show ? '' : 'none');
      }

      this.setData({
        displayStyle: displayStyle
      });
    },
    backNext() {
      var data = this;
      wx.navigateBack({
        delta: data.delta
      });
      this.$emit('back', {
        delta: data.delta
      }, {});
    },

    backHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
		// 帮助
		helpme(){
			// this.$emit('helpme')
			this.$root.$refs.guidePage._open()
		},
		getGuideData(callback) {
			let pages = getCurrentPages();
			let currentPage = pages[pages.length - 1].route;
			let guideData = App.guideData;
			if (guideData.length > 0) {
				for (let i in guideData) {
					let page = guideData[i].page;
					if (page.indexOf('?') != -1) {
						page = page.substring(0, page.lastIndexOf("?"))
					}
					if (page == currentPage) {
						this.guideItem = guideData[i];console.log(this.guideItem)
						// this.showGuide = true;
					}
				}
			}
		},
  }
};
</script>
<style lang="scss">
@import "./index.scss";
.helpme{
	padding: 0 10rpx;
	line-height: 42rpx;
}
</style>