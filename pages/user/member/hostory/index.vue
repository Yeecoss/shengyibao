<template>
	<view class="apply">
		<!-- 自定义标题栏 -->
		<navigationBar title="会员领取记录" extClass="nav" id="top"></navigationBar>
		<view class="container">
			<div class="userBox">
				<div class="userItem" v-for="(item, index) in userList" :key="index">
					<div class="info dis-flex flex-y-center flex-x-between">
						<div class="name">
							{{item.collection_name}}
						</div>
						<div class="num">
							{{item.duration ? '+' + item.duration + '天' : '永久'}}
						</div>
					</div>
					<div class="dis-flex flex-x-between">
						<div class="time">
							{{item.create_time}}
						</div>
						<div class="time">
							{{item.way.text}}
						</div>
					</div>
				</div>
			</div>
		</view>
		<!-- 无数据 -->
		<tui-no-data v-if="userList==''" imgUrl="https://pic.kaidanxia.com/2020-08-17/2020081716461121da54339.png" :imgWidth="264" :imgHeight="264">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
	</view>
</template>

<script>
	let App = getApp().globalData;

	export default {
		data() {
			return {
				userList: [],
				page: 1
			};
		},

		components: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getList()
		},
		methods: {
			// 获取列表
			getList(first) {
				App._get('vip.collection/getUserVipLogList', {
					page: this.page
				}, res => {
					let data = res.data.list.data;
					if (this.page == 1) {
						this.userList = data;
					} else {
						this.userList = this.userList.concat(data);
					}
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
