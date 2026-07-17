$filePath = "c:\Users\Dell\Documents\Landing page\index.html"
$lines = [System.IO.File]::ReadAllLines($filePath)
$result = [System.Collections.Generic.List[string]]::new()
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -ge 530 -and $i -le 723) { continue }
    $result.Add($lines[$i])
}
[System.IO.File]::WriteAllLines($filePath, $result, [System.Text.Encoding]::UTF8)
Write-Host "Done. Remaining lines: $($result.Count)"
