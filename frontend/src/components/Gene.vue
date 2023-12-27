<script setup>
import { ref, onMounted } from "vue";
import { getAllDirectories, getImages } from "../api"
import { useToast } from "vue-toastification";
import { extractDateTime } from "../utils/extractDateTime"

const dirs = ref([])
const images = ref([])
const toast = useToast()

onMounted(async () => {
    const result = await getAllDirectories("Gene")
    if (result.success) {
        dirs.value = result.data;
        handleClickTabpane(dirs.value[0])
    } else {
        toast.error(result.message);
    }
});

async function handleClickTabpane(name, _ = null) {
    const result = await getImages("Gene", name)
    if (result.success) {
        images.value = result.data;
    } else {
        toast.error(result.message);
    }
}

</script>

<template>
    <el-tab-pane label="Gene" name="Gene">
        <el-tabs tab-position="left" class="" @tab-click="(tab, _) => handleClickTabpane(tab.props.label)">
            <el-tab-pane v-for="dir of dirs" :label="dir" class="h-[80vh] overflow-y-auto">
                <el-space class="m-10" :size="50" wrap>
                    <div v-for="image of images" class=" relative w-[350px] h-[200px]">
                        <el-image preview-teleported :key="image.fullName" :src="`http://localhost:3001/${image.url}`"
                            class="w-[350px] h-[200px]" :zoom-rate="1.2" :max-scale="7"
                            :preview-src-list="[`http://localhost:3001/${image.url}`]" :min-scale="0.2" fit="cover">
                        </el-image>

                        <el-tag :key="image.fullName" type=""
                            class="mx-1 w-[200px] text-ellipsis overflow-hidden absolute bottom-2 left-1" effect="dark"
                            round>{{ image.name }}
                        </el-tag>

                    </div>
                </el-space>
            </el-tab-pane>
        </el-tabs>
    </el-tab-pane>
</template>