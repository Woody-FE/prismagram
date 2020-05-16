import { prisma } from "../../../generated/prisma-client";

export default {
    User: {
        fullName: (parent) => {
            return `${parent.lastName} ${parent.firstName}`

        },
        isFollowing: (parent, __, { request }) => {
            const { user } = request;
            const { id: parentId } = parent;
            try {
                return prisma.$exists.user({
                    AND: [
                        { id: user.id }, { followings_some: { id: parentId } }
                    ]
                })
            } catch {
                return false;
            }
        },
        isSelf: (parent, __, { request }) => {
            const { user } = request;
            const { id: parentId } = parent;
            return user.id === parentId
        }
    },
}