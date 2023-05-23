<template>
	<div class="loadingBox dis-flex flex-y-center" v-if="show">
    <div class="loading">
      <image class="loadingBg" src="/static/easy-loadimage/loading.gif" mode=""></image>
    </div>
	</div>
</template>

<script>

export default {
  data() {
    return {
			show: true
    };
  },

  components: {
  },
  props: {
  },
  methods: {
		_open(){this.show = true;},
		_hide(){this.show = false;},
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
