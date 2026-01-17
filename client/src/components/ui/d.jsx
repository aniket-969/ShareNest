<div className="flex flex-col items-center">
  <Carousel className="w-full max-w-[14rem] md:max-w-[20rem] sm:max-w-[15rem] ">
    <CarouselContent>
      {items.map((payment, index) => (
        <CarouselItem key={payment._id}>
          <Card className="h-full bg-card relative group">
            {payment.appName && (
              <button
                onClick={() => handleDelete(payment._id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
              </button>
            )}

            <CardContent className="flex flex-col items-center justify-center h-full font-semibold text-sm md:text-xl sm:text-base sm:gap-2 pt-2 ">
              {payment.appName ? (
                <>
                  <p className="font-semibold text-xl">{payment.appName}</p>
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
                  <Button onClick={() => setShowForm(true)}>Add Payment</Button>
                </>
              )}
            </CardContent>
          </Card>
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
</div>;
