<script setup>
import KnowledgeGraph from '../components/KnowledgeGraph.vue';
import TrendChart from '../components/TrendChart.vue';
import { useToast } from 'vue-toastification';
import { ref } from "vue"
const seleted = ref("知识图谱")

useToast().error("进入")
</script>

<template>
    <el-tabs v-model="seleted" type="border-card" class="contentCenter" stretch @tab-click="handleClick">
        <KnowledgeGraph></KnowledgeGraph>
        <TrendChart></TrendChart>
    </el-tabs>
</template>


<style scoped>
.contentCenter {
    @apply flex-col h-[90vh] w-screen justify-center items-center;
}
</style>