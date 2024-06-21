import { Schema, model } from "mongoose";

const resultSchema = new Schema(
	{
		studentName: {
			type: String,
			required: true,
		},
		registrationNumber: {
			type: String,
			required: true,
			unique: true,
		},
		fathersName: {
			type: String,
			required: true,
		},
		mothersName: {
			type: String,
			required: true,
		},
		course: String,
		resultPdf: {
			type: String,
			required: true,
			unique: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Result = model("Result", resultSchema);
