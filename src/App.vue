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

<style scoped>
.leaderBoardBlock {
  height: 580px;
  overflow-y: scroll;
}

.leaderBoardBlock::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(143, 138, 138, 0.3);
  background-color: #f5f5f5;
}

.leaderBoardBlock::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.leaderBoardBlock::-webkit-scrollbar-thumb {
  background-color: #68646483;
}
</style>