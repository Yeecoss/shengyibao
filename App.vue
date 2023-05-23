<script>
	/**
	 * tabBar页面路径列表 (用于链接跳转时判断)
	 * tabBarLinks为常量, 无需修改
	 */
	const tabBarLinks = ['pages/banShopTip/index']; //不请求底部主题色的页面
	// ['pages/index/index', 'pages/category/index', 'pages/flow/index', 'pages/userIndex/index']; // 站点配置文件
	const banShopPage = ['pages/index/index', 'pages/category/index', 'pages/category/extend/list', 'pages/goods/index',
		'pages/bargain/index/index', 'pages/bargain/goods/index', 'pages/bargain/task/index',
		'pages/sharp/index/index', 'sharp/goods/index',
	]; // 整改店铺封禁的页面

	// 站点配置文件
	import siteinfo from "./siteinfo"; // 工具类
	// 工具类
	import util from "./utils/util";
	export default {
		/**
		 * 全局变量
		 */
		globalData: {
			scene: '',
			applets_id: 'gh_483cbc0b9340',
			// 店铺id
			wxapp_id: siteinfo.defultId,
			member: '会员',
			ios: false,
			canvaApi: null,
			backUrls: ['xr_order/buyNow', 'bargain.order/checkout', 'sharp.order/checkout', 'xr_order/cart',
				'bargain.task/help_cut', 'cart/add', 'bargain.task/partake'
			],
			wxUserInfo: {},
			myShopInfo: {},
			guideData: [], //页面引导数组
			guide: {}, //缓存的页面引导数据
			sale_id: '',
			session: {
				openid: "",
				session_key: ""
			},
			imgBaseUrl: siteinfo.imgBaseUrl,
			imgIconUrl: siteinfo.imgIconUrl,
			siteroot: siteinfo.siteroot,
			// api地址
			xapi_root: siteinfo.siteroot + 'index.php?s=/xapi/',
			homeStyle: 'div', //模板名称
			storeColor: {
				'div': `
				--storeColor: #FF7541;
			`,
				'saler': `
				--storeColor: #FF7541;
			`,
				'minishop': `
				--storeColor: #F27257;
			`,
				'sportshop': `
				--storeColor: #CB0133;
			`,
			},
			/**
			 * 小程序启动场景
			 */
			onStartupScene(query, path) {
				// 获取场景值
				let scene = this.getSceneData(query); // 记录推荐人id

				let refereeId = query.referee_id ? query.referee_id : scene.uid;
				this.sale_id = scene.sid || ''
				query.invitation_code && this.saveInvitation(query.invitation_code);
				refereeId > 0 && this.saveRefereeId(refereeId);
				let wid = query.wid ? query.wid : scene.wid;
				wid > 0 && this.saveWId(wid, path);
			},

			// 记录邀请人
			saveInvitation(invitation_code) {
				uni.setStorageSync('invitation_code', invitation_code)
			},
			toMember() {
				if (this.ios) {
					uni.navigateTo({
						url: '/pages/user/member/member-special/index'
					});
				} else {
					uni.navigateTo({
						url: '/pages/user/member/index'
					});
				}
			},
			getSystemInfo() {
				let that = this
				uni.getSystemInfo({
					success: function success(res) {
						let ios = !!(res.system.toLowerCase().search('ios') + 1);
						if (ios) {
							that.member = '权益'
							that.ios = true
						}
					}
				});
			},
			// 获取平台id
			getUniacid() {
				return siteinfo.uniacid
			},
			// 获取店铺id
			getWxappId() {
				return this.wxapp_id
			},
			// 取token
			uniShopInfo() {
				let str = wx.getStorageSync("myShopInfo")
				let wxapp_id = wx.getStorageSync("wxapp_id")
				if (str) {
					this.myShopInfo = JSON.parse(str)
				} else {
					this.myShopInfo = {}
				}
				if (wxapp_id && wxapp_id != '') {
					this.wxapp_id = wxapp_id
				} else {
					this.wxapp_id = siteinfo.defultId
				}
				wx.setStorageSync("wxapp_id", this.wxapp_id)
			},
			setMyShopInfo(shop) {
				this.myShopInfo = shop
				let str = JSON.stringify(shop)
				wx.setStorageSync("myShopInfo", str)
				let shopLock = JSON.stringify(shop) == "{}" ? 0 : 1;
				uni.setStorageSync("shopLock", shopLock)
			},
			/**
			 * 记录推荐人id
			 */
			saveRefereeId(refereeId) {
				if (!wx.getStorageSync('referee_id')) wx.setStorageSync('referee_id', refereeId);
			},
			/**
			 * 记录店铺id
			 */
			saveWId(wid, path) {
				let channel_id = wx.getStorageSync('channel_id');
				if (!channel_id) {
					wx.setStorageSync('channel_id', wid);
				}
				wx.setStorageSync('wxapp_id', wid);
				if (path == 'pages/index/index') {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {

				}
			},

			/**
			 * 获取场景值(scene)
			 */
			getSceneData(query) {
				return query.scene ? util.scene_decode(query.scene) : {};
			},
			/**
			 * 执行用户登录
			 */
			doLogin(delta, callback, isBack, noLogin) {
				let App = this
				/* #ifdef APP-PLUS  */
				// 保存当前页面
				let pages = getCurrentPages();

				if (pages.length) {
					let currentPage = pages[pages.length - 1];
					if ("pages/login/login" != currentPage.route) {
						wx.setStorageSync("currentPage", {
							route: currentPage.route
						});
					}
				}
				let url = "/pages/login/login?delta=" + (delta || 1)
				if (isBack) {
					url += '&isBack=1'
				}
				// 跳转授权页面
				uni.navigateTo({
					url: url
				});
				/* #endif */
				/* #ifdef H5 */
				if (noLogin) {
		 		callback && callback(1)
					return
				}
				let pages = getCurrentPages();

				if (pages.length) {
					let currentPage = pages[pages.length - 1];
					if ("pages/login/login" != currentPage.route) {
						wx.setStorageSync("currentPage", {
							route: currentPage.route
						});
					}
				}
				let url = "/pages/login/mobileLogin/login?delta=" + (delta || 1)
				if (isBack) {
					url += '&isBack=1'
				}
				uni.navigateTo({
					url: url
				});
				/* #endif */

				/* #ifdef MP-WEIXIN  */
				wx.showLoading();
				wx.login({
					success(res) {
						// 发送用户信息
						App._get('weixin.mini_program/getuserbycode', {
							code: res.code,
							flatform_id: App.getUniacid()
						}, result => {
							if (result.data.token == '') {
								App.session = result.data.session || {
									openid: "",
									session_key: ""
								}
								if (noLogin) {
									callback && callback(1)
									return
								}
								// 保存当前页面
								let pages = getCurrentPages();

								if (pages.length) {
									let currentPage = pages[pages.length - 1];
									if ("pages/login/login" != currentPage.route) {
										wx.setStorageSync("currentPage", {
											route: currentPage.route
										});
									}
								}
								let url = "/pages/login/login?delta=" + (delta || 1)
								if (isBack) {
									url += '&isBack=1'
								}
								// 跳转授权页面
								uni.navigateTo({
									url: url
								});
							} else {
								wx.setStorageSync('token', result.data.token);
								wx.setStorageSync('user_id', result.data.user.user_id);
								App.bindMbid();
								if (result.data.shop) {
									App.setMyShopInfo(result.data.shop)
									// App.wxapp_id = result.data.shop.wxapp_id;
								} else {
									App.setMyShopInfo({})
								}
								callback && callback()

								// 更新主题tabbar
								App.$store.commit('getTheme', App)
								// App.getTheme()
							}
						}, false, () => {
							wx.hideLoading();
						});
					},
					fail(res) {
						// console.log(res)
						wx.hideLoading();
					},
					complete(res) {
						console.log(res)
					}
				});
				/* #endif */
			},

			/**
			 * 当前用户id
			 */
			getUserId() {
				return wx.getStorageSync('user_id');
			},
			// 页面是否引导过
			isGride(field) {
				return !this.guide[field]
			},
			setGride(field) {
				this.guide[field] = 1
				let str = JSON.stringify(this.guide)
				wx.setStorageSync('guide', str)
			},
			getGride() {
				// let str = wx.getStorageSync('guide') || '{}'
				// this.guide = JSON.parse(str);
				// this._get('shop.guide_pages/init', {}, res => {
				// 	this.guideData = res.pages || [];
				// })
			},
			/**
			 * 显示成功提示框1
			 */
			showSuccess(msg, callback) {
				// #ifdef H5 || MP
				wx.showToast({
					title: msg,
					icon: 'success',
					mask: true,
					duration: 1500,

					success() {
						callback && setTimeout(function() {
							callback();
						}, 1500);
					}

				});
				// #endif
				// #ifdef APP-PLUS
				plus.nativeUI.toast(msg, {
					align: 'center',
					duration: 1500
				})
				callback && setTimeout(function() {
					callback();
				}, 1500);
				// #endif
			},

			/**
			 * 显示失败提示框
			 */
			showError(msg, callback) {
				wx.showModal({
					title: '友情提示',
					content: msg,
					showCancel: false,

					success(res) {
						// callback && (setTimeout(function() {
						//   callback();
						// }, 1500));
						callback && callback();
					}

				});
			},

			/**
			 * 新get请求
			 */
			_get(url, data, success, fail, complete, check_login, noLogin) {
				// wx.showNavigationBarLoading();

				let _this = this; // 构造请求参数


				data = data || {};
				this.getBaseParam(url, data)
				//   check_login = true;
				// 构造get请求

				let request = function() {
					wx.request({
						url: _this.xapi_root + url,
						header: {
							'content-type': 'application/json'
						},
						data: data,

						success(res) {
							if (res.statusCode !== 200 || typeof res.data !== 'object') {
								// console.log(res);

								_this.showError('网络请求出错');

								return false;
							}
							// 店铺整改状态判断
							if (res.data.code == 1002) {
								// let pages = getCurrentPages();							// let currentPage = pages[pages.length - 1].route;
								// if(banShopPage.indexOf(currentPage)!=-1){
								uni.navigateTo({
									url: `/pages/banShopTip/index?data=${res.data.msg}&type=${res.data.data.type}`
								})
								// }

								return false;
							}
							if (res.data.code === -1 && !noLogin) {
								// 登录态失效, 重新登录
								// wx.hideNavigationBarLoading();
								let isBack = false
								if (_this.backUrls.indexOf(url) != -1) {
									isBack = true
								}
								_this.doLogin(2, () => {
									_this._get(url, data, success, fail, complete, check_login)
								}, isBack);
							} else if (res.data.code === 0) {
								_this.showError(res.data.msg, function() {
									fail && fail(res);
								});

								return false;
							} else {
								success && success(res.data);
							}
						},

						fail(res) {
							_this.showError('啊哦！网络开小差了，请重试一次！', function() {
								fail && fail(res);
							});
						},

						complete(res) {
							wx.hideNavigationBarLoading();
							complete && complete(res);
						}

					});
				}; // 判断是否需要验证登录


				check_login ? _this.doLogin(request) : request();
			},
			// 获取基础参数
			getBaseParam(url, data) {
				data.token = wx.getStorageSync('token');
				if (url.indexOf('shop.') == -1 && url.indexOf('cart') == -1 && url.indexOf('user') == -1 && url.indexOf(
						'wxapp/lists') == -1 && !data.wxapp_id) {
					data.wxapp_id = this.wxapp_id;
				}
			},
			/**
			 * 新post提交
			 */
			_post_json_form(url, data, success, fail, complete, isShowNavBarLoading, noLogin) {
				let _this = this;

				isShowNavBarLoading || true;
				_this.getBaseParam(url, data)
				// 在当前页面显示导航条加载动画
				// data.token = 'b2932d259a59097344a5100603528cbd';

				if (isShowNavBarLoading == true) {
					wx.showNavigationBarLoading();
				}
				// console.log(JSON.stringify(data))
				wx.request({
					url: _this.xapi_root + url,
					header: {
						'content-type': 'application/json'
					},
					method: 'POST',
					data: data,

					success(res) {
						if (url == 'user/visit') {
							return false;
						}

						if (res.statusCode !== 200 || typeof res.data !== 'object') {
							_this.showError('网络请求出错', function() {
								fail && fail(res);
							});
							return false;
						}

						if (res.data.code === -1 && !noLogin) {
							// 登录态失效, 重新登录
							wx.hideNavigationBarLoading();

							let isBack = false
							if (_this.backUrls.indexOf(url) != -1) {
								isBack = true
							}
							_this.doLogin(1, () => {
								_this._post_form(url, data, success, fail, complete, isShowNavBarLoading)
							}, isBack);

							return false;
						} else if (res.data.code === 0) {
							_this.showError(res.data.msg, function() {
								fail && fail(res);
							});

							return false;
						}

						success && success(res.data);
					},

					fail(res) {
						// console.log(res);
						_this.showError('啊哦！网络开小差了，请重试一次！', function() {
							fail && fail(res);
						});
					},

					complete(res) {
						wx.hideNavigationBarLoading(); // wx.hideLoading();

						complete && complete(res);
					}

				});
			},
			_post_form(url, data, success, fail, complete, isShowNavBarLoading, noLogin) {
				let _this = this;

				isShowNavBarLoading || true;
				_this.getBaseParam(url, data)
				// 在当前页面显示导航条加载动画
				// data.token = 'b2932d259a59097344a5100603528cbd';

				if (isShowNavBarLoading == true) {
					wx.showNavigationBarLoading();
				}
				// console.log(JSON.stringify(data))
				wx.request({
					url: _this.xapi_root + url,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
					data: data,

					success(res) {
						if (url == 'user/visit') {
							return false;
						}

						if (res.statusCode !== 200 || typeof res.data !== 'object') {
							_this.showError('网络请求出错', function() {
								fail && fail(res);
							});
							return false;
						}

						if (res.data.code === -1 && !noLogin) {
							// 登录态失效, 重新登录
							wx.hideNavigationBarLoading();

							let isBack = false
							if (_this.backUrls.indexOf(url) != -1) {
								isBack = true
							}
							_this.doLogin(1, () => {
								_this._post_form(url, data, success, fail, complete, isShowNavBarLoading)
							}, isBack);

							return false;
						} else if (res.data.code === 0) {
							_this.showError(res.data.msg, function() {
								fail && fail(res);
							});

							return false;
						}

						success && success(res.data);
					},

					fail(res) {
						// console.log(res);
						_this.showError('啊哦！网络开小差了，请重试一次！', function() {
							fail && fail(res);
						});
					},

					complete(res) {
						wx.hideNavigationBarLoading(); // wx.hideLoading();

						complete && complete(res);
					}

				});
			},
			uploadFile(obj) {
				let params = {};
				let url = ''
				if (obj.isShop) {
					params = {
						token: wx.getStorageSync('token')
					}
					url = 'shop.upload/image'
				} else {
					params = {
						wxapp_id: this.wxapp_id,
						token: wx.getStorageSync('token')
					}
					url = 'upload/image'
				}
				if (obj.params) {
					params = Object.assign(params, obj.params)
				}
				if (!obj.noLoad) {
					uni.showLoading({
						title: '上传中...'
					});
				}
				uni.uploadFile({
					url: this.xapi_root + url,
					filePath: obj.filePath,
					name: 'iFile',
					formData: params,
					success: (res) => {
						let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
						obj.success(result)
					},
					fail: (res) => {
						this.showError(res.errMsg, () => {
							obj.fail && obj.fail(res);
						});
					},
					complete: (res) => {
						if (!obj.noLoad) {
							uni.hideLoading();
						}
						obj.complete && obj.complete(res)
					}
				});
			},
			/**
			 * 验证是否存在user_info
			 */
			validateUserInfo() {
				let user_info = wx.getStorageSync('user_info');
				return !!wx.getStorageSync('user_info');
			},
			// #ifdef MP
			/**
			 * 小程序主动更新
			 */
			updateManager() {
				if (!wx.canIUse('getUpdateManager')) {
					return false;
				}

				const updateManager = wx.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) { // 请求完新版本信息的回调
					// console.log(res.hasUpdate)
				});
				updateManager.onUpdateReady(function() {
					wx.showModal({
						title: '更新提示',
						content: '新版本已经准备好，即将重启应用',
						showCancel: false,

						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}

					});
				});
				updateManager.onUpdateFailed(function() {
					// 新的版本下载失败
					wx.showModal({
						title: '更新提示',
						content: '新版本下载失败',
						showCancel: false
					});
				});
			},

			// #endif
			/**
			 * 获取tabBar页面路径列表
			 */
			getTabBarLinks() {
				return tabBarLinks;
			},

			/**
			 * 跳转到指定页面
			 * 支持tabBar页面
			 */
			navigationTo(url) {
				if (!url || url.length == 0) {
					return false;
				}

				let tabBarLinks = this.getTabBarLinks(); // tabBar页面
				if (tabBarLinks.indexOf(url) > -1) {
					uni.switchTab({
						url: '/' + url
					});
				} else {
					// 普通页面
					uni.navigateTo({
						url: '/' + url
					});
				}
			},

			/**
			 * 记录formId
			 * (因微信模板消息已下线，所以formId取消不再收集)
			 */
			saveFormId(formId) {
				return true; // let _this = this;
				// console.log('saveFormId');
				// if (formId === 'the formId is a mock one') {
				//   return false;
				// }
				// _this._post_form('wxapp.formId/save', {
				//   formId: formId
				// }, null, null, null, false);
			},

			/**
			 * 生成转发的url参数
			 */
			getShareUrlParams(params) {
				let _this = this;

				return util.urlEncode(Object.assign({
					referee_id: _this.getUserId()
				}, params));
			},

			/**
			 * 发起微信支付
			 */
			wxPayment(option) {
				let options = Object.assign({
					payment: {},
					success: () => {},
					fail: () => {},
					complete: () => {}
				}, option);
				wx.requestPayment({
					timeStamp: options.payment.timeStamp,
					nonceStr: options.payment.nonceStr,
					package: 'prepay_id=' + options.payment.prepay_id,
					signType: 'MD5',
					paySign: options.payment.paySign,

					success(res) {
						options.success(res);
					},

					fail(res) {
						options.fail(res);
					},

					complete(res) {
						options.complete(res);
					}

				});
			},

			/**
			 * 验证登录
			 */
			checkIsLogin() {
				return wx.getStorageSync('token') != '' && wx.getStorageSync('user_id') != '';
			},

			/**
			 * 授权登录
			 */
			getUserInfo(e, callback) {
				let App = this;

				wx.showLoading({
					title: "正在登录",
					mask: true
				});
				// 执行微信登录
				// 发送用户信息
				let invitation_code = uni.getStorageSync('invitation_code') || ''
				// console.log(invitation_code)
				let obj = {
					code: e.code,
					encrypted_data: App.wxUserInfo.encryptedData || '',
					iv: App.wxUserInfo.iv || '',
					signature: App.wxUserInfo.signature || '',
					referee_id: wx.getStorageSync('referee_id'),
					invitation_code: invitation_code,
					phone: e.phone,
					sessionKey: App.session.session_key || '',
					wxapp_id: App.wxapp_id,
					flatform_id: App.getUniacid()
				}
				// #ifdef MP
				let scene = uni.getStorageSync('scene')
				if (scene) {
					obj.scene = scene
				}
				// #endif
				App._post_form('user/codelogin', obj, result => {
					// 记录token user_id
					wx.setStorageSync('token', result.data.token);
					wx.setStorageSync('user_id', result.data.user.user_id);
					App.bindMbid();

					if (result.data.shop) {
						App.setMyShopInfo(result.data.shop)
					} else {
						App.setMyShopInfo({})
					}
					// 店铺id,暂不对接
					// wx.setStorageSync('uniacid', result.data.uniacid);
					// 执行回调函数
					callback && callback(result.data);

					// 更新主题tabbar
					App.$store.commit('getTheme', App)
				}, false, () => {
					wx.hideLoading();
				});
			},
			// 赚一赚c绑b
			bindMbid() {
				let mbidObj = uni.getStorageSync('mbidObj') || '{}';
				mbidObj = JSON.parse(mbidObj);
				if (mbidObj.mbid && mbidObj.mbid != '' && mbidObj.mbid != 'undefined') {
					this._get('weixin.mini_program/bindClient', mbidObj, res => {
						if (res.code == 1) {
							if (res.data.code == 1) {
								uni.removeStorageSync('mbidObj')
							}
						}
					})
				}
			},

		},

		/**
		 * 生命周期函数--监听小程序初始化
		 */
		onLaunch(e) {
			// this.globalData.$bus = this.$bus;
			// this.globalData.getTheme()

			// console.log(e)
			// 小程序主动更新
			// #ifdef MP || H5
			// #ifdef MP
			this.globalData.updateManager(); // 小程序启动场景
			this.globalData.scene = e.scene
			let scene = uni.getStorageSync('scene')
			if (!scene) {
				uni.setStorageSync('scene', scene)
			}
			if (!wx.cloud) {
				// console.error('请使用 2.2.3 或以上的基础库以使用云能力')
			} else {
				// 初始化云函数
				wx.cloud.init({
					//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
					env: 'kaidanxia-9g5x960f4f08889b',
					traceUser: true,
				})
			}
			// #endif
			this.globalData.getSystemInfo()
			// #endif
			// #ifdef APP-PLUS
			this.appUpdata.checkUpdate()
			// #endif
			// this.$store.commit('getGride',this.globalData)

		},

		/**
		 * 当小程序启动，或从后台进入前台显示，会触发 onShow
		 */
		onShow(e) {
			this.globalData.getGride()
			// 更新主题tabbar
			let pages = getCurrentPages();
			let currentPage = e.path;
			if (tabBarLinks.indexOf(currentPage) == -1) {
				this.globalData.$store = this.$store;
				this.$store.commit('getTheme', this.globalData)
			}
			// 获取小程序基础信息
			// console.log(e)
			if (e) {
				this.globalData.onStartupScene(e.query, e.path);
			}
			this.globalData.uniShopInfo()

			// this.getWxappBase();
			// wx.setStorageSync('uniacid', defultId)
			// this.globalData.uniacid = wx.getStorageSync('uniacid') || defultId
			// this.globalData.shopName = wx.getStorageSync('shopName') || '渠道商城'
		},
		methods: {}
	};
