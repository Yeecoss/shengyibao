<template>
<view class="shopInformation">
  <!-- 自定义标题栏 -->
  <navigationBar title="门店照片">
  </navigationBar>
  <view class="cardBox">
    <tui-upload ref="tuiUpload" addText="图片" :limit="3" :videoLimit="0" source="goods" :value="baseImages" @complete="result" @remove="remove" isShop></tui-upload>
  </view>
  <div class="col-9 f-24 tipBox">
    <text class="iconfont2 icon-jingshi col-9 f-24"></text>
    上传3张门店图片
  </div>
  <button class="footer" :class="disable ? 'disable' : ''" @tap.stop="submit">{{itemImages.length > 0 ? '重新提交' :'提交'}}</button>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      itemImages: [],
      baseImages: [],
      images: []
    };
  },
  computed: {
    disable() {
      let disable = JSON.stringify(this.itemImages) == JSON.stringify(this.images)
      return disable
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getShowData()
  },

  methods: {
    result(e) {
      let arr = []
      let baseImages = []
      e.imgArr.forEach(element => {
        arr.push(element.path)
        baseImages.push({
          type: element.type,
          path: element.path,
          wxapp_file_id: element.wxapp_file_id
        })
      });
      this.images = arr;
      this.baseImages = baseImages;
    },
    remove(e) {
      //移除图片
      let index = e.index
      this.images.splice(index, 1);
      this.baseImages.splice(index, 1);
    },
    // 展示数据
    getShowData () {
      App._get('shop.setting/storePics', {}, (result) => {
        if (result.code == 1) {
          let baseImages = []
          let arr = []
          let data = result.data || []
          this.itemImages = data
          data.forEach((item) => {
            arr.push(item)
            baseImages.push({
              type: 'image',
              path: item
            })
          })
          this.images = arr;
          this.baseImages = baseImages;
          this.$nextTick(() => {
            if (this.$refs.tuiUpload) {
              this.$refs.tuiUpload.unit()
            }
          })
        }
      })
    },
    submit() {
      App._post_json_form('shop.setting/storePics', {
        store_pics: this.images
      }, (result) => {
        this.$api.msg(result.msg)
        if (result.code == 1) {
          wx.navigateBack();
        }
      })
    },
    materialChange(list) {
			let images = [];
			list.forEach(element => {
			  images.push(element.path)
			});
			this.images = images
			this.baseImages = list;
      // list.forEach(element => {
      //   this.formData.images.push(element.wxapp_file_id)
      //   this.baseImages.push({
      //     type: element.type,
      //     path: element.path,
      //     wxapp_file_id: element.wxapp_file_id
      //   })
      // });
      this.$nextTick(() => {
        if (this.$refs.tuiUpload) {
          this.$refs.tuiUpload.unit()
        }
      })
    },
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>