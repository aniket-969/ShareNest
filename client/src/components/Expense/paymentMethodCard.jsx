import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const PaymentMethodCard = ({
  payment,
  qrImage,
  editable = false,
  onDelete,
}) => {
  return (
    <Card className="relative group bg-card w-full border-none">
      {editable && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete payment method?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove <strong>{payment?.appName}</strong> from the
                room's payment methods. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(payment?._id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <CardContent className="flex flex-col items-center gap-1 sm:gap-2 pt-2 sm:pt-6">
        <p className="font-semibold text-lg">{payment?.appName}</p>
        <p className="text-sm text-muted-foreground">{payment?.type}</p>

        {qrImage ? (
          <img
            src={qrImage}
            alt={`${payment?.appName} QR`}
            className="w-40 h-40 object-contain"
          />
        ) : payment?.paymentId ? (
          <p className="text-xs break-all text-center">{payment?.paymentId}</p>
        ) : (
          <p className="text-xs text-muted-foreground">No payment details</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;