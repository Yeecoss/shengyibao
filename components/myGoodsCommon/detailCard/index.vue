<template>
<view>
  <popup v-if="showPopup" :show="showPopup" @clickmask="clickmask">
    <view class="popup-main" catchtouchmove='true'>
      <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
			<view class="poptitle f-32">店铺详情</view>
      <scroll-view  scroll-y style="max-height:800rpx;margin-top: 20rpx;">
        <div class="pop-input">
          <div class="shopInfo dis-flex">
            <div class="imgBox">
              <image :src="itemData.logo"></image>
            </div>
            <div class="info">
              <div class="shopTitle">{{itemData.name}}{{itemData.wxapp_remark && itemData.wxapp_remark != '' ? '(' + itemData.wxapp_remark + ')' : ''}}</div>
              <div class="optBox">
                <div class="but" @tap.stop="focus">{{itemData.is_follow ? '已关注' : '关注'}}</div>
                <div class="but" @tap.stop="moverGroup">移动分组</div>
              </div>
              <div class="notice three-hidden">
                {{itemData.notice}}
              </div>
            </div>
          </div>
          <div class="numBox dis-flex flex-y-center flex-x-between">
            <div>
              <div class="num">{{item.goods_total || 0}}</div>
              <div class="numTitle">商品总数</div>
            </div>
            <div>
              <div class="num col-m">{{itemData.rencent || 0}}</div>
              <div class="numTitle">上新</div>
            </div>
            <div>
              <div class="num">{{itemData.dealer_num || 0}}</div>
              <div class="numTitle">已同步</div>
            </div>
            <div>
              <div class="num">{{itemData.copy_num || 0}}</div>
              <div class="numTitle">已复制</div>
            </div>
          </div>
          <div class="remark three-hidden" v-if="categories">
            经营类别：{{categories}}
          </div>
          <div class="goodsImg dis-flex flex-y-center" v-if="item.goodImgs && item.goodImgs.length > 0">
            <div class="imgBox" v-for="(items, index) in item.goodImgs" :key="index">
              <image :src="items"></image>
            </div>
            <div class="toShop dis-flex flex-y-center" @tap.stop="toShop">
              <div>
                进店
              </div>
              <div>
                <text class="iconfont2 icon-more1"></text>
              </div>
            </div>
          </div>
          <div class="identityBox dis-flex flex-y-center flex-x-between" v-if="itemData.identity && itemData.company">
            <div class="identity" v-if="itemData.identity">身份已认证
              <text class="iconfont2 icon-Personalcertification"></text>
            </div>
            <div class="enterprise" v-if="itemData.company && item.companyImgs">企业已认证-{{item.companyImgs.length}}图
              <text class="iconfont2 icon-Personalcertification"></text>
            </div>
          </div>
          <div class="contactBox" v-if="itemData.contact_phone || itemData.wechat_id || itemData.wechat_id || itemData.address || itemData.service_qrcode || itemData.qrcode">
            <div class="contactItem" v-if="itemData.contact_phone">
              电话：
              <text class="col-m" @tap.stop="callPhone">{{itemData.contact_phone}}</text>
            </div>
            <div class="contactItem" v-if="itemData.wechat_id">
              微信：{{itemData.wechat_id}}
              <text class="iconfont2 icon"></text>
            </div>
            <div class="contactItem" v-if="itemData.address && itemData.address != ''">
              地址：{{itemData.address.address}}
            </div>
            <div class="shareImgBox dis-flex flex-y-center flex-x-between">
              <div class="shareImg" v-if="itemData.service_qrcode" @tap.stop="previewImage(itemData.service_qrcode)">
                <image :src="itemData.service_qrcode"></image>
                <div>客服二维码</div>
              </div>
              <div class="shareImg" v-if="item.qrcode" @tap.stop="previewImage(item.qrcode)">
                <image :src="item.qrcode"></image>
                <div>店铺二维码</div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <view class="pop-btn">
        <view @tap.stop="copy" class="submit">整店复制</view>
        <view @tap.stop="updata" class="submit submit1">整店同步</view>
      </view>
    </view>
  </popup>
  <!-- 菜单栏 -->
	<contact ref="contact"></contact>
		<!-- 同步 -->
		<updata ref="updata" nowNum="全部" :allChecked="true"></updata>
</view>
</template>

<script>
	import updata from '@/components/updata/updata';
import popup from "@/components/pop-manager/index";
	import contact from '@/components/myGoodsCommon/contact/index';
const App = getApp().globalData;

export default {
  data() {
    return {
      itemData: {},
      content: '',
      confirmText: '',
      categories: '',
      item: {},
      showPopup: false
    };
  },

  components: {
    popup,
    contact,
			updata
  },
  props: {
  },

  methods: {
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: this.itemData.contact_phone
      });
    },
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    toShop() {
      App.wxapp_id = this.itemData.wxapp_id;
      wx.setStorageSync("wxapp_id", this.itemData.wxapp_id)
      // this.back();
			uni.reLaunch({
				url:'/pages/index/index'
			})
    },
    focus() {
      this.$emit('focusItem', this.itemData, (is_follow) => {
        if (is_follow) {
          if (this.itemData.is_follow == 1) {
            this.itemData.is_follow = 0
          } else {
            this.itemData.is_follow = 1
          }
        }
      })
    },
    moverGroup() {
      this.$emit('moverGroup', this.itemData)
    },
    open(obj) {
      this.itemData = JSON.parse(JSON.stringify(obj))
      this.item = {}
      this.showPopup = true
			App._get('wxapp.user_follow/getStoreDetail',{wxapp_id: this.itemData.wxapp_id},res => {
				//判断是否被拉黑
				if(res.code==1){
          this.item = res.data
          this.categories = this.item.categories ? this.item.categories.join('、') : ''
        } else {
          this.item = {}
          this.categories = ''
        }
      })
      
    },
    
    clickmask() {
      this.showPopup = false
    },
    updata() {
      this.showPopup = false
			this.$refs.updata.allUpdata(this.itemData.wxapp_id, [], () => {
        this.showPopup = true
      });
    },
    copy() {
      this.showPopup = false
			this.$refs.updata.allCopy(this.itemData.wxapp_id, [], () => {
        this.showPopup = true
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>