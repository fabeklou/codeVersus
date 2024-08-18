<script setup>
import heroImage from '@/assets/img/Collab-pana.png';
import { defineProps } from 'vue';
defineProps({
  title: {
    type: String,
    default: 'All from your browser!'
  },
  subtitle: {
    type: String,
    default: 'Write - Run - Debug'
  },
  message: {
    type: String,
    default: `Code Versus: Your all-in-one platform for coding excellence. Run code, save snippets, pair program, and challenge peers. Elevate your skills today!`
  }
});
</script>

<template setup>
  <main>
    <div>
      <div class="hero bg-emerald-100 min-h-screen">
        <div class="max-w-[1200px] mx-auto">
          <div class="hero-content flex-col lg:flex-row-reverse">
            <img :src="heroImage" class="w-[100%] lg:w-[55%]" />
            <div class="text-slate-800">
              <h1 class="text-5xl lg:3xl">
                <span class="text-4xl font-bold">{{ subtitle }}</span> <br />{{ title }}
              </h1>
              <p class="py-6">
                {{ message }}
              </p>
              <button class="btn px-8 bg-lime-400 hover:bg-lime-200 border-none text-slate-800">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
