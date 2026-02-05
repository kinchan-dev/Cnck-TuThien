import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // phân quyền
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },

    // phân loại user
    accountType: { type: String, enum: ["individual", "organization"], default: "individual", index: true },

    // thông tin hiển thị
    name: { type: String, default: "" },

    // chỉ áp dụng cho organization
    orgVerified: { type: Boolean, default: false, index: true },
    orgDocUrl: { type: String, default: "" }, // link giấy tờ nếu có
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
