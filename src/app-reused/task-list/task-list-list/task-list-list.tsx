import React, { useMemo, useState } from "react";
import { DTO_TaskListItem } from "../../../dtos/task-list.page.dto";
import { AuthHelper } from "@/util/auth.helper";
import "./task-list-list.scss";
import { ClipboardList } from "lucide-react";
import { GeneralTools } from "@/util/general.helper";

interface TaskListListProps {
  taskLists: DTO_TaskListItem[];
}

export default function TaskListList({ taskLists }: TaskListListProps) {
  const validTaskLists = taskLists.filter(t => t != null);

  const [filterValue, setFilterValue] = useState("ALL");
  const [sortValue, setSortValue] = useState("NONE");

  // ───────────────────────────────────────────────
  // PROCESS LIST (FILTER + SORT)
  // ───────────────────────────────────────────────
  const processedList = useMemo(() => {
    let list = [...validTaskLists];

    // FILTER
    if (filterValue !== "ALL") {
      list = list.filter(
        t =>
          t.level === filterValue ||
          t.priority === filterValue ||
          t.taskType === filterValue
      );
    }

    // SORT
    switch (sortValue) {
      case "DEADLINE_ASC":
        list.sort((a, b) => a.deadline.localeCompare(b.deadline));
        break;
      case "DEADLINE_DESC":
        list.sort((a, b) => b.deadline.localeCompare(a.deadline));
        break;
      case "PRIORITY":
        list.sort((a, b) => a.priority.localeCompare(b.priority));
        break;
      case "LEVEL":
        list.sort((a, b) => a.level.localeCompare(b.level));
        break;
      case "TYPE":
        list.sort((a, b) => a.taskType.localeCompare(b.taskType));
        break;
    }

    return list;
  }, [validTaskLists, filterValue, sortValue]);

  return (
    <div className="task-list-list">

      {/* FILTER BAR */}
      <div className="task-list-controls">

        {/* FILTER */}
        <select
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
          className="task-select"
        >
          <option value="ALL">Filter: All</option>

          <optgroup label="Level">
            <option value="HARD">HARD</option>
            <option value="ADVANCED">ADVANCED</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LIGHT">LIGHT</option>
          </optgroup>

          <optgroup label="Priority">
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </optgroup>

          <optgroup label="Type">
            <option value="BACKEND">Backend</option>
            <option value="FRONTEND">Frontend</option>
            <option value="AI">AI</option>
            <option value="TEST">Test</option>
            <option value="DESIGN">Design</option>
            <option value="DEPLOY">Deploy</option>
            <option value="MAINTENANCE">Maintenance</option>
          </optgroup>
        </select>

        {/* SORT */}
        <select
          value={sortValue}
          onChange={e => setSortValue(e.target.value)}
          className="task-select"
        >
          <option value="NONE">Sort: None</option>
          <option value="DEADLINE_ASC">Deadline ↑</option>
          <option value="DEADLINE_DESC">Deadline ↓</option>
          <option value="PRIORITY">Priority</option>
          <option value="LEVEL">Level</option>
          <option value="TYPE">Type</option>
        </select>
      </div>

      {/* TASK LIST */}
      {processedList.length === 0 ? (
        <span className="loading-row">No Tasks match filter!</span>
      ) : (
        processedList.map(task => {
          const unDone = task.endDate == null;
          return (
            <a key={task.id}
              href={`${window.location.origin}/${AuthHelper.getRoleFromToken()}/task-detail/${task.id}`}
              className={`task-list-item ${task.priority} ${task.level} ${unDone ? "" : "task-done"}`}>
              {/* LEFT PART: NAME */}
              <div className="task-list-info">
                <ClipboardList size={26} strokeWidth={2} style={{ color: "var(--main-green)", background: "#e6f4ea", borderRadius: "6px", padding: "3px" }} />
                <div className="task-list-content">
                  <span className="task-list-name">{task.name}</span>
                </div>
              </div>
              {/* TAGS */}
              <div className="task-list-tags">
                <span className={`task-tag level-tag ${task.level}`}>
                  {GeneralTools.capitalize(task.level)}
                </span>
                <span className="task-tag type-tag">
                  {GeneralTools.capitalize(task.taskType)}
                </span>
                <span className={`task-tag priority-tag ${task.priority}`}>
                  {GeneralTools.capitalize(task.priority)}
                </span>
                <span className={`status-tag ${unDone ? "un-done-tag" : "done-tag"}`}>
                  {unDone ? "Un-done" : "Done"}
                </span>
              </div>

              {/* DATES */}
              <div className="task-list-dates">
                <div className="start-date">
                  <span className="date-label">
                    Started {task.startDate}
                  </span>
                </div>
                <div className="task-list-deadline">
                  Deadline:
                  <span className="deadline-value"> {task.deadline}</span>
                </div>
              </div>
            </a>
          );
        })
      )}
    </div>
  );
}
