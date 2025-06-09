import { generateQRCode } from "@/utils/helper";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./card";
import { Button } from "@/components/ui/button";
import FormWrapper from "./formWrapper";
import { PaymentMethodForm } from "../form/PaymentMethodForm";
import { Spinner } from "./spinner";

export const QRCarousel = ({ paymentMethod }) => {
  const [qrImages, setQrImages] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const generateAllQRImages = async () => {
      const images = {};
      for (const payment of paymentMethod) {
        if (payment.qrCodeData) {
          const qrImage = await generateQRCode(payment.qrCodeData);
          images[payment._id] = qrImage;
        }
      }
      setQrImages(images);
    };

    generateAllQRImages();
  }, [paymentMethod]);

  // Preparing items for carousel
  const totalPaymentMethods = paymentMethod.length;
  const items = [...paymentMethod];

  // If less than 3 items, add AddPayment "fake" entries
  if (totalPaymentMethods < 3) {
    const numAddButtons = 3 - totalPaymentMethods;
    for (let i = 0; i < numAddButtons; i++) {
      items.push({ _id: `add-${i}` }); // dummy ID
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Carousel className="w-full max-w-[14rem] md:max-w-[20rem] sm:max-w-[15rem]">
        <CarouselContent>
          {items.map((payment, index) => (
            <CarouselItem key={payment._id}>
              <div className="h-full">
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center h-full font-semibold text-sm md:text-xl sm:text-base sm:gap-2 pt-2">
                    {payment.appName ? (
                      <>
                        <p className="font-semibold text-xl">
                          {payment.appName}
                        </p>
                        <p className="text-gray-600 mb-2">{payment.type}</p>
                        {qrImages[payment._id] ? (
                          <img
                            src={qrImages[payment._id]}
                            alt={`QR Code for ${payment.appName}`}
                            className="w-auto object-contain"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32">
                            <Spinner size="sm" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-lg mb-4">Add Payment Method</p>
                        <Button onClick={() => setShowForm(true)}>
                          Add Payment
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Popup Form to Add Payment */}
      {showForm && (
        <FormWrapper onClose={() => setShowForm(false)}>
          <PaymentMethodForm />
        </FormWrapper>
      )}
    </div>
  );
};
