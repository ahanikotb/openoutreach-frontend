import React, { useEffect, useLayoutEffect, useState } from "react";
import DashboardContainer from "../../components/Dashboard/DashboardContainer";
import Nav from "../../components/Nav";
import { Campaign } from "../../components/upreach";
import { getClient, useUpreach } from "../../components/useUpreach";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { Modal, TextField } from "@mui/material";
import StatsContainer from "../../components/Dashboard/StatsContainer";
import CampaignsContainer from "../../components/Dashboard/CampaignsContainer";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function Campaigns() {
  const upreach = useUpreach();
  const router = useRouter();
  //@ts-ignore
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (token == "") {
      router.push("/signin");
    } else {
      setCampaings(user.Campaings);
      setStats(user.Stats);
    }
  }, []);

  let [stats, setStats] = useState<any>({
    EmailsSent: "0",
    Opens: "0",
    LinkClicks: "0",
    Replies: "0",
  });
  let [campaigns, setCampaings] = useState<Campaign[]>();
  let [showModal, setShowModal] = useState(false);
  let [campaignName, setCampaignName] = useState("");

  async function onCreateCampaign(name: string) {
    let c = await upreach?.createCampaign({ Name: name });
    setCampaings(c);
    setShowModal(false);
  }

  const triggerModal = () => {
    setShowModal((v) => !v);
  };
  if (token == "") {
    return <div></div>;
  }
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
              label="Search Campaigns"
              variant="outlined"
            />
            <Button onClick={triggerModal} variant="contained">
              Create Campaign
            </Button>
          </div>
        </AppBar>
        <StatsContainer
          sent={stats.EmailsSent}
          opens={stats.Opens}
          clicks={stats.LinkClicks}
          replies={stats.Replies}
        ></StatsContainer>
        {campaigns && campaigns?.length >= 1 ? (
          <CampaignsContainer campaigns={campaigns!}></CampaignsContainer>
        ) : (
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "40px",
            }}
          >
            Create Your First Campaign
          </div>
        )}
      </DashboardContainer>
      <Modal open={showModal} onClose={triggerModal}>
        <div
          style={{
            position: "absolute",
            width: "40vw",
            height: "40vw",

            // justifyContent: "center",
            // alignItems: "center",
            backgroundColor: "white",
            top: "60%",
            left: "60%",
            marginTop: "-20vw",
            marginLeft: "-20vw",

            // margin: "auto",
          }}
        >
          <div
            style={{
              margin: "auto",
              width: "80%",
              display: "flex",
              flexDirection: "column",
              height: "40vh",
              justifyContent: "space-evenly",
            }}
          >
            <h1>Create Campaign</h1>
            <TextField
              onChange={(e) => setCampaignName(e.target.value)}
              id="outlined-basic"
              label="Campaign Name"
              variant="outlined"
            />
            <Button
              onClick={() => {
                onCreateCampaign(campaignName);
              }}
              variant="contained"
            >
              Create Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Campaigns;
