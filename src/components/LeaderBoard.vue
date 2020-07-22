<template>
  <div class>
    <p class="h5">LEADER BOARD</p>

    <b-list-group>
      <b-list-group-item v-for="item in leaderList" :key="item.id" class="d-flex justify-content-between">
        <p class="mb-0">{{item.winner}}</p>
        <p class="mb-0">{{item.date}}</p>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { getWinners } from "../api/gameWinners";

export default {
  data() {
    return {
      leaderList: []
    };
  },
  created() {
    getWinners().then(data => (this.leaderList = data.data));
  }
};
</script>

<style>
</style>
