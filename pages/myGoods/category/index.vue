<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="我的分类" extClass="nav" id="top"></navigationBar>
		<!-- 列表内容 -->
		<view class="main" v-if="category!=''">
			<view class="cate_list dis-flex flex-wrap">
				<block v-for="(item,index) in category" :key="index">
					<view class="category-title f-28 col-3">{{item.name}}</view>
					<view v-for="(v,k) in item.child" :key="k" @tap="toEdit(index,k)" :class="v.checked?'checked':''" class="category-item f-24 col-6">{{v.name}}</view>
					<view class="add-category f-24" @tap="addCate(index)"><text class="iconfont2 icon-jiahao f-24"></text>自定义分类</view>
				</block>
			</view>
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30">
					<view class="foot-btn f-32 col-f" @tap.stop="toAddCate"><!-- <text class="iconfont2 icon-jiahao f-36"></text> -->选择分类</view>
				</view>
			</view>
		</view>
		<!-- 无数据 -->
		<view class="yoshop-notcont" v-if="category==''">
			<text class="iconfont2 icon-classify"></text>
			<text class="cont">亲，还没有分类哦～</text>
			<view @tap.stop="toAddCate" class="flow-btn-min">去添加</view>
		</view>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="ifshow" :itemList="itemList" :radius="false" @click="clickNext" @cancel="cancel"></tui-actionsheet>
		<!-- 弹窗输入框 -->
		<popup-input ref="popupInput" :title="title" :popVal="popVal" @cancel="cancel1" placeholder="请输入分类(最多15字)"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	export default {
		components: {
			popupInput
		},
		data() {
			return {
				index: 1,//提示框
				category: [],
				checkItem:'',//选中的分类
				title:'添加分类',//添加分类
				popVal:'',
				ifshow: false,//是否显示操作菜单
				itemList: [{text: '商品列表',color: '#333'},{text: '编辑',color: '#333'},{text: '删除',color: '#333'},],
			}
		},
		onLoad() {
		},
		onShow(){
			this.getCateList();
		},
		methods: {
			// 获取分类列表
			getCateList(){
				app._get('goods.category/my',{},res => {
					this.category = res.data.tree;
				})
			},
			// 选中分类
			toEdit(index1,index2) {
				let that = this;
				let category = that.category;
				for (let key1 in category) {
					for (let key2 in category[key1].child) {
						let item = category[key1].child[key2];
						if(index1 == key1 && index2 == key2){
							item.checked = !item.checked;
							that.checkItem = item.checked ? item : '';
						}else{
							item.checked = false;
						}
					}
				}
				that.category = category;
				//判断是否为自定义菜单
				if(that.checkItem.category_type==1){
					that.itemList = [{text: '商品列表',color: '#333'},{text: '删除',color: '#333'},];
				}else{
					that.itemList = [{text: '商品列表',color: '#333'},{text: '编辑',color: '#333'},{text: '删除',color: '#333'},];
				}
				that.ifshow = true;
			},
			// 自定义分类
			addCate(index){
				let that = this;
				var newItem= {};
				that.title = "添加分类";
				that.$refs.popupInput._open('',(val) => {
					if(val==''){return}
					if(val.length>15){that.$api.msg('最多输入15个字，请重新添加哦！',2000);return}
					newItem.name = val; 
					newItem.current = -1;//默认不选中
					app._post_form('goods.category/add',{name: newItem.name,parent_id: that.category[index].category_id},res => {
						if(res.code==1){
							newItem.category_id = res.data.category_id;
							this.$api.msg(res.msg);
							that.category[index].child.push(newItem);
						}else{
							this.$api.msg(res.msg);
						}
					})
				})
				that.init();
			},
			// 点击底部操作菜单
			clickNext(e){
				let that = this;
				// 商品列表
				if(e.index == 0){
					that.ifshow = false;
					uni.navigateTo({
						url: '/pages/category/extend/list?category_id=' + that.checkItem.category_id //+ '&search=' + that.checkItem.name
					})
				}
				// 编辑分类
				if(that.itemList[e.index].text == '编辑'){
					that.ifshow = false;
					that.title = "编辑分类";
					that.popVal = that.checkItem.name;
					that.$refs.popupInput._open(that.popVal,(val) => {
						if(val==''){return}
						if(val.length>15){that.$api.msg('最多输入15个字，请重新添加哦！',2000);return}
						let data = {
							category_id: that.checkItem.category_id,
							name: val
						};
						that.edit(data);
					})
				}
				// 删除分类
				if(that.itemList[e.index].text == '删除'){
					that.ifshow = false;
					that.delete(that.checkItem.category_id);
					that.init()
				}
			},
			// 编辑分类
			edit(data){
				let that = this;
				app._post_form('goods.category/edit',data, res => {
					that.$api.msg(res.msg);
					if(res.code==1){
						that.getCateList();
					}
				});
			},
			// 删除分类
			delete(id){
				let that = this;
				app._post_form('goods.category/delete',{category_id:id}, res => {
					that.$api.msg(res.msg);
					if(res.code==1){
						that.getCateList();
					}else{
						that.init()
					}
				});
			},
			//关闭底部菜单
			cancel1(){
				let that = this;
				for (let key in that.category) {
					for (let s in that.category[key].child) {
						that.category[key].child[s].checked = false;
					}
				}//console.log(that.checkItem)
				// that.checkItem = '';
			},
			//关闭底部菜单
			cancel(){
				let that = this;
				that.init();
				that.ifshow = false;
			},
			// 初始化
			init(){
				let that = this;
				for (let key in that.category) {
					for (let s in that.category[key].child) {
						that.category[key].child[s].checked = false;
					}
				}
				that.checkItem = '';
			},
			//监听是否需要刷新页面
			// checkCategory(cate) {
			//   console.log(cate);
			// 	if(cate){this.getCateList();console.log(2222)}
			// },
			// 去选择分类
			toAddCate(){
				uni.navigateTo({
					url: './list/index'
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "index";
	.flow-btn-min {
	  background: #fff;
	  font-size: 24rpx;
	  margin: 0 auto;
	  border-radius: 5px;
	  text-align: center;
	  color: #FF7541;
	  margin-top: 25rpx;
	  width:140rpx;
	  height:44rpx;
	  line-height: 42rpx;
	  border-radius:30rpx;
	  border:1rpx solid $red;
		box-sizing: border-box;
	}
</style>
