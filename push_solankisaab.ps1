$repoUrl = "https://github.com/shivanshdd/23FE10CSE00722_aiGen.git"

git config --local user.name "solankisaab"
git config --local user.email "solankisaab@users.noreply.github.com"

git remote remove origin 2>$null
git remote add origin $repoUrl
git branch -M main

$dummyFile = "commit_history_solankisaab.txt"
$startDate = Get-Date -Year 2026 -Month 3 -Day 15 -Hour 12 -Minute 0 -Second 0

for ($i = 1; $i -le 10; $i++) {
    $date = $startDate.AddDays($i * 1.5).ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    
    Add-Content $dummyFile "Auto commit $i by solankisaab on $date`n"
    git add $dummyFile
    git commit -m "docs: solankisaab automated update $i" 2>$null
}

Remove-Item Env:\GIT_AUTHOR_DATE 2>$null
Remove-Item Env:\GIT_COMMITTER_DATE 2>$null

git config --local user.name "shivanshdd"
git config --local user.email "shivanshdhyani02@gmail.com"

git push -u origin main
