import { Server } from "socket.io";
import { Queue } from "bullmq";
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const prisma: any;
export declare const jobQueue: Queue<any, any, string, any, any, string>;
export { io };
//# sourceMappingURL=index.d.ts.map