<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="选择分类" extClass="nav" id="top"></navigationBar>
		<view class="main pad_lr30">
			
			<view class="list">
				<view class="dis-flex flex-wrap">
					<view class="list-title col-3 f-30">已选分类</view>
					<view class="list-item f-28 dis-flex flex-y-center" v-for="(item,index) in searList" :key="index" @tap="delTag(index)">
						# <text class="flex-box onelist-hidden">{{item}}</text> <text class="iconfont2 icon-cross-mini del-icon"></text>
					</view>
					<view class="list-item label label-tag f-28" @tap.stop="openItem('tag')">
						<view class="onelist-hidden col-6"><text class="iconfont2 icon-jiahao m-r-10"></text> 自定义分类</view>
					</view>
				</view>
				<view class="dis-flex flex-wrap" v-if="list">
					<view class="list-title col-3 f-30">推荐分类</view>
					<template v-if="list.length>0">
						<view class="list-item f-28" v-for="(item,index) in list" :key="index" @tap="tagChange(index,0)"># {{item.name}}</view>
					</template>
					<view class="f-24 col-6 m-top30" v-else>暂无分类</view>
				</view>
				<view class="dis-flex flex-wrap" v-if="recentTag">
					<view class="list-title col-3 f-30">历史分类</view>
					<template v-if="recentTag.length>0">
						<view class="list-item f-28" v-for="(item,index) in recentTag" :key="index" @tap="tagChange(index,1)"># {{item}}</view>
					</template>
					<view class="f-24 col-6 m-top30" v-else>暂无分类</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot bgf wrap30 dis-flex flex-y-center">
				<view class="foot-btn f-32 col-f flex-box" @tap="toSure">确定</view>
			</view>
		</view>
		
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<popup-input ref="popupInput" title="自定义分类" :maxlength="-1" placeholder="分类名"></popup-input>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import popupInput from '@/components/popup-input/index';
	export default {
		components: {
			popupTips,
			popupInput,
		},
		data() {
			return {
				mtitle:'',
				mcontent:'',
				list:[],//推荐分类
				recentTag: [],//历史分类
				searList: [],//已选分类
				// current1: -1,
				// current2: -1,
			}
		},
		onLoad(options) {
			this.searList = JSON.parse(options.tags||[]);
			this.getList()
		},
		//生命周期函数--监听页面显示
		onShow: function () {
			// 获取历史搜索
			this.getRecentTag();
		},
		methods: {
			toSure(){
				// if(this.searList.length<=0 || this.searList==''){
				// 	this.$api.msg('请先选择分类！')
				// 	return false
				// }
				this.pageBack(this.searList)
			},
			// 获取系统分类
			getList(){
				app._get('shop.wxapp.goods/getSystemTags', {}, res => {
					this.list = res.data || [];
				})
			},
			// 删除已选分类
			delTag(index){
				this.mtitle = '提示';
				this.mcontent = '确认删除？';
				this.$refs.popupTips.open(() => {
					this.searList.splice(index,1)
				})
			},
			// 自定义分类
			openItem(){
				let searList = this.searList;
				if(searList.length>=5){
					this.$api.msg('最多只能选择5个分类！')
				}else{
					this.$refs.popupInput._open('', (val) => {
							let index0 = searList.indexOf(val);
							index0 > -1 && searList.splice(index0, 1);
							searList.push(val)
							this.searList = searList;
							this.saveTags(val)
					})
				}
			},
			// 点击
			tagChange(index,type){
				let that = this;
				let val = type==0? that.list[index].name : that.recentTag[index];
				let searList = that.searList;
				if(searList.length>=1){
					this.$api.msg('最多只能选择1个分类！')
				}else{
					let index0 = searList.indexOf(val);
					index0 > -1 && searList.splice(index0, 1);
					searList.push(val)
					that.searList = searList;
					that.saveTags(val)
				}
			},
			saveTags(name){
				let tag = {
					name: name
				};
				
				let recentTag = wx.getStorageSync('recentTag') || [];
				if(recentTag.length>=20){
					recentTag.pop()
				}
				// 去重
				let index0 = recentTag.indexOf(name);
				index0 > -1 && recentTag.splice(index0, 1);
				recentTag.unshift(name);
				wx.setStorageSync('recentTag', recentTag); 
			},
			//获取历史分类
			getRecentTag: function () {
				this.recentTag = wx.getStorageSync('recentTag');
			},
			//清空最近搜索记录
			clearTag: function () {
				wx.removeStorageSync('recentTag');
				this.getRecentTag();
			},
			//返回
			pageBack(data){
				//返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.tagChange){
					prevPage.$vm.tagChange(data)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import "index";
</style>
