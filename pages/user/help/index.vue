<template>
<view>
  <!-- 自定义标题栏 -->
  <navigationBar title="我的帮助" extClass="nav" id="top"></navigationBar>
  <view class="container">
    <div>
      <tui-list-view title="一、常见问题：" unlined="all">
        <block v-for="(item,index) in dataList" :key="index">
          <tui-list-cell @tap="change(item)" unlined :arrow="item.current">
            {{item.name}}
          </tui-list-cell>
        </block>
      </tui-list-view>
    </div>
    <div>
      <tui-list-view title="二、生意宝相关" unlined="all">
        <block v-for="(item,index) in dataList1" :key="index">
          <tui-list-cell @tap="change(item)" unlined :arrow="item.current">
            {{item.name}}
          </tui-list-cell>
        </block>
      </tui-list-view>
    </div>
  </view>
  <popup-tips ref="popupTips" :title="title" :content="content"></popup-tips>
  <popup-tips ref="popupTips1" type="top" :title="title">
    <view class="weInfo">
      <div style="text-align:left"><div>
        企业微信：<image @tap.stop="showItem" style="width:150px;height:150px;vertical-align: top;" src="http://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png"></image>
      </div>
      <div>企业邮箱：kaidanxia@kaidanxia.com</div>
      <div>联系电话：021-54321599</div></div>
    </view>
  </popup-tips>
  <share-bottom ref="shareBottom"></share-bottom>
</view>
</template>

<script>
let App = getApp().globalData;
import popupTips from '@/components/popup-tips/index';
import shareBottom from '@/components/share-bottom/index';

