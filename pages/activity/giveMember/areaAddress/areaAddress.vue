<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="活动地区" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<!-- 搜索框 -->
			<view class="wrap30">
				<search @search="searchCity" placeholder="请搜索你的地区"></search>
			</view>
			<!-- 列表 -->
			<template v-if="inputVal==''">
				<block v-for="(item,index) in list" :key="index">
					<tui-collapse :index="index" :current="current1" arrowColor="#666" @click="change(index)">
						<template v-slot:title>
							<tui-list-cell :hover="false" :size="30" color="#222" class="title title1">{{item.name}}</tui-list-cell>
						</template>
						<template v-slot:content>
							<block v-if="current1==index">
								<block v-for="(v1,i1) in item.child" :key="i1">
									<tui-collapse :index="i1" :current="current2" arrowColor="#666" @click="change2(index,i1)">
										<template v-slot:title>
											<tui-list-cell :hover="false" :size="28" color="#333" class="title">
												<view class="title2"><text class="iconfont2 icon-pull-down1 f-28"></text>{{v1.name}}</view>
											</tui-list-cell>
										</template>
										<template v-slot:content>
											<view class="title3-wrap dis-flex flex-wrap">
												<block v-for="(v2,i2) in v1.child" :key="i2">
													<view class="title3 f-28 col-6">{{v2}}</view>
												</block>
											</view>
										</template>
									</tui-collapse>
								</block>
							</block>
						</template>
					</tui-collapse>
				</block>
			</template>
			
			<view class="" v-if="inputVal!=''">
				<block v-for="(item,index) in searchList" :key="index">
					<tui-collapse :index="index" :current="index" arrowColor="#666" @click="change(index)">
						<template v-slot:title>
							<tui-list-cell :hover="false" :size="30" color="#222" class="title title1">{{item.name}}</tui-list-cell>
						</template>
						<template v-slot:content>
							<!-- <block v-if="current1==index"> -->
								<block v-for="(v1,i1) in item.child" :key="i1">
									<tui-collapse :index="i1" :current="i1" arrowColor="#666" @click="change2(index,i1)">
										<template v-slot:title>
											<tui-list-cell :hover="false" :size="28" color="#333" class="title">
												<view class="title2"><text class="iconfont2 icon-pull-down1 f-28"></text>{{v1.name}}</view>
											</tui-list-cell>
										</template>
										<template v-slot:content>
											<view class="title3-wrap dis-flex flex-wrap">
												<block v-for="(v2,i2) in v1.child" :key="i2">
													<view class="title3 f-28 col-6">{{v2}}</view>
												</block>
											</view>
										</template>
									</tui-collapse>
								</block>
							<!-- </block> -->
						</template>
					</tui-collapse>
				</block>
			</view>
			<!-- 搜索结果 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list==''">
				<view class="col-9">暂无数据</view>
			</tui-no-data>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	export default {
		components: {
			search,
		},
		data() {
			return {
				//手风琴效果
				current1: -1,
				current2: -1,
				current3: -1,
				inputVal: '',
				list: [],
				searchList: [],
				id: '',
			}
		},
		onLoad(options) {
			this.id = options.id||1;
			this.getList()
		},
		methods: {
			getList(){
				app._get('vip.activity/getActiveAreas', {activity_id: this.id}, res => {
					this.list = res.data || [];
				})
			},
			// 搜索城市
			searchCity(inputVal) {
				this.inputVal = inputVal;
				if (inputVal=='') {
					// this.$api.msg("请输入搜索关键词")
					return
				}
				
				let result = [];
				app._get('vip.activity/searchRecordAddress',{
					activity_id: this.id,
					search: inputVal
				}, res => {
					this.searchList = res.data||[];
				})
				
				// this.list.forEach((item1, index1) => {
				// 	item1.data.forEach((item2, index2) => {
				// 		if (item2.name.indexOf(inputVal) !== -1 || item2.phone==inputVal) {
				// 			let obj = {};
				// 			obj.letter = item1.letter;
				// 			let data = [];
				// 			data.push(item2);
				// 			obj.data = data;
				// 			result.push(obj)
				// 		}else{
				// 			let obj = {};
				// 			obj.letter = item1.letter;
				// 			let data = [];
				// 			let obj2 = {};
				// 			obj2.name = item2.name;
				// 			obj2.phone = item2.phone;
				// 			obj2.data = item2.data.filter((item3, index3) =>{
				// 				let addr = item3.region.province+' '+item3.region.city+' '+item3.region.region+' '+item3.detail;
				// 				if (addr.indexOf(inputVal) != -1) {
				// 					return item3;
				// 				}
				// 			});
				// 			if(obj2.data!=''){
				// 				data.push(obj2)
				// 			}
				// 			if(data!=''){
				// 				obj.data = data;
				// 				result.push(obj)
				// 			}
				// 		}
				// 	})
				// });
			},
			// 一级开关
			change(index1) {
				let that = this;
				that.current1 = that.current1 == index1 ? -1 : index1;
				that.current2 = -1;
				that.current3 = -1;
			},
			// 二级开关
			change2(index1,index2){
				let that = this;
				
				if(that.current2 == -1){
					that.current2 = index2;
				}else{
					that.current2 = that.current2 == index2 ? -1 : index2;
				}
				that.current3 = -1;
			},
		}
	}
</script>

<style lang="scss">
	@import 'areaAddress';
</style>
