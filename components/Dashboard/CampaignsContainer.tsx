import React from "react";
import css from "./CampaignContainer.module.css";
import { Campaign } from "../upreach";
import Link from "next/link";

function Statistic(name: string, imageLink: string, value: string) {
  return (
    <div className={css.statistic}>
      <h1>{name}</h1>
      <h2>{value}</h2>
    </div>
  );
}

function CampaignContainer({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/dashboard/campaign/${campaign.ID}`}>
      <div className={css.campaign_container}>
        <div className={css.campaign_inner_container}>
          <h1 className={css.campaign_name}>{campaign.Name}</h1>
          <div className={css.statColumn}>
            {Statistic("Sent", "airplane", String(campaign.Stats.EmailsSent))}
            {Statistic("Opens", "airplane", String(campaign.Stats.Opens))}
            {Statistic("Clicks", "airplane", String(campaign.Stats.LinkClicks))}
            {Statistic("Replies", "airplane", String(campaign.Stats.Replies))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CampaignsContainer({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div>
      <h1 className={css.campaigns_header}>Campaigns</h1>
      <div className={css.campaigns_container}>
        {campaigns.map((v, i) => (
          <CampaignContainer campaign={v} key={i} />
        ))}
      </div>
    </div>
  );
}

export default CampaignsContainer;
