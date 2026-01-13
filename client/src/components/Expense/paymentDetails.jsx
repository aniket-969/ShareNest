import { useState } from "react";
import { QRCarousel } from '@/components/QRCode';

const PaymentDetails = ({ participants }) => {
  const [openUserId, setOpenUserId] = useState(null);

  const toggleAccordion = (userId) => {
    setOpenUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {participants.map((user) => {
        const isOpen = openUserId === user._id;

        return (
          <div
            key={user._id}
            className="rounded-lg bg-card border border-border"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(user._id)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>

              <span className="text-sm text-primary">
                {isOpen ? "Hide" : "Pay ₹"}
              </span>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-4 pb-4">
                {user.paymentMethod?.length > 0 ? (
                  <QRCarousel paymentMethod={user.paymentMethod} />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No payment details added
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PaymentDetails;
