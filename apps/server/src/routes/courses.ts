import { Router, Response } from "express";
import prisma from "../lib/prisma";

import {
  authenticate,
  AuthRequest,
} from "../middleware/auth";


const router = Router();


// =====================================================
// POST /api/courses
// Create New Course
// =====================================================

router.post(
  "/",
  authenticate,
  async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const {
        title,
        description,
      } = req.body;


      // Validate title

      if (!title || !title.trim()) {

        return res.status(400).json({

          success:false,

          message:
            "Course title is required.",

        });

      }


      if(title.trim().length > 100){

        return res.status(400).json({

          success:false,

          message:
            "Course title cannot exceed 100 characters.",

        });

      }



      // Create course

      const course =
        await prisma.course.create({

          data:{

            title:
              title.trim(),

            description:
              description?.trim(),

            userId:
              req.user!.id,

          },

        });



      return res.status(201).json({

        success:true,

        message:
          "Course created successfully.",

        data:course,

      });



    } catch(error){

      console.error(
        "Create Course Error:",
        error
      );


      return res.status(500).json({

        success:false,

        message:
          "Internal Server Error",

      });

    }

  }
);





// =====================================================
// GET /api/courses
// Get All Courses Belonging To Student
// =====================================================

router.get(
  "/",
  authenticate,
  async(
    req: AuthRequest,
    res: Response
  )=>{


    try{


      const courses =
        await prisma.course.findMany({


          where:{

            userId:
              req.user!.id,

          },


          include:{

            _count:{

              select:{

                documents:true,

              },

            },

          },


          orderBy:{

            createdAt:
              "desc",

          },


        });



      return res.json({

        success:true,

        data:courses,

      });



    }catch(error){


      console.error(
        "Fetch Courses Error:",
        error
      );


      return res.status(500).json({

        success:false,

        message:
          "Internal Server Error",

      });


    }


  }
);






// =====================================================
// GET /api/courses/:id
// Get Single Course
// =====================================================

router.get(
  "/:id",
  authenticate,
  async(
    req: AuthRequest,
    res: Response
  )=>{


    try{


      const course =
        await prisma.course.findFirst({


          where:{

            id:
              req.params.id,

            userId:
              req.user!.id,

          },


          include:{

            documents:true,

            quizzes:true,

          },


        });



      if(!course){

        return res.status(404).json({

          success:false,

          message:
            "Course not found.",

        });

      }



      return res.json({

        success:true,

        data:course,

      });



    }catch(error){


      console.error(
        "Get Course Error:",
        error
      );


      return res.status(500).json({

        success:false,

        message:
          "Internal Server Error",

      });


    }


  }
);







// =====================================================
// PATCH /api/courses/:id
// Update Course
// =====================================================

router.patch(
  "/:id",
  authenticate,
  async(
    req: AuthRequest,
    res: Response
  )=>{


    try{


      const {
        title,
        description,
      } = req.body;




      // Check ownership

      const existingCourse =
        await prisma.course.findFirst({

          where:{

            id:
              req.params.id,

            userId:
              req.user!.id,

          },

        });



      if(!existingCourse){


        return res.status(404).json({

          success:false,

          message:
            "Course not found.",

        });


      }





      // Prepare update data

      const updateData:any = {};



      if(title){

        if(title.trim().length > 100){

          return res.status(400).json({

            success:false,

            message:
              "Course title cannot exceed 100 characters.",

          });

        }


        updateData.title =
          title.trim();

      }



      if(description !== undefined){

        updateData.description =
          description.trim();

      }





      const updatedCourse =
        await prisma.course.update({


          where:{

            id:
              req.params.id,

          },


          data:updateData,


        });




      return res.json({

        success:true,

        message:
          "Course updated successfully.",

        data:updatedCourse,

      });

    }catch(error){


      console.error(
        "Update Course Error:",
        error
      );

      return res.status(500).json({

        success:false,

        message:
          "Internal Server Error",

      });
    }

  }
);

// =====================================================
// DELETE /api/courses/:id
// Delete Course
// =====================================================

router.delete(
  "/:id",
  authenticate,
  async(
    req: AuthRequest,
    res: Response
  )=>{

    try{

      const course =
        await prisma.course.findFirst({


          where:{

            id:
              req.params.id,

            userId:
              req.user!.id,

          },

        });

      if(!course){

        return res.status(404).json({

          success:false,

          message:
            "Course not found.",

        });
      }

      await prisma.course.delete({

        where:{

          id:
            req.params.id,

        },

      });

      return res.json({

        success:true,

        message:
          "Course deleted successfully.",

      });

    }catch(error){

      console.error(
        "Delete Course Error:",
        error
      );

    return res.status(500).json({

        success:false,

        message:
          "Internal Server Error",
      });
    }
  }
);

export default router;