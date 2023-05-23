<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="满额包邮" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox" style="background:white">
				<view class="list dis-flex">
					<view class="label">单笔订单满</view>
					<view class="control dis-flex flex-x-between flex-y-center" @tap.stop="openItem('full_money')">
						<view :class="formData.full_money?'':'col-9'">{{formData.full_money?formData.full_money:'请输入金额'}}</view>
						<text class="col-9">元</text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>如果开启满额包邮，设置0为全场包邮</view>
				<view class="list dis-flex">
					<view class="label">不参与包邮商品</view>
					<view class="control text_align_r" @tap.stop="openItem('relate_pro')">
						<template v-if="formData.relate_pro">已选<text class="red">{{formData.relate_pro.length}}</text>(件)</template>
						<text v-else class="col-9">选择商品</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<!-- 关联商品 -->
				<view class="wrap30 related-pros" v-if="formData.relate_pro.length">
					<view class="related-item dis-flex" v-for="(item, index) in formData.relate_pro" :key="index" @tap="showSpecs(item, index)">
						<view class="del-pro dis-flex flex-y-center m-r-20" @tap.stop="delPro(index)"><text class="iconfont2 icon-subtract"></text></view>
						<view class="related-pic"><image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image></view>
						<view class="related-info oh flex-box">
							<view class="f-28 onelist-hidden">{{item.goods.goods_name}}</view>
						</view>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label">不参与包邮地区</view>
					<view class="control text_align_r dis-flex flex-y-center flex-x-end" @tap.stop="openItem('free_area')">
						<view v-if="formData.free_area" class="address onelist-hidden">{{formData.free_area}}</view>
						<text v-else class="col-9">选择地区</text>
						<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label width240">是否开启满额包邮</view>
					<view class="control dis-flex flex-x-end flex-y-center">
						<cust-switch ref="switch" :checked="formData.ifFree" @change="switchCange($event,'ifFree')"></cust-switch>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
		
		<popup-input :title="title" :inputType="inputType" :maxlength="maxlength" ref="popupInput"></popup-input>
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
				title: '',//弹窗输入标题
				index: 1,//提示框
				maxlength: '-1',
				inputType: '',
				values:'',//内容
				regionData: [],//包邮地区
				formData: {
					full_money: '',//单笔订单金额
					relate_pro:[],//不参与包邮商品
					province: [],//不参与包邮地区省份id
					free_area: '',//不参与包邮地区省份名称
					ifFree: false,//是否开启满额包邮
				},
				// 字段
				field: {
				  full_money:  {
				    type: 'digit',
				    name: '请输入金额',
				    fieldName: 'full_money',
						maxlength: '9'
				  },
					relate_pro: {
				    type: 'link',
				    name: '请输入金额',
				    fieldName: 'relate_pro',
						linkUrls: '/pages/optimization/extend/relatePro/index',
					},
					free_area: {
				    type: 'link',
				    name: '选择地区',
				    fieldName: 'free_area',
						linkUrls: '/pages/myGoods/freight/address',
					},
				},
			}
		},
		onLoad() {
			let that = this;
			that.getInfo();
		},
		methods: {
			//获取页面信息
			getInfo(){
				let that = this;
				app._get('shop.setting/full_free',{}, res => {
					that.$nextTick(function(){
						that.values =  res.data.values;
						that.regionData = res.data.regionData;
						// that.formData.relate_pro = res.data.values.notin_goods;	
						that.formData.relate_pro = res.data.goodsList.data;	
						that.formData.full_money = res.data.values.money;
						that.formData.ifFree = res.data.values.is_open==1? true: false;
						if(res.data.values.is_open==1){that.$refs.switch.checkedItem();}
						that.formData.province = res.data.values.notin_region.province;
						let area = that.initData(res.data.values.notin_region.province,res.data.regionData);
						that.formData.free_area = area.toString();
					})
				})
			},
			initData(province,regionData){
				let area = [];
				province.forEach(item => {
					regionData.forEach(item1 => {
						if(item == item1.id){
							area.push(item1.name);
						}
					});
				});
				return area;
			},
			// 提交
			toSubmit(){
				let that = this;
				let formData = that.formData;
				if(formData.full_money!=''){
					let notin_region = {};notin_region.province = that.formData.province;
					let data = {
						is_open: formData.ifFree ? 1 : 0,
						money: formData.full_money,
					};
					if(formData.relate_pro){
						// data.notin_goods = formData.relate_pro.toString()
						data.notin_goods = that.getGoods(formData.relate_pro).toString()
					}
					data.notin_region = JSON.stringify(notin_region);
					app._post_form('shop.setting/full_free',data,res =>{
						that.$api.msg(res.msg);
						setTimeout(() => {
							uni.navigateBack()
						},1000)
					})
				}else{
					that.$api.msg('请填写订单金额!');
				}
			},
			getGoods(relate_pro){
				let goodIds = [];
				for (let i in relate_pro) {
					goodIds.push(relate_pro[i].wxapp_goods_id)
				}
				return goodIds
			},
			// 输入
			openItem(fieldName) {
				let that = this;
				let field = that.field[fieldName];
				that.inputType = field.type;
				that.title = field.name;
				if(that.inputType=='link'){
					let checkId={
						detail: {
							value: that.formData.free_area.split(',')
						}
					};
					uni.navigateTo({
					  url: field.linkUrls + '?regionData=' + encodeURIComponent(JSON.stringify(that.regionData)) + '&&checkId='+ encodeURIComponent(JSON.stringify(checkId))
					});
				}else{
					that.maxlength = field.maxlength || '-1'
					that.$refs.popupInput._open(this.formData[fieldName], (val) => {
						that.formData[fieldName] = val
					})
				}
			},
			//删除关联商品
			delPro(index){
				this.formData.relate_pro.splice(index, 1)
			},
			//switch
			switchCange(e,fieldName) {
			  this.formData[fieldName] = e;
				// this.formData.full_money = (e == true ? '0' : '');
			},
			//更新页面
			regionChange(e,name){
				this.formData.province = e;
				this.formData.free_area = name.toString();
			},
			proCheck(data){
				this.formData.relate_pro = data;
			},
			
		}
	}
</script>

<style lang="scss">
	@import '../coupon/detail.scss';
	page{
		background-color: #F7F7F7;
	}
	.text_align_r{text-align: right;}
	.address{max-width: 300rpx;}
	.red{color: $red;}
	// 关联商品
	.related-pros{
		padding-top: 10rpx;
		padding-bottom: 20rpx;
		border-top: 1rpx solid #eee;
	}
	.related-item{margin-top: 20rpx;}
	.del-pro text{
		display: block;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 24rpx;
		text-align: center;
		border: 2rpx solid #999;
		color: #999;
		border-radius: 50%;
		overflow: hidden;
	}
	.related-pic{
		width: 96rpx;
		height: 96rpx;
		margin-right: 10rpx;
		background:#D8D8D8;
		border-radius: 4rpx;
		overflow: hidden;
	}
</style>
