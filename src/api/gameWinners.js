import axios from "axios";

export const getWinners = () =>
  axios.get(`https://starnavi-frontend-test-task.herokuapp.com/winners`);
