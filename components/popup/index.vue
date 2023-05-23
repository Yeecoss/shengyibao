<template>
<pop-manager :show="show" :type="type" :show-overlay="overlay" @clickmask="handleMaskClick">
  <slot></slot>
</pop-manager>
</template>

<script>
import popManager from "../pop-manager/index";

export default {
  data() {
    return {};
  },

  components: {
    popManager
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    // 弹出方向
    type: {
      type: String,
      default: 'center'
    }
  },
  methods: {
    handleMaskClick: function () {
      this.$emit('click-overlay', {});

      if (!this.closeOnClickOverlay) {
        return;
      }

      this.$emit('close', {});
    }
  }
};
</script>
