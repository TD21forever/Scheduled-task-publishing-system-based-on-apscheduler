export interface Job {
  jobName: string;
  content: string;
  to: string;
  triggerType: string;
  intervalTime: {};
  startDate?: string | Date;
  endDate?: string | Date;
}
export interface jobPostData {
  id: string
}
export interface jobInfo {
  id: string,
  name: string,
  to: string,
  type: string,
  content: string,
  nextRunTime: string | null,
  func: string,
  status?: string,
  startDate: string,
  endDate?: string,
  intervalTime: {
    day: string,
    hour: string,
    minute: string,
    second: string,
    week: string
  }
}

export interface sqlAddJob {
  jobName: string;
  content: string;
  sql: string;
  triggerType: string;
  intervalTime: {};
  startDate?: string | Date;
  endDate?: string | Date;
  type: "sql"
}

export interface envAddJob {
  jobName: string;
  triggerType: string;
  intervalTime: {};
  startDate?: string | Date;
  endDate?: string | Date;
  type: "env"

}

export interface jobDelete {
  id: string | number
}

export interface sqlPost {
  sql: string
}

export interface loginPost {
  username: string,
  password: string
}