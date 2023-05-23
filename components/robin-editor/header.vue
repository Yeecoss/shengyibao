<template>
	<div>
		<view class="head dis-flex flex-y-center flex-x-between">
			<view class="btn" @tap="cancel" v-if="labelCancel">{{labelCancel}}</view>
			<view @tap="tocanva" class="canvas" v-if="showCanva">
				  作图神器
				  <text class="canvasIcon iconfont2 icon-gengduobeifen2"></text>
			</view>
			<view class="btn" @tap="save" v-if="labelConfirm">{{labelConfirm}}</view>
		</view>
		<canva ref="canva" v-if="showCanva"></canva>
	</div>
</template>

<script>
	import canva from "./canva";
    export default {
        props:{
           labelCancel:{
               type:String,
               default:"取消"
           },
           labelConfirm:{
               type:String,
               default:"确定"
           },
           showCanva: {
               type: Boolean,
               default: false
           }
        },
        components: {
            canva
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        methods:{
            save:function(){
                this.$emit('save')
            },
            tocanva() {
                /* #ifdef H5 || APP-PLUS */
                this.$refs.canva.open(false, (url) => {
                    this.$emit('addHtml', url)
                })
                /* #endif */

                /* #ifdef MP-WEIXIN */
                uni.navigateToMiniProgram({
                    appId: 'wx47bb17ae9c1d7bd3',
                    path: 'pages/anonymous-templates/anonymous-templates',
                    envVersion: 'release',
                    success: () => {
                        // console.log('success')
                    },
                    fail: () => {
                        // console.log('fail')
                    },
                    complete: () => {
                        // console.log('complete')
                    },
                })
                /* #endif */
            }
        }
    }
</script>

<style lang="scss" scoped>
    .head {
		display: flex;
		justify-content: space-between;
		width: 100%;
		// height: 100%;
		border-bottom: 1px #eee solid;
		// box-shadow: 1px 0 2px rgba(0, 0, 0, 0.1);
		background: #fff;
        .btn {
            display: block;
            width: 150upx;
            height: 80upx;
            line-height: 80upx;
            font-size: 30upx;
            color: #666;
            padding-left: 20upx;
            text-align: center;
            &.left{
              float: left;  
            }
            &.right{
                float: right;
            }
        }
        .canvas{
            height: 64rpx;
            line-height: 64rpx;
            color: #F8B14A;
            font-size: 30rpx;
            .canvasIcon{
                display: inline-block;
                color: white;
                width: 40rpx;
                height: 40rpx;
                line-height: 40rpx;
                text-align: center;
                background: #F8B14A;
                border-radius: 50%;
                font-size: 24rpx;
                transform:scale(0.75);
                transform-origin:50% 20%;
            }
        }
        // .tocanva{
        //     width: 200rpx;
        //     height: 64rpx;
        //     line-height: 64rpx;
        //     border-radius: 8rpx;
        //     background: #00c4cc;
        //     font-size: 24rpx;
        //     color: white;
        //     padding: 0 20rpx;
        //     .icon{
        //         height: 24px;
        //         width: 24px;
        //         margin-right: 20rpx;
        //         display: inline-block;
        //         border-radius: 50%;
        //         background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm5-7.7c0-.2-.2-.3-.4-.3s-.3 0-.4.2l-.1.2-.1.1c-.6 1-1.1 1.3-2.2 1.9a4 4 0 0 1-1.7.3c-1.7 0-2.6-1.3-3-2.5-.5-2 .4-4.6 1.6-6 .7-.9 1.5-1.4 2.2-1.4.3 0 .7.2 1 .5.3.6.4 1 0 1.9 0 .2 0 .4.2.5.3 0 .6 0 1-.6.4-.5.4-1.4 0-2A3 3 0 0 0 12.7 6c-.8 0-1.5.2-2.1.6a7.5 7.5 0 0 0-3.4 8 4.7 4.7 0 0 0 4.4 3.4c1.4 0 2.4-.5 3-1 .8-.4 1.4-1 2-1.8l.1-.2.2-.2v-.5z'/%3E%3C/svg%3E");
        //     }
        // }
        .popup-main{
            position: relative;
            width: 680rpx;
            padding-top: 40rpx;
            border-radius: 16rpx;
            background:#fff;
            .pop-close{
                position: absolute;
                right: 20rpx;
                top: 10rpx;
                color: #999;
            }
            .poptitle{
                font-size: 32rpx;
                line-height: 1.1;
                text-align: center;
            }
            .pop-content{
                height: 900rpx;
                overflow: auto;
                padding: 20rpx;
                .listBox{
                    .listTitle{
                        font-size: 28rpx;
                        color: #333333;
                        font-weight: 600;
                        margin-bottom: 30rpx;
                    }
                    .listContent{
                        .listItem{
                            text-align: center;
                            display: inline-block;
                            height:52rpx;
                            line-height: 52rpx;
                            border-radius:32rpx;
                            border:1rpx solid rgba(222,222,222,.5);
                            font-size: 24rpx;
                            color: #666;
                            padding: 0 20rpx;
                            min-width: 112rpx;
                            margin-right: 24rpx;
                            margin-bottom: 30rpx;
                        }
                    }
                }
            }
        }
    }
</style>
