<template>
<view class="increasePrice">
  <!-- 自定义标题栏 -->
  <navigationBar title="轮播设置">
  </navigationBar>
  <scroll-view>
  <view class="content">
    <view class="group">
      <view class="list">
        <div class="titleBox dis-flex flex-y-center">
          <div class="label">指示点形状</div>
          <div class="inputBox">
            <radio-group @change="radioChange">
              <div class="dis-flex flex-y-center">
                <div class="radioBox" v-for="(item, index) in list" :key="index">
                  <label>
                    <radio :checked="btnShape == item.value" :value="item.value" color="#FF7541" />
                    {{item.name}}
                  </label>
                </div>
              </div>
            </radio-group>
          </div>
        </div>
      </view>
      <view class="list">
        <div class="titleBox dis-flex flex-y-center">
          <div class="label">指示点颜色</div>
          <div class="inputBox dis-flex flex-y-center" @tap.stop="colorPopOpen">
            <div class="btnColor" :style="{background: btnColor}"></div>
          </div>
        </div>
      </view>
    </view>
    <view class="group">
      <view class="list">
        <div class="titleBox dis-flex flex-y-center" @tap.stop="setTime">
          <div class="label">切换时间</div>
          <div class="inputBox dis-flex flex-y-center flex-x-end">
            <div>
              {{time}}秒<text class="more iconfont2 icon-gengduobeifen2"></text>
            </div>
          </div>
        </div>
        <div class="tips">
          <text class="iconfont2 icon-jingshi f-24 m-r-10"></text>
          轮播图自动切换的间隔时间默认2秒，最多可设置5秒
        </div>
      </view>
			<template v-for="(item, index) in imgDataList">
				<view class="list_wrap m-t-20" :key="index" :class="index < (imgDataList.length-1) ? 'no-m-t' : ''">
					<view class="list">
						<div class="titleBox dis-flex flex-y-center flex-x-between">
							<div class="label">轮播图片</div>
							<div class="canvas" @tap.stop="tocanva(item, index)">
								作图神器
								<text class="canvasIcon iconfont2 icon-gengduobeifen2"></text>
							</div>
							<div class="delList" @tap.stop="delList(index)">
								<text class="iconfont2 icon-shanchu f-28"></text>
							</div>
						</div>
						<div class="contentBox">
							<div class="addImg" @tap.stop="chooseImage(item, index)">
								<image mode="aspectFill" :src="item.imgUrl" v-if="item.imgUrl && item.imgUrl != ''"></image>
								<text v-else class="iconfont2 icon-jiahao"></text>
							</div>
						</div>
						<div class="tips tipsBg">
							<text class="iconfont2 icon-jingshi f-24 m-r-10"></text>
							不会作图怎么办？点击图片，更换官方素材
						</div>
					</view>
					<view class="list">
						<div class="titleBox dis-flex flex-y-center">
							<div class="label">选择跳转</div>
							<div class="inputBox">
								<radio-group @change="listChange($event, index)">
									<div class="dis-flex flex-y-center">
										<div class="radioBox" v-for="(items, indexs) in imagelist" :key="indexs">
											<label>
												<radio :checked="item.linkUrlType == items.value" :value="items.value" color="#FF7541" />
												{{items.name}}
											</label>
										</div>
									</div>
								</radio-group>
							</div>
						</div>
					</view>
					<view class="list">
						<div v-if="item.linkUrlType == '1'" class="titleBox dis-flex flex-y-center">
							<div class="label">关联商品</div>
							<div class="inputBox dis-flex flex-y-center flex-x-end" @tap.stop="setVal('goods', index)">
								<div>
									{{item.goods_name == '' ? '选择关联商品' : item.goods_name}} <text class="more iconfont2 icon-gengduobeifen2"></text>
								</div>
							</div>
						</div>
						<div v-if="item.linkUrlType == '2'" class="titleBox dis-flex flex-y-center">
							<div class="label">功能模块</div>
							<div class="inputBox dis-flex flex-y-center flex-x-end">
								<picker @change="pickerChange($event, item)" :range="moduleList" range-key="name">
									<div>
										{{item.module == '' ? '请选择模块' : item.module }} <text class="more iconfont2 icon-gengduobeifen2"></text>
									</div>
								</picker>
							</div>
						</div>
						<div v-if="item.linkUrlType == '3'" class="titleBox dis-flex flex-y-center">
							<div class="label">链接网址</div>
							<div class="inputBox dis-flex flex-y-center flex-x-end" @tap.stop="setVal('linkUrl', index)">
								<!-- <div> -->
									<text class="col-3 word-wrap" v-if="item.linkUrl != ''">{{item.linkUrl}}</text>
									<text class="col-9" v-else>请输入网址</text>
									<div><text class="more iconfont2 icon-gengduobeifen2"></text></div>
								<!-- </div> -->
							</div>
						</div>
					</view>
				</view>
			</template>
      <div>
        <view class="list">
          <div class="addList" @tap.stop="addList">
            <text class="iconfont2 icon-jiahao"></text>
            添加一个
          </div>
        </view>
      </div>
    </view>
  </view>
  </scroll-view>
  <div class="bottomBox"></div>
  <view class="pop-btn">
    <view @tap.stop="confirm">确定</view>
  </view>
  <popup-input ref="popupInput"></popup-input>
  <canva ref="canva"></canva>
  <uni-popup ref="popup" type="bottom" @transed="colorPop">
      <colorPicker :color="btnColor" :show="showColor" @confirm="colorChanged" @cancel="colorPopClose"></colorPicker>
  </uni-popup>
  <uni-popup ref="popupImg" type="bottom">
    <div class="imgListBox">
      <div class="imgListTitle">官方素材
        <div class="closeImg" @tap="imgPopClose">
          <text class="iconfont2 icon-shanchu1"></text>
        </div>
      </div>
      <scroll-view class="imgListScroll" scroll-y>
        <div class="imgList" v-for="(item, index) in imgList" :key="index" :class="checkImg == item ? 'checkImg' : ''" @tap="checkImgItem(item)">
          <div class="imgBox">
            <image :src="item" model="aspectFill"></image>
          </div>
        </div>
      </scroll-view>
      <div class="imgSub">
        <div class="imgSubBut" @tap="imgSubBut">确定</div>
      </div>
    </div>
  </uni-popup>
	<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
