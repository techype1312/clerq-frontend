"use client";
import Step1 from "@/components/verifyUser/Step1";
import Step2 from "@/components/verifyUser/Step2";
import Step3 from "@/components/verifyUser/Step3";
import { MainContext } from "@/context/Main";
import { getUserData } from "@/hooks/useUser";
import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Step4 from "@/components/verifyUser/Step4";
import Step5 from "@/components/verifyUser/Step5";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const { userdata, refreshUser } = useContext(MainContext);
  const changeStep = (step: number) => {
    setStep(step);
    router.push("/dashboard/verify-user?step=" + step);
  };
  const [userRefreshed, setUserRefreshed] = useState(false);
  const [otherUserData, setOtherUserData] = useState(null);

  useEffect(() => {
    if (!userdata && !userRefreshed) {
      refreshUser();
    }
    setUserRefreshed(true);
    getUserData().then((data) => {
      if (data) {
        setOtherUserData(data[0]);
      }
    });
  }, [userdata]);

  useEffect(() => {
    if (searchParams.get("step")) {
      const step = parseInt(searchParams.get("step") ?? "1");
      setStep(step);
    } else {
      router.push("/dashboard/verify-user?step=1");
    }
  }, [searchParams]);

  return (
    <div className="grid grid-cols-2 gap-4 px-8 py-8">
      <div className="flex flex-col gap-4">
        <p className="text-[#757575]">Step {step}/4</p>
        {step === 1 && <h1>Basic information</h1>}
        {step === 2 && <h1>Add company</h1>}
        {step === 3 && <h1>Draft W9 certificate</h1>}
        {step === 4 && <h1>Add representatives</h1>}
        {step === 5 && <h1>Add bank accounts</h1>}
      </div>
      <div className="flex items-center py-12">
        {step === 1 && (
          <Step1
            changeStep={changeStep}
            userdata={userdata}
            otherUserData={otherUserData}
          />
        )}
        {step === 2 && <Step2 changeStep={changeStep} />}
        {step === 3 && <Step3 changeStep={changeStep} />}
        {step === 4 && (
          <Step4
            changeStep={changeStep}
            userdata={userdata}
            otherUserData={otherUserData}
          />
        )}
        {step === 5 && <Step5 />}
      </div>
    </div>
  );
};

export default Page;
