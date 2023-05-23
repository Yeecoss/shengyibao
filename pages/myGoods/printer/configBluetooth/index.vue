<template>
<view class="form">
  <div>
    <!-- 自定义标题栏 -->
    <navigationBar title="配置网络" id="top"></navigationBar>
  </div>
  
  <scroll-view>
    <!-- 基础字段 -->
    <div class="bg-w fieldBox margin-b">
		<view class="tipBox">
			暂不支持5GhzWiFi与中文名称
		</view>
      <div class="pad-box1 border_b">
        <div class="dis-flex fieldItem flex-y-center flex-x-between">
          <div class="label">WIFI账号</div>
          <div class="contentBox dis-flex flex-y-center">
            <div class="content onelist-hidden">
				<input style="text-align:right" placeholder-class="place-holder" type="text" placeholder="请输入账号" v-model="formData.name"/>
            </div>
          </div>
        </div>
      </div>
      <div class="pad-box1 border_b">
        <div class="dis-flex fieldItem flex-y-center flex-x-between">
          <div class="label">WIFI密码</div>
          <div class="contentBox dis-flex flex-y-center">
            <div class="content onelist-hidden">
				<input style="text-align:right" placeholder-class="place-holder" type="text" placeholder="请输入8位及以上密码" v-model="formData.password"/>
            </div>
          </div>
        </div>
      </div>
	</div>
  </scroll-view>
	<view class="footer">
		<button @tap.stop="submit" v-if="isOpenBle">提交</button>
		<button v-else class="disable"  @tap.stop="butTip">提交</button>
	</view>
	<popup v-if="showWaitShow" :show="showWaitShow">
		<view class="popupBox">
			<view class="popupTit">
				提示
			</view>
			<view class="popupContent">
				开始配置打印机，请稍后（{{time}}s）<br>
				等打印机重启后，可添加为云打印机
			</view>
		</view>
	</popup>
</view>
</template>

<script>
const App = getApp().globalData;
import Bluetooth from '@/components/printing/bluetooth.js'
import popup from '@/components/popup/index'
let bluetooth = null;

