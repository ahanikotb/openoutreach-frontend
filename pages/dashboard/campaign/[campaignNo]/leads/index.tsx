import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import css from "../../../../styles/UploadLeads.module.css";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DashboardContainer from "../../../../../components/Dashboard/DashboardContainer";
import Nav from "../../../../../components/Nav";
import Upreach, { Campaign, Lead } from "../../../../../components/upreach";
import { useUpreach } from "../../../../../components/useUpreach";
import UploadLeads from "../../../../../components/Dashboard/Leads/UploadLeads";
import LeadsStepper from "../../../../../components/Dashboard/Leads/LeadsStepper";
import {
  AppBar,
  Box,
  Button,
  Modal,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

function Index() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "FirstName",
      headerName: "First name",
      width: 200,
    },
    {
      field: "LastName",
      headerName: "Last name",
      width: 150,
    },
    {
      field: "Email",
      headerName: "Email",

      width: 200,
    },
    {
      field: "PersonalizedLine",
      headerName: "Personalized Line",
      description: "This column has a value getter and is not sortable.",
      width: 600,
    },
  ];
  const client = useUpreach();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>();
  let [showModal, setShowModal] = useState(false);
  if (campaign) {
    console.log(
      campaign!.Leads.map((v) => {
        //@ts-ignore
        v["id"] = v["ID"];
        return v;
      })
    );
  }

  const triggerModal = () => {
    setShowModal((v) => !v);
  };

  const handleSave = async (leads: Lead[]) => {
    let campaignId = router.query["campaignNo"];
    client?.addLeadsToCampaign({
      //@ts-ignore
      CampaignID: parseInt(campaignId),
      Leads: leads,
    });

    setCampaign(
      //@ts-ignore
      await client?.getCampaign(parseInt(campaignId), { detailed: true })
    );
    setShowModal(false);
  };

  useEffect(() => {
    if (!campaign) {
      client?.getCampaign(1, { detailed: true }).then((res) => {
        setCampaign(res);
      });
    }
  });
  return (
    <div>
      <Nav />
      <DashboardContainer>
        <AppBar
          style={{
            backgroundColor: "white",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          position="static"
        >
          <div
            style={{
              display: "flex",
              paddingLeft: "5vw",
              paddingRight: "5vw",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              size="small"
              id="outlined-basic"
              label="Search Leads"
              variant="outlined"
            />
            <Button onClick={triggerModal} variant="contained">
              Add Leads
            </Button>
          </div>
        </AppBar>
        {campaign ? (
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={campaign!.Leads.map((v) => {
                //@ts-ignore
                v["id"] = v["ID"];
                return v;
              })}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              // experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
        ) : (
          ""
        )}
        {/* {campaign?.Leads.map((v, i) => {
          return <div key={i}>{v.FirstName}</div>;
        })} */}
      </DashboardContainer>
      <Modal open={showModal} onClose={triggerModal}>
        <LeadsStepper handleSave={handleSave} />
      </Modal>
    </div>
  );
}

export default Index;
