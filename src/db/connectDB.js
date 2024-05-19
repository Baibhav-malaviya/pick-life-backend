import mongoose from "mongoose";
// const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URL}/${process.env.DB_NAME}`
		);
		console.log("Connections: " + connectionInstance.connection.host);
	} catch (error) {
		console.log("MONGODB connection error: ", error);
		process.exit(1);
	}
};

export default connectDB;
