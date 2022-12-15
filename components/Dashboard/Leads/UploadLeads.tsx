import React, { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import Upreach from "../../upreach";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["Upload CSV File", "Choose Fields Name", "Save"];

function UploadLeads({ setCsv, setActiveStep }: any) {
  const [files, setFiles] = useState<any>();
  useEffect(() => {
    if (files) {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        var enc = new TextDecoder("utf-8");
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        //@ts-ignore
        let csv = enc.decode(binaryStr);
        setCsv(csv);
        setActiveStep((i: number) => i + 1);
        // let leads = Upreach.utils.parseUploadedLeads(csv, {
        //   FirstNameField: "FNAME",
        //   LastNameField: "LNAME",
        //   PersonalizedLineField: "PERSONALIZED LINE",
        //   EmailField: "EMAIL",
        // });
        // console.log(leads);
      };

      reader.readAsArrayBuffer(files[0]);
    }
  }, [files]);
  return (
    <div
      style={{
        height: "50vh",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Dropzone
        onDrop={(acceptedFiles) => {
          setFiles(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => {
          return (
            <section>
              <div
                style={{
                  width: "40vw",

                  margin: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30vh",
                  //   width: "100%",
                  //   height: "100%",

                  cursor: "pointer",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <p>Drag &apos;n&apos; drop CSV here</p>
              </div>
            </section>
          );
        }}
      </Dropzone>
    </div>
  );
}

export default UploadLeads;
