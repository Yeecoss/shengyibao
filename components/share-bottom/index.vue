<template>
	<view>
		<!--底部分享弹窗-->
		<tui-bottom-popup v-if="popupShow" :show="popupShow" @close="popup">
			<view class="tui-share">
				<view class="tui-share-title">分享到</view>
					<view class="tui-share-top">
						<template v-for="(item,index) in shareList">
							<!-- 商品详情 -->
							<template v-if="!isTwo && pageType!='userIndex'">
								<!-- #ifdef APP-PLUS -->
								<button class="tui-share-item" @tap="appShare1(item)" :key="index" v-if="(item.opt=='weChat'&&item.show)" hover-class="none">
									<view class="itemIcon" :style="{background: item.bgColor}" hover-class="tui-hover" :hover-stay-time="150">
										<text class="iconfont2" :class="item.icon"></text>
									</view>
									<view class="tui-share-text">{{item.name}}</view>
								</button>
								<!-- #endif -->
								<!-- #ifdef H5 || MP-WEIXIN -->
								<button class="tui-share-item" @tap="copy" open-type="share" :id="upGoods.wxapp_goods_id+''" :data-shareImg="upGoods.goods?upGoods.goods.goods_image:''" :key="index" v-if="(item.opt=='weChat'&&item.show)" hover-class="none">
									<view class="itemIcon" :style="{background: item.bgColor}" hover-class="tui-hover" :hover-stay-time="150">
										<text class="iconfont2" :class="item.icon"></text>
									</view>
									<view class="tui-share-text">{{item.name}}</view>
								</button>
								<!-- #endif -->
								<!-- #ifdef APP-PLUS -->
								<view class="tui-share-item"  :key="index" @tap="appShare1(item)" v-if="item.opt!='weChat'&&item.show">
									<view class="itemIcon" :style="{background: item.bgColor}" hover-class="tui-hover" :hover-stay-time="150">
										<text class="iconfont2" :class="item.icon"></text>
									</view>
									<view class="tui-share-text">{{item.name}}</view>
								</view>
								<!-- #endif -->
								<!-- #ifdef H5 || MP-WEIXIN -->
								<view class="tui-share-item"  :key="index" @tap="optClick(item)" v-if="item.opt!='weChat'&&item.show">
									<view class="itemIcon" :style="{background: item.bgColor}" hover-class="tui-hover" :hover-stay-time="150">
										<text class="iconfont2" :class="item.icon"></text>
									</view>
									<view class="tui-share-text">{{item.name}}</view>
								</view>
								<!-- #endif -->
							</template>
							<!-- 非详情 -->
							<template v-else>
								<view class="tui-share-item"  :key="index" @tap="optClick(item)" v-if="item.show">
									<view class="itemIcon" :style="{background: item.bgColor}" hover-class="tui-hover" :hover-stay-time="150">
										<text class="iconfont2" :class="item.icon"></text>
									</view>
									<view class="tui-share-text">{{item.name}}</view>
								</view>
							</template>
						</template>
					</view>
				<view class="tui-btn-cancle" @tap="popup">取消</view>
			</view>
		</tui-bottom-popup>
		<!-- 选择分享样式 -->
		<template>
		<tui-bottom-popup :show="popupShow2" @close="popup2">
			<view class="tui-share share_style ">
				<!-- <view class="tui-share-title">选择分享样式</view> -->
					<view class="share_style-top dis-flex flex-wrap">
						<template v-for="(item,index) in styleList">
							<template v-if="item.show &&item.opt=='weChatLink' && checkItem.opt!='weChatFriends'">
								<!-- #ifdef MP-WEIXIN -->
								<button class="share_style-item t-c" :class="style_on==item.data?'on':''" @tap.stop="copy" open-type="share" :id="upGoods.wxapp_goods_id+''" :data-shareImg="upGoods.goods?upGoods.goods.goods_image:''" :key="index" hover-class="none">
									<view class="share_style-icon"><text :class="'iconfont2 '+item.icon"></text></view>
									<view class="share_style-text f-28">{{item.name}}</view>
								</button>
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN -->
								<view class="share_style-item t-c" :class="style_on==item.data?'on':''"  :key="index" @tap.stop="optClick2(item)" v-if="item.show">
									<view class="share_style-icon f-32"><text :class="'iconfont2 '+item.icon"></text></view>
									<view class="share_style-text f-28">{{item.name}}</view>
								</view>
								<!-- #endif -->
							</template>
							<template v-else>
								<view class="share_style-item t-c" :class="style_on==item.data?'on':''"  :key="index" @tap.stop="optClick2(item)" v-if="item.show">
									<view class="share_style-icon f-32"><text :class="'iconfont2 '+item.icon"></text></view>
									<view class="share_style-text f-28">{{(style_on==1&&pageType=='barginTask')?'商品海报':item.name}}</view>
								</view>
							</template>
						</template>
					</view>
				<!-- #ifdef H5 || MP-WEIXIN -->
				<!-- <button class="tui-btn-confirm" v-if="style_on==-1 &&checkItem.opt!='weChatFriends'" @tap.stop="copy" open-type="share" :id="upGoods.wxapp_goods_id+''" :data-shareImg="upGoods.goods?upGoods.goods.goods_image:''" hover-class="none">去分享</button> -->
				<!-- <view class="tui-btn-confirm" v-else @tap.stop="styleUpload">{{checkItem.opt=='weChatFriends'?'去分享':'保存'}}</view> -->
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<!-- <button v-if="style_on==-1" class="tui-btn-confirm" @tap.stop="appShare()" hover-class="none">去分享</button>
				<div v-else class="dis-flex flex-y-center flex-x-between">
					<button class="tui-btn-confirm1" style="background:#F8B14A" @tap.stop="upload()" hover-class="none">下载</button>
					<button class="tui-btn-confirm1" @tap.stop="appShare()" hover-class="none">去分享</button>
				</div> -->
				<!-- #endif -->
			</view>
		</tui-bottom-popup>
		<view class="share_style-img" v-show="showStyleImg">
			<!-- #ifdef H5 || APP-PLUS -->
				<image @tap.stop mode="widthFix" :src="qrcode" show-menu-by-longpress></image>
			<!-- #endif -->
			<!-- #ifndef H5 || APP-PLUS -->
				<image @tap.stop mode="heightFix" :src="qrcode" show-menu-by-longpress></image>
				<view class="t-c f-30 m-top30 col-f">长按可直接转发或保存哦～</view>
			<!-- #endif -->
		</view>
		</template>
		<!-- 海报弹窗 -->
		<view class="maskBg" v-if="popupShowImg" @tap="popupShowImgClose">
			<view class="maskImgCon">
				<view class="maskImgBox">
						<image @tap.stop mode="widthFix" :src="qrcode"></image>
				</view>
				<view class="footBox" @tap.stop="upload">{{butName}}</view>
			</view>
		</view>
		
		<!-- 盆友圈提示弹窗 -->
		<!-- #ifdef MP-WEIXIN -->
			<view class="maskBg" v-if="popupTipImg" @tap="popupTipImg = false">
				<view class="popupTipImgBox">
						<image @tap.stop mode="widthFix" src="https://pic.kaidanxia.com/2021-04-13/150319090d30416.png"></image>
				</view>
			</view>
		<!-- #endif -->
		
		<!-- 下载 -->
		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<!-- 同步 -->
		<updata ref="updata" @showLogin="showLogin" :noLogin="noLogin"></updata>
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>
<script>
  	import downloadFile from '@/components/download-file';
	import updata from '@/components/updata/updata';
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import siteinfo from "@/siteinfo"; // 工具类
	export default {
		components: {
			downloadFile,
			updata
		},
		data() {
			return {
					index:1,
					checkItem:{},
					butName: '',//默认海报按钮文字
					popupShow: false,//默认分享弹窗
					popupShowImg: false,//默认海报弹窗
					popupTipImg: false,//默认盆友圈提示弹窗
					shareList: [{
						show: false,
						butName: '',
						opt: 'upGoods',
						name: "同步到店铺",
						icon: "icon-shop1",
						bgColor: 'linear-gradient(180deg,rgba(245,91,91,1) 0%,rgba(232,46,46,1) 100%)'
					},{
						show: false,
						butName: '',
						opt: 'copyGoods',
						name: "复制到店铺",
						icon: "icon-copy",
						bgColor: 'linear-gradient(180deg,rgba(252,217,129,1) 0%,rgba(248,177,74,1) 100%)'
					},
					{
						show: false,
						butName: '分享',
						opt: 'weChat',
						name: "微信好友",
						icon: "icon-WeChat",
						bgColor: 'linear-gradient(180deg,rgba(121,219,128,1) 0%,rgba(68,181,73,1) 100%)'
					}, {
						show: false,
						butName: '分享',
						opt: 'weChatFriends',
						name: "朋友圈",
						icon: "icon-circleoffriends",
						bgColor: 'linear-gradient(180deg,rgba(199,239,95,1) 0%,rgba(150,218,49,1) 100%)'
					}, {
						show: false,
						butName: '保存',
						opt: 'upLoad',
						name: "保存本地",
						icon: "icon-download1",
						bgColor: ''
					}],
					popupShow2: false,//选择分享样式弹窗
					showStyleImg: false,//选择分享样式弹窗图片
					style_on: 1,
					styleList: [{
						show: true,
						butName: '保存',
						opt: 'poster',
						icon:'icon-picture1',
						name: "单图",
						data: 1,
					},{
						show: true,
						butName: '保存',
						opt: 'poster',
						icon:'icon-picture1',
						name: "四图",
						data: 4,
					},{
						show: true,
						butName: '保存',
						opt: 'poster',
						icon:'icon-picture1',
						name: "八图",
						data: 8,
					},{
						show: true,
						butName: '',
						opt: 'weChatLink',
						icon:'icon-link1',
						name: "商品链接",
						data: -1,
						icon: "icon-link",
						bgColor: '#DEDEDE'
					}],
					isTwo: false,//是否显示二级列表
					next: null,
					upGoods: {},//要同步的商品
					qrcode: '',
					goodsPoster: {1:'',4:'',8:''},
					options:{},
			}
		},
		props: {
			noLogin: {
				type: Boolean,
				default: false
			},
			pageType: '',
		},
		methods: {
			showLogin(next) {
				this.$emit('showLogin', next)
			},
			appShare1(item) {
				this.checkItem = item;
				this.appShare()
			},
			appShare() {
				let name = '';
				let goods_image = '';
				if(this.options.optimiInfo){
					name = this.options.optimiInfo.article_title || '';
					if (this.style_on == -1) {
						goods_image = this.options.optimiInfo.image.file_path || '';
					} else {
						goods_image = this.qrcode
					}
				}else{
					name = this.upGoods.goods.goods_name || '';
					if (this.style_on == -1) {
						goods_image = this.upGoods.goods.goods_image ? this.upGoods.goods.goods_image || '' : '';
					} else {
						goods_image = this.qrcode
					}
				}
				let url = ''
				let options = this.$mp.page.options
				let str = '?wid=' + app.wxapp_id
				for(let key  in options){
					// console.log(key + '---' + options[key])
					str += '&' + key + '=' + options[key]
				}
				url = '/' + this.$mp.page.route
				if (str != '') {
					url += str
				}
				this.copy()
				let scene = "WXSceneSession"
				if (this.checkItem.opt == 'weChatFriends') {
					scene = 'WXSenceTimeline'
				}
					
				// console.log(this.checkItem)
				if (goods_image && goods_image != '') {
					let data = {
						provider: 'weixin',
						scene: scene,
						type: 2,
						"imageUrl": goods_image + '?vframe/jpg/offset/0|imageView2/1/w/300/h/300',
						success: ret => {
							// console.log(JSON.stringify(ret));
						},
						fail: ret => {
							// 分享失败
							// console.log(JSON.stringify(ret))
						}
					}
					if (this.style_on == -1) {
						if (this.checkItem.opt == 'weChat') {
							data.type = 5
							if(this.options.optimiInfo){
								name = this.options.optimiInfo.article_title || '';
							}else{
								name = this.upGoods.goods.goods_name || '';
							}
							data.title = name
							data.miniProgram = {
								id: app.applets_id,
								path: url,
								type: 0,
								webUrl: 'http://uniapp.dcloud.io'
							}
						} else {
							data.type = 0
							let name = '';
							if(this.options.optimiInfo){
								name = this.options.optimiInfo.article_title || '';
							}else{
								name = this.upGoods.goods.goods_name || '';
							}
							data.title = name
							let str =  this.pageType + '&s=' + siteinfo.siteroot
							if(this.pageType=='bargin'){
								str += '&active_id=' + this.upGoods.active_id;
							}else if(this.pageType=='sharp'){
								str += '&active_time_id=' + this.upGoods.active_time_id;
								str += '&sharp_goods_id=' + this.upGoods.sharp_goods_id;
							}else{
								str += '&wxapp_goods_id=' + this.upGoods.wxapp_goods_id;
							}
							data.href = 'http://m.kaidanxia.com/index.html#/?pageType=' + str
						}
					}
					uni.share(data);
				}
			},
			//打开一级弹窗
			open(data) {
				// console.log(data)
				this.options = JSON.parse(JSON.stringify(data));
				this.shareList.forEach(element => {
					if (data.opeText.indexOf(element.opt) != -1) {
						element.show = true
					} else {
						element.show = false
					}
				});
				if(data.styleList){
					this.styleList.forEach(element => {
						if (data.styleList.indexOf(element.data) != -1) {
							element.show = true
						} else {
							element.show = false
						}
					});
				}
				this.popupShow = true;
				this.isTwo = data.isTwo|| false;
				// console.log(data.upGoods)
				if(data.upGoods){
					this.upGoods = JSON.parse(JSON.stringify(data.upGoods));
				}
				//重置
				this.resetData()
			},
			//打开二级弹窗-仅分享-推广商品专用
			openShare(data) {
				this.options = JSON.parse(JSON.stringify(data));
				let item = {};
				this.shareList.forEach(element => {
					if (data.opeText.indexOf(element.opt) != -1) {
						// element.show = true
						item = element;
					} else {
						// element.show = false
					}
				});
				if(data.styleList){
					this.styleList.forEach(element => {
						if (data.styleList.indexOf(element.data) != -1) {
							element.show = true
						} else {
							element.show = false
						}
					});
				}
				this.isTwo = data.isTwo|| false;
				if(data.upGoods){
					this.upGoods = JSON.parse(JSON.stringify(data.upGoods));
				}
				//重置
				this.resetData()
				this.optClick(item)
			},
			//关闭一级弹窗
			popup () {
				this.popupShow = false
			},
			//打开海报弹窗
			_popupShowImg(butName,qrcode) {
				this.qrcode = qrcode;
				this.butName = butName;
				this.popupShowImg = true;
			},
			//关闭海报弹窗
			popupShowImgClose() {
				this.popupShowImg = false
			},
			//点击一级弹窗按钮
			optClick(item) {
				let that = this;
				that.popupShow = false;
				that.butName = item.butName;
				that.checkItem = item;
				if (item.opt == 'upGoods') {
					that.$refs.updata.getWxappData(()=> {
						that.$refs.updata.getShowData(that.upGoods.wxapp_id,()=>{
							that.$refs.updata.updata(that.upGoods);
						});
					})
					
					return
				}
				if (item.opt == 'copyGoods') {
					if(this.options.optimiInfo){
						that.copyOptimiInfo()
					}else{
						that.$refs.updata.copy(that.upGoods);
					}
					
					return
				}
				//个人中心
				if(that.pageType=='userIndex' || item.opt == 'upLoad'){
					that.butName = '保存';
					that.getPoster(()=>{
						that.popupShowImg = true;
					});
					return
				}
				// //商品详情/优选详情
				if(that.pageType=='goods' || that.pageType=='bargin' || that.pageType=='sharp' || that.pageType=='optimization'||that.pageType=='barginTask'){
					if(that.isTwo){
						that.popupShow2 = true;
						that.getPoster();
						// if(!that.styleList[0].show){
							that.style_on = 1;
							that.showStyleImg = true;
							that.copy()
						// }else{
						// 	that.style_on = -1;
						// }
					}else{
						if (that.checkItem.opt == 'weChatFriends') {
							that.popupTipImg = true;
						}
					}
				}
			},
			//点击二级弹窗分享按钮
			optClick2(item) {
				this.style_on = item.data;
				if (this.checkItem.opt == 'weChatFriends'&&this.style_on==-1) {//盆友圈
					// #ifdef MP-WEIXIN
					this.popup2();
					this.popupTipImg = true;
					// #endif
					// #ifndef MP-WEIXIN
					this.appShare()
					// #endif
				} else {
					if(this.style_on!=-1){
						this.showStyleImg = false;
						
						this.$nextTick(() =>{
							let goodsPoster = this.goodsPoster[this.style_on] || '';
							if(goodsPoster!=''){
								this.qrcode = goodsPoster;
								this.showStyleImg = true;
							}else{
								this.getPoster(() => {
									this.showStyleImg = true;
								});
							}
						})
					}else{
						this.showStyleImg = false;
					}
				}
			},
			//二级弹窗下载保存按钮-
			styleUpload(){
				if (this.checkItem.opt == 'weChatFriends'&&this.style_on==-1) {
					this.popupTipImg = true;
				} else {
					this.popupShow2 = false;
					this.showStyleImg = false;
					this.copy()
					this.upload()
				}
			},
			//关闭二级弹窗
			popup2 () {
				this.popupShow2 = false
				this.showStyleImg = false;
				
				this.resetData()
			},
			resetData(){
				uni.removeStorageSync('goodsPoster')
				this.goodsPoster = {1:'',4:'',8:''};
				this.qrcode = '';
				this.style_on = 1;
			},
			// 点击下载
			upload(){
				let files = this.qrcode
				if (files.length == 0) {
					return false
				}
				const that = this;
				let uploads = [];
				uploads.push(files)
				that.$refs.download._downloadFileS(uploads);

			},
			//下载回调
			comfirmStatusS (promise) {
				promise.then((res) => {
						uni.hideLoading();
						uni.hideToast();
						this.$api.msg(res?"下载成功，文案已复制":'取消保存')
				})
			},
			//获取海报
			getPoster(callback){
				if(this.style_on!=-1){
					uni.showLoading({
					  title: '拼命生成中'
					});
				}
				let url = '',
						data = {};
				// data.header = this.style_on || 1;
				data.header = this.style_on==-1? 1 : this.style_on;
				if(this.pageType=='bargin'){
					url = 'wxapp.goods/bargainPoster';
					data.active_id = this.upGoods.active_id;
				}else if(this.pageType=='barginTask'){
					url = 'wxapp.goods/taskPoster';
					data.task_id = this.upGoods.task_id;
					data.wxapp_id = this.upGoods.wxapp_id;
				}else if(this.pageType=='sharp'){
					url = 'wxapp.goods/sharpPoster';
					data.active_time_id = this.upGoods.active_time_id;
					data.sharp_goods_id = this.upGoods.sharp_goods_id;
				}else{
					url = 'wxapp.goods/poster';
					data.goods_id = this.upGoods.goods_id;
					data.wxapp_goods_id = this.upGoods.wxapp_goods_id;
					data.wxapp_id = this.upGoods.wxapp_id;
				}
				app._get(url, data, res => {
					if(res.code==1){
						if(this.style_on==-1){
							this.goodsPoster[1] = res.data.qrcode||'';
						}else{
							this.goodsPoster[this.style_on] = res.data.qrcode||'';
							this.qrcode = res.data.qrcode ||'';
						}
						typeof callback === 'function' && callback();
					}
				}, null, () => {
					// if(this.style_on!=-1){
						uni.hideLoading();
					// }
				});
			},
			//复制剪贴板
			copy(){
				let name = '';
				if(this.options.optimiInfo){
					name = this.options.optimiInfo.article_title || '';
				}else{
					name = this.upGoods.goods.goods_name || '';
				}
				this.clipboard(name)
			},
			// 复制
			clipboard(data) {
				thorui.getClipboardData(data,(res) => {
					// #ifdef MP
					if (res) {
						uni.hideToast()
					} else {
					}
					// #endif
				})
			},
			// 复制种草
			copyOptimiInfo(){
				let url = this.options.optimiType=='marketing'?'shop.article.market/copy':'shop.article.goods/copy',
						data = {copy_article_id: this.options.optimiInfo.article_id};
				app._post_form(url, data, res => {
					this.$api.msg(res.msg)
				});
			},
    }
  }
</script>

<style lang="scss" scoped>
	@import 'index';
</style>