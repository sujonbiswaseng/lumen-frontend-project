import { IBaseEvent, TPagination } from "@/types/event.types";
import { TBaseParticipant } from "@/types/participant.types";
import { TResponsePayment } from "@/types/payment.types";
import { IBaseUser } from "@/types/user.types";
import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is not defined. Please check your environment variables.",
  );
}

export const PaymentService={
    initiatePayment: async (eventId: string) => {
        try {
          const cookieStore = await cookies();
          const res = await fetch(
            `${API_BASE_URL}/initiate-payment/${eventId}`,
            {
              method: "POST",
              headers: {
                Cookie: cookieStore.toString(),
              },
            }
          );
      
          if (!res.ok) {
            const error = await res.json();
            return {
              success: false,
              message: error.message || "Failed to initiate payment",
              data: null,
            };
          }
      
          const data = await res.json();
          return {
            success: true,
            data: data.data,
            message: data.message || "Payment initiated successfully",
          };
        } catch (err: any) {
          return {
            success: false,
            message: err?.message || "Something went wrong while initiating payment",
            data: null,
          };
        }
      },
    createParticipantPayLater: async (eventId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(
                `${API_BASE_URL}/participant-with-pay-later/${eventId}`,
                {
                    method: "POST",
                    headers: {
                        Cookie: cookieStore.toString(),
                    },
                }
            );

            if (!res.ok) {
                const error = await res.json();
                return {
                    success: false,
                    message: error.message || "Failed to initiate Pay Later for participant",
                    data: null,
                };
            }

            const data = await res.json();
            return {
                success: true,
                data: data.data,
                message: data.message || "Pay Later initiated for participant successfully",
            };
        } catch (err: any) {
            return {
                success: false,
                message: err?.message || "Something went wrong while initiating Pay Later for participant",
                data: null,
            };
        }
    },
    getAllPayments: async (params?: Record<string, any>) => {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_BASE_URL}/payments?${params}`);
        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, String(params[key]));
                }
            });
        }

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
        });
      
        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Failed to fetch payments",
                data: null,
            };
        }

        return {
            success: true,
            data: data.data.payments as TResponsePayment<{ event: IBaseEvent; participant: TBaseParticipant ,user:IBaseUser}>[],
            pagination:data.data.pagination as TPagination,
            message: data.message || "Payments fetched successfully",
        };
    } catch (err: any) {
        return {
            success: false,
            message: err?.message || "Something went wrong while fetching payments",
            data: null,
        };
    }
},

    updatePaymentStatus: async (
        paymentId: string,
        status: string
    ) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_BASE_URL}/payments/${paymentId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                credentials: "include",
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to update payment status",
                    data: null,
                };
            }

            return {
                success: true,
                data: data.data,
                message: data.message || "Payment status updated successfully",
            };
        } catch (err: any) {
            return {
                success: false,
                message: err?.message || "Something went wrong while updating payment status",
                data: null,
            };
        }
    },
    deletePayment: async (paymentId: string) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to delete payment",
                    data: null,
                };
            }

            return {
                success: true,
                data: data.data,
                message: data.message || "Payment deleted successfully",
            };
        } catch (err: any) {
            return {
                success: false,
                message: err?.message || "Something went wrong while deleting payment",
                data: null,
            };
        }
    },


}