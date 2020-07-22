
<template>
  <div>
    <b-form class="d-flex" @submit="startGame">
      <b-form-select
        :disabled="isGameStarted"
        class="mr-3"
        v-model="activeMode"
        :options="gameModes"
        size="sm"
        required
      ></b-form-select>
      <b-form-input
        :disabled="isGameStarted"
        class="mr-3"
        size="sm"
        placeholder="Enter your name"
        required
      ></b-form-input>
      <b-button
        :disabled="isGameStarted"
        squared
        variant="outline-info"
        size="sm"
        type="submit"
      >START</b-button>
    </b-form>
    <p>score: win-score - {{winCells}} loosed-score - {{loosedCells}}</p>
    <div class="game-board">
      <div
        class="box"
        v-for="el in gridArr"
        :style="{}"
        :key="el.x+el.y"
        :ref="el.x+el.y"
        @click="onCellClick(el.x+el.y)"
      ></div>
    </div>
  </div>
</template>

<script>
import { getGameModes } from "../api/gameSettings";

let interval;

export default {
  data() {
    return {
      gridArr: [],
      lettersArray: ["a", "b", "c", "d", "e", "f"],
      numberArray: [1, 2, 3, 4, 5, 6],
      availableCells: [],
      colorByStatus: {
        neutral: "none",
        active: "blue",
        loosed: "red",
        win: "green"
      },
      userName: "",
      gameModes: [],
      activeCell: "",
      options: [],
      activeMode: null,
      timer: 0,
      winCells: 0,
      loosedCells: 0,
      isGameStarted: false
    };
  },
  methods: {
    setTimeoutByMode() {},
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
      this.winCells += 1;
    },
    setLoosedStatus() {
      this.fillGap("red");
      this.loosedCells += 1;
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
    finishGame() {
      if (interval) clearInterval(interval);

      this.activeCell = null;
      this.isGameStarted = false;

      // this.availableCells = [...this.gridArr];
    },
    showChip() {
      if (this.availableCells.length > 0)
        this.activeCell = this.availableCells[
          Math.floor(Math.random() * this.availableCells.length)
        ];
      this.setNeutralStatus(this.activeCell);
      this.availableCells = this.availableCells.filter(
        el => el !== this.activeCell
      );
    },
    startGame(evt) {
      evt.preventDefault();
      this.winCells = 0;
      this.loosedCells = 0;
      this.isGameStarted = true;
      this.showChip();
    }
  },
  watch: {
    timer: function() {
      if (this.timer >= this.activeMode.delay / 1000 && this.activeCell) {
        this.setLoosedStatus();
        this.showChip();
      }
    }
  },
  created() {
    getGameModes().then(data =>
      // this.gameModes = Object.entries(data.data)
      {
        this.gameModes = Object.entries(data.data).map(el => {
          return {
            value: { name: el[0], delay: el[1].delay },
            text: el[0].replace("Mode", "")
          };
        });
      }
    );
    this.lettersArray.forEach(letterEl => {
      this.numberArray.forEach(numberEl => {
        this.gridArr.push({ x: letterEl, y: numberEl });
      });
    });
    this.availableCells = [...this.gridArr];
  }
};
</script>

<style>
.game-board {
  display: grid;
  grid-template-columns: 50px 50px 50px 50px 50px 50px;
  grid-template-rows: 50px 50px 50px 50px 50px 50px;
  justify-content: center;
}
.box {
  border: 2px solid rgba(0, 0, 0, 0.075);
}
.chip {
  background-color: rgb(42, 224, 42);
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
