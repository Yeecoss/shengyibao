<template>
	<view class="min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="添加店员" isHelpme extClass="nav" id="top"></navigationBar>
		<view class="search bgf" v-if="type!=1">
			<search :value="searchValue" @search="search" placeholder="搜索生意宝已注册用户的手机号"></search>
		</view>
		<view class="main container">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label width160">微信头像</view>
					<view class="control">
						<view class="wx_pic"><image :src="salesclerk.avatarUrl?salesclerk.avatarUrl:defaultImg" mode="aspectFill"></image></view>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label width160">微信昵称</view>
					<view class="control">
						<text>{{salesclerk.nickName ? salesclerk.nickName : '自动识别'}}</text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label width160">手机号</view>
					<view class="control">
						<text>{{salesclerk.phone ? salesclerk.phone : '自动识别'}}</text>
					</view>
				</view>
				<view class="notes f-24 col-9"><text class="iconfont2 icon-jingshi f-24"></text>头像、昵称、手机号根据搜索手机号识别</view>
				<view class="list dis-flex">
					<view class="label width160">密码</view>
					<view class="control">
						<input type="text" v-model="password" maxlength="6" placeholder="请输入密码"/>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label width160">备注</view>
					<view class="control">
						<input type="text" v-model="remark" placeholder="请输入备注"/>
					</view>
				</view>
			</view>
			<!-- 配置功能 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label width160">配置功能</view>
					<view class="control"></view>
					<view class="listLine"></view>
				</view>
				<view class="list">
					<view class="radio-group f-24 col-6 m-b-30" v-for="(item, index) in access_list" :key="index">
						<view class="set-list m-b-30 dis-flex flex-y-center" @tap="changeAccess(index)">
							<view class="set-btn m-r-10" :class="item.check?'radio-red':''"><text class="iconfont2 icon-duihao-copy f-24 f-w"></text></view>
							{{item.name}}
						</view>
						<view class="set-list dis-flex flex-wrap" :class="item.all?'set-list-all':''">
							<view class="set-item m-l-40 m-b-10 dis-flex flex-y-center" 
								v-for="(vo, k) in item.children" :key="k"
								@tap="changeSubAccess(index,k)">
								<view class="set-btn m-r-10" :class="vo.check?'radio-red':''"><text class="iconfont2 icon-duihao-copy f-24 f-w"></text></view>{{vo.name}}
							</view>
						</view>
						
					</view>
				</view>
			</view>
			
			<!-- 底部 -->
			<view class="footer">
				<view class="foot wrap30 bgf dis-flex flex-y-center">
					<view class="foot-btn f-32 col-f flex-box" @tap.stop="toSubmit">{{type==1?'保存':'绑定'}}</view>
				</view>
			</view>
		</view>
		
		<!-- 确认框 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips><!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	// 验证类
	import Verify from "@/utils/verify";
	import search from '@/components/uni-search/index';
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			search,
			popupTips,
			guidePage
		},
		data(){
			return {
				defaultImg:'https://pic.kaidanxia.com/2020-09-01/202009011505247912a9701.png',
				searchValue: '',
				mtitle:'',
				mcontent:'',
				
				type: 0,//默认为新增
				store_user_id: '',//员工
				salesclerk: {
					avatarUrl: "",
					nickName: "",
					phone: "",
					user_id: '',
				},
				password: '123456',//密码
				remark: '',//备注
				access_list: [],//权限列表
			}
		},
		onLoad(options) {
			if(options.store_user_id){
				this.store_user_id = options.store_user_id;
				this.type = 1;
				this.getInfo();
			}else{
				this.getAccess()
			}
		},
		methods: {
			// 编辑员工详情
			getInfo(){
				app._get('shop.setting.salesclerk/edit',{
					store_user_id: this.store_user_id,
				},res => {
					let store_user = res.data.store_user;
					this.salesclerk = {
						avatarUrl: store_user.avatarUrl,
						nickName: store_user.real_name,
						phone: store_user.user_name,
						user_id: store_user.user_id,
					};
					this.password = store_user.real_password;
					this.remark = store_user.remark;
					
					let access = res.data.access;
					this.initAccess(access,store_user.access);
				})
			},
			// 绑定
			toSubmit(){
				if(this.store_user_id){
					this.toEdit()
				}else{
					this.toBind()
				}
			},
			// 新增
			toBind(){
				this.mtitle = '提示',
				this.mcontent = '确定绑定？';
				// uni.showLoading({
				// 	mask: true
				// });
				this.$refs.popupTips.open(() => {
					let data = {
						user_id: this.salesclerk.user_id,
						phone: this.salesclerk.phone,
						nickName: this.salesclerk.nickName,
						password: this.password,
						remark: this.remark,
					};
					let verificate = this.verification(data);
					if(!verificate){
						return false;
					}
					data.access = this.getAccessVals().toString();
					app._post_form('shop.setting.salesclerk/add',data, res =>{
						this.$refs.toast.showTips({msg: res.msg});
						uni.navigateBack()
					});
				})
			},
			// 编辑
			toEdit(){
				this.mtitle = '提示',
				this.mcontent = '确定保存？';
				this.$refs.popupTips.open(() => {
					let data = {
						store_user_id: this.store_user_id,
						password: this.password,
						remark: this.remark,
					};
					if(data.password==''){
						this.$api.msg('密码不能为空！');
						return false;
					}
					// if(data.remark==''){
					// 	this.$api.msg('备注不能为空！');
					// 	return false;
					// }
					data.access = this.getAccessVals().toString();
					app._post_form('shop.setting.salesclerk/edit',data, res =>{
						this.$refs.toast.showTips({msg: res.msg});
						uni.navigateBack()
					});
				})
			},
			// 校验
			verification(data){
				if(data.user_id==''){
					this.$api.msg('请添加员工信息！');
					return false;
				}else if(data.password==''){
					this.$api.msg('密码不能为空！');
					return false;
				}else{
					return true;
				}
				// else if(data.remark==''){
				// 	this.$api.msg('备注不能为空！');
				// 	return false;
				// }
				
			},
			// 获取选中的权限值组
			getAccessVals(){
				let vals = [];
				this.access_list.forEach(item => {
					item.children.forEach(item1 => {
						if(item1.check){
							vals.push(item1.value)
						}
					})
				});
				return vals;
			},
			//搜索用户
			search(e){
				this.searchValue = e;
				if (!Verify.isPhone(e)) {
				  this.$api.msg('请输入正确的手机号码！');
				  return false;
				}
				app._get('shop.setting.salesclerk/search_user',{
					phone: e
				}, res =>{
					this.salesclerk = res.data || '';
				});
			},
			// 编辑初始化权限列表
			initAccess(access,check_access){
				for (let i = 0; i < access.length; i++) {
					let item = access[i];
					let checkNum = 0;
					for (let j = 0; j < item.children.length; j++) {
						let children = item.children[j];
						if(check_access.includes(children.value)){
							children.check = true;
							checkNum++
						}else{
							children.check = false;
						}
					}
					item.check =  checkNum==item.children.length? true: false;
				}
				this.access_list = access;
			},
			// 获取权限列表
			getAccess(){
				app._get('shop.setting.salesclerk/add',{}, res =>{
					let access = res.data.access;
					access.forEach(item => {
						item.check = false;
						item.children.forEach(item1 => {
							item1.check = false;
						});
					})
					this.access_list = access;
				});
			},
			// 权限大模块选择
			changeAccess(index){
				let list  = this.access_list;
				list[index].check = !list[index].check;
				list[index].children.forEach(item => {
					item.check = !item.check;
				});
				this.access_list = list;
			},
			// 权限子模块选择
			changeSubAccess(index,index2){
				let list  = this.access_list;
				if(!list[index].all){
					list[index].children[index2].check = !list[index].children[index2].check;
					
					let checkNum = 0;
					list[index].children.forEach(item => item.check == true? checkNum++ : '');
					list[index].check =  checkNum==list[index].children.length? true: false;
					this.access_list = list;
				}
			},
			
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'index';
</style>
