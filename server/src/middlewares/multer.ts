import fs from "fs";
import multer from "multer";

const avatarsDirPath = __dirname + "../../tmp/avatar-uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir(avatarsDirPath, { recursive: true }, (err) => {
      if (err) {
        console.warn(err);
      } else {
        cb(null, avatarsDirPath);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2097152,
  },
});
