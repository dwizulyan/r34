## R34 Downloader

Yes, you know what this project do...

#### First thing first

```sh
npm i -g typescript # if you dont have typescript

# clone the project
git clone https://github.com/dwizulyan/r34.git
cd r34
npm i
```

#### Usage

```sh
# direct
npx tsx ./app.ts [download | update | setting] [tags]

# or you can interact with the app
npx tsx ./app.ts
```

`update` method used to update existing folder

`download` method used to download based on tag.

`setting` modify basic settings.

note : `tags` are optional, if not filled you wll be prompted.

#### Other things

By default the directory for saving downloading image are in `C:/collection/<tag>`

It'll automatically create the folder if not available.

You can change the location by modifying it in setting menu.
