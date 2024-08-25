<script setup>
// import Signin from '@/assets/img/Signin-pana.png';
</script>

<template>
  <!-- component -->
  <div class="bg-gray-100 flex justify-center items-center h-screen">
    <!-- Left: Image -->
    <div class="w-1/2 h-screen hidden lg:block">
      <div
        class="object-cover w-full h-full bg-indigo-300 bg-[url('/src/assets/img/Signin-pana.png')] bg-cover opacity-80"
      ></div>
    </div>
    <!-- Right: Login Form -->
    <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 class="text-3xl font-semibold mb-2">Create new account</h1>
      <p class="mb-12">We are happy to have you join the family ...</p>
      <form action="#" method="POST">
        <!-- Username Input -->
        <div class="mb-4">
          <label for="username" class="block text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-indigo-600"
            autocomplete="off"
          />
        </div>
        <!-- Email Input -->
        <div class="mb-4">
          <label for="email" class="block text-gray-600">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-indigo-600"
            autocomplete="off"
          />
        </div>
        <!-- Password Input -->
        <div class="mb-4">
          <label for="password" class="block text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-indigo-600"
            autocomplete="off"
          />
        </div>
        <!-- Repeat Password Input -->
        <div class="mb-4">
          <label for="repeatpassword" class="block text-gray-600">Repeat Password</label>
          <input
            type="password"
            id="repeatpassword"
            name="repeatpassword"
            class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-indigo-600"
            autocomplete="off"
          />
        </div>
        <!-- Sign Up Button -->
        <button
          type="submit"
          class="btn px-8 bg-lime-400 hover:bg-lime-300 border-none text-slate-800 font-semibold rounded-md py-2 w-full"
          @click.prevent
        >
          Sign Up
        </button>
      </form>
      <!-- Login  Link -->
      <div class="mt-6 text-indigo-600 text-center">
        <span class="text-slate-800 mr-4">Already have an account?</span>
        <RouterLink to="/login" href="#" class="hover:underline">Login Here</RouterLink>
      </div>
    </div>
  </div>
</template>
