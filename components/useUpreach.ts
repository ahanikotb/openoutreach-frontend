import Upreach from "./upreach";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setClient } from "../redux/user";

export function useUpreach() {
  const [upreach, setUpreach] = useState<Upreach>();
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    let tok = localStorage.getItem("upreach_token");
    if (tok && tok != "") {
      new Upreach(tok).getUserData().then((u) => {
        dispatch(setClient({ token: tok, user: u }));
      });
      setUpreach(new Upreach(tok));
      if (router.asPath == "/signin") {
        router.push("/dashboard");
      }
    } else {
      if (router.asPath != "/signin") {
        router.push("/signin");
      }
    }
  }, []);

  return upreach;
}

export function getClient(tok: string) {
  return new Upreach(tok);
}
