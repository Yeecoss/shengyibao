<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="选择分类" extClass="nav" id="top" @back="pageBack2"></navigationBar>
		<view class="main">
			<!-- 搜索框 -->
			<view class="wrap30">
				<search :disabled="true" @gosearch="search" placeholder="搜索分类"></search>
			</view>
			<!-- 我的分类 -->
			<view class="wrap30 my_cate" v-if="my_cate!=''">
				<view :hover="false" class="title title1 f-28 col-3">我的分类</view>
				<view class="my_cate_list dis-flex flex-wrap">
					<block v-for="(v,i) in my_cate" :key="i">
						<view v-show="showCate? (i>=0) : (i<=6)" @tap="change4(i)" :class="myCateOn == i?'checked':''" class="my_cate_item f-22 col-6">{{v.fname}}>{{v.sname}}>{{v.name}}</view>
					</block>
					<view class="my_cate_btn" v-if="my_cate.length>=6" @tap="showMyCate">
						<text class="iconfont2" :class="showCate?'icon-shangjiantou':'icon-xiajiantou'"></text>
					</view>
				</view>
			</view>
			<!-- 分类列表 -->
			<block v-for="(item,index) in category" :key="index">
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
											<view class="title2"><text class="iconfont2 icon-pull-down1 f-26"></text>{{v1.name}}</view>
										</tui-list-cell>
									</template>
									<template v-slot:content>
										<block v-for="(v2,i2) in v1.child" :key="i2">
											<tui-list-cell :hover="false" :size="24" color="#666" class="title" @click="change3(index,i1,i2)">
												<view class="title3 f-24" :class="current3==i2?'checked':''"><text class="iconfont2 icon-pull-down1 f-24"></text>{{v2.name}}</view>
											</tui-list-cell>
										</block>
										<view class="add-category f-24" @tap="addCate(index,i1)"><text class="iconfont2 icon-jiahao f-24"></text>自定义分类</view>
									</template>
								</tui-collapse>
							</block>
						</block>
					</template>
				</tui-collapse>
			</block>
		</view>
		<!-- 底部 -->
		<view class="foot-wrap">
			<view class="foot bgf wrap30 dis-flex flex-y-center">
				<view class="foot-btn f-32 flex-box" :class="checkItem?'active':''" @tap="toSubmit">确定</view>
			</view>
		</view>
		<!-- 弹窗输入框 -->
		<popup-input ref="popupInput" :title="title" placeholder="请输入三级分类(最多15字)"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import popupInput from '@/components/popup-input/index';
	export default {
		components: {
			search,
			popupInput
		},
		data() {
			return {
				index: 1,//提示框
				my_cate: [],//我的分类三级列表
				myCateOn: -1,//我的分类三级列表默认不选中
				showCate: false,//默认我的分类三级列表不显示完
				source: false,
				category: [],
				child:[],//三级分类列表
				checkItem: '',//选中的三级分类
				parent_name:'',//选中的三级分类父级name
				title:'添加分类',//添加分类
				//手风琴效果
				current1: 0,//默认第一级开启
				current2: -1,
				current3: -1,
			}
		},
		onLoad(options) {
			if(options.source){
				this.source = options.source;
			}
			this.getCateList();
		},
		onShow() {
			if(this.source){
				this.getMyCateList();
			}
		},
		methods: {
			//添加到我的分类
			toSubmit(){
				let that = this;
				if(that.checkItem){
					let category_id = that.checkItem.category_id;
					if(that.source){
						that.pageBack();
					}else{
						app._post_form('goods.category/add',{name: that.checkItem.name,category_id: category_id},res => {
							that.$api.msg(res.msg);
							if(res.code==1){
								that.pageBack();
							}
						});
					}
				}else{
					that.$api.msg('请先选择子分类！')
				}
			},
			// 获取分类列表
			getCateList(parent_id,callback){
				var data = {};
				if(parent_id){data.category_id = parent_id;}
				app._get('goods.category/index', data, res => {
						let list = res.data.tree;
						if(parent_id){
								callback(list);
						}else{
							this.category = list;
						}
				})
			},
			initData(list){
				for (let item of list) {
					item.current = -1;
					if(item.child){
						for (let item2 of item.child) {
							item2.current = -1;
							if(item2.child){
								for (let item3 of item2.child) {
									item3.current = -1;
								}
							}
						}
					}
				}
				return list;
			},
			// 自定义三级分类-默认添加到我的分类
			addCate(index,index2){
				let that = this;
				for(let i in that.category){
					for(let j in that.category[i].child){
						for(let k in that.category[i].child[j].child){
							let item = that.category[i].child[j].child[k];
							item.current = -1
						}
					}
				}
				var newItem= {};
				that.title = that.category[index].child[index2].name;
				that.$refs.popupInput._open('',(val) => {
					if(val==''){return}
					if(val.length>15){that.$api.msg('最多输入15个字，请重新添加哦！',2000);return}
					newItem.name = val;
					// newItem.current = -1;//默认不选中
					app._post_form('goods.category/add',{name: newItem.name,parent_id:that.category[index].child[index2].category_id},res => {
						if(res.code==1){
							newItem.category_id = res.data.category_id;
							that.$api.msg(res.msg);
							that.category[index].child[index2].child.push(newItem);
							that.checkItem = newItem;
							that.parent_name = that.category[index].name+'>'+that.category[index].child[index2].name;
							that.pageBack();
							
						}else{
							that.$api.msg(res.msg);
						}
					})
				})
			},
			// 获取最近我的分类列表
			getMyCateList(){
				app._get('shop.category/recent',{},res => {
					this.my_cate = res;
				});
			},
			//返回
			pageBack(){
				let that = this;
				let checkItem = that.checkItem;
				if(checkItem){
					checkItem.name = that.parent_name? that.parent_name+'>'+checkItem.name : checkItem.name;
					that.checkItem = checkItem;
				}
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.checkCategory){
					prevPage.$vm.checkCategory(that.checkItem)
				}
				uni.navigateBack();
			},
			//返回
			pageBack2(){
				let that = this;
				let checkItem = that.checkItem;
				if(checkItem){
					checkItem.name = that.parent_name? that.parent_name+'>'+checkItem.name : checkItem.name;
					that.checkItem = checkItem;
				}
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.checkCategory){
					prevPage.$vm.checkCategory(that.checkItem)
				}
			},
			checkCategory(data,pname){
				this.checkItem = data;
				this.parent_name = pname;
			},
			// 一级开关
			change(index1) {
				let that = this;
				// that.initData(that.category);
				that.current1 = that.current1 == index1 ? -1 : index1;
				that.current2 = -1;
				that.current3 = -1;
				that.checkItem = '';
				that.parent_name = '';
			},
			// 二级开关
			change2(index1,index2){
				let that = this;
				
				// if(that.current2 == -1){
				if(that.current2 != index2){
					if(that.category[index1].child[index2].child &&(that.category[index1].child[index2].child!='')){
						that.current2 = index2;
					}else{
						that.getCateList(that.category[index1].child[index2].category_id, list => {
							that.$nextTick(() => {
								that.category[index1].child[index2].child = list;
								that.current2 = index2;
							})
						});
					}
				}else{
					that.current2 = that.current2 == index2 ? -1 : index2;
				}
				that.current3 = -1;
				that.checkItem = '';
				that.parent_name = '';
			},
			// 三级选择
			change3(index,i1,i2){
				let that = this;
				that.myCateOn = -1;
				that.current3 = that.current3 == i2 ? -1 : i2;
				that.checkItem = that.current3 == i2 ?that.category[index].child[i1].child[i2] : '';
				that.parent_name = that.current3 == i2 ?that.category[index].name+'>'+that.category[index].child[i1].name : '';
			},
			//我的分类选择
			change4(index){
				let that = this;
				that.current3 = -1;
				that.myCateOn = that.myCateOn == index ? -1 : index;
				that.checkItem = that.myCateOn == index ?that.my_cate[index] : '';
				that.parent_name = that.myCateOn == index ?that.my_cate[index].fname+'>'+that.my_cate[index].sname : '';
			},
			//开关我的分类
			showMyCate(){
				this.showCate = !this.showCate;
			},
			// 搜索
			search (){
				uni.navigateTo({
					url: './search'
					// url: './search?data='+encodeURIComponent(JSON.stringify(this.sdata))
				})
			},
			
		}
	}
</script>

<style lang="scss">
	@import "index";
</style>
