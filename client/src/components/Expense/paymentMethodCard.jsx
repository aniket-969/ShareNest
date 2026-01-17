import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PaymentMethodCard = ({
  payment,
  qrImage,
  editable = false,
  onDelete,
}) => {
  return (
    <Card className="relative group bg-card w-full h-[270px]">
      {editable && (
        <button
          onClick={() => onDelete(payment._id)}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <CardContent className="flex flex-col items-center gap-2 pt-6">
        <p className="font-semibold text-lg">{payment.appName}</p>
        <p className="text-sm text-muted-foreground">{payment.type}</p>

        {qrImage ? (
          <img
            src={qrImage}
            alt={`${payment.appName} QR`}
            className="w-40 h-40 object-contain"
          />
        ) : payment.paymentId ? (
          <p className="text-xs break-all text-center">
            {payment.paymentId}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No payment details</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
