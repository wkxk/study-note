<template>
  <div class="wrapper">a</div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
    };
  },
  created() {
    this.$router.push('/')
    this.$router.replace('/')
    this.$router.go(-1)
  },
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>