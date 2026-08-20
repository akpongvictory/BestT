import fs from "fs/promises";

import { supabase } from "../lib/supabase";
import { env } from "../config/env";

const bucket = env.supabaseStorageBucket;

export async function uploadDocumentFile({
  filePath,
  storagePath,
  contentType,
}: {
  filePath: string;
  storagePath: string;
  contentType: string;
}) {
  const fileBuffer = await fs.readFile(filePath);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Failed to upload document to storage: ${error.message}`
    );
  }

  return data;
}

export async function downloadDocumentFile(
  storagePath: string
): Promise<Buffer> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(storagePath);

  if (error) {
    throw new Error(
      `Failed to download document from storage: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "Storage returned no document data."
    );
  }

  return Buffer.from(
    await data.arrayBuffer()
  );
}

export async function deleteDocumentFile(
  storagePath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([storagePath]);

  if (error) {
    throw new Error(
      `Failed to delete document from storage: ${error.message}`
    );
  }
}