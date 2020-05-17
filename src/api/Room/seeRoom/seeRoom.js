import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        seeRoom: async (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { id } = args;
            const { user } = request;
            const CanSee = await prisma.$exists.room({
                AND: [
                    { participants_some: { id: user.id } }, { id }
                ]
            })
            if (CanSee) {
                return prisma.room({ id })
            } else {
                throw Error("You don't see Room!")
            }
        }
    }
}