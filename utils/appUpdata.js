/**
 * app更新机制
 */
// 站点配置文件
import siteinfo from "../siteinfo"; // 工具类

module.exports = {
	checkUpdate() {
		var wgtVer=null;
		function plusReady(){  
			// ......  
			// 获取本地应用资源版本号  
			plus.runtime.getProperty(plus.runtime.appid,function(inf){  
				wgtVer=inf.versionCode;  
				// console.log("当前应用版本："+ JSON.stringify(inf));
				// console.log("当前应用版本："+wgtVer);
				checkUpdate()
			});  
		}  
		if(plus){  
			plusReady();  
		}else{  
			document.addEventListener('plusready',plusReady,false);  
		}
		// 检测更新  1
		function checkUpdate(){  
			plus.nativeUI.showWaiting("检测更新...");
			wx.request({
			  url: siteinfo.siteroot + 'index.php?s=/xapi/setting.package/update',
			  // 暂时写死线下地址
			//   url: 'https://dev-shop.kaidanxia.com/index.php?s=/xapi/setting.package/update',
			  header: {
				'content-type': 'application/x-www-form-urlencoded'
			  },
	  
			  success(res) {
				  if (res.data.code == 1) {
					 if (res.data.data.packages) {
						let list = res.data.data.packages.list || []
						let appUp = ''
						let miniList = []
						for( var i=0; i<list.length; i++ ) {
							if (list[i]) {
								let version_number = list[i].version_number
								if (version_number > wgtVer) {
									appUp = list[i].download
									break
								}
							}
						}
						let next = () => {
							plus.nativeUI.closeWaiting();
							plus.nativeUI.alert("应用资源更新完成！",function(){  
								plus.runtime.restart();  
							});
						}
						if (appUp != '') {
							plus.nativeUI.showWaiting("更新文件(0/1)...");  
							downWgt(appUp, next)
						} else {
							for( var i=0; i<list.length; i++ ) {
								if (list[i]) {
									if (list[i].child) {
										let isHave = false
										for( var j=0; j < list[i].child.length; j++ ) {
											let version_number = list[i].child[j].version_number
											if (version_number > wgtVer) {
												miniList.push(list[i].child[j].download)
												isHave = true
												break
											}
										}
										if (isHave) {
											break
										}
									}
								}
							}
							let num = 0
							let next1 = () => {
								num ++
								if (num >= miniList.length) {
									next()
									return
								}
								run()
							}
							let run = () => {
								plus.nativeUI.showWaiting("更新文件(" + num + "/" + miniList.length + ")...");  
								downWgt(miniList[num], next1)
							}
							if (miniList.length > 0) {
								run()
							}
						}
					 }
				  }
			  },

			  fail(res) {
			  },
	  
			  complete(res) {
			  }
			})
		}// 下载wgt文件  
		function downWgt(wgtUrl, next){
			// console.log(wgtUrl)
			plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
				if ( status == 200 ) {   
					// console.log("下载成功："+d.filename);  
					installWgt(d.filename, next); // 安装wgt包  
				} else {  
					// console.log("下载失败！");  
					plus.nativeUI.alert("下载失败！请重启应用，或者至应用市场重新下载安装最新版本！");  
				}
			}).start();  
		}
		// 更新应用资源  
		function installWgt(path, next){  
			plus.runtime.install(path,{force: true},function(){  
				// console.log("安装差异文件成功！");  
				next()
			},function(e){  
				plus.nativeUI.closeWaiting();  
				// console.log("安装差异文件失败["+e.code+"]："+e.message);  
				plus.nativeUI.alert("安装差异文件失败["+e.code+"]："+e.message);  
			});  
		}
	}
};