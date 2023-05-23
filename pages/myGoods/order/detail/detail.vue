<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar extClass="nav" id="top" background="linear-gradient(to right,#FF7541,#F55B5B)" color="#fff" isHelpme helpmeColor="#fff"></navigationBar>
		
		<view class="main" v-if="childDetail.order_status">
			<!-- 订单进度 -->
			<view class="order-state">
				<view class="col-f f-44 pad_lr30">{{childDetail.order_status.text}}</view>
				<!-- <view class="col-f state-text f-28 pad_lr30">请提醒顾客转账支付，并在收款后及时确认收款</view> -->
				<view class="steps dis-flex flex-y-center flex-x-between">
					<view class="steps-item f-28" :class="childDetail.order_status.value > 12 && childDetail.order_status.value != 31 ? 'on' : ''">
						<view class="steps-circle"><view></view></view>付款
					</view>
					<view class="steps-item f-28" :class="childDetail.order_status.value > 14 && childDetail.order_status.value != 31 ? 'on' : ''">
						<view class="steps-circle"><view></view></view>发货
					</view>
					<view class="steps-item f-28" :class="childDetail.order_status.value > 15 && childDetail.order_status.value != 31 ? 'on' : ''">
						<view class="steps-circle"><view></view></view>收货
					</view>
					<view v-if="childDetail.order_status.value == 31" class="steps-item f-28">
						<view class="steps-circle"><view></view></view>取消
					</view>
					<view v-else class="steps-item f-28" :class="childDetail.order_status.value == 21 && childDetail.order_status.value != 31 ? 'on' : ''" >
						<view class="steps-circle"><view></view></view>完成
					</view>
				</view>
			</view>
			
			<!-- 快递模版 -->
			<view class="container" v-if="deliver_button">
				<!-- 发货方式 -->
				<view class="listBox bgf">
					<view class="list">
						<view class="label width240">发货方式<text class="col-9 f-24">（必填）</text></view>
						<view class="control dis-flex flex-y-center flex-x-between deliver_list m-t-20">
							<template v-for="(item,index) in deliver_list">
								<view :class="childDetail.express_type==item.value?'deliver_item on':'deliver_item'" :key="index" @tap="deliverChange(item.value)">{{item.text}}</view>
							</template>
						</view>
					</view>
				</view>
				<!-- 无需物流 -->
				<view class="listBox bgf" v-if="childDetail.express_type==3">
					<view class="list dis-flex">
						<view class="label width240">无需物流<text class="col-9 f-24">（否/是）</text></view>
						<view class="control dis-flex flex-y-center flex-x-between">
							<span></span>
							<cust-switch :disabled="childDetail.express_type == 3" :checked="childDetail.express_type == 3"></cust-switch>
						</view>
					</view>
				</view>
				<!-- 输入 -->
				<view class="listBox bgf" v-show="childDetail.express_type!= 3">
					<view class="list dis-flex">
						<view class="label width240">{{field['express_company'].label[childDetail.express_type]}}</view>
						<picker class="control dis-flex flex-x-end flex-y-center" v-if="childDetail.express_type==4" :value="express_val" :range="field['express_company'].selectList" @change.stop="pickerChange($event,field['express_company'])">
							<text class="f-30 col-9 t-r flex-box">
								{{formData.express_company == '' ? field['express_company'].tip[childDetail.express_type] : formData.express_company}}
							</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</picker>
						<view class="control dis-flex flex-x-end flex-y-center" v-else @tap.stop="openItem('express_company')">
							<text class="f-30 col-9 t-r flex-box">
								{{formData.express_company == '' ? field['express_company'].tip[childDetail.express_type] : formData.express_company}}
							</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</view>
					</view>
					<view class="list dis-flex" v-if="childDetail.express_type==4">
						<view class="label width240">{{field['pay_type'].label}}</view>
						<picker class="control dis-flex flex-x-end flex-y-center" :value="formData['pay_type']" :range="field['pay_type'].selectList" @change.stop="pickerChange($event,field['pay_type'])">
							<text class="f-30 col-9">
								{{formData.pay_type === '' ? field['pay_type'].tip : field['pay_type'].selectList[formData.pay_type]}}
							</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</picker>
					</view>
					<view class="list dis-flex">
						<view class="label width240">{{field['express_no'].label}}</view>
						<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="deliverClick2('express_no')">
							<text class="f-30 col-9">{{formData.express_no == '' ? field['express_no'].tip[childDetail.express_type] : formData.express_no}}</text>
							<template v-if="childDetail.order_status.value == 14">
								<view v-if="childDetail.express_type == '1'||childDetail.express_type == '4'" @tap.stop="getOrder()">
									<view class="getOrder">获取单号</view>
								</view>
								<template v-else>
									<view class="scan app-red" @tap.stop="scanCode">
										<text class="iconfont2 icon-Scan f-30"></text>
									</view>
								</template>
							</template>
						</view>
					</view>
				</view>
			</view>
			<!-- 发货之后的物流 -->
			<view class="container" v-if="childDetail.order_status.value > 14 && childDetail.order_status.value != 31 && !no_express">
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">{{field['express_company'].label[childDetail.express_type]}}</view>
						<view class="control t-r">
							<text class="f-30">
								{{formData.express_company == '' ? '无' : formData.express_company}}
							</text>
						</view>
					</view>
					<view class="list dis-flex" v-if="childDetail.express_type==4">
						<view class="label width240">{{field['pay_type'].label}}</view>
						<view class="control t-r">
							<text class="f-30">
								{{formData.pay_type < 0? '未选择' : field['pay_type'].selectList[formData.pay_type]}}
							</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">{{field['express_no'].label}}</view>
						<view class="control dis-flex flex-y-center flex-x-end">
							<text class="f-30">{{formData.express_no == '' ? '无' : formData.express_no}}</text>
							<view class="copy app-red" @tap.stop="copy(formData.express_company+formData.express_no)">
								<text class="col-3 iconfont2 icon-copy2"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商品 -->
			<view class="list-item bgf pad_lr30">
				<view class="pro dis-flex flex-x-between" v-for="(item, index) in goods" :key="index">
					<view class="pro_img">
						<image lazy-load :src="item.file_path" mode="aspectFill"></image>
					</view>
					<view class="pro_info">
						<view class="twolist-hidden col-3 f-28 pro_name">{{item.goods_name}}</view>
						<view class="col-6 f-26 norm">规格：{{item.goods_attr||'无'}}</view>
					</view>
					<view class="pro-r flex-box dis-flex flex-dir-column flex-x-between">
						<!-- <view class="col-3 f-26">¥{{item.seller_wxapp_id==item.dealer_wxapp_id?item.origin_goods_price:item.goods_price}}</view> -->
						<view class="col-3 f-26">¥{{item.goods_price}}</view>
						<view class="col-3 f-26">X{{item.total_num}}</view>
						<!-- <view class="color_red f-26">待发货</view> -->
					</view>
				</view>
			</view>
			<!-- 其他信息 -->
			<view class="container">
				<view class="listBox bgf">
					<view class="list dis-flex" v-if="childDetail.order_type==2&&childDetail.express_price>0">
						<view class="label">配送费用</view>
						<view class="control text-right">
							<text class="f-30">+¥{{childDetail.express_price}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">{{childDetail.order_type==2?'实付金额':'实收金额'}}</view>
						<!-- 分销订单 -->
						<view class="control text-right" v-if="childDetail.order_type==2" @tap.stop="toPriceDetail(childDetail.wholesale_type)">
							<text class="f-30 color_red">¥{{discount_price}}{{childDetail.wholesale_type==0&&discount>0?'('+discount+'折)':''}}</text>
							<text v-if="childDetail.wholesale_type==1" class="iconfont2 icon-gengduobeifen2 p-l-10 p-t-10 p-b-10"></text>
						</view>
						<!-- 非分销订单 -->
						<view class="control text-right" v-else>
								<!-- <text class="f-30 color_red" v-if="discount>0">¥{{discount_price}}{{discount!=''?'('+discount+'折)':''}}</text> -->
								<text class="f-30 color_red">¥{{pay_price}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">订单号</view>
						<view class="control text-right copy">
							<text class="f-30">{{order_no}}</text>
							<text class="m-l-20 col-3 iconfont2 icon-copy2 f-32" @tap.stop="copy(order_no)"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部按钮 -->
			<view class="operation-wrap">
				<view class="operation bgf pad_lr30 dis-flex flex-y-center flex-x-end">
					<view class="oper-item f-28" @tap.stop="clearOrder">回收单号</view>
					<template v-if="deliver_button && childDetail.express_type==1 && childDetail.express_no && childDetail.is_print==0">
						<view class="oper-item f-28 oper-red0" @tap.stop="print">打印</view>
					</template>
					<view v-if="deliver_button" class="oper-item f-28 oper-red" @tap.stop="deliverGoods">发货</view>
					<view v-if="childDetail.order_type==2 &&(childDetail.order_status.value==12||childDetail.order_status.value==13)" class="oper-item f-28 oper-red" @tap.stop="noticePay">去付款</view>
					<template v-if="childDetail.order_status.value > 14 && childDetail.order_status.value != 31 && express_btn">
						<view class="oper-item f-28 oper-red0" @tap.stop="toExpress">查看物流</view>
					</template>
				</view>
			</view>
		</view>
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" :confirmText="confirmText"></popup-tips>
		<popup-tips ref="popupTips2" title="提示" content="已有快递单号，请先回收单号再进行重置" :showConcle="false" confirmText="知道了"></popup-tips>
		<popup-input :title="iTitle" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 打单信息弹窗 -->
		<prinit-model ref="prinitModel"></prinit-model>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	let app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import util from '@/utils/util.js';
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import custSwitch from '@/components/cust-switch/index';
	import deliverCheck from '@/components/cust-switch/index';
	import prinitModel from '../../printorder/prinit-model/index';
	import guidePage from '@/components/guide-page';
	
	export default {
		components: {
			popupInput,
			popupTips,
			custSwitch,
			deliverCheck,
			prinitModel,
			guidePage
		},
		data() {
			return {
				mtitle: '',
				mcontent: '',
				confirmText:'确认',
				detail: {},
				childDetail: {},
				deliver_list:[{value: 1,text: '网点账号'},{value: 4,text: '预约快递'},{value: 3,text: '无需物流'},{value: 2,text: '手动输入'}],//发货方式
				// express_type: 1,//默认发货方式
				deliver_button: 0,
				goods: [],
				pay_price: '',
				discount_price: '',
				discount: '',
				activeSteps: 0,//进度
				maxlength: '-1',
				inputType: '',
				iTitle: '',//弹窗输入标题
				values:'',//内容
				express_val: 0,
				formData: {
					express_no: '',//快递单号
					express_company: '',//快递模版
					express_id: '',
					pay_type: 0,//支付方式
				},
				// 字段
				field: {
				  express_company:  {
				    type: 'link',
						label: {1:'网点账号',2:'快递公司',4:'选择快递'},
				    tip: {1:'选择账号',2:'选择快递',4:'选择快递'},
				    fieldName: 'express_company',
						linkUrls: '',
						selectList:[],
						selectListId: [],
				  },
					express_no: {
						type: 'text',
						label: '快递单号',
						tip: {1:'',2:'请输入',4:''},
						fieldName: 'express_no',
					},
					pay_type: {
						label: '支付方式',
						tip: '选择支付方式',
						fieldName: 'pay_type',
						selectList:['现付','到付'],
						selectListId: [1,2],
					}
				},
				order_no: '',
				wxappUser: {},
				no_express: false,
				express_btn: false,//是否显示查询物流
				wxappUser_b: {},
			}
		},
		onLoad(options) {
			this.order_no = options.order_no;
			this.childOrder_no = options.childOrder_no;
			this.getExpressList();
		},
		onShow() {
			this.getData();
		},
		methods: {
			getData() {
				app._get('shop.order/getOrderDetail', {
					order_no: this.order_no,
					page_type: 'subdetail'
				}, res => {
					this.detail = res.data.order || {};
					this.wxappUser_b = res.data.wxappUser || {};
					this.detail.suborder.forEach(element => {
						if (element.order_no == this.childOrder_no) {
							this.childDetail = element
							if (element.express_type == '3') {
								this.no_express = true;
							}else{
								this.no_express = false;
							}
							if(element.express_type == 1||element.express_type == 4){
								this.express_btn= true;
							}else{
								this.express_btn = false;
							}
							if (element.express_type == '1') {
								this.formData.express_id = element.customer_id
								this.formData.express_company = element.send_site+( element.express_company?'（'+element.express_company+'）':'')
							} else if(element.express_type == '4'){
								if(element.express_company){
									this.getExpress(element.express_id);
								}else{
									this.express_val = -1;
									this.formData.express_company = '';
									this.formData.express_id = '';
								}
								this.formData.pay_type = element.express_pay_type.value==1? 0: element.express_pay_type.value==2? 1 : -1;
							}else {
								this.formData.express_id = element.express_id
								this.formData.express_company = element.express_company
							}
							this.formData.express_no = element.express_no
							this.goods = element.goods
							
							this.pay_price = element.pay_price || 0;
							this.discount_price = Number(element.pay_price || 0).toFixed(2);
							let dealer_discount = Number(element.wholesale_num).toFixed(2);
							this.discount = dealer_discount<10?dealer_discount:'';
							
							this.deliver_button = element.deliver_button
						}
					});
					
					this.getWxappUser();
				});
			},
			//回收单号
			clearOrder() {
				this.mtitle = '提示';
				this.mcontent = '是否确认回收单号？';
				this.confirmText = '确认';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order/clearExpress', {
						sub_order_no: this.childOrder_no
					}, res => {
						this.$api.msg(res.msg)
						this.getData()
					});
				})
			},
			// 获取电子面单
			getOrder() {
				app._post_form('shop.order/orderExpress', {
					sub_order_no: this.childOrder_no
				}, res => {
					if(res.code==1001){
						this.mtitle = '提示';
						this.mcontent = res.msg;
						this.confirmText = res.btn_msg;
						this.$refs.popupTips.open(() => {
							uni.navigateTo({
								url: '/'+res.url
							})
						})
					}else{
						this.$api.msg(res.msg)
						this.getData()
					}
				});
			},
			//预约获取快递列表
			getExpressList(){
				app._get('shop.order/getExpressList', {
					express_order: 1
				}, res => {
					let list = res.data.list;
					let selectList = [], selectListId = [];
					let ind = 0;
					list.forEach((item,index) => {
						selectList.push(item.express_name)
						selectListId.push(item.express_id)
					});
					this.field.express_company.selectList = selectList
					this.field.express_company.selectListId = selectListId;
					
					this.express_val = 0;
					this.formData.express_company = selectList[this.express_val];
					this.formData.express_id = selectListId[this.express_val];
				});
			},
			getExpress(express_id){
				let ind = 0;
				let selectList = this.field['express_company'].selectList;
				let selectListId = this.field['express_company'].selectListId;
				selectListId.forEach((item,index) => {
					if(express_id==item){
						ind = index
					}
				});
				this.express_val = ind;
				this.formData.express_company = selectList[ind];
				this.formData.express_id = selectListId[ind];
			},
			noExpress(value) {
				this.childDetail.express_type = value
				app._post_form('shop.order/saveExpress', {
					sub_order_no: this.childOrder_no,
					express_type: value
				}, res => {
					this.$api.msg(res.msg)
					this.getData()
				});
			},
			inputCompany(fieldName) {
				if (this.childDetail.order_status.value == 14) {
					
					if(this.validation()==false){
						return false
					}
					this.maxlength = this.field[fieldName].maxlength || '-1'
					this.inputType = 'text'
					this.iTitle = "请输入"
					this.$refs.popupInput._open(this.formData[fieldName], (val) => {
						this.formData[fieldName] = val;
						// this.formData.express_id = ''
						this.saveExpress()
					})
				}
			},
			//去付款
			noticePay(){
				app._post_form('shop.order/noticePay',{sub_order_no: this.childOrder_no}, res => {
					this.$api.msg(res.msg);
					if(res.code==1){
						let data = {
							order_id: this.childDetail.order_id,
							order_no: this.detail.order_no,
							order_source: this.childDetail.order_source,
							user: this.wxappUser_b,
							isFenxiao: true
						};
						if(this.childDetail.order_type==2){
							data.order = {
								goods_num: this.childDetail.total_num,
								order_price: this.discount_price,
								wholesale_type: this.childDetail.wholesale_type,
								// discount: this.discount,
								// total_reduce_amount: this.childDetail.total_wholesale_reduce_amount||0,
								order_status: this.childDetail.order_status
							};
						}else{
							data.order = {
								goods_num: this.childDetail.total_num,
								order_price: this.pay_price,
								order_status: this.childDetail.order_status
							};
						}
						data.wxapp_user = this.wxappUser;
						data.wxapp = this.childDetail.dealer_wxapp;
						data.shareText = this.shareText;
						
						uni.navigateTo({
							url: '/pages/order/success/index?data='+ encodeURIComponent(JSON.stringify(data))
						});
					}
				});
			},
			getWxappUser(){
				let data = {
					wxapp_id: this.goods[0].dealer_wxapp_id,
					order_no:this.order_no,
					sub_order_no: this.childOrder_no
				}
				app._post_form('wxapp/info',data,res => {
					let shop = res.data.shop;
					let wxappUser = {
						avatarUrl: shop.logo,
						contact_phone: shop.contact_phone,
						service_qrcode: shop.service_qrcode,
						nickName: shop.name,
						open_contact: shop.open_contact,
						user_id: shop.user_id,
						wechat_id: shop.wechat_id,
						user: shop.user,
						wxapp_id: shop.wxapp_id,
					}
					this.wxappUser = wxappUser;
					this.shareText = res.data.shareText;
				});
			},
			// 输入
			openItem(fieldName) {
				if(this.validation()==false){
					return false
				}
				if (this.childDetail.order_status.value == 14) {
					let field = this.field[fieldName];
					this.inputType = field.type;
					this.iTitle = fieldName=='pay_type'?field.tip:field.tip[this.childDetail.express_type];
					if(this.inputType=='link'){
						let linkUrls = ''
						if (this.childDetail.express_type == '1') {
							linkUrls = '/pages/myGoods/network/index'
						} else {
							linkUrls = '/pages/myGoods/logistics/detail'
						}
						uni.navigateTo({
						url: linkUrls
						});
					}else{
						this.maxlength = field.maxlength || '-1';
						this.$refs.popupInput._open(this.formData[fieldName], (val) => {
							this.formData[fieldName] = val
							this.saveExpress()
						})
					}
				}
			},
			saveExpress() {
				let obj = {
					sub_order_no: this.childOrder_no,
					express_type: this.childDetail.express_type,
					express_no: this.formData.express_no
				}
				if (this.childDetail.express_type == '1') {
					obj.customer_id = this.formData.express_id
					// obj.customer_name = this.formData.express_company
				} else if(this.childDetail.express_type == '4'){
					let pay_val = this.formData.pay_type;
					let pay_type = this.field.pay_type.selectListId[pay_val]
					obj.express_pay_type = pay_type;
					obj.express_id = this.formData.express_id
					obj.express_company = this.formData.express_company
				} else {
					obj.express_id = this.formData.express_id
					obj.express_company = this.formData.express_company
				}
				app._post_form('shop.order/saveExpress', obj, res => {
					// this.$api.msg(res.msg)
					this.getData()
				});
			},
			// 付款方式选择类型赋值
			pickerChange(e, item) {
				if(this.validation()==false){
					return false
				}
				let val = e.target.value;
				if(item.fieldName=='express_company'){
					this.express_val = val;
					this.formData.express_company = item.selectList[val];
					this.formData.express_id = item.selectListId[val];
				}else{
					this.formData[item.fieldName] = e.target.value;
				}
				this.saveExpress()
			},
			expressChange(data) {
				if(this.validation()==false){
					return false
				}
				this.formData.express_company = data.express_name
				this.formData.express_id = data.express_id
				this.saveExpress()
			},
			netChange(data) {
				if(this.validation()==false){
					return false
				}
				this.formData.express_company = data.send_site;
				this.formData.express_id = data.customer_id;
				this.$nextTick(() => {
					this.saveExpress()
				})
			},
			deliverGoods() {
				this.mtitle = '发货';
				this.mcontent = '是否确认发货？';
				this.confirmText = '确认';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order/deliver', {
						sub_order_no: this.childOrder_no
					}, res => {
						this.$api.msg(res.msg)
						this.getData()
					});
				})
			},
			//扫码
			scanCode(){
				if(this.validation()==false){
					return false
				}
				let types = ['QR_CODE','DATA_MATRIX','PDF_417','WX_CODE'];
				uni.scanCode({
				    scanType: ['barCode'],
				    success: (res) => {
								if(types.indexOf(res.scanType) == -1){
									this.formData.express_no = res.result;
									util.music.play_dede()
									this.saveExpress()
								}
				    }
				});
			},
			copy(data){
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				});
			},
			//发货方式切换
			deliverChange(value){
				if(this.validation()==false){
					return false
				}
				if(this.childDetail.express_type != value){
					if(value==3){
						this.mtitle = '提示';
						this.mcontent = '是否确认无需物流？';
						this.confirmText = '确认';
						this.$refs.popupTips.open(() => {
							this.noExpress(3)
						})
					}else{
						this.express_val = 0;
						if(value==4){
							this.formData= {
								express_no: '',//快递单号
								// express_company: this.field['express_company'].selectList[0],
								// express_id: this.field['express_company'].selectListId[0],
								express_company: '',
								express_id: '',
								pay_type: 0,//支付方式
							};
						}else{
							this.formData= {
								express_no: '',//快递单号
								express_company: '',//快递模版
								express_id: '',
								pay_type: 0,//支付方式
							};
						}
						this.childDetail.express_type = value
						// this.saveExpress();
					}
				}
			},
			deliverClick1(fieldName){
				if(this.childDetail.express_type==1){
					this.openItem(fieldName)
				}
				if(this.childDetail.express_type==2){
					this.openItem(fieldName)
				}
			},
			deliverClick2(fieldName){
				if(this.childDetail.express_type==2){
					this.inputCompany(fieldName)
				}
			},
			//验证是否存在快递单号
			validation(){
				let val = true;
				if(this.formData.express_no){
					val = false;
					this.$refs.popupTips2.open()
				}
				return val;
			},
			//查看物流
			toExpress(){
				let express = {
					express_company: this.formData.express_company || '',
					express_no: this.formData.express_no || ''
				};
				let item = this.goods;
				let num = 0;
				item.forEach(vo => {
					num = num + Number(vo.total_num)
				});
				let goods = {
					file_path: item[0].file_path,
					goods_num: num
				};
				uni.navigateTo({
					url: '/pages/order/express/express?order_no=' + this.childOrder_no + '&express=' + encodeURIComponent(JSON.stringify(express)) + '&goods=' + encodeURIComponent(JSON.stringify(goods))
				})
			},
			//打单
			print(){
				this.mtitle = '提示',
				this.mcontent = '是否打单？';
				this.confirmText = '确认';
				this.$refs.popupTips.open(() => {
						app._post_form('shop.order/printExpress', {sub_order_no: this.childOrder_no}, res => {
							this.$api.msg(res.msg);
							if(res.code==1){
								this.getData()
							}
						})
				})
			},
			// 去实付金额详情
			toPriceDetail(type){
				if(type==1){
					uni.navigateTo({
						url: './payAmount?order_no=' + this.order_no+'&childOrder_no='+this.childOrder_no
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../coupon/detail";
	@import 'index';
	@import 'detail';
</style>
