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

import TableHeaderButton from "./TableHeaderButton";
import InstagramIcon from "assets/icons/Instagram";
import GoIcon from "assets/icons/Go";
import ImportInstagramWizard from "components/Wizards/ImportInstagramWizard";

import {
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_REDIRECT_URI,
} from "../../../constants/auth";

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

  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [error, setError] = useState("");

  // const handleOpen = () => {
  //   setOpenWizard(true);
  //   // window.open(
  //   //   `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`
  //   // );
  // };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(event.currentTarget);

  const handleClose = () => {
    setOpen(null);
    setError("");
  };
  const popoverId = open ? "instagram-popover" : undefined;

  const [loading, setLoading] = useState(false);
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
            <Typography align="center" variant="overline" color="inherit">
              Connect your Instagram account
            </Typography>
            <Typography align="center" variant="overline" color="inherit">
              To start importing data
            </Typography>
          </Grid>
        </Grid>

        <Button
          endIcon={<GoIcon />}
          className={classes.continueButton}
          onClick={() => setOpenWizard(true)}
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
