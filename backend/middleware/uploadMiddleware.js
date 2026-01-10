import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory in backend folder if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log("[UPLOAD] Saving to directory:", uploadDir);
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		// Generate unique filename
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const filename = "image-" + uniqueSuffix + path.extname(file.originalname);
		console.log("[UPLOAD] Full path will be:", path.join(uploadDir, filename));
		cb(null, filename);
	},
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif|webp/;
	const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(new Error("Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)"));
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
	fileFilter: fileFilter,
});

export { upload };
export default upload;
