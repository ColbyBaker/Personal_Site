import './RepoCard.css';
import React from "react";
import { makeStyles, Card, CardHeader, CardContent, CardActions, Avatar, Typography, Grid } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    marginTop: "10px",
    marginBottom: "10px",
    display: "flex",
  },
  card: {
    width: "100%",
    marginLeft: "15px",
    marginRight: "15px",
    margin: "auto",
    transition: "0.3s",
    minHeight: "270px",
    borderRadius: ".625rem!important",
    //boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    background: "linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))",
    border: "1px solid white",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(255, 210, 255, 0.3)",
    },
  },
  tittle: {
    "&:active": {
      color: "#0000 8E",
    },
  },
  cardContent: {
    minHeight: "120px",
  },
  cardActions: {
    padding: "16px",
  },
  avatar: {
    color: "rgba(0, 30, 60, 1)",
  },
  dot: {
    height: "12px",
    width: "12px",
    borderRadius: "50%",
    display: "inline-block",
  },
}));


export default function RepoCard({ repo, language }) {
  const classes = useStyles();
  return (
    <Grid xs={12} sm={6} lg={3} className={classes.root}>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/octicons/3.5.0/octicons.min.css" />
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              <span
                className="octicon octicon-repo"
                style={{ fontSize: "20px" }}
              ></span>
            </Avatar>
          }
          title={
            <Typography variant="h6">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.tittle}
                style={{ textDecoration: "none", color: "rgba(0, 30, 60, 1)" }}
              >
                {repo.name}
              </a>{" "}
            </Typography>
          }
        />

        <CardContent className={classes.cardContent}>
          <Typography variant="body1">{repo.description}</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          {repo.language ? (
            <React.Fragment>
              <span
                className={classes.dot}
                //style={{ backgroundColor: language[repo.language]["color"] }}
              ></span>
              <Typography style={{ marginRight: "10px", color: "rgba(0, 30, 60, 1)" }}>
                {repo.language}
              </Typography>
            </React.Fragment>
          ) : null}
          {repo.stargazers_count >= 0 ? (
            <React.Fragment>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  marginRight: "10px",
                  color: "black",
                }}
              >
                <span className="octicon octicon-star" style={{ color: "rgba(0, 30, 60, 1)"}}>
                  {" "}
                  {repo.stargazers_count}
                </span>
              </a>
            </React.Fragment>
          ) : null}
        </CardActions>
      </Card>
    </Grid>
  );
};