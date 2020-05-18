import { prisma } from "../../../generated/prisma-client";

export default {
    User: {
        followers: ({ id }) => prisma.user({ id }).followers(),
        followings: ({ id }) => prisma.user({ id }).followings(),
        posts: ({ id }) => prisma.user({ id }).posts(),
        likes: ({ id }) => prisma.user({ id }).likes(),
        comments: ({ id }) => prisma.user({ id }).comments(),
        rooms: ({ id }) => prisma.user({ id }).rooms(),
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
    }
}
