import { useState } from "react";
import { PaymentMethodForm } from "../form/PaymentMethodForm";
import FormWrapper from "./formWrapper";
import { Button } from "./button";

const PaymentMethod = () => {
  const [show, setShowForm] = useState(false);
  return (
    <div>
      <Button onClick={() => setShowForm(true)}>Add Payment Method</Button>
      {show && (
        <FormWrapper onClose={() => setShowForm(false)}>
          <PaymentMethodForm />
        </FormWrapper>
      )}
    </div>
  );
};

export default PaymentMethod;
