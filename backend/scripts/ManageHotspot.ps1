param([string]$action)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Networking.Connectivity.NetworkInformation, Windows.Networking.Connectivity, ContentType=WindowsRuntime]
$null = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager, Windows.Networking.NetworkOperators, ContentType=WindowsRuntime]

function Get-TetheringManager {
    $connectionProfile = [Windows.Networking.Connectivity.NetworkInformation]::GetInternetConnectionProfile()
    if ($null -eq $connectionProfile) {
        throw "No internet connection profile found."
    }
    return [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile($connectionProfile)
}

try {
    $tetheringManager = Get-TetheringManager

    if ($action -eq "start") {
        if ($tetheringManager.TetheringOperationalState -ne 'On') {
            Write-Host "Starting hotspot..."
            $asyncOp = $tetheringManager.StartTetheringAsync()
            # Wait for completion (basic way for script)
            while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 100 }
            Write-Host "Result: $($asyncOp.Status)"
        } else {
            Write-Host "Hotspot is already On"
        }
    }
    elseif ($action -eq "stop") {
        if ($tetheringManager.TetheringOperationalState -eq 'On') {
            Write-Host "Stopping hotspot..."
            $asyncOp = $tetheringManager.StopTetheringAsync()
            while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 100 }
            Write-Host "Result: $($asyncOp.Status)"
        } else {
            Write-Host "Hotspot is already Off"
        }
    }
    elseif ($action -eq "status") {
        Write-Host "State: $($tetheringManager.TetheringOperationalState)"
        Write-Host "ClientCount: $($tetheringManager.ClientCount)"
    }
    elseif ($action -eq "get-clients") {
        $clients = $tetheringManager.GetClients()
        if ($null -eq $clients) {
            Write-Host "[]"
        } else {
            $clientList = @()
            foreach ($client in $clients) {
                $clientList += @{
                    IPAddress = $client.HostNames[0].ToString()
                    MacAddress = $client.MacAddress
                }
            }
            $clientList | ConvertTo-Json
        }
    }
}
catch {
    if ($action -eq "get-clients") { Write-Host "[]" }
    else {
        Write-Error $_.Exception.Message
        exit 1
    }
}
