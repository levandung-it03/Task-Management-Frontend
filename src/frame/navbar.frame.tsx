'use client'

import LucideMoon from '@/assets/moon.icon';
import { AuthHelper } from '@/util/auth.helper';
import GlobalValidators from '@/util/global.validators';
import { ArrowLeftToLine, ArrowRightToLine, Files, Ghost, House, LayoutDashboard, Lightbulb, LogOut, Settings, SquareUserRound, Users } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import "./styles/navbar.frame.scss"
import { DTO_Token } from '@/dtos/general.dto';
import { GeneralAPIs, RecordResponse } from '@/apis/general.api';
import toast from 'react-hot-toast';

interface NavbarComponentProps {
  lightMode: string;
  setLightMode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Navbar({ lightMode, setLightMode }: NavbarComponentProps) {
  const settingsRef = useRef<HTMLDivElement>(null)
  const [collapse, setCollapse] = useState<boolean>(false)
  const [role, setRole] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [virtualAva, setVirtualAva] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    setCollapse(localStorage.getItem("nav") === "true" || false)

    setRole(AuthHelper.getRoleFromToken());
    const token: string | undefined = AuthHelper.getAccessTokenFromCookie()
    if (token === undefined)
      return

    try {
      const claims: Record<string, string> = AuthHelper.extractToken(token)
      setVirtualAva(claims.OWNER[0].toUpperCase())
      setFullName(claims.OWNER)
      setEmail(claims.sub)
    } catch {
      AuthHelper.endClientSession()
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node))
        setShowSettings(false);
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []);

  const toggleLightMode = useCallback(() => {
    setLightMode(prev => {
      const lights: string = (GlobalValidators.isEmpty(prev) ? "dark" : "")
      localStorage.setItem("lights", lights)
      return lights
    })
  }, [setLightMode])

  const toggleShowSettings = useCallback(() => {
    setShowSettings(prev => !prev)
  }, [])

  const toggleCollapseNav = useCallback(() => {
    setCollapse(prev => {
      const val: boolean = !prev
      localStorage.setItem("nav", val + "")
      return val
    })

  }, [])

  const navBarItems: {
    admin: Record<string, ReactNode>,
    user: Record<string, ReactNode>,
  } = {
    admin: {
      dashboard: <><LayoutDashboard className="nav-item-icon" /><span className="nav-item-name"> Dashboard</span></>,
      ["manage-users"]: <><Users className="nav-item-icon" /><span className="nav-item-name"> Manage Users</span></>,
      reports: <><Files className="nav-item-icon" /><span className="nav-item-name"> Reports</span></>,
    },
    user: {
      home: <><House className="nav-item-icon" /><span className="nav-item-name"> Home</span></>,
    }
  };

  const clickLogout = useCallback(() => {
    async function logout() {
      const token: string | undefined = AuthHelper.getAccessTokenFromCookie()
      if (token === undefined) {
        AuthHelper.endClientSession()
        return
      }

      const request = DTO_Token.withBuilder().baccessToken(token)
      const logoutRes = await GeneralAPIs.logout(request) as RecordResponse
      if (logoutRes.status === 200) {
        toast.success(logoutRes.msg)
      }
      AuthHelper.endClientSession()
    }
    logout()
  }, [])

  if (GlobalValidators.isNull(role) || role === 'auth')
    return null;

  return (
    <nav className={"main-nav-bar" + (collapse ? " nav-collapse" : "")}>
      <div className="app-logo">
        <Ghost className="app-logo-icon" />
        <span className="app-name">VN Ghosts</span>
      </div>
      <ul className="item-container">
        {Object.entries(navBarItems[role as keyof typeof navBarItems]).map(([key, item], index) => (
          <li key={'nav-bar-' + key + index} className="nav-bar-item">
            <a className="nav-item-wrapper" href={`/${role}/${key}`}>{item}</a>
          </li>
        ))}
      </ul>
      <div className="user-tools">
        <i className="nav-tools-divider"></i>
        <button type="button" className="light-mode nav-bar-item" onClick={toggleLightMode}>
          <div className="nav-item-wrapper">
            {GlobalValidators.notEmpty(lightMode)
              ? <><Lightbulb className="nav-item-icon" /><span className="nav-item-name"> Lights On</span></>
              : <><LucideMoon className="nav-item-icon" /><span className="nav-item-name"> Off Lights</span></>}
          </div>
        </button>
        <button type="button" className="tools-toggle-open-btn nav-bar-item" onClick={toggleShowSettings}>
          <div className="nav-item-wrapper">
            <Settings className="nav-item-icon" />
            <span className="nav-item-name"> Settings</span>
          </div>
        </button>
        <button className="nav-collapse-btn nav-bar-item" type="button" onClick={toggleCollapseNav}>
          <div className="nav-item-wrapper">
            {collapse
              ? <ArrowRightToLine className="nav-item-icon" />
              : <><ArrowLeftToLine className="nav-item-icon" /><span className="nav-item-name"> Collpase</span></>}
          </div>
        </button>

        <div ref={settingsRef} className={`tools-container${showSettings ? "" : " hidden"}`}>
          <button className="user-profile nav-bar-item">
            <span className="user-avatar">{virtualAva}</span>
            <div className="user-basic-info">
              <div className="main-info">
                <b className="user-full-name">{fullName}</b>
                <span className="user-role">{role}</span>
              </div>
              <i className="user-email">{email}</i>
            </div>
          </button>
          <i className="nav-tools-divider"></i>
          <a className="nav-bar-item" href={`/${role}/user-info`}>
            <div className="nav-item-wrapper">
              <SquareUserRound className="nav-item-icon" />
              <span className="nav-item-name"> Your Information</span>
            </div>
          </a>
          <button type="button" className="light-mode nav-bar-item" onClick={clickLogout}>
            <div className="nav-item-wrapper nav-last-item-wrapper">
              <LogOut className="nav-item-icon" />
              <span className="nav-item-name"> Logout</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}
