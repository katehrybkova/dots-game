<template>
  <div class>
    <p class="h5 text-center mb-3">LEADER BOARD</p>

    <b-list-group :key="key">
      <b-list-group-item
        v-for="item in leaderList"
        :key="item.id"
        class="d-flex justify-content-between"
      >
        <p class="mb-0">{{item.winner}}</p>
        <p class="mb-0">{{item.date}}</p>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { getWinners } from "../api/gameWinners";
import { EventBus } from "../helpers/eventBus";
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      leaderList: [],
      key: uuidv4(),
    };
  },
  methods: {
    updateWinnersData(data) {
      this.leaderList = data.data.reverse();
      this.$nextTick(function () {
        this.key = uuidv4();
      });
    },
  },
  created() {
    getWinners().then((data) => {
      this.updateWinnersData(data);
    });
    EventBus.$on("updateWinnersData", (updatedData) =>
      this.updateWinnersData(updatedData)
    );
    this.updateWinnersData();
  },
};
</script>

<style >
</style>
