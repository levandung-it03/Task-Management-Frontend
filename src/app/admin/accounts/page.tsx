'use client'

import Image from "next/image"
import { BadgeInfo, BookUser, BrushCleaning, Download, SendHorizontal, Table, X } from "lucide-react";
import "./page.scss"
import React, { useCallback, useEffect, useState } from "react";
import { AccountCreationPageAPIs } from "@/apis/create-accounts.page.api";
import { ApiResponse } from "@/apis/general.api";
import toast from "react-hot-toast";
import { DTO_AccountCreation, DTO_CreateDepartment, DTO_ExistsObject } from "@/dtos/create-task.page.dto";
import { confirm } from "@/app-reused/confirm-alert/confirm-alert";
import { DepartmentAPIs } from "@/apis/department.page.api";
import { DTO_Department } from "@/dtos/user-info.page.dto";
import { DTO_IdResponse } from "@/dtos/general.dto";

export default function AdminCreateAccountsPage() {
  const [file, setFile] = useState<File>(new File([], "empty.txt"))
  const [existsSavedAccounts, setExistsSavedAccounts] = useState(false)
  const [openDialog, setOpenDialog] = useState(true)
  const [isAccountsSaved, setIsAccountSaved] = useState(0)

  const onClickClearSavedFile = useCallback(() => {
    async function clearFile() {
      if (!(await confirm("Cached File cannot be revive after cleared, are you sure?", "Confirm Clear File")))
        return

      const response = await AccountCreationPageAPIs.clearSavedFile() as ApiResponse<void>
      if (String(response.status).startsWith("2")) {
        setIsAccountSaved(prev => prev + 1)
        toast.success(response.msg)
      }
    }
    clearFile()
  }, [])

  const onClickDownloadSavedAccouts = useCallback(() => {
    async function downloadEx() {
      const blob = await AccountCreationPageAPIs.getLastSavedAccounts()
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'created_accounts.txt';

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
        setIsAccountSaved(prev => prev + 1);
      }
    }
    downloadEx()
  }, [])

  const onClickSubmiteFile = useCallback(() => {
    async function createAccounts() {
      if (file.size === 0) {
        toast.error("Check your input data again")
        return
      }
      const response = await AccountCreationPageAPIs.createAccounts(file) as ApiResponse<DTO_AccountCreation[]>
      if (String(response.status).startsWith("2")) {
        setIsAccountSaved(prev => prev + 1)
        toast.success(response.msg);
      }
    }
    createAccounts()
  }, [file])

  const onChangeFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, [])

  useEffect(() => {
    async function checkExistsSavedAcc() {
      const response = await AccountCreationPageAPIs.checkIfExistsLastSavedAccounts() as ApiResponse<DTO_ExistsObject>
      if (String(response.status).startsWith("2")) {
        setExistsSavedAccounts(response.body.result)
      }
    }
    checkExistsSavedAcc()
  }, [isAccountsSaved])

  return <>
    <div className="accounts-creation">
      <div className="form-caption">
        <BookUser className="caption-icon" />
        <span className="caption-content">Accounta Creation</span>
        <i className="desc-content">Import excel<b>.xlsx</b> file to create all Accounts related.</i>
      </div>
      <div className="file-creation">
        <div className="form-caption">
          <BookUser className="caption-icon" />
          <span className="caption-content">
            Interaction
            <button className="instruction" onClick={() => setOpenDialog(true)}>?</button>
          </span>
        </div>
        <div className="form-group-container file-inp-block">
          <fieldset className="form-group">
            <legend className="form-label">Users Info File</legend>
            <input
              type="file"
              id="users-file"
              className="form-input"
              placeholder="Import Users File"
              required
              accept=".xlsx"
              onChange={onChangeFile} />
          </fieldset>
        </div>
        <div className="form-group-container submit-btn-block">
          <button onClick={onClickSubmiteFile} className="fc-btn submit-btn">
            Submit
            <SendHorizontal className="fcb-icon" />
          </button>
        </div>
        {existsSavedAccounts && <>
          <div className="form-group-container download-btn-block">
            <button onClick={onClickDownloadSavedAccouts} className="fc-btn download-btn">
              Save Result
              <Download className="fcb-icon" />
            </button>
          </div>
          <div className="form-group-container delete-btn-block">
            <button onClick={onClickClearSavedFile} className="fc-btn delete-btn">
              Clear Saved File
              <BrushCleaning className="fcb-icon" />
            </button>
          </div>
        </>}
      </div>

    </div>
    {openDialog && <InstructionDialog setOpenDialog={setOpenDialog} />}
    <DepartmentTable />
  </>
}

