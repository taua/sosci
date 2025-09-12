export function greet(page) {
  console.log(`Welcome to the ${page} page of Soul Science Studio!`);
}

console.log('Global JS loaded');

if (window.location.pathname.includes('about')) {
  import('./about.js').then(module => {
    module.initAboutPage();
  });
} else if (window.location.pathname.includes('work')) {
  import('./work.js').then(module => {
    module.initWorkPage();
  });
} else if (window.location.pathname.includes('home')) {
  import('./home.js').then(module => {
    module.initHomePage();
  });
} else {
  // Home or default page logic
  console.log('Home page logic here');
}