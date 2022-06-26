dt=$(date '+%d/%m/%Y %H:%M:%S');
echo "Build Started: $dt"

npm run build

cp dist/js/app.js ext/app.js
cp dist/css/app.css ext/app.css

dt=$(date '+%d/%m/%Y %H:%M:%S');
echo "Build Completed: $dt"