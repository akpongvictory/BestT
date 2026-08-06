import { Router, Response } from "express";
import multer from "multer";

import prisma from "../lib/prisma";

import {
  authenticate,
  AuthRequest,
} from "../middleware/auth";


const router = Router();


// =====================================================
// Multer Upload Configuration
// =====================================================

const storage = multer.diskStorage({

  destination: (_req, _file, cb) => {

    cb(null, "src/uploads");

  },


  filename: (_req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);

  },

});


const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

});




// =====================================================
// POST /api/documents/upload
// Upload Course Material
// =====================================================

router.post(

  "/upload",

  authenticate,

  upload.single("file"),


  async (
    req: AuthRequest,
    res: Response
  ) => {


    try {


      const {
        courseId,
      } = req.body;


      if (!courseId) {

        return res.status(400).json({

          success: false,

          message:
            "Course ID is required.",

        });

      }


      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "File is required.",

        });

      }




      // Check course ownership

      const course =
        await prisma.course.findFirst({

          where: {

            id: courseId,

            userId: req.user!.id,

          },

        });


      if (!course) {

        return res.status(404).json({

          success: false,

          message:
            "Course not found.",

        });

      }



      // Save document record

          const document =
      await prisma.document.create({

        data: {

          filename:
            req.file.originalname,

          originalName:
            req.file.originalname,

          fileUrl:
            req.file.path,

          fileType:
            req.file.mimetype,

          courseId,

          userId:
            req.user!.id,

        },

      });



      return res.status(201).json({

        success: true,

        message:
          "Document uploaded successfully.",

        data: document,

      });



    } catch (error) {


      console.error(
        "Upload Document Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Internal Server Error",

      });


    }

  }

);


export default router;