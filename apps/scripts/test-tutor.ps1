function Ask-Tutor {
    param(
        [string]$Question,
        [string]$Url
    )

    $body = @{
        question = $Question
        url      = $Url
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod `
            -Uri "http://localhost:5000/api/chat" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body

        Write-Host "`nAI Tutor:" -ForegroundColor Cyan
        Write-Host $response.data.answer
    }
    catch {
        Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    }
}


# Get the learning material URL once
$url = Read-Host "Hi Victory! Enter the URL of the learning material you want to study or research: "

Write-Host "`nAI Tutor is ready!" -ForegroundColor Green
Write-Host "Ask questions about the material. Type 'exit' to quit.`n"


# Continuous chat
while ($true) {

    $question = Read-Host "You"

    if ($question -eq "exit") {
        Write-Host "`nGoodbye Victory! Feel free to come back anytime you have more questions!" -ForegroundColor Yellow
        break
    }

    if ([string]::IsNullOrWhiteSpace($question)) {
        continue
    }

    Ask-Tutor -Question $question -Url $url
}