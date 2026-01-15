import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCarousel } from "../ui/QRCarousel";

const PaymentDetails = ({ participants = [], userId }) => {
  return (
    <Accordion className="w-full max-w-4xl mx-auto px-5">
      {participants.map((user) => {
        const isSelf = user._id === userId; 

        return (
          <AccordionItem key={user._id} className="" value={user._id}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="text-left">
                  <p className="font-medium">
                    {user.fullName}
                    {isSelf && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (You)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.username} 
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
             
              {!isSelf && user.paymentMethod.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No payment methods shared
                </p>
              ) : (
                <QRCarousel
                  paymentMethod={user.paymentMethod}
                  editable={isSelf}   
                />
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default PaymentDetails;

