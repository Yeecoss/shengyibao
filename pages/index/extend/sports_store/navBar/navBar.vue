<template>
	<!-- 导航组 -->
	<view class="diy-navBar radius16">
		<view :class="'data-list avg-sm-' + style.rowsNum">
			<view class="item-nav" v-for="(dataItem, index) in navBar" :key="index">
				<view class="nav-to" @tap.stop="navigationTo(dataItem)">
					<view class="item-image">
						<image lazy-load class="image" mode="aspectFit" :src="dataItem.imgUrl"></image>
						<view class="item-status" v-if="dataItem.status">
							<image :src="dataItem.statusImg" mode="aspectFit"></image>
						</view>
					</view>
					<view class="item-text f-22 onelist-hidden" :style="'color: ' + dataItem.color + ';'">
						{{ dataItem.text }}</view>
				</view>
			</view>
		</view>
		<contact ref="contact"></contact>
	</view>
</template>

<script>
	import contact from '@/components/myGoodsCommon/contact/index';
	const app = getApp().globalData;

	export default {
		data() {
			return {
				style: {background: "#fff", rowsNum: "4"},
				navBar: [
					{id: '', color: "#000",imgUrl: "https://pic.kaidanxia.com/2021-04-23/1529199ffff3370.png",linkUrl: "event-contact",text: "联系店主"},
					{id: 'coupon',color: "#000",imgUrl: "https://pic.kaidanxia.com/2021-04-23/152919f555b1812.png",linkUrl: "pages/coupon/coupon",text: "优惠券",status:0,statusImg:'https://pic.kaidanxia.com/2021-05-10/0939123da5c4215.png'},
					{id: 'bargain',color: "#000",imgUrl: "https://pic.kaidanxia.com/2021-04-23/152920f315a9833.png",linkUrl: "pages/bargain/index/index",text: "砍价",status:0,statusImg:'https://pic.kaidanxia.com/2021-05-10/09391295b134510.png'},
					{id: 'sharp',color: "#000",imgUrl: "https://pic.kaidanxia.com/2021-04-23/1529208d6593125.png",linkUrl: "pages/sharp/index/index",text: "限时秒杀",status:0,statusImg:'https://pic.kaidanxia.com/2021-05-10/093913f8f2e1964.png'},
				],
			};
		},

		components: {
			contact
		},
		props: {
			itemIndex: String,
			itemStyle: Object,
			params: Object,
			dataList: [Object, Array],
			user: {
				type: Object
			},
		},
		options: {
			addGlobalClass: true
		},
		methods: {
			_show(subscript){
				// let navBar = this.navBar;
				if(subscript){
					
					if(subscript.coupon==1){
						this.navBar[1].status = 1;
					}
					if(subscript.bargain==1){
						this.navBar[2].status = 1;
					}
					if(subscript.sharp==1){
						this.navBar[3].status = 1;
					}
				}
			},
			/**
			 * 跳转到指定页面
			 */
			navigationTo(item) {
				if (item.linkUrl == 'event-contact') {
					this.toShopInformation()
				} else {
					app.navigationTo(item.linkUrl);
				}
			},
			// 店铺资料
			toShopInformation() {
				let obj = {
					wxapp_id: app.wxapp_id
				}
				app._get('wxapp/info', obj, (res) => {
					let values = res.data.shop || {}
					// this.user = values
					this.$refs.contact.open(values)
				})
			},
		}
	};
</script>
<style lang="scss">
	@import "./navBar";
</style>
