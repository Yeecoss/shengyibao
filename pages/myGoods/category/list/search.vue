<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar lLidth="width:auto" extClass="nav" id="top">
			<!-- 搜索框 -->
			<view class="dis-flex search-input-box" slot="center">
				<search @search="search" placeholder="搜索分类"></search>
			</view>
		</navigationBar>
		<!-- 分类列表 -->
		<view class="main" v-if="category != ''">
			<block v-for="(item,index) in category" :key="item.category_id">
				<tui-list-cell :hover="false" class="title title1">{{item.name}}</tui-list-cell>
				<block v-for="(v1,i1) in item.child" :key="v1.category_id">
					<tui-list-cell :hover="false" :size="26" color="#666" class="title">
						<view class="title2"><text class="iconfont2 icon-pull-down1 f-26"></text>{{v1.name}}</view>
					</tui-list-cell>
					<block v-for="(v2,i2) in v1.child" :key="v2.category_id">
						<tui-list-cell :hover="false" :size="24" color="#666" class="title" @tap="change3(index,i1,i2)">
							<view class="title3 f-24" :class="v2.current!=-1?'checked':''"><text class="iconfont2 icon-pull-down1 f-24"></text>{{v2.name}}</view>
						</tui-list-cell>
					</block>
				</block>
			</block>
			<!-- 底部 -->
			<view class="foot-wrap">
				<view class="foot bgf wrap30 dis-flex flex-y-center">
					<view class="foot-btn f-32 flex-box" :class="checkItem?'active':''" @tap="toSubmit">确定</view>
				</view>
			</view>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/20200622144854e503b3563.png" :imgWidth="264" :imgHeight="264" v-if="category==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import search from '@/components/uni-search/index';
	export default {
		components: {
			search
		},
		data() {
			return {
				data:'',//分类数据
				index: 1,//提示框
				keyword:'',
				category: [],
				checkItem:'',//选中的分类
				parent_name:'',//选中的三级分类父级name
			}
		},
		onLoad(options) {
			let that = this;
		},
		methods: {
			//添加到我的分类
			toSubmit(){
				let that = this;
				if(that.checkItem){
					let category_id = that.checkItem.category_id;
					app._post_form('goods.category/add',{name: that.checkItem.name,category_id: category_id},res => {
						if(res.code==1){
							this.$api.msg(res.msg);
							setTimeout(() => {that.pageBack(that.checkItem,that.parent_name)},1500)
						}else{
							this.$api.msg(res.msg);
						}
					});
				}else{
					this.$api.msg('请先选择子分类！');
				}
			},
			// 搜索
			search(e){
				this.keyword = e;
				if(this.keyword != ''){
					app._get('goods.category/index', {keyword:this.keyword}, async res => {
						let list = await this.initData(res.data.tree);
						this.category = list;
					})
				}else{
					this.$api.msg('内容不能为空！');
				}
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
			// 三级选择
			change3(index,i1,i2){
				let that = this;
				for(let i in that.category){
					for(let j in that.category[i].child){
						for(let k in that.category[i].child[j].child){
							let item = that.category[i].child[j].child[k];
							if(index==i && i1==j && i2==k){
								item.current = item.current == i2 ? -1 : i2;
								that.checkItem = item.current == i2 ? item : '';
								that.parent_name = item.current == i2 ?that.category[index].name+'>'+that.category[index].child[i1].name : '';
							}else{
								item.current = -1
							}
						}
					}
				}
			},
			//返回
			pageBack(data,pname){
				let that = this;
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.checkCategory){
					prevPage.$vm.checkCategory(data,pname)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import "index";
</style>