</script>
<style lang="scss">
	@import "./app.scss";

	// v2.0
	// 自定义多选框
	// /* #ifdef H5 */
	.check-wrap checkbox .uni-checkbox-input,
	.check-wrap checkbox .uni-checkbox-input:hover {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50% !important;
		color: #ffffff !important;
		background: rgba(0, 0, 0, 0.3);
		border: 1rpx solid #fff;
	}

	.default-check checkbox .uni-checkbox-input,
	.default-check checkbox .uni-checkbox-input:hover {
		background: #fff;
		border-color: #999;
	}

	.check-wrap checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #fff;
		border-color: $red;
		background: $red;
	}

	.check-wrap checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
		font-size: 28rpx;
	}

	// 自定义单选框
	/* 未选中的 背景样式 */
	.radio radio .uni-radio-input,
	.radio radio .uni-radio-input:hover {
		height: 30rpx;
		width: 30rpx;
		border-radius: 50%;
		border-color: #999;
		background: transparent;
	}

	/* 选中后的 背景样式 */
	.radio radio .uni-radio-input.uni-radio-input-checked {
		background-color: $red !important;
		border-color: $red !important;
	}

	/* 选中后的 对勾样式 */
	.radio radio .uni-radio-input.uni-radio-input-checked::before {
		border-radius: 50%;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		font-size: 30rpx;
		color: #fff;
		background: #f42424;
		border: 8rpx solid #f42424;
	}

	// /* #endif */
	/* #ifdef MP-WEIXIN || APP-PLUS */
	.check-wrap checkbox .wx-checkbox-input,
	.check-wrap checkbox .wx-checkbox-input:hover,
	.check-wrap checkbox .uni-checkbox-input,
	.check-wrap checkbox .uni-checkbox-input:hover {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50% !important;
		color: #ffffff !important;
		background: rgba(0, 0, 0, 0.3);
		border: 1rpx solid rgba(255, 255, 255, 1);
	}

	.default-check checkbox .wx-checkbox-input,
	.default-check checkbox .wx-checkbox-input:hover,
	.default-check checkbox .uni-checkbox-input,
	.default-check checkbox .uni-checkbox-input:hover {
		background: #fff;
		border-color: #999;
	}

	.check-wrap checkbox .wx-checkbox-input.wx-checkbox-input-checked,
	.check-wrap checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #fff;
		border-color: $red !important;
		background: $red !important;
	}

	.check-wrap checkbox .wx-checkbox-input.wx-checkbox-input-checked::before,
	.check-wrap checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
		font-size: 28rpx;
	}

	// 单选
	/* 未选中的 背景样式 */
	.radio-group radio .wx-radio-input,
	.radio radio .wx-radio-input:hover,
	.radio-group radio .uni-radio-input,
	.radio radio .uni-radio-input:hover {
		height: 30rpx;
		width: 30rpx;
		border-radius: 50%;
		border-color: #999;
		background: transparent;
	}

	/* 选中后的 背景样式 */
	.radio-group radio .wx-radio-input.wx-radio-input-checked,
	.radio-group radio .uni-radio-input.uni-radio-input-checked {
		// border: 1rpx solid transparent;
		background-color: $red !important;
		border-color: $red !important;
	}

	/* 选中后的 对勾样式 */
	.radio-group radio .wx-radio-input.wx-radio-input-checked::before,
	.radio-group radio .uni-radio-input.uni-radio-input-checked::before {
		border-radius: 50%;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		font-size: 30rpx;
		color: #fff;
		background: #f42424;
		border: 6rpx solid #f42424;
	}

	/* #endif */
</style>
