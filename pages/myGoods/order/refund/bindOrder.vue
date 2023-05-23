<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="绑定原订单" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<!-- 搜索框 -->
			<view class="bgf pad_lr30 searchbox">
				<search @search="search" placeholder="输入订单号"></search>
			</view>
			<view class="addr_wrap pad_lr30 bgf" v-if="prolist==''">
				<view class="address bgf8">
					<view class="dis-flex flex-x-center flex-y-center f-28 col-9 noAddr">暂无信息</view>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list_wrap" v-if="prolist!=''">
				<checkbox-group class="goods-list" @change.stop="choose">
					<template v-for="(item,index) in prolist">
						<view class="list pad_lr30 bgf f-28 col-3 dis-flex flex-y-center" :key="item.wxapp_goods_id">
							<label class="check-wrap default-check dis-flex flex-y-center">
								<checkbox class="checkbox" :value="item.wxapp_goods_id+''" :checked="item.checked" />
							</label>
							<view class="pro_pic">
								<image lazy-load :src="item.file_path" mode="aspectFill"></image>
							</view>
							<view class="pro_info flex-box">
								<view class="f-28 col-3 onelist-hidden">{{item.goods_name}}</view>
								<view class="f-28 col-3 m-top10">¥{{item.goods_price}}</view>
								<view class="pro-bottom dis-flex flex-y-center flex-x-between">
									<view class="f-24 col-6">{{item.goods_attr}}</view>
									<view class="select-number">
										<tui-numberbox :min="1" :max="item.total_num" :value="item.goods_num" :height="48" :size="24" :iconSize="24" :width="52" backgroundColor="#fff" @change="onInputGoodsNum($event,item)"></tui-numberbox>
									</view>
								</view>
							</view>
						</view>
					</template>
				</checkbox-group>
			</view>
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30 dis-flex flex-y-center flex-x-between">
					<text class="f-30 col-3">已选({{checked_num||0}}件)</text>
					<!-- <checkbox-group class="check-wrap default-check checked-all f-28 col-3 dis-flex flex-y-center" @change="chooseAll">
						<label class="check-wrap default-check dis-flex flex-y-center">
							<checkbox :checked="isAll"/>全选
						</label>
					</checkbox-group> -->
					<view class="foot-btn f-28 col-f" @tap.stop="toSubmit">确定</view>
				</view>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	// 工具类
	const util = require("@/utils/util.js");
	import search from '@/components/uni-search/index';
	export default {
		components: {
			search,
		},
		data (){
			return {
				index: 1,//提示框
				refund_id: '',
				info:'',//搜索结果
				address: {},//地址
				prolist: [],
				checkList: [],//选中
				isAll: false,
				// checked_num: 0,
			}
		},
		onLoad(options) {
			this.refund_id = options.refund_id ||'';
		},
		computed:{
			checked_num(){
				let num = 0;
				this.prolist.forEach(item => {
					if(item.checked==true){
					num += item.goods_num
					}
				});
				return num;
			}
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				let goods = that.getGoods(that.checkList);
				if(goods ==''){
					that.$api.msg('请选择商品！');
				}
				let order = {
					order_refund_id: that.refund_id,
					order_id: that.info.order_id,
					user_name: that.address.name,
					user_phone: that.address.phone,
					goods : goods
				};
				app._post_form('shop.order.refund/bindSourceOrder',{order: JSON.stringify(order)}, res => {
					// that.$api.msg(res.msg)
					that.$refs.toast.showTips({msg: res.msg});
					setTimeout(uni.navigateBack(),1500);
				});
			},
			//提交表单提取商品数据
			getGoods(list){
				let goods_list = [];
				for (let i in list) {
						let goods = {};
						goods.goods_id = list[i].order_goods_id;
						goods.wxapp_goods_id = list[i].wxapp_goods_id;
						goods.goods_name = list[i].goods_name;
						goods.goods_price = list[i].goods_price;
						goods.goods_sku_id = list[i].goods_sku_id;
						goods.goods_sku_name = list[i].goods_attr || '';
						goods.goods_num = list[i].goods_num;
						goods.goods_image = list[i].file_path;
						goods_list.push(goods);
				}
				return goods_list;
			},
			// 搜索
			search(e){
				let that = this;
				that.keyword = e;
				if(that.keyword != ''){
					app._get('shop.order/getOrderDetail', {order_no:that.keyword}, res => {
						that.address = res.data.order.address;
						that.prolist = that.initDataPro(res.data.order.suborder);
						that.info = res.data.order;
					});
				}else{
					that.$api.msg('内容不能为空！');
				}
			},
			initDataPro(suborder){
				let list = [];
				for(let i = 0; i < suborder.length; i++){
					let goods = suborder[i].goods;
					for(let j = 0; j < goods.length; j++){
						goods[j].goods_num = goods[j].total_num;
						list.push(goods[j]);
					}
				}
				return list;
			},
			// 选中
			choose(e) {
				let that = this;
				let items = that.prolist,
						values = e.detail.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					let item = items[i];
					if(values.includes(item.wxapp_goods_id.toString())){
						that.$set(item,'checked',true)
					}else{
						that.$set(item,'checked',false)
					}
				}
				//  是否全部勾选，判断全选与否状态
				let checkList = [];
				that.prolist.forEach(item => {
					item.checked == true? checkList.push(item): '';
				});
				let allChecks = checkList.length == that.prolist.length;
				that.isAll = allChecks ? true:false;
				that.checkList = checkList;
			},
			// 全选
			chooseAll(e){
				let that = this;
				if (e.detail.value.length == 0) {
						that.prolist.map(item => that.$set(item, 'checked', false))
						that.isAll= false;
				} else {
						that.prolist.map(item => that.$set(item, 'checked', true))
						that.isAll= true;
				}
				that.updateCheck();
			},
			// 自定义输入商品数量
			onInputGoodsNum(e,item) {
			  let that = this,
			      iptValue = e.value;
			
			  if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
			    iptValue = 1;
			  }
			  item.goods_num = iptValue;
				that.updateCheck();
			},
			updateCheck(){
				let that = this;
				let checkList = [];
				that.prolist.forEach(item => {
					item.checked == true? checkList.push(item): ''
				});
				that.checkList = checkList;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'bindOrder.scss';
</style>
