import React, { useMemo, useState, useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import _sortBy from "lodash/sortBy";
import _startCase from "lodash/startCase";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import DragHandleIcon from "@material-ui/icons/DragHandle";

import { IStepProps } from ".";
import FadeList from "../FadeList";
import Column from "../Column";
import EmptyState from "components/EmptyState";
import StyledCard from "components/StyledCard";
import InstagramCard from "components/InstagramCard";
import AddColumnIcon from "assets/icons/AddColumn";

import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";
// import { suggestType } from "./utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    spacer: { height: theme.spacing(1) },
    instagramGrid: { padding: theme.spacing(2) },
    formControlLabel: { marginRight: 0 },
    columnLabel: { flex: 1 },
  })
);

const testToken =
  "IGQVJYTVBqbzJnNk1Ua3UwLVNhSl9obkM3dUNyZAlBlUXhscDNMZAlpTMUkwaHNyYjl6bUZASWGp0V2tpQmlaWUI2SG1YYUlNdUdOS0pVdFhoOFVaWXp1M3JLd3c4X05xcmtpZAGxRS0dCb19lYjZAWWmZAFMgZDZD";

export default function Step1Columns({ config, setConfig, isXs }: IStepProps) {
  const classes = useStyles();

  // Get a list of fields from first 50 documents
  const { tableState } = useFiretableContext();
  const allFields = useMemo(() => {
    const sample = tableState!.rows.slice(0, 50);
    const fields_ = new Set<string>();
    sample.forEach((doc) =>
      Object.keys(doc).forEach((key) => {
        if (key !== "ref") fields_.add(key);
      })
    );
    return Array.from(fields_).sort();
  }, [tableState?.rows]);

  // Store selected fields
  const [selectedFields, setSelectedFields] = useState<string[]>(
    _sortBy(Object.keys(config), "index")
  );

  const [posts, setPosts] = useState<any>([]);
  const [profile, setProfile] = useState({});

  const handleSelect = (field: string) => (_, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      const newSelection = [...selectedFields];
      newSelection.splice(newSelection.indexOf(field), 1);
      setSelectedFields(newSelection);
    }
  };

  const handleSelectAll = () => {
    if (selectedFields.length !== allFields.length)
      setSelectedFields(allFields);
    else setSelectedFields([]);
  };

  const handleDragEnd = (result: DropResult) => {
    const newOrder = [...selectedFields];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination!.index, 0, removed);
    setSelectedFields(newOrder);
  };

  useEffect(() => {
    const fetchData = async () => {
      const query =
        "id,username,timestamp,caption,media_url,media_type,permalink,children";
      const final_url =
        "https://graph.instagram.com/me/media?fields=" +
        query +
        "&access_token=" +
        testToken;

      const response = await fetch(final_url);
      const data = await response.json();
      console.log(data.data);
      setPosts(data.data);
      setProfile(data.data[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setConfig(
      selectedFields.reduce(
        (a, c, i) => ({
          ...a,
          [c]: {
            fieldName: c,
            key: c,
            name: config[c]?.name || _startCase(c),
            type:
              config[c]?.type ||
              //   suggestType(tableState!.rows, c) ||
              FieldType.shortText,
            index: i,
            config: {},
          },
        }),
        {}
      )
    );
  }, [selectedFields]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="overline" gutterBottom component="h2">
          Select Items ({selectedFields.length} of {allFields.length})
        </Typography>
        <Divider />
        <Grid container xs={12} className={classes.instagramGrid}>
          <FormControlLabel
            labelPlacement="end"
            control={
              <Checkbox
                checked={selectedFields.length === allFields.length}
                indeterminate={
                  selectedFields.length !== 0 &&
                  selectedFields.length !== allFields.length
                }
                onChange={handleSelectAll}
                color="default"
              />
            }
            label={
              <Typography variant="caption" color="textSecondary">
                Select all
              </Typography>
            }
            classes={{
              root: classes.formControlLabel,
              label: classes.columnLabel,
            }}
          />
        </Grid>
        <Grid container xs={12}>
          {posts &&
            posts.map((post) => (
              <Grid
                key={`media-${post.id}`}
                item
                className={classes.instagramGrid}
                sm={12}
                md={6}
              >
                <FormControlLabel
                  labelPlacement="end"
                  control={
                    <Checkbox
                      checked={selectedFields.indexOf(post) > -1}
                      aria-label={`Select column ${post}`}
                      onChange={handleSelect(post)}
                      color="default"
                    />
                  }
                  label={<InstagramCard post={post} />}
                  classes={{
                    root: classes.formControlLabel,
                    label: classes.columnLabel,
                  }}
                />
              </Grid>
            ))}
        </Grid>
        {/* </FadeList> */}
        {/* {allFields.map((field) => (
            <li key={field}>
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    checked={selectedFields.indexOf(field) > -1}
                    aria-label={`Select column ${field}`}
                    onChange={handleSelect(field)}
                    color="default"
                  />
                }
                label={<Column label={field} />}
                classes={{
                  root: classes.formControlLabel,
                  label: classes.columnLabel,
                }}
              />
            </li>
          ))} */}
      </Grid>
    </Grid>
  );
}
