import { ToastContainer } from "react-toastify";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";
import 'react-toastify/dist/ReactToastify.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

export const App = () => {
  
  return (
    
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <AppProvider>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </AppProvider>
</GoogleOAuthProvider>
    
  );
};
