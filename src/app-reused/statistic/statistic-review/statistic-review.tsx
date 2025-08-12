'use client'

import { useCallback, useEffect, useState } from "react";
import "./statistic-review.scss";
import { StatisticPageAPIs } from "@/apis/statistic.page";
import { ApiResponse } from "@/apis/general.api";
import { DTO_UserStatistic } from "@/dtos/statistic.page.dto";
import { getColorByCharacter } from "@/app-reused/create-task/task-creation-form/task-creation.form";
import { ChartArea } from "lucide-react";

export default function StatisticReview({ projectId }: { projectId: number }) {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [collections, setCollections] = useState<Record<number, string>>({})
  const [phases, setPhases] = useState<Record<number, string>>({})
  const [statisticUsers, setStatisticUsers] = useState<DTO_UserStatistic[]>([])

  const onClickChoosePhase = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    async function fetchCollections() {
      const phaseId = Number(e.target.value)
      const response = await StatisticPageAPIs.fetchSimpleCollections(phaseId) as ApiResponse<Record<number, string>>
      if (!String(response).startsWith("2"))
        return
      setCollections(response.body)

      setIsLoadingUsers(true)
      const usersResponse = await StatisticPageAPIs.fetchUsersStatisticByPhaseId(phaseId) as ApiResponse<DTO_UserStatistic[]>
      if (String(usersResponse.status).startsWith("2")) {
        setStatisticUsers(usersResponse.body)
      }
      setIsLoadingUsers(false)
    }
    fetchCollections()
  }, [])

  const onClickChooseCollection = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    async function fetchCollections() {
      const collectionId = Number(e.target.value)
      const response = await StatisticPageAPIs.fetchSimpleCollections(collectionId) as ApiResponse<Record<number, string>>
      if (String(response).startsWith("2")) {
        setCollections(response.body)
      }

      setIsLoadingUsers(true)
      const usersResponse = await StatisticPageAPIs.fetchUsersStatisticByCollectionId(collectionId) as ApiResponse<DTO_UserStatistic[]>
      if (String(usersResponse.status).startsWith("2")) {
        setStatisticUsers(usersResponse.body)
      }
      setIsLoadingUsers(false)
    }
    fetchCollections()
  }, [])

  useEffect(() => {
    async function fetchPhases() {
      const response = await StatisticPageAPIs.fetchSimplePhases(projectId) as ApiResponse<Record<number, string>>
      if (!String(response.status).startsWith("2"))
        return
      setPhases(response.body)

      setIsLoadingUsers(true)
      const usersResponse = await StatisticPageAPIs.fetchUsersStatisticByProjectId(projectId) as ApiResponse<DTO_UserStatistic[]>
      if (String(usersResponse.status).startsWith("2")) {
        setStatisticUsers(usersResponse.body)
      }
      setIsLoadingUsers(false)
    }
    fetchPhases()
  }, [projectId])

  return <div className="statistic-review">
    <div className="filter-container">
      <div className="form-caption">
        <ChartArea className="caption-icon" />
        <span className="caption-content">
          Statistic
        </span>
        <i className="desc-content">All assigned Users (to Tasks of Project) statistic shown here!</i>
      </div>

      <div className="form-group-container half-form-left-container">
        <fieldset className="form-group">
          <legend className="form-label">Phase Filtering</legend>
          <select className="phase form-input" onChange={onClickChoosePhase} defaultValue="">
            <option value="" disabled>-- Choose a Phase --</option>
            {Object.entries(phases).map(([id, name], ind) =>
              <option key={`phase-` + ind} value={id}>{name}</option>
            )}
          </select>
        </fieldset>
      </div>
      <div className="form-group-container half-form-right-container">
        <fieldset className="form-group">
          <legend className="form-label">Collection Filtering</legend>
          <select className="phase form-input" onChange={onClickChooseCollection} defaultValue="">
            <option value="" disabled>-- Choose a Collection --</option>
            {Object.entries(collections).map(([id, name], ind) =>
              <option key={`col-` + ind} value={id}>{name}</option>
            )}
          </select>
        </fieldset>
      </div>
    </div>
    {isLoadingUsers
      ? <div className="loading-row">Loading...</div>
      : <div className="users-statistic">
        {statisticUsers.map((user, ind) => {
          const firstNameChar = user.fullName[0].toUpperCase()
          return <a key={"us-" + ind} className="user-short-info" href={`${window.location.pathname}/user-task/${user.id}`}>
            <span className="usi-ava" style={getColorByCharacter(firstNameChar)}>{firstNameChar}</span>
            <span className="usi-full-name">{user.fullName}</span>
            <span className="usi-email">{user.email}</span>
            <span className="usi-dep quick-blue-tag">{user.department}</span>
            <span className={`usi-role usi-${user.role.toLowerCase().replace("_", "-")}`}>{user.role}</span>
          </a>
        })}
      </div>}
  </div>
}