<template>
    <popup v-if="ifshow" :show="ifshow">
        <view class="popup-main" catchtouchmove='true'>
            <view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
            <view class="poptitle">作图神器</view>
            <view class="pop-content">
                <div class="listBox">
                    <div class="listTitle dis-flex flex-y-center flex-x-between">
                        <div>常用</div>
						<div class="edit" @tap.stop="changeEdit">{{isEdit ? '完成' : '编辑'}}</div>
                    </div>
                    <div class="listContent">
                        <div class="listItem" v-for="(item, index) in canvaUse" :key="index" @tap="checkCanva(item)">
                            {{item.title}}
							<text v-if="isEdit" class="iconfont2 icon-shanchu1" @tap.stop="delItem(index)"></text>
                        </div>
                    </div>
                </div>
                <div class="listBox"  v-for="(item, index) in canvaList" :key="index">
                    <div class="listTitle">
                        {{item.title}}
                    </div>
                    <div class="listContent">
                        <div class="listItem" v-for="(items, indexs) in item.list" :key="indexs" @tap="checkCanva(items)">
                            {{items.title}}
							<text v-if="isEdit" class="iconfont2 icon-cross icon-jiahao" @tap.stop="addItem(items)"></text>
                        </div>
                    </div>
                </div>
            </view>
        </view>
    </popup>
</template>

