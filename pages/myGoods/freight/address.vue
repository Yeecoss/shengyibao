<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="选择地区" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<checkbox-group class="goods-list" @change.stop="choose">
				<view class="list f-28 col-3" v-for="(item,index) in list" :key="index">
					<label class="check-wrap default-check dis-flex flex-y-center">
						<checkbox class="checkbox" :value="item.name" :checked="item.checked" />
						{{item.name}}
					</label>
				</view>
			</checkbox-group>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30 dis-flex flex-y-center flex-x-between">
				<checkbox-group class="check-wrap default-check checked-all f-28 col-3 dis-flex flex-y-center" @change="chooseAll">
					<label class="check-wrap default-check dis-flex flex-y-center">
						<checkbox :checked="isAll"/>全选
					</label>
				</checkbox-group>
				<view class="foot-btn f-28 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp().globalData;
	export default {
		components: {
		},
		data() {
			return {
				list: [],//城市列表
				checkList: [],//选中城市的id
				checkData: [],//选中城市的名称
				isAll: false,
			}
		},
		onLoad(options) {
			
			let that = this;
			if(options){
				that.list = JSON.parse(decodeURIComponent(options.regionData));
				if(options.checkId){
					that.checkData = JSON.parse(decodeURIComponent(options.checkId));
					that.choose(that.checkData);
				}
				if(options.index){that.index = options.index}
			}
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				that.pageBack(that.checkList,that.checkData,that.index);
			},
			// 选中
			choose(e) {
				let that = this;
				var items = that.list,
						values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.name)){
						that.$set(item,'checked',true)
					}else{
						that.$set(item,'checked',false)
					}
				}
				//  是否全部勾选，判断全选与否状态
				var checkList = [];
				var checkData = [];
				that.list.forEach(item => {
					item.checked == true? checkList.push(item.id): '';
					item.checked == true? checkData.push(item.name): '';
				});
				let allChecks = checkList.length == that.list.length;
				that.isAll = allChecks ? true:false;
				that.checkList = checkList;
				that.checkData = checkData;
			},
			// 全选
			chooseAll(e){
				let that = this;
				if (e.detail.value.length == 0) {
						that.list.map(item => that.$set(item, 'checked', false))
						that.isAll= false;
				} else {
						that.list.map(item => that.$set(item, 'checked', true))
						that.isAll= true;
				}
				var checkList = [];
				var checkData = [];
				that.list.forEach(item => {
					item.checked == true? checkList.push(item.id): ''
					item.checked == true? checkData.push(item.name): ''
				});
				that.checkList = checkList;
				that.checkData = checkData;
			},
			//返回
			pageBack(checkList,checkData,index){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.regionChange){
					prevPage.$vm.regionChange(checkList,checkData,index)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import "address";
</style>
