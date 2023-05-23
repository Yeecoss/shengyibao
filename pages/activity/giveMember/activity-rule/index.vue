<template>
	<view>
		<tui-modal :show="showModal" @cancel="_close" :custom="true" fadeIn padding="0" width="80%" radius="20rpx" :maskClosable="false">
			<view class="tui-modal-custom model-main">
				<view class="tui-prompt-title t-c f-32 col-f">活动规则</view>
				<view class="rule-main-wrap">
					<scroll-view scroll-y class="rule-main">
						<template v-for="(item,index) in ruleList">
							<navigator v-if="item.index==4" :key="index" url="/pages/activity/giveMember/areaAddress/areaAddress" hover-class="none" class="rule-item dis-flex">
								<view class="rule-index f-26 col-f">{{item.index}}</view>
								<view class="rule f-28 flex-box oh app-red">{{item.text}}</view>
							</navigator>
							<view v-else class="rule-item dis-flex">
								<view class="rule-index f-26 col-f">{{item.index}}</view>
								<view class="rule f-28 flex-box oh">{{item.text}}</view>
							</view>
						</template>
					</scroll-view>
				</view>
				<view class="sure-btn" @tap="_close">知道了</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				showModal: false,
				ruleList:[
					{index:1,text:'生意宝有虾米版、明虾版、龙虾版三个版本，本次活动为限时限量抢【龙虾会员】活动'},
					{index:2,text:'参加条件：需认证身份后才能参加活动'},
					{index:3,text:'开放时间：以活动单页公告时间为准'},
					{index:4,text:'本次开放区域，请查看详情>>'},
				]
			}
		},
		methods:{
			_open(){
				this.showModal = true
			},
			_close(){
				this.showModal = false
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
