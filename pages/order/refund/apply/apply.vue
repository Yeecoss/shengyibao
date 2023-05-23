<template>
<view class="bgf5">
	<!-- 自定义标题栏 -->
	<navigationBar title="申请售后" extClass="nav" id="top"></navigationBar>
	<view class="container m-bottom" v-if="goods">

		<form @submit="onSubmit" report-submit>

			<!-- 商品详情 -->
			<view class="goods-detail b-f dis-flex flex-dir-row" @tap.stop="onGoodsDetail(goods.wxapp_goods_id)">
				<view class="left">
					<image lazy-load class="goods-image" :src="goods.goods_image"></image>
				</view>
				<view class="right dis-flex flex-box flex-dir-column">
					<view class="goods-name">
						<text class="onelist-hidden">{{ goods.goods_name }}</text>
					</view>
					<view class="col-3">￥{{ goods.goods_sku.goods_price }}</view>
					<view class="col-9 f-24 dis-flex flex-x-between m-t-20">
						<view class="flex-box onelist-hidden col-6">{{ goods.goods_sku.goods_attr }}</view>
						<text class="m-l-20 col-6">×{{ goods.total_num }}</text>
					</view>
				</view>
			</view>
			
			<view class="main container">
				<view class="listBox bgf">
					<!-- 服务类型 -->
					<view class="list dis-flex">
						<view class="label">服务类型</view>
						<radio-group @change="typeChange" class="control dis-flex">
								<label v-for="(item,index) in serviceTypeList" class="radio-item dis-flex flex-y-center labelBox" :key="index">
									<radio class="radioItem" color="#FF7541" name="serviceType" :value="item.value" :checked="item.checked"></radio>
									<text>{{item.name}}</text>
								</label>
						</radio-group>
					</view>
				</view>
				
				<view class="listBox bgf m-top20">
					<view class="list dis-flex">
						<view class="label">申请原因</view>
						<view class="control text-right">
							<picker @change="pickerChange" :range="reason">
									<view class="uni-input onelist-hidden">
										<text>{{reasonOn || '请选择'}}</text>
										<text class="iconfont2 icon-gengduobeifen2"></text>
									</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list content">
						<view class="control">
							<input :class="content?'f-28':'col-9 f-28'" v-model="content" name="content" maxlength="50" placeholder-class="placeholderStyle" placeholder="选填：留言（50字内）"></input>
						</view>
					</view>
				</view>
			</view>

			<!-- 上传凭证 -->
			<!-- <view class="row-voucher b-f m-top20">
				<view class="row-title">上传凭证 (最多6张)</view>
				<view class="image-list">
					图片列表
					<view class="image-preview" v-for="(imagePath, imageIndex) in imageList" :key="imageIndex">
						<text class="image-delete iconfont2 icon-shanchu1" @tap.stop="deleteImage" :data-index="index" :data-image-index="imageIndex"></text>
						<image lazy-load mode="aspectFill" :src="imagePath"></image>
					</view>
					上传图片
					<form v-if="imageList.length < 6" @submit="chooseImage" report-submit="true">
						<button class="btn-normal" formType="submit">
							<view class="image-picker dis-flex flex-dir-column flex-x-center flex-y-center" style="margin:15rpx 0">
								<text class="choose__icon iconfont icon-tubiao_xiangji"></text>
								<text class="choose__text">上传图片</text>
							</view>
						</button>
					</form>
				</view>
			</view> -->
			<button class="submitBut f-32 col-f" formType="submit" :disabled="disable">确认提交</button>
		</form>

	</view>
</view>
</template>

<script>
const app = getApp().globalData;

