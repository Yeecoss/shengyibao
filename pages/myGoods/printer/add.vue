<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="打印机" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">打印机名称</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<input class="f-28 t-r flex-box" :class="name?'':'col-9'" type="text" v-model="name" requried placeholder="请输入名称"/>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">打印机类型</view>
					<radio-group @change="radioChange" class="control dis-flex">
						<label v-for="(item,index) in setting" :key="index" class="radio-item dis-flex flex-y-center labelBox">
							<radio class="radioItem" color="#FF7541" :id="index+''" :value="index+''" :checked="type==index"></radio>
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="listBox bgf" v-if="childList!=''">
				<view class="list dis-flex">
					<view class="label f-30">打印机品牌</view>
					<picker class="control dis-flex flex-y-center flex-x-end" :value="formData['brand_index']" :range="field['brand'].selectList" @change.stop="pickerChange">
						<text :class="formData.brand == '' ?'col-9':''">
							{{formData.brand_index === '' ? field['brand'].tip : field['brand'].selectList[formData.brand_index]}}
						</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</picker>
				</view>
			</view>
			<template v-for="(item, index) in formData.data">
				<view class="listBox bgf" :key="index">
					<view class="list dis-flex">
						<view class="label f-30 width240">{{item.name}}</view>
						<view class="control dis-flex flex-y-center flex-x-between">
							<input class="f-28 t-r flex-box" :class="item.name?'':'col-9'" type="text" v-model="item.value" :placeholder="'请输入'+item.name"/>
						</view>
					</view>
				</view>
			</template>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30 width240">排序</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<input class="f-28 t-r flex-box" :class="formData.sorting!==''?'':'col-9'" type="text" v-model="formData.sorting" placeholder="请输入序号"/>
					</view>
				</view>
			</view>
			<!-- <view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">是否开启</view>
					<view class="control dis-flex flex-x-end">
						<cust-switch ref="switch" checked="" @change="switchCange()"></cust-switch>
					</view>
				</view>
			</view> -->
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30">
					<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
				</view>
			</view>
		</view>
		<!-- 提示框 -->
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import custSwitch from '@/components/cust-switch/index.vue';
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			custSwitch,
			popupTips
		},
		data() {
			return {
				index: 1,//提示框
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				printer_id: '',//id
				info: '',
				
				setting:[],//数据
				childList: [],
				
				type: 0,//类型
				name: '',//名称
				formData: {
					brand: {},
					brand_index: 0,
					data:[{name:'',value:''}],
					sorting: '100',
				},
				field: {
					brand: {
						label: '打印机品牌',
						tip: '选择打印机品牌',
						fieldName: 'brand',
						selectList:[],
						selectListId: [],
					},
				},
			}
		},
		onLoad(options) {
			if(options.printer_id){
				this.printer_id = options.printer_id || '';
				this.getInfo()
			}else{
				this.getSettingList()
			}
			
			this.$nextTick(() =>{
			})
		},
		onShow() {
		},
		methods: {
			getInfo(){
				app._get('setting.printer/detail',{printer_id: this.printer_id},res => {
					let info = res.data.printer;
					this.info = info;
					this.name = info.printer_name;
					this.formData.sort = info.sort;
					this.getSettingList()
				});
			},
			//添加
			toSubmit(){
				let features = this.getTypeVal();
				let data = Object.assign({}, features, this.formData.brand);
				data.printer_name = this.name;
				data.sort = this.formData.sorting;
				if(this.printer_id!=''){
					data.printer_id = this.printer_id;
				}
				
				//校验
				let isSure = true;
				if(data.printer_name==''||data.sort==''){
					isSure = false;
				}
				if(this.childList!=''){
					let printer_config = this.getConfigVal();
					for (let k in printer_config) {
						if(printer_config[k] == ''){
							isSure = false;
						}else{
							data.printer_config = JSON.stringify(printer_config);
						}
					}
				}
				if(isSure == false){
					this.$api.msg('配置不能为空！')
					return false
				}
				// end
				let url = this.printer_id!=''? 'setting.printer/edit': 'setting.printer/add';
				app._post_form(url, data, res => {
					this.$api.msg(res.msg, 1500, true)
					setTimeout(()=>{uni.navigateBack()},1500)
				});
			},
			//配置数据
			getSettingList(){
				app._get('setting.printer/getPrinterConfig',{},res => {
					this.setting = res.data;
					this.childList = res.data[this.type].child || [];
					if(this.info!=''){
						let features = this.info.features||'';
						if(features!=''){
							res.data.forEach((item, index) => {
								if(item.value == features.value){
									this.radioChange({detail:{value: index}})
								}
							});
						}
					}else{
						this.radioChange()
					}
				});
			},
			//打印机品牌类型
			getBrandList(list){
				let selectList = [],selectListId = [];
				for (let i in list) {
					selectList.push(list[i].name)
					let obj = {};
					obj[list[i].key] = list[i].value
					selectListId.push(obj)
				}
				this.field['brand'].selectList = selectList;
				this.field['brand'].selectListId = selectListId;
				if(JSON.stringify(this.formData.brand) == "{}"){
					this.formData.brand_index = 0;
					this.getBrandVal(0);
				}else{
					this.getBrandVal(this.formData.brand_index);
				}
			},
			//打印机类型
			radioChange(e){
				if(e){
					this.type = e.detail.value;
					this.childList = this.setting[this.type].child || [];
				}
				
				if(this.childList!=''){
					this.getBrandList(this.childList)
				}else{
					this.formData.data = [];
				}
			},	
			// 选择类型赋值 /打印机品牌
			pickerChange(e) {
			  let val = e.target.value
				this.formData.brand_index = val;
				this.getBrandVal(val)
			},
			//打印机品牌data
			getBrandVal(index){
				let brand = this.field['brand'].selectListId[index];
				this.formData.brand = brand;
				if(this.info!=''&& this.printer_id!=''){
					let data = this.childList[index].child || [];
					let printer_config = this.info.printer_config||'';
					if(printer_config!=''){
						for (let i in printer_config) {
							data.forEach((item, index) => {
								if(item.key == i){
									item.value = printer_config[i]
								}
							});
						}
					}
					this.formData.data = data;
				}else{
					this.formData.data = this.childList[index].child || [];
				}
			},
			//打印机类型data
			getTypeVal(){
				let setting = this.setting[this.type];
				let typeVal = {};
				for (let k in setting) {
					let key = '',val = '';
					if(k = 'key'){
						key = setting[k];
					}
					if(k = 'value'){
						val = setting[k];
					}
					typeVal[key] = val
				}
				return typeVal
			},
			//打印机配置data
			getConfigVal(){
				let list = this.formData.data;
				let data = {};
				if(list != []){
					for (let k in list) {
						let obj = {};
						obj[list[k].key] = list[k].value || '';
						data = Object.assign(data, obj)
					}
				}
				return data
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	view,text{
		box-sizing: border-box;
	}
	.width240{
		white-space: nowrap;
	}
</style>
