import { prisma } from "../../../../generated/prisma-client"
export default {
    Mutation: {
        sendMessage: async (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { toId, message, roomId } = args;
            const { user } = request;
            let room;
            if (roomId == undefined) {
                if (user.id !== toId) {
                    const rooms = await prisma.user({ id: user.id }).rooms()
                    room = rooms.find(room => room.participants.find(participant => participant.id === toId));
                    if (!room) {
                        room = await prisma.createRoom({
                            participants: {
                                connect: [{ id: toId }, { id: user.id }]
                            }
                        });
                    }
                }
            } else {
                room = await prisma.room({ id: roomId })
            }
            const getTo = room.participants.find(participant => participant.id !== user.id)
            return prisma.createMessage({
                data: {
                    from: {
                        connect: { id: user.id }
                    },
                    to: {
                        connect: { id: roomId ? getTo.id : toId }
                    },
                    text: message
                },
            })
        }
    }
}