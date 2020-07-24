
<template>
  <div>
    <b-form class="d-flex" @submit="startGame">
      <b-form-select
        :disabled="isGameStarted"
        class="mr-3 gameBoardInput"
        v-model="activeMode"
        :options="gameModes"
        size="sm"
        required
      ></b-form-select>
      <b-form-input
        :disabled="isGameStarted"
        class="mr-3 gameBoardInput"
        size="sm"
        v-model="userName"
        placeholder="Enter your name"
        required
      ></b-form-input>
      <b-button
        :disabled="isGameStarted"
        squared
        variant="outline-info"
        size="sm"
        type="submit"
        class="gameBoardBtn"
      >{{isGameFinished?"PLAY AGAIN":"PLAY"}}</b-button>
    </b-form>
    <p
      class="text-center mt-2"
      v-if="isGameFinished"
    >{{loosedPoints>=pointsWon?"Computer": userName}} is winner!!!</p>
    <p
      class="text-center mt-2"
      v-else-if="isGameStarted"
    >SCORE: {{userName}} - {{pointsWon}} Computer - {{loosedPoints}}</p>
    <p class="text-center mt-2" v-else-if="!isGameStarted">LET`S PLAY :)</p>
    <div
      class="game-board"
      ref="gameBoard"
      :style="{gridTemplateColumns: cellStyle, gridTemplateRows: cellStyle}"
      :key="key"
    >
      <div
        class="box"
        v-for="el in gridArr"
        :key="el.x+el.y"
        :ref="el.x+el.y"
        @click="onCellClick(el.x+el.y)"
      ></div>
      <p class="mt-4" v-if="primeryMsgShow">Firstly select game mode and enter your name, please!</p>
    </div>
  </div>
</template>

<script>
import { getGameModes } from "../api/gameSettings";
import { postWinner } from "../api/gameWinners";
import { EventBus } from "../helpers/eventBus";
import { v4 as uuidv4 } from "uuid";

let interval;

export default {
  data() {
    return {
      gridArr: [],
      numberXArray: [],
      numberYArray: [],
      availableCells: [],
      colorByStatus: {
        neutral: "none",
        active: "blue",
        loosed: "red",
        win: "green",
      },
      userName: "",
      gameModes: [],
      activeCell: "",
      options: [],
      activeMode: null,
      timer: 0,
      pointsWon: 0,
      loosedPoints: 0,
      isGameStarted: false,
      isGameFinished: false,
      key: uuidv4(),
      cellStyle: "",
      primeryMsgShow: true,
    };
  },

  methods: {
    onCellClick(key) {
      if (key === this.activeCell.x + this.activeCell.y) {
        this.setWinStatus();
        this.showChip();
      }
    },
    fillGap(color) {
      this.$refs[
        this.activeCell.x + this.activeCell.y
      ][0].style.backgroundColor = color;
      this.startTimer();

      if (this.availableCells.length === 0) {
        let timeout = setTimeout(this.finishGame(), this.activeMode.delay);
      }
    },
    setWinStatus() {
      this.fillGap("green");
      this.pointsWon += 1;
    },
    setLoosedStatus() {
      this.fillGap("red");
      this.loosedPoints += 1;
    },
    setNeutralStatus() {
      this.fillGap("blue");
    },
    startTimer() {
      this.timer = 0;
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        this.timer += 1;
      }, this.activeMode.delay);
    },

    showChip() {
      if (this.isGameFinished) return;
      if (this.availableCells.length > 0)
        this.activeCell = this.availableCells[
          Math.floor(Math.random() * this.availableCells.length)
        ];
      this.setNeutralStatus(this.activeCell);
      this.availableCells = this.availableCells.filter(
        (el) => el !== this.activeCell
      );
    },
    createGrid() {
      this.numberXArray = [];
      this.numberYArray = [];
      this.gridArr = [];
      this.availableCells = [];

      for (let i = 0; i <= this.activeMode.fieldCount - 1; i++) {
        this.numberXArray.push(i);
        this.numberYArray.push(i);
      }
      this.numberXArray.forEach((numberX) => {
        this.numberYArray.forEach((numberY) => {
          this.gridArr.push({ x: "x" + numberX, y: "y" + numberY });
        });
      });
      let cellSize = 450 / this.activeMode.fieldCount;
      this.cellStyle = `${cellSize}px `.repeat(this.activeMode.fieldCount);
      this.availableCells = [...this.gridArr];
      this.key = uuidv4();
      this.primeryMsgShow = false;
    },
    startGame(evt) {
      evt.preventDefault();
      if (this.isGameFinished) {
        this.createGrid();
      }
      if (!this.availableCells.length) this.availableCells = this.gridArr;

      this.pointsWon = 0;
      this.loosedPoints = 0;
      this.isGameStarted = true;
      this.isGameFinished = false;
      this.$nextTick(function () {
        this.showChip();
      });
    },

    finishGame() {
      clearInterval(interval);

      this.timer = 0;
      this.isGameFinished = true;
      this.activeCell = null;
      this.isGameStarted = false;
      postWinner({
        winner:
          this.loosedPoints >= this.pointsWon ? "Computer" : this.userName,
        date: new Date().toLocaleString(),
      }).then( data=>  this.updateLeaders(data))
    },
    updateLeaders(updatedData) {
      EventBus.$emit("updateWinnersData", updatedData);
    },
  },
  watch: {
    timer: function () {
      if (this.timer >= this.activeMode.delay / 1000 && this.activeCell) {
        this.setLoosedStatus();
        this.showChip();
      }
    },
    pointsWon: function () {
      if (this.pointsWon >= this.gridArr.length / 2) this.finishGame();
    },
    loosedPoints: function () {
      if (this.loosedPoints >= this.gridArr.length / 2) this.finishGame();
    },
    activeMode: function () {
      this.createGrid();
    },
  },
  created() {
    getGameModes().then((data) =>
      {
        this.gameModes = Object.entries(data.data).map((el) => {
          return {
            value: { name: el[0], delay: el[1].delay, fieldCount: el[1].field },
            text: el[0].replace("Mode", ""),
          };
        });
      }
    );
  },
};
</script>

<style>
.game-board {
  display: grid;
  justify-content: center;
}
.box {
  border: 2px solid rgba(0, 0, 0, 0.075);
  display: block;
}
.gameBoardBtn {
  min-width: min-content;
}
.gameBoardInput {
  max-width: 150px;
}
</style>
