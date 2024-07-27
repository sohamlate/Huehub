const { Server } = require("socket.io");
const { createServer } = require("http");
const connectedUser = require("./model/ConnectedUser");

let io = null;

exports.initSocket = (app) => {
    try {
        const server = createServer(app);
        io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
            },
        });
        
        io.on("connection", (socket) => {
            console.log("A user connected");

            socket.on("login", async (data) => {
                console.log("User logged in:", data);
                
                const { userId, socketId } = data;
                let user = await connectedUser.findOne({ userId });

                if (!user) {
                    user = new connectedUser({
                        userId,
                        socketIds: [socketId],
                    });
                    console.log("New user created");
                } else {
                    if (!user.socketIds.includes(socketId)) {
                        user.socketIds.push(socketId);
                    }
                }

                await user.save();

                socket.emit("message", "Welcome Back!");
            });

            let disconnectTimeout;

            socket.on("disconnect", async () => {
                clearTimeout(disconnectTimeout);

                disconnectTimeout = setTimeout(async () => {
                    const user = await connectedUser.findOne({
                        socketIds: { $in: [socket.id] },
                    });

                    if (user) {
                        user.socketIds = user.socketIds.filter((id) => id !== socket.id);

                        if (user.socketIds.length === 0) {
                            await connectedUser.deleteOne({ _id: user._id });
                            console.log("User deleted");
                        } else {
                            await user.save();
                            console.log("User disconnected");
                        }
                    }
                }, 50);
            });
        });

        return { io, server };
    } catch (error) {
        console.error("Error initializing socket:", error);
        throw error; 
    }
};

exports.getIO = () => io;
