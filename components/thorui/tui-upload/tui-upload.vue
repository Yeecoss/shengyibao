<template>
	<view class="tui-container">
		<movable-area class="tui-upload-box" ref="areaBox" id="areaBox" :style="{height: imageHeight}">
			<view class="tui-image-item" v-for="(item,index) in imageList" :key="index"
				:id="'img' + index"
				:ref="'img' + index">
				<image v-if="item.type == 'image'" :src="item.local ? item.local : item.path + '?vframe/jpg/offset/0|imageView2/1/w/144/h/144'" class="tui-item-img" 
				@tap="showItem(item, index)"
				@longpress="tstr(index, $event)"
				@touchmove="tsmo"
				@touchend="toend" mode="aspectFill"></image>
				<div v-else-if="item.type == 'video'" class="tui-item-img"
				@tap="showItem(item)"
				@longpress="tstr(index, $event)"
				@touchmove="tsmo"
				@touchend="toend">
					<image class="tui-item-img" :src="item.path + '?vframe/jpg/offset/0|imageView2/1/w/144/h/144'" mode="aspectFill">
					</image>
					<text class="iconfont2 icon-bofang"></text>
				</div>
				<view v-if="!forbidDel && !noShowAdd" class="tui-img-del" @tap.stop="delImage(index)"></view>
				<view v-if="statusArr[index]!=1" class="tui-upload-mask" :class="statusArr[index]==3 ? 'tui-upload-mask1' : ''">
					<view class="tui-upload-loading" v-if="statusArr[index]==2"></view>
					<text class="tui-tips">{{statusArr[index]==2?'上传中...':'上传失败'}}</text>
					<view class="tui-mask-btn" v-if="statusArr[index]==3" @tap.stop="reUpLoad(index)" hover-class="tui-btn-hover"
					:hover-stay-time="150">重新上传</view>
				</view>
			</view>
			<view v-if="isShowAdd && (!noShowAdd || showCustAdd)" class="tui-upload-add dis-flex flex-y-center" @tap="selectType">
				<div class="tuiAdd">
					<view class="tui-upload-icon tui-icon-plus"></view>
					<view class="addText">{{addText}}</view>
				</div>
			</view>
			<movable-view v-if="moveSrc" :animation="false" class="moveV" :x="x" :y="y" direction="all" @change="onChange"  :style="{ width: imgSize + 'px', height: imgSize + 'px' }">
				<image v-if="moveType == 'image'" :src="moveSrc" mode="aspectFill" ></image>
				<image mode="aspectFill" v-else :src="moveSrc + '?vframe/jpg/offset/0|imageView2/1/w/144/h/144'"></image>
			</movable-view>
		</movable-area>
		<div v-if="showActionSheet">
			<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
		</div>
		<view class="videoBox dis-flex flex-y-center" v-if="videoBoxShow" @tap.stop="closeVideoBox">
			<video preload="none" class="videoAll" id="videoAll" :src="videoPath" :autoplay="true" @tap.stop objectFit="cover" @ended="jieshu"></video>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	const App = getApp().globalData;
	export default {
		name: 'tuiUpload',
		props: {
			source:{
				type: String,
				default: ''
			},
			addText:{
				type: String,
				default: '图片/视频'
			},
			//初始化图片路径
			value: {
				type: Array,
				default () {
					return []
				}
			},
			//禁用删除
			forbidDel: {
				type: Boolean,
				default: false
			},
			//禁用添加
			forbidAdd: {
				type: Boolean,
				default: false
			},
			//限制数
			limit: {
				type: Number,
				default: -1
			},
			//项目名，默认为 file
			fileKeyName: {
				type: String,
				default: "file"
			},
			imgSize: {
				type: Number,
				default: 72
			},
			fieldName: {
				type: String,
				default: ""
			},
			isShop: {
				type: Boolean,
				default: false
			},
			videoLimit: {
				type: Number,
				default: 0
			},
			noShowAdd: {
				type: Boolean,
				default: false
			},
			showCustAdd: {
				type: Boolean,
				default: false
			},
			noShowImgBox: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				imgarrLength: 0,
				imgarrLengthAdd: 0,
				isDrom: false,
				x: 0,
				y: 0,
				idx: 0,
				areaBoxInfo: {},
				moveSrc: '',
				moveType: '',
				moveFile_id: '',
				moveLocal: '',
				areaBoxTop: 0,
				hoverImgIdx:'',
				inBoxXY:{},
				// 视频弹窗
				videoBoxShow: false,
				// 视频路径
				videoPath: '',
				showActionSheet: false,
				itemList: [],
				itemListBase: [{
					text: "选择图片",
					color: "#2B2B2B",
					noShow: false
				}, {
					text: "选择视频",
					color: "#2B2B2B",
					noShow: false
				},{
					text: "素材中心",
					color: "#2B2B2B",
					noShow: false
				}],
				// 选择
				itemList1: [{
					text: "选择图片",
					color: "#2B2B2B",
					noShow: false
				}, {
					text: "选择视频",
					color: "#2B2B2B",
					noShow: true
				}, {
					text: "素材中心",
					color: "#2B2B2B",
					noShow: false
				}],
				// 选择
				itemList2: [{
					text: "选择图片",
					color: "#2B2B2B",
					noShow: true
				}, {
					text: "选择视频",
					color: "#2B2B2B",
					noShow: false
				},{
					text: "素材中心",
					color: "#2B2B2B",
					noShow: false
				}],
				//图片地址
				imageList: [],
				//上传状态：1-上传成功 2-上传中 3-上传失败
				statusArr: []
			}
		},
		created() {
		},
		mounted() {
			this.unit()
		},
		computed: {
			imageHeight() {
				return (parseInt(this.imageList.length / 4) + 1) * 164 + 'rpx'
			},
			isShowAdd() {
				let isShow = true;
				if (this.forbidAdd && !this.showCustAdd) {
					isShow = false;
				} else if (this.limit != -1 && this.imageList.length >= (this.limit + this.videoLimit)) {
					isShow = false;
				}
				return isShow
			}
		},
		methods: {
			unit() {
				this.imageList = [...this.value];
				for (let item of this.imageList) {
					this.statusArr.push("1")
				}
				this.$nextTick(() => {
					this.imagexy()
				})
			},
			imagexy() {
				this.getDomInfo('areaBox', info => {
					this.areaBoxInfo = info;
					// 设置区域内所有图片的左上角坐标
					if (this.areaBoxInfo) {
						// 设置区域内所有图片的左上角坐标
						this.imageList.forEach((item, idx) => {
							this.getDomInfo('img' + idx, res => {
								item.x = res.left-this.areaBoxInfo.left;
								item.y = res.top-this.areaBoxInfo.top;
							});
						});
					}
				})
			},
			getDomInfo(id, callBack) {
				const query = uni.createSelectorQuery().in(this);
				query.select('#' + id)
					.boundingClientRect()
					.exec(function(res) {
						callBack(res[0]);
					});
			},
			onChange(e) {
			},
			showItem(item, index) {
				if (item.type == 'image') {
					this.previewImage(index)
				} else if (item.type == 'video') {
					this.previewVideo(item.path)
				}
			},
			tstr(e, s) {
				const _this = this;
				_this.$emit('scrollYChange', false)
				_this.isDrom = true
				//获取拖拽区域的上边距和下边距
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				
				// 设置可移动方块的初始位置为当前所选中图片的位置坐标
				this.x = this.imageList[e].x;
				this.y = this.imageList[e].y;
				//显示可移动方块
				this.moveSrc = this.imageList[e].path;
				this.moveType = this.imageList[e].type;
				this.moveLocal = this.imageList[e].local;
				this.moveFile_id = this.imageList[e].wxapp_file_id;
				//保存当前所选择的图片索引
				this.idx = e;
				var x = s.changedTouches[0].clientX-areaBoxLeft;
				var y = s.changedTouches[0].clientY-areaBoxTop;
				// 保存鼠标在图片内的坐标
				this.inBoxXY={
					x:x-this.imageList[e].x,
					y:y-this.imageList[e].y,
				}
			},
			tsmo(e) {
				if (this.isDrom) {
					const _this = this;
					let areaBoxTop = this.areaBoxInfo.top;
					let areaBoxLeft = this.areaBoxInfo.left;
					let  imgSize= this.imgSize;
					//重置为以拖拽盒子左上角为坐标原点
					var x = e.changedTouches[0].clientX-areaBoxLeft;
					var y = e.changedTouches[0].clientY-areaBoxTop;
					this.x = x-this.inBoxXY.x;
					this.y = y-this.inBoxXY.y;
					
					this.imageList.forEach((item, idx) => {
						if (x>item.x&&x<item.x+imgSize&&y>item.y&&y<item.y+imgSize) {
							_this.hoverImgIdx='img'+idx
						}
					});
				}
			},
			toend(e) {
				if (this.isDrom) {
					this.isDrom = false
					this.$emit('scrollYChange', true)
					let areaBoxTop = this.areaBoxInfo.top;
					let areaBoxLeft = this.areaBoxInfo.left;
					let  imgSize= this.imgSize;
					//重置为以拖拽盒子左上角为坐标原点
					var x = e.changedTouches[0].clientX-areaBoxLeft;
					var y = e.changedTouches[0].clientY-areaBoxTop;
					for(let idx in this.imageList){
						let item = JSON.parse(JSON.stringify(this.imageList[idx]));
						if (x>item.x&&x<item.x+imgSize&&y>item.y&&y<item.y+imgSize) {
							this.imageList[this.idx].path = item.path;
							this.imageList[this.idx].type = item.type;
							this.imageList[this.idx].local = item.local;
							this.imageList[this.idx].wxapp_file_id = item.wxapp_file_id;
							
							this.imageList[idx].path = this.moveSrc;
							this.imageList[idx].type = this.moveType;
							// this.imageList[idx].file_id = this.moveFile_id;
							this.imageList[idx].wxapp_file_id = this.moveFile_id;
							this.imageList[idx].local =  this.moveLocal;
							break;
						}
					}
					// 移动结束隐藏可移动方块
					this.moveSrc = '';
					this.moveType = '';
					this.moveFile_id = '';
					this.hoverImgIdx=''
					this.$emit('complete', {
						fieldName: this.fieldName,
						imgArr: this.imageList
					});
				}
			},
			previewVideo(path) {
				this.videoPath = path
				this.videoBoxShow = true
				let videoContextCurrent = wx.createVideoContext('videoAll');
				videoContextCurrent.play();
			},
			closeVideoBox() {
				// 关闭
				this.videoPath = ''
				this.videoBoxShow = false
			},
			selectType() {
				if (this.showCustAdd) {
					this.$emit('custAdd')
					return
				}
				this.itemList = []
				let videoNum = 0
				let imgNum = 0
				this.imageList.forEach(element => {
					if (element.type == 'video') {
						videoNum++
					}
					if (element.type == 'image') {
						imgNum++
					}
				});
				if (videoNum > (this.videoLimit - 1)) {
					this.itemList = this.itemList1
				} else if (this.limit != -1 && imgNum > (this.limit - 1)) {
					this.itemList = this.itemList2
				} else {
					this.itemList = this.itemListBase
				}
				if (this.noShowImgBox) {
					this.itemList[2].noShow = true
				}
				this.showActionSheet = true
			},
			itemClick(e) {
				this.chooseImage(e.index)
				this.closeActionSheet()
			},
			closeActionSheet() {
				this.showActionSheet = false
			},
			// 重新上传
			reUpLoad(index) {
				this.$set(this.statusArr, index, "2")
				this.change()
				this.uploadImage(index, this.imageList[index].path).then(() => {
					this.change()
				}).catch(() => {
					this.change()
				})
			},
			change() {
				let status = ~this.statusArr.indexOf("2") ? 2 : 1
				if (status != 2 && ~this.statusArr.indexOf("3")) {
					// 上传失败
					status = 3
				}
				this.$emit('complete', {
					status: status,
					fieldName: this.fieldName,
					imgArr: this.imageList
				})
				this.$nextTick(() => {
					this.imagexy()
				})
			},
			chooseImage: function(index) {
				if (index == 2) {
					// let videoNum = 0
					// let imgNum = 0
					// this.imageList.forEach(element => {
					// 	if (element.type == 'video') {
					// 		videoNum++
					// 	}
					// 	if (element.type == 'image') {
					// 		imgNum++
					// 	}
					// });
					// videoNum = this.videoLimit - videoNum
					// imgNum = this.limit - imgNum
					let url = '/pages/myGoods/material/index?source=' + this.source
					if (this.limit != -1) {
						url += '&limit=' + this.limit
					}
					if (this.videoLimit != -1) {
						url += '&videoLimit=' + this.videoLimit
					}
					uni.setStorageSync('materialImages', this.imageList);//带入素材中心
					uni.navigateTo({
						url: url
					});
					return
				}
				let obj = {
					// #ifdef H5 || MP
					sizeType: ['original', 'compressed'],
					// #endif
					// #ifdef APP-PLUS
					sizeType: ['original', 'compressed'],
					// #endif
					success: (e) => {
						this.updataImgs(e, index)
					}
				}
				if (this.limit != -1) {
					obj.count = this.limit - this.imageList.length
				}
				// #ifdef APP-PLUS
				// util.checkForAuthorization()
				// #endif
				uni[index == 0 ? 'chooseImage' : 'chooseVideo'](obj)
			},
			updataImgs(e, index) {
				let imageArr = [];
				if (index == '0') {
					for (let i = 0; i < e.tempFilePaths.length; i++) {
						let imgNum = 0
						this.imageList.forEach(element => {
							if (element.type == 'image') {
								imgNum++
							}
						});
						if (imgNum >= this.limit) {
							uni.showToast({
								title: `最多可上传${this.limit}张图片`,
								icon: "none"
							});
							break;
						}
						// #ifdef H5 || MP
						if (e.tempFiles[i].size <= 2048000) {
						// #endif
							let path = e.tempFilePaths[i]
							imageArr.push(path)
							this.imageList.push({
								type: 'image',
								local: path,
								path: path
							})
							this.statusArr.push("2")
						// #ifdef H5 || MP
						} else {
							App.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
						}
						// #endif
					}
				} else {
					let videoNum = 0
					this.imageList.forEach(element => {
						if (element.type == 'video') {
							videoNum++
						}
					});
					if (videoNum >= this.videoLimit) {
						uni.showToast({
							title: `最多可上传${this.videoLimit}个视频`,
							icon: "none"
						});
						return;
					}
					let path = e.tempFilePath
					imageArr.push(path)
					this.imageList.push({
						type: 'video',
						local: path,
						path: path
					})
					this.statusArr.push("2")
				}
				this.change()

				let start = this.imageList.length - imageArr.length
				this.imgarrLength = imageArr.length
				this.imgarrLengthAdd = 0
				for (let j = 0; j < imageArr.length; j++) {
					let index = start + j
					//服务器地址
					this.uploadImage(index, imageArr[j]).then(() => {
						this.imgArrChange()
					}).catch(() => {
						this.imgArrChange()
					})
				}
			},
			imgArrChange() {
				this.imgarrLengthAdd ++
				if (this.imgarrLengthAdd == this.imgarrLength) {
					this.change()
				}
			},
			uploadImage: function(index, url) {
				let _this = this;
				return new Promise((resolve, reject) => {
					App.uploadFile({
						name: this.fileKeyName,
						filePath: url,
						isShop: this.isShop,
						success: function(res) {
							if (res.code == 1) {
								if (_this.imageList[index]) {
									res.data.file_path && (_this.imageList[index].path = res.data.file_path)
									res.data.wxapp_file_id && (_this.imageList[index].wxapp_file_id = res.data.wxapp_file_id)
								} else {
									_this.imageList.push({
										type: res.data.file_media,
										path: res.data.file_path || '',
										wxapp_file_id: res.data.wxapp_file_id || ''
									})
								}
								_this.$set(_this.statusArr, index, res.data.file_path ? "1" : "3")
								resolve(index)
							} else {
								_this.$set(_this.statusArr, index, "3")
								reject(index)
							}
						},
						fail: function(res) {
							_this.$set(_this.statusArr, index, "3")
							reject(index)
						},
						complete: (res) => {
						}
					})
				})

			},
			delImage: function(index) {
				this.imageList.splice(index, 1)
				this.statusArr.splice(index, 1)
				this.$emit("remove", {
					index: index,
					fieldName: this.fieldName,
					imgArr: this.imageList
				})
				this.change()
			},
			previewImage: function(index) {
				if (!this.imageList.length) return;
				let imageList = []
				this.imageList.forEach(item => {
					if (item.type == 'video') {
						imageList.push(item.path + '')
					} else {
						imageList.push(item.path)
					}
				})
				uni.previewImage({
					current: imageList[index],
					loop: true,
					urls: imageList
				})
			}
		}
	}
