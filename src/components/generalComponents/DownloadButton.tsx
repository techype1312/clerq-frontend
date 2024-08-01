import { useState } from "react";
import axios from "axios";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";
import { Button } from "../ui/button";

export const DownloadButton = ({ downloadLink }: { downloadLink: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(downloadLink, {
        responseType: "blob", // Ensure the response is handled as a Blob
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my_file.pdf"; // Adjust filename as needed
      document.body.appendChild(link); // Append to body
      link.click();
      document.body.removeChild(link); // Remove from body
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={"ghost"} className="flex items-center gap-2 text-label" onClick={handleDownload} disabled={isLoading}>
      <SymbolIcon icon="download" color="#1E1E2A" />
      {isLoading ? "Downloading..." : "Download"}
    </Button>
  );
};
