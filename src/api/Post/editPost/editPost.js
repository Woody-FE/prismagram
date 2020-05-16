import { prisma } from "../../../../generated/prisma-client";

const DELETE = "DELETE";
const EDIT = "EDIT";

export default {
    Mutation: {
        editPost: async (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { id, caption, location, action } = args;
            const { user } = request;
            // 사용자가 작성한 포스트인지를 검증, 여기서 user는 이 request를 보내고 있는 사용자
            const post = await prisma.$exists.post({ id, user: { id: user.id } })
            if (post) {
                if (action === EDIT) {
                    return prisma.updatePost({
                        data: {
                            caption, location
                        },
                        where: {
                            id
                        }
                    })
                } else if (action === DELETE) {
                    return prisma.deletePost({ id })
                }
            } else {
                throw Error("Not exists Post")
            }

        }
    }
}