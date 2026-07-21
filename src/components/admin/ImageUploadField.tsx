"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ImageUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

const UPLOAD_FOLDER = "portfolio";

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
}: ImageUploadFieldProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const canUpload = Boolean(cloudName && apiKey);

  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = UPLOAD_FOLDER;

      const sigRes = await fetch("/api/v1/uploads/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paramsToSign: { timestamp, folder } }),
      });
      if (!sigRes.ok) {
        throw new Error("Could not authorize upload");
      }
      const { signature } = await sigRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey as string);
      fd.append("timestamp", String(timestamp));
      fd.append("folder", folder);
      fd.append("signature", signature);

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );
      const data = await upRes.json();
      if (!upRes.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Upload failed");
      }

      onChange(data.secure_url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {value ? (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="relative h-24 w-24 overflow-hidden rounded-md border border-input bg-muted">
              <Image
                src={value}
                alt={label}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Remove
            </button>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-2">
          {canUpload ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload image"
                )}
              </Button>
            </div>
          ) : null}

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {canUpload ? "or paste an image URL" : "Paste an image URL"}
            </p>
            <Input
              placeholder="https://..."
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
