<template>
	<canvas v-if="canvasId" :id="canvasId" :canvasId="canvasId" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"
	 @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @error="error">
	</canvas>
</template>

<script>
	import uCharts from './u-charts.min.js';
	var canvases = {};
	
	export default {
		props: {
			chartType: {
				type: String,
				default: 'column'
			},
			opts: {
				required: true,
				type: Object,
				default () {
					return null;
				},
			},
			canvasId: {
				type: String,
				default: 'u-canvas',
			},
			cWidth: {
				default: 375,
			},
			cHeight: {
				default: 250,
			}
		},
		data() {
			return{
				pixelRatio: 1
			}
		},
		mounted() {
			let info = uni.getSystemInfoSync()
			// this.pixelRatio = info.pixelRatio
		},
		methods: {
			init() {
				switch (this.chartType) {
					case 'column':
						this.initColumnChart();
						break;
					case 'line':
						this.initLineChart();
						break;
					default:
						break;
				}
			},
			initColumnChart() {
				canvases[this.canvasId] = new uCharts({
					$this: this,
					canvasId: this.canvasId,
					padding: [15,15,4,15],
					type: 'column',
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					animation: true,
					categories: this.opts.categories,
					series: this.opts.series,
					enableScroll: true,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						itemCount: 7
					},
					yAxis: {
						min: 0,
						gridColor:'#eee',
						axisLine:{
							lineStyle:{
								color:'#eee'
							}
						},
						format:(val)=>{return val.toFixed(2)}
						//disabled:true
					},
					dataLabel: false,
					dataPointShape: true,
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: 6
						}
					}
				});
			},
			initLineChart() {
				canvases[this.canvasId] = new uCharts({
					$this: this,
					canvasId: this.canvasId,
					type: 'area',
					padding: [15,15,4,15],
					fontSize: 11,
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					categories: this.opts.categories,
					series: this.opts.series,
					animation: true,
					enableScroll: true,
					legend: {
						show: false
					},
					xAxis: {
						disabled: false,
						disableGrid: true,
						itemCount: 10,
						gridColor: '#eee',
						fontColor: '#999999'
					},
					yAxis: {
						// axisLine: false,
						axisLineColor: 'red',
						gridType: 'solid',
						dashLength: 8,
						gridColor: '#eee',
						calibration: false,
						format:(val)=>{return val== '0' ? '0' : val.toFixed(1)}
					},
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						area:{
							type: 'curve',
							opacity:0.2,
							addLine:true,
							width:2
						}
					}
				});
			},
			// 这里仅作为示例传入两个参数，cid为canvas-id,newdata为更新的数据，需要更多参数请自行修改
			changeData(cid,newdata) {
				canvases[cid].updateData({
					series: newdata.series,
					categories: newdata.categories
				});
			},
			touchStart(e) {
				canvases[this.canvasId].showToolTip(e, {
					format: (item, category) => {
						if (this.chartType == 'column') {
							return category + ' ' + item.name + ': ' + item.data.value
						}
						return category + ' ' + item.name + ': ' + item.data
					}
				});
				canvases[this.canvasId].scrollStart(e);
			},
			touchMove(e) {
				canvases[this.canvasId].scroll(e);
			},
			touchEnd(e) {
				canvases[this.canvasId].scrollEnd(e);
			},
			error(e) {
			}
		},
	};
</script>

<style scoped>
	.charts {
		width: 100%;
		height: 100%;
		flex: 1;
		background-color: #FFFFFF;
	}
</style>
