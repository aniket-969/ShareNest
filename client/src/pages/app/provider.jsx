import { Spinner } from "@/components/ui/spinner";
import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export const AppProvider = ({ children }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <div>
            
            <p>Something went wrong: {error.message}</p>
            <button onClick={resetErrorBoundary}>Retry</button>
          </div>
        )}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ErrorBoundary>
     </React.Suspense>
  );
};
