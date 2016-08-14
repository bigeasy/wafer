## Typed Log Lines

Log line looking serialization that preserves type for use in your JavaScript
programs.

```javascript
Wafer.serialize({
    name: 'mutate'
    sequence: 1,
    tag: [ 'database', 'insert' ],
    status: { workers: 24, locks: 3 },
    query: 'upsert("user", 1)\nwhere user = 1;',
    json: { keys: [ 'user', 1 ] }
})
```

Becomes.

```text
name=mutate; n sequence=1; 2 tag=database;, tag=insert; n status.workers=24; ↵
    n status.locks=3; query=upsert("user", 1)%0awhere user %40 1%30; json={"keys":["user",1]}
```

Semi-colon delimited and minimally URL encoded. A bit of cruft to preseve the
type information, but still human readable. UNIX tool chain eats it up.

```console
 % egrep ' name=mutate;' out.log
```

## Motivation

Streaming JSON is a fine format for to write the logs. With Node.js close at
hand you can usually find what you're looking for in line after line of JSON.
You can also use `jq` to &mdash; the `awk` of JSON &mdash; to find what you're
looking for.

Logging JSON to `syslog` however, is horrible way to live. I created Wafer to
flatten out a JSON object just enough to make easy to search using tools
designed for `syslog` analysis.

With Wafer it's easy to craft regular expressions such to match log lines such
as `/ level=error;/`. Yes, this is also simple enough against JSON if you're
using JavaScript regular expressions. You'd simply say `/"level":"error"/`. Not
really that much harder at all.

Here's where it gets harder. I ran into a logging database that wanted to match
strings supplied as double quoted strings. I found myself writing out queries
with a lot of backticks. The above query aganst JSON would be expressed
as `"\\\"statusCode\\\":\\\"error\\\""`. Against Wafer the query is
`" level=error;"`.

That's why this library exists. It's supposed to be easy to search with standard
regular expression tools. It's supposed to be easier for a human to read than
JSON. Let me know if you find a use for it.

## Type Annotations, Sigils and Other Dingbats

Theres a bit of cruft in a line of Wafer used to preserve type information. You
can see that sequence is a number, so it is annotated with `n`. `tag` is an
array, so it's first element is annotated with the array length, subsequent
elements are delimiated by a semi-colon followed by a comma.

```text
name=mutate; n sequence=1; 2 tag=database;, tag=insert; n status.workers=24; ↵
    n status.locks=3; query=upsert("user", 1)%0awhere user %40 1%30; json={"keys":["user",1]}
```

## Winnow versus Pinpoint

I find there's a difference between the data I want to search and the data I
want to see. The cursory searches that winnow zillions of log lines down to
relevant log lines are different from the extraction of specific log lines from
relevant log lines.

The tool I'm using will pattern match quickly using string match patterns. From
there you can parse JSON to get more details. However if you have to parse JSON
to extract feilds to search across the entire corpus, well, that's slow.

This is why Wafer is designed to have some fields flat and some fields bundled
up. (What I can probably do is work up some AWK + `jq` queries to how how they
might work together.)

## Deeply Nested Nonsense

The readability of Wafer breaks down when you nest too deeply, but it still
works for any depth. It is essentially a write log.

```javascript
Wafer.serialize({
    object: {
        array: [ 'one', 2, { key: [ 'value' ] }, { one: 1 }, [ 'four' ], 'five' ]
    }
})
```

Becomes.

```text
4 object.array; object.array=one;, n object.array=2;, object.array.key=value;,
    n object.array.one=1;, 1 object.array=four;, object.array=five
```

Basically, arrays nested in objects ruin everything. If you really want to dump
a blob of data dump it as JSON using the `json` property. This property is
serialized as JSON. You'll have the data if you need it.