</script>

<style scoped>
	@font-face {
		font-family: 'tuiUpload';
		src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAATcAA0AAAAAByQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEwAAAABoAAAAciR52BUdERUYAAASgAAAAHgAAAB4AKQALT1MvMgAAAaAAAABCAAAAVjxvR/tjbWFwAAAB+AAAAEUAAAFK5ibpuGdhc3AAAASYAAAACAAAAAj//wADZ2x5ZgAAAkwAAADXAAABAAmNjcZoZWFkAAABMAAAAC8AAAA2FpiS+WhoZWEAAAFgAAAAHQAAACQH3QOFaG10eAAAAeQAAAARAAAAEgwAACBsb2NhAAACQAAAAAwAAAAMAEoAgG1heHAAAAGAAAAAHwAAACABEgA2bmFtZQAAAyQAAAFJAAACiCnmEVVwb3N0AAAEcAAAACgAAAA6OMUs4HjaY2BkYGAAYo3boY/i+W2+MnCzMIDAzb3qdQj6fwPzf+YGIJeDgQkkCgA/KAtvAHjaY2BkYGBu+N/AEMPCAALM/xkYGVABCwBZ4wNrAAAAeNpjYGRgYGBl0GJgZgABJiDmAkIGhv9gPgMADTABSQB42mNgZGFgnMDAysDA1Ml0hoGBoR9CM75mMGLkAIoysDIzYAUBaa4pDA7PGJ9xMjf8b2CIYW5gaAAKM4LkANt9C+UAAHjaY2GAABYIVmBgAAAA+gAtAAAAeNpjYGBgZoBgGQZGBhBwAfIYwXwWBg0gzQakGRmYnjE+4/z/n4EBQksxSf6GqgcCRjYGOIeRCUgwMaACRoZhDwCiLwmoAAAAAAAAAAAAAAAASgCAeNpdjkFKw0AARf/vkIR0BkPayWRKQZtYY90ohJju2kOIbtz0KD1HVm50UfEmWXoAr9ADOHFARHHzeY//Fx8Ci+FJfIgdJFa4AhgiMshbrCuIsLxhFJZVs+Vl1bT1GddtbXTC3OhohN4dg4BJ3zMJAnccyfm468ZzHXddrH9ZKbHzdf9n/vkY/xv9sPQXgGEvBrHHwst5kTbXLE+YpYVPkxepPmW94W16UbdNJd6f3SAzo5W7m1jaKd+8ZZIvk5nlKw9SK6Wle7BLS3f/bTzQLmfAF2T1NsQAeNp9kD1OAzEQhZ/zByQSQiCoXVEA2vyUKRMp9Ailo0g23pBo1155nUg5AS0VB6DlGByAGyDRcgpelkmTImvt6PObmeexAZzjGwr/3yXuhBWO8ShcwREy4Sr1F+Ea+V24jhY+hRvUf4SbuFUD4RYu1BsdVO2Eu5vSbcsKZxgIV3CKJ+Eq9ZVwjfwqXMcVPoQb1L+EmxjjV7iFa2WpDOFhMEFgnEFjig3jAjEcLJIyBtahOfRmEsxMTzd6ETubOBso71dilwMeaDnngCntPbdmvkon/mDLgdSYbh4FS7YpjS4idCgbXyyc1d2oc7D9nu22tNi/a4E1x+xRDWzU/D3bM9JIbAyvkJI18jK3pBJTj2hrrPG7ZynW814IiU68y/SIx5o0dTr3bmniwOLn8owcfbS5kj33qBw+Y1kIeb/dTsQgil2GP5PYcRkAAAB42mNgYoAALjDJyIAOWMGiTIxMjMxsKak5qSWpbFmZiRmJ+QAmgAUIAAAAAf//AAIAAQAAAAwAAAAWAAAAAgABAAMABAABAAQAAAACAAAAAHjaY2BgYGQAgqtL1DlA9M296nUwGgA+8QYgAAA=) format('woff');
		font-weight: normal;
		font-style: normal;
	}

	.tui-upload-icon {
		font-family: "tuiUpload" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		padding: 10rpx;
	}

	.tui-icon-delete:before {
		content: "\e601";
	}

	.tui-icon-plus:before {
		content: "\e609";
	}

	.tui-upload-box {
		width: 100%;
		min-height: 144rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.tui-upload-add {
		width: 144rpx;
		height: 144rpx;
		font-size: 40rpx;
		font-weight: 100;
		text-align: center;
		color: #888;
		padding: 0;
		border: 1rpx dashed #dedede;
		border-radius: 8rpx;
	}
	.tuiAdd{
		width: 100%;
	}
	.tui-upload-add .addText {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
	}
	.tui-image-item {
		width: 144rpx;
		height: 144rpx;
		position: relative;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 8rpx;
	}

	.tui-image-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-item-img {
		width: 144rpx;
		height: 144rpx;
		display: block;
		border-radius: 8rpx;
	}

	.tui-img-del {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: -12rpx;
		top: -12rpx;
		background-color: #EB0909;
		border-radius: 50%;
		color: white;
		font-size: 34rpx;
		z-index: 9;
	}

	.tui-img-del::before {
		content: '';
		width: 16rpx;
		height: 1px;
		position: absolute;
		left: 10rpx;
		top: 18rpx;
		background-color: #fff;
	}

	.tui-upload-mask {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		padding: 40rpx 0;
		box-sizing: border-box;
		border-radius: 8rpx;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.tui-upload-mask1{
		padding: 28rpx 0;
	}

	.tui-upload-loading {
		width: 28rpx;
		height: 28rpx;
		border-radius: 50%;
		border: 2px solid;
		border-color: #B2B2B2 #B2B2B2 #B2B2B2 #fff;
		animation: tui-rotate 0.7s linear infinite;
	}

	@keyframes tui-rotate {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.tui-tips {
		font-size: 24rpx;
		color: #fff;
	}

	.tui-mask-btn {
		padding: 4rpx 16rpx;
		border-radius: 40rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		border: 1rpx solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10rpx;
	}

	.tui-btn-hover {
		opacity: 0.8;
	}
	.videoBox{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0);
		z-index: 9999;
	}
	.videoAll{
		width: 100%;
	}
	.tui-item-img .icon-bofang {
		font-size: 100rpx;
		color: white;
		position: absolute;
		font-size: 60rpx;
		left: 50%;
		top: 50%;
		margin-left: -30rpx;
		margin-top: -30rpx;
	}
	.moveV {
		opacity: 0.8;
		z-index: 999;
	}
	.moveV image,  .moveV video{
		width: 80px;
		height: 80px;
	}
</style>
