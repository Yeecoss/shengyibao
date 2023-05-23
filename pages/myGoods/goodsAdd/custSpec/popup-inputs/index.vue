<template>
	<popup :show="ifshow" @clickmask="clickmask" isInput>
		<view class="popup-main" v-if="ifshow">
			<view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
			<view class="poptitle">{{title}}</view>
			<view class="pop-input">
				<input :focus="focus" ref="input" v-if="inputType == 'text'" type="text" :placeholder="placeholder" v-model="val" :maxlength="maxlength"/>
				<textarea :focus="focus" ref="input" v-else-if="inputType == 'largeText'" v-model="val" :maxlength="maxlength"/>
				<input :focus="focus" ref="input" v-else type="number" v-model="val" :maxlength="maxlength"/>
				<view class="tips dis-flex" v-if="tips != ''">
					<div class="icon">
						<text class="iconfont2 icon-questionmark"></text>
					</div>
					<div>
						{{tips}}
					</div>
				</view>
			</view>
			<view class="pop-btn">
				<view @tap="confirm(true)">新增</view>
				<view @tap="confirm(false)">新增并继续</view>
			</view>
		</view>
	</popup>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	
	export default {
		components: {
			popup,
		},
		props: {
			tips: {
				type: String,
				default: ''
			},
			inputType: {
				type: String,
				default: 'text'
			},
			title: String,
			placeholder: String,
			show :{
				type:Boolean,
				default: false
			},
			popVal: {
				type: String,
				default: ''
			},
			maxlength: {
				type: [String,Number],
				default: '-1'
			},
			showlength :{
				type:Boolean,
				default: false
			}
		},
		data (){
			return{
				ifshow: false,
				val: '',
				focus: false,
				next: null
			}
		},
		watch: {
			show (newValue) {
				if (newValue) {
					this.ifshow = true;
				} else {
					this.ifshow = false;
				}
			},
			popVal (v) {
				if (v) {
					this.val = v;
				} 
			}
		},
		methods: {
			_open(val, next){
				this.val = val || '';
				this.ifshow = !this.ifshow;
				this.next = next || null
				this.focus = true
			},
			clickmask(){
				this.ifshow = !this.ifshow;
				this.val = '';
				this.$emit('cancel',{});
				this.focus = false
			},
			//点击确认
			confirm(close){
				this.$emit('confirm',this.val);
				this.next(this.val, () => {
					this.val = '';
					if (close) {
						this.ifshow = !this.ifshow;
						this.focus = false
					} else {
						this.focus = true
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.popup-main{
		position: relative;
		width: 600rpx;
		padding-top: 40rpx;
		border-radius: 16rpx;
		background:#fff;
	}
	.pop-close{
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		color: #999;
	}
	.poptitle{
		font-size: 32rpx;
		line-height: 1.1;
		text-align: center;
	}
	.pop-input{
		position: relative;
		padding: 40rpx 40rpx 60rpx;
		overflow: hidden;
		input{
			width: 100%;
			height: 80rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			background-color: #F8F8F8;
		}
		textarea{
			width: 100%;
			height: 240rpx;
			padding: 20rpx 20rpx 44rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			background-color: #F8F8F8;
		}
		.tips{
			color: #F8B14A;
			font-size: 24rpx;
			position: relative;
			margin-top: 20rpx;
			line-height: 1.5;
			.icon{
				width: 40rpx;
				.iconfont2{
					font-size: 24rpx;
				}
			}
		}
	}
	.text_num{
		position: absolute;
		right: 60rpx;
		bottom: 80rpx;
		font-size: 24rpx;
		color: #BCBCBC;
	}
	// 按钮
	.pop-btn{
		display: flex;
		border-top: 1rpx solid #eee;
		view{
			width: 100%;
			font-size: 28rpx;
			line-height: 86rpx;
			color: #666;
			text-align: center;
			letter-spacing: 0.05em;
			overflow: hidden;
		}
	}
	.pop-btn view:nth-child(2){
		color: $red;
		border-left: 1rpx solid #eee;
	}
</style>
