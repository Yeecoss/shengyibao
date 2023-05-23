// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'getUrlScheme': {
      return getUrlScheme(event.options)
    }
  }

  return 'action not found'
}

async function getUrlScheme(options) {
	let query = 'wid=' + options.wid + '&goods_id=' + options.goods_id
	return cloud.openapi.urlscheme.generate({
		jumpWxa: {
			path: '/pages/goods/index', // <!-- replace -->
			query: query
		},
		// 如果想不过期则置为 false，并可以存到数据库
		isExpire: false
	})
}