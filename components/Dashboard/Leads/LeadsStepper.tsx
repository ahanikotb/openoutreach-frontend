import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import UploadLeads from "./UploadLeads";
import { Input, TextField } from "@mui/material";
import Upreach, { Lead } from "../../upreach";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const steps = ["Upload CSV File", "Choose Fields Name", "Save"];
const Form = ({ setFormState, handleLeads }: any) => {
  return (
    <div
      style={{
        height: "40vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <TextField
        id="outlined-name"
        label="First Name"
        onChange={(e) => {
          setFormState((v: any) => {
            v["FirstName"] = e.target.value;
            return v;
          });
        }}
      ></TextField>{" "}
      <TextField
        id="outlined-name"
        label="Last Name"
        onChange={(e) => {
          setFormState((v: any) => {
            v["LastName"] = e.target.value;
            return v;
          });
        }}
      ></TextField>
      <TextField
        id="outlined-name"
        label="Email"
        onChange={(e) => {
          setFormState((v: any) => {
            v["Email"] = e.target.value;
            return v;
          });
        }}
      ></TextField>
      <TextField
        id="outlined-name"
        label="Personalized Line"
        onChange={(e) => {
          setFormState((v: any) => {
            v["PersonalizedLine"] = e.target.value;
            return v;
          });
        }}
      ></TextField>
      <Button
        onClick={() => {
          handleLeads();
        }}
        variant="contained"
      >
        Parse Leads
      </Button>
    </div>
  );
};
const SuccessStep = () => {
  return (
    <div
      style={{
        height: "40vh",
        justifyContent: "space-evenly",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CheckCircleOutlineIcon
        style={{ color: "green", width: "200px", height: "200px" }}
      />
    </div>
  );
};

export default function LeadsPage({ handleSave }: any) {
  const [csv, setCsv] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [formState, setFormState] = React.useState<any>({});
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const handleLeads = () => {
    try {
      const leads = Upreach.utils.parseUploadedLeads(csv, {
        FirstNameField: !formState["FirstName"]
          ? "FNAME"
          : formState["FirstName"],
        LastNameField: !formState["LastName"] ? "LNAME" : formState["LastName"],
        PersonalizedLineField: !formState["PersonalizedLine"]
          ? "PERSONALIZED LINE"
          : formState["PersonalizedLine"],
        EmailField: !formState["Email"] ? "EMAIL" : formState["Email"],
      });
      setActiveStep(3);
      setLeads(leads);
    } catch {}
  };
  // Upreach.utils.parseUploadedLeads();

  // React.useEffect(() => {
  //   if (csv.length > 1) {
  //     setActiveStep((v) => v + 1);
  //   }
  // }, [csv]);

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    // if (!isStepOptional(activeStep)) {
    //   // You probably want to guard against something like this,
    //   // it should never occur unless someone's actively trying to break something.
    //   throw new Error("You can't skip a step that isn't optional.");
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "25vh",
        left: "25vw",
        marginTop: "10vh",
        marginLeft: "15vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40vw",
        height: "30vw",
        margin: "auto",
        backgroundColor: "white",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (index == 1) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <div>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <SuccessStep />
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                variant="contained"
                onClick={() => {
                  handleSave(leads);
                }}
              >
                Save
              </Button>
            </Box>
          </div>
        ) : (
          <React.Fragment>
            <div
              style={{
                height: "50vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ mt: 2, mb: 1 }}>
                {activeStep == 0 ? (
                  <UploadLeads setActiveStep={setActiveStep} setCsv={setCsv} />
                ) : (
                  ""
                )}
                {activeStep == 1 ? (
                  <Form handleLeads={handleLeads} setFormState={setFormState} />
                ) : (
                  ""
                )}{" "}
              </Typography>
            </div>
            {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box> */}
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}
