<template>
	<view class="bgf7 min-h100">
		<!-- 自定义标题栏 -->
		<navigationBar :title="nTitle" isHelpme extClass="nav" id="top"></navigationBar>
		<!-- 内容 -->
		<view class="main container">
			<!-- 地址 -->
			<view class="listBox address-wrap wrap30 bgf">
				<view class="address dis-flex flex-y-center flex-x-between" v-for="(v,i) in address" :key="v.type">
					<view class="address-type f-26 col-f" :class="v.type=='send'?'bgred':''">{{v.type=='send'?'寄':'收'}}</view>
					<view class="address-r dis-flex flex-y-center" @tap="onSelectAddress(i)">
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
						<view class="address-book f-26 col-3">地址薄</view>
					</view>
				</view>
			</view>
			<!-- 发货方式 -->
			<view class="listBox bgf">
				<view class="list dis-flex flex-y-center">
					<view class="label">下单方式</view>
					<view class="control dis-flex flex-y-center deliver_list">
						<template v-for="(item,index) in deliver_list">
							<view :class="express_type==item.value?'deliver_item on':'deliver_item'" :key="index" @tap="deliverChange(item.value)">{{item.text}}</view>
						</template>
					</view>
				</view>
			</view>
			<template v-if="express_type==4">
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">快递公司</view>
						<view class="control text-right" @tap.stop="openItem('express_company')">
							<text :class="formData.express_company?'':'col-9'">{{formData.express_company?formData.express_company:'选择快递'}}</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">支付方式</view>
						<picker class="control t-r" :value="formData['pay_index']" :range="field['pay_type'].selectList" @change.stop="pickerChange($event,field['pay_type'])">
							<text :class="formData.pay_type === '' ?'col-9':''">
								{{formData.pay_type === '' ? field['pay_type'].tip : field['pay_type'].selectList[formData.pay_index]}}
							</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</picker>
					</view>
				</view>
			</template>
			<view class="listBox bgf m-top20" v-else>
				<view class="list dis-flex">
					<view class="label">网点账号</view>
					<view class="control text-right" v-if="customer==''" @tap="toTip">
						<text class="col-9">{{ field['network'].tip}}</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
					<view class="control text-right" v-else>
						<picker @change="pickerChange($event, field.network)" :value="formData.network" :range="field.network.selectList">
						    <view class="uni-input onelist-hidden">
									<text :class="formData[field['network'].fieldName]!==''?'':'col-9'">{{field['network'].selectList[formData['network']] || field['network'].tip}}</text>
						      <text class="iconfont2 icon-gengduobeifen2"></text>
						    </view>
						</picker>
					</view>
				</view>
			</view>
			<view class="listBox bgf m-top20" v-if="express_type==4">
				<view class="list dis-flex">
					<view class="label">上门时间</view>
					<view class="control text-right" @tap.stop="toOpenVisit">
						<text :class="formData.visit_time.text?'':'col-9'">{{formData.visit_time.text?formData.visit_time.text:'选择时间'}}</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">关联商品</view>
					<view class="control text-right" @tap.stop="openItem('pro_relate')">
						<text class="col-9">{{formData.pro_relate?'继续选择商品':'选择商品'}}</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<!-- 关联商品 -->
				<view class="wrap30 related-pros" v-if="formData.pro_relate">
					<view class="related-item dis-flex" v-for="(item, index) in formData.pro_relate" :key="index" @tap="showSpecs(item, index)">
						<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index)"><text class="iconfont2 icon-subtract"></text></view>
						<view class="related-pic"><image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image></view>
						<view class="related-info">
							<view class="f-28 onelist-hidden">{{item.goods.goods_name}}</view>
							<view class="f-24 col-9 m-top10" v-if="item.goods.spec_type==20">规格:
								<block v-for="(vo,i) in item.goods.goods_multi_spec.spec_list" :key="i" v-if="vo.goods_num>0">
									<block v-if="i>0">、</block>
									{{vo.str}}*<text class="app-red">{{vo.goods_num}}</text>
								</block>
							</view>
							<view class="f-24 col-9 m-top10" v-else>规格:<text class="app-red">{{item.checked_num}}</text></view>
						</view>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">{{field['order_no'].label}}</view>
					<view class="control text-right">
						<text class="col-9">{{formData.order_no?formData.order_no:field['order_no'].tip}}</text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">{{field['quantity'].label}}</view>
					<view class="control text-right">
						<text class="col-9">{{formData.quantity?formData.quantity:field['quantity'].tip}}</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list">
					<view class="label">{{field['remarks'].label}}</view>
					<view class="control m-top10" @tap.stop="openItem('remarks')">
						<text :class="formData.remarks?'':'col-9'">{{formData.remarks?formData.remarks:field['remarks'].tip}}</text>
					</view>
				</view>
			</view>
		
			<!-- 底部操作栏 -->
			<view class="operation-wrap">
				<view class="operation wrap30 dis-flex flex-y-center flex-x-between bgf">
					<view class="oper-item bg-oange col-f f-28" :class="type==1?'flex-box':''" @tap="saveDraft">{{type==1?'保存':'保存草稿'}}</view>
					<view class="oper-item bgred col-f f-28" v-if="type!=1" @tap="print">{{express_type==4?'立即预约':'打印'}}</view>
				</view>
			</view>
		</view>
		<!-- 打印成功显示 -->
		<!-- 打单信息弹窗 -->
		<prinit-model ref="prinitModel" @complete="pageBack"></prinit-model>
		<!-- 规格弹窗 -->
		<pop-specs v-if="ispec" ref="popSpecs" @confirm="confirm"></pop-specs>
		<popup-input :title="ptitle" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<!-- 上门时间 -->
		<time-slot ref="timeSlot" @visitChange="visitChange"></time-slot>
		<guidePage ref="guidePage"></guidePage>
		
	</view>
