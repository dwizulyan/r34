## R34 Downloader

Yes, you know what this project do...

#### First thing first

```
npm i -g typescript # if you dont have typescript

git clone https://github.com/dwizulyan/r34.git
cd r34
npm i
```

#### Usage

```
npx tsx ./app.ts --method=update|download --tags=tag
```

`update` method used to update existing folder

`download` method used to download based on tag.

#### Other things

By default the directory for saving downloading image are in `C:/collection/<tag>`

It'll automatically create the folder if not available.

If you want to change the location, go to `setting.ts` and change the `defaultLocation` value to your preference.
