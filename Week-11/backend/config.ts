export const config = {
  PORT: Number(process.env.PORT) || 3000,
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_NAME: process.env.DB_NAME,
};
// ! tells ts trust me ik better than u its a string dw
