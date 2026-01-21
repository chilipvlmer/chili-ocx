import { writeFileSync } from "fs";

const LOG_FILE = "/tmp/chili-ocx-plugin.log";
const DEBUG_MODE = process.env.CHILI_OCX_DEBUG === "1";

type LogLevel = "INFO" | "WARN" | "ERROR";

/**
 * Core logging function - logs to file and conditionally to console
 * @param msg - Message to log
 * @param level - Log level (INFO, WARN, ERROR)
 */
export function log(msg: string, level: LogLevel = "INFO"): void {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] ${msg}\n`;

  // Only log to console if debug mode enabled
  if (DEBUG_MODE) {
    if (level === "ERROR") {
      console.error(msg);
    } else {
      console.log(msg);
    }
  }

  // Always log to file (silent fail on errors)
  try {
    writeFileSync(LOG_FILE, line, { flag: "a" });
  } catch (e) {
    // Silent fail - don't break plugin if log file inaccessible
  }
}

/**
 * Log an informational message
 * @param msg - Message to log
 */
export function logInfo(msg: string): void {
  log(msg, "INFO");
}

/**
 * Log a warning message
 * @param msg - Message to log
 */
export function logWarn(msg: string): void {
  log(msg, "WARN");
}

/**
 * Log an error message
 * @param msg - Message to log
 */
export function logError(msg: string): void {
  log(msg, "ERROR");
}
