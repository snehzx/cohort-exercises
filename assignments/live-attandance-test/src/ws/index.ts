import { WebSocketServer, WebSocket } from "ws";
import { server } from "../server.ts";
import { WsError } from "../utils/wsError";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { activeSessions } from "../session/activeSession";
import { Class } from "../models/class.model";
import { WsResponse } from "../utils/wsResponse";
import { Attendance } from "../models/attendance.model.ts";

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
      ws.send(JSON.stringify(new WsError("Invalid message format")));
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
        ws.send(JSON.stringify(new WsError("Invalid payload")));
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
    } else if (event === "TODAY_SUMMARY") {
      if (ws.user.role !== "teacher") {
        ws.send(JSON.stringify(new WsError("Forbidden, teacher event only")));
        return;
      }
      const existClass = await Class.findOne({
        teacherId: ws.user.id,
      });
      if (!existClass) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        return;
      }
      const classId = existClass._id.toString();
      const session = activeSessions.get(classId);
      if (!session) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        return;
      }
      const att = activeSessions.get(classId)?.attendance!;
      const arr = Object.values(att);
      const present = arr.filter((p) => p === "present").length;
      const absent = arr.filter((a) => a === "absent").length;
      const total = absent + present;
      const response = new WsResponse("TODAY_SUMMARY", {
        present,
        absent,
        total,
      });
      broadcast(wss, response);
    } else if (event === "MY_ATTENDANCE") {
      if (ws.user.role === "teacher") {
        ws.send(JSON.stringify(new WsError("Forbidden, student event only")));
        return;
      }
      const existClass = await Class.findOne({
        studentIds: ws.user.id,
      });
      if (!existClass) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        return;
      }
      const classId = existClass._id.toString();
      const session = activeSessions.get(classId);
      if (!session) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        return;
      }
      const status = session.attendance[ws.user.id] ?? "not yet updated";
      ws.send(
        JSON.stringify(
          new WsResponse("MY_ATTENDANCE", {
            status,
          }),
        ),
      );
    } else if (event === "DONE") {
      if (ws.user.role === "student") {
        ws.send(JSON.stringify(new WsError("Forbidden, teacher event only")));
        return;
      }
      const existClass = await Class.findOne({
        teacherId: ws.user.id,
      });
      if (!existClass) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        ws.close();
        return;
      }
      const classId = existClass._id.toString();
      const session = activeSessions.get(classId);
      if (!session) {
        ws.send(JSON.stringify(new WsError("No active attendance session")));
        ws.close();
        return;
      }
      const totalAttendance: Record<string, "present" | "absent"> = {};
      existClass.studentIds.forEach((id) => {
        const studentId = id.toString();
        totalAttendance[studentId] =
          activeSessions.get(classId)?.attendance[studentId] ?? "absent";
      });

      await Promise.all(
        Object.entries(totalAttendance).map(([studentId, status]) =>
          Attendance.findOneAndUpdate(
            { classId, studentId },
            { classId, studentId, status },
            { upsert: true },
          ),
        ),
      );
      console.log(await Attendance.find({ classId }));

      const values = Object.values(totalAttendance);
      const present = values.filter((p) => p === "present").length;
      const absent = values.filter((a) => a === "absent").length;
      const total = present + absent;
      const response = new WsResponse("DONE", {
        message: "Attendance persisted",
        present,
        absent,
        total,
      });
      broadcast(wss, response);
      activeSessions.delete(classId);
    } else {
      ws.send(JSON.stringify(new WsError("Unknown event")));
      ws.close();
      return;
    }
  });
});
