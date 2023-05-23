<template>
	<view class="bgf7">
		
			<!-- 自定义标题栏 -->
			<navigationBar title="订单详情" extClass="nav" id="top"></navigationBar>
			<!-- 内容 -->
			<view class="main container">
				<!-- 订单状态 -->
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">订单状态</view>
						<view class="control text-right">
							<text class="f-30">{{info.status?info.status.text:''}}</text>
						</view>
					</view>
				</view>
				<!-- 地址 -->
				<view class="listBox address-wrap wrap30 bgf">
					<view class="address dis-flex flex-y-center flex-x-between" v-for="(v,i) in address" :key="v.type">
						<view class="address-type f-26 col-f" :class="v.type=='send'?'bgred':''">{{v.type=='send'?'寄':'收'}}</view>
						<view class="address-r dis-flex flex-y-center">
							<view class="address-info">
								<block v-if="v.detail==''">
									<view class="f-32 col-3">{{v.default_con.title}}</view>
									<view class="f-24 col-9 m-top10">{{v.default_con.text}}</view>
								</block>
								<block v-else>
									<view class="f-32 col-3">{{v.name}}  {{v.phone}}</view>
									<view class="f-24 col-6 onelist-hidden m-top10">{{v.region}}{{v.detail}}</view>
								</block>
							</view>
						</view>
					</view>
				</view>
				<view class="listBox bgf" v-if="info.express_type!=4">
					<view class="list dis-flex">
						<view class="label">网点账号</view>
						<view class="control text-right">
							<text class="f-30">{{info.customer?info.customer.send_site:'无'}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf" v-if="info.express_type==4">
					<view class="list dis-flex">
						<view class="label">快递公司</view>
						<view class="control text-right">
							<text>{{info.express?info.express.express_name:'无'}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf" v-if="info.express_type==4">
					<view class="list dis-flex">
						<view class="label">支付方式</view>
						<view class="control text-right">
							<text>{{info.express_pay_type==2?'到付':info.express_pay_type==1?'现付':'无'}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf m-top20" v-if="info.express_type==4">
					<view class="list dis-flex">
						<view class="label">上门时间</view>
						<view class="control text-right">
							<text :class="formData.visit_time.text?'':'col-9'">{{formData.visit_time.text?formData.visit_time.text:'选择时间'}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">关联商品</view>
						<view class="control text-right">
							<text class="col-9">{{info.wxapp_goods==''?'无':''}}</text>
						</view>
					</view>
					<!-- 关联商品 -->
					<view class="wrap30 related-pros" v-if="info.wxapp_goods">
						<view class="related-item dis-flex" v-for="(item, index) in info.wxapp_goods" :key="index">
							<view class="related-pic"><image lazy-load :src="item.wxapp_good.goods.goods_image" mode="aspectFill"></image></view>
							<view class="related-info">
								<view class="f-28 onelist-hidden">{{item.wxapp_good.goods.goods_name}}</view>
								<view class="f-24 col-9 m-top10" v-if="item.sku">规格:
									<template v-for="(vv,ii) in item.sku">
										<text :key="ii">{{vv.goods_sku?vv.goods_sku.goods_attr+'*':''}}</text>
										<text class="app-red">{{vv.goods_num}}</text>
									</template>
								</view>
								<view class="f-24 col-9 m-top10" v-else>规格:<text class="app-red">{{item.goods_num}}</text></view>
							</view>
						</view>
					</view>
					<!-- <view class="wrap30 related-pros" v-if="formData.pro_relate">
						<view class="related-item dis-flex" v-for="(item, index) in formData.pro_relate" :key="index">
							<view class="related-pic"><image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image></view>
							<view class="related-info">
								<view class="f-24 onelist-hidden">{{item.goods.goods_name}}</view>
								<view class="f-24 col-9 m-top10" v-if="item.goods.spec_type==20">规格:
									<block v-for="(vo,i) in item.goods.goods_multi_spec.spec_list" :key="i" v-if="vo.goods_num>0">
										<block v-if="i>0">、</block>
										{{vo.str}}*<text class="app-red">{{vo.goods_num}}</text>
									</block>
								</view>
								<view class="f-24 col-9 m-top10" v-else>规格:<text class="app-red">{{item.checked_num}}</text></view>
							</view>
						</view>
					</view> -->
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">{{field['order_no'].label}}</view>
						<view class="control text-right">
							<text class="col-9">{{info.order_no}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">{{field['quantity'].label}}</view>
						<view class="control text-right">
							<text class="col-9 f-30">{{formData.quantity?formData.quantity:field['quantity'].tip}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list">
						<view class="control m-top10">
							<text class="f-30">订单备注：</text>
							<text class="col-9 f-30">{{formData.remarks?formData.remarks:field['remarks'].tip}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">下单时间</view>
						<view class="control text-right">
							<text class="f-30">{{info.create_time}}</text>
						</view>
					</view>
				</view>
			
				<!-- 底部按钮 -->
				<view class="operation-wrap" v-if="info.status">
					<view class="operation bgf pad_lr30 dis-flex flex-y-center flex-x-end">
						<view class="oper-item f-28" @tap.stop="delData">删除</view>
						<view class="oper-item f-28" v-if="info.status.value==0" @tap.stop="toEdit">编辑订单</view>
						<view class="oper-item f-24 oper-red" v-if="info.status.value==0" @tap.stop="print(id)">{{info.express_type==4?'立即预约':'打印'}}</view>
						<view class="oper-item f-28" v-if="info.status.value==1" @tap.stop="clearExpress(id)">{{info.express_type==4?'取消预约':'回收单号'}}</view>
						<view class="oper-item f-28 oper-red0" v-if="info.status.value==1" @tap.stop="toExpress">查看物流</view>
					</view>
				</view>
			</view>
			<!-- 打印成功显示 -->
			<!-- 打单信息弹窗 -->
			<prinit-model ref="prinitModel"></prinit-model>
			<!-- 提示Model -->
			<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确认"></popup-tips>
			<!-- 提示框 -->
			<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
			<!-- 上门时间 -->
			<time-slot ref="timeSlot" @visitChange="visitChange"></time-slot>
	</view>
</template>

<script>
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js");
	const util = require('@/utils/util');
	import popupTips from '@/components/popup-tips/index';
	import timeSlot from './time-slot/index';
	import prinitModel from './prinit-model/index';
	export default {
		components: {
			popupTips,
			timeSlot,
			prinitModel
		},
		data() {
			return {
				index: 1,//提示框
				mtitle: '',//model标题
				mcontent: '',//model内容
				// isPrint: 0,//是否打印成功
				// ispec: false,
				address:[{
					address_id:'',
					type: 'send',
					name: '',
					phone: '',
					region:'',
					detail:'',
					default_con:{title:'寄件人地址',text:'无寄件人信息'}
				},{
					address_id:'',
					type: 'accept',
					name: '',
					phone: '',
					region:'',
					detail:'',
					default_con:{title:'收件人地址',text:'无收件人信息'}
				}],
				info: {},//详情
				formData: {
					visit_time: {date_start:'',text:'',date_end:''},//上门时间
					network: '',//网点账号
					pro_relate: '',//关联商品
					order_no: '',//订单编号
					quantity: 1,//包裹数量
					remarks:'',//包裹备注
				},
				field: {
					network: {
						label: '网点账号',
						fieldName: 'network',
						type: 'select',
						tip: '选择账号',
						selectList: [],
						selectListId: [],
						tipType: 'text',
					},
					pro_relate: {
						label: '关联商品',
						fieldName: 'pro_relate',
						type: 'link',
						linkUrl: './selectProduct/list',
						tip: '选择商品',
						tipType: 'state',
					},
					order_no: {
						label: '订单编号',
						fieldName: 'order_no',
						type: 'notDo',
						tip: '自动获取',
						showIcon: false,
					},
					quantity: {
						label: '包裹数量',
						fieldName: 'quantity',
						type: 'number',
						tip: '未填写',
						tipType: 'text'
					},
					remarks: {
						label: '备注',
						fieldName: 'remarks',
						type: 'largeText',
						tip: '包裹备注（50字内）',
						tipType: 'text',
						maxlength: 50
					}
				},
				id: '',//打单id
				// customer: [],//电子面单列表
				goods: [],
				printCon: '',//打印成功显示
			}
		},
		onLoad(options) {
			if(options.id){
				this.id = options.id;
				this.getInfo();
			}
		},
		methods: {
			//删除
			delData(){
				this.mtitle = '提示',
				this.mcontent = '删除并回收快递单号！';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order.fast_print/delete',{express_order_id: this.id}, res =>{
						this.$api.msg(res.msg);
						uni.navigateBack()
					});
				})
			},
			//打印
			print(id){
				this.mtitle = '提示',
				this.mcontent = this.info.express_type==4?'是否预约？':'是否打单？';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order.fast_print/print',{express_order_id: id}, res =>{
						this.$api.msg(res.msg,1000, true);
						this.printCon = res.data.express_order;
						this.printCon.now_time = util.dateFormat('YYYY-mm-dd HH:MM', new Date());
						this.getInfo()
						this.$refs.prinitModel._open(this.printCon)
					});
				})
			},
			//复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
			//回收单号
			clearExpress(id){
				this.mtitle = '提示',
				this.mcontent = this.info.express_type==4?'是否取消预约？':'是否回收单号？';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order.fast_print/clearExpress',{express_order_ids: id}, res =>{
						this.$api.msg(res.msg);
						this.getInfo()
					});
				})
			},
			//获取快速打单详情
			getInfo() {
				let that = this;
				app._get('shop.order.fast_print/getDetail',{express_order_id: that.id}, res => {
					let info = res.data.detail;
					that.info = info;
					that.formData.quantity = info.quantity;
					that.formData.order_no = info.order_no;
					that.formData.remarks = info.remark;
					that.iplChange(info.sender,0);
					that.iplChange(info.receiver,1);
					//上门时间
					if(info.start_date!='' &&info.start_date!='0000-00-00 00:00:00'){
						that.formData.visit_time.date_start = info.start_date;
						that.formData.visit_time.date_end = info.end_date;
						that.$nextTick(() => {
							that.$refs.timeSlot.unit(that.formData.visit_time,(data) => {
								that.formData.visit_time = data
							})
						})
					}
					// 关联商品
					// this.initPro(info.good_list);
				});
			},
			initPro(list){
				for (let i in list) {
					if(list[i].goods.spec_type==20){
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						let good_check = list[i].goods_num;
						for (let k1 in good_check) {
							for (let k2 in spec_list) {
								if(good_check[k1].goods_sku_id == spec_list[k2].spec_sku_id){
									spec_list[k2].goods_num = good_check[k1].goods_num;
								}
							}
						}
					}else{
						list[i].checked_num = list[i].goods_num;
					}
				}
				this.initProData(list)
			},
			// 初始化相关商品
			initProData(list){
				let goods_list = [];
				for (let i in list) {
					let goods = {};
					goods.goods_id = list[i].goods_id;
					goods.wxapp_goods_id = list[i].wxapp_goods_id;
					
					if(list[i].goods.spec_type==20){
						goods.sku = [];//选中的规格id列表
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						let nocheck = 0;
						for (let i2 in spec_list) {
							if(spec_list[i2].goods_num<=0){
								nocheck++
							}else{
								let item_spec = {};
								item_spec.spec_sku_id = spec_list[i2].spec_sku_id;
								item_spec.goods_sku_id = spec_list[i2].goods_sku_id;
								item_spec.goods_num = spec_list[i2].goods_num;
								goods.sku.push(item_spec);
							}
							let arr = spec_list[i2].spec_sku_id.split('_');
							let str =[];
							for (let i3 in arr) {
								for (let k1 in spec_attr) {
									for (let k2 in spec_attr[k1].spec_items) {
										let item = spec_attr[k1].spec_items[k2];
										if(arr[i3] == item.item_id){
											str.push(item.spec_value)
										}
									}
								}
							}
							spec_list[i2].str = str.toString();
						}
						if(nocheck == spec_list.length){
							list.splice(i,1);
						}
					}else{
						if(list[i].checked_num<=0){
							list.splice(i,1);
						}else{
							goods.goods_num = list[i].checked_num;
							goods.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
						}
					}
					goods_list.push(goods);
					this.goods = goods_list;
				}
				this.formData.pro_relate = list;
			},
			//更新地址
			iplChange(data,index){
				let addr = this.address[index];
				this.address[index].address_id = data.address_id;
				this.address[index].name = data.name;
				this.address[index].phone = data.phone;
				this.address[index].detail = data.detail;
				let region = [];
				for (let k of Object.keys(data.region)) {
					region.push(data.region[k]);
				}
				this.address[index].region = region.toString();
			},
			//查看物流
			toExpress(){
				let express = {
					express_no: this.info.express_no||''
				};
				if(this.info.express_type==4){
					express.express_company = this.info.express.express_name||''
				}else{
					express.express_company = this.info.customer.express_name||''
				}
				let file_path = this.info.wxapp_goods[0].wxapp_good.goods.goods_image;
				let goods = {
					file_path: file_path,
					goods_num: this.info.total_num
				};
				uni.navigateTo({
					url: '/pages/order/express/express?order_no=' + this.info.order_no + '&express=' + encodeURIComponent(JSON.stringify(express)) + '&goods=' + encodeURIComponent(JSON.stringify(goods))
				})
			},
			//编辑
			toEdit(){
				uni.navigateTo({
					url: './add?id='+ this.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../coupon/detail.scss';
	@import 'add.scss';
	@import  'detail';
</style>
