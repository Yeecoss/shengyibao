<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="添加打印机" extClass="nav" id="top"></navigationBar>
		<!-- 基础字段 -->
		<div class="bg-w fieldBox margin-b">
			<div class="pad-box1 border_b">
				<div class="dis-flex fieldItem flex-y-center flex-x-between" @tap="startBluetoothDeviceDiscovery">
					<div class="label">
						<text class="iconfont2 icon-Bluetooth"></text>
						蓝牙搜索
					</div>
					<div class="contentBox dis-flex flex-y-center flex-x-end">
						<view class="fieldBut">
							重新搜索
						</view>
					</div>
				</div>
			</div>
			<div class="pad-box1"  v-for="(item,index) in devicesList" :key="index">
				<div class="dis-flex fieldItem flex-y-center flex-x-between" @tap="select_service(item)">
					<div class="label">{{item.name }}</div>
					<div class="contentBox dis-flex flex-y-center">
						<div class="content">
							点击添加
							<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
						</div>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import Bluetooth from '@/components/printing/bluetooth.js'
	let bluetooth = null;
	export default {
		components: {},
		data() {
			return {
				isOpenBle: false, //是否已经打开蓝牙，默认为false
				devicesList: [], //设备列表
				serviceList: [], //服务列表
				deviceId: "", //选中的deviceId
			}
		},
		//页面卸载是关闭蓝牙链接
		onUnload() {
			if (bluetooth) {
				bluetooth.closeBLEConnection();
				bluetooth.closeBluetoothAdapter();
			}
		},
		//页面打开,获取位置,打开蓝牙链接
		onLoad() {
			/* #ifndef H5 */
			bluetooth = new Bluetooth()
			this.unitBlue()
			/* #endif */
		},
		methods: {
			unitBlue() {
				/* #ifndef H5 */
				let that = this
				/* #ifdef MP */
				uni.openBluetoothAdapter({
				/* #endif */
				/* #ifdef APP-PLUS  */
				plus.bluetooth.openBluetoothAdapter({
				/* #endif */
					success: (e) => {
						that.isOpenBle = true;
						// console.log('初始化蓝牙成功:' + e);
						bluetooth.showToast("初始化蓝牙模块成功");
						setTimeout(() => {
							that.startBluetoothDeviceDiscovery()
						}, 500)
					},
					fail: (e) => {
						// console.log('初始化蓝牙失败:' + e);
						bluetooth.initTypes(e.errCode || e.code)
					}
				});
				/* #endif */
			},
			//搜索周边设备
			startBluetoothDeviceDiscovery() {
				if (!this.isOpenBle) {
					this.unitBlue()
					return
				}
				/* #ifndef H5 */
				uni.showLoading({
					title: '蓝牙搜索中'
				})

				let self = this;
				self.devicesList = [];

				setTimeout(() => {
					uni.startBluetoothDevicesDiscovery({
						allowDuplicatesKey: true,
						success: res => {
							uni.onBluetoothDeviceFound(devices => {
								// console.log("发现设备: " + JSON.stringify(devices));
								//不重复,就添加到devicesList中,
								if (!self.devicesList.some(item => {
										return item.deviceId === devices.devices[0].deviceId
									})) {
									let name = devices.devices[0].name || ''
									if (name != '' && name.indexOf('PDD') != -1) {
										self.devicesList.push(devices.devices[0])
										self.stopBluetoothDevicesDiscovery()
									}
								}
							});
						},
						fail: res => {
							uni.hideLoading();
							bluetooth.initTypes(res.errCode || res.code)
						}
					})
				}, 200)
				/* #endif */
			},

			//停止搜索蓝牙设备
			stopBluetoothDevicesDiscovery() {
				uni.hideLoading();
				bluetooth.stopBluetoothDevicesDiscovery();
			},

			//选中服务
			select_service(item) {
				let name = item.name
				uni.showLoading()
				app._post_form('setting.printer/addPrintYuan', {
					printer_name: name.substring(0, name.length - 1)
				}, (result) => {
					this.$api.msg(result.data.msg)
					setTimeout(() => {
						uni.navigateBack()
					}, 500)
				}, (result) => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss">
	.pad-box1 {
		padding: 0 30rpx;
		height: 96rpx;
		background: white;
		line-height: 96rpx;
	}

	.fieldBox {
		padding-top: 20rpx;

		.fieldItem {
			.label {
				min-width: 112rpx;
				color: #333;
				font-size: 30rpx;
				.iconfont2 {
					font-size: 30rpx;
					color: #57B8FB;
					margin-right: 10rpx;
				}
			}

			.contentBox {
				font-size: 28rpx;
				color: #BCBCBC;
				flex: 1;
				padding-left: 30rpx;
				position: relative;

				.labelBox {
					padding-left: 20rpx;
				}

				.content {
					flex: 1;
					min-height: 24rpx;
					word-break: break-all;
					line-height: 32rpx;
					text-align: right;
					color: #FF7541;
				}

				.fieldBut {
					width: 152rpx;
					height: 52rpx;
					line-height: 52rpx;
					text-align: center;
					border-radius: 30rpx;
					border: 1rpx solid #FF7541;
					color: #FF7541;
				}

				.tipIcon {
					font-size: 24rpx;
					margin-left: 4rpx;
					color: #FF7541;
				}
			}
		}

		.border_b {
			border-bottom: 1rpx solid #eee;
		}
	}
</style>
