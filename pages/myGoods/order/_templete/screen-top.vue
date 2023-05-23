<template>
	<!--screen-->
	<view class="tui-header-screen">
		<view class="tui-screen-top">
			<view class="tui-top-item tui-icon-ml" :class="[tabIndex == 0 ? 'tui-active tui-bold' : '']" @tap="screen(0)">
				<view>{{ selectedName }}</view>
				<tui-icon :name="selectH > 0 ? 'turningup' : 'turningdown'" :size="16" :color="tabIndex == 0 ? '#FF7541' : '#333'"></tui-icon>
			</view>
			<view class="tui-line"></view>
			<view class="tui-top-item" :class="[tabIndex == 1 ? 'tui-active tui-bold' : '']" @tap="rightDrawer">
				<view>筛选</view>
				<text class="iconfont2 icon-screen f-28 m-l-10"></text>
			</view>
	
			<!--下拉选择列表--待处理-->
			<view class="tui-dropdownlist" :class="[selectH > 0 ? 'tui-dropdownlist-show' : '']" :style="{ height: selectH + 'rpx' }">
				<view
					class="tui-dropdownlist-item tui-icon-middle col-3"
					:class="[item.selected ? 'tui-bold app-red' : '']"
					v-for="(item, index) in dropdownList"
					:key="index"
					@tap.stop="dropdownItem(item.val)"
				>
					<text class="tui-ml tui-middle">{{ item.name }}</text>
					<tui-icon name="check" :size="16" color="#FF7541" :bold="true" v-if="item.selected"></tui-icon>
				</view>
			</view>
			<view class="tui-dropdownlist-mask" :class="[selectH > 0 ? 'tui-mask-show' : '']" @tap.stop="hideDropdownList"></view>
			<!--下拉选择列表--待处理-->
		</view>
		<!-- 右筛选框 -->
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import rightDrawer from './rightDrawer/index';
	export default {
		components: {
			rightDrawer
		},
		data() {
			return {
				tabIndex: 0, //顶部筛选索引
				selectedName: '待处理',
				selectH: 0,
				dropdownList: [
					{
						name: '待处理',
						selected: true,
						val: '10'
					},
					{
						name: '已发货',
						selected: false,
						val: '50'
					},
					{
						name: '已完成',
						selected: false,
						val: '20'
					}
				],
				screenObj: {},
			}
		},
		methods: {
			screen(index) {
				this.hideDropdownList();
				if (index == 0) {
					this.showDropdownList(0);
				} 
			},
			// 状态传入
			dropdownItem(val) {
				let arr = this.dropdownList;
				let name = '';
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].val === val) {
						arr[i].selected = true;
						name = arr[i].name;
					} else {
						arr[i].selected = false;
					}
				}
				this.dropdownList = arr;
				this.selectedName = name;
				this.selectH = 0;
				this.tabIndex = 0;
				
				let data = this.getData() ||'';
				this.$emit('compelete',data)
			},
			// 选框显示
			showDropdownList(index) {
				if(index==0){
					this.selectH = 240;
				}
				this.tabIndex = index;
			},
			hideDropdownList() {
				this.selectH = 0;
			},
			// 筛选结果
			getData(){
				let data = this.screenObj;
				for (let i in this.dropdownList) {
					if(this.dropdownList[i].selected){
						data.order_status = this.dropdownList[i].val;
					}
				}
				return data;
			},
			//打开筛选框
			rightDrawer() {
			  this.$refs.rightDrawer.screen()
			},
			//筛选框确定
			rightDrawerChange(obj) {
				this.screenObj = JSON.parse(JSON.stringify(obj));
				let data = this.getData() ||'';
				this.$emit('compelete',data)
			},
		}
	}
</script>

<style lang="scss">
	.tui-bold {
		font-weight: bold;
	}
	.tui-active {
		color: $red;
	}
	.tui-screen-top{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	}
	.tui-screen-top {
		height: 88rpx;
		position: relative;
		background: #fff;
	}
	.tui-top-item {
		height: 88rpx;
		line-height: 88rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-line{
		width: 1rpx;
		height: 28rpx;
		background: #D8D8D8;
	}
	/*顶部下拉选择 综合*/
	.tui-dropdownlist {
		width: 100%;
		position: absolute;
		background-color: #fff;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 30rpx;
		left: 0;
		top: 88rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 9;
	}
	.tui-dropdownlist-show {
		visibility: visible;
	}
	.tui-dropdownlist-item {
		height: 80rpx;
		font-size: 26rpx;
		padding: 0 20rpx;
		border-top: 1rpx solid #eee;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tui-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}
</style>
