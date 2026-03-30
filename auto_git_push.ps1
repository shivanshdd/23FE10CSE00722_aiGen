$repoUrl = "https://github.com/shivanshdd/NewAggregator.git"

git config --global user.name "shivanshdd"
git config --global user.email "shivanshdhyani02@gmail.com"

if (!(Test-Path ".git")) {
    git init
}

git remote remove origin 2>$null
git remote add origin $repoUrl

git branch -M main

git add .
git commit -m "Initial commit" 2>$null

$dummyFile = "commit_log.txt"

for ($i = 1; $i -le 50; $i++) {
    Add-Content $dummyFile "Commit $i"
    git add $dummyFile
    git commit -m "Auto commit $i"
}

# 🔥 FORCE PUSH
git push -u origin main --force