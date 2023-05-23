<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar :title="navtitle" extClass="nav" id="top"></navigationBar>
		
		<view class="main container">
			<!-- 快递公司 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-28">{{express_name.label}}</view>
					<picker class="control" @change="pickerChange($event, express_name)" :value="formData['express_name']" :range="express_name.selectList">
							<view class="uni-input onelist-hidden fr">
								<text v-if="formData['express_name']">{{formData['express_name']}}</text>
								<text class="col-9" v-else>{{express_name.tip}}</text>
								<text class="iconfont2 icon-gengduobeifen2"></text>
							</view>
					</picker>
				</view>
			</view>
			<!-- 业务类型 -->
			<view class="listBox bgf" style="margin-bottom: 0;">
				<view class="list dis-flex">
					<view class="label f-28">{{exp_name.label}}</view>
					<view class="control text-right" v-if="formData.express_name==''" @tap="toTip">
						<text class="col-9">{{exp_name.tip}}</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
					<picker v-else class="control" @change="pickerChange($event, exp_name)" :value="formData['exp_name']" :range="exp_name.selectList">
							<view class="uni-input onelist-hidden fr">
								<text v-if="formData['exp_name']">{{formData['exp_name']}}</text>
								<text class="col-9" v-else>{{exp_name.tip}}</text>
								<text class="iconfont2 icon-gengduobeifen2"></text>
							</view>
					</picker>
				</view>
			</view>
			<fieldList ref="fieldList" :formData="formData" :fieldList="field" :isSubmit="false" :butDisabled="false" maxlength="20" :showLine="true" @change="change"></fieldList>
			
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import fieldList from "@/components/field-list/index.vue";
	export default {
		components: {
			fieldList,
		},
		data() {
			return {
				navtitle: '添加网点账号',
				index: 1,//提示框
				type: 1,//默认新增
				company:'',//物流信息
				formData: {
					ext_params: true,
					express_name: '',//物流公司名称
					express_id:  '',//物流公司代码
					exp_name: '',//快递业务名称
					exp_type: '',//快递业务
					customer_name: '',//账号名称
					customer_pwd: '',//账号密码
					month_code: '',//月结号
					send_site: '',//网点名称
					send_staff: '',//快递员
					pay_type: '',//运费支付方式
					pay_type_name: '',//运费支付名称
				},
				express_name: {
						type: 'select',
						label: '快递公司',
						tip: '选择快递公司',
						fieldName: 'express_name',
						selectList: [],
						selectListId: [],
				},
				exp_name: {
						type: 'select',
						label:'业务类型',
						tip: '选择业务类型',
						fieldName: 'exp_name',
						selectList: [],
						selectListId: [],
				},
				// 字段
				field:[{
						group: '1',
						fieldList: [{
								type: 'select',
								label:'支付方式',
								tip: '选择支付方式',
								fieldName: 'pay_type_name',
								selectList: ['现付','到付','月结','第三方付',],
								selectListId: ['1','2','3','4',],
							},],
					},{
						group: '1',
						fieldList: [{
								type: 'text',
								label:'网点名称',
								tip: '请输入网点名称',
								fieldName: 'send_site',
							},{
								type: 'text',
								label:'账号名称',
								tip: '请输入账号名称',
								fieldName: 'customer_name',
							},{
								type: 'text',
								label:'账号密码',
								tip: '请输入账号密码',
								fieldName: 'customer_pwd',
							},{
								type: 'text',
								label:'月结号',
								tip: '请输入月结号',
								fieldName: 'month_code',
							},{
								type: 'text',
								label:'收件快递员',
								tip: '请输入快递员名称',
								fieldName: 'send_staff',
							},],
					},],
				
			}
		},
		onLoad(options) {
			let that = this;
			// that.navtitle = options.type==2?'编辑网点账号': '添加网点账号';
			// that.type = options.type?options.type:that.type;
			// that.customer_id = options.id;
			that.getInfo();
		},
		methods: {
			//获取物流公司信息
			getInfo(id){
				app._get('shop.express.customer/add',{}, res => {
					this.company = res.data.company;
					let data = res.data.company;
					let selectList = [], selectListId = [];
					for (let i = 0; i<data.length; i++) {
						selectList.push(data[i].express_name);
						selectListId.push(data[i].express_id);
					}
					this.express_name.selectList = selectList;
					this.express_name.selectListId = selectListId;
				});
			},
			// 提交
			toSubmit(){
				let that = this;
				let issub = false;
				for (let key in that.formData) {
					if(that.formData[key]===''){
						that.$api.msg('信息不全!');
						return false
					}
				}
				app._post_form('shop.express.customer/add', this.formData, res => {
					that.$api.msg(res.msg);
					if(res.code==1){
						setTimeout(() => {uni.navigateBack()},1500)
					}
				});
			},
			// 输入
			change(e,val) {
				this.formData[e] = val;
				if(e=='pay_type_name'){
					val = this.field[0].fieldList[0].selectListId[val];
					this.formData.pay_type = val;
				}
			},
			// 选择类型赋值
			pickerChange(e, item) {
			  let val = e.target.value;
				
				if(item.fieldName=='express_name'){
					let data = this.company[val].expType;
					let selectList = [], selectListId = [];
					for (let i = 0; i<data.length; i++) {
						selectList.push(data[i].value);
						selectListId.push(data[i].key);
					}
					this.exp_name.selectList = selectList;
					this.exp_name.selectListId = selectListId;
				}
				let val1 = item.selectList[val];
				let val2 = item.selectListId[val];
				this.formData[item.fieldName] = val1;
				if(item.fieldName=='express_name'){
					this.formData['express_id'] = val2;
				}else{
					this.formData['exp_type'] = val2;
				}
			},
			toTip(){
				this.$api.msg('请先选择快递公司!');
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	.address{max-width: 300rpx;}
</style>