</view>
</template>

<script>
const App = getApp().globalData;
import popupInput from '@/components/popup-input/index';
import canva from "@/components/robin-editor/canva";
import colorPicker from '@/components/robin-editor/colorPicker.vue'

export default {
  data() {
    return {
      showActionSheet: false,
      checkImg: '',
      imgList: [],
      itemList: [{
        text: "选择图片",
        color: "#2B2B2B",
      },{
        text: "素材中心",
        color: "#2B2B2B"
      },{
        text: "官方素材",
        color: "#2B2B2B"
      }],
      checkIndex: '',
      banners: {},
        time: '',
        btnShape: 'round',
        showColor: false,
        list: [{
            value: 'round',
            name: '圆形',
            checked: 'true'
          }, {
            value: 'square',
            name: '正方形'
          }, {
            value: 'rectangle',
            name: '长方形'
        }],
        imagelist: [{
            value: '1',
            name: '商品详情',
            checked: 'true'
          }, {
            value: '2',
            name: '功能模块'
          }, {
            value: '3',
            name: '网页'
        }],
        moduleList: [{
              name: '商品分类页',
              url: 'pages/category/index'
          }, {
              name: '商品列表页',
              url: 'pages/category/extend/list'
          }, {
              name: '商品搜索页',
              url: 'pages/search/index'
          }, {
              name: '购物车页面',
              url: 'pages/flow/index'
          }, {
              name: '个人中心页',
              url: 'pages/userIndex/index'
          }, {
              name: '订单列表页',
              url: 'pages/order/index'
          }, {
              name: '渠道中心页',
              url: 'pages/user/distribution/index'
          }, {
              name: '领券中心页',
              url: 'pages/coupon/coupon'
          }, {
              name: '我的优惠券页',
              url: 'pages/user/coupon/coupon'
          // }, {
          //     name: '拼团首页',
          //     id: 1,
          //     url: 'pages/sharing/index/index'
          }, {
              name: '砍价活动 - 首页',
              url: 'pages/bargain/index/index'
          }, {
              name: '砍价活动 - 我的砍价',
              url: 'pages/bargain/index/index?tab=1'
          }, {
              name: '整点秒杀 - 会场首页',
              url: 'pages/sharp/index/index'
          // }, {
          //     name: '小程序直播列表页',
          //     url: 'pages/live/index'
        }],
        imgDataList: [
          {
            linkUrlType: '1',
            imgUrl: '',
            linkUrl: '',
            module: '',
            goods_name: '',
            goods_id: '',
			goodsImage: ''
          }
        ],
        btnColor: '#FFFFFF'
      }
  },

  components: {
    popupInput,
    canva,
    colorPicker
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData()
  },
  onShow() {
  },
  methods: {
    imgSubBut() {
      this.imgDataList[this.checkIndex].imgUrl =this.checkImg
      this.$refs.popupImg.close()
    },
    checkImgItem(item) {
      this.checkImg = item
    },
    materialChange(list) {
      this.imgDataList[this.checkIndex].imgUrl = list[0] ? list[0].path : ''
    },
    itemClick(e) {
      this.showActionSheet = false
      if (e.index == 0) {
        let _this = this
        uni.chooseImage({
          count: 1,
					// #ifdef H5 || MP
					sizeType: ['compressed', 'original'],
					// #endif
					// #ifdef APP-PLUS
					sizeType: ['compressed', 'original'],
					// #endif
          success: (e)  => {
						// #ifdef H5 || MP
						if (e.tempFiles[0].size <= 2048000) {
						// #endif
            let data = e.tempFilePaths[0]
            App.uploadFile({
              name:'file',
              filePath: data,
              success: function(res) {
                if (res.code == 1) {
                  // console.log(_this.imgDataList)
                  // console.log(_this.checkIndex)
                  _this.imgDataList[_this.checkIndex].imgUrl = res.data.file_path
                } else {
                  _this.tui.toast(res.msg)
                }
              },
              fail: function(res) {
                  _this.tui.toast(res.msg)
              },
              complete: (res) => {
              }
            })
						// #ifdef H5 || MP
						} else {
							App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
						}
						// #endif
          }
        })
      } else if (e.index == 1) {
					uni.navigateTo({
						url: '/pages/myGoods/material/index?source=rotation&videoLimit=' + 0 + '&limit=' + 1
					});
      } else if (e.index == 2) {
        this.checkImg = this.imgList[0] || ''
        this.$refs.popupImg.open()
      }
    },
    closeActionSheet() {
      this.showActionSheet = false
    },
    getData() {
      App._get('shop.wxapp.page/getBannerSetting', {}, (result) => {
        if (result.code == '1') {
          this.banners = result.data.banners || {}
          this.time =  this.banners.params.interval || "2"
          this.btnColor =  this.banners.style.btnColor || "#fff"
          this.btnShape =  this.banners.style.btnShape || 'round'
          let bannersData = this.banners.data || []
          let list = []
          bannersData.forEach(element => {
            let obj = {
              linkUrlType: element.linkUrlType,
              imgUrl: element.imgUrl || '',
              linkUrl: element.linkUrl || '',
              module: '',
              goods_name: element.goods_name || '',
              goods_id: element.goods_id || '',
              goodsImage: element.goodsImage || ''
            }
            if (obj.linkUrlType == '2') {
              obj.module = this.getModule(element.linkUrl)
            }
            list.push(obj)
          });
          this.imgDataList = list
        }
      });
      App._get('shop.wxapp.page/getDefaultBanners', {}, (result) => {
        if (result.code == '1') {
          this.imgList = result.data.banners || []
          this.checkImg = this.imgList[0] || ''
        }
      });
    },
    getModule(linkUrl) {
      let name = ''
      this.moduleList.forEach(item => {
        if (linkUrl == item.url) {
          name = item.name
        }
      })
      return name
    },
    setTime() {
      this.$refs.popupInput._open(this.time, (val) => {
        this.time = val || ''
      })
    },
    colorPop(e) {
        this.showColor = e.show
    },
    colorPopClose() {
        this.$refs.popup.close()
    },
    imgPopClose() {
        this.$refs.popupImg.close()
    },
    colorPopOpen() {
      this.$refs.popup.open()
    },
    colorChanged(e) {
      this.btnColor = e.color || '#FFFFFF'
      this.colorPopClose()
    },
    canvaChange(index, imgUrl) {
      if (imgUrl) {
        this.imgDataList[index].imgUrl = imgUrl
      }
    },
    tocanva(item, index) {
        /* #ifdef H5 || APP-PLUS */
        this.$refs.canva.open({
          index: index
        }, (url) => {
          item.imgUrl = url
        })
        /* #endif */

        /* #ifdef MP-WEIXIN */
        uni.navigateToMiniProgram({
            appId: 'wx47bb17ae9c1d7bd3',
            path: 'pages/anonymous-templates/anonymous-templates',
            envVersion: 'release',
            success: () => {
                // console.log('success')
            },
            fail: () => {
                // console.log('fail')
            },
            complete: () => {
                // console.log('complete')
            },
        })
        /* #endif */
    },
    pickerChange(e, item) {
      let obj = this.moduleList[e.detail.value]
      item.linkUrl = obj.url
      item.module = obj.name
    },
    setVal(field, index) {
      if (field == 'goods') {
        uni.navigateTo({
          url: '/pages/myGoods/printorder/selectProduct/list?source=rotation&fieldName=' + index
        });
      } else if (field == 'linkUrl') {
        this.$refs.popupInput._open(this.imgDataList[index].linkUrl, (val) => {
          this.imgDataList[index].linkUrl = val || ''
        })
      }
    },
    proCheck(checkItem, fieldName) {
      this.imgDataList[fieldName].goods_name = checkItem.goods_name || ''
      this.imgDataList[fieldName].goods_id = checkItem.goods_id || ''
      this.imgDataList[fieldName].goodsImage = checkItem.goods_image || ''
    },
    chooseImage (item, index) {
      this.checkIndex = index
      this.showActionSheet = true
    },
    radioChange(evt) {
      this.btnShape = evt.detail.value
    },
    addList() {
      this.imgDataList.push({
        linkUrlType: '1',
        imgUrl: '',
        linkUrl: '',
        module: '',
        goods_name: '',
        goods_id: '',
		goodsImage: ''
      })
    },
    delList(index) {
      if (this.imgDataList.length == 1) {
        this.tui.toast('最少保留一个')
        return false
      }
      this.imgDataList.splice(index, 1)
    },
    listChange(evt, index) {
      this.imgDataList[index].linkUrlType = evt.detail.value
      this.imgDataList[index].linkUrl = ''
      this.imgDataList[index].module = ''
      this.imgDataList[index].goods_name = ''
      this.imgDataList[index].goods_id = ''
      this.imgDataList[index].goodsImage = ''
    },
    confirm() {
      let list = []
      this.imgDataList.forEach(element => {
            let obj = {
              linkUrlType: element.linkUrlType,
              imgUrl: element.imgUrl || '',
              linkUrl: element.linkUrl || '',
              goods_name: element.goods_name || '',
              goods_id: element.goods_id || '',
			  goodsImage: element.goodsImage || ''
            }
            list.push(obj)
      })
      let banner = {
        params: {
          interval: this.time,
        },
        style: {
          btnColor: this.btnColor,
          btnShape: this.btnShape,
        },
        data: list
      }
      App._post_form('shop.wxapp.page/updateBanner', {
        banner: JSON.stringify(banner)
      }, (result) => {
        this.$api.msg(result.msg)
        this.getData()
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>