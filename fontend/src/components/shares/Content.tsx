import React, { FC } from "react";
import {
  Container,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
} from "@material-ui/core";

import Routes from "./Routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1, 0),
    },
  })
);

const Content: FC = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Container maxWidth="xl">
        <Toolbar />
        <Routes />
      </Container>
    </main>
  );
};

export default Content;