</template>

<script>
	import popSpecs from '@/components/printing/pop-specs/index';
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import timeSlot from './time-slot/index';
	import prinitModel from './prinit-model/index';
	import guidePage from '@/components/guide-page';
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	const util = require('@/utils/util');
	export default {
		components: {
			popSpecs,
			popupInput,
			popupTips,
			timeSlot,
			prinitModel,
			guidePage
		},
		data() {
			return {
				nTitle:'打单/快递',
				type: 0,//添加
				ispec: false,
				address:[{
					address_id:'',
					type: 'send',
					name: '',
					phone: '',
					region:'',
					detail:'',
					default_con:{title:'寄件人地址',text:'点击填写寄件人信息'}
				},{
					address_id:'',
					type: 'accept',
					name: '',
					phone: '',
					region:'',
					detail:'',
					default_con:{title:'收件人地址',text:'点击填写收件人信息'}
				}],
				
				
				deliver_list:[{value: 1,text: '网点账号'},{value: 4,text: '预约快递'}],//发货方式
				express_type: 1,//默认发货方式
				formData: {
					network: '',//网点账号
					express_company:'',//快递公司
					express_id:'',//快递id
					pay_type: 1,//支付方式
					pay_index: 0,//支付index
					visit_time: {date_start:'',text:'',date_end:''},//上门时间
					pro_relate: '',//关联商品
					order_no: '',//订单编号
					quantity: 1,//包裹数量
					remarks:'',//包裹备注
				},
				ptitle: '',//弹窗输入标题
				maxlength: '-1',
				inputType: '',
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
				  express_company:  {
						label: '快递公司',
				    fieldName: 'express_company',
				    type: 'link',
						linkUrl: '/pages/myGoods/logistics/detail?express_order=1',
				    tip: '选择快递',
				  },
					pay_type: {
						label: '支付方式',
						tip: '选择支付方式',
						fieldName: 'pay_type',
						selectList:['现付','到付'],
						selectListId: [1,2],
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
				customer: [],//电子面单列表
				goods: [],
				printCon: '',//打印成功显示
				mtitle:'',
				mcontent:'',
			}
		},
		onLoad(options) {
			if(options.id){
				this.id = options.id ||'';
				this.nTitle = '编辑订单';
				this.type = 1;
				this.getInfo();
			}
		},
		onShow() {
			this.getLoadData();
		},
		methods: {
			//保存快速打单
			saveDraft(callback){
				let that = this;
				let data = {
					express_type: that.express_type,
					sender_id: that.address[0].address_id,
					receiver_id: that.address[1].address_id,
					quantity: that.formData.quantity,
					wxapp_goods: JSON.stringify(that.goods)||'',
					remark: that.formData.remarks,
					// start_date: that.formData.visit_time.date_start,
					// end_date: that.formData.visit_time.date_end
				};
				if(that.express_type == 4){//预约
					data.express_id = that.formData.express_id || '';
					data.express_company = that.formData.express_company || '';
					data.express_pay_type = that.formData.pay_type;
					data.start_date = that.formData.visit_time.date_start;
					data.end_date = that.formData.visit_time.date_end;
				}else{
					data.customer_id = that.formData.network!==''? that.customer[that.formData.network].customer_id : '';
				}
				if(that.type==1){
					data.express_order_id = that.id
				}
				app._post_form('shop.order.fast_print/add',data, res=>{
					if(res.code==1){
						that.id = res.data.express_order_id;
						if(typeof callback === 'function'){
							callback(res.data.express_order_id);
						}else{
							// that.$api.msg(res.msg,1000, true);
							that.$refs.toast.showTips({msg: res.msg});
							if(that.type!=1){
								uni.showModal({
									title: '保存完成',
									content: '是否继续新建订单？',
									confirmText: '继续新建',
									confirmColor: '#FF7541',
									success(res) {
										if(res.confirm){
											that.resetData();
										}else{
											setTimeout(()=>{uni.navigateBack()},1500)
										}
									},
									fail() {
										uni.navigateBack()
									}
								})
							}else{
								uni.navigateBack()
							}
						}
					}else{
						that.$refs.toast.showTips({msg: res.msg});
						// that.$api.msg(res.msg,1000, true);
					}
				})
			},
			// 打印
			print(){
				let that = this;
				uni.showLoading({
					mask: true
				});
				that.saveDraft(id => {
					app._post_form('shop.order.fast_print/print', {express_order_id: that.id}, res => {
						that.$refs.toast.showTips({msg: res.msg});
						if(res.code==1){
							// that.$api.msg(res.msg);
							that.printCon = res.data.express_order;
							that.printCon.now_time = util.dateFormat('YYYY-mm-dd HH:MM', new Date());
							that.$refs.prinitModel._open(that.printCon)
						}else{
							uni.hideLoading()
							// that.$api.msg(res.msg);
						}
					})
				});
				setTimeout(() => {uni.hideLoading()},1500)
			},
			//获取快速打单详情
			getInfo() {
				let that = this;
				app._get('shop.order.fast_print/getDetail',{express_order_id: that.id}, res => {
					let info = res.data.detail;
					that.formData.quantity = info.quantity;
					that.formData.order_no = info.order_no;
					that.formData.remarks = info.remark;
					that.iplChange(info.sender,0);
					that.iplChange(info.receiver,1);
					that.express_type = info.express_type==4? info.express_type: 1;
					if(info.express_type==4){
						let express = info.express;
						that.formData.express_id = express.express_id;
						that.formData.express_company = express.express_name;
						that.formData.pay_type = express.express_pay_type ||1;
						that.formData.pay_index = info.express_pay_type==2? 1: 0;
					}else{
						let customer = this.customer;
						for (let i in customer) {
							let item = this.customer[i];
							if(info.customer_id == item.customer_id){
								that.formData.network = i;
							}
						}
					}
					//上门时间
					if(info.start_date!='' &&info.start_date!='0000-00-00 00:00:00'){
						// this.formData.visit_time.date_start = util.dateFormat('YYYY-mm-dd HH:MM:SS',new Date('2020-09-15 13:00:00'));
						// this.formData.visit_time.date_end = util.dateFormat('YYYY-mm-dd HH:MM:SS',new Date('2020-09-15 15:00:00'));
						this.formData.visit_time.date_start = info.start_date;
						this.formData.visit_time.date_end = info.end_date;
						this.$nextTick(() => {
							this.$refs.timeSlot.unit(this.formData.visit_time,(data) => {
								this.formData.visit_time = data
							})
						})
					}
					// 关联商品
					this.initPro(info.wxapp_goods);
				});
			},
			initPro(list){
				let data = [];
				for (let i in list) {
					if(list[i].sku){
						let spec_list = list[i].wxapp_good.goods.goods_multi_spec.spec_list;
						let good_check = list[i].sku;
						for (let k1 in good_check) {
							for (let k2 in spec_list) {
								if(good_check[k1].spec_sku_id == spec_list[k2].spec_sku_id){
									spec_list[k2].goods_num = parseInt(good_check[k1].goods_num);
								}
							}
						}
					}else{
						list[i].wxapp_good.checked_num = parseInt(list[i].goods_num);
					}
					data.push(list[i].wxapp_good)
				}
				this.getGoods(data);
				this.initProData(data)
			},
			//获取快递打单加载信息-网点
			getLoadData(){
				app._get('shop.express.order/save',{}, res => {
					let customer = res.data.customer;
					this.customer = customer;
					let selectList = [], selectListId = [];
					for (let i in customer) {
						selectList.push(customer[i].send_site + (customer[i].express_name?'('+customer[i].express_name+')':''));
						if(customer[i].is_default==1){
							this.formData.network = i;
						}
					}
					this.field['network'].selectList = selectList;
				});
			},
			//规格选择
			confirm(val, index) {
				let item = this.formData.pro_relate[index];
					if (val.spec_type == 20) {
						item.goods.goods_multi_spec = val.goodsMultiSpec;
					}else{
						item.checked_num = val.goods_num;
					}
					this.$set(this.formData.pro_relate, index, item)
					this.getGoods(this.formData.pro_relate);
					this.initProData(this.formData.pro_relate);
			},
			// 数据赋值
			change(fieldName, val) {
				this.formData[fieldName] = val;
			},
			// 格式选中相关商品
			getGoods(list){
				let goods_list = [];
				for (let i in list) {
					let goods = {};
					goods.goods_id = list[i].goods_id;
					goods.wxapp_goods_id = list[i].wxapp_goods_id;
					
					if(list[i].goods.spec_type==20){
						goods.sku = [];//选中的规格id列表
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						
						for (let i2 in spec_list) {
							if(spec_list[i2].goods_num > 0){
								let item_spec = {};
								item_spec.spec_sku_id = spec_list[i2].spec_sku_id;
								item_spec.goods_sku_id = spec_list[i2].goods_sku_id;
								item_spec.goods_num = spec_list[i2].goods_num;
								goods.sku.push(item_spec);
							}
						}
					}else{
						if(list[i].checked_num > 0){
							goods.goods_num = list[i].checked_num;
							goods.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
						}
					}
					goods_list.push(goods);
				}
				this.goods = goods_list;
			},
			// 初始化相关商品
			initProData(list){
				for (let i in list) {
					
					if(list[i].goods.spec_type==20){
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						let nocheck = 0;
						for (let i2 in spec_list) {
							if(spec_list[i2].goods_num<=0){
								nocheck++
							}else{
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
						}
					}
				}
				this.formData.pro_relate = list;
			},
			//选择地址
			onSelectAddress(index) {
				let _this = this; // 允许刷新

				uni.navigateTo({
					url: '/pages/address/index?pindex=' +index
					// url: '/pages/myGoods/address/' + (_this.send_address ? 'index?pindex='+index : 'create')
					// url: '/pages/myGoods/address/index?pindex=' + +index
				});
			},
			//打开规格弹窗
			showSpecs(item, index){
				this.ispec = true;
				setTimeout(()=>{
					let data = {
						goods: item,
						index: index,
					}
					this.$refs.popSpecs._open(data);
				})
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
			//更新快递
			expressChange(data) {
				this.formData.express_company = data.express_name
				this.formData.express_id = data.express_id
			},
			//关联商品
			proCheck(data){
				let list = this.formData.pro_relate!=''?this.formData.pro_relate.concat(data):data;
				list = this.Es6duplicate(list,true);
				
				this.initProData(list);
				this.getGoods(list);
			},
			//去重
			Es6duplicate(arr,type){
			  if(arr.length == 0){
			    return arr;
			  }else{
			    if(type){
			      var obj = {}
			      var newArr = arr.reduce((cur,next) => {
			        obj[next.wxapp_goods_id] ? "" : obj[next.wxapp_goods_id] = true && cur.push(next);
			        return cur;
			      },[])
			      return newArr;
			    }else{
			      return Array.from(new Set(arr));
			    }
			  }
			},
			//删除关联商品
			delPro(index){
				this.formData.pro_relate.splice(index, 1)
				this.getGoods(this.formData.pro_relate);
			},
			// 选择类型赋值
			pickerChange(e, item) {
			  let val = e.target.value
				if(item.fieldName=='pay_type'){
					this.formData.pay_index = val;
					this.formData.pay_type = this.field[item.fieldName].selectListId[val]
				}else{
					if (item.showText) {
					  val = item.selectList[val] || ''
					}
					this.formData[item.fieldName] = val;
				}
			},
			// 输入
			openItem(fieldName,index) {
				let that = this;
				let field = that.field[fieldName];
				that.inputType = field.type;
				that.ptitle = field.label;
				that.maxlength = field.maxlength || '-1'
				if(that.inputType=='link'){
					if(fieldName=='pro_relate'){
						uni.setStorageSync('printGoods', this.formData.pro_relate);//带入列表
					}
					uni.navigateTo({
					  url: field.linkUrl
					});
				}else{
					that.$refs.popupInput._open(this.formData[fieldName], (val) => {
						that.formData[fieldName] = val
					})
				}
			},
			//重置数据
			resetData(){
				let that = this;
				that.express_type = 1;
				that.formData = {
					network: '',//网点账号
					express_company:'',//快递公司
					express_id:'',//快递id
					pay_type: 1,//支付方式
					pay_index: 0,//支付index
					visit_time: {date_start:'',text:'',date_end:''},//上门时间
					pro_relate: '',//关联商品
					order_no: '',//订单编号
					quantity: 1,//包裹数量
					remarks:'',//包裹备注
				}
				that.goods = [];
				that.address = [{
					address_id:'',
					type: 'send',
					name: '',
					phone: '',
					region:'',
					detail:'',
					default_con:{title:'寄件人地址',text:'点击填写寄件人信息'}
				},{
					address_id:'',
					type: 'accept',
					name: '',
					phone: '',
					region:'',
					detail:'',
					default_con:{title:'收件人地址',text:'点击填写收件人信息'}
				}];
			},
			//无网点账号
			toTip(){
				uni.showModal({
					title: '友情提示',
					content: '未配置网点账号，去添加网点账号？',
					confirmColor: '#FF7541',
					success: (res) => {
						if(res.confirm){
							uni.navigateTo({
								url: '../network/detail'
							})
						}
					}
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
			//发货方式切换
			deliverChange(value){
				this.express_type = value
			},
			toOpenVisit(){
				this.$refs.timeSlot._open(this.formData.visit_time)
			},
			visitChange(data){
				this.formData.visit_time = data;
			},
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.printChange){
					prevPage.$vm.printChange(data)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import '../coupon/detail.scss';
	@import 'add.scss';
</style>
