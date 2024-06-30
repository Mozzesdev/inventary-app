import { Request, Response } from "express";
import { bucket } from "../firebase/config.js";
import { getDownloadURL } from "firebase-admin/storage";

export class FilesController {
  getAll = async (req: Request, res: Response) => {
    res.status(201).send({});
  };

  upload = async (req: Request, res: Response) => {
    try {
      const files = req.files;

      if (!files || !files.length) {
        return res.status(403).send({ message: "403 Bad Request" });
      }

      const uploadPromise = (files as Express.Multer.File[]).map(
        (file: Express.Multer.File) =>
          new Promise((resolve, reject) => {
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
              resumable: false,
              metadata: {
                contentType: file.mimetype,
              },
            });

            blobStream.on("error", (err) => {
              reject(err);
            });

            blobStream.on("finish", async () => {
              try {
                const [metadata] = await blob.getMetadata();
                const url = await getDownloadURL(blob);
                resolve({
                  name: metadata.name,
                  url,
                  size: metadata.size,
                  created_at: metadata.timeCreated,
                  type: metadata.contentType,
                });
              } catch (err) {
                reject(err);
              }
            });

            blobStream.end(file.buffer);
          })
      );
      const uploadedFiles = await Promise.all(uploadPromise);

      res.status(200).send({
        message: "Files upload succesful",
        data: uploadedFiles,
        success: true,
      });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  };

  get = async (req: Request, res: Response) => {
    res.status(201).send({});
  };

  delete = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
      const file = bucket.file(name);

      const [response] = await file.delete({
        ignoreNotFound: true,
      });

      res
        .header(response.headers)
        .status(response.statusCode)
        .send(response.body);
    } catch (error: any) {
      console.log(error);
      res.status(500).send({ message: "500 Internal server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    res.status(201).send({});
  };
}
