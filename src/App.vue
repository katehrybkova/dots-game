<template >
  <div class="container pt-5">
    <div class="row">
      <game-board  class="col-lg-6"></game-board>
      <leader-board  class="col-lg-6"></leader-board>
    </div>
  </div>
</template>

<script>
import GameBoard from "./components/GameBoard";
import LeaderBoard from "./components/LeaderBoard";

export default {
  data() {
    return {};
  },
  components: { GameBoard, LeaderBoard }
};
</script>

<style scoped>
.col-lg-6{
  height: 100%;
}
</style>