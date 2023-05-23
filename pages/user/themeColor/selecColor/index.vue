<template>
	<!--底部抽屉-->
	<tui-bottom-popup :show="bottomPopup" @close="hideModal">
		<view class="main">
			<view class="t-c f-32 p-t-30 p-b-30">主题色</view>
			<view class="pop-close" @tap="hideModal"><text class="iconfont2 icon-shanchu1 f-30"></text></view>
			<scroll-view scroll-y class="color-wrap">
				<view class="color-box dis-flex flex-wrap flex-x-between">
					<view class="color-txt f-24 dis-flex flex-dir-column flex-y-center flex-x-center"
						:class="[tabIndex == index ? 'active' : '']"
						v-for="(item, index) in colorsArr"
						:key="index"
						@tap.stop="switchColor(index)"
					>
						<view class="colorBlock m-b-20" :style="'background:'+item.color+';'"></view>
						{{ item.name }}
						<view class="gou" v-show="tabIndex == index"><text class="iconfont2 icon-choice"></text></view>
					</view>
				</view>
			</scroll-view>
			<!-- 底部操作栏 -->
			<view class="foot-operate wrap30 flex-y-center dis-flex">
				<view class="sure-btn t-c col-f f-32 flex-box" @tap.stop="changeTheme">确定</view>
			</view>
		</view>
	</tui-bottom-popup>
</template>

<script>
	export default{
		data(){
			return{
				bottomPopup: false,
				colorsArr: [],
				tabIndex: 0,
			}
		},
		methods: {
			openModal(data,index) {
				this.bottomPopup = true;
				this.colorsArr = JSON.parse(data)||[];
				this.tabIndex = index>=0?index:0;
			},
			hideModal() {
				this.bottomPopup = false;
			},
			switchColor(index){
				this.tabIndex = index;
			},
			// 修改颜色主题
			changeTheme(){
				this.hideModal()
				let data = this.colorsArr[this.tabIndex];
				this.$emit('changeTheme',data)
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
