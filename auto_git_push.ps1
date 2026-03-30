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
git commit -m "Initial commit"

$files = Get-ChildItem -File -Recurse

$counter = 1

foreach ($f in $files) {
    Add-Content $f.FullName "`n# update $counter"
    git add "$($f.FullName)"
    git commit -m "Commit $counter"
    $counter = $counter + 1
}

git push -u origin main
# update 2
