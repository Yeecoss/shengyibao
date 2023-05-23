import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const tabbar = [{
	icon: 'icon-Fill1',
	minishop_icon: 'icon-homepage1',
	minishop_icon2: 'icon-homepage2',
	sportshop_icon: 'icon-homepage',
	active_color: '',
	disable_color: '',
	text: '首页',
	url: '/pages/index/index'
}, {
	icon: 'icon-classification3',
	minishop_icon: 'icon-classification2',
	minishop_icon2: 'icon-classification11',
	sportshop_icon: 'icon-classification4',
	active_color: '',
	disable_color: '',
	text: '分类',
	url: '/pages/category/index'
}, {
	icon: 'icon-bianzu',
	minishop_icon: 'icon-my1',
	minishop_icon2: 'icon-my2',
	sportshop_icon: 'icon-my',
	active_color: '',
	disable_color: '',
	text: '我的',
	url: '/pages/userIndex/index'
}, ];
const store = new Vuex.Store({
	state: {
		theme: '', //主题
		tabbarList: [], //主题tabbar
		isGiveMember: true, //送会员活动
		optimizateSearch: '',
	},
	mutations: {
		// 获取主题tabbar
		getTheme(state, app) {
			state.theme = {
				// name: theme.name,
				color: '#FF7541',
				themeStyle: '--color: #FF7541'
			}
			state.tabbarList = tabbar;
		},
		// 送会员活动状态
		changeGiveMember(state, aa) {
			this.state.isGiveMember = aa;
		},
		// 送会员活动状态
		changeData(state, data) {
			this.state[data.k] = data.v || '';
		},
	},
	actions: {

	},
	modules: {

	}
})

export default store
