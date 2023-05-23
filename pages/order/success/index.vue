<template>
	<view class="page">
		<!-- 自定义标题栏 -->
		<navigationBar :title="ntitle" extClass="nav" id="top" color="#fff" background="transparent"></navigationBar>
		<view class="main">
			<view class="circular_bg"></view>
			<view class="status">
				<view class="title dis-flex flex-y-center flex-x-center"><view><text class="iconfont2 icon-duihao f-36"></text></view>您有新的订单</view>
				<!-- <view class="f-28 m-t-20 status_p">请转发订单给商家并付款</view> -->
				<view class="f-28 m-t-20 status_p onelist-hidden">来自：{{info.user.nickName?info.user.nickName:''}}</view>
			</view>
			<view class="content">
				<view class="order_info fl">
					<view class="f-32 col-3 pad">商品数量：{{info.order.goods_num}}（件）</view>
					<view class="f-32 col-3 m-t-20 pad p-b-20">
						实付金额：¥{{info.order.order_price}}
						<text class="app-red f-26" v-if="info.order.wholesale_type!='undefined'&&info.order.wholesale_type!=undefined">
							{{info.order.wholesale_type?'(渠道价)':(info.order.wholesale_type==0?'(折扣价)':'')}}
						</text>
					</view>
				</view>
				<view class="seller_wrap fl m-l-20">
					<view class="seller_img">
						<image :src="info.wxapp_user.avatarUrl" mode="aspectFill"></image>
						<view class="lianxi" @tap.stop="toSheet"><text class="iconfont2 icon-WeChat col-f f-32"></text></view>
					</view>
					<view class="seller_name col-3 f-28">{{info.wxapp_user.user?info.wxapp_user.user.nickName:info.wxapp_user.nickName}}</view>
				</view>
			</view>
			<view class="order_info_add openCopyOrder f-28 t-c" @tap="openCopyOrder">复制订单详情</view>
			<view class="order_info_add f-24 col-6 m-t-10 dis-flex flex-y-center flex-x-center wrap30 "><text class="iconfont2 icon-jingshi f-24 m-r-10 m-t-4"></text>提示：转发时，可复制订单详情到输入框！</view>
			<!-- 操作 -->
			<view class="operate m-t-146">
				<view class="pay_btn f-24 col-6" @tap.stop="toPay" v-if="isPayMent">
					<text class="f-32 m-r-10"><text class="iconfont2 icon-WeChat1 m-r-10"></text>直接付款</text>
					微信安全支付
				</view>
				<!-- #ifdef MP -->
				<!-- <button class="share_btn m-t-40 f-32" v-if="info.order_source!=40" open-type="share">{{forwardText?'订单支付成功':'转发订单给商家并付款'}}</button> -->
				<!-- #endif -->
				<!-- #ifdef APP-PLUS || H5 -->
				<!-- <button class="share_btn m-t-40 f-32" v-if="info.order_source!=40" @tap.stop="onShare">{{forwardText?'订单支付成功':'转发订单给商家并付款'}}</button> -->
				<!-- #endif -->
			</view>
		</view>
		<!-- 二维码 -->
		<div class="wxImgBg" v-show="showImg">
		  <div class="wxImgBox">
		    <image class="bgImg" src="/static/images/wxImgbg.png"></image>
		    <div class="wxImgTip">
		      客服二维码
		    </div>
		    <image @tap.stop="onPreviewSkuImage(info.wxapp_user.service_qrcode)" show-menu-by-longpress class="wxImg" :src="info.wxapp_user.service_qrcode"></image>
		    <text class="close iconfont2 icon-shanchu1" @tap.stop="closeImg"></text>
		  </div>
		</div>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" @click="clickNext" @cancel="closeSheet"></tui-actionsheet>
		<popup-input :title="ptitle" :inputType="inputType" :maxlength="maxlength" confirmText="确认复制" ref="popupInput"></popup-input>
		<popup-tips :title="ptitle" :content="orderStr" ref="popupTips"></popup-tips>
	</view>
</template>

