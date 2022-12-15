import React, { useEffect, useState } from "react";
import DashboardContainer from "../../components/Dashboard/DashboardContainer";
import Nav from "../../components/Nav";
import { Campaign, UserSettingsReq } from "../../components/upreach";
import { useUpreach } from "../../components/useUpreach";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { Modal, TextField } from "@mui/material";
import StatsContainer from "../../components/Dashboard/StatsContainer";
import CampaignsContainer from "../../components/Dashboard/CampaignsContainer";
import { useSelector } from "react-redux";

function Settings() {
  const client = useUpreach();
  let [campaigns, setCampaings] = useState<Campaign[]>();
  let [showModal, setShowModal] = useState(false);
  let [campaignName, setCampaignName] = useState("");
  const [settings, setSettings] = useState<UserSettingsReq>({
    EmailTimeOffset: 2,
    EmailsPerDay: 20,
  });
  //@ts-ignore
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    console.log(Object.keys(user));
    if (Object.keys(user).length > 1) {
      setSettings({
        EmailTimeOffset: user.Settings.EmailTimeOffset,
        EmailsPerDay: user.Settings.EmailsPerDay,
      });
    }
  }, [user]);

  async function onCreateCampaign(name: string) {
    let c = await client!.createCampaign({ Name: name });
    setCampaings(c);
    setShowModal(false);
  }

  useEffect(() => {
    if (!campaigns) client?.getCampaigns().then((res) => setCampaings(res));
  });

  const triggerModal = () => {
    setShowModal((v) => !v);
  };

  return (
    <div>
      <Nav />
      <DashboardContainer>
        <div
          style={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ width: "40vw", height: "40vh", margin: "auto" }}>
            <TextField
              label="Emails Per Day"
              style={{ marginBottom: "10px" }}
              value={settings?.EmailsPerDay}
              onChange={(e) => {
                setSettings((v) => {
                  return { ...v, EmailsPerDay: parseInt(e.target.value) };
                });
              }}
              fullWidth
            />
            <TextField
              label="Space Between Emails"
              style={{ marginBottom: "10px" }}
              value={settings?.EmailTimeOffset}
              onChange={(e) => {
                setSettings((v) => {
                  return { ...v, EmailTimeOffset: parseInt(e.target.value) };
                });
              }}
              fullWidth
            />
            <Button
              onClick={() => {
                client?.changeUserSettings(settings);
              }}
              variant="contained"
            >
              Save
            </Button>
          </div>
        </div>
      </DashboardContainer>
    </div>
  );
}

export default Settings;
