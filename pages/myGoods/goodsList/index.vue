<template>
	<view class="container">
    <!-- 自定义标题栏 -->
    <navigationBar title="菜品管理" isHelpme id="top">
    </navigationBar>
		<!--header-->
		<view class="tui-header-box">
			<view class="tui-header flex-y-center">
        <view class="search-input">
          <view class="dis-flex flex-y-center search-box">
              <text class="iconfont2 icon-searchfor col-9"></text>
              <input v-model="searchKey" @blur="getListData(true)" class="input" placeholder="搜索商品" placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text"/>
          </view>
        </view>
				<view class="tui-top-item tui-top-item1" @tap="screen" data-index="3">
					<text class="mr-5">筛选</text>
          <text class="iconfont2 icon-screen f-30"></text>
				</view>
				<view class="tui-top-item tui-top-item2" @tap="allCheck">
					<text>{{is_all ? '完成' : '管理'}}</text>
				</view>
			</view>
		</view>
		<!--header-->
    <div v-if="!loading">
      <scroll-view v-if="goodsList.length > 0" :refresher-threshold="20" refresher-enabled :refresher-triggered="triggered" @refresherrefresh="refresherrefresh" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeightComput  + 'px;'">
        <div class="contentBox">
          <div class="listBox" v-for="(item, index) in goodsList" :key="index">
            <div class="goodsContent dis-flex flex-y-center" :class="is_all ? 'goodsContentAll' : 'goodsContentNo'" @tap="toDetail(item)">
              <div class="pad-r">
                <div class="imgBox">
                  <image mode="aspectFill" class="imageDefault" :src="item.goods.goods_image"></image>
                  <div class="state" v-if="item.goods_status.value == '20'">已下架</div>
                </div>
              </div>
              <div class="goodsInfo">
                <div class="goods_name dis-flex flex-y-center">
                  <text class="onelist-hidden" style="line-height:40rpx">{{item.goods.goods_name}}</text>
                  <text style="width:56rpx"></text>
                </div>
                <div class="goods_price">{{item.goods.min_price ? '￥' + item.goods.min_price : ''}}</div>
                <div class="dis-flex flex-y-center stateBox">
                  <!-- <div>
                    状态:<text class="state" :class="item.goods_status.value == '10' ? 'optItemR' : 'optItemY'">{{item.goods_status ? item.goods_status.text : ''}}</text>
                  </div>
                  <div class="line"></div> -->
                  <div class="onelist-hidden" style="max-width:200rpx">
                    分类:{{item.goods.tags ? item.goods.tags[0] || '' : ''}}
                  </div>
                  <!-- 暂时没有 -->
                  <div class="line"></div>
                  <div class="dis-flex flex-y-center souceContentBox" @tap.stop="showInfo(item)">
                    <div class="souceLabel">来源:</div>
                    <div class="dis-flex flex-y-center" style="width:100%" v-if="item.wxapp_goods_type.value == 2 || item.wxapp_goods_type.value == 1">
                      <div class="souceContent onelist-hidden">{{item.wxapp_goods_type.value == 2 ? '同步' : '复制'}}-<text class="col-m">{{item.parent_goods && item.parent_goods.wxapp ? item.parent_goods.wxapp.name : ''}}</text></div>
                      <div @tap.stop="optClick('updata', item)" v-if="item.parent_goods && item.parent_goods.goods_id != item.goods.goods_id">
                        <text class="iconfont2 icon-synchronization updataIcon"></text>
                      </div>
                    </div>
                    <div v-else class="souceContent onelist-hidden" style="width:100%">
                      自建
                    </div>
                  </div>
                </div>
                <div class="dis-flex flex-y-center stateBox m-top20">
                  <div>
                    销量:{{item.goods.goods_sales}}
                  </div>
                  <div class="line"></div>
                  <div>
                    库存:{{item.goods.stock_num || 0}}
                  </div>
                  <div class="line"></div>
                  <div>
                    添加:{{item.create_time.substring(0, 11)}}
                  </div>
                </div>
              </div>
            </div>
            <div class="goodsOpt dis-flex flex-y-center flex-x-around" v-if="!is_all">
              <div class="optItem" @tap.stop="optClick('onTop', item)">
                <div class="optIcon">
                  <text class="iconfont2 icon-Top"></text>
                </div>
                <div class="optText">置顶</div>
              </div>
              <div class="optItem" :class="item.is_hot.value == 1 ? 'col-m' : ''" @tap.stop="optClick('onHot', item)">
                <div class="optIcon">
                  <text class="iconfont2 icon-flame"></text>
                </div>
                <div class="optText">热销</div>
              </div>
              <div class="optItem" :class="item.shop_rmd.value == 1 ? 'col-m' : ''" @tap.stop="optClick('onRecommend', item)">
                <div class="optIcon">
                  <text class="iconfont2 icon-givethethumbs-up"></text>
                </div>
                <div class="optText">推荐</div>
              </div>
              <div class="optItem" @tap.stop="optClick('comment', item)">
                <div class="optIcon">
                  <text class="iconfont2 icon-commenton"></text>
                </div>
                <div class="optText">评论({{item.comment_data_count}})</div>
              </div>
              <div class="optItem" :class="item.goods_status.value == '10' ? '' : 'optItemY'" @tap.stop="optClick('shelf', item)">
                <div class="optIcon">
                  <text class="iconfont2" :class="item.goods_status.value == '10' ? 'icon-undercarriage' : 'icon-grounding'"></text>
                </div>
                <div class="optText">{{item.goods_status.value == '10' ? '下架' : '上架'}}</div>
              </div>
            </div>
            <text v-if="!is_all" class="rightTop iconfont2 icon-more-mini" @tap.stop="openSheet(item)"></text>
            <div class="checkItem" v-else @tap.stop="radioChange(item)">
              <radio color="#FF7541" :checked="item.checked" />
              <div class="clickBox"></div>
            </div>
          </div>
          <view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
          <view v-if="more_loading" class="no-more f-24 col-9">加载中...</view>
        </div>
      </scroll-view>
      <tui-no-data v-else fixed imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449096c6938492.png" :imgWidth="264" :imgHeight="264">
        <div class="col-9">
          暂无数据
        </div>
      </tui-no-data>
      <div class="footBox dis-flex flex-y-center" v-if="is_all">
        <div class="allCheck" @tap.stop="allCheckedItem">
          <radio color="#FF7541" :checked="allChecked" />
          <div class="clickBox"></div>
        </div>
        <div class="selectNum">
          <div class="dis-flex flex-y-center" @tap.stop="openShowNum">
            <div class="selectCheckNum"> {{checkListNum}}/</div>
            <div class="selectAllNum dis-flex flex-y-center">
              <div class="nowNum">{{nowNum}}</div>
              <div class="iconBox">
                <text class="iconfont2 icon-pull-down"></text>
              </div>
            </div>
          </div>
        </div>
        <div class="allOpt">
          <div class="optBut" @tap.stop="showSelectPopup">操作</div>
          <tui-bubble-popup :show="selectPopup" position="absolute" direction="bottom" @close="closeSelectPopup" width="192rpx"
            left="-100rpx" top="-40rpx" translateY="-100%" triangleRight="30rpx" triangleBottom="-22rpx" backgroundColor="white" color="#666666">
            <view class="tui-menu-item" @tap="selectPopupItem('shelf')">上架<text class="iconfont2 icon-grounding"></text></view>
            <view class="tui-menu-item" @tap="selectPopupItem('downShelf')">下架<text class="iconfont2 icon-undercarriage"></text></view>
            <view class="tui-menu-item" @tap="selectPopupItem('onHot')">热销<text class="iconfont2 icon-sellwell"></text></view>
            <view class="tui-menu-item" @tap="selectPopupItem('onRecommend')">推荐<text class="iconfont2 icon-givethethumbs-up"></text></view>
            <view class="tui-menu-item" @tap="selectPopupItem('updata')">同步<text class="iconfont2 icon-synchronization"></text></view>
            <view class="tui-menu-item" @tap="selectPopupItem('addNum')">增加库存<text class="iconfont2 icon-stock"></text></view>
            <view class="tui-menu-item" @tap="selectPopupItem('delete')">删除<text class="iconfont2 icon-delete"></text></view>
          </tui-bubble-popup>
        </div>
      </div>
      <div class="footBox dis-flex flex-y-center flex-x-center" v-else>
        <div class="addGoods" @tap.stop="addGoods">
          <text class="iconfont2 icon-jiahao"></text>
          新增商品
        </div>
      </div>
    </div>
    <!-- 右拉筛选 -->
    <right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
    <!-- 底部弹窗 -->
		<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
    <!-- 底部弹窗 -->
		<tui-actionsheet :show="showNumList" :item-list="numList" @click="numListClick" @cancel="closeNumList"></tui-actionsheet>
    
    <!-- 提示弹窗 -->
    <popup-tips ref="popupTips" :title="popupObj.title" :content="popupObj.content" @tipsCallback="tipsCallback"></popup-tips>
    <popup-input ref="popupInput" title="增加库存"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<guidePage ref="guidePage"></guidePage>
    <show-tip ref="showTip" @optClick="optClick"></show-tip>
    <div v-show="loading">
      <loading ></loading>
    </div>
	</view>
