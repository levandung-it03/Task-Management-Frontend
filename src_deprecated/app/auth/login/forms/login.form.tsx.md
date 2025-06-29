```typescript
import GoogleIcon from "../../../../assets/google.icon"

  const [oauth2Enums, setOauth2Enums] = useState<Record<string, string>>({})

  useEffect(() => {
    async function init() {
      const response = await GeneralAPIs.getOauth2ServiceEnums() as RecordResponse
      if (response.status !== 200 || GlobalValidators.isNull(response.body))
        return
      setOauth2Enums(response.body)
    }
    init()
  }, [])

  const handleGoogleLogin = useCallback(() => {
    async function getOauth2Authorizer() {
      const request = DTO_GetOauth2Authorizer.withBuilder().boauth2Service(oauth2Enums.google)
      const response = await LoginAPIs.getOauth2Authorizer(request) as RecordResponse
      if (response.status !== 200 || GlobalValidators.isNull(response.body))
        return

      localStorage.setItem("oauth2Enums", JSON.stringify(oauth2Enums))
      window.location.href = response.body.authorizer
    }
    getOauth2Authorizer()
  }, [oauth2Enums])

  return <>
    <div className="oauth2-btns">
      <button type="button" className="google-btn" onClick={handleGoogleLogin}>
        <GoogleIcon />
      </button>
    </div>
  </>
```