export default {
  data() {
    return {
			disable: false,
      // 订单商品
      goods: null,
      // 订单详情
      detail: {},
      // 图片列表
      imageList: [],
      // 服务类型
      serviceType: 20,
			serviceTypeList:[{
				name: '退款',
				checked: true,
				value: '20',
			}, {
				name: '退货退款',
				checked: false,
				value: '10',
			}, ],
			reasonOn: '',
			reason: ['不想要','尺码不合适','颜色不想要','7天无理由','有瑕疵','快递丢件','其他',],
			content:'',
    };
  },

  components: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // 记录页面参数
    this.detail = JSON.parse(decodeURIComponent(options.order)); // 获取订单商品详情
    this.goods = JSON.parse(decodeURIComponent(options.order_goods)); // 获取订单商品详情
		let refund_money = this.goods.total_price - (this.goods.total_price/ this.detail.total_price) * this.detail.coupon_money;
  },
  methods: {
		// 表单提交
		onSubmit(e) {
		  let that = this;
			
			if (!that.reasonOn) {
				app.showError('申请原因不能为空');
				return false;
			} 
			// 判断是否重复提交
		  if (that.disable === true) {
		    return false;
		  } 
				// 表单提交按钮设为禁用 (防止重复提交)
			  that.disable = true;
			  uni.showLoading({
			    title: '正在处理...',
			    mask: true
			  }); 
				// form参数
			  let refund = {
					is_master: 1,
					order_id: that.detail.order_id,
					apply_desc: that.reasonOn,
					type: that.serviceType,
					wxapp_id: that.detail.wxapp_id,
					
					user_name: that.detail.address.name,
					user_phone: that.detail.address.phone,
					user_remark: that.content,
					
			    order_goods_id: that.order_goods_id,
			    type: that.serviceType,
			    content: e.detail.value.content
			  };
				let good = {
					goods_id: that.goods.order_goods_id,
					wxapp_goods_id: that.goods.wxapp_goods_id,
					goods_name: that.goods.goods_name,
					goods_sku_id: that.goods.goods_sku_id,
					goods_num: that.goods.total_num,
					goods_price: that.goods.goods_sku.goods_price,
					goods_image: that.goods.goods_image,
					goods_sku_name: that.goods.goods_sku.goods_attr,
				};
				let goods = [];goods.push(good);
				refund.goods = goods;
		
			// form提交执行函数
			app._post_form('user.refund/add', {refund: JSON.stringify(refund)}, res => {
				if (res.code == 1) {
					app.showSuccess(res.msg, function () {
						// 跳转售后管理页面
						uni.redirectTo({
							url: "../index"
						});
					});
				} else {
					app.showError(res.msg);
					that.disable = false;
				}
			}, function () {
				that.disable = false;
			}, function () {
				wx.hideLoading();
			});
		
		 
		},
		//原因
		pickerChange(e) {
		  let val = e.target.value
			this.reasonOn = this.reason[val];
		},
		//类型
		typeChange(e){
			this.serviceType = e.detail.value;
		},
		// 跳转商品详情
    onGoodsDetail (id) {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + id
      });
    },

    // 选择图片
    chooseImage: function (e) {
      let _this = this,
          index = e.currentTarget.dataset.index,
          imageList = _this.imageList;


      // 选择图片

      wx.chooseImage({
        count: 6 - imageList.length,
		// #ifdef H5 || MP
		sizeType: ['compressed', 'original'],
		// #endif
		// #ifdef APP-PLUS
		sizeType: ['compressed', 'original'],
		// #endif
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let list = []
          res.tempFilePaths.forEach((item,index) => {
            // #ifdef H5 || MP
            if (res.tempFiles[index].size <= 2048000) {
            // #endif
            list.push(item)
            // #ifdef H5 || MP
            } else {
              app.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
            }
            // #endif
          })
          _this.setData({
            imageList: imageList.concat(list)
          });
        }
      });
    },

    /**
     * 删除图片
     */
    deleteImage: function (e) {
      let dataset = e.currentTarget.dataset,
          imageList = this.imageList;
      imageList.splice(dataset.imageIndex, 1);
      this.setData({
        imageList
      });
    },
    /**
     * 上传图片
     */
    uploadFile: function (imagesLength, callBack, formData) {
      let uploaded = []; // 文件上传

      let i = 0;
      this.imageList.forEach(function (filePath, fileKey) {
        wx.uploadFile({
          url: getApp().globalData.api_root + 'upload/image',
          filePath: filePath,
          name: 'iFile',
          formData: {
            wxapp_id: getApp().globalData.getWxappId(),
            token: wx.getStorageSync('token')
          },
          success: function (res) {
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);

            if (result.code === 1) {
              uploaded[fileKey] = result.data.file_id;
            }
          },
          complete: function () {
            i++;

            if (imagesLength === i) {
              // 所有文件上传完成
              // console.log('upload complete');
              formData['images'] = uploaded; // 执行回调函数

              callBack && callBack(formData);
            }
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
	@import '@/pages/myGoods/coupon/detail.scss';
	@import "./apply.scss";
</style>