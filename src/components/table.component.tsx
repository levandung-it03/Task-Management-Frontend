import { GeneralTools } from "@/util/general.helper"
import GlobalValidators from "@/util/global.validators"
import { ArrowDownWideNarrow, ListFilter, MoveDown, MoveUp, Search, X, History, EllipsisVertical, Wrench } from "lucide-react"
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import "./styles/table.component.scss"

export interface TableStateWrapper {
  searchVal: string,
  filterField: string,
  sortedField: string,
  sortedMode: number,
  page: number,
  totalPages: number
}

export interface RequestDataWrapper {
  searchVal: string,
  filterField: string,
  sortedField: string,
  sortedMode: number,
  page: number,
  data: {}
}

export type MenuCallback = (data: Record<string, unknown>) => void

export class MenuElementWrapper {
  public name!: string
  public func!: MenuCallback
  public static withBuilder(): MenuElementWrapper { return new MenuElementWrapper() }
  public bname(name: string): MenuElementWrapper { this.name = name; return this }
  public bfunc(func: MenuCallback): MenuElementWrapper { this.func = func; return this }
}

export function TableSearch({ tableId, tableState, setTableState, setReqData, tableFields }: {
  tableId: string,
  tableState: TableStateWrapper,
  setTableState: React.Dispatch<React.SetStateAction<TableStateWrapper>>,
  setReqData: React.Dispatch<React.SetStateAction<RequestDataWrapper>>,
  tableFields: string[]
}): JSX.Element {
  const searchBoxRef = useRef<HTMLInputElement>(null)
  const instructBoxRef = useRef<HTMLDivElement>(null)
  const [showInstruct, setShowInstruct] = useState(false)
  const [searchHistories, setSearchHistories] = useState<string[]>([])
  const onFocusInpShowInst = useCallback(() => {
    setShowInstruct(true)
    setSearchHistories(GeneralTools.getHistInsideCookies(tableId))
  }, [tableId])

  const onChangeSearchVal = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTableState(prev => ({ ...prev, searchVal: e.target.value }))
  }, [setTableState])

  const onClickSearchButton = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const parent = (e.target as HTMLElement).parentElement
    const inp = parent?.querySelector("input.tb-search-box") as HTMLInputElement | null
    inp?.click()
  }, [])

  const onClickFilterField = useCallback((field: string) => {
    setTableState(prev => ({ ...prev, filterField: prev.filterField === field ? "" : field }))
  }, [setTableState])

  const onClickSortMode = useCallback((mode: number) => {
    if (tableState.sortedMode !== 0 && mode === tableState.sortedMode)
      setTableState(prev => ({ ...prev, sortedMode: 0, sortedField: "" }))
    else
      setTableState(prev => ({ ...prev, sortedMode: mode }))
  }, [tableState.sortedMode, setTableState])

  const onClickSortField = useCallback((field: string) => {
    if (tableState.sortedMode === 0) {
      toast.success("Automatically select Sort-Mode!")
      setTableState(prev => ({ ...prev, sortedMode: 1, sortedField: prev.sortedField === field ? "" : field }))
    }
    else
      setTableState(prev => ({ ...prev, sortedField: prev.sortedField === field ? "" : field }))
  }, [tableState.sortedMode, setTableState])

  const onClickHistory = useCallback((history: string) => {
    setTableState(prev => ({ ...prev, searchVal: history }))
  }, [setTableState])

  const onClickRmHistory = useCallback((rmHistory: string) => {
    setSearchHistories(prev => prev.filter(history => history !== rmHistory))
    GeneralTools.removeHistInsideCookies(tableId, rmHistory)
  }, [tableId])

  const onClickSubmitSearch = useCallback(() => {
    async function submit() {
      const searchVal: string | undefined = searchBoxRef?.current?.value.trim()
      if (searchVal && searchVal.trim().length !== 0) {
        GeneralTools.addHistIntoCookies(tableId, searchVal.trim())
        setReqData(prev => ({
          ...prev,
          page: 1,
          searchVal: searchVal,
          filterField: tableState.filterField,
          sortedField: tableState.sortedField,
          sortedMode: tableState.sortedMode
        }))
        setTableState(prev => ({ ...prev, searchVal: searchVal }))
      } else {
        setReqData(prev => ({
          ...prev,
          page: 1,
          searchVal: "",
          filterField: "",
          sortedField: tableState.sortedField,
          sortedMode: tableState.sortedMode
        }))
        setTableState(prev => ({ ...prev, searchVal: "", filterField: "" }))
      }
    }
    submit()
  }, [tableId, setTableState, setReqData, tableState])

  useEffect(() => {
    const instructBox = instructBoxRef.current;
    const searchBox = searchBoxRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      if (instructBox && !instructBox.contains(event.target as Node))
        setShowInstruct(false);
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSearchBoxFocused = document.activeElement === searchBox;
      if (event.key === "Enter" && isSearchBoxFocused) {
        onClickSubmitSearch()
        setShowInstruct(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      if (searchBoxRef && searchBox)
        searchBox.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClickSubmitSearch])

  return (
    <div className={`tb-search-container${showInstruct ? " tb-search-container-focus" : ""}`}>
      <Search className="tb-search-icon" onClick={onClickSearchButton} />
      <input className="tb-search-box" name="searchVal" type="text" autoComplete="off"
        ref={searchBoxRef} value={tableState.searchVal}
        onChange={onChangeSearchVal} onClick={onFocusInpShowInst} />
      <button className="tb-search-submit-btn" type="button" onClick={onClickSubmitSearch}>Go</button>

      <div ref={instructBoxRef} className={`tb-search-instruction${showInstruct ? "" : " hidden"}`}>

        <div className="tbs-inst-filter-section">
          <span className="instruction-title">Filters<ListFilter className="inst-tlt-icon-desc" /></span>
          <ul className="tbs-inst-filter-fields">
            {GlobalValidators.isEmpty(tableFields)
              ? <li><i style={{ color: "var(--border-color)" }}>No filter fields availabe</i></li>
              : tableFields.map((field, ind) => (
                <li key={"flt" + field + ind} className="tbs-inst-filter-field">
                  <button className={tableState.filterField === field ? "tbs-inst-field-selected" : ""} type="button"
                    onClick={() => onClickFilterField(field)}>
                    {GeneralTools.fieldToLabel(field)}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="tbs-inst-sort-section">
          <div className="tbs-inst-sort-header">
            <span className="instruction-title">Sorts<ArrowDownWideNarrow className="inst-tlt-icon-desc" /></span>
            <button className={"tbs-inst-sort-mode-btn" + (tableState.sortedMode === 1 ? " tbs-inst-field-selected" : "")}
              onClick={() => onClickSortMode(1)} type="button">
              A-Z
              <MoveDown className="tbs-inst-smb-icon" />
            </button>
            <button className={"tbs-inst-sort-mode-btn" + (tableState.sortedMode === -1 ? " tbs-inst-field-selected" : "")}
              onClick={() => onClickSortMode(-1)} type="button">
              Z-A
              <MoveUp className="tbs-inst-smb-icon" />
            </button>
          </div>

          <ul className="tbs-inst-sort-fields">
            {GlobalValidators.isEmpty(tableFields)
              ? <li><i style={{ color: "var(--border-color)" }}>No sorting fields availabe</i></li>
              : tableFields.map((field, ind) => (
                <li key={"sort" + field + ind} className="tbs-inst-sort-field">
                  <button className={tableState.sortedField === field ? "tbs-inst-field-selected" : ""} type="button"
                    onClick={() => onClickSortField(field)}>
                    {GeneralTools.fieldToLabel(field)}
                  </button>
                  <button type="button" className="hidden"><X /></button>
                </li>
              ))}
          </ul>
        </div>

        <div className="tbs-inst-histories-section">
          <span className="instruction-title">Histories<History className="inst-tlt-icon-desc" /></span>
          <ul className="tbs-inst-histories-fields">
            {GlobalValidators.isEmpty(searchHistories)
              ? <li><i style={{ color: "var(--border-color)" }}>No histories stored</i></li>
              : searchHistories.map((history, ind) => (
                <li key={"htr" + history + ind} className="tbs-inst-history-row">
                  <button className="tbs-inst-history" type="button" onClick={() => onClickHistory(history)}>
                    {history}
                  </button>
                  <button className="tbs-inst-rm-history" onClick={() => onClickRmHistory(history)} type="button">
                    <X className="tbs-inst-rmhs-icon" />
                  </button>
                </li>
              ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export function TableTDMenuBtn({ menuId, openingMenu, setOpeningMenu, menuAndFuncs, data }: {
  menuId: string,
  openingMenu: string,
  setOpeningMenu: React.Dispatch<React.SetStateAction<string>>,
  menuAndFuncs: MenuElementWrapper[],
  data: Record<string, unknown>
}): JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpeningMenu("");
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpeningMenu])

  return (
    <td className="table-cell tbr-menu-cell">
      <div className="tbr-menu-container">
        <button className="tbr-menu-btn" type="button" onClick={() => {
          setOpeningMenu(menuId)
        }}>
          <EllipsisVertical className="tbr-menu-icon" />
        </button>
      </div>
      <div className="empty-wrapper" ref={menuRef}>
        <ul className={`tbr-main-menu-wrapper${openingMenu === menuId ? "" : " hidden"}`}>
          {menuAndFuncs.map((menuAndFunc, ind) => (
            <li key={menuId + ind} className="tbd-menu-index">
              <button
                className="tbd-menu-btn"
                type="button"
                onMouseDown={(e) => menuAndFunc.func(data)}>
                {menuAndFunc.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </td>
  )
}

export function TableTDMenuHead() {
  return <td className="table-cell tbh-menu-container">
    <Wrench className="tbh-menu-icon" />
  </td>
}

export function TablePagination({ totalPages, tableState, setTableState, setReqData }: {
  totalPages: number,
  tableState: TableStateWrapper,
  setTableState: React.Dispatch<React.SetStateAction<TableStateWrapper>>,
  setReqData: React.Dispatch<React.SetStateAction<RequestDataWrapper>>
}
): JSX.Element {
  const MAX_PAGE_LENGTH = 7
  const pageNums = useMemo(() => [...Array(totalPages)].map((_, i) => i + 1), [totalPages])

  const onChangePageNum = useCallback((p: number) => {
    async function submit() {
      if (p !== tableState.page) {
        setTableState(prev => ({ ...prev, page: p }))
        setReqData(prev => ({ ...prev, page: p }))
      }
    }
    submit()
  }, [setTableState, tableState.page, setReqData])

  const pageNumBuilder = useCallback((p: number) => (
    <button key={window.location.pathname + "-panum-" + p}
      className={`pgnt-btn page-num${p === tableState.page ? " selected-page" : ""}`}
      onClick={() => onChangePageNum(p)}
    >
      {p}
    </button>
  ), [tableState.page, onChangePageNum])

  const pages = useMemo(() => {
    if (totalPages <= MAX_PAGE_LENGTH)
      return <div className="pages"> {pageNums.map(p => pageNumBuilder(p))} </div>
    else {
      return (
        <div className="pages">
          {tableState.page !== 1 && pageNumBuilder(1)}
          {tableState.page >= 5 && <span className="summarized-pages">...</span>}
          {tableState.page >= 4 && pageNumBuilder(tableState.page - 2)}
          {tableState.page >= 3 && pageNumBuilder(tableState.page - 1)}
          {pageNumBuilder(tableState.page)}
          {totalPages - tableState.page >= 2 && pageNumBuilder(tableState.page + 1)}
          {totalPages - tableState.page >= 3 && pageNumBuilder(tableState.page + 2)}
          {totalPages - tableState.page >= 4 && <span className="summarized-pages">...</span>}
          {tableState.page !== totalPages && pageNumBuilder(totalPages)}
        </div>
      )
    }
  }, [totalPages, tableState.page, pageNumBuilder, pageNums])

  return (
    <div className="pagination">
      {tableState.page !== 1 && <button className="pgnt-btn prev-page"
        onClick={() => onChangePageNum(tableState.page - 1)}
      >
        Prev
      </button>}
      {pages}
      {tableState.page !== totalPages && <button className="pgnt-btn prev-page"
        onClick={() => onChangePageNum(tableState.page + 1)}
      >
        Next
      </button>}
    </div>
  )
}

export function MainTable({ children }: { children: React.ReactNode }): JSX.Element {
  return <table className="table-group">
    {children}
  </table>
}

export function TableCaption({ caption }: { caption: string }): JSX.Element {
  return <h1 className="table-caption">{caption}</h1>
}

export function TableDescription({ desc }: { desc: string }): JSX.Element {
  return <p className="table-description">{desc}</p>
}

export function TableDataLoading(): JSX.Element {
  return <tr className="loading-row"><td>Loading...</td></tr>
}

export function TableHeadWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <thead className="table-header-container">
    <tr className="table-header table-row-group">
      {children}
    </tr>
  </thead>
}

export function TableHeadCell({ name }: { name: string }): JSX.Element {
  return <td className="table-cell">{name}</td>
}

export function TableBodyWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return <tbody className="table-body-container">
    {children}
  </tbody>
}

export function TableRowWrapper({ children, ...props }: { children: React.ReactNode }): JSX.Element {
  return <tr {...props} className="table-row-group">
    {children}
  </tr>
}

/* [Example]: Table
<div className="main-manage-users">
  <div className="customize-table">
    <TableCaption caption={"Manage Users"} />
    <TableDescription desc={"Provide table and tools to manage users information using our system services"} />
    <TableSearch tableId={tableId} tableState={tableState} setTableState={setTableState} tableFields={tableFields} />
    <MainTable>
      <TableHeadWrapper>
        <TableHeadCell name={"Avatar"} />
        <TableTDMenuHead />
      </TableHeadWrapper>
      <TableBodyWrapper>
        {GlobalValidators.isEmpty(data.dataList)
          ? <TableDataLoading />
          : data!.dataList.map((userInfo, ind) => (
            <TableRowWrapper key={userInfo.email + "_" + ind}>
              <td className="table-cell tb-cell-ava">
                <span className="virtual-ava">{userInfo.fullName[0].toUpperCase()}</span>
              </td>
              <td className="table-cell tb-cell-mullines">{userInfo.createdTime}</td>
              <td className="table-cell">{userInfo.coins}</td>
              <td className="table-cell">
                <span className="quick-blue-tag">{GeneralTools.capitalize(userInfo.gender)}</span>
              </td>
              <td className="table-cell">
                <button className={`user-status status-${userInfo.active + ""}`}
                  onMouseLeave={e => {
                    const btn = e.target as HTMLElement
                    btn.classList.remove(`status-${!userInfo.active + ""}`)
                    btn.classList.add(`status-${userInfo.active + ""}`)
                    btn.textContent = userInfo.active ? "Activated" : "In-activated"
                  }}
                  onMouseEnter={e => {
                    const btn = e.target as HTMLElement
                    btn.classList.remove(`status-${userInfo.active + ""}`)
                    btn.classList.add(`status-${!userInfo.active + ""}`)
                    btn.textContent = !userInfo.active ? "Activate" : "In-activate"
                  }}>
                  {userInfo.active ? "Activated" : "In-activated"}
                </button>
              </td>
              <TableTDMenuBtn menuId={tableId + "-menu-" + ind} openingMenu={openingMenu}
                setOpeningMenu={setOpeningMenu} menuAndFuncs={menuAndFuncs} data={{
                  email: userInfo.email,
                  authorities: userInfo.authorities
                }}
              />
            </TableRowWrapper>
          ))
        }
      </TableBodyWrapper>
    </MainTable>
    <TablePagination totalPages={data.totalPages} page={tableState.page} setTableState={setTableState} />
  </div>
</div>
*/