import { WebSocketServer, WebSocket } from "ws";
import { server } from "../server.ts";
import { WsError } from "../utils/wsError";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { activeSessions } from "../session/activeSession";
import { Class } from "../models/class.model";
import { WsResponse } from "../utils/wsResponse";

const wss = new WebSocketServer({ server });

export interface ExtendedWs extends WebSocket {
  user: {
    id: string;
    role: "student" | "teacher";
  };
}

const broadcast = (wss: WebSocketServer, response: WsResponse<unknown>) => {
  const raw = JSON.stringify(response);

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
    }
  }
};

wss.on("connection", (ws: ExtendedWs, req) => {
  console.log("connected");
  const token = req.url?.split("?token=")[1];
  if (!token) {
    ws.send(JSON.stringify(new WsError("Unauthorized or invalid token")));
    ws.close();
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    ws.user = { id: decoded.id, role: decoded.role };
  } catch (error) {
    ws.send(JSON.stringify(new WsError("Unauthorized or invalid token")));
    ws.close();
    return;
  }

  ws.on("message", async (raw) => {
    let parsed: { event: string; data: any };
    try {
      parsed = JSON.parse(raw.toString());
    } catch (error) {
      ws.send(JSON.stringify(new WsError("Invalid msg format")));
      return;
    }
    const { event, data } = parsed;
    console.log(data);
    if (event === "ATTENDANCE_MARKED") {
      console.log("1");
      if (ws.user.role !== "teacher") {
        ws.send(JSON.stringify(new WsError("Forbidden, teacher event only")));
        ws.close();
        return;
      }
      console.log("2");

      const { studentId, status } = data;

      if (!studentId || !status) {
        ws.send(JSON.stringify(new WsError("invalid payload")));
        return;
      }
      console.log(activeSessions.size);
      console.log([...activeSessions.keys()]);

      const existClass = await Class.findOne({
        teacherId: ws.user.id,
        studentIds: studentId,
      });
      console.log("3");

      if (!existClass) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        return;
      }

      const classId = existClass._id.toString();
      console.log([...activeSessions.keys()]);
      const session = activeSessions.get(classId);
      console.log("session", session);

      if (!session) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        return;
      }
      console.log("5");

      session.attendance[studentId] = status;
      const response = new WsResponse("ATTENDANCE_MARKED", {
        studentId,
        status,
      });
      broadcast(wss, response);
    }
  });
});
