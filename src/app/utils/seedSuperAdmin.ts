import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { IAuthProvider, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Already super admin exist");
      return;
    }
    console.log("Try to Super admin creating ...");

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };
    const payload = {
      name: "Super admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
      isVarified: true,
      auths: [authProvider],
    };

    const createSuperAdmin = await User.create(payload);

    console.log("Super admin create successfull!");
    console.log(createSuperAdmin);
  } catch (error) {
    console.log(error);
  }
};
