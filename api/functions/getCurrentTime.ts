import state from "../state";

const getCurrentTime = (): number => state.values.currentTime;

export default getCurrentTime;
