interface State {
  currentTime: number;
  hasInteracted: boolean;
  loadedAssets: number;
}

const state: State = {
  currentTime: 0,
  hasInteracted: false,
  loadedAssets: 0,
};

export default state;
