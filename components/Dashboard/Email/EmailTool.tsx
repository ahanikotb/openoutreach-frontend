import { Props } from "next/script";
import React, { useEffect, useState } from "react";
import Upreach, { Email, Time, TimeUnit } from "../../upreach";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import css from "./EmailTool.module.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FmdBadTwoTone } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";

const EmailComponentItem = (Name: string, Value: string) => {
  return (
    <div className={css.EmailComponentItem}>
      <h1>{Name}</h1>
      <h1>{Value}</h1>
    </div>
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
const EmailComponent = ({
  index,
  updateOffset,
  email,
  showTimeOffset,
  timeOffset,
  removeEmail,
  setAndTriggerModal,
  updateFirstOffset,
}: {
  index: number;
  updateFirstOffset: any;
  removeEmail: any;
  updateOffset: any;
  email: Email;
  showTimeOffset: boolean;
  setAndTriggerModal: any;
  timeOffset: {
    multiplier: number;
    timeUnit: TimeUnit;
  };
}) => {
  const [stepWait, setStepWait] = useState<{
    multiplier: number;
    timeUnit: TimeUnit;
  }>(timeOffset);
  const [step, editStep] = useState<Email>(email);
  useEffect(() => {
    updateStep();
  }, [stepWait]);

  //   useEffect(() => {
  //     editStep({
  //       ...step,
  //       TimeOffset: Upreach.utils.calculateOffsetTime(
  //         stepWait.multiplier,
  //         stepWait.timeUnit
  //       ),
  //     });
  //   }, [stepWait]);
  // const [firstEmailOffset, setFirstEmailOffset] = useState(getCurrentTime());
  const updateStep = () => {
    updateOffset(
      index,
      Upreach.utils.calculateOffsetTime(stepWait.multiplier, stepWait.timeUnit)
    );
  };
  return (
    <div className={css.email_container}>
      <div
        className={css.email_container_inner}
        style={{
          width: "80%",
          height: "10vh",
        }}
      >
        {EmailComponentItem("Step ", `${index + 1}`)}
        {EmailComponentItem("Subject", step.Subject)}
        <div
          onClick={() => {
            setAndTriggerModal(index);
          }}
          className={css.EmailIconButton}
        >
          <EditIcon />
          <h1>Edit Email</h1>
        </div>
        <div className={css.EmailIconButton} onClick={removeEmail}>
          <HighlightOffIcon />
          <h1>Delete Step</h1>
        </div>
      </div>
      {showTimeOffset ? (
        <div className={css.delay_maker}>
          <h1>Wait Time:</h1>
          <FormControl
            style={{
              width: "10vw",
            }}
          >
            <TextField
              placeholder="Multiplier"
              variant="outlined"
              value={stepWait.multiplier}
              onChange={(e) => {
                setStepWait((v) => {
                  return {
                    ...v,
                    multiplier: parseInt(e.target.value),
                  };
                });
              }}
            />
          </FormControl>
          <h1>*</h1>
          <FormControl
            style={{
              width: "15vw",
            }}
          >
            <InputLabel id="demo-simple-select-label">Duration</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stepWait.timeUnit}
              label="Duration"
              onChange={(e) => {
                //@ts-ignore
                setStepWait((v) => {
                  return {
                    ...v,
                    timeUnit: e.target.value,
                  };
                });
              }}
            >
              <MenuItem value={TimeUnit.HOUR}>Hour</MenuItem>
              <MenuItem value={TimeUnit.DAY}>Day</MenuItem>
              <MenuItem value={TimeUnit.WEEK}>Week</MenuItem>
              <MenuItem value={TimeUnit.MONTH}>Month</MenuItem>
              <MenuItem value={TimeUnit.YEAR}>Year</MenuItem>
            </Select>
          </FormControl>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

function EmailTool({ emails, client }: { emails: Email[]; client: Upreach }) {
  const [email_seq, setEmailseq] = useState<Email[]>([]);
  let [showModal, setShowModal] = useState(false);
  let [emailToEdit, setEmailToEdit] = useState(0);
  let [emailContents, setEmailContents] = useState({ subject: "", body: "" });
  const updateFirstOffset = (value: string) => {
    setEmailseq((v) => {
      const x = [...v];
      x[0].TimeOffset = Upreach.utils.secondsUntilDate(moment(value).toDate());
      return x;
    });
  };

  const handleEmailContentSave = () => {
    setEmailseq((v) => {
      const x = [...v];
      if (x.length > emailToEdit)
        x[emailToEdit].Body = Upreach.utils.formatEmailForSending(
          emailContents.body
        );
      x[emailToEdit].Subject = emailContents.subject;
      return x;
    });
    triggerModal();
  };
  const setAndTriggerModal = (v: number) => {
    setEmailToEdit(v);
    setEmailContents({
      subject: email_seq[v].Subject,
      body: email_seq[v].Body,
    });
    triggerModal();
  };

  const triggerModal = () => {
    // setEmailToEdit()
    setShowModal((v) => !v);
  };
  const onSaveSeq = () => {
    client.addEmailSeqToCampaign({
      EmailSeq: {
        Emails: email_seq,
      },
    });
  };
  useEffect(() => {
    if (emails != null) {
      setEmailseq(emails);
    }
  }, []);
  const removeEmailHandler = (index: any) => {
    setEmailseq((v) => {
      const x = [...v];
      x.splice(index, 1);
      return x;
    });
  };

  const updateOffset = (index: any, newValue: number) => {
    setEmailseq((v) => {
      const x = [...v];
      if (x.length > index + 1) x[index + 1]["TimeOffset"] = newValue;
      console.log(x);
      return x;
    });
  };
  const handleNewEmail = () => {
    setEmailseq((v) => {
      return [
        ...v,
        {
          Subject: "Hey [FNAME]!",
          From: "",
          Body: "",
          TimeOffset: Upreach.utils.calculateOffsetTime(1, TimeUnit.DAY),
        },
      ];
    });
  };
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "50vh",
          right: "2vw",
        }}
      >
        <Button onClick={onSaveSeq} variant="contained">
          Save
        </Button>
      </div>
      <div
        style={{
          width: "80vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {email_seq.map((v, i) => (
          <EmailComponent
            index={i}
            removeEmail={() => {
              removeEmailHandler(i);
            }}
            updateFirstOffset={updateFirstOffset}
            updateOffset={updateOffset}
            showTimeOffset={
              email_seq.length == 0 || i == email_seq.length - 1 ? false : true
            }
            setAndTriggerModal={setAndTriggerModal}
            timeOffset={
              i == email_seq.length - 1
                ? Upreach.utils.reverseCalculateOffsetTime(0)
                : Upreach.utils.reverseCalculateOffsetTime(
                    email_seq[i + 1].TimeOffset
                  )
            }
            key={i}
            email={v}
          />
        ))}
        <IconButton onClick={handleNewEmail} size="large">
          <AddCircleIcon
            style={{ width: "50px", height: "50px" }}
          ></AddCircleIcon>
        </IconButton>
      </div>
      <Modal open={showModal} onClose={triggerModal}>
        <div className={css.inner_modal}>
          <div className={css.inner_modal_content}>
            <TextField
              label="Subject"
              style={{ marginBottom: "10px" }}
              value={emailContents.subject}
              onChange={(e) => {
                setEmailContents({ ...emailContents, subject: e.target.value });
                e.target.value;
              }}
              fullWidth
            />

            <TextField
              style={{ marginBottom: "10px" }}
              label="Body"
              rows={20}
              value={Upreach.utils.formatEmailForViewing(emailContents.body)}
              onChange={(e) => {
                setEmailContents({ ...emailContents, body: e.target.value });
                e.target.value;
              }}
              fullWidth
              multiline
            />

            <Button onClick={handleEmailContentSave} variant="contained">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EmailTool;
