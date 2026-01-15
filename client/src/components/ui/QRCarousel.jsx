import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import PaymentMethodCard from "../Expense/paymentMethodCard";
import FormWrapper from "@/components/ui/formWrapper";
import PaymentMethodForm from "../form/PaymentMethodForm";
import { useAuth } from "@/hooks/useAuth";
import { generateQRCode } from "@/utils/helper";

export const QRCarousel = ({
  paymentMethod = [],
  editable = false,
}) => {
  const { deletePaymentMutation } = useAuth();
  const [qrImages, setQrImages] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const generate = async () => {
      const images = {};
      for (const p of paymentMethod) {
        if (p.qrCodeData) {
          images[p._id] = await generateQRCode(p.qrCodeData);
        }
      }
      setQrImages(images);
    };
    generate();
  }, [paymentMethod]);

  const items = [...paymentMethod];

  // 👇 only self gets add slides
  if (editable) {
    while (items.length < 3) {
      items.push({ _id: `add-${items.length}`, isAdd: true });
    }
  }

  const handleDelete = async (paymentId) => {
    if (!editable) return;
    await deletePaymentMutation.mutateAsync({ paymentId });
  };

  return (
    <div className="flex flex-col items-center ">
      <Carousel className="w-full max-w-sm ">
        <CarouselContent className="">
          {items.map((item) => (
            <CarouselItem key={item._id} className="h-full">
              {item.isAdd ? (
                <div className=" h-[270px] flex items-center justify-center bg-card">
                   <Button variant=""
                  className=""
                  onClick={() => setShowForm(true)}
                >
                  Add Payment Method
                </Button>
                </div>
               
              ) : (
                <PaymentMethodCard
                  payment={item}
                  qrImage={qrImages[item._id]}
                  editable={editable}
                  onDelete={handleDelete}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {editable && showForm && (
        <FormWrapper onClose={() => setShowForm(false)}>
          <PaymentMethodForm />
        </FormWrapper>
      )}
    </div>
  );
};
