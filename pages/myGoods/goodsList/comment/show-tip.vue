<template>
<div>
  <popup v-if="showPopup" :show="showPopup" @clickmask="clickmask">
    <view class="popup-main" v-if="item.goods_id">
      <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
      <view class="poptitle f-32">{{wxapp_goods_types[item.wxapp_goods_type.value]}}<text v-if="item.wxapp_goods_type.value == 1 || item.wxapp_goods_type.value == 2">-{{item.parent_goods.wxapp.name}}</text></view>
      <view class="pop-input f-30">
        <div class="list">
          <div class="dis-flex flex-x-between">
            <div>
              创建时间:
            </div>
            <div>
              {{item.create_time.substring(0, 11)}}
            </div>
          </div>
          <div class="dot"></div>
        </div>
        <div class="list" v-if="item.wxapp_goods_type.value == 2">
          <div class="dis-flex flex-x-between">
            <div>
              初始价格:
            </div>
            <div>
              ¥{{item.goods.goods_sku.origin_goods_price}}
            </div>
          </div>
          <div class="dot"></div>
        </div>
        <div class="list" v-else>
          <div class="dis-flex flex-x-between">
            <div>
              初始价格:
            </div>
            <div>
              ¥{{item.goods.goods_first_price}}
            </div>
          </div>
          <div class="dot"></div>
        </div>
        <div class="list">
          <div class="dis-flex flex-x-between">
            <div>
              本店当前价格:
            </div>
            <div>
              ¥{{item.goods.goods_sku.goods_price}}
            </div>
          </div>
          <div class="dot"></div>
        </div>
        <div class="list" v-if="item.wxapp_goods_type.value == 1 || item.wxapp_goods_type.value == 2">
          <div class="dis-flex flex-x-between flex-y-end">
            <div>
              {{item.parent_goods.wxapp.name}}当前价格:
            </div>
            <div>
              ¥{{item.parent_goods.goods.sku[0] ? item.parent_goods.goods.sku[0].goods_price : '0'}}
            </div>
          </div>
          <div class="dot"></div>
        </div>
        <div class="col-m" @tap.stop="optClick" v-if="item.wxapp_goods_type.value == 2 && item.parent_goods.goods_id != item.goods.goods_id">
          同步更新
          <text class="iconfont2 icon-synchronization updataIcon"></text>
        </div>
      </view>
      <view class="pop-btn" v-if="item.wxapp_goods_type.value == 1 || item.wxapp_goods_type.value == 2">
        <view @tap.stop="cancel" v-if="showConcle">取消</view>
        <view @tap.stop="contact" :style="showConcle ? '' : 'border-left:0'" class="submit">联系商家</view>
      </view>
      <view v-else class="iKnowBox">
        <view @tap.stop="confirm" class="iKnow">知道了</view>
      </view>
    </view>
  </popup>
  <contact ref="contact"></contact>
</div>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	import contact from '@/components/myGoodsCommon/contact/index';
	
	export default {
		components: {
			popup,
			contact,
		},
		props: {
      showConcle: {
        type: Boolean,
				default: true
      }
		},
		data (){
			return{
        wxapp_goods_types: {
          0: '未知',
          1: '复制',
          2: '同步',
          3: '自建',
        },
        showPopup: false,
        item: {}
			}
		},
		watch: {
		},
		methods: {
      optClick() {
        this.showPopup = false
        this.$emit('optClick', 'updata', this.item)
      },
      contact() {
        this.showPopup = false
        this.$refs.contact.open(this.item.parent_goods.wxappUser)
      },
			open(item) {
        this.showPopup = true
        this.item = item || {}
			},
			clickmask() {
				this.showPopup = false
			},
			cancel() {
				this.showPopup = false
			},
			confirm() {
				this.showPopup = false
      }
		},
	}
</script>

<style lang="scss">
.popup-main{
    position: relative;
    width: 600rpx;
    padding-top: 30rpx;
    
    border-radius: 16rpx;
    background:#fff;
    .pop-close{
        position: absolute;
        right: 20rpx;
        top: 30rpx;
        color: #999;
    }
    .poptitle{
        line-height: 1.1;
        text-align: center;
        color: #333333;
        padding: 0 60rpx;
    }
    .pop-input{
        padding: 40rpx 40rpx 60rpx 68rpx;
        color: #666;
        line-height: 46rpx;
        font-size: 30rpx;
        max-height: 600rpx;
        overflow: auto;
        .list{
          font-size: 30rpx;
          line-height: 60rpx;
          color: #666666;
          position: relative;
          padding-left: 30rpx;
          .dot{
            position: absolute;
            left: 0;
            top: 0;
            width: 8rpx;
            height: 8rpx;
            background: #FF7541;
            display: inline-block;
            top: 26rpx;
          }
        }
        .updataIcon{
          font-size: 30rpx;
          margin-left: 10rpx;
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
    .iKnowBox{
      padding-bottom: 40rpx;
      .iKnow{
        width: 400rpx;
        height: 80rpx;
        background: #FF7541;
        border-radius: 44rpx;
        margin: 0 auto;
        text-align: center;
        line-height: 80rpx;
        color: white;
      }
    }
    .pop-btn .submit{
        color: $red;
        border-left: 1rpx solid #eee;
    }
}
</style>