</template>

<script>
import popupTips from '@/components/popup-tips/index';
import popupInput from '@/components/popup-input/index';
import rightDrawer from './rightDrawer/index';
import guidePage from '@/components/guide-page';
import showTip from './comment/show-tip';
import loading from '@/components/loading';

const App = getApp().globalData;
export default {
	data() {
		return {
      itemData: {},
      triggered: false,
      searchKey: '',
      scrollHeight: 0,
      goodsList: [],
      page: 1,
      last_page: 1,
			total: 0,
      loading: true,
      no_more: false,
			more_loading: false,
      is_all: false,
      allChecked: false,
      selectPopup: false,

      stock_num: 0, // 库存
      nowNum: '50', // 全选
      checkList: [], // 选中

      showActionSheet: false,
      itemList: [{
        text: "分享",
        color: "#333333",
        noShow: 1
      },{
        text: "同步更新",
        color: "#333333",
        redDot: 1,
        noShow: 0
      }, {
        text: "编辑",
        color: "#333333"
      }, {
        text: "删除",
        color: "#333333"
      }],
      popupOpt: {
        onTop: {
          on: {
            title: '确定置顶该商品？',
            content: ''
          }
        },
        onRecommend: {
          on: {
            title: '确定将该商品设为推荐？',
            content: ''
          },
          down: {
            title: '确定取消该商品推荐？',
            content: ''
          }
        },
        onHot: {
          on: {
            title: '确定将该商品设为热销？',
            content: ''
          },
          down: {
            title: '确定取消该商品热销？',
            content: ''
          }
        },
        delete: {
          on: {
            title: '确定删除该商品？',
            content: ''
          }
        },
        updata: {
          on: {
            title: '是否更新该商品？',
            content: ''
          }
        },
        shelf: {
          on: {
            title: '确定上架该商品？',
            content: '上架后将在店铺中显示'
          },
          down: {
            title: '确定下架该商品？',
            content: '下架后将在不在店铺中显示'
          }
        }
      },
      popupOptAll: {
        onRecommend: {
          title: '确定将所选商品设为推荐？',
          content: ''
        },
        onHot: {
            title: '确定将所选商品设为热销？',
            content: ''
        },
        delete: {
            title: '确定删除所选商品？',
            content: ''
        },
        shelf: {
          title: '确定上架所选商品？',
          content: ''
        },
        downShelf: {
          title: '确定下架所选商品？',
          content: ''
        },
        addNum: {
          title: '确定所选商品加50库存？',
          content: ''
        },
        updata: {
          title: '确定同步所选商品？',
          content: ''
        }
      },
      showNumList: false,
      numList: [{
        text: "50",
        color: "#333333",
      }, {
        text: "100",
        color: "#333333"
      }, {
        text: "全部",
        color: "#333333"
      }],
      popupObj: {
        title: '',
        content: '',
        opt: '',
        isAll: false
      },
      // 高级搜索
      otherObj: {}
		};
  },
  onShow() {
    this.getListData(true)
  },
	onLoad: function(options) {
  },
  mounted() {
    this.$nextTick(() => {
      this.setListHeight()
    })
  },
  computed: {
    checkListNum() {
      let num = 0
      if (this.allChecked) {
		if (this.nowNum == '50') {
			if (this.total < 50) {
				num = this.total
			} else {
				num = this.nowNum
			}
		}
		if (this.nowNum == '100') {
			if (this.total < 100) {
				num = this.total
			} else {
				num = this.nowNum
			}
		}
		if (this.nowNum == '全部') {
			num = this.nowNum
		}
      } else {
        num = this.checkList.length
      }
      return num;
    },
    scrollHeightComput() {
      let height = this.scrollHeight
      if (this.is_all) {
        height -= 50
      }
      return height
    }
  },
  methods: {
    addGoods() {
      uni.navigateTo({
        url: '/pages/myGoods/goodsAdd/index?isList=1'
      })
    },
    showInfo(item) {
      this.$refs.showTip.open(item)
    },
    refresherrefresh() {
		this.no_more = false
      this.triggered = true
      this.getListData(true,() => {
        this.triggered = false
      });
    },
    allCheckedItem() {
      this.allChecked = !this.allChecked
      this.upCheckList(true)
    },
    upCheckList(unit) {
      this.checkList = []
      if (this.allChecked) {
        if (this.nowNum == '50') {
          this.goodsList.forEach((item, index) => {
            if (index < 50) {
              item.checked = true
              this.checkList.push(item.wxapp_goods_id)
            } else {
              item.checked = false
            }
          })
        }
        if (this.nowNum == '100') {
          this.goodsList.forEach((item, index) => {
            if (index < 100) {
              item.checked = true
              this.checkList.push(item.wxapp_goods_id)
            } else {
              item.checked = false
            }
          })
        }
        if (this.nowNum == '全部') {
          this.goodsList.forEach((item, index) => {
            item.checked = true
            this.checkList.push(item.wxapp_goods_id)
          })
        }
      } else {
        if (unit) {
          this.goodsList.forEach((item, index) => {
            item.checked = false
          })
        } else {
          this.goodsList.forEach((item, index) => {
            if (item.checked) {
              this.checkList.push(item.wxapp_goods_id)
            }
          })
        }
      }
    },
    numListClick(e) {
      this.showNumList = false
      this.nowNum = this.numList[e.index].text
    },
    closeNumList() {
      this.showNumList = false
    },
    openShowNum() {
      this.showNumList = true
    },
    closeSelectPopup() {
      this.selectPopup = false
    },
    // 批量操作
    selectPopupItem(opt) {
      if (!this.allChecked && this.checkList.length == 0) {
        this.tui.toast('请先选择商品')
        return false
      }
      this.selectPopup = false
      let next = (title) => {
        this.popupObj = {
          title: title ? title : this.popupOptAll[opt].title,
          content: this.popupOptAll[opt].content,
          opt: opt,
          isAll: true
        }
        this.$refs.popupTips.open()
      }
      if (opt == 'addNum') {
        this.$refs.popupInput._open('', (val) => {
          if (val) {
            this.stock_num = val
            // let title = '确定所选商品库存？'
            // console.log(title)
            this.popupObj = {
              title: '',
              content: this.popupOptAll[opt].content,
              opt: opt,
              isAll: true
            }
            this.tipsCallback()
            // next(title)
          }
        })
      } else {
        next()
      }
    },
    showSelectPopup(opt) {
      this.selectPopup = !this.selectPopup
    },
    radioChange(item) {
      if (item.checked) {
        let index = this.checkList.indexOf(item.wxapp_goods_id)
        if (index != -1) {
          this.checkList.splice(index, 1)
        }
      } else {
        this.checkList.push(item.wxapp_goods_id)
      }
      item.checked = !item.checked
			this.allChecked = false
    },
    allCheck() {
      // 批量管理
      if (this.is_all) {
        this.checkList = []
        this.allChecked = false
        this.goodsList.forEach(item => {
          item.checked = false
        })
      }
      this.is_all = !this.is_all
    },
    toDetail(item) {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + item.wxapp_goods_id+ '&wid='+item.wxapp_id
      });
    },
    rightDrawerChange(obj) {
      this.otherObj = obj
      this.getListData(true)
    },
    screen() {
      this.$refs.rightDrawer.screen()
    },
    // 获取数据
    getListData(unit, next) {
      unit ? this.page = 1 : ''
      let obj = {
        page: this.page,
        search: this.searchKey || ''
      }
	  if (this.page != 1) {
		  this.more_loading = true
	  }
      obj = Object.assign(obj, this.otherObj)
      App._get('shop.wxapp.goods/index', obj, (result) => {
        this.loading = false
		if (this.page != 1) {
			this.more_loading = false
		}
        let newList = result.data.list.data || []
       this.total = result.data.list.total || 0
        newList.forEach(element => {
            element.checked = false
            if (element.category) {
              element.categoryName = element.category.first_name + '>' + element.category.sec_name + '>' + element.category.name
            }
        });
        this.goodsList = unit ? newList : this.goodsList.concat(newList)
        if (next) {
          next()
        }
        this.last_page = result.data.list.last_page || 1
        this.upCheckList(unit)
      })
    },
    /**
     * 设置商品列表高度
     */
    setListHeight() {
      const query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        let systemInfo = wx.getSystemInfoSync(),
            rpx = systemInfo.windowWidth / 750,
            // tap高度
        scrollHeight = systemInfo.windowHeight - res[0].height - 45; // swiper高度

        this.scrollHeight = scrollHeight
      });
    },
    bindDownLoad() {
      // 已经是最后一页
      if (this.page >= this.last_page) {
        this.no_more = true
        return false;
      } // 加载下一页列表
      this.page ++;
      this.getListData();
    },
    // 底部弹出
    itemClick(e) {
      this.showActionSheet = false
      if (e.index == 0) {
        this.optClick('onShare')
      } else if (e.index == 1) {
        this.optClick('updata')
      } else if (e.index == 2) {
        this.optClick('otEdit')
      } else if (e.index == 3) {
        this.optClick('delete')
      }
    },
    closeActionSheet() {
      this.showActionSheet = false
    },
    openSheet(item) {
      this.itemData = item
      if (item.redDot) {
        this.itemList[1].redDot = 1
      } else {
        this.itemList[1].redDot = 0
      }
      if (item.wxapp_goods_type.value == 2) {
        this.itemList[1].noShow = 0
      } else {
        this.itemList[1].noShow = 1
      }
      this.showActionSheet = true
    },
    optClick(opt,item) {
      if (item) {
        this.itemData = item
      }
      if (opt == 'updata') {
        if (this.itemData.wxapp_goods_type.value != 2) {
          return
        } else if (this.itemData.parent_goods.goods_id == this.itemData.goods.goods_id) {
          this.$api.msg('暂无数据同步！')
          return
        }
      }
      // console.log(opt)
      if (opt == 'comment') {
        let commentStr = ''
        let goods_name = this.itemData.goods.goods_name || ''
        let goods_min_price = this.itemData.goods.min_price || ''
        let goods_sales = this.itemData.goods.goods_sales || ''
        let goods_image = this.itemData.goods.goods_image || ''
        if (goods_name != ('' || null)) {
          commentStr += '&goods_name=' + goods_name
        }
        if (goods_min_price != ('' || null)) {
          commentStr += '&goods_min_price=' + goods_min_price
        }
        if (goods_sales != ('' || null)) {
          commentStr += '&goods_sales=' + goods_sales
        }
        if (goods_image != ('' || null)) {
          commentStr += '&goods_image=' + goods_image
        }
        uni.navigateTo({
          url: '/pages/myGoods/goodsList/comment/comment?goods_id=' + this.itemData.wxapp_goods_id + commentStr
        })
    } else if (opt == 'onShare') {
    } else if (opt == 'otEdit') {
		if (this.itemData.isSpecLocked) {
			this.$api.msg('此商品当前正在参加其他活动，暂不支持更改')
		} else {
			uni.navigateTo({
			  url: '/pages/myGoods/goodsAdd/index?goods_id=' + this.itemData.wxapp_goods_id + '&isList=1'
			})
		}
    } else {
        let onType = 'on'
        if (opt == 'onRecommend') {
          if (item.shop_rmd.value == 1) {
            onType = 'down'
          }
        }
        if (opt == 'onHot') {
          if (item.is_hot.value == 1) {
            onType = 'down'
          }
        }
        if (opt == 'shelf') {
          if (item.goods_status.value == '10') {
            onType = 'down'
          }
        }
        this.popupObj = {
          title: this.popupOpt[opt][onType].title,
          content: this.popupOpt[opt][onType].content,
          opt: opt,
          isAll: false
        }
        this.$refs.popupTips.open()
      }
    },
    tipsCallback() {
      if (this.popupObj.isAll){
        let goods = {}
        if (this.allChecked) {
          let batch_num = ''
          if (this.nowNum == '全部') {
            batch_num = '-1'
          }
          if (this.nowNum == '50') {
            batch_num = '50'
          }
          if (this.nowNum == '100') {
            batch_num = '100'
          }
          goods.batch_num = batch_num
          goods.params = this.otherObj
        } else {
          goods.id = this.checkList
        }
        let url = ''
        if (this.popupObj.opt == 'shelf') {
            url = 'shop.wxapp.goods/batchPutOn'
        }
        if (this.popupObj.opt == 'downShelf') {
            url = 'shop.wxapp.goods/batchPutOff'
        }
        if (this.popupObj.opt == 'onHot') {
            url = 'shop.wxapp.goods/batchHot'
            goods.is_hot = 1
        }
        if (this.popupObj.opt == 'onRecommend') {
            url = 'shop.wxapp.goods/batchRmd'
            goods.is_rmd = 1
        }
        if (this.popupObj.opt == 'addNum') {
            url = 'shop.wxapp.goods/batchStock'
            goods.stock_num = this.stock_num
        }
        if (this.popupObj.opt == 'delete') {
            url = 'shop.wxapp.goods/batchDelete'
        }
        if (this.popupObj.opt == 'updata') {
            url = 'shop.wxapp.goods/batchSync'
        }
        App._post_form(url, {
          goods: JSON.stringify(goods)
        }, (result) => {
          if(result.code==1){
            this.tui.toast(result.msg)
            this.getListData(true)
            this.allCheck()
					}else{
            this.tui.toast(result.msg)
					}
        })
      } else {
        let data = {
          wxapp_goods_id: this.itemData.wxapp_goods_id
        }
        let url = ''
        if (this.popupObj.opt == 'shelf') {
            url = 'shop.wxapp.goods/state'
            data.state = (this.itemData.goods_status.value == '10' ? '0' : '1')
        }
        if (this.popupObj.opt == 'onHot') {
            url = 'shop.wxapp.goods/hot'
            data.hot = (this.itemData.is_hot.value == 1 ? 0 : 1)
        }
        if (this.popupObj.opt == 'onTop') {
            url = 'shop.wxapp.goods/first'
        }
        if (this.popupObj.opt == 'delete') {
            url = 'shop.wxapp.goods/delete'
        }
        if (this.popupObj.opt == 'updata') {
          let obj = {
            id: [this.itemData.wxapp_goods_id]
          }
          data.goods = JSON.stringify(obj)
          url = 'shop.wxapp.goods/batchSync'
        }
        if (this.popupObj.opt == 'onRecommend') {
            url = 'shop.wxapp.goods/rmd'
            data.rmd = (this.itemData.shop_rmd.value == 1 ? 0 : 1)
        }
        App._post_form(url, data, (result) => {
          App.showSuccess(result.msg);
          this.getListData(true)
        })
      }
    }
  },
  components: {
    'right-drawer': rightDrawer,
    popupTips,
    popupInput,
    guidePage,
		loading,
    showTip
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
