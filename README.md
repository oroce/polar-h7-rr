polar-h7-rr
======

Recently I've been to a running lab where they were analyzing my running/body capabilities and it turned they are using couple of pretty commonly available (mainstream) stuff for this. They were analyzing my skills by putting me into a treadmill and I had to run while I was wearing a chest strap HR sensor. The software they used to analyze my results was [Kubios](http://kubios.uef.fi/). It's a free software developed by the University of Finland.

I already had a Polar H7 chest strap and as [it turned out](http://www.marcoaltini.com/blog/heart-rate-variability) it's one of the best chest straps for doing HRV analysis.

So all the things I needed is putting together a small app which is capable of getting the RR information from my polar and exporting it into a format which can be fed to Kubios.

To my luck [@sander](http://github.com/sander) already did the heavy part by making [lub-dub](https://github.com/sander/lub-dub).

Furthermore I tuned the app to be able to simulate a real life test, you just need to start the app and it'll say what's going on.

# Example

```
polar-h7-rr\
  --initial-delay 5\
  --breakpoints 30s,40s\
  --length 50s\
  --output my-data.csv\
  --uuid f8ccdd4ee826483493d38f6a4fd9aa57
```

# Parameters

## `--initial-delay`

The initial delay before we start measuring in seconds (or use human readable durations, like 1m, 2m20s, etc). It can be handy if you want to lay down on your couch during the test. (the app will announce when the test has been started)

## `--breakpoints`

When we should announce at where we are as a comma separated list in seconds (or use human readable durations, like 1m, 2m20s, etc)

If you set it to `20s,1m,2m`, then we will announce at 20th second that we are at the 20th second and so on.

Omit if you don't want announcements.

## `--length`

How long we should measure the RR values in seconds. Or you can use human readable duration as well, like 5m, or 1m20s.

## `--output`

The output file, where we should put the csv. You can set it to `-`, and we will write the output to the stdout.
## `--uuid`

The uuid of the Polar H7. If you are unsure about your device's uuid, just start the basic example of noble, it will you print it out or run this:

```
node -e "var n=require('noble'); n.on('discover',function(p){console.log(p.advertisement.localName, p.id)}).on('stateChange',function(){n.startScanning()})"
```

# Debugging

You can turn on debugging by setting `DEBUG` environment variable to `polar-h7-rr` or if you wanna dig into noble's life feel free to set it to `DEBUG=noble*` or just `DEBUG=*`.

# License

MIT
