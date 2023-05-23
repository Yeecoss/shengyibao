import Vue from 'vue';
import store from "./store/index";

import App from './App';
import tui from './utils/httpRequest'
import appUpdata from './utils/appUpdata'
// import EventBus from './utils/EventBus'

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	/* #ifndef APP-PLUS */
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
    /* #endif */
	/* #ifdef APP-PLUS */
	plus.nativeUI.toast(title, {
		align: 'center',
		duration: 1500
	})
    /* #endif */
	return;
}
/* #ifdef H5 */
const s = document.createElement('script');
s.type = 'text/javascript';
s.src = 'https://sdk.canva.cn/v2/beta/api.js';
document.body.appendChild(s);
/* #endif */
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$api = {msg};
/* #ifdef APP-PLUS */
Vue.prototype.$nextTick = (next) => {
	setTimeout(next)
};
/* #endif */
Vue.prototype.tui = tui
Vue.prototype.appUpdata = appUpdata
// Vue.prototype.$bus = new EventBus()


Vue.mixin({
	methods: {
		setData: function(obj, callback) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				})
			});
			callback && callback();
		}
	}
});

App.mpType = 'app';

const app = new Vue({
    ...App,
		store
});
app.$mount();
