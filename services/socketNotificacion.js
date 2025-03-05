const socketIo = require('socket.io'); 


let io;
const personal = new Map(); // RFC -> Socket ID
const notificacionesPendientes = new Map(); // RFC -> Array de mensajes

function setIoInstance(socketIo) {
    io = socketIo;
}

function getIoInstance() {
    return io;
}

function registrarOperador(RFC, socketId) {
    personal.set(RFC, socketId);
    console.log(`Operador ${RFC} registrado con socket ${socketId}`);

    // 🔹 Si tiene notificaciones pendientes, enviarlas y borrarlas
    if (notificacionesPendientes.has(RFC)) {
        const mensajes = notificacionesPendientes.get(RFC);
        mensajes.forEach((mensaje) => {
            io.to(socketId).emit("notificacionTransaccion", mensaje);
        });
        notificacionesPendientes.delete(RFC);
    }
}

function eliminarOperador(RFC) {
    personal.delete(RFC);
    console.log(`Operador ${RFC} desconectado.`);
}

function obtenerSocketId(RFC) {
    return personal.get(RFC);
}

function agregarNotificacionPendiente(RFC, mensaje) {
    if (!notificacionesPendientes.has(RFC)) {
        notificacionesPendientes.set(RFC, []);
    }
    notificacionesPendientes.get(RFC).push(mensaje);
}


// Aquí registramos las conexiones de los sockets
io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("registrarOperador", (RFC) => {
        registrarOperador(RFC, socket.id);
    });

    socket.on("disconnect", () => {
        for (let [RFC, socketId] of personal.entries()) {
            if (socketId === socket.id) {
                eliminarOperador(RFC);
                break;
            }
        }
    });
});


module.exports = {
    setIoInstance,
    getIoInstance,
    registrarOperador,
    eliminarOperador,
    obtenerSocketId,
    agregarNotificacionPendiente
};
