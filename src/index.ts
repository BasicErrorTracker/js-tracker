import {Environment, ErrorData, ErrorReport, ErrorStackTrace, ErrorTrace} from "./models";
import {generateUUIDv4} from "./utils";

const reportVersion = 1;

let sessionId: string;

const stackTraceLineRegex = /^\s+at\s(\S+)\s\((.+):(\d+):(\d+)\)$/;

function InitializeErrorTracker(callback?: (report: ErrorReport) => number) {
  sessionId = generateUUIDv4();

  window.addEventListener("error", ReportError(callback));

  console.debug('Error Tracker Initialized!');
}

export default function ReportError(callback?: (report: ErrorReport) => number) {
  return (error: ErrorEvent) => {
    const report = prepareReport(error);
    callback && callback(report);
    // TODO Send error to server
  }
}

function prepareReport(error: ErrorEvent): ErrorReport {
  return {
    version: reportVersion,
    environment: collectEnvironmentData(),
    errorData: parseError(error),
    language: 'javascript',
    sessionId: sessionId
  };
}

function parseError(error: ErrorEvent): ErrorData {
  return {
    message: error.message,
    date: new Date(),
    class: error.error.name,
    trace: parseErrorTrace(error.error.stack),
    handled: error.defaultPrevented,
    timeSinceOrigin: error.timeStamp
  };
}

function parseErrorTrace(stack: string): ErrorTrace {
  return {
    stack: parseErrorStackTrace(stack),
    string: stack
  };
}

function parseErrorStackTrace(stack: string): ErrorStackTrace[] {
  return stack.split(/\r?\n/).slice(1).map((line) => {
    const parsed = stackTraceLineRegex.exec(line);
    if (parsed) {
      return {
        row: parseInt(parsed[3], 10),
        col: parseInt(parsed[4], 10),
        function: parsed[1],
        file: parsed[2]
      } as ErrorStackTrace;
    } else {
      return undefined;
    }
  }).filter(valid => Boolean(valid)) as ErrorStackTrace[];
}

function collectEnvironmentData(): Environment {
  return {
    locale: window.navigator.language,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    userAgent: window.navigator.userAgent,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    url: window.location.href,
    platform: window.navigator.platform
  };
}

(window as any)['InitializeErrorTracker'] = InitializeErrorTracker;
