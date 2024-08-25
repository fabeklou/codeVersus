import HomePage from './pages/HomePage.vue';
import AboutPage from './pages/AboutPage.vue';
import RegistrationPage from './pages/RegistrationPage.vue';
import LoginPage from './pages/LoginPage.vue';
import PlaygroundPage from './pages/PlaygroundPage.vue';

export const routes = [
  { path: '/', component: HomePage },
  { path: '/home', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/register', component: RegistrationPage },
  { path: '/login', component: LoginPage },
  { path: '/Playground', component: PlaygroundPage }
];
