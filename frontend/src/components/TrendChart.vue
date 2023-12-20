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
    const result = await getAllDirectories()
    if (result.success) {
        dirs.value = result.data;
    } else {
        toast.error(result.message);
    }
});

async function handleClickTabpane(dirname) {
    const result = await getImages(dirname)
    if (result.success) {
        images.value = result.data;
    } else {
        toast.error(result.message);
    }
}

</script>

<template>
    <n-tabs @update:value="handleClickTabpane" class="h-[90vh]" size="large" :key="type + placement" type="card" animated
        placement="left">
        <n-tab-pane v-for="dir of dirs" :name="dir" :tab="dir">
            <n-grid :x-gap="0" :y-gap="20" :cols="4">
                <n-grid-item v-for="image of images" :key="image.fullName">
                    <div>
                        <n-image class="bg-cover" width="400" height="200" :src="`http://localhost:3001/${image.url}`" />
                    </div>
                    <div>{{ image.name }}</div>
                    <div>{{ extractDateTime(image.createdAt) }}</div>
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