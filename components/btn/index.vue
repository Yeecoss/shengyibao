<template>
<button :class="'custom-class theme-class zan-btn ' + ( inGroup ? 'zan-btn--group' : '' ) + ' ' + ( isLast ? 'zan-btn--last' : '' ) + ' ' + (size ? 'zan-btn--'+size : '') + ' ' + (size === 'mini' ? 'zan-btn--plain' : '') + ' ' + (plain ? 'zan-btn--plain' : '') + ' ' + (type ? 'zan-btn--'+type : '') + ' ' + (loading ? 'zan-btn--loading' : '') + ' ' + (disabled ? 'zan-btn--disabled' : '')" :disabled="disabled" hover-class="button-hover" :open-type="openType" :app-parameter="appParameter" :hover-stop-propagation="hoverStopPropagation" :hover-start-time="hoverStartTime" :hover-stay-time="hoverStayTime" :lang="lang" :session-from="sessionFrom" :send-message-title="sendMessageTitle" :send-message-path="sendMessagePath" :send-message-img="sendMessageImg" :show-message-card="showMessageCard" @tap="handleTap" @contact="bindcontact" @getuserinfo="bindgetuserinfo" @getphonenumber="bindgetphonenumber" @error="binderror" @opensetting="bindopensetting">
  <slot></slot>
</button>
</template>

<script>
var nativeButtonBehavior = require("./native-button-behaviors");

export default {
  data() {
    return {
      inGroup: false,
      isLast: false
    };
  },

  components: {},
  props: {
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  externalClasses: ['custom-class', 'theme-class'],
  mixins: [nativeButtonBehavior],
  relations: {
    '../btn-group/index': {
      type: 'parent',
      linked: function linked() {
        this.setData({
          inGroup: true
        });
      },
      unlinked: function unlinked() {
        this.setData({
          inGroup: false
        });
      }
    }
  },
  methods: {
    handleTap: function handleTap(e) {
      if (this.disabled) {
        this.$emit('disabledclick');
        return;
      }

      this.$emit('btnclick',e);
    },
    switchLastButtonStatus: function switchLastButtonStatus() {
      var isLast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.setData({
        isLast: isLast
      });
    }
  }
};
</script>
<style>
@import "./index.css";
</style>