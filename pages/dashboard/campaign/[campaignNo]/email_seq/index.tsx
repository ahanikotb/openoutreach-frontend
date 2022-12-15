import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import css from "../../../../styles/CampaignPage.module.css";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DashboardContainer from "../../../../../components/Dashboard/DashboardContainer";
import Nav from "../../../../../components/Nav";
import { Campaign } from "../../../../../components/upreach";
import { useUpreach } from "../../../../../components/useUpreach";
import EmailTool from "../../../../../components/Dashboard/Email/EmailTool";

function Index() {
  const client = useUpreach();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>();
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
        {campaign ? (
          <EmailTool
            client={client!}
            emails={campaign!.EmailSequence.Emails}
          ></EmailTool>
        ) : (
          ""
        )}
      </DashboardContainer>
    </div>
  );
}

export default Index;
