import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCarousel } from './../ui/QRCarousel';

const PaymentDetails = ({ participants = [] }) => {
  return (
    <Accordion type="multiple" className="w-full">
      {participants.map((user) => (
        <AccordionItem key={user._id} value={user._id}>
          {/* Accordion Header */}
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.fullName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="text-left">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.paymentMethod.length} payment method(s)
                </p>
              </div>
            </div>
          </AccordionTrigger>

          {/* Accordion Content */}
          <AccordionContent>
            {user.paymentMethod.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No payment methods shared
              </p>
            ) : (
              <QRCarousel
                paymentMethod={user.paymentMethod}
                editable={false}   // 👈 read-only carousel
              />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default PaymentDetails;
