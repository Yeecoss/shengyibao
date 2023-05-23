<template>
	<view class="bgf min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="全部素材" extClass="nav" id="top"></navigationBar>
		<view class="top-wrap">
			<view class="top bgf">
				<view class="search">
					<search :value="searchValue" @search="searchList" placeholder="搜索"></search>
				</view>
				<view class="tab-wrap f-32 wrap30 dis-flex flex-x-between">
					<view class="tab-items dis-flex">
						<view v-for="(v,i) in tabs" :key="v.type" @tap.stop="switchTab(i)" :class="tabIndex==i?'col-3':'col-9'">{{v.text}}</view>
					</view>
					<!-- <view class="app-red" @tap.stop="toNext" v-if="source=='shop'">{{ifManage?'完成':'管理'}}</view> -->
				</view>
			</view>
		</view>
		<!-- main -->
		<view class="h_div20 bgf5"></view>
		<view class="main m-t-20">
			<pictureList ref="pictureList" :list="showList.data" :ifManage="ifManage" :source="source" @radioChange="radioChange" :scrollTop="scrollTop"></pictureList>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && showList.data!='') || page==showList.last_page" backgroundColor="#fff"></tui-nomore>
			<!-- 底部操作栏 -->
			<view class="operation-wrap" v-if="ifManage &source=='shop'">
				<view class="material-operation bgf dis-flex flex-y-center flex-x-between">
					<view class="dis-flex flex-y-center">
						<checkbox-group class="checked-all f-28 col-3" @change="allCheckedItem">
							<label class="check-wrap default-check dis-flex flex-y-center">
								<checkbox :checked="allChecked"/>
								<view class="selectCheckNum f-24"> 已选{{checkListNum}}个</view>
							</label>
						</checkbox-group>
						<!-- <view class="selectNum dis-flex flex-y-center" @tap.stop="openShowNum">
							<view class="selectCheckNum f-24"> 已选{{checkListNum}}个</view>
							<view class="selectAllNum dis-flex flex-y-center">
								<view class="nowNum f-24">{{nowNum}}</view>
								<view class="iconBox">
									<text class="iconfont2 icon-pull-down"></text>
								</view>
							</view>
						</view> -->
					</view>
					<view class="fot-opera-r dis-flex flex-y-center">
						<view class="fot-del f-30 col-3">
							<picker class="control" @change="pickerChange" :value="defIndex" :range="upgradeList">更改分组</picker>
						</view>
						<view class="fot-del f-30 col-3 m-l-50" @tap.stop="delData">删除</view>
						<view class="fot-del f-30 col-3 m-l-50 fot-add" @tap.stop="toAddGoods">新建商品</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="showList.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer" v-if="source!='shop'&&checkList!=''">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toSure">确定</view>
			</view>
		</view>
		<!-- 展开按钮 -->
		<view class="expand-btn t-c" v-if="isPutAway &&source=='shop'" @tap.stop="toPutUp">
			<text class="iconfont2 icon-enlarge col-f f-36"></text>
		</view>
		<!-- 添加按钮 -->
		<view class="expand-btn t-c" v-if="!isPutAway&&source=='shop'" @tap.stop="toUploadImg">
			<text class="iconfont2 icon-upload col-f f-36"></text>
		</view>
		<!-- 数量选择 -->
		<tui-actionsheet :show="showNumList" :item-list="numList" @click="numListClick" @cancel="closeNumList"></tui-actionsheet>
		<addGoods ref="addGoods" @putAway="putAway" @close="putDown" @toAdd="toAdd" @remove="removeImg" @complete="complete"></addGoods>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import addGoods from '../addGoods/index';
	import popup from "@/components/pop-manager/index";
	import popupTips from '@/components/popup-tips/index';
	import pictureList from '../picture/index.vue';
	export default {
		components: {
			search,
			addGoods,
			popup,
			popupTips,
			pictureList
		},
		data(){
			return{
				scrollTop: 0,
				// file_media: 'all',
				tabIndex: 0,//默认第一个tab
				tabs:[{type:'all',text:'全部'},{type:'image',text:'图片'},{type:'video',text:'视频'},],//tab
				
				searchValue: '',
				group_id: '',//分类id
				group_list: [],//分组列表
				list: '',
				listData: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
				
				source: '',//来源
				limit: '',
				videoLimit: '',
				// isAll: false,//默认不全选
				ifManage: true,
				allChecked: false,
				nowNum: '全部',
				showNumList: false,
				numList: [{
					text: "50",
					color: "#333333",
				}, {
					text: "100",
					color: "#333333"
				}, {
					text: "全部",
					color: "#333333"
				}],
				checkList: [],
				
				// isShow: false,
				upgradeList: [],
				defIndex: -1,
				isPutAway: false,//是否显示展开按钮
				mtitle: '',
				mcontent: '',
				showList: {},//要显示的列表
				allList: [],//总数据列表
			}
		},
		computed: {
			checkListNum() {
				let num = 0
				// if (this.allChecked) {
				// 	num = this.nowNum
				// } else {
					num = this.checkList.length
				// }
				return num;
			},
		},
		onLoad(options) {
			this.group_id = options.group_id || '';
			this.source = options.source || '';
			this.limit = options.limit!==''? options.limit :'';
			this.videoLimit =  options.videoLimit!==''? options.videoLimit :'';
			//带入的图片
			let imageList = uni.getStorageSync('materialImages') ||[];
			this.imageList = imageList;
			uni.removeStorageSync('materialImages');
			this.defaultCheck();
			
			this.page = 1;
			this.listData = {
				0:{current_page: 0,data: [],last_page: 0,per_page: 0,total: 0},1:{current_page: 0,data: [],last_page: 0,per_page: 0,total: 0},2:{current_page: 0,data: [],last_page: 0,per_page: 0,total: 0},
			};
			this.getList(0);
			this.getList(1);
			this.getList(2);
			this.moveFiles();
		},
		onShow() {
			
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			this.page = 1;
			this.getList(0);
			this.getList(1);
			this.getList(2);
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh();
			this.$api.msg("刷新成功")
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			let last_page = that.listData[that.tabIndex].last_page;
			
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= last_page) {
				that.loadding = false;
				that.pullUpOn = false;
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList(this.tabIndex);
			}
		},
		onPageScroll:function(e){ // 获取滚动条当前位置
			this.scrollTop = e.scrollTop
		},
		methods:{
			defaultCheck(){
				let check = [];
				this.imageList.forEach(item =>{
					check.push(Number(item.wxapp_file_id))
				});
				this.checkList = check;
			},
			// 获取列表
			getList (tabIndex){
				let that = this;
				let data = {
					page: that.page,
					group_id: that.group_id,
					search: that.searchValue
				};
				let file_media = that.tabs[tabIndex].type;
				if(file_media!='all'){
					data.file_media = file_media
				}
				app._get('shop.image.image/index', data, res => {
					that.loadding = false;
					let _list = that.listData[tabIndex];
					let data = res.data.list;
					if(that.page==1){
						_list = data;
					}else{
						_list={
							data : _list.data.concat(data.data),
							current_page: data.current_page,last_page: data.last_page,per_page: data.per_page
						}
					}
					that.listData[tabIndex] = _list;
					// that.upCheckList({tabIndex: tabIndex})
					that.$nextTick(() =>{
						that.getShowList();
					})
				});
			},
			//更改分组
			moveFiles(){
				app._get('shop.image.category/index', {},res =>{
					let list = res.data.category;
					let upgradeList = [];
					let category = [];
					for (let k in list) {
						let item = list[k];
						upgradeList.push(item.group_name)
						category.push(item)
					}
					this.upgradeList = upgradeList;
					this.group_list = category;
				});
			},
			// 选择类型赋值
			pickerChange(e) {
				if(this.checkList==''){
					this.$api.msg('请先选择图片！')
					return false
				}
				let data = {
					group_id: this.group_id,
					move_group_id: this.group_list[e.detail.value].group_id
				}
				// if(this.allChecked){
				// 	data.batch_num = this.checkListNum;
				// }else{
					data.ids = this.checkList.toString();
				// }
			  this.defIndex = e.detail.value;
				app._post_form('shop.image.image/moveFiles',data, res => {
					this.$api.msg(res.msg)
					if(res.code==1){
						// this.ifManage = false
						this.toNext()
						this.page = 1;
						this.getList(0);
						this.getList(1);
						this.getList(2);
					}
				});
			},
			//点击删除
			delData(){
				if(this.checkList==''){
					this.$api.msg('请先选择图片！')
					return false
				}
				this.mtitle = '提示'
				this.mcontent = '确定删除当前选择图片？';
				this.$refs.popupTips.open(()=>{
					let data = {
						group_id: this.group_id,
					}
					// if(this.allChecked){
					// 	data.batch_num = this.checkListNum;
					// }else{
						data.ids = this.checkList.toString();
					// }
					let file_media = this.tabs[this.tabIndex].type;
					if(file_media!='all'){
						data.file_media = file_media
					}
					app._post_form('shop.image.image/delete',data, res => {
						this.$api.msg(res.msg)
						if(res.code==1){
							// this.ifManage = false
							this.page = 1;
							this.pullUpOn = true;
							this.getList(0);
							this.getList(1);
							this.getList(2);
						}
					});
				});
			},
			//上传图片
			toUploadImg(){
				uni.showActionSheet({
						title:"选择上传类型",
						itemList: ['图片','视频'],
						success: (res) => {
							this.chooseImages(res.tapIndex)
						}
				})
			},
			chooseImages(index){
				uni[index == 0 ? 'chooseImage' : 'chooseVideo']({
				  // count: 9,
				  // sourceType: ['album', 'camera'],
				// #ifdef H5 || MP
				sizeType: ['compressed', 'original'],
				// #endif
				// #ifdef APP-PLUS
				sizeType: ['compressed', 'original'],
				// #endif
				  success: res => {
						let imageArr = [];
						if(index == 0){
							for (let i = 0; i < res.tempFilePaths.length; i++) {
								// #ifdef H5 || MP
								if (res.tempFiles[i].size <= 2048000) {
								// #endif
								let path = res.tempFilePaths[i]
								imageArr.push(path)
								// #ifdef H5 || MP
								} else {
									app.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
								}
								// #endif
							}
						}else{
							let path = res.tempFilePath
							imageArr.push(path)
						}
						for (let j = 0; j < imageArr.length; j++) {
							app.uploadFile({
								filePath: imageArr[j],
								params: {group_id: this.group_id},
								isShop: true,
								success: (res) => {
									if (res.code === 1) {
										this.page = 1;
										this.pullUpOn = true;
										this.getList(0);
										this.getList(1);
										this.getList(2);
									}
								},
								complete: (res) => {}
							});
						}
				  }
				});
			},
			//新建商品
			toAddGoods(){
				if(this.checkList==''){
					this.$api.msg('请先选择图片或视频！')
					return false
				}
				let file = this.getCheckData();
				if(file.imgArr.length>9){
					this.$api.msg('最多可选择9张图片')
					return false
				}
				if(file.videoArr.length>1){
					this.$api.msg('最多可选择1个视频')
					return false
				}
				let data = {
					data: file.fileArr
				};
				this.group_list.forEach(item => {
					if(item.group_id == this.group_id){
						data.group_name = item.group_name
					}
				});
				this.$refs.addGoods._toDrawer(data)
			},
			//展开
			toPutUp(){
				let file = this.getCheckData();
				if(file.imgArr.length>9){
					this.$api.msg('最多可选择9张图片')
					return false
				}
				if(file.videoArr.length>1){
					this.$api.msg('最多可选择1个视频')
					return false
				}
				let data = {
					data: file.fileArr
				};
				this.group_list.forEach(item => {
					if(item.group_id == this.group_id){
						data.group_name = item.group_name
					}
				});
				this.$refs.addGoods._open(data);
			},
			//搜索
			searchList(e){
				this.searchValue = e;
				this.page = 1;
				this.pullUpOn = true;
				this.getList(this.tabIndex)
			},
			// 点击管理
			toNext() {
				// this.ifManage = !this.ifManage;
				this.checkList = [];
				this.allList.forEach(item => {
					item.checked = false
				});
				this.initList()
			},
			// 切换tab
			switchTab(id){
				this.tabIndex = id;
				this.pullUpOn = true;
				this.page = this.listData[this.tabIndex].current_page;
				this.getShowList();
			},
			//更新数据列表时引用
			getShowList(){
				this.showList = this.listData[this.tabIndex];
				this.$nextTick(() => {
					this.$refs.pictureList._show(this.listData[this.tabIndex].data);
				})
				
				this.allList = [];
				let list = [];
				for (let i in this.listData) {
					let data= this.listData[i].data || [];
					list = list.concat(data)
				}
				let obj = {};
				list = list.reduce((item,index) => {
					obj[index.wxapp_file_id] ? "" : obj[index.wxapp_file_id] = true && item.push(index);
					return item;
				},[])
				this.allList = list;
				
				this.$nextTick(() => {
					this.initImageList()
				});
			},
			initImageList(){
				if(this.checkList&&this.checkList.length>0){
					for (let i in this.allList) {
						let index = this.checkList.indexOf(this.allList[i].wxapp_file_id);
						if (index != -1) {
							this.allList[i].checked = true;
						}
					}
					this.initList();
				}
			},
			//去重
			Es6duplicate(arr,type){
			  if(arr.length == 0){
			    return arr;
			  }else{
			    if(type){
			      var obj = {}
			      var newArr = arr.reduce((cur,next) => {
			        obj[next.wxapp_file_id] ? "" : obj[next.wxapp_file_id] = true && cur.push(next);
			        return cur;
			      },[])
			      return newArr;
			    }else{
			      return Array.from(new Set(arr));
			    }
			  }
			},
			touchEnd(items){
				this.allList.forEach((item,indexs)=>{
					if(items.wxapp_file_id==item.wxapp_file_id){
						if (item.checked) {
							let index = this.checkList.indexOf(item.wxapp_file_id)
							if (index != -1) {
								this.checkList.splice(index, 1)
								this.allChecked = false
							}
						} else {
							this.checkList.push(item.wxapp_file_id)
						}
						item.checked = !item.checked;
					}
				});
				this.initList();
			},
			// 单选
			radioChange(items) {
				this.allList.forEach((item,indexs)=>{
					if(items.wxapp_file_id==item.wxapp_file_id){
						if (item.checked) {
							let index = this.checkList.indexOf(item.wxapp_file_id)
							if (index != -1) {
								this.checkList.splice(index, 1)
								this.allChecked = false
							}
						} else {
							this.checkList.push(item.wxapp_file_id)
						}
						item.checked = !item.checked;
					}
				});
				this.initList();
			},
			//改变数据引用
			initList(){
				for (let k in this.allList) {
					for (let i in this.listData) {
						this.listData[i].data.forEach(item => {
							if(this.allList[k].wxapp_file_id==item.wxapp_file_id){
								item.checked = this.allList[k].checked
							}
						})
					}
				}
				this.$refs.pictureList._show(this.listData[this.tabIndex].data);
				this.showList = this.listData[this.tabIndex];
			},
			// 选中
			allCheckedItem() {
				this.allChecked = !this.allChecked
				this.upCheckList({unit:true})
				this.getShowList()
			},
			numListClick(e) {
				this.showNumList = false
				this.nowNum = this.numList[e.index].text
			},
			closeNumList() {
				this.showNumList = false
			},
			openShowNum() {
				this.showNumList = true
			},
			upCheckList(init) {
				this.checkList = [];
				let data = init.tabIndex==undefined?this.listData[this.tabIndex].data:this.listData[init.tabIndex].data;
				if (this.allChecked) {
					if (this.nowNum == '50') {
						data.forEach((item, indexs) => {
							if (this.checkList.length < 50) {
								item.checked = true
								this.checkList.push(item.wxapp_file_id)
							} else {
								item.checked = false
							}
						})
					}
					if (this.nowNum == '100') {
						data.forEach((item, indexs) => {
							if (this.checkList.length < 100) {
								item.checked = true
								this.checkList.push(item.wxapp_file_id)
							} else {
								item.checked = false
							}
						})
					}
					if (this.nowNum == '全部') {
						data.forEach((item, indexs) => {
							item.checked = true
							this.checkList.push(item.wxapp_file_id)
						})
					}
				} else {
					if (init.unit) {
						data.forEach((item, index) => {
							item.checked = false
						})
					} else {
						data.forEach((item, indexs) => {
							item.checked = false
						})
					}
				}
				if(init.tabIndex!=undefined){
					this.listData[init.tabIndex].data = data;
				}else{
					this.listData[this.tabIndex].data = data;
				}
			},
			// 收起商品弹窗
			putAway(){
				this.isPutAway = true
			},
			getCheckData(){
				let list = this.allList;
				let imageList = this.imageList;
				let imgArr = [];
				let videoArr = [];
				let fileArr = [];
				for (let k in this.checkList) {
					for (let i = 0; i < list.length; i++) {
						let item = list[i];
						if(this.checkList[k] == item.wxapp_file_id){
							let obj = {
								wxapp_file_id: item.wxapp_file_id,
								type: item.file_media,
								path: item.file_path,
							}
							fileArr.push(obj)
							if(item.file_media=='video'){
								videoArr.push(obj)
							}else{
								imgArr.push(obj)
							}
						}
					}
					if(imageList&&imageList.length>0){
						for (let j = 0; j < imageList.length; j++) {
							let items = imageList[j];
							if(this.checkList[k] == items.wxapp_file_id){
								let obj = {
									wxapp_file_id: items.wxapp_file_id,
									type: items.type,
									path: items.path,
								}
								fileArr.push(obj)
								if(items.file_media=='video'){
									videoArr.push(obj)
								}else{
									imgArr.push(obj)
								}
							}
						}
					}
				}
				if(imageList&&imageList.length>0){
					fileArr = this.Es6duplicate(fileArr,true)
					imgArr = this.Es6duplicate(imgArr,true)
					videoArr = this.Es6duplicate(videoArr,true)
				}
				let data = {
					imgArr: imgArr,
					videoArr: videoArr,
					fileArr: fileArr
				};
				return data
			},
			//确定
			toSure(){
				let file = this.getCheckData();
				// 判断限制
				let isSure = true;
				//判断是否传入限制
				//从编辑器进来
				if(this.source =='editor'){
					if(file.videoArr.length>0){
						this.$api.msg('此处上传视频请至后台上传')
						isSure = false
					}
				}else{
					if(this.limit !== ''){
						if(file.imgArr.length>this.limit){
							this.$api.msg('最多可选择'+this.limit+'张图片')
							isSure = false
						}
					}
					if(this.videoLimit !== ''){
						if(file.videoArr.length>this.videoLimit){
							this.$api.msg('最多可选择'+this.videoLimit+'个视频')
							isSure = false
						}
					}
				}
				if(!isSure){
					return false
				}
				this.pageBack(file.fileArr)
			},
			//关闭
			putDown(){
				this.mtitle = '提示'
				this.mcontent = '关闭后当前信息清空';
				this.$refs.popupTips.open(()=>{
					this.$refs.addGoods.close()
					this.isPutAway = false;
					this.checkList = [];
					this.allList.forEach(item => {
						item.checked = false
					});
					this.initList()
				});
			},
			toAdd(res){
				if(res.code==1){
					this.toNext()
				}
			},
			//新建商品删除图片
			removeImg(id){
				let obj = {
					wxapp_file_id: id
				}
				this.radioChange(obj)
			},
			//移动图片位置回调
			complete(data){
				this.checkList = data;
			},
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 3]; //上一个页面
				if(prevPage.$vm.materialChange){
					prevPage.$vm.materialChange(data, this.source)
				}
				uni.navigateBack({
					delta:2
				})
			},
			// 分类选择返回
			checkCategory(obj) {
			  this.$refs.addGoods.checkCategory(obj)
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
