<template>
<div class="retailShop">
    <navigationBar title="详情"></navigationBar>
    <div class="content">
      <div class="padBox"></div>
      <div class="list">
        <div class="shopBox dis-flex flex-y-center">
          <div class="shopImgBox">
            <image mode="aspectFill" :src="logo"></image>
          </div>
          <div class="widthBox"></div>
          <div>
            <div class="shopName">{{name}}</div>
            <div class="time">{{create_time}}</div>
          </div>
        </div>
        <div class="detailInfo" v-if="items.goods">
          <div class="goodsInfo">
            <div class="goodsName twolist-hidden">{{items.goods.goods_name}}</div>
            <!-- 商品图片 -->
            <picture-group :images="image" :mini="true"></picture-group>
            <div class="optBox dis-flex flex-y-end">
                <button class="opt-m-r but" @tap.stop="upload(items)">下载</button>
                <button class="opt-m-r but" @tap.stop="copy(items)">复制</button>
                <!-- #ifdef MP -->
                <button class="but" open-type="share">分享</button>
                <!-- #endif -->
                <!-- #ifdef APP-PLUS -->
                <button class="but" @click.stop="share()">分享</button>
				        <!-- #endif -->
                <div v-if="items.open_dealer" class="updata updataActive" @tap.stop="updata(items)">
                  <text>同步</text>
                </div>
            </div>
          </div>
        </div>
      </div>
  </div>
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- 同步 -->
		<updata ref="updata"></updata>
</div>
</template>

<script>
const App = getApp().globalData;
import pictureGroup from '@/components/goods/picture-group/index';
import downloadFile from '@/components/download-file';
const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import updata from '@/components/updata/updata';
export default {
  data() {
    return {
      wxapp_goods_id: '',
      wxapp_id: '',
      items: {},
			create_time: '',
      name: '',
      logo: '',
      notice: '',
      vip: '',
      myVip: '',
      image: [],
    };
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    return {
      title: this.items.goods.goods_image,
      path: '/pages/retailShop/shopAbout/shopDetail/detail/index?wxapp_goods_id=' + this.wxapp_goods_id + '&wxapp_id=' + this.wxapp_id,
      imageUrl: this.items.goods.goods_name
    };
  },
  components: {
    pictureGroup,
		downloadFile,
			updata
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.wxapp_goods_id = options.wxapp_goods_id || ''
    this.wxapp_id = options.wxapp_id || ''
  },
  onShow() {
    this.getData()
    this.getInfo()
    this.getMyVip()
  },
  methods: {
			getMyVip () {
				App._get('user.index/vipDetail', {}, (result) => {
					if (result.code == '1') {
						let data = result.data.userInfo || {}
						this.myVip = data.vip || ''
					}
				})
			},
			share() {
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5,
					imageUrl: this.items.goods.goods_image + '?vframe/jpg/offset/0|imageView2/1/w/300/h/300',
					title: this.items.goods.goods_name,
					miniProgram: {
						id: App.applets_id,
						path: '/pages/retailShop/shopAbout/shopDetail/detail/index?wxapp_goods_id=' + this.wxapp_goods_id + '&wxapp_id=' + this.wxapp_id,
						type: 0,
						webUrl: 'http://uniapp.dcloud.io'
					},
					success: ret => {
						// console.log(JSON.stringify(ret));
					}
				});
			},
			updata(item) {
				this.$refs.updata.updata(item);
			},
      copy(item) {
				this.$refs.updata.copy(item);
      },
    // 点击下载
    upload(item){
      let files = item.goods.image || []
      if (files.length == 0) {
        return false
      }
      const that = this;
      let uploads = [];
      files.forEach(item => {
        uploads.push(item.file_path)
      });
      if(uploads!=''){
        uni.showModal({
          title: '友情提示',
          content: '是否下载该商品的图片/视频？',
          confirmColor: '#FF7541',
          confirmText: '是',
          cancelText: '否',
          success: (res) => {
            if(res.confirm){
              let name = item.goods.goods_name;
              that.clipboard(name)
              that.$refs.download._downloadFileS(uploads);
            }
          }
        });
      }else{
        that.$api.msg('该商品暂无可下载的图片/视频');
      }
    },
    //下载回调
    comfirmStatusS (promise) {
      promise.then((res) => {
        uni.hideLoading();
        uni.hideToast();
        this.$api.msg(res?"下载成功，文案已复制":'取消保存')
      })
    },
    // 复制
    clipboard(data) {
      thorui.getClipboardData(data, (res) => {
        // #ifdef H5 || MP-ALIPAY
        if (res) {
          // this.$refs.toast.showTips({msg: "复制标题成功"});
        } else {
          // this.$refs.toast.showTips({msg: "复制失败"});
        }
        // #endif
      })
    },
    getInfo () {
      App._get('wxapp/info', {
				wxapp_id: this.wxapp_id
      }, (result) => {
        let values = result.data.shop || {}
        this.name = values.name || ''
        this.logo = values.logo || ''
        this.notice = values.notice || ''
        this.vip = values.vip || ''
      })
    },
    getData() {
				let obj = {
					wxapp_goods_id: this.wxapp_goods_id,
				  wxapp_id: this.wxapp_id
				}
				App._get('wxapp.goods/detail', obj, (result) => {
          this.items = result.data.detail || {}
          let image = this.items.goods.image || []
          let newList = []
          image.forEach(element => {
            newList.push({
              file_type: element.file_media,
              file_path: element.file_path,
            })
          });
          this.create_time = this.items.create_time.substring(5, 10).replace('-', '/') + '/' + this.items.create_time.substring(0, 4)
          this.image = image
				})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>