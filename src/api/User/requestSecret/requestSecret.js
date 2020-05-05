import { prisma } from "../../../../generated/prisma-client";
import { secretGenerator, sendSecretMail } from "../../../utils";

export default {
    Mutation: {
        requestSecret: async (_, args) => {
            const { email } = args;
            const loginSecret = secretGenerator();
            console.log(loginSecret);
            try {
                await sendSecretMail(email, loginSecret);
                await prisma.updateUser({ data: { loginSecret }, where: { email } });
                return true;
            } catch (error) {
                console.log(error)
                return false;
            }
        }
    }
};