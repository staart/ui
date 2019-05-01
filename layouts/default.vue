<template>
  <div>
    <nuxt />
    <notifications width="100%" group="auth" position="top center" />
  </div>
</template>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: whitesmoke;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}
.container--size-small {
  max-width: 400px;
}
.container--top-20height {
  margin-top: 20vh;
}

.vue-notification.notification {
  font-size: inherit;
  margin: 0;
  color: #fff;
  background: none;
  border-left: none;
  text-align: center;
  .notification-content {
    display: inline-block;
    margin: 0 auto;
    text-align: center;
    line-height: 1;
    background-color: #35495e;
    padding: 0.5rem 1rem;
    border-radius: 20rem;
    cursor: pointer;
    &::after {
      content: "×";
      font-weight: bold;
      display: inline-block;
      transform: translateY(-0.1rem) scale(1.25);
      margin-left: 0.75rem;
    }
  }
  .notification-title {
    display: none;
  }
}
.vue-notification.notification--color-danger .notification-content {
  background-color: #c0392b;
}

.button {
  font: inherit;
  border-radius: 0.2rem;
  border: 1px solid #ddd;
  line-height: 1;
  text-decoration: none;
  display: inline-block;
  padding: 0.5rem 1rem;
}
.button--size-large {
  font-size: 120%;
  padding: 1rem 1.25rem;
}
.button--width-full {
  display: block;
  width: 100%;
  box-sizing: border-box;
}
.button--color-primary {
  color: #1abc9c;
  border-color: #1abc9c;
}
.button--color-blue {
  color: #69e;
  border-color: #69e;
}

.text--size-small {
  font-size: 80%;
}
.text--lh-1 {
  line-height: 1.25;
}
.text--color-light {
  color: #555;
}

.section--mt-05 {
  margin-top: 0.5rem;
}
.section--mt-1 {
  margin-top: 1rem;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
