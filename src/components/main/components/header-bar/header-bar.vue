<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <Company v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"></Company>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import customBreadCrumb from './custom-bread-crumb'
import Company from './../company'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb,
    Company
  },
  props: {
    collapsed: Boolean
  },
  mounted(){
    this.setLocal(this.$i18n.locale)
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
    local () {
      return this.$store.state.app.local
    },
  },
  methods: {
    ...mapMutations([
     
      'setLocal',
     
    ]),
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
