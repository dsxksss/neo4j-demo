<script setup>
import { ref, onMounted } from "vue";
import { getImages } from "../api"
import { useToast } from "vue-toastification";

const defaultActive = ref("")
const dirs = ref(["DEG", "WGCNA", "Differential co-expression"])
const images = ref([])
const toast = useToast()
const currentDir = ref("DEG")

onMounted(async () => {
    defaultActive.value = dirs.value[0];
    handleClickTabpane(dirs.value[0])
});

async function handleClickTabpane(name, _ = null) {
    const result = await getImages("Gene", name)
    currentDir.value = name;
    if (result.success) {
        images.value = result.data;
    } else {
        toast.error(result.message);
    }
}

function getImageElementStyle(){
    return currentDir.value == "DEG"?
    `object-cover transition ease-in-out duration-200 hover:-translate-y-1 hover:scale-[0.85] block object-center scale-[0.8]`
    : 
    `object-cover transition ease-in-out duration-200 hover:-translate-y-1 hover:scale-[1.05] block object-center scale-[1.0]`
}

</script>

<template>
    <el-tab-pane label="Gene" name="Gene">
        <el-row class="tac">
            <el-col :span="4">
                <el-menu :default-active="defaultActive" @select="(title, _, __, ___) => handleClickTabpane(title)"
                    class="w-[200px] z-10 min-h-[87vh]">
                    <el-menu-item v-for="dir of dirs" :index="dir">
                        <template #title>{{ dir }}</template>
                    </el-menu-item>
                </el-menu>
            </el-col>

            <el-col :span="20">
                <div class="flex w-full h-[89.5vh] items-center justify-center">
                    <el-image v-for="image of images" preview-teleported :key="image.fullName"
                        :src="`http://localhost:3001/${image.url}`" :class="getImageElementStyle()" :zoom-rate="1.2"
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