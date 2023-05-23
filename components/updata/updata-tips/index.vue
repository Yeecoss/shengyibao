<template>
  <popup v-if="showPopup" :show="showPopup" @clickmask="clickmask">
    <view class="popup-main" catchtouchmove='true'>
      <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
      <view class="poptitle">
        <tui-tabs style="z-index:1" :width="600" :tabs="tabs" :height="80" :padding="0" :currentTab="currentTab" @change="tabsChange" unlined color="#999990" :size="28" selectedColor="#333" sliderBgColor="#FF7541" itemWidth="50%" bold></tui-tabs>
      </view>
      <view class="pop-input" v-show="currentTab == 0">
        <div class="addNum dis-flex flex-y-center">
          <div>加价比例</div>
				  <input class="numInput" v-model="val" :maxlength="10"/>
          <div>%</div>
        </div>
        <div class="contentBox">
          <div class="contTitle" v-if="optType == 'updata'">举例说明（同步一件商品售价为100元）</div>
          <div class="contTitle" v-else>举例说明（复制一件商品售价为100元）</div>
          <div class="contentItem">例如你设置的比例是10%。</div>
          <div class="contentItem">你的商品售价：100+100×10%=110元。</div>
          <div class="contentItem" v-if="optType == 'updata'">你的收入：100×10%=10元。</div>
          <div class="contentItem">0%则是不加价.。</div>
          <div class="contentItem">例:49.9+49.9×10%=54.89元。</div>
        </div>
      </view>
      <view class="pop-input" v-show="currentTab == 1">
        <div class="addNum dis-flex flex-y-center">
          <div>加价金额</div>
				<input class="numInput" v-model="val" :maxlength="10"/>
          <div>元</div>
        </div>
        <div class="contentBox">
          <div class="contTitle" v-if="optType == 'updata'">举例说明（同步一件商品售价为100元）</div>
          <div class="contTitle" v-else>举例说明（复制一件商品售价为100元）</div>
          <div class="contentItem">例如你设置的金额是10元。</div>
          <div class="contentItem">你的商品售价：100+10=110元。</div>
          <div class="contentItem" v-if="optType == 'updata'">你的收入：10元。</div>
          <div class="contentItem">0元则是不加价。</div>
        </div>
      </view>
      <view class="pop-btn">
        <view @tap.stop="clickmask">取消</view>
        <view @tap.stop="confirm">{{confirmText}}</view>
      </view>
    </view>
  </popup>
</template>

<script>
  let App = getApp().globalData;
	import popup from "@/components/pop-manager/index";
	
	export default {
		components: {
			popup,
		},
		props: {
			title: String,
      content: String,
      optType: String,
			confirmText: {
				type: String,
				default: '确认'
			}
		},
		data (){
			return{
        setting: {},
        copySetting: {},
        val: '',
        tabs: [{
          name: '按比例'
        }, {
          name: '按固定金额'
        }],
        currentTab: 0,
      	showPopup: false
			}
		},
		watch: {
    },
    created() {
    },
		methods: {
      getSet() {
				App._get('shop.xrdealer.setting/detail', {}, (res) => {
          if (res.code == 1) {
            let setting = res.data.setting || {}
            this.setting = {
							dealer_num: setting.dealer_num || '',
							dealer_type: setting.dealer_type || '1'
            }
            this.unitData()
          } else {
					  this.$api.msg(res.msg)
          }
				})
				App._get('shop.setting/store', {}, (result) => {
					if (result.code == '1') {
						let setting = result.data.values || {}
						this.copySetting = {
							copy_num: setting.copy_num || '',
							copy_type: setting.copy_type || '1'
						}
						this.unitData()
					}
				});
			},
			unitData() {
				this.val = ''
				if (this.optType == 'updata') {
					this.currentTab = this.setting.dealer_type == '2' ? 1 : 0
          this.val = this.setting.dealer_num || ''
				} else {
					this.currentTab = this.copySetting.copy_type == '2' ? 1 : 0
          this.val = this.copySetting.copy_num || ''
        }
			},
      tabsChange(e) {
        if (this.optType == 'updata') {
          if ((e.index == 0 && this.setting.dealer_type == 1) || (e.index == 1 && this.setting.dealer_type == 2)) {
            this.val = this.setting.dealer_num || ''
          } else {
            this.val = ''
          }
        } else {
          if ((e.index == 0 && this.copySetting.copy_type == 1) || (e.index == 1 && this.copySetting.copy_type == 2)) {
            this.val = this.copySetting.copy_num || ''
          } else {
            this.val = ''
          }
        }
        this.currentTab = e.index
      },
			open(item) {
				this.getSet()
				this.showPopup = true
			},
			clickmask() {
				this.showPopup = false
				this.$emit('tipsClickmask')
			},
			confirm() {
				this.showPopup = false
				this.$emit('tipsCallback', {
          currentTab: this.currentTab,
          val: this.val
        })
			}
		},
	}
</script>

<style lang="scss">
.popup-main{
    position: relative;
    width: 600rpx;
    padding-top: 20rpx;
    border-radius: 16rpx;
    background:#fff;
    .pop-close{
        position: absolute;
        right: 20rpx;
        top: 10rpx;
        color: #999;
        z-index: 9;
    }
    .poptitle{
        font-size: 32rpx;
        line-height: 1.1;
        text-align: center;
        color: #333333;
    }
    .pop-input{
        padding: 40rpx 20rpx 60rpx;
        color: #666;
        font-size: 26rpx;
        line-height: 46rpx;
        .addNum{
          font-size: #333;
          font-size: 32rpx;
          .numInput{
            width: 128rpx;
            height: 48rpx;
            border-radius: 4rpx;
            border:2rpx solid rgba(222,222,222,1);
            margin: 0 20rpx;
            color: #FF7541;
            text-align: center;
          }
        }
        .contentBox{
          color: #666;
          font-size: 24rpx;
          margin-top: 30rpx;
          background: #F8F8F8;
          padding: 30rpx 20rpx;
          .contTitle{
            color: #333333;
            font-size: 28rpx;
          }
          .contentItem{
            position: relative;
            padding-left: 20rpx;
          }
          .contentItem::before{
            content: '';
            width:8rpx;
            height:8rpx;
            border-radius: 50%;
            background: #999;
            display: inline-block;
            position: absolute;
            left: 0;
            top: 20rpx;
          }
        }
    }
    // 按钮
    .pop-btn{
        display: flex;
        border-top: 1rpx solid #eee;
        view{
            width: 100%;
            font-size: 28rpx;
            line-height: 86rpx;
            color: #666;
            text-align: center;
            letter-spacing: 0.05em;
            overflow: hidden;
        }
    }
    .pop-btn view:nth-child(2){
        color: $red;
        border-left: 1rpx solid #eee;
    }
}
</style>
