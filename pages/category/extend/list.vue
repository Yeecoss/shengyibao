<template>
	<view class="h100">
		<view class="container">
			<!-- 背景 -->
			<template v-if="homeStyle!='minishop'&&homeStyle!='sportshop'">
				<view class="listbg" :style="sortType=='recommend'?templateBg[temIndex].bgRe:sortType=='hot'?templateBg[temIndex].bgHot:templateBg[temIndex].bg1"></view>
			</template>
			<view class="list-header">
				<!-- 自定义标题栏 -->
				<template v-if="homeStyle=='minishop'||homeStyle=='sportshop'">
					<navigationBar extClass="nav" title="全部商品" id="top"></navigationBar>
				</template>
				<template v-else>
					<navigationBar extClass="nav" title="全部商品" background="transparent" color="#fff" id="top"></navigationBar>
				</template>

				<!-- 筛选标签 -->
				<search @screen="screen" :homeStyle="homeStyle" :placeholder="option.search ? option.search  : '搜索你想找的商品'"></search>

				<!-- 商品列表 -->
				<scroll-view class="lisbox" @scrolltolower="bindDownLoad" scroll-y :style="'height: ' + scrollHeight + 'px;margin-top:100rpx;'"
				 v-if="list.data && list.data.length > 0">
					<!-- 小商店模板 -->
					<template v-if="homeStyle=='minishop'">
						<view class="mini_list">
							<view class="minishop-bg"></view>
							<view class="mini_list_wrap m-b-20" v-for="(item, index) in list.data" :key="index" @tap.stop="onTargetGoods(item.wxapp_goods_id)">
								<templete3 :imageList="item.goods.image" :good="item" @upload="upload" @toShare="toShare" @toBuy="openDialog"></templete3>
							</view>
						</view>
					</template>
					<!-- 运动潮服模板 -->
					<template v-else-if="homeStyle=='sportshop'">
						<view class="mgoods_list_wrap m-b-60" v-for="(item, index) in list.data" :key="index" @tap.stop="onTargetGoods(item.wxapp_goods_id)">
							<templete4 :imageList="item.goods.image" :good="item" @upload="upload" @toShare="toShare" @openDialog="openDialog"></templete4>
						</view>
					</template>
					<!-- 卖手圈模板 -->
					<templete1 v-else-if="homeStyle=='saler'" :list="list" @upload="upload" @toShare="toShare" @toBuy="openDialog"></templete1>
					<!-- 默认模板 -->
					<templete2 v-else :list="list" @upload="upload" @toShare="toShare" @toBuy="openDialog"></templete2>
					<view v-if="no_more" class="no-more f-24 col-9">生意宝技术支持～</view>
				</scroll-view>
			</view>

			<!-- 无数据 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264"
			 v-if="!isLoading && !list.data.length">
				<view class="col-9">亲, 没有相关内容</view>
			</tui-no-data>

		</view>
		<!-- 确认购买弹窗 -->
		<proSpecs ref="proSpecs"></proSpecs>
		<!-- 右拉筛选 -->
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>

		<download-file @comfirmStatus="comfirmStatusS" ref="download"></download-file>
		<loading ref="loading"></loading>
		<!-- 分享同步 -->
		<share-bottom ref="shareBottom" pageType="goods"></share-bottom>
	</view>
</template>

