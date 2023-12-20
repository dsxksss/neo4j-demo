<script setup>
import KnowledgeGraph from './components/KnowledgeGraph.vue';
import TrendChart from './components/TrendChart.vue';
import { useToast } from 'vue-toastification';

useToast().error("进入")
</script>

<template>
  <n-tabs class="h-[90vh]" type="segment" animated>
    <n-tab-pane class="contentCenter" name="chap1" tab="知识图谱">
      <KnowledgeGraph></KnowledgeGraph>
    </n-tab-pane>
    
    <n-tab-pane class="contentCenter" name="chap2" tab="趋势图">
      <TrendChart></TrendChart>
    </n-tab-pane>
  </n-tabs>
</template>


<style scoped>
.contentCenter {
  @apply flex mx-[50px] h-[90vh] w-screen justify-center;
}
</style>