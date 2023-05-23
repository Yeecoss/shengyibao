<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="添加售后" isHelpme extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<!-- 快递公司 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">快递单号</view>
					<view class="control dis-flex flex-y-center flex-x-between" @tap.stop="openItem('express_no')">
						<text class="f-28 flex-box" :class="!formData['express_no']?'col-bc':''">{{formData['express_no'] || field['express_no'].tip}}</text>
						<view class="scan app-red" @tap.stop="scanCode">
							<text class="iconfont2 icon-Scan f-30"></text>
						</view>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label f-30">退回快递</view>
					<view class="control dis-flex flex-y-center flex-x-between" @tap.stop="openItem('express_name')">
						<text :class="!formData['express_name']?'col-bc':''">{{formData['express_name'] || field['express_name'].tip}}</text>
					</view>
					<navigator url="/pages/myGoods/logistics/detail" hover-class="none" class="select_express app-red f-28">选择快递</navigator>
				</view>
			</view>
			<!-- 退回商品 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">退回商品</view>
					<radio-group @change="proChange" class="control dis-flex">
							<label v-for="(item,index) in proList" class="radio-item dis-flex flex-y-center labelBox f-28" :key="index">
								<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value" :checked="item.checked"></radio>
								<text>{{item.name}}</text>
							</label>
					</radio-group>
				</view>
			</view>
			<view class="listBox bgf" v-show="proOn==1">
				<view class="list">
					<view class="label dis-flex flex-y-center flex-x-between" style="width: 100%;">
						<text>商品备注</text>
						<view class="app-red f-30" @tap.stop="addCustom"><text class="iconfont2 icon-jiahao f-32 m-r-10"></text>添加一个</view>
					</view>
					<view class="control m-t-20" v-for="(item,index) in formData.goods_custom" :key="index">
						<view class="remarks f-28 oh" :class="item.goods_custom_remark?'':'col-9'" @tap.stop="openItem('goods_custom_remark',index)">
							{{item.goods_custom_remark?item.goods_custom_remark:'请输入…'}}
						</view>
						<view class="remark_level dis-flex flex-y-center flex-x-between f-28 m-top30">
							<view class="remark_item dis-flex flex-y-center">
								<view class="m-r-40 num" @tap.stop="openItem('goods_num',index)">X{{item.goods_num}}</view>
								<view :class="item.goods_quality==1?'on2 m-r-20':'m-r-20'" @tap.stop="changeLeval(item,1)">良</view>
								<view :class="item.goods_quality==0?'on':''" @tap.stop="changeLeval(item,0)">次</view>
							</view>
							<view class="deleteCustom" @tap.stop="deleteCustom(index)">
								<text class="iconfont2 icon-shanchu f-32"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="listBox bgf" v-show="proOn==2">
				<view class="list dis-flex">
					<view class="label">{{formData.pro_relate?'添加商品':'关联商品'}}</view>
					<view class="control text-right" @tap.stop="openItem('pro_relate')">
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<!-- 关联商品 -->
				<view class="wrap30 related-pros" v-if="formData.pro_relate!=''">
					<template v-for="(item, index) in formData.pro_relate">
						<template v-if="item.goods.spec_type==20">
							<block v-for="(item1,index1) in item.goods.goods_multi_spec.spec_list" :key="index1">
								<view class="related-item dis-flex" :key="index" @tap="showSpecs(item, index)" v-if="item1.goods_num>0">
									<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index,index1)"><text class="iconfont2 icon-subtract"></text></view>
									<view class="related-pic"><image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image></view>
									<view class="related-info">
										<view class="f-24 onelist-hidden">{{item.goods.goods_name}}</view>
										<view class="f-24 col-9 m-top10 goods-attr">规格:
											{{item1.str}}*<text class="app-red">{{item1.goods_num}}</text>
										</view>
										<view class="remark_level dis-flex flex-x-end flex-y-center f-28">
											<view class="remark_item dis-flex flex-y-center">
												<view :class="item1.goods_quality==1?'on2 m-r-20':'m-r-20'" @tap.stop="changeLeval(item1,1)">良</view>
												<view :class="item1.goods_quality==0?'on':''" @tap.stop="changeLeval(item1,0)">次</view>
											</view>
										</view>
									</view>
								</view>
							</block>
						</template>
						<template v-else>
							<view class="related-item dis-flex" :key="index" @tap="showSpecs(item, index)">
								<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index)"><text class="iconfont2 icon-subtract"></text></view>
								<view class="related-pic"><image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image></view>
								<view class="related-info">
									<view class="f-24 onelist-hidden">{{item.goods.goods_name}}</view>
									<view class="f-24 col-9 m-top10">规格:<text class="app-red">{{item.checked_num}}</text></view>
									<view class="remark_level dis-flex flex-x-end flex-y-center f-28">
											<view class="remark_item dis-flex flex-y-center">
												<view :class="item.goods_quality==1?'on2 m-r-20':'m-r-20'" @tap.stop="changeLeval(item,1)">良</view>
												<view :class="item.goods_quality==0?'on':''" @tap.stop="changeLeval(item,0)">次</view>
											</view>
									</view>
								</view>
							</view>
						</template>
					</template>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">图片</view>
					<view class="control dis-flex flex-y-center flex-x-end" @tap.stop="openItem('refund_pic')">
						<template v-if="formData.refund_pic==''">
							<text class="f-28">选择图片</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</template>
						<template v-else>
							<view class="f-24 app-red m-l-20" @tap.stop="onPreviewSkuImage">查看大图</view>
							<view class="refund_pic m-l-20">
								<image :src="formData['refund_pic'].file_path" mode="aspectFill"></image>
							</view>
						</template>
					</view>
				</view>
			</view>
			<!-- 售后类型 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">售后类型</view>
					<picker class="control text-right" @change="pickerChange($event, field.apply_desc)" :value="formData.apply_desc" :range="field.apply_desc.selectList">
					    <view class="uni-input onelist-hidden">
								<text>{{formData.apply_desc || field['apply_desc'].tip}}</text>
					      <text class="iconfont2 icon-gengduobeifen2"></text>
					    </view>
					</picker>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">寄件人姓名</view>
					<view class="control text-right" @tap.stop="openItem('sender_name')">
						<text class="f-28">{{formData.sender_name}}</text>
					  <text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">寄件人手机</view>
					<view class="control text-right" @tap.stop="openItem('sender_phone')">
						<text class="f-28">{{formData.sender_phone}}</text>
					  <text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">寄件人留言</view>
					<view class="control text-right" @tap.stop="openItem('sender_message')">
						<text class="f-28">{{formData.sender_message}}</text>
					  <text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">商家备注</view>
					<view class="control text-right" @tap.stop="openItem('seller_remark')">
						<text class="f-28">{{formData.seller_remark}}</text>
					  <text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
			</view>
			<!-- 底部操作栏 -->
			<view class="operation-wrap">
				<view class="operation dis-flex flex-x-between bgf">
					<view class="oper-item bg-oange col-f f-28" @tap="saveRefund(0)">保存</view>
					<view class="oper-item bgred col-f f-28" @tap="saveRefund(1)">保存并继续</view>
				</view>
			</view>
		</view>
		<popup-input :title="ptitle" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 规格弹窗 -->
		<pop-specs v-if="ispec" ref="popSpecs" @confirm="confirm"></pop-specs>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import util from '@/utils/util.js';
	import popSpecs from '@/components/printing/pop-specs/index';
	import popupInput from '@/components/popup-input/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popSpecs,
			popupInput,
			guidePage
		},
		data (){
			return {
				index: 1,//提示框
				ispec: false,
				proOn: 1,
				goods: {},//关联商品
				formData: {
					express_no: '',//快递单号
					express_name: '',//快递
					goods_custom: [{
						goods_custom_remark: '',
						goods_num: 1,//默认数量1
						goods_quality: 1,//默认良好
					},],
					apply_desc: '',//售后类型
					pro_relate:[],//关联商品
					refund_pic: '',//售后图片
					sender_name: '',//寄件人姓名
					sender_phone: '',//寄件人电话
					sender_message: '',//寄件人留言
					seller_remark: '',//商家备注
				},
				ptitle: '',//弹窗输入标题
				maxlength: '-1',
				inputType: '',
				field: {
					express_no: {
						label: '快递单号',
						fieldName: 'express_no',
						tip: '请输入快递单号',
						type: 'text',
					},
					express_name: {
						label: '退回快递',
						fieldName: 'express_name',
						tip: '请输入快递',
						type: 'text',
					},
					refund_pic: {
						label: '图片',
						fieldName: 'refund_pic',
						type: 'img',
						tip: '选择图片',
						showRight: true,
						isShop: true
					},
					goods_custom_remark: {
						label: '商品备注',
						fieldName: 'goods_custom_remark',
						tip: '商品备注',
						type: 'largeText',
					},
					goods_num: {
						label: '商品数量',
						fieldName: 'goods_num',
						tip: '商品数量',
						type: 'number',
					},
					pro_relate: {
						label: '关联商品',
						fieldName: 'pro_relate',
						type: 'link',
						linkUrl: '/pages/myGoods/printorder/selectProduct/list?source=refundOrder',
						tip: '选择商品',
						tipType: 'state',
					},
					apply_desc: {
						label: '售后类型',
						fieldName: 'apply_desc',
						type: 'select',
						tip: '请选择售后类型',
						selectList: ['不想要','尺码不合适','颜色不想要','7天无理由','有瑕疵','快递丢件','其他'],
						// selectListId: [0,1,2],
						tipType: 'text',
					},
					sender_name: {
						label: '寄件人姓名',
						fieldName: 'sender_name',
						type: 'text',
					},
					sender_phone: {
						label: '寄件人手机',
						fieldName: 'sender_phone',
						type: 'number',
					},
					sender_message: {
						label: '寄件人留言',
						fieldName: 'sender_message',
						type: 'text',
					},
					seller_remark: {
						label: '商家备注',
						fieldName: 'seller_remark',
						type: 'text',
					},
				},
				proList:[{
				  name: '手动备注',
				  checked: true,
				  value: '1',
				}, {
				  name: '关联商品',
				  checked: false,
				  value: '2',
				}, ],
				disable: false,
				tempFilePaths: [],
			}
		},
		onLoad(options) {
			
		},
		methods: {
			//新建
			saveRefund(type){
				let that = this;
				let custom = that.formData.goods_custom;
				let pro_relate = that.formData.pro_relate;
				// if(that.proOn==1){
				// 	for (let k in custom) {
				// 		if(custom[k].goods_custom_remark==''){
				// 			app.showError('商品备注不能为空');
				// 			return false;
				// 		}
				// 	}
				// }
				// if(that.proOn==2){
				// 	if(pro_relate==''){
				// 		app.showError('关联商品不能为空');
				// 		return false;
				// 	}
				// }
				// if (!that.formData.apply_desc) {
				// 	app.showError('售后类型不能为空');
				// 	return false;
				// } 
				if (!that.formData.express_no) {
					app.showError('快递单号不能为空');
					return false;
				} 
				// 判断是否重复提交
				// if (that.disable === true) {
				//   return false;
				// }
				// 表单提交按钮设为禁用 (防止重复提交)
				// that.disable = true;
				uni.showLoading({
				  title: '正在处理...',
				  mask: true
				}); 
				// form参数
				let refund = {
					is_master: 0,
					apply_desc: that.formData.apply_desc,
					
					user_name: that.formData.sender_name,
					user_phone: that.formData.sender_phone,
					user_remark: that.formData.sender_message,
					merchant_remark: that.formData.seller_remark,
					express_no: that.formData.express_no,
					express_name: that.formData.express_name,
					relation_type: that.proOn==1? 2: 1,
					image: that.formData.refund_pic.file_id
				};
				if(that.proOn==1){
					refund.goods_custom = custom;
				}
				if(that.proOn==2){
					refund.goods = this.getGoods(pro_relate);
				}
				app._post_form('shop.order.refund/add',{refund: JSON.stringify(refund)}, res => {
					that.$refs.toast.showTips({msg: res.msg});
					if(type==0){
						uni.navigateBack()
					}else{
						uni.hideLoading();
						this.resetData()
					}
				},false, res=>{
					uni.hideLoading();
				});
			},
			resetData(){
				this.proOn = 1;
				this.goods = {};//关联商品
				this.formData = {
					express_no: '',//快递单号
					express_name: '',//快递
					goods_custom: [{
						goods_custom_remark: '',
						goods_num: 1,//默认数量1
						goods_quality: 1,//默认良好
					},],
					apply_desc: '',//售后类型
					pro_relate:[],//关联商品
					refund_pic: '',//售后图片
					sender_name: '',//寄件人姓名
					sender_phone: '',//寄件人电话
					sender_message: '',//寄件人留言
					seller_remark: '',//商家备注
				};
			},
			// 初始化相关商品
			initProData(list){
				// let goods_list = [];
				for (let i in list) {
					
					if(list[i].goods.spec_type==20){
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						let nocheck = 0;
						for (let i2 in spec_list) {
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
							if(!spec_list[i2].goods_quality){
								spec_list[i2].goods_quality = 1;
							}
							
							if(spec_list[i2].goods_num<=0){
								nocheck++
							}else{
								// let goods = {};
								// goods.goods_id = list[i].goods_id;
								// goods.wxapp_goods_id = list[i].wxapp_goods_id;
								// goods.goods_name = list[i].goods.goods_name;
								// goods.spec_sku_id = spec_list[i2].spec_sku_id;
								// goods.goods_sku_id = spec_list[i2].goods_sku_id;
								// goods.goods_num = spec_list[i2].goods_num;
								// goods.goods_price = spec_list[i2].form.goods_price;
								// goods.goods_image = list[i].goods.goods_image;
								// goods.goods_sku_name = spec_list[i2].str;
								// goods.goods_quality = spec_list[i2].deLeval;
								// goods_list.push(goods);
							}
						}
						if(nocheck == spec_list.length){
							list.splice(i,1);
						}
					}else{
						if(!list[i].goods_quality){
							list[i].goods_quality = 1;
						}
						if(list[i].checked_num<=0){
							list.splice(i,1);
						}else{
								// let goods = {};
								// goods.goods_id = list[i].goods_id;
								// goods.wxapp_goods_id = list[i].wxapp_goods_id;
								// goods.goods_name = list[i].goods.goods_name;
								// goods.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
								// goods.goods_num = list[i].checked_num;
								
								// goods.goods_price = list[i].goods.goods_sku.goods_price;
								// goods.goods_image = list[i].goods.goods_image;
								// goods.goods_quality = list[i].deLeval;
								
								// goods_list.push(goods);
						}
					}
				}
				let formData = {
					// goods: goods_list,
					pro_relate: JSON.parse(JSON.stringify(list)),
				};
				return formData;
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
					// this.initProData(this.formData.pro_relate);
					let formData = this.initProData(this.formData.pro_relate);
					// let list = this.formData.pro_relate!=''?this.formData.pro_relate.concat(formData.pro_relate) : formData.pro_relate;
					this.formData.pro_relate = formData.pro_relate;
					// this.goods = formData.goods;
			},
			//打开规格弹窗
			showSpecs(item, index){
				this.ispec = true;
				setTimeout(()=>{
					let data = {
						goods: item,
						index: index,
						noMax: true
					}
					this.$refs.popSpecs._open(data);
				})
			},
			//关联商品
			proCheck(data){
				let formData = this.initProData(data);
				let list = this.formData.pro_relate!=''?this.formData.pro_relate.concat(formData.pro_relate) : formData.pro_relate;
				this.formData.pro_relate = list;
				// this.goods = formData.goods;
			},
			//删除关联商品
			delPro(index,index1){
				if(index1!= undefined){
					this.formData.pro_relate[index].goods.goods_multi_spec.spec_list.splice(index1, 1);
				}else{
					this.formData.pro_relate.splice(index, 1);
				}
				// this.initProData(this.formData.pro_relate);
			},
			// 输入
			openItem(fieldName,index) {
				let that = this;
				let field = that.field[fieldName];
				that.inputType = field.type;
				that.ptitle = field.label;
				that.maxlength = field.maxlength || '-1'
				if(that.inputType=='link'){
					uni.navigateTo({
					  url: field.linkUrl
					});
				}else if(that.inputType=='img'){
					uni.chooseImage({
					  count: 1,
						// #ifdef H5 || MP
						sizeType: ['compressed', 'original'],
						// #endif
						// #ifdef APP-PLUS
						sizeType: ['compressed', 'original'],
						// #endif
					  // sourceType: ['album', 'camera'],
					  success: res => {
						// #ifdef H5 || MP
						if (res.tempFiles[0].size <= 2048000) {
						// #endif
					    that.tempFilePaths = res.tempFilePaths;
					    app.uploadFile({
					      filePath: that.tempFilePaths[0],
								isShop: true,
					      success: (ress) => {
					        if (ress.code === 1) {
					          this.formData[fieldName] = ress.data
					        }
					      },
					      complete: (ress) => {
					        // this.checkIsSubmit()
					      }
					    });
						// #ifdef H5 || MP
						} else {
							app.showError('该图片过大，请取消原图重新上传，或到APP上传高清大图')
						}
						// #endif
					  }
					});
				}else{
					let value = index ==undefined ?that.formData[fieldName]:that.formData.goods_custom[index][fieldName];
					that.$refs.popupInput._open(value, (val) => {
						if(index!=undefined){
							that.formData.goods_custom[index][fieldName] = val
						}else{
							that.formData[fieldName] = val
						}
					});
					// that.$refs.popupInput._open(this.formData[fieldName], (val) => {
					// 	that.formData[fieldName] = val;
					// })
				}
			},
			//等级
			changeLeval(item,leval){
				item.goods_quality = leval;
			},
			//提交表单提取商品数据
			getGoods(list){
				let goods_list = [];
				for (let i in list) {
					
					if(list[i].goods.spec_type==20){
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						for (let i2 in spec_list) {
							
							if(spec_list[i2].goods_num > 0){
								let goods = {};
								goods.goods_id = list[i].goods_id;
								goods.wxapp_goods_id = list[i].wxapp_goods_id;
								goods.goods_name = list[i].goods.goods_name;
								goods.spec_sku_id = spec_list[i2].spec_sku_id;
								goods.goods_sku_id = spec_list[i2].goods_sku_id;
								goods.goods_num = spec_list[i2].goods_num;
								goods.goods_price = spec_list[i2].form.goods_price;
								goods.goods_image = list[i].goods.goods_image;
								goods.goods_sku_name = spec_list[i2].str;
								goods.goods_quality = spec_list[i2].goods_quality;
								goods_list.push(goods);
							}
						}
					}else{
						if(!list[i].goods_quality){
							list[i].goods_quality = 1;
						}
						if(list[i].checked_num > 0){
							let goods = {};
							goods.goods_id = list[i].goods_id;
							goods.wxapp_goods_id = list[i].wxapp_goods_id;
							goods.goods_name = list[i].goods.goods_name;
							goods.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
							goods.goods_num = list[i].checked_num;
							
							goods.goods_price = list[i].goods.goods_sku.goods_price;
							goods.goods_image = list[i].goods.goods_image;
							goods.goods_sku_name = '';
							goods.goods_quality = list[i].goods_quality;
							
							goods_list.push(goods);
						}
					}
				}
				return goods_list;
			},
			//退回商品
			proChange(e){
				this.proOn = e.detail.value;
			},
			// 选择类型赋值
			pickerChange(e, item) {
			  let val = e.target.value
			  val = item.selectList[val] || '';
				this.formData[item.fieldName] = val;
			},
			//添加备注
			addCustom(){
				let item = {
					goods_custom_remark: '',
					goods_num: 1,//默认数量1
					goods_quality: 1,//默认良好
				};
				this.formData.goods_custom.push(item)
			},
			//删除备注
			deleteCustom(index){
				this.formData.goods_custom.splice(index,1)
			},
			//更新物流
			expressChange(data){
				this.formData.express_name = data.express_name;
			},
			//扫码
			scanCode(){
				let types = ['QR_CODE','DATA_MATRIX','PDF_417','WX_CODE'];
				uni.scanCode({
						scanType: ['barCode'],
						success: (res) => {
								if(types.indexOf(res.scanType) == -1){
									this.formData.express_no = res.result;
									util.music.play_dede()
								}
						}
				});
			},
			//预览Sku规格图片
			onPreviewSkuImage() {
			  wx.previewImage({
			    current: this.formData.refund_pic.file_path,
			    urls: [this.formData.refund_pic.file_path]
			  });
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'add';
</style>
