import { useState } from "react";
import PaymentMethodForm from "../form/PaymentMethodForm";
import FormWrapper from "./formWrapper";
import { Button } from "./button";

const PaymentMethod = () => {
  const [show, setShowForm] = useState(false);
  return (
    <div >
      <Button onClick={() => setShowForm(true)
      }>Add Payment Method</Button>
      {show && (
        <FormWrappe onClose={() => setShowForm(false)}>
          <PaymentMethodForm />
        </FormWrappe>
      )}
    </div>
  );
};

export default PaymentMethod;
