<script setup>
import { ref, onMounted } from "vue";
import { getAllDirectories, getImages } from "../api"
import { useToast } from "vue-toastification";

const defaultActive = ref("")
const dirs = ref([])
const images = ref([])
const toast = useToast()

onMounted(async () => {
    const result = await getAllDirectories("Article")
    if (result.success) {
        dirs.value = result.data;
        dirs.value.reverse()
        defaultActive.value = dirs.value[0];
        handleClickTabpane(dirs.value[0])
    } else {
        toast.error(result.message);
    }
});

async function handleClickTabpane(name, _ = null) {
    const result = await getImages("Article", name)
    if (result.success) {
        images.value = result.data;
        images.value.reverse()
    } else {
        toast.error(result.message);
    }
}

</script>

<template>
    <el-tab-pane label="Article" name="Article">
        <el-row class="tac">
            <el-col :span="2">
                <el-scrollbar height="80vh">
                    <el-menu :default-active="defaultActive" @select="(title, _, __, ___) => handleClickTabpane(title)"
                        class="w-[150px] z-10 min-h-[80vh]">
                        <el-menu-item v-for="dir of dirs" :index="dir">
                            <template #title>{{ dir }}</template>
                        </el-menu-item>
                    </el-menu>
                </el-scrollbar>
            </el-col>

            <el-col :span="22">
                <div class="snap-y w-full h-[80vh] overflow-y-auto space-y-10 shadow-lg">
                    <el-image v-for="image of images" preview-teleported :key="image.fullName"
                        :src="`http://localhost:3001/${image.url}`" class="snap-start w-full h-[80vh] overflow-y-auto" :zoom-rate="1.2"
                        :max-scale="12" :preview-src-list="[`http://localhost:3001/${image.url}`]" :min-scale="0.1"
                        fit="cover">
                    </el-image>
                </div>
            </el-col>
        </el-row>
    </el-tab-pane>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
}
</style>