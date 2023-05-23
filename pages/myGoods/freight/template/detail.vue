<template>
	<view class="bgf7">
		<!-- 自定义标题栏 -->
		<navigationBar :title="navtitle" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox" style="background:white">
				<!-- 模版名称 -->
				<view class="list dis-flex">
					<view class="label f-28">模版名称</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('title')">
						<text :class="formData.title? '': 'col-9'">{{formData.title ? formData.title : field.title.name}}</text>
					</view>
				</view>
				<!-- 计费方式 -->
				<view class="list dis-flex">
					<view class="label">计费方式</view>
					<radio-group @change="payChange" class="control dis-flex">
							<label v-for="(item,index) in paywayList" class="radio-item dis-flex flex-y-center labelBox" :key="index">
								<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value" :checked="item.checked"></radio>
								<text>{{item.name}}</text>
							</label>
					</radio-group>
				</view>
			</view>
			<view class="listBox" style="background:white">
				<view class="list dis-flex">
					<view class="label">是否默认</view>
					<view class="control dis-flex flex-x-end flex-y-center">
						<cust-switch ref="switch" :checked="formData.is_default" @change="switchCange($event,'is_default')"></cust-switch>
					</view>
				</view>
			</view>
			<view class="listBox" style="background:white" v-for="(item, index) in formData.rule" :key="index">
				<!-- 可配送区域 -->
				<view class="list dis-flex">
					<view class="label f-28">可配送区域</view>
					<view class="control dis-flex flex-x-end flex-y-center" @tap.stop="openItem('deliverArea', index)">
						<view v-if="item.deliverArea" class="address onelist-hidden">{{item.deliverArea}}</view>
						<view v-else class="col-9">{{field['deliverArea'].tip}}</view>
						<text class="iconfont2 icon-address col-6"></text>
						<view class="del-btn" @tap.stop="delRule(index)">
							<text class="iconfont2 icon-shanchu"></text>
						</view>
					</view>
				</view>
				<!-- 首件 -->
				<view class="list dis-flex">
					<view class="label f-28">{{formData.payway==1?'首件':'首重'}}</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('first',index)">
						<view :class="item.first ? '': 'col-9'">{{item.first ? item.first : field['first'][formData.payway-1].name}}</view>
						<text class="col-9">{{field['first'][formData.payway-1].tip}}</text>
					</view>
				</view>
				<!-- 运费 -->
				<view class="list dis-flex">
					<view class="label f-28">运费</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('freight',index)">
						<view :class="item.freight ? '': 'col-9'">{{item.freight ? item.freight : field['freight'].name}}</view>
						<text class="col-9">{{field['freight'].tip}}</text>
					</view>
				</view>
				<!-- 续重 -->
				<view class="list dis-flex">
					<view class="label f-28">{{formData.payway==1?'续件':'续重'}}</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('next',index)">
						<view :class="item.next ? '': 'col-9'">{{item.next ? item.next : field['next'][formData.payway-1].name}}</view>
						<text class="col-9">{{field['next'][formData.payway-1].tip}}</text>
					</view>
				</view>
				<!-- 续费 -->
				<view class="list dis-flex">
					<view class="label f-28">续费</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('renew_pay',index)">
						<view :class="item.renew_pay ? '': 'col-9'">{{item.renew_pay ? item.renew_pay : field['renew_pay'].name}}</view>
						<text class="col-9">{{field['renew_pay'].tip}}</text>
					</view>
				</view>
			</view>
			<view class="addbtn" @tap="addRule">+ 添加区域和运费</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
		
		<popup-input :title="ptitle" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	import custSwitch from '@/components/cust-switch/index.vue';
	export default {
		components: {
			popupInput,
			custSwitch
		},
		data() {
			return {
				navtitle: '添加运费模版',
				index: 1,//提示框
				ptitle: '',//弹窗输入标题
				maxlength: '-1',
				inputType: '',
				delivery_id: '',
				regionData: '',//城市信息
				formData: {
					title: '',//模版名称
					payway: 1,//计费方式
					rule: [
						{
							region: [],//可配送区域信息id
							deliverArea: '',//可配送区域名称
							first:'',//首件/首重
							freight:'',//运费
							next:'',//续件/续重
							renew_pay:'',//续费
						},
					],
					is_default: true,//默认状态
				},
				// 字段
				field: {
				  title:  {
				    type: 'text',
						name:'请输入模版名称',
				    fieldName: 'title',
						notes: '订单下单未付款，n天后自动关闭，设置0天不自动关闭',
						maxlength: '20'
				  },
				  deliverArea:  {
				    type: 'link',
						name:'选择地区',
				    fieldName: 'deliverArea',
						linkUrls: '/pages/myGoods/freight/address',
						tip:'选择地区',
				  },
				  first:  [{
				    type: 'number',
						name: '请输入首件',
				    fieldName: 'first',
						tip: '个',
				  },{
				    type: 'digit',
						name: '请输入首重',
				    fieldName: 'first',
						tip: 'kg',
				  },],
					freight: {
				    type: 'digit',
						name:'请输入运费',
				    fieldName: 'freight',
						tip: '元',
						maxlength: '9'
					},
					next: [{
				    type: 'number',
						name:'请输入续件',
				    fieldName: 'next',
						tip: '个',
					},{
				    type: 'digit',
						name:'请输入续重',
				    fieldName: 'next',
						tip: 'kg',
					},],
					renew_pay: {
				    type: 'digit',
						name:'请输入续费',
				    fieldName: 'renew_pay',
						tip: '元',
						maxlength: '9'
					},
				},
				paywayList:[{
				  name: '按件数',
				  checked: true,
				  value: '1',
				}, {
				  name: '按重量',
				  checked: false,
				  value: '2',
				}, ],
			}
		},
		onLoad(options) {
			// console.log(options)
			let that = this;
			that.navtitle = options.type==2?'编辑运费模版': '新增运费模版';
			that.type = options.type ? options.type : that.type;
			
			if(options.type == 2){
				that.getInfo(options.id);
				that.delivery_id = options.id;
			}else{
				that.getRegion();
			}
		},
		methods: {
			//获取运费模板信息
			getInfo(id){
				let that = this;
				app._get('shop.delivery/edit',{delivery_id: id}, async res => {
					that.formData.title = res.data.delivery.name;
					// 计费方式
					that.formData.payway = res.data.delivery.method.value==20? 2: 1;
					if(res.data.delivery.method.value==20){
						that.paywayList.map(item => {
							item.checked = !item.checked;
						})
						that.paywayList[that.formData.payway-1].checked = true;
					}
					that.regionData = res.data.provinceData;
					that.formData.is_default = res.data.delivery.is_default==1? true : false;
					if(res.data.delivery.rule){
						let rule = [];
						for (let item of res.data.delivery.rule) {
							let obj = {};
							obj.region = item.province_data;
							obj.deliverArea = await that.initRegion(item.province_data,res.data.provinceData);
							obj.first = item.first;
							obj.freight = item.first_fee;
							obj.next = item.additional;
							obj.renew_pay = item.additional_fee;
							rule.push(obj)
						}
						that.formData.rule = rule;
					}
				});
			},
			//初始可配送区域名称
			initRegion(region,regionData){
				let area = [];
				region.forEach(item => {
					for (let key in regionData) {
						if(item == regionData[key].id){
							area.push(regionData[key].name);
						}
					}
				});
				return area.toString();
			},
			//获取地址列表
			getRegion(){
				app._get('shop.delivery/add',{},res => {
					this.regionData = res.data.provinceData;
				})
			},
			// 提交
			toSubmit(){
				let that = this;
				let isSubmit = false;
				// if(that.formData.title == ''){
				// 	that.$api.msg('模板名称不能为空!');
				// 	return false;
				// }
				if(that.formData.title != ''){
					let rule = {};rule.region=[];rule.first=[];rule.first_fee=[];rule.additional=[];rule.additional_fee=[];
					that.formData.rule.forEach(item => {
						for(let k in item){
							if(item[k] == ''){
								that.$api.msg('内容不能为空!');
								isSubmit = false;
								return false;
							}else{
								isSubmit = true;
							}
						}
						rule.region.push(item['region'].toString());
						rule.first.push(item['first']);
						rule.first_fee.push(item['freight']);
						rule.additional.push(item['next']);
						rule.additional_fee.push(item['renew_pay']);
					});
					if(isSubmit== true){
						let url = that.type == 2? 'shop.delivery/edit' : 'shop.delivery/add',
								data = {
									name : that.formData.title,
									method: that.formData.payway == 2 ? 20: 10,
									rule: JSON.stringify(rule),
									is_default: that.formData.is_default==true? 1: 0,
								};
						if(that.type == 2){data.delivery_id = that.delivery_id}
						app._post_form(url, data, res => {
							that.$api.msg(res.msg);
							if(res.code==1){
								setTimeout(()=>{that.pageBack(true)},1000)
							}
						})
					}
				}else{
					that.$api.msg('模板名称不能为空!');
				}
				
			},
			//更新页面
			regionChange(e,name,index){
				this.formData.rule[index].region = e;
				this.formData.rule[index].deliverArea = name.toString();
			},
			// 输入
			openItem(fieldName,index) {
				let that = this;
				let field = that.field[fieldName];
				that.inputType = field.type || field[that.formData.payway-1].type;
				that.ptitle = field.name || field[that.formData.payway-1].name;
				that.maxlength = field.maxlength || '-1'
				if(that.inputType=='link'){
					let checkId={
						detail: {
							value: that.formData.rule[index].deliverArea.split(',')
						}
					};
					let regionData = that.getRegionData(index);
					uni.navigateTo({
					  url: field.linkUrls + '?index=' + index + '&regionData=' + encodeURIComponent(JSON.stringify(regionData))+ '&&checkId='+ encodeURIComponent(JSON.stringify(checkId))
					});
				}else{
					let value = index ==undefined ?that.formData[fieldName]:that.formData.rule[index][fieldName];
					that.$refs.popupInput._open(value, (val) => {
						if(index!=undefined){
							that.formData.rule[index][fieldName] = val
						}else{
							that.formData[fieldName] = val
						}
					})
				}
			},
			getRegionData(index){
				let regionData = this.regionData;
				let region = [];
				this.formData.rule.forEach((item,k)=>{
					let vals = [];
					if(index != k){
						vals = item.deliverArea.split(',');
					}
					region = region.concat(vals)
				});
				regionData = regionData.filter(item => {
					if(region.includes(item.name)){
						
					}else{
						return item
					}
				})
				return regionData
			},
			//计费方式
			payChange(e){
				this.formData.payway = e.detail.value;
				this.formData.rule.forEach(item => {
					item.first = '';
					item.next = '';
				})
			},
			//添加区域和运费
			addRule(){
				let item = {
					deliverArea: '',//可配送区域
					first:'',//首件/首重
					freight:'',//运费
					next:'',//续件/续重
					renew_pay:'',//续费
				};
				this.formData.rule.push(item)
			},
			//删除区域和运费
			delRule(index){
				this.formData.rule.splice(index,1)
			},
			//switch
			switchCange(e,fieldName) {
			  this.formData[fieldName] = e;
			},
			pageBack(v){
				// 返回上一页传递选中的分类
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.templChange){
					prevPage.$vm.templChange(v)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/pages/myGoods/coupon/detail.scss';
	.address{max-width: 300rpx;}
	.container{
		padding-top: 0;
		padding-bottom: 40rpx;
	}
	.container .listBox{
		margin-top: 20rpx;
		margin-bottom: 0;
	}
	.container .addbtn{
		line-height: 88rpx;
		text-align: center;
		color: $red;
		font-size: 24rpx;
		background-color: #fff;
	}
	.container .listBox .list .control .iconfont2{
		font-size: 28rpx;
	}
	.del-btn{
		margin-left: 20rpx;
	}
</style>
