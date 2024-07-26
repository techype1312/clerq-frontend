import React from "react";
import { Button } from "../ui/button";
import W9Form from "../generalComponents/W9Form";


const Step3 = ({ changeStep,step }: { changeStep: (step: number) => void, step: number }) => {
  const handleSubmit = async () => {

  };
  return (
    <div>
      <div className="text-primary">
        Generate for
      </div>
      <div className="flex flex-col gap-4">
      <Button className="w-fit px-7 rounded-full h-10 ml-auto" onClick={() => handleSubmit()}>Generate</Button>
      {/* <W9Form /> */}
      <Button className="w-fit px-7 rounded-full h-10 ml-auto" onClick={() => changeStep(step+1)}>Skip</Button>
      </div>
    </div>
  );
};

export default Step3;
