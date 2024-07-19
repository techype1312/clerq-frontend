import React from "react";
import { Button } from "../ui/button";
import W9Form from "../generalComponents/W9Form";


const Step3 = ({ changeStep }: { changeStep: (step: number) => void }) => {
  const handleSubmit = async () => {

  };
  return (
    <div>
      <Button onClick={() => handleSubmit()}>Generate</Button>
      <W9Form />
      <Button onClick={() => changeStep(4)}>Skip</Button>
    </div>
  );
};

export default Step3;
