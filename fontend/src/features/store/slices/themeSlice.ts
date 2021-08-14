import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IThemeMode {
  mode: boolean;
}

type PrefersDarkMode = boolean;

const initialState: IThemeMode = {
  mode: false,
};

const themeSlice = createSlice({
  name: "theme-mode",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = !state.mode;
    },
    setMode: (state, action: PayloadAction<PrefersDarkMode>) => {
      state.mode = action.payload === true ? true : false;
    },
  },
});

export const { toggleMode, setMode } = themeSlice.actions;
export default themeSlice.reducer;
