import { Drawer } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import css from "./Nav.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
function Index() {
  const router = useRouter();
  const [backlink, setBacklink] = useState("/dashboard");
  useEffect(() => {
    if (router.query["campaignNo"] != undefined) {
      if (router.asPath != `/dashboard/campaign/${router.query["campaignNo"]}`)
        setBacklink(`/dashboard/campaign/${router.query["campaignNo"]}/`);
    }
  }, []);

  return (
    <Drawer
      //   style={{ position: "fixed", display: "block" }}
      variant="permanent"
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <div className={css.navContainer}>
        <Link href={backlink}>
          <ArrowBackIcon />
        </Link>
        <Link href={"/dashboard/settings"}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "solid 1px",
              borderRadius: "20px",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "2px",
              paddingBottom: "2px",
            }}
          >
            <TuneIcon />
            <h1 style={{ marginLeft: "30px", fontSize: "20px" }}>Settings</h1>
          </div>
        </Link>
        <div
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "solid 1px",
            borderRadius: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          <h1 style={{ fontSize: "20px" }}>Logout</h1>
        </div>
      </div>
    </Drawer>
  );
}

export default Index;
