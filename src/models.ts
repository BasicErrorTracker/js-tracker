export interface Environment {
  // Browser user agent
  userAgent: string;

  // The URL the error was captured on
  url: string;

  // Browser locale
  locale: string;

  // Browser width
  windowWidth: number;

  // Browser height
  windowHeight: number;

  // Screen width
  screenWidth: number;

  // Screen height
  screenHeight: number;
}

export interface ErrorStackTrace {
  // Trace line
  row: number;

  // Trace column
  col: number;

  // Trace function
  function: string;

  // Trace file
  file: string;
}

export interface ErrorTrace {
  // The full error trace string
  string: string;

  // The parsed stack trace
  stack: ErrorStackTrace[];
}

export interface ErrorData {
  // The date and time of the captured error
  date: Date;

  // The time since page loaded
  timeSinceOrigin: number;

  // The class of the error
  class: string;

  // The message of the error
  message: string;

  // The trace of the error
  trace: ErrorTrace;

  // Whether the error was handled
  handled: boolean;
}

export interface ErrorReport {
  // Version of the report format
  version: number;

  // A unique per-session generated UUID
  sessionId: string;

  // Data about the error delivered to the server
  errorData: ErrorData;

  // The language the error was reported from
  language: string;

  // The browser and platform environment
  environment: Environment;
}
