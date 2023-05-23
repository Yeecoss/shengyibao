<template>
	<view class="myinfo">
		<!-- 自定义标题栏 -->
		<navigationBar title="商户收款认证" isHelpme extClass="nav" id="top"></navigationBar>
		<template v-if="applyment_state == 'CONTRACT_NOT_EXIST' || applyment_state == ''">
			<scroll-view scroll-y :style="'height: ' + scrollHeight + 'px;'">
				<div v-if="isVip && identity" class="emptyDiv">

				</div>
				<div v-else class="heardTip">
					<text class="leftIcon iconfont2 icon-xingzhuang"></text>满足以下条件才能进行收款认证！
				</div>
				<div class="peopleBox dis-flex flex-y-center">
					<div class="imgBox">
						<div class="imgItem">
							<image mode="aspectFill" :src="user.avatarUrl"></image>
						</div>
					</div>
					<div>
						<div class="nickName dis-flex flex-y-center">
							<text>{{user.nickName}}</text>
							<!-- <view class="titleVip">
								<image v-if="vip" mode="aspectFit" :src="vips[vip] || ''"></image>
							</view> -->
						</div>
						<div class="contact_phone">{{user.contact_phone}}</div>
					</div>
				</div>
				<div class="heardBox">
					<!-- <div class="heardlist dis-flex flex-y-center" :class="isVip ? 'heardlist1' : ''">
          <div class="iconBox dis-flex flex-x-center flex-y-center">
            <text class="iconfont2" :class="isVip ? 'icon-duihao' : 'icon-shanchu1'"></text>
          </div>
          <div>
            明虾/龙虾会员
          </div>
          <div class="toAuthent" v-if="!isVip && !ios" @tap="toOther('member')">去开通</div>
        </div>
        <div class="lineBox">
          <div class="line"></div>
        </div> -->
					<div class="heardlist dis-flex flex-y-center" :class="identity ? 'heardlist1' : ''">
						<div class="iconBox">
							<text class="iconfont2" :class="identity ? 'icon-duihao' : 'icon-shanchu1'"></text>
						</div>
						<div class="authentBox dis-flex flex-x-center flex-y-center">
							<div :class="identity ? 'col-m' : ''">
								<text class="iconfont2" :class="identity ? 'icon-open' : 'icon-close'"></text>
								身份证认证
							</div>
							<div class="toAuthent" v-if="!identity" @tap="toOther('identity')">去认证</div>
							<div :class="company ? 'col-m' : ''" style="margin-left:30rpx">
								<text class="iconfont2" :class="company ? 'icon-open' : 'icon-close'"></text>
								企业认证
							</div>
							<div class="toAuthent" v-if="!company" @tap="toOther('enterprise')">去认证</div>
						</div>
					</div>
					<div class="lineBox">
						<div class="line"></div>
					</div>
					<div class="heardlist dis-flex flex-y-center" :class="isVip && identity ? 'heardlist1' : ''">
						<div class="iconBox dis-flex flex-x-center flex-y-center">
							<text class="iconfont2 icon-Merchants"></text>
						</div>
						<div>
							收款认证
						</div>
					</div>
				</div>
				<template v-if="isVip && identity">
					<div class="padding-Box"></div>
					<div class="typeBox">
						<div class="fieldTitle" style="background:white" @tap="showTip(typeTip)">选择商户类型
							<text class="iconfont2 icon-juxing"></text>
						</div>
						<div class="selectBox dis-flex flex-y-center">
							<div @tap="selectItem(2401)" class="selectItem"
								:class="formData.organization_type == 2401 ? 'selectActive' : ''">小微商户</div>
							<div @tap="selectItem(2500)" class="selectItem"
								:class="formData.organization_type == 2500 ? 'selectActive' : ''">个人卖家</div>
							<!-- <div @tap="selectItem(4)" class="selectItem"
								:class="formData.organization_type == 4 ? 'selectActive' : ''">个人工商户</div>
							<div @tap="selectItem(2)" class="selectItem"
								:class="formData.organization_type == 2 ? 'selectActive' : ''">企业</div> -->
						</div>
					</div>
					<div class="fieldBox" v-for="(item, index) in fieldList" :key="index"
						v-show="item.isEnterprise && (formData.organization_type == '3' || formData.organization_type == '4') || !item.isEnterprise">
						<div class="fieldTitle fieldTitleH" @tap="showTip(item)" v-if="item.label != ''">
							{{item.label}}
							<text v-if="item.tip != ''" class="iconfont2 icon-juxing"></text>
						</div>
						<div class="fieldItem" v-for="(items, indexs) in item.list" :key="indexs" v-if="!items.noShow">
							<div class="label" @tap="showTip(items)">
								{{items.label}}
								<text class="col-m m-l-4" v-if="items.isCheck">*</text>
								<text class="m-l-4 f-24" v-else>(非必填)</text>
								<text v-if="items.tip && items.tip != ''" class="iconfont2 icon-juxing"></text>
							</div>
							<div class="field" :class="indexs + 1 == item.list.length ? 'noBorder' : ''"
								@tap="fieldTap(items)">
								<template v-if="item.noInput">
									<template v-if="items.type == 'text' || items.type == 'number'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<text
												v-if="formData[item.fieldName][items.fieldName] && formData[item.fieldName][items.fieldName]!= ''">{{formData[item.fieldName][items.fieldName]}}</text>
											<text v-else style="color:#BBBCCD">
												{{items.placeholder}}
											</text>
										</template>
										<template v-else>
											<text
												v-if="formData[items.fieldName] && formData[items.fieldName]!= ''">{{formData[items.fieldName]}}</text>
											<text v-else style="color:#BBBCCD">
												{{items.placeholder}}
											</text>
										</template>
									</template>
									<template v-if="items.type == 'img'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<image class="showImg" :src="formData[item.fieldName][items.fieldName]">
											</image>
											<image v-if="items.fieldName == 'id_card_copy'" class="showImg"
												:src="formData[item.fieldName].id_card_national"></image>
										</template>
										<template v-else>
											<image class="showImg" :src="formData[items.fieldName]"></image>
										</template>
									</template>
								</template>
								<template v-else>
									<template v-if="items.type == 'text' || items.type == 'number'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<input type="text" @change="change" @blur="change"
												:placeholder="items.placeholder"
												v-model="formData[item.fieldName][items.fieldName]"
												:maxlength="items.maxlength" />
										</template>
										<template v-else>
											<input type="text" @change="change" @blur="change"
												:placeholder="items.placeholder" v-model="formData[items.fieldName]"
												:maxlength="items.maxlength" />
										</template>
									</template>
									<template v-if="items.type == 'bank_address_code'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<div style="height:44rpx"
												v-if="formData[item.fieldName][items.fieldName] != ''">
												{{formData[item.fieldName][items.fieldName]}}</div>
											<div style="height:44rpx" class="col-9" v-else>{{items.placeholder}}</div>
										</template>
										<template v-else>
											<text
												v-if="formData[items.fieldName] != ''">{{formData[items.fieldName]}}</text>
											<text class="col-9" v-else>{{items.placeholder}}</text>
										</template>
										<text class="tipIcon iconfont2 icon-gengduobeifen2"></text>
									</template>

									<template v-else-if="items.type == 'img'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<tui-upload addText="图片" ref="tuiUpload" :limit="5"
												:source="items.fieldName" :videoLimit="0"
												:value="formData[item.fieldName][items.fieldName]"
												@complete="result($event, item.fieldName, items.fieldName)"
												@remove="remove($event, item.fieldName, items.fieldName)" isShop>
											</tui-upload>
										</template>
										<template v-else>
											<tui-upload addText="图片" ref="tuiUpload" :limit="5"
												:source="items.fieldName" :videoLimit="0"
												:value="formData[items.fieldName]"
												@complete="result($event, item.fieldName, items.fieldName)"
												@remove="remove($event, item.fieldName, items.fieldName)" isShop>
											</tui-upload>
										</template>
									</template>

									<template v-else-if="items.type == 'select'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<picker @change="pickerChange($event, item.fieldName, items)"
												:value="formData[item.fieldName][items.fieldName+ '_name']"
												:range="items.selectList">
												<view class="uni-input onelist-hidden">
													<text
														v-if="formData[item.fieldName][items.fieldName+ '_name'] != ''">{{formData[item.fieldName][items.fieldName+ '_name']}}</text>
													<text class="col-9" v-else>{{items.placeholder}}</text>
												</view>
											</picker>
										</template>
										<template v-else>
											<picker @change="pickerChange($event, item.fieldName, items)"
												:value="formData[items.fieldName+ '_name']" :range="items.selectList">
												<view class="uni-input onelist-hidden">
													<text
														v-if="formData[items.fieldName+ '_name'] != ''">{{formData[items.fieldName+ '_name']}}</text>
													<text class="col-9" v-else>{{items.placeholder}}</text>
												</view>
											</picker>
										</template>
									</template>
									<template v-else-if="items.type == 'largeText'">
										<template v-if="item.fieldName && item.fieldName != ''">
											<textarea @change="change" :disabled="items.disabled"
												style="font-size:28rpx" :placeholder="items.placeholder"
												v-model="formData[item.fieldName][items.fieldName]"
												:maxlength="items.maxlength" />
										</template>
										<template v-else>
											<textarea @change="change" :disabled="items.disabled"
												style="font-size:28rpx;background:#F7F7F7;width:690rpx;padding:10rpx;"
												:placeholder="items.placeholder" v-model="formData[items.fieldName]"
												:maxlength="items.maxlength" />
										</template>
									</template>
								</template>
							</div>
						</div>
					</div>
				</template>
			</scroll-view>
			<view class="footer">
				<button class="but" @tap.stop="submit" :disabled="butDisabled" :class="butDisabled ? 'butDisabled' : ''"
					:limit="1">提交</button>
			</view>
		</template>
		<div class="waiting" v-if="applyment_state == 'CHECKING' || applyment_state == 'AUDITING'">
			<div class="iconBox">
				<text class="iconfont2 icon-time1"></text>
			</div>
			<div class="state">
				资料审核中
			</div>
			<div class="stateMsg">
				审核将在2-3个工作日完成
			</div>
		</div>
		<div class="finish"
			v-if="applyment_state == 'NEED_SIGN' || applyment_state == 'FINISH' || applyment_state == 'FROZEN' || applyment_state == 'ACCOUNT_NEED_VERIFY'">
			<div class="iconBox">
				<text class="iconfont2 icon-open"></text>
			</div>
			<div class="state">
				审核成功{{applyment_state_desc && applyment_state_desc != '' ? '(' + applyment_state_desc + ')' : ''}}
			</div>
			<div class="stateMsg">
				审核成功后不能修改
			</div>
			<div v-if="applyment_state == 'NEED_SIGN'" class="NEED_SIGNTip col-m f-28">
				当前商户收款申请已通过审核，需签署协议方可正常使用。
			</div>
			<div v-if="applyment_state == 'ACCOUNT_NEED_VERIFY'" class="NEED_SIGNTip col-m f-28">
				当前商户收款申请已通过审核，需完成账户验证方可正常使用。
			</div>
			<div v-if="applyment_state == 'NEED_SIGN' || applyment_state == 'ACCOUNT_NEED_VERIFY'"
				class="NEED_SIGNTip1">
				（腾讯微信官方支持）
			</div>
			<div class="link" v-if="applyment_state == 'ACCOUNT_NEED_VERIFY'">
				{{legal_validation_url}}
				<text style="color:#F8B14A" @tap="clipboard(legal_validation_url)">复制</text>
			</div>
			<div class="link" v-if="applyment_state == 'NEED_SIGN'">
				{{sign_url}}
				<text style="color:#F8B14A" @tap="clipboard(sign_url)">复制</text>
			</div>
			<div class="imgTitle">
				签约示例
			</div>
			<div class="imgTip dis-flex flex-y-top flex-x-center">
				<div class="imgTipBox1">
					<div class="imgTipBox" @tap="previewImage(0)">
						<image mode="aspectFill" src="https://pic.kaidanxia.com/2020-11-06/21175349a0f7441.jpg"></image>
					</div>
				</div>
				<div class="step">
					<text class="iconfont2 icon-shangshengbeifen2"></text>
				</div>
				<div class="imgTipBox1">
					<div class="imgTipBox margin-l" @tap="previewImage(1)">
						<image mode="aspectFill" src="https://pic.kaidanxia.com/2020-11-06/211752a63373196.jpg"></image>
					</div>
				</div>
				<div class="step">
					<text class="iconfont2 icon-shangshengbeifen2"></text>
				</div>
				<div class="imgTipBox1">
					<div class="imgTipBox" @tap="previewImage(2)">
						<image mode="aspectFill" src="https://pic.kaidanxia.com/2020-11-06/211753874499230.jpg"></image>
					</div>
				</div>
			</div>
			<div @tap="clipboard(sign_url)" class="toSign" v-if="applyment_state == 'NEED_SIGN'">
				去签署协议(点击复制链接)
			</div>
			<div @tap="clipboard(legal_validation_url)" class="toSign" v-if="applyment_state == 'ACCOUNT_NEED_VERIFY'">
				去完成验证
			</div>
		</div>
		<div class="reject" v-if="applyment_state == 'REJECTED'">
			<div class="iconBox">
				<text class="iconfont2 icon-blacklist"></text>
			</div>
			<div class="state">
				审核失败
			</div>
			<div class="stateMsg">
				<div v-for="(item,index) in audit_detail" :key="index">
					{{item.reject_reason}}
				</div>
			</div>
			<div>
				<div class="reSub" @tap="reSubLink">重新提交</div>
			</div>
		</div>
		<popup-tips ref="popupTips" :endlink="endlinkText" :endlinkText="endlinkText" :endCopy="endCopy"
			@endlinkClick="endlinkClick" :title="title" textAlign="left" :content="content" :showConcle="false"
			:confirmText="confirmText"></popup-tips>
		<loading v-if="loading"></loading>
		<uni-popup ref="popupImg" type="bottom">
			<div class="imgListBox">
				<div class="imgListTitle">搜索开户银行省市编码
					<div class="closeImg" @tap="imgPopClose">
						<text class="iconfont2 icon-shanchu1"></text>
					</div>
				</div>
				<div class="search-inputBox">
					<view class="search-input">
						<view class="dis-flex flex-y-center search-box">
							<text class="iconfont2 icon-searchfor col-9"></text>
							<input @blur="search" v-model="searchKey" class="input" focus="true" placeholder="请输入您搜索的地区"
								placeholderStyle="color:#aba9a9;font-size:24rpx;" type="text" />
						</view>
					</view>
				</div>
				<scroll-view class="imgListScroll" scroll-y>
					<div class="imgList" v-for="(item, index) in codeList" :key="index"
						:class="bank_address_code == item.value ? 'checkImg' : ''" @tap="checkItem(item)">
						{{item.key}}({{item.value}})
					</div>
					<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png"
						:imgWidth="264" :imgHeight="264" v-if="codeList.length == 0">
						<view class="col-9">暂无数据</view>
					</tui-no-data>
				</scroll-view>
				<div class="imgSub">
					<div class="imgSubBut" @tap="imgSubBut">确定</div>
				</div>
			</div>
		</uni-popup>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	let App = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import loading from "@/components/loading";
	import guidePage from '@/components/guide-page';

	export default {
		data() {
			return {
				isNew: true,
				isNew1: true,
				isNew2: true,
				bank_address_code: '',
				searchKey: '',
				codeList: [],
				ios: App.ios,
				user: {},
				vip: '',
				vips: {
					1: 'http://pic.kaidanxia.com/2020-08-06/20200806093701e776a3750.png',
					2: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
					3: 'http://pic.kaidanxia.com/2020-08-06/20200806093703e5b229268.png',
					4: 'http://pic.kaidanxia.com/2020-08-06/20200806093702403126378.png',
				},
				reSub: '',
				confirmText: '我知道了',
				loading: true,
				audit_detail: [],
				legal_validation_url: '',
				sign_url: '',
				// CHECKING：资料校验中
				// ACCOUNT_NEED_VERIFY：待账户验证
				// AUDITING：审核中
				// REJECTED：已驳回
				// NEED_SIGN：待签约
				// FINISH：完成
				// FROZEN：已冻结
				applyment_state: '',
				applyment_state_desc: '',
				butDisabled: true,
				scrollHeight: 0,
				company: null,
				identity: null,
				isVip: true,
				typeTip: {
					label: '商户类型',
					tip: '<div style="color:#4A4A59;text-align:left"><div style="margin-bottom:10px"><text style="color:#333333;">小微商户：</text>指无营业执照的个人商家。</div><div style="margin-bottom:10px"><text style="color:#333333;">个人卖家：</text>指无营业执照，已持续从事电子商务经营活动满6个月，且期间经营收入累计。</div><div style="margin-bottom:10px"><text style="color:#333333;">个体工商户：</text>营业执照上的主体类型一般为个体户、个体工商户、个体经营。</div><div><text style="color:#333333;">企业：</text>营业执照上的主体类型一般为有限公司、有限责任公司。</div></div>',
				},
				content: '',
				title: '',
				endlinkText: '',
				endCopy: '',
				fieldList: [{
						isEnterprise: true,
						label: '营业执照信息',
						tip: '',
						fieldName: 'business_license_info',
						noInput: true,
						checkType: '2',
						list: [{
							label: '证件注册号',
							fieldName: 'business_license_number',
							tip: '请填写营业执照上的注册号/统一社会信用代码，须为15位数字或 18位数字|大写字母。',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: '',
						}, {
							label: '商户名称',
							fieldName: 'merchant_name',
							tip: '请填写营业执照/登记证书的商家名称，2~110个字符，支持括号 。',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '经营者/法定代表人姓名',
							tip: '请填写证件的经营者/法定代表人姓名',
							fieldName: 'legal_person',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '证件扫描件',
							tip: '图片要求：<br>（1）请上传证件的彩色扫描件或彩色数码拍摄件，黑白复印件需加盖公章（公章信息需完整） 。<br>（2）不得添加无关水印（非微信支付商户申请用途的其他水印）。<br>（3）需提供证件的正面拍摄件，完整、照面信息清晰可见。信息不清晰、扭曲、压缩变形、反光、不完整均不接受。<br>（4）不接受二次剪裁、翻拍、PS的证件照片。',
							fieldName: 'business_license_copy',
							placeholder: '请输入',
							type: 'img',
							isCheck: true,
							maxlength: ''
						}]
					},
					{
						label: '经营者/法人身份证信息',
						tip: '',
						noInput: true,
						fieldName: 'id_card_info',
						checkType: '1',
						list: [{
							label: '证件姓名',
							fieldName: 'id_card_name',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '证件号码',
							fieldName: 'id_card_number',
							placeholder: '请输入',
							type: 'number',
							isCheck: true,
							maxlength: ''
						}, {
							label: '证件有效期限',
							tip: '请填写证件有效期的结束时间，注意参照示例中的格式。',
							fieldName: 'id_card_valid_time',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '证件照片',
							fieldName: 'id_card_copy',
							placeholder: '请输入',
							type: 'img',
							isCheck: true,
							maxlength: ''
						}]
					},
					{
						label: '结算银行账户',
						tip: '',
						checkType: '1',
						fieldName: 'account_info',
						list: [{
							label: '账户类型',
							fieldName: 'bank_account_type',
							placeholder: '请选择',
							type: 'select',
							selectList: ['对私账户'],
							selectObj: {
								'对公账户': 74,
								'对私账户': 75
							},
							isCheck: true,
							maxlength: ''
						}, {
							label: '开户银行',
							fieldName: 'account_bank',
							placeholder: '请选择',
							type: 'select',
							selectList: ['工商银行', '交通银行', '招商银行', '民生银行', '中信银行', '浦发银行', '兴业银行', '光大银行',
								'广发银行', '平安银行', '北京银行', '华夏银行', '农业银行', '建设银行', '邮政储蓄银行', '中国银行', '宁波银行',
								'其他银行'
							],
							selectObj: {
								'工商银行': '工商银行',
								'交通银行': '交通银行',
								'招商银行': '招商银行',
								'民生银行': '民生银行',
								'中信银行': '中信银行',
								'浦发银行': '浦发银行',
								'兴业银行': '兴业银行',
								'光大银行': '光大银行',
								'广发银行': '广发银行',
								'平安银行': '平安银行',
								'北京银行': '北京银行',
								'华夏银行': '华夏银行',
								'农业银行': '农业银行',
								'建设银行': '建设银行',
								'邮政储蓄银行': '邮政储蓄银行',
								'中国银行': '中国银行',
								'宁波银行': '宁波银行',
								'其他银行': '其他银行'
							},
							isCheck: true,
							maxlength: ''
						}, {
							label: '开户名称',
							fieldName: 'account_name',
							tip: '选择经营者个人银行卡时，开户名称必须与身份证姓名一致。',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '开户银行全称(含支行)',
							fieldName: 'bank_name',
							placeholder: '17家直连银行无需填写',
							maxlength: '',
							noShow: true,
							type: 'text',
							endlinkText: 'https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/ecommerce/applyments/chapter4_1.shtml',
							tip: '1、17家直连银行无需填写<br>2、需填写银行全称，如"深圳农村商业银行XXX支行" 。<br>3、示例值：施秉县农村信用合作联社城关信用社<br>4、详细参见开户银行全称（含支行）对照表。）对照表：'
						}, {
							label: '银行账号',
							fieldName: 'account_number',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '开户银行省市编码',
							fieldName: 'bank_address_code',
							placeholder: '请选择',
							type: 'bank_address_code',
							isCheck: true,
							maxlength: ''
						}]
					},
					{
						label: '超级管理员信息',
						fieldName: 'contact_info',
						checkType: '1',
						tip: '超级管理员需在开户后进行签约，并可接收日常重要管理信息和进行资金操作，请确定其为商户法定代表人或负责人。',
						tip1: '填写开户本人信息',
						list: [{
							label: '超级管理员类型',
							fieldName: 'contact_type',
							selectList: ['经营者/法人'],
							selectObj: {
								'经营者/法人': 65,
								'负责人': 66
							},
							isCheck: true,
							placeholder: '请输入',
							type: 'select',
							maxlength: ''
						}, {
							label: '超级管理员姓名',
							tip: '姓名需与法人身份证姓名一致。',
							tip1: '填写开户本人姓名',
							fieldName: 'contact_name',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '超级管理员身份证号码',
							tip: '1、该身份证号码需与法人身份证号码一致。<br>2、超级管理员签约时，校验微信号绑定的银行卡实名信息，是否与该证件号码一致。',
							tip1: '填写开户本人身份证号码',
							fieldName: 'contact_id_card_number',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '超级管理员手机',
							tip: '请填写管理员的手机号，11位数字， 用于接收微信支付的重要管理信息及日常操作验证码 。',
							tip1: '填写开户本人手机号',
							fieldName: 'mobile_phone',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}, {
							label: '超级管理员邮箱',
							tip: '用于接收微信支付的开户邮件及日常业务通知。',
							fieldName: 'contact_email',
							placeholder: '请输入',
							type: 'text',
							maxlength: ''
						}]
					},
					{
						label: '店铺信息',
						tip: '',
						checkType: '1',
						fieldName: 'sales_scene_info',
						list: [{
							label: '店铺名称',
							fieldName: 'store_name',
							placeholder: '请输入',
							type: 'text',
							isCheck: true,
							maxlength: ''
						}]
					},
					{
						label: '',
						tip: '',
						fieldName: '',
						checkType: '1',
						list: [{
							label: '商户简称',
							fieldName: 'merchant_shortname',
							tip: '最多16个汉字长度。将在支付完成页向买家展示，需与商家的实际售卖商品相符 。',
							placeholder: '请输入',
							isCheck: true,
							type: 'text',
							maxlength: ''
						}, {
							label: '特殊资质/最多5张',
							fieldName: 'qualifications',
							placeholder: '请输入',
							type: 'img',
							maxlength: '',
							endlinkText: 'https://kf.qq.com/faq/190610B7baQb190610NN3mQN.html',
							tip: '1、根据商户经营业务要求提供相关资质，详情查看《行业对应特殊资质》。<br>2、请提供为“申请商家主体”所属的特殊资质，可授权使用总公司/分公司的特殊资质；<br>3、最多可上传5张照片<br>行业对应特殊资质：'
						}, {
							label: '补充材料/最多5张',
							fieldName: 'business_addition_pics',
							tip: '根据实际审核情况，额外要求提供。最多可上传5张照片',
							placeholder: '请输入',
							type: 'img',
							maxlength: ''
						}, {
							label: '补充说明',
							fieldName: 'business_addition_desc',
							placeholder: '请输入',
							maxlength: '512',
							disabled: false,
							isCheck: false,
							endCopy: '该商户已持续从事电子商务经营活动满6个月，且期间经营收入累计超过20万元。',
							type: 'largeText',
							tip: '1、可填写512字以内 。<br>2、若主体为“个人卖家”，该字段必传，则需填写描述“ 该商户已持续从事电子商务经营活动满6个月，且期间经营收入累计超过20万元。”'
						}]
					}
				],
				formData: {
					organization_type: 2401,
					// 营业执照/登记证书信息
					business_license_info: {
						// 证件扫描件
						business_license_copy: "",
						// 证件注册号
						business_license_number: "",
						// 商户名称
						merchant_name: "",
						// 经营者/法定代表人姓名
						legal_person: ""
					},
					// 经营者/法人身份证信息
					id_card_info: {
						// 证件照片
						id_card_copy: "",
						// 证件反面照片
						id_card_national: "",
						// 证件姓名
						id_card_name: "",
						// 证件号码
						id_card_number: "",
						// 证件有效期限
						id_card_valid_time: ""
					},
					// 是否填写结算银行账户
					need_account_info: true,
					// -结算银行账户
					account_info: {
						// 账户类型
						bank_account_type: "",
						bank_account_type_name: "",
						// 开户名称
						account_name: "",
						// 开户银行
						account_bank: "",
						account_bank_name: "",
						// 开户银行省市编码
						bank_address_code: "",
						// 开户银行全称 （含支行）
						bank_name: "",
						// 银行帐号
						account_number: ""
					},
					// 超级管理员信息
					contact_info: {
						// 超级管理员类型
						contact_type: "",
						contact_type_name: "",
						// 超级管理员姓名
						contact_name: "",
						// 超级管理员身份证件号码
						contact_id_card_number: "",
						// 超级管理员手机
						mobile_phone: "",
						// 超级管理员邮箱
						contact_email: ""
					},
					// 店铺信息
					sales_scene_info: {
						// 店铺名称
						store_name: ""
					},
					// 商户简称
					merchant_shortname: "",
					// 特殊资质
					qualifications: [],
					// 补充材料
					business_addition_pics: [],
					// 补充说明
					business_addition_desc: '',
				}
			};
		},

		components: {
			popupTips,
			loading,
			guidePage
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.reSub) {
				this.reSub = 1
			}
			this.$nextTick(() => {
				this.setListHeight()
			})
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getData()
		},
		methods: {
			search() {
				if (this.searchKey != '') {
					App._get('common/getBankCityCode', {
						keyword: this.searchKey
					}, (result) => {
						if (result.code == 1) {
							this.codeList = result.data || []
						} else {
							this.$api.msg(result.msg)
						}
					})
				}
			},
			imgSubBut() {
				this.formData.account_info.bank_address_code = this.bank_address_code
				this.imgPopClose()
			},
			checkItem(item) {
				this.bank_address_code = item.value || ''
			},
			imgPopClose() {
				this.$refs.popupImg.close()
			},
			fieldTap(items) {
				if (items.fieldName == 'bank_address_code') {
					this.searchKey = ''
					this.codeList = []
					this.bank_address_code = ''
					this.$refs.popupImg.open()
				}
			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: ['https://pic.kaidanxia.com/2020-11-06/21175349a0f7441.jpg',
						'https://pic.kaidanxia.com/2020-11-06/211752a63373196.jpg',
						'https://pic.kaidanxia.com/2020-11-06/211753874499230.jpg'
					]
				})
			},
			// 复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
			endlinkClick(url) {
				uni.navigateTo({
					url: '/pages/user/otherPage/index?url=' + url
				})
			},
			remove(e, name1, name2) {
				if (name1 && name1 != '') {
					this.formData[name1][name2] = e.imgArr
				} else {
					this.formData[name2] = e.imgArr
				}
				this.change()
			},
			result(e, name1, name2) {
				if (name1 && name1 != '') {
					this.formData[name1][name2] = e.imgArr
				} else {
					this.formData[name2] = e.imgArr
				}
				this.change()
			},
			// 选择类型赋值
			pickerChange(e, name1, item) {
				let name2 = item.fieldName
				if (name1 && name1 != '') {
					this.formData[name1][name2 + '_name'] = item.selectList[e.detail.value]
					this.formData[name1][name2] = item.selectObj[this.formData[name1][name2 + '_name']]
				} else {
					this.formData[name2 + '_name'] = item.selectList[e.detail.value]
					this.formData[name2] = item.selectList[this.formData[name2 + '_name']]
				}

				this.fieldList.forEach(item => {
					item.list.forEach(items => {
						if (items.fieldName == 'bank_name') {
							if (this.formData.account_info.account_bank_name == '其他银行') {
								items.noShow = false
								items.isCheck = true
							} else {
								items.noShow = true
								items.isCheck = false
								this.formData.account_info.bank_name = ''
							}
						}
					})
				})
				this.change()
			},
			change() {
				let isCheck = true
				let next = (fieldName, list) => {
					list.forEach(items => {
						if (items.isCheck) {
							let val = ''
							if (fieldName && fieldName != '') {
								val = this.formData[fieldName][items.fieldName] || ''

							} else {
								val = this.formData[items.fieldName] || ''
							}
							if (items.type == 'text' || items.type == 'number' || items.type == 'select' ||
								items.type == 'largeText') {
								if (val == '') {
									isCheck = false

									console.log(items.fieldName)
									console.log(items.isCheck)
								}
							}
							if (items.type == 'img') {
								if (JSON.stringify(val) == '[]') {
									isCheck = false

									console.log(items.fieldName)
									console.log(items.isCheck)
								}
							}
						}
					})
				}
				this.fieldList.forEach(item => {
					if (this.formData.organization_type == 2401 || this.formData.organization_type == 2500) {
						if (item.checkType == '1') {
							next(item.fieldName, item.list)
						}
					} else {
						if (item.checkType == '2') {
							next(item.fieldName, item.list)
						}
					}
				})
				if (isCheck) {
					this.butDisabled = false
				} else {
					this.butDisabled = true
				}
			},
			toOther(type) {
				let url = '/pages/user/' + type + '/index?fieldName=' + type
				uni.navigateTo({
					url: url
				});
			},
			reSubLink() {
				uni.navigateTo({
					url: '../collectionAgreement/index?reSub=1'
				});
			},
			getData() {
				App._get('shop.commerce.applyment/status', {}, (result) => {
					if (result.code == 1) {
						if (!this.reSub) {
							this.applyment_state = result.data.applyment_state || ''
							// this.applyment_state = 'REJECTED'
							this.applyment_state_desc = result.data.applyment_state_desc || ''

							this.legal_validation_url = result.data.legal_validation_url || ''
							this.sign_url = result.data.sign_url || ''
							this.audit_detail = result.data.audit_detail || []
						}
					} else {
						this.$api.msg(result.msg)
					}
					this.loading = false
				}, () => {
					this.loading = false
				})
				App._get('wxapp/getAuthorizationBaseInfo', {}, (result) => {
					if (result.code == 1) {
						if (result.data.company) {
							if (this.isNew1) {
								this.isNew1 = false
								this.company = result.data.company
								this.formData.business_license_info = {
									// 证件扫描件
									business_license_copy: this.company.upload_pic,
									// 证件注册号
									business_license_number: this.company.credit_code,
									// 商户名称
									merchant_name: this.company.company_name,
									// 经营者/法定代表人姓名
									legal_person: this.company.legal_person
								}
							}
						}
						let vip = result.data.user.vip || 0
						this.vip = vip
						if (result.data.identity) {
							if (this.isNew2) {
								this.isNew2 = false
								this.identity = result.data.identity
								this.formData.id_card_info = {
									// 证件照片
									id_card_copy: this.identity.front_url,
									// 证件反面照片
									id_card_national: this.identity.behind_url,
									// 证件姓名
									id_card_name: this.identity.real_name,
									// 证件号码
									id_card_number: this.identity.id_number,
									// 证件有效期限
									id_card_valid_time: this.identity.expired_date
								}
								this.formData.contact_info = {
									// 超级管理员类型
									contact_type: "65",
									contact_type_name: "经营者/法人",
									// 超级管理员姓名
									contact_name: this.identity.real_name,
									// 超级管理员身份证件号码
									contact_id_card_number: this.identity.id_number,
									// 超级管理员手机
									mobile_phone: this.formData.contact_info.mobile_phone,
									// 超级管理员邮箱
									contact_email: this.formData.contact_info.contact_email
								}
							}
							// if (vip > 1 && vip < 5) {
							//   this.isVip = true
							// }
						}
						if (this.isNew) {
							this.isNew = false
							this.user = result.data.user
						}
					}
				})
			},
			showTip(item) {
				let tip = ''
				if (item.fieldName == 'contact_info' || item.fieldName == 'contact_name' || item.fieldName ==
					'contact_id_card_number' || item.fieldName == 'mobile_phone') {

					if (this.formData.organization_type == 2401 || this.formData.organization_type == 2500) {
						tip = item.tip1
					} else {
						tip = item.tip
					}
				} else {
					tip = item.tip
				}
				if (tip && tip != '') {
					this.title = item.label
					this.content = tip
					this.endlinkText = item.endlinkText || ''
					let next = null
					this.confirmText = '我知道了'
					if (item.endCopy && item.endCopy != '') {
						this.confirmText = '复制'
						next = () => {
							this.clipboard(item.endCopy)
						}
					}
					this.$refs.popupTips.open(next)
				}
			},
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
					let scrollHeight = systemInfo.windowHeight - res[0].height - (ios ? 140 : 100) *
					rpx; // swiper高度
					this.scrollHeight = scrollHeight
				});
			},
			materialChange(list, fieldName) {
				this.formData[fieldName] = JSON.parse(JSON.stringify(list))
				this.$nextTick(() => {
					if (this.$refs.tuiUpload) {
						this.$refs.tuiUpload.forEach(item => {
							item.unit()
						})
					}
				})
			},
			submit() {
				let obj = JSON.parse(JSON.stringify(this.formData))
				let business_addition_pics = []
				obj.business_addition_pics.forEach(element => {
					business_addition_pics.push(element.path)
				});
				obj.business_addition_pics = business_addition_pics
				if (obj.business_addition_pics.length == 0) {
					delete obj.business_addition_pics
				}
				let qualifications = []
				obj.qualifications.forEach(element => {
					qualifications.push(element.path)
				});
				obj.qualifications = qualifications
				if (obj.qualifications.length == 0) {
					delete obj.qualifications
				}

				delete obj.account_info.bank_account_type_name
				delete obj.contact_info.contact_type_name
				delete obj.account_info.account_bank_name

				if (this.formData.organization_type == 2401 || this.formData.organization_type == 2500) {
					delete obj.business_license_info
				}
				console.log(this.formData)
				console.log(obj.business_license_info)
				console.log(obj.account_info)

				wx.showLoading();
				App._post_json_form('shop.commerce.applyment/add', obj, result => {
					if (result.code == '1') {
						this.$api.msg(result.msg)
						uni.navigateBack();
					} else {
						this.$api.msg(result.msg)
						wx.hideLoading();
					}
				}, false, () => {
					wx.hideLoading();
				});
			},
			selectItem(type) {
				if (type == 4 || type == 2) {
					if (this.formData.organization_type != 2 && this.formData.organization_type != 4) {
						this.formData.contact_info = {
							// 超级管理员类型
							contact_type: "",
							contact_type_name: "",
							// 超级管理员姓名
							contact_name: this.identity.real_name,
							// 超级管理员身份证件号码
							contact_id_card_number: this.identity.id_number,
							// 超级管理员手机
							mobile_phone: "",
							// 超级管理员邮箱
							contact_email: ""
						}
					}
					if (!this.company) {
						this.$api.msg('请先进行企业认证～')
						return
					}
					this.fieldList[3].list[0].selectList = ['经营者/法人', '负责人']
					if (type == 2) {
						this.fieldList[2].list[0].selectList = ['对公账户']
					} else {
						this.fieldList[2].list[0].selectList = ['对私账户', '对私账户']
					}
				} else {
					this.fieldList[2].list[0].selectList = ['对私账户']
					this.fieldList[3].list[0].selectList = ['经营者/法人']
				}
				if (type == 2500) {
					this.fieldList.forEach(item => {
						item.list.forEach(items => {
							if (items.fieldName == 'business_addition_desc') {
								items.disabled = true
								items.isCheck = true
							}
						})
					})
					this.formData.business_addition_desc = '该商户已持续从事电子商务经营活动满6个月，且期间经营收入累计超过20万元。'
				} else {
					this.fieldList.forEach(item => {
						item.list.forEach(items => {
							if (items.fieldName == 'business_addition_desc') {
								items.disabled = false
								items.isCheck = false
							}
						})
					})
					this.formData.business_addition_desc = ''
				}
				this.formData.account_info.bank_account_type = ''
				this.formData.account_info.bank_account_type_name = ''
				this.formData.contact_info.contact_type = ''
				this.formData.contact_info.contact_type_name = ''
				this.formData.organization_type = type
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
