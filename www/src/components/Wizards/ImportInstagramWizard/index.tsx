import React, { useState, useEffect } from "react";
import _merge from "lodash/merge";

import { useTheme, useMediaQuery, Typography } from "@material-ui/core";

import WizardDialog from "../WizardDialog";
import Step1SelectMedia from "./Step1SelectMedia";
// import Step2EditInfo from "./Step2EditInfo";
// import Step3Preview from "./Step3Preview";

import { ColumnConfig } from "hooks/useFiretable/useTableConfig";
import { useFiretableContext } from "contexts/FiretableContext";

export type TableColumnsConfig = { [key: string]: ColumnConfig };

export type ImportWizardRef = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IStepProps {
  config: TableColumnsConfig;
  setConfig: React.Dispatch<React.SetStateAction<TableColumnsConfig>>;
  updateConfig: (value: Partial<ColumnConfig>) => void;
  isXs: boolean;
}

export default function ImportWizard() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  const { tableState, tableActions, importWizardRef } = useFiretableContext();

  const [open, setOpen] = useState(true);
  if (importWizardRef) importWizardRef.current = { open, setOpen };

  const [config, setConfig] = useState<TableColumnsConfig>({});
  const updateConfig: IStepProps["updateConfig"] = (value) => {
    setConfig((prev) => ({ ..._merge(prev, value) }));
  };

  useEffect(() => {
    if (!tableState || !open) return;

    if (Array.isArray(tableState.filters) && tableState.filters?.length > 0)
      tableActions!.table.filter([]);

    if (Array.isArray(tableState.orderBy) && tableState.orderBy?.length > 0)
      tableActions!.table.orderBy([]);
  }, [open, tableState]);

  if (tableState?.rows.length === 0) return null;

  const handleFinish = () => {
    tableActions?.table.updateConfig("columns", config);
    setOpen(false);
  };

  return (
    <WizardDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Import"
      steps={[
        {
          title: "Choose Columns",
          description: (
            <>
              <Typography gutterBottom>
                It looks like you already have data in this table. You can
                import and view the data by setting up columns for this table.
              </Typography>
              <Typography gutterBottom>
                Start by choosing which columns you want to display, then sort
                your columns.
              </Typography>
            </>
          ),
          content: (
            <Step1SelectMedia
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
              isXs={isXs}
            />
          ),
          disableNext: Object.keys(config).length === 0,
        },
        // {
        //   title: "Rename Columns",
        //   description:
        //     "Rename your Firetable columns with user-friendly names. These changes will not update the field names in your database.",
        //   content: (
        //     <Step2EditInfo
        //       config={config}
        //       setConfig={setConfig}
        //       updateConfig={updateConfig}
        //       isXs={isXs}
        //     />
        //   ),
        // },
        // {
        //   title: "Preview",
        //   description:
        //     "Preview your data with your configured columns. You can change column types by clicking “Edit Type” from the column menu at any time.",
        //   content: (
        //     <Step3Preview
        //       config={config}
        //       setConfig={setConfig}
        //       updateConfig={updateConfig}
        //       isXs={isXs}
        //     />
        //   ),
        // },
      ]}
      onFinish={handleFinish}
    />
  );
}
