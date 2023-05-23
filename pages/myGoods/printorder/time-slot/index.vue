<template>
	<view>
		<tui-bottom-popup :show="isShow" @close="close">
			<view class="popup-main" v-if="isShow">
				
				<!-- 主体信息 -->
				<view class="trade-main">
					<view class="drawer-title f-30 col-3 t-c wrap30">
						选择上门时间
						<view class="pop-close fr" @tap="close"><text class="iconfont2 icon-shanchu1 f-38 col-9"></text></view>
					</view>
					<view class="visit-main dis-flex f-28">
						<view class="visit-left t-c">
							<template v-for="(item,index) in dayList">
								<view class="visit-left-item" :key="index" :class="dayOn==index?'on':''" @tap.stop="dayChange(index)">{{item.text}}</view>
								<!-- <text class="f-24 dis-block">{{item.date}}</text> -->
							</template>
						</view>
						<scroll-view scroll-y="true" class="visit-right flex-box p-l-30">
							<block v-for="(item,index) in timeList" :key="index">
								<template v-if="nowDate_time<item.date_stime">
									<view class="wrap30 visit-right-item" :class="timeOn==index?'on':''" @tap.stop="timeChange(index)">
										{{item.text}}
										<text v-show="timeOn==index" class="isHaveIcon iconfont2 icon-duihao fr"></text>
									</view>
								</template>
								<template v-else>
									<view class="wrap30 col-9 visit-right-item">{{item.text}}</view>
								</template>
							</block>
						</scroll-view>
					</view>
					<view class="drawer-foot-btn f-32 col-f" @tap.stop="toSure">确定</view>
				</view>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import util from "@/utils/util.js";
	// import popup from "@/components/pop-manager/index";
	export default {
		components: {
			// popup,
		},
		data() {
			return {
				isShow: false,
				dayList: [{text:'今天',date:''},{text:'明天',date:''},{text:'后天',date:''}],
				dayOn: 0,
				timeList: [
					{text:'09:00-11:00',date_s:'',date_stime:'',date_e:'',date_etime:''},
					{text:'11:00-13:00',date_s:'',date_stime:'',date_e:'',date_etime:''},
					{text:'13:00-15:00',date_s:'',date_stime:'',date_e:'',date_etime:''},
					{text:'15:00-17:00',date_s:'',date_stime:'',date_e:'',date_etime:''},
					{text:'17:00-19:00',date_s:'',date_stime:'',date_e:'',date_etime:''},
				],
				timeOn: 0,
				nowDate: '',//当前时间
				nowDate_time: '',//当前时间戳
				oldDate: '',//默认
			}
		},
		methods: {
			// 有默认值
			unit(obj,callback){
				let newDate =  new Date();
				let now = util.dateFormat('YYYY-mm-dd HH:MM:SS',newDate);
				this.nowDate = now;
				this.nowDate_time = newDate.getTime();
				this.getDayList(now);
				
				let oldDate = obj.date_start,
						oldDate_time = new Date(oldDate.replace(/\-/g, '/')).getTime(),
						oldDate_day = oldDate.slice(0,10);
				let hasDay = false;
				for(let i in this.dayList){
					if(oldDate_day == this.dayList[i].date){
						this.dayOn = i;
						this.getTimeList()
						hasDay = true;
					}
				}
				if(!hasDay){
					obj.text = obj.date_start;
					typeof callback === 'function' &&callback(obj);
					return false
				}
				for(let i in this.timeList){
					if(oldDate_time == this.timeList[i].date_stime){
						this.timeChange(i)
					}
				}
				let data = this.getData();
				// this._open(data)
				typeof callback === 'function' &&callback(data);
			},
			// 新建无数据打开
			_open(obj){
				this.isShow = true;
				if(obj.date_start!=''){
				}else{
					let newDate = new Date();
					let now = util.dateFormat('YYYY-mm-dd HH:MM:SS',newDate);
					this.nowDate = now;
					this.nowDate_time = newDate.getTime();
					this.getDayList(now);
				}
			},
			getDayList(nowDay){
				for(let i in this.dayList){
					this.dayList[i].date = this.addDateTime(nowDay,Number(i))
				}
				this.$nextTick(() => {
					this.dayChange(0);
				})
			},
			getTimeList(){
				let day = this.dayList[this.dayOn].date;
				for(let i in this.timeList){
					let text = this.timeList[i].text.slice(0,5);
					let text2 = this.timeList[i].text.slice(6);
					this.timeList[i].date_s = day+' '+text;
					this.timeList[i].date_stime = new Date((day+' '+text).replace(/\-/g, '/')).getTime();
					this.timeList[i].date_e = day+' '+text2;
					this.timeList[i].date_etime = new Date((day+' '+text2).replace(/\-/g, '/')).getTime();
				}
				
			},
			// 今明后的日期
			addDateTime(val,num) {
        let dateTime = new Date(val.replace(/\-/g, '/'));
        dateTime = dateTime.setDate(dateTime.getDate() + num);
        dateTime = new Date(dateTime);
        dateTime = util.dateFormat('YYYY-mm-dd HH:MM:SS', dateTime).slice(0,10);
//         return dateTime.toLocaleDateString();
        return dateTime;
	    },
			// 日期切换
			dayChange(index){
				this.dayOn = index;
				this.getTimeList();
				this.$nextTick(() => {
					for(let i in this.timeList){
						if(this.nowDate_time < this.timeList[i].date_stime){
							this.timeChange(i)
							return false
						}
					}
				})
			},
			//时间切换
			timeChange(index){
				this.timeOn = index;
			},
			getTime(){
				let date = this.dayList[this.dayOn].date;
				for(let i in this.timeList){
					let text = this.timeList[i].text.slice(0,4);
				}
			},
			getData(){
				let data = {
					text: this.dayList[this.dayOn].text + ' ' + this.timeList[this.timeOn].text,
					date_start: this.timeList[this.timeOn].date_s,
					date_end: this.timeList[this.timeOn].date_e
				};
				return data;
			},
			toSure(){
				let data = this.getData();
				this.close()
				this.$emit('visitChange',data)
			},
			// 新建无数据打开
			open(){
				this.isShow = true;
			},
			// 关闭
			close() {
				this.isShow = false
			},
		},
	}
</script>

<style lang="scss">
	@import 'index';
</style>
