<template>
	<!-- 搜索框 -->
	<view class="dis-flex search-input-box">
		<view class="search-input dis-flex flex-y-center"  @tap="gosearch" :style="{background:background,borderRadius:radius}">
			<text class="icon iconfont2 icon-searchfor col-9"></text>
			<input :disabled="disabled" v-model="keyword" @blur="search" :focus="focus" :placeholder="placeholder" :placeholderStyle="placeStyle" type="text"/>
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'search',
		props: {
			disabled: {
				type: Boolean,
				default: false
			},
			focus: {
				type: Boolean,
				default: false
			},
			value: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'text'
			},
			placeholder: {
				type: String,
				default: ''
			},
			placeStyle: {
				type: String,
				default: 'color:#999;font-size:24rpx;'
			},
			background: {
				type: String,
				default: ''
			},
			radius: {
				type: String,
			},
			
		},
		watch: {
			value(val) {
				this.keyword = val
			}
		},
		data() {
			return {
				keyword: '',
			};
		},
		mounted() {
			this.keyword = this.value
		},
		methods: {
			gosearch(){
				this.$emit('gosearch',this.keyword)
			},
			search(){
				this.$emit('search',this.keyword)
			},
		}
	}
</script>

<style lang="scss">
	/* 搜索框 */
	.search-input-box {
		height: 60rpx;
		overflow: hidden;
	}
	.search-input {
		width: 100%;
		background: #F5F5F5;
		border-radius: 30rpx;
		padding: 0 26rpx;
		text-align: left;
		box-sizing: border-box;
		overflow: hidden;
		.icon{
			margin-right: 24rpx;
		}
	}
	.search-input input {
		flex: 1;
		font-size: 24rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
</style>
