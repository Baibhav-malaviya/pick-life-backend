import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const PORT = process.env.PORT;
import { Result } from "./models/result.model.js";

import { upload } from "./middleware/multer.middleware.js";
import connectDB from "./db/connectDB.js";
import { uploadOnCloudinary } from "./utils/cloudinary.js";

connectDB()
	.then(() =>
		app.listen(PORT, () => console.log("Server is listening on port", PORT))
	)
	.catch((err) => console.log("MONGODB CONNECTION FAILED: " + err));

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	})
);

app.use(express.json({ limit: "16kb" })); //used to convert the json data into js objects and vise-versa.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //After using this middleware, We don't need to use body-parser
app.use(express.static("public")); //for serving the static file

app.get("/", (req, res) => {
	return res
		.status(200)
		.json({ message: "Getting home route info", success: true });
});

app.post(
	"/",
	upload.fields([
		{ name: "resultPdf", maxCount: 1 },
		{ name: "avatar", maxCount: 1 },
	]),
	async (req, res) => {
		const {
			studentName,
			registrationNumber,
			fathersName,
			mothersName,
			course,
		} = req.body;

		if (!studentName || !registrationNumber || !fathersName || !mothersName)
			return res.status(403).json({
				message: "Every info of student is required but not found",
				success: false,
			});

		const addedResult = await Result.findOne({ registrationNumber });

		if (addedResult)
			return res.status(409).json({
				message:
					"Result with this registration Number already added, try new || contact your developer",
				success: false,
			});

		//! file handling
		const files = req.files;
		if (!files) return res.json({ message: "NO files found", success: false });
		const avatarLocalPath = files?.avatar?.[0]?.path;
		if (!avatarLocalPath)
			return res.status(403).json({
				message: "Student Image not found, please try again",
				success: false,
			});

		const resultPdfLocalPath = files?.resultPdf?.[0]?.path;
		if (!resultPdfLocalPath)
			return res.status(403).json({
				message: "Result pdf not found, please try again",
				success: false,
			});

		// return res.status(200).json({ message: "Everything okay" });
		//! upload the file on the cloudinary after checking every thing is okay
		const avatar = await uploadOnCloudinary(avatarLocalPath);
		if (!avatar)
			return res.status(403).json({
				message: "went wrong during uploading the profile image, try again",
				success: false,
			});
		const resultPdf = await uploadOnCloudinary(resultPdfLocalPath);
		if (!resultPdf)
			return res
				.status(403)
				.json({ message: "went wrong during uploading the result, try again" });

		//! now create new result
		const newResult = await Result.create({
			studentName,
			registrationNumber,
			fathersName,
			mothersName,
			course,
			avatar: avatar?.url,
			resultPdf: resultPdf?.url,
		});

		return res.status(200).json({
			message: "Get route for add result",
			success: true,
			newResult,
		});
	}
);

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
