import React, { useState } from "react";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  Button,
  Popover,
  PopoverProps as MuiPopoverProps,
  Grid,
  Typography,
} from "@material-ui/core";
import NewWindow from "react-new-window";

import { useAppContext } from "contexts/AppContext";
import { useSnackContext } from "contexts/SnackContext";
import { instagramAuthHandler } from "firebase/callables";

import TableHeaderButton from "./TableHeaderButton";
import InstagramIcon from "assets/icons/Instagram";
import GoIcon from "assets/icons/Go";
import ImportInstagramWizard from "components/Wizards/ImportInstagramWizard";

import { INSTAGRAM_AUTH_URI } from "../../../constants/auth";

function getQueryString(queryName, queryString) {
  if (typeof queryString !== "string") {
    return null;
  }
  let reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
  let r = queryString.substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    continueButton: {
      margin: theme.spacing(-2, 2.5, 4),
      display: "flex",
      marginLeft: "auto",
    },

    instagramIcon: {
      marginBottom: theme.spacing(2),
    },
    instagramPopover: {
      padding: theme.spacing(5),
    },
  })
);

export interface IImportInstagramProps {
  render?: (
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  ) => React.ReactNode;
  PopoverProps?: Partial<MuiPopoverProps>;
}

export default function ImportInstagram({
  render,
  PopoverProps,
}: IImportInstagramProps) {
  const classes = useStyles();
  const { userDoc } = useAppContext();
  const snackContext = useSnackContext();
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [error, setError] = useState("");
  const [newWindowOpen, setNewWindowOpen] = useState(false);

  const handleInstagramAuth = (data) => {
    const code = getQueryString("code", data);
    const error = getQueryString("error", data);
    if (code) {
      // get the URL params and redirect to our server to use Passport to auth/login
      instagramAuthHandler(code)
        .then((res) => {
          setConnectingInstagram(false);
          setOpen(null);
          setOpenWizard(true);
          snackContext.open({
            variant: "progress",
            message: "Instagram account connected",
          });
        })
        .catch((err) => {
          setConnectingInstagram(false);
          snackContext.open({
            variant: "error",
            message:
              "Couldn't connect to Instagram account. Please try again or contact us: support@cresc.io",
          });
        });
    } else if (error) {
      setConnectingInstagram(false);
      snackContext.open({
        variant: "error",
        message:
          "Couldn't connect to Instagram account. Please try again or contact us: support@cresc.io",
      });
    } else {
      setConnectingInstagram(false);
      snackContext.open({
        variant: "error",
        message:
          "Couldn't connect to Instagram account. Please try again or contact us: support@cresc.io",
      });
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (userDoc?.state?.doc?.instagramAuth?.access_token) {
      console.log(userDoc?.state?.doc?.instagramAuth);
      setOpenWizard(true);
    } else {
      setOpen(event.currentTarget);
    }
  };

  const handleClose = () => {
    setOpen(null);
    setError("");
  };
  const popoverId = open ? "instagram-popover" : undefined;

  const [connectingInstagram, setConnectingInstagram] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);

  return (
    <>
      {render ? (
        render(handleOpen)
      ) : (
        <TableHeaderButton
          title="Import from Instagram"
          onClick={handleOpen}
          icon={<InstagramIcon />}
        />
      )}
      {newWindowOpen && (
        <NewWindow
          url={INSTAGRAM_AUTH_URI}
          onUnload={() => {
            setNewWindowOpen(false);
            const instagramCodeJson = localStorage.getItem("instagramCode");
            if (instagramCodeJson) {
              const instagramCode = JSON.parse(instagramCodeJson);
              handleInstagramAuth(instagramCode?.params);
            }
          }}
          features={{ left: 200, top: 200, width: 400, height: 400 }}
          copyStyles={false}
        />
      )}
      <Popover
        id={popoverId}
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...PopoverProps}
      >
        <Grid
          container
          justify="center"
          alignContent="center"
          alignItems="center"
          direction="column"
          className={clsx(classes.instagramPopover)}
        >
          <Grid
            className={clsx(classes.instagramIcon)}
            container
            justify="center"
          >
            <InstagramIcon color="inherit" />
          </Grid>
          <Grid container direction="column" justify="center">
            {connectingInstagram ? (
              <>
                <Typography align="center" variant="overline" color="inherit">
                  Connecting...
                </Typography>
                <Typography align="center" variant="overline" color="inherit">
                  Please wait
                </Typography>
              </>
            ) : (
              <>
                <Typography align="center" variant="overline" color="inherit">
                  Connect your Instagram account
                </Typography>
                <Typography align="center" variant="overline" color="inherit">
                  To start importing data
                </Typography>
              </>
            )}
          </Grid>
        </Grid>

        <Button
          endIcon={<GoIcon />}
          className={classes.continueButton}
          disabled={connectingInstagram}
          onClick={() => {
            setConnectingInstagram(true);
            setNewWindowOpen(true);
          }}
        >
          Connect
        </Button>
      </Popover>

      {openWizard && (
        <ImportInstagramWizard
        // handleClose={() => setOpenWizard(false)}
        />
      )}
    </>
  );
}
