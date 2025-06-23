
'use client';

import { RecordResponse } from '@/apis/general.api';
import { LoginAPIs } from '@/apis/login.page.api';
import { DTO_Oauth2Authenticate } from '@/dtos/general.dto';
import { AuthHelper } from '@/util/auth.helper';
import GlobalValidators from '@/util/global.validators';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

interface CallbackPageProps {
  serviceName: string
}

export default function CallbackPage({ serviceName }: CallbackPageProps) {
  const router = useRouter()

  useEffect(() => {
    async function authenticate() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      window.history.replaceState(null, '', window.location.pathname);

      if (GlobalValidators.isEmpty(code) || GlobalValidators.notEmpty(error)) {
        router.push("/auth/login")
        return
      }
      
      const oauth2Enums: string | null = localStorage.getItem("oauth2Enums")
      if (oauth2Enums === null) {
        router.push("/auth/login")
        return
      }
      const oauth2Services = JSON.parse(oauth2Enums)
      const request = DTO_Oauth2Authenticate.withBuilder().bcode(code!).boauth2Service(oauth2Services[serviceName])
      const response = await LoginAPIs.oauth2Authenticate(request) as RecordResponse
      if (response.status !== 200 || GlobalValidators.isNull(response.body)) {
        router.push("/auth/login")
        return
      }
      toast.success(response.msg)
      AuthHelper.saveAccessTokenIntoCookie(response.body.accessToken)
      AuthHelper.saveRefreshTokenIntoCookie(response.body.refreshToken)
      const role = AuthHelper.getRoleFromToken().toUpperCase()
      window.location.href = role.includes("ADMIN") ? "/admin/dashboard" : "/user/home"
    }
    authenticate()
  }, [router, serviceName])

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
      <h1 style={{
        fontSize: "30px",
        color: "var(--blue-in-env)",
      }}>
        Authorizing By {serviceName[0].toUpperCase() + serviceName.slice(1)}...
      </h1>
    </div>
  );
}
