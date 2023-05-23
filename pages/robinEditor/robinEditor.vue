<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="编辑内容" extClass="nav" id="top"></navigationBar>
		<robin-editor ref="robinEditor" @save="save" @cancel="cancel" :html="html" :muiltImage="true"></robin-editor>
  		<popup-tips title="提示" content="是否加载上次编辑数据？" ref="popupTips" @tipsCallback="getRobinEditorHtml"></popup-tips>
	</view>
</template>

<script>
	import robinEditor from '@/components/robin-editor/editor';
	import popupTips from '@/components/popup-tips/index';
	const app = getApp().globalData;
	
	export default {
		components: {
			robinEditor,
			popupTips
		},
		data() {
			return {
				html:'',
				otherImg: [],
				isSub: false
			}
		},
		onLoad(options) {
			if (options.val) {
				this.html = decodeURIComponent(options.val) || ''
				// console.log(this.html)
			} else {
				this.$nextTick(() => {
					let robinEditorHtml = uni.getStorageSync('robinEditorHtml')
					if (robinEditorHtml) {
						this.$refs.popupTips.open()
					}
				})
			}
		},
		onUnload() {
    		if (!this.isSub) {
				this.$refs.robinEditor.setHtml()
			}
		},
		onShow() {
			if (this.otherImg.length > 0) {
				this.insetImg()
			}
		},
		methods: {
			insetImg() {
				this.otherImg.forEach(item => {
					this.$refs.robinEditor.addHtml(item.path)
				})
                this.$nextTick(() => {
					this.otherImg = []
                })
			},
			canvaChange(index, imgUrl) {
				if (imgUrl) {
					if (this.$refs.robinEditor) {
						this.$refs.robinEditor.addHtml(imgUrl)
					}
				}
			},
			getRobinEditorHtml() {
				this.$refs.robinEditor.getHtml()
			},
			// 保存文档
			save(e){
				this.isSub = true
				//裁剪完成后处理逻辑
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if (prevPage.$vm.editorChange) {
					prevPage.$vm.editorChange(e.html)
				}
				uni.navigateBack();
			},
			cancel(e){
				uni.navigateBack();
			},
			materialChange(data){
				this.otherImg = data
			},
		},
	}
</script>

<style>

</style>
