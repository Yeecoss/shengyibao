<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="盘点单" isHelpme extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<!-- 快递公司 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">仓库</view>
					<view class="control dis-flex flex-y-center flex-x-between" @tap.stop="openItem('warehouse')">
						<view class="f-28" :class="formData.warehouse?'':'col-9'">{{formData.warehouse!=''?formData.warehouse.name:'默认仓库'}}</view>
						<view class="btn t-c">选择</view>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label f-30">盘点人</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<input class="f-28" :class="formData.store_user?'':'col-9'" type="text" v-model="formData.store_user.real_name" placeholder="请输入盘点人"/>
						<view class="btn t-c" @tap.stop="openItem('store_user')">选择</view>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label f-30">盘点日期</view>
					<view class="control t-r">
						<view class="f-28">{{formData.create_time?formData.create_time: '自动生成'}}</view>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="control flex1">
						<input class="col-9 f-28" type="text" maxlength="50" v-model="formData.remark" placeholder="备注（50字内）"/>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">盘点商品</view>
					<view class="control dis-flex flex-x-end" @tap.stop="openItem('pro_relate')">
						<view class="btn t-c pandian">{{formData.pro_relate!=''?'继续盘点':'去盘点'}}</view>
					</view>
				</view>
			</view>
			<template v-if="formData.pro_relate!=''">
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label f-30">盘点明细</view>
						<view class="control t-r">
							<view class="f-28">现数汇总:{{formData.finish_stock_num||0}}</view>
						</view>
						<view class="listLine"></view>
					</view>
					<view class="pro-list wrap30">
						<template v-for="(item,index) in formData.pro_relate">
							<view class="pro-item f-26 col-3" :key="index">
								<view class="pro-top dis-flex flex-y-center">
									<view class="pro-img"><image lazy-load :src="item.goods_image" mode="aspectFill"></image></view>
									<view class="pro-name m-l-10 flex-box onelist-hidden">{{item.goods_name}}</view>
									<view class="m-l-30">小计:{{item.finish_goods_num}}</view>
								</view>
								<template v-if="item.sku">
									<view class="attr-list f-24 col-3 m-top30" v-for="(vo,i) in item.sku" :key="i">
										<view class="fl">{{vo.goods_attr}}</view>
										<view class="fr t-r">
											<text class="col-9">原数量:</text>{{vo.origin_stock_num}}
											<text class="col-9 m-l-20">现数量:</text>{{vo.finish_stock_num}}
											<text class="col-9 m-l-20">增减:</text>
											<text class="money-val" :class="vo.change_num>0?'app-red':''">{{vo.change_num>0?'+'+vo.change_num:vo.change_num}}</text>
										</view>
									</view>
								</template>
								<view class="attr-list f-24 col-3 m-top30" v-else>
									<view class="fl">无规格</view>
									<view class="fr t-r">
										<text class="col-9">原数量:</text>{{item.origin_stock_num}}
										<text class="col-9 m-l-20">现数量:</text>{{item.finish_stock_num}}
											<text class="col-9 m-l-20">增减:</text>
											<text class="money-val" :class="item.change_num>0?'app-red':''">{{item.change_num>0?'+'+item.change_num:item.change_num}}</text>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			</template>
			<!-- 底部操作栏 -->
			<view class="operation-wrap" v-if="status!=2">
				<view class="operation wrap30 dis-flex flex-y-center flex-x-between bgf">
					<view class="oper-item bgred col-f f-28" @tap="toFinish">完成盘点</view>
					<view class="oper-item bg-oange col-f f-28" @tap="saveDraft">保存草稿</view>
				</view>
			</view>
		</view>
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			guidePage
		},
		data(){
			return{
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				check_id: '',
				status: 1,
				wxapp_goods:[],//关联商品传值
				formData: {
					warehouse: '',//仓库
					store_user: '',//盘点人
					create_time: '',//盘点日期
					pro_relate: '',//关联商品
					finish_stock_num:'',//现数汇总
					remark: '',
				},
				field: {
					pro_relate: {
						fieldName: 'pro_relate',
						type: 'link',
						linkUrl: '../selectProduct/list',
					},
					warehouse: {
						fieldName: 'warehouse',
						type: 'link',
						linkUrl: '/pages/retailShop/shopAbout/salesBilling/wareHouse/index',
					},
					store_user: {
						fieldName: 'store_user',
						type: 'link',
						linkUrl: '/pages/retailShop/shopAbout/salesBilling/salesPerson/index',
					},
				}
			}
		},
		onLoad(options) {
			if(options.id){
				this.check_id = options.id || '';
				this.getInfo()
			}
		},
		onShow() {
			
		},
		methods:{
			//获取详情
			getInfo(){
				app._get('shop.goods.stock_check/detail',{check_id:this.check_id}, res => {
					let info = res.data.stockCheck;
					this.formData = {
						warehouse : info.store_warehouse || '',
						store_user : info.store_user || '',
						create_time : info.create_time,
						pro_relate: info.stock_item||'',
						finish_stock_num: info.finish_stock_num,
						remark: info.remark || '',
					};
					this.status = info.status.value;
				});
			},
			// 保存草稿
			saveDraft(callback){
				this.getGoods(this.formData.pro_relate, () => {
					let data = {
						warehouse_id: this.formData.warehouse.warehouse_id||'',
						store_user_id: this.formData.store_user.store_user_id||'',
						remark: this.formData.remark,
						wxapp_goods: JSON.stringify(this.wxapp_goods)
					};
					if(this.check_id){
						data.check_id = this.check_id;
					}
					app._post_form('shop.goods.stock_check/add', data, res => {
						if(typeof callback === 'function'){
							callback(res.data.check_id);
						}else{
							this.$api.msg(res.msg,1000,true)
							setTimeout(()=>{uni.navigateBack()},1500)
						}
					})
				});
			},
			//完成盘点
			toFinish(){
				let that = this;
				that.mtitle = '提示';
				that.mcontent = '点击“完成盘点”后会实时更新商品库存数据，且不可修改已完成盘点单，请确认操作！';
				that.$refs.popupTip.open(() => {
					if(that.check_id!=''){
						app._post_form('shop.goods.stock_check/finish', {check_id: that.check_id}, res => {
							that.$api.msg(res.msg,1500,true)
							setTimeout(()=>{uni.navigateBack()},1500)
						})
					}else{
						that.saveDraft(id => {
							app._post_form('shop.goods.stock_check/finish', {check_id: id}, res => {
								that.$api.msg(res.msg, 1500, true)
								setTimeout(()=>{uni.navigateBack()},1500)
							})
						})
					}
				})
			},
			// 输入
			openItem(fieldName) {
				let that = this;
				let field = that.field[fieldName];
				let url = field.linkUrl;
				if(fieldName == 'pro_relate'){
					let checkList = this.formData.pro_relate;
					uni.setStorageSync('stockGoods', checkList);
				}
				uni.navigateTo({
					url: url
				});
			},
			//关联商品
			proCheck(data){
				let datas = JSON.parse(data);
				this.$nextTick(() => {
					this.formData.pro_relate = datas.goods;
					this.formData.finish_stock_num = datas.finish_stock_num;
				})
				// let list = this.formData.pro_relate!=''?this.formData.pro_relate.concat(data):data;
				// this.initProData(list);
			},
			//仓库
			checkWareHouse(data){
				this.formData.warehouse = data;
			},
			//盘点人
			checkSalesPerson(data){
				this.formData.store_user = data;
			},
			// 初始化相关商品
			initProData(list){
				for (let i in list) {
					
					if(list[i].goods.spec_type==20){
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						let nocheck = 0;
						for (let i2 in spec_list) {
							if(spec_list[i2].goods_num<0 ||spec_list[i2].goods_num>0){
							}else{
								nocheck++
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
						if(list[i].checked_num<0 ||list[i].checked_num>0){
						}else{
							list.splice(i,1);
						}
					}
				}
				this.formData.pro_relate = list;
			},
			// 格式选中相关商品
			getGoods(list,callback){
				let goods_list = [];
				for (let i in list) {
					let goods = {};
					goods.goods_id = list[i].goods_id;
					goods.wxapp_goods_id = list[i].wxapp_goods_id;
					
					if(list[i].sku){
						goods.sku = [];//选中的规格id列表
						let spec_list = list[i].sku;
						
						for (let i2 in spec_list) {
							let item_spec = {};
							item_spec.spec_sku_id = spec_list[i2].spec_sku_id;
							item_spec.goods_sku_id = spec_list[i2].goods_sku_id;
							item_spec.change_num = spec_list[i2].change_num;
							goods.sku.push(item_spec);
						}
					}else{
						goods.change_num = list[i].change_num;
						goods.goods_sku_id = list[i].goods_sku_id;
					}
					goods_list.push(goods);
				}
				this.wxapp_goods = goods_list;
				typeof callback === 'function' &&callback();
			},
		},
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'add';
</style>
