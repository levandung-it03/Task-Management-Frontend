import UsersTable from "./users-table/users.table";
import "./page.scss"

export default function ManageUsers() {
  return (
    <div className="main-manage-users">
      <UsersTable />
    </div>
  )
}