<script setup>
import { ref, onMounted } from "vue";
import { getAllDirectories, getImages } from "../api"
import { useToast } from "vue-toastification";

const defaultActive = ref("")
const dirs = ref([])
const images = ref([])
const toast = useToast()

onMounted(async () => {
    const result = await getAllDirectories("HotTrendGraph")
    if (result.success) {
        dirs.value = result.data;
        defaultActive.value = dirs.value[0];
        handleClickTabpane(dirs.value[0])
    } else {
        toast.error(result.message);
    }
});

async function handleClickTabpane(name, _ = null) {
    const result = await getImages("HotTrendGraph", name)
    if (result.success) {
        images.value = result.data;
    } else {
        toast.error(result.message);
    }
}

</script>

<template>
    <el-tab-pane label="Hot Trend Graph" name="HotTrendGraph">
        <el-row class="tac">
            <el-col :span="4">
                <el-menu :default-active="defaultActive" @select="(title, _, __, ___) => handleClickTabpane(title)"
                    class="w-[200px] z-10 min-h-[92vh]">
                    <el-menu-item v-for="dir of dirs" :index="dir">
                        <template #title>{{ dir }}</template>
                    </el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="20">
                <el-scrollbar height="94.5vh">
                    <el-image v-for="image of images" preview-teleported :key="image.fullName"
                        :src="`http://localhost:3001/${image.url}`" class="" :zoom-rate="1.2" :max-scale="12"
                        :preview-src-list="[`http://localhost:3001/${image.url}`]" fit="cover">
                    </el-image>
                </el-scrollbar>
            </el-col>
        </el-row>
    </el-tab-pane>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
}

.el-tabs--border-card>.el-tabs__content {
    padding: 0px;
}
</style>