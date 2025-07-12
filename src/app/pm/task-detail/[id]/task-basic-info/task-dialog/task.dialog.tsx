import { ClipboardList, X } from "lucide-react";

import "./task.dialog.scss"
import { useCallback, useEffect, useRef, useState } from "react";
import { DTO_UpdateBasicTask, DTO_TaskDetail } from "@/dtos/task-detail.page.api";
import GlobalValidators from "@/util/global.validators";
import { ApiResponse, GeneralAPIs } from "@/apis/general.api";
import { CreateTaskPageValidators } from "@/app-reused/create-task/page.service";
import { GeneralTools } from "@/util/general.helper";
import { TaskDetailPageAPIs } from "@/apis/task-detail.page.api";
import toast from "react-hot-toast";

interface TaskDialogProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  taskInfo: DTO_TaskDetail;
  setTaskInfo: React.Dispatch<React.SetStateAction<DTO_TaskDetail>>;
}

export default function TaskDialog({
  taskInfo,
  setTaskInfo,
  openDialog,
  setOpenDialog,
}: TaskDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [deadline, setDeadline] = useState("")
  const [levelList, setLevelList] = useState<string[]>([])
  const [level, setLevel] = useState("")
  const [priorityList, setPriorityList] = useState<string[]>([])
  const [priority, setPriority] = useState("")
  const [taskTypeList, setTaskTypeList] = useState<string[]>([])
  const [taskType, setTaskType] = useState("")
  const [formValidation, setFormValidation] = useState({
    deadline: "",
  })

  const onChangeDeadline = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value)
    setFormValidation(prev => ({ ...prev, deadline: CreateTaskPageValidators.isValidDeadline(e.target.value) }))
  }, [])

  const onChangeLevel = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value)
  }, [])

  const onChangePriority = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value)
  }, [])

  const onChangeTaskType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskType(e.target.value)
  }, [])

  const onSubmitUpdateContent = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    async function submitUpdating() {
      console.log("submitted")
      if (GlobalValidators.isInvalidValidation(formValidation))
        return
      if (priority === taskInfo.priority
        && level === taskInfo.level
        && taskType === taskInfo.taskType
        && deadline === taskInfo.deadline) {
        toast.error("Data has not changed")
        return
      }
      const request = DTO_UpdateBasicTask.withBuilder()
        .bid(taskInfo.id)
        .bpriority(priority)
        .blevel(level)
        .btaskType(taskType)
        .bdeadline(deadline)
      const response = await TaskDetailPageAPIs.updateBasicTaskInfo(request) as ApiResponse<void>
      console.log(response)
      if (String(response.status)[0] === "2") {
        toast.success(response.msg)
        setTaskInfo(prev => ({
          ...prev,
          priority: priority,
          level: level,
          taskType: taskType,
          deadline: deadline
        }))
      }
      setOpenDialog(false)
    }
    submitUpdating()
  }, [taskInfo.id, priority, level, taskType, deadline])

  useEffect(() => {
    async function initValues() {
      const levelsResponse = await GeneralAPIs.getTaskLevelEnums() as ApiResponse<string[]>
      if (String(levelsResponse.status)[0] === "2")
        setLevelList(levelsResponse.body)

      const prioritiesResponse = await GeneralAPIs.getTaskPriorityEnums() as ApiResponse<string[]>
      if (String(prioritiesResponse.status)[0] === "2")
        setPriorityList(prioritiesResponse.body)

      const taskTypesResponse = await GeneralAPIs.getTaskTypeEnums() as ApiResponse<string[]>
      if (String(taskTypesResponse.status)[0] === "2")
        setTaskTypeList(taskTypesResponse.body)
    }
    initValues()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setOpenDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => setLevel(taskInfo.level), [taskInfo.level])
  useEffect(() => setPriority(taskInfo.priority), [taskInfo.priority])
  useEffect(() => setTaskType(taskInfo.taskType), [taskInfo.taskType])
  useEffect(() => setDeadline(GeneralTools.formatedDateToDateInput(taskInfo.deadline)), [taskInfo.deadline])

  return openDialog
    ? <div className="task-dialog">
      <div ref={overlayRef} className="dialog-overlay"></div>
      <div className="dialog-container">
        <div className="dialog-header">
          <div className="dialog-header-content">
            <ClipboardList className="dhc-icon" />
            <span className="dhc-title">Basic Information</span>
          </div>
          <X className="close-dialog-btn" onClick={e => setOpenDialog(false)} />
        </div>
        <div className="input-container">
          <div className="form-group-container half-form-left-container">
            <fieldset className="form-group">
              <legend className="form-label">Deadline</legend>
              <input type="date" id="deadline" className="form-input" placeholder="Type Deadline" required
                value={deadline} onChange={onChangeDeadline} />
            </fieldset>
            {GlobalValidators.notEmpty(formValidation.deadline) && <span className="input-err-msg">{formValidation.deadline}</span>}
          </div>

          <div className="form-group-container half-form-right-container">
            <fieldset className="form-group">
              <legend className="form-label">Level</legend>
              <select id="level" className="form-input" value={level} onChange={onChangeLevel}>
                {levelList.map((level, ind) =>
                  <option key={"tdl-" + ind} value={level}>{GeneralTools.convertEnum(level)}</option>
                )}
              </select>
            </fieldset>
          </div>

          <div className="form-group-container half-form-left-container">
            <fieldset className="form-group">
              <legend className="form-label">Priority</legend>
              <select id="priority" className="form-input" value={priority} onChange={onChangePriority}>
                {priorityList.map((priority, ind) =>
                  <option key={"tdp-" + ind} value={priority}>{GeneralTools.convertEnum(priority)}</option>
                )}
              </select>
            </fieldset>
          </div>

          <div className="form-group-container half-form-right-container">
            <fieldset className="form-group">
              <legend className="form-label">Task Type</legend>
              <select id="task-type" className="form-input" value={taskType} onChange={onChangeTaskType}>
                {taskTypeList.map((taskType, ind) =>
                  <option key={"tdt-" + ind} value={taskType}>{GeneralTools.convertEnum(taskType)}</option>
                )}
              </select>
            </fieldset>
          </div>

          <div className="update-btn-container">
            <button className="update-content-btn" onClick={onSubmitUpdateContent} type="button">
              Submit Update
            </button>
          </div>
        </div>
      </div>
    </div>
    : <></>
}