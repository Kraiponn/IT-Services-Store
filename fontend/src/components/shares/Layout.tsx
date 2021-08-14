import React, { FC } from "react";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

// State
import { useAppSelector } from "features/hooks/useRedux";
// import { setMode } from "features/store/slices/themeSlice";
import { RootState } from "features/store";

import NavBar from "components/shares/NavBar";
import Content from "components/shares/Content";

const Layout: FC = () => {
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { mode } = useAppSelector((state: RootState) => state.themeMode);

  // useEffect(() => {
  //   dispatch(setMode(prefersDarkMode));
  // }, [prefersDarkMode, dispatch]);

  const theme = createTheme({
    palette: {
      type: mode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Content />
    </ThemeProvider>
  );
};

export default Layout;
