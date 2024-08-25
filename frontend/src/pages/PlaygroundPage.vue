<script setup>

</script>

<template>
<div>
  <div class="buttons"></div>
  <div class="editor">
    <div id="code-area"></div>
    <div id="output"></div>
  </div>
</div>
</template>

<style scoped>
* {
  border: solid 1px red;
}

.buttons {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  height: 3rem;
}

.editor {
  display: flex;
  justify-content: space-between;
  height: 90vh;
  max-width: 1200px;
  margin: 0 auto;
}

#code-area {
  width: 50%;
  height: 100%;
  border: solid 1px blue;
}

#output {
  width: 50%;
  height: 100%;
  border: solid 1px green;
}

@media screen and (max-width: 768px) {
  .editor {
    flex-direction: column;
  }

  #code-area {
    width: 100%;
    height:
  }
 
  #output {
  width: 100%;
  height: 50%;
}

}
</style>