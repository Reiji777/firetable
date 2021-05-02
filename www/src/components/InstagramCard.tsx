import React from "react";
import PropTypes from "prop-types";
import { makeStyles, Grid, Typography, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    height: "150px",
    color: theme.palette.common.white,
    marginBottom: theme.spacing(2),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  gridContainer: { flexWrap: "nowrap" },
  mediaWrapper: { width: "150px", height: "100%" },
  mainFeaturedPostContent: {
    width: "100%",
    padding: theme.spacing(2),
  },
}));

export default function MainFeaturedPost(props) {
  const classes = useStyles();
  const { post } = props;

  return (
    <Paper className={classes.mainFeaturedPost}>
      <Grid container className={classes.gridContainer}>
        {post.media_type === "IMAGE" ? (
          <img className={classes.mediaWrapper} src={post.media_url} alt="" />
        ) : post.media_type === "VIDEO" ? (
          <video className={classes.mediaWrapper} controls>
            <source src={post.media_url} type="video/mp4"></source>
          </video>
        ) : null}
        <Grid item>
          <div className={classes.mainFeaturedPostContent}>
            <Typography variant="caption" color="textPrimary" paragraph>
              {post.caption}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.object,
};