function InstructionDialog({ setOpenDialog }: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const onClickDownloadEx = useCallback(() => {
    async function downloadEx() {
      const blob = await AccountCreationPageAPIs.getExample()
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'account_creation.xlsx';

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      }
    }
    downloadEx()
  }, [])

  return <>
    <div className="dialog-overlay"></div>
    <div className="instruction-dialog">
      <div className="dialog-header">
        <div className="form-caption">
          <BadgeInfo className="caption-icon" />
          <span className="caption-content">Instruction </span>
          <i className="desc-content">Excel<b>.xlsx</b> example file to create a bunch of Accounts.</i>
        </div>
        <div className="dialog-close-btn">
          <X className="dcb-icon" onClick={() => setOpenDialog(false)} />
        </div>
      </div>
      <div className="exel-exam">
        <Image className="ee-img" src="/images/create-acc-instruction.png" width={550} height={450} alt="Login illustration" />
      </div>
      <div className="download-ex">
        <button className="download-ex-btn" onClick={onClickDownloadEx}>
          Download Example
          <Download className="deb-icon" />
        </button>
      </div>
    </div>
  </>
}

function DepartmentTable() {
  const [departments, setDepartments] = useState<DTO_Department[]>([]);
  const [createName, setCreateName] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    async function load() {
      const res = await DepartmentAPIs.getAll() as ApiResponse<DTO_Department[]>;
      if (res && String(res.status).startsWith("2")) {
        setDepartments(res.body);
      }
    }
    load();
  }, []);

  const handleCreate = useCallback(() => {
    async function create() {
      const request = DTO_CreateDepartment.withBuilder().bname(createName);
      const res = await DepartmentAPIs.create(request) as ApiResponse<DTO_IdResponse>;

      if (String(res.status).startsWith("2")) {
        toast.success(res.msg);
        setDepartments(d => [{ id: res.body.id, name: createName }, ...d]);
        setCreateName("");
      }
    }
    create();
  }, [createName]);

  const handleUpdate = useCallback(() => {
    async function update() {
      const req = DTO_CreateDepartment.withBuilder().bname(editName);
      const res = await DepartmentAPIs.update(editId, req) as ApiResponse<void>;

      if (String(res.status).startsWith("2")) {
        toast.success(res.msg);
        setDepartments(d => d.map(x => x.id === editId ? { ...x, name: editName } : x));
        setEditId(-1);
        setEditName("");
      }
    }
    update();
  }, [editId, editName]);

  const handleDelete = useCallback((id: number) => {
    async function remove() {
      const res = await DepartmentAPIs.delete(id) as ApiResponse<void>;
      if (String(res.status).startsWith("2")) {
        toast.success(res.msg);
        setDepartments(d => d.filter(x => x.id !== id));
      }
    }
    remove();
  }, []);

  return (
    <div className="dept-wrapper container-dept">
      <h2 className="dept-title">
        <Table className="dept-icon" />
        Departments
      </h2>
      <div className="create-box dept-create-box">
        <div className="form-group-container half-form-left-container">
          <fieldset className="form-group">
            <legend className="form-label">New Department</legend>
            <input
              className="form-input"
              value={createName}
              onChange={e => setCreateName(e.target.value)}
              placeholder="Department name"
            />
          </fieldset>
        </div>
        <div className="form-group-container half-form-right-container">
          <div className="dept-btn-block">
          <button className="dept-btn" onClick={handleCreate}>Create</button>
          </div>
        </div>
      </div>
      <table className="dept-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>
                {editId === d.id ? (
                  <input value={editName} onChange={e => setEditName(e.target.value)} />
                ) : (
                  d.name
                )}
              </td>
              <td className="btns-cell">
                {editId === d.id ? (
                  <>
                    <button className="green-btn" onClick={handleUpdate}>Save</button>
                    <button className="red-btn" onClick={() => { setEditId(-1); setEditName(""); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="blue-btn" onClick={() => { setEditId(d.id); setEditName(d.name); }}>Edit</button>
                    <button className="red-btn" onClick={() => handleDelete(d.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
