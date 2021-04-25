import React, { useState } from "react";
import queryString from "query-string";

import {
  Typography,
  Button,
  Grid,
  makeStyles,
  createStyles,
} from "@material-ui/core";

import AuthCard from "components/Auth/AuthCard";
import CustomInput from "components/CustomInput";
import {
  handleGoogleAuth,
  handleFacebookAuth,
  handleAppleAuth,
  handleEmailAndPasswordAuth,
} from "../../utils/auth";
import GoogleLogo from "assets/google-icon.svg";
import FacebookLogo from "assets/facebook-icon.svg";
import AppleLogo from "assets/apple-icon.svg";
import { useSnackContext } from "contexts/SnackContext";

export default function GoogleAuthPage() {
  const useStyles = makeStyles((theme) =>
    createStyles({
      typography: { margin: theme.spacing(2) },
      button: { marginTop: theme.spacing(1), width: "100%" },
    })
  );
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const snack = useSnackContext();
  const parsedQuery = queryString.parse(window.location.search);

  const authSuccess = () => {
    setLoading(false);
    window.location.replace("/");
  };

  const authError = (error: Error) => {
    setLoading(false);
    console.log(error);
    snack.open({ message: error.message });
  };

  return (
    <AuthCard height={600} loading={loading}>
      <form className="form">
        <CustomInput
          labelText="Email"
          id="email"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setEmail(e.currentTarget.value)}
          type="text"
        />
        <CustomInput
          labelText="Password"
          id="password"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setPassword(e.currentTarget.value)}
          type="password"
        />
        <Button
          className={classes.button}
          onClick={() => {
            setLoading(true);
            handleEmailAndPasswordAuth(authSuccess, authError, email, password);
          }}
          size="large"
          variant="outlined"
        >
          LOG IN
        </Button>
      </form>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
      >
        <Typography className={classes.typography} variant="overline">
          Or
        </Typography>
        <Button
          className={classes.button}
          onClick={() => {
            setLoading(true);
            handleAppleAuth(authSuccess, authError);
          }}
          color="primary"
          size="large"
          variant="outlined"
          startIcon={
            <img
              src={AppleLogo}
              width={16}
              height={16}
              style={{ marginRight: 8, display: "block" }}
            />
          }
        >
          SIGN IN WITH APPLE
        </Button>
        <Button
          className={classes.button}
          onClick={() => {
            setLoading(true);
            handleGoogleAuth(
              authSuccess,
              authError,
              parsedQuery.email as string
            );
          }}
          color="primary"
          size="large"
          variant="outlined"
          startIcon={
            <img
              src={GoogleLogo}
              width={16}
              height={16}
              style={{ marginRight: 8, display: "block" }}
            />
          }
        >
          SIGN IN WITH GOOGLE
        </Button>
        <Button
          className={classes.button}
          onClick={() => {
            setLoading(true);
            handleFacebookAuth(authSuccess, authError);
          }}
          color="primary"
          size="large"
          variant="outlined"
          startIcon={
            <img
              src={FacebookLogo}
              width={16}
              height={16}
              style={{ marginRight: 8, display: "block" }}
            />
          }
        >
          SIGN IN WITH FACEBOOK
        </Button>
      </Grid>
    </AuthCard>
  );
}