<script>
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	let app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	export default {
		components: {
			popupInput,
			popupTips
		},
		data (){
			return {
				ntitle:'',
				info:'',
				showSheet: false,//是否显示操作菜单
				itemList: [
					{text: '复制微信昵称',color: '#333', type: 'isHave',val: '1'},
					{text: '二维码',color: '#333', type: 'isHave',val: '1'},
					{text: '微信',color: '#333', type: 'isHave',val: '1'},
					{text: '电话',color: '#333', type: 'isHave',val: '1'},
				],
				showImg: false,
				ptitle: '本订单详情',//弹窗输入标题
				maxlength: '-1',
				inputType: 'largeText',
				orderStr: '',
				isPayMent: false,//是否显示支付按钮
				forwardText: false,
				isFenxiao: false,//默认不是分销订单
			}
		},
		onLoad(options) {
			this.info = JSON.parse(decodeURIComponent(options.data));
			this.orderStr = this.info.shareText;
			this.isFenxiao = this.info.isFenxiao || false;
			let order = this.info.order;
			let wxapp = this.info.wxapp;
			// 转发按钮文字
			if(order.order_status&&(order.order_status.value==41||order.order_status.value==12||order.order_status.value==13)){
				this.forwardText = false;
			}else{
				this.forwardText = true;
			}
			// 显示付款按钮
			if(order.order_status&&(order.order_status.value==41||order.order_status.value==12||order.order_status.value==13) && wxapp.mchid){
				this.isPayMent = true;
			}
		},
		// #ifdef MP-WEIXIN
		onShareAppMessage (res) {
			let that = this;
			// 设置菜单中的转发按钮触发转发事件时的转发内容
			var shareObj = {      
				path: '/pages/myGoods/order/detail/index?order_no='+ that.info.order_no,
			};
			// 返回shareObj
			return shareObj;
		},
		// #endif
		methods: {
			// 支付
			toPay(){
				let that = this;
				let obj = {
					order_id: that.info.order_id,
					wxapp_id: that.info.wxapp_user.wxapp_id
				};
				/* #ifdef APP-PLUS || H5 */
				obj.device = 'app'
				/* #endif */
				app._post_form('weixin.mini_program/ecommercePay',obj,res => {
					let data = res.data;
					let data1 = {
						success: function (res) {
								that.pageBack(false)
								app.showSuccess('付款成功', () => {
									that.isPayMent = false;
									that.forwardText = true;
								});
						},
						fail: function (err) {
								app.showError('付款失败');
						},
						complete: function (res) {
							if(res.errMsg=='stopMonitoringBeacons:ok'){
								that.pageBack(false)
								app.showSuccess('付款成功', () => {
									that.isPayMent = false;
									that.forwardText = true;
								});
							}
						}
					}
					/* #ifdef MP */
					data1.appId = data.appid
					data1.provider = 'wxpay'
					data1.timeStamp = data.timeStamp
					data1.nonceStr = data.nonceStr
					data1.package = data.package
					data1.signType = data.signType
					data1.paySign = data.paySign
					/* #endif */
					/* #ifdef APP-PLUS || H5 */
					data1.provider = 'wxpay',
					data1.orderInfo = JSON.stringify(data)
					/* #endif */
					// console.log(JSON.stringify(data1))
					uni.requestPayment(data1);
				});
			},
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.getIsPay){
					prevPage.$vm.getIsPay(data)
				}
			},
			getIsPay(data){
				this.isPayMent = data;
				this.forwardText = !data;
			},
			// app分享接口
			onShare() {
				let pages = getCurrentPages();  
				let page = pages[pages.length - 1];  
				let ws = page.$getAppWebview();  
				let bitmap = new plus.nativeObj.Bitmap('drawScreen');  
				// 将webview内容绘制到Bitmap对象中  
        		uni.showLoading({title: '截图生成中，请稍等...'});
				let order_no = this.info.order_no
				ws.draw(bitmap, () => {  
				// 保存图片到本地  
					bitmap.save("_doc/drawScreen.jpg", {  
						overwrite: true  
					}, res => {  
						// console.log(res.target); // 图片地址
						app.uploadFile({
							filePath: res.target,
							noLoad: true,
							success: res => {
								// console.log(JSON.stringify(res)); // 保存失败信息
								uni.share({
									provider: 'weixin',
									scene: "WXSceneSession",
									type: 5,
									title: '您有新的订单',
									imageUrl: res.data.file_path + '?vframe/jpg/offset/0|imageView2/0/w/1000',
									miniProgram: {
										id: app.applets_id,
										path: '/pages/myGoods/order/detail/index?order_no='+ order_no,
										type: 0,
										webUrl: 'http://uniapp.dcloud.io'
									},
									success: ret => {
										// console.log(JSON.stringify(ret));
									},
									fail: ret=> {
										// console.log(JSON.stringify(ret));
									}
								});
								bitmap.clear(); // 清除Bitmap对象  
							},
							fail: res => {
								// console.log(JSON.stringify(res)); // 保存失败信息
							},
							complete: ret=> {
            					uni.hideLoading();
								// console.log(JSON.stringify(ret));
							}
						})
					}, error => {  
						// console.log(JSON.stringify(error)); // 保存失败信息
						bitmap.clear(); // 清除Bitmap对象  
					});  
				}, error => {  
					console.log(JSON.stringify(error)); // 绘制失败  
					this.$api.msg('绘制失败')
				}, {  
					check: true, // 设置为检测白屏  
				});
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				let user = that.info.wxapp_user;
				that.showSheet = false;
				//复制
				if(e.index == 0){
					let name = user.user?user.user.nickName:user.nickName;
					thorui.getClipboardData(name, (res) => {
						// #ifdef H5 || MP-ALIPAY
						if (res) {
							this.$api.msg("复制成功")
						} else {
							this.$api.msg("复制失败")
						}
						// #endif
					});
					return false
				}
				if(user.open_contact && user.open_contact == '1'){
					//二维码
					if(e.index == 1){
						if(user.service_qrcode){
							that.showImg = true;
						}else{
							that.tui.toast("无二维码信息！")
						}
					}
					if(e.index == 2){
						if(user.wechat_id){
							thorui.getClipboardData(user.wechat_id, (res) => {
								// #ifdef H5 || MP-ALIPAY
								if (res) {
									that.$api.msg("复制成功")
								} else {
									that.$api.msg("复制失败")
								}
								// #endif
							});
						}else{
							that.tui.toast("无微信号信息！")
						}
					}
					if(e.index == 3){
						if(user.contact_phone){
							uni.makePhoneCall({
							    phoneNumber: user.contact_phone
							})
						}else{
							that.tui.toast("无手机号信息！")
						}
					}
				}else {
					that.$api.msg('对方未公开联系方式！')
				}
			},
			// 打开/关闭底部菜单
			toSheet(){
				this.showSheet = true;
				let obj = this.info.wxapp_user;
				// if (obj.open_contact && obj.open_contact == '1') {
				  // this.showActionSheet = true
				  if (!obj.contact_phone || obj.contact_phone == '') {
				    this.itemList[3].val = ''
				    this.contact_phone = ''
				  } else {
				    this.contact_phone = obj.contact_phone
				    this.itemList[3].val = '1'
				  }
				  if (!obj.wechat_id || obj.wechat_id == '') {
				    this.wechat_id = ''
				    this.itemList[2].val = ''
				  } else {
				    this.wechat_id = obj.wechat_id
				    this.itemList[2].val = '1'
				  }
				  if (!obj.service_qrcode || obj.service_qrcode == '') {
				    this.itemList[1].val = ''
				    this.service_qrcode = ''
				  } else {
				    this.service_qrcode = obj.service_qrcode
				    this.itemList[1].val = '1'
				  }
				// } else {
				//   this.$api.msg('对方未公开联系方式！')
				// }
			},
			closeSheet(){
				this.showSheet = false;
			},
			//预览
			onPreviewSkuImage(img){
				wx.previewImage({
				  current: img,
				  urls: [img]
				});
			},
			//关闭二维码
			closeImg() {
				this.showImg = false
			},
			//打开订单详情弹窗
			openCopyOrder(){
				this.$refs.popupInput._open(this.orderStr, (val) => {
					this.orderStr = val;
					thorui.getClipboardData(val, (res) => {
						// #ifdef H5 || MP-ALIPAY
						if (res) {
							this.$api.msg("复制成功")
						} else {
							this.$api.msg("复制失败")
						}
						// #endif
					});
				});
			},
			// payOrder() {
			// 	console.log(this.info)
			// 	let that = this
			// 	let order_price = that.info.order.order_price || 0
			// 	order_price = parseInt(order_price) * 100
			// 	app._post_form('weixin.app_program/appPay', {
			// 		order_no: that.info.order_no,
			// 		order_price: order_price
			// 	}, res => {
			// 	  	if (res.code==1) {
   //          			let data =  res.data
			// 			console.log(JSON.stringify(data))
			// 			let data1 = {
			// 				provider: 'wxpay',
			// 				orderInfo: JSON.stringify(data),
			// 				success(res) {
			// 				},
			// 				fail(res) {
			// 					console.log(res)
			// 				},
			// 				complete(res) {
			// 					console.log(res)
			// 				}
			// 			}
			// 			wx.requestPayment(data1);
			// 		} else {
			// 			console.log(JSON.stringify(res))
			// 			that.$api.msg(res.msg)
			// 		}
			// 	});
			// }
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index';
	/deep/ .pop-input textarea{
		height: 360rpx;
	}
</style>
