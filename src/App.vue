<template >
  <div class="container pt-3">
    <div class="d-flex">
      <game-board class="col-lg-7 p-5"></game-board>
      <leader-board class="col-lg-5 leaderBoardBlock border p-3 pt-4"></leader-board>
    </div>
  </div>
</template>

<script>
import GameBoard from "./components/GameBoard";
import LeaderBoard from "./components/LeaderBoard";

export default {
  components: { GameBoard, LeaderBoard }
};
</script>
