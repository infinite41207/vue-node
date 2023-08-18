<template>
  <div ref="scrollContainer">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ScrollPane',

  methods: {
    moveToTarget(currentTag, scrollWrapper) {
      const container = this.$refs.scrollContainer
      const containerWidth = container.offsetWidth
      const tagList = this.$parent.$refs.tag
      const tagSpacing = 0
      let firstTag = null
      let lastTag = null
      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }
      if (firstTag === currentTag) {
        scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item) => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing
        if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
          scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth
        } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
          scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    },
  },
}
</script>

<style lang="scss"></style>
