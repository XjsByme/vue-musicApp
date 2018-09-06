<!-- 歌曲详情页下-歌曲列表组件 -->

<template>
  <div class="my-song-list">
    <ul>
      <li v-for="(item, index) in songs" class="item">
        <div class="content">
          <p class="name">
            {{item.name}}
          </p>
          <p class="desc">
            {{getDesc(item)}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  watch: {},
  methods: {
    getDesc(item) {
      return `${item.singer} - ${item.album}`
    }
  },
  computed: {},
  created () {},
  mounted () {},
  destroyed () {}
}
</script>

<style lang="scss" scoped>

</style>