export default {
  data() {
    return {
		blueName: '',
		deviceId: '',
		serviceId: '',
		characteristicId: '',
		isOpenBle: false,
		time: 30,
		showWaitShow: false,
		formData: {
			name: '',
			password: ''
		}
    };
  },

  components: {
		popup
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		 // console.log(options)
		if (options.printer_name) {
			this.blueName = options.printer_name + 'L'
			// console.log(this.blueName)
		}
		/* #ifndef H5 */
		bluetooth = new Bluetooth()
		
		/* #endif */
		/* #ifdef MP-WEIXIN  */
		this.unitBlue()
		let that = this
		wx.startWifi({
		  success(res) {
			// console.log(res.errMsg)
			wx.getConnectedWifi({
			  success: (res) => {
				// console.log(res);
				that.formData.name = res.wifi.SSID || ''
			  },
			  fail: (res) => {
				if(res.errCode == 12006){
				}
				// console.log(res);
			  }
			})
		  }
		})
		/* #endif */
  },
	//页面卸载是关闭蓝牙链接
	onUnload() {
		if (bluetooth) {
			bluetooth.closeBLEConnection();
			bluetooth.closeBluetoothAdapter();
		}
	},
	methods: {
		butTip() {
			uni.showModal({
			    title: '提示',
			    content: '蓝牙设备未连接成功，是否重新连接',
			    success: (res) => {
			        if (res.confirm) {
						this.unitBlue()
			        }
			    }
			});
		},
		unitBlue() {
			/* #ifndef H5 */
			if (uni && uni.openBluetoothAdapter) {
				// console.log('初始化蓝牙');
				/* #ifdef MP */
				uni.openBluetoothAdapter({
				/* #endif */
				/* #ifdef APP-PLUS  */
				plus.bluetooth.openBluetoothAdapter({
				/* #endif */
					success: (e) => {
						this.isOpenBle = true;
						// console.log('初始化蓝牙成功:' + e.errMsg);
						bluetooth.showToast("初始化蓝牙模块成功");
						this.startBluetoothDeviceDiscovery()
					},
					fail: (e) => {
						// console.log('初始化蓝牙失败:' + e.errMsg);
						// bluetooth.showToast(`初始化蓝牙模块失败`);
						bluetooth.initTypes(e.errCode || e.code)
					}
				});
			}
			/* #endif */
		},
		string2buffer1(str) {
			if (!str) return;
			var val = "";
			if (typeof str == 'number') {
			  val = str.toString(16);
			} else {
			  for (var i = 0; i < str.length; i++) {
				val += str.charCodeAt(i).toString(16);
			  }
			}
			if (val.length == 1) {
			  val = '0' + val
			}
			return val
		},
		submit() {
			if (this.formData.name.length == 0) {
				bluetooth.showToast('请输入WIFI名称')
				return false
			}
			if (this.formData.password.length < 8) {
				bluetooth.showToast('请输入8位及以上WIFI密码')
				return false
			}
			let wifiName = this.string2buffer1(this.formData.name) + '00'
			let wifiNameLength = this.string2buffer1(this.formData.name.length + 1)
			let wifiNameKey = this.string2buffer1('WIFI_SSID') + '00'
			let wifiNameKeyLength = this.string2buffer1(10)
			let wifiNameAllLength = this.string2buffer1(this.formData.name.length + 17)

			let wifiPasswd = this.string2buffer1(this.formData.password) + '00'
			let wifiPasswdLength = this.string2buffer1(this.formData.password.length + 1)
			let wifiPasswdKey = this.string2buffer1('WIFI_PSW') + '00'
			let wifiPasswdKeyLength = this.string2buffer1(9)
			let wifiPasswdAllLength = this.string2buffer1(this.formData.password.length + 16)

			let wifiNameVal = '1F57' + wifiNameAllLength + '003001' + wifiNameKeyLength + '00' + wifiNameLength + '00' + wifiNameKey + wifiName
			let wifiNameKeyVal = '1F57' + wifiPasswdAllLength + '003001' + wifiPasswdKeyLength + '00' + wifiPasswdLength + '00' + wifiPasswdKey + wifiPasswd
			// console.log('wifiNameVal', wifiNameVal)
			// console.log('wifiNameKeyVal', wifiNameKeyVal)
			let bufferName = new Uint8Array(wifiNameVal.match(/[\da-f]{2}/gi).map(function (h) {
			  return parseInt(h, 16)
			})).buffer
			
			let bufferPas = new Uint8Array(wifiNameKeyVal.match(/[\da-f]{2}/gi).map(function (h) {
			  return parseInt(h, 16)
			})).buffer
			
			uni.writeBLECharacteristicValue({
				deviceId: this.deviceId,
				serviceId: this.serviceId,
				characteristicId: this.characteristicId,
				value: bufferName,
				success: (res) => {
					uni.writeBLECharacteristicValue({
						deviceId: this.deviceId,
						serviceId: this.serviceId,
						characteristicId: this.characteristicId,
						value: bufferPas,
						success: (res) => {
							this.save()
						},
						fail: (res) => {
							bluetooth.showToast('重置失败');
						}
					})
				},
				fail: (res) => {
					bluetooth.showToast('重置失败');
				}
			})
		},
		save() {
			let that = this;
			let val = '1F57150030020F0000007265675F76616C75655F7361766500'
			let buffer = new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
			  return parseInt(h, 16)
			})).buffer
			setTimeout(() => {
			  wx.writeBLECharacteristicValue({
				deviceId: this.deviceId,
				serviceId: this.serviceId,
				characteristicId: this.characteristicId,
				value: buffer,
				success: function(res) {
				  // console.log("保存 成功");
				  // console.log(res);
				  that.reset()
				},
				fail: function(res){
				  // console.log(res);
					bluetooth.initTypes(res.errCode || res.code)
				}
			  })
			})
		},
		reset() {
			let that = this;
			let val = '1F57120030020C000000706F7765725F726573657400'
			let buffer = new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
			  return parseInt(h, 16)
			})).buffer
			setTimeout(() => {
			  wx.writeBLECharacteristicValue({
				deviceId: this.deviceId,
				serviceId: this.serviceId,
				characteristicId: this.characteristicId,
				value: buffer,
				success: function(res) {
				  // console.log(res);
				  that.showWait()
				},
				fail: function(res){
				  // console.log(res);
					bluetooth.initTypes(res.errCode || res.code)
				}
			  })
			})
		},
		showWait() {
			this.showWaitShow = true
			this.time = 30
			let time = setInterval(() => {
				this.time += -1
				if (this.time == 0) {
					clearInterval(time)
					this.showWaitShow = false
					  setTimeout(() => {
						  uni.navigateBack()
					  }, 500)
				}
			}, 1000)
		},
		string2buffer(str) {
			if (!str) return;
			var val = "";
			for (var i = 0; i < str.length; i++) {
			  val += str.charCodeAt(i).toString(16);
			}
			// console.log(val);
			str = val;
			val = "";
			let length = str.length;
			let index = 0;
			let array = []
			while (index < length) {
			  array.push(str.substring(index, index + 2));
			  index = index + 2;
			}
			val = array.join(",");
			// 将16进制转化为ArrayBuffer
			return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
			  return parseInt(h, 16)
			})).buffer
		},
		  /**
		   * 将ArrayBuffer转换成字符串
		   */
		ab2hex(buffer) {
			var hexArr = Array.prototype.map.call(
			  new Uint8Array(buffer),
			  function (bit) {
				return ('00' + bit.toString(16)).slice(-2)
			  }
			)
			return hexArr.join('');
		},
		//搜索周边设备
		startBluetoothDeviceDiscovery() {
			/* #ifndef H5 */
			uni.showLoading({
				title: '蓝牙搜索中'
			})
	
			this.devicesList = [];
	
			setTimeout(() => {
				uni.startBluetoothDevicesDiscovery({
					// services: [this.blueName],
					allowDuplicatesKey: true,
					success: res => {
						uni.onBluetoothDeviceFound(devices => {
							// console.log("发现设备: " + JSON.stringify(devices));
							//不重复,就添加到devicesList中,
							if (this.blueName != '') {
								let name = devices.devices[0].name ? devices.devices[0].name || '' : ''
								// console.log(name)
								if (name == this.blueName) {
									// console.log('正在连接蓝牙')
									this.select_deviceId(devices.devices[0].deviceId)
									this.stopBluetoothDevicesDiscovery()
								}
							}
						});
					},
					fail: res => {
						uni.hideLoading();
						// console.log(JSON.stringify(res))
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
		notifyBLECharacteristicValueChange() {
			let deviceId = this.deviceId;
			uni.notifyBLECharacteristicValueChange({
				state: true, // 启用 notify 功能
				// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
				deviceId,
				// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
				serviceId: this.serviceId,
				// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
				characteristicId: this.characteristicIdNotify,
				success:(res) => {
					// console.log('notifyBLECharacteristicValueChange success:' + res.errMsg);
					// console.log(JSON.stringify(res));
					uni.onBLECharacteristicValueChange(characteristic => {
						// console.log('监听低功耗蓝牙设备的特征值变化事件成功');
						var array = this.ab2hex(characteristic.value);
						// console.log(array);
					});
				}
			});
		},
		select_deviceId(deviceId) {
			this.deviceId = deviceId
			uni.showToast('正在连接设备')
			bluetooth.createBLEConnection(deviceId, () => {
				bluetooth.getBLEDeviceServices(async slist => {
					// console.log(slist)
					let uuid = ''
					
					for (let s of slist) {
						if (s.uuid.indexOf('FF00') != -1) {
							uuid = s.uuid
							this.serviceId = uuid
							uni.getBLEDeviceCharacteristics({
								deviceId,
								serviceId: uuid,
								success: res => {
									// console.log(res)
									for (let _obj of res.characteristics) {
										if (_obj.uuid.indexOf('FF02') != -1) {
											bluetooth.showToast('设备连接成功')
											this.characteristicId = _obj.uuid
										}
										if(_obj.properties.notify == true){
											// console.log("该特征值属性: Notify");
											this.characteristicIdNotify = _obj.uuid
											this.notifyBLECharacteristicValueChange()
										}else if(_obj.properties.write == true){
											// console.log("该特征值属性: Write");
											this.characteristicId = _obj.uuid
										}else{
											// console.log("该特征值属性: 其他");
										}
									}
								},
								fail: err => {
									// console.log(JSON.stringify(err))
									bluetooth.initTypes(err.errCode || err.code)
								}
							})
						}
					}
				});
			});
		},
	}
};
</script>
<style lang="scss">
	.form{
		background: #F5F5F5;
		height: 100%;
	}
	.tipBox{
		padding: 0 30rpx;
		height: 72rpx;
		line-height: 72rpx;
		color: #FF7541;
		font-size: 24rpx;
		background: white;
		margin-bottom: 20rpx;
	}
  .pad-box1{
    padding: 0 30rpx;
    height: 96rpx;
	background: white;
    line-height: 96rpx;
  }
  .fieldBox{
	  padding-top: 20rpx;
    .fieldItem{
      .label{
        min-width: 112rpx;
        color: #333;
        font-size: 30rpx;
      }
      .contentBox{
        font-size: 28rpx;
        color: #BCBCBC;
        flex: 1;
        padding-left: 30rpx;
        position: relative;
        .labelBox{
          padding-left: 20rpx;
        }
        .content{
          flex: 1;
          min-height: 24rpx;
          word-break:break-all;
          line-height: 32rpx;
          .radioItem{
            transform:scale(.6);
            vertical-align: middle;
          }
        }
      }
    }
  }
  .border_b{
    border-bottom: 1rpx solid #eee;
  }
  .place-holder{
	color: #BCBCBC;
	font-size: 28rpx;
	}
    .footer{
        padding: 30rpx 0;
		position: absolute;
		bottom: 40rpx;
		left: 0;
		right: 0;
        button{
            width:690rpx;
            height:80rpx;
            line-height: 80rpx;
            font-size: 32rpx;
            box-shadow:0px 0px 16rpx 2rpx rgba(222,222,222,0.5);
            border-radius:40rpx;
            color: white;
            background:rgba(232,46,46,1);
        }
		.disable{
			background: #C0C0C0;
		}
    }
	.popupBox{
		width: 560rpx;
		height: 240rpx;
		background: white;
		border-radius: 10rpx;
		text-align: center;
		.popupTit{
			height: 88rpx;
			line-height: 88rpx;
		}
		.popupContent{
			font-size: 26rpx;
			line-height: 56rpx;
		}
	}
</style>