export default {
  data() {
    return {
      title: '',
      content: '',
      dataList: [{
          name: "1、 如何免费开启店铺？",
          type: 'text',
          content: '微信小程序搜索“生意宝”微信等或手机号登陆，登陆后即可点击界面底部“店铺”，按照引导领取属于您的生意宝免费开店权益，开启后您就可以进行新建商品、打单、记账等动作了',
          current: true,
          disabled: false
        },
        {
          name: "2、 如何渠道上家的商品？",
          type: 'text',
          content: '首先需要解锁渠道权限（明虾版），选择您想要渠道的上家的商品，点选渠道按钮，即可把上家的商品渠道到自己的店铺中；也可以选择复制商品，进行二次编辑后上架。',
          current: true,
          disabled: false
        },
        {
          name: "3、 如何上传一个商品",
          type: 'text',
          content: '首先准备好商品的图片和视频，店铺-新建商品按照提示操作；商品规格在填写时可参考实例填写。详细步骤可以参考【生意宝】公众号：常见帮助一栏',
          current: true,
          disabled: false
        },
        {
          name: "4、 如何装修一个店铺",
          type: 'text',
          content: '生意宝提供了装修模板，在电脑网页端https://shop.kaidanxia.com侧边栏小程序点击“编辑”则可进行相应的店铺装修动作。',
          current: true,
          disabled: false
        },
        {
          name: "5、 如何绑定电子面单账号？",
          type: 'text',
          content: '绑定电子面单在手机端和电脑网页端均可操作，设置-电子面单号-新增，按照提示进行操作，您需要跟您合作的快递公司索要：账号名称、账号密码、月结号、网点名称、快递员、运费支付方式。建议填写保存后进行测试。',
          current: true,
          disabled: false
        },
        {
          name: "6、 没有电子面单怎么使用？",
          type: 'text',
          content: '没有电子面单可以在订单里面自行选择快递公司，填写快递单号，保存即可',
          current: true,
          disabled: false
        },
        {
          name: "7、 登记售后如何操作？",
          type: 'text',
          content: '对于退换货很多的用户来说，登记售后是一个非常友好的功能，可以一目了然的掌握店铺的退换货，便捷处理售后，按照页面提示进行登记保存即可。',
          current: true,
          disabled: false
        },
        {
          name: "8、【新建】、【复制】和【同步】",
          type: 'text',
          content: '<div style="text-align:left;"><p>为了让您有更好的体验，请详细阅读并理解【新建】【复制】和【同步】操作的逻辑。<p>' +
            '<h4>一、【新建】</h4>' +
            '<p style="font-size:12px;">1、定义：新建是指用户自己使用新建商品功能，填写相关商品信息后保存，生成一个新建商品；</p>' +
            '<p style="font-size:12px;">2、用途：a、直接上架售卖；b、可被代理直接复制；c、开启店铺渠道和商品渠道后可被直接同步;d、新建商品所有者下架或删除商品，该店铺的同步客户的店铺的相应商品会被下架；</p>' +

            '<h4>二、【复制】</h4>' +
            '<p style="font-size:12px;">1、定义：复制是指不同用户之间可以相互复制对方店铺的商品（该商品可以是新建商品，也可以是复制同步他人店铺的商品）</p>' +
            '<p style="font-size:12px;">2、用途：a、单个或批量复制他人店铺的商品；b、通过复制一个或多个上家的商品，可以快速拥有自己的店铺；两个商品链接之间无关联从属关系；</p>' +

            '<h4>三、【同步】</h4>' +
            '<p style="font-size:12px;">1、定义：同步是指不同用户之间可以相互同步对方店铺的商品（该商品可以是新建商品，也可以是复制同步他人店铺的商品）</p>' +
            '<p style="font-size:12px;">2、用途：a、单个或批量同步他人店铺的商品；b、通过同步一个或多个上家的商品，可以快速拥有自己的店铺；两个商品链接之间有关联从属关系；</p>' +
            '<p style="font-size:12px;">3、风险：a、上家删除商品后，如您同步过该商品，则您的店铺里面该商品将执行下架动作，如果再次上架后该商品将变为自建商品；b、上家修改商品价格信息后，您店铺的商品也会遵循您设置的加价模式进行同步更新；</p>' +

            '【复制】和【同步】用哪个最好？</h4>' +
            '<p style="font-size:12px;">通俗讲：【复制】是从各个店铺进行搬运动作，【同步】则是上家变化、下家跟着变化，各用户应针对自身情况酌情选择。</p>' +

            '<p class="col-m" style="font-size:12px;">【生意宝】上海旭冉信息科技有限公司团队为了满足各种场景的需求，设置了以上功能，请您在使用时阅读并理解以上功能操作的逻辑以及风险，我司不承担任何操作引起的损失。</p></div>',
          current: true,
          disabled: false
        }
        
      ],
      dataList1: [{
          name: "1、 生意宝是什么？",
          type: 'text',
          content: '<div style="text-align:left"><li>免费小程序+APP店铺</li><li>免费相册、一键转发朋友圈</li><li>直播带货，玩转私域流量</li><li>微信收款更便捷</li><li>发展渠道、客户管理更方便</li><li>批量打印快递单</li><li>腾讯云支持、数据更安全</li><li>作图神器，5000万素材任性用--<text>跳转canva优惠码页面</text></li><li>一站式服务，再也不用多软件来回切换</li></div>',
          current: true,
          disabled: false
        },
        {
          name: "2、 生意宝的图标含义",
          type: 'link',
          linkUrl: '/pages/user/icon/index',
          current: true,
          disabled: false
        },
        {
          name: "3、 生意宝的社会责任",
          type: 'text',
          content: '【生意宝】响应国务院办公厅发布《关于支持多渠道灵活就业的意见》，以及国家发改委联合十三个部门，发布《关于支持新业态新模式健康发展 激活消费市场带动扩大就业的意见》的第五条“鼓励发展新个体经济，开辟消费和就业新空间”中指出，鼓励个人创业者，积极培育新个体，支持自主就业。【生意宝】致力于协助小微企业、个体可以通过生意宝更简洁、更强大的业务功能，让工作更加便利、生活更加美好！',
          current: true,
          disabled: false
        },
        {
          name: "4、 生意宝的服务协议",
          type: 'link',
          linkUrl: '/pages/user/agreement/permit',
          content: '',
          current: true,
          disabled: false
        },
        {
          name: "5、 生意宝的隐私政策",
          type: 'link',
          linkUrl: '/pages/user/agreement/privacy',
          content: '',
          current: true,
          disabled: false
        },
        {
          name: "6、 公司简介",
          type: 'text',
          content: '上海旭冉信息科技有限公司创建于2018年3月，主要从事软件开发、人力资源服务、企业信息化建设、企事业单位设备维护及网络安全的等信息服务业务。公司拥有包括高级管理咨询顾问、IT系统规划顾问、资深项目经理、高级产品经理在内的员工八十余名，其中核心员工皆来自于上市公司。公司拥有成熟的软件体系，包括成熟的企业管理软件体系、全新的管理理念和设计理念、全面和深化的企业管理应用为客户带来最大化的价值、高度的稳定性和拓展性、系列产品和解决方案最大限度的满足市场的更新和需要。用最专业的技术、最完善的产品和最周到的服务为客户提供最先进的管理理念和综合信息化服务。',
          current: true,
          disabled: false
        },
        {
          name: "7、 联系我们",
          type: 'imgText',
          content: '',
          current: true,
          disabled: false
        },
        // {
        //   name: "6、 下载APP",
        //   type: 'appUrl',
        //   content: '敬请期待！',
        //   current: true,
        //   disabled: false
        // },
      ]
    };
  },

  components: {
    popupTips,
    shareBottom
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  methods: {
    change(item) {
      if (item.type == 'link') {
        uni.navigateTo({
          url: item.linkUrl
        });
      } else if(item.type == 'appUrl') {
        uni.previewImage({
          urls: ['https://pic.kaidanxia.com/2020-12-08/170058aed524899.png'],
        })
				// this.$refs.shareBottom._popupShowImg('下载','http://pic.kaidanxia.com/2020-08-12/20200812104437d3d307157.jpg')
      } else if(item.type == 'imgText') {
        this.title = item.name
        this.content = item.content
        this.$refs.popupTips1.open()
      } else {
        this.title = item.name
        this.content = item.content
        this.$refs.popupTips.open()
      }
    },
    showItem() {
      uni.previewImage({
        urls: ['https://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png'],
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>