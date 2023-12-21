<script setup>
import { ref, onMounted } from "vue";
import { getAllDirectories, getImages } from "../api"
import { useToast } from "vue-toastification";
import { extractDateTime } from "../utils/extractDateTime"

const placement = ref("left");
const type = ref("card");
const dirs = ref([])
const images = ref([])
const toast = useToast()

onMounted(async () => {
    const result = await getAllDirectories("趋势图")
    if (result.success) {
        dirs.value = result.data;
    } else {
        toast.error(result.message);
    }
});

async function handleClickTabpane(dirname) {
    const result = await getImages("趋势图", dirname)
    if (result.success) {
        images.value = result.data;
    } else {
        toast.error(result.message);
    }
}

</script>

<template>
    <n-tabs @update:value="handleClickTabpane" class="" size="large" :key="type + placement" type="card" animated
        placement="left">
        <n-tab-pane v-for="dir of dirs" class="overflow-y-scroll" :name="dir" :tab="dir">
            <n-grid  :x-gap="0" :y-gap="20" :cols="4">
                <n-grid-item v-for="image of images" :key="image.fullName">
                    <div class=" relative w-[400px] h-[200px]">
                        <n-image open="true" v-show="true" class="bg-cover group"  height="200" :src="`http://localhost:3001/${image.url}`" >
                            <div class="z-10 duration-200 transition-all w-[400px] h-[200px] opacity-0 hover:opacity-100 hover:bg-black/50 text-white absolute bottom-0 left-0">
                                <div class="absolute bottom-0 left-0">
                                    <div>{{ image.name }}</div>
                                    <div>{{ extractDateTime(image.createdAt) }}</div>
                                </div>
                            </div>
                        </n-image>
                    </div>
                </n-grid-item>
            </n-grid>
        </n-tab-pane>
    </n-tabs>
</template>

<style scoped>
image {
    object-fit: cover;
}
</style>