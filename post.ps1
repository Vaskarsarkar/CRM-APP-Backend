try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/crm/api/v1/auth/signup" -Method POST -ContentType "application/json" -Body '{"name":"Alice","userId":"alice","email":"alice@test.com","password":"alicepass"}'
    Write-Host "Status: $($r.StatusCode)"
    Write-Host "Body: $($r.Content)"
} catch {
    $r = $_.Exception.Response
    if ($r) {
        Write-Host "Status: $($r.StatusCode)"
        Write-Host "Body: $([System.IO.StreamReader]::new($r.GetResponseStream()).ReadToEnd())"
    } else {
        Write-Host "Error: $($_.Exception.Message)"
    }
}