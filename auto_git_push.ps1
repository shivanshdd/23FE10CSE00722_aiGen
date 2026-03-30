$repoUrl = "https://github.com/shivanshdd/NewAggregator.git"

git config --global user.name "shivanshdd"
git config --global user.email "shivanshdhyani02@gmail.com"

if (!(Test-Path ".git")) {
    git init
}

git remote remove origin 2>$null
git remote add origin $repoUrl

git branch -M main

# Initial commit (if needed)
git add .
git commit -m "Initial commit" 2>$null

# Create a dummy file for commits
$dummyFile = "commit_log.txt"

$counter = 1

while ($counter -le 50) {
    Write-Host "Commit $counter"

    Add-Content $dummyFile "Commit number $counter"

    git add $dummyFile
    git commit -m "Auto commit $counter"

    $counter++
}

git push -u origin main