<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar :title="title" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<view class="listBox bgf">
				
				<!-- 砍价商品 -->
				<view class="list dis-flex" @tap="bindGoods">
					<view class="wxapp-goods dis-flex" v-if="wxapp_goods">
						<view class="wxapp-goods-pic oh m-r-20">
							<image :src="wxapp_goods.goods_image" mode="aspectFill"></image>
						</view>
						<view class="wxapp-goods-txt flex-box f-28" v-if="type==1">
							<view class="wxapp_goods_name twolist-hidden">{{wxapp_goods.goods_name}}</view>
							<view class="wxapp_goods_price app-red m-top30">{{wxapp_goods.goods_price>0?'¥'+wxapp_goods.goods_price:''}}</view>
						</view>
					</view>
					<view class="relation-btn dis-flex flex-dir-column flex-y-center flex-x-center" v-else>
						<text class="iconfont2 icon-upload f-34"></text>
						<view class="f-24 m-t-20">选择商品</view>
					</view>
					<view class="control t-r change-goods" v-if="wxapp_goods&&type==0">
						<text class="col-6 f-28">换商品</text>
						<text class="iconfont2 icon-gengduobeifen2 f-28"></text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：砍价活动仅支持单规格商品 或 同价的多规格商品</view>
				
				<view class="list dis-flex">
					<view class="label">开始时间</view>
					<view class="control t-r" @tap="dateChange(formData.start_time,'start_time')">
						<text :class="formData.start_time?'':'col-9'">{{formData.start_time != '' ? formData.start_time : '选择时间'}}</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">结束时间</view>
					<view class="control t-r" @tap="dateChange(formData.end_time,'end_time')">
						<text :class="formData.end_time?'':'col-9'">{{formData.end_time != '' ? formData.end_time : '选择时间'}}</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：砍价活动的开始时间与截止时间</view>
				
				<view class="list dis-flex">
					<view class="label">砍价有效期</view>
					<view class="control">
						<input class="col-3 f-28" type="number" v-model="formData.expiryt_time"/>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：自用户发起砍价到砍价截止的时间，单位：小时</view>
				<view class="list dis-flex">
					<view class="label">砍价底价</view>
					<view class="control">
						<input class="col-3 f-28" type="digit" v-model="formData.floor_price" placeholder="请输入砍价低价"/>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：砍价商品的最低价格，单位：元</view>
				<view class="list dis-flex">
					<view class="label">帮砍人数</view>
					<view class="control">
						<input class="col-3 f-28" type="number" v-model="formData.peoples" placeholder="请输入帮砍人数"/>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：每个砍价订单的帮砍人数，达到该人数才可砍至底价</view>
				<view class="list dis-flex">
					<view class="label f-30">可自砍一刀</view>
					<radio-group @change="radioChange($event,'is_self_cut')" class="control dis-flex">
						<label v-for="(item,index) in is_self_cutList" :key="index" class="radio-item dis-flex flex-y-center labelBox">
							<radio class="radioItem" color="#FF7541" :id="index+''" :value="item.value" :checked="formData.is_self_cut==item.value"></radio>
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：砍价发起人自己砍一刀</view>
				<view class="list dis-flex">
					<view class="label f-30">必须底价购买</view>
					<radio-group @change="radioChange($event,'is_floor_buy')" class="control dis-flex">
						<label v-for="(item,index) in is_floor_buyList" :key="index" class="radio-item dis-flex flex-y-center labelBox">
							<radio class="radioItem" color="#FF7541" :id="index+''" :value="item.value" :checked="formData.is_floor_buy==item.value"></radio>
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：只有砍到底价才可以购买</view>
				<view class="list dis-flex">
					<view class="label">初始销量</view>
					<view class="control">
						<input class="col-3 f-28" type="number" v-model="formData.initial_sales" placeholder="请输入初始销量"/>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>注：前台展示的销量 = 初始销量 + 实际销量</view>
				<view class="list dis-flex">
					<view class="label">分享标题</view>
					<view class="control">
						<input class="col-3 f-28" type="text" v-model="formData.share_title"/>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">砍价助力语</view>
					<view class="control">
						<input class="col-3 f-28" type="text" v-model="formData.prompt_words"/>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">活动状态</view>
					<radio-group @change="radioChange($event,'status')" class="control dis-flex">
						<label v-for="(item,index) in statusList" :key="index" class="radio-item dis-flex flex-y-center labelBox">
							<radio class="radioItem" color="#FF7541" :id="index+''" :value="item.value" :checked="formData.status==item.value"></radio>
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
			</view>
			
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30 bgf dis-flex flex-y-center">
					<view class="foot-btn f-32 col-f flex-box" @tap.stop="toSubmit">确定</view>
				</view>
			</view>
		</view>
		<!-- 日期选择 -->
		<tui-datetime ref="dateTime" :type="7" cancelColor="#999" color="#333"
		 :setDateTime="setDateTime" @confirm="change"></tui-datetime>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	export default{
		components: {
			popupTips
		},
		data(){
			return{
				defaultImg:'/static/images/defaultImg.png',
				title: '添加活动',
				type: 0,
				active_id: '',
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				setDateTime:'',//初始日期
				timeCurrent:'',
				is_self_cutList: [{value: '1',name: '允许'},{value: '0',name: '不允许'}],//可自砍一刀
				is_floor_buyList: [{value: '1',name: '是'},{value: '0',name: '否'}],//底价购买
				statusList: [{value: '1',name: '启用'},{value: '0',name: '禁用'}],//活动状态
				wxapp_goods: '',
				formData: {
					start_time: '',
					end_time: '',
					expiryt_time: 24,
					floor_price: '',
					peoples: '',
					initial_sales: '',
					share_title: '麻烦帮我砍一刀！我真的很想要了，爱你哟！(๑′ᴗ‵๑)',
					prompt_words: '朋友一生一起走，帮砍一刀有没有',
					is_self_cut: '1',
					is_floor_buy: '0',
					status: '1',
				}
			}
		},
		onLoad(options) {
			if(options.type==1){
				this.type = options.type==1? 1: 0;
				this.title = options.type==1? '编辑活动': '添加活动';
				this.active_id = options.active_id;
				this.getInfo();
			}
		},
		methods:{
			toSubmit(){
				let that = this;
				let url = '', data = that.formData;
				let isVal = that.verificate(data);
				if(!isVal){
					return false
				}
				uni.showLoading({
					mask: true
				});
				if(that.type==1){
					url = 'shop.bargain/editActive';
					data.active_id = that.active_id;
				}else{
					url = 'shop.bargain/addActive';
					data.wxapp_goods_id = that.wxapp_goods.goods_id;
				}
				app._post_form(url, data, res => {
					that.$refs.toast.showTips({msg: res.msg});
					setTimeout(()=>{uni.navigateBack()},1000)
				}, false, ()=>{
					uni.hideLoading()
				});
			},
			// 详情
			getInfo(){
				app._get('shop.bargain/detail', {active_id: this.active_id}, res => {
					if(res.code==1){
						let data = res.data;
						this.wxapp_goods = {
							goods_image: data.goods_image||this.defaultImg,
							goods_name: data.goods_name||'',
							goods_price: data.goods_price||''
						};
						this.formData = {
							start_time: data.start_time,
							end_time: data.end_time,
							expiryt_time: data.expiryt_time,
							floor_price: data.floor_price,
							peoples: data.peoples,
							initial_sales: data.initial_sales,
							share_title: data.share_title,
							prompt_words: data.prompt_words,
							is_self_cut: data.is_self_cut.toString(),
							is_floor_buy: data.is_floor_buy.toString(),
							status: data.status.toString(),
						}
					}
				});
			},
			// 验证
			verificate(data){
				if(this.wxapp_goods==''||data.end_time==''||data.start_time==''||data.peoples==''||data.floor_price==''||data.initial_sales===''||data.prompt_words==''||data.share_title==''||data.expiryt_time==''){
					this.$refs.toast.showTips({msg: '内容不能为空！'});
					return false
				}else if(this.wxapp_goods.diff_skus==1){
					this.$refs.toast.showTips({msg: '砍价活动仅支持单规格商品 或 同价的多规格商品！'});
					return false
				}else if(!/^([0-9]*)$/.test(data.expiryt_time)||data.expiryt_time<=0){
					this.$refs.toast.showTips({msg: '有效期必须为大于0的正整数！'});
					return false
				}else if(data.floor_price<=0){
					this.$refs.toast.showTips({msg: '砍价底价不能小于等于0！'});
					return false
				}else if(!/^([0-9]*)$/.test(data.peoples)||data.peoples<=0){
					this.$refs.toast.showTips({msg: '帮砍人数必须为大于0的正整数！'});
					return false
				}else if(data.initial_sales<0){
					this.$refs.toast.showTips({msg: '初始销量不能小于0！'});
					return false
				}else{
					return true
				}
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
			// 选择时间
			dateChange(e,text){
				this.setDateTime = e;
				this.timeCurrent = text;
				this.$refs.dateTime.show();
			},
			change(e) {
				this.formData[this.timeCurrent] = e.result;
			},
			//类型
			radioChange(e,fieldName){
				if(e){
					this.formData[fieldName] = e.detail.value;
				}
			},
			bindGoods(){
				if(this.type==0){
					uni.navigateTo({
						url: '/pages/myGoods/printorder/selectProduct/list?source=seckill'
					})
				}
			},
			proCheck(e){
				this.wxapp_goods = e||'';
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'add';
</style>
