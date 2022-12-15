import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import DashboardContainer from "../../../../components/Dashboard/DashboardContainer";
import StatsContainer from "../../../../components/Dashboard/StatsContainer";
import Nav from "../../../../components/Nav";
import Upreach, { Campaign } from "../../../../components/upreach";
import { getClient, useUpreach } from "../../../../components/useUpreach";
import css from "../../../../styles/CampaignPage.module.css";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import moment from "moment";
const makeCampaignCard = (name: string, link: string) => {
  return (
    <Link href={link}>
      <div
        className={css.campaign_card}
        //   style={{ height: "40px", width: "40px" }}
      >
        <h1>{name}</h1>
      </div>
      <div className={css.backgroundAdd}>
        <AddRoundedIcon></AddRoundedIcon>
      </div>
    </Link>
  );
};

const formatTime = (d: Date): string => {
  // const d = new Date();
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 101).toString().slice(-2);
  const date = (d.getDate() + 100).toString().slice(-2);

  const hours = (d.getHours() + 100).toString().slice(-2);
  const mins = (d.getMinutes() + 100).toString().slice(-2);

  const datenow = `${year}-${month}-${date}T${hours}:${mins}`;
  return datenow;
};
const MakeStartCampaignCard = (name: string, callback: any) => {
  const timeRef = useRef<any>();

  return (
    <div
      style={{
        marginTop: "5vh",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        // width: "80vw",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "20px" }}> Send First Email On:</h1>
      <TextField
        ref={timeRef}
        id="datetime-local"
        type="datetime-local"
        sx={{ width: 250 }}
        defaultValue={formatTime(new Date())}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          const time = timeRef.current.children[0].children[0].value;
          //takes in time
          callback(Upreach.utils.secondsUntilDate(moment(time).toDate()));
        }}
      >
        <div className={css.campaign_card}>
          <h1>{name}</h1>
        </div>
      </div>
    </div>
  );
};
const makeClickableCampaignCard = (name: string, callback: any) => {
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => {
        callback();
      }}
    >
      <div
        className={css.campaign_card}
        //   style={{ height: "40px", width: "40px" }}
      >
        <h1>{name}</h1>
      </div>
      <div className={css.backgroundAdd}>
        <AddRoundedIcon></AddRoundedIcon>
      </div>
    </div>
  );
};

const CampaignStats = ({
  campaign,
  client,
}: {
  campaign: Campaign;
  client: Upreach;
}) => {
  const [campaignStarted, setCampaignStarted] = useState(false);
  const timeRef = useRef<any>();
  useEffect(() => {
    if (campaign.TaskCampaignID != 0) {
      setCampaignStarted(true);
    }
  }, []);
  return (
    <div className={css.campaign_stats_container}>
      <StatsContainer
        sent={campaign.Stats.EmailsSent}
        opens={campaign.Stats.Opens}
        clicks={campaign.Stats.LinkClicks}
        replies={campaign.Stats.Replies}
      ></StatsContainer>
      <div className={css.campaign_stats_container_inner}>
        {makeCampaignCard(
          campaign.Leads.length == 0 ? "Upload Leads" : "Leads",
          `/dashboard/campaign/${campaign.ID}/leads`
        )}
        {makeCampaignCard(
          "Edit Email Sequence",
          `/dashboard/campaign/${campaign.ID}/email_seq`
        )}

        {!campaignStarted ? (
          <div>
            <div
              style={{
                marginTop: "5vh",
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                // width: "80vw",
                alignItems: "center",
              }}
            >
              <h1 style={{ fontSize: "20px" }}> Send First Email On:</h1>
              <TextField
                ref={timeRef}
                id="datetime-local"
                type="datetime-local"
                sx={{ width: 250 }}
                defaultValue={formatTime(new Date())}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const time = timeRef.current.children[0].children[0].value;

                  client.startCampaign(campaign.ID, {
                    FirstEmailOffset: Upreach.utils.secondsUntilDate(
                      moment(time).toDate()
                    ),
                  });
                  setCampaignStarted(true);
                }}
              >
                <div className={css.campaign_card}>
                  <h1>{"Start Campaign"}</h1>
                </div>
              </div>
            </div>
            {/* MakeStartCampaignCard("Start Campaign", (t: number) => {
              client.startCampaign(campaign.ID, {
                FirstEmailOffset: t,
              });
              setCampaignStarted(true);
            })
            
             */}
          </div>
        ) : (
          makeClickableCampaignCard("Stop Campaign", () => {
            client.stopCampaign(campaign.ID);
            setCampaignStarted(false);
          })
        )}
      </div>
    </div>
  );
};
function Index() {
  const client = useUpreach();
  //@ts-ignore

  const { token, user } = useSelector((state) => state.user);

  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>();
  useEffect(() => {
    client?.getCampaign(1, { detailed: true }).then((res) => {
      setCampaign(res);
    });
  }, [client, token]);
  return (
    <div>
      <Nav />
      <DashboardContainer>
        {campaign ? (
          <CampaignStats client={client!} campaign={campaign!} />
        ) : (
          ""
        )}
      </DashboardContainer>
    </div>
  );
}

export default Index;
