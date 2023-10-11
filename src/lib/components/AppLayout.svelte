<div class="flex flex-col h-full w-full">
  <div class="bg-red-400 w-full h-36 flex items-center justify-center">
    <slot name="header" />
  </div>
  <div class="bg-red-300 h-full flex items-center flex-col justify-around">
    <slot />
  </div>
</div>
