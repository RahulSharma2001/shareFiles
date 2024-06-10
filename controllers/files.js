const path = require("path");
const nodeMailer = require("nodemailer");
const multer = require("multer");
const FileModel = require("../models/files");
const { v4: uuidv4 } = require("uuid");

const transporter = nodeMailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

const fileDestination = path.join(__dirname, "..", "files");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileDestination);
  },
  filename: (req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
}).single("report");

const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.json({
        message: "Error Occured",
      });
      return;
    }
    const newFile = new FileModel({
      originalName: req.file.originalname,
      newName: req.file.filename,
      path: req.file.path,
    });

    await newFile.save();

    /* const newFile = new */
    res.json({
      message: "File Uploaded Successfully",
    });
  });
};
const dynamicLink = async (req, res) => {
  try {
    const fileId = req.params.uuid;
    let file = FileModel.findById(fileId);
    if (!file) {
      res.status(404).json({
        message: "File Not Found",
      });
      return;
    }
    res.json({
      Link: "http://localhost:5000/files/download/" + fileId,
    });
  } catch (e) {
    res.json({
      message: "Something went Wrong ",
    });
  }
};
const downloadLink = async (req, res) => {
  try {
    const fileId = req.params.uuid;
    let file = await FileModel.findById(fileId);
    if (!file) {
      res.end("File not found");
      return;
    }
    res.download(file.path, file.originalName);
  } catch (e) {
    res.json({
      message: e,
    });
  }
};
const sendFile = async (req, res) => {
  const { sharedId, sendTo } = req.body;

  const link = "http://localhost:5000/files/download/" + sharedId;
  try {
    const sendinfo = await transporter.sendMail({
      from: "no-reply@download-link.com",
      to: sendTo,
      subject: "Download Link shared",
      html: `
       <h2>Your file is ready</h2>
       <a href = ${link}>Download here</a>
    `,
    });

    res.end("File Downloading successfully :)");
  } catch (e) {
    res.end("File not found, try again");
  }
};

const fileControllers = {
  uploadFile,
  dynamicLink,
  downloadLink,
  sendFile,
};

module.exports = fileControllers;
