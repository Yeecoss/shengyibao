
module.exports = {
  data() {
    return {};
  },

  props: {
    id: String,
    lang: {
      type: String,
      default: 'en'
    },
    businessId: Number,
    sessionFrom: String,
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: Boolean,
    appParameter: String,
    ariaLabel: String
  },
  externalClasses: ['hover-class'],
  methods: {}
};