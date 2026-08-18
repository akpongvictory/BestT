import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import prisma from "../lib/prisma";

async function main() {
  const documents = await prisma.document.findMany();

  console.log(`Found ${documents.length} documents.`);

  for (const document of documents) {
    const filename = path.basename(document.fileUrl);

    const filePath = path.resolve(
      "apps/server/src/uploads",
      filename
    );

    try {
      const buffer = await fs.readFile(filePath);

      const fileHash = crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");

      await prisma.document.update({
        where: {
          id: document.id,
        },
        data: {
          fileHash,
        },
      });

      console.log(
        `Updated ${document.originalName}: ${fileHash}`
      );
    } catch (error) {
      console.error(
        `Could not process ${document.originalName}`,
        filePath,
        error
      );
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