<script>
	const App = getApp().globalData;
	import popup from "@/components/pop-manager/index";
    export default {
        props:{
        },
        components: {
            popup
        },
        data() {
            return {
                ifshow: false,
                next: null,
				isEdit: false,
                indexId: '',
                canvaList: [
                    {
                        title: '电商',
                        list: [{
                            title: '微信朋友圈',
                            type: 'WechatMoment',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '拼图',
                            type: 'Collage',
                            width: 945,
                            height: 756
                        }, {
                            title: '电商详情页',
                            type: 'E-commerceProductDetails',
                            width: 790,
                            height: 3000
                        }, {
                            title: '主图图标',
                            type: 'ProductFrame',
                            width: 800,
                            height: 800
                        }, {
                            title: '微信朋友圈封面',
                            type: 'WechatMomentCover',
                            width: 1080,
                            height: 1080
                        }, {
                            title: '手机海报',
                            type: 'MobilePoster',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '微信头像',
                            type: 'WechatAvatar',
                            width: 500,
                            height: 500
                        }, {
                            title: '优惠券',
                            type: 'Coupon',
                            width: 680,
                            height: 227
                        }, {
                            title: '电商banner',
                            type: 'Banner',
                            width: 1920,
                            height: 600
                        }]
                    }, {
                        title: '新媒体',
                        list: [{
                            title: '微信公众号小图',
                            type: '',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '微信公众号封面',
                            type: 'WechatOfficialAccountThumbnail',
                            width: 200,
                            height: 200
                        }, {
                            title: '微信二维码',
                            type: 'WechatOfficialAccountQrCode',
                            width: 600,
                            height: 600
                        // }, {
                        //     title: '微博长图',
                        //     type: '',
                        //     width: 1080,
                        //     height: 1920
                        }, {
                            title: '视频封面',
                            type: 'VideoCover',
                            width: 2560,
                            height: 1440
                        // }, {
                        //     title: '插画',
                        //     type: '',
                        //     width: 1080,
                        //     height: 1920
                        }]
                    }, {
                        title: '个人生活',
                        list: [{
                            title: '手机海报',
                            type: 'MobilePoster',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '日签',
                            type: 'DailySignIn',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '微博',
                            type: 'Weibo',
                            width: 735,
                            height: 1108
                        }, {
                            title: '社交媒体',
                            type: 'Social Media',
                            width: 940,
                            height: 780
                        }, {
                            title: '食谱',
                            type: 'Recipe',
                            width: 793,
                            height: 1122
                        // }, {
                        //     title: '日历',
                        //     type: '',
                        //     width: 1920,
                        //     height: 1080
                        }, {
                            title: '视频相框',
                            type: 'VideoFrame',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '信纸',
                            type: 'Letterhead',
                            width: 793,
                            height: 1122
                        }, {
                            title: '手机壁纸',
                            type: 'PhoneWallpaper',
                            width: 1080,
                            height: 1920
                        // }, {
                        //     title: '手帐',
                        //     type: '',
                        //     width: 1080,
                        //     height: 1920
                        }, {
                            title: '简历',
                            type: 'Resume',
                            width: 793,
                            height: 1122
                        }]
                    }, {
                        title: '商务办公',
                        list: [{
                            title: 'LOGO',
                            type: 'Logo',
                            width: 500,
                            height: 500
                        }, {
                            title: '电子名片',
                            type: 'E-businessCard',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '名片',
                            type: 'BusinessCard',
                            width: 321,
                            height: 189
                        }, {
                            title: '易拉宝',
                            type: 'RollupBanner',
                            width: 3022,
                            height: 7556
                        // }, {
                        //     title: '授权书',
                        //     type: '',
                        //     width: 1080,
                        //     height: 1920
                        }, {
                            title: '通知公告',
                            type: '',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '邀请函',
                            type: 'Invitation',
                            width: 529,
                            height: 529
                        }, {
                            title: '三折页',
                            type: 'TrifoldBrochure',
                            width: 1056,
                            height: 816
                        }, {
                            title: '信息图表',
                            type: 'InformationChart',
                            width: 800,
                            height: 2000
                        }, {
                            title: '活动封面',
                            type: 'HDBPoster',
                            width: 900,
                            height: 545
                        }, {
                            title: 'PPT',
                            type: '',
                            width: 1080,
                            height: 1920
                        }, {
                            title: '工作简报',
                            type: '',
                            width: 1080,
                            height: 1920
                        }]
                    }, {
                        title: '教育培训',
                        list: [{
                            title: '手抄报',
                            type: 'Scrapbook',
                            width: 1122,
                            height: 793
                        // }, {
                        //     title: '奖状',
                        //     type: '',
                        //     width: 1080,
                        //     height: 1920
                        }, {
                            title: '书籍封面',
                            type: 'BookCover',
                            width: 1410,
                            height: 2250
                        }, {
                            title: '课程表',
                            type: 'ClassSchedule',
                            width: 1122,
                            height: 793
                        }, {
                            title: '计划表',
                            type: 'Schedule',
                            width: 800,
                            height: 1200
                        }, {
                            title: '书签',
                            type: 'Bookmark',
                            width: 192,
                            height: 576
                        // }, {
                        //     title: '故事版',
                        //     type: '',
                        //     width: 1920,
                        //     height: 1080
                        }, {
                            title: '课程计划表',
                            type: '',
                            width: 1080,
                            height: 1920
                        // }, {
                        //     title: '成绩反馈表',
                        //     type: 'WeeklyClassSchedule',
                        //     width: 793,
                        //     height: 1122
                        }, {
                            title: '座次表',
                            type: 'SeatingPlan',
                            width: 1587,
                            height: 2244
                        }, {
                            title: '目录页',
                            type: 'ContentPage',
                            width: 793,
                            height: 1122
                        }, {
                            title: '工作表',
                            type: 'WorkSchedule',
                            width: 793,
                            height: 1122
                        }]
                    }, {
                        title: '其他',
                        list: [
                            {
                                title: '餐厅菜单',
                                type: '',
                                width: 1080,
                                height: 1920
                            },
                            {
                                title: '卡',
                                type: 'MembershipCard',
                                width: 340,
                                height: 189
                            },
                            // {
                            //     title: 'T恤',
                            //     type: '',
                            //     width: 1080,
                            //     height: 1920
                            // },
                            // {
                            //     title: '手机壳',
                            //     type: '',
                            //     width: 1080,
                            //     height: 1920
                            // },
                            // {
                            //     title: '抱枕',
                            //     type: '',
                            //     width: 1080,
                            //     height: 1920
                            // },
                            // {
                            //     title: '帆布袋',
                            //     type: '',
                            //     width: 1080,
                            //     height: 1920
                            // },
                            // {
                            //     title: '门票',
                            //     type: '',
                            //     width: 1080,
                            //     height: 1920
                            // },
                            {
                                title: '贺卡',
                                type: 'Card',
                                width: 559,
                                height: 397
                            },
                            {
                                title: '电脑桌面',
                                type: 'DesktopWallPaper',
                                width: 1920,
                                height: 1080
                            },
                            {
                                title: '传单',
                                type: 'Flyer',
                                width: 793,
                                height: 1122
                            },
                            {
                                title: '报告',
                                type: 'Report',
                                width: 793,
                                height: 1122
                            }
                        ]
                    }
                ],
                canvaUse: [{
                    title: '微信朋友圈',
                    type: 'WechatMoment',
                    width: 1080,
                    height: 1920
                }, {
                    title: '拼图',
                    type: '',
                    width: 945,
                    height: 756
                }, {
                    title: '微博',
                    type: 'Weibo',
                    width: 735,
                    height: 1108
                // }, {
                //     title: '微信公众号小图',
                //     type: '',
                //     width: 1080,
                //     height: 1920
                },{
                    title: '微信头像',
                    type: 'WechatAvatar',
                    width: 500,
                    height: 500
                }, {
                    title: '社交媒体',
                    type: 'Social Media',
                    width: 940,
                    height: 780
                }]
            }
        },
        mounted() {
            /* #ifdef H5 || APP-PLUS */
            let canvaUse = uni.getStorageSync('canvaUse')
            if (canvaUse) {
                this.canvaUse = JSON.parse(canvaUse)
            }
            this.unit()
            /* #endif */
        },
        methods:{
			addItem(item) {
				if (item.type == '') {
					this.$api.msg('此模板正在开发中，敬请期待！')
					return false
				}
				let isHave = false
				this.canvaUse.forEach(items => {
					if (item.type == items.type) {
						isHave = true
					}
				})
				if (!isHave) {
					this.canvaUse.push(item)
					this.setStore()
				} else {
					this.$api.msg('此模板已在常用中！')
				}
			},
			delItem(index) {
				this.canvaUse.splice(index, 1)
				this.setStore()
			},
			setStore() {
				uni.setStorageSync('canvaUse', JSON.stringify(this.canvaUse))
			},
			changeEdit() {
				this.isEdit = !this.isEdit
			},
            message(data) {
                // console.log(data)
            },
            open(obj, next) {
                if (obj) {
                    this.indexId = obj.index
                }
                this.ifshow = true
                this.next = next || null
            },
            async unit() {
                /* #ifdef H5 */
                if (!App.canvaApi && window.CanvaButton) {
                    App.canvaApi = await window.CanvaButton.initialize({
                        apiKey: 'l4Z7jtzgfuKP0K8ECMJ1kVJ0'
                    });
                }
                /* #endif */
            },
            checkCanva(item) {
				if (this.isEdit) {
					return false
				}
                if (item.type == '') {
					this.$api.msg('此模板正在开发中，敬请期待！')
                    return false
                }
                this.clickmask()
                /* #ifdef H5 */
                let data = {
                    type: item.type,
                    onDesignOpen: ({ designId }) => {
                        // 在编辑器完成加载并打开新设计时触发。
                        // 您可以保存 designId 以供日后使用。
                    },
                    onDesignPublish: ({ exportUrl, designId }) => {
                        // console.log(this.next)
                        if (this.next) {
                            this.next(exportUrl)
                        }
                        // 在设计导出到图片上时触发。
                        // 请将图片保存到您的服务器上，因为 exportUrl 即将过期。
                    }
                }
                if (item.width && item.height) {
                    data.width = item.width
                    data.height = item.height
                }
                App.canvaApi.createDesign(data)
                /* #endif */
                /* #ifdef APP-PLUS */
                let url = '/pages/user/canvas/appUse?type=' + item.type + '&indexId=' + this.indexId
                if (item.width && item.height) {
                    url += '&width=' + item.width
                    url += '&height=' + item.height
                }
                uni.navigateTo({
                    url: url
                });
                /* #endif */
            },
            clickmask() {
                this.ifshow = false
            }
        }
    }
</script>

<style lang="scss" scoped>
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
					.edit{
						color: #FF7541;
						font-size: 24rpx;
						font-weight: 400;
					}
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
						.iconfont2{
							margin-left: 10rpx;
							font-size: 24rpx;
						}
                    }
                }
            }
        }
    }
    .canvasBox{
        width: 100%;
        height: 100%;
    }
</style>
