mkdir -p build/src
cp -np package.json README.md default-config.json build/
for file in {*.js,src/*.js}; do
    npx uglifyjs "$file" -c -m  -o "./build/$file" 
    echo minified: "$file" 
done 
