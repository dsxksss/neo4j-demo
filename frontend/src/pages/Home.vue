<script setup>
import bg from "/bg.jpg";
</script>
<template>
    <div class="w-screen h-screen relative">
        <img :src="bg" class="w-screen h-screen object-center object-cover" alt="" srcset="">
        <div class="flex flex-col items-center pt-[17%] absolute top-0 left-0 w-screen h-screen text-center space-y-8">
            <h1 class="text-transparent tsi text-[3rem]"> Construction and Discovery of Knowledge Graph for Alzheimer's Disease</h1>
            <p class="text-white text-[2rem]"> 阿尔兹海默症知识图谱构建及知识发现
            </p>
        </div>
        <div class="bottom-[22%] left-[46.6%] w-[100px] h-[100px] rounded-full flex justify-center items-center bg-gradient-to-b font-bold from-[#d0dfc8] to-[#99a9e4] relative">
            <router-link to="/graph" class="text-center text-base text-white">
                To<br>
                Explore
            </router-link>
        </div>
    </div>
</template>

<style module>
h1 {
    -webkit-text-stroke: 2px #fff;
}
</style>