<script setup>
import KnowledgeGraph from '../components/KnowledgeGraph.vue';
import HotTrendGraph from '../components/HotTrendGraph.vue';
import { ref } from "vue"
const seleted = ref("KnowledgeGraph")

</script>

<template>
    <el-tabs v-model="seleted" type="border-card" class="p-0" stretch>
        <KnowledgeGraph></KnowledgeGraph>
        <HotTrendGraph></HotTrendGraph>
    </el-tabs>
</template>