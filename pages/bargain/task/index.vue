<template>
	<view class="container" v-if="task.task_id">

		<!-- 自定义标题栏 -->
		<navigationBar title="砍价任务"></navigationBar>
		<!-- 顶部操作栏 -->
		<view class="header dis-flex flex-x-end">
			<form @submit="onToggleRules" report-submit="true">
				<button formType="submit" class="btn-normal">
					<view class="item-touch f-24 col-9">
						<text class="iconfont2 icon-guize f-28"></text>
						<text>玩法详情</text>
					</view>
				</button>
			</form>
		</view>

		<view class="content">
			<!-- 砍价信息 -->
			<view class="infos-wrap">
				<view class="infos-top">
					<view class="infos-img">
						<image lazy-load :src="task.user.avatarUrl"></image>
					</view>
					<view class="infos-name">
						<text>{{ task.user.nickName }}</text>
					</view>
				</view>
				<view class="infos-mask">
					<view class="infos-prompt" v-if="active.prompt_words">
						<text>{{ active.prompt_words }}</text>
					</view>
					<!-- 商品信息 -->
					<form @submit="onTargetGoods" report-submit="true">
						<button formType="submit" class="btn-normal">
							<view class="infos-item">
								<view class="infos-item-img">
									<image lazy-load :src="wxappgoods.goods.goods_image"></image>
								</view>
								<view class="infos-item-info">
									<view class="infos-item-name">
										<text class="twolist-hidden">{{ wxappgoods.goods.goods_name }}</text>
									</view>
									<view class="infos-item-stock">
										<view class="stock-widget">
											<text>仅剩{{ wxappgoods.goods.stock_num }}件</text>
										</view>
									</view>
									<view class="infos-item-price dis-flex flex-x-between">
										<!-- <text class="price1 col-m"></text> -->
										<view class="price_wrap flex-y-center">
											<text class="price2 col-m">¥{{ task.floor_price }}</text>
											<text class="price3">¥{{ task.goods_price }}</text>
										</view>
										<!-- 到期时间 -->
										<view class="bargain-p" v-if="task.status">
											<view class="bargain-people" v-for="(item, index) in taskEndTime"
												:key="index">
												剩余<text>{{ item.dynamic.hou }}</text>:<text>{{ item.dynamic.min }}</text>:<text>{{ item.dynamic.sec }}</text>
											</view>
										</view>

									</view>
								</view>
							</view>
						</button>
					</form>

				</view>
			</view>

			<!-- 分割线 -->
			<!-- <view class="connect">
      <view class="connect-ring bgf-ring--left">
        <text></text>
      </view>
      <view class="connect-ring bgf-ring--right">
        <text></text>
      </view>
    </view> -->

			<!-- 砍价进度 -->
			<view class="bargain-wrap">
				<!-- 已砍数目 -->
				<view class="bargain-info">
					<view v-if="task.status" class="bargain-ing">
						<block v-if="!task.is_floor">
							<text>已砍</text>
							<text class="focal col-m">{{ task.cut_money }}</text>
							<text>元，还差</text>
							<text class="focal col-m">{{ task.surplus_money }}</text>
							<text>元</text>
						</block>
						<block v-else>
							<text>已砍至最低</text>
							<text class="focal col-m">{{ task.floor_price }}</text>
							<text>元，砍价成功！</text>
						</block>
					</view>
					<view v-else class="bargain-ing">
						<text class="col-9">该砍价活动已结束～</text>
					</view>
				</view>
				<!-- 砍价进度条 -->
				<view class="bgn__process">
					<view class="bgn__process-bottom">
						<view class="bgn__process-process process--ani" :style="'width: ' + task.bargain_rate + '%;'">
						</view>
					</view>
				</view>
				<!-- 操作按钮 -->
				<view class="btn-container m-top20 dis-flex flex-x-around">
					<!-- 立即购买 -->
					<form v-if="showBuyBtn" @submit="onCheckout" report-submit="true">
						<button formType="submit" class="btn-normal">
							<view :class="'btn-item btn-item__buy ' + ( task.is_floor ? 'complete' : '' )">
								<text>立即购买</text>
							</view>
						</button>
					</form>
					<!-- 分享给朋友 -->
					<view class="btn-item btn-item__main" v-if="showShareBtn" @tap="toShare">
						<text>邀请好友砍价</text>
					</view>
					<!-- 砍刀操作 -->
					<form v-if="showCatBtn" @submit="onHelpCut" report-submit="true">
						<button formType="submit" class="btn-normal">
							<view class="btn-item btn-item__main btn-item-long">
								<text>帮TA砍一刀</text>
							</view>
						</button>
					</form>
					<!-- 查看其他砍价活动 -->
					<form v-if="showOtherBtn" @submit="onTargetBargain" report-submit="true">
						<button formType="submit" class="btn-normal">
							<view class="btn-item btn-item__main btn-item-long">
								<text>查看其他砍价活动</text>
							</view>
						</button>
					</form>
				</view>
			</view>
			<!-- 好友助力榜 -->
			<view class="records-container">
				<view class="records">
					<!-- <view class="records-back"></view> -->
					<view class="records-content">
						<view class="records-h2">
							<text>好友助力榜</text>
						</view>
						<view class="friend-help" v-if="help_list.length">
							<view class="records-item" v-for="(item, index) in help_list" :key="index">
								<view class="records-left">
									<image lazy-load :src="item.user.avatarUrl"></image>
									<text>{{ item.user.nickName }}</text>
								</view>
								<view class="records-right semibold">
									<text class="bold">减</text>
									<text class="red">¥{{ item.cut_money }}</text>
								</view>
							</view>
						</view>
						<!-- 无数据提供的页面 -->
						<view v-if="!help_list.length">
							<view class="yoshop-notcont">
								<text class="iconfont2 icon-bianzu1"></text>
								<text class="cont">亲，还没有好友助力哦～</text>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>

		<!-- 砍价规则 -->
		<zan-dialog id="zan-base-dialog"></zan-dialog>
		<share-bottom ref="shareBottom" pageType="barginTask"></share-bottom>

	</view>
