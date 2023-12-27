<script setup>
import Article from '../components/Article.vue';
import Gene from '../components/Gene.vue';
import { ref } from "vue"
const seleted = ref("Article")

</script>

<template>
    <el-tab-pane label="KnowledgeGraph" name="KnowledgeGraph">
        <el-tabs v-model="seleted" class="p-0" type="card" stretch>
            <Article></Article>
            <Gene></Gene>
        </el-tabs>
    </el-tab-pane>
</template>
