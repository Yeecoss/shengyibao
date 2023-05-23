<template>
	<view>
		<image v-for="item in arr" :key="item.name" :src="item.url" mode="widthFix"></image>
	</view>
</template>

<script>
    const App = getApp().globalData; // 工具类
	export default {
		data() {
			return {
				arr: [{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715155646489ee6716.png',
            name: '虾米' + App.member
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151556481c3d97259.png',
            name: '明虾' + App.member
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715155648800ca7992.png',
            name: '龙虾' + App.member + '背景'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715155649423a99239.png',
            name: '龙虾' + App.member
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151556493a6148442.png',
            name: '虾米' + App.member + '背景'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715155649918a22091.png',
            name: '明虾' + App.member + '背景'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165434dce329129.png',
            name: '浮层-同步到自己店铺'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163054a8e6b6599.png',
            name: '浮层-知道啦'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151630530c8ef3092.png',
            name: '店铺-运费模板'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165434757fb6978.png',
            name: '浮层-新增商品草稿'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163053362b81663.png',
            name: '店铺-优惠券'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151630524f53d0093.png',
            name: '浮层-新增商品'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165430393485519.png',
            name: '浮层-列表页下载'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163050fc5db5635.png',
            name: '浮层-新增商品'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805180251bb64a6783.png',
            name: '浮层-渠道商品'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805180250b20548053.png',
            name: '浮层-渠道推广'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/202008051802492b2516809.png',
            name: '浮层-渠道申请'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805190801e145f1289.png',
            name: '浮层-渠道禁用'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805180248bd3ed9784.png',
            name: '浮层-渠道优惠价'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/2020071516304802cda7597.png',
            name: '店铺-渠道'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151630495f1b37716.png',
            name: '浮层-下一步'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151630492955a2604.png',
            name: '店铺-物流公司'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654251522e9769.png',
            name: '浮层-评论'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165427cacfe7718.png',
            name: '浮层-列表页同步'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/2020071516304560f932860.png',
            name: '浮层-跳过引导'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654260524a7308.png',
            name: '浮层-首页店铺分类'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654330837e5239.png',
            name: '浮层-首页当前店铺'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/2020071816542488ed85595.png',
            name: '浮层-店铺列表5'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165426112b82100.png',
            name: '浮层-店铺列表6'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/2020071816542267ccf0544.png',
            name: '浮层-店铺列表1'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/2020071816542316fe52172.png',
            name: '浮层-店铺列表4'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/202007151630403f6b69632.png',
            name: '店铺-满额包邮'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165423ec2ed4092.png',
            name: '浮层-店铺列表2'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654224e6bc8590.png',
            name: '浮层-店铺列表'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163039610006271.png',
            name: '店铺-交易设置'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/20200718165418d73d29430.png',
            name: '店铺-浏览轨迹'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654201bc440943.png',
            name: '浏览轨迹-总消费'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163036048437360.png',
            name: '店铺-回收站'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654214c25a9755.png',
            name: '浮层-关注1'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-18/202007181654183aad01264.png',
            name: '浮层-关注2'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163035803d13503.png',
            name: '浮层-新增商品提示文字1'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163034b2a310692.png',
            name: '浮层-新增商品-多规格异价'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163034073089180.png',
            name: '浮层-列表页推荐背景'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163033a7f4e9687.png',
            name: '浮层-新增商品提示文字2'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163033d5b4e6395.png',
            name: '浮层-新增商品-多规格同价'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163032afe823416.png',
            name: '浮层-浏览轨迹详情'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/20200715163032fd75c0952.png',
            name: '店铺-退货地址'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/2020071516303155b249177.png',
            name: '浮层-列表页背景'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-15/2020071516303195df70268.png',
            name: '浮层-列表页热销背景'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-27/202007271420236463a6992.png',
            name: '背景1'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-27/20200727142024a3eb13276.png',
            name: '背景2'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-27/20200727142024bae434224.png',
            name: '背景3'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805200304f8c9b3967.png',
            name: '背景1'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805200303949951077.png',
            name: '背景2'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/2020080520030364b748256.png',
            name: '背景3'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-29/202007291344032deeb5138.png',
            name: '作图神器'
        },{
            url: 'https://pic.kaidanxia.com/2020-09-11/161201d3cd88318.gif',
            name: '作图神器'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/202007311034167e5671581.png',
            name: '个人中心-分享'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/202007311035365c6791091.png',
            name: '个人中心-我的资料'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/20200731103533dc9a80221.png',
            name: '个人中心-官方客服'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/20200731103534b409b9863.png',
            name: '个人中心-建议反馈'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-08/20200808201949543dc7159.png',
            name: '浮层-优选主页'
        },{
            url: 'https://pic.kaidanxia.com/2020-08-17/202008171920087a9673946.png',
            name: '浮层-店铺龙虾'
        },{
            url: 'https://pic.kaidanxia.com/2020-08-17/20200817192014112824609.png',
            name: '浮层-店铺明虾'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/20200731113046364285493.png',
            name: '店铺虾米'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/20200731113045279190420.png',
            name: '店铺明虾'
        },{
            url: 'http://pic.kaidanxia.com/2020-07-31/20200731113046b10e60526.png',
            name: '店铺龙虾'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805195449884f79216.png',
            name: '店铺虾米'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/202008051954507c3a34541.png',
            name: '店铺明虾'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805195451c81036633.png',
            name: '店铺龙虾'
        },{
            url: 'http://pic.kaidanxia.com/2020-08-05/20200805201111c9c2f4192.png',
            name: '无数据-分享申请'
        },]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
