import { getEnvConfig } from "../config/envConfig";

export const getData = async (
  url: string,
  revalidate = 3600,
  tags: string[] = [],
  params: Record<string, any> = {},
  baseApiUrl = getEnvConfig().api_url
) => {
  let isLoading = true;
  let isError = false;
  let data;
  let error;

  try {
    const queryParams = new URLSearchParams(params).toString();
    const apiUrl = `${baseApiUrl}${url}${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(apiUrl, {
      next: { tags: [...tags], revalidate: revalidate },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    isLoading = false;
    isError = false;
    error = null;
  } catch (error) {
    // Handle other types of errors
    error = error;
    isLoading = false;
    isError = true;
    data = null;
  }

  return {
    data: data?.data, // Assuming the data structure has a 'data' property
    isLoading,
    isError,
    error,
  };
};
