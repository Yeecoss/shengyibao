<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="打印机" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">功能</view>
					<picker class="control dis-flex flex-y-center flex-x-end" :value="formData['brand_index']" :range="field['brand'].selectList" @change.stop="pickerChange">
						<text :class="formData.brand == '' ?'col-9':''">
							{{formData.brand_index === '' ? field['brand'].tip : field['brand'].selectList[formData.brand_index]}}
						</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</picker>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">打印份数</view>
					<picker class="control dis-flex flex-y-center flex-x-end" :value="formData['timesIndex']" :range="field['times'].selectList" @change.stop="timesChange">
						<text :class="formData.timesIndex === '' ?'col-9':''">
							{{formData.timesIndex === '' ? field['times'].tip : field['times'].selectList[formData.timesIndex]+'份'}}
						</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</picker>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30 width240">排序</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<input class="f-28 t-r flex-box" :class="formData.sorting!==''?'':'col-9'" type="text" v-model="formData.sorting" placeholder="请输入序号"/>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">是否开启</view>
					<view class="control dis-flex flex-x-end">
						<cust-switch ref="switch" :checked="formData.is_active" @change="switchCange($event,'is_active')"></cust-switch>
					</view>
				</view>
			</view>
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
				printer_id: '',//打印机id
				func_id: '',//功能id
				info: '',
				
				
				// name: '',//名称
				formData: {
					brand: {},
					brand_index: 0,
					times: '',//打印次数
					timesIndex: 0,
					sorting: '100',
					is_active: false,
				},
				field: {
					brand: {
						label: '功能',
						tip: '选择功能',
						fieldName: 'brand',
						selectList:[],
						selectListId: [],
					},
					times: {
						label: '打印份数',
						tip: '选择份数',
						fieldName: 'times',
						selectList:[1,2,3,4,5],
						selectListId: [1,2,3,4,5],
					},
				},
			}
		},
		onLoad(options) {
			this.printer_id = options.printer_id || '';
			if(options.func_id){
				this.func_id = options.func_id || '';
				this.getInfo()
			}
			this.getSettingList()
		},
		onShow() {
		},
		methods: {
			getInfo(){
				app._get('setting.printer/moduleDetail',{id: this.func_id},res => {
					let info = res.data.module;
					this.info = info;
					this.formData.sort = info.sort;
					this.formData.is_active = info.is_active? true: false;
				});
			},
			//添加
			toSubmit(){
				let data = Object.assign({}, this.formData.brand);
				data.sort = this.formData.sorting;
				data.printer_times = this.field['times'].selectListId[this.formData.timesIndex];
				data.is_active = this.formData.is_active? 1: 0;
				data.printer_id = this.printer_id;
				if(this.func_id!=''){
					data.id = this.func_id;
				}
				
				//校验
				let isSure = true;
				if(data.sort==''){
					isSure = false;
				}
				if(isSure == false){
					this.$api.msg('配置不能为空！')
					return false
				}
				// end
				let url = this.func_id!=''? 'setting.printer/editModule': 'setting.printer/addModule';
				app._post_form(url, data, res => {
					this.$api.msg(res.msg, 1500, true)
					setTimeout(()=>{uni.navigateBack()},1500)
				});
			},
			//配置数据
			getSettingList(){
				app._get('setting.printer/getModuleConfig',{},res => {
					let list = res.data;
						this.getBrandList(res.data)
					if(this.info!=''){
						let module = this.info.module||'';
						for (let i in list) {
							if(list[i].value == module.value){
								this.pickerChange({target:{value: i}})
							}
						}
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
			
			// 选择类型赋值 /打印机品牌
			pickerChange(e) {
			  let val = e.target.value
				this.formData.brand_index = val;
				this.getBrandVal(val)
			},
			timesChange(e) {
			  let val = e.target.value
				this.formData.timesIndex = val;
			},
			//打印机品牌data
			getBrandVal(index){
				let brand = this.field['brand'].selectListId[index];
				this.formData.brand = brand;
			},
			//switch
			switchCange(e,fieldName) {
			  this.formData[fieldName] = e;
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
