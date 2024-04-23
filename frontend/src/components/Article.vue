<script setup>
import { ref, onMounted } from "vue";
import { getAllDirectories, getImages, getTexts } from "../api"
import { useToast } from "vue-toastification";

const defaultActive = ref("")
const dirs = ref([])
const images = ref([])
const text = ref("")
const texts = ref([])
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
    const imgResult = await getImages("Article", name)
    const textResult = await getTexts("Article", name)
    if (imgResult.success && textResult.success) {
        images.value = imgResult.data;
        text.value = textResult.data;
        const splitText = text.value.split(/(?=\s*\d+\.\s*)/)
        texts.value = splitText.map(paragraph => paragraph.replace(/\n/g, '<br>'));
        images.value.reverse()
    } else {
        toast.error(imgResult.message);
    }
}



</script>

<template>
    <el-tab-pane label="Article" name="Article">
        <el-row class="tac">
            <el-col :span="2">
                <el-scrollbar height="89.5vh">
                    <el-menu :default-active="defaultActive" @select="(title, _, __, ___) => handleClickTabpane(title)"
                        class="w-[113px] z-10 min-h-[80vh]">
                        <el-menu-item v-for="dir of dirs" :index="dir">
                            <template #title>{{ dir }}</template>
                        </el-menu-item>
                    </el-menu>
                </el-scrollbar>
            </el-col>

            <el-col :span="22" class="flex">
                <div class="snap-y w-full h-[89.7vh] overflow-hidden">
                    <div v-for="image of images" class="snap-start w-full h-full flex justify-center items-center">
                        <el-image preview-teleported :key="image.fullName" :src="`http://localhost:3001/${image.url}`"
                            class="object-cover transition ease-in-out duration-200 hover:-translate-y-1 hover:scale-[1] block object-center scale-[0.9]"
                            :zoom-rate="1.2" :max-scale="12" :preview-src-list="[`http://localhost:3001/${image.url}`]"
                            :min-scale="0.1" fit="cover">
                        </el-image>
                    </div>
                </div>
                <el-scrollbar class="w-[50%] h-[90vh] overflow-y-auto pr-10">
                    <ul class="space-y-1 text-left text-[13px] my-5">
                        <li v-for="(text, index) in texts" :key="index" v-html="text">
                        </li>
                    </ul>
                </el-scrollbar>
            </el-col>
        </el-row>
    </el-tab-pane>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
}

.el-tabs__header {
    margin: 0px;
}
</style>