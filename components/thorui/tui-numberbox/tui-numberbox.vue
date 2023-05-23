<template>
	<view class="tui-numberbox">
		<template v-if="inputValue">
			<view class="tui-numbox-icon tui-icon-reduce " :class="[(disabled && isDisabled) || (min>=value && isDisabled)?'tui-disabled':'']" @tap="reduce"
			 :style="{color:iconColor,fontSize:iconSize+'rpx'}">
				<text class="iconfont2 icon-subtract"></text>
			 </view>
			<text class="tui-num-input" :style="{color:color,fontSize:size+'rpx',backgroundColor:backgroundColor,height:height+'rpx'}">{{inputValue}}</text>
		</template>
		<view class="tui-numbox-icon tui-icon-plus" :class="[disabled || value>=max?'tui-disabled':'']" @tap="plus" :style="{color:iconColor,fontSize:iconSize+'rpx'}">
			<text class="iconfont2 icon-upload"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tuiNumberbox",
		props: {
			isDisabled: {
				type: Boolean,
				default: true
			},
			value: {
				type: Number,
				default: 1
			},
			//最小值
			min: {
				type: Number,
				default: 1
			},
			//最大值
			max: {
				type: Number,
				default: 9999
			},
			//迈步大小 1 1.1 10...
			step: {
				type: Number,
				default: 1
			},
			//是否禁用操作
			disabled: {
				type: Boolean,
				default: false
			},
			//是否禁用输入
			disabledInput: {
				type: Boolean,
				default: false
			},
			//加减图标大小 rpx
			iconSize: {
				type: Number,
				default: 26
			},
			iconColor: {
				type: String,
				default: "#666666"
			},
			//input 高度
			height: {
				type: Number,
				default: 42
			},
			//input 宽度
			width: {
				type: Number,
				default: 40
			},
			size: {
				type: Number,
				default: 28
			},
			//input 背景颜色
			backgroundColor: {
				type: String,
				default: "#ffffff"
			},
			//input 字体颜色
			color: {
				type: String,
				default: "#333"
			},
			//索引值，列表中使用
			index: {
				type: [Number, String],
				default: 0
			},
			//自定义参数
			custom: {
				type: [Number, String],
				default: 0
			}
		},
		created() {
			this.inputValue = this.value
		},
		data() {
			return {
				inputValue: 0
			};
		},
		watch: {
			value(val){
				this.inputValue = this.value
			}
		},
		methods: {
			calcNum: function(type) {
				if (this.disabled) {
					return
				}
				let num = parseInt(this.inputValue)
				if (type === 'reduce') {
					num -= 1
				} else if (type === 'plus') {
					num += 1
				}
				let value = num
				if (type === "plus" && value < this.min) {
					value = this.min
				} else if (type === "reduce" && value > this.max) {
					value = this.max
				}
				if (value < this.min || value > this.max) {
					return
				}
				// this.inputValue = value
				this.handleChange(value, type)
			},
			plus: function() {
				this.calcNum("plus")
			},
			reduce: function() {
				this.calcNum("reduce")
			},
			blur: function(e) {
				let value = e.detail.value
				if (value) {
					if (~value.indexOf(".") && Number.isInteger(this.step)) {
						value = value.split(".")[0]
					}
					value = Number(value)
					if (value > this.max) {
						value = this.max
					} else if (value < this.min) {
						value = this.min
					}
				} else {
					value = this.min
				}
				if (value == this.value && value != this.inputValue) {
					this.inputValue = value
				}
				this.handleChange(value, "blur")
			},
			handleChange(value, type) {
				if (this.disabled) return;
				this.$emit('change', {
					value: value,
					type: type,
					index: this.index,
					custom: this.custom
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@font-face {
		font-family: 'numberbox';
		src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAASQAA0AAAAABtwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEdAAAABoAAAAciBpnRUdERUYAAARUAAAAHgAAAB4AKQALT1MvMgAAAZwAAABDAAAAVjxzSINjbWFwAAAB9AAAAEYAAAFK5zLpOGdhc3AAAARMAAAACAAAAAj//wADZ2x5ZgAAAkgAAACHAAAAnIfIEjxoZWFkAAABMAAAAC8AAAA2FZWEOWhoZWEAAAFgAAAAHAAAACQH3gOFaG10eAAAAeAAAAARAAAAEgwAAAFsb2NhAAACPAAAAAwAAAAMADAATm1heHAAAAF8AAAAHwAAACABEAAobmFtZQAAAtAAAAFJAAACiCnmEVVwb3N0AAAEHAAAAC0AAABV/+8iFXjaY2BkYGAA4gVmC5Tj+W2+MnCzMIDATWsFOQT9v5GFgbkeyOVgYAKJAgDrogf+AHjaY2BkYGBu+N/AEMPCAAJAkpEBFbAAAEcKAm142mNgZGBgYGWQYQDRDAxMQMwFhAwM/8F8BgALpAE5AHjaY2BkYWCcwMDKwMDUyXSGgYGhH0IzvmYwYuQAijKwMjNgBQFprikMDs9Yn01kbvjfwBDD3MDQABRmBMkBAOXpDHEAeNpjYYAAFghmZGAAAACdAA4AAAB42mNgYGBmgGAZBkYGEHAB8hjBfBYGDSDNBqQZGZiesT6b+P8/AwOElvwnWQxVDwSMbAxwDiMTkGBiQAWMDMMeAABRZwszAAAAAAAAAAAAAAAwAE542iWKQQrCMBBF5xNpd0pQ7EIoTEnahSCTUNqdWz2A9TrieXKeXCc1qcPn/zfzh0BYv2pVH7oQgbvqdG5Yt/DTrNlPYz+wHvuuqhFSME4sFshTgKUsKfhH5lg8BSul3i5bS3mQdd0RIh2IjnvUrkXDd8zuhuFt86tY9fonIsSYgsXpB+cCGosAeNp9kD1OAzEQhZ/zByQSQiCoXVEA2vyUKRMp9Ailo0g23pBo1155nUg5AS0VB6DlGByAGyDRcgpelkmTImvt6PObmeexAZzjGwr/3yXuhBWO8ShcwREy4Sr1F+Ea+V24jhY+hRvUf4SbuFUD4RYu1BsdVO2Eu5vSbcsKZxgIV3CKJ+Eq9ZVwjfwqXMcVPoQb1L+EmxjjV7iFa2WpDOFhMEFgnEFjig3jAjEcLJIyBtahOfRmEsxMTzd6ETubOBso71dilwMeaDnngCntPbdmvkon/mDLgdSYbh4FS7YpjS4idCgbXyyc1d2oc7D9nu22tNi/a4E1x+xRDWzU/D3bM9JIbAyvkJI18jK3pBJTj2hrrPG7ZynW814IiU68y/SIx5o0dTr3bmniwOLn8owcfbS5kj33qBw+Y1kIeb/dTsQgil2GP5PYcRkAAAB42mNgYoAALjDJyIAOWMGiTIxMjMwiWZmJQJRXVQoigTgjMd9QGIsgAFDsEBsAAAAAAAAB//8AAgABAAAADAAAABYAAAACAAEAAwAEAAEABAAAAAIAAAAAeNpjYGBgZACCq0vUOUD0TWsFORgNADPBBE4AAA==) format('woff');
		font-weight: normal;
		font-style: normal;
	}

	.tui-numbox-icon {
		font-family: "numberbox" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		width: 40rpx;
		height: 40rpx;
		
		line-height: 40rpx;
		background: #ff8c61;
		border-radius: 10rpx;
		text-align: center;
		text{
			font-size: 26rpx;
			color: white;
		}
	}
	.tui-icon-reduce{
		background: white;
		border: 1rpx solid #ff8c61;
		line-height: 40rpx;
		width: 38rpx;
		height: 38rpx;
		text{
			color: #666666;
		}
	}

	.tui-numberbox {
		display: -webkit-inline-flex;
		display: inline-flex;
		align-items: center;
	}

	.tui-num-input {
		text-align: center;
		margin: 0 16rpx;
		font-weight: 400;
		line-height: 48rpx;
	}

	.tui-disabled {
		/* color: #ededed !important; */
		color: #A6A6A6 !important;
	}
</style>
