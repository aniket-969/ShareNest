import { useForm } from "react-hook-form";
import { paymentMethodSchema } from "@/schema/authSchema";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { loginUser } from "@/api/queries/auth";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import jsQR from "jsqr";
import { useState } from "react";

export const PaymentMethodForm = () => {
  const { addPaymentMutation } = useAuth();
  const [qrData, setQrData] = useState("");
  const handleFileUpload = async (file,setValue) => {
    if (!file) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      // Set canvas dimensions to the image size
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image on the canvas
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Extract image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Use jsQR to decode the QR code
      const qrCodeData = jsQR(
        imageData.data,
        imageData.width,
        imageData.height
      );

      if (qrCodeData) {
        console.log("QR Code Data:", qrCodeData.data);
        setQrData(qrCodeData.data);
        setValue("qrCodeData", qrCodeData.data);
       
        // const res = await generateQRCode(qrCodeData.data);
       
      } else {
        alert("No QR code found in the image.");
      }
    };
  };

  const onSubmit = async (values) => {
    console.log(values);
    
    try {
      const response = await addPaymentMutation.mutateAsync(values);
      console.log(response);
      toast("Payment method added successful");
    } catch (error) {
      console.error("Error during adding payment method:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      appName: "",
      paymentId: "",
      type: "", 
      qrCodeData: "",
    },
  });

  return ( 
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* app name */}
        <FormField
          control={form.control}
          name="appName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App name</FormLabel>
              <FormControl>
                <Input placeholder="App name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* payment id */}
        <FormField
          control={form.control}
          name="paymentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment ID</FormLabel>
              <FormControl>
                <Input placeholder="PaymentID" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Type" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* QR code */}
        <FormField
          control={form.control}
          name="qrCodeData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) handleFileUpload(file, form.setValue);
                  }}
                />
              </FormControl>
              <FormDescription>
                QR Code Data: {qrData || "Upload a QR image to extract data"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
