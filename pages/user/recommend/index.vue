<template>
	<view class="containerBox">
		<!-- 自定义标题栏 -->
		<navigationBar title="建议反馈" extClass="nav" id="top"></navigationBar>
  		<scroll-view scroll-y :style="'height: ' + scrollHeight + 'px;'">
			<view class="container">
				<div class="filedItem">
					<div class="filedTitle">
						建议类型
						<text class="tips">（必填）</text>
					</div>
					<div class="filedContent">
						<div v-for="(item, index) in typeList" :key="index" class="typeItem" :class="typeItem == item.type ? 'typeItemActive' : ''"
						@tap.stop="selectTypeItem(item.type)">
							{{item.name}}
						</div>
					</div>
				</div>
				<div class="filedItem">
					<div class="filedTitle">
						问题/意见描述
					</div>
					<div class="filedContent">
						<div class="describe">
							<!-- <text v-if="describe != ''">{{describe}}</text>
							<text v-else class="placeholder">问题/意见描述</text>
							<input type="text"> -->
							<textarea class="placeholder" placeholder="问题/意见描述" v-model="describe"></textarea>
						</div>
						<!-- <textarea v-model="describe" placeholder="问题/意见描述" cols="30" rows="10"></textarea> -->
					</div>
					<div class="upload">
						<tui-upload ref="tuiUpload" :addText="text" :limit="3" :videoLimit="0" :value="baseImages" @complete="result"
						@remove="remove"></tui-upload>
						<div class="inputTips">
							<text class="iconfont2 icon-jingshi f-24 m-right"></text>
							最多3张且大小不超过1M
						</div>
					</div>
				</div>
				<div class="filedItem">
					<div class="filedTitle dis-flex flex-y-center">
						<div class="label">联系方式</div>
						<div class="content">
							<input class="f-24" type="text" v-model="num" placeholder="请输入QQ、邮箱、手机等联系方式">
						</div>
					</div>
				</div>
				<div class="inputTips p-left">
					<text class="iconfont2 icon-jingshi f-24 m-right"></text>
					仅工作人员可见
				</div>
				<div class="footer">
					<div class="footBut" :class="isSub ? 'suOk' : ''" @tap.stop="sub">
						提交
					</div>
				</div>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	let app = getApp().globalData;

	export default {
		data() {
			return {
				scrollHeight: 0,
				subing: false,
				title: '',
				placeholder: '',
				text: '',
				inputType: 'text',
				typeItem: '1',//建议类型
				typeList: [{
					type: '1',
					name: '买家流程'
				}, {
					type: '2',
					name: '卖家流程'
				}, {
					type: '3',
					name: '支付流程'
				}, {
					type: '4',
					name: '其他建议'
				}, {
					type: '5',
					name: '产品建议'
				}, {
					type: '6',
					name: '客服建议'
				}],

				describe: '',//建议内容

				baseImages: [],
				imagesId: [],
				num: '',//请输入QQ、邮箱、手机等联系方式
			};
		},
		computed: {
			isSub() {
				if (this.describe != '' && this.num != '' && this.typeItem != '') {
					return true
				} else {
					return false
				}
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.$nextTick(() => {
				this.setListHeight()
			})
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},
		methods: {
			/**
			 * 设置列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750
						// tap高度
					let scrollHeight = systemInfo.windowHeight - res[0].height; // swiper高度
					this.scrollHeight = scrollHeight
				});
			},
			materialChange(data){
				let imagesId = [];
				data.forEach(element => {
					imagesId.push(element.wxapp_file_id)
				});
				this.imagesId = imagesId;
				this.baseImages = data;
				this.$nextTick(() => {
					if (this.$refs.tuiUpload) {
						this.$refs.tuiUpload.unit()
					}
				})
			},
			// materialChange(list) {
			// 	list.forEach(element => {
			// 		this.imagesId.push(element.wxapp_file_id)
			// 		this.baseImages.push({
			// 			type: element.type,
			// 			path: element.path,
			// 			wxapp_file_id: element.wxapp_file_id
			// 		})
			// 	});
			// 	this.$nextTick(() => {
			// 		if (this.$refs.tuiUpload) {
			// 			this.$refs.tuiUpload.unit()
			// 		}
			// 	})
			// },
			//提交
			sub(){
				let that = this;
				if(that.isSub && !that.subing){
					that.subing = true
					let data = {
						type: that.typeItem==1?'BuyerProcess':that.typeItem==2?'SellerProcess':that.typeItem==3?'PaymentProcess':that.typeItem==4?'OthersSuggest':that.typeItem==5?'ProductSuggest':'ServiceSuggest',
						images: that.imagesId.toString(),
						content: that.describe,
						contact: that.num
					};
					let suggestion = JSON.stringify(data);
					app._post_form('user.suggestion/add',{suggestion}, res => {
						that.$api.msg(res.msg)
						if (res.code == 1) {
							setTimeout(() => {
								uni.navigateBack()
							},1500)
						} else {
							that.subing = false
						}
					}, res => {
						that.subing = false
					})
				}
			},
			// 图片上传回调
			result: function(e) {
				let arr = []
				let baseImages = []
				e.imgArr.forEach(element => {
					if (element.wxapp_file_id) {
						arr.push(element.wxapp_file_id)
						baseImages.push({
							type: element.type,
							path: element.path,
							wxapp_file_id: element.wxapp_file_id
						})
					}
				});
				this.imagesId = arr;
				this.baseImages = baseImages;
			},
			remove: function(e) {
				//移除图片
				let index = e.index
				this.imagesId.splice(index, 1);
				this.baseImages.splice(index, 1);
			},
			selectTypeItem(type) {
				this.typeItem = type
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
