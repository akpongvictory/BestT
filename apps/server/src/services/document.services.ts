import fs from "fs/promises";
import path from "path";

import prisma from "../lib/prisma";

export async function createDocument({
  file,
  courseId,
  userId,
}: {
  file: Express.Multer.File;
  courseId: string;
  userId: string;
    }) {
    return prisma.document.create({
    data: {
        filename: file.originalname,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        courseId,
        userId,
    },
    });
    }

export async function deleteDocument(
  documentId: string,
  userId: string
) {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      userId,
    },
  });

  if (!document) {
    return null;
  }

  await prisma.document.delete({
    where: {
      id: document.id,
    },
  });

  try {
    const filename = path.basename(document.fileUrl);

    const filePath = path.resolve(
      "src/uploads",
      filename
    );

    await fs.unlink(filePath);
  } catch (error) {
    console.warn(
      "Could not delete physical file:",
      error
    );
  }

  return document;
}