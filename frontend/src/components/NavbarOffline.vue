<script setup></script>

<template>
  <div class="bg-indigo-600 text-white">
    <div class="navbar max-w-[1200px] mx-auto">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-lime-400 text-slate-800 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/Playground">Snippets</RouterLink></li>
            <li><RouterLink to="/" v-on:click="() => console.log('M')">Moonwalk</RouterLink></li>
            <li><RouterLink to="/" v-on:click="() => console.log('B')">Battle</RouterLink></li>
          </ul>
        </div>
        <a class="btn btn-ghost text-xl font-bold 6xl lg:4xl" href="#home">
          ⚔️<span class="hidden lg:inline"> Code Versus</span>
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/Playground">Snippets</RouterLink></li>
            <li><RouterLink to="/" v-on:click="() => console.log('M')">Moonwalk</RouterLink></li>
            <li><RouterLink to="/" v-on:click="() => console.log('B')">Battle</RouterLink></li>
        </ul>
      </div>
      <div class="navbar-end">
        <RouterLink to="/login" class="link px-4">Login</RouterLink>
        <RouterLink to="/register" class="btn mx-4 px-8 bg-lime-400 hover:bg-lime-200 border-none text-slate-800"
          >Register</RouterLink
        >
      </div>
    </div>
  </div>
</template>