<script>
	const app = getApp().globalData;
	// 工具类
	const util = require("@/utils/util.js"); // 记录规格的数组
	// 记录规格的数组
	let goodsSpecArr = [];
	import loading from '@/components/loading';
	import templete1 from './_templete/templete1/index';
	import templete2 from './_templete/templete2/index';
	import templete3 from './_templete/templete3/index';
	import templete4 from '@/pages/index/extend/sports_store/wxappGoods/index';
	// import search from '@/components/uni-search/index';
	import search from './_templete/top-search1';
	import rightDrawer from '@/components/goods/rightDrawer/index';
	import downloadFile from '@/components/download-file';
	import proSpecs from '@/components/goods/proSpecs/pro-specs';
	import shareBottom from '@/components/share-bottom/index';

	export default {
		components: {
			templete1,
			templete2,
			templete3,
			templete4,
			downloadFile,
			search,
			rightDrawer,
			loading,
			proSpecs,
			shareBottom
		},
		data() {
			return {
				scrollHeight: null,
				// 列表显示方式
				sortType: 'all',
				// 价格从低到高
				option: {},
				// 当前页面参数
				list: {},
				// 商品列表数据
				no_more: false,
				// 没有更多数据
				isLoading: true,
				// 是否正在加载中
				page: 1,
				otherObj: {},
				wxapp: {}, //买家信息
				temIndex: 0, //默认模板
				templateBg: {
					0: {
						bg1: 'background: url(http://pic.kaidanxia.com/2020-07-15/2020071516303155b249177.png) no-repeat;background-size: 100% 460rpx;',
						bgHot: 'background: url(http://pic.kaidanxia.com/2020-07-15/2020071516303195df70268.png) no-repeat;background-size: 100% 460rpx;',
						bgRe: 'background: url(http://pic.kaidanxia.com/2020-07-15/20200715163034073089180.png) no-repeat;background-size: 100% 460rpx;'
					},
				},
				homeStyle: '',
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(option) {
			this.homeStyle = app.homeStyle;
			// 设置商品列表高度
			this.$nextTick(() => {
				this.setListHeight();
			})
			// 记录option


			this.setData({
				option
			});

			if (option.sortType) {
				this.sortType = option.sortType
			} 
			
			// 获取商品列表
			this.getWxappData();
			// 判断是否从全部分类来源
			if(option.source=='category'){
				// if(option.category_id =='hot'){
				// 	this.sortType = 'hot';
				// }
				// if(option.category_id =='rmd'){
				// 	this.sortType = 'recommend';
				// }
				this.$nextTick(() => {
					this.getInfo()
				});
			}else{
				this.getGoodsList();
			}
		},
		/**
		 * 设置分享内容
		 */
		onShareAppMessage(res) {
			// 构建分享参数
			if(res.from=='button' && res.target.id){
				return {
					title: '商品详情',
					path: "/pages/goods/index?goods_id=" +res.target.id,
					imageUrl: res.target.dataset.shareimg
				};
			}else{
				return {
					title: '全部商品列表',
					path: "/pages/category/extend/list"
				}
			}
		},

		methods: {
			// 从全部分类进来
			getInfo(){
				this.$nextTick(() => {
					this.$refs.rightDrawer.initData({category_id:this.option.category_id})
				});
			},
			//会员信息
			getWxappData() {
				app._get('user.index/vipDetail', {}, (res) => {
					if (res.code == '1') {
						this.wxapp = res.data.userInfo || {}
					}
				})
			},
			//立即购买
			openDialog(item) {
				this.$refs.proSpecs._open(item)
			},
			//点击分享
			toShare(item) {
				let data = {
					// // opeText: item.open_dealer ? 'upGoods,copyGoods' : 'copyGoods',
					// opeText: 'upGoods,copyGoods',
					// upGoods: item,
					
					opeText: 'upGoods,copyGoods,weChat',
					isTwo: true,
					upGoods: item,
					styleList: '-1,1,4,8'
				}
				this.$refs.shareBottom.open(data);
			},
			// 拼接规格
			initListFun(data) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].goods_multi_spec && data[i].goods_multi_spec.spec_attr) {
						for (let j = 0; j < data[i].goods_multi_spec.spec_attr.length; j++) {
							data[i].goods_multi_spec.spec_attr[j].group_text = this.getText(data[i].goods_multi_spec.spec_attr[j].spec_items);
						}
					}
				}

				return data;
			},

			getText(list) {
				let str = '';

				for (let i = 0; i < list.length; i++) {
					str += list[i].spec_value;

					if (i < list.length - 1) {
						str += '/';
					}
				}

				return str;
			},
			/**
			 * 获取商品列表
			 * @param {bool} isPage 是否分页
			 * @param {number} page 指定的页码
			 */
			getGoodsList(isPage, page) {
				let _this = this;

				// wx.showLoading();
				let data = {
					page: page || 1,
					sortType: this.sortType,
					category_id: this.option.category_id || 0,
					search: this.option.search || '',
					max_price: this.otherObj.max_price || '',
					max_time: this.otherObj.max_time || '',
					min_price: this.otherObj.min_price || '',
					min_time: this.otherObj.min_time || '',
				};
				if (this.otherObj.is_hot || this.sortType == 'hot') {
					data.is_hot = 1
				}
				if (this.otherObj.shop_rmd || this.sortType == 'recommend') {
					data.shop_rmd = 1
				}

				app._get('wxapp.goods/lists', data, result => {
					// wx.hideLoading();
					_this.$refs.loading._hide()
					let resList = result.data.list,
						dataList = _this.list;

					if (resList.data) {
						resList.data = _this.initListFun(resList.data);
					}

					if (isPage == true) {
						_this.setData({
							'list.data': dataList.data.concat(resList.data),
							isLoading: false
						});
					} else {
						_this.setData({
							list: resList,
							isLoading: false
						});
					}
				});
			},

			/**
			 * 设置商品列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						// 计算rpx
						tapHeight = Math.floor(rpx * 100),// 搜索高度
						// tap高度
						scrollHeight = systemInfo.windowHeight - tapHeight - res[0].height; 

						this.scrollHeight = scrollHeight
				});
			},
			/**
			 * 下拉到底加载数据
			 */
			bindDownLoad() {
				// 已经是最后一页
				if (this.page >= this.list.last_page) {
					this.setData({
						no_more: true
					});
					return false;
				} // 加载下一页列表
				this.getGoodsList(true, ++this.page);
			},

			//商品搜索
			triggerSearch() {
				let pages = getCurrentPages(); // 判断来源页面
				
				if (pages.length > 1 && pages[pages.length - 2].route === 'pages/search/index') {
					wx.navigateBack();
					return;
				} // 跳转到商品搜索


				uni.navigateTo({
					url: '/pages/search/index'
				});
			},

			// 点击下载
			upload(files) {
				const that = this;
				let uploads = [];
				files.forEach(item => {
					uploads.push(item.file_path)
				});
				if (uploads != '') {
					uni.showModal({
						title: '友情提示',
						content: '是否下载该商品的图片/视频？',
						confirmColor: '#FF7541',
						confirmText: '是',
						cancelText: '否',
						success: (res) => {
							if (res.confirm) {
								that.$refs.download._downloadFileS(uploads);
							}
						}
					});
				} else {
					that.$api.msg('该商品暂无可下载的图片/视频');
				}
			},
			//下载回调
			comfirmStatusS(promise) {
				promise.then((res) => {
					uni.hideLoading();
					uni.hideToast();
					this.$api.msg(res ? "保存成功~" : '取消保存')
				})
			},
			//打开筛选框
			screen() {
				this.$refs.rightDrawer.screen()
			},
			//筛选框确定
			rightDrawerChange(obj) {
				this.otherObj = obj;
				if(obj.shop_rmd!='1'){
					this.sortType='all'
				}
				this.list = {};
				this.isLoading = true;
				this.page = 1;
				this.option.category_id = obj.category_id;
				// 获取商品列表
				this.getGoodsList();
			},
			// 跳转商品详情页
			onTargetGoods(id) {
			  uni.navigateTo({
			    url: '/pages/goods/index?goods_id=' + id
			  });
			},
		}
	};
</script>
<style lang="scss">
	@import "./list";
</style>
