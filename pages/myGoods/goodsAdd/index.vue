<template>
	<view class="goodsAdd">
		<div class="border_b">
			<!-- 自定义标题栏 -->
			<navigationBar :back="false" id="top">
				<view slot="left" @tap.stop="back" class="backBox">
					<text class="iconfont2 icon-fanhui"></text>
					<text class="title">{{heardTitle}}</text>
				</view>
			</navigationBar>
		</div>
		<scroll-view :scroll-y="scrollY" :style="'height: ' + scrollHeight + 'px;'" @scroll="scroll"
			:scroll-top="scrollTop">
			<div class="heardBut border_b" v-if="!goods_id">
				<div :class="submitTab == 1 ? 'but3' : 'but2'" @tap.stop="submitTabChange(1)" style="margin-right: 60rpx;">快捷发布</div>
				<div :class="submitTab == 2 ? 'but3' : 'but2'" @tap.stop="submitTabChange(2)">完整发布</div>
			</div>
			<div class="bg-w fieldBox margin-b" v-if="submitTab == 1">
				<div>
					<div class="dis-flex fieldItem flex-y-center">
						<div class="contentBox goods_name" style="padding-bottom: 0;padding-right: 30rpx;">
							<div class="content border_b p-20" style="padding-bottom: 0;">
								<textarea style="color:#333333;" @blur="nameChange1" @confirm="nameChange1"
									ref="input" placeholder-class="place-holder"
									:placeholder="field.goods_name.placeholder" v-model="formDataFast.goods_name"
									:maxlength="field.goods_name.maxlength" />
							</div>
						</div>
					</div>
				</div>
				<div class="priceBox">
					<div class="border_b dis-flex fieldItem flex-y-center" style="height: 120rpx;">
						<div class="label">售价</div>
						<div class="contentBox dis-flex flex-y-center">
							<div class="content onelist-hidden">
								<input type="digit" placeholder-class="place-holder" placeholder="必填"
									v-model="formDataFast.goods_price"
									:maxlength="field.goods_price.maxlength" />
							</div>
							<div class="tips1">
								元
							</div>
						</div>
					</div>
				</div>
				<div class="pad-box">
					<tui-upload ref="tuiUpload" @scrollYChange="scrollYChange" :limit="9" :videoLimit="1"
						source="goods" :value="baseImagesFast" @complete="result" @remove="remove" isShop></tui-upload>
				</div>
				<div class="imgTips">
					<text class="iconfont2 icon-guize f-24"></text>
					长按图片可拖拽调整顺序，最多上传9图1视频
				</div>
			</div>
			<div  v-if="submitTab == 2">
				<!-- 基础字段 -->
				<div class="bg-w fieldBox margin-b">
					<div>
						<div class="dis-flex fieldItem flex-y-center">
							<div class="contentBox goods_name">
								<div class="content border_b p-20">
									<textarea style="color:#333333;" @blur="nameChange" @confirm="nameChange"
										ref="input" placeholder-class="place-holder"
										:placeholder="field.goods_name.placeholder" v-model="formData.goods_name"
										:maxlength="field.goods_name.maxlength" />
								</div>
							</div>
						</div>
					</div>
					<div class="pad-box">
						<tui-upload ref="tuiUpload" @scrollYChange="scrollYChange" :limit="9" :videoLimit="1"
							source="goods" :value="baseImages" @complete="result" @remove="remove" isShop></tui-upload>
					</div>
					<div class="imgTips">
						<text class="iconfont2 icon-guize f-24"></text>
						长按图片可拖拽调整顺序，最多上传9图1视频
					</div>
					<div class="pad-box1">
						<div class="border_b dis-flex fieldItem flex-y-center">
							<div class="label">菜品简称</div>
							<div class="contentBox dis-flex flex-y-center">
								<div class="content onelist-hidden">
									<input @input="shortChange" placeholder-class="place-holder" type="text"
										placeholder="必填" v-model="formData.goods_short_name"
										:maxlength="field.goods_short_name.maxlength" />
									<!-- <text v-if="formData.goods_short_name == ''">必填</text>
					  <text v-else class="col-3">{{formData.goods_short_name}}</text> -->
								</div>
								<div class="tips" @tap.stop="showNameTips">
									<text class="tipIcon iconfont2 icon-juxing" style="font-size:32rpx"></text>
								</div>
							</div>
						</div>
					</div>
					<!-- 链接类型展示 -->
					<div class="pad-box1" v-show="!isOtherAdd">
						<view class="dis-flex fieldItem flex-y-center">
							<view class="label">菜品分类</view>
							<view class="contentBox" @tap.stop="toTag('tags')">
								<div class="tips tips1">
									<text
										class="col-6">{{formData.tags[0] || '选择分类'}}</text>
									<text class="iconfont2 icon-gengduobeifen2"></text>
								</div>
							</view>
						</view>
					</div>
				</div>
				<div class="margin-b bg-w fieldBox" v-show="!isOtherAdd">
					<div class="tuiTabsBox dis-flex flex-y-center flex-x-between">
						<div class="tuiTabs dis-flex flex-y-center">
							<view class="tabsItem" v-for="(item, index) in tabs" :key="index"
								:class="currentTab == index ? 'tabsItemAct' : ''" @tap="tabsChange(index)">
								{{item.name}}
							</view>
						</div>

						<div class="addSpecTips" @tap.stop="showPopup1Tip()">
							<text class="iconfont2 icon-juxing"></text>
						</div>
					</div>
					<!-- 一行两个 -->
					<div class="priceBox" v-show="currentTab == 0">
						<div class="priceItem">
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">零售价</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<!-- <text v-if="formData.goods_price == ''">必填</text>
						  <text v-else class="col-3">{{formData.goods_price}}</text> -->
											<input type="digit" placeholder-class="place-holder" placeholder="必填"
												v-model="formData.goods_price"
												:maxlength="field.goods_price.maxlength" />
										</div>
										<div class="tips1">
											元
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="dis-flex fieldItem flex-y-center" :class="priceSet ? 'border_b' : ''"
									@tap="changePriceSet()">
									<div class="label">其他</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden"></div>
										<div class="tips tips1">
											<div class="tipIconBox" :class="priceSet ? 'transIcon' : ''">
												<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="priceItem" v-show="priceSet">
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">划线价</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<!-- <text class="col-3">{{formData.line_price}}</text> -->
											<input type="digit" placeholder-class="place-holder"
												v-model="formData.line_price" :maxlength="field.line_price.maxlength" />
										</div>
										<div class="tips1">
											元
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">库存</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<!-- <text v-if="formData.stock_num == ''">必填</text>
						  <text v-else :class="currentTab == 0 ? 'col-3' : ''">{{formData.stock_num}}</text> -->
											<input type="number" placeholder-class="place-holder" placeholder="必填"
												v-model="formData.stock_num" :maxlength="field.stock_num.maxlength" />
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">重量</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<!-- <text v-if="formData.goods_weight == ''">非必填，默认0.1</text>
						  <text v-else :class="currentTab == 0 ? 'col-3' : ''">{{formData.goods_weight}}</text> -->
											<input type="digit" placeholder-class="place-holder" placeholder="非必填，默认0.1"
												v-model="formData.goods_weight"
												:maxlength="field.goods_weight.maxlength" />
										</div>
										<div class="tips1">
											kg
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="priceBox" v-show="currentTab == 1">
						<div class="priceItem">
							<div class="pad-box1a">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">多规格</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content">
											<div class="col-3" v-for="(item, index) in specData.list" :key="index">
												{{item.label}}：{{item.value}}
											</div>
										</div>
										<div class="tips1">
											<div class="tipsAdd" @tap="addSpec">去添加</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="priceItem">
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">零售价</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text class="col-3">{{specData.goods_price}}</text>
										</div>
										<div class="tips1">
											元
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="dis-flex fieldItem flex-y-center" :class="priceSet ? 'border_b' : ''"
									@tap="changePriceSet()">
									<div class="label">其他</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden"></div>
										<div class="tips tips1">
											<div class="tipIconBox" :class="priceSet ? 'transIcon' : ''">
												<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="priceItem" v-show="priceSet">
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">划线价</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text class="col-3">{{specData.line_price}}</text>
										</div>
										<div class="tips1">
											元
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">库存</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text :class="currentTab == 0 ? 'col-3' : ''">{{specData.stock_num}}</text>
										</div>
									</div>
								</div>
							</div>
							<div class="pad-box1">
								<div class="border_b dis-flex fieldItem flex-y-center">
									<div class="label">重量</div>
									<div class="contentBox dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text
												:class="currentTab == 0 ? 'col-3' : ''">{{specData.goods_weight}}</text>
										</div>
										<div class="tips1">
											kg
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-w fieldBox">
					<div class="pad-box fieldItem">
						<div class="dis-flex flex-y-center" @tap.stop="toOtherPage('content')">
							<div class="label">
								菜品详情页
								<!-- <div class="butSame" @tap.stop="sameImg(true)">一键同步</div> -->
							</div>
							<div class="contentBox dis-flex flex-y-center">
								<div class="content onelist-hidden">
								</div>
								<div class="tips">
									<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div class="describe">
							(同步菜品图至详情页,将会覆盖已编辑内容)
						</div>
					</div>
				</div>
				<div class="bg-w margin-b fieldBox" v-show="!isOtherAdd">
					<div class="pad-box2 fieldItem">
						<div class="pad-box3">
							<div class="dis-flex flex-y-center">
								<div class="label">运费模版</div>
								<picker class="contentBox" @change="deliveryChange($event)"
									:value="formData.delivery_name" :range="deliveryList">
									<div class="dis-flex flex-y-center">
										<div class="content onelist-hidden">
											<text v-if="formData.delivery_name == ''">必填</text>
											<text v-else class="col-3">{{formData.delivery_name}}</text>
										</div>
										<div class="tips">
											<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
										</div>
									</div>
								</picker>
							</div>
						</div>
					</div>
					<div class="describe">
						<text class="iconfont2 icon-jingshi"></text>没有模版，<text class="col-m"
							@tap="toAddDelivery">去添加</text>
					</div>
					<div class="pad-box1">
						<div class="dis-flex fieldItem flex-y-center" :class="showSet ? 'border_b' : ''"
							@tap="changeShowSet()">
							<div class="label">其他设置
								<text class="cercle"></text>
							</div>
							<div class="contentBox dis-flex flex-y-center">
								<div class="content onelist-hidden"></div>
								<div class="tips tips1">
									<div class="tipIconBox" :class="showSet ? 'transIcon' : ''">
										<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-show="showSet">
						<div class="dis-flex flex-y-center">
							<div class="pad-box1 dis-flex flex-y-center">
								<div style="width:282rpx">
									<div class="border_b dis-flex fieldItem flex-y-center">
										<div class="label">菜品排序</div>
										<div class="contentBox dis-flex flex-y-center">
											<input style="text-align:center;height:98rpx" type="number"
												placeholder-class="place-holder" placeholder="默认置顶"
												v-model="formData.goods_sort" :maxlength="field.goods_sort.maxlength" />
										</div>
									</div>
								</div>
								<div class="border_b dis-flex flex-y-center" style="height:100%">
									<div class="line"></div>
								</div>
								<div style="flex:1">
									<div class="border_b dis-flex fieldItem flex-y-center">
										<div class="label">初始销量</div>
										<div class="contentBox dis-flex flex-y-center">
											<input style="text-align:center;height:98rpx" type="number"
												placeholder-class="place-holder" placeholder="默认100内随机"
												v-model="formData.sales_initial"
												:maxlength="field.sales_initial.maxlength" />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="pad-box1 dis-flex flex-y-center">
							<div style="width:282rpx">
								<div class="border_b dis-flex fieldItem flex-y-center flex-x-between">
									<div class="label">菜品状态</div>
									<div class="tips" style="width:80rpx">
										<cust-switch :checked="formData.goods_status == 10" @change="goodsStatusChange">
										</cust-switch>
									</div>
								</div>
							</div>
							<div class="line"></div>
							<div class="fieldItem" style="flex:1">
								<div class="dis-flex flex-y-center flex-x-between" @tap.stop="dealerTip">
									<div class="label">渠道设置</div>
									<div class="tips" style="width:80rpx">
										<cust-switch :checked="formData.open_dealer == 1" @change="isIndDealerChange"
											:disabled="vip != '4'"></cust-switch>
									</div>
								</div>
								<!-- <div class="describe">
					  <text class="iconfont2 icon-jingshi"></text>根据{{member}}判定，<text class="col-m" @tap.stop="toMember">去了解{{member}}？</text>
					</div> -->
							</div>
						</div>
					</div>
				</div>
				<div class="bg-w fieldBox">
					<div class="pad-box2 selling_point">
						<div class="dis-flex fieldItem flex-y-center" @tap.stop="openItem('selling_point')">
							<div class="label">菜品卖点</div>
							<div class="contentBox dis-flex flex-y-center">
								<div class="content col-3">
									<!-- <input placeholder-class="place-holder" type="text" v-model="formData.selling_point" :maxlength="field.selling_point.maxlength"/> -->
									<div class="three-hidden" v-if="formData.selling_point != ''">
										{{formData.selling_point}}
									</div>
								</div>
								<div class="tips" style="font-size:26rpx">{{formData.selling_point.length}}/500
									<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="height:40rpx"></div>
			</div>
		</scroll-view>
		<div :class="ios ? 'submitBox1' : 'submitBox'">
			<div class="but1" @tap.stop="saveLocal()" v-if="submitTab == 2">草稿</div>
			<div class="but2" @tap.stop="submit(false)">发布</div>
			<div class="but3" @tap.stop="goodsPreview">预览</div>
		</div>
		<popup-input :title="title" :inputType="inputType" :maxlength="maxlength" ref="popupInput"
			:placeholder="placeholder"></popup-input>
		<popup-tips title="提示" content="检测到数据发生改动，是否保存为草稿后再离开？" ref="popupTips" @tipsCallback="tipsCallback"
			@tipsClickmask="tipsClickmask"></popup-tips>
		<popup-tips title="提示" content="是否加载上次编辑数据？" ref="popupGetdataTips" @tipsCallback="getGoodsStore1"></popup-tips>
		<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet">
		</tui-actionsheet>
		<tui-actionsheet :show="showDraft" :item-list="draftList" @click="draftClick" @cancel="closeDraft">
		</tui-actionsheet>
		<popup-tips title="提示" content="请准确填写该价格，频繁修改价格可能会影响店铺综合评分，给客户带来不好体验" ref="popupPriceTips"></popup-tips>
		<popup-tips title="提示" content="菜品简称一般填写菜品货号或所有员工都熟悉的菜品缩写名，例如菜品标题为：【ABC品牌款号:M321全棉材质2020年秋冬上新】，菜品简称可以设置为：【M321】"
			ref="popupNameTips"></popup-tips>
		<popup-tips title="提示" content="您还没有渠道权限哦！如果您想发展渠道代理商，建议您做进一步了解！" ref="popupDealerTips" confirmText="去了解">
		</popup-tips>
		<popup-tips title="提示" content="确认发布该菜品？" ref="submitTips"></popup-tips>
		<guidePage title="proPage"></guidePage>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import custSwitch from '@/components/cust-switch/index.vue';
	import popupInput from '@/components/popup-input/index';
	import popupTips from '@/components/popup-tips/index';
	import popup from '@/components/popup/index';
	import guidePage from '@/components/guide-page';

	export default {
		data() {
			return {
				scrollY: true,
				isList: false,
				member: App.member,
				isOtherAdd: false,
				ios: false,
				// 头部高度
				scrollHeight: 0,
				// 滚动位置
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				heardTitle: '新增菜品',
				title: '',
				placeholder: '',
				maxlength: '-1',
				inputType: '',
				baseImages: [],
				baseImagesFast: [],
				// 模板列表
				deliveryList: [],
				deliveryIdList: [],
				showActionSheet: false,
				showDraft: false,
				itemList: [{
					text: "保存草稿",
					color: "#2B2B2B",
				}, {
					text: "草稿箱(限五个)",
					color: "#2B2B2B"
				}],
				draftList: [],
				draftDataList: [],
				submitTab: 1,
				useLocal: false,
				formDataFast: {
					// 分类
					tags: [],
					// 规格
					spec_type: 10,
					// 图片列表
					images: [],
					// 菜品名称
					goods_name: '',
					// 菜品简称
					goods_short_name: '通用菜品',
					// 菜品卖点
					selling_point: '',
					// 零售价
					goods_price: '',
					// 划线价
					line_price: '',
					// 库存
					stock_num: '100',
					// 重量
					goods_weight: '',
					// 多规格同价继承上面价格
					// 菜品详情
					content: '',
					// 模板id
					delivery_id: '',
					delivery_name: '',
					// 菜品状态
					goods_status: 10,
					// 初始销量
					sales_initial: '',
					// 菜品排序
					goods_sort: '',
					// 渠道设置
					open_dealer: '0',
					// 菜品分类
					category_id: '10354',
					// 分类名称
					category_name: '通用菜品',
					// 下单减库存
					deduct_stock_type: '10'
				},
				formData: {
					// 分类
					tags: [],
					// 规格
					spec_type: 10,
					// 图片列表
					images: [],
					// 菜品名称
					goods_name: '',
					// 菜品简称
					goods_short_name: '',
					// 菜品卖点
					selling_point: '',
					// 零售价
					goods_price: '',
					// 划线价
					line_price: '',
					// 库存
					stock_num: '100',
					// 重量
					goods_weight: '',
					// 多规格同价继承上面价格
					// 菜品详情
					content: '',
					// 模板id
					delivery_id: '',
					delivery_name: '',
					// 菜品状态
					goods_status: 10,
					// 初始销量
					sales_initial: '',
					// 菜品排序
					goods_sort: '',
					// 渠道设置
					open_dealer: '0',
					// 菜品分类
					category_id: '',
					// 分类名称
					category_name: '',
					// 下单减库存
					deduct_stock_type: '10'
				},
				formOldData: {
					tags: [],
					// 规格
					spec_type: 10,
					// 图片列表
					images: [],
					// 菜品名称
					goods_name: '',
					// 菜品简称
					goods_short_name: '',
					// 菜品卖点
					selling_point: '',
					// 零售价
					goods_price: '',
					// 划线价
					line_price: '',
					// 库存
					stock_num: '100',
					// 重量
					goods_weight: '',
					// 多规格同价继承上面价格
					// 菜品详情
					content: '',
					// 模板id
					delivery_id: '',
					delivery_name: '',
					// 菜品状态
					goods_status: 10,
					// 初始销量
					sales_initial: '',
					// 菜品排序
					goods_sort: '',
					// 渠道设置
					open_dealer: '0',
					// 菜品分类
					category_id: '',
					// 分类名称
					category_name: '',
					// 下单减库存
					deduct_stock_type: '10'
				},
				// 字段
				field: {
					tags: {
						type: 'text',
						name: '添加分类',
						fieldName: 'tag',
						maxlength: '12',
						showlength: true,
						placeholder: '#请输入分类'
					},
					// 菜品名称
					goods_name: {
						type: 'largeText',
						name: '菜品名称',
						fieldName: 'goods_name',
						maxlength: -1,
						placeholder: '请描述您的菜品'
					},
					// 菜品简称
					goods_short_name: {
						type: 'text',
						name: '菜品简称',
						fieldName: 'goods_short_name',
						maxlength: '20'
					},
					// 菜品分类
					category_id: {
						type: 'link',
						name: '菜品分类',
						fieldName: 'category_id',
						linkUrl: '/pages/myGoods/category/list/index',
						maxlength: '-1'
					},
					// 菜品分类
					content: {
						type: 'link',
						name: '菜品详情',
						fieldName: 'content',
						linkUrl: '/pages/robinEditor/robinEditor',
						// linkUrl: '/pages/user/canvas/index',
						maxlength: '-1',
						source: 'goods'
					},
					// 菜品卖点
					selling_point: {
						type: 'largeText',
						name: '菜品卖点',
						fieldName: 'selling_point',
						maxlength: 500
					},
					// 零售价
					goods_price: {
						type: 'text',
						name: '零售价',
						fieldName: 'goods_price',
						maxlength: '9'
					},
					// 划线价
					line_price: {
						type: 'text',
						name: '划线价',
						fieldName: 'line_price',
						maxlength: '9'
					},
					// 库存
					stock_num: {
						type: 'text',
						name: '库存',
						fieldName: 'stock_num',
						maxlength: '10'
					},
					// 重量
					goods_weight: {
						type: 'text',
						name: '重量',
						fieldName: 'goods_weight',
						maxlength: '10'
					},
					sales_initial: {
						type: 'text',
						name: '初始销量',
						fieldName: 'sales_initial',
						maxlength: '10'
					},
					goods_sort: {
						type: 'text',
						name: '菜品排序',
						fieldName: 'goods_sort',
						maxlength: '10'
					},
				},
				// 当前tab
				currentTab: 0,
				showSet: false,
				priceSet: false,
				// tab列表
				tabs: [{
					name: '单规格'
				}, {
					name: '多规格'
				}],
				radioItems: [{
					name: '下单减库存',
					checked: false,
					value: '10'
				}, {
					name: '付款减库存',
					checked: true,
					value: '20'
				}],
				goods_id: '',
				goOther: false,
				isSub: false,
				vip: '',
				needUpImg: false,
				goods_multi_spec: {},
				goods_multi_spec_old: {},
				specData: {
					list: [],
					goods_price: '',
					line_price: '',
					stock_num: '',
					goods_weight: ''
				}
			};
		},

		components: {
			custSwitch,
			popupInput,
			popupTips,
			guidePage
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 判断是否有菜品id
			if (options.isList) {
				this.isList = true
			}
			if (options.goods_id) {
				this.goods_id = options.goods_id

				this.heardTitle = '编辑菜品'
				this.submitTab = 2
				this.getGoods()
				this.$nextTick(() => {
					this.setListHeight()
				})
			} else {
				this.$nextTick(() => {
					this.setListHeight()
				})
			}
		},
		onShow() {
			this.getDelivery()
			this.getDrafts()
			this.getVip()
			if (this.needUpImg) {
				this.updataImg()
			}
		},
		onUnload(option) {
			if (!this.isSub) {
				if (this.checkIsSubmit()) {
					let data = {
						formData: this.formData,
						baseImages: this.baseImages
					}
					data.spec_many = this.goods_multi_spec
					uni.setStorageSync('addGoodsObj', JSON.stringify(data))
				} else {
					uni.removeStorage({
						key: 'addGoodsObj',
						success: function(res) {
							// console.log('success');
						}
					});
				}
			} else {
				uni.removeStorage({
					key: 'addGoodsObj',
					success: function(res) {
						// console.log('success');
					}
				});
			}
		},
		onHide() {},
		methods: {
			submitTabChange(type) {
				this.submitTab = type
				if (type == 2 && !this.useLocal) {
					this.useLocal = true
					let addGoodsStr = uni.getStorageSync('addGoodsObj')
					if (addGoodsStr) {
						this.$refs.popupGetdataTips.open()
					}
				}
			},
			getSpec(data) {
				this.goods_multi_spec = data || {}
				this.unitSpecData()
				console.log('getSpec', this.goods_multi_spec)
			},
			unitSpecData() {
				let spec_attr = this.goods_multi_spec.spec_attr || []
				let spec_list = this.goods_multi_spec.spec_list || []
				let list = []
				spec_attr.forEach(item => {
					let str = []
					item.spec_items.forEach(element => {
						str.push(element.spec_value)
					})
					list.push({
						label: item.group_name,
						value: str.join('/')
					})
				})
				let min_goods_price = ''
				let max_goods_price = ''

				let min_line_price = ''
				let max_line_price = ''

				let min_stock_num = ''
				let max_stock_num = ''

				let min_goods_weight = ''
				let max_goods_weight = ''
				spec_list.forEach(item => {
					if (item.form.goods_price) {
						let now_goods_price = parseInt(item.form.goods_price)
						if (now_goods_price < min_goods_price || min_goods_price == '') {
							min_goods_price = now_goods_price
						}
						if (now_goods_price > max_goods_price || max_goods_price == '') {
							max_goods_price = now_goods_price
						}
					}
					if (item.form.line_price) {
						let now_line_price = parseInt(item.form.line_price)
						if (now_line_price < min_line_price || min_line_price == '') {
							min_line_price = now_line_price
						}
						if (now_line_price > max_line_price || max_line_price == '') {
							max_line_price = now_line_price
						}
					}
					if (item.form.stock_num) {
						let now_stock_num = parseInt(item.form.stock_num)
						if (now_stock_num < min_stock_num || min_stock_num == '') {
							min_stock_num = now_stock_num
						}
						if (now_stock_num > max_stock_num || max_stock_num == '') {
							max_stock_num = now_stock_num
						}
					}
					if (item.form.goods_weight) {
						let now_goods_weight = parseInt(item.form.goods_weight)
						if (now_goods_weight < min_goods_weight || min_goods_weight == '') {
							min_goods_weight = now_goods_weight
						}
						if (now_goods_weight > max_goods_weight || max_goods_weight == '') {
							max_goods_weight = now_goods_weight
						}
					}
				})

				let goods_price = ''
				let line_price = ''
				let stock_num = ''
				let goods_weight = ''

				if (min_goods_price != '' && max_goods_price != '') {
					goods_price = min_goods_price + '-' + max_goods_price
				} else if (min_goods_price != '') {
					goods_price = min_goods_price
				} else if (max_goods_price != '') {
					goods_price = max_goods_price
				}

				if (min_line_price != '' && max_line_price != '') {
					line_price = min_line_price + '-' + max_line_price
				} else if (min_line_price != '') {
					line_price = min_line_price
				} else if (max_line_price != '') {
					line_price = max_line_price
				}

				if (min_stock_num != '' && max_stock_num != '') {
					stock_num = min_stock_num + '-' + max_stock_num
				} else if (min_stock_num != '') {
					stock_num = min_stock_num
				} else if (max_stock_num != '') {
					stock_num = max_stock_num
				}

				if (min_goods_weight != '' && max_goods_weight != '') {
					goods_weight = min_goods_weight + '-' + max_goods_weight
				} else if (min_goods_weight != '') {
					goods_weight = min_goods_weight
				} else if (max_goods_weight != '') {
					goods_weight = max_goods_weight
				}
				this.specData = {
					list: list,
					goods_price: goods_price,
					line_price: line_price,
					stock_num: stock_num,
					goods_weight: goods_weight
				}
			},
			addSpec() {
				uni.navigateTo({
					url: '/pages/myGoods/goodsAdd/custSpec/index'
				})
			},
			updataImg() {
				this.needUpImg = false
				this.$nextTick(() => {
					if (this.$refs.tuiUpload) {
						this.$refs.tuiUpload.unit()
					}
				})
			},
			scrollYChange(e) {
				this.scrollY = e
			},
			shortChange() {
				this.formData.goods_short_name = this.formData.goods_short_name.replace(/[\r\n]/g, "")
			},
			nameChange() {
				this.formData.selling_point = this.formData.goods_name
			},
			nameChange1() {
				this.formDataFast.selling_point = this.formDataFast.goods_name
			},
			dealerTip() {
				if (this.vip != 4) {
					this.$refs.popupDealerTips.open()
				}
			},
			getVip() {
				App._get('user.index/vipDetail', {}, (result) => {
					this.vip = result.data.userInfo.vip
					if (this.goods_id == '' && this.vip == '4') {
						this.formData.open_dealer = 1
						this.formOldData.open_dealer = 1
					}
				})
			},
			materialChange(list) {
				this.needUpImg = true
				let images = [];
				let baseImages = []
				list.forEach(element => {
					images.push(element.wxapp_file_id)
					baseImages.push({
						type: element.type,
						path: element.path,
						wxapp_file_id: element.wxapp_file_id
					})
				});
				this.formData.images = images
				this.baseImages = baseImages;
				if (this.formData.content == '') {
					this.sameImg()
				}
			},
			toMember() {
				App.toMember()
			},
			showPopup1Tip() {
				this.$refs.popupPriceTips.open()
			},
			showNameTips() {
				this.$refs.popupNameTips.open()
			},
			// 关闭草稿选项弹窗
			closeActionSheet() {
				this.showActionSheet = false
			},
			closeDraft() {
				this.showDraft = false
			},
			// 草稿选项
			itemClick(e) {
				if (e.index == '0') {
					this.inputType = 'text'
					this.title = '草稿名称'
					this.placeholder = '请输入草稿名'
					this.$refs.popupInput._open('', (val) => {
						this.title = ''
						this.placeholder = ''
						this.submitLocal(val)
					})
				} else if (e.index == '1') {
					if (this.draftList.length == 0) {
						this.$api.msg('暂无草稿')
					} else {
						this.showDraft = true
					}
				}
				this.showActionSheet = false
			},
			// 选择草稿
			draftClick(e) {
				this.showDraft = false
				let data = this.draftDataList[e.index].draftData.val
				this.getGoodsStore(data)
			},
			getDrafts() {
				App._get('shop.wxapp.goods/getDrafts', {}, (result) => {
					let draftDataList = result.data.list || []
					let draftList = []
					draftDataList.forEach(item => {
						item.draftData = JSON.parse(item.draft_content)
						draftList.push({
							text: item.draftData.name,
							color: "#2B2B2B",
						})
					})
					this.draftList = draftList
					this.draftDataList = draftDataList
				})
			},
			submitLocal(val) {
				let data = {
					formData: this.formData,
					baseImages: this.baseImages
				}
				let spec_many = this.goods_multi_spec
				data.spec_many = spec_many
				let obj = {
					name: val,
					val: data
				}
				let str = JSON.stringify(obj)
				uni.showLoading()
				App._post_form('shop.wxapp.goods/saveDraft', {
					draft: str
				}, (result) => {
					this.isSub = true
					uni.removeStorageSync('addGoodsObj')
					this.$api.msg(result.msg)
					wx.navigateBack();
				}, () => {
					uni.hideLoading()
				})
			},
			saveLocal() {
				this.showActionSheet = true
			},
			getGoodsStore1() {
				this.getGoodsStore()
			},
			getGoodsStore(otherData) {
				let data = {}
				if (otherData) {
					data = otherData
				} else {
					let addGoodsStr = uni.getStorageSync('addGoodsObj')
					data = JSON.parse(addGoodsStr)
				}
				if (data.formData.spec_type == 10) {
					this.currentTab = 0
				} else if (data.formData.spec_type == 20) {
					this.currentTab = 1
				}
				this.formData = data.formData
				this.baseImages = data.baseImages
				// 规格列表
				let spec_many = data.spec_many
				this.$nextTick(() => {
					this.updataImg()
					if (this.formData.content == '') {
						this.sameImg()
					}
					this.goods_multi_spec = spec_many
					this.unitSpecData()
				})
			},
			tipsClickmask() {
				this.goOther = true
				uni.navigateBack()
			},
			tipsCallback() {
				this.submit(true)
			},
			// 校验数据是否发生改变
			checkIsSubmit() {
				let isSame = false
				for (let k in this.formData) {
					if (this.formData[k] != this.formOldData[k]) {
						if (k == 'images' || k == 'tags') {
							if (JSON.stringify(this.formData[k]) != JSON.stringify(this.formOldData[k])) {
								isSame = true
							}
						} else {
							isSame = true
						}
					}
				}
				if (JSON.stringify(this.goods_multi_spec_old) != JSON.stringify(this.goods_multi_spec)) {
					isSame = true
				}
				return isSame
			},
			toAddDelivery() {
				let url = '/pages/myGoods/freight/template/detail'
				uni.navigateTo({
					url: url
				});
			},
			getDelivery() {
				App._get('shop.delivery/index', {}, (result) => {
					let deliveryBaseList = result.data.list.data || []

					let deliveryList = []
					let deliveryIdList = []

					deliveryBaseList.forEach(item => {
						deliveryList.push(item.name)
						deliveryIdList.push(item.delivery_id)
						if (this.formData.delivery_id === '') {
							if (item.is_default) {
								this.formData.delivery_id = item.delivery_id
								this.formData.delivery_name = item.name
								this.formDataFast.delivery_id = item.delivery_id
								this.formDataFast.delivery_name = item.name
								this.formOldData.delivery_id = item.delivery_id
								this.formOldData.delivery_name = item.name
							}
						} else {
							if (item.delivery_id == this.formData.delivery_id) {
								this.formData.delivery_name = item.name
							}
						}
					})
					this.deliveryList = deliveryList
					this.deliveryIdList = deliveryIdList
				})
			},
			getGoods() {
				App._get('shop.wxapp.goods/edit', {
					wxapp_goods_id: this.goods_id
				}, (result) => {
					if (result.data.wxappgoods.wxapp_goods_type.value == 2) {
						this.isOtherAdd = true
					}
					let goods = result.data.wxappgoods.goods
					goods.goods_status = result.data.wxappgoods.goods_status
					goods.open_dealer = result.data.wxappgoods.open_dealer || 0
					goods.goods_sort = result.data.wxappgoods.goods_sort || 0

					this.updataGoods(goods)
					this.getDelivery()
				})
			},
			updataGoods(data, noOld) {
				let formData = data || {}
				if (formData.spec_type == 10) {
					this.currentTab = 0
				} else if (formData.spec_type == 20) {
					this.currentTab = 1
				}
				let categoryName = ''
				if (formData.category) {
					categoryName = formData.category.first_name + '>' + formData.category.sec_name + '>' + formData
						.category.name
				}
				let obj = {
					// 规格
					spec_type: formData.spec_type || 10,
					// 图片列表
					images: this.unitImg(formData.image),
					// 菜品名称
					goods_name: formData.goods_name || '',
					// 菜品简称
					goods_short_name: formData.goods_short_name || '',
					// 菜品卖点
					selling_point: formData.selling_point || '',
					// 零售价
					goods_price: formData.goods_sku.goods_price || '',
					// 划线价
					line_price: formData.goods_sku.line_price || '',
					// 库存
					stock_num: formData.goods_sku.stock_num || '',
					// 重量
					goods_weight: formData.goods_sku.goods_weight || '',
					// 菜品详情
					content: formData.content || '',
					// 模板id
					delivery_id: formData.delivery_id || '',
					delivery_name: formData.delivery ? formData.delivery.name || '' : '',
					// 菜品状态
					goods_status: formData.goods_status.value || 10,
					// 初始销量
					sales_initial: formData.sales_initial || '',
					// 菜品排序
					goods_sort: formData.goods_sort || '',
					// 渠道设置
					open_dealer: formData.open_dealer || '0',
					// 菜品分类
					category_id: formData.category ? formData.category.category_id || '' : '',
					// 分类名称
					category_name: categoryName || '',

					tags: formData.tags || [],
					// 下单减库存
					deduct_stock_type: formData.deduct_stock_type || '10'
				}
				let goods_multi_spec = formData.goods_multi_spec || {}
				this.goods_multi_spec = JSON.parse(JSON.stringify(goods_multi_spec))
				this.unitSpecData()
				this.formData = JSON.parse(JSON.stringify(obj))
				if (!noOld) {
					this.formOldData = JSON.parse(JSON.stringify(obj))
					this.goods_multi_spec_old = JSON.parse(JSON.stringify(goods_multi_spec))
				}
				// 规格列表
				this.$nextTick(() => {
					this.updataImg()

					if (this.formData.content == '') {
						this.sameImg()
					}
				})
			},
			unitImg(list) {
				let baseImages = []
				let newList = []
				list.forEach(element => {
					newList.push(element.image_id)
					baseImages.push({
						type: element.file_media,
						path: element.file_path,
						wxapp_file_id: element.image_id
					})
				});
				if (this.submitTab == 1) {
					this.baseImagesFast = baseImages;
				}
				if (this.submitTab == 2) {
					this.baseImages = baseImages;
				}
				return newList
			},
			// 预览
			goodsPreview() {
				let goods = this.getSubData(true)
				uni.setStorageSync('goodsPreview', goods)
				let url = '/pages/myGoods/goodsPreview/index'
				uni.navigateTo({
					url: url
				});
			},
			submit(goods_status) {
				let goods = this.getSubData(false, goods_status, true)
				if (!goods) {
					return
				}
				let url = ''
				let obj = {
					goods: goods,
					goods_status: this.formData.goods_status,
					goods_sort: this.formData.goods_sort,
					open_dealer: this.formData.open_dealer || 0,
				}
				if (this.goods_id && this.goods_id != '') {
					// console.log(this.checkIsSubmit())
					if (!this.checkIsSubmit()) {
						this.$api.msg('更新成功')
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
						return
					}
					url = 'shop.wxapp.goods/edit'
					obj.wxapp_goods_id = this.goods_id
				} else {
					url = 'shop.wxapp.goods/add'
				}
				this.$refs.submitTips.open(() => {
					uni.showLoading()
					App._post_form(url, obj, (result) => {
						this.isSub = true
						uni.removeStorageSync('addGoodsObj')
						App.showSuccess(result.msg, () => {
							if (this.isList && this.isList != '') {
								uni.navigateBack()
							} else {
								uni.redirectTo({
									url: '/pages/myGoods/goodsList/index'
								})
							}
						});
					}, () => {
						uni.hideLoading()
					})
				})
			},
			checkSubOk(goods) {
				let fieldNames = [{
					name: '菜品图片',
					field: 'images'
				}, {
					name: '菜品名称',
					field: 'goods_name'
				}, {
					name: '菜品简称',
					field: 'goods_short_name'
				}, {
					name: '菜品规格',
					field: 'spec_type'
				}, {
					name: '库存计算方式',
					field: 'deduct_stock_type'
				},{
					name: '菜品分类',
					field: 'tags'
				}, {
					name: '运费模板',
					field: 'delivery_id'
				}]
				let skuFieldNames = [{
					name: '零售价',
					field: 'goods_price'
				}, {
					name: '库存',
					field: 'stock_num'
				}]
				let isSub = true
				console.log(goods)
				for (let index = 0; index < fieldNames.length; index++) {
					const item = fieldNames[index];
					let str = goods[item.field]
					if (item.field == 'images') {
						str = JSON.stringify(str)
					}
					if (str === '' || str === '[]') {
						isSub = false
						this.$api.msg(item.name + '不能为空哟')
						return false
					}
				}
				if (!isSub) {
					return false
				}
				if (goods.spec_type == 10) {
					for (let index = 0; index < skuFieldNames.length; index++) {
						const item = skuFieldNames[index];
						let str = goods.sku[item.field]
						if (str === '') {
							isSub = false
							this.tui.toast(item.name + '不能为空哟')
							return false
						}
					}
				} else if (goods.spec_type == 20) {
					if (goods.spec_many.spec_list && goods.spec_many.spec_list.length > 0) {
						for (let i = 0; i < goods.spec_many.spec_list.length; i++) {
							let isNext = true
							for (let j = 0; j < skuFieldNames.length; j++) {
								let str = goods.spec_many.spec_list[i].form[skuFieldNames[j].field]
								if (str === '') {
									isSub = false
									this.tui.toast(skuFieldNames[j].name + '不能为空哟')
									isNext = false
									return false
								}
							}
							if (!isNext) {
								return false
							}
						}
					} else {
						this.tui.toast('规格不能为空哟')
						isSub = false
					}
				}
				return isSub
			},
			getSubData(images, goods_status, isSubmit) {
				let formData = this.formData
				let baseImages = this.baseImages
				if (this.submitTab == 1) {
					formData = this.formDataFast
					baseImages = this.baseImagesFast
				}
				let goods = {
					goods_name: formData.goods_name,
					goods_short_name: formData.goods_short_name,
					images: images ? baseImages : formData.images,
					selling_point: formData.selling_point,
					spec_type: formData.spec_type,
					deduct_stock_type: formData.deduct_stock_type,
					delivery_id: formData.delivery_id,
					goods_status: formData.goods_status,
					tags: formData.tags,
					sales_initial: formData.sales_initial,
					goods_sort: formData.goods_sort,
					content: formData.content,
					category_id: formData.category_id,
					open_dealer: formData.open_dealer || 0,
					sku: {
						goods_price: formData.goods_price,
						line_price: formData.line_price,
						stock_num: formData.stock_num,
						goods_weight: formData.goods_weight || ''
					}
				}
				let spec_many = this.goods_multi_spec
				goods.spec_many = spec_many || {}
				if (goods_status) {
					goods.goods_status = 20
				}
				if (isSubmit) {
					if (!this.checkSubOk(goods)) {
						return false
					}
					if (!goods.sales_initial || goods.sales_initial == '') {
						goods.sales_initial = Math.floor(Math.random() * 101);
					}
				}
				return JSON.stringify(goods)
			},
			goodsStatusChange(val) {
				// 选择状态
				this.formData.goods_status = (val ? 10 : 20)
			},
			isIndDealerChange(val) {
				this.formData.open_dealer = val ? 1 : 0
			},
			deliveryChange(e) {
				// 选择模板触发
				this.formData.delivery_id = this.deliveryIdList[e.detail.value]
				this.formData.delivery_name = this.deliveryList[e.detail.value]
			},
			openItem(fieldName) {
				let field = this.field[fieldName]
				this.inputType = field.type
				this.title = field.name
				this.maxlength = field.maxlength || '-1'
				if (fieldName == 'selling_point') {
					this.$refs.popupInput._open(this.formData[fieldName], (val) => {
						this.formData[fieldName] = val
					})
				}
			},
			toOtherPage(fieldName) {
				let field = this.field[fieldName]
				let val = this.formData[fieldName]
				if (fieldName == 'content') {
					val = val.replace(/%/g, '%25')
					val = encodeURIComponent(val)
				}
				let dataFieldName = '?fieldName=' + field.fieldName + '&val=' + val
				if (fieldName == 'category_id') {
					dataFieldName += '&source=goods'
				}
				let linkUrl = field.linkUrl + dataFieldName
				uni.navigateTo({
					url: linkUrl
				});
			},
			/**
			 * 设置列表高度
			 */
			setListHeight() {
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750
					let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
					this.ios = ios
					// tap高度
					let scrollHeight = systemInfo.windowHeight - res[0].height - (ios ? 144 : 88) *
						rpx; // swiper高度
					this.scrollHeight = scrollHeight
				});
			},
			// 返回上一页
			back() {
				let data = this;
				uni.navigateBack({
					delta: data.delta
				});
			},
			// tab切换
			tabsChange(index) {
				this.currentTab = index
				if (this.currentTab == 0) {
					this.formData.spec_type = 10
				} else if (this.currentTab == 1) {
					this.formData.spec_type = 20
				}
			},
			sameImg(tip) {
				let baseImages = this.baseImages
				if (this.submitTab == 1) {
					baseImages = this.baseImagesFast
				}
				if (baseImages.length > 0) {
					let text = '';
					let brDom = '<p><br/></p>'
					baseImages.forEach(element => {
						if (element.type == 'video') {
							text += '<p><video style="min-width:100%;" src="' + element.path +
								'" controls="controls"></video></p>';
						} else {
							text += '<p><img style="min-width:100%;" src="' + element.path + '"></img></p>';
						}
					})
					text = text + brDom
					if (this.submitTab == 1) {
						this.formDataFast.content = text;
					}
					if (this.submitTab == 2) {
						this.formData.content = text;
					}
					tip ? App.showSuccess('详情已同步') : ''
				}
			},
			// 图片上传回调
			result: function(e) {
				let arr = []
				let baseImages = []
				e.imgArr.forEach(element => {
					if (element.wxapp_file_id) {
						arr.push(element.wxapp_file_id)
						baseImages.push({
							type: element.type,
							path: element.path,
							wxapp_file_id: element.wxapp_file_id
						})
					}
				});
				if (this.submitTab == 1) {
					this.formDataFast.images = arr;
					this.baseImagesFast = baseImages;
				}
				if (this.submitTab == 2) {
					this.formData.images = arr;
					this.baseImages = baseImages;
				}

				if (this.formData.content == '') {
					this.sameImg()
				}
			},
			remove: function(e) {
				//移除图片
				let index = e.index
				if (this.submitTab == 1) {
					this.formDataFast.images.splice(index, 1);
					this.baseImagesFast.splice(index, 1);
				}
				if (this.submitTab == 2) {
					this.formData.images.splice(index, 1);
					this.baseImages.splice(index, 1);
				}

				if (this.formData.content == '') {
					this.sameImg()
				}
			},
			// 库存计算方式
			radioChange(e) {
				this.formData.deduct_stock_type = e.detail.value
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			// 改变设置暂时隐藏
			changeShowSet() {
				this.showSet = !this.showSet
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = this.old.scrollTop + 100
				});
			},
			changePriceSet() {
				this.priceSet = !this.priceSet
			},
			editorChange(text) {
				// 编辑器返回值
				if (text) {
					this.formData.content = text || ''
				}
			},
			// 分类选择返回
			checkCategory(obj) {
				this.formData.category_id = obj.category_id
				this.formData.category_name = obj.name
			},
			toTag(fieldName) {
				uni.navigateTo({
					url: '/pages/myGoods/history_label/index?tags=' + JSON.stringify(this.formData.tags)
				})
			},
			tagChange(list) {
				this.formData.tags = list
			}
		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
