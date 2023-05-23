<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar extClass="nav" title="商品评价" id="top"></navigationBar>
		<view class="container p-bottom" v-if="goodsList.length && formData.length">
			<view class="goods-list">
				<view class="goods-item" v-for="(item, index) in goodsList" :key="index">

					<!-- 商品详情 -->
					<view class="goods-detail dis-flex flex-dir-row">
						<view class="left">
							<image lazy-load class="goods-image" :src="item.image ? item.image.file_path || '' : ''"></image>
						</view>
						<view class="right dis-flex flex-box flex-dir-column flex-x-around">
							<view class="goods_name">
								<text class="twolist-hidden">{{ item.goods_name }}</text>
							</view>
							<view class="goods-attr">
								<text class="f-26 col-8">{{ item.goods_attr }}</text>
							</view>
							<view class="goods-num">
								<text class="f-26 col-8">×{{ item.total_num }}</text>
							</view>
						</view>
					</view>

					<!-- 选择评价 -->
					<view class="score-row dis-flex">
						<view class="title">描述相符</view>
						<view @tap="setScore" :class="'score-item score__praise dis-flex flex-y-center flex-x-center ' + (formData[index].score==10?'__active':'')" :data-index="index" data-score="10">
							<view class="score">
								<text class="score__icon iconfont2 icon-Favorablecomments"></text>
								<text class="score__text">好评</text>
							</view>
						</view>
						<view @tap="setScore" :class="'score-item score__review dis-flex flex-y-center flex-x-center ' + (formData[index].score==20?'__active':'')" :data-index="index" data-score="20">
							<view class="score">
								<text class="score__icon iconfont2 icon-Mediumevaluation"></text>
								<text class="score__text">中评</text>
							</view>
						</view>
						<view @tap="setScore" :class="'score-item score__negative dis-flex flex-y-center flex-x-center ' + (formData[index].score==30?'__active':'')" :data-index="index" data-score="30">
							<view class="score">
								<text class="score__icon iconfont2 icon-negativecomment"></text>
								<text class="score__text">差评</text>
							</view>
						</view>
					</view>

					<!-- 评价内容 -->
					<view class="dis-flex content-row">
						<textarea class="f-28" v-model="formData[index].content" :data-index="index" maxlength="2000" placeholder="请输入评价内容 (留空则不评价)" placeholderStyle="color:#ccc;font-style:28rpx"></textarea>
					</view>

					<!-- 图片列表 -->
					<view class="image-list">
						<view class="image-preview" v-for="(imagePath, imageIndex) in formData[index].image_list" :key="imageIndex">
							<text class="image-delete iconfont2 icon-shanchu1" @tap.stop="deleteImage(index,imageIndex)"></text>
							<image lazy-load mode="aspectFill" :src="imagePath"></image>
						</view>
						<view @tap.stop="chooseImage(index)" class="image-picker dis-flex flex-dir-column flex-x-center flex-y-center" v-if="!formData[index].image_list || formData[index].image_list.length < 6">
							<text class="choose__icon iconfont icon-tubiao_xiangji"></text>
							<text class="choose__text">上传图片</text>
						</view>
					</view>
				</view>
			</view>

			<button class="flow-fixed-footers" @tap.stop="submit">确认提交</button>

		</view>
	</view>
</template>

