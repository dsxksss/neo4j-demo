<script setup>
import KnowledgeGraph from '../components/KnowledgeGraph.vue';
import HotTrendGraph from '../components/HotTrendGraph.vue';
import { useToast } from 'vue-toastification';
import { ref } from "vue"
const seleted = ref("KnowledgeGraph")

useToast().error("进入")
</script>

<template>
    <el-tabs v-model="seleted" type="border-card" class="p-0" stretch>
        <KnowledgeGraph></KnowledgeGraph>
        <HotTrendGraph></HotTrendGraph>
    </el-tabs>
</template>