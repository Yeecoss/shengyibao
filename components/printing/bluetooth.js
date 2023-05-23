class Bluetooth {
	// 构造函数
	constructor() {
		this.isOpenBle = false;
		this.isStop = false;
		this.deviceList = [];
		this.deviceId = "";
		this.serviceId = "";
		this.readId = "";
		this.writeId = "";
		this.notifyId = "";
		this.indicateId = "";
		this.valueChangeData = {};
		// this.openBluetoothAdapter();
	}
	// 弹出框封装
	showToast(title) {
		/* #ifndef APP-PLUS */
		uni.showToast({
			title: title,
			icon: 'none',
			'duration': 2000
		});
		/* #endif */
		/* #ifdef APP-PLUS */
		plus.nativeUI.toast(title, {
			align: 'center',
			duration: 2000
		})
		/* #endif */
	}
	// 判断初始化蓝牙状态
	initTypes(code, errMsg) {
		switch (code) {
			case 10000:
				this.showToast('未初始化蓝牙适配器');
				break;
			case 10001:
				this.showToast('请打开蓝牙后重试');
				break;
			case 10002:
				this.showToast('没有找到指定设备');
				break;
			case 10003:
				this.showToast('连接失败');
				break;
			case 10004:
				this.showToast('没有找到指定服务');
				break;
			case 10005:
				this.showToast('没有找到指定特征值');
				break;
			case 10006:
				this.showToast('当前连接已断开');
				break;
			case 10007:
				this.showToast('当前特征值不支持此操作');
				break;
			case 10008:
				this.showToast('其余所有系统上报的异常');
				break;
			case 10009:
				this.showToast('Android 系统特有，系统版本低于 4.3 不支持 BLE');
				break;
			default:
				this.showToast(errMsg);
		}
	}
	// 初始化蓝牙模块
	openBluetoothAdapter(callback) {
		uni.openBluetoothAdapter({
			success: res => {
				// console.log('初始化>>>res', res)
				this.isOpenBle = true;
				this.initTypes(0, "初始化蓝牙模块成功");
				if (typeof callback == "function")
					this.onBluetoothDeviceFound(callback);
			},
			fail: err => {
				// console.log('初始化>>>err', err)
				this.initTypes(err.errCode);
			}
		});
	}
	// 关闭蓝牙模块
	closeBluetoothAdapter() {
		uni.closeBluetoothAdapter({
			success: res => {
				// console.log(res)
			}
		});
	}
	// 获取本机蓝牙适配器状态
	getBluetoothAdapterState() {
		return new Promise((resolve, reject) => {
			uni.getBluetoothAdapterState({
				success: res => {
					// console.log(JSON.stringify(res));
					// this.adapterState = res;
					resolve(res);
				},
				fail: err => {
					// console.log('获取本机蓝牙适配器状态失败，错误码：' + err.errCode);
					reject(err);
				}
			});
		});
	}
	// 搜索蓝牙设备
	startBluetoothDevicesDiscovery() {
		if (!this.isOpenBle) {
			this.showToast(`初始化蓝牙模块失败`)
			return;
		}

		let self = this;
		uni.showLoading({
			title: '蓝牙搜索中'
		})
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				uni.startBluetoothDevicesDiscovery({
					success: res => {
						resolve(res)
					},
					fail: res => {
						self.showToast(`搜索设备失败` + JSON.stringify(err));
						reject(err);
					}
				})
			}, 300);
		});
	}
	// 停止搜索蓝牙设备
	stopBluetoothDevicesDiscovery() {
		uni.stopBluetoothDevicesDiscovery({
			fail: err => {
				this.showToast(`停止搜索蓝牙设备失败` + JSON.stringify(err));
			},
			complete: res => {
				uni.hideLoading();
			}
		})
	}
	// 发现外围设备
	onBluetoothDeviceFound(callback) {
		// console.log('发现外围设备')
		// 侦听发现的设备
		uni.onBluetoothDeviceFound(devices => {
			// console.log('开始监听寻找到新设备的事件');
			this.getBluetoothDevices(callback);
		});
	}
	// 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
	getBluetoothDevices(callback) {
		uni.getBluetoothDevices({
			success: res => {
				// self.newDeviceLoad = false;
				// console.log('获取蓝牙设备成功:', res);
				this.deviceList = res.devices;
				callback();
			},
			fail: err => {
				// console.log('获取蓝牙设备错误，错误码：', err);
				if (err.errCode !== 0) {
					this.initTypes(err.errCode);
				}
			}
		});
	}
	//获取蓝牙设备所有服务(service)
	getBLEDeviceServices(callback) {
		let _serviceList = [];
		let deviceId = this.deviceId;
		let self = this;
		setTimeout(() => { //解决app不能得到服务的bug，500-1000
			uni.getBLEDeviceServices({
				deviceId,
				success: res => {
					for (let service of res.services) {
						if (service.isPrimary) {
							_serviceList.push(service);
						}
					}
					// console.log("_serviceList: " + JSON.stringify(_serviceList));
					if (typeof callback == "function") callback(_serviceList)
				},
				fail: err => {
					self.showToast(`获取设备Services失败:` + JSON.stringify(err));
				},
				complete: res => {
					uni.hideLoading();
				}
			});
		}, 500);
	}
	//获取蓝牙设备某个服务中所有特征值(characteristic)
	getBLEDeviceCharacteristics(serviceId) {
		let deviceId = this.deviceId;
		this.serviceId = serviceId;

		let self = this;
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceCharacteristics({
				deviceId,
				serviceId,
				success: res => {
					// console.log(res)
					for (let _obj of res.characteristics) {
						//获取readId
						if (_obj.properties.read) {
							self.readId = _obj.uuid;
						} else {
							self.readId = ''
						}
						// uni.setStorageSync('readId', self.readId);
						//获取writeId
						if (_obj.properties.write) {
							self.writeId = _obj.uuid;
						} else {
							self.writeId = ''
						}
						// uni.setStorageSync('writeId', self.writeId);
						//获取notifyId
						if (_obj.properties.notify) {
							self.notifyId = _obj.uuid;
						} else {
							self.notifyId = ''
						}
						// uni.setStorageSync('notifyId', self.notifyId);
						//获取indicateId
						if (_obj.properties.indicate) {
							self.indicateId = _obj.uuid;
						} else {
							self.indicateId = ''
						}
						// uni.setStorageSync('indicateId', self.indicateId);
					}
					let result = {
						'readId': self.readId,
						'writeId': self.writeId,
						'notifyId': self.notifyId,
						'indicateId': self.indicateId
					};
					resolve(result)
				},
				fail: err => {
					self.showToast(`getBLEDeviceCharacteristics` + JSON.stringify(err));
					reject(err);
				}
			})
		});
	}
	// 连接低功耗蓝牙
	createBLEConnection(deviceId, callback) {
		let self = this;
		this.deviceId = deviceId;
		this.isStop = false;

		uni.showLoading({
			mask: true,
			title: '设备连接中,请稍候...'
		})
		uni.createBLEConnection({
			deviceId,
			success: res => {
				if (typeof callback == "function") callback();
				// this.onBLEConnectionStateChange(callback)
			},
			fail: err => {
				self.showToast(`连接蓝牙设备失败` + JSON.stringify(err));
			},
			complete: res => {
				uni.hideLoading();
			}
		})
	}
	// 断开与低功耗蓝牙设备的连接
	closeBLEConnection() {
		let deviceId = this.deviceId;
		this.isStop = true;
		uni.closeBLEConnection({
			deviceId,
			success(res) {
				// console.log(res)
			}
		})
	}
	// 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
	onBLEConnectionStateChange(callback) {
		uni.onBLEConnectionStateChange(res => {
			// 该方法回调中可以用于处理连接意外断开等异常情况
			// console.log(`蓝牙连接状态 -------------------------->`);
			// console.log(JSON.stringify(res));
			if (!res.connected) {
				if (this.isStop) return;
				// console.log('断开低功耗蓝牙成功:');
				// this.searchLoad = false;
				// this.equipment = [];
				// this.servicesData = [];
				// this.characteristicsData = [];
				this.valueChangeData = {};
				this.showToast('已经断开当前蓝牙连接');
				if (typeof callback == "function") callback();
			}
		});
	}
	// 监听低功耗蓝牙设备的特征值变化事件。必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
	onBLECharacteristicValueChange() {
		// 必须在这里的回调才能获取
		uni.onBLECharacteristicValueChange(characteristic => {
			// console.log('监听低功耗蓝牙设备的特征值变化事件成功');
			// console.log(JSON.stringify(characteristic));
			this.valueChangeData = characteristic;
		});
	}
	// 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持 read 才可以成功调用
	readBLECharacteristicValue() {
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;
		let characteristicId = this.readId;
		// console.log(deviceId);
		// console.log(serviceId);
		// console.log(characteristicId);
		uni.readBLECharacteristicValue({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId,
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId,
			success: res => {
				// console.log('读取设备数据值成功');
				// console.log(JSON.stringify(res));
				this.notifyBLECharacteristicValueChange();
			},
			fail(e) {
				// console.log('读取设备数据值失败，错误码：' + e.errCode);
				if (e.errCode !== 0) {
					this.initTypes(e.errCode);
				}
			}
		});
		this.onBLECharacteristicValueChange();
	}
	// 向低功耗蓝牙设备特征值中写入二进制数据
	writeBLECharacteristicValue(buffer) {
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;
		let characteristicId = this.writeId;

		// console.log("this: " + JSON.stringify(this));
		return new Promise((resolve, reject) => {
			uni.writeBLECharacteristicValue({
				deviceId,
				serviceId,
				characteristicId,
				value: buffer,
				success: res => {
					// console.log('message发送成功:)', JSON.stringify(res));
					resolve(res);
				},
				fail: err => {
					// console.log('message发送失败:(', JSON.stringify(err));
					reject(err);
				}
			});
		});
	}
	// 启用低功耗蓝牙设备特征值变化时的 notify 功能
	notifyBLECharacteristicValue() {
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;
		let characteristicId = this.notifyId;

		uni.notifyBLECharacteristicValueChange({
			state: true, // 启用 notify 功能
			deviceId,
			serviceId,
			characteristicId,
			success: res => {
				uni.onBLECharacteristicValueChange((res) => {
					// console.log('特征值变化：', res)
				});
			},
			fail: res => {
				// console.log('notifyBLECharacteristicValueChange 失败:' + res.errMsg);
			}
		});
	}
	//若APP在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需进行搜索操作。
	reconnect() {
		(async () => {
			try {
				this.deviceId = this.deviceId || uni.getStorageSync("deviceId");
				this.serviceId = this.serviceId || uni.getStorageSync("serviceId");

				let result1 = await this.createBLEConnection();
				// console.log("createBLEConnection: " + JSON.stringify(result1));

				let result2 = await this.getBLEDeviceServices();
				// console.log("getBLEDeviceServices: " + JSON.stringify(result2));

				let result3 = await this.getBLEDeviceCharacteristics();
				// console.log("getBLEDeviceCharacteristics: " + JSON.stringify(result3));

				// this.writeId = uni.getStorageSync("writeId");
				// this.notifyId = uni.getStorageSync("notifyId");
			} catch (err) {
				// console.log("err: " + JSON.stringify(err));
			}

		})();
	}
}

export default Bluetooth;
