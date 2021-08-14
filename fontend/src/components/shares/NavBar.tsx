import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Link,
  FormControlLabel,
  Switch,
  IconButton,
  Badge,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Logo from "assets/logo.png";

// State
import { useAppDispatch, useAppSelector } from "features/hooks/useRedux";
import { toggleMode } from "features/store/slices/themeSlice";
import { RootState } from "features/store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer,
    },
    logoLink: {
      marginRight: theme.spacing(2),
    },
    logoImage: {
      height: "35px",
    },
    spacer: {
      flexGrow: 1,
    },
    textLink: {
      marginLeft: theme.spacing(2),
    },
    toggleSwitch: {
      marginLeft: theme.spacing(3),
    },
  })
);

const NavBar: FC = () => {
  const classes = useStyles();
  const { mode } = useAppSelector((state: RootState) => state.themeMode);
  const dispatch = useAppDispatch();

  const handleChangedMode = () => {
    dispatch(toggleMode());
  };

  return (
    <AppBar>
      <Toolbar>
        <Link component={RouterLink} to="/" className={classes.logoLink}>
          <img src={Logo} alt="home" className={classes.logoImage} />
        </Link>
        <div className={classes.spacer}></div>

        <Link
          to="/products"
          component={RouterLink}
          underline="none"
          color="inherit"
          className={classes.textLink}
        >
          Products
        </Link>

        <Link
          to="/contact"
          component={RouterLink}
          underline="none"
          color="inherit"
          className={classes.textLink}
        >
          Contact
        </Link>

        <Link
          to="/signin"
          component={RouterLink}
          underline="none"
          color="inherit"
          className={classes.textLink}
        >
          SingIn
        </Link>

        <FormControlLabel
          className={classes.toggleSwitch}
          label={!mode ? "Ligth" : "Dark"}
          labelPlacement="end"
          control={
            <Switch
              color="secondary"
              value={mode}
              onChange={handleChangedMode}
            />
          }
        />

        <IconButton color="inherit">
          <Badge badgeContent={9} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