</template>

<script>
	const app = getApp().globalData; // 工具类
	// 工具类
	import util from "@/utils/util"; // 倒计时插件
	// 倒计时插件
	import CountDown from "@/utils/countdown"; // 对话框插件
	// 对话框插件
	import Dialog from '@/components/dialog/dialog';
	import zanDialog from "@/components/dialog/index";
	import shareBottom from '@/components/share-bottom/index';

	export default {
		data() {
			return {
				
				taskEndTime: [],// 砍价任务倒计时
				task: {},// 砍价任务详情
				active: {},// 活动详情
				wxappgoods: {},// 商品详情
				help_list: [],// 好友助力榜
				is_creater: false,// 是否为当前砍价任务的发起人
				is_cut: false,// 当前是否已砍
				setting: {},// 砍价规则
				showBuyBtn: false,// 立即购买
				showShareBtn: false,// 邀请好友砍价
				showCatBtn: false,// 帮TA砍一刀
				showOtherBtn: false, // 查看其他砍价活动
				task_id: "",
				disabled: false
			};
		},

		components: {
			zanDialog,
			shareBottom
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			//切换店铺
			let scene = app.getSceneData(options);
			this.task_id = options.task_id ? options.task_id : scene.tid;
			let wxapp_id = options.wid ? options.wid : (scene.wid? scene.wid: '');
			if(wxapp_id!=''&&wxapp_id!='undefined'){
				app.wxapp_id = wxapp_id;
				wx.setStorageSync("wxapp_id", wxapp_id)
			}
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 获取砍价任务详情
			this.getTaskDetail();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage() {
			// 构建页面参数
			let params = {
				task_id: this.task_id,
				wid: this.wxappgoods.wxapp_id,
			};
			return {
				title: this.active.share_title,
				// path: `/pages/bargain/task/index?${params}`
				path: '/pages/bargain/task/index?task_id=' + this.task_id + '&wid=' + this.wxappgoods.wxapp_id
			};
		},

		methods: {
			/**
			 * 获取砍价任务详情
			 */
			getTaskDetail() {
				let _this = this;

				getApp().globalData._get('bargain.task/detail', {
					task_id: _this.task_id
				}, result => {
					// 初始化页面数据
					_this.initDataFun(result.data);
				});
			},

			/**
			 * 初始化页面数据
			 */
			initDataFun(data) {
				let _this = this; // 初始化：显示操作按钮


				_this.initShowBtnFun(data); // 记录活动到期时间


				data.taskEndTime = [{
					date: data.task.end_time
				}];

				_this.setData(data); // 执行倒计时


				if (!data.task.is_end) {
					CountDown.onSetTimeList(_this, 'taskEndTime');
				}
			},

			/**
			 * 初始化：显示操作按钮
			 */
			initShowBtnFun(data) {
				let _this = this,
					// 立即购买
					showBuyBtn = data.is_creater && !data.task.is_buy && data.task.status && (!data.active.is_floor_buy ||
						data.task.is_floor),
					// 帮砍一刀
					showCatBtn = !data.is_creater && !data.is_cut && !data.task.is_floor && data.task.status,
					// 邀请好友砍价
					showShareBtn = !showCatBtn && !data.task.is_floor && data.task.status,
					// 查看其他砍价活动
					showOtherBtn = !showBuyBtn && !showShareBtn && !showCatBtn;

				_this.setData({
					showBuyBtn,
					showShareBtn,
					showCatBtn,
					showOtherBtn
				});
			},

			/**
			 * 显示砍价规则
			 */
			onToggleRules(e) {
				// 显示砍价规则

				let _this = this;

				Dialog({
					title: '砍价规则',
					message: _this.setting.bargain_rules,
					selector: '#zan-base-dialog',
					isScroll: true,
					// 滚动
					buttons: [{
						text: '关闭',
						color: 'red',
						type: 'cash'
					}]
				});
			},

			/**
			 * 跳转到商品详情
			 */
			onTargetGoods(e) {
				let _this = this;
				uni.navigateTo({
					url: `../goods/index?active_id=${_this.task.active_id}`
				});
			},

			/**
			 * 跳转到砍价首页
			 */
			onTargetBargain(e) {
				uni.navigateTo({
					url: '../index/index'
				});
			},

			/**
			 * 帮砍一刀
			 */
			onHelpCut(e) {
				let _this = this;
				// 按钮禁用时不允许操作(防重复提交)

				if (_this.disabled == true) {
					return false;
				} // 设置按钮禁用


				_this.setData({
					disabled: true
				}); // 提交到后端


				getApp().globalData._post_form('bargain.task/help_cut', {
					task_id: _this.task_id
				}, result => {
					getApp().globalData.showSuccess(result.msg, function() {
						wx.navigateBack();
					}); // 获取砍价任务详情

					_this.getTaskDetail();
				}, false, () => {
					// 解除禁用
					_this.setData({
						disabled: false
					});
				});
			},

			/**
			 * 立即购买
			 */
			onCheckout(e) {
				let _this = this;
				// 跳转到结算台

				let option = util.urlEncode({
					order_type: 'bargain',
					task_id: _this.task.task_id,
					goods_sku_id: _this.task.spec_sku_id
				});
				uni.navigateTo({
					url: `../../flow/checkout?${option}`
				});
			},
			// 点击邀请好友砍价
			toShare(){
				let goods = this.wxappgoods;
				goods.task_id = this.task.task_id;
				let data = {
					opeText: 'weChat,',
					isTwo: true,
					upGoods: goods,
					styleList: '1,-1'
				};
				this.$refs.shareBottom.openShare(data);
			},
		}
	};
</script>
<style>
	@import "./index.css";
</style>
