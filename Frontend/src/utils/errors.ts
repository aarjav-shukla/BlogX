interface ApiErrorShape {
  response?: {
    status?: number;
    data?: { message?: string; error?: string };
  };
  message?: string;
}

export const readApiError = (err: unknown, fallback: string): string => {
  const e = err as ApiErrorShape | undefined;
  return (
    e?.response?.data?.message || e?.response?.data?.error || e?.message || fallback
  );
};
