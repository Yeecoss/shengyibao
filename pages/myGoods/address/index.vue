<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="地址管理" extClass="nav" id="top"></navigationBar>
		<view class="tui-tabs-wrap">
			<tui-tabs :tabs="navbar" :currentTab="currentTab" @change="change" itemWidth="50%" color="#999" selectedColor="#FF7541"
			 :height="80" :sliderWidth="112" :sliderHeight="4" sliderBgColor="#FF7541" :isFixed="true"></tui-tabs>
		</view>
		<view class="container m-b6 p-bottom">
			<view class="common-header-xian"></view>
			<view class="addres-list" v-if="list.data!=''">
				<view class="custom-li bgf" v-for="(item, index) in list.data" :key="index">
					<view class="address-header b-f" @tap="checkAddr(item)">
						<view class="flow-header-left">
							<view class="flow-checkout-admin">{{item.name}}<text>{{item.phone}}</text>
							</view>
							<view class="flow-checkout-address">
								{{item.region.province}} {{item.region.city}} {{item.region.region}}
								{{item.detail}}
							</view>
						</view>
					</view>
					<view class="address-list dis-flex flex-x-end flex-y-center b-f">
						<view class="list address-left">
							<radio-group @change.stop="setDefault($event,item)" class="radio-group">
								<label class="radio">
									<radio :checked="item.is_default == 1" :value="item.address_id+''"></radio>
									<text class="cont" v-if="item.is_default == 1">默认{{navbar[currentTab].name}}</text>
									<text class="cont" v-else>选择</text>
								</label>
							</radio-group>
						</view>
						<view class="list address-right dis-flex flex-y-center">
							<view @tap.stop="editAddress(item.address_id)">
								<text class="iconfont2 icon-bianji"></text>
								<text class="title">编辑</text>
							</view>
							<view @tap.stop="removeAddress(item.address_id)">
								<text class="iconfont2 icon-shanchu"></text>
								<text class="title">删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 无数据 -->
			<tui-no-data v-else>
				<view class="yoshop-notcont">
					<text class="iconfont2 icon-bianzu1"></text>
					<text class="cont">亲，您还没有{{navbar[currentTab].name}}哦～</text>
				</view>
			</tui-no-data>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="transparent"></tui-nomore>

			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30">
					<view class="foot-btn f-32 col-f" @tap.stop="createAddress"><text class="iconfont2 icon-jiahao f-36"></text>添加{{navbar[currentTab].name}}</view>
				</view>
			</view>
		</view>

		<!-- 快捷导航 -->
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;

	export default {
		data() {
			return {
				currentTab: 0,
				navbar: [{
					name: "退货地址",
					status: 1
				}, {
					name: "寄件地址",
					status: 2
				}, {
					name: "收件地址",
					status: 3
				}],
				list: [],
				default_id: null,
				page: 1,
				loadding: false,
				pullUpOn: true,
				index: 1, //提示框
				pindex: '', //
			};
		},

		components: {},
		onLoad(options) {
			// 当前页面参数
			this.options = options;
			this.pindex = options.pindex;
			this.currentTab = Number(options.currentTab)||0;
		},
		onShow() {
			this.page = 1;
			this.pullUpOn = true;
			this.loadding = false;
			// 获取退货地址列表
			this.getAddressList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh() {
			//延时为了看效果
			setTimeout(() => {
				this.list = [];
				this.page = 1;
				this.getAddressList();
				this.pullUpOn = true;
				this.loadding = false;
				uni.stopPullDownRefresh();
				this.$api.msg('刷新成功!');
			}, 200)
		},
		// 上拉加载下一页
		onReachBottom() {
			let that = this;
			if (!that.pullUpOn) return;
			that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = false;
				that.getAddressList();
			}
		},
		methods: {
			/**
			 * 获取退货地址列表
			 */
			getAddressList() {
				let that = this;

				app._get('shop.address/index', {
					page: that.page,
					type: this.navbar[this.currentTab].status
				}, result => {
					that.loadding = false
					let _list = that.list,
						data = result.data.list.data;

					if (that.page == 1) {
						_list = result.data.list;
					} else {
						_list.data = _list.data.concat(data);
					}
					that.list = _list;
				});
			},
			/**
			 * 添加新地址
			 */
			createAddress() {
				uni.navigateTo({
					url: './create?status=' + this.navbar[this.currentTab].status
				});
			},

			/**
			 * 编辑地址
			 */
			editAddress(id) {
				uni.navigateTo({
					url: "./detail?address_id=" + id + '&status=' + this.navbar[this.currentTab].status
				});
			},

			/**
			 * 移除退货地址
			 */
			removeAddress(address_id) {
				let _this = this;

				wx.showModal({
					title: "提示",
					content: "您确定要移除当前"+this.navbar[this.currentTab].name+"吗?",
					success: function(o) {
						o.confirm && app._post_form('shop.address/delete', {
							address_id
						}, function(result) {
							_this.getAddressList();
						});
					}
				});
			},

			/**
			 * 设置为默认地址
			 */
			setDefault(e, item) { ////暂无退货地址默认接口
				let address_id = e.detail.value;
				app._post_form('shop.address/setDefault', {
					address_id: address_id
				}, res => {
					this.$api.msg(res.msg)
					if (res.code == 1) {
						this.default_id = parseInt(address_id);
						this.page = 1;
						this.getAddressList();
					}
				});
			},
			//选中地址
			checkAddr(item) {
				this.pageBack(item, this.pindex)
			},
			//返回上一页
			pageBack(v, i) {
				// 返回上一页传递选中的分类
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if (prevPage.$vm.iplChange) {
					prevPage.$vm.iplChange(v, i)
					uni.navigateBack();
				}
			},
			change(e) {
				this.currentTab = e.index;
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getAddressList();
			},
		}
	};
</script>
<style lang="scss">
	@import "./index";
</style>