<script>
	const App = getApp().globalData;
	export default {
		data() {
			return {
				// 页面参数
				options: null,
				// 待评价商品列表
				goodsList: [],
				// 表单数据
				formData: [],
				order_goods_id: '',
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad (options) {
			// 记录页面参数
			this.options = options; // 获取待评价商品列表
			this.getGoodsList();
		},
		methods: {
			/**
			 * 获取待评价商品列表
			 */
			getGoodsList () {
				let _this = this;

				App._get('user.comment/order', {
					order_id: this.options.order_id,
					order_goods_id: this.options.order_goods_id,
					wxapp_goods_id: this.options.wxapp_goods_id
				}, function (result) {
					let goodsList = [];
					goodsList[0] = result.data.goodsDetail;

					_this.setData({
						goodsList,
						formData: _this.initFormData(goodsList)
					});
				});
			},

			/**
			 * 初始化form数据
			 */
			initFormData (goodsList) {
				let data = [];
				goodsList.forEach(function (item) {
					data.push({
						// goods_id: item.goods_id,
						wxapp_goods_id: item.wxapp_goods_id,
						order_goods_id: item.order_goods_id,
						score: 10,
						content: '',
						image_list: [// 'http://tmp/wxe1997e687ecca54e.o6zAJs38WC0RISx_rydS4v4D778c.VzVJOgmUHlH3fd47776794bd803898289bebee12d94c.jpg',
							// 'http://tmp/wxe1997e687ecca54e.o6zAJs38WC0RISx_rydS4v4D778c.u8PUZLBNG2ELa7692fe0b9dfebf762cf0cb3677a42d7.jpg',
							// 'http://tmp/wxe1997e687ecca54e.o6zAJs38WC0RISx_rydS4v4D778c.8PjhMmysqokY55a19834d4135fbf72d4e653010d375e.jpg'
						],
						uploaded: []
					});
				});
				return data;
			},

			/**
			 * 设置评分
			 */
			setScore (e) {
				let dataset = e.currentTarget.dataset;
				this.formData[dataset.index].score = dataset.score
			},

			/**
			 * 选择图片
			 */
			chooseImage (index) {
				let imageList = this.formData[index].image_list; // 选择图片
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
					success: (res) => {
						let list = []
						res.tempFilePaths.forEach((item,index) => {
							// #ifdef H5 || MP
							if (res.tempFiles[index].size <= 2048000) {
							// #endif
							list.push(item)
							// #ifdef H5 || MP
							} else {
								App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
							}
							// #endif
						})
						this.formData[index].image_list = imageList.concat(list)
					}
				});
			},

			/**
			 * 删除图片
			 */
			deleteImage (index,imageIndex) {
				// let image = this.formData[index];
				// image = image.image_list.splice(imageIndex, 1);
				// this.formData[index].image_list = image;
				this.formData[index].image_list.splice(imageIndex, 1);
			},

			/**
			 * 表单提交
			 */
			submit () {
				let _this = this,
						formData = _this.formData; // 判断是否重复提交


				if (_this.submitDisable === true) {
					return false;
				} // 表单提交按钮设为禁用 (防止重复提交)


				_this.submitDisable = true;
				wx.showLoading({
					title: '正在处理...',
					mask: true
				}); // form提交执行函数

				let fromPostCall = function (formData) {

					App._post_form('user.comment/order', {
						order_id: _this.options.order_id,
						order_goods_id: _this.options.order_goods_id,
						formData: JSON.stringify(formData)
					}, function (result) {
						if (result.code === 1) {
							App.showSuccess(result.msg, function () {
								wx.navigateBack();
							});
						} else {
							App.showError(result.msg);
							_this.submitDisable = false;
						}
					}, function () {
						_this.submitDisable = false;
					}, function () {
						wx.hideLoading();
					});
				}; // 统计图片数量


				let imagesLength = 0;
				formData.forEach(function (item, formIndex) {
					item.content !== '' && (imagesLength += item.image_list.length);
				}); // 判断是否需要上传图片

				imagesLength > 0 ? _this.uploadFile(imagesLength, formData, fromPostCall) : fromPostCall(formData);
			},

			/**
			 * 上传图片
			 */
			uploadFile (imagesLength, formData, callBack) {
				// 文件上传

				let i = 0;
				formData.forEach((item, formIndex) => {
					if (item.content !== '') {
						item.image_list.forEach(function (filePath, fileKey) {
							App.uploadFile({
								filePath: filePath,
								success: function (res) {
									if (res.code === 1) {
										item.uploaded[fileKey] = res.data.wxapp_file_id;
									}
								},
								complete: function () {
									i++;
									if (imagesLength === i) {
										// 所有文件上传完成
										//console.log('upload complete'); // 执行回调函数
										callBack && callBack(formData);
									}
								}
							});
						});
					}
				});
			}
		}
	};
</script>
<style>
	@import "./comment.css";
</style>