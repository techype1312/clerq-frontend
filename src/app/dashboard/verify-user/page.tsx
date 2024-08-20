"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Step1 from "@/components/verifyUser/Step1";
import Step2 from "@/components/verifyUser/Step2";
import Step4 from "@/components/verifyUser/Step4";
import { useUserContext } from "@/context/User";

const VerifyUserPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(2);
  const { userData, updateUserLocalData, refetchUserData, setRefetchUserData } =
    useUserContext();

  const changeStep = (step: number) => {
    setStep(step);
    if (totalSteps === 3) {
      router.push(
        "/dashboard/verify-user?step=" + step + "&totalSteps=" + totalSteps
      );
    } else {
      router.push("/dashboard/verify-user?step=" + step);
    }
  };
  const [staticForFirstTime, setStaticForFirstTime] = useState(false); // Need this for a very specific use case which is causing infinite loop

  useEffect(() => {
    setRefetchUserData(!refetchUserData);
  }, [setRefetchUserData]);

  // const searchParamStep = parseInt(searchParams.get("step") ?? "1");

  useEffect(() => {
    if (searchParams.get("step")) {
      const steps = parseInt(searchParams.get("step") ?? "1");
      setStep(steps);
    }
    if (searchParams.get("totalSteps")) {
      const totalStep = parseInt(searchParams.get("totalSteps") ?? "2");
      if (totalStep === 3) {
        setStaticForFirstTime(true);
        setTotalSteps(totalStep);
      }
    }
  }, [searchParams]);

  const stepsHeader = ["Basic information", "Add company", "Add bank accounts"];
  // "Generate W9 certificate",
  // "Add representatives",
  const headerText = stepsHeader.filter((header, index) => {
    if (totalSteps === 3) {
      if (step === index + 1) {
        return header;
      }
    } else if (totalSteps === 2) {
      if (step === 1 && index === 0) {
        return header;
      } else if (step === index && index !== 1) {
        return header;
      }
    }
  });
  return (
    <div className="flex px-12 h-screen items-center">
      <div className="flex gap-4 h-[80vh] items-center w-full">
        <div className="flex flex-col w-1/2 gap-4 self-start">
          <p className="text-muted">
            Step {step}/{totalSteps}
          </p>
          {/*
          //Testing purpose remove later
          <button
            onClick={() => {
              changeStep(step + 1);
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              changeStep(step - 1);
            }}
          >
            -
          </button> */}
          <h1 className="text-primary text-3xl">
            <span>{headerText}</span>
            {headerText[0] === stepsHeader[2] && (
              <p className="text-sm max-w-sm text-muted mt-2">
                To securely connect your bank account, we use Plaid, you can
                also manually add your bank account.
              </p>
            )}
          </h1>
          {/* {headerText[0] === stepsHeader[2] && (
            <>
              {((step === 3 && totalSteps === 5) ||
                (step === 2 && totalSteps === 4)) && (
                <Step3 changeStep={changeStep} step={step} />
              )}
            </>
          )} */}
        </div>
        <div className="flex items-center w-1/2 py-12">
          {step === 1 && (
            <Step1
              changeStep={changeStep}
              userData={userData}
              updateUserLocalData={updateUserLocalData}
              setTotalSteps={setTotalSteps}
              totalSteps={totalSteps}
              staticForFirstTime={staticForFirstTime}
              setStaticForFirstTime={setStaticForFirstTime}
            />
          )}
          {step === 2 && totalSteps === 3 && (
            <Step2 changeStep={changeStep} step={step} />
          )}
          {((step === 2 && totalSteps === 2) ||
            (step === 3 && totalSteps === 3)) && (
            <Step4 changeStep={changeStep} userData={userData} step={step} />
          )}
          {/* {((step === 3 && totalSteps === 5) ||
            (step === 2 && totalSteps === 4)) && <div className="h-sm"></div>}
          {((step === 4 && totalSteps === 5) ||
            (step === 3 && totalSteps === 4)) && (
            <Step4
              changeStep={changeStep}
              userData={userData}
              otherUserData={otherUserData}
              step={step}
            />
          )}
          {((step === 5 && totalSteps === 5) ||
            (step === 4 && totalSteps === 4)) && (
            <Step5
              changeStep={changeStep}
              userData={userData}
              otherUserData={otherUserData}
              step={step}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <VerifyUserPage />
    </Suspense>
  );
}
