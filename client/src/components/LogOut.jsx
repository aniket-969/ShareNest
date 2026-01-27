import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const LogOut = ({variant=""}) => {
  const { logoutMutation } = useAuth();
  const onClick = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      console.log(response);
      toast("User logout successful");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={() => onClick()}
      
      variant={variant}
      size="sm"
    >
      Logout
    </Button>
  );
};

export default LogOut;
