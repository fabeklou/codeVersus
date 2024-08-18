<script setup>
import snippet from '@/assets/icons/snippet.png';
import moonwalk from '@/assets/icons/moonwalk.png';
import battle from '@/assets/icons/battle.png';
</script>

<template>
  <section class="py-8">
    <h1 class="text-center text-4xl font-bold mt-12 mb-6">Our Services</h1>
    <div class="container-xl lg:container m-auto ]">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg max-w-[1200px] mx-auto">
        <div class="bg-emerald-100 p-6 rounded-lg shadow-md">
          <img :src="snippet" class="w-20 mb-4" />
          <h2 class="text-2xl font-bold">Create and share snippets.</h2>
          <p class="mt-2 mb-4">
            Write, run, and debug your code in real-time. Save your best snippets for future
            reference and share them with the community. Our intelligent tagging system makes it
            easy to organize and discover code snippets, fostering a collaborative learning
            environment.
          </p>
          <a href="#" class="btn px-8 text-lime-400 hover:bg-slate-600 border-none bg-slate-800">
            Create a Snippets ->
          </a>
        </div>

        <div class="bg-emerald-100 p-6 rounded-lg shadow-md">
          <img :src="moonwalk" class="w-20 mb-4" />
          <h2 class="text-2xl font-bold">Have a one on one session.</h2>
          <p class="mt-2 mb-4">
            This real-time pair programming feature allows you to code alongside developers
            worldwide. Share and edit code simultaneously, and communicate via integrated video
            chat. Moonwalk makes remote collaboration effortless.
          </p>
          <a href="#" class="btn px-8 text-lime-400 hover:bg-slate-600 border-none bg-slate-800">
            Start a Moonwalk ->
          </a>
        </div>

        <div class="bg-emerald-100 p-6 rounded-lg shadow-md">
          <img :src="battle" class="w-20 mb-4" />
          <h2 class="text-2xl font-bold">Challenges other developers.</h2>
          <p class="mt-2 mb-4">
            Put your skills to the test in Battle Mode. Challenge other developers to solve coding
            problems in real-time, competing on speed and efficiency. Choose from various difficulty
            levels and problem types to match your skill set.
          </p>
          <a href="#" class="btn px-8 text-lime-400 hover:bg-slate-600 border-none bg-slate-800">
            Ready for Battle ->
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
