<template>
	<view>
		<tui-modal :show="showModal" @cancel="_close" :custom="true" fadeIn padding="0" width="80%" radius="20rpx" :maskClosable="false">
			<view class="tui-modal-custom model-main">
				<view class="tui-prompt-title t-c f-32 col-f">活动场次</view>
				<scroll-view scroll-y class="times-main">
					<view class="times-item dis-flex t-c f-28">
						<view>日期</view>
						<view>时间</view>
						<view>状态</view>
					</view>
					<template v-for="(item,index) in timeList">
						<view class="times-item t-c f-26 dis-flex" :class="item.expired=='已结束'?'gray-item':''" :key="index"><!-- {{timeList[index-1].date}} -->
							<template v-if="index==0">
								<view class="times-date on">{{item.date}}</view>
							</template>
							<view v-else class="times-date" :class="item.date==timeList[index-1].date?'':'on'">{{item.date}}</view>
							<view class="">{{item.time}}</view>
							<view class="status" :class="item.expired=='已开始'?'red-item':''">{{item.expired}}</view>
						</view>
					</template>
				</scroll-view>
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
				timeList:[
					// {id:22,date:'11月22日',data:[{time:'16:00',status:{text:'已结束'}},{time:'18:00',status:{text:'已开始'}}]},
					// {id:24,date:'11月23日',data:[{time:'16:00',status:{text:'即将开始'}},{time:'18:00',status:{text:'即将开始'}}]},
					// {id:25,date:'11月24日',data:[{time:'18:00',status:{text:'即将开始'}}]},
				],
			}
		},
		methods:{
			_open(data){
				this.showModal = true;
				this.timeList = JSON.parse(data)||[];
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
