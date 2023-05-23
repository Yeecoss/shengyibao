<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar :title="navtitle" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox" style="background:white">
				<!-- 优惠券名称 -->
				<view class="list dis-flex">
					<view class="label width240">优惠券名称</view>
					<view class="control" @tap.stop="openItem('coupon_title')">
						<text :class="formData.coupon_title? '': 'col-9'">{{formData.coupon_title ? formData.coupon_title : field.coupon_title.name}}</text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>例如：满100减10</view>
				<view class="list dis-flex">
					<view class="label">优惠券类型</view>
					<radio-group @change="typeChange" class="control dis-flex">
							<label v-for="(item,index) in typeItems" class="radio-item dis-flex flex-y-center labelBox" :key="index">
								<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value" :checked="item.checked"></radio>
								<text class="col-6">{{item.name}}</text>
							</label>
					</radio-group>
				</view>
			</view>
			
			<view class="listBox" style="background:white">
				<view class="list dis-flex" v-if="formData.coupon_type==1">
					<view class="label width240">减免金额</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('red_money')">
						<view :class="formData.red_money?'':'col-9'">{{formData.red_money?formData.red_money:field.red_money.name}}</view><text>元</text>
					</view>
				</view>
				<view class="list dis-flex" v-else>
					<view class="label width240">折扣率</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('discount')">
						<view :class="formData.discount?'':'col-9'">{{formData.discount?formData.discount:field.discount.name}}</view>
					</view>
				</view>
				<view class="notes f-24 col-9" v-if="formData.coupon_type==2">
					<text class="iconfont2 icon-jingshi f-24"></text>折扣率范围0-10，9.5代表9.5折，0代表不折扣
				</view>
				<view class="list dis-flex">
					<view class="label width240">最低消费金额</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('min_spend')">
						<view :class="formData.min_spend?'':'col-9'">{{formData.min_spend?formData.min_spend:field.min_spend.name}}</view><text>元</text>
					</view>
				</view>
			</view>
			
			<view class="listBox" style="background:white">
				<view class="list dis-flex">
					<view class="label">到期类型</view>
					<radio-group @change="expireChange" class="control dis-flex">
							<label v-for="(item,index) in expireItems" class="radio-item dis-flex flex-y-center labelBox" :key="index">
								<radio class="radioItem" color="#FF7541" :id="item.value" :value="item.value" :checked="item.checked"></radio>
								<text class="col-6">{{item.name}}</text>
							</label>
					</radio-group>
				</view>
			</view>
			
			<view class="listBox" style="background:white">
				<view class="list dis-flex" v-if="formData.expire_type==1">
					<view class="label width240">有效天数</view>
					<view class="control" @tap.stop="openItem('expire_day')">
						<text :class="formData.expire_day?'':'col-9'">{{formData.expire_day?formData.expire_day:field.expire_day.name}}</text>
					</view>
				</view>
				<view class="list dis-flex" v-if="formData.expire_type==2">
					<view class="label width240">开始时间</view>
					<view class="control" @tap="dateChange(formData.expire_start,'expire_start')">
						<text :class="formData.expire_start?'':'col-9'">{{formData.expire_start != '' ? formData.expire_start : '请选择开始时间'}}</text>
					</view>
				</view>
				<view class="list dis-flex" v-if="formData.expire_type==2">
					<view class="label width240">结束时间</view>
					<view class="control" @tap="dateChange(formData.expire_end,'expire_end')">
						<text :class="formData.expire_end?'':'col-9'">{{formData.expire_end != '' ? formData.expire_end : '请选择结束时间'}}</text>
					</view>
				</view>
			</view>
			
			<view class="listBox" style="background:white">
				<view class="list dis-flex">
					<view class="label width240">发送总数量</view>
					<view class="control" @tap.stop="openItem('total_num')">
						<text :class="formData.total_num?'':'col-9'">{{formData.total_num?formData.total_num:field.total_num.name}}</text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>限制领取的优惠券数量，-1为不限制</view>
			</view>
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30">
					<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<tui-datetime ref="dateTime" :type="2" cancelColor="#999" color="#333"
		 :setDateTime="setDateTime" @confirm="change"></tui-datetime>
		 
		<popup-input :title="title" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	export default {
		components: {
			popupInput,
		},
		data() {
			return {
				navtitle: '',//头部标题
				index: 1,//提示框
				type: 1,//页面类型1-新增2-编辑
				title: '',//弹窗输入标题
				maxlength: '-1',
				inputType: '',
				coupon_id: '',//id
				setDateTime:'',//初始日期
				timeCurrent:'',
				formData: {
					coupon_title: '',//优惠券名称
					coupon_type: 1,//优惠券类型
					red_money: '',//减免金额
					discount: '',//折扣率
					min_spend: '',//最低消费金额
					expire_type: 1,//到期类型
					expire_day: '',//有效天数
					expire_start: '',//开始时间
					expire_end: '',//结束时间
					total_num: '',//发送总数量
				},
				// 字段
				field: {
				  coupon_title:  {
				    type: 'text',
				    name: '请输入优惠券名称',
				    fieldName: 'coupon_title',
				    maxlength: '20'
				  },
				  // 减免金额
				  red_money: {
				    type: 'digit',
				    name: '请输入减免金额',
				    fieldName: 'red_money',
				    maxlength: '9'
				  },
					// 折扣率
				  discount:  {
				    type: 'digit',
				    name: '请输入折扣率',
				    fieldName: 'discount',
				    maxlength: '-1'
				  },
				  // 最低消费金额
				  min_spend: {
				    type: 'digit',
				    name: '请输入最低消费金额',
				    fieldName: 'min_spend',
				    maxlength: '9'
				  },
				  // 有效天数
				  expire_day: {
				    type: 'number',
				    name: '请输入有效天数',
				    fieldName: 'expire_day',
				    maxlength: '10'
				  },
				  // 发送总数量
				  total_num: {
				    type: 'number',
				    name: '请输入发放总数',
				    fieldName: 'total_num',
				    maxlength: '-1'
				  },
				},
				// 优惠券类型
				typeItems: [{
				  name: '减满券',
				  checked: true,
				  value: '1'
				}, {
				  name: '折扣券',
				  checked: false,
				  value: '2'
				}],
				// 到期类型
				expireItems: [{
				  name: '领取后生效',
				  checked: true,
				  value: '1'
				}, {
				  name: '固定时间',
				  checked: false,
				  value: '2'
				}],
			}
		},
		onLoad(options) {
			let that = this;
			that.navtitle = options.type==2?'编辑优惠券': '新增优惠券';
			that.type = options.type?options.type:that.type;
			if(options.type==2){
				that.coupon_id = options.coupon_id;
				that.getInfo(options.coupon_id);
			}
		},
		methods: {
			// 获取优惠券信息
			getInfo(id){
				let that = this;
				app._get('shop.coupon/edit',{coupon_id: id}, res => {
					let data = res.data.coupon;
					that.formData.coupon_title = data.name;
					that.formData.min_spend = data.min_price;
					that.formData.coupon_type = data.coupon_type.value == 10? 1: 2;
					that.formData.expire_type = data.expire_type == 10? 1: 2;
					that.formData.total_num = data.total_num;
					if(data.coupon_type.value == 10){
						that.formData.red_money = data.reduce_price;
					}else{
						that.formData.discount = data.discount;
						that.typeItems.map(item => {
							item.checked = !item.checked;
						})
						that.typeItems[that.formData.coupon_type-1].checked = true;
					}
					if(data.expire_type == 10){
						that.formData.expire_day = data.expire_day;
					}else{
						that.formData.expire_start = data.start_time.text;
						that.formData.expire_end = data.end_time.text;
						that.expireItems.map(item => {
							item.checked = !item.checked;
						})
						that.expireItems[that.formData.expire_type-1].checked = true;
					}
				});
				
			},
			// 提交
			toSubmit(){
				let that = this;
				let formData = that.formData;
				let coupon_type = formData.coupon_type==1? 10 : 20;
				let expire_type = formData.expire_type==1? 10 : 20;
				
				let url = that.type == 2?'shop.coupon/edit':'shop.coupon/add',
						data = {
							name: formData.coupon_title,
							coupon_type: coupon_type,
							min_price: formData.min_spend,
							expire_type: expire_type,
							total_num: formData.total_num,
						};
						if(that.type == 2){data.coupon_id = that.coupon_id}
						if(coupon_type==10){
							data.reduce_price = formData.red_money;
						}else{
							data.discount = formData.discount;
						}
						if(expire_type==10){
							data.expire_day = formData.expire_day;
						}else{
							data.start_time = formData.expire_start;
							data.end_time = formData.expire_end;
						}
				for (let key in data) {
					if(data[key]==''){
						that.$api.msg('内容不能为空!');
						return false;
					}
				}
				app._post_form(url, data, res => {
					that.$api.msg(res.msg);
					if(res.code==1){
						setTimeout(()=>{that.pageBack(true)},1000)
					}
				});
			},
			pageBack(v){
				// 返回上一页传递选中的分类
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.couplChange){
					prevPage.$vm.couplChange(v)
				}
				uni.navigateBack();
			},
			// 输入
			openItem(fieldName) {
				let field = this.field[fieldName]
				this.inputType = field.type
				this.title = field.name
				this.maxlength = field.maxlength || '-1'
				this.$refs.popupInput._open(this.formData[fieldName], (val) => {
					this.formData[fieldName] = val
				})
			},
			// 优惠券类型切换
			typeChange(e){
				this.formData.coupon_type = e.detail.value;
			},
			// 到期类型
			expireChange(e){
				this.formData.expire_type = e.detail.value;
			},
			// 开始时间
			// dateChange(e,fieldName){
			// 	this.formData[fieldName] = e.target.value;
			// },
			dateChange(e,text){
				this.setDateTime = e;
				this.timeCurrent = text;
				this.$refs.dateTime.show();
			},
			change(e) {
				this.formData[this.timeCurrent] = e.result;
				// this.result = e.result;
			},
		}
	}
</script>

<style lang="scss">
	@import 'detail.scss';
</style>
