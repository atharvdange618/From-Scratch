/**
 * Mutation Hook with Retry Support
 * Provides automatic retry UI for failed mutations
 */

import { UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface UseMutationWithRetryOptions<TData, TError, TVariables> {
  mutation: UseMutationResult<TData, TError, TVariables>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
  retryLabel?: string;
}

/**
 * Hook that wraps a mutation and provides retry functionality via toast actions
 */
export function useMutationWithRetry<
  TData = unknown,
  TError = Error,
  TVariables = void,
>({
  mutation,
  onSuccess,
  onError,
  successMessage = "Operation completed successfully",
  errorMessage,
  retryLabel = "Retry",
}: UseMutationWithRetryOptions<TData, TError, TVariables>) {
  const { toast } = useToast();

  const execute = (variables: TVariables) => {
    mutation.mutate(variables, {
      onSuccess: (data) => {
        const message =
          typeof successMessage === "function"
            ? successMessage(data)
            : successMessage;

        toast({
          title: "Success",
          description: message,
        });

        onSuccess?.(data, variables);
      },
      onError: (error) => {
        const message = errorMessage
          ? typeof errorMessage === "function"
            ? errorMessage(error)
            : errorMessage
          : error instanceof Error
            ? error.message
            : "An error occurred";

        toast({
          variant: "destructive",
          title: "Action failed",
          description: message,
          action: (
            <ToastAction
              altText={retryLabel}
              onClick={() => execute(variables)}
              className="rounded-none border-2 border-black bg-white px-3 py-1 font-bold hover:bg-[#FF9149] dark:hover:bg-primary"
            >
              {retryLabel}
            </ToastAction>
          ),
        });

        onError?.(error, variables);
      },
    });
  };

  return {
    execute,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  };
